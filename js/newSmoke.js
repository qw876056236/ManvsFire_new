var Smoke = function()
{
    this.smokeTexture = new THREE.TextureLoader().load('./textures/Smoke-Element.png');
    this.cloudArr = [];
    this.time = 0;
    this.dt = 1;
    this.tt = 0;
    this.vx = 1;
    this.vz = 1;
    this.vy = 100;
    this.step = 0.002;
    this.smokeUnitArrf1 = [];
    this.smokeUnitArrf2 = [];
    this.smokeFloorArr = [];
    this.firePos = new THREE.Vector3(51.2,0,162);
    this.fireFloorIndex = 0;
    this.frustumSize=100;//小窗口大小设置
    this.aspect = window.innerWidth / window.innerHeight;
    this.clock = new THREE.Clock();

    this.Q = 0;//热释放速率
    this.Qc = 0;//对流热释放速率
    this.QcFactor = 0.7//对流热释放速率份数
    this.D = 0;//火源有效直径

    this.ice = 0.9;//不完全燃烧系数
    this.eac = 1.3;//过剩空气系数
    this.B = 14400;//单位时间内参与燃烧的可燃物质量  kg/h
    this.Cy = 85.5;
    this.Sy = 1;
    this.Hy = 11.3;
    this.Ny = 0.2;
    this.Oy = 0;
    this.Wy = 0;
    this.V0 = 0;//理论空气量

    this.smokeVolume = 0;
    this.nowVolume = 0;
    this.exhaustVolume = 0;
    this.Vy = 0;

};

Smoke.prototype.init = function(_this)
{
    var self = this;

    //地下二层防烟分区设置
    var smokeFloor = new SmokeFloor();
    var smokeBay = new SmokeBay();
    smokeBay.init(44.8,56.8,-13.4,-10.3,176,280,4,4);
    //joint
    smokeFloor.smokeBayArr.push(smokeBay);

    smokeBay = new SmokeBay();
    smokeBay.init(44.8,56.8,-13.4,-10.3,280,366,4,4);
    smokeFloor.smokeBayArr.push(smokeBay);

    smokeFloor.smokeBayArr[0].neiborBay[0] = null;
    smokeFloor.smokeBayArr[0].neiborBay[1] = null;
    smokeFloor.smokeBayArr[0].neiborBay[2] = null;
    smokeFloor.smokeBayArr[0].neiborBay[3] = smokeFloor.smokeBayArr[1];
    smokeFloor.smokeBayArr[0].neiborBayNum = 1;

    smokeFloor.smokeBayArr[1].neiborBay[0] = null;
    smokeFloor.smokeBayArr[1].neiborBay[1] = null;
    smokeFloor.smokeBayArr[1].neiborBay[2] = smokeFloor.smokeBayArr[0];
    smokeFloor.smokeBayArr[1].neiborBay[3] = null;
    smokeFloor.smokeBayArr[1].neiborBayNum = 1;

    smokeFloor.init(44.8,56.8,-13.4,-10.3,176,366)
    this.smokeFloorArr.push(smokeFloor);

    //地下一层防烟分区设置
    smokeFloor = new SmokeFloor();
    smokeBay = new SmokeBay();
    smokeBay.init(41.2,61.2,-8.4,-5,160,220,5,5);
    smokeFloor.smokeBayArr.push(smokeBay);

    smokeBay.init(41.2,61.2,-8.4,-5,220,300,5,5);
    smokeFloor.smokeBayArr.push(smokeBay);

    smokeBay.init(41.2,61.2,-8.4,-5,300,380,5,5);
    smokeFloor.smokeBayArr.push(smokeBay);

    smokeFloor.smokeBayArr[0].neiborBay[0] = null;
    smokeFloor.smokeBayArr[0].neiborBay[1] = null;
    smokeFloor.smokeBayArr[0].neiborBay[2] = null;
    smokeFloor.smokeBayArr[0].neiborBay[3] = smokeFloor.smokeBayArr[1];
    smokeFloor.smokeBayArr[0].neiborBayNum = 1;

    smokeFloor.smokeBayArr[1].neiborBay[0] = null;
    smokeFloor.smokeBayArr[1].neiborBay[1] = null;
    smokeFloor.smokeBayArr[1].neiborBay[2] = smokeFloor.smokeBayArr[0];
    smokeFloor.smokeBayArr[1].neiborBay[3] = smokeFloor.smokeBayArr[2];
    smokeFloor.smokeBayArr[1].neiborBayNum = 2;

    smokeFloor.smokeBayArr[2].neiborBay[0] = null;
    smokeFloor.smokeBayArr[2].neiborBay[1] = null;
    smokeFloor.smokeBayArr[2].neiborBay[2] = smokeFloor.smokeBayArr[1];
    smokeFloor.smokeBayArr[2].neiborBay[3] = null;
    smokeFloor.smokeBayArr[2].neiborBayNum = 1;
    //joint
    smokeFloor.init(41.2,61.2,-8.4,-5,160,380);
    this.smokeFloorArr.push(smokeFloor);

    var cameraOrtho = new THREE.OrthographicCamera(this.frustumSize * this.aspect / - 2, this.frustumSize * this.aspect / 2, this.frustumSize / 2, this.frustumSize / - 2, 0, 1000);
    var positionBallGeometry=new THREE.SphereGeometry(1,4,4);
    var positionBallMaterial=new THREE.MeshPhongMaterial({color:0x00ff00});
    this.cameraPerspective = new THREE.PerspectiveCamera( 50,  this.aspect, 10, 1000 );
    this.positionBallMesh=new THREE.Mesh(positionBallGeometry,positionBallMaterial);
    //this.positionBallMesh.position.set(41,5,25);
    //this.positionBallMesh.position.set(50,-8.5,240);
    this.positionBallMesh.position.set(50,-13.4,240);
    cameraOrtho.up.set(0, 1, 0);
    cameraOrtho.position.set(80, -22, 111);
    this.cameraPerspective.position.set(-25,7,0);
    this.cameraPerspective.lookAt(this.positionBallMesh.position);
    _this.scene.add(this.positionBallMesh);
    this.positionBallMesh.visible = false;
    // var redBallGeometry=new THREE.SphereGeometry(0.1,4,4);
    // var redBallMaterial=new THREE.MeshPhongMaterial({color:0xff0000});
    // this.redBallMesh=new THREE.Mesh(redBallGeometry,redBallMaterial);
    // redBallMaterial.visible=false;
    // this.redBallMesh.position.set(rX,rY,rZ);
    // this.redBallMesh.position.set(570,rY,22.8);
    // _this.scene.add(this.redBallMesh);
};

Smoke.prototype.createCloud = function(_this,smokeUnit)
{
    var self = this;
    var geom=new THREE.Geometry();//创建烟雾团
    //创建烟雾素材
    var material=new THREE.PointsMaterial({
        size:6,
        transparent:true,
        opacity:0,
        map:self.smokeTexture,
        sizeAttenuation:true,
        depthWrite:false,
        color:0xffffff,
    });
    //var range=15;
    for(var i=0;i<3;i++){
        for(var j=0;j<3;j++)
        {
            //创建烟雾片
            var particle=new THREE.Vector3(-1.7+i*1.7,0,-1.7+j*1.7);
            //将烟雾片一片片加入到geom中
            geom.vertices.push(particle);
        }
        //创建烟雾片
        //var particle=new THREE.Vector3(Math.random()*6-6/2,0,Math.random()*6-6/2);
        //将烟雾片一片片加入到geom中
        //geom.vertices.push(particle);
    }
    // for(var i=0;i<200;i++){
    //     {
    //         var r = Math.random()*9.3;
    //         var angel = Math.random()*Math.PI*2;
    //         //创建烟雾片
    //         var particle=new THREE.Vector3(r*Math.sin(angel),0,r*Math.cos(angel));
    //         //将烟雾片一片片加入到geom中
    //         geom.vertices.push(particle);
    //     }
    //     //创建烟雾片
    //     //var particle=new THREE.Vector3(Math.random()*6-6/2,0,Math.random()*6-6/2);
    //     //将烟雾片一片片加入到geom中
    //     //geom.vertices.push(particle);
    // }

    //创建烟雾片
    //var particle=new THREE.Vector3(0,0,0);
    //将烟雾片一片片加入到geom中
    //geom.vertices.push(particle);
    var cloud=new THREE.Points(geom,material);
    _this.scene.add(cloud);
    cloud.position.set(smokeUnit.pos.x, smokeUnit.pos.y, smokeUnit.pos.z);
    smokeUnit.cloudArr.push(cloud);
}

Smoke.prototype.set = function(fire,_this){
    //判断着火在哪层,设置fireFloorIndex
    var floor = null;
    var firex = this.positionBallMesh.position.x;
    var firey = this.positionBallMesh.position.y;
    var firez = this.positionBallMesh.position.z;
    for(let i=0;i<this.smokeFloorArr.length;++i)
    {
        floor = this.smokeFloorArr[i];
        if(firey >= floor.ymin && firey < floor.ymax)
        {
            this.fireFloorIndex = i;
            floor.fire = fire;
            floor.fire.Zh = floor.ymax - firey;
            floor.isFire = true;
            floor.firePos.x = firex;
            floor.firePos.y = firey;
            floor.firePos.z = firez;
            floor.stage = 1;
            floor.smokeBayArr.forEach(function(smokeBay){
                smokeBay.isFloor = true;
            })
            break;
        }
    }

    //判断着火在哪一个防烟分区
    var bay = null;
    for(let i=0;i<floor.smokeBayArr.length;++i)
    {
        bay = floor.smokeBayArr[i];
        if(firex>=bay.xmin && firex<bay.xmax && firez>=bay.zmin && firez<bay.zmax)
        {
            floor.fireBayIndex = i;
            bay.isFire = true;
            var x = Math.max(firex-bay.xmin,bay.xmax-firex);
            var z = Math.max(firez-bay.zmin,bay.zmax-firez);
            bay.maxr = Math.pow(x*x+z*z,1/2);

            bay.jetSmokeArr.push(new smokeControl());
            bay.jetSmokeArr.push(new smokeControl());
            if(bay.xmax-bay.xmin>bay.zmax-bay.zmin){
                bay.jetSmokeArr[0].init(floor.firePos,1,bay,_this);
                bay.jetSmokeArr[1].init(floor.firePos,0,bay,_this);
            }else{
                bay.jetSmokeArr[0].init(floor.firePos,3,bay,_this);
                bay.jetSmokeArr[1].init(floor.firePos,2,bay,_this);
            }

            var minx,maxx,minz,maxz;
            for(let j=0;j<bay.smokeUnitArr.length;++j)
            {
                minx = Math.max(0,Math.abs(bay.smokeUnitArr[j].pos.x-firex)-bay.xstep/2);
                maxx = Math.abs(bay.smokeUnitArr[j].pos.x-firex)+bay.xstep/2;
                minz = Math.max(0,Math.abs(bay.smokeUnitArr[j].pos.z-firez)-bay.zstep/2);
                maxz = Math.abs(bay.smokeUnitArr[j].pos.z-firez)+bay.zstep/2;
                bay.smokeUnitArr[j].minr = Math.pow(minx*minx+minz*minz,1/2);
                bay.smokeUnitArr[j].maxr = Math.pow(maxx*maxx+maxz*maxz,1/2);
            }
            break;
        }
    }
}

Smoke.prototype.update = function(_this)
{

    var self = this;
    /*self.time = this.clock.getElapsedTime();
    if(self.time>=self.tt)
    {
        this.compute();
        this.computeH();
        self.tt += self.dt;
        console.log(this.smokeVolume);
    }*/
    self.dt = this.clock.getDelta();

    //各楼层及各防烟分区
    self.smokeFloorArr[self.fireFloorIndex].update(self.dt,_this);
    for(let i=1;self.fireFloorIndex-i>=0 || self.fireFloorIndex+i<self.smokeFloorArr.length;++i)
    {
        if(self.fireFloorIndex+i<self.smokeFloorArr.length)
            self.smokeFloorArr[self.fireFloorIndex+i].update(self.dt,_this);
        if(self.fireFloorIndex-i>=0)
            self.smokeFloorArr[self.fireFloorIndex-i].update(self.dt,_this);
    }

    self.exhaustVolume = 0;
    self.nowVolume = 0;
    self.smokeFloorArr.forEach(function(smokeFloor){
        self.exhaustVolume += smokeFloor.exhaustVolume;
        smokeFloor.smokeBayArr.forEach(function(smokeBay){
            self.nowVolume += smokeBay.sumVolume;
        })
    })
    //console.log(this.smokeUnitArr)
    //this.cloudArr[1].position.y -=0.001;
    // self.cloudArr.forEach(function (child)
    // {
    //     self.step += 0.00005;
    //     if(child)
    //         child.rotation.y=self.step*(Math.random>0.5?1:-1)*10;
    // });
    // var x = this.cloud.scale.x;
    // var y = this.cloud.scale.y;
    // var z = this.cloud.scale.z;
    // this.cloud.scale.set(x+0.01,y+0.01,z+0.01);

};
