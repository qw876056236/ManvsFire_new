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
        self.mesh.scale.set(0.3,0.3,0.3);
        self.mesh.position.set(400,50,0);

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
                resolve();
            })
        })
    };

    /*建筑模型加载开始*/
    var startLoadTime = performance.now();
    Promise.all(
        [
            loadAsync('./subway/1securityCheck.glb'),
            loadAsync('./subway/2glass.glb'),
            loadAsync('./subway/3exitance2.glb'),
            loadAsync('./subway/4exitance6.glb'),
            loadAsync('./subway/5exitance3.glb'),
            loadAsync('./subway/6exitance4.glb'),
            loadAsync('./subway/7exitance5.glb'),
            loadAsync('./subway/8exitance1.glb'),
            loadAsync('./subway/9ground.glb'),
            loadAsync('./subway/10f1buildings1.glb'),
            loadAsync('./subway/11f1others.glb'),
            loadAsync('./subway/12b2lights.glb'),
            loadAsync('./subway/13b2floor.glb'),
            loadAsync('./subway/14b2escalators.glb'),
            loadAsync('./subway/15b2escalatorWall.glb'),
            loadAsync('./subway/16b2barriers.glb'),
            loadAsync('./subway/17b2wall.glb'),
            loadAsync('./subway/18b2roof.glb'),
            loadAsync('./subway/19b2others.glb'),
            loadAsync('./subway/20b2signages.glb'),
            loadAsync('./subway/21b2pillars.glb'),
            loadAsync('./subway/22b1lights.glb'),
            loadAsync('./subway/23b1floor.glb'),
            loadAsync('./subway/24b1stairs.glb'),
            loadAsync('./subway/25b1wall.glb'),
            loadAsync('./subway/26b1roof.glb'),
            loadAsync('./subway/27b1fence.glb'),
            loadAsync('./subway/28b1others.glb'),
            loadAsync('./subway/29b1signages.glb'),
            loadAsync('./subway/30b1pillars.glb'),
            loadAsync('./subway/31automaticRightDoor.glb'),
            loadAsync('./subway/32automaticLeftDoor.glb'),
            loadAsync('./subway/33f1buildings2.glb'),
            loadAsync('./subway/34f1buildings3.glb'),
            loadAsync('./subway/35f1buildings4.glb')
        ]
    ).then(() => {
        $("#loadTime")[0].innerText = ((performance.now() - startLoadTime) / 1000).toFixed(2) + "秒";
    })
    /*建筑模型加载结束*/


}

