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
    renderer.setClearColor(0x333333);
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
    // scene.add(new THREE.AxesHelper(100))

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

    var sphereGeom = new THREE.SphereGeometry(earthRadius, 100, 16);

    // var earthTexture = THREE.ImageUtils.loadTexture( 'images/earth.jpg' );
    var earthMaterial = new THREE.MeshBasicMaterial({});
    var earth = new THREE.Mesh(sphereGeom, earthMaterial);
    earth.position.set(0, 0, 0);
    scene.add(earth);

    // create custom material from the shader code above
    //   that is within specially labeled script tags

    var troposhpere = addLayer(earth, earthRadius, earthRadius + 2, 0xff0000)
    layers.push(troposhpere);

    var stratoshpere = addLayer(earth, earthRadius + 2, earthRadius + 4, 0x00ff00)
    layers.push(stratoshpere);

    var mesoshpere = addLayer(earth, earthRadius + 4, earthRadius + 6, 0x0000ff)
    layers.push(mesoshpere);

    var termoshpere = addLayer(earth, earthRadius + 6, earthRadius + 8, 0x00f0ff)
    layers.push(termoshpere);

    var exoshpere = addLayer(earth, earthRadius + 8, earthRadius + 10, 0xfff0ff)
    layers.push(exoshpere);

    for (var i = layers.length - 1; i >= 0; i--) {
        scene.add(layers[i])
    }

    var earthTextureLoader = new THREE.TextureLoader();

    earthTextureLoader.load("textures/earth_texture.jpg",
        function (texture) {
            earthMaterial.map = texture;
            earthMaterial.needsUpdate = true;
            render();
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
            var plane = gltf.scene;
            plane.position.set(0, earthRadius + 4, 2)
            plane.scale.set(.2, .2, .2)
            plane.rotateY(-Math.PI / 3)
            plane.rotateZ(-.4)
            scene.add(plane)
            render();
        }, undefined,
        function (err) {
            console.error(err);
        }
    )

    var gltf_loader_airplane = new GLTFLoader();
    gltf_loader_airplane.load("3d_models/boeing787_8.glb",
        function (gltf) {
            var plane = gltf.scene;
            plane.position.set(0, earthRadius + 7, 2)
            plane.scale.set(1.5, 1.5, 1.5)
            plane.rotateY(-Math.PI / 3)
            plane.rotateZ(-.4)
            scene.add(plane)
            render();
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

    camera.position.set(0, earthRadius + 3, 20);
    orbit.target = new THREE.Vector3(0, earthRadius + 3, 0);
    orbit.update();

    // altitudeMeter = new THREE


    addAltitudeLabels();
    render();
    // animate();
}

function render() {
    // for(var i = 0; i < layers.length; i++){
    //     // layers[i].material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, layers[i].position);
    //     // layers[i].lookAt(camera.position)
    // }

    // orbit.update();
    renderer.render(scene, camera);
}

function animate() {
    render();
    requestAnimationFrame(animate);
}

function addLayer(mesh, innerRadius, outerRadius, color) {
    var material = new THREE.ShaderMaterial(
        {
            uniforms:
            {
                "c": { type: "f", value: 1 },
                "p": { type: "f", value: 0 },
                glowColor: { type: "c", value: new THREE.Color(color) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: .2
        });

    var basicMat = new THREE.MeshBasicMaterial({
        color: color, transparent: true, opacity: .2,
        side: THREE.DoubleSide,
        depthWrite: false,

    })
    var layer = new THREE.Mesh(new THREE.RingGeometry(innerRadius, outerRadius, 60), basicMat);
    layer.position.copy(mesh.position);
    // layer.scale.multiplyScalar(1.2);
    // scene.add(layer);
    // layer.rotateY(Math.PI / 2)

    return layer;
}

let altLabels = ["~ ၁၃ ကီလုိမီတာ", "~ ၅၀ ကီလုိမီတာ", "~ ၈၀ - ၈၅ ကီလုိမီတာ", "~ ၅၀၀- ၆၀၀ ကီလုိမီတာ"]
let altLoc = [2, 4, 6, 8]

function addAltitudeLabels(){
    var loader = new THREE.FontLoader();
    loader.load('styles/Zawgyi-One_Regular.json', function(font) {
        // label_font = font;

        var color = 0xff0000;

        var matLite = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });

        for(var i = 0; i < altLabels.length; i++){
            var message = altLabels[i];

            var shapes = font.generateShapes(message, .2);
    
            var geometry = new THREE.ShapeBufferGeometry(shapes);
    
            geometry.computeBoundingBox();
    
            var xMid = - (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    
            geometry.translate(xMid - 1, -.1, 0);
            // geometry.rotateZ(Math.PI )
            // geometry.rotateX(-Math.PI / 2)
            // geometry.rotateZ(Math.PI / 4)
    
            var text_alt = new THREE.Mesh(geometry, matLite);
            text_alt.position.y = earthRadius + altLoc[i];

            // text_alt.position.x = side_length_y / 2 + .1;
            // text_alt.position.y = side_length_x / 2 + .1;
            
            scene.add(text_alt);
        }
    })
}

init()
