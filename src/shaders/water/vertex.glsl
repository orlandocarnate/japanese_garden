// get variables from script.js using Uniforms
uniform float uWavesAmplitude;
uniform vec2 uWavesFrequency;
uniform float uTime;
uniform float uBigWavesSpeed;

varying float vElevation; // will be shared with Fragement Shader

void main()
{
    // modelMatrix is vec3
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // modify vertex positions
    // first get x position then adjust y to make Sine wave
    // y = sin(x * frequency) * sin(z * frequency) * elevation

    float elevation = sin(modelPosition.x * uWavesFrequency.x - uTime * uBigWavesSpeed) * 
                      sin(modelPosition.z * uWavesFrequency.y + uTime * uBigWavesSpeed) * 
                      uWavesAmplitude;
    modelPosition.y += elevation;

    // viewMatrix is vec3
    vec4 viewPosition = viewMatrix * modelPosition;

    // projectionMatrix  is vec3
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    // Varyings
    vElevation = elevation;

}