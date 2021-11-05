/*var video = document.createElement('video');
video.src = './textures/1.mp4'; // 设置视频地址
video.autoplay = "autoplay";
var smokeTexture = new THREE.VideoTexture(video)*/
smokeTexture = new THREE.TextureLoader().load('./textures/Smoke-Element.png');
var cloud = function () {
    this.material = null;
    this.mesh = null;
    //颜色就是指火球的三种状态，这三个颜色也会变化，不是固定的
    this.defaultColor = {
        colDark: '#000000',
        colNormal: '#f7a90e',
        colLight: '#ede92a'
    };
}

cloud.prototype.init = function (radius)
{
    //火球的生成
    /*this.material = new THREE.ShaderMaterial({
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
                value: Utils.hexToVec3(this.defaultColor.colLight)
            },
            colNormal: {
                value: Utils.hexToVec3(this.defaultColor.colNormal)
            },
            colDark: {
                value: Utils.hexToVec3(this.defaultColor.colDark)
            }
        },
        vertexShader: vertexFlameShader,
        fragmentShader: fragmentFlameShader,
        transparent: true
    });
    this.mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 3), this.material);
    this.mesh.position.set(0,0,0);*/
    var geom=new THREE.Geometry();//创建烟雾团
    //创建烟雾素材
    this.material=new THREE.SpriteMaterial({
        //size:6,
        transparent:true,
        opacity:0,
        map:smokeTexture,
        sizeAttenuation:true,
        depthWrite:false,
        color:0xffffff,
    });
    //geom.vertices.push(new THREE.Vector3(0,0,0));
    this.mesh=new THREE.Sprite(this.material);
    this.mesh.position.set(0,0,0);


}


cloud.prototype.setColor = function (prop)
{
    //给火球上色
    /*if (prop.colDark != null) {
        if (typeof prop.colDark === 'string') {
            this.material.uniforms['colDark'].value = Utils.hexToVec3(prop.colDark);
        }
        else {
            this.material.uniforms['colDark'].value = prop.colDark;
        }
    }
    if (prop.colNormal != null) {
        if (typeof prop.colNormal === 'string') {
            this.material.uniforms['colNormal'].value = Utils.hexToVec3(prop.colNormal);
        }
        else {
            this.material.uniforms['colNormal'].value = prop.colNormal;
        }
    }
    if (prop.colLight != null) {
        if (typeof prop.colLight === 'string') {
            this.material.uniforms['colLight'].value = Utils.hexToVec3(prop.colLight);
        }
        else {
            this.material.uniforms['colLight'].value = prop.colLight;
        }
    }*/
};

cloud.prototype.setOpacity = function (value) {
    //this.material.uniforms['opacity'].value = value;
    this.material.opacity = value;
};

cloud.prototype.setDetail = function (value) {
    //this.material.uniforms['detail'].value = value;
};

cloud.prototype.update = function (timeDiff) {
    //this.material.uniforms['time'].value += .0005 * timeDiff * this.flowRatio;
};

cloud.prototype.setFlowRatio = function (val) {
    //this.flowRatio = val;
};

cloud.prototype.getMesh = function () {
    return this.mesh;
};

