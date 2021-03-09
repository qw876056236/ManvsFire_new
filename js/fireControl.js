//火焰、消防员、灭火都在这里
var fireControl = function ()
{
    this.roangle=0;

    this.Q = 10000;//热释放速率 单位kw kj/s
    this.QFactor = 100//火灾增长系数 单位kw/s2
    this.Qc = 0;//对流热释放速率
    //可由用户设置的常数
    this.QcFactor = 0.7//对流热释放速率份数
    this.ice = 0.9;//不完全燃烧系数
    this.eac = 1.3;//过剩空气系数

    //读取用户的设置
    this.Zh = 0;//火源基部到顶棚高度
    this.D = 1;//火源有效直径
    this.Cy = 99.96;
    this.Sy = 0;
    this.Hy = 0.39;
    this.Ny = 0;
    this.Oy = 0;
    this.Wy = 0;
    this.calValue = 32600;//热值 单位kj/kg  j/g

    //着火时计算出来的量
    this.V0 = 0;//理论空气量

    //着火过程中计算的量
    this.B = 0;//单位时间内参与燃烧的可燃物质量  kg/s
    this.L = 0;//火焰平均高度
    this.Zv = 0;//火源基部以上虚点源高度
}

fireControl.prototype.init = function (_this)
{
    var fireControl = new FIRE.ControlSheet({
        width:0.3,
        length: 0.3,
        high: 0.5
    });
    var fireManager = new FIRE.Manager(fireControl);
    fireManager.maxParticlesNum = 500;
    fireManager.runTimer();
    fireManager.controlSheet.x = _this.smoke.positionBallMesh.position.x;
    fireManager.controlSheet.y = _this.smoke.positionBallMesh.position.y+0.5;
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

fireControl.prototype.set = function()
{
    this.V0 = (0.0187*this.Cy + 0.0556*this.Hy + 0.007*this.Sy - 0.007*this.Oy) / 0.21;
}

fireControl.prototype.Run = function (_this)
{
    var self = this;
    if(self.fireManager.controlSheet.x != _this.smoke.positionBallMesh.position.x)
    {
        self.fireManager.controlSheet.x = _this.smoke.positionBallMesh.position.x;
        self.fireManager.controlSheet.y = _this.smoke.positionBallMesh.position.y+0.5;
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
    //this.Q = this.QFactor * Math.pow(_this.smoke.clock.getElapsedTime(),2);
    //计算火羽流相关参数
    var L = -1.02*this.D + 0.235*Math.pow(this.Q,2/5);
    this.L = L > 0 ? L : 0;
    var Zv = -1.02*this.D + 0.083*Math.pow(this.Q,2/5);
    this.Zv = Zv > 0 ? Zv : 0;
    this.Qc = this.QcFactor * this.Q;
    //this.fireManager.controlSheet.high = this.L;
    this.B = this.Q / this.ice / this.calValue;
    //console.log("l:"+this.L+" "+"Zv:"+this.Zv+" "+"B:"+this.B);
    this.Run(_this);
    //this.FirePosition(_this);
    //this.ifisposition(_this);
}