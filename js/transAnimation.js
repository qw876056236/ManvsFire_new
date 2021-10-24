var transAnimation = function () {
    transAnimation.TIME_SCALE = 0.12;
    transAnimation.SCALE = 0.05;
    transAnimation.STATE_BEFORE_START = 0;
    transAnimation.STATE_SPAWN = 1;
    transAnimation.STATE_SPAWN_DOWN = 2;
    transAnimation.STATE_FLOATING = 3;
    transAnimation.STATE_IDLE = 4;
    transAnimation.BEFORE_INTERVAL = 300 * transAnimation.TIME_SCALE ;
    transAnimation.SPAWN_INTERVAL = 5000 * transAnimation.TIME_SCALE ;
    transAnimation.SPAWN_DOWN_INTERVAL = 5000 * transAnimation.TIME_SCALE ;
    transAnimation.FLOATING_INTERVAL = 1000 * transAnimation.TIME_SCALE ;
    transAnimation.IDLE_INTERVAL = 18000 * transAnimation.TIME_SCALE ;

    this.params = {
        LightColor2 : '#ff8700',
        LightColor : '#f7f342',
        NormalColor : '#f7a90e',
        DarkColor2 : '#ff9800',
        GreyColor : '#3c342f',
        DarkColor : "#181818",
        TimeScale : 1,
        ParticleSpread : 1,
        ParticleColor : '#ffb400',
        InvertedBackground : false,
        ShowGrid : true
    };
}

transAnimation.prototype.init = function(instance, distX, distZ, yRatio, animationTimeRatio,pos) {
        distX = distX || 0;
        distZ = distZ || 0;
        yRatio = yRatio || 1;
        animationTimeRatio = animationTimeRatio || 1;
        this.initPos = new THREE.Vector3(pos.x,pos.y,pos.z);
        this.instance = instance;
        this.distX = distX;
        this.distZ = distZ;
        this.yRatio = yRatio;
        this.animationTimeRatio = animationTimeRatio;
        this.reset();
    }

transAnimation.prototype.setColor = function () {
    let tc = this.timeCount + this.colorTransitionRandom;
    if (tc < 2500 * transAnimation.TIME_SCALE + this.colorTransitionRandom) {
        let t = tc / (2500 * transAnimation.TIME_SCALE)  + this.colorTransitionRandom;
        this.instance.setColor({
            colDark: this.params.NormalColor,
            colNormal: this.params.LightColor,
            colLight: this.params.LightColor2
        });
    }
    else if (tc < 4000 * transAnimation.TIME_SCALE) {
        let t = (tc - 2500 * transAnimation.TIME_SCALE) / 1500 / transAnimation.TIME_SCALE;
        this.instance.setColor({
            colDark: Utils.vec3Blend(this.params.NormalColor, this.params.DarkColor2, t),
            colNormal: Utils.vec3Blend(this.params.LightColor, this.params.NormalColor, t),
            colLight: Utils.vec3Blend(this.params.LightColor2, this.params.LightColor, t)
        });
    }
    else if (tc < 7000 * transAnimation.TIME_SCALE) {
        let t = (tc - 4000 * transAnimation.TIME_SCALE) / 3000 / transAnimation.TIME_SCALE;
        this.instance.setColor({
            colDark: Utils.vec3Blend(this.params.DarkColor2, this.params.DarkColor2, t),
            colNormal: Utils.vec3Blend(this.params.NormalColor, this.params.NormalColor, t),
            colLight: Utils.vec3Blend(this.params.LightColor, this.params.LightColor, t)
        });
    }
    else if (tc < 12000 * transAnimation.TIME_SCALE) {
        let t = Math.min(1, (tc - 7000 * transAnimation.TIME_SCALE) / 5000 / transAnimation.TIME_SCALE);
        this.instance.setColor({
            colDark: Utils.vec3Blend(this.params.DarkColor2, this.params.DarkColor, t),
            colNormal: Utils.vec3Blend(this.params.NormalColor, this.params.DarkColor2, t),
            colLight: Utils.vec3Blend(this.params.LightColor, this.params.NormalColor, t)
        });
    }
    else if (tc < 20000 * transAnimation.TIME_SCALE) {
        let t = Math.min(1, (tc - 12000 * transAnimation.TIME_SCALE) / 5000 / transAnimation.TIME_SCALE);
        this.instance.setColor({
            colDark: '#000000',
            colNormal: '#696969',
            colLight: '#808080'
        });
    }
    else {
        let t = Math.min(1, (tc - 20000 * transAnimation.TIME_SCALE) / 6000 / transAnimation.TIME_SCALE);
        this.instance.setColor({
            colDark: '#000000',
            colNormal: '#303030',
            colLight: '#696969'
        });
    }
};

transAnimation.prototype.updateState = function (deltaTime) {
    var cTime = this.currentTime + deltaTime;
    if (this.currentState === transAnimation.STATE_BEFORE_START) {
        if (cTime > transAnimation.BEFORE_INTERVAL) {
            cTime -= transAnimation.BEFORE_INTERVAL;
            this.currentState = transAnimation.STATE_SPAWN;
        }
    }
    else if (this.currentState === transAnimation.STATE_SPAWN) {
        if (cTime > transAnimation.SPAWN_INTERVAL) {
            cTime -= transAnimation.SPAWN_INTERVAL;
            this.posX = -1;
            this.currentState = transAnimation.STATE_SPAWN_DOWN;
        }
    }
    else if (this.currentState === transAnimation.STATE_SPAWN_DOWN) {
        if (cTime > transAnimation.SPAWN_DOWN_INTERVAL) {
            cTime -= transAnimation.SPAWN_DOWN_INTERVAL;
            this.currentState = transAnimation.STATE_FLOATING;
        }
    }
    else if (this.currentState === transAnimation.STATE_FLOATING) {
        if (cTime > transAnimation.FLOATING_INTERVAL) {
            cTime -= transAnimation.FLOATING_INTERVAL;
            this.posX = -1;
            this.currentState = transAnimation.STATE_IDLE;
        }
    }
    else if (this.currentState === transAnimation.STATE_IDLE) {
        if (cTime > transAnimation.IDLE_INTERVAL) {
            this.isObjDie = true;
        }
    }
    this.currentTime = cTime;
};

transAnimation.prototype.update = function (deltaTime) {
    if (this.isObjDie)
        return;
    let mesh = this.instance.getMesh();
    let timeScale = this.params.TimeScale;
    this.updateState(deltaTime * timeScale);
    this.timeCount += deltaTime * timeScale;
    if (this.currentState === transAnimation.STATE_SPAWN) {
        let t = this.currentTime / transAnimation.SPAWN_INTERVAL;
        let t2 = this.currentTime / (transAnimation.SPAWN_INTERVAL + transAnimation.SPAWN_DOWN_INTERVAL);
        mesh.position.set(this.initPos.x + this.distX * t2, mesh.position.y + (t * 0.4 * this.yRatio * timeScale)*transAnimation.TIME_SCALE, this.initPos.z + this.distZ * t2);
        var scale = t * transAnimation.SCALE;
        mesh.scale.set(scale, scale, scale);
        this.instance.setOpacity(0.6);
    }
    else if (this.currentState === transAnimation.STATE_SPAWN_DOWN) {
        let t2 = (this.currentTime + transAnimation.SPAWN_INTERVAL) /
            (transAnimation.SPAWN_INTERVAL + transAnimation.SPAWN_DOWN_INTERVAL);
        mesh.position.set(this.initPos.x + this.distX * t2, mesh.position.y +
            ((0.6 * timeScale *
                (1 - this.currentTime / transAnimation.SPAWN_DOWN_INTERVAL) +
                0.2 * timeScale) * this.yRatio)*transAnimation.TIME_SCALE, this.initPos.z + this.distZ * t2);
    }
    else if (this.currentState === transAnimation.STATE_FLOATING) {
        if (this.posX === -1) {
            this.posX = mesh.position.x;
            this.posY = mesh.position.y;
            this.posZ = mesh.position.z;
            this.instance.setFlowRatio(0.7);
        }
        mesh.position.set(mesh.position.x + this.randFlyX * timeScale, mesh.position.y + 0.2 * timeScale * transAnimation.TIME_SCALE, mesh.position.z + this.randFlyZ * timeScale);
        let scale = mesh.scale.x + 0.003 * timeScale * transAnimation.SCALE;
        mesh.scale.set(scale, scale, scale);
    }
    else if (this.currentState === transAnimation.STATE_IDLE) {
        if (this.posX === -1) {
            this.posX = mesh.position.x;
            this.posY = mesh.position.y;
            this.posZ = mesh.position.z;
            this.scaleX = mesh.scale.x;
            this.instance.setFlowRatio(0.5);
        }
        if (this.currentTime > transAnimation.IDLE_INTERVAL - 5000) {
            this.instance.setOpacity((1 - (this.currentTime - (transAnimation.IDLE_INTERVAL - 5000)) / 5000) * 1);
        }
        mesh.position.setY(this.posY + this.currentTime / 6000 / transAnimation.TIME_SCALE);
        mesh.position.setX(this.posX+(this.initPos.x-mesh.position.x)*this.currentTime / 24000 / transAnimation.TIME_SCALE);
        mesh.position.setZ(this.posZ+(this.initPos.z-mesh.position.z)*this.currentTime / 24000 / transAnimation.TIME_SCALE);

        let scale = Math.abs(mesh.scale.x) * 1.01;
        
        mesh.scale.set(scale, scale, scale);

    }
    this.setColor();
    this.instance.update(deltaTime * timeScale * this.animationTimeRatio);
};

transAnimation.prototype.isDie = function () {
    return this.isObjDie;
};

transAnimation.prototype.inPolling = function () {
    return this.isInPooling;
};

transAnimation.prototype.setInPolling = function (val) {
    this.isInPooling = val;
};

transAnimation.prototype.reset = function () {
    this.randFlyX = (Math.random() * 0.1 - 0.05) * 0.2;
    this.randFlyZ = (Math.random() * 0.1 - 0.05) * 0.2;
    this.posX = -1;
    this.currentTime = 0;
    this.timeCount = 0;
    this.isObjDie = false;
    this.isInPooling = false;
    this.currentState = transAnimation.STATE_BEFORE_START;
    this.colorTransitionRandom = (Math.random() * 2000 - 1000) * transAnimation.TIME_SCALE;
    this.instance.getMesh().position.set(this.initPos.x, this.initPos.y, this.initPos.z);
    this.instance.getMesh().scale.set(0, 0, 0);
    this.instance.setFlowRatio(0.1);
    this.instance.setOpacity(1);
};



