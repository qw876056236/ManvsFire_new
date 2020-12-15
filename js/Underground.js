var Underground = function ()
{
    this.mesh=[];
    this.isOnload = false;
    this.subway=[];
    this.isready = false;
    this.rail=[];

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
        ///console.log(self.mesh);

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
                resolve(true);
            })
        })
    };

    /*建筑模型加载开始*/
    var startLoadTime = performance.now();
    //异步加载
    // Promise.all(
    //     [
    //
    //         loadAsync('./subway/1securityCheck.glb'),
    //         loadAsync('./subway/2glass.glb'),
    //         loadAsync('./subway/3exitance2.glb'),
    //         loadAsync('./subway/4exitance6.glb'),
    //         loadAsync('./subway/5exitance3.glb'),
    //         loadAsync('./subway/6exitance4.glb'),
    //         loadAsync('./subway/7exitance5.glb'),
    //         loadAsync('./subway/8exitance1.glb'),
    //
    //         //loadAsync('./subway/9ground.glb'),
    //         //loadAsync('./subway/10f1buildings1.glb'),
    //         //loadAsync('./subway/11f1others.glb'),
    //
    //         loadAsync('./subway/12b2lights.glb'),
    //         loadAsync('./subway/13b2floor.glb'),
    //         loadAsync('./subway/14b2escalators.glb'),
    //         loadAsync('./subway/15b2escalatorWall.glb'),
    //         loadAsync('./subway/16b2barriers.glb'),
    //         loadAsync('./subway/17b2wall.glb'),
    //         loadAsync('./subway/18b2roof.glb'),
    //         loadAsync('./subway/19b2others.glb'),
    //         loadAsync('./subway/20b2signages.glb'),
    //         loadAsync('./subway/21b2pillars.glb'),
    //         loadAsync('./subway/22b1lights.glb'),
    //         loadAsync('./subway/23b1floor.glb'),
    //         loadAsync('./subway/24b1stairs.glb'),
    //         loadAsync('./subway/25b1wall.glb'),
    //         loadAsync('./subway/26b1roof.glb'),
    //         loadAsync('./subway/27b1fence.glb'),
    //         loadAsync('./subway/28b1others.glb'),
    //         loadAsync('./subway/29b1signages.glb'),
    //         loadAsync('./subway/30b1pillars.glb'),
    //         loadAsync('./subway/31automaticRightDoor.glb'),
    //         loadAsync('./subway/32automaticLeftDoor.glb'),
    //
    //         //loadAsync('./subway/33f1buildings2.glb'),
    //         //loadAsync('./subway/34f1buildings3.glb'),
    //         //loadAsync('./subway/35f1buildings4.glb')
    //     ]
    // ).then(() => {
    //     $("#loadTime")[0].innerText = ((performance.now() - startLoadTime) / 1000).toFixed(2) + "秒";
    // });

    //分步加载
    loadAsync('./light_sub/23b1floor.glb').then(function(data){
        if(data) return loadAsync('./light_sub/25b1wall.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/14b2escalators.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/13b2floor.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/15b2escalatorWall.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/30b1pillars.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/17b2wall.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/16b2barriers.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/31automaticRightDoor.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/32automaticLeftDoor.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/27b1fence.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/1securityCheck.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/28b1others.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/22b1lights.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/21b2pillars.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/26b1roof.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/24b1stairs.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/3exitance2.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/4exitance6.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/5exitance3.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/6exitance4.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/7exitance5.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/8exitance1.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/2glass.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/12b2lights.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/18b2roof.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/19b2others.glb');
    }).then(function(data){
        if(data) return loadAsync('./light_sub/9ground.glb');
    // }).then(function(data){
    //     if(data) return loadAsync('./light_sub/10f1buildings1.glb');
    // }).then(function(data){
    //     if(data) return loadAsync('./light_sub/11f1others.glb');
    // }).then(function(data){
    //     if(data) return loadAsync('./light_sub/33f1buildings2.glb');
    // }).then(function(data){
    //     if(data) return loadAsync('./light_sub/34f1buildings3.glb');
    // }).then(function(data){
    //     if(data) return loadAsync('./light_sub/35f1buildings4.glb');
    }).then(() => {
        $("#loadTime")[0].innerText = ((performance.now() - startLoadTime) / 1000).toFixed(2) + "秒";
    });

    //分块加载
    // Promise.all(
    //     [
    //
    //         loadAsync('./light_sub/22b1lights.glb'),
    //         loadAsync('./light_sub/23b1floor.glb'),
    //         loadAsync('./light_sub/24b1stairs.glb'),
    //         loadAsync('./light_sub/25b1wall.glb'),
    //         loadAsync('./light_sub/26b1roof.glb'),
    //         loadAsync('./light_sub/27b1fence.glb'),
    //         loadAsync('./light_sub/28b1others.glb'),
    //         loadAsync('./light_sub/29b1signages.glb'),
    //         loadAsync('./light_sub/30b1pillars.glb'),
    //         loadAsync('./light_sub/1securityCheck.glb')
    //
    //     ]
    // ).then(() => {
    //     Promise.all(
    //         [
    //         loadAsync('./light_sub/2glass.glb'),
    //         loadAsync('./light_sub/3exitance2.glb'),
    //         loadAsync('./light_sub/4exitance6.glb'),
    //         loadAsync('./light_sub/5exitance3.glb'),
    //         loadAsync('./light_sub/6exitance4.glb'),
    //         loadAsync('./light_sub/7exitance5.glb'),
    //         loadAsync('./light_sub/8exitance1.glb'),
    //         ]
    //     ).then(() => {
    //         Promise.all(
    //             [
    //                 //loadAsync('./light_sub/9ground.glb'),
    //                 //loadAsync('./light_sub/10f1buildings1.glb'),
    //                 //loadAsync('./light_sub/11f1others.glb'),
    //
    //                 loadAsync('./light_sub/12b2lights.glb'),
    //                 loadAsync('./light_sub/13b2floor.glb'),
    //                 loadAsync('./light_sub/14b2escalators.glb'),
    //                 loadAsync('./light_sub/15b2escalatorWall.glb'),
    //                 loadAsync('./light_sub/16b2barriers.glb'),
    //                 loadAsync('./light_sub/17b2wall.glb'),
    //                 loadAsync('./light_sub/18b2roof.glb'),
    //                 loadAsync('./light_sub/19b2others.glb'),
    //                 loadAsync('./light_sub/20b2signages.glb'),
    //                 loadAsync('./light_sub/21b2pillars.glb'),
    //                 loadAsync('./light_sub/31automaticRightDoor.glb'),
    //                 loadAsync('./light_sub/32automaticLeftDoor.glb')
    //
    //                 //loadAsync('./light_sub/33f1buildings2.glb'),
    //                 //loadAsync('./light_sub/34f1buildings3.glb'),
    //                 //loadAsync('./light_sub/35f1buildings4.glb')
    //             ]
    //         ).then(() => {
    //                  $("#loadTime")[0].innerText = ((performance.now() - startLoadTime) / 1000).toFixed(2) + "秒";
    //              })
    //     })
    // });


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

