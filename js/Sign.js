var Sign = function () {
    this.signTexture = new THREE.TextureLoader().load('./textures/signimg/left.png');
    this.signTextureArr = [];//标志牌贴图
    //this.signMaterialArr = [];
    //this.signMeshArr = [];
    this.signArr1 = []; //B1层标志牌
    this.signArr2 = []; //B2层标志牌
    this.signInitArr = [//指向direction，面向site，x，y，z
        //B1
        [1, 1, 41.2, -7.7, 170],
        [1, 1, 41.2, -7.7, 254],
        [1, 1, 41.2, -7.7, 265],
        [1, 1, 41.2, -7.7, 364],
        [1, 1, 41.2, -7.7, 382],
        [1, 1, 41.2, -7.7, 400],
        [1, 1, 41.2, -7.7, 416],
        [1, 1, 41.2, -7.7, 432],
        [2, 1, 41.2, -7.7, 200],
        [2, 1, 41.2, -7.7, 218],
        [2, 1, 41.2, -7.7, 236],
        [2, 1, 41.2, -7.7, 290],
        [2, 1, 41.2, -7.7, 308],
        [2, 1, 41.2, -7.7, 328],
        [2, 1, 41.2, -7.7, 346],
        [3, 1, 41.25, -7.7, 181.7],
        [4, 1, 41.25, -7.7, 192.5],
        [1, 2, 61.18, -7.7, 124],
        [1, 2, 61.18, -7.7, 142],
        [1, 2, 61.18, -7.7, 160],
        [1, 2, 61.18, -7.7, 196],
        [1, 2, 61.18, -7.7, 214],
        [1, 2, 61.18, -7.7, 290],
        [1, 2, 61.18, -7.7, 304],
        [1, 2, 61.18, -7.7, 324],
        [2, 2, 61.18, -7.7, 232],
        [2, 2, 61.18, -7.7, 250],
        [2, 2, 61.18, -7.7, 350],
        [2, 2, 61.18, -7.7, 370],
        [3, 2, 61.16, -7.7, 272],
        [3, 2, 61.16, -7.7, 118],
        [4, 2, 47, -7.7, 441],
        [4, 2, 61.16, -7.7, 264.5],
        [2, 4, 56.1, -7.7, 378.95],
        // B1地面辅助箭头
        [0, 6, 61.5, -8.53, 268.2],
        [0, 6, 61.5, -8.53, 114.5],
        [0, 8, 45.8, -8.53, 441],
        [5, 5, 40, -8.53, 187.1],
        [5, 8, 51.32, -8.53, 185],
        [5, 6, 45, -8.53, 272],
        [5, 8, 51.3, -8.53, 355],
        //B2
        [2, 2, 47.7, -12.8, 180.65],
        [1, 2, 47.7, -12.8, 198],
        [2, 2, 47.7, -12.8, 217.3],
        [2, 2, 47.7, -12.8, 230.6],
        [1, 2, 47.7, -12.8, 245.55],
        [2, 2, 47.7, -12.8, 265.5],
        [1, 2, 47.7, -12.8, 282.8],
        [2, 2, 47.7, -12.8, 291.3],
        [1, 2, 47.7, -12.8, 309],
        [2, 2, 47.7, -12.8, 328.1],
        [1, 2, 47.7, -12.8, 346.1],
        [1, 2, 47.7, -12.8, 361.5],
        [2, 1, 54.7, -12.8, 361.5],
        [2, 1, 54.7, -12.8, 346.1],
        [1, 1, 54.7, -12.8, 328.1],
        [2, 1, 54.7, -12.8, 309],
        [1, 1, 54.7, -12.8, 291.3],
        [2, 1, 54.7, -12.8, 282.8],
        [1, 1, 54.7, -12.8, 265.5],
        [2, 1, 54.7, -12.8, 245.55],
        [1, 1, 54.7, -12.8, 217.3],
        [1, 1, 54.7, -12.8, 180.65],
        [2, 1, 54.7, -12.8, 198],
        [5, 6, 52.55, -13.36, 335],
        [5, 6, 52.55, -13.36, 223],
    ];

    /* canvas
        this.arrowCanvas = document.getElementById("myCanvas");
        this.arrowCanvas.width = 512;
        this.arrowCanvas.height = 128;
        var c = this.arrowCanvas.getContext("2d");
    // 矩形区域填充背景
        c.fillStyle = "#000000";
        c.fillRect(0, 0, 512, 128);
        c.beginPath();

    //箭头
        c.fillStyle = "#00FF00";
        c.beginPath();
        c.moveTo(60,34);
        c.lineTo(30,64);
        c.lineTo(60,94);
        c.lineTo(60,84);
        c.lineTo(110,84);
        c.lineTo(110,84);
        c.lineTo(110,44);
        c.lineTo(60,44);
        c.fill();

        c.fillStyle = "#00FF00";
        c.beginPath();
        c.moveTo(452,34);
        c.lineTo(482,64);
        c.lineTo(452,94);
        c.lineTo(452,84);
        c.lineTo(402,84);
        c.lineTo(402,84);
        c.lineTo(402,44);
        c.lineTo(452,44);
        c.fill();

    // 文字
        c.beginPath();
        c.translate(256,40);
        c.fillStyle = "#00FF00"; //文本填充颜色
        c.font = "bold 48px 黑体"; //字体样式设置
        c.textBaseline = "middle"; //文本与fillText定义的纵坐标
        c.textAlign = "center"; //文本居中(以fillText定义的横坐标)
        c.fillText("安全出口", 0, 0);
        c.fillText("EXIT", 0, 50);

        c.restore();
        */
}


Sign.prototype.init = function (_this) {
    this.signTextureArr[0] = new THREE.TextureLoader().load('./textures/signimg/exit.png');
    this.signTextureArr[1] = new THREE.TextureLoader().load('./textures/signimg/left.png');
    this.signTextureArr[2] = new THREE.TextureLoader().load('./textures/signimg/right.png');
    this.signTextureArr[3] = new THREE.TextureLoader().load('./textures/signimg/leftup.png');
    this.signTextureArr[4] = new THREE.TextureLoader().load('./textures/signimg/rightup.png');
    this.signTextureArr[5] = new THREE.TextureLoader().load('./textures/signimg/arrow2.png');
    this.signTextureArr[6] = new THREE.CanvasTexture(this.arrowCanvas);
    this.signGeometry = new THREE.PlaneGeometry(0.9, 0.35);
    this.arrowGeometry = new THREE.PlaneGeometry(0.7, 0.7);
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
            //map: this.signTextureArr[6], //canvas贴图
        });
        if (i == 5) {
            return new THREE.Mesh(this.arrowGeometry, material);
        } else {
            return new THREE.Mesh(this.signGeometry, material);
        }
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

    function initDragControls() {
        // 添加平移控件
        this.transformControls = new THREE.TransformControls(_this.camera, _this.renderer.domElement);
        _this.scene.add(this.transformControls);

        // 过滤不是 Mesh 的物体,例如辅助网格对象
        var objects = this.signArr1;
        for (let i = 0; i < _this.scene.children.length; i++) {
            if (_this.scene.children[i].isMesh) {
                objects.push(_this.scene.children[i]);
            }
        }
        // 初始化拖拽控件
        this.dragControls = new THREE.DragControls(objects, _this.camera, _this.renderer.domElement);

        // 鼠标略过事件
        this.dragControls.addEventListener('hoveron', function (event) {
            // 让变换控件对象和选中的对象绑定
            this.transformControls.attach(event.object);
        });
        // 开始拖拽
        this.dragControls.addEventListener('dragstart', function (event) {
            this.controls.enabled = false;
        });
        // 拖拽结束
        this.dragControls.addEventListener('dragend', function (event) {
            this.controls.enabled = true;
        });
    }

// 初始化
    function init() {
        initDragControls();
        window.addEventListener('resize', onWindowResize, false);
    }

    function animate() {
        requestAnimationFrame(animate);
        _this.renderer.render(_this.scene, _this.camera);
        this.controls.update();
    }

    init();
    animate();


    this.controls = new THREE.DragControls(objects, _this.camera, _this.renderer.domElement);
    this.controls.addEventListener('dragstart', function (event) {

        event.object.material.emissive.set(0xaaaaaa);

    });
    this.controls.addEventListener('dragend', function (event) {
        event.object.material.emissive.set(0x000000);
    });
}