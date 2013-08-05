/**
 * InteractionBoxHelper
 */
InteractionBoxHelper = function (geometry, material) {
    geometry = geometry || new THREE.CubeGeometry(1, 1, 1, 5, 5, 5);
    material = material || new THREE.MeshBasicMaterial({
        color: 0x888888,
        wireframe: true
    });

    THREE.Mesh.call( this, geometry, material);
};
InteractionBoxHelper.prototype = Object.create( THREE.Mesh.prototype );