function initLeap() {
    controller = new Leap.Controller({enableGestures: true});

    frameCount = 0;
//    controller.on("frame", function(frame) {
//        frameCount++;
//    });

    controller.on('ready', function() {
//        console.log("ready");
    });
    controller.on('connect', function() {
        console.log("connect");
    });
    controller.on('disconnect', function() {
        console.log("disconnect");
    });
    controller.on('focus', function() {
        console.log("focus");
    });
    controller.on('blur', function() {
        console.log("blur");
    });
    controller.on('deviceConnected', function() {
        console.log("deviceConnected");
    });
    controller.on('deviceDisconnected', function() {
        console.log("deviceDisconnected");
    });

    controller.connect();
    console.log("\nWaiting for device to connect...");
}


function leapToScene(leapPosition){
    var x = (leapPosition[0]/300)*1000
    var y = (((leapPosition[1])-200)/300)*1000
    var z = (leapPosition[2]/300)*1000
    var toReturn = new THREE.Vector3(x,y,z);
    return toReturn
}


function dirToScene(leapPosition){
    var x = leapPosition[0]
    var y = leapPosition[1]
    var z = leapPosition[2]
    var toReturn = new THREE.Vector3(x,y,z)
    return toReturn
}


