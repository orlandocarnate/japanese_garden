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

### Vegetation animation code
From [Chapter 16. Vegetation Procedural Animation and Shading in Crysis](https://developer.nvidia.com/gpugems/gpugems3/part-iii-rendering/chapter-16-vegetation-procedural-animation-and-shading-crysis)

```
            // Phases (object, vertex, branch)    
            float fObjPhase = dot(worldPos.xyz, 1); 
            fBranchPhase += fObjPhase; 
            float fVtxPhase = dot(vPos.xyz, fDetailPhase + fBranchPhase); 
            // x is used for edges; y is used for branches    
            float2 vWavesIn = fTime + float2(fVtxPhase, fBranchPhase ); 
            // 1.975, 0.793, 0.375, 0.193 are good frequencies    
            float4 vWaves = (frac( vWavesIn.xxyy * float4(1.975, 0.793, 0.375, 0.193) ) * 2.0 - 1.0 ) * fSpeed * fDetailFreq; 
            vWaves = SmoothTriangleWave( vWaves ); 
            float2 vWavesSum = vWaves.xz + vWaves.yw; 
            // Edge (xy) and branch bending (z) 
            vPos.xyz += vWavesSum.xxy * float3(fEdgeAtten * fDetailAmp * vNormal.xy, fBranchAtten * fBranchAmp); 

            // Bend factor - Wind variation is done on the CPU.    
            float fBF = vPos.z * fBendScale; 
            // Smooth bending factor and increase its nearby height limit. 
            fBF += 1.0; 
            fBF *= fBF; 
            fBF = fBF * fBF - fBF; 
            // Displace position    
            float3 vNewPos = vPos; 
            vNewPos.xy += vWind.xy * fBF; 
            // Rescale 
            vPos.xyz = normalize(vNewPos.xyz)* fLength; 
```