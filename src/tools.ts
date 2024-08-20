import { BufferAttribute, BufferGeometry, TypedArray } from "three";

export const createCircleBuffer32Array = (radius: number, pointsCount: number = 1000):{verticies:Float32Array, indicies:Uint32Array}=>{
    const stepSize = 2*Math.PI/pointsCount;
    const buffer = new Float32Array(pointsCount*2);
    for(let i= 0;i<pointsCount;i++){
        const angle = stepSize*i;
        buffer[2*i] = Math.cos(angle)*radius
        buffer[2*i+1] = Math.sin(angle)*radius;
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute('position',new BufferAttribute(buffer,2));

    return {verticies:geometry.attributes.position.array as Float32Array, indicies: new Uint32Array(geometry.index?.array as TypedArray)};
}