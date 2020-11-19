var SmokeEditor = function()
{
    this.points = [];
    this.pointGeo = new THREE.SphereGeometry(1,8,8);
    this.pointMaterial = new THREE.MeshLambertMaterial({
        emissive: 0xff0000
    });
    this.shapeGeo = new THREE.Geometry();
    this.shapeMaterial = new THREE.MeshLambertMaterial({
        emissive: 0xff0000,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true
    });
    this.shapeMesh = null;
    this.transformControls = null;
    this.convex = null;


};

SmokeEditor.prototype.init = function(_this)
{
    var pMesh1 = new THREE.Mesh(this.pointGeo,this.pointMaterial);
    var pMesh2 = new THREE.Mesh(this.pointGeo,this.pointMaterial);
    var pMesh3 = new THREE.Mesh(this.pointGeo,this.pointMaterial);
    var pMesh4 = new THREE.Mesh(this.pointGeo,this.pointMaterial);
    pMesh1.position.set(61,0,238);
    pMesh2.position.set(61,0,266);
    pMesh3.position.set(41,0,238);
    pMesh4.position.set(41,0,266);
    this.points.push(pMesh1);
    this.points.push(pMesh2);
    this.points.push(pMesh3);
    this.points.push(pMesh4);
    _this.scene.add(this.points[0]);
    _this.scene.add(this.points[1]);
    _this.scene.add(this.points[2]);
    _this.scene.add(this.points[3]);



    for(let i=0; i<this.points.length; ++i)
        this.shapeGeo.vertices.push(this.points[i].position);
    this.shapeGeo.faces.push(new THREE.Face3(0,1,2),
                             new THREE.Face3(1,2,3));
    this.shapeMesh = new THREE.Mesh(this.shapeGeo,this.shapeMaterial);
    _this.scene.add(this.shapeMesh);

    this.points.forEach(function(item){
        item.visible = false;
    })
    this.shapeMesh.visible = false;

    this.transformControls = new THREE.TransformControls(_this.camera, _this.renderer.domElement);
    this.transformControls.showY = false;
    this.transformControls.visible = false;
    _this.scene.add(this.transformControls);

}

SmokeEditor.prototype.update = function(_this)
{
    if(this.transformControls.dragging)
    {
        this.shapeGeo.setFromPoints(this.points);
        this.shapeGeo.verticesNeedUpdate = true;
    }
}

SmokeEditor.prototype.generateConvex = function(_this)
{
    _this.scene.remove(this.convex);
    var vertices = [];
    this.points.forEach(function(item){
        vertices.push(new THREE.Vector3(item.position.x,-5,item.position.z));
        vertices.push(new THREE.Vector3(item.position.x,-8.5,item.position.z));
    })
    var convexGeo = new THREE.ConvexGeometry(vertices);
    var convexMaterial = new THREE.MeshLambertMaterial({
        emissive: 0xff0000,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true,
        depthWrite: false,
        //depthTest: false
    });
    this.convex = new THREE.Mesh(convexGeo,convexMaterial);
    this.convex.renderOrder = 1;
    console.log(this.convex);
    _this.scene.add(this.convex);
}