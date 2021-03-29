var Sign = function()
{   
    //this.signTexture = new THREE.TextureLoader().load('./textures/signimg/0.png');
    this.signTextureArr = [];//标志牌贴图
    this.signArr = [];
}

Sign.prototype.init = function(_this)
{
    this.signTextureArr.push(new THREE.TextureLoader().load('./textures/signimg/0.png'));
    this.signGeometry = new THREE.PlaneGeometry( 0.9, 0.35 );
    this.signMaterial = new THREE.MeshBasicMaterial({
        map: this.signTextureArr[0]
    });
    this.signMesh = new THREE.Mesh(this.signGeometry,this.signMaterial); 
    this.signMesh.position.set(41.2,-7.8,359);
    this.signMesh.rotation.set(0,Math.PI*0.5,0);
    _this.scene.add(this.signMesh);
}

Sign.prototype.update = function(_this)
{

}