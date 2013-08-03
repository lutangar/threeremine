/**
 * Finger Object3D
 */
FingerObject = function (direction, position, length, color) {
    direction = direction || new THREE.Vector3(0, 0, -1);
    position = position || new THREE.Vector3(0, 0, 0);
    length = length || 1;
    color = color || Math.random() * 0xffffff;

    THREE.ArrowHelper.call( this,  direction, position, length, color );
};
FingerObject.prototype = Object.create( THREE.ArrowHelper.prototype );

FingerObject.prototype.show = function () {
    this.visible = true;
};

FingerObject.prototype.hide = function () {
    this.visible = false;
};