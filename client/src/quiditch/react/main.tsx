import * as React from 'react';
import {createRoot} from "react-dom/client";
import Rapier from "@dimforge/rapier2d-compat"
import { Game } from './view/Game';
import { BaseState } from '@common/BaseState';
import { Provider } from 'react-redux';
import store from './store/store';

const initClient = async (): Promise<void> => {
    const currStatesStr = window.localStorage.getItem("quiditchStates");
    let clientId = window.localStorage.getItem("clientId") as string;
    if (!clientId) {
        clientId = Math.random().toString();
        window.localStorage.setItem("clientId", clientId);
    }
    let currStates: BaseState[] = currStatesStr && currStatesStr != "undefined" ? JSON.parse(currStatesStr) : [];
    await Rapier.init(); 
    const root = createRoot(document.getElementById('app') as HTMLElement)
   
    
  
   root.render(
   <Provider store={store}>
        <Game savedStates={currStates} clientId={clientId}/>
   </Provider>
   )
  
 
   

    //const debugRenderer = new RapierDebugRenderer(scene, world, 5);
    //sceneManager.addTickable(debugRenderer);



    
  
}



const client1 = await initClient();
//const client2 = await initClient("2");















// Controls












// const targetMesh = new Mesh(new SphereGeometry(0.1,16,32), new MeshBasicMaterial({color:"red"}));
// scene.add(targetMesh)
// const targetPointGetter = (event)=>{
//     let result: Vector2d = null;
//     const rect = canvas.getBoundingClientRect();
//     const clientX = (event as MouseEvent).clientX||(event as TouchEvent).touches[0].clientX;
//     const clientY = (event as MouseEvent).clientY||(event as TouchEvent).touches[0].clientY;
//     let viewportDown = new Vector2();
//     viewportDown.x = (((clientX - rect.left) / rect.width) * 2) - 1;
//     viewportDown.y = - (((clientY - rect.top) / rect.height) * 2) + 1;

//     const mesh = ((plane as MeshBasedActor).getMesh() as ThreeBasedMesh).getMesh();
//     const rayCaster = new Raycaster();
//     rayCaster.setFromCamera(viewportDown, sceneManager.getCamera());
   
//     const intersectResult = rayCaster.intersectObject(mesh);
//     if (intersectResult.length > 0) {
//         result = new Vector2d(intersectResult[0].point.x, intersectResult[0].point.y);
//         targetMesh.position.set(intersectResult[0].point.x, intersectResult[0].point.y, 2);
        
//     }
//     return result;
// }
// document.addEventListener('click', (e) => {
            
//     targetInputController.setTargerPoint(targetPointGetter(e));
// })
// document.addEventListener('touchend', (e) => {
//     targetInputController.setTargerPoint(targetPointGetter(e));
// })

