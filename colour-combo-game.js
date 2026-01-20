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
    let comboPoints = 0; // Currency earned from combos
    let totalCombosEarned = 0; // Total combos completed
    let comboMultiplier = 1; // Total multiplier from upgrades
    let lastNoteTime = 0; // Track last note play time for arpeggio effect
    let comboDisplayShowing = false; // Track if combo display is currently visible
    let incomeHistory = []; // Track recent income for $/sec calculation
    let lastIncomeTime = Date.now(); // Last time we earned currency
    let earlyGameCompleted = false; // Track if early game completion jingle has played

    // Format large numbers with abbreviations
    function formatNumber(num) {
        if (num >= 1000000000) {
            return '$' + (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
        }
        if (num >= 1000000) {
            return '$' + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        return '$' + num.toLocaleString();
    }

    // Compact format for stats page (abbreviates at 100k)
    function formatCurrencyCompact(num) {
        if (num >= 1000000000) {
            return '$' + (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
        }
        if (num >= 1000000) {
            return '$' + (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 100000) {
            return '$' + (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return '$' + num.toLocaleString();
    }

    // Calculate actions per second from autoclickers
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
    
    // Shop items (autoclickers)
    let shopItems = [
        {
            id: 'basic-clicker',
            name: 'Basic Clicker',
            description: 'Automatically hovers an album every 5 seconds',
            type: 'clicker',
            baseCost: 10,
            costMultiplier: 1.15,
            owned: 0,
            interval: 5000,
            timers: [],
            nextFireTime: 0,
            luckBonus: 0 // 0% chance to force combo continuation
        },
        {
            id: 'fast-clicker',
            name: 'Fast Clicker',
            description: 'Hovers an album every 2 seconds (2% luck)',
            type: 'clicker',
            baseCost: 50,
            costMultiplier: 1.2,
            owned: 0,
            interval: 2000,
            timers: [],
            nextFireTime: 0,
            luckBonus: 0.02 // 2% chance to force combo continuation
        },
        {
            id: 'speed-clicker',
            name: 'Speed Clicker',
            description: 'Hovers an album every second (4% luck)',
            type: 'clicker',
            baseCost: 250,
            costMultiplier: 1.25,
            owned: 0,
            interval: 1000,
            timers: [],
            nextFireTime: 0,
            luckBonus: 0.04 // 4% chance to force combo continuation
        },
        {
            id: 'turbo-clicker',
            name: 'Turbo Clicker',
            description: 'Hovers an album every 0.5 seconds (6% luck)',
            type: 'clicker',
            baseCost: 1250,
            costMultiplier: 1.3,
            owned: 0,
            interval: 500,
            timers: [],
            nextFireTime: 0,
            luckBonus: 0.06 // 6% chance to force combo continuation
        },
        {
            id: 'mega-clicker',
            name: 'Mega Clicker',
            description: 'Hovers an album every 0.2 seconds (8% luck)',
            type: 'clicker',
            baseCost: 6250,
            costMultiplier: 1.35,
            owned: 0,
            interval: 200,
            timers: [],
            nextFireTime: 0,
            luckBonus: 0.08 // 8% chance to force combo continuation
        },
        {
            id: 'giga-clicker',
            name: 'Giga Clicker',
            description: 'Hovers an album every 0.1 seconds (10% luck)',
            type: 'clicker',
            baseCost: 50000,
            costMultiplier: 1.4,
            owned: 0,
            interval: 100,
            timers: [],
            nextFireTime: 0,
            requiresAllClickersAtTen: true,
            luckBonus: 0.10 // 10% chance to force combo continuation
        },
        {
            id: 'multiplier-1',
            name: 'Double Vision',
            description: 'Doubles all combo rewards (2x multiplier)',
            type: 'multiplier',
            baseCost: 10000,
            multiplierValue: 2,
            owned: 0
        },
        {
            id: 'multiplier-2',
            name: 'Triple Threat',
            description: 'Triples all combo rewards (3x multiplier)',
            type: 'multiplier',
            baseCost: 50000,
            multiplierValue: 3,
            owned: 0
        },
        {
            id: 'multiplier-3',
            name: 'Quintuple Power',
            description: 'Multiplies all combo rewards by 5',
            type: 'multiplier',
            baseCost: 250000,
            multiplierValue: 5,
            owned: 0,
            requiresAllClickersAtTen: true
        },
        {
            id: 'multiplier-4',
            name: 'Lucky Seven',
            description: 'Multiplies all combo rewards by 7',
            type: 'multiplier',
            baseCost: 1500000,
            multiplierValue: 7,
            owned: 0,
            requiresAllClickersAtTen: true
        },
        {
            id: 'multiplier-5',
            name: 'Perfect Ten',
            description: 'Multiplies all combo rewards by 10',
            type: 'multiplier',
            baseCost: 10000000,
            multiplierValue: 10,
            owned: 0,
            requiresAllClickersAtTen: true
        }
    ];
    
    // Calculate combo value based on rarity (exponential scaling)
    function getComboValue(comboLevel) {
        if (comboLevel < 2) return 0;
        
        // Smaller rewards for early combos (x2-x5)
        if (comboLevel < 6) {
            // x2=1, x3=2, x4=4, x5=8
            return Math.pow(2, comboLevel - 2);
        }
        
        // Rapid scaling starting at x6
        // x6=100, x7=300, x8=900, x9=2700, x10=8100, etc.
        return Math.floor(Math.pow(3, comboLevel - 5) * 100);
    }
    
    // Calculate current cost of an item
    function getItemCost(item) {
        if (item.type === 'multiplier') {
            // Multipliers can only be bought once
            return item.owned > 0 ? Infinity : item.baseCost;
        }
        return Math.floor(item.baseCost * Math.pow(item.costMultiplier, item.owned));
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

    // Check if item requirements are met
    function meetsRequirements(item) {
        if (!item.requiresAllClickersAtTen) return true;
        
        // Only check the basic 5 autoclickers (not items that also require this condition)
        const basicAutoClickers = shopItems.filter(i => 
            i.type === 'clicker' && !i.requiresAllClickersAtTen
        );
        return basicAutoClickers.every(clicker => clicker.owned >= 10);
    }
    
    // Calculate total multiplier from all purchased multiplier items
    function calculateTotalMultiplier() {
        let total = 1;
        shopItems.forEach(item => {
            if (item.type === 'multiplier' && item.owned > 0) {
                total *= item.multiplierValue;
            }
        });
        comboMultiplier = total;
        return total;
    }

    // Calculate the odds of achieving a specific combo length
    function calculateComboOdds(comboLength) {
        if (comboLength < 2) return 100;
        
        // Calculate average luck bonus from owned autoclickers
        const ownedClickers = shopItems.filter(item => item.type === 'clicker' && item.owned > 0);
        const totalActions = ownedClickers.reduce((sum, item) => sum + item.owned, 0);
        
        let averageLuck = 0;
        if (totalActions > 0) {
            const weightedLuck = ownedClickers.reduce((sum, item) => {
                return sum + (item.luckBonus * item.owned);
            }, 0);
            averageLuck = weightedLuck / totalActions;
        }
        
        // Effective match chance calculation:
        // P(match) = P(natural match) + P(no natural match) × P(luck triggers)
        // = 1/3 + (2/3) × averageLuck
        const effectiveChance = (1/3) + ((2/3) * averageLuck);
        
        // Need (comboLength - 1) consecutive matches
        const odds = Math.pow(effectiveChance, comboLength - 1) * 100;
        
        return odds;
    }
    
    // Simulate an automatic album hover (runs in background without visual effects)
    function simulateHover(item = null) {
        if (!comboGameEnabled) return;
        
        const colors = ['color-red', 'color-green', 'color-blue'];
        
        // True 1/3 chance to match the last color
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Apply luck bonus from autoclicker if provided
        const luckBonus = item?.luckBonus || 0;
        const luckRoll = Math.random();
        if (luckBonus > 0 && luckRoll < luckBonus && lastComboColor) {
            // Force the color to match for a lucky hit!
            randomColor = lastComboColor;
        }
        
        // Initialize lastComboColor if this is the first interaction
        if (!lastComboColor) {
            lastComboColor = randomColor;
            comboCount = 1;
            return;
        }
        
        // Check if color matches (or dev mode)
        if (lastComboColor === randomColor || devMode) {
            comboCount++;
            if (comboCount >= 3) {
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
                saveGameData();
                
                // Play special sound based on combo achieved
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
            comboCount = 1;
            lastComboColor = randomColor;
        }
        updateComboDisplay();
    }
    
    // Start an autoclicker
    function startAutoclicker(item) {
        if (item.owned === 0) return;
        
        // Clear existing timers for this item
        item.timers.forEach(timer => clearInterval(timer));
        item.timers = [];
        
        // Set initial fire time
        item.nextFireTime = Date.now() + item.interval;
        
        // Create one interval per owned item
        for (let i = 0; i < item.owned; i++) {
            const timer = setInterval(() => {
                simulateHover(item);
                // Update next fire time
                item.nextFireTime = Date.now() + item.interval;
            }, item.interval);
            item.timers.push(timer);
        }
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
                
                // Restore shop items
                if (data.shopItems) {
                    data.shopItems.forEach(savedItem => {
                        const item = shopItems.find(i => i.id === savedItem.id);
                        if (item) {
                            item.owned = savedItem.owned;
                            if (item.type === 'clicker') {
                                startAutoclicker(item);
                            }
                        }
                    });
                    calculateTotalMultiplier();
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
        const multiplierText = comboMultiplier > 1 ? ` (${comboMultiplier}x)` : '';
        popup.textContent = `×${count} +$${value}${multiplierText}`;
        popup.style.left = `${Math.random() * 60 + 20}%`;
        popup.style.top = `${Math.random() * 40 + 30}%`;
        document.body.appendChild(popup);
        
        // Screen shake for high combos
        if (count >= 6) {
            shakeScreen(count);
        }
        
        // Check if player is in early game (hasn't reached 10 of each basic autoclicker)
        const basicAutoClickers = shopItems.filter(item => 
            item.type === 'clicker' && !item.requiresAllClickersAtTen
        );
        const hasAllClickersAtTen = basicAutoClickers.every(item => item.owned >= 10);
        
        // Play sound for high combos (x6+) always, or low combos (x2-x5) only in early game
        const shouldPlaySound = count >= 6 || !hasAllClickersAtTen;
        
        if (comboGameEnabled && shouldPlaySound) {
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
                    
                    // Get note based on combo count
                    // In late game, x6 starts at the lowest note (index 0)
                    let noteIndex;
                    if (hasAllClickersAtTen && count >= 6) {
                        noteIndex = Math.min(count - 6, cMajorChord.length - 1);
                    } else {
                        noteIndex = Math.min(count - 1, cMajorChord.length - 1);
                    }
                    
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
                    
                    gainNode.gain.setValueAtTime(0.1, startTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
                    
                    oscillator.start(startTime);
                    oscillator.stop(startTime + 0.3);
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
        
        // Update high score
        if (comboCount > highestCombo) {
            highestCombo = comboCount;
            saveGameData();
        }
        
        // Update impact scale based on combo (starts at 2x)
        if (comboGameEnabled) {
            const impactScale = 1.02 + (Math.max(0, comboCount - 2) * 0.015);
            document.body.style.setProperty('--impact-scale', impactScale);
        }
        
        // Check if player is in early game (hasn't reached 10 of each basic autoclicker)
        const basicAutoClickers = shopItems.filter(item => 
            item.type === 'clicker' && !item.requiresAllClickersAtTen
        );
        const hasAllClickersAtTen = basicAutoClickers.every(item => item.owned >= 10);
        const minComboToShow = hasAllClickersAtTen ? 6 : 2;
        
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
            const nextComboOdds = calculateComboOdds(highestCombo + 1);
            const oddsText = nextComboOdds >= 0.0001 ? `${nextComboOdds.toFixed(4)}%` : '<0.0001%';
            statsButton.textContent = `Best: ×${highestCombo} (${oddsText})`;
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
            const isPurchased = item.type === 'multiplier' && item.owned > 0;
            const isLocked = !meetsReqs && !isPurchased;
            
            return `
                <div class="shop-item ${canAfford ? 'affordable' : 'expensive'} ${isPurchased ? 'purchased' : ''} ${isLocked ? 'locked' : ''}" data-item-id="${item.id}">
                    <div class="shop-item-header">
                        <h3>${item.name}</h3>
                        <span class="shop-item-owned" data-owned>${item.type === 'multiplier' ? (item.owned > 0 ? '✓ Owned' : 'Not Owned') : `Owned: ${item.owned}`}</span>
                    </div>
                    <p class="shop-item-description">${item.description}</p>
                    ${item.type === 'clicker' ? `<p class="shop-item-stats">+${(1000 / item.interval).toFixed(1)} actions/sec</p>` : ''}
                    ${isLocked ? '<p class="shop-requirement">Requires: 10 of each autoclicker</p>' : ''}
                    ${item.type === 'clicker' && item.owned > 0 ? '<div class="clicker-progress-bar"><div class="clicker-progress-fill" data-progress></div></div>' : ''}
                    <button class="shop-buy-btn" data-item-id="${item.id}" ${!canAfford || isPurchased || isLocked ? 'disabled' : ''}>
                        <span data-button-text>${isPurchased ? 'Purchased' : isLocked ? 'Locked' : `Buy for ${formatNumber(cost)}`}</span>
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
            const isPurchased = item.type === 'multiplier' && item.owned > 0;
            const isLocked = !meetsReqs && !isPurchased;
            
            // Update classes
            itemEl.className = `shop-item ${canAfford ? 'affordable' : 'expensive'} ${isPurchased ? 'purchased' : ''} ${isLocked ? 'locked' : ''}`;
            
            // Update owned text
            const ownedEl = itemEl.querySelector('[data-owned]');
            if (ownedEl) {
                ownedEl.textContent = item.type === 'multiplier' ? (item.owned > 0 ? '✓ Owned' : 'Not Owned') : `Owned: ${item.owned}`;
            }
            
            // Update button
            const btnEl = itemEl.querySelector('.shop-buy-btn');
            const btnTextEl = itemEl.querySelector('[data-button-text]');
            if (btnEl && btnTextEl) {
                btnEl.disabled = !canAfford || isPurchased || isLocked;
                btnTextEl.textContent = isPurchased ? 'Purchased' : isLocked ? 'Locked' : `Buy for ${formatNumber(cost)}`;
            }
            
            // Handle progress bar for clickers
            if (item.type === 'clicker') {
                let progressBarEl = itemEl.querySelector('.clicker-progress-bar');
                
                if (item.owned > 0) {
                    // Create progress bar if it doesn't exist
                    if (!progressBarEl) {
                        progressBarEl = document.createElement('div');
                        progressBarEl.className = 'clicker-progress-bar';
                        progressBarEl.innerHTML = '<div class="clicker-progress-fill" data-progress></div>';
                        
                        // Insert before the button
                        const button = itemEl.querySelector('.shop-buy-btn');
                        if (button) {
                            button.parentNode.insertBefore(progressBarEl, button);
                        }
                    }
                    
                    // Update progress
                    const progressEl = itemEl.querySelector('[data-progress]');
                    if (progressEl && item.nextFireTime > 0) {
                        const now = Date.now();
                        const timeLeft = Math.max(0, item.nextFireTime - now);
                        const progress = Math.min(100, ((item.interval - timeLeft) / item.interval) * 100);
                        progressEl.style.width = `${progress}%`;
                    }
                } else if (progressBarEl) {
                    // Remove progress bar if owned is 0
                    progressBarEl.remove();
                }
            }
        });
    }

    // Purchase an item from the shop
    function purchaseItem(itemId) {
        const item = shopItems.find(i => i.id === itemId);
        if (!item) return;
        
        // Check requirements
        if (!meetsRequirements(item)) {
            alert('This item requires you to have 10 of each autoclicker first!');
            return;
        }
        
        const cost = getItemCost(item);
        if (comboPoints < cost || cost === Infinity) return;
        
        comboPoints -= cost;
        item.owned++;
        
        if (item.type === 'clicker') {
            startAutoclicker(item);
            
            // Check if player just completed early game
            if (!earlyGameCompleted) {
                const basicAutoClickers = shopItems.filter(i => 
                    i.type === 'clicker' && !i.requiresAllClickersAtTen
                );
                const hasAllClickersAtTen = basicAutoClickers.every(clicker => clicker.owned >= 10);
                
                if (hasAllClickersAtTen) {
                    earlyGameCompleted = true;
                    playEarlyGameCompletionJingle();
                }
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
                <h2>Shop</h2>
                <div class="shop-header">
                    <p class="shop-balance">Your Balance: <strong id="shop-balance-amount">${formatNumber(comboPoints)}</strong></p>
                    <div class="shop-stats">
                        <p class="shop-stat">Actions/sec: <strong id="shop-actions-per-sec">0.0</strong></p>
                        <p class="shop-stat">Average $/sec: <strong id="shop-income-per-sec">$0</strong></p>
                    </div>
                    <p class="shop-info">Total Combos Earned: <span id="shop-total-combos">${totalCombosEarned}</span></p>
                    <button class="view-combo-values-btn" id="view-combo-values-btn">View Combo Values</button>
                </div>
                <div id="shop-items-content" class="shop-items"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        updateShopUI();
        
        // Function to update dynamic values
        const updateShopValues = () => {
            const balanceEl = document.getElementById('shop-balance-amount');
            const totalCombosEl = document.getElementById('shop-total-combos');
            const actionsPerSecEl = document.getElementById('shop-actions-per-sec');
            const incomePerSecEl = document.getElementById('shop-income-per-sec');
            
            if (balanceEl) balanceEl.textContent = formatNumber(comboPoints);
            if (totalCombosEl) totalCombosEl.textContent = totalCombosEarned;
            if (actionsPerSecEl) actionsPerSecEl.textContent = calculateActionsPerSecond().toFixed(1);
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
        
        const closeModal = () => {
            clearInterval(updateInterval);
            modal.remove();
        };
        
        closeBtn.addEventListener('click', closeModal);
        
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
        ctx.fillText(`Highest Combo: ×${highestCombo}`, canvas.width / 2, 120);
        
        const totalCombos = Object.values(comboStats).reduce((a, b) => a + b, 0);
        ctx.fillStyle = '#FFFFA3';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`Total Combos: ${totalCombos}`, canvas.width / 2, 155);
        ctx.fillText(`Currency: $${comboPoints}`, canvas.width / 2, 185);
        
        const sortedByCount = Object.entries(comboStats)
            .sort((a, b) => a[1] - b[1])
            .slice(0, 5);
        
        if (sortedByCount.length > 0) {
            ctx.fillStyle = '#FFFFA3';
            ctx.font = 'bold 24px Arial';
            ctx.fillText('Top 5 Rarest Combos Achieved:', canvas.width / 2, 225);
            
            const maxCount = Math.max(...sortedByCount.map(([_, count]) => count));
            const startY = 265;
            const barHeight = 40;
            const barSpacing = 60;
            const maxBarWidth = 500;
            
            sortedByCount.forEach(([combo, count], index) => {
                const y = startY + (index * barSpacing);
                const barWidth = (count / maxCount) * maxBarWidth;
                
                ctx.fillStyle = '#222';
                ctx.fillRect(140, y, maxBarWidth, barHeight);
                
                ctx.fillStyle = '#694EFF';
                ctx.fillRect(140, y, barWidth, barHeight);
                
                ctx.fillStyle = '#FFFFA3';
                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(`×${combo}`, 130, y + 27);
                
                ctx.fillStyle = '#FFFFA3';
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
        
        // Calculate values for x2 through x15 with current multiplier
        const currentMultiplier = comboMultiplier;
        const comboValuesHTML = [];
        
        for (let combo = 2; combo <= 15; combo++) {
            const baseValue = getComboValue(combo);
            const actualValue = Math.floor(baseValue * currentMultiplier);
            const odds = calculateComboOdds(combo);
            const oddsText = odds >= 0.0001 ? odds.toFixed(4) + '%' : '<0.0001%';
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
                        <p><strong>Next ×${highestCombo + 1} Odds:</strong> <span id="stat-next-odds">${(() => {
                            const odds = calculateComboOdds(highestCombo + 1);
                            return odds >= 0.0001 ? odds.toFixed(4) + '%' : '<0.0001%';
                        })()}</span></p>
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
            
            if (totalCombosEl) totalCombosEl.textContent = Object.values(comboStats).reduce((a, b) => a + b, 0);
            if (highestEl) highestEl.textContent = `×${highestCombo}`;
            if (nextOddsEl) {
                const odds = calculateComboOdds(highestCombo + 1);
                nextOddsEl.textContent = odds >= 0.0001 ? odds.toFixed(4) + '%' : '<0.0001%';
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
                    gainNode.gain.setValueAtTime(0.2, startTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
                    
                    oscillator.start(startTime);
                    oscillator.stop(startTime + noteDuration);
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

            if (lastComboColor === color || devMode) {
                comboCount++;
                if (comboCount >= 3) {
                    showComboPopup(comboCount, color);
                }
            } else {
                // Award currency when combo breaks
                if (comboCount >= 2) {
                    const value = getComboValue(comboCount);
                    comboPoints += value;
                    trackIncome(value);
                    totalCombosEarned++;
                    comboStats[comboCount] = (comboStats[comboCount] || 0) + 1;
                    saveGameData();
                    
                    // Play special sound based on combo achieved
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
