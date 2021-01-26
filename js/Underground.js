var Underground = function ()
{
    this.mesh=[];
    this.isOnload = false;
    this.subway=[];
    this.isready = false;
    this.rail=[];
    this.arr = [];
}

Underground.prototype.init = function (_this) {
    this.GlbBuilding(_this);
    this.AddSubway(_this);
}


Underground.prototype.GlbBuilding = function (_this) {
    var self = this;
    var loader = new THREE.GLTFLoader();
    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    THREE.DRACOLoader.setDecoderPath('./draco/');
    THREE.DRACOLoader.setDecoderConfig({type: 'js'});
    loader.setDRACOLoader(new THREE.DRACOLoader());



    function loadFunc(gltf)
    {
        self.mesh = gltf.scene;
        self.mesh.scale.set(1,1,1);
        self.mesh.position.set(0,0,0);

        _this.scene.add(self.mesh);
        _this.Cameracontroller.collideMeshList.push(self.mesh);
    }

    var loadAsync = function (path)
    {
        return new Promise((resolve) =>
        {
            loader.load(path, (gltf) =>
            {
                loadFunc(gltf);
                resolve(gltf);
            })
        })
    };

    /*建筑模型加载开始*/
    var startLoadTime = performance.now();

    //分步加载
    this.arr[0] = loadAsync('./light_sub/23b1floor.glb');
    this.arr[1] = loadAsync('./light_sub/25b1wall.glb');
    this.arr[2] = loadAsync('./light_sub/30b1pillars.glb');
    this.arr[3] = loadAsync('./light_sub/27b1fence.glb');
    this.arr[4] = loadAsync('./light_sub/1securityCheck.glb');
    this.arr[5] = loadAsync('./light_sub/28b1others.glb');
    this.arr[6] = loadAsync('./light_sub/22b1lights.glb');
    this.arr[7] = loadAsync('./light_sub/26b1roof.glb');
    this.arr[8] = loadAsync('./light_sub/24b1stairs.glb');
    this.arr[9] = loadAsync('./light_sub/3exitance2.glb');
    this.arr[10] = loadAsync('./light_sub/4exitance6.glb');
    this.arr[11] = loadAsync('./light_sub/5exitance3.glb');
    this.arr[12] = loadAsync('./light_sub/6exitance4.glb');
    this.arr[13] = loadAsync('./light_sub/7exitance5.glb');
    this.arr[14] = loadAsync('./light_sub/8exitance1.glb');
    this.arr[15] = loadAsync('./light_sub/18b2roof.glb');
    this.arr[16] = loadAsync('./light_sub/2glass.glb');
    this.arr[17] = loadAsync('./light_sub/12b2lights.glb');
    //b2层
    this.arr[18] = loadAsync('./light_sub/13b2floor.glb');
    this.arr[19] = loadAsync('./light_sub/15b2escalatorWall.glb');
    this.arr[20] = loadAsync('./light_sub/17b2wall.glb');
    this.arr[21] = loadAsync('./light_sub/16b2barriers.glb');
    this.arr[22] = loadAsync('./light_sub/31automaticRightDoor.glb');
    this.arr[23] = loadAsync('./light_sub/32automaticLeftDoor.glb');
    this.arr[24] = loadAsync('./light_sub/21b2pillars.glb');
    this.arr[25] = loadAsync('./light_sub/19b2others.glb');
    this.arr[26] = loadAsync('./light_sub/14b2escalators.glb');

    //只b2层可见
    // this.promiseAll = Promise.all(this.arr).then((data) => {
    //     for (var i =0; i < 18; i++) {
    //         data[i].scene.visible = false;
    //     }
    // });

    $("#loadTime")[0].innerText = ((performance.now() - startLoadTime) / 1000).toFixed(2) + "秒";

    /*建筑模型加载结束*/


};

Underground.prototype.AddSubway = function (_this)
{
    var self = this;
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('Model/subway/');
    mtlLoader.load('subway.mtl', function(materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('Model/subway/');
        objLoader.load('subway.obj', function(object) {
            self.subway = object;
            //正确位置
            object.position.set(43.2,-13.7,210);

            //临时位置
            //object.position.set(550,8,41.4);
            object.scale.set(0.01, 0.01, 0.01);
            //object.rotateY(Math.PI/2);
            _this.scene.add(object);
            self.isready = true;
        });
    });

}

