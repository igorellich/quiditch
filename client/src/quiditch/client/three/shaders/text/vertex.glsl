uniform float uTime;
varying vec2 vUv;


void main()
{
  
       
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float angle = uv.x*6.29;

    float radius = 4.0;
    // stepped conus    
    float stepsNum = 10.;
    float radiusStep  = 0.4;
    radius+=clamp(floor(uv.y*stepsNum), 0.,stepsNum-1.)*radiusStep;
    // circle
     modelPosition.y=cos(angle)*radius;
     modelPosition.x=-sin(angle)*radius;   

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    vUv = uv;
   
}