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
    this.tt = 0;

    this.dt = 1;//time step
    //物理量
    this.Qc = 300;//火源热释放率
    this.L = 1;//火源直径
    this.H = 3.5;//顶棚高度
    this.r0 = 0//火羽流半径

    this.ambT = 293;//环境温度
    this.viscosity = 0.000029;//运动粘度
    this.ambDen = 1.2;//环境空气密度
    this.g = 9.8;//重力常数
    this.Tcl = 293;//天花板表面温度
    this.Cp = 1;//空气比热
    this.cjpf = 1.16;//顶棚射流轮廓系数
    this.S = 0.5//重力诱导压力梯度产生的常数
    this.pDen = 1.2;//火羽流密度
    this.qcl0 = 0;//火羽流处天花板热损失率

    this.Q = 0//无量纲火源热释放率
    this.ReH = 0

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
            smokeUnit.r = Math.pow(Math.pow(smokeUnit.pos.x-this.firePos.x,2)+Math.pow(smokeUnit.pos.z-this.firePos.z,2),1/2);
            smokeUnit.rH = smokeUnit.r / this.H;
            smokeUnit.T = this.ambT;
            this.smokeUnitArr.push(smokeUnit);
        }

    var cameraOrtho = new THREE.OrthographicCamera(this.frustumSize * this.aspect / - 2, this.frustumSize * this.aspect / 2, this.frustumSize / 2, this.frustumSize / - 2, 0, 1000);
    var positionBallGeometry=new THREE.SphereGeometry(2,4,4);
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

    this.r0 = 0.13*this.H
    //this.Q = this.Qc / this.ambT / this.ambDen / this.Cp /Math.pow(this.g,1/2) / Math.pow(this.L,5/2);
    this.ReH = Math.pow(this.H,3/2) * this.Qc / this.ambT / this.ambDen / this.Cp / Math.pow(this.L,5/2) / this.viscosity;
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

Smoke.prototype.cloudRank = function(){
    this.smokeUnitArr.forEach(function(item) {
        item.r = Math.pow(Math.pow(item.pos.x-this.firePos.x,2)+Math.pow(item.pos.z-this.firePos.z,2),1/2);
    })
    this.smokeUnitArr.sort(function(x,y){
        if(x.r < y.r)
            return -1;
        if(x.r > y.r)
            return 1;
        return 0;
    })
}

Smoke.prototype.compute = function()
{
    var firstIndex = 0;
    while(this.smokeUnitArr[firstIndex].r < this.r0)
    {
        firstIndex++;
    }
    this.compute0(this.smokeUnitArr[firstIndex]);
    for(let i=firstIndex+1;i<this.smokeUnitArr.length;++i)
    {
        if(this.smokeUnitArr[i].r == this.smokeUnitArr[i-1].r)
        {
            this.smokeUnitArr[i].h = this.smokeUnitArr[i-1].h;
            this.smokeUnitArr[i].v = this.smokeUnitArr[i-1].v;
            this.smokeUnitArr[i].dif = this.smokeUnitArr[i-1].v;
            this.smokeUnitArr[i].T = this.smokeUnitArr[i-1].v;
            this.smokeUnitArr[i].maxT = this.smokeUnitArr[i-1].v;
            this.smokeUnitArr[i].E = this.smokeUnitArr[i-1].v;
            this.smokeUnitArr[i].F = this.smokeUnitArr[i-1].v;
            this.smokeUnitArr[i].chtr = this.smokeUnitArr[i-1].v;//对流换热率
            this.smokeUnitArr[i].rH = this.smokeUnitArr[i-1].v;//rH比
            this.smokeUnitArr[i].qcl = this.smokeUnitArr[i-1].v;//天花板热损失率
            this.smokeUnitArr[i].Qcl = this.smokeUnitArr[i-1].v;//对流放热率
            this.smokeUnitArr[i].den = this.smokeUnitArr[i-1].v;//密度
        }
        else{
            this.smokeUnitArr[i].compute(this.smokeUnitArr[i-1],this);
        } 

    }
};

Smoke.prototype.compute0 = function(smokeUnit){
    var mp = 0.08 * Math.pow(this.Qc,1/3) * Math.pow(this.H,5/3);
    var w = mp / (Math.PI * Math.pow(this.r0,2) * this.pDen);

    var Tp = this.Qc / this.Cp / mp + this.ambT;
    var lastT = smokeUnit.T;
    smokeUnit.T = Tp - smokeUnit.qcl0 * Math.PI * this.r0 * this.r0 /this.Cp / mp;
    smokeUnit.den = this.ambT * this.ambDen / smokeUnit.T;
    var maxdT = Math.pow(2,1/2) * (smokeUnit.T - lastT);
    smokeUnit.dif = this.g * maxdT * this.cjpf / this.ambT / Math.pow(this.cjpf*this.cjpf+1,1/2);

    smokeUnit.v = Math.pow(0.8 * this.pDen / smokeUnit.den,1/2) * w;
    smokeUnit.h = mp / 2 / this.r0 / smokeUnit.den / smokeUnit.v;



}

Smoke.prototype.setScope = function(_this)
{
    
}

Smoke.prototype.update = function(_this)
{

    var self = this;
    self.time = this.clock.getElapsedTime();
    if(self.time>=self.tt)
    {
        this.compute();
        self.tt += self.dt;
    }
    self.smokeUnitArr.forEach(function(child)
    {
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
    this.h = 0.05;
    this.v = 0.05;
    this.dif = 0;
    this.T = 0;
    this.maxT = 0;
    this.E = 0;
    this.F = 0;
    this.chtr = 0;//对流换热率
    this.rH = 0;//rH比
    this.qcl = 0;//天花板热损失率
    this.Qcl = 0;//对流放热率
    this.den = 0;//密度
    this.cloudArr = [];
    this.pos = new THREE.Vector3(0,0,0);
    this.r = 0;
};

SmokeUnit.prototype.compute = function(last,smoke){
    var dr = this.r - last.r;

    this.F = 0.026 * Math.pow(Math.pow(2,1/2)*this.v*this.r/smoke.viscosity,-1/7);
    var fd1 = this.v/Math.pow((smoke.ambDen-this.den) * smoke.g * this.h / this.den,1/2);
    this.E = 0.002 * Math.pow(fd1,3);

    if(this.rH < 0.2)
    {
        this.chtr = 0.711 * Math.pow(smoke.ReH,0.8) * 0.427;
    }
    else
    {
        this.chtr = 0.00779 * smoke.ReH * Math.pow(this.r/smoke.H,-0.878);
    }
    this.qcl = this.chtr * (this.maxT - smoke.Tcl);
    this.Qcl = -(this.qcl * smoke.g / smoke.Cp / smoke.ambDen / smoke.ambT);

    var acc = smoke.S * (this.dif * this.h * this.h - last.dif * last.h * last.h) / dr;
    this.v = Utils.computeQuadratic(smoke.dt*(this.h+dr*(this.E+this.F)),this.h*(dr-last.v*smoke.dt),dr*(smoke.dt*acc-this.v*this.h))
    this.h = (this.E*this.v + this.h/smoke.dt + this.v*last.h/dr) / (1/smoke.dt + this.v/dr + (this.r*this.v-last.r*last.v)/dr/this.r);
    this.dif = (this.Qcl/this.h + this.dif/smoke.dt + this.v*last.dif/dr) / (1/smoke.dt + this.v/dr + this.E*this.v/this.h);

    var difTmax = this.dif * smoke.ambT * Math.pow(smoke.cjpf*smoke.cjpf+1,1/2) / smoke.g / smoke.cjpf;
    this.maxT = this.T + difTmax;
    this.T = this.T + difTmax/Math.pow(2,1/2);
    this.den = smoke.ambDen * smoke.ambT / this.T;

    //console.log(this.F);
    //console.log(this.E);
    //console.log(this.v);
}

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

