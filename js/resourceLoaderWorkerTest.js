let flag = false;
let instance = [];

onmessage = function (event)
{
    importScripts('../lib/three.js');
    importScripts('../js/Loader/GLTFLoader.js');

    //初次加载子线程
    if(!flag)
    {
        instance = new Resourceloader();
        let data = event.data.camera.planes;
        for(let i =0;i<6;i++)
        {
            let temp = new THREE.Vector3(data[i].normal.x,data[i].normal.y,data[i].normal.z);
            data[i] = new THREE.Plane(temp, data[i].constant);
        }
        instance.init(data);
        flag = true;
    }
    else //非第一次加载子线程，进入循环模式
    {
        let output = instance.updateInit(event.data);
        postMessage(output);
    }

}

var Resourceloader = function(){

    this.url="../room_model/";//资源路径
    this.camera = null;
    this.scene = null;
    this.cameraPre = {};
    this.unitProcess = function(gltf){};//对各模型单元进行处理的函数

    this.NumberWaitMaps = 0;//等待加载的贴图个数

    this.object = new THREE.Object3D();
    this.object.name = "resource";
    //this.object.visible=false;
    this.loader = new THREE.GLTFLoader();//模型加载器
    this.resourceList = null;
    this.test=false;//true;//
}

Resourceloader.prototype.init = function(_this){
    var scope = this;
    scope.camera = _this;

    let loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
    loader.load(this.url+"resourceInfo.json", function(str) {//dataTexture
        var resourceInfo = JSON.parse(str);
        scope.resourceList=new resourceListTest(
            {resourceInfo:resourceInfo,camera:scope.camera,test:scope.test}
        );
        if (scope.test)scope.object.add(scope.resourceList.testObj);

        scope.loadGeometry();
        scope.loadMap();
        let data = [];
        data.flag = 1;
        data.object = scope.object;
        postMessage(data);
    });

}

Resourceloader.prototype.updateInit = function (_this)
{
    var scope = this;
    scope.camera = _this.camera;

    if (scope.test)scope.object.add(scope.resourceList.testObj);

    scope.loadGeometry();
    scope.loadMap();
    let data = [];
    data.flag = 2;
    data.object = scope.object;
    return data;
}

Resourceloader.prototype.loadGeometry=function(){
    var scope=this;
    load();
    function load() {
        var fileName=scope.resourceList.getOneModelFileName();
        if(!fileName){//如果当前没有需要加载的几何文件
        }
        else{
            scope.loader.load(scope.url+fileName, (gltf) => {
                if(scope.resourceList.getModelByName(fileName)!=="")
                    scope.NumberWaitMaps++;//如果这个几何数据需要加载对应的贴图资源
                var mesh0=gltf.scene.children[0];
                mesh0.nameFlag=fileName;
                scope.unitProcess(gltf);
                scope.object.add(mesh0);
                let data = [];
                data.flag = 2;
                data.object = scope.object;
                postMessage(data);
            });
        }
        //modelCulling();
        //对多次处于视锥外且已被加载的模型进行剔除
        function modelCulling()
        {
            scope.resourceList.cullingList.forEach(function (key,value)
            {
                let limit = 250;
                if(key>limit) {
                    scope.scene.traverse(function (mesh0) {
                        if(mesh0.nameFlag === value){
                            mesh0.parent.remove(mesh0);
                            let model=scope.resourceList.getModelByName(value);
                            let filename = value.replace("gltf","jpg");
                            let map=scope.resourceList.getMapByName(filename);
                            model.finishLoad = false;
                            map.finishLoad = false;
                        }
                    });
                    scope.resourceList.cullingList.delete(value);
                }
            });
        }


    }
}

Resourceloader.prototype.loadMap=function(){
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

var resourceListTest = function(input){
    var scope=this;
    //window.l=this;
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

resourceListTest.prototype.getOneModelFileName=function(){
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
                if(!scope.models[i].inView) {
                    if (scope.cullingList.has(scope.models[i].fileName)) {
                        //scope.cullingList[model.fileName]++;
                        scope.cullingList.set(scope.models[i].fileName,scope.cullingList.get(scope.models[i].fileName)+1);
                    } else
                        scope.cullingList.set(scope.models[i].fileName, 0);
                }
                else
                {
                    if (scope.cullingList.has(scope.models[i].fileName)) {
                        if(scope.cullingList.get(scope.models[i].fileName) === 0)
                            scope.cullingList.delete(scope.models[i].fileName);
                        else
                            scope.cullingList.set(scope.models[i].fileName,scope.cullingList.get(scope.models[i].fileName)-1);
                    }
                }
            }
            else if(scope.models[i].inView)
            {
                list.push(scope.models[i].fileName);
            }
        }
        return list;
    }
}

resourceListTest.prototype.getOneMapFileName=function(){
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

resourceListTest.prototype.update=function(){//判断哪些资源在视锥内
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
        // var frustum = new THREE.Frustum();
        // //frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix,camera.matrixWorldInverse ) );
        //
        // const projScreenMatrix = new THREE.Matrix4();
        // projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
        // frustum.setFromProjectionMatrix(projScreenMatrix);

        scope.frustum=camera;
    }
    function intersectsSphere(x,y,z,radius ) {
        var center=new THREE.Vector3(x,y,z)
        const planes = scope.frustum;
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

resourceListTest.prototype.getMapByName=function (name) {
    var scope=this;
    for(var i=0;i<scope.maps.length;i++){
        if(scope.maps[i].fileName===name)
            return scope.maps[i];
    }
}
resourceListTest.prototype.getModelByName=function (name) {
    var scope=this;
    for(var i=0;i<scope.models.length;i++){
        if(scope.models[i].fileName===name)
            return scope.models[i];
    }
}
