# Japanese Garden using Three.js
Inspired by a recent trip to Chicago's Japanese Garden. Modeled in 3DS Max. UV Mapping and Texture Baking in Blender, then exported to GLTF. Custom Vertex and Fragment GLSL shaders for the water, portal, and fireflies. Based off from Bruno Simon's [Three.js Journey course](https://threejs-journey.xyz/).

Screenshot <br />
![Japanese Garden](./japanese_garden.gif)

Baked Texture map done using Blender <br />
![Texture map](./baked_japanese_garden.jpg)



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


## Reference for future ideas

### Bend shader
from http://wholcman.github.io/bend-modifier-3d/


### Vegetation animation code
From [Chapter 16. Vegetation Procedural Animation and Shading in Crysis](https://developer.nvidia.com/gpugems/gpugems3/part-iii-rendering/chapter-16-vegetation-procedural-animation-and-shading-crysis)
