export {mainScene};
import {Crowd} from "./move/Crowd.js";
import {PeopleController} from "./move/PeopleController.js";
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

        this.scene = new THREE.Scene();

    this.number = 100;//人数

    this.exitPosArr = []//出口坐标数组

    this.camera = null;

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

    this.smoke = new Smoke();//烟

    this.fire = new fireControl();//火

    this.people = new People();//人群

    this.HCI = new Interaction();//交互控制

    this.smokeEditor = new SmokeEditor();//烟雾编辑器

    this.sign = new Sign();//标志牌

    this.ant = new Ant();

    this.globalPlane = null;

    this.currentEscapeTime = 0;

    this.firstEscapeTime = 0;

    this.EscapeNumber = 0;

    this.raycaster = new THREE.Raycaster();//点击坐标测试射线

    this.pMesh = null;//点击坐标测试球体

    this.allTime = 0;

    this.fireTime = 0;

    this.smokeH = [];


    //控制参数

    this.isEdit = false;
    this.isBook3 = false;

    this.mouse=new THREE.Vector2();


    this.isFinishLoadCharactor = false;


    this.step = new Array(10);
    this.step.fill(0);

    this.count = new Array(10);
    this.count.fill(0);

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

    //region 人群
    this.people.init(this);
    //endregion

    //region 烟雾
    this.smoke.init(this);
    //endregion

    //烟雾编辑器
    this.smokeEditor.init(this);
    //endregion

    //region 火
    this.fire.init(this);
    //endregion

    //region场景加载
    this.underground.init(this);
    this.resourceLoader.init(this);
    //console.log(this.resourceLoader);
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
        self.elapsedTime = self.clock.getElapsedTime();

        if(self.isEdit)
        {
            self.smokeEditor.update(self);
            //self.fire.update(self);
        }


        if(self.active)
        {
            //self.water.update();    //todo debug here

            self.fire.update(20,self);

            self.smoke.update(self);

            //self.Fireman.update(self);

            self.people.update(self);

            self.record();

        }
        self.pMesh.position.set(document.getElementById("x").value,document.getElementById("y").value,document.getElementById("z").value);


        TWEEN.update();

        self.stats.update();

        requestAnimationFrame(animate);
        self.renderer.clear();
        self.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        self.renderer.render(self.scene, self.camera);
    }
}

mainScene.prototype.setScene = function()
{
    var self = this;
    //region 基础场景
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000000);
    this.camera.position.set(58,-2.7,167);
    this.camera.rotation.set(-2.8,0.3,3);

    window.c=this.camera;

    //this.camera.position.set( 58.01241244232402,  -5.641555076511444, 166.09795410450);
    //this.camera.rotation.set(-3.0998049228015434, 0.03830701739587247, 3.139991350918273)

    this.playerControl=new PlayerControl(this);//通过鼠标键盘或者手机触屏控制相机
    this.playerControl.init();

    this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    this.renderer.autoClear = true;    //todo 不声明的话默认为true,原demo为false, 与start.animate 中renderer.clear()对应
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor( 0xbbd0d9 );
    this.renderer.setClearAlpha(0);
    //this.renderer.setClearColor( 0xffffff );
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
    let listener1 = new THREE.AudioListener();
    //this.camera.add( listener );

// create a global audio source
    this.sirenSound = new THREE.Audio( listener1 );

    let listener2 = new THREE.AudioListener();
    //this.camera.add(listener);
    this.noisySound = new THREE.Audio(listener2);








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


    //开始进行人群设置

   /* let crowd=new Crowd();
    crowd.obj.visible=false;
    this.scene.add(crowd.obj);
    window.crowd=crowd;
    console.log(crowd);*/
    //完成人群设置

    /*寻路网格初始化*/
    var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
    loader.load("grid.json", function(str){//dataTexture
        var grid0=JSON.parse(str).grid;
        loader.load("grid_1.json", function(str1){//dataTexture
            var grid1=JSON.parse(str1).grid;//"./Model/avatar/male_run.glb",
            var pc = new PeopleController();
            pc.init({
                    myMain:new InstancedGroup(1,//人数
                    [],//这些mesh的网格应该一致
                    true//有动画
                    ),
                    obstacle0:grid0,
                    obstacle1:grid1,
                    people_index:1
                });
            console.log(pc.floor1.grid)
            self.ant.init_pheromone_floor1(pc.floor1.grid);
            console.log(self.sign.signInitArr)
            self.ant.init_sign(self.sign.signInitArr);
        });
    });

    /*出口位置设置*/
    this.exitPosArr = [new THREE.Vector3(62,-8.5,112), new THREE.Vector3(62,-8.5,113),new THREE.Vector3(62,-8.5,114),new THREE.Vector3(62,-8.5,115),new THREE.Vector3(62,-8.5,116),new THREE.Vector3(62,-8.5,117),
                        new THREE.Vector3(54,-8.5,188),new THREE.Vector3(53,-8.5,188),new THREE.Vector3(52,-8.5,188),new THREE.Vector3(51,-8.5,188),new THREE.Vector3(50,-8.5,188),new THREE.Vector3(49,-8.5,188),
                        new THREE.Vector3(36,-8.5,190),new THREE.Vector3(36,-8.5,189),new THREE.Vector3(36,-8.5,188),new THREE.Vector3(36,-8.5,187),new THREE.Vector3(36,-8.5,186),new THREE.Vector3(36,-8.5,185),new THREE.Vector3(36,-8.5,184),new THREE.Vector3(36,-8.5,183),
                        new THREE.Vector3(64,-8.5,266),new THREE.Vector3(64,-8.5,267),new THREE.Vector3(64,-8.5,268),new THREE.Vector3(64,-8.5,269),new THREE.Vector3(64,-8.5,270),new THREE.Vector3(64,-8.5,271),
                        new THREE.Vector3(47,-8.5,441),new THREE.Vector3(46,-8.5,441),new THREE.Vector3(45,-8.5,441),new THREE.Vector3(44,-8.5,441),new THREE.Vector3(43,-8.5,441),new THREE.Vector3(42,-8.5,441),new THREE.Vector3(41,-8.5,441)];



//endregion
}

mainScene.prototype.addPeople = function ()
{
    this.people.load(this);
    console.log(this.people.groupBend);
    console.log(this.people.groupCrawl);
    console.log(this.people.groupIdle);
    console.log(this.people.groupRun);
    console.log(this.people.groupWalk);
    console.log(this.people.groupPM);
    /*this.people.groupCrawl.forEach(s => s.visible = false);
    this.people.groupIdle.forEach(s => s.visible = false);
    this.people.groupRun.forEach(s => s.visible = false);
    this.people.groupWalk.forEach(s => s.visible = false);*/
}

mainScene.prototype.record = function (){
    this.allTime += this.delta;
    if(this.allTime>5){
        this.allTime -= 5;
        if(this.smoke.smokeFloorArr[this.smoke.fireFloorIndex].stage==1){
            this.smokeH.push(this.smoke.smokeFloorArr[this.smoke.fireFloorIndex].smokeBayArr[1].smokeh.toFixed(3)+"\n");
        }else if(this.smoke.smokeFloorArr[this.smoke.fireFloorIndex].stage==2){
            this.smokeH.push(this.smoke.smokeFloorArr[this.smoke.fireFloorIndex].smokeh.toFixed(3)+"\n");
        }
    }
}