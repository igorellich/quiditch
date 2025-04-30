uniform float uTime;
uniform sampler2D uPerlineTexture;

varying vec2 vUv;

#include ./rotate2D.glsl

void main()
{
    vec3 newPosition = position;
    float twistPerilin = texture(
        uPerlineTexture, 
        vec2(0.5, uv.y*0.2 - uTime*0.005)).r;

    float angle = twistPerilin*10.0;
    newPosition.xy = rotate2D(newPosition.xy,angle);

    // wind offset
    vec2 windOffset = vec2(
        texture(uPerlineTexture,vec2(0.25, uTime*0.01)).r - 0.5,
        texture(uPerlineTexture,vec2(0.75, uTime*0.01)).r - 0.5
    );
    windOffset *= pow(uv.y,2.0)*10.0;
    newPosition.xy+=windOffset;
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
}