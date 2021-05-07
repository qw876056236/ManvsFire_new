export {mainScene};
import {PeopleController} from './move/PeopleController.js';
var mainScene = function()
{
        this.stats = initStats();

        function initStats() {
            var stats = new Stats();
            stats.setMode(0); // 0: fps, 1: ms
            // Align top-left
            stats.domElement.style.position = 'relative';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';
            document.getElementById("Stats-output").appendChild(stats.domElement);
            return stats;
        }


    //this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    //this.clock.start();

    this.number = 100;//人数

    this.camera = null;

    this.camDirection;

    this.renderer = null;//渲染器

    this.clock = new THREE.Clock();

    this.freeViewControl = null;     //自由观察视角

    //视角限制的实例
    this.Cameracontroller = new CameraController();

    //视角状态初始化
    this.camera_status = this.Cameracontroller.setenum.none;

    this.camControl = null;

    this.isACO = true;  //是否进行默认的蚁群算法

    this.isOverView = false; //初始时观察整个地铁站时用这个

    this.isStartRun = false; //是否开始？

    this.active = false;    //暂停

    this.underground = new Underground();//场景

    this.resourceLoader = new Resourceload();

    this.directionalLight = [];

    this.ambientLight = new THREE.AmbientLight(0x1c1c1c,1);

    this.emergencyLightArr = [];

    this.emergencyLightMeshArr = [];

    this.sirenSound = null;

    this.noisySound = null;

    /*
    this.Path = new path();

    this.smoke = new NSsmoke();//烟

    this.messagecontrol = new messageControl();//控制子线程传输

    this.fire = new fireControl();//火

    this.water = new waterControl();//水

    this.Fireman = new fireman();//消防员&灭火

    this.light = new light();//光照

    this.FOI = new foiControl();//视锥控制

     */
    this.smoke = new Smoke();//烟

    this.fire = new fireControl();//火

    this.people = new People();//人群

    this.HCI = new Interaction();//交互控制

    this.smokeEditor = new SmokeEditor();//烟雾编辑器

    this.sign = new Sign();//标志牌

    this.globalPlane = null;

    this.currentEscapeTime = 0;

    this.firstEscapeTime = 0;

    this.EscapeNumber = 0;

    this.raycaster = new THREE.Raycaster();//点击坐标测试射线

    this.pMesh = null;//点击坐标测试球体


    //控制参数

    this.isEdit = false;
    this.isBook3 = false;

    this.mouse=new THREE.Vector2();


    this.isFinishLoadCharactor = false;


    this.step = new Array(10);
    this.step.fill(0);

    this.count = new Array(10);
    this.count.fill(0);

    //this.messagecontrol.START(this);

    //debug专用
    //this.Test = new test();
}

mainScene.prototype.init = function()
{
    //初始化
    this.setScene();


    //region 视角控制初始化
    this.Cameracontroller.init(this);
    this.playerControl=null;////通过鼠标键盘或者手机触屏控制相机
    //endregion

    //region 路径
    //this.Path.init(this);
    //endregion

    //region 水
    //this.water.init(this);
    //endregion

    //region 烟雾
    this.smoke.init(this);
    //endregion

    //烟雾编辑器
    this.smokeEditor.init(this);
    //endregion

    //region 火
    this.fire.init(this);
    console.log(this.fire.spawnTime);
    //endregion

    //region场景加载
    this.underground.init(this);
    this.resourceLoader.init(this);
    console.log(this.resourceLoader);
    //endregion

    //regiog消防员加载
    //this.Fireman.init(this);
    //endregion

    //this.light.init(this);

    //标志牌加载
    this.sign.init(this);

    //交互1
    this.HCI.fuc1(this);

    //交互2
    this.HCI.fuc2(this);

    //交互4
    this.HCI.fuc4(this);

    //debug专用
    this.HCI.fuc5(this);
};

mainScene.prototype.start = function()
{
    var self = this;
    this.clock.start();  //todo maybe stop

    //self.Path.createNav();
        animate();

    function animate()
    {
        self.delta = self.clock.getDelta();

        if(self.isEdit)
        {
            self.smokeEditor.update(self);
            //self.fire.update(self);
        }


        if(self.active)
        {
            //self.water.update();    //todo debug here

            self.fire.update(20);

            self.smoke.update(self);

            //self.Fireman.update(self);

            self.people.update(self);

            //self.Test.update(self);
            //视锥剔除
            //self.FOI.update(self);

            //火车动
            ///self.underground.update(self,self.delta);
        }
        //self.Cameracontroller.update1(self);
        self.pMesh.position.set(document.getElementById("x").value,document.getElementById("y").value,document.getElementById("z").value);

        //self.cameraControl();

        TWEEN.update();

        self.stats.update();

        requestAnimationFrame(animate);
        self.renderer.clear();
        self.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        self.renderer.render(self.scene, self.camera);
        //todo self.renderer.clear();    与renderer.autoClear = false 对应 不知道意义何在
        //self.stats.end()

       // self.LOD;//lod算法
    }

}

mainScene.prototype.setScene = function()
{
    var self = this;
    //region 基础场景
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000000);
    //this.camera.position.set(60,3,146);
    //this.camera.lookAt(new THREE.Vector3(1,1,1));

    window.c=this.camera;

    this.camera.position.set( 58.01241244232402,  -5.641555076511444, 166.09795410450);
    this.camera.rotation.set(-3.0998049228015434, 0.03830701739587247, 3.139991350918273)

    this.playerControl=new PlayerControl(this);//通过鼠标键盘或者手机触屏控制相机
    this.playerControl.init();

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.autoClear = true;    //todo 不声明的话默认为true,原demo为false, 与start.animate 中renderer.clear()对应
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor( 0xbbd0d9 );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    document.getElementById("WebGL-output").appendChild(this.renderer.domElement);

    this.camControlOver = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.camControlOver.center = new THREE.Vector3(430,24,21);
    this.camControlOver.userPan = false;
    this.camControlOver.autoRotate=true;


    this.freeViewControl = this.camControlOver;

    var camControl = new THREE.FirstPersonControls(this.camera, this.renderer.domElement);
    camControl.lookSpeed = 1;
    camControl.movementSpeed = 1 * 10;
    camControl.noFly = true;
    camControl.lookVertical = true;
    camControl.constrainVertical = true;
    camControl.verticalMin = 1.0;
    camControl.verticalMax = 2.0;
    camControl.lon =120;
    camControl.lat =-90;
    this.camControl = camControl;

    var directionalLight_1 = new THREE.DirectionalLight(0xffffff,0.6);
    //directionalLight_1.position.set(0.3,0.4,0.5);
    directionalLight_1.position.set(0,1,1);
    this.scene.add(directionalLight_1);
    this.directionalLight.push(directionalLight_1);

    var directionalLight_2 = new THREE.DirectionalLight(0xffffff,0.6);
    //directionalLight_2.position.set(-0.3,-0.4,0.5);
    directionalLight_2.position.set(0,1,-1);
    this.scene.add(directionalLight_2);
    this.directionalLight.push(directionalLight_2);

    var directionalLight_3 = new THREE.DirectionalLight(0xffffff,0.6);
    //directionalLight_2.position.set(-0.3,-0.4,0.5);
    directionalLight_3.position.set(1,0,0);
    this.scene.add(directionalLight_3);
    this.directionalLight.push(directionalLight_3);

    var directionalLight_4 = new THREE.DirectionalLight(0xffffff,0.6);
    //directionalLight_2.position.set(-0.3,-0.4,0.5);
    directionalLight_4.position.set(-1,0,0);
    this.scene.add(directionalLight_4);
    this.directionalLight.push(directionalLight_4);

    var directionalLight_5 = new THREE.DirectionalLight(0xffffff,0.6);
    //directionalLight_2.position.set(-0.3,-0.4,0.5);
    directionalLight_5.position.set(0,-1,0);
    this.scene.add(directionalLight_5);
    this.directionalLight.push(directionalLight_5);

    var directionalLight_6 = new THREE.DirectionalLight(0xffffff,0.6);
    //directionalLight_2.position.set(-0.3,-0.4,0.5);
    directionalLight_6.position.set(0,1,0);
    this.scene.add(directionalLight_6);
    this.directionalLight.push(directionalLight_6);

    var emerencyLight, lightMesh,targetObject;
    for(var i=0;i<10;i++){
        emerencyLight = new THREE.PointLight(0Xffffff,4,8);
        //emerencyLight.position.set(41.2,-5.7,173+18*i);
        emerencyLight.position.set(42,-5.7,173+18*i);
        this.emergencyLightArr.push(emerencyLight);

        //this.scene.add(emerencyLight);

        emerencyLight = new THREE.PointLight(0Xffffff,4,8);
        //emerencyLight.position.set(61.2,-5.7,173+18*i);
        emerencyLight.position.set(60.4,-5.7,173+18*i);
        this.emergencyLightArr.push(emerencyLight);
        //this.scene.add(emerencyLight);

        lightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1,4,4),
                                    new THREE.MeshBasicMaterial({color: 0xffffff}));
        this.emergencyLightMeshArr.push(lightMesh);
        lightMesh.position.set(41.2,-5.7,170+18*i);
        this.scene.add(lightMesh);

        lightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1,4,4),
            new THREE.MeshBasicMaterial({color: 0xffffff}));
        this.emergencyLightMeshArr.push(lightMesh);
        lightMesh.position.set(61.2,-5.7,170+18*i);
        this.scene.add(lightMesh);
    }

    for(i=0;i<14;i++){
        emerencyLight = new THREE.SpotLight(0Xffffff,4,8);
        emerencyLight.position.set(45,-11,181.4+13.8*i);
        this.emergencyLightArr.push(emerencyLight);
        //this.scene.add(emerencyLight);

        emerencyLight = new THREE.SpotLight(0Xffffff,4,8);
        emerencyLight.position.set(45,-11,181.4+13.8*i);
        this.emergencyLightArr.push(emerencyLight);
        //this.scene.add(emerencyLight);

        lightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1,4,4),
            new THREE.MeshBasicMaterial({color: 0xffffff}));
        this.emergencyLightMeshArr.push(lightMesh);
        lightMesh.position.set(45,-11,181.4+13.8*i);
        this.scene.add(lightMesh);

        lightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1,4,4),
            new THREE.MeshBasicMaterial({color: 0xffffff}));
        this.emergencyLightMeshArr.push(lightMesh);
        lightMesh.position.set(57.4,-11,181.4+13.8*i);
        this.scene.add(lightMesh);
    }

    // create an AudioListener and add it to the camera
    var listener = new THREE.AudioListener();
    this.camera.add( listener );

// create a global audio source
    this.sirenSound = new THREE.Audio( listener );

    var listener = new THREE.AudioListener();
    this.camera.add(listener);
    this.noisySound = new THREE.Audio(listener);








//endregion

    //region 物体操作工具
    this.control = new THREE.TransformControls( this.camera, this.renderer.domElement );
    this.control.attach( );
    this.scene.add( this.control );
    this.control.visible = false;

    this.extinguisherControl_1=new THREE.TransformControls(this.camera,this.renderer.domElement);
    this.extinguisherControl_1.attach();
    this.scene.add(this.extinguisherControl_1);
    this.extinguisherControl_1.visible=false;
    this.extinguisherControl_2=new THREE.TransformControls(this.camera,this.renderer.domElement);
    this.extinguisherControl_2.attach();
    this.scene.add(this.extinguisherControl_2);
    this.extinguisherControl_2.visible=false;
    this.extinguisherControl_3=new THREE.TransformControls(this.camera,this.renderer.domElement);
    this.extinguisherControl_3.attach();
    this.scene.add(this.extinguisherControl_3);
    this.extinguisherControl_3.visible=false;
    this.extinguisherControl_4=new THREE.TransformControls(this.camera,this.renderer.domElement);
    this.extinguisherControl_4.attach();
    this.scene.add(this.extinguisherControl_4);
    this.extinguisherControl_4.visible=false;
    this.extinguisherControl_5=new THREE.TransformControls(this.camera,this.renderer.domElement);
    this.extinguisherControl_5.attach();
    this.scene.add(this.extinguisherControl_5);
    this.extinguisherControl_5.visible=false;
//endregion

    //region 选取着火点剖切平面
    this.globalPlane = new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 0.1 );
    this.globalPlane.constant =10000;//剖切的位置
    this.renderer.clippingPlanes.push(this.globalPlane);
    this.renderer.localClippingEnabled = true;
//endregion

    //region 点击坐标测试球体设置
    var pointGeo = new THREE.SphereGeometry(0.1,8,8);
    var pointMaterial = new THREE.MeshLambertMaterial({
        emissive: 0xff0000
    });
    this.pMesh = new THREE.Mesh(pointGeo,pointMaterial);
    this.scene.add(this.pMesh);
    this.pMesh.position.set(0,0,0);


    //开始测试
    function createCrowed(number,finished) {
        var obj=initPeople(2);
        //movePeople(obj);
        //this.scene.add(obj);
        function initPeople(number) {
            var obj=new THREE.Object3D();
            var pmLoader = new MyPMLoader(
                {animations: []},
                './peopleModel/Male',    //模型路径
                [],//没有LOD分级//LOD等级的数组
                null,  //LOD需要判断到相机的距离//实例化渲染难以使用LOD
                0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
                0,     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
                [],
                function () {
                    var mesh = pmLoader.rootObject.children[0];
                    var people = new InstancedGroup(
                        number,//人数
                        [mesh],//这些mesh的网格应该一致
                        true//有动画
                    );
                    people.neckPosition=0.68;
                    people.init(
                        ['./peopleTexture/m/m0.jpg'],
                        32
                    );
                    for (var i = 0; i < people.instanceCount; i++) {
                        people.rotationSet(i, [Math.PI / 2, 0, 0]);
                        people.positionSet(i, [8 * i, 0, 0]);
                        people.scaleSet(i, [0.1, 0.1, 0.1]);
                        people.animationSet(i,Math.floor(Math.random()*3));
                        people.speedSet(i,Math.random()+0.5);
                        people.textureSet(i,[Math.floor(Math.random()*16),Math.floor(Math.random()*16),Math.floor(Math.random()*16)]);
                    }
                    obj.add(people.obj);
                    obj.people=people;
                    var timeId = setInterval(function () {
                        mesh = pmLoader.rootObject.children[0];
                        people.setGeometry(mesh.geometry);
                        console.log(pmLoader.finished);
                        if (pmLoader.finished) window.clearInterval(timeId)
                    }, 1000);
                }
            );
            return obj;
        }
        function movePeople(obj0) {
            setInterval(function () {
                var people=obj0.people;
                people.move(0,[0,0,0.5]);
                people.rotation(1,[0,0,0.1]);
            },100)
        }
    }
    class Crowed{//将PM和实例化渲染结合起来
        obj;
        people;
        number;
        constructor(){
            this.obj=new THREE.Object3D();
        }
        init=function(number,config) {
            var scope=this;
            var obj=scope.obj;
            scope.number=number;
            var pmLoader = new MyPMLoader(
                {animations: []},
                './peopleModel/Male',    //模型路径
                [],//没有LOD分级//LOD等级的数组
                null,  //LOD需要判断到相机的距离//实例化渲染难以使用LOD
                0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
                0,     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
                [],
                function () {
                    var mesh = pmLoader.rootObject.children[0];
                    var people = new InstancedGroup(
                        number,//人数
                        [mesh],//这些mesh的网格应该一致
                        true//有动画
                    );
                    scope.people=people;
                    people.neckPosition=0.68;
                    people.init(
                        ['./peopleTexture/m/m0.jpg'],
                        32
                    );
                    if(config)config();
                    for (var i = 0; i < people.instanceCount; i++) {
                        people.rotationSet(i, [Math.PI / 2, 0, 0]);
                        //people.positionSet(i, [8 * i, 0, 0]);
                        people.scaleSet(i, [0.01, 0.01, 0.01]);
                        people.animationSet(i,Math.floor(Math.random()*3));
                        people.speedSet(i,Math.random()+0.5);
                        people.textureSet(i,[Math.floor(Math.random()*16),Math.floor(Math.random()*16),Math.floor(Math.random()*16)]);
                    }
                    obj.add(people.obj);
                    obj.people=people;
                    var timeId = setInterval(function () {
                        mesh = pmLoader.rootObject.children[0];
                        people.setGeometry(mesh.geometry);
                        console.log(pmLoader.finished);
                        if (pmLoader.finished) window.clearInterval(timeId)
                    }, 1000);
                }
            );
        }
    }


    var crowed=new Crowed();
    crowed.init(1,function () {
        crowed.people.positionSet(0, [59.24+1,-8.54,216.22]);
        //crowed.people.positionSet(1, [58.91+1,-8.54,181.01]);
        //crowed.people.positionSet(2, [59.78+1,-8.54,159.48]);
        var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
        loader.load("grid.json", function(str){//dataTexture
            var grid0=JSON.parse(str).grid;
            loader.load("grid_1.json", function(str1){//dataTexture
                var grid1=JSON.parse(str1).grid;//"./Model/avatar/male_run.glb",
                var p1=new PeopleController()
                p1.updateModel=function () {
                    var pos0=crowed.people.positionGet(0);
                    p1.model.position={x:pos0[0],y:pos0[1],z:pos0[2]}
                }
                p1.setPosition=function(avatar,pos){
                    avatar.positionSet(0,pos);
                };
                p1.getPosition=function(avatar){
                    return avatar.positionGet(0);
                };
                p1.setRotation=function(avatar,pos){
                    return avatar.rotationSet(0,pos);
                    //console.log(avatar)
                    //avatar.position.set(pos[0],pos[1],pos[2]);
                };
                p1.getRotation=function(avatar,pos){
                    return avatar.rotationGet(0);
                    //console.log(avatar)
                    ///avatar.position.set(pos[0],pos[1],pos[2]);
                };/**/
                p1.init(crowed.people,grid0,grid1);
            });
        });
    })
    this.scene.add(crowed.obj);

    //完成测试

    //开始测试2

            var scope0=this;
            var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
            loader.load("grid.json", function(str){//dataTexture
                var grid0=JSON.parse(str).grid;
                loader.load("grid_1.json", function(str1){//dataTexture
                    var grid1=JSON.parse(str1).grid;//"./Model/avatar/male_run.glb",
                    new THREE.GLTFLoader().load("./Model/avatar/male_run.glb", (glb) => {
                        function play(G){
                            var meshMixer2 = new THREE.AnimationMixer(G.scene);
                            meshMixer2.clipAction(G.animations[0]).play();
                            setInterval(function () {
                                meshMixer2.update(0.01);
                            },20);
                            return glb.scene;
                        }
                        play(glb);var g1=glb.scene;scope0.scene.add(g1)
                        scope0.scene.add(new PeopleController(g1,grid0,grid1,[59.24,-8.54,216.22]).model)
                        //scope0.scene.add(new window.PeopleController(g2,grid0,grid1,[58.91,-8.54,181.01]).model)
                        //scope0.scene.add(new window.PeopleController(play(glb),grid0,grid1,[59.78,-8.54,159.48]).model)
                    });
                    /*new THREE.GLTFLoader().load("./Model/avatar/female_run.glb", (glb) => {
                        function play(G){
                            var meshMixer2 = new THREE.AnimationMixer(G.scene);
                            meshMixer2.clipAction(G.animations[0]).play();
                            setInterval(function () {
                                meshMixer2.update(0.01);
                            },20);
                            return glb.scene;
                        }
                        play(glb);var g1=glb.scene;scope0.scene.add(g1)
                        //scope0.scene.add(new window.PeopleController(g1,grid0,grid1,[59.24,-8.54,216.22]).model)
                        scope0.scene.add(new PeopleController(g1,grid0,grid1,[58.91,-8.54,181.01]).model)
                        //scope0.scene.add(new window.PeopleController(play(glb),grid0,grid1,[59.78,-8.54,159.48]).model)
                    });
                    new THREE.GLTFLoader().load("./Model/avatar/childMale_run.glb", (glb) => {
                        function play(G){
                            var meshMixer2 = new THREE.AnimationMixer(G.scene);
                            meshMixer2.clipAction(G.animations[0]).play();
                            setInterval(function () {
                                meshMixer2.update(0.01);
                            },20);
                            return glb.scene;
                        }
                        play(glb);var g1=glb.scene;scope0.scene.add(g1)
                        //scope0.scene.add(new window.PeopleController(g1,grid0,grid1,[59.24,-8.54,216.22]).model)
                        //scope0.scene.add(new window.PeopleController(g1,grid0,grid1,[58.91,-8.54,181.01]).model)
                        scope0.scene.add(new PeopleController(g1,grid0,grid1,[59.78,-8.54,159.48]).model)
                    });
                    */


                    //[59.78,-8.54,159.48]
                });
            });
            /**/
    //完成测试2

//endregion
}

mainScene.prototype.addPeople = function ()
{
    this.people.init(this);
}

mainScene.prototype.addFOI = function()
{
    this.FOI.init(this);
}

mainScene.prototype.LOD = function ()
{
    var self = this;
    //LOD算法，根据视距进行模型的显示和隐藏
    self.camDirection = self.camera.position.clone();
    var isCamUp = self.camera.position.y>18; //如果摄像机在第二层，将此变量设置成true
    for(var key in self.people.pathControlMap){

        if(self.people.pathControlMap[key].prototype === THREE.FollowerControl.prototype){
            if(Math.abs(self.people.pathControlMap[key].object.position.x-self.camDirection.x)+
                Math.abs(self.people.pathControlMap[key].object.position.y-self.camDirection.y)+
                Math.abs(self.people.pathControlMap[key].object.position.z-self.camDirection.z) > 100){

                self.people.pathControlMap[key].object.visible = false;
                if(self.people.pathControlMap[key].lod_low_level_obj){
                    if((isCamUp && self.people.pathControlMap[key].object.position.y>18)||(!isCamUp && self.people.pathControlMap[key].object.position.y<18)){
                        self.people.pathControlMap[key].lod_low_level_obj.visible = true;
                    }else{
                        self.people.pathControlMap[key].lod_low_level_obj.visible = false;
                    }
                }
            }else{
                if((isCamUp && self.people.pathControlMap[key].object.position.y>18)||(!isCamUp && self.people.pathControlMap[key].object.position.y<18)){
                    self.people.pathControlMap[key].object.visible = true;
                }else{
                    self.people.pathControlMap[key].object.visible = false;
                }
                if(self.people.pathControlMap[key].lod_low_level_obj) self.people.pathControlMap[key].lod_low_level_obj.visible = false;
            }
        }

    }
    /**/
}

//视角的转动 并非调整不同房间
mainScene.prototype.cameraControl = function ()
{
    var self = this;
    if (self.isOverView){
        if(/*self.Fireman.cubeFireman && self.Fireman.isOverViewFireMan*/0){

            if(self.Fireman.cubeFireman.position.x<355&&self.Fireman.cubeFireman.position.x>280){
                self.freeViewControl.center = new THREE.Vector3(self.Fireman.cubeFireman.position.x,self.Fireman.cubeFireman.position.y+2.5,self.Fireman.cubeFireman.position.z);
                self.camera.lookAt(self.Fireman.cubeFireman.position.x,self.Fireman.cubeFireman.position.y,self.Fireman.cubeFireman.position.z);
                self.freeViewControl.maxDistance = 3;
            }
            else{
                self.freeViewControl.center = new THREE.Vector3(self.Fireman.cubeFireman.position.x,self.Fireman.cubeFireman.position.y+2,self.Fireman.cubeFireman.position.z);
                self.freeViewControl.maxDistance = 6;
            }
        }
        // if(isOverViewLeader){
        //
        //     camControlOver.center = new THREE.Vector3(leaderMeshArr[overViewLeaderIndex].position.x,leaderMeshArr[overViewLeaderIndex].position.y+2.5,leaderMeshArr[overViewLeaderIndex].position.z);
        //     camera.lookAt(leaderMeshArr[overViewLeaderIndex].position.x,leaderMeshArr[overViewLeaderIndex].position.y,leaderMeshArr[overViewLeaderIndex].position.z);
        //     camControlOver.maxDistance = 3;
        // }

        self.freeViewControl.update(self.delta);
    }else{
        if (self.camControl && !self.isEdit)
        {
            self.camControl.update(self.delta)
        }
        else
        {
            self.renderer.setViewport(window.innerWidth * 0.6, window.innerHeight * 0.6, window.innerWidth, window.innerHeight);
            //renderer.render(scene, cameraOrtho);
            self.renderer.setViewport(0, window.innerHeight * 0.6, window.innerWidth * 0.6, window.innerHeight);
            //renderer.render(scene,cameraPerspective);
        }
    }
}

mainScene.prototype.camera_tatus_change = function ()
{

}
