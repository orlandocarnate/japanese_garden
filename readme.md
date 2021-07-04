# Three.js Journey

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## Webpack: Installing GLSL Shaders
To use custom shaders you will need to add the appropriate loader to the `bundler/webpack.common.js` file:
```
,

    // Shaders
    {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
            'raw-loader'
        ]
    }
```