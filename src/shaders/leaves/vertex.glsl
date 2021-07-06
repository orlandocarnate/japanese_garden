// default attributes in vertex shader with Three.js
// must pass to fragment shader
// attribute vec3 position;
// attribute vec3 normal;
// attribute vec3 uv;

varying vec2 vUv;
// varying vec3 vertexNormal;

uniform float uLeavesAmplitude;
uniform vec2 uLeavesFrequency;
uniform float uTime;
uniform float uLeavesSpeed;

void main() {

    
    vUv = uv;
    // vertexNormal = normalize(normalMatrix * normal);
    
    // modelMatrix is vec3
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // modify vertex positions
    // first get x position then adjust y to make Sine wave
    // y = sin(x * frequency) * sin(z * frequency) * elevation

    float elevation = sin(modelPosition.x * uLeavesFrequency.x - uTime * uLeavesSpeed) * 
                      sin(modelPosition.y * uLeavesFrequency.y + uTime * uLeavesSpeed) * 
                      uLeavesAmplitude;
    modelPosition.z += elevation;

    // viewMatrix is vec3
    vec4 viewPosition = viewMatrix * modelPosition;

    // projectionMatrix  is vec3
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
}