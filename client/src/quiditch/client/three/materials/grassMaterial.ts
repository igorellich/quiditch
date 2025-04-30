import { Color, RepeatWrapping, ShaderMaterial, Texture, TextureLoader, Uniform, Vector2 } from "three";
import { ITickable } from "@common/ITickable";
import vertexGround from "../shaders/grass/vertex.glsl";
import fragmentGrond from "../shaders/grass/fragment.glsl";
import GUI from "lil-gui";
export class Grassmaterial implements ITickable{

    private readonly _shaderMaterial:ShaderMaterial;

    public readonly gui: GUI = new GUI({
        width: 300,
        title: "Grass",
    

    });
    constructor (){
        const debugObj={
            color1:"#1fc733",
            color2:"#19540d"
        }
        const textureLoader = new TextureLoader();
        const perlinTexture = textureLoader.load("textures/perlin.png");
        perlinTexture.wrapS = RepeatWrapping;
        perlinTexture.wrapT = RepeatWrapping;
        this._shaderMaterial = new ShaderMaterial({
            vertexShader:vertexGround,
            fragmentShader:fragmentGrond,
            uniforms:
            {
                uFrequency: { value: new Vector2(10, 0.1) },
                uSpeed: { value: new Vector2(0.1, 0.1) },
                uPerlineTexture:new Uniform(perlinTexture),
                uTime: { value: 0 },
                uColor1:{value:new Color(debugObj.color1)},
                uColor2:{value:new Color(debugObj.color2)},   
                uPow:{value:3},               
            }
        })
        this.gui.add(this._shaderMaterial.uniforms.uFrequency.value,'x')
        .min(0.1).max(10).step(0.1).name('uFrequency.x')
        this.gui.add(this._shaderMaterial.uniforms.uFrequency.value,'y')
        .min(0.1).max(10).step(0.1).name('uFrequency.y')

        this.gui.add(this._shaderMaterial.uniforms.uSpeed.value,'x')
        .min(0.1).max(10).step(0.1).name('uSpeed.x')
        this.gui.add(this._shaderMaterial.uniforms.uSpeed.value,'y')
        .min(0.1).max(10).step(0.1).name('uSpeed.y')

        this.gui.add(this._shaderMaterial.uniforms.uPow,'value')
        .min(0.1).max(10).step(0.1).name('uPow')

        this.gui.addColor(debugObj, 'color1').name('color1')
        .onChange(
            () => this._shaderMaterial.uniforms.uColor1.value.set(debugObj.color1)
        )
        this.gui.addColor(debugObj, 'color2').name('color2')
        .onChange(
            () => this._shaderMaterial.uniforms.uColor2.value.set(debugObj.color2)
        )
    }
    async tick(elapsedTime: number, deltaTime: number): Promise<void> {
        this._shaderMaterial.uniforms.uTime.value = elapsedTime
    }
    public getMaterial():ShaderMaterial{
        return this._shaderMaterial;
    }
    
}