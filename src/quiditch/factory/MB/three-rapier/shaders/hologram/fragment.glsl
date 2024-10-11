uniform float uTime;
varying vec3 vPosition;

void main()
{
   // stripes
   float stripes = mod((vPosition.y  - uTime*0.02)*20.0,1.0);
   stripes = pow(stripes,3.0);
    gl_FragColor = vec4(vec3(stripes), stripes);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
  