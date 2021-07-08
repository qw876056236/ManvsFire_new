var smokeControl = function ()
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

    this.objs = [];

    this.FLOATING_INTERVAL = 0;
    this.h = 0;
    this.direction = 0;
    this.pos = new THREE.Vector3(0,0,0);
    this.xmin = 0;
    this.xmax = 0;
    this.ymin = 0;
    this.ymax = 0;
    this.zmin = 0;
    this.zmax = 0;
    this.scene = null;
}

smokeControl.prototype.init = function (pos,dir,bay,_this)
{
    this.scene = _this.scene;
    //加载glsl文件是异步的，为了防止文件没加载完就开始update，这里设置finished来限制。
    let scope = this;
    let loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
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

    this.direction = dir;
    this.pos.set(pos.x,pos.y,pos.z);
    this.xmin = bay.xmin;
    this.xmax = bay.xmax;
    this.ymin = bay.ymin;
    this.ymax = bay.ymax;
    this.zmin = bay.zmin;
    this.zmax = bay.zmax;
}

smokeControl.prototype.reset = function () {
    for (let i = 0; i < this.objs.length; i++) {
        this.objs[i].reset(this);
        this.scene.remove(this.objs[i].instance.getMesh());
    }
    this.objectPool = [];
    this.objs = [];
    //this.flareParticle.reset();
};

smokeControl.prototype.spawnNewFlame = function ()
{
    let i = this.objs.length;
    if (this.objectPool.length > 0) {
        i = this.objectPool.shift();
        this.objs[i].reset(this);

        this.objs[i].instance.setColor(this.currentCol);
        this.objs[i].instance.getMesh().visible = true;

    }
    else {
        let temp = new cloud();
        temp.init(Math.random() * 5 + 8)
        let obj = new smokeAnimation();
        obj.init(temp, this, Math.random() * 0.4 + 0.35, Math.random() * 0.4 + 0.3);
        obj.instance.setColor(this.currentCol);
        this.objs.push(obj);
        this.scene.add(this.objs[i].instance.getMesh());
    }
}

smokeControl.prototype.update = function (deltaTime)
{
    if(this.finished) {
        let timeScale = this.params.TimeScale;
        this.spawnTime += deltaTime * timeScale;
        if (this.spawnTime > 20) {
            while (this.spawnTime > 20)
                this.spawnTime -= 20;
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
                this.objs[i].update(deltaTime,this);
            }
        }
    }
    //this.flareParticle.update(deltaTime * timeScale);
}