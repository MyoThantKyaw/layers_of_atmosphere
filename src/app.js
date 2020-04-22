var THREE = require("three");
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {setupScene, showModel_, hideModel_, importModels} from "./gallery.js"
// import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

// import { Mesh, Sphere, RedIntegerFormat } from 'three';

let scene, camera, renderer, orbit, meteoridLightRay;
var perspective_camera;
var ball;
var pointLight;
var toposphere;
let layers = []
const earthRadius = 10;
const twoPI = Math.PI * 2;
var plane, planeClone, satellite, meteorid;
var isCloudLoaded = false;
var isPlaneLoaded = false;
var isMeteoridLoaded = false;
var isSatelliteLoaded = false;
var earth;
var cloud;


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
    // renderer.localClippingEnabled = true;

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
    // orbit.addEventListener("change", render)
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

            if (isSatelliteLoaded && isPlaneLoaded && isMeteoridLoaded) {
                animate();
            }
        },
        undefined,
        function (err) {
            console.log("error in loading texture :( ");
        }
    )

    var cloudMap = new THREE.TextureLoader().load("images/cloud.png");
    var cloudMaterial = new THREE.SpriteMaterial({ map: cloudMap, transparent: true, alphaTest: 0.1, side: THREE.DoubleSide });
    cloud = new THREE.Sprite(cloudMaterial);
    cloud.scale.set(2, 1, 1)
    cloud.position.set(0, earthRadius + 1, 1)

    scene.add(cloud);

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

            if (isCloudLoaded && isPlaneLoaded && isMeteoridLoaded) {
                finishedLoadingModels()
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
            planeClone = plane.clone();
            plane.position.set(0, earthRadius + 7, 0)
            plane.scale.set(.9, .9, .9)
            plane.rotation.y = -(Math.PI / 2)
            plane.rotation.z = -.1
            plane.rotateX(-Math.PI / 2)
            scene.add(plane)
            render();

            isPlaneLoaded = true;

            if (isCloudLoaded && isSatelliteLoaded && isMeteoridLoaded) {
                finishedLoadingModels()
            }
        }, undefined,
        function (err) {
            console.error(err);
        }
    )

    var gltf_loader_meteorid = new GLTFLoader();
    gltf_loader_meteorid.load("3d_models/Eros_1_10.glb",
        function (gltf) {
            meteorid = gltf.scene;
            meteorid.position.set(0, earthRadius + 12, 0);
            meteorid.scale.set(.0003, .0003, .0003);
            // meteorid.rotation.y = -(Math.PI / 2);
            meteorid.rotation.z = -.1;
            meteorid.rotateX(-Math.PI / 2);
            
            scene.add(meteorid);

            var geometryTail = new THREE.CylinderGeometry(.26, .11, 4, 32 * 2, 20, true);
            geometryTail.translate(0, .4, 0)
            geometryTail.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -geometryTail.parameters.height / 2, 0));
            geometryTail.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
            

            var materialTail = new THREEx.VolumetricSpotLightMaterial();
            // materialTail.alphaTest = 0

            meteoridLightRay = new THREE.Mesh(geometryTail, materialTail);
            meteoridLightRay.position.set(earthRadius + 2, 2, 2)
        
            // light_ray.lookAt(fl_target_loc)
            materialTail.uniforms.lightColor.value.set('white')
            materialTail.uniforms.spotPosition.value = meteoridLightRay.position
            scene.add(meteoridLightRay);

            render();

            isMeteoridLoaded = true;

            if (isCloudLoaded && isSatelliteLoaded && isPlaneLoaded) {
                finishedLoadingModels()
            }
        }, undefined,
        function (err) {
            console.error(err);
        }
    )


    var helpers = new THREE.Group();
    helpers.add(new THREE.PlaneHelper(clipPlanes[0], 100, 0xff0000));

    camera.position.set(0, earthRadius + 3, 25);
    orbit.target = new THREE.Vector3(0, earthRadius + 3, 0);
    orbit.enableDamping = true;
    orbit.dampingFactor = .1;
    orbit.update();

    // Ozone Layer
    // var material_ozone = new THREE.ShaderMaterial(
    //     {
    //         uniforms:
    //         {
    //             "c": { type: "f", value: .1 },
    //             "p": { type: "f", value: 3 },
    //             glowColor: { type: "c", value: new THREE.Color(0x413ee0) },
    //             viewVector: { type: "v3", value: camera.position }
    //         },
    //         vertexShader: document.getElementById('vertexShader').textContent,
    //         fragmentShader: document.getElementById('fragmentShader').textContent,
    //         side: THREE.BackSide,
    //         blending: THREE.AdditiveBlending,
    //         transparent: true,
    //         opacity: .2
    //     });


    // var geo_ozone = new THREE.TorusBufferGeometry(earthRadius + 3.4, .2, 16, 100)
    // // var geo_ozone = new THREE.SphereBufferGeometry(earthRadius + 4, 100, 100)
    // var ozone_layer = new THREE.Mesh(geo_ozone, material_ozone);

    // scene.add(ozone_layer);

    addAltitudeLabels();
    addLayerLabels();
    render();
}

function finishedLoadingModels(){
    importModels([plane.clone(), satellite.clone(), meteorid.clone()])

    isPlaying = true;
    animate();
}

function render() {

    orbit.update();
    renderer.render(scene, camera);
}

function renderForOrbit(){
    renderer.render(scene, camera);
}

let clock = new THREE.Clock();
var elapsed;
const time_to_orbit_plane = 10;
var angForPlane;
var angForPlane1;
var lastElapsed = 0;
var delta;
var planeRotationAxis = new THREE.Vector3(0, 3, -1).normalize()
var xForPlane, yForPlane, xForCloud, yForCloud;
var xForSat, yForSat;
const time_to_orbit_cloud = 10;
const angle_deviation = Math.PI / 4;
const angle_start_cloud = Math.PI / 2 - (angle_deviation / 2);
var turn, time_for_cloud, angle_for_cloud;
const meteoridStartPt = new THREE.Vector3(-10, earthRadius + 6 , .5);
const meteoridEndPt = new THREE.Vector3(10, earthRadius + 1 , .5);
const timeTakenMeteorid = 1.5;
var currentTimeMeteorid;
var isPlaying = true;
var animationId;
var elapsedOffset = 0;

function animate() {
    if (isPlaying){
        animationId = requestAnimationFrame(animate);
    }
    else{
        cancelAnimationFrame(animationId)
    }
    
    elapsed = elapsedOffset + clock.getElapsedTime();
    

    angForPlane = ((elapsed - lastElapsed) / time_to_orbit_plane) * twoPI;
    angForPlane1 = (elapsed / time_to_orbit_plane) * twoPI;

    plane.rotateX(angForPlane)

    plane.position.x = Math.cos(angForPlane1) * (earthRadius + 2.2);
    plane.position.y = Math.sin(angForPlane1) * (earthRadius + 2.2);
    // plane.position.z = 1;

    satellite.position.x = Math.cos(angForPlane1 - 2.2) * (earthRadius + 5);
    satellite.position.y = Math.sin(angForPlane1 - 2.2) * (earthRadius + 5);
    // satellite.position.z = 1;

    // meteorid

    earth.rotateOnWorldAxis(planeRotationAxis, angForPlane / 6)

    // cloud

    time_for_cloud = (elapsed % time_to_orbit_cloud)
    turn = parseInt(elapsed / time_to_orbit_cloud) % 2;

    angle_for_cloud = angle_start_cloud + ((angle_deviation) * (((time_for_cloud) * turn + (time_to_orbit_cloud - time_for_cloud) * (1 - turn)) / time_to_orbit_cloud));

    cloud.position.x = Math.cos(angle_for_cloud) * (earthRadius + .8);
    cloud.position.y = Math.sin(angle_for_cloud) * (earthRadius + .8);

    // meteorid
    currentTimeMeteorid = (elapsed % timeTakenMeteorid) / timeTakenMeteorid;

    meteorid.position.x = (meteoridStartPt.x * (1 - currentTimeMeteorid)) + (meteoridEndPt.x * currentTimeMeteorid)
    meteorid.position.y = (meteoridStartPt.y * (1 - currentTimeMeteorid)) + (meteoridEndPt.y * currentTimeMeteorid) 
    meteorid.position.z = (meteoridStartPt.z * (1 - currentTimeMeteorid)) + (meteoridEndPt.z * currentTimeMeteorid) 
    
    meteoridLightRay.position.copy(meteorid.position)
    meteoridLightRay.lookAt(meteoridStartPt)

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

function addAltitudeLabels() {
    var loader = new THREE.FontLoader();
    loader.load('styles/Zawgyi-One_Regular.json', function (font) {

        var color = 0x779efb;

        var matLite = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });

        for (var i = 0; i < altLabels.length; i++) {
            var message = altLabels[i];

            var shapes = font.generateShapes(message, .3);

            var geometry = new THREE.ShapeBufferGeometry(shapes);

            geometry.computeBoundingBox();

            var xMid = - (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

            geometry.translate(xMid / 2, -.2, 0);

            var text_alt = new THREE.Mesh(geometry, matLite);

            text_alt.rotateZ(.4);

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
let layerLoc = [1, 3.3, 2.5, 5, 7, 9]

function addLayerLabels() {
    var loader = new THREE.FontLoader();
    loader.load('styles/Zawgyi-One_Regular.json', function (font) {

        var color = 0x70c409;

        var matLite = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });

        for (var i = 0; i < layerLabels.length; i++) {
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



var THREEx = THREEx || {}
/**
 * from http://stemkoski.blogspot.fr/2013/07/shaders-in-threejs-glow-and-halo.html
 * @return {[type]} [description]
 */
THREEx.VolumetricSpotLightMaterial = function () {
    // 
    var vertexShader = [
        'varying vec3 vNormal;',
        'varying vec3 vWorldPosition;',

        'void main(){',
        '// compute intensity',
        'vNormal		= normalize( normalMatrix * normal );',

        'vec4 worldPosition	= modelMatrix * vec4( position, 1.0 );',
        'vWorldPosition		= worldPosition.xyz;',

        '// set gl_Position',
        'gl_Position	= projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}',
    ].join('\n')
    var fragmentShader = [
        'varying vec3		vNormal;',
        'varying vec3		vWorldPosition;',

        'uniform vec3		lightColor;',

        'uniform vec3		spotPosition;',

        'uniform float		attenuation;',
        'uniform float		anglePower;',

        'void main(){',
        'float intensity;',

        //////////////////////////////////////////////////////////
        // distance attenuation					//
        //////////////////////////////////////////////////////////
        'intensity	= distance(vWorldPosition, spotPosition)/attenuation;',
        'intensity	= 1.0 - clamp(intensity, 0.0, 1.0);',

        //////////////////////////////////////////////////////////
        // intensity on angle					//
        //////////////////////////////////////////////////////////
        'vec3 normal	= vec3(vNormal.x, vNormal.y, abs(vNormal.z));',
        'float angleIntensity	= pow( dot(normal, vec3(0.0, 0.0, 1.0)), anglePower );',
        'intensity	= intensity * angleIntensity;',
        // 'gl_FragColor	= vec4( lightColor, intensity );',

        //////////////////////////////////////////////////////////
        // final color						//
        //////////////////////////////////////////////////////////

        // set the final color
        'gl_FragColor	= vec4( lightColor, intensity);',
        '}',
    ].join('\n')

    // create custom material from the shader code above
    //   that is within specially labeled script tags
    var material = new THREE.ShaderMaterial({
        uniforms: {
            attenuation: {
                type: "f",
                value: 4
            },
            anglePower: {
                type: "f",
                value: 2
            },
            spotPosition: {
                type: "v3",
                value: new THREE.Vector3(0, 0, 0)
            },
            lightColor: {
                type: "c",
                value: new THREE.Color('white')
            },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        // side		: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        transparent: false,
        depthWrite: false,
        alphaTest : .1
    });
    return material;
}

function hideModel(){
    hideModel_();
    isPlaying = true;
    animate();
}

// const modelKeys = ["airplane", "satellite", "meteoroid"]

function showModel(modelIndex){
    isPlaying = false;
    showModel_(modelIndex)
}


init()

function play(){
    orbit.removeEventListener("change", renderForOrbit)
    isPlaying = true;
    clock.start()
    animate();

    
}

function pause(){
    isPlaying = false;
    clock.stop();
    elapsedOffset = elapsed;

    orbit.addEventListener("change", renderForOrbit)
}

export { setupScene, showModel, hideModel, play, pause, isPlaying}

