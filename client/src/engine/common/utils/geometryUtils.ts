export const normaliseAngle= (angle:number): number=>{
    let result = angle;
    if (Math.abs(angle) > Math.PI) {
        result = angle > 0 ?angle- 2 * Math.PI: 2 * Math.PI + angle;              
    }
    return result;
}