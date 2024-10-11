
varying vec3 vColor;
void main()
{
     //Disk
     // float strength = distance(gl_PointCoord, vec2(0.5));
     // strength = step(0.5, strength);
     // strength = 1.0-strength;
     
     // Diffuse point
     // float strength = distance(gl_PointCoord, vec2(0.5));
     // strength *=2.0;
     // strength = 1.0 - strength;
     // gl_FragColor = vec4(vec3(strength), 1.0);

     // Light point pattern
     float strength = distance(gl_PointCoord, vec2(0.5));
     strength = 1.0 - strength;
     strength = pow(strength,10.0);
     //vec3 color = mix(vec3(0.0),vColor,strength);
     gl_FragColor = vec4(vColor, strength);
}