var Resourceload = function(){
    this.url="room_model/";//资源路径
    this.camera = null;
    this.cameraPre = {};
    this.unitProcess = function(gltf){};//对各模型单元进行处理的函数

    this.NumberWaitMaps = 0;//等待加载的贴图个数

    this.object = new THREE.Object3D();
    //this.object.visible=false;
    this.loader = new THREE.GLTFLoader();//模型加载器
    this.resourceList = null;
    this.test=false;//true;//
    this.count = 0;
    this.sum = 0;
}

Resourceload.prototype.init = function(_this){
    var scope = this;
    scope.camera = _this.camera;
    //开启多线程对模型资源信息进行加载
    let data = [];
    let worker = new Worker('js/resourceLoadWorker.js');
    worker.postMessage("../"+this.url+"resourceInfo.json");
    worker.onmessage = function (event)
    {
        let resourceInfo=JSON.parse(event.data);
        scope.resourceList=new ResourceList(
            {resourceInfo:resourceInfo,camera:scope.camera,test:scope.test}
        );
        if(scope.test)scope.object.add(scope.resourceList.testObj);

        scope.loadGeometry(_this.scene);
        scope.loadMap();
        _this.scene.add(scope.object);
    }

}

Resourceload.prototype.loadGeometry=function(scene){
    var scope=this;
    load();
    modelCulling();
    cullingCompute();
    test();
    function load() {
        var fileName=scope.resourceList.getOneModelFileName();
        if(!fileName){//如果当前没有需要加载的几何文件
            updateCameraPre();
            let myInterval=setInterval(function () {
                if(cameraHasChanged()){//如果相机位置和角度发生了变化
                    load();
                    clearInterval(myInterval);
                }
            },300);
        }else{
            scope.loader.load(scope.url+fileName, (gltf) => {
                if(scope.resourceList.getModelByName(fileName)!=="")
                    scope.NumberWaitMaps++;//如果这个几何数据需要加载对应的贴图资源
                var mesh0=gltf.scene.children[0];
                mesh0.nameFlag=fileName;
                scope.unitProcess(gltf);
                scope.object.add(mesh0);
                load();
            });
        }

        function updateCameraPre(){
            scope.cameraPre.position=scope.camera.position.clone();
            scope.cameraPre.rotation=scope.camera.rotation.clone();
        }
        function cameraHasChanged(){
            return scope.camera.position.x !== scope.cameraPre.position.x ||
                scope.camera.position.y !== scope.cameraPre.position.y ||
                scope.camera.position.z !== scope.cameraPre.position.z ||
                scope.camera.rotation.x !== scope.cameraPre.rotation.x ||
                scope.camera.rotation.y !== scope.cameraPre.rotation.y ||
                scope.camera.rotation.z !== scope.cameraPre.rotation.z;
        }
    }
    //对多次处于视锥外且已被加载的模型进行剔除
    function modelCulling()
    {
        scope.resourceList.cullingList.forEach(function (key,value)
        {
            let limit = 200;
            if(key>limit) {
                for(let i =0;i<scope.object.children.length;i++)
                {
                    if(scope.object.children[i].nameFlag === value){
                        scope.object.remove(scope.object.children[i]);
                        let model=scope.resourceList.getModelByName(value);
                        let filename = value.replace("gltf","jpg");
                        let map=scope.resourceList.getMapByName(filename);
                        model.finishLoad = false;
                        if(map!==undefined)
                            map.finishLoad = false;
                    }
                }
                scope.resourceList.cullingList.delete(value);
            }
        });
        let myInterval=setInterval(function () {
            modelCulling();
            clearInterval(myInterval);
        },200);
    }

    function cullingCompute()
    {

        let _scope = scope.resourceList;
        _scope.update();//计算每个模型的inView
        for(let i=0;i<_scope.models.length;i++) {

            if (_scope.models[i].finishLoad) {
                if (!_scope.models[i].inView) {
                    if (_scope.cullingList.has(_scope.models[i].fileName)) {
                        _scope.cullingList.set(_scope.models[i].fileName, _scope.cullingList.get(_scope.models[i].fileName) + 5);
                    } else
                        _scope.cullingList.set(_scope.models[i].fileName, 0);
                } else {
                    if (_scope.cullingList.has(_scope.models[i].fileName)) {
                        if (_scope.cullingList.get(_scope.models[i].fileName) === 0)
                            _scope.cullingList.delete(_scope.models[i].fileName);
                        else
                            _scope.cullingList.set(_scope.models[i].fileName, _scope.cullingList.get(_scope.models[i].fileName) - 1);
                    }
                }
            }
        }
        let myInterval=setInterval(function () {
            cullingCompute();
            clearInterval(myInterval);
        },100);
    }

    function test()
    {
        $("#loadTime")[0].innerText = "实时建筑数量:"+scope.object.children.length;
        //console.log(scope.object.children.length);
        scope.count++;
        scope.sum += scope.object.children.length;
        $("#avg")[0].innerText = "平均建筑数量:"+parseInt(scope.sum/scope.count);
        let myInterval=setInterval(function () {
            test();
            clearInterval(myInterval);
        },1000);
    }
}

Resourceload.prototype.loadMap=function(){
    var scope=this;
    load();
    function load() {
        var fileName=scope.resourceList.getOneMapFileName();
        if(!fileName){//如果当前没有需要加载的贴图文件
            var myInterval=setInterval(function () {
                if(scope.NumberWaitMaps){//如果相机位置和角度发生了变化
                    load();
                    clearInterval(myInterval);
                }
            },100);
        }else{
            var myMap=scope.resourceList.getMapByName(fileName);
            new THREE.TextureLoader().load(
                scope.url+fileName,// resource URL
                function ( texture ) {// onLoad callback
                    scope.NumberWaitMaps--;//加载了一个贴图资源
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    var myInterval2=setInterval(function () {
                        var mesh0;
                        for(var i=0;i<scope.object.children.length;i++){
                            if (scope.object.children[i].nameFlag===myMap.modelName)
                                mesh0=scope.object.children[i];
                        }
                        if(mesh0){
                            mesh0.material = new THREE.MeshLambertMaterial({map: texture});
                            clearInterval(myInterval2);
                        }
                    },100)
                    load();
                }
            );
        }
    }
}

var ResourceList = function(input){
    var scope=this;
    window.l=this;
    scope.camera=input.camera;
    var resourceInfo=input.resourceInfo;
    if(input.test)scope.testObj=new THREE.Object3D();
    else scope.testObj=null;

    scope.maps=resourceInfo.maps;
    //fileName;modelName;
    for(var i=0;i<scope.maps.length;i++){
        scope.maps[i].finishLoad=false;
    }
    scope.models=resourceInfo.models;
    //fileName;interest;boundingSphere{x,y,z,r};MapName;spaceVolume;
    for(i=0;i<scope.models.length;i++){
        scope.models[i].finishLoad=false;
        scope.models[i].inView=false;
    }
    scope.mapsIndex=resourceInfo.mapsIndex;

    scope.cullingList = new Map();

    if(scope.testObj){//开始测试
        testObjMesh();
    }//完成测试
    function testObjMesh(){
        for(var i=0;i<scope.models.length;i++){
            var r=scope.models[i].boundingSphere.r;
            var geometry= new THREE.SphereGeometry(r, 60, 60);//(r,60,16);
            var material = new THREE.MeshNormalMaterial();
            var mesh= new THREE.Mesh(geometry, material);
            mesh.position.set(
                scope.models[i].boundingSphere.x,
                scope.models[i].boundingSphere.y,
                scope.models[i].boundingSphere.z
            );
            scope.testObj.add(mesh);
        }
    }
}

ResourceList.prototype.getOneModelFileName=function(){
    var scope=this;
    var list=getModelList();
    if(list.length===0)return null;
    var _model= {interest:-1};//记录兴趣度最大的资源


    for(var i=0;i<list.length;i++){
        var model=scope.getModelByName(list[i]);
        if(model.interest>_model.interest){
            _model=model;
        }
    }
    _model.finishLoad=true;
    return _model.fileName;
    function getModelList(){//返回在视锥内且未被加载的资源列表
        scope.update();//计算每个模型的inView
        var list=[];
        for(var i=0;i<scope.models.length;i++){
            // if(scope.models[i].inView&&!scope.models[i].finishLoad)
            //     list.push(scope.models[i].fileName);

            if(scope.models[i].finishLoad)
            {

            }
            else if(scope.models[i].inView)
            {
                list.push(scope.models[i].fileName);
            }
        }
        return list;
    }
}

ResourceList.prototype.getOneMapFileName=function(){
    var scope=this;
    var list=getMapList();
    if(list.length===0)return null;
    var _map={interest:-1};//记录兴趣度最大的资源
    for(var i=0;i<list.length;i++){
        var map=scope.getMapByName(list[i]);
        if(map.interest>_map.interest){
            _map=map;
        }
    }
    _map.finishLoad=true;
    return _map.fileName;
    function getMapList(){
        //对应模型已被加载
        // 且对应模型现在视锥内
        // 且贴图本身未被加载的贴图资源列表
        scope.update();//计算每个模型的inView
        var list=[];
        for(let i=0;i<scope.maps.length;i++){
            var model=scope.getModelByName(scope.maps[i].modelName);
            if(model.finishLoad
                &&model.inView
                &&!scope.maps[i].finishLoad)
                list.push(scope.maps[i].fileName);
        }
        return list;
    }
}

ResourceList.prototype.update=function(){//判断哪些资源在视锥内
    var scope=this;
    computeFrustumFromCamera();
    for(var i=0;i<scope.models.length;i++){
        scope.models[i].inView= intersectsSphere(
            scope.models[i].boundingSphere.x,
            scope.models[i].boundingSphere.y,
            scope.models[i].boundingSphere.z,
            scope.models[i].boundingSphere.r
        )
    }
    function computeFrustumFromCamera(){//求视锥体
        var camera=scope.camera;
        var frustum = new THREE.Frustum();
        //frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix,camera.matrixWorldInverse ) );

        const projScreenMatrix = new THREE.Matrix4();
        projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
        frustum.setFromProjectionMatrix(projScreenMatrix);
        scope.frustum=frustum;
    }
    function intersectsSphere(x,y,z,radius ) {
        var center=new THREE.Vector3(x,y,z)
        const planes = scope.frustum.planes;
        //const center = sphere.center;
        const negRadius = - radius;
        for ( let i = 0; i < 6; i ++ ) {
            const distance = planes[ i ].distanceToPoint( center );//平面到点的距离，
            if ( distance < negRadius ) {//内正外负
                return false;//不相交
            }
        }
        return true;//相交
    }
}

ResourceList.prototype.getMapByName=function (name) {
    var scope=this;
    for(var i=0;i<scope.maps.length;i++){
        if(scope.maps[i].fileName===name)
            return scope.maps[i];
    }
}
ResourceList.prototype.getModelByName=function (name) {
    var scope=this;
    for(var i=0;i<scope.models.length;i++){
        if(scope.models[i].fileName===name)
            return scope.models[i];
    }
}
