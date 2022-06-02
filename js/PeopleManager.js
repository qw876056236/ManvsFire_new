var PeopleManager = function(mesh,mixer){
    this.mesh = mesh;
    this.nextPosition = new THREE.Vector3(Math.round(this.mesh.scene.position.x),this.mesh.scene.position.y,Math.round(this.mesh.scene.position.z));
    this.isExit = false;
    this.xMin = -39;
    this.zMin = 112;
    this.mixer = mixer;
    this.actionState = 1;//0run 1walk 2bend 3crawl 4idle
    this.action;
    this.path = [];
    this.finder;
    this.steps = 0;// 记录走到A*路径上的第几步
    this.my_fear = 0;// 自身恐慌度
    this.fear = 0;
    this.preFear = 0;
    this.A = 0;
    this.orientation = 0;
    this.speed = 1;
    this.trace = [];
    this.form = 1;//初始为0进行随机移动，警觉度到达一定值后设为1进入逃跑状态理智模式，2为逃生状态惊慌状态，3为拥堵状态
    this.ph = 1;
    this.ve = 1;
    this.ore = 0;
    this.before = [];
    this.F = Math.random();
    this.timeInStuckLimit = 3;
    this.timeInStuck = 0;
    this.coefficient_a = 1;
    this.fear_number = 1.4;
    this.F_number = 0.2;
}

PeopleManager.prototype.init = function(_this){
    this.nextPosition.x = Math.round(this.mesh.scene.position.x);
    this.nextPosition.y = this.mesh.scene.position.y;
    this.nextPosition.z = Math.round(this.mesh.scene.position.z);
    _this.ant.pheromone[this.nextPosition.x-this.xMin][this.nextPosition.z-this.zMin].people_number += 1;
    this.fear_number = _this.fear_number * (1.1 - 0.2 * Math.random());
    this.F_number = _this.F_number * (1.1 - 0.2 * Math.random());
    this.coefficient_a = _this.coefficient_a * (1.1 - 0.2 * Math.random());
}

PeopleManager.prototype.countMyFear = function(_this){
    var u1 = 1; u2 = 1; u3 = 1;//权重值需要从新设定
    var v = _this.ant.countspeed([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin],0,this.ve);
    var t = Math.LOG10E*Math.log(_this.currentEscapeTime);//获取时间,更改对数函数，前面缓慢后面快
    var d = Math.max(Math.abs(this.nextPosition.x - _this.fire.pos.x), Math.abs(this.nextPosition.x - _this.fire.pos.z));
    var ve = 1;//期望逃生速度,需要更改获取是老人还是其他的
    this.my_fear = u1 * (1 - v/ve) + u2 * t + u3 / d;
    this.speed = v;//todo
    console.log(this.speed)
}

PeopleManager.prototype.update = function(_this){
    if(!this.isExit){
        this.frustumCulling(_this);
        this.countMyFear(_this)
        var density = _this.ant.countDensity([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin]);
        if(density>3.8){
            if(this.form != 3)
                this.timeInStuck = _this.clock.getElapsedTime();
            this.form = 3;
        }else{
            if(this.form == 0){
                console.log('coefficient_a: '+this.coefficient_a)
                this.A = _this.ant.countA([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin], 2, this.coefficient_a);
                if(this.A >= 1){//临界值需要改，同时在Ant的countA里面改
                    this.form = 1;
                    this.path.length = 0;
                    this.fear = _this.ant.countfear([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin], this.my_fear)
                    _this.ant.pheromone[this.nextPosition.x-this.xMin][this.nextPosition.z-this.zMin].A_number += 1;
                    _this.ant.pheromone[this.nextPosition.x-this.xMin][this.nextPosition.z-this.zMin].fear += this.fear;
                    this.preFear = this.fear;
                }
            }else if(this.form == 1){
                this.fear = _this.ant.countfear([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin], this.my_fear)
                if(this.fear > this.fear_number)//临界值可能需要更改
                    this.form = 1;
            }else if(this.form == 2){
                this.fear = _this.ant.countfear([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin], this.my_fear)
                if(this.fear <= this.fear_number)//临界值可能需要更改
                    this.form = 1;
            }else if(this.form == 3){
                this.fear = _this.ant.countfear([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin], this.my_fear)
                if(this.fear <= this.fear_number)
                    this.form = 1;
                else
                    this.form = 2;
            }
        }


        if(this.isArriveExit(_this)){
            //清除网格信息素及恐慌度等属性值
            for(var i=this.trace.length-1,j=0;i>=0;i--,j++)
                _this.ant.pheromone[this.trace[i][0]][this.trace[i][1]].ph -= (1-j/_this.ant.trace_step)*this.ph;
            if(this.form > 0)
                _this.ant.pheromone[this.nextPosition.x-this.xMin][this.nextPosition.z-this.zMin].A_number -= 1;
            _this.ant.pheromone[this.nextPosition.x-this.xMin][this.nextPosition.z-this.zMin].fear -= this.preFear;
            _this.ant.pheromone[this.nextPosition.x-this.xMin][this.nextPosition.z-this.zMin].people_number -= 1;

            this.mesh.scene.visible = false;
            _this.scene.remove(this.mesh.scene);
            _this.number--;
            return;
        }

        if(this.isArrive(this.nextPosition)){
            if(this.form == 0)
                this.getNextPositionRandom(_this);
            else if(this.form == 1){
                if(this.F > 1- this.F_number)//临界值可能需要修改
                    this.getNextPositionPath(_this);
                else
                    this.getNextPositionBySigns(_this);
            }else if(this.form == 2)
                this.getNextPosition(_this);
        }
        console.log(this.speed);
        if(this.form != 3 || (this.form == 3 && _this.clock.getElapsedTime() - this.timeInStuck > this.timeInStuckLimit && this.getNextPositionStuck(_this)))
            this.walkToNextPosition(_this.delta);
        this.animationSwitch();
    }
}

PeopleManager.prototype.isArriveExit = function(_this){
    for(var i=0;i<_this.exitPosArr.length;++i){
        if(this.isArrive(_this.exitPosArr[i])){
            this.isExit = true;
            return true;
        }
    }
    return false;
}

PeopleManager.prototype.isArrive = function(pos){
    if(this.mesh.scene.position.distanceTo(pos)<=0.1)
        return true;
    else
        return false;
}

PeopleManager.prototype.getNextPosition = function(_this){
    this.beforeGetPosition(_this);
    for(var i=this.trace.length-1,j=0;i>=0;i--,j++)
        _this.ant.pheromone[this.trace[i][0]][this.trace[i][1]].ph -= (1-j/_this.ant.trace_step)*this.ph;
    var pos = _this.ant.step(this, [this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin]);
    this.nextPosition.x = pos[0] + this.xMin;
    this.nextPosition.z = pos[1] + this.zMin;
    for(var i=this.trace.length-1,j=0;i>=0;i--,j++)
        _this.ant.pheromone[this.trace[i][0]][this.trace[i][1]].ph += (1-j/_this.ant.trace_step)*this.ph;
    this.afterGetPosition(_this);
}

PeopleManager.prototype.getNextPositionStuck = function(_this){
    this.beforeGetPosition(_this);
    var pos = _this.ant.Stuck(this, [this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin]);
    if(this.nextPosition.x == pos[0]+this.xMin && this.nextPosition.z == pos[1]+this.zMin){
        this.afterGetPosition(_this);
        return false;
    }
    this.nextPosition.x = pos[0] + this.xMin;
    this.nextPosition.z = pos[1] + this.zMin;
    this.afterGetPosition(_this);
    return true;
}

PeopleManager.prototype.getNextPositionBySigns = function(_this){
    this.beforeGetPosition(_this);
    if(this.path.length){
        this.nextPosition.x = this.path[0][0]+this.xMin
        this.nextPosition.z = this.path[0][1]+this.zMin
        this.path.shift();
    }else{
        this.path = _this.ant.GoBySigns([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin], this);
        if(this.path.length){
            this.nextPosition.x = this.path[0][0]+this.xMin
            this.nextPosition.z = this.path[0][1]+this.zMin
            this.path.shift();
        }else
            this.getNextPositionRandom(_this)
    }
    this.afterGetPosition(_this);
}

PeopleManager.prototype.getNextPositionRandom = function(_this){
    this.beforeGetPosition(_this);
    var pos = _this.ant.Step_random([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin], this, 1);
    this.nextPosition.x = pos[0] + this.xMin;
    this.nextPosition.z = pos[1] + this.zMin;
    this.afterGetPosition(_this);
}

PeopleManager.prototype.getNextPositionPath = function(_this){
    this.beforeGetPosition(_this);
    if(this.path.length == 0){
        this.finder = new PF.BiAStarFinder({
            allowDiagonal: true,//允许对角线
            dontCrossCorners: false,//不要拐弯?
            heuristic: PF.Heuristic["manhattan"],//启发式["曼哈顿"]
            weight: 1
        });                
        // console.log([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin, _this.exitPosArr[0].x-this.xMin,  _this.exitPosArr[0].z-this.zMin])
        var n = 0, d = 0, c = 0;
        for(var i = 0; i < _this.exitPosArr.length; i++){//直接选择直线距离最短的点作为寻路的终点,之后可以改为选择最短路径
            d = this.nextPosition.distanceTo( _this.exitPosArr[i])
            if(n > d || n == 0){
                n = d;
                c = i;
            }    
        }
        this.path = this.finder.findPath(this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin, _this.exitPosArr[c].x-this.xMin, _this.exitPosArr[c].z-this.zMin, _this.ant.PathFindeM.clone());
        this.path.shift();
    }
    if(this.path.length > 0){
        this.nextPosition.x = this.path[0][0]+this.xMin
        this.nextPosition.z = this.path[0][1]+this.zMin
        this.path.shift();
    }else
        this.getNextPositionRandom(_this)
    this.afterGetPosition(_this);
}

PeopleManager.prototype.beforeGetPosition = function(_this){
    _this.ant.volatilize(this.trace,this.ph);
    this.trace.push([this.nextPosition.x-this.xMin,this.nextPosition.z-this.zMin]);
    if(this.trace.length > _this.ant.trace_step)
        this.trace.shift()
    _this.ant.pheromone[this.nextPosition.x-this.xMin][this.nextPosition.z-this.zMin].ph += this.ph;
    _this.ant.pheromone[this.nextPosition.x-this.xMin][this.nextPosition.z-this.zMin].people_number -= 1;
    _this.ant.pheromone[this.nextPosition.x-this.xMin][this.nextPosition.z-this.zMin].fear -= this.preFear;
    if(this.form > 0)
        _this.ant.pheromone[this.nextPosition.x-this.xMin][this.nextPosition.z-this.zMin].A_number -= 1;
}

PeopleManager.prototype.afterGetPosition = function(_this){
    _this.ant.pheromone[this.nextPosition.x-this.xMin][this.nextPosition.z-this.zMin].people_number += 1;
    _this.ant.pheromone[this.nextPosition.x-this.xMin][this.nextPosition.z-this.zMin].fear += this.fear;
    this.preFear = this.fear;
    if(this.form > 0)
        _this.ant.pheromone[this.nextPosition.x-this.xMin][this.nextPosition.z-this.zMin].A_number += 1;
    var x = this.nextPosition.x-this.xMin - this.trace[this.trace.length-1][0]
    var y = this.nextPosition.z-this.zMin - this.trace[this.trace.length-1][1]
    if(x > 0){
        if(y > 0)
            this.orientation = 3;
        else if(y < 0)
            this.orientation = 8;
        else
            this.orientation = 5;
    }else if(x < 0){
        if(y > 0)
            this.orientation = 1;
        else if(y < 0)
            this.orientation = 6;
        else
            this.orientation = 4;
    }else{
        if(y > 0)
            this.orientation = 2;
        else if(y < 0)
            this.orientation = 7;
        else{
            this.orientation = 0;
            console.log('原地不动！！！')
        }
    }
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

PeopleManager.prototype.frustumCulling = function(_this){
    //this.mesh.scene.visible = false;
    if(_this.viewFrustum.containsPoint(this.mesh.scene.position)){
        //视锥内的人物设为可见
        this.mesh.scene.visible = true;
        this.mesh.scene.matrixWorldNeedsUpdate = false;
        if(_this.camera.position.distanceTo(this.mesh.scene.position)<50){
            //与摄像机距离小于50的播放动画
            this.mesh.scene.visible = true;
            this.mesh.scene.matrixAutoUpdate = true;
            this.mixer.update(_this.delta);
        }
    }else{
        //视锥外人物设为不可见
        this.mesh.scene.visible = false;
    }
}

PeopleManager.prototype.animationSwitch = function(){
    if(this.form == 3 && this.actionState!=4){
        this.actionState = 4;
        var meshMixer = new THREE.AnimationMixer(this.mesh.scene);
        this.action = meshMixer.clipAction(this.mesh.animations[this.actionState]);
        this.mixer = meshMixer;
        this.activateAction(action);
        this.action.setEffectiveTimeScale(1);
    }else if(this.form !=3 && this.actionState!=0){
        this.actionState = 0;
        var meshMixer = new THREE.AnimationMixer(this.mesh.scene);
        this.action = meshMixer.clipAction(this.mesh.animations[this.actionState]);
        this.mixer = meshMixer;
        this.activateAction();
    }
    if(this.form != 3)
        this.action.setEffectiveTimeScale(this.speed);//值越大速度越快，默认为1，0时动画停止
}

PeopleManager.prototype.activateAction = function () {
    let self = this;
    self.setWeight(1);
    /*var num = Math.floor(Math.random() * 2 + 1);
    switch (num) {
        case 1:
            self.setWeight(action, 1);
            break;
        case 2:
            //setWeight( action, 0 );
            break;
    }*/
    this.action.play();
};

PeopleManager.prototype.setWeight=function (weight) {
    this.action.enabled = true;
    /*var num = 0;
    while (num == 0) {
        num = Math.floor(Math.random() * 8 + 0.8);
        // num = Math.random();
    }*/
    // v0 += num / 4;
    // vmax += num / 4;
    // fear += second / 60;
    // vt = (1 - fear) * v0 + fear * vmax;//恐慌心理导致的Agent速度变化
    this.action.setEffectiveWeight(weight);
}
      