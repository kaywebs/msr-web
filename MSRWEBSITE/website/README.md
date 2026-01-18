# Kwebi Website Vibe

A simple one-page website to showcase music albums.

## How to use

1.  Open `index.html` in your web browser.
2.  Click on an album to view its tracklist.
3.  Click the "Back to Albums" button to return to the album list.

## How to add your own albums

1.  Open `script.js` in a text editor.
2.  Find the `albums` array at the top of the file.
3.  Add a new album object to the array. Follow the existing format:

```javascript
{
    id: 4, // Make sure this is a unique number
    title: 'Your Album Title',
    artist: 'Your Artist Name',
    cover: 'path/to/your/album/cover.jpg', // You can use a URL or a local file path
    tracks: ['Track A', 'Track B', 'Track C']
}
```

4.  Save the `script.js` file. The website will automatically update with the new album.

## GitHub Pages

To host this website on GitHub Pages:

1.  Create a new repository on GitHub.
2.  Upload the `index.html`, `style.css`, and `script.js` files to the repository.
3.  In your repository settings, go to the "Pages" section.
4.  Select the `main` branch as the source and click "Save".
5.  Your website will be live at `https://<your-username>.github.io/<your-repository-name>/`.
