uniform vec2 uFrequency;
uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main()
{
  
    vec3 customPos = position;
    //customPos.z *=sin(uv.x);
    
    vec4 modelPosition = modelMatrix * vec4(customPos, 1.0);

    float angle = uv.x*6.29;

    float radius = 1.0;
    // conus
    //radius+=uv.y*3.;
    radius+=clamp(floor(uv.y/0.1), 0.,9.)*0.4;
    // circle
     modelPosition.y=cos(angle)*radius;
     modelPosition.x=-sin(angle)*radius;
     
    //modelPosition.x-=uv.x>0.5?modelPosition.x:0.;

    
    // float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    // elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    // modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    
    gl_Position = projectedPosition;

    vUv = uv;
    // /vElevation = elevation;
}