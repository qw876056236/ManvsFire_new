var NSsmoke = function()
{
    this.unitx = 1.2;
    this.unity = 0.5;
    this.unitz = 2;
    this.lengthx = 5;
    this.lengthy = 5;
    this.lengthz = 35;
    this.v = 10.0;//粘性系数
    this.times = 2;//迭代次数，最好为偶数
    this.delta = 1;
    this.kk = 0;
    this.offset = {x:412.3, y:45.9, z:40};
    this.initPos = {x: 415.4, y:47, z:50};
    this.smokeTexture = new THREE.TextureLoader().load('textures/NSsmoke-Element.png');
    this.grid = [];
    this.vel = [];
    this.pre = [];
    this.temppre = [];
    this.den = [];
    this.tempvel = [];
    this.addvel = [];
    this.cloud = [];
    this.state = [];
};

NSsmoke.prototype.init = function()
{
    for(let i=0; i<this.lengthx; ++i)
        for(let j=0; j<this.lengthy; ++j)
            for(let k=0; k<this.lengthz; ++k)
            {
                var index = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                this.grid[index] = {x:(1/2 + i)*this.unitx, y:(1/2 + j)*this.unity, z:(1/2 + k)*this.unitz};
                this.vel[index] = {u:0, v:0, w:0};
                this.pre[index] = 0;
                this.temppre[index] = 0;
                this.den[index] = 0;
                this.cloud[index] = null;
                if(i==0 || i==this.lengthx-1 || j==0 || j==this.lengthy-1 || k==0 || k==this.lengthz-1)
                    this.state[index] = 1;
                else
                    this.state[index] = 0;
            }
    var i = Math.floor((this.initPos.x-this.offset.x) / this.unitx);
    var j = Math.floor((this.initPos.y-this.offset.y) / this.unity);
    var k = Math.floor((this.initPos.z-this.offset.z) / this.unitz);
    var index = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;
    this.den[index] = 10;
    this.vel[index] = {u: 1, v:1, w:0};
    //this.pre[index] = 10;
    //console.log(index);
    //console.log(this.den[425]);
    //console.log(this.grid[426].x + " "+this.grid[426].y+""+this.grid[426].z);
};

NSsmoke.prototype.advect = function()//平流方程
{
    //console.log("tempvel");
    for(let i=0; i<this.lengthx; ++i)
        for(let j=0; j<this.lengthy; ++j)
            for(let k=0; k<this.lengthz; ++k)
            {

                var index = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                var tempx = this.grid[index].x - this.vel[index].u * this.delta;
                var tempy = this.grid[index].y - this.vel[index].v * this.delta;
                var tempz = this.grid[index].z - this.vel[index].w * this.delta;
                this.tempvel[index] = this.inter(tempx,tempy,tempz,"v");
                this.addvel[index] = {u:this.tempvel[index].u - this.vel[index].u, v:this.tempvel[index].v - this.vel[index].v, w:this.tempvel[index].w - this.vel[index].w};
                //if(this.tempvel[index].u || this.tempvel[index].v ||this.tempvel[index].w)
                    //console.log(i+" "+j+" "+k+" "+this.tempvel[index].u+" "+this.tempvel[index].v+" "+this.tempvel[index].w);
            }
};

NSsmoke.prototype.inter = function(x, y, z, state)//插值
{
    var i = Math.floor(x / this.unitx + 0.5);
    var j = Math.floor(y / this.unity + 0.5);
    var k = Math.floor(z / this.unitz + 0.5);
    if(i>0 && i<this.lengthx && j>0 && j<this.lengthy && k>0 && k<this.lengthz)
    {

        var index1 = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;
        var index2 = i*(this.lengthy*this.lengthz) + j*this.lengthz + k-1;
        var index3 = i*(this.lengthy*this.lengthz) + (j-1)*this.lengthz + k;
        var index4 = i*(this.lengthy*this.lengthz) + (j-1)*this.lengthz + k-1;
        var index5 = (i-1)*(this.lengthy*this.lengthz) + j*this.lengthz + k;
        var index6 = (i-1)*(this.lengthy*this.lengthz) + j*this.lengthz + k-1;
        var index7 = (i-1)*(this.lengthy*this.lengthz) + (j-1)*this.lengthz + k;
        var index8 = (i-1)*(this.lengthy*this.lengthz) + (j-1)*this.lengthz + k-1;
        var kx = (this.grid[index1].x - x) / this.unitx;
        var ky = (this.grid[index1].y - y) / this.unity;
        var kz = (this.grid[index1].z - z) / this.unitz;
        var w1 = (1-kx)*(1-ky)*(1-kz);
        var w2 = (1-kx)*(1-ky)*kz;
        var w3 = (1-kx)*ky*(1-kz);
        var w4 = (1-kx)*ky*kz;
        var w5 = kx*(1-ky)*(1-kz);
        var w6 = kx*(1-ky)*kz;
        var w7 = kx*ky*(1-kz);
        var w8 = kx*ky*kz;
        switch (state)
        {
            case "v" : return {
                u : w1*this.vel[index1].u + w2*this.vel[index2].u + w3*this.vel[index3].u + w4*this.vel[index4].u + w5*this.vel[index5].u + w6*this.vel[index6].u + w7*this.vel[index7].u + w8*this.vel[index8].u,
                v : w1*this.vel[index1].v + w2*this.vel[index2].v + w3*this.vel[index3].v + w4*this.vel[index4].v + w5*this.vel[index5].v + w6*this.vel[index6].v + w7*this.vel[index7].v + w8*this.vel[index8].v,
                w : w1*this.vel[index1].w + w2*this.vel[index2].w + w3*this.vel[index3].w + w4*this.vel[index4].w + w5*this.vel[index5].w + w6*this.vel[index6].w + w7*this.vel[index7].w + w8*this.vel[index8].w
            };
                break;
            case "d" : return w1*this.den[index1] + w2*this.den[index2] + w3*this.den[index3] + w4*this.den[index4] + w5*this.den[index5] + w6*this.den[index6] + w7*this.den[index7] + w8*this.den[index8];
        }
    }
    else
    {
        switch (state)
        {
            case "v" : return {u:0, v:0, w:0};
                break;
            case "d" : var index = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                return this.den[index] ? this.den[index] : 0;
        }
    }


};

NSsmoke.prototype.force = function()//外力项
{

};

NSsmoke.prototype.diffuse = function()//扩散方程
{
    //console.log("diffuse");
    var dx = this.delta * this.v / this.unitx / this.unitx;
    var dy = this.delta * this.v / this.unity / this.unity;
    var dz = this.delta * this.v / this.unitz / this.unitz;
    var newvel = [];
    for(let i=0; i<this.lengthx; ++i)
        for(let j=0; j<this.lengthy; ++j)
            for(let k=0; k<this.lengthz; ++k)
            {
                var index = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                this.tempvel[index] = this.vel[index];
                newvel[index] = this.vel[index];
            }
    for(var time=0;time<this.times;++time)
    {
        for(let i=0; i<this.lengthx; ++i)
            for(let j=0; j<this.lengthy; ++j)
                for(let k=0; k<this.lengthz; ++k)
                {
                    var index = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                    if(!this.state[index])
                    {
                        var index1 = (i-1)*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                        var index2 = (i+1)*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                        var index3 = i*(this.lengthy*this.lengthz) + (j-1)*this.lengthz + k;
                        var index4 = i*(this.lengthy*this.lengthz) + (j+1)*this.lengthz + k;
                        var index5 = i*(this.lengthy*this.lengthz) + j*this.lengthz + k-1;
                        var index6 = i*(this.lengthy*this.lengthz) + j*this.lengthz + k+1;
                        if(time%2==0)
                        {
                            newvel[index].u = (this.vel[index].u + dx*(this.tempvel[index1].u+this.tempvel[index2].u) + dy*(this.tempvel[index3].u+this.tempvel[index4].u) + dz*(this.tempvel[index5].u+this.tempvel[index6].u)) / (1+2*(dx+dy+dz));
                            newvel[index].v = (this.vel[index].v + dx*(this.tempvel[index1].v+this.tempvel[index2].v) + dy*(this.tempvel[index3].v+this.tempvel[index4].v) + dz*(this.tempvel[index5].v+this.tempvel[index6].v)) / (1+2*(dx+dy+dz));
                            newvel[index].w = (this.vel[index].w + dx*(this.tempvel[index1].w+this.tempvel[index2].w) + dy*(this.tempvel[index3].w+this.tempvel[index4].w) + dz*(this.tempvel[index5].w+this.tempvel[index6].w)) / (1+2*(dx+dy+dz));
                        }
                        else
                        {
                            this.tempvel[index].u = (this.vel[index].u + dx*(newvel[index1].u+newvel[index2].u) + dy*(newvel[index3].u+newvel[index4].u) + dz*(newvel[index5].u+newvel[index6].u)) / (1+2*(dx+dy+dz));
                            this.tempvel[index].v = (this.vel[index].v + dx*(newvel[index1].v+newvel[index2].v) + dy*(newvel[index3].v+newvel[index4].v) + dz*(newvel[index5].v+newvel[index6].v)) / (1+2*(dx+dy+dz));
                            this.tempvel[index].w = (this.vel[index].w + dx*(newvel[index1].w+newvel[index2].w) + dy*(newvel[index3].w+newvel[index4].w) + dz*(newvel[index5].w+newvel[index6].w)) / (1+2*(dx+dy+dz));
                        }
                        this.addvel[index] = {u:this.addvel[index].u+this.tempvel[index].u-this.vel[index].u, v:this.addvel[index].v+this.tempvel[index].v-this.vel[index].v, w:this.addvel[index].w+this.tempvel[index].w-this.vel[index].w};
                        //if(this.tempvel[index].u || this.tempvel[index].v ||this.tempvel[index].w)
                            //console.log(i+" "+j+" "+k+" "+this.tempvel[index].u+" "+this.tempvel[index].v+" "+this.tempvel[index].w);
                    }
                }
    }

    //console.log(this.tempvel);
    //console.log(this.den[425]);
};

NSsmoke.prototype.poisson = function()//泊松方程
{
    console.log("poision");
    var c1 = this.unity * this.unity * this.unitz * this.unitz;
    var c2 = this.unitx * this.unitx * this.unitz * this.unitz;
    var c3 = this.unitx * this.unitx * this.unity * this.unity;
    var c4 = c3 * this.unitz * this.unitz;
    var du = [];
    var index = 0,index1 = 0,index2 =0,index3 =0,index4 =0,index5 =0,index6 = 0;


    for(var time=0;time<this.times;++time)
    {
        for(let i=0; i<this.lengthx; ++i)
            for(let j=0; j<this.lengthy; ++j)
                for(let k=0; k<this.lengthz; ++k)
                {
                    index = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;

                    if(!this.state[index])
                    {
                        index1 = (i-1)*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                        index2 = (i+1)*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                        index3 = i*(this.lengthy*this.lengthz) + (j-1)*this.lengthz + k;
                        index4 = i*(this.lengthy*this.lengthz) + (j+1)*this.lengthz + k;
                        index5 = i*(this.lengthy*this.lengthz) + j*this.lengthz + k-1;
                        index6 = i*(this.lengthy*this.lengthz) + j*this.lengthz + k+1;
                        if(!time)
                            du[index] = (this.vel[index2].u - this.vel[index1].u) / (2 * this.unitx)
                                       +(this.vel[index4].u - this.vel[index3].u) / (2 * this.unity)
                                       +(this.vel[index6].u - this.vel[index5].u) / (2 * this.unitz);
                        if(time%2==0)
                        {
                            this.temppre[index] = ((this.pre[index1] + this.pre[index2])*c1 + (this.pre[index3] + this.pre[index4])*c2 + (this.pre[index5] + this.pre[index6])*c3 - du[index]*c4) / (c1+c2+c3);

                        }
                        else
                        {
                            this.pre[index] = ((this.temppre[index1] + this.temppre[index2])*c1 + (this.temppre[index3] + this.temppre[index4])*c2 + (this.temppre[index5] + this.temppre[index6])*c3 - du[index]*c4) / (c1+c2+c3);
                        }
                    }
                }
    }
    console.log(this.pre);
};

NSsmoke.prototype.correction = function()//速度修正方程
{
    var index =0,index1 =0,index2 =0,index3 =0,index4 =0,index5 =0,index6 =0;
    var dv = {u:0,v:0,w:0};
    for(let i=0; i<this.lengthx; ++i)
        for(let j=0; j<this.lengthy; ++j)
            for(let k=0; k<this.lengthz; ++k)
            {
                index = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                if(!this.state[index])
                {
                    index1 = (i-1)*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                    index2 = (i+1)*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                    index3 = i*(this.lengthy*this.lengthz) + (j-1)*this.lengthz + k;
                    index4 = i*(this.lengthy*this.lengthz) + (j+1)*this.lengthz + k;
                    index5 = i*(this.lengthy*this.lengthz) + j*this.lengthz + k-1;
                    index6 = i*(this.lengthy*this.lengthz) + j*this.lengthz + k+1;
                    dv.u = (this.pre[index1]-this.pre[index2]) / (2 * this.unitx);
                    dv.v = (this.pre[index3]-this.pre[index4]) / (2 * this.unity);
                    dv.u = (this.pre[index5]-this.pre[index6]) / (2 * this.unitz);
                    this.addvel[index] = {u:this.addvel[index].u+dv.u, v:this.addvel[index].v+dv.v, w:this.addvel[index].w+dv.w};
                }

            }

};

NSsmoke.prototype.density = function()
{
    //console.log("density");
    var newDen = [];
    for(let i=0; i<this.lengthx; ++i)
        for(let j=0; j<this.lengthy; ++j)
            for(let k=0; k<this.lengthz; ++k)
            {
                var index = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                var tempx = this.grid[index].x - this.vel[index].u * this.delta;
                var tempy = this.grid[index].y - this.vel[index].v * this.delta;
                var tempz = this.grid[index].z - this.vel[index].w * this.delta;
                //var ai = Math.floor(tempx / this.unitx + 0.5);
                //var aj = Math.floor(tempy / this.unity + 0.5);
                //var ak = Math.floor(tempz / this.unitz + 0.5);
                /*
                if((i==2||i==3)&&(j==2||j==3)&&(k==5||k==6))
                {
                    console.log(i+' '+j+' '+k);
                    console.log(ai+' '+aj+' '+ak);
                    console.log(this.grid[index].x+' '+this.grid[index].y+' '+this.grid[index].z);
                    console.log(tempx+' '+tempy+' '+tempz);
                    console.log(this.vel[index].u+' '+this.vel[index].v+' '+this.vel[index].w);
                    console.log(this.den[index]);
                }

                 */
                newDen[index] = this.inter(tempx,tempy,tempz,"d");
                //if((ai==2||ai==3)&&(aj==2||aj==3)&&(ak==5||ak==6))
                    //console.log("resule "+newDen[index]);
            }
    for(let i=0; i<this.lengthx; ++i)
        for(let j=0; j<this.lengthy; ++j)
            for(let k=0; k<this.lengthz; ++k)
            {
                var index = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                this.den[index] = newDen[index];
                //if(this.den[index])
                    //console.log(i+" "+j+" "+k+" "+this.den[index]);
            }

            //console.log(this.den[425]);
};

NSsmoke.prototype.render = function(_this)
{
    for(let i=0; i<this.lengthx; ++i)
        for(let j=0; j<this.lengthy; ++j)
            for(let k=0; k<this.lengthz; ++k)
            {
                var index = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                if(this.den[index] > 0)
                {
                    if(!this.cloud[index])
                        this.createCloud(index,_this);
                    this.cloud[index].material.opacity = this.den[index];
                }
            }
};

NSsmoke.prototype.createCloud = function (index, _this)
{
    var self = this;
    var geom=new THREE.Geometry();//创建烟雾团
    //创建烟雾素材
    var material=new THREE.PointsMaterial({
        size:2,
        transparent:true,
        opacity:0,
        map:self.smokeTexture,
        sizeAttenuation:true,
        depthWrite:false,
        color:0xffffff,
    });
    //var range=15;
    for(var i=0;i<2;i++){
        for(var j=0;j<2;j++)
        {
            //创建烟雾片
            var particle=new THREE.Vector3(-0.3+0.6*i+Math.random()*(Math.random()>0.5?1:-1),0,-0.5+1*j+Math.random()*(Math.random()>0.5?1:-1));
            //将烟雾片一片片加入到geom中
            geom.vertices.push(particle);
        }
        //创建烟雾片
        //var particle=new THREE.Vector3(Math.random()*6-6/2,0,Math.random()*6-6/2);
        //将烟雾片一片片加入到geom中
        //geom.vertices.push(particle);
    }
    //创建烟雾片
    //var particle=new THREE.Vector3(0,0,0);
    //将烟雾片一片片加入到geom中
    //geom.vertices.push(particle);
    var cloud=new THREE.Points(geom,material);
    _this.scene.add(cloud);
    cloud.position.set(self.grid[index].x+self.offset.x, self.grid[index].y+self.offset.y, self.grid[index].z+self.offset.z);
    self.cloud[index] = cloud;
};

NSsmoke.prototype.supple = function()
{
    var i = Math.floor((this.initPos.x-this.offset.x) / this.unitx);
    var j = Math.floor((this.initPos.y-this.offset.y) / this.unity);
    var k = Math.floor((this.initPos.z-this.offset.z) / this.unitz);
    var index = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;
    this.den[index] += 10;
    this.vel[index] = {u:1,v:1,w:1};
    //this.pre[index] = 10;
};

NSsmoke.prototype.update = function(_this)
{
    var self = this;
    if (Math.floor(_this.clock.getElapsedTime() + 1) % (self.kk + 1) == 0)
    {
        self.advect();
        self.force();
        self.diffuse();
        self.poisson();
        self.correction();
        for(let i=0; i<this.lengthx; ++i)
            for(let j=0; j<this.lengthy; ++j)
                for(let k=0; k<this.lengthz; ++k)
                {
                    var index = i*(this.lengthy*this.lengthz) + j*this.lengthz + k;
                    this.vel[index] = {u:this.vel[index].u+this.addvel[index].u, v:this.vel[index].v+this.addvel[index].v, w:this.vel[index].w+this.addvel[index].w};
                }
        self.density();
        self.render(_this);
        self.supple();
        ++self.kk;
        //console.log("update");
        //console.log(this.den[425]);
        //console.log(this.den);
        //console.log(this.vel);
        console.log(this.cloud);

    }

};