import { Color, RepeatWrapping, ShaderMaterial, Texture, TextureLoader, Uniform, Vector2 } from "three";
import { ITickable } from "@common/engine/ITickable";
import vertexGround from "../shaders/smoke/vertex.glsl";
import fragmentGrond from "../shaders/smoke/fragment.glsl";
export class SmokeMaterial implements ITickable{

    private readonly _shaderMaterial:ShaderMaterial;
    constructor (){
        const textureLoader = new TextureLoader();
        const smokeTexture = textureLoader.load("textures/perlin.png");
        smokeTexture.wrapS = RepeatWrapping;
        smokeTexture.wrapT = RepeatWrapping;
        this._shaderMaterial = new ShaderMaterial({
            vertexShader:vertexGround,
            fragmentShader:fragmentGrond,
            depthWrite:false,
            // /wireframe:true,
            side:2,
            transparent:true,
            uniforms:
            {
                uPerlineTexture:new Uniform(smokeTexture),
                uTime: new Uniform(0),
              
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