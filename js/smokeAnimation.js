var smokeAnimation = function () {
    smokeAnimation.scale = 1;
    smokeAnimation.scaleFactor = 0.05;
    smokeAnimation.STATE_BEFORE_START = 0;
    /*fireAnimation.STATE_SPAWN = 1;
    fireAnimation.STATE_SPAWN_DOWN = 2;
    fireAnimation.STATE_FLOATING = 3;
    fireAnimation.STATE_IDLE = 4;*/
    smokeAnimation.STATE_FLOATING = 1;
    smokeAnimation.STATE_IDLE = 2;
    smokeAnimation.BEFORE_INTERVAL = 3000 * smokeAnimation.scale ;
    //fireAnimation.SPAWN_INTERVAL = 400;
    /*fireAnimation.SPAWN_INTERVAL = 400 * fireAnimation.scale ;
    fireAnimation.SPAWN_DOWN_INTERVAL = 2000 * fireAnimation.scale ;
    //fireAnimation.FLOATING_INTERVAL = 8000 * fireAnimation.scale ;
    fireAnimation.FLOATING_INTERVAL = 4000 * fireAnimation.scale ;
    //fireAnimation.IDLE_INTERVAL = 20000;
    fireAnimation.IDLE_INTERVAL = 8000 * fireAnimation.scale ;*/

    smokeAnimation.FLOATING_INTERVAL = 20000 * smokeAnimation.scale ;
    smokeAnimation.IDLE_INTERVAL = 3000 * smokeAnimation.scale ;

    smokeAnimation.velocity = 0.05;


    this.params = {
        /*LightColor2 : '#ff8700',
        LightColor : '#f7f342',*/
        LightColor2 : '#000000',
        LightColor : '#8e8e8e',
        NormalColor : '#f7a90e',
        DarkColor2 : '#ff9800',
        GreyColor : '#3c342f',
        DarkColor : "#181818",
        WhiteColor : "#ffffff",
        TimeScale : 1,
        ParticleSpread : 1,
        ParticleColor : '#ffb400',
        InvertedBackground : false,
        ShowGrid : true
    };

}

smokeAnimation.prototype.init = function(instance, control, yRatio, animationTimeRatio,) {
        /*distX = distX || 0;
        distZ = distZ || 0;*/
        yRatio = yRatio || 1;
        animationTimeRatio = animationTimeRatio || 1;
        this.instance = instance;
        /*this.distX = distX;
        this.distZ = distZ;*/
        this.minX = control.xmin;
        this.maxX = control.xmax;
        this.minY = control.ymin;
        this.maxY = control.ymax;
        this.minZ = control.zmin;
        this.maxZ = control.zmax;
        this.yRatio = yRatio;
        this.animationTimeRatio = animationTimeRatio;
        this.inPos = false;
        this.dir = control.direction;
        this.reset(control);
    }

smokeAnimation.prototype.setColor = function () {
    let tc = this.timeCount + this.colorTransitionRandom;
    if (tc < 300 * smokeAnimation.scale + this.colorTransitionRandom) {
        let t = Math.min(1, tc / (300 * smokeAnimation.scale));
        this.instance.setColor({
            colDark: this.params.NormalColor,
            colNormal: this.params.LightColor,
            colLight: this.params.LightColor2
        });
    }
    else if (tc < 4000 * smokeAnimation.scale) {
        /*let t = Math.min(1, (tc - 4000 * fireAnimation.scale) / (4000 * fireAnimation.scale));
        this.instance.setColor({
            colDark: Utils.vec3Blend(this.params.DarkColor, this.params.GreyColor, t),
            colNormal: Utils.vec3Blend(this.params.DarkColor, this.params.GreyColor, t),
            colLight: Utils.vec3Blend(this.params.DarkColor2, this.params.DarkColor, t)
        });*/
    }
    /*else if (tc < 7000 * fireAnimation.scale) {
        let t = (tc - 4000 * fireAnimation.scale) / (3000 * fireAnimation.scale);
        this.instance.setColor({
            colDark: Utils.vec3Blend(this.params.DarkColor2, this.params.DarkColor2, t),
            colNormal: Utils.vec3Blend(this.params.NormalColor, this.params.NormalColor, t),
            colLight: Utils.vec3Blend(this.params.LightColor, this.params.LightColor, t)
        });
    }
    else if (tc < 12000 * fireAnimation.scale) {
        let t = Math.min(1, (tc - 7000 * fireAnimation.scale) / (5000 * fireAnimation.scale));
        this.instance.setColor({
            colDark: Utils.vec3Blend(this.params.DarkColor2, this.params.DarkColor, t),
            colNormal: Utils.vec3Blend(this.params.NormalColor, this.params.DarkColor2, t),
            colLight: Utils.vec3Blend(this.params.LightColor, this.params.NormalColor, t)
        });
    }*/
    else if (tc < 17000 * smokeAnimation.scale) {
        /*let t = Math.min(1, (tc - 12000 * fireAnimation.scale) / (5000 * fireAnimation.scale));
        this.instance.setColor({
            colDark: Utils.vec3Blend(this.params.DarkColor, this.params.DarkColor, t),
            colNormal: Utils.vec3Blend(this.params.DarkColor2, this.params.DarkColor, t),
            colLight: Utils.vec3Blend(this.params.NormalColor, this.params.DarkColor2, t)
        });*/
    }
    else {
        /*let t = Math.min(1, (tc - 17000 * fireAnimation.scale) / (6000 * fireAnimation.scale));
        this.instance.setColor({
            colDark: Utils.vec3Blend(this.params.DarkColor, this.params.GreyColor, t),
            colNormal: Utils.vec3Blend(this.params.DarkColor, this.params.GreyColor, t),
            colLight: Utils.vec3Blend(this.params.DarkColor2, this.params.DarkColor, t)
        });*/
    }
};

smokeAnimation.prototype.updateState = function (deltaTime,control) {
    var cTime = this.currentTime + deltaTime;
    if (this.currentState === smokeAnimation.STATE_BEFORE_START) {
        if (cTime > smokeAnimation.BEFORE_INTERVAL) {
            cTime -= smokeAnimation.BEFORE_INTERVAL;
            this.currentState = smokeAnimation.STATE_FLOATING;
        }
    }
    else if (this.currentState === smokeAnimation.STATE_FLOATING) {
        if (cTime > control.FLOATING_INTERVAL) {
            /*this.randFlyX += Math.random() * 0.2;
            this.randFlyZ += Math.random() * 0.2;*/
            cTime -= control.FLOATING_INTERVAL;
            this.posX = -1;
            this.currentState = smokeAnimation.STATE_IDLE;
        }
    }
    else if (this.currentState === smokeAnimation.STATE_IDLE) {
        if (cTime > smokeAnimation.IDLE_INTERVAL) {
            this.isObjDie = true;
        }
    }
    this.currentTime = cTime;
};

smokeAnimation.prototype.update = function (deltaTime,control) {
    if (this.isObjDie)
        return;
    let mesh = this.instance.getMesh();
    let timeScale = this.params.TimeScale;
    this.updateState(deltaTime * timeScale,control);
    this.timeCount += deltaTime * timeScale;
    /*if (this.currentState === fireAnimation.STATE_SPAWN) {
        let t = this.currentTime / fireAnimation.SPAWN_INTERVAL;
        let t2 = this.currentTime / (fireAnimation.SPAWN_INTERVAL + fireAnimation.SPAWN_DOWN_INTERVAL);
        mesh.position.set(this.initPos.x + this.distX * t2, mesh.position.y + t * 0.4 * this.yRatio * timeScale, this.initPos.z + this.distZ * t2);
        var scale = t * fireAnimation.scaleFactor;
        mesh.scale.set(scale, scale, scale);
    }
    else if (this.currentState === fireAnimation.STATE_SPAWN_DOWN) {
        let t2 = (this.currentTime + fireAnimation.SPAWN_INTERVAL) /
            (fireAnimation.SPAWN_INTERVAL + fireAnimation.SPAWN_DOWN_INTERVAL);
        mesh.position.set(this.initPos.x + this.distX * t2, mesh.position.y +
            (0.6 * timeScale *
                (1 - this.currentTime / fireAnimation.SPAWN_DOWN_INTERVAL) +
                0.2 * timeScale) * this.yRatio, this.initPos.z + this.distZ * t2);
    }*/
    if(this.currentState === smokeAnimation.STATE_BEFORE_START){
        /*if(!this.inPos){
            mesh.scale.set(1, 1, 1);
            //mesh.position.set(0,20,50*Math.random());
            this.initPos = true;
        }*/
        this.instance.setOpacity(this.currentTime/smokeAnimation.BEFORE_INTERVAL * 0.7);
        //console.log(this.currentTime);
        //mesh.opacity = 0.1;

    }
    else if (this.currentState === smokeAnimation.STATE_FLOATING) {
        if (this.posX === -1) {
            this.posX = mesh.position.x;
            this.posY = mesh.position.y;
            this.posZ = mesh.position.z;
            this.instance.setFlowRatio(0.5);
        }
        if(this.dir==0 || this.dir==1){
            //var z = Math.min(Math.max(mesh.position.z + this.randFlyZ * timeScale, this.minZ), this.maxZ);
            if(this.dir ==0)
                mesh.position.set(mesh.position.x + smokeAnimation.velocity * timeScale, mesh.position.y, mesh.position.z);
            else
                mesh.position.set(mesh.position.x - smokeAnimation.velocity * timeScale, mesh.position.y, mesh.position.z);
        }else if(this.dir==2 || this.dir==3){
            //var x = Math.min(Math.max(mesh.position.x + this.randFlyX * timeScale, this.minX), this.maxX);
            if(this.dir ==2)
                mesh.position.set(mesh.position.x , mesh.position.y, mesh.position.z + smokeAnimation.velocity * timeScale);
            else
                mesh.position.set(mesh.position.x , mesh.position.y, mesh.position.z - smokeAnimation.velocity * timeScale);
        }

        //this.instance.setOpacity(0.1);
    }
    else if (this.currentState === smokeAnimation.STATE_IDLE) {
        if (this.posX === -1) {
            this.posX = mesh.position.x;
            this.posY = mesh.position.y;
            this.posZ = mesh.position.z;
            this.instance.setFlowRatio(0.2);
        }
        if(this.dir==0){
            mesh.position.setX(this.posX + this.currentTime / 1500);
        }else if(this.dir==1){
            mesh.position.setX(this.posX - this.currentTime / 1500);
        }else if(this.dir==2){
            mesh.position.setZ(this.posZ + this.currentTime / 1500);
        }else if(this.dir==3){
            mesh.position.setZ(this.posZ - this.currentTime / 1500);
        }
        /*if (this.currentTime > smokeAnimation.IDLE_INTERVAL - 5000) {
            this.instance.setOpacity(1 - (this.currentTime - (smokeAnimation.IDLE_INTERVAL - 5000)) / 5000);
        }*/
        this.instance.setOpacity((1-this.currentTime/smokeAnimation.IDLE_INTERVAL) * 0.7);
        let scale = mesh.scale.x + 0.002 * timeScale * smokeAnimation.scaleFactor;
        mesh.scale.set(scale, scale, scale);
    }
    this.setColor();
    mesh.scale.setY(control.h);
    this.instance.update(deltaTime * timeScale * this.animationTimeRatio);
};

smokeAnimation.prototype.isDie = function () {
    return this.isObjDie;
};

smokeAnimation.prototype.inPolling = function () {
    return this.isInPooling;
};

smokeAnimation.prototype.setInPolling = function (val) {
    this.isInPooling = val;
};

smokeAnimation.prototype.reset = function (control) {
    this.randFlyX = Math.random() * 0.1 - 0.05;
    this.randFlyZ = Math.random() * 0.1 - 0.05;
    this.posX = -1;
    this.currentTime = 0;
    this.timeCount = 0;
    this.isObjDie = false;
    this.isInPooling = false;
    this.currentState = smokeAnimation.STATE_BEFORE_START;
    this.colorTransitionRandom = (Math.random() * 2000 - 1000) * smokeAnimation.scale;
    this.instance.getMesh().scale.set(0.1, control.h, 0.1);
    if(this.dir == 0)
        this.instance.getMesh().position.set(control.pos.x, this.maxY-control.h/smokeAnimation.scaleFactor/2, this.minZ+Math.random()*(this.maxZ-this.minZ));
    else if(this.dir == 1)
        this.instance.getMesh().position.set(control.pos.x, this.maxY-control.h/smokeAnimation.scaleFactor/2, this.minZ+Math.random()*(this.maxZ-this.minZ));
    else if(this.dir == 2)
        this.instance.getMesh().position.set(this.minX+Math.random()*(this.maxX-this.minX), this.maxY-control.h/smokeAnimation.scaleFactor/2, control.pos.z);
    else if(this.dir == 3)
        this.instance.getMesh().position.set(this.minX+Math.random()*(this.maxX-this.minX), this.maxY-control.h/smokeAnimation.scaleFactor/2, control.pos.z);
    this.instance.setFlowRatio(1);
    this.instance.setOpacity(0);
    this.initPos = new THREE.Vector3(10,10,10);
    this.scaleFactor = 0.8;
};



