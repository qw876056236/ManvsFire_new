var Interaction = function ()
{
    this.currentFloor = "floor1";
    this.whetherrotate = false;

    this.SCREEN_WIDTH = window.innerWidth;
    this.SCREEN_HEIGHT = window.innerHeight;
    this.aspect = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
}
//交互部分

//视角控制
//todo 房屋加载
Interaction.prototype.fuc1 = function (_this)
{
    document.getElementById('escapeDoor1').addEventListener('click',function (event) {
        _this.camera.position.set(60,0,175);
        _this.freeViewControl.center.set(416,22,7);
        _this.camera.rotation.set(-2.8,0.7,2.9);
    });

    document.getElementById('escapeDoor2').addEventListener('click',function (event) {
        _this.camera.position.set(45,-2,265);
        _this.freeViewControl.center.set(554,22,46);
        _this.camera.rotation.set(-2.5,-1.1,-2.5);
    });
    document.getElementById('escapeDoor3').addEventListener('click',function (event) {
        _this.camera.position.set(51,5.6,305);
        _this.freeViewControl.center.set(548,22,6);
        _this.camera.rotation.set(-2.5,0.6,2.8);
    });
    document.getElementById('WebGL-output').addEventListener('click',function(event){
        _this.freeViewControl.autoRotate=false;
    });

    document.getElementById('record').addEventListener('click',function (event) {
        var blob = new Blob(_this.smokeH,{type: "text/csv,charset=UTF-8",endings: "native"});
        document.getElementById("download").href = window.URL.createObjectURL(blob);
    });

    // document.getElementById('floor1').addEventListener('click',function(event)
    // {
    //     _this.camera.position.set(397,29,42);
    //     console.log(_this.camera);
    //     console.log(_this.freeViewControl);
    //
    //     console.log(_this.camControl);
    // });

    //上层 视角控制 加载
    document.getElementById('floor1').addEventListener('click',function(event)
    {
        //设置视角是一层 触发改变
        _this.camera_status = _this.Cameracontroller.setenum.floor1;
        //设定视角具体数值
        _this.camera.position.set(60,3,146);
        ///console.log(_this.camera);
        ///console.log(_this.freeViewControl);
        ///console.log(_this.camControl);
    });

    document.getElementById('floor2').addEventListener('click',function(event)
    {
        //设置视角是二层 触发改变
        _this.camera_status = _this.Cameracontroller.setenum.floor2;
        //设定视角具体数值
        _this.camera.position.set(589,14,18);

        ///console.log(_this.camera);
        ///console.log(_this.freeViewControl);

        ///console.log(_this.camControl);
    });



}

Interaction.prototype.fuc2 = function (_this)
{
    var self = this;
    document.getElementById('startRun').addEventListener('click',function (event)
    {

        document.getElementById("active").style.display = "inline-block";
        document.getElementById("startRun").style.display = "none";
        document.getElementById("transformSmoke").style.display = "none";
        document.getElementById("createPersonBtn").style.display = "none";
        document.getElementById("fireman").style.display = "inline-block";
        document.getElementById("floor-menu").style.display = "inline-block";

        window.testFlag=12;
        //window.crowd.obj.visible=true;
        //alert(123)
        //灯光设置
        /*_this.directionalLight.forEach((light)=>{_this.scene.remove(light)});
        _this.scene.add(_this.ambientLight);
        _this.emergencyLightArr.forEach((light)=>{_this.scene.add(light)})*/
        //音效设置
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'audio/siren.wav', function( buffer ) {
            _this.sirenSound.setBuffer( buffer );
            _this.sirenSound.setLoop(true);
            _this.sirenSound.setVolume(0.5);
            _this.sirenSound.play();
        });

        // _this.smoke.redBallMesh.position.x=_this.smoke.positionBallMesh.position.x+16;
        // _this.smoke.redBallMesh.position.z= _this.smoke.positionBallMesh.position.z;
        //_this.camera.position.set(50, 200, 240);//原x为150 450
        //_this.camera.lookAt(50, 0, 240);
        _this.globalPlane.constant = 17;
        _this.globalPlane.set(new THREE.Vector3(0, -1, 0), 17);
        _this.smoke.firePos = _this.smoke.positionBallMesh.position;
        _this.smoke.positionBallMesh.visible=false;
        _this.people.positionPlaneMesh_1.visible=false;
        _this.people.positionPlaneMesh_2.visible=false;
        _this.people.positionPlaneMesh_3.visible=false;
        _this.people.positionPlaneMesh_4.visible=false;
        _this.people.positionPlaneMesh_5.visible=false;
        _this.smoke.clock.start();
        //_this.smoke.cloudRank();
        //fire必须在smoke之前set
        _this.fire.set(_this.smoke.positionBallMesh.position);
        _this.smoke.set(_this.fire,_this);
        _this.isStartRun = true;
        _this.smoke.isStartSmoke = true;
        _this.active = true;
        //_this.fire.fireManager.target.visible = true;
        _this.clock=new THREE.Clock();
        //_this.messagecontrol.readSmoke(_this.smoke.firePointArr[2],_this);

        _this.EscapeNumber = _this.number;
        let timeEscape = setInterval(function () {
            if(_this.active) {
                if (_this.currentEscapeTime < 600 && _this.number > 0) {
                    _this.currentEscapeTime += 1;
                    if (_this.number == _this.EscapeNumber - 1)
                        _this.firstEscapeTime = _this.currentEscapeTime;
                    var clockTime = 600 - _this.currentEscapeTime;
                    if (clockTime < 240)
                        $('#escapeTimePanel').css("color", "red");
                    $('#escapeTimePanel').html('0' + Math.floor(clockTime / 60) + ':' + Math.floor((clockTime % 60) / 10) + (clockTime % 60) % 10);
                    $('#illustration-title').text("火场情况");
                    $('#illustration-context').html("<br/>产烟总量： " + Math.round(_this.smoke.smokeVolume) + "m<sup>3</sup>"
                        + "<br/>排烟总量： " + Math.round(_this.smoke.exhaustVolume) + "m<sup>3</sup>"
                        + "<br/>火场内烟量： " + Math.round(_this.smoke.nowVolume) + "m<sup>3</sup>"
                        + "<br/>火场剩余人数： " + _this.number + "人");

                } else {
                    clearInterval(timeEscape);
                    //_this.active = false;

                    $("#fireman").css('display',"inline-block");
                    $('#illustration-title').text("模拟结束");
                    $('#illustration-context').html("<br/>成功逃出人数：" + (_this.EscapeNumber-_this.number) + "人"
                        + "<br/>未逃出人数：" +  _this.number + "人"
                        + "<br/>最快逃生用时：" + (_this.firstEscapeTime) + "s"
                        + "<br/>全体逃生用时：" + _this.currentEscapeTime + "s");
                    //$("#fireman").css("display", "inline-block");
                }
            }
        },1000);

        // //开始模拟后开始行走
        // for(var i=0; i<_this.people.blendMeshArr.length;i++) {
        //     var meshMixer = new THREE.AnimationMixer( _this.people.blendMeshArr[i] );
        //     _this.people.walkAction = meshMixer.clipAction( 'walk' );
        //     _this.people.runAction=meshMixer.clipAction('run');
        //     //actions = [ walkAction, idleAction, runAction ];
        //     _this.people.actions = [_this.people.walkAction, _this.people.runAction];
        //     _this.people.activateAllActions1(_this.people.actions);
        //     _this.people.mixerArr.push(meshMixer);
        // }
        // for(var iL=0; iL<_this.people.leaderMeshArr.length;iL++) {
        //     var meshMixer = new THREE.AnimationMixer( _this.people.leaderMeshArr[iL] );
        //     _this.people.walkAction = meshMixer.clipAction( 'walk' );
        //     _this.people.runAction=meshMixer.clipAction('run');
        //     //actions = [ walkAction, idleAction, runAction ];
        //     _this.people.actions = [_this.people.walkAction, _this.people.runAction];
        //     _this.people.activateAllActions1(_this.people.actions);
        //     _this.people.mixerArr.push(meshMixer);
        // }

    });


}

Interaction.prototype.fuc3 = function (MainScene)
{
    var $ = function(_) {
        return document.getElementById(_);
    };

    $('createPersonBtn').addEventListener('click',function (event)
    {
        $('person-slider').style.display = 'none';
        $('people-number').style.display = 'none';
        $('people-text').style.display = 'none';
        $('Menu').style.display = 'block';


        $('freeView').click();
        if(!MainScene.isEdit){
            $("startRun").style.display="none";
            $("floor-menu").style.display = "none";
            $('View').style.display = "none";
            $('transformSmoke').style.display = "none";
            $("fire-menu").style.display = "none";
            $("switch").style.display="inline-block";
            $('createPersonBtn').textContent="返回";
            $('illustration-context').innerHTML = "您已进入人群编辑页面，请通过拖动屏幕上的坐标轴使其成半透明效果，以选择人群位置，点击切换按钮可以缩放人群区域面积。在编辑完毕后，请点击“返回”以退出编辑模式"

            var number=Number($('people-number').textContent);
            MainScene.number=number;
            Utils.loading(1000);
            //MainScene.Path.createNav(MainScene);
            Utils.loading(500);
            MainScene.addPeople();
            //MainScene.smoke.smokeStart(MainScene);

            MainScene.camera.position.set(50, 80, 240);//原x为150 450
            MainScene.camera.lookAt(50, 0, 240);
            MainScene.globalPlane.constant = 17;
            MainScene.globalPlane.set(new THREE.Vector3(0, -1, 0), 17);
            MainScene.isEdit = true;

            MainScene.extinguisherControl_1.attach(MainScene.people.positionPlaneMesh_1);
            MainScene.extinguisherControl_1.visible = true;
            MainScene.people.positionPlaneMesh_1.visible=true;
            MainScene.extinguisherControl_2.attach(MainScene.people.positionPlaneMesh_2);
            MainScene.extinguisherControl_2.visible = true;
            MainScene.people.positionPlaneMesh_2.visible=true;
            MainScene.extinguisherControl_3.attach(MainScene.people.positionPlaneMesh_3);
            MainScene.extinguisherControl_3.visible = true;
            MainScene.people.positionPlaneMesh_3.visible=true;
            MainScene.extinguisherControl_4.attach(MainScene.people.positionPlaneMesh_4);
            MainScene.extinguisherControl_4.visible = true;
            MainScene.people.positionPlaneMesh_4.visible=true;
            MainScene.extinguisherControl_5.attach(MainScene.people.positionPlaneMesh_5);
            MainScene.extinguisherControl_5.visible = true;
            MainScene.people.positionPlaneMesh_5.visible=true;

        } else{
            $("startRun").style.display="inline-block";
            $("floor-menu").style.display="none";
            $('transformSmoke').style.display = "block";
            $('View').style.display = "inline-block";
            $("fire-menu").style.display = "none";
            $("switch").style.display="none";
            $('createPersonBtn').textContent="编辑人群";
            $('illustration-context').innerHTML = "<p>您已成功选取人群排布</p>" + "<p>若想编辑烟雾请点击“编辑烟雾”,否则点击“开始模拟”</p>";

            //音效
            var audioLoader = new THREE.AudioLoader();
            audioLoader.load('audio/noisy.wav',function( buffer ) {
                MainScene.noisySound.setBuffer( buffer );
                MainScene.noisySound.setLoop(true);
                MainScene.noisySound.setVolume(0.5);
                MainScene.noisySound.play();
            });
            /*人物分布测试用
            console.log(MainScene.people.positionPlaneMesh_1.position.x, MainScene.people.positionPlaneMesh_1.position.z, Math.abs(MainScene.people.positionPlaneMesh_1.scale.x * 5), Math.abs(MainScene.people.positionPlaneMesh_1.scale.z * 10));
            console.log(MainScene.people.positionPlaneMesh_2.position.x, MainScene.people.positionPlaneMesh_2.position.z, Math.abs(MainScene.people.positionPlaneMesh_2.scale.x * 5), Math.abs(MainScene.people.positionPlaneMesh_2.scale.z * 10));
            console.log(MainScene.people.positionPlaneMesh_3.position.x, MainScene.people.positionPlaneMesh_3.position.z, Math.abs(MainScene.people.positionPlaneMesh_3.scale.x * 5), Math.abs(MainScene.people.positionPlaneMesh_3.scale.z * 10));
            console.log(MainScene.people.positionPlaneMesh_4.position.x, MainScene.people.positionPlaneMesh_4.position.z, Math.abs(MainScene.people.positionPlaneMesh_4.scale.x * 5), Math.abs(MainScene.people.positionPlaneMesh_4.scale.z * 10));
            console.log(MainScene.people.positionPlaneMesh_5.position.x, MainScene.people.positionPlaneMesh_5.position.z, Math.abs(MainScene.people.positionPlaneMesh_5.scale.x * 5), Math.abs(MainScene.people.positionPlaneMesh_5.scale.z * 10));
            */
            MainScene.camera.position.set(60,3,146);
            MainScene.camera.rotation.set(-2.8,0.7,2.9);
            //MainScene.camera.lookAt(50, 0, 240);
            MainScene.globalPlane.constant = 17;
            MainScene.globalPlane.set(new THREE.Vector3(0, -1, 0), 17);
            //MainScene.globalPlane.constant=100000;
            MainScene.isEdit = false;
            MainScene.extinguisherControl_1.attach();
            MainScene.extinguisherControl_1.visible = false;
            MainScene.people.positionPlaneMesh_1.visible=false;
            MainScene.extinguisherControl_2.attach();
            MainScene.extinguisherControl_2.visible = false;
            MainScene.people.positionPlaneMesh_2.visible=false;
            MainScene.extinguisherControl_3.attach();
            MainScene.extinguisherControl_3.visible = false;
            MainScene.people.positionPlaneMesh_3.visible=false;
            MainScene.extinguisherControl_4.attach();
            MainScene.extinguisherControl_4.visible = false;
            MainScene.people.positionPlaneMesh_4.visible=false;
            MainScene.extinguisherControl_5.attach();
            MainScene.extinguisherControl_5.visible = false;
            MainScene.people.positionPlaneMesh_5.visible=false;

            // MainScene.people.groupRun.forEach(child => {
            //     child.visible = true;
            //     child.position.y = -8.5;
            //     var num_1 = Math.floor(Math.random() * 2 + 1);
            //     var num_2 = Math.floor(Math.random() * 2 + 1);
            //     if (num_1 ===1) {
            //         if (num_2 === 1) {
            //             child.position.x = MainScene.people.positionPlaneMesh_1.position.x + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_1.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_1.position.z + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_1.scale.z)*10;
            //         }
            //         else{
            //             child.position.x = MainScene.people.positionPlaneMesh_1.position.x + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_1.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_1.position.z - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_1.scale.z)*10;
            //         }
            //     }
            //     else {
            //         if (num_2 === 1) {
            //             child.position.x = MainScene.people.positionPlaneMesh_1.position.x - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_1.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_1.position.z + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_1.scale.z)*10;
            //         }
            //         else{
            //             child.position.x = MainScene.people.positionPlaneMesh_1.position.x - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_1.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_1.position.z - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_1.scale.z)*10;
            //         }
            //     }
            // });
            // MainScene.people.groupWalk.forEach(child => {
            //     child.visible = true;
            //     child.position.y = -8.5;
            //     var num_1 = Math.floor(Math.random() * 2 + 1);
            //     var num_2 = Math.floor(Math.random() * 2 + 1);
            //     if (num_1 ===1) {
            //         if (num_2 === 1) {
            //             child.position.x = MainScene.people.positionPlaneMesh_2.position.x + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_2.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_2.position.z + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_2.scale.z)*10;
            //         }
            //         else{
            //             child.position.x = MainScene.people.positionPlaneMesh_2.position.x + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_2.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_2.position.z - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_2.scale.z)*10;
            //         }
            //     }
            //     else {
            //         if (num_2 === 1) {
            //             child.position.x = MainScene.people.positionPlaneMesh_2.position.x - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_2.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_2.position.z + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_2.scale.z)*10;
            //         }
            //         else{
            //             child.position.x = MainScene.people.positionPlaneMesh_2.position.x - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_2.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_2.position.z - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_2.scale.z)*10;
            //         }
            //     }
            // });
            // MainScene.people.groupBend.forEach(child => {
            //     child.visible = true;
            //     child.position.y = -8.5;
            //     var num_1 = Math.floor(Math.random() * 2 + 1);
            //     var num_2 = Math.floor(Math.random() * 2 + 1);
            //     if (num_1 ===1) {
            //         if (num_2 === 1) {
            //             child.position.x = MainScene.people.positionPlaneMesh_3.position.x + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_3.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_3.position.z + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_3.scale.z)*10;
            //         }
            //         else{
            //             child.position.x = MainScene.people.positionPlaneMesh_3.position.x + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_3.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_3.position.z - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_3.scale.z)*10;
            //         }
            //     }
            //     else {
            //         if (num_2 === 1) {
            //             child.position.x = MainScene.people.positionPlaneMesh_3.position.x - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_3.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_3.position.z + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_3.scale.z)*10;
            //         }
            //         else{
            //             child.position.x = MainScene.people.positionPlaneMesh_3.position.x - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_3.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_3.position.z - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_3.scale.z)*10;
            //         }
            //     }
            // });
            // MainScene.people.groupCrawl.forEach(child => {
            //     child.visible = true;
            //     child.position.y = -8.5;
            //     var num_1 = Math.floor(Math.random() * 2 + 1);
            //     var num_2 = Math.floor(Math.random() * 2 + 1);
            //     if (num_1 ===1) {
            //         if (num_2 === 1) {
            //             child.position.x = MainScene.people.positionPlaneMesh_4.position.x + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_4.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_4.position.z + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_4.scale.z)*10;
            //         }
            //         else{
            //             child.position.x = MainScene.people.positionPlaneMesh_4.position.x + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_4.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_4.position.z - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_4.scale.z)*10;
            //         }
            //     }
            //     else {
            //         if (num_2 === 1) {
            //             child.position.x = MainScene.people.positionPlaneMesh_4.position.x - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_4.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_4.position.z + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_4.scale.z)*10;
            //         }
            //         else{
            //             child.position.x = MainScene.people.positionPlaneMesh_4.position.x - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_4.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_4.position.z - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_4.scale.z)*10;
            //         }
            //     }
            // });
            // MainScene.people.groupIdle.forEach(child => {
            //     child.visible = true;
            //     child.position.y = -8.5;
            //     var num_1 = Math.floor(Math.random() * 2 + 1);
            //     var num_2 = Math.floor(Math.random() * 2 + 1);
            //     if (num_1 ===1) {
            //         if (num_2 === 1) {
            //             child.position.x = MainScene.people.positionPlaneMesh_5.position.x + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_5.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_5.position.z + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_5.scale.z)*10;
            //         }
            //         else{
            //             child.position.x = MainScene.people.positionPlaneMesh_5.position.x + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_5.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_5.position.z - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_5.scale.z)*10;
            //         }
            //     }
            //     else {
            //         if (num_2 === 1) {
            //             child.position.x = MainScene.people.positionPlaneMesh_5.position.x - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_5.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_5.position.z + Math.random() * Math.abs(MainScene.people.positionPlaneMesh_5.scale.z)*10;
            //         }
            //         else{
            //             child.position.x = MainScene.people.positionPlaneMesh_5.position.x - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_5.scale.x)*5;
            //             child.position.z = MainScene.people.positionPlaneMesh_5.position.z - Math.random() * Math.abs(MainScene.people.positionPlaneMesh_5.scale.z)*10;
            //         }
            //     }
            // });
        }
    });

    $('fireman').addEventListener('click',function (event)
    {
        //MainScene.Test.init(MainScene);//debug专用

        MainScene.active = true;
        MainScene.isfiremanclick=true;
        MainScene.camControlOver.autoRotate = false;

        $("fireman").style.display = "none";
        //$('escapeTimePanel').style.display = "none";
        $('pause').style.display = "inline-block";
        //消防员出现之后就是跟随视角
        $("cancelFollow").style.display = "inline-block";
        $("startRun").style.display = "none";
        $('OrbitView').click();
        $('bottom-menu').style.display = "none";

        $('illustration-title').innerHTML = "<center>\n" +
            "        <h5>灭火器使用说明</h5>\n" +
            "    </center>"
        $('illustration-context').innerHTML = "<center>\n" +
            "        <p style=\"font-size: 14px\">身距火源约两米，先摇瓶身后拔销</p>\n" +
            "        <p style=\"font-size: 14px\">身成弓步腿出力，下压开关把粉喷</p>\n" +
            "        <p style=\"font-size: 14px\">喷时对准火焰根，余火不留防复燃</p>\n" +
            "        <a href=\"https://www.iqiyi.com/w_19rs6bmc8d.html\" target='_blank'>点击可观看使用教学视频</a>\n" +
            "    </center>";

    });

    $('floor1').addEventListener('click',function (event)
    {
        MainScene.camera.position.set(55,-1,163);
        MainScene.currentFloor = "floor1";
        MainScene.camera.rotation.set(-2.8,0.4,3);
    });

    $('floor2').addEventListener('click',function (event)
    {
        MainScene.camera.position.set(52,-11,203);
        MainScene.currentFloor = "floor2";
        MainScene.camera.rotation.set(-2.8,0.4,3);
    });

    // $('createPersonBtn').addEventListener('click',function(event)
    // {
    //
    // });

    $('transformSmoke').addEventListener('click',function(event)
    {
        $("createPersonBtn").style.display="none";
        $('freeView').click();
        if(!MainScene.isEdit){
           // userBookNumber=1;
            $("startRun").style.display="none";
            $("floor-menu").style.display = "none";
            $('View').style.display = "none";
            $("fire-menu").style.display = "inline-block";
            $("switch").style.display="none";
            $('transformSmoke').textContent="返回";
            $('illustration-context').innerHTML = "您已进入烟雾编辑页面，请通过拖动屏幕上的坐标轴至“红色标识”下方并使其成半透明效果，以选择起火位置，或者直接点选“火灾情景”按钮进行选择。在选择完毕后，请点击“返回”以退出编辑模式"

            MainScene.camera.position.set(50, 200, 240);//原x为150 450
            MainScene.camera.lookAt(50, 0, 240);
            MainScene.globalPlane.constant = 17;//地下一层
            MainScene.globalPlane.set(new THREE.Vector3(0, -1, 0), -10.5);//地下二层
            MainScene.control.attach(MainScene.smoke.positionBallMesh);
            MainScene.isEdit = true;
            MainScene.control.visible = true;
            // MainScene.fire.Te1Material.visible=false;
            // MainScene.fire.Te2Material.visible=false;
            MainScene.fire.fireManager.target.visible=true;

            MainScene.smoke.positionBallMesh.visible=true;
            MainScene.smokeEditor.points.forEach(function(item){
                item.visible = true;
            })
            MainScene.smokeEditor.shapeMesh.visible = true;

        } else{
           // userBookNumber=0;
            $("startRun").style.display="inline-block";
            $("createPersonBtn").style.display="inline-block";
            $("floor-menu").style.display="none";
            $('View').style.display = "inline-block";
            $("fire-menu").style.display = "none";
            $("transformSmoke").style.display="inline-block";
            $('transformSmoke').textContent="编辑烟雾";
            $("switch").style.display="none";
            $('illustration-context').innerHTML = "<p>您已成功选取起火点位置</p>" + "<p>若想模拟火灾请点击“开始模拟”</p>";

            MainScene.camera.position.set(60,3,146);
            MainScene.camera.rotation.set(-2.8,0.7,2.9);
            //MainScene.camera.lookAt(50, 0, 240);
            MainScene.globalPlane.constant = 17;
            MainScene.globalPlane.set(new THREE.Vector3(0, -1, 0), 17);
            //MainScene.globalPlane.constant=100000;
            MainScene.control.attach();
            MainScene.smokeEditor.transformControls.detach();
            MainScene.isEdit = false;
            MainScene.control.visible = false;
            // MainScene.fire.Te1Material.visible=false;
            // MainScene.fire.Te2Material.visible=false;
            MainScene.fire.fireManager.target.visible=false;

            MainScene.smoke.positionBallMesh.visible=false;
            MainScene.smokeEditor.points.forEach(function(item){
                item.visible = false;
            })
            MainScene.smokeEditor.shapeMesh.visible = false;
            //MainScene.smokeEditor.generateConvex(MainScene);

        }
    });
    $('cancelFollow').addEventListener('click',function (event) {
        if(MainScene.isOverView){
            MainScene.isOverView = false;
            $('cancelFollow').innerText = "跟随消防员";
            MainScene.camControl.lat = -26;
            MainScene.camControl.lon = -166;
        }
        else{
            MainScene.isOverView = true;
            $('cancelFollow').innerText = "取消跟随"
        }
    });

    $('toNo1').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=MainScene.smoke.firePointArr[0].firePosition.x;
        MainScene.smoke.positionBallMesh.position.z=MainScene.smoke.firePointArr[0].firePosition.z;

    });
    $('toNo2').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=MainScene.smoke.firePointArr[1].firePosition.x;
        MainScene.smoke.positionBallMesh.position.z=MainScene.smoke.firePointArr[1].firePosition.z;
    });
    $('toNo3').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=MainScene.smoke.firePointArr[2].firePosition.x;
        MainScene.smoke.positionBallMesh.position.z=MainScene.smoke.firePointArr[2].firePosition.z;
    });
    $('toNo4').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=MainScene.smoke.firePointArr[3].firePosition.x;
        MainScene.smoke.positionBallMesh.position.z=MainScene.smoke.firePointArr[3].firePosition.z;
    });
    $('toNo5').addEventListener('click',function(event)
    {
        MainScene.smoke.positionBallMesh.position.x=MainScene.smoke.firePointArr[4].firePosition.x;
        MainScene.smoke.positionBallMesh.position.z=MainScene.smoke.firePointArr[4].firePosition.z;
    });

    $('OrbitView').addEventListener('change',function ()
    {
        MainScene.Cameracontroller.active=false;
        MainScene.isOverView = true;
    });
    $('freeView').addEventListener('change',function () {
        MainScene.Cameracontroller.active=true;
        MainScene.isOverView = false;
        MainScene.camera.position.set(397,29,42);
        MainScene.camControl.lat = -30;
        MainScene.camControl.lon = 337;
    });
    $('pause').addEventListener('click',function () {
        MainScene.active = false;
        $('continue').style.display = "block";
        $('pause').style.display = "none";
    });
    $('continue').addEventListener('click',function () {
        MainScene.active = true;
        $('continue').style.display = "none";
        $('pause').style.display = "block";
    });
    $('switch').addEventListener('click',function () {
        if( document.getElementById('switch').textContent==="切换至缩放"){
            $('switch').textContent="切换至平移";
            MainScene.extinguisherControl_1.setMode('scale');
            MainScene.extinguisherControl_2.setMode('scale');
            MainScene.extinguisherControl_3.setMode('scale');
            MainScene.extinguisherControl_4.setMode('scale');
            MainScene.extinguisherControl_5.setMode('scale');
        }
        else{
            $('switch').textContent="切换至缩放";
            MainScene.extinguisherControl_1.setMode('translate');
            MainScene.extinguisherControl_2.setMode('translate');
            MainScene.extinguisherControl_3.setMode('translate');
            MainScene.extinguisherControl_4.setMode('translate');
            MainScene.extinguisherControl_5.setMode('translate');
        }
    });
//region 点击坐标测试
    window.addEventListener('mousemove', onMouseMove, false);

    function onMouseMove(event) {
        MainScene.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        MainScene.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }


    window.addEventListener('click', onClick, false);

    function onClick(event) {
        if(MainScene.isEdit)
        {
            MainScene.raycaster.setFromCamera(MainScene.mouse, MainScene.camera);
            var intersects = MainScene.raycaster.intersectObjects(MainScene.smokeEditor.points, true);
            if (intersects.length > 0) {
                MainScene.smokeEditor.transformControls.attach(intersects[0].object);
                ///console.log(MainScene.smokeEditor.transformControls);
            }
        }
        //点击坐标测试
        /*MainScene.raycaster.setFromCamera(MainScene.mouse, MainScene.camera);
        var intersects = MainScene.raycaster.intersectObjects(MainScene.Cameracontroller.collideMeshList, true);
        if (intersects.length > 0) {

            console.log(intersects[0].point);
            MainScene.pMesh.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
            console.log(MainScene.pMesh.position);
        }*/


    }
    //deregion

    // window.addEventListener('click', onClick, false);
    //
    // function onClick(event) {
    //     console.log(MainScene.smoke.smokeUnitArr);
    //     console.log(MainScene.smoke.time);
    //
    // }

    //编辑烟雾状态下的摄像机移动
    window.addEventListener('keydown',function(event){
        if(MainScene.isEdit)
        {
            if(event.key == "a" || event.key == "Left Arrow")
                MainScene.camera.position.x =MainScene.camera.position.x-2;
            if(event.key == "d" || event.key == "Right Arrow")
                MainScene.camera.position.x =MainScene.camera.position.x+2;
        }
    })
}

Interaction.prototype.fuc4 = function (_this)
{
    var self = this;
    window.addEventListener( 'resize', onWindowResize, false );
    //窗口设置
    function onWindowResize()
    {
        self.SCREEN_WIDTH = window.innerWidth;
        self.SCREEN_HEIGHT = window.innerHeight;
        self.aspect = self.SCREEN_WIDTH / self.SCREEN_HEIGHT;
        _this.renderer.setSize(self.SCREEN_WIDTH, self.SCREEN_HEIGHT);
        _this.camera.aspect = _this.aspect;
        _this.camera.updateProjectionMatrix();

    }
}

Interaction.prototype.fuc5 = function (_this)
{

    $("#view_pos").html('        <button  id="view_pos" class="btn btn-default btn-lg">视角坐标</button>\n');
    $("#mesh_pos").html('        <button  id="mesh_pos" class="btn btn-default btn-lg">建筑坐标</button>\n');
    $("#flag").html('        <button  id="flag" class="btn btn-default btn-lg">X</button>\n');
    $("#_flag").html('        <button  id="flag" class="btn btn-default btn-lg">subway</button>\n');
    $("#x_1").html('        <button  id="x_1" class="btn btn-default btn-lg">坐标+1</button>\n');
    $("#x_2").html('        <button  id="x_2" class="btn btn-default btn-lg">坐标-1</button>\n');
    $("#x_3").html('        <button  id="x_3" class="btn btn-default btn-lg">坐标+10</button>\n');
    $("#x_4").html('        <button  id="x_4" class="btn btn-default btn-lg">坐标-10</button>\n');

    var flag = 'x';
    //var _flag =_this.underground.subway;
    document.getElementById('flag').addEventListener('click',function (event)
    {
        if(flag==='x')
        {
            flag = 'y';
            $("#flag").html('        <button  id="flag" class="btn btn-default btn-lg">Y</button>\n');
        }
        else if(flag==='y')
        {
            flag = 'z';
            $("#flag").html('        <button  id="flag" class="btn btn-default btn-lg">Z</button>\n');
        }
        else if(flag==='z')
        {
            flag = 'x';
            $("#flag").html('        <button  id="flag" class="btn btn-default btn-lg">X</button>\n');
        }

    });

    document.getElementById('_flag').addEventListener('click',function (event)
    {
        if(_flag===_this.underground.subway)
        {
            _flag =_this.underground.rail;
            $("#_flag").html('        <button  id="flag" class="btn btn-default btn-lg">rail</button>\n');
        }
        else
        {
            _flag =_this.underground.subway;
            $("#_flag").html('        <button  id="flag" class="btn btn-default btn-lg">subway</button>\n');
        }

    });

    document.getElementById('x_1').addEventListener('click',function (event)
    {
        change(0.1);
    });
    document.getElementById('x_2').addEventListener('click',function (event) {
        change(-0.1);
});
    document.getElementById('x_3').addEventListener('click',function (event) {
        change(10);
});
    document.getElementById('x_4').addEventListener('click',function (event) {
        change(-10);
    });
    document.getElementById('mesh_pos').addEventListener('click',function (event) {

        var output = _flag.position.x.toString()+","+_flag.position.y.toString()+","+_flag.position.z.toString();
        alert(output);
    });
    document.getElementById('view_pos').addEventListener('click',function(event)
    {
        var output = _this.camera.position.x.toString()+","+_this.camera.position.y.toString()+","+_this.camera.position.z.toString();
        alert(output);
        ///console.log(_this.camera.position);
        ///console.log(_this.camera);
        ///console.log(_this.freeViewControl);
        ///console.log(_this.camControl);
    });

    function change(num)
    {
        var x = _flag.position.x;
        var y = _flag.position.y;
        var z = _flag.position.z;
        if(flag==='x')
            _flag.position.set(x+num,y,z);
        if(flag==='y')
            _flag.position.set(x,y+num,z);
        if(flag==='z')
            _flag.position.set(x,y,z+num);
    }
}
