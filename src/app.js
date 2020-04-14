var THREE = require("three");
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader, GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

import { Mesh, Sphere, RedIntegerFormat } from 'three';

var scene, camera, renderer, orbit;
var perspective_camera;
var ball;
var pointLight;
var toposphere;
let layers = []
const earthRadius = 10;
const twoPI = Math.PI * 2;
var plane, satellite;
var isCloudLoaded = false;
var isPlaneLoaded = false;
var isSatelliteLoaded = false;
var earth;

let altitudeMeter;
var clipPlanes = [
    new THREE.Plane(new THREE.Vector3(1, 0, 0), 10)

]


function init() {
    var view_3d = document.getElementById("view-3d");

    var body = document.body,
        html = document.documentElement;

    var height = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);

    view_3d.style.width = 100 + "%"
    view_3d.style.height = height + "px";

    var position_info = view_3d.getBoundingClientRect();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.canvas = view_3d;
    renderer.localClippingEnabled = true;

    renderer.setSize(position_info.width, position_info.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x222222);
    view_3d.appendChild(renderer.domElement);

    perspective_camera = new THREE.PerspectiveCamera(45, position_info.width / position_info.height, 1, 1000);

    var orthographicCamera = new THREE.OrthographicCamera(position_info.width / -2, position_info.width / 2, position_info.height / 2, position_info.height / -2, .01, 14000);

    // orthographicCamera.lookAt(0, 0, 0);
    orthographicCamera.zoom = 20;

    camera = perspective_camera;
    camera.position.set(40, 0, 0)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    camera.updateProjectionMatrix()

    scene = new THREE.Scene();

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.addEventListener("change", render)
    orbit.saveState();
    // orbit.enableDamping = true;
    // orbit.dampingFactor = .18;

    //// start adding graphics
    // scene.add(new THREE.AxesHelper(30))

    // var ambient = new THREE.AmbientLight(0xffffff, 0.3);
    // scene.add(ambient);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(50, 50, 50);

    //  scene.add(spotLight)

    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    //    scene.add( hemiLight );
    hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    // scene.add( hemiLight );

    var dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(100, 50, 100);
    dirLight.position.multiplyScalar(30);
    //scene.add( dirLight );

    var dirLight1 = new THREE.DirectionalLight(0xffffff, 2);
    // dirLight1.color.setHSL(0.1, 1, 0.95);
    dirLight1.position.set(0, 20, 30);
    dirLight1.position.multiplyScalar(30);
    scene.add(dirLight1);

    pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.copy(camera.position);
    scene.add(pointLight);

    var spotLight1 = new THREE.SpotLight(0xffffff);
    spotLight1.position.set(-50, -50, -50);

    scene.add(spotLight1)

    var sphereGeom = new THREE.SphereBufferGeometry(earthRadius, 100, 100);

    // var earthTexture = THREE.ImageUtils.loadTexture( 'images/earth.jpg' );
    var earthMaterial = new THREE.MeshBasicMaterial({});
    earth = new THREE.Mesh(sphereGeom, earthMaterial);
    earth.position.set(0, 0, 0);
    // earth.rotateX(.5)
    // earth.rotateX(Math.PI / 2)
    
    scene.add(earth);

    // create custom material from the shader code above
    // that is within specially labeled script tags

    var troposhpere = addLayer(earth, earthRadius, earthRadius + 2, 0xf2b500)
    layers.push(troposhpere);

    var stratoshpere = addLayer(earth, earthRadius + 2, earthRadius + 4, 0xC4B3C2)
    layers.push(stratoshpere);

    var mesoshpere = addLayer(earth, earthRadius + 4, earthRadius + 6, 0x85a7f7)
    layers.push(mesoshpere);

    var termoshpere = addLayer(earth, earthRadius + 6, earthRadius + 8, 0x033B7B)
    layers.push(termoshpere);

    var exoshpere = addLayer(earth, earthRadius + 8, earthRadius + 10, 0x110C22)
    layers.push(exoshpere);

    for (var i = layers.length - 1; i >= 0; i--) {
        scene.add(layers[i])
    }

    var earthTextureLoader = new THREE.TextureLoader();

    earthTextureLoader.load("textures/earth_texture.jpg",
        function (texture) {
            earthMaterial.map = texture;
            earthMaterial.needsUpdate = true;
            
            isCloudLoaded = true;
            render();
            
            if(isSatelliteLoaded && isPlaneLoaded){
                animate();
            }
        },
        undefined,
        function (err) {
            console.log("error in loading texture :( ");
        }
    )

    var spriteMap = new THREE.TextureLoader().load("images/cloud.png");
    var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, transparent: true, alphaTest: 0.1, side: THREE.DoubleSide });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 1, 1)
    sprite.position.set(0, earthRadius + 1, 1)

    scene.add(sprite);

    var gltf_loader = new GLTFLoader();
    gltf_loader.load("3d_models/satellite_1.glb",
        function (gltf) {
            satellite = gltf.scene;
            satellite.position.set(0, earthRadius + 4, 2)
            satellite.scale.set(.15, .15, .15)
            satellite.rotateY(-Math.PI / 3)
            satellite.rotateZ(-.4)
            scene.add(satellite)
            render();

            isSatelliteLoaded = true;

            if(isCloudLoaded && isPlaneLoaded){
                animate();
            }
        }, undefined,
        function (err) {
            console.error(err);
        }
    )

    var gltf_loader_airplane = new GLTFLoader();
    gltf_loader_airplane.load("3d_models/B_787_8.glb",
        function (gltf) {
            plane = gltf.scene;
            plane.position.set(0, earthRadius + 7, 0)
            plane.scale.set(.9, .9, .9)
            plane.rotation.y = -(Math.PI / 2)
            plane.rotation.z = -.1
            plane.rotateX(-Math.PI / 2)
            scene.add(plane)
            render();

            isPlaneLoaded = true;

            if(isCloudLoaded && isSatelliteLoaded){
                animate();
            }
        }, undefined,
        function (err) {
            console.error(err);
        }
    )

    // var loader = new STLLoader();
    // loader.load("../3d_models/Block_Island_08152013.stl", function (geometry) {
        
    //     var mat = new THREE.MeshLambertMaterial({ color: 0x444444 });
    //     var meteor = new THREE.Mesh(geometry, mat);
    //     meteor.position.set(0, earthRadius + 9, 2)
    //     meteor.scale.set(0.008, 0.008, 0.008);
    //     scene.add(meteor);
    // });

    var helpers = new THREE.Group();
    helpers.add(new THREE.PlaneHelper(clipPlanes[0], 100, 0xff0000));

    camera.position.set(0, earthRadius + 3, 25);
    orbit.target = new THREE.Vector3(0, earthRadius + 3, 0);
    orbit.update();

    // altitudeMeter = new THREE

    addAltitudeLabels();
    addLayerLabels();
    render();
}

function render() {
    // for(var i = 0; i < layers.length; i++){
    //     // layers[i].material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, layers[i].position);
    //     // layers[i].lookAt(camera.position)
    // }

    // orbit.update();
    renderer.render(scene, camera);
}

let clock = new THREE.Clock();
var elapsed;
const time_to_orbit_plane = 10;
var angForPlane;
var angForPlane1;
var lastElapsed = 0;
var delta;
var planeRotationAxis = new THREE.Vector3(0,  3, -1).normalize()
var xForPlane, yForPlane;
var xForSat, yForSat;

function animate() {
    
    requestAnimationFrame(animate);

    elapsed = clock.getElapsedTime();

    delta = elapsed - lastElapsed;
    
    angForPlane = (delta / time_to_orbit_plane) * twoPI;
    angForPlane1 = (elapsed / time_to_orbit_plane) * twoPI;

    xForPlane = Math.cos(angForPlane1);
    yForPlane = Math.sin(angForPlane1);
    
    plane.rotateX(angForPlane)

    plane.position.x = xForPlane * (earthRadius + 2.5);
    plane.position.y = yForPlane * (earthRadius + 2.5);
    plane.position.z = 1;

    xForSat = Math.cos(angForPlane1 - 2.2);
    yForSat = Math.sin(angForPlane1 - 2.2);

    satellite.rotateX(angForPlane)

    satellite.position.x = xForSat * (earthRadius + 5);
    satellite.position.y = yForSat * (earthRadius + 5);
    satellite.position.z = 1;

    // earth.rotation.y = -angForPlane1 / 4;
    earth.rotateOnWorldAxis( planeRotationAxis, angForPlane / 6)

    lastElapsed = elapsed;
    render();
}

function addLayer(mesh, innerRadius, outerRadius, color) {
    // var material = new THREE.ShaderMaterial(
    //     {
    //         uniforms:
    //         {
    //             "c": { type: "f", value: 1 },
    //             "p": { type: "f", value: 0 },
    //             glowColor: { type: "c", value: new THREE.Color(color) },
    //             viewVector: { type: "v3", value: camera.position }
    //         },
    //         vertexShader: document.getElementById('vertexShader').textContent,
    //         fragmentShader: document.getElementById('fragmentShader').textContent,
    //         side: THREE.BackSide,
    //         blending: THREE.AdditiveBlending,
    //         transparent: true,
    //         opacity: .2
    //     });

    var basicMat = new THREE.MeshBasicMaterial({
        color: color, transparent: true, opacity: .4,
        side: THREE.DoubleSide,
        depthWrite: false,

    })
    var layer = new THREE.Mesh(new THREE.RingBufferGeometry(innerRadius, outerRadius, 100), basicMat);
    layer.position.copy(mesh.position);

    return layer;
}

let altLabels = ["~ ၁၃ ကီလုိမီတာ", "~ ၅၀ ကီလုိမီတာ", "~ ၈၀ - ၈၅ ကီလုိမီတာ", "~ ၅၀၀- ၆၀၀ ကီလုိမီတာ"]
let altLoc = [2, 4, 6, 8]

function addAltitudeLabels(){
    var loader = new THREE.FontLoader();
    loader.load('styles/Zawgyi-One_Regular.json', function(font) {

        var color = 0x779efb;

        var matLite = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });

        for(var i = 0; i < altLabels.length; i++){
            var message = altLabels[i];

            var shapes = font.generateShapes(message, .3);
    
            var geometry = new THREE.ShapeBufferGeometry(shapes);
    
            geometry.computeBoundingBox();
    
            var xMid = - (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    
            geometry.translate(xMid / 2, -.2, 0);    

            var text_alt = new THREE.Mesh(geometry, matLite);
            
            text_alt.rotateZ( .4);
            
            
            var x = Math.cos(Math.PI / 2 + .3);
            var y = Math.sin(Math.PI / 2 + .3);
            text_alt.position.y = y * (earthRadius + altLoc[i]);
            text_alt.position.x = x * (earthRadius + altLoc[i]);
            text_alt.position.z = .1;
            
            scene.add(text_alt);
        }
    })
}

let layerLabels = ["ထရိုပိုစဖီးယား", "အိုဇုန္းလႊာ", "စတရာတိုစဖီးယား", "မီဆိုစဖီးယား", "သာမိုစဖီးယား", "အိပ္ဇိုစဖီးယား"]
let layerLoc = [1, 2.5, 3.3, 5, 7, 9]

function addLayerLabels(){
    var loader = new THREE.FontLoader();
    loader.load('styles/Zawgyi-One_Regular.json', function(font) {

        var color = 0x70c409;

        var matLite = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });

        for(var i = 0; i < layerLabels.length; i++){
            var message = layerLabels[i];

            var shapes = font.generateShapes(message, .3);
    
            var geometry = new THREE.ShapeBufferGeometry(shapes);
            geometry.computeBoundingBox();
    
            var text_alt = new THREE.Mesh(geometry, matLite);

            var xMid = - (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
            geometry.translate(xMid / 2, -.1, 0);

            text_alt.rotateZ(- .4);
            
            var x = Math.cos(Math.PI / 2 - .3);
            var y = Math.sin(Math.PI / 2 - .3);
            text_alt.position.y = y * (earthRadius + layerLoc[i]);
            text_alt.position.x = x * (earthRadius + layerLoc[i]);
            text_alt.position.z = .1;

            scene.add(text_alt);
        }
    })
}

init()
