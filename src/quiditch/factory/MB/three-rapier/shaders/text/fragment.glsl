uniform float uTime;
uniform sampler2D uTextTexture;
uniform vec2 uFrequency;
uniform vec2 uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uPow;
varying vec2 vUv;

void main()
{
    float scale = 5.;
    vec2 textUV = vUv;
    textUV.x *= scale;
    textUV.y *= scale;
   
    textUV.x-=(sin(uTime*2.)+1.)*(scale-1.)/2.;
    textUV.y-=(scale-1.)/2.;
    vec4 textureColor = texture(uTextTexture, textUV);
    // textureColor.rgb *= vElevation * 2.0 + 0.65;
    // gl_FragColor = textureColor;

     //gl_FragColor = vec4(textureColor.rgb, 1.0);
     vec3 color1 = vec3(1.,0,0);
     vec3 color2 = vec3(0.,1.,0);
     vec3 color = mix(color1, color2, vec3(cos(uTime)));
    float opacity = step(0.45, 1. - textureColor.r);
    gl_FragColor = vec4(opacity==1.?color:vec3(0.,0.,1.0), 1.0);
}