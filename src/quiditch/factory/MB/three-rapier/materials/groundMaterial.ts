import { Color, ShaderMaterial, Texture, Vector2 } from "three";
import { ITickable } from "../../../../../engine/base/ITickable";
import vertexGround from "../shaders/ground/vertex.glsl";
import fragmentGrond from "../shaders/ground/fragment.glsl";
export class GroundMaterial implements ITickable{

    private readonly _shaderMaterial:ShaderMaterial;
    constructor (texture:Texture){
        this._shaderMaterial = new ShaderMaterial({
            vertexShader:vertexGround,
            fragmentShader:fragmentGrond,
            uniforms:
            {
                uFrequency: { value: new Vector2(10, 5) },
                uTime: { value: 0 },
                uColor: { value: new Color('orange') },
                uTexture: { value: texture }
            }
        })
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        this._shaderMaterial.uniforms.uTime.value = elapsedTime
    }
    public getMaterial():ShaderMaterial{
        return this._shaderMaterial;
    }
    
}