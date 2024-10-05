import { AdditiveBlending, Color, Material, PointsMaterial, ShaderMaterial, Texture, Vector2 } from "three";
import { ITickable } from "../../../../../engine/base/ITickable";
import vertexGround from "../shaders/galaxy/vertex.glsl";
import fragmentGrond from "../shaders/galaxy/fragment.glsl";
export class GalaxyMaterial implements ITickable{

    private readonly _shaderMaterial:ShaderMaterial;
    constructor (){
        this._shaderMaterial = new ShaderMaterial({
            // vertexShader:vertexGround,
            // fragmentShader:fragmentGrond,
            uniforms:
            {
               
            }
        })
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        //this._shaderMaterial.uniforms.uTime.value = elapsedTime
    }
    public getMaterial():Material{
        return new ShaderMaterial({
            //size: 0.005,
            //sizeAttenuation: true,
            depthWrite: false,
            blending: AdditiveBlending,
            vertexColors: true
        })
       // return this._shaderMaterial;
    }
    
}