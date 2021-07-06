varying vec2 vUv;

uniform sampler2D uLeavesTexture;

void main ()
{

  gl_FragColor = texture2D(uLeavesTexture, vUv);
}