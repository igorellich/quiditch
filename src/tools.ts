import { BufferAttribute, BufferGeometry, TypedArray } from "three";

export const createCircleBuffer32Array = (radius: number, pointsCount: number = 1000):{verticies:Float32Array, indicies:Uint32Array}=>{
    const stepSize = 2*Math.PI/pointsCount;
    const buffer = new Float32Array(pointsCount*2);
    for(let i= 0;i<pointsCount;i++){
        const angle = stepSize*i;
        buffer[2*i] = Math.sin(angle)*radius//x
        buffer[2*i+1] = Math.cos(angle)*radius;//y
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute('position',new BufferAttribute(buffer,2));

    return {verticies:geometry.attributes.position.array as Float32Array, indicies: new Uint32Array(geometry.index?.array as TypedArray)};
}

export const createArenaBuffer32Array = (radius: number, length: number): Float32Array=>{
    const circlePointsCount = radius*10;
   
    
    const circleBuffer = new Float32Array(circlePointsCount*2);
    const stepSize = 2*Math.PI/circlePointsCount;
    for(let i= 0;i<circlePointsCount;i++){
        const angle = stepSize*i;
        circleBuffer[2*i] = Math.sin(angle)*radius
        circleBuffer[2*i+1] = Math.cos(angle)*radius;
    }

    const lengthPointsCount = length*10;
    const arenaBuffer = new Float32Array((circlePointsCount+lengthPointsCount*2)*2);
    // переносим точки правой половины окружности
    let startIndex = 0;
    for(let i=0; i<circlePointsCount/2; i++){
        arenaBuffer[2*(startIndex+i)] = circleBuffer[2*i] + length/2;//x
        arenaBuffer[2*(startIndex+i)+1] = circleBuffer[2*i+1];//y
    }
    startIndex = circlePointsCount/2;
    const lengthStepSize = length/lengthPointsCount;
    // нижняя линия
    for(let i=0; i<lengthPointsCount; i++){
        
        arenaBuffer[2*(startIndex+i)] = arenaBuffer[startIndex*2-2] - lengthStepSize*i;//x
        arenaBuffer[2*(startIndex+i)+1] = arenaBuffer[startIndex*2-1];//y
        
    }

      // переносим точки левой половины окружности
      startIndex = circlePointsCount/2+lengthPointsCount;
      for(let i=0; i<circlePointsCount/2; i++){
        arenaBuffer[2*(startIndex+i)] = circleBuffer[2*(circlePointsCount/2+i)] - length/2;//x
        arenaBuffer[2*(startIndex+i)+1] = circleBuffer[2*(circlePointsCount/2+i)+1];//y
    }

     // верхняя линия
     startIndex = circlePointsCount+lengthPointsCount;
     for(let i=0; i<lengthPointsCount; i++){
        
        arenaBuffer[2*(startIndex+i)] = arenaBuffer[startIndex*2-2] + lengthStepSize*i;//x
        arenaBuffer[2*(startIndex+i)+1] = arenaBuffer[startIndex*2-1];//y
        
    }
    return arenaBuffer;


}

export const createArenaBuffer32Array3D = (radius: number, length: number, zIndex: number):Float32Array=>{
    const twoDBuffer = createArenaBuffer32Array(radius, length);
    const arenaBuffer3D = new Float32Array(twoDBuffer.length*3);
    for(let i=0; i<twoDBuffer.length/2;i++){
        arenaBuffer3D[3*i] = twoDBuffer[2*i];
        arenaBuffer3D[3*i+1] = twoDBuffer[2*i+1];
        arenaBuffer3D[3*i+2] = zIndex;
    }
    let start = arenaBuffer3D.length/2;
    for(let i=0; i<twoDBuffer.length/2;i++){
        arenaBuffer3D[start + 3*i] = twoDBuffer[2*i];
        arenaBuffer3D[start +3*i+1] = twoDBuffer[2*i+1];
        arenaBuffer3D[start +3*i+2] = zIndex+1;
    }
    return arenaBuffer3D;

}