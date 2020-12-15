var Smoke = function()
{
    this.smokeTexture = new THREE.TextureLoader().load('./textures/Smoke-Element.png');
    this.cloudArr = [];
    this.time = 0;
    this.vx = 1;
    this.vz = 1;
    this.vy = 100;
    this.step = 0;
    this.smokeUnitArr = [];
    this.firePos = new THREE.Vector3(51.2,0,162);
    this.frustumSize=100;//小窗口大小设置
    this.aspect = window.innerWidth / window.innerHeight;
    this.clock = new THREE.Clock();
};

Smoke.prototype.init = function(_this)
{
    var self = this;
    var smokeUnit = null;
    for(let i=0;i<4;++i)
        for(let j=0;j<44;++j)
        {
            smokeUnit = new SmokeUnit();
            smokeUnit.pos.set(43.7+5*i,-6,162.5+5*j);
            this.smokeUnitArr.push(smokeUnit);
        }

    var cameraOrtho = new THREE.OrthographicCamera(this.frustumSize * this.aspect / - 2, this.frustumSize * this.aspect / 2, this.frustumSize / 2, this.frustumSize / - 2, 0, 1000);
    var positionBallGeometry=new THREE.SphereGeometry(1,4,4);
    var positionBallMaterial=new THREE.MeshPhongMaterial({color:0x00ff00});
    this.cameraPerspective = new THREE.PerspectiveCamera( 50,  this.aspect, 10, 1000 );
    this.positionBallMesh=new THREE.Mesh(positionBallGeometry,positionBallMaterial);
    //this.positionBallMesh.position.set(41,5,25);
    this.positionBallMesh.position.set(50,-8.5,240);
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
    cloud.position.set(smokeUnit.pos.x, -5.85, smokeUnit.pos.z);
    smokeUnit.cloudArr.push(cloud);
}

Smoke.prototype.setScope = function(_this)
{
    
}

Smoke.prototype.update = function(_this)
{

    var self = this;
    self.time = this.clock.getElapsedTime();
    self.smokeUnitArr.forEach(function(child)
    {
        child.computeH(self);
        child.update(_this,self);
    });
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

var SmokeUnit = function()
{
    this.h = 0;
    this.cloudArr = [];
    this.pos = new THREE.Vector3(0,0,0);
};

SmokeUnit.prototype.computeH = function(smoke)
{
    var hx = smoke.vx * smoke.time - Math.abs(this.pos.x-smoke.firePos.x);
    var hz = smoke.vz * smoke.time - Math.abs(this.pos.z-smoke.firePos.z);
    this.h = (hx+hz)/smoke.vy;
};

SmokeUnit.prototype.update = function(_this,smoke)
{
    var self = this;
    if(this.h>0 && !this.cloudArr[0])
        smoke.createCloud(_this,self);
    if(this.cloudArr[0])
    {
        if(this.h<1.7)
            this.cloudArr[0].material.opacity = this.h/1.7;
        smoke.step += 0.00005;
        this.cloudArr[0].rotation.y=smoke.step*(Math.random>0.5?1:-1)*1;
    }
    if(this.h>1.7 && this.h<3.5)
    {
        if(!this.cloudArr[1])
        {
            smoke.createCloud(_this,self);
            this.cloudArr[1].material.opacity = 1;
        }
        this.cloudArr[1].position.y = -4.15-this.h;
    }
    if(this.cloudArr[1])
    {
        smoke.step += 0.00005;
        this.cloudArr[1].rotation.y=smoke.step*(Math.random>0.5?1:-1)*1;
    }
}

