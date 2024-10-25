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
    float repeats = 1.;
    vec2 textUV = vUv;
    textUV.x *= repeats*200.;
    textUV.y *= repeats*10.;
   
    //textUV.x-=(sin(uTime*2.)+1.)*(repeats-1.)/2.;// from start to begin and backward
    float movementSped = 0.2;
    textUV.x-=uTime*movementSped;// circle movement
    textUV.y-=(repeats-1.)/2.;//offset
    vec4 textureColor = texture(uTextTexture, textUV);
    // textureColor.rgb *= vElevation * 2.0 + 0.65;
    // gl_FragColor = textureColor;

     //gl_FragColor = vec4(textureColor.rgb, 1.0);
     vec3 color1 = vec3(1.,0,0);
     vec3 color2 = vec3(0.,1.,0);
     vec3 textColor = mix(color1, color2, vec3(cos(uTime+textUV.x*2.)));
    float opacity = step(0.45, 1. - textureColor.r);
    vec3 backColor = vec3(0.3,max(1.-vUv.y, 0.4),max((sin(uTime*movementSped*3.)+1.)*0.5, 0.4));
    
    gl_FragColor = vec4(opacity==1.?textColor:backColor, 1.);
    //gl_FragColor = vec4(vec3(0.),1.0);
}