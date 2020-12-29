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
    this.firePos = new THREE.Vector3(51.2,0,162);
    this.frustumSize=100;//小窗口大小设置
    this.aspect = window.innerWidth / window.innerHeight;
    this.clock = new THREE.Clock();

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
    this.Vy = 0;

};

Smoke.prototype.init = function(_this)
{
    var self = this;
    var smokeUnit = null;
    for(let i=0;i<4;++i)
        for(let j=0;j<44;++j)
        {
            smokeUnit = new SmokeUnit();
            smokeUnit.pos.set(43.7+5*i,-5.85,162.5+5*j);
            this.smokeUnitArrf1.push(smokeUnit);
        }
    for(let i=0;i<3;++i)
        for(let j=0;j<38;++j)
        {
            smokeUnit = new SmokeUnit();
            smokeUnit.pos.set(47.3+4*i,-11.1,178.5+5*j);
            smokeUnit.i = i;
            smokeUnit.j = j;
            this.smokeUnitArrf2.push(smokeUnit);
        }

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

Smoke.prototype.compute = function(){
    this.Vy = this.ice * this.B * (0.0187*this.Cy + 0.011*this.Hy + 0.007*this.Sy + 0.0124*this.Wy + 0.008*this.Ny + 0.8061*this.eac*this.V0);
    if(this.eac < 1)
    {
        this.Vy += 0.21 * this.ice * this.B * (1-this.eac) * this.V0;
    }
    this.smokeVolume += this.Vy * this.dt / 3600;
    this.smokeVolume = this.smokeVolume - 1 * 13 * 190 * this.dt / 60;
    if(this.smokeVolume < 0)
        this.smokeVolume = 0;

}

Smoke.prototype.computeV0 = function(){
    this.V0 = (0.0187*this.Cy + 0.0556*this.Hy + 0.007*this.Sy - 0.007*this.Oy) / 0.21;
}

Smoke.prototype.cloudRank = function(){
    var firePos = this.firePos;
    var fireI = Math.floor((this.firePos.x - 45.3) / 4);
    var fireJ = Math.floor((this.firePos.z - 176) / 5);
    this.smokeUnitArrf2.forEach(function(item) {
        item.r = Math.pow(Math.pow(item.pos.x-firePos.x,2)+Math.pow(item.pos.z-firePos.z,2),1/2);
        //item.r = Math.abs(item.i - fireI) + Math.abs(item.j - fireJ);
    })
    this.smokeUnitArrf2.sort(function(x,y){
        if(x.r < y.r)
            return -1;
        if(x.r > y.r)
            return 1;
        return 0;
    })
}

Smoke.prototype.computeH = function(){
    var unit = this.smokeVolume / (5*5*1.7);
    if(unit<=114)
    {

        //var index = 0;
        var i =0;
        for(;i < unit-1; ++i)
        {
            this.smokeUnitArrf2[i].h = 1.7;
        }
        this.smokeUnitArrf2[i].h = (unit - i) * 1.7;
    }
    else if(this.smokeVolume<(57.8-44.8)*(366-176)*(-10.3+13.4))
    {
        var h = this.smokeVolume / (5*5*114);
        this.smokeUnitArrf2.forEach(function(item){
            item.h = h;
        })
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
    this.compute();
    this.computeH();
    self.smokeUnitArrf2.forEach(function(child)
    {
        //child.computeH(self);
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
    this.r = 0;//与火源点的距离
    this.i = 0;
    this.j = 0;
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
        if(this.h<=1.7)
            this.cloudArr[0].material.opacity = this.h/1.7;
        //smoke.step += 0.00005;
        this.cloudArr[0].rotation.y += smoke.step;
    }
    if(this.h>1.7 && this.h<3.5)
    {
        if(!this.cloudArr[1])
        {
            smoke.createCloud(_this,self);
            this.cloudArr[1].material.opacity = 1;
        }
        this.cloudArr[1].position.y = this.pos.y+1.7-this.h;
    }
    if(this.cloudArr[1])
    {
        smoke.step += 0.00005;
        this.cloudArr[1].rotation.y=smoke.step*(Math.random>0.5?1:-1)*1;
    }
}

