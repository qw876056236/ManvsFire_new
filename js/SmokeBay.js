var SmokeFloor = function(){
    //初始设定的量
    this.xmin = 0;
    this.xmax = 0;
    this.ymin = 0;
    this.ymax = 0;
    this.zmin = 0;
    this.zmax = 0;
    this.jetH = 1.7;
    this.h = 0;
    this.S = 0;
    this.V = 0;
    this.smokeBayArr = [];
    this.hCS = 0.5;
    this.jetVolume = 0;//顶棚射流最大烟雾量

    //着火时要设定的量
    this.fire = null;//火焰
    this.isFire = false;//是否是着火楼层
    this.firePos = new THREE.Vector3(0,0,0);
    this.fireBayIndex = -1;

    //着火过程中计算并实时更新的量
    this.isInTurning = true;//是否在火羽流转向区内
    this.stage = 0;//火灾烟气阶段 0表示未着火，1表示顶棚射流阶段，2表示烟气沉积阶段，3表示烟雾满了
    this.smokev = 0;//烟雾扩散流速
    this.smoker = 0;//烟雾覆盖最远距离
    this.smokeh = 0;//烟气沉积阶段烟雾厚度

    this.smokeVolume = 0;
    this.generateVolume = 0;
    this.Vy = 0;

    this.exhaustVolume = 0;

    //着火过程中用户实时设定的量
    this.exhuastV= 0//总排烟速度

}

SmokeFloor.prototype.init = function(xmin,xmax,ymin,ymax,zmin,zmax){
    this.xmin = xmin;
    this.xmax = xmax;
    this.ymin = ymin;
    this.ymax = ymax;
    this.zmin = zmin;
    this.zmax = zmax;
    this.h = this.ymax - this.ymin;
    this.S = (this.xmax-this.xmin) * (this.zmax-this.zmin);
    this.V = this.S * this.h;
    this.jetVolume = this.hCS * this.S;
    for(let i=0;i<this.smokeBayArr.length;++i)
        this.exhuastV += this.smokeBayArr[i].exhaustVel * this.smokeBayArr[i].S;
}

SmokeFloor.prototype.compute = function(dt,_this){

    //计算产生烟气量并更新stage
    this.Vy = this.fire.ice * this.fire.B * (0.0187*this.fire.Cy + 0.011*this.fire.Hy + 0.007*this.fire.Sy + 0.0124*this.fire.Wy + 0.008*this.fire.Ny + 0.8061*this.fire.eac*this.fire.V0);
    if(this.fire.eac < 1)
    {
        this.Vy += 0.21 * this.fire.ice * this.fire.B * (1-this.fire.eac) * this.fire.V0;
    }
    //console.log(this.Vy);
    this.generateVolume = this.Vy * dt;
    _this.smoke.smokeVolume += this.generateVolume;
    var exhuastVolume = 0;
    for(let i=0;i<this.smokeBayArr.length;++i)
        exhuastVolume += this.smokeBayArr[i].exhaustVel * this.smokeBayArr[i].S * dt / 60 * this.smokeBayArr[i].sumVolume / this.smokeBayArr[i].V;
    var Volume = this.smokeVolume + this.generateVolume - exhuastVolume;
    if(Volume < 0)
        this.smokeVolume = 0;


    if(this.stage==1 && Volume>this.jetVolume)
    {
        var fullBayNum = 0;//smoker>=maxr的防烟分区的数量
        for(let i=0;i<this.smokeBayArr.length;++i)
            if(this.smokeBayArr[i].smoker >= this.smokeBayArr[i].maxr)
                ++fullBayNum;
        if(fullBayNum == this.smokeBayArr.length){
            this.stage = 2;
            this.smokeVolume = Volume;
            this.exhaustVolume += exhuastVolume;
            //烟雾形态转换
            this.cloudSwitch(_this);
        }else
            this.smokeVolume += this.generateVolume;
    }
    else if(this.stage==1)
        this.smokeVolume += this.generateVolume;
    else if(this.stage==2){
        this.smokeVolume = Volume;
        this.exhaustVolume += exhuastVolume;
    }
    if(this.smokeVolume > this.V)
        this.stage = 3;



    if(this.stage==1){

    }
    else if(this.stage==2){
        //烟气沉积阶段，计算烟气厚度
        this.smokeh = this.smokeVolume / this.S;
    }else if(this.stage==3){
        //烟雾满仓阶段，生成的烟雾全部输出到其他楼层

    }

}

SmokeFloor.prototype.cloudSwitch = function(_this){
    this.smokeBayArr.forEach(function(smokeBay){
        smokeBay.jetSmokeArr.forEach(function(jetSmoke){
            jetSmoke.objs.forEach(function(obj){
                obj.instance.getMesh().geometry.dispose();
                obj.instance.getMesh().material.dispose();
                _this.scene.remove(obj.instance.getMesh());
            })
        })
    });

}

SmokeFloor.prototype.update = function(dt,_this){
    if(this.isFire)
        this.compute(dt,_this);
    //对火焰进行更新

    if(this.stage!=0)
    {
        //从火源所在防火分区开始遍历所有防火分区，调用其update方法
        var arr = [];
        this.smokeBayArr.forEach(function(item){
            item.inArr=false;
        })
        arr.push(this.smokeBayArr[this.fireBayIndex]);
        this.smokeBayArr[this.fireBayIndex].inArr = true;
        while(arr.length>0)
        {
            arr[0].neiborBay.forEach(function(smokeBay){
                if(smokeBay && !smokeBay.inArr)
                    arr.push(smokeBay);
            })
            arr[0].update(this,dt,_this);
            arr.shift();
        }
    }


}


var SmokeBay = function(){
    //初始化时要设置的值
    //防烟分区坐标范围
    this.xmin = 0;
    this.xmax = 0;
    this.ymin = 0;
    this.ymax = 0;
    this.zmin = 0;
    this.zmax = 0;
    this.jetH = 1.7;
    this.h = 0;
    this.S = 0;
    this.V = 0;
    this.hCS = 0.5;//挡烟垂壁高度，单位m

    this.xstep = 0;
    this.zstep = 0;
    this.smokeUnitArr = [];//烟气单元数组
    this.inPos = [];//输入烟气点

    this.jointArr = [];//连接处
    this.jointUnitNum = 0;//总连接点单元数
    this.unitJetVolume = 0;//单元射流烟雾量

    this.neiborBay = [];//相邻防烟分区 0 xlast 1 xnext 2 zlast 3 znext
    this.neiborBayNum = 0;

    //烟雾层高度是否正常
    this.isRegular = false;


    //着火时有烟气输入时设置的值
    this.isFire = false;//是否是着火点所在区域
    this.isFloor = false;//是否在着火点所在楼层
    this.maxr = 0;//这一防火分区r最大值

    this.indexArr = [];

    //有烟气输入时设置的值
    this.inBayIndex = -1;//输入烟气的防烟分区下标
    this.jetSmokeArr = [];

    //着火过程中实时计算并更新的值
    this.smokeVolume = [];//该防烟分区新产生/进入的烟气量
    this.sumVolume = 0;//该防烟分区此时刻总烟气量
    this.smoker = 0;
    this.smokeh = 0;
    this.smokev = 0;

    this.jetOutVolume = 0;//顶棚射流阶段输出烟雾量

    this.inArr = false;//是否在floor的arr里

    //用户实时设置的值
    this.exhaustVel = 0;//排烟速度
}

SmokeBay.prototype.init = function(xmin,xmax,ymin,ymax,zmin,zmax,xstep,zstep){
    this.xmin = xmin;
    this.xmax = xmax;
    this.ymin = ymin;
    this.ymax = ymax;
    this.zmin = zmin;
    this.zmax = zmax;
    this.xstep = xstep;
    this.zstep = zstep;
    this.h = this.ymax - this.ymin;
    this.S = (this.xmax-this.xmin) * (this.zmax-this.zmin);
    this.V = this.S * this.h;
    this.unitJetVolume = xstep * zstep * this.jetH;
    this.inPos[0] = new THREE.Vector3(xmin,ymax,(zmin+zmax)/2);
    this.inPos[1] = new THREE.Vector3(xmax,ymax,(zmin+zmax)/2);
    this.inPos[2] = new THREE.Vector3((xmin+xmax)/2,ymax,zmin);
    this.inPos[3] = new THREE.Vector3((xmin+xmax)/2,ymax,zmax);
    var smokeUnit = null;
    for(let i=0;i<(this.xmax-this.xmin)/xstep;++i)
        for(let j=0;j<(this.zmax-this.zmin)/zstep;++j)
        {
            smokeUnit = new SmokeUnit();
            smokeUnit.pos.set(this.xmin+(i+0.5)*xstep, this.ymax, this.zmin+(j+0.5)*zstep);
            smokeUnit.i = i;
            smokeUnit.j = j;
            smokeUnit.S = xstep * zstep;
            this.smokeUnitArr.push(smokeUnit);
        }
    for(let i=0;i<this.jointArr.length;++i)
    {
        this.rankByDistance(this.jointArr[i].Pos.x,this.jointArr[i].Pos.z);
    }


}

SmokeBay.prototype.getVolume = function(smokeFloor,dt,_this){
    if(this.isFloor)
    {
        if(this.isFire)
        {
            var exhaustVolume = this.exhaustVel * this.S * dt / 60 * this.sumVolume / this.V;
            this.sumVolume += smokeFloor.generateVolume - exhaustVolume;
            if(this.sumVolume>0){
                smokeFloor.smokeVolume = smokeFloor.smokeVolume - exhaustVolume;
                smokeFloor.exhaustVolume += exhaustVolume;
            }
            else{
                smokeFloor.smokeVolume = smokeFloor.smokeVolume - smokeFloor.generateVolume;
                smokeFloor.exhaustVolume += exhaustVolume;
            }

            this.sumVolume = this.sumVolume>0 ? this.sumVolume : 0;
            //console.log(smokeFloor.generateVolume);
            //console.log(this.exhaustVel);
            //console.log(this.S);
        }
        else{
            if(this.inBayIndex == -1)
            {
                for(let i=0;i<this.neiborBay.length;++i)
                {
                    if(this.neiborBay[i] && this.neiborBay[i].jetOutVolume>0)
                    {
                        this.inBayIndex = i;
                        this.jetSmokeArr.push(new smokeControl());
                        this.jetSmokeArr[0].init(this.inPos[i],i,this,_this);
                        if(i==0 || i==1)
                            this.maxr = this.xmax-this.xmin;
                        if(i==2 || i==3)
                            this.maxr = this.zmax-this.zmin;
                        //设置烟气单元的最大最小r
                        for(let j=0;j<this.smokeUnitArr.length;++j)
                        {
                            if(i==0 || i==1)
                            {
                                this.smokeUnitArr[j].maxr = Math.abs(this.smokeUnitArr[j].pos.x-this.inPos[i].x) + this.xstep/2;
                                this.smokeUnitArr[j].minr = this.smokeUnitArr[j].maxr - this.xstep;
                            }
                            if(i==2 || i==3)
                            {
                                this.smokeUnitArr[j].maxr = Math.abs(this.smokeUnitArr[j].pos.z-this.inPos[i].z) + this.zstep/2;
                                this.smokeUnitArr[j].minr = this.smokeUnitArr[j].maxr - this.zstep;
                            }
                        }
                    }
                }
            }
            if(this.inBayIndex >=0)
            {
                var exhaustVolume = this.exhaustVel * this.S * dt / 60 * this.sumVolume / this.V;
                this.sumVolume += this.neiborBay[this.inBayIndex].jetOutVolume - exhaustVolume;
                if(this.sumVolume>0){
                    smokeFloor.smokeVolume = smokeFloor.smokeVolume - exhaustVolume;
                    smokeFloor.exhaustVolume += exhaustVolume;
                }
                else{
                    smokeFloor.smokeVolume = smokeFloor.smokeVolume - this.neiborBay[this.inBayIndex].jetOutVolume;
                    smokeFloor.exhaustVolume += exhaustVolume;
                }

                this.sumVolume = this.sumVolume>0 ? this.sumVolume : 0;
            }
        }
    }
    else{
        var Volume = [];
        var i,j;
        for(i=0; i<this.jointArr.length; ++i)
        {
            if(this.jointArr[i].smokeVolume > 0 && this.jointArr[i].direction == 1)
            {
                Volume[i] = this.jointArr[i].smokeVolume;
            }
        }
        for(j=0;j<fireVolume.length;++j)
        {
            Volume[i+j] = fireVolume[j];
        }
        return Volume;
    }


};

/*SmokeBay.prototype.compute = function(dt,volume){
    this.sumVolume = 0;
    var addVolume = [];

    for(let i=0; i<volume.length; ++i)
    {
        addVolume[i] = volume[i] - this.exhaustVel * this.S * dt / 60 / volume.length;
        this.smokeVolume[i] += addVolume[i];
        if(this.smokeVolume[i] < 0)
            this.smokeVolume[i] = 0;
        this.sumVolume +=  this.smokeVolume[i];
    }


    //连接点计算
    if(this.sumVolume > 0)
    {
        if(this.sumVolume>this.V)
        {
            var num=0;
            for(let i=0;i<this.jointArr.length;++i)
            {
                if(this.jointArr[i].direction == 0)
                    num += this.jointArr[i].smokeUnitArr.length;
            }
            var unitVolume = (this.sumVolume - this.V) / num;
            var index;
            for(let i=0;i<this.jointArr.length;++i)
            {
                if(this.jointArr[i].direction == 0)
                {
                    if(this.jointArr[i].joint.direction == 0)
                        this.jointArr[i].joint.direction = 1;
                    this.jointArr[i].joint.smokeVolume = 0;
                    for(let j=0;j<this.jointArr[i].length;++j)
                    {
                        index = this.jointArr[i].smokeUnitArr[j].index;
                        this.jointArr[i].joint.smokeVolume += unitVolume;
                        this.smokeVolume[index] = this.smokeVolume[index] - unitVolume;
                    }
                }

            }
        }
        else{
            var num = [];
            var unitVolume = [];
            var index;
            //计算各烟气范围内连接单元数量
            for(let i=0;i<this.jointArr.length;++i)
            {
                if(this.jointArr[i].direction==0)
                {
                    for(let j=0;j<this.jointArr[i].length;++j)
                    {
                        if(this.jointArr[i].smokeUnitArr[j].h >= this.jetH)
                        {
                            index = this.jointArr[i].smokeUnitArr[j].index;
                            num[index] += 1;
                        }
                    }
                }
            }
            //计算各烟气范围单元出烟量
            for(let i=0; i<addVolume.length; ++i)
                unitVolume[i] = addVolume[i] / num[i];
            //计算出风量
            var blowVolume = 0;
            for(let i=0;i<this.jointArr.length;++i)
            {
                if(this.jointArr[i].direction==0)
                {
                    for(let j=0;j<this.jointArr[i].length;++j)
                    {
                        index = this.jointArr[i].smokeUnitArr[j].index;
                        blowVolume = unitVolume[index] - this.jointArr[i].smokeUnitArr[j].S * this.jointArr[i].windSpeed * dt;
                        if(blowVolume>0)
                        {
                            if(this.jointArr[i].joint.direction == 0)
                                this.jointArr[i].joint.direction = 1;
                            this.jointArr[i].joint.smokeVolume += blowVolume;
                            this.smokeVolume[index] = this.smokeVolume[index] - blowVolume;
                        }
                    }
                }
            }
        }


        this.computeH();
    }


}*/

SmokeBay.prototype.compute = function(smokeFloor,dt){
    if(this.sumVolume<=0)
    {
        this.smokeh = 0;
    }
    if(this.smoker<this.maxr)
    {
        //顶棚射流阶段，计算顶棚射流速
        /*if(this.isFire && smokeFloor.isInTurning)
            this.smokev = 0.96 * Math.pow(smokeFloor.fire.Qc/(smokeFloor.fire.Zh-smokeFloor.fire.Zv)/smokeFloor.fire.QcFactor,1/3);
        else if(this.isFire)
            this.smokev = 0.195 * Math.pow(smokeFloor.fire.Qc/(smokeFloor.fire.Zh-smokeFloor.fire.Zv)/smokeFloor.fire.QcFactor,1/3) / Math.pow(this.smoker/(smokeFloor.fire.Zh-smokeFloor.fire.Zv),5/6);
        else
        {
            var r = 0;
            if(this.inBayIndex==0 || this.inBayIndex == 1)
                r = Math.abs(this.inPos[this.inBayIndex].x - smokeFloor.firePos.x) + this.smoker;
            if(this.inBayIndex==2 || this.inBayIndex == 3)
                r = Math.abs(this.inPos[this.inBayIndex].z - smokeFloor.firePos.z) + this.smoker;
            this.smokev = 0.195 * Math.pow(smokeFloor.fire.Qc/(smokeFloor.fire.Zh-smokeFloor.fire.Zv)/smokeFloor.fire.QcFactor,1/3) / Math.pow(r/(smokeFloor.fire.Zh-smokeFloor.fire.Zv),5/6);
        }*/
        this.smokev = 0.6;

        this.smoker += this.smokev * dt;
        //console.log(this.smokev);

    }

    //console.log("Q: ",smokeFloor.fire.Q);
    //console.log("B: ",smokeFloor.fire.B);
    //console.log("Vy: ",smokeFloor.Vy);
    //console.log("smokev: ",this.smokev);
    //console.log("smoker: ",this.smoker);

    if(this.isFire)
    {
        //是否在火羽流转向区内
        if(smokeFloor.isInTurning && this.smoker>0.15*(smokeFloor.fire.Zh-smokeFloor.fire.Zv))
            smokeFloor.isInTurning = false;
        //是否全覆盖
        if(this.smoker<this.maxr)
        {
            //是
            //计算顶棚射流烟气厚度
            var xProp = (Math.min(this.smoker,smokeFloor.firePos.x-this.xmin)+Math.min(this.smoker,this.xmax-smokeFloor.firePos.x)) / (this.xmax-this.xmin);
            var zProp = (Math.min(this.smoker,smokeFloor.firePos.z-this.zmin)+Math.min(this.smoker,this.zmax-smokeFloor.firePos.z)) / (this.zmax-this.zmin);
            this.smokeh = this.sumVolume / (xProp * zProp * this.S);
        }
        else{
            //计算烟雾厚度
            this.smokeh = this.sumVolume / this.S;
            //是否溢出
            if(this.smokeh>this.hCS)
            {
                this.smokeh = this.hCS;
                this.jetOutVolume = (this.sumVolume - this.S * this.hCS) / this.neiborBayNum;
                this.sumVolume = this.S * this.hCS;
            }
        }
    }
    else{
        if(this.smoker<this.maxr)
            this.smokeh = this.sumVolume * this.maxr / this.smoker / this.S;
        else{
            //计算烟雾厚度
            this.smokeh = this.sumVolume / this.S;
            //是否溢出
            if(this.smokeh>this.hCS)
            {
                this.smokeh = this.hCS;
                this.jetOutVolume = (this.sumVolume - this.S * this.hCS) / (this.neiborBayNum-1);
                this.sumVolume = this.S * this.hCS;
            }
        }
    }
    //楼梯口的烟雾蔓延情况
}

SmokeBay.prototype.computeH = function(){
    var unit = this.sumVolume / this.unitJetVolume;
    if(unit<=this.smokeUnitArr.length)
    {
        for(let index=0; index<this.smokeVolume.length; ++index)
        {
            unit = this.smokeVolume[index] / this.unitJetVolume;
            var i =0,j=0;
            while(i < unit-1)
            {
                if(this.smokeUnitArr[this.indexArr[index][j].index].index == index)
                    ++i;
                ++j;
            }
            while(this.smokeUnitArr[this.indexArr[index][j].index].index != index && this.smokeUnitArr[this.indexArr[index][j].index].index != -1)
            {
                ++j
            }
            this.smokeUnitArr[this.indexArr[index][j].index].h = (unit - i) * 1.7;
        }
    }
    else if(this.sumVolume<this.V)
    {
        var h = this.sumVolume / this.S;
        this.smokeUnitArr.forEach(function(item){
            item.h = h;
        })
    }
    else
    {

    }

}

SmokeBay.prototype.rankByDistance = function(x,z)
{
    var index = [];
    for(let i=0;i<this.smokeUnitArr.length;++i)
    {
        index[i] = {r:Math.pow(Math.pow(this.smokeUnitArr[i].pos.x-x,2)+Math.pow(this.smokeUnitArr[i].pos.z-z,2),1/2),
                    index:i};
    }
    index.sort(function(x,y){
        if(x.r < y.r)
            return -1;
        if(x.r > y.r)
            return 1;
        return 0;
    })
    this.indexArr.push(index);
}

SmokeBay.prototype.setJetSmoke = function(firePos){
    var h = this.smokeh;
    if(!this.isRegular){
        if(this.smokeh>0.5)
            h = 0.5;
        else
            this.isRegular = true;
    }
    if(this.isFire){
        if(this.xmax-this.xmin>this.zmax-this.zmin){
            var lr = Math.min(this.smoker,firePos.x-this.xmin);
            var rr = Math.min(this.smoker,this.xmax - firePos.x);
        }else{
            var lr = Math.min(this.smoker,firePos.z-this.zmin);
            var rr = Math.min(this.smoker,this.zmax - firePos.z);
        }
        this.jetSmokeArr[0].FLOATING_INTERVAL = lr / smokeAnimation.velocity * 20;
        this.jetSmokeArr[1].FLOATING_INTERVAL = rr / smokeAnimation.velocity * 20;

        /*this.jetSmokeArr[0].h = Math.max(this.smokeh ,0.5) * smokeAnimation.scaleFactor;
        this.jetSmokeArr[1].h = Math.max(this.smokeh ,0.5) * smokeAnimation.scaleFactor;*/
        this.jetSmokeArr[0].h = h * smokeAnimation.scaleFactor;
        this.jetSmokeArr[1].h = h * smokeAnimation.scaleFactor;
    }else{
        this.jetSmokeArr[0].FLOATING_INTERVAL = this.smoker / smokeAnimation.velocity * 20;
        //this.jetSmokeArr[0].h = Math.max(this.smokeh ,0.5) * smokeAnimation.scaleFactor;
        this.jetSmokeArr[0].h = h * smokeAnimation.scaleFactor;
    }
}

SmokeBay.prototype.update = function(smokeFloor,dt,_this){
    var self = this;
    if(this.isFloor)
    {
        if(smokeFloor.stage==1)
        {
            this.getVolume(smokeFloor,dt,_this);
            //console.log(this.sumVolume);
            if(this.sumVolume>0)
            {
                this.compute(smokeFloor,dt);
            }
        }
        if(smokeFloor.stage==2)
        {
            this.smokeh = smokeFloor.smokeh;
        }
        //console.log(this.smokeh);
        //console.log(this.smoker);
        if(this.smokeh>0)
        {
            if(smokeFloor.stage==1){
                this.setJetSmoke(smokeFloor.firePos);
                this.jetSmokeArr.forEach(jet=>jet.update(20));
                //this.smokeUnitArr.forEach(smokeUnit=>smokeUnit.update(self,smokeFloor.stage,_this));
            }else{
                for(let i=0;i<this.smokeUnitArr.length;++i)
                    this.smokeUnitArr[i].update(this,smokeFloor.stage,_this);
                //if(!this.isFire)
                //console.log(this.smokeUnitArr);
            }

        }




    }
    else{
        /*var Volume;
        if(arguments.length>0)
            Volume = this.getVolume(arguments[0]);
        else
            Volume = this.getVolume([]);
        this.compute();
        this.smokeUnitArr.forEach(function(item){
            item.update();
        })*/
    }


}

var SmokeUnit = function()
{
    this.h = 0;
    this.opacity = 0;
    this.cloudArr = [];
    this.pos = new THREE.Vector3(0,0,0);
    this.r = 0;//与火源点的距离
    this.minr = 0;//与烟源点最近距离
    this.maxr = 0;//与烟源点最远距离
    this.i = 0;
    this.j = 0;
    this.index = -1;
    this.S = 0;
};

SmokeUnit.prototype.createCloud = function(_this){
    var material = new THREE.ShaderMaterial({
        uniforms: {
            time: {
                type: "f",
                value: 0.0
            },
            seed: {
                type: 'f',
                value: Math.random() * 1000.0
            },
            detail: {
                type: 'f',
                value: Math.random() * 3.5 + 5
            },
            opacity: {
                type: 'f',
                value: 1
            },
            colLight: {
                value: Utils.hexToVec3('#000000')
            },
            colNormal: {
                value: Utils.hexToVec3('#8e8e8e')
            },
            colDark: {
                value: Utils.hexToVec3('#f7a90e')
            }
        },
        vertexShader: vertexFlameShader,
        fragmentShader: fragmentFlameShader,
        transparent: true
    });
    var geometry = new THREE.IcosahedronGeometry(Math.random()*5+8, 3);
    var cloud = new THREE.Group();
    for(var i=0;i<3;i++){
        for(var j=0;j<3;j++)
        {
            //创建烟雾片
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(-1.7+i*1.7,0,-1.7+j*1.7);
            mesh.scale.set(0.15,1,0.15);
            mesh.material.uniforms['opacity'].value = 0.7;
            //将烟雾片一片片加入到geom中
            cloud.add(mesh);
        }
        //创建烟雾片
        //var particle=new THREE.Vector3(Math.random()*6-6/2,0,Math.random()*6-6/2);
        //将烟雾片一片片加入到geom中
        //geom.vertices.push(particle);
    }
    cloud.scale.setY(this.h * smokeAnimation.scaleFactor + 0.01);
    cloud.position.set(this.pos.x,this.pos.y-this.h/2,this.pos.z);
    _this.scene.add(cloud);
    this.cloudArr.push(cloud);
}

SmokeUnit.prototype.update = function(smokeBay,stage,_this)
{
    var self = this;
    this.h = smokeBay.smokeh;
    if(this.h>0 && !this.cloudArr[0])
        this.createCloud(_this);
    if(this.cloudArr[0])
    {
        //smoke.step += 0.00005;
        this.cloudArr[0].rotation.y += _this.smoke.step;
        this.cloudArr[0].scale.setY(this.h * smokeAnimation.scaleFactor);
        this.cloudArr[0].position.setY(this.pos.y-this.h/2);
        /*this.cloudArr[0].children.forEach(function(cloud){
            cloud.scale.setY(this.h * smokeAnimation.scaleFactor);
        })*/
    }
    /*if(this.h>smokeBay.jetH && this.h<smokeBay.h)
    {
        if(!this.cloudArr[1])
        {
            this.createCloud(_this);
            this.cloudArr[1].children.forEach(function(material){
                material.opacity = self.opacity;
            })
        }
        this.cloudArr[1].position.y = this.pos.y+1.7-this.h;
    }
    if(this.cloudArr[1])
    {
        //smoke.step += 0.00005;
        this.cloudArr[1].rotation.y += _this.smoke.step;
    }*/
}

var SmokeJoint = function()
{
    this.smokeUnitArr = [];
    this.joint = null;
    this.Pos = new THREE.Vector3(0,0,0);
    this.direction = 0;//0表示出烟，1表示进烟
    this.windSpeed = 1.5;
    this.S = 0;
    this.smokeVolume = 0;
}