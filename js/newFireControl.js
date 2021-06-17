var fireControl = function ()
{
    this.currentCol = {['colDark']:0,['colNormal']:1,['colLight']:2};
    this.params = {
        LightColor2 : '#ff8700',
        LightColor : '#f7f342',
        NormalColor : '#f7a90e',
        DarkColor2 : '#ff9800',
        GreyColor : '#3c342f',
        DarkColor : "#181818",
        TimeScale : 3,
        ParticleSpread : 1,
        ParticleColor : '#ffb400',
        InvertedBackground : false,
        ShowGrid : true
    };
    this.finished = false;
    this.pos = new THREE.Vector3(0,0,0);
    this.scene = null;
    this.interval = 10;

    //-----------物理量-----------
    this.roangle=0;

    this.Qt = 50000//最大热释放速率 单位kw kj/s
    this.Q = 10000;//热释放速率 单位kw kj/s
    this.QFactor = 0.5//火灾增长系数 单位kw/s2
    this.Qc = 0;//对流热释放速率
    //可由用户设置的常数
    this.QcFactor = 0.7//对流热释放速率份数
    this.ice = 1;//不完全燃烧系数
    this.eac = 1.3;//过剩空气系数

    //读取用户的设置
    this.Zh = 0;//火源基部到顶棚高度
    this.D = 1;//火源有效直径

    //石墨粉参数
    /*this.Cy = 99.96;
    this.Sy = 0;
    this.Hy = 0.39;
    this.Ny = 0;
    this.Oy = 0;
    this.Wy = 0;
    this.calValue = 32600;//热值 单位kj/kg  j/g*/

    //聚氨酯参数（行李）
    this.Cy = 38.18;
    this.Sy = 0;
    this.Hy = 43.03;
    this.Ny = 6.06;
    this.Oy = 12.73;
    this.Wy = 0;
    this.calValue = 19000;
    //着火时计算出来的量
    this.V0 = 0;//理论空气量

    //着火过程中计算的量
    this.B = 0;//单位时间内参与燃烧的可燃物质量  kg/s
    this.L = 0;//火焰平均高度
    this.Zv = 0;//火源基部以上虚点源高度
    //-----------物理量-----------
}

fireControl.prototype.init = function (_this)
{
    //加载glsl文件是异步的，为了防止文件没加载完就开始update，这里设置finished来限制。
    let scope = this;
    let loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
    this.scene = _this.scene;
    loader.load("./shader/fragmentFlameShader.glsl", function(str1){
        loader.load("./shader/vertexFlameShader.glsl", function(str2){
            fragmentFlameShader = str1;
            vertexFlameShader = str2;
            scope.objs = [];
            scope.objectPool = [];
            scope.spawnTime = 0;
            //this.flareParticle = new flareParticle_1.FlareParticle();
            scope.spawnNewFlame();
            scope.reset();
            scope.finished = true;
        });
    });
}

fireControl.prototype.reset = function (_this) {
    for (let i = 0; i < this.objs.length; i++) {
        this.objs[i].reset();
        this.scene.remove(this.objs[i].instance.getMesh());
    }
    this.objectPool = [];
    this.objs = [];
    //this.flareParticle.reset();
};

fireControl.prototype.spawnNewFlame = function ()
{
    let i = this.objs.length;
    if (this.objectPool.length > 0) {
        i = this.objectPool.shift();
        this.objs[i].instance.getMesh().visible = true;
        this.objs[i].instance.setColor(this.currentCol);
        this.objs[i].reset();
    }
    else {
        let temp = new fire();
        temp.init(Math.random() * 5 + 8)
        let obj = new fireAnimation();
        obj.init(temp, (Math.random() * 2 - 1)*0.5, (Math.random() * 2 - 1)*0.5, (Math.random() * 0.4 + 0.35) / 4, Math.random() * 0.4 + 0.3,this.pos);
        obj.instance.setColor(this.currentCol);
        this.objs.push(obj);
        this.scene.add(this.objs[i].instance.getMesh());
    }
}

fireControl.prototype.set = function(firePos)
{
    this.V0 = (0.0187*this.Cy + 0.0556*this.Hy + 0.007*this.Sy - 0.007*this.Oy) / 0.21;
    this.pos.set(firePos.x,firePos.y+0.3,firePos.z);
}

fireControl.prototype.update = function (deltaTime,_this)
{
    if(this.finished) {
        let timeScale = this.params.TimeScale;
        this.spawnTime += deltaTime * timeScale;
        if (this.spawnTime > this.interval) {
            while (this.spawnTime > this.interval){
                this.spawnTime -= this.interval;
            }
            this.spawnNewFlame();

        }
        for (let i = 0; i < this.objs.length; i++) {
            if (this.objs[i].isDie()) {
                if (this.objs[i].inPolling())
                    continue;
                this.objs[i].setInPolling(true);
                this.objs[i].instance.getMesh().visible = false;
                this.objectPool.push(i);
            } else {
                this.objs[i].update(deltaTime);
            }
        }
    }
    //this.flareParticle.update(deltaTime * timeScale);

    //计算火羽流相关参数
    var L = -1.02*this.D + 0.235*Math.pow(this.Q,2/5);
    this.L = L > 0 ? L : 0;
    var Zv = -1.02*this.D + 0.083*Math.pow(this.Q,2/5);
    this.Zv = Zv > 0 ? Zv : 0;
    //this.Q = Math.min(this.Qt,this.QFactor*_this.elapsedTime*_this.elapsedTime);
    this.Qc = this.QcFactor * this.Q * (0.8+Math.random()*0.4);
    //this.fireManager.controlSheet.high = this.L;
    this.B = this.Q / this.ice / this.calValue;
    //console.log(this.B);
}