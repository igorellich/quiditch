uniform float uTime;
uniform sampler2D uPerlineTexture;
uniform vec2 uFrequency;
uniform vec2 uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uPow;
varying vec2 vUv;

void main()
{
    // vec4 textureColor = texture2D(uTexture, vUv);
    // textureColor.rgb *= vElevation * 2.0 + 0.65;
    // gl_FragColor = textureColor;
    vec2 grassUv = vUv;
    grassUv.x *= 10.0;
    grassUv.y *= 10.0;
    grassUv.x+=uTime*0.1;
    grassUv.y+=uTime*0.1;

    grassUv.x=mod(grassUv.x,10.0);
    //grassUv.y=mod(grassUv.y,10.0);
    
    
    vec3 color = mix(uColor1, uColor2, 
   // sin((vUv.y - uTime*uSpeed.y)*uFrequency.y)
    // /*
    cos((vUv.x - uTime*uSpeed.x)*uFrequency.x)
    *pow(texture(uPerlineTexture, grassUv).r, uPow)
    );
     gl_FragColor = vec4(color, 1.0);
}