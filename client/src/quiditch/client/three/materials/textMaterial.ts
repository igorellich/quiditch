import { Color, RepeatWrapping, ShaderMaterial, Texture, TextureLoader, Uniform, Vector2 } from "three";
import { ITickable } from "@common/ITickable";
import vertexGround from "../shaders/text/vertex.glsl";
import fragmentGrond from "../shaders/text/fragment.glsl";
import GUI from "lil-gui";
export class TextMaterial implements ITickable{

    private readonly _shaderMaterial:ShaderMaterial;

    public readonly gui: GUI = new GUI({
        width: 300,
        title: "Text",
    

    });
    constructor (){
        const debugObj={
          
        }
        const textureLoader = new TextureLoader();
        const textTexture = textureLoader.load("textures/text.png");
         textTexture.wrapS = RepeatWrapping;
         textTexture.wrapT = RepeatWrapping;
        this._shaderMaterial = new ShaderMaterial({
            vertexShader:vertexGround,
            fragmentShader:fragmentGrond,
            side:2,
            blendAlpha: 0,
            transparent:true,
            //wireframe:true,
            uniforms:
            {
                
                uTextTexture:new Uniform(textTexture),
                uTime: { value: 0 },
                          
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