/**
 * Hand Object3D
 */
HandObject = function (geometry, material) {
    geometry = geometry || new THREE.SphereGeometry(1000/20, 4, 4);
    material = material || new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        wireframeLinewidth:  1
    });

    THREE.Mesh.call( this, geometry, material);
};
HandObject.prototype = Object.create( THREE.Mesh.prototype );

HandObject.prototype.fingers = function () {
    var fingers = [];
    for ( var i = 0, l = this.children.length; i < l; i ++ ) {

        if (this.children[ i ] instanceof FingerObject) {
            fingers.push(this.children[ i ]);
        }
    }
    return fingers;
};


HandObject.prototype.show = function () {
    this.traverse( function ( object ) { object.visible = true; } );
};

HandObject.prototype.hide = function () {
    this.traverse( function ( object ) { object.visible = false; } );
};