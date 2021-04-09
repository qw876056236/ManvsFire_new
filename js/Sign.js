var Sign = function()
{   
    //this.signTexture = new THREE.TextureLoader().load('./textures/signimg/0.png');
    this.signTextureArr = [];//标志牌贴图
    this.signArr = [];
}

Sign.prototype.init = function(_this)
{
    //标志牌贴图，安全出口灯+十个方向预设
    this.signTextureArr.push(new THREE.TextureLoader().load('./textures/signimg/安全出口.png'));
    this.signTextureArr.push(new THREE.TextureLoader().load('./textures/signimg/左.png'));
    this.signTextureArr.push(new THREE.TextureLoader().load('./textures/signimg/右.png'));
    this.signTextureArr.push(new THREE.TextureLoader().load('./textures/signimg/上楼左.png'));
    this.signTextureArr.push(new THREE.TextureLoader().load('./textures/signimg/上楼右.png'));
    this.signTextureArr.push(new THREE.TextureLoader().load('./textures/signimg/左上.png'));
    this.signTextureArr.push(new THREE.TextureLoader().load('./textures/signimg/右上.png'));
    this.signTextureArr.push(new THREE.TextureLoader().load('./textures/signimg/左下.png'));
    this.signTextureArr.push(new THREE.TextureLoader().load('./textures/signimg/右下.png'));
    this.signTextureArr.push(new THREE.TextureLoader().load('./textures/signimg/下楼左.png'));
    this.signTextureArr.push(new THREE.TextureLoader().load('./textures/signimg/下楼右.png'));
    this.signGeometry = new THREE.PlaneGeometry( 0.9, 0.35 );
    this.signMaterial0 = new THREE.MeshBasicMaterial({
        map: this.signTextureArr[0]
    });
    this.signMaterial1 = new THREE.MeshBasicMaterial({
        map: this.signTextureArr[1]
    });
    this.signMaterial2 = new THREE.MeshBasicMaterial({
        map: this.signTextureArr[2]
    });
    this.signMaterial3 = new THREE.MeshBasicMaterial({
        map: this.signTextureArr[3]
    });
    this.signMaterial4 = new THREE.MeshBasicMaterial({
        map: this.signTextureArr[4]
    });
    this.signMaterial5 = new THREE.MeshBasicMaterial({
        map: this.signTextureArr[5]
    });
    this.signMaterial6 = new THREE.MeshBasicMaterial({
        map: this.signTextureArr[6]
    });
    this.signMaterial7 = new THREE.MeshBasicMaterial({
        map: this.signTextureArr[7]
    });
    this.signMaterial8 = new THREE.MeshBasicMaterial({
        map: this.signTextureArr[8]
    });
    this.signMaterial9 = new THREE.MeshBasicMaterial({
        map: this.signTextureArr[9]
    });
    this.signMaterial10 = new THREE.MeshBasicMaterial({
        map: this.signTextureArr[10]
    });

    this.signMesh = new THREE.Mesh(this.signGeometry,this.signMaterial1);


    this.signMeshArr0 = [];
    for(i=0;i<10;i++){
        this.signMeshArr0.push(new THREE.Mesh(this.signGeometry,this.signMaterial0));
        /*
        this.signMeshArr0[i].position.set(41.2,-7.9,359+18*i);
        this.signMeshArr0[i].rotation.set(0,Math.PI*0.5,0);
        _this.scene.add(this.signMeshArr0[i]);
        */
    }

    this.signMeshArr1 = [];
    for(i=0;i<10;i++){
        this.signMeshArr1.push(new THREE.Mesh(this.signGeometry,this.signMaterial1));
    }
    console.log(this.signMeshArr1);
    for(i=0;i<10;i++){
        this.signMeshArr1[i].position.set(41.2,-7.7,170+18*i);
        this.signMeshArr1[i].rotation.set(0,Math.PI*0.5,0);
        _this.scene.add(this.signMeshArr1[i]);
    }





    _this.scene.add(this.signMesh);
}

Sign.prototype.update = function(_this)
{

}