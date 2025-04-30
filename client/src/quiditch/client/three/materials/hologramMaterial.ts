import { Color, Material, MeshBasicMaterial, RepeatWrapping, ShaderMaterial, Texture, TextureLoader, Uniform, Vector2 } from "three";
import { ITickable } from "@common/ITickable";
import vertexGround from "../shaders/hologram/vertex.glsl";
import fragmentGrond from "../shaders/hologram/fragment.glsl";
export class HologramMaterial implements ITickable{

    private readonly _shaderMaterial:ShaderMaterial;
    constructor (){
       
        this._shaderMaterial = new ShaderMaterial({
            vertexShader:vertexGround,
            fragmentShader:fragmentGrond,
            depthWrite:false,
            // /wireframe:true,
            side:2,
            transparent:true,
            uniforms:
            {
                
                uTime: new Uniform(0),
              
            }
        })
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        this._shaderMaterial.uniforms.uTime.value = elapsedTime
    }
    public getMaterial():Material{
        
        return this._shaderMaterial;
    }
    
}