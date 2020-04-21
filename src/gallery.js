let renderer, perspective_camera, camera, scene, orbit;
var THREE = require("three");
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


function setupScene(containerName, model){

    var view_3d = document.getElementById(containerName);
    

    var width = view_3d.getBoundingClientRect().width;
    
    view_3d.style.height = (width * .8 ) + "px";
    var position_info = view_3d.getBoundingClientRect();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.canvas = view_3d;


    renderer.setSize(position_info.width, position_info.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x222222);
    
    view_3d.appendChild(renderer.domElement);

    perspective_camera = new THREE.PerspectiveCamera(45, position_info.width / position_info.height, 1, 1000);

    // var orthographicCamera = new THREE.OrthographicCamera(position_info.width / -2, position_info.width / 2, position_info.height / 2, position_info.height / -2, .01, 14000);

    // orthographicCamera.zoom = 20;

    camera = perspective_camera;
    camera.position.set(0, 1, 3)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    camera.updateProjectionMatrix()

    scene = new THREE.Scene();

    orbit = new OrbitControls(camera, renderer.domElement);
    // orbit.addEventListener("change", render)
    orbit.autoRotate = true;
    orbit.saveState();

    var dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
    dirLight1.position.set( 20, 10, 0);
    dirLight1.position.multiplyScalar(30);
    scene.add(dirLight1);

    var dirLight2 = new THREE.DirectionalLight(0xffffff, 1);
    dirLight2.position.set( -20, 10, 0);
    dirLight2.position.multiplyScalar(30);
    scene.add(dirLight2);

    var dirLight3 = new THREE.DirectionalLight(0xffffff, 1);
    dirLight3.position.set(0, -20, -10);
    dirLight3.position.multiplyScalar(30);
    scene.add(dirLight3);

    var dirLight4 = new THREE.DirectionalLight(0xffffff, 1);
    dirLight4.position.set(0, -3, 10);
    dirLight4.position.multiplyScalar(30);
    scene.add(dirLight4);

    // add model
    
    
    model.position.set(.2, -.2, 0)
    model.rotateY(-.2)
    scene.add(model)

    // scene.add(new THREE.AxesHelper(4))


    console.log("here..")

    animate();

    
    
}

function animate(){ 
    requestAnimationFrame(animate);
    orbit.update();
    render();
}

function render(){
    renderer.render( scene, camera);
}

export {setupScene}