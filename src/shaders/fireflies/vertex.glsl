uniform float uPixelRatio; // assigned by script.js
uniform float uSize;
uniform float uTime;

attribute float aScale;

void main() 
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.x += uTime;
    modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.2 + 0.25;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / - viewPosition.z); // resize fireflies while zooming/orbiting view
}