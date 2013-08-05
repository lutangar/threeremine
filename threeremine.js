var renderer, scene, camera,
    cube, cubeGeometry, cubeMaterial,
    light, container;
var cursor = new THREE.Vector3(0, 0, 1);

var mouse = T("mouse");
//var sound = T("saw", {freq:880}, mouse.X);
//var sound = T("sin", {freq:440, mul:0.5});

var min = 80, max = 800;
var freq = T("mouse.x", {min:min, max:800});
var sound = T("sin", {freq:0, mul:0.5});
var leapControllerMaxY = 100;

function getCanvasHeight() {
    return window.innerHeight - parseInt($("#container").offset().top)
        - parseInt($("#container").css('padding-top'))
        - parseInt($("#container").css('padding-bottom'))
        - parseInt($("#container").css('margin-bottom')) -10;
}

var width = $('#container').width(),
    height = getCanvasHeight();

 // Leap related stuff
var controller, frameCount, frame;
var fingers = {}, hands = {};
var spheres = {};

function init() {
    container = document.getElementById('container');
    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();

//    cubeGeometry = new THREE.CubeGeometry(6,6,6);

    // Lambert material reacts to light
    cubeMaterial = new THREE.MeshLambertMaterial({
        color: Math.random() * 0xffffff // random color
    });

    //
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };





    // mesh object
    cube = new THREE.Mesh(
        cubeGeometry,
        cubeMaterial
    );
    cube.rotation.y += 0.05;


    // light
    light = new THREE.PointLight(0xFFFFFF);
    light.position = new THREE.Vector3(7, 23, 37);

//    scene.add(cube);
    scene.add(light);


    /**
     * ---------------------------- HANDS & FINGERS -------------------------------------------------------------------
     */
    var hands = [];
    // creating 2 hands
    for(var i = 0; i < 2; i++) {
        var hand = new HandObject();

        // creating 5 fingers per hands
        for (var j = 0; j < 5; j++) {
            hand.add(new FingerObject());
        }

        hand.hide();

        scene.add(hand);
        hands.push( hand );
    }

    // interaction box helper
    var interactionBox = new InteractionBoxHelper();
        interactionBox.add(new THREE.AxisHelper(1000));
    scene.add(interactionBox);



    Leap.loop(function(frame){
        // interaction box helper update
        interactionBox.position.set(frame.interactionBox.center[0], frame.interactionBox.center[1], frame.interactionBox.center[2]);
        interactionBox.scale.set(frame.interactionBox.size[0], frame.interactionBox.size[1], frame.interactionBox.size[2]);

        // for each of our hands
        for(var i = 0; i < 2; i++) {
            // if a leap hand is present
            if(frame.hands[i]) {
                // update HandObject position and stuff
                hands[i].position = dirToScene(frame.hands[i].palmPosition);
                hands[i].position = dirToScene(frame.hands[i].palmPosition);
                hands[i].show();

                for(var j = 0; j < 5; j++) {
                    if(frame.hands[i].fingers[j]) {
                        hands[i].children[j].position = hands[i].worldToLocal(dirToScene(frame.hands[i].fingers[j].tipPosition));
                        hands[i].children[j].setDirection(dirToScene(frame.hands[i].fingers[j].direction));
                        hands[i].children[j].setLength((frame.hands[i].fingers[j].length));

//                        hands[i].children[j].show();
                    } else {
                        hands[i].children[j].visible = false;
                    }
                }

            // leap hand not here
            } else {
                hands[i].hide();
            }
        }
    });
    /**
     * ----------------------------------------------------------------------------------------------------------------
     */

    // camera
    camera = new THREE.PerspectiveCamera(
        90, // vertical field of view
        width / height, // aspect ratio
        0.1, // near plane distance
        10000 // far plane distance
    );
    camera.position = new THREE.Vector3(
        0,
        interactionBox.position.y+1,
        interactionBox.position.z+2
    ); // pulling back the camera
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    interactionBox.add(camera);

    // Theremin model
    var loader = new THREE.OBJLoader( manager );
    loader.load( 'resources/model/thermin_1.obj', function ( object ) {
        object.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {
                child.material = cubeMaterial;
            }

        } );
//        object.scale = new THREE.Vector3(10, 10, 10);
//        object.rotation.y += -1.6;
        object.position = new THREE.Vector3(0, -1, 0);
        object.rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI/2);
        object.scale = new THREE.Vector3(0.7, 0.7, 0.7);
        object.add(new THREE.AxisHelper());

        interactionBox.add( object );
    });


    renderer.render(scene, camera);

//    container.addEventListener('mousemove', mouseMoved, false);
    container.addEventListener('mousewheel', zoom, false );

    sound.play();
    mouse.start();
}

function mouseMoved(e) {
    cursor.x = ((e.clientX - $(renderer.domElement).offset().left) / width) * 2 - 1;
    cursor.y = - ((e.clientY - $(renderer.domElement).offset().top) / height) * 2 + 1;
//    console.log(cursor);
}

function zoom(e) {
    if ( e.wheelDelta ) { // WebKit / Opera / Explorer 9

        delta = e.wheelDelta / 40;

    }

//    _zoomStart.y += delta * 0.01;
    camera.position.z += delta* -1;
}


/**
 * Render frame
 */
function render() {
    renderer.clear();
    renderer.render(scene, camera);

//    paintBackgroundFromFrequency(sound.freq, min, max);

//    controller.on("frame", function(frame) {
////        console.log("Frame: " + frame.id + " @ " + frame.timestamp);
//
//        var fingerIds = {};
//        var handIds = {};
//
//
//        // pointables
//        for (var index = 0; index < frame.pointables.length; index++) {
//
//            var pointable = frame.pointables[index];
//            var finger = fingers[pointable.id];
//
//
//            var pos = pointable.tipPosition;
//            var dir = pointable.direction;
//
//
////            sound.freq = (pos[0] *10)+20;
//
//
//            var origin = new THREE.Vector3(pos[0], pos[1], pos[2]);
//            var direction = new THREE.Vector3(dir[0], dir[1], dir[2]);
//            var zero = new THREE.Vector3(0,0,0);
//            var test = new THREE.Vector3(0,0,1);
//            if (!finger) {
//                var geometry = new THREE.SphereGeometry(1000/20,4,4);
//                var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth:  1} );
//
////                finger = new THREE.Mesh( geometry, material );
//                finger = new THREE.ArrowHelper(test, leapToScene(pos), (pointable.length/300)*1000, Math.random() * 0xffffff);
////                finger.position.x = 1000 * 1000;
//                fingers[pointable.id] = finger;
//
//                scene.add(finger);
//            }
//
//            finger.position = leapToScene(pos);
//            finger.setDirection(dir);
////            finger.setLength((pointable.length/300)*1000);
//
//            fingerIds[pointable.id] = true;
//        }
//
//        for (fingerId in fingers) {
//            if (!fingerIds[fingerId]) {
//                scene.remove(fingers[fingerId]);
//                delete fingers[fingerId];
//            }
//        }
//
//        // hands
//        for (var i = 0; i < frame.hands.length; i++) {
//            var hand = frame.hands[i];
//            var handObject = hands[hand.id];
//
//            if (!handObject) {
//                var geometry = new THREE.SphereGeometry(1000/20,4,4);
//                var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth:  1} );
//
//                var handObject = new THREE.Mesh( geometry, material );
////                hand = new THREE.ArrowHelper(leapToScene(pos), leapToScene(dir), 40, Math.random() * 0xffffff);
//                hands[hand.id] = handObject;
//                scene.add(handObject);
//            }
//            handObject.position = leapToScene(hand.palmPosition);
//
//            handIds[hand.id] = true;
//        }
//
//        for (handId in hands) {
//            if (!handIds[handId]) {
//                scene.remove(hands[handId]);
//                delete hands[handId];
//            }
//        }
//
//        //if(frame.gestures.length > 0) console.log(frame.gestures);
//
//    });
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
    initLeap();
    animate();




