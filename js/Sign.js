var Sign = function () {
    this.signTexture = new THREE.TextureLoader().load('./textures/signimg/left.png');
    this.signTextureArr = [];//标志牌贴图
    //this.signMaterialArr = [];
    //this.signMeshArr = [];
    this.signArr1 = []; //B1层标志牌
    this.signArr2 = []; //B2层标志牌
    this.signInitArr = [//指向，面向，x，y，z
        [1, 1, 41.2, -7.7, 170],
        [3, 1, 41.25, -7.7, 181.7],
        [0, 5, 40, -8.53, 186.8],
        [4, 1, 41.25, -7.7, 192.5],
        [2, 1, 41.2, -7.7, 200],
        [2, 1, 41.2, -7.7, 218],
        [2, 1, 41.2, -7.7, 236],
        [1, 1, 41.2, -7.7, 254],
        [1, 1, 41.2, -7.7, 265],
        [2, 1, 41.2, -7.7, 290],
        [2, 1, 41.2, -7.7, 308],
        [2, 1, 41.2, -7.7, 328],
        [2, 1, 41.2, -7.7, 346],
        [1, 1, 41.2, -7.7, 364],
        [1, 1, 41.2, -7.7, 382],
        [1, 1, 41.2, -7.7, 400],
        [1, 1, 41.2, -7.7, 416],
        [1, 1, 41.2, -7.7, 432],
        [4, 2, 47, -7.7, 441],
        [0, 8, 45.8, -8.53, 441],
        [0, 6, 61.5, -8.53, 114.5],
        [3, 2, 61.16, -7.7, 118],
        [1, 2, 61.18, -7.7, 124],
        [1, 2, 61.18, -7.7, 142],
        [1, 2, 61.18, -7.7, 160],
        [1, 2, 61.18, -7.7, 196],
        [1, 2, 61.18, -7.7, 214],
        [2, 2, 61.18, -7.7, 232],
        [2, 2, 61.18, -7.7, 250],
        [4, 2, 61.16, -7.7, 264.5],
        [0, 6, 61.5, -8.53, 268.2],
        [3, 2, 61.16, -7.7, 272],
        [1, 2, 61.18, -7.7, 290],
        [1, 2, 61.18, -7.7, 304],
        [1, 2, 61.18, -7.7, 324],
        [2, 2, 61.18, -7.7, 350],
        [2, 2, 61.18, -7.7, 370],
        [2, 4, 56.1, -7.7, 378.95],
    ];

}


Sign.prototype.init = function (_this) {
    this.signTextureArr[0] = new THREE.TextureLoader().load('./textures/signimg/exit.png');
    this.signTextureArr[1] = new THREE.TextureLoader().load('./textures/signimg/left.png');
    this.signTextureArr[2] = new THREE.TextureLoader().load('./textures/signimg/right.png');
    this.signTextureArr[3] = new THREE.TextureLoader().load('./textures/signimg/leftup.png');
    this.signTextureArr[4] = new THREE.TextureLoader().load('./textures/signimg/rightup.png');

    this.signGeometry = new THREE.PlaneGeometry(0.9, 0.35);
    /*
    for (i = 0; i < 5; i++) {
        this.signMaterialArr[i] = new THREE.MeshBasicMaterial({
            map: this.signTextureArr[i], // 设置纹理贴图
        });
        this.signMeshArr[i] = new THREE.Mesh(this.signGeometry, this.signMaterialArr[i]);
    }
    */
    this.getMesh = function (i) {
        var material = new THREE.MeshBasicMaterial({
            map: this.signTextureArr[i], // 设置纹理贴图
        });
        return new THREE.Mesh(this.signGeometry, material);
    }

    this.setSign = function (n, direction, site, x, y, z) {
        if (y > -9) {
            this.signArr1[n] = this.getMesh(direction);
            this.signArr1[n].position.set(x, y, z);
            if (site == 1) {
                this.signArr1[n].rotation.set(0, Math.PI * 0.5, 0);
            } else if (site == 2) {
                this.signArr1[n].rotation.set(0, Math.PI * -0.5, 0);
            } else if (site == 3) {
                this.signArr1[n].rotation.set(0, 0, 0);
            } else if (site == 4) {
                this.signArr1[n].rotation.set(0, Math.PI * 1, 0);
            } else if (site == 5) {
                this.signArr1[n].rotation.set(Math.PI * -0.5, 0, Math.PI * 0.5);
            } else if (site == 6) {
                this.signArr1[n].rotation.set(Math.PI * -0.5, 0, Math.PI * -0.5);
            } else if (site == 7) {
                this.signArr1[n].rotation.set(Math.PI * -0.5, 0, 0);
            } else if (site == 8) {
                this.signArr1[n].rotation.set(Math.PI * -0.5, 0, Math.PI * 1);
            }//1,2,3,4是墙上四个面向，5,6,7,8是地面上

            _this.scene.add(this.signArr1[n]);
            //console.log(this.signArr1[n].position);
        } else {
            this.signArr2[n] = this.getMesh(direction);
            this.signArr2[n].position.set(x, y, z);
            if (site == 1) {
                this.signArr2[n].rotation.set(0, Math.PI * 0.5, 0);
            } else if (site == 2) {
                this.signArr2[n].rotation.set(0, Math.PI * -0.5, 0);
            } else if (site == 3) {
                this.signArr2[n].rotation.set(0, 0, 0);
            } else if (site == 4) {
                this.signArr2[n].rotation.set(0, Math.PI * 1, 0);
            } else if (site == 5) {
                this.signArr2[n].rotation.set(Math.PI * -0.5, 0, Math.PI * 0.5);
            } else if (site == 6) {
                this.signArr2[n].rotation.set(Math.PI * -0.5, 0, Math.PI * -0.5);
            }
            _this.scene.add(this.signArr2[n]);
        }
    }

    for (i = 0; i < this.signInitArr.length; i++) {
        this.setSign(i, this.signInitArr[i][0], this.signInitArr[i][1], this.signInitArr[i][2], this.signInitArr[i][3], this.signInitArr[i][4]);
    }

}

Sign.prototype.update = function (_this) {

}