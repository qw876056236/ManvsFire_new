var mainscene = function() {
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;

}

mainscene.prototype.init = function(){
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000000);
    this.camera.position.set(10,0,0);
    this.camera.lookAt(new THREE.Vector3(1,1,1));
    this.playerControl=new PlayerControl(this);//通过鼠标键盘或者手机触屏控制相机
    this.playerControl.init();

    var geometry1 = new THREE.BoxGeometry(100, 100, 100); //创建一个立方体几何对象Geometry
    var material1 = new THREE.MeshLambertMaterial({
        color: 0x0000ff
    }); //材质对象Material
    var mesh1 = new THREE.Mesh(geometry1, material1); //网格模型对象Mesh
    this.scene.add(mesh1);

    var Pic = function() {
        var canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 128;
        var c = canvas.getContext("2d");
        // 矩形区域填充背景
        c.fillStyle = "#b3b3b3";
        c.fillRect(0, 0, 512, 128);
        c.beginPath();

        //箭头
        c.fillStyle = "#00FF00";
        c.beginPath();
        c.moveTo(60,34);
        c.lineTo(30,64);
        c.lineTo(60,94);
        c.lineTo(60,84);
        c.lineTo(110,84);
        c.lineTo(110,84);
        c.lineTo(110,44);
        c.lineTo(60,44);
        c.fill();

        c.fillStyle = "#00FF00";
        c.beginPath();
        c.moveTo(452,34);
        c.lineTo(482,64);
        c.lineTo(452,94);
        c.lineTo(452,84);
        c.lineTo(402,84);
        c.lineTo(402,84);
        c.lineTo(402,44);
        c.lineTo(452,44);
        c.fill();

        // 文字
        c.beginPath();
        c.translate(256,40);
        c.fillStyle = "#00FF00"; //文本填充颜色
        c.font = "bold 48px 黑体"; //字体样式设置
        c.font
        c.textBaseline = "middle"; //文本与fillText定义的纵坐标
        c.textAlign = "center"; //文本居中(以fillText定义的横坐标)
        c.fillText("安全出口", 0, 0);
        c.fillText("EXIT", 0, 50);

        //document.body.appendChild(canvas);

        var texture = new THREE.CanvasTexture(canvas);
        //打印纹理对象的image属性
        console.log(texture.image);
        //矩形平面
        var geometry = new THREE.PlaneGeometry(128, 32);
        var material = new THREE.MeshBasicMaterial({
            map: texture, // 设置纹理贴图
        });
        // 创建一个矩形平面网模型，Canvas画布作为矩形网格模型的纹理贴图
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(100,100,100);
        mesh.rotation.set(0,Math.PI*0.5,0);
        this.scene.add(mesh);
    }
}





//Pic(mainscene);