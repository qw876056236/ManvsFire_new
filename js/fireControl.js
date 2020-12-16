//火焰、消防员、灭火都在这里
var fireControl = function ()
{
    this.roangle=0;
}

fireControl.prototype.init = function (_this)
{
    var fireControl = new FIRE.ControlSheet({
        width:0.5,
        length: 0.5,
        high: 2
    });
    var fireManager = new FIRE.Manager(fireControl);
    fireManager.maxParticlesNum = 500;
    fireManager.runTimer();
    fireManager.controlSheet.x = _this.smoke.positionBallMesh.position.x;
    fireManager.controlSheet.y = _this.smoke.positionBallMesh.position.y;
    fireManager.controlSheet.z = _this.smoke.positionBallMesh.position.z;
    fireManager.target.visible =false;
    this.fireManager = fireManager;


    _this.scene.add(this.fireManager.target);

    //region正四面体，用于标记火源位置 删除了部分
    /*var Te1=new Array();
    var Te2=new Array();

    var Te1Geometry=new THREE.TetrahedronGeometry(5);
    this.Te1Material=new THREE.MeshLambertMaterial({color:0xff0000});
    this.Te1Material.transparent=true;
    this.Te1Material.opacity=1;
    var Te1Mesh=new THREE.Mesh(Te1Geometry,this.Te1Material);
    Te1Mesh.position.set(41,15,25);
    this.Te1Material.visible=false;
    _this.scene.add(Te1Mesh);
    Te1.push(Te1Mesh);

    var Te2Geometry=new THREE.TetrahedronGeometry(5);
    this.Te2Material=new THREE.MeshLambertMaterial({color:0xff0000});
    this.Te2Material.transparent=true;
    this.Te2Material.opacity=1;
    var Te2Mesh=new THREE.Mesh(Te2Geometry,this.Te2Material);
    Te2Mesh.position.set(91,15,25);
    this.Te2Material.visible=false;
    _this.scene.add(Te2Mesh);
    Te2.push(Te2Mesh);*/
//endregion

}

fireControl.prototype.Run = function (_this)
{
    var self = this;
    if(self.fireManager.controlSheet.x != _this.smoke.positionBallMesh.position.x)
    {
        self.fireManager.controlSheet.x = _this.smoke.positionBallMesh.position.x;
        self.fireManager.controlSheet.y = _this.smoke.positionBallMesh.position.y;
        self.fireManager.controlSheet.z = _this.smoke.positionBallMesh.position.z;
    }
    self.fireManager.run();
}

fireControl.prototype.FirePosition = function (_this)
{
    var self = this;
    if(_this.isEdit)
    {
        if(self.fireManager.controlSheet.x != _this.smoke.positionBallMesh.position.x)
        {
            self.fireManager.controlSheet.x = _this.smoke.positionBallMesh.position.x;
            self.fireManager.controlSheet.y = _this.smoke.positionBallMesh.position.y;
            self.fireManager.controlSheet.z = _this.smoke.positionBallMesh.position.z;
        }
    }
}

fireControl.prototype.ifisposition = function (_this)
{
    var self = this;
    if(_this.Fireman.isposition)
    {
        if(_this.HCI.whetherrotate)
        {
            if(self.roangle<5/6*Math.PI)
            {
                _this.Fireman.cubeFireman.rotation.y += Math.PI * 0.02;
                self.roangle += Math.PI * 0.02;
            }
        }
        if(!_this.water.watermiss)
        {
            for (var i = 0; i < _this.water.waterArr.length; i++) {
                _this.water.waterArr[i].material.opacity = 1;
            }
        }
        _this.smoke.iswater=true;
        self.fireManager.target.visible = false;
        _this.Fireman.isposition=false;

    }
}

fireControl.prototype.update = function (_this)
{
    this.Run(_this);
    //this.FirePosition(_this);
    //this.ifisposition(_this);
}