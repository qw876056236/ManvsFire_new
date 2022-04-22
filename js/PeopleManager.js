var PeopleManager = function(mesh,mixer){
    this.mesh = mesh;
    this.nextPosition = new THREE.Vector3(Math.round(this.mesh.scene.position.x),this.mesh.scene.position.y,Math.round(this.mesh.scene.position.z));
    this.isExit = false;
    this.xMin = -39;
    this.zMin = 112;
    this.mixer = mixer;
    this.actionState = 0;
    this.path = [];
    this.my_fear = 0;
    this.fear = 0;
    this.A = 0;
    this.orientation = 0;
    this.speed = 1;
    this.form = 0;//初始为0进行随机移动，警觉度到达一定值后设为1进入逃跑状态，恐慌度达到一定程度设为2进入惊慌状态
}

PeopleManager.prototype.init = function(){
    this.nextPosition.x = Math.round(this.mesh.scene.position.x);
    this.nextPosition.y = this.mesh.scene.position.y;
    this.nextPosition.z = Math.round(this.mesh.scene.position.z);
}

PeopleManager.prototype.countMyFear = function(_this){
    var u1 = 1; u2 = 0.01; u3 = 1;//权重值需要从新设定
    var v = _this.ant.countspeed([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin]);
    var t = Math.LOG10E*Math.log(_this.currentEscapeTime);//获取时间,更改对数函数，前面缓慢后面快
    var d = Math.max(Math.abs(this.nextPosition.x - _this.fire.pos.x), Math.abs(this.nextPosition.x - _this.fire.pos.z));
    var ve = 1;//期望逃生速度,需要更改获取是老人还是其他的
    this.my_fear = u1 * (1 - v/ve) + u2 * t + u3 / d;
    this.speed = v;
    //console.log(this.speed)
}

PeopleManager.prototype.update = function(_this){
    if(!this.isExit){
        this.countMyFear(_this)
        if(this.form == 0){
            this.A = _this.ant.countA([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin]);
            if(this.A > 1)//临界值需要改，同时在Ant的countA里面改
                this.form = 1;
        }else if(this.form == 1){
            this.fear = _this.ant.countfear([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin], this.my_fear)
            if(this.fear > 1.4)//临界值可能需要更改
                this.form = 2;
        }else{
            this.fear = _this.ant.countfear([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin], this.my_fear)
            if(this.fear <= 1.4)//临界值可能需要更改
                this.form = 1;
        }

        if(this.isArrive(this.nextPosition)){
            if(this.form == 0)
                this.getNextPosition(_this)//之后改为getNextPositionTest,现在那个函数有问题
            else if(this.form == 1){
                this.getNextPosition(_this);
                // if(this.path.length == 0)
                //     this.getpath()//TO DO
                // this.getNextPositionNormal(_this)//TO DO
            }
            else if(this.form == 2)
                this.getNextPosition(_this);
            //动作切换test
            this.animationSwitch();
        }
        //向nextPosition走去
        this.walkToNextPosition(_this.delta);
        this.isArriveExit(_this);
    }
}

PeopleManager.prototype.isArriveExit = function(_this){
    for(var i=0;i<_this.exitPosArr.length;++i){
        if(this.isArrive(_this.exitPosArr[i])){
            this.isExit = true;
            break;
        }
    }
    if(this.isExit){
        this.mesh.scene.visible = false;
        _this.number--;
    }
}

PeopleManager.prototype.isArrive = function(pos){
    if(this.mesh.scene.position.distanceTo(pos)<=0.1)
        return true;
    else
        return false;
}

PeopleManager.prototype.getNextPosition = function(_this){
    var pos = _this.ant.step(this, [this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin]);
    this.nextPosition.x = pos[0] + this.xMin;
    this.nextPosition.z = pos[1] + this.zMin;
}

PeopleManager.prototype.getNextPositionTest = function(){
    this.nextPosition.x = this.mesh.scene.position.x + (Math.random()>0.5 ? -1 : 1) * Math.random() * 10;
    //this.nextPosition.y = this.scene.position.y + (Math.random()>0.5 ? -1 : 1) * Math.random() * 10;
    this.nextPosition.z = this.mesh.scene.position.z + (Math.random()>0.5 ? -1 : 1) * Math.random() * 10;
}

PeopleManager.prototype.walkToNextPosition = function(delta){
    /*计算到朝向目标位置的旋转角度*/
    var forVec = new THREE.Vector3(0,0,-100000);
    forVec = this.mesh.scene.localToWorld(forVec);

    forVec.sub(this.mesh.scene.position);
    forVec = forVec.normalize ();
    var nextVec = new THREE.Vector3(this.nextPosition.x-this.mesh.scene.position.x,0,this.nextPosition.z-this.mesh.scene.position.z);
    nextVec = nextVec.normalize ();

    var tempVec = forVec.clone();
    tempVec = tempVec.cross(nextVec);

    //当forVector和nextVec相同时，点积结果会稍大于1
    var theta = Math.acos(THREE.Math.clamp(forVec.dot(nextVec),-1,1));

    /*旋转至朝向目标位置*/
    if(tempVec.y>0)
    {
        this.mesh.scene.rotation.y += 1*theta;
    }
    else
    {
        this.mesh.scene.rotation.y += -1*theta;
    }

    /*向目标位置前进*/
    this.mesh.scene.translateZ(-delta*this.speed);

    /*校正模型初始旋转角度偏差*/
    this.mesh.scene.rotation.y += Math.PI;
    switch(this.actionState){
        case 2 :this.mesh.scene.rotation.y += 0.7853981633974483;break;//bend
        case 3 :this.mesh.scene.rotation.y += 2.5132741228718345;break;//crawl
        case 1 :this.mesh.scene.rotation.y += 0.8508480103472357;break;//walk
    }
}

PeopleManager.prototype.animationSwitch = function(){
    var i = Math.floor(Math.random()*this.mesh.animations.length);
    var meshMixer = new THREE.AnimationMixer(this.mesh.scene);
    var action = meshMixer.clipAction(this.mesh.animations[i]);
    this.mixer = meshMixer;
    this.actionState = i;
    this.activateAction(action);
}

PeopleManager.prototype.activateAction = function (action) {
    let self = this;
    var num = Math.floor(Math.random() * 2 + 1);
    switch (num) {
        case 1:
            self.setWeight(action, 1);
            break;
        case 2:
            //setWeight( action, 0 );
            break;
    }
    action.play();
};

PeopleManager.prototype.setWeight=function (action, weight) {
    action.enabled = true;
    var num = 0;
    while (num == 0) {
        num = Math.floor(Math.random() * 8 + 0.8);
        // num = Math.random();
    }
    // v0 += num / 4;
    // vmax += num / 4;
    // fear += second / 60;
    // vt = (1 - fear) * v0 + fear * vmax;//恐慌心理导致的Agent速度变化
    action.setEffectiveTimeScale(num / 3);//值越大速度越快，默认为1，0时动画停止
    action.setEffectiveWeight(weight);
}
