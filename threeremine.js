var renderer, scene, camera,
    cube, cubeGeometry, cubeMaterial,
    light, container;
var cursor = new THREE.Vector3(0, 0, 1);

//var mouse = T("mouse");
//var sound = T("saw", {freq:880}, mouse.X);
var sound = T("sin", {freq:880, mul:0.5});


// Tone
    // Reference oscillator
//    var refOscillator  = T("osc", {wave:"sin", freq:880});
//    var refOscillatorGenerator  = T("OscGen", {osc: refOscillator, mul: 0.15}).play();


function getCanvasHeight() {
    return window.innerHeight - parseInt($("#container").offset().top)
        - parseInt($("#container").css('padding-top'))
        - parseInt($("#container").css('padding-bottom'))
        - parseInt($("#container").css('margin-bottom')) -10;
}

var width = $('#container').width(),
    height = getCanvasHeight();

function init() {
    container = document.getElementById('container');
    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    cubeGeometry = new THREE.CubeGeometry(6,6,6);

    // Lambert material reacts to light
    cubeMaterial = new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff // random color
    });

    // mesh object
    cube = new THREE.Mesh(
        cubeGeometry,
        cubeMaterial
    );

    // light
    light = new THREE.PointLight(0xFFFFFF);
    light.position = new THREE.Vector3(7, 23, 37);

    // camera
    camera = new THREE.PerspectiveCamera(
        70, // vertical field of view
        300 / 200, // aspect ratio
        0.1, // near plane distance
        10000 // far plane distance
    );
    camera.position = new THREE.Vector3(0, 5, 50); // pulling back the camera

    scene.add(cube);
    scene.add(light);
    scene.add(camera);

    renderer.render(scene, camera);

    container.addEventListener('mousemove', mouseMoved, false);

    sound.play();

}

function mouseMoved(e) {

    cursor.x = ((e.clientX - $(renderer.domElement).offset().left) / width) * 2 - 1;
    cursor.y = - ((e.clientY - $(renderer.domElement).offset().top) / height) * 2 + 1;
//    console.log(cursor);
}


/**
 * http://www.efg2.com/Lab/ScienceAndEngineering/Spectra.htm
 * @param frequency
 */
function frequencyToRGB(frequency) {
var r, g, b, gamma = 0.80, IntensityMax = 255, factor =1;

    switch (true) {
        case (380 <= frequency &&  frequency < 440):
            r = -(frequency - 440) / (440 - 380);
            g = 0.0;
            b = 1.0
            break;
        case (440 <= frequency &&  frequency < 490):
            r = 0.0
            g = (frequency - 440) / (490 - 440);
            b = 1.0
            break;
        case (490 <= frequency &&  frequency < 510):
            r = 0.0;
            g = 1.0;
            b = -(frequency - 510) / (510 - 490);
            break;
        case (510 <= frequency &&  frequency < 580):
            r = (frequency - 510) / (580 - 510);
            g = 1.0;
            b = 0.0
            break;
        case (580 <= frequency &&  frequency < 645):
            r = 1.0;
            g = -(frequency - 645) / (645 - 580);
            b = 0.0
            break;
        case (645 <= frequency &&  frequency <= 780):
            r = 1.0;
            g = 0.0;
            b = 0.0
            break;
        default:
            r = 0.0;
            g = 0.0;
            b = 0.0
            break;
    }
//    switch (true) {
//        case (380 < frequency &&  frequency < 419):
//            factor = 0.3 + 0.7*(frequency - 380) / (420 - 380);
//            break;
//        case (420 < frequency &&  frequency < 700):
//            factor = 1.0;
//            break;
//        case (701 < frequency &&  frequency < 780):
//            factor = 0.3 + 0.7*(780 - frequency) / (780 - 700);
//            break;
//        default:
//            factor = 0.0;
//            break;
//    }
//
    r = adjust(r, factor, IntensityMax, gamma);
    g = adjust(g, factor, IntensityMax, gamma);
    b = adjust(b, factor, IntensityMax, gamma);

    return 'rgb('+r+','+g+','+b+')';
}

function adjust(color, factor, IntensityMax, gamma) {
    if (color > 0) {
        return Math.round(IntensityMax * Math.pow(color * factor, gamma))
    }
    return 0;
}


function soundFrequencyToColorFrequency(soundFrequency) {
    if (soundFrequency > 0) {
        return (8108.108/soundFrequency) + 384.595;
    }
    return 0;
}

/**
 * Render frame
 */
function render() {
    cube.rotation.y += 0.05;
    sound.freq = (cursor.x *1000)+20;
//    console.log((cursor.x *1000)+20);

    renderer.clear();
    renderer.render(scene, camera);
    var colorFrequency = soundFrequencyToColorFrequency(sound.freq);
//    console.log('ColorFrequency', colorFrequency);
    var rgb = frequencyToRGB(colorFrequency);
//    console.log('rgb', rgb);

    $("#container").css('background-color',  ""+rgb+"");
}

/**
 * Animate loop
 */
function animate() {
    // request animation frame scheme
    requestAnimationFrame(animate);
    render();
}

    init();
    animate();




