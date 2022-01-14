var PeopleManager = function(scene){
    this.scene = scene;
    this.nextPosition = new THREE.Vector3(0,0,0);
    this.speed = 1;
    this.isArrive = false;
}

PeopleManager.prototype.init = function(){
    this.nextPosition.x = this.scene.position.x;
    this.nextPosition.y = this.scene.position.y;
    this.nextPosition.z = this.scene.position.z;
}

PeopleManager.prototype.update = function(delta){
    if(!this.isArrive){
        if(this.isArriveNext()){
            this.getNextPositionTest();
        }
        //向nextPosition走去
        this.walkToNextPosition(delta);
    }
}

PeopleManager.prototype.isArrive = function(){

}

PeopleManager.prototype.isArriveNext = function(){
    if(this.scene.position.distanceTo(this.nextPosition)<=0.1)
        return true;
    else
        return false;
}

PeopleManager.prototype.getNextPosition = function(){

}

PeopleManager.prototype.getNextPositionTest = function(){
    this.nextPosition.x = this.scene.position.x + (Math.random()>0.5 ? -1 : 1) * Math.random() * 10;
    //this.nextPosition.y = this.scene.position.y + (Math.random()>0.5 ? -1 : 1) * Math.random() * 10;
    this.nextPosition.z = this.scene.position.z + (Math.random()>0.5 ? -1 : 1) * Math.random() * 10;
}

PeopleManager.prototype.walkToNextPosition = function(delta){
    /*计算到朝向目标位置的旋转角度*/
    var forVec = new THREE.Vector3(0,0,-100000);
    forVec = this.scene.localToWorld(forVec);

    forVec.sub(this.scene.position);
    forVec = forVec.normalize ();
    var nextVec = new THREE.Vector3(this.nextPosition.x-this.scene.position.x,0,this.nextPosition.z-this.scene.position.z);
    nextVec = nextVec.normalize ();

    var tempVec = forVec.clone();
    tempVec = tempVec.cross(nextVec);

    //当forVector和nextVec相同时，点积结果会稍大于1
    var theta = Math.acos(THREE.Math.clamp(forVec.dot(nextVec),-1,1));

    /*旋转至朝向目标位置*/
    if(tempVec.y>0)
    {
        this.scene.rotation.y += 1*theta;
    }
    else
    {
        this.scene.rotation.y += -1*theta;
    }

    /*向目标位置前进*/
    this.scene.translateZ(-delta*this.speed);

    /*校正模型初始旋转角度偏差*/
    this.scene.rotation.y += Math.PI;
    switch(this.scene.name){
        case "bend":this.scene.rotation.y += 0.7853981633974483;break;
        case "crawl":this.scene.rotation.y += 2.5132741228718345;break;
        case "walk":this.scene.rotation.y += 0.8508480103472357;break;
    }
}