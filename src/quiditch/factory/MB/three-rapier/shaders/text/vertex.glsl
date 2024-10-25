uniform float uTime;
varying vec2 vUv;
uniform float uRadius;

void main()
{
  
    float rad = uRadius;   
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float angle = uv.x*6.29;

    
    // stepped conus    
    float stepsNum = 10.;
    float radiusStep  = 2.;
    rad+=clamp(floor(uv.y*stepsNum), 0.,stepsNum-1.)*radiusStep;
    // circle
     modelPosition.y=cos(angle)*rad;
     modelPosition.x=-sin(angle)*rad;   

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    vUv = uv;
   
}