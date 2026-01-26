/**
 * Colour Combo Game Module
 * An idle clicker game where you earn currency from combos and purchase autoclickers
 */

window.ColourComboGame = (function() {
    // Game state
    let comboCount = 0;
    let lastComboColor = null;
    let audioContext = null;
    let comboGameEnabled = false;
    let highestCombo = 0;
    let comboStats = {}; // Track how many times each combo level was achieved
    let devMode = false; // Dev mode for testing combos
    let devForceMatches = false; // Dev mode: force all matches to succeed
    let comboPoints = 0; // Currency earned from combos
    let totalCombosEarned = 0; // Total combos completed
    let comboMultiplier = 1; // Total multiplier from upgrades
    let lastNoteTime = 0; // Track last note play time for arpeggio effect
    let comboDisplayShowing = false; // Track if combo display is currently visible
    let incomeHistory = []; // Track recent income for $/sec calculation
    let lastIncomeTime = Date.now(); // Last time we earned currency
    let earlyGameCompleted = false; // Track if early game completion jingle has played
    let actualActionsProcessed = 0; // Track actual actions processed
    let actionsLastSecond = 0; // Actions processed in last second
    let lastActionsResetTime = Date.now(); // Last time we reset the action counter
    let pendingVisualUpdates = false; // Flag for batched visual updates
    let autoclickerRAF = null; // Single RAF loop for all autoclickers
    let soundsMuted = false; // Track if sound effects are muted
    let shakeEnabled = true; // Track if shake effect is enabled

    // Expanded number abbreviation system (abbreviate at 1 million and above)
    const ABBREVIATIONS = [
        { value: 1e66, symbol: 'Uvg' },
        { value: 1e63, symbol: 'Vg' },
        { value: 1e60, symbol: 'Nod' },
        { value: 1e57, symbol: 'Ocd' },
        { value: 1e54, symbol: 'Spd' },
        { value: 1e51, symbol: 'Sxd' },
        { value: 1e48, symbol: 'Qid' },
        { value: 1e45, symbol: 'Qad' },
        { value: 1e42, symbol: 'Td' },
        { value: 1e39, symbol: 'Dd' },
        { value: 1e36, symbol: 'Ud' },
        { value: 1e33, symbol: 'Dc' },
        { value: 1e30, symbol: 'No' },
        { value: 1e27, symbol: 'Oc' },
        { value: 1e24, symbol: 'Sp' },
        { value: 1e21, symbol: 'Sx' },
        { value: 1e18, symbol: 'Qi' },
        { value: 1e15, symbol: 'Qa' },
        { value: 1e12, symbol: 'T' },
        { value: 1e9, symbol: 'B' },
        { value: 1e6, symbol: 'M' }
    ];

    function formatNumber(num) {
        if (num < 1e6) {
            return '$' + num.toLocaleString();
        }
        for (let i = 0; i < ABBREVIATIONS.length; i++) {
            if (num >= ABBREVIATIONS[i].value) {
                return '$' + (num / ABBREVIATIONS[i].value).toFixed(2).replace(/\.00$/, '').replace(/\.0$/, '') + ABBREVIATIONS[i].symbol;
            }
        }
        return '$' + num.toLocaleString();
    }

    // Compact format for stats page (abbreviates at 1 million)
    function formatCurrencyCompact(num) {
        if (num < 1e6) {
            return '$' + num.toLocaleString();
        }
        for (let i = 0; i < ABBREVIATIONS.length; i++) {
            if (num >= ABBREVIATIONS[i].value) {
                return '$' + (num / ABBREVIATIONS[i].value).toFixed(2).replace(/\.00$/, '').replace(/\.0$/, '') + ABBREVIATIONS[i].symbol;
            }
        }
        return '$' + num.toLocaleString();
    }

    // Calculate actions per second from autoclickers (intended rate)
    function calculateActionsPerSecond() {
        let actionsPerSecond = 0;
        shopItems.filter(item => item.type === 'clicker').forEach(item => {
            if (item.owned > 0) {
                // Each clicker generates (1000 / interval) actions per second
                actionsPerSecond += item.owned * (1000 / item.interval);
            }
        });
        return actionsPerSecond;
    }

    // Get actual actions processed per second (measured)
    function getActualActionsPerSecond() {
        return actionsLastSecond;
    }

    // Calculate average income per second
    function calculateIncomePerSecond() {
        if (incomeHistory.length === 0) return 0;
        
        const now = Date.now();
        // Keep only last 10 seconds of history
        incomeHistory = incomeHistory.filter(entry => now - entry.time < 10000);
        
        if (incomeHistory.length === 0) return 0;
        
        const totalIncome = incomeHistory.reduce((sum, entry) => sum + entry.amount, 0);
        const timeSpan = (now - incomeHistory[0].time) / 1000; // in seconds
        
        return timeSpan > 0 ? totalIncome / timeSpan : 0;
    }

    // Track income for rate calculation
    function trackIncome(amount) {
        incomeHistory.push({ time: Date.now(), amount });
    }
    
    // Shop items - new 3-upgrade system
    let shopItems = [
        {
            id: 'auto-clicker',
            name: 'Auto Clicker',
            description: 'Adds 1 automatic clicker',
            type: 'clicker',
            baseCost: 10,
            costMultiplier: 1.15,
            owned: 0,
            interval: 1000, // 1 second = 1 action/sec
            timers: [],
            nextFireTime: 0
        },
        {
            id: 'luck-upgrade',
            name: 'Luck Upgrade',
            description: 'Adds 0.1% luck to all auto clickers',
            type: 'luck',
            baseCost: 100,
            costMultiplier: 1.116,
            owned: 0,
            luckPerUpgrade: 0.001, // 0.1% per upgrade
            maxOwned: 300, // 100 per stage (10% luck per stage)
            stageThresholds: [100, 200, 300], // Max owned at each stage
            stageRequirements: [0, 100, 150] // Actions/sec required for each stage
        },
        {
            id: 'combo-multiplier',
            name: 'Combo Multiplier',
            description: 'Multiplies all combo rewards',
            type: 'multiplier',
            baseCost: 10000,
            costMultiplier: 1.995,
            owned: 0,
            multiplierValues: [
                2, 3, 4, 5, 5, 6, 6, 7, 7, 10, // Stage 1: 0-9 (50x total)
                10, 10, 11, 11, 12, 12, 13, 13, 14, 15, // Stage 2: 10-19 (+111x = 161x total)
                15, 15, 16, 16, 17, 17, 18, 18, 19, 20  // Stage 3: 20-29 (+151x = 312x total)
            ],
            stageThresholds: [10, 20, 30], // Max owned at each stage
            stageRequirements: [0, 100, 150] // Actions/sec required for each stage
        }
    ];
    
    // Calculate combo value based on rarity (inversely proportional to probability)
    // Values are balanced so rarer combos give exponentially more reward
    function getComboValue(comboLevel) {
        if (comboLevel < 2) return 0;
        
        // Base probabilities at 0% luck (1/3 chance per match):
        // x2: 33.33% -> 1 point
        // x3: 11.11% -> 3 points
        // x4: 3.70% -> 9 points
        // x5: 1.23% -> 27 points
        // x6: 0.41% -> 81 points
        // x7: 0.137% -> 243 points
        // x8: 0.046% -> 729 points
        // x9: 0.015% -> 2,187 points
        // x10: 0.005% -> 6,561 points
        // x11+: continues exponentially
        
        return Math.pow(3, comboLevel - 2);
    }
    
    // Calculate current cost of an item
    function getItemCost(item) {
        if (item.type === 'multiplier') {
            // Check if we've reached the max multipliers
            if (item.owned >= item.multiplierValues.length) {
                return Infinity;
            }
        }
        if (item.type === 'luck' && item.maxOwned !== undefined) {
            // Check if we've reached max luck upgrades
            if (item.owned >= item.maxOwned) {
                return Infinity;
            }
        }
        return Math.floor(item.baseCost * Math.pow(item.costMultiplier, item.owned));
    }
    
    // Get the current stage limit for an item
    function getCurrentStageLimit(item) {
        if (!item.stageThresholds || !item.stageRequirements) {
            return item.maxOwned || item.multiplierValues?.length || Infinity;
        }
        
        const actionsPerSec = calculateActionsPerSecond();
        let currentLimit = 0;
        
        for (let i = 0; i < item.stageRequirements.length; i++) {
            if (actionsPerSec >= item.stageRequirements[i]) {
                currentLimit = item.stageThresholds[i];
            }
        }
        
        return currentLimit;
    }
    
    // Check if item is at current stage limit
    function isAtStageLimit(item) {
        const currentLimit = getCurrentStageLimit(item);
        return item.owned >= currentLimit;
    }
    
    // Get next stage requirement text
    function getNextStageRequirement(item) {
        if (!item.stageThresholds || !item.stageRequirements) {
            return null;
        }
        
        const actionsPerSec = calculateActionsPerSecond();
        
        for (let i = 0; i < item.stageRequirements.length; i++) {
            if (actionsPerSec < item.stageRequirements[i]) {
                return {
                    required: item.stageRequirements[i],
                    limit: item.stageThresholds[i]
                };
            }
        }
        
        return null;
    }

    // Play early game completion jingle
    async function playEarlyGameCompletionJingle() {
        if (!audioContext) return;
        
        const ctx = audioContext;
        const now = ctx.currentTime;
        
        // Notes: C4-D4-F4-C5-F4-D4-C4
        const notes = [
            261.63, // C4
            293.66, // D4
            349.23, // F4
            523.25, // C5
            349.23, // F4
            293.66, // D4
            261.63  // C4
        ];
        
        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            const startTime = now + (index * 0.15);
            const endTime = startTime + 0.15;
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
            
            osc.start(startTime);
            osc.stop(endTime);
        });
    }

    // Check if player has completed early game (100 actions/sec)
    function isEarlyGameComplete() {
        return calculateActionsPerSecond() >= 100;
    }
    
    // Check if item requirements are met
    function meetsRequirements(item) {
        if (item.requiresEarlyGameComplete) {
            return isEarlyGameComplete();
        }
        // Check if at stage limit
        if (isAtStageLimit(item)) {
            return false;
        }
        return true;
    }
    
    // Calculate total multiplier from purchased multiplier upgrades
    function calculateTotalMultiplier() {
        const multiplierItem = shopItems.find(i => i.type === 'multiplier');
        if (!multiplierItem || multiplierItem.owned === 0) {
            comboMultiplier = 1;
            return 1;
        }
        
        // Add multipliers together instead of compounding them
        let total = 1;
        const maxIndex = multiplierItem.multiplierValues.length - 1;
        for (let i = 0; i < multiplierItem.owned; i++) {
            if (i < multiplierItem.multiplierValues.length) {
                total += multiplierItem.multiplierValues[i];
            } else {
                total += multiplierItem.multiplierValues[maxIndex]; // repeat last increment
            }
        }
        comboMultiplier = total;
        return total;
    }

    // Calculate the odds of achieving a specific combo length
    function calculateComboOdds(comboLength) {
        if (comboLength < 2) return 100;

        // Get total luck from luck upgrades
        const luckItem = shopItems.find(i => i.type === 'luck');
        const totalLuck = luckItem ? luckItem.owned * luckItem.luckPerUpgrade : 0;

        // Effective match chance calculation:
        // P(match) = P(natural match) + P(no natural match) × P(luck triggers)
        // = 1/3 + (2/3) × totalLuck
        const effectiveChance = (1/3) + ((2/3) * totalLuck);

        // For 2x combo, odds should be just the effectiveChance, not squared
        let odds;
        if (comboLength === 2) {
            odds = effectiveChance * 100;
        } else {
            // Need (comboLength - 1) consecutive matches
            odds = Math.pow(effectiveChance, comboLength - 1) * 100;
        }
        return odds;
    }
    
    // Format odds text with progressive decimal places for low probabilities
    function formatOddsText(odds, comboLevel, asFraction = false) {
        if (asFraction) {
            // Convert percent odds to 1/x odds
            if (odds <= 0) return 'Impossible';
            const frac = 100 / odds;
            // Use formatNumber for abbreviation (K, M, B, etc)
            let formatted;
            if (frac >= 1000000) {
                formatted = formatNumber(Math.round(frac)).replace('$', '');
            } else if (frac >= 100) {
                formatted = Math.round(frac).toLocaleString();
            } else {
                formatted = frac.toFixed(2);
            }
            return `1 in ${formatted}`;
        }
        // Starting at 14x, show more decimal places for very low odds
        if (comboLevel >= 14) {
            let decimalPlaces = 4 + Math.max(0, (comboLevel - 13) * 2);
            decimalPlaces = Math.min(decimalPlaces, 20);
            return odds.toExponential(decimalPlaces) + '%';
        }
        // For combos below 14x, use standard 4 decimal places
        return odds >= 0.0001 ? odds.toFixed(4) + '%' : '<0.0001%';
    }
    
    // Flash a random album with the selected color (throttled to max 60fps)
    let lastFlashTime = 0;
    let pendingFlashColor = null;
    
    function flashRandomAlbum(colorClass) {
        // Store the color but throttle the actual DOM update
        pendingFlashColor = colorClass;
        pendingVisualUpdates = true;
    }
    
    // Actual flash implementation (called once per frame max)
    function performFlash() {
        if (!pendingFlashColor) return;
        
        const albums = document.querySelectorAll('.album');
        if (albums.length === 0) return;
        
        // Pick a random album to flash
        const randomAlbum = albums[Math.floor(Math.random() * albums.length)];
        
        // Remove any existing color classes
        randomAlbum.classList.remove('color-red', 'color-green', 'color-blue');
        
        // Add the new color class
        randomAlbum.classList.add(pendingFlashColor);
        
        // Remove the color after a short duration (200ms)
        setTimeout(() => {
            randomAlbum.classList.remove(pendingFlashColor);
        }, 200);
        
        pendingFlashColor = null;
    }
    
    // Simulate an automatic album hover (optimized for batch processing)
    function simulateHover(skipVisuals = false) {
        if (!comboGameEnabled) return;
        
        // Track action count
        actualActionsProcessed++;
        
        const colors = ['color-red', 'color-green', 'color-blue'];
        
        // True 1/3 chance to match the last color
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Apply global luck bonus from luck upgrades
        const luckItem = shopItems.find(i => i.type === 'luck');
        const totalLuck = luckItem ? luckItem.owned * luckItem.luckPerUpgrade : 0;
        const luckRoll = Math.random();
        if (totalLuck > 0 && luckRoll < totalLuck && lastComboColor) {
            // Force the color to match for a lucky hit!
            randomColor = lastComboColor;
        }
        
        // Flash a random album with the chosen color (throttled)
        if (!skipVisuals) {
            flashRandomAlbum(randomColor);
        }
        
        // Initialize lastComboColor if this is the first interaction
        if (!lastComboColor) {
            lastComboColor = randomColor;
            comboCount = 1;
            pendingVisualUpdates = true;
            return;
        }
        
        // Check if color matches (or dev force matches)
        if (lastComboColor === randomColor || devForceMatches) {
            comboCount++;
            if (comboCount >= 3 && !skipVisuals) {
                showComboPopup(comboCount, randomColor);
            }
        } else {
            // Award currency when combo breaks
            if (comboCount >= 2) {
                const baseValue = getComboValue(comboCount);
                const value = Math.floor(baseValue * comboMultiplier);
                comboPoints += value;
                trackIncome(value);
                totalCombosEarned++;
                comboStats[comboCount] = (comboStats[comboCount] || 0) + 1;
                
                // Play special sound based on combo achieved (throttled)
                if (!skipVisuals && !soundsMuted) {
                    if (comboCount >= 10) {
                        const godlikeAudio = new Audio('./assets/audio/godlike.mp3');
                        godlikeAudio.volume = 1.0;
                        godlikeAudio.play().catch(e => console.log('Failed to play godlike sound:', e));
                    } else if (comboCount === 9) {
                        const holyShitAudio = new Audio('./assets/audio/holyshit.mp3');
                        holyShitAudio.volume = 1.0;
                        holyShitAudio.play().catch(e => console.log('Failed to play holy shit sound:', e));
                    }
                }
                
                // Save less frequently (every 10th combo or high combos)
                if (totalCombosEarned % 10 === 0 || comboCount >= 8) {
                    saveGameData();
                }
            }
            comboCount = 1;
            lastComboColor = randomColor;
        }
        
        pendingVisualUpdates = true;
    }
    
    // Start the unified autoclicker system (single RAF loop for all clickers)
    function startAutoclickerSystem() {
        // Stop existing RAF loop if running
        if (autoclickerRAF) {
            cancelAnimationFrame(autoclickerRAF);
        }
        
        let lastFrameTime = performance.now();
        
        function autoclickerLoop(currentTime) {
            if (!comboGameEnabled) return;
            
            const deltaTime = currentTime - lastFrameTime;
            lastFrameTime = currentTime;
            
            // Process each autoclicker item
            shopItems.filter(item => item.type === 'clicker' && item.owned > 0).forEach(item => {
                // Calculate how many actions should fire this frame
                const actionsPerMs = item.owned / item.interval;
                const actionsDue = actionsPerMs * deltaTime;
                
                // Accumulate fractional actions
                if (!item.accumulatedActions) item.accumulatedActions = 0;
                item.accumulatedActions += actionsDue;
                
                // Process whole actions, skip visuals for all but one per frame
                let actionsToProcess = Math.floor(item.accumulatedActions);
                item.accumulatedActions -= actionsToProcess;
                
                // Process actions (only show visuals for first action per frame)
                for (let i = 0; i < actionsToProcess; i++) {
                    simulateHover(i > 0); // Skip visuals for all but first
                }
            });
            
            // Batch all visual updates once per frame
            if (pendingVisualUpdates) {
                performFlash();
                updateComboDisplay();
                pendingVisualUpdates = false;
            }
            
            // Track actual actions per second
            const now = Date.now();
            if (now - lastActionsResetTime >= 1000) {
                actionsLastSecond = actualActionsProcessed;
                actualActionsProcessed = 0;
                lastActionsResetTime = now;
            }
            
            autoclickerRAF = requestAnimationFrame(autoclickerLoop);
        }
        
        autoclickerRAF = requestAnimationFrame(autoclickerLoop);
    }
    
    // Legacy function kept for compatibility
    function startAutoclicker(item) {
        if (item.owned === 0 || item.type !== 'clicker') return;
        
        // Initialize accumulator for this item
        if (!item.accumulatedActions) {
            item.accumulatedActions = 0;
        }
        
        // Restart the unified system
        startAutoclickerSystem();
    }
    
    // Save game data to localStorage
    function saveGameData() {
        try {
            const saveData = {
                comboStats,
                highestCombo,
                comboPoints,
                totalCombosEarned,
                earlyGameCompleted,
                soundsMuted,
                shakeEnabled,
                devForceMatches,
                shopItems: shopItems.map(item => ({
                    id: item.id,
                    owned: item.owned
                }))
            };
            localStorage.setItem('msr-game-data', JSON.stringify(saveData));
        } catch (e) {
            console.log('Failed to save game data:', e);
        }
    }

    // Load game data from localStorage
    function loadGameData() {
        try {
            const savedData = localStorage.getItem('msr-game-data');
            if (savedData) {
                const data = JSON.parse(savedData);
                comboStats = data.comboStats || {};
                highestCombo = data.highestCombo || 0;
                comboPoints = data.comboPoints || 0;
                totalCombosEarned = data.totalCombosEarned || 0;
                earlyGameCompleted = data.earlyGameCompleted || false;
                soundsMuted = data.soundsMuted || false;
                shakeEnabled = typeof data.shakeEnabled === 'boolean' ? data.shakeEnabled : true;
                devForceMatches = data.devForceMatches || false;
                
                // Restore shop items
                if (data.shopItems) {
                    let hasClickers = false;
                    data.shopItems.forEach(savedItem => {
                        const item = shopItems.find(i => i.id === savedItem.id);
                        if (item) {
                            item.owned = savedItem.owned;
                            if (item.type === 'clicker' && item.owned > 0) {
                                hasClickers = true;
                                item.accumulatedActions = 0;
                            }
                        }
                    });
                    calculateTotalMultiplier();
                    
                    // Start unified autoclicker system if any clickers exist
                    if (hasClickers) {
                        startAutoclickerSystem();
                    }
                }
            }
        } catch (e) {
            console.log('Failed to load game data:', e);
        }
    }

    // Initialize audio context on first user interaction
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }

    // Screen shake effect
    function shakeScreen(comboCount) {
        if (!shakeEnabled) return;
        const intensity = Math.min((comboCount - 5) * 2, 20);
        document.body.style.setProperty('--shake-intensity', `${intensity}px`);
        document.body.classList.add('screen-shake');
        
        setTimeout(() => {
            document.body.classList.remove('screen-shake');
            document.body.style.removeProperty('--shake-intensity');
        }, 500);
    }

    // Show combo popup animation
    function showComboPopup(count, color) {
        if (!comboGameEnabled) return;
        
        const baseValue = getComboValue(count);
        const value = Math.floor(baseValue * comboMultiplier);
        
        const popup = document.createElement('div');
        popup.className = `combo-popup ${color}`;
        
        // Format multiplier with abbreviations
        let formattedMultiplier = comboMultiplier;
        if (comboMultiplier >= 1000000000000000) {
            formattedMultiplier = (comboMultiplier / 1000000000000000).toFixed(1).replace(/\.0$/, '') + 'Q';
        } else if (comboMultiplier >= 1000000000000) {
            formattedMultiplier = (comboMultiplier / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
        } else if (comboMultiplier >= 1000000000) {
            formattedMultiplier = (comboMultiplier / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
        } else if (comboMultiplier >= 1000000) {
            formattedMultiplier = (comboMultiplier / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (comboMultiplier >= 1000) {
            formattedMultiplier = (comboMultiplier / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        
        const multiplierText = comboMultiplier > 1 ? ` (${formattedMultiplier}x)` : '';
        const formattedValue = formatNumber(value).replace('$', '');
        popup.textContent = `×${count} +$${formattedValue}${multiplierText}`;
        popup.style.left = `${Math.random() * 60 + 20}%`;
        popup.style.top = `${Math.random() * 40 + 30}%`;
        document.body.appendChild(popup);
        
        // Screen shake for high combos
        if (count >= 6) {
            shakeScreen(count);
        }
        
        // Check if player is in early game (hasn't reached 100 actions/sec)
        const hasCompletedEarlyGame = isEarlyGameComplete();
        
        // Play sound for high combos (x6+) always, or low combos (x2-x5) only in early game
        const shouldPlaySound = count >= 6 || !hasCompletedEarlyGame;
        
        if (comboGameEnabled && shouldPlaySound && !soundsMuted) {
            setTimeout(async () => {
                try {
                    const ctx = audioContext;
                    if (!ctx) return;
                   
                    // C major chord notes going up octaves: C, E, G, C, E, G...
                    const cMajorChord = [
                        261.63, // C4
                        329.63, // E4
                        392.00, // G4
                        523.25, // C5
                        659.25, // E5
                        783.99, // G5
                        1046.50, // C6
                        1318.51, // E6
                        1567.98, // G6
                        2093.00, // C7
                        2637.02, // E7
                        3135.96  // G7
                    ];
                    
                    // Get note based on combo count (count - 1 to start at index 0 for x1)
                    const noteIndex = Math.min(count - 1, cMajorChord.length - 1);
                    
                    // Calculate arpeggio delay: if notes are triggered close together,
                    // delay them slightly based on pitch (lower notes play first)
                    const now = ctx.currentTime;
                    const timeSinceLastNote = now - lastNoteTime;
                    const arpeggioDelay = timeSinceLastNote < 0.15 ? (noteIndex % 3) * 0.04 : 0;
                    const startTime = now + arpeggioDelay;
                    
                    lastNoteTime = startTime;
                    
                    const oscillator = ctx.createOscillator();
                    const gainNode = ctx.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(ctx.destination);
                    
                    oscillator.frequency.value = cMajorChord[noteIndex];
                    oscillator.type = 'sine';
                    
                    // Smoother envelope to reduce clicking
                    gainNode.gain.setValueAtTime(0, startTime);
                    gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.005); // Fast attack
                    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);
                    gainNode.gain.linearRampToValueAtTime(0.001, startTime + 0.3); // Smooth release
                    
                    oscillator.start(startTime);
                    oscillator.stop(startTime + 0.31);
                } catch (e) {
                    console.log('Audio error:', e);
                }
            }, 0);
        }
        
        setTimeout(() => popup.remove(), 1000);
    }

    // Update combo display
    function updateComboDisplay() {
        const comboDisplay = document.getElementById('combo-display-footer');
        const shopButton = document.getElementById('shop-button-footer');
        const statsButton = document.getElementById('stats-button-footer');
        if (!comboDisplay) return;

        // Always compute true highest combo from comboStats
        const trueHighestCombo = Math.max(
            highestCombo,
            ...Object.keys(comboStats).map(Number)
        );
        if (trueHighestCombo !== highestCombo) {
            highestCombo = trueHighestCombo;
            saveGameData();
        }

        // Update impact scale based on combo (starts at 2x)
        if (comboGameEnabled) {
            const impactScale = 1.02 + (Math.max(0, comboCount - 2) * 0.015);
            document.body.style.setProperty('--impact-scale', impactScale);
        }

        // Check if player is in early game (hasn't reached 100 actions/sec)
        const hasCompletedEarlyGame = isEarlyGameComplete();
        const minComboToShow = hasCompletedEarlyGame ? 6 : 2;

        // Show/hide combo counter with proper fade behavior
        const shouldShow = comboGameEnabled && comboCount >= minComboToShow;

        if (shouldShow) {
            // Show combo immediately (no transition)
            comboDisplay.style.transition = 'none';
            comboDisplay.textContent = `Combo: ×${comboCount}`;
            comboDisplay.className = `combo-counter ${lastComboColor}`;
            comboDisplay.style.opacity = '1';
            comboDisplay.style.visibility = 'visible';
            comboDisplayShowing = true;
            // Force reflow to apply the transition removal
            comboDisplay.offsetHeight;
        } else if (comboDisplayShowing) {
            // Combo broke - trigger fade out with transition
            comboDisplay.style.transition = 'opacity 2s ease, visibility 2s ease';
            comboDisplay.className = 'hidden';
            comboDisplay.style.opacity = '0';
            comboDisplayShowing = false;
            // Visibility will transition to hidden via CSS
        }
        // If already hidden (comboDisplayShowing = false), don't touch it

        // Show shop and stats buttons
        if (comboGameEnabled && shopButton && statsButton) {
            shopButton.textContent = formatNumber(comboPoints);
            shopButton.className = 'shop-button-footer';
            // Dynamically recalculate odds with current luck upgrades
            const nextComboOdds = calculateComboOdds(highestCombo + 1); // uses current luck
            const oddsText = formatOddsText(nextComboOdds, highestCombo + 1, true);
            statsButton.textContent = `Best: ×${highestCombo} (Next ×${highestCombo + 1} odds: ${oddsText})`;
            statsButton.className = 'stats-button-footer';
        }
    }

    // Update shop UI
    function updateShopUI() {
        const shopContent = document.getElementById('shop-items-content');
        if (!shopContent) return;
        
        shopContent.innerHTML = shopItems.map(item => {
            const cost = getItemCost(item);
            const meetsReqs = meetsRequirements(item);
            const canAfford = comboPoints >= cost && cost !== Infinity && meetsReqs;
            const isPurchased = (item.type === 'multiplier' && cost === Infinity) || (item.type === 'luck' && item.maxOwned !== undefined && item.owned >= item.maxOwned);
            const atStageLimit = isAtStageLimit(item);
            const nextStage = getNextStageRequirement(item);
            const isLocked = !meetsReqs && !isPurchased;
            
            // Calculate multiplier info for display
            let multiplierInfo = '';
            if (item.type === 'multiplier' && item.owned > 0) {
                const currentMultiplier = calculateTotalMultiplier();
                if (item.owned < item.multiplierValues.length) {
                    const nextAddition = item.multiplierValues[item.owned];
                    multiplierInfo = `<p class="shop-item-stats">Current: ×${currentMultiplier} (next: +${nextAddition})</p>`;
                } else {
                    multiplierInfo = `<p class="shop-item-stats">Current: ×${currentMultiplier}</p>`;
                }
            }
            
            // Stage requirement text
            let requirementText = '';
            if (isLocked && item.requiresEarlyGameComplete) {
                requirementText = '<p class="shop-requirement">Requires: 10 of each autoclicker</p>';
            } else if (atStageLimit && nextStage) {
                requirementText = `<p class="shop-requirement">Reach ${nextStage.required} actions/sec to unlock ${nextStage.limit - item.owned} more upgrades</p>`;
            } else if (isPurchased) {
                requirementText = '<p class="shop-requirement">All upgrades purchased!</p>';
            }
            
            return `
                <div class="shop-item ${canAfford ? 'affordable' : 'expensive'} ${isPurchased ? 'purchased' : ''} ${isLocked ? 'locked' : ''}" data-item-id="${item.id}">
                    <div class="shop-item-header">
                        <h3>${item.name}</h3>
                        <span class="shop-item-owned" data-owned>${isPurchased ? 'MAX' : atStageLimit ? `${item.owned}/${getCurrentStageLimit(item)}` : `Owned: ${item.owned}`}</span>
                    </div>
                    <p class="shop-item-description">${item.description}</p>
                    ${item.type === 'clicker' ? `<p class="shop-item-stats">+${(1000 / item.interval).toFixed(1)} actions/sec</p>` : ''}
                    ${item.type === 'luck' && item.owned > 0 ? `<p class="shop-item-stats">Current: ${(item.owned * item.luckPerUpgrade * 100).toFixed(2)}% luck</p>` : ''}
                    ${multiplierInfo}
                    ${requirementText}
                    <button class="shop-buy-btn" data-item-id="${item.id}" ${!canAfford || isPurchased || isLocked ? 'disabled' : ''}>
                        <span data-button-text>${isPurchased ? 'MAX' : isLocked ? 'Locked' : `Buy for ${formatNumber(cost)}`}</span>
                    </button>
                </div>
            `;
        }).join('');
        
        // Add event listeners to buy buttons
        shopContent.querySelectorAll('.shop-buy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.itemId;
                purchaseItem(itemId);
            });
        });
    }

    // Update only shop item values (for live updates)
    function updateShopItemsOnly() {
        shopItems.forEach(item => {
            const itemEl = document.querySelector(`.shop-item[data-item-id="${item.id}"]`);
            if (!itemEl) return;
            
            const cost = getItemCost(item);
            const meetsReqs = meetsRequirements(item);
            const canAfford = comboPoints >= cost && cost !== Infinity && meetsReqs;
            const isPurchased = cost === Infinity;
            const isLocked = !meetsReqs && !isPurchased;
            
            // Update classes
            itemEl.className = `shop-item ${canAfford ? 'affordable' : 'expensive'} ${isPurchased ? 'purchased' : ''} ${isLocked ? 'locked' : ''}`;
            
            // Update owned text
            const ownedEl = itemEl.querySelector('[data-owned]');
            if (ownedEl) {
                ownedEl.textContent = `Owned: ${item.owned}`;
            }
            
            // Update button
            const btnEl = itemEl.querySelector('.shop-buy-btn');
            const btnTextEl = itemEl.querySelector('[data-button-text]');
            if (btnEl && btnTextEl) {
                btnEl.disabled = !canAfford || isPurchased || isLocked;
                btnTextEl.textContent = isPurchased ? 'Max Level' : isLocked ? 'Locked' : `Buy for ${formatNumber(cost)}`;
            }
        });
    }

    // Purchase an item from the shop
    function purchaseItem(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (!item) return;
        
        // Check requirements
        if (!meetsRequirements(item)) {
            alert('This item requires you to complete the early game (100 actions/sec)!');
            return;
        }
        
        const cost = getItemCost(item);
        if (comboPoints < cost || cost === Infinity) return;
        
        comboPoints -= cost;
        item.owned++;
        
        if (item.type === 'clicker') {
            startAutoclicker(item);
            
            // Check if player just completed early game
            if (!earlyGameCompleted && isEarlyGameComplete()) {
                earlyGameCompleted = true;
                playEarlyGameCompletionJingle();
            }
        } else if (item.type === 'multiplier') {
            calculateTotalMultiplier();
        }
        
        saveGameData();
        updateComboDisplay();
        updateShopUI();
        
        console.log(`Purchased ${item.name}! Now have ${item.owned}`);
    }

    // Show shop modal
    function showShop() {
        if (!comboGameEnabled) return;
        
        const modal = document.createElement('div');
        modal.id = 'shop-modal';
        modal.className = 'modal-overlay';
        
        modal.innerHTML = `
            <div class="modal-content shop-modal-content">
                <button class="modal-close" id="close-shop-modal">&times;</button>
                <button class="sound-mute-btn" id="sound-mute-btn" style="background: ${soundsMuted ? '#FF383F' : '#694EFF'}; border: 2px solid ${soundsMuted ? '#FF383F' : '#694EFF'}; color: #000; padding: 10px 20px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease; font-weight: bold; position: absolute; top: 20px; left: 20px;" title="Toggle sound effects">Sound: ${soundsMuted ? 'OFF' : 'ON'}</button>
                <button class="shake-toggle-btn" id="shake-toggle-btn" style="background: ${shakeEnabled ? '#694EFF' : '#FF383F'}; border: 2px solid ${shakeEnabled ? '#694EFF' : '#FF383F'}; color: #000; padding: 10px 20px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease; font-weight: bold; position: absolute; top: 20px; left: 160px;" title="Toggle shake effect">Shake: ${shakeEnabled ? 'ON' : 'OFF'}</button>
                <h2>Shop</h2>
                <div class="shop-header">
                    <p class="shop-balance">Your Balance: <strong id="shop-balance-amount">${formatNumber(comboPoints)}</strong></p>
                    <div class="shop-stats">
                        <p class="shop-stat">Actions/sec: <strong id="shop-actual-actions">0</strong></p>
                        <p class="shop-stat">Average $/sec: <strong id="shop-income-per-sec">$0</strong></p>
                    </div>
                    <p class="shop-info">Total Combos Earned: <span id="shop-total-combos">${totalCombosEarned}</span></p>
                    <button class="view-combo-values-btn" id="view-combo-values-btn">View Combo Values</button>
                </div>
                ${devMode ? `
                    <div class="dev-menu" style="background: rgba(255, 56, 63, 0.1); border: 2px solid #FF383F; padding: 1rem; margin: 1rem 0;">
                        <h3 style="color: #FF383F; margin-top: 0;">DEV MENU</h3>
                        <div style="display: grid; gap: 1rem;">
                            <div>
                                <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: bold; cursor: pointer;">
                                    <input type="checkbox" id="dev-force-matches" ${devForceMatches ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;" />
                                    Force 100% Match Rate
                                </label>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Auto Clickers:</label>
                                <input type="number" id="dev-autoclickers" min="0" max="100000" value="${shopItems.find(i => i.id === 'auto-clicker').owned}" style="width: 100%; padding: 0.5rem; background: #000; border: 2px solid #694EFF; color: #fff;" />
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Luck Upgrades (max 999 = 99.9% luck):</label>
                                <input type="number" id="dev-luck" min="0" max="999" value="${shopItems.find(i => i.id === 'luck-upgrade').owned}" style="width: 100%; padding: 0.5rem; background: #000; border: 2px solid #694EFF; color: #fff;" />
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Multiplier Upgrades:</label>
                                <input type="number" id="dev-multiplier" min="0" max="100000" value="${shopItems.find(i => i.id === 'combo-multiplier').owned}" style="width: 100%; padding: 0.5rem; background: #000; border: 2px solid #694EFF; color: #fff;" />
                            </div>
                            <button id="dev-apply-btn" style="background: #FF383F; border: 2px solid #FF383F; color: #000; padding: 10px 20px; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease; font-weight: bold;">Apply Changes</button>
                        </div>
                    </div>
                ` : ''}
                <div id="shop-items-content" class="shop-items"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        updateShopUI();
        
        // Function to update dynamic values
        const updateShopValues = () => {
            const balanceEl = document.getElementById('shop-balance-amount');
            const totalCombosEl = document.getElementById('shop-total-combos');
            const actualActionsEl = document.getElementById('shop-actual-actions');
            const incomePerSecEl = document.getElementById('shop-income-per-sec');
            
            if (balanceEl) balanceEl.textContent = formatNumber(comboPoints);
            if (totalCombosEl) totalCombosEl.textContent = totalCombosEarned;
            if (actualActionsEl) actualActionsEl.textContent = getActualActionsPerSecond();
            if (incomePerSecEl) {
                const incomeRate = calculateIncomePerSecond(); // Average over last 10 seconds
                incomePerSecEl.textContent = incomeRate >= 1000000 ? 
                    formatNumber(Math.floor(incomeRate)) : 
                    '$' + incomeRate.toFixed(0);
            }
            
            // Update shop items (costs, affordability, owned counts)
            updateShopItemsOnly();
        };
        
        // Set up live updating
        const updateInterval = setInterval(() => {
            if (document.getElementById('shop-modal')) {
                updateShopValues();
            } else {
                clearInterval(updateInterval);
            }
        }, 50); // Update 20 times per second for smooth progress bars
        
        const closeBtn = document.getElementById('close-shop-modal');
        const comboValuesBtn = document.getElementById('view-combo-values-btn');
        const muteBtn = document.getElementById('sound-mute-btn');
        const shakeBtn = document.getElementById('shake-toggle-btn');
        const devApplyBtn = document.getElementById('dev-apply-btn');
                // Shake toggle button logic
                if (shakeBtn) {
                    shakeBtn.addEventListener('click', () => {
                        shakeEnabled = !shakeEnabled;
                        shakeBtn.textContent = shakeEnabled ? 'Shake: ON' : 'Shake: OFF';
                        shakeBtn.style.background = '#000';
                        shakeBtn.style.borderColor = shakeEnabled ? '#694EFF' : '#FF383F';
                        shakeBtn.style.color = shakeEnabled ? '#694EFF' : '#FF383F';
                        shakeBtn.title = shakeEnabled ? 'Disable shake effect' : 'Enable shake effect';
                        saveGameData();
                    });
                    // Hover effect
                    shakeBtn.addEventListener('mouseenter', () => {
                        shakeBtn.style.background = '#000';
                        shakeBtn.style.color = shakeEnabled ? '#694EFF' : '#FF383F';
                    });
                    shakeBtn.addEventListener('mouseleave', () => {
                        shakeBtn.style.background = shakeEnabled ? '#694EFF' : '#FF383F';
                        shakeBtn.style.color = '#000';
                    });
                }
        
        const closeModal = () => {
            clearInterval(updateInterval);
            modal.remove();
        };
        
        closeBtn.addEventListener('click', closeModal);
        
        if (devApplyBtn) {
            devApplyBtn.addEventListener('click', () => {
                const forceMatchesCheckbox = document.getElementById('dev-force-matches');
                const autoClickerInput = document.getElementById('dev-autoclickers');
                const luckInput = document.getElementById('dev-luck');
                const multiplierInput = document.getElementById('dev-multiplier');
                
                // Update force matches setting
                if (forceMatchesCheckbox) {
                    devForceMatches = forceMatchesCheckbox.checked;
                }
                
                // Update auto clickers
                const autoClickerItem = shopItems.find(i => i.id === 'auto-clicker');
                const newAutoClickers = parseInt(autoClickerInput.value) || 0;
                if (autoClickerItem && newAutoClickers !== autoClickerItem.owned) {
                    autoClickerItem.owned = Math.min(newAutoClickers, 100000);
                    if (newAutoClickers > 0) {
                        startAutoclicker(autoClickerItem);
                    }
                }
                
                // Update luck upgrades
                const luckItem = shopItems.find(i => i.id === 'luck-upgrade');
                const newLuck = parseInt(luckInput.value) || 0;
                if (luckItem) {
                    luckItem.owned = Math.min(newLuck, 999); // Dev limit: 999 = 99.9% luck
                }
                
                // Update multiplier upgrades
                const multiplierItem = shopItems.find(i => i.id === 'combo-multiplier');
                const newMultiplier = parseInt(multiplierInput.value) || 0;
                if (multiplierItem) {
                    multiplierItem.owned = Math.min(newMultiplier, 100000); // Dev limit: 100000
                    calculateTotalMultiplier();
                }
                
                // Save and update UI
                saveGameData();
                updateComboDisplay();
                updateShopUI();
                
                console.log('Dev values applied!');
            });
            
            // Add hover effect for dev button
            devApplyBtn.addEventListener('mouseenter', () => {
                devApplyBtn.style.background = '#000';
                devApplyBtn.style.color = '#FF383F';
            });
            devApplyBtn.addEventListener('mouseleave', () => {
                devApplyBtn.style.background = '#FF383F';
                devApplyBtn.style.color = '#000';
            });
        }
        
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                soundsMuted = !soundsMuted;
                muteBtn.textContent = soundsMuted ? 'Sound: OFF' : 'Sound: ON';
                muteBtn.style.background = '#000';
                muteBtn.style.borderColor = soundsMuted ? '#FF383F' : '#694EFF';
                muteBtn.style.color = soundsMuted ? '#FF383F' : '#694EFF';
                muteBtn.title = soundsMuted ? 'Unmute sound effects' : 'Mute sound effects';
                saveGameData();
            });
            
            // Add hover effect
            muteBtn.addEventListener('mouseenter', () => {
                muteBtn.style.background = '#000';
                muteBtn.style.color = soundsMuted ? '#FF383F' : '#694EFF';
            });
            muteBtn.addEventListener('mouseleave', () => {
                muteBtn.style.background = soundsMuted ? '#FF383F' : '#694EFF';
                muteBtn.style.color = '#000';
            });
        }
        
        if (comboValuesBtn) {
            comboValuesBtn.addEventListener('click', () => {
                showComboValues();
            });
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Export stats as image
    function exportStatsImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#694EFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
        
        ctx.fillStyle = '#694EFF';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Combo Stats', canvas.width / 2, 60);
        
        ctx.fillStyle = '#FF383F';
        ctx.font = 'bold 48px Arial';
        // Show odds for highest combo next to it
        const highestComboOdds = formatOddsText(calculateComboOdds(highestCombo), highestCombo, true);
        ctx.fillText(`Highest Combo: ×${highestCombo} (${highestComboOdds})`, canvas.width / 2, 120);

        const totalCombos = Object.values(comboStats).reduce((a, b) => a + b, 0);
        ctx.fillStyle = '#FFFFA3';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`Total Combos: ${totalCombos}`, canvas.width / 2, 155);
        ctx.fillText(`Currency: ${formatCurrencyCompact(comboPoints)}`, canvas.width / 2, 185);

        // Sort combos by combo level (number), descending, and show top 5 (excluding highest, which is always shown at the top)
        const sortedCombos = Object.keys(comboStats)
            .map(Number)
            .filter(combo => combo !== highestCombo)
            .sort((a, b) => b - a)
            .slice(0, 5);

        if (sortedCombos.length > 0) {
            ctx.fillStyle = '#FFFFA3';
            ctx.font = 'bold 24px Arial';
            ctx.fillText('Top 5 Highest Combos:', canvas.width / 2, 225);

            const maxCount = Math.max(...sortedCombos.map(combo => comboStats[combo]));
            const startY = 265;
            const barHeight = 40;
            const barSpacing = 60;
            const maxBarWidth = 500;

            sortedCombos.forEach((combo, index) => {
                const count = comboStats[combo];
                const y = startY + (index * barSpacing);
                const barWidth = (count / maxCount) * maxBarWidth;

                ctx.fillStyle = '#222';
                ctx.fillRect(140, y, maxBarWidth, barHeight);

                ctx.fillStyle = '#694EFF';
                ctx.fillRect(140, y, barWidth, barHeight);

                // Show odds in the center of the bar
                const oddsText = formatOddsText(calculateComboOdds(Number(combo)), Number(combo), true);
                ctx.fillStyle = '#FFFFA3';
                ctx.font = 'bold 18px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(oddsText, 140 + maxBarWidth / 2, y + 27);

                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(`×${combo}`, 130, y + 27);

                ctx.textAlign = 'left';
                ctx.fillText(count.toString(), 650, y + 27);
            });
        } else {
            ctx.fillStyle = '#888';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No combos achieved yet!', canvas.width / 2, 300);
        }
        
        ctx.fillStyle = '#FF383F';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('mentalstrainrecords.com', canvas.width / 2, canvas.height - 30);
        
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `msr-combo-stats-${Date.now()}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            console.log('Stats image exported!');
        });
    }

    // Show combo statistics modal
    // Show combo values page
    function showComboValues() {
        const modal = document.createElement('div');
        modal.id = 'combo-values-modal';
        modal.className = 'modal-overlay';
        
        // Calculate values for x2 through x20 with current multiplier
        const currentMultiplier = comboMultiplier;
        const comboValuesHTML = [];
        
        for (let combo = 2; combo <= 20; combo++) {
            const baseValue = getComboValue(combo);
            const actualValue = Math.floor(baseValue * currentMultiplier);
            // Dynamically recalculate odds with current luck upgrades
            const odds = calculateComboOdds(combo); // uses current luck
            const oddsText = formatOddsText(odds, combo, true); // show as 1/x odds
            comboValuesHTML.push(`
                <div class="combo-value-row">
                    <div class="combo-value-label">×${combo}</div>
                    <div class="combo-value-odds">${oddsText}</div>
                    <div class="combo-value-amount">${formatNumber(actualValue)}</div>
                </div>
            `);
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" id="close-combo-values-modal">&times;</button>
                <h2>Combo Values</h2>
                <p style="text-align: center; color: #888; margin-bottom: 1rem;">Current Multiplier: ×${currentMultiplier}</p>
                <div class="combo-values-list">
                    ${comboValuesHTML.join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = document.getElementById('close-combo-values-modal');
        const closeModal = () => {
            modal.remove();
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    function showComboStats() {
        const modal = document.createElement('div');
        modal.id = 'combo-stats-modal';
        modal.className = 'modal-overlay';
        
        // Function to generate stats HTML (only called once)
        const generateStatsHTML = () => {
            const maxCount = Math.max(...Object.values(comboStats), 1);
            const sortedCombos = Object.keys(comboStats).map(Number).sort((a, b) => a - b);
            
            const statsHTML = sortedCombos.length > 0 
                ? sortedCombos.map(combo => {
                    const count = comboStats[combo];
                    const percentage = (count / maxCount) * 100;
                    return `
                        <div class="stat-row" data-combo="${combo}">
                            <div class="stat-label">×${combo}</div>
                            <div class="stat-bar-container">
                                <div class="stat-bar" data-bar style="width: ${percentage}%"></div>
                            </div>
                            <div class="stat-count" data-count>${count}</div>
                        </div>
                    `;
                }).join('')
                : '<p style="text-align: center; color: #888;">No combos achieved yet!</p>';
            
            return `
                <div class="modal-content">
                    <button class="modal-close" id="close-stats-modal">&times;</button>
                    <h2>Combo Statistics</h2>
                    <div class="stats-container">
                        ${statsHTML}
                    </div>
                    <div class="stats-summary">
                        <p><strong>Total Combos:</strong> <span id="stat-total-combos">${Object.values(comboStats).reduce((a, b) => a + b, 0)}</span></p>
                        <p><strong>Highest:</strong> <span id="stat-highest">×${highestCombo}</span></p>
                        <p><strong>Next ×${highestCombo + 1} Odds:</strong> <span id="stat-next-odds">${formatOddsText(calculateComboOdds(highestCombo + 1), highestCombo + 1, true)}</span></p>
                        <p><strong>Currency:</strong> <span id="stat-currency">${formatCurrencyCompact(comboPoints)}</span></p>
                    </div>
                    <div class="modal-buttons">
                        <button class="share-stats-btn" id="share-stats-btn">Share Stats</button>
                        <button class="reset-stats-btn" id="reset-stats-btn">Reset Game</button>
                    </div>
                </div>
            `;
        };
        
        modal.innerHTML = generateStatsHTML();
        document.body.appendChild(modal);
        
        // Function to update only the dynamic values
        const updateStats = () => {
            const totalCombosEl = document.getElementById('stat-total-combos');
            const highestEl = document.getElementById('stat-highest');
            const nextOddsEl = document.getElementById('stat-next-odds');
            const currencyEl = document.getElementById('stat-currency');
            const totalEarnedEl = document.getElementById('stat-total-earned');

            // Always compute true highest combo from comboStats
            const trueHighestCombo = Math.max(
                highestCombo,
                ...Object.keys(comboStats).map(Number)
            );
            if (trueHighestCombo !== highestCombo) {
                highestCombo = trueHighestCombo;
                saveGameData();
            }

            if (totalCombosEl) totalCombosEl.textContent = Object.values(comboStats).reduce((a, b) => a + b, 0);
            if (highestEl) highestEl.textContent = `×${highestCombo}`;
            if (nextOddsEl) {
                const odds = calculateComboOdds(highestCombo + 1);
                nextOddsEl.textContent = formatOddsText(odds, highestCombo + 1, true);
            }
            if (currencyEl) currencyEl.textContent = formatCurrencyCompact(comboPoints);
            if (totalEarnedEl) totalEarnedEl.textContent = totalCombosEarned;

            // Update bar graphs dynamically
            const maxCount = Math.max(...Object.values(comboStats), 1);
            document.querySelectorAll('.stat-row').forEach(row => {
                const combo = parseInt(row.dataset.combo);
                const count = comboStats[combo] || 0;
                const percentage = (count / maxCount) * 100;

                const barEl = row.querySelector('[data-bar]');
                const countEl = row.querySelector('[data-count]');

                if (barEl) barEl.style.width = `${percentage}%`;
                if (countEl) countEl.textContent = count;
            });
        };
        
        // Set up live updating (only updates text, not buttons)
        const updateInterval = setInterval(() => {
            if (document.getElementById('combo-stats-modal')) {
                updateStats();
            } else {
                clearInterval(updateInterval);
            }
        }, 50); // Update 20 times per second to match shop
        
        // Function to attach event handlers (called once)
        const attachStatsModalHandlers = () => {
            const closeBtn = document.getElementById('close-stats-modal');
            const resetBtn = document.getElementById('reset-stats-btn');
            const shareBtn = document.getElementById('share-stats-btn');
            
            const closeModal = () => {
                clearInterval(updateInterval);
                modal.remove();
            };
            
            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (shareBtn) shareBtn.addEventListener('click', () => exportStatsImage());
            if (resetBtn) resetBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all game progress? This cannot be undone.')) {
                    // Stop all autoclickers
                    shopItems.forEach(item => {
                        if (item.timers && Array.isArray(item.timers)) {
                            item.timers.forEach(timer => clearInterval(timer));
                        }
                        item.timers = [];
                        item.owned = 0;
                    });
                    
                    // Reset all game state
                    comboStats = {};
                    highestCombo = 0;
                    comboPoints = 0;
                    totalCombosEarned = 0;
                    comboCount = 0;
                    lastComboColor = null;
                    comboMultiplier = 1;
                    
                    localStorage.removeItem('msr-game-data');
                    
                    closeModal();
                    updateComboDisplay();
                    
                    console.log('Game has been reset.');
                }
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        };
        
        // Attach handlers initially
        attachStatsModalHandlers();
    }

    // Dev mode toggle (accessible from console)
    window.toggleDevMode = function() {
        devMode = !devMode;
        console.log(`%cDev Mode ${devMode ? 'ENABLED' : 'DISABLED'}`, `color: ${devMode ? '#00ff00' : '#ff0000'}; font-weight: bold; font-size: 16px;`);
        if (devMode) {
            console.log('%cAny color will now count towards combo!', 'color: #ffff00; font-style: italic;');
        }
        
        const comboDisplay = document.getElementById('combo-display-footer');
        if (comboDisplay && devMode) {
            comboDisplay.style.outline = '2px solid lime';
        } else if (comboDisplay) {
            comboDisplay.style.outline = '';
        }
        return devMode;
    };

    // Public API
    return {
        async enable() {
            if (comboGameEnabled) return;
            
            const ctx = initAudioContext();
            
            try {
                if (ctx.state === 'suspended') {
                    await ctx.resume();
                }
                
                // Play 3-note startup jingle
                const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
                const noteDuration = 0.15;
                const noteGap = 0.05;
                
                notes.forEach((freq, index) => {
                    const oscillator = ctx.createOscillator();
                    const gainNode = ctx.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(ctx.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    
                    const startTime = ctx.currentTime + (index * (noteDuration + noteGap));
                    // Smoother envelope to reduce clicking
                    gainNode.gain.setValueAtTime(0, startTime);
                    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.005);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration - 0.01);
                    gainNode.gain.linearRampToValueAtTime(0.001, startTime + noteDuration);
                    
                    oscillator.start(startTime);
                    oscillator.stop(startTime + noteDuration + 0.01);
                });
                
                comboGameEnabled = true;
                loadGameData();
                updateComboDisplay();
                
                // Show game UI in footer
                const gameFooterUI = document.getElementById('game-footer-ui');
                const footerEmail = document.querySelector('.footer-email');
                if (gameFooterUI) {
                    gameFooterUI.classList.remove('hidden');
                    footerEmail?.classList.add('hidden');
                }
                
                console.log('Combo game enabled! Type "shop()" to open the shop.');
            } catch (e) {
                console.log('Failed to enable audio:', e);
            }
        },

        isEnabled() {
            return comboGameEnabled;
        },

        handleHover(color) {
            if (!comboGameEnabled) return;

            if (lastComboColor === color || devForceMatches) {
                comboCount++;
                if (comboCount >= 3) {
                    showComboPopup(comboCount, color);
                }
            } else {
                // Award currency when combo breaks
                if (comboCount >= 2) {
                    const baseValue = getComboValue(comboCount);
                    const value = Math.floor(baseValue * comboMultiplier);
                    comboPoints += value;
                    trackIncome(value);
                    totalCombosEarned++;
                    comboStats[comboCount] = (comboStats[comboCount] || 0) + 1;
                    saveGameData();
                    
                    // Play special sound based on combo achieved
                    if (!soundsMuted) {
                        if (comboCount >= 10) {
                            const godlikeAudio = new Audio('./assets/audio/godlike.mp3');
                            godlikeAudio.volume = 1.0;
                            godlikeAudio.play().catch(e => console.log('Failed to play godlike sound:', e));
                        } else if (comboCount === 9) {
                            const holyShitAudio = new Audio('./assets/audio/holyshit.mp3');
                            holyShitAudio.volume = 1.0;
                            holyShitAudio.play().catch(e => console.log('Failed to play holy shit sound:', e));
                        }
                    }
                }
                comboCount = 1;
                lastComboColor = color;
            }
            updateComboDisplay();
        },

        showStats() {
            if (comboGameEnabled) {
                showComboStats();
            }
        },
        
        openShop() {
            if (comboGameEnabled) {
                showShop();
            }
        },

        getComboCount() {
            return comboCount;
        },

        getHighestCombo() {
            return highestCombo;
        },
        
        getPoints() {
            return comboPoints;
        }
    };
})();

// Expose shop function globally for console access
window.shop = function() {
    ColourComboGame.showShop();
};
