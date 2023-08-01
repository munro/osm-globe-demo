# OpenStreetMaps 3D Globe Web Demo

Are you tired of squinting at distorted maps, trying to fit a round peg in a square hole? Then buckle up for the journey of a lifetime with this OpenStreetMaps 3D globe demo!

You can view the demo here: [https://munro.github.io/osm-globe-demo/](https://munro.github.io/osm-globe-demo/)

You could also use Mapbox: [example](https://docs.mapbox.com/mapbox-gl-js/example/flyto-options/), [source code](https://github.com/mapbox/mapbox-gl-js/blob/85ff58ce6730b6cefe0e9ce22b464d7cce16c74b/src/geo/projection/globe.js).

<img src="demo.webp" alt="Animated 3D globe demo" />

## Future Improvements (TODO)

-   Shader should use texture slices (not one giant texture).
-   Progressive load more detailed tiles. Preload textures at the max zoom level, then overlay lower quality images on them, and then overlay higher quality tiles as they arrive!
-   Prioritize loading tiles the user is currently viewing.
-   Prevent the loading of tiles not within the user's view.
-   Retry to load images if initial loading fails.
-   Fix the rotation speed, it would be cool if dragging keeps the same spot under the mouse (until it's off the globe obviously).
    -   Rotating speed seems to be system dependent, some people it spins too fast, others it spins too slow, for me just right. :)
-   Fix the zoom speed, it's too fast as you get closer.
-   Mobile support (maybe it already does, idk).
-   There seems to be a bug in Chrome where some tiles don't get loaded.
-   Consider changing from semaphore to queue for possibly more efficient and smoother program execution.

## Development

For development, Node.js is a prerequisite. Here is a step-by-step guide on how to download and install Node.js, then install the necessary dependencies, and finally start the demo project on different platforms.

And before you question on the ReactJS dependency, I'm lazy and this is the way I quickly start working on a web project in literally 9.545 seconds:

```bash
npx create-react-app osm-globe --template typescript
npm start
```

It sets up TypeScript, a web server, CSS compiler, static files, hot reloading, and even opens a web browser for me! I'm instantly productive.

### For MacOS

1. Install Node.js: The easiest way to install Node.js is via Homebrew. If you don't have Homebrew installed, install it first with this command in your terminal:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Then, install Node.js using Homebrew:

```bash
brew install node
```

3. Clone the project from GitHub:

```bash
git clone https://github.com/munro/osm-globe-demo.git
cd osm-globe-demo
```

4. Install the dependencies:

```bash
npm install
```

5. Run the demo:

```bash
npm start
```

Now, you should be able to view the demo at http://localhost:3000/

### For Linux

1. Install Node.js: You can use a package manager like apt to install Node.js. Open your terminal and run:

```bash
sudo apt update
sudo apt install nodejs
```

2. Follow the same steps from 3 to 5 as in MacOS instructions.

### For Windows

1. Install Node.js: Download the Node.js installer from the official website. Choose the version appropriate for your system (32-bit or 64-bit) and follow the prompts to install Node.js.
2. Open Command Prompt and follow the same steps from 3 to 5 as in MacOS instructions.

## License

MIT
