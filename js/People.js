var People = function () {
    this.isLoaded = false;
    this.mixerArr = [];
    this.actions;
    this.idleAction;
    this.walkAction;
    this.runAction;//一共三个动作，站立、行走、低头跑
    this.pathControlMap = {};
    this.blendMeshArr = [];
    this.leaderMeshArr = [];
    this.humanInfoMap=[];
    this.exitInfoMap=[];//出口信息
}

let meshMixer, action, modelURL, modelURL1, modelURL2, modelURL3, modelURL4, modelURL5, modelURL6, modelURL7, modelURL8, modelURL9, modelURL10, modelURL11, modelURL12, modelURL13, modelURL14, modelURL15, modelURL16, modelURL17, modelURL18, clip;
let runMax_x = 0, runMax_z = 0;
let runMin_x = 1000, runMin_z = 1000;
var v0 = 0.8;//Agent初始速度
var vmax = 1.6;//Agent最大速度
var fear = 0;//Agent恐慌度，0-1
var vt;//当前速度
var num;

People.prototype.init = function (_this) {
    let self = this;
    let multi = _this.number;
    var surplus = multi % 109;
    multi = Math.floor(multi / 109);
    _this.isFinishLoadCharactor = false;
    _this.isStartRun = false;
    this.groupRun = [];
    this.groupWalk = [];
    this.groupBend = [];
    this.groupCrawl = [];
    this.groupIdle = [];
    this.cameraPerspective = new THREE.PerspectiveCamera( 50,  this.aspect, 10, 1000 );
    loadBlendMeshWithPromise(_this);
    this.positionPlaneGeometry_1=new THREE.PlaneGeometry(10,20);
    this.positionPlaneMaterial_1=new THREE.MeshPhongMaterial({color:0xff0000, opacity:0.5, transparent:true});
    this.positionPlaneGeometry_2=new THREE.PlaneGeometry(10,20);
    this.positionPlaneMaterial_2=new THREE.MeshPhongMaterial({color:0x3CB371, opacity:0.5, transparent:true});
    this.positionPlaneGeometry_3=new THREE.PlaneGeometry(10,20);
    this.positionPlaneMaterial_3=new THREE.MeshPhongMaterial({color:0xFF4500, opacity:0.5, transparent:true});
    this.positionPlaneGeometry_4=new THREE.PlaneGeometry(10,20);
    this.positionPlaneMaterial_4=new THREE.MeshPhongMaterial({color:0xFF6347, opacity:0.5, transparent:true});
    this.positionPlaneGeometry_5=new THREE.PlaneGeometry(10,20);
    this.positionPlaneMaterial_5=new THREE.MeshPhongMaterial({color:0xA52A2A, opacity:0.5, transparent:true});
    this.positionPlaneMesh_1=new THREE.Mesh(this.positionPlaneGeometry_1,this.positionPlaneMaterial_1);
    this.positionPlaneMesh_1.position.set(51,-8.5,261);
    this.positionPlaneMesh_1.rotation.x = -0.5 * Math.PI;
    this.positionPlaneMesh_2=new THREE.Mesh(this.positionPlaneGeometry_2,this.positionPlaneMaterial_2);
    this.positionPlaneMesh_2.position.set(51,-8.5,241);
    this.positionPlaneMesh_2.rotation.x = -0.5 * Math.PI;
    this.positionPlaneMesh_3=new THREE.Mesh(this.positionPlaneGeometry_3,this.positionPlaneMaterial_3);
    this.positionPlaneMesh_3.position.set(51,-8.5,222);
    this.positionPlaneMesh_3.rotation.x = -0.5 * Math.PI;
    this.positionPlaneMesh_4=new THREE.Mesh(this.positionPlaneGeometry_4,this.positionPlaneMaterial_4);
    this.positionPlaneMesh_4.position.set(51,-8.5,197);
    this.positionPlaneMesh_4.rotation.x = -0.5 * Math.PI;
    this.positionPlaneMesh_5=new THREE.Mesh(this.positionPlaneGeometry_5,this.positionPlaneMaterial_5);
    this.positionPlaneMesh_5.position.set(51,-8.5,170);
    this.positionPlaneMesh_5.rotation.x = -0.5 * Math.PI;//
    this.cameraPerspective.position.set(-25,7,0);
    this.cameraPerspective.lookAt(this.positionPlaneMesh_1.position);
    _this.scene.add(this.positionPlaneMesh_1);
    this.positionPlaneMesh_1.visible = false;
    _this.scene.add(this.positionPlaneMesh_2);
    this.positionPlaneMesh_2.visible = false;
    _this.scene.add(this.positionPlaneMesh_3);
    this.positionPlaneMesh_3.visible = false;
    _this.scene.add(this.positionPlaneMesh_4);
    this.positionPlaneMesh_4.visible = false;
    _this.scene.add(this.positionPlaneMesh_5);
    this.positionPlaneMesh_5.visible = false;

    function loadBlendMeshWithPromise(_this) {
        var loadModelPromise = function (modelurl) {
            return new Promise((resolve) => {
                var loader = new THREE.GLTFLoader();
                loader.load(modelurl, (gltf) => {
                    // console.log(gltf);
                    resolve(gltf);
                })
            })
        }

        var modelURL = "./Model/avatar/female_run.glb";
        var modelURL1 = "./Model/avatar/male_run.glb";
        var modelURL2 = "./Model/avatar/childFemale_run.glb";
        var modelURL3 = "./Model/avatar/childMale_run.glb";
        var modelURL4 = "./Model/avatar/female_walk.glb";
        var modelURL5 = "./Model/avatar/male_walk.glb";
        var modelURL6 = "./Model/avatar/granny_walk.glb";
        var modelURL7 = "./Model/avatar/female_bend.glb";
        var modelURL8 = "./Model/avatar/male_bend.glb";
        var modelURL9 = "./Model/avatar/granny_bend.glb";
        var modelURL10 = "./Model/avatar/female_crawl.glb";
        var modelURL11 = "./Model/avatar/male_crawl.glb";
        var modelURL12 = "./Model/avatar/childFemale_crawl.glb";
        var modelURL13 = "./Model/avatar/childMale_crawl.glb";
        var modelURL14 = "./Model/avatar/granny_idle.glb";
        var modelURL15 = "./Model/avatar/childFemale_idle.glb";
        var modelURL16 = "./Model/avatar/childMale_idle.glb";
        var modelURL17 = "./Model/avatar/female_idle.glb";
        var modelURL18 = "./Model/avatar/male_idle.glb";


        var arr = new Array();
        var arr1 = new Array();
        var arr2 = new Array();
        var arr3 = new Array();
        var arr4 = new Array();
        var arr5 = new Array();
        var arr6 = new Array();
        var arr7 = new Array();
        var arr8 = new Array();
        var arr9 = new Array();
        var arr10 = new Array();
        var arr11 = new Array();
        var arr12 = new Array();
        var arr13 = new Array();
        var arr14 = new Array();
        var arr15 = new Array();
        var arr16 = new Array();
        var arr17 = new Array();
        var arr18 = new Array();


        for (num = 0; num < 31; num++) {

            arr[num] = loadModelPromise(modelURL);

        }
        for (num = 0; num < 39; num++) {

            arr1[num] = loadModelPromise(modelURL1);

        }
        for (num = 0; num < 2; num++) {

            arr2[num] = loadModelPromise(modelURL2);

        }
        for (num = 0; num < 2; num++) {

            arr3[num] = loadModelPromise(modelURL3);

        }
        for (num = 0; num < 31; num++) {

            arr4[num] = loadModelPromise(modelURL4);

        }
        for (num = 0; num < 39; num++) {

            arr5[num] = loadModelPromise(modelURL5);

        }
        for (num = 0; num < 2; num++) {

            arr6[num] = loadModelPromise(modelURL6);

        }
        for (num = 0; num < 31; num++) {

            arr7[num] = loadModelPromise(modelURL7);

        }
        for (num = 0; num < 39; num++) {

            arr8[num] = loadModelPromise(modelURL8);

        }
        for (num = 0; num < 2; num++) {

            arr9[num] = loadModelPromise(modelURL9);

        }
        for (num = 0; num < 31; num++) {

            arr10[num] = loadModelPromise(modelURL10);

        }
        for (num = 0; num < 39; num++) {

            arr11[num] = loadModelPromise(modelURL11);

        }
        for (num = 0; num < 2; num++) {

            arr12[num] = loadModelPromise(modelURL12);

        }
        for (num = 0; num < 2; num++) {

            arr13[num] = loadModelPromise(modelURL13);

        }
        for (num = 0; num < 2; num++) {

            arr14[num] = loadModelPromise(modelURL14);

        }
        for (num = 0; num < 2; num++) {

            arr15[num] = loadModelPromise(modelURL15);

        }
        for (num = 0; num < 2; num++) {

            arr16[num] = loadModelPromise(modelURL16);

        }
        for (num = 0; num < 31; num++) {

            arr17[num] = loadModelPromise(modelURL17);

        }
        for (num = 0; num < 39; num++) {

            arr18[num] = loadModelPromise(modelURL18);

        }

        function ForceGetProperty(obj, propertyName) {
            return obj[propertyName];
        }

        THREE.SkinnedMesh.prototype.copy = function (source, recursive) {
            // THREE.Mesh.prototype.copy.call( this, source );
            THREE.Object3D.prototype.copy.call(this, source, recursive);
            //this.drawMode = source.drawMode;
            if (source.morphTargetInfluences !== undefined) {
                this.morphTargetInfluences = source.morphTargetInfluences.slice();
            }
            if (source.morphTargetDictionary !== undefined) {
                this.morphTargetDictionary = Object.assign({}, source.morphTargetDictionary);
            }
            //TODO:Unknown intention
            this._sourceMeshUuid = source.uuid;
            return this;
        };
        THREE.SkinnedMesh.prototype.clone = function (recursive) {
            return new this.constructor(this.geometry, this.material).copy(this, recursive);
        };

        const cloneGltf = (gltf) => {
            const clone = {
                animations: gltf.animations,
                scene: gltf.scene.clone(true)
            };
            const skinnedMeshes = {};
            gltf.scene.traverse((node) => {
                if (ForceGetProperty(node, "isSkinnedMesh")) {
                    skinnedMeshes[node.uuid] = node;
                }
            });
            // console.log(skinnedMeshes);
            const cloneBones = {};
            const cloneSkinnedMeshes = {};
            clone.scene.traverse((node) => {
                if (ForceGetProperty(node, "isBone")) {
                    cloneBones[node.name] = node;
                }
                if (ForceGetProperty(node, "isSkinnedMesh")) {
                    cloneSkinnedMeshes[node.uuid] = node;
                }
            });
            // console.log(cloneBones);
            // console.log(cloneSkinnedMeshes);
            for (let uuid in cloneSkinnedMeshes) {
                const cloneSkinnedMesh = cloneSkinnedMeshes[uuid];
                // console.log(cloneSkinnedMeshes);
                const skinnedMesh = skinnedMeshes[cloneSkinnedMesh._sourceMeshUuid];
                if (skinnedMesh === null) {
                    continue;
                }
                // console.log(skinnedMesh);
                const skeleton = skinnedMesh.skeleton;
                const orderedCloneBones = [];
                for (let i = 0; i < skeleton.bones.length; ++i) {
                    const cloneBone = cloneBones[skeleton.bones[i].name];
                    orderedCloneBones.push(cloneBone);
                }
                cloneSkinnedMesh.bind(new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses), cloneSkinnedMesh.matrixWorld);
            }
            return clone;
        };

        var promiseAll = Promise.all(arr).then((data) => {

            var temp, number;
            if(surplus>=0&&surplus<=10){
                number = multi * 10 + surplus;
            }
            else {
                number = multi * 10 + 10;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {

                temp = i % 31;
                var newMesh, textureURL, textureURL1;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/business01_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/business01_f_30_hair.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/business02_f_50.jpg';
                    textureURL1 = './Model/avatar/texture/business02_f_50.jpg';
                }
                if (temp === 2) {
                    textureURL = './Model/avatar/texture/business03_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/business03_f_25.jpg';
                }
                if (temp === 3) {
                    textureURL = './Model/avatar/texture/business04_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/business04_f_25_hair.jpg';
                }
                if (temp === 4) {
                    textureURL = './Model/avatar/texture/business05_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/business05_f_35.jpg';
                }
                if (temp === 5) {
                    textureURL = './Model/avatar/texture/casual01_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual01_f_20_hair.jpg';
                }
                if (temp === 6) {
                    textureURL = './Model/avatar/texture/casual02_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual02_f_25.jpg';
                }
                if (temp === 7) {
                    textureURL = './Model/avatar/texture/casual03_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual03_f_25_hair_alpha.jpg';
                }
                if (temp === 8) {
                    textureURL = './Model/avatar/texture/casual04_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual04_f_30.jpg';
                }
                if (temp === 9) {
                    textureURL = './Model/avatar/texture/casual05_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual05_f_25_hair.jpg';
                }
                if (temp === 10) {
                    textureURL = './Model/avatar/texture/casual06_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual06_f_hair_alpha.jpg';
                }
                if (temp === 11) {
                    textureURL = './Model/avatar/texture/casual07_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual07_f_20_hair.jpg';
                }
                if (temp === 12) {
                    textureURL = './Model/avatar/texture/casual08_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual08_f_25_hair.jpg';
                }
                if (temp === 13) {
                    textureURL = './Model/avatar/texture/casual09_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual09_f_25.jpg';
                }
                if (temp === 14) {
                    textureURL = './Model/avatar/texture/casual10_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual10_f_30_hair.jpg';
                }
                if (temp === 15) {
                    textureURL = './Model/avatar/texture/casual11_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual11_f_30_hair.jpg';
                }
                if (temp === 16) {
                    textureURL = './Model/avatar/texture/casual12_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual12_f_30_hair.jpg';
                }
                if (temp === 17) {
                    textureURL = './Model/avatar/texture/casual13_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual13_f_30_hair.jpg';
                }
                if (temp === 18) {
                    textureURL = './Model/avatar/texture/casual14_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual14_f_25_hair.jpg';
                }
                if (temp === 19) {
                    textureURL = './Model/avatar/texture/casual15_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual15_f_20_hair_alpha.jpg';
                }
                if (temp === 20) {
                    textureURL = './Model/avatar/texture/casual16_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual16_f_30.jpg';
                }
                if (temp === 21) {
                    textureURL = './Model/avatar/texture/casual17_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/casual17_f_35_hair.jpg';
                }
                if (temp === 22) {
                    textureURL = './Model/avatar/texture/casual18_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual18_f_30.jpg';
                }
                if (temp === 23) {
                    textureURL = './Model/avatar/texture/casual19_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual19_f_20_hair.jpg';
                }
                if (temp === 24) {
                    textureURL = './Model/avatar/texture/casual20_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual20_f_25_hair.jpg';
                }
                if (temp === 25) {
                    textureURL = './Model/avatar/texture/casual21_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual21_f_30_hair.jpg';
                }
                if (temp === 26) {
                    textureURL = './Model/avatar/texture/casual22_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual22_f_25_hair.jpg';
                }
                if (temp === 27) {
                    textureURL = './Model/avatar/texture/casual23_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/casual23_f_35.jpg';
                }
                if (temp === 28) {
                    textureURL = './Model/avatar/texture/casual24_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual24_f_20_hair.jpg';
                }
                if (temp === 29) {
                    textureURL = './Model/avatar/texture/casual25_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual25_f_20.jpg';
                }
                if (temp === 30) {
                    textureURL = './Model/avatar/texture/casual26_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual26_f_25.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'run';
                newMesh.scene.visible = false;

                //人物骨骼参数化
                var headRandom =1 +  Math.random()* 4/number;
                var upperRandom1 = 1 + Math.random()*2/number;
                var upperRandom2 = 1 + Math.random()*3/number;
                var thighRandom = 1 + Math.random()*3/number;

                var head = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[2];
                var chest = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[0];
                var wist = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[4];
                var lThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[7];
                var lThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[8];
                var rThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[17];
                var rThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[18];

                head.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest.scale(new THREE.Vector3(upperRandom1, upperRandom1, 1));
                wist.scale(new THREE.Vector3(upperRandom2,  upperRandom2, 1));
                lThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 17;
                var distance1 = Math.random() * 26;
                newMesh.scene.position.set(distance + 43, -8.5, distance1 + 261);
                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var texture1 = loader.load(textureURL1, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                var material1 = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                // texture1.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                texture1.flipY = false;
                texture1.repeat.set(1, 1);
                material1.skinning = true;
                material1.map = texture1;
                newMesh.scene.children[0].children[3].children[0].material = material;
                newMesh.scene.children[0].children[3].children[1].material = material1;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupRun.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll1 = Promise.all(arr1).then((data) => {

            var temp, number;
            if(surplus>=10&&surplus<=20){
                number = multi * 10 + surplus - 10;
            }
            else if(surplus < 10){
                number = multi * 10;
            }
            else {
                number = multi *10 + 10;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 39;
                var newMesh, textureURL;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/business01_m_60.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/business02_m_35.jpg';
                }
                if (temp === 2) {
                    textureURL = './Model/avatar/texture/business03_m_35.jpg';
                }
                if (temp === 3) {
                    textureURL = './Model/avatar/texture/business04_m_35.jpg';
                }
                if (temp === 4) {
                    textureURL = './Model/avatar/texture/business05_m_25.jpg';
                }
                if (temp === 5) {
                    textureURL = './Model/avatar/texture/business06_m_25.jpg';
                }
                if (temp === 6) {
                    textureURL = './Model/avatar/texture/business07_m_25.jpg';
                }
                if (temp === 7) {
                    textureURL = './Model/avatar/texture/casual01_m_35.jpg';
                }
                if (temp === 8) {
                    textureURL = './Model/avatar/texture/casual02_m_25.jpg';
                }
                if (temp === 9) {
                    textureURL = './Model/avatar/texture/casual03_m_25.jpg';
                }
                if (temp === 10) {
                    textureURL = './Model/avatar/texture/casual04_m_25.jpg';
                }
                if (temp === 11) {
                    textureURL = './Model/avatar/texture/casual05_m_35.jpg';
                }
                if (temp === 12) {
                    textureURL = './Model/avatar/texture/casual06_m_25.jpg';
                }
                if (temp === 13) {
                    textureURL = './Model/avatar/texture/casual07_m_25.jpg';
                }
                if (temp === 14) {
                    textureURL = './Model/avatar/texture/casual08_m_30.jpg';
                }
                if (temp === 15) {
                    textureURL = './Model/avatar/texture/casual09_m_30.jpg';
                }
                if (temp === 16) {
                    textureURL = './Model/avatar/texture/casual10_m_30.jpg';
                }
                if (temp === 17) {
                    textureURL = './Model/avatar/texture/casual11_m_30.jpg';
                }
                if (temp === 18) {
                    textureURL = './Model/avatar/texture/casual12_m_30.jpg';
                }
                if (temp === 19) {
                    textureURL = './Model/avatar/texture/casual13_m_30.jpg';
                }
                if (temp === 20) {
                    textureURL = './Model/avatar/texture/casual14_m_30.jpg';
                }
                if (temp === 21) {
                    textureURL = './Model/avatar/texture/casual15_m_30.jpg';
                }
                if (temp === 22) {
                    textureURL = './Model/avatar/texture/casual16_m_35.jpg';
                }
                if (temp === 23) {
                    textureURL = './Model/avatar/texture/casual17_m_35.jpg';
                }
                if (temp === 24) {
                    textureURL = './Model/avatar/texture/casual18_m_35.jpg';
                }
                if (temp === 25) {
                    textureURL = './Model/avatar/texture/casual19_m_35.jpg';
                }
                if (temp === 26) {
                    textureURL = './Model/avatar/texture/casual20_m_20.jpg';
                }
                if (temp === 27) {
                    textureURL = './Model/avatar/texture/casual21_m_35.jpg';
                }
                if (temp === 28) {
                    textureURL = './Model/avatar/texture/casual22_m_35.jpg';
                }
                if (temp === 29) {
                    textureURL = './Model/avatar/texture/casual23_m_40.jpg';
                }
                if (temp === 30) {
                    textureURL = './Model/avatar/texture/casual24_m_40.jpg';
                }
                if (temp === 31) {
                    textureURL = './Model/avatar/texture/casual25_m_40.jpg';
                }
                if (temp === 32) {
                    textureURL = './Model/avatar/texture/casual26_m_40.jpg';
                }
                if (temp === 33) {
                    textureURL = './Model/avatar/texture/casual27_m_70.jpg';
                }
                if (temp === 34) {
                    textureURL = './Model/avatar/texture/casual28_m_70.jpg';
                }
                if (temp === 35) {
                    textureURL = './Model/avatar/texture/casual29_m_70.jpg';
                }
                if (temp === 36) {
                    textureURL = './Model/avatar/texture/casual30_m_30.jpg';
                }
                if (temp === 37) {
                    textureURL = './Model/avatar/texture/casual31_m_30.jpg';
                }
                if (temp === 38) {
                    textureURL = './Model/avatar/texture/casual32_m_25.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'run';
                newMesh.scene.visible = false;

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()/number;
                var upperRandom2 = 1 + Math.random()/number;
                var thighRandom = 1 + Math.random()/number;

                var head0 = newMesh.scene.children[0].children[3].skeleton.boneInverses[2];
                var chest0 = newMesh.scene.children[0].children[3].skeleton.boneInverses[0];
                var wist0 = newMesh.scene.children[0].children[3].skeleton.boneInverses[4];
                var lThigh10 = newMesh.scene.children[0].children[3].skeleton.boneInverses[8];
                var lThigh20 = newMesh.scene.children[0].children[3].skeleton.boneInverses[9];
                var rThigh10 = newMesh.scene.children[0].children[3].skeleton.boneInverses[5];
                var rThigh20 = newMesh.scene.children[0].children[3].skeleton.boneInverses[18];


                head0.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest0.scale(new THREE.Vector3(upperRandom1, upperRandom1, 1));
                wist0.scale(new THREE.Vector3(upperRandom2,  upperRandom2, 1));
                rThigh10.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh20.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh10.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh20.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 17;
                var distance1 = Math.random() * 26;
                newMesh.scene.position.set(distance+43, -8.5, distance1+261);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                newMesh.scene.children[0].children[3].material = material;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupRun.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll2 = Promise.all(arr2).then((data) => {

            var temp, number;
            if(surplus>=20&&surplus<=21){
                number = multi + surplus - 20;
            }
            else if(surplus < 20){
                number = multi;
            }
            else {
                number = multi + 1;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 2;
                var newMesh, textureURL, textureURL1;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/child01_f.jpg';
                    textureURL1 = './Model/avatar/texture/child01_f_hair.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/child02_f.jpg';
                    textureURL1 = './Model/avatar/texture/child02_f_hair.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'run';
                newMesh.scene.visible = false;

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()/number;
                var upperRandom2 = 1 + Math.random()*0.5/number;
                var thighRandom = 1 + Math.random()*0.5/number;

                var head = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[4];
                var chest = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[0];
                var wist = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[1];
                var lThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[9];
                var lThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[18];
                var rThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[8];
                var rThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[10];

                head.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest.scale(new THREE.Vector3(upperRandom1, 1, 1));
                wist.scale(new THREE.Vector3(upperRandom2,  upperRandom2, 1));
                lThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 17;
                var distance1 = Math.random() * 26;
                newMesh.scene.position.set(distance+43, -8.5, distance1+261);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var texture1 = loader.load(textureURL1, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                var material1 = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                // texture1.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                texture1.flipY = false;
                texture1.repeat.set(1, 1);
                material1.skinning = true;
                material1.map = texture1;
                newMesh.scene.children[0].children[3].children[0].material = material;
                newMesh.scene.children[0].children[3].children[1].material = material1;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupRun.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll3 = Promise.all(arr3).then((data) => {

            var temp, number;
            if(surplus>=21&&surplus<=22){
                number = multi + surplus - 21;
            }
            else if(surplus < 21){
                number = multi ;
            }
            else {
                number = multi+ 1;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 2;
                var newMesh, textureURL;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/child01_m.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/child02_m.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'run';
                newMesh.scene.visible = false;

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()/number;
                var upperRandom2 = 1 + Math.random()*0.5/number;
                var thighRandom = 1 + Math.random()*0.5/number;

                var head = newMesh.scene.children[0].children[3].skeleton.boneInverses[2];
                var chest = newMesh.scene.children[0].children[3].skeleton.boneInverses[0];
                var wist = newMesh.scene.children[0].children[3].skeleton.boneInverses[4];
                var lThigh1 = newMesh.scene.children[0].children[3].skeleton.boneInverses[7];
                var lThigh2 = newMesh.scene.children[0].children[3].skeleton.boneInverses[8];
                var rThigh1 = newMesh.scene.children[0].children[3].skeleton.boneInverses[18];
                var rThigh2 = newMesh.scene.children[0].children[3].skeleton.boneInverses[13];

                head.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest.scale(new THREE.Vector3(upperRandom1, 1, 1));
                wist.scale(new THREE.Vector3(upperRandom2, upperRandom2, 1));
                lThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 17;
                var distance1 = Math.random() * 26;
                newMesh.scene.position.set(distance+43, -8.5, distance1+261);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                newMesh.scene.children[0].children[3].material = material;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupRun.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll4 = Promise.all(arr4).then((data) => {

            var temp, number;
            if(surplus>=22&&surplus<=32){
                number = multi * 10 + surplus - 22;
            }
            else if(surplus < 22){
                number = multi * 10;
            }
            else {
                number = multi *10 + 10;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 31;
                var newMesh, textureURL, textureURL1;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/business01_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/business01_f_30_hair.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/business02_f_50.jpg';
                    textureURL1 = './Model/avatar/texture/business02_f_50.jpg';
                }
                if (temp === 2) {
                    textureURL = './Model/avatar/texture/business03_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/business03_f_25.jpg';
                }
                if (temp === 3) {
                    textureURL = './Model/avatar/texture/business04_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/business04_f_25_hair.jpg';
                }
                if (temp === 4) {
                    textureURL = './Model/avatar/texture/business05_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/business05_f_35.jpg';
                }
                if (temp === 5) {
                    textureURL = './Model/avatar/texture/casual01_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual01_f_20_hair.jpg';
                }
                if (temp === 6) {
                    textureURL = './Model/avatar/texture/casual02_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual02_f_25.jpg';
                }
                if (temp === 7) {
                    textureURL = './Model/avatar/texture/casual03_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual03_f_25_hair_alpha.jpg';
                }
                if (temp === 8) {
                    textureURL = './Model/avatar/texture/casual04_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual04_f_30.jpg';
                }
                if (temp === 9) {
                    textureURL = './Model/avatar/texture/casual05_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual05_f_25_hair.jpg';
                }
                if (temp === 10) {
                    textureURL = './Model/avatar/texture/casual06_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual06_f_hair_alpha.jpg';
                }
                if (temp === 11) {
                    textureURL = './Model/avatar/texture/casual07_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual07_f_20_hair.jpg';
                }
                if (temp === 12) {
                    textureURL = './Model/avatar/texture/casual08_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual08_f_25_hair.jpg';
                }
                if (temp === 13) {
                    textureURL = './Model/avatar/texture/casual09_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual09_f_25.jpg';
                }
                if (temp === 14) {
                    textureURL = './Model/avatar/texture/casual10_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual10_f_30_hair.jpg';
                }
                if (temp === 15) {
                    textureURL = './Model/avatar/texture/casual11_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual11_f_30_hair.jpg';
                }
                if (temp === 16) {
                    textureURL = './Model/avatar/texture/casual12_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual12_f_30_hair.jpg';
                }
                if (temp === 17) {
                    textureURL = './Model/avatar/texture/casual13_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual13_f_30_hair.jpg';
                }
                if (temp === 18) {
                    textureURL = './Model/avatar/texture/casual14_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual14_f_25_hair.jpg';
                }
                if (temp === 19) {
                    textureURL = './Model/avatar/texture/casual15_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual15_f_20_hair_alpha.jpg';
                }
                if (temp === 20) {
                    textureURL = './Model/avatar/texture/casual16_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual16_f_30.jpg';
                }
                if (temp === 21) {
                    textureURL = './Model/avatar/texture/casual17_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/casual17_f_35_hair.jpg';
                }
                if (temp === 22) {
                    textureURL = './Model/avatar/texture/casual18_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual18_f_30.jpg';
                }
                if (temp === 23) {
                    textureURL = './Model/avatar/texture/casual19_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual19_f_20_hair.jpg';
                }
                if (temp === 24) {
                    textureURL = './Model/avatar/texture/casual20_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual20_f_25_hair.jpg';
                }
                if (temp === 25) {
                    textureURL = './Model/avatar/texture/casual21_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual21_f_30_hair.jpg';
                }
                if (temp === 26) {
                    textureURL = './Model/avatar/texture/casual22_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual22_f_25_hair.jpg';
                }
                if (temp === 27) {
                    textureURL = './Model/avatar/texture/casual23_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/casual23_f_35.jpg';
                }
                if (temp === 28) {
                    textureURL = './Model/avatar/texture/casual24_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual24_f_20_hair.jpg';
                }
                if (temp === 29) {
                    textureURL = './Model/avatar/texture/casual25_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual25_f_20.jpg';
                }
                if (temp === 30) {
                    textureURL = './Model/avatar/texture/casual26_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual26_f_25.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'walk';
                newMesh.scene.visible = false;
                newMesh.scene.rotation.set(0, Math.PI*13/48, 0);

                //人物骨骼参数化
                var headRandom =1 +  Math.random()* 4/number;
                var upperRandom1 = 1 + Math.random()*2/number;
                var upperRandom2 = 1 + Math.random()*3/number;
                var thighRandom = 1 + Math.random()*3/number;

                var head = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[2];
                var chest = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[0];
                var wist = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[4];
                var lThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[7];
                var lThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[8];
                var rThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[17];
                var rThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[18];

                head.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest.scale(new THREE.Vector3(upperRandom1, upperRandom1, 1));
                wist.scale(new THREE.Vector3(upperRandom2,  upperRandom2, 1));
                lThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 15;
                var distance1 = Math.random() * 20;
                newMesh.scene.position.set(distance+40, -8.5, distance1+241);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var texture1 = loader.load(textureURL1, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                var material1 = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                // texture1.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                texture1.flipY = false;
                texture1.repeat.set(1, 1);
                material1.skinning = true;
                material1.map = texture1;
                newMesh.scene.children[0].children[3].children[0].material = material;
                newMesh.scene.children[0].children[3].children[1].material = material1;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupWalk.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll5 = Promise.all(arr5).then((data) => {

            var temp, number;
            if(surplus>=32&&surplus<=42){
                number = multi * 10 + surplus - 32;
            }
            else if(surplus < 32){
                number = multi * 10;
            }
            else {
                number = multi *10 + 10;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 39;
                var newMesh, textureURL;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/business01_m_60.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/business02_m_35.jpg';
                }
                if (temp === 2) {
                    textureURL = './Model/avatar/texture/business03_m_35.jpg';
                }
                if (temp === 3) {
                    textureURL = './Model/avatar/texture/business04_m_35.jpg';
                }
                if (temp === 4) {
                    textureURL = './Model/avatar/texture/business05_m_25.jpg';
                }
                if (temp === 5) {
                    textureURL = './Model/avatar/texture/business06_m_25.jpg';
                }
                if (temp === 6) {
                    textureURL = './Model/avatar/texture/business07_m_25.jpg';
                }
                if (temp === 7) {
                    textureURL = './Model/avatar/texture/casual01_m_35.jpg';
                }
                if (temp === 8) {
                    textureURL = './Model/avatar/texture/casual02_m_25.jpg';
                }
                if (temp === 9) {
                    textureURL = './Model/avatar/texture/casual03_m_25.jpg';
                }
                if (temp === 10) {
                    textureURL = './Model/avatar/texture/casual04_m_25.jpg';
                }
                if (temp === 11) {
                    textureURL = './Model/avatar/texture/casual05_m_35.jpg';
                }
                if (temp === 12) {
                    textureURL = './Model/avatar/texture/casual06_m_25.jpg';
                }
                if (temp === 13) {
                    textureURL = './Model/avatar/texture/casual07_m_25.jpg';
                }
                if (temp === 14) {
                    textureURL = './Model/avatar/texture/casual08_m_30.jpg';
                }
                if (temp === 15) {
                    textureURL = './Model/avatar/texture/casual09_m_30.jpg';
                }
                if (temp === 16) {
                    textureURL = './Model/avatar/texture/casual10_m_30.jpg';
                }
                if (temp === 17) {
                    textureURL = './Model/avatar/texture/casual11_m_30.jpg';
                }
                if (temp === 18) {
                    textureURL = './Model/avatar/texture/casual12_m_30.jpg';
                }
                if (temp === 19) {
                    textureURL = './Model/avatar/texture/casual13_m_30.jpg';
                }
                if (temp === 20) {
                    textureURL = './Model/avatar/texture/casual14_m_30.jpg';
                }
                if (temp === 21) {
                    textureURL = './Model/avatar/texture/casual15_m_30.jpg';
                }
                if (temp === 22) {
                    textureURL = './Model/avatar/texture/casual16_m_35.jpg';
                }
                if (temp === 23) {
                    textureURL = './Model/avatar/texture/casual17_m_35.jpg';
                }
                if (temp === 24) {
                    textureURL = './Model/avatar/texture/casual18_m_35.jpg';
                }
                if (temp === 25) {
                    textureURL = './Model/avatar/texture/casual19_m_35.jpg';
                }
                if (temp === 26) {
                    textureURL = './Model/avatar/texture/casual20_m_20.jpg';
                }
                if (temp === 27) {
                    textureURL = './Model/avatar/texture/casual21_m_35.jpg';
                }
                if (temp === 28) {
                    textureURL = './Model/avatar/texture/casual22_m_35.jpg';
                }
                if (temp === 29) {
                    textureURL = './Model/avatar/texture/casual23_m_40.jpg';
                }
                if (temp === 30) {
                    textureURL = './Model/avatar/texture/casual24_m_40.jpg';
                }
                if (temp === 31) {
                    textureURL = './Model/avatar/texture/casual25_m_40.jpg';
                }
                if (temp === 32) {
                    textureURL = './Model/avatar/texture/casual26_m_40.jpg';
                }
                if (temp === 33) {
                    textureURL = './Model/avatar/texture/casual27_m_70.jpg';
                }
                if (temp === 34) {
                    textureURL = './Model/avatar/texture/casual28_m_70.jpg';
                }
                if (temp === 35) {
                    textureURL = './Model/avatar/texture/casual29_m_70.jpg';
                }
                if (temp === 36) {
                    textureURL = './Model/avatar/texture/casual30_m_30.jpg';
                }
                if (temp === 37) {
                    textureURL = './Model/avatar/texture/casual31_m_30.jpg';
                }
                if (temp === 38) {
                    textureURL = './Model/avatar/texture/casual32_m_25.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'walk';
                newMesh.scene.visible = false;
                newMesh.scene.rotation.set(0, Math.PI*13/48, 0);

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()/number;
                var upperRandom2 = 1 + Math.random()/number;
                var thighRandom = 1 + Math.random()/number;

                var head0 = newMesh.scene.children[0].children[2].skeleton.boneInverses[2];
                var chest0 = newMesh.scene.children[0].children[2].skeleton.boneInverses[0];
                var wist0 = newMesh.scene.children[0].children[2].skeleton.boneInverses[4];
                var lThigh10 = newMesh.scene.children[0].children[2].skeleton.boneInverses[8];
                var lThigh20 = newMesh.scene.children[0].children[2].skeleton.boneInverses[9];
                var rThigh10 = newMesh.scene.children[0].children[2].skeleton.boneInverses[5];
                var rThigh20 = newMesh.scene.children[0].children[2].skeleton.boneInverses[18];

                head0.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest0.scale(new THREE.Vector3(upperRandom1, upperRandom1, 1));
                wist0.scale(new THREE.Vector3(upperRandom2,  upperRandom2, 1));
                rThigh10.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh20.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh10.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh20.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 15;
                var distance1 = Math.random() * 20;
                newMesh.scene.position.set(distance+40, -8.5, distance1+241);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                newMesh.scene.children[0].children[2].material = material;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupWalk.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll6 = Promise.all(arr6).then((data) => {

            var temp, number;
            if(surplus>=42&&surplus<=43){
                number = multi + surplus - 42;
            }
            else if(surplus < 42){
                number = multi;
            }
            else {
                number = multi + 1;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 2;
                var newMesh, textureURL;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (i % 2 === 0) {
                    textureURL = './Model/avatar/texture/granny01.jpg';
                }
                if (i % 2 === 1) {
                    textureURL = './Model/avatar/texture/granny02.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'walk';
                newMesh.scene.visible = false;
                newMesh.scene.rotation.set(0, Math.PI*13/48, 0);

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()*0.5/number;
                var upperRandom2 = 1 + Math.random()*0.5/number;
                var upperRandom3 = 1 + Math.random()*0.5/number;

                var head = newMesh.scene.children[0].children[3].skeleton.boneInverses[9];
                var chest = newMesh.scene.children[0].children[3].skeleton.boneInverses[7];
                var wist = newMesh.scene.children[0].children[3].skeleton.boneInverses[1];
                var hip = newMesh.scene.children[0].children[3].skeleton.boneInverses[0];

                head.scale(new THREE.Vector3(headRandom, 1+(headRandom-1)/3, 1));
                chest.scale(new THREE.Vector3(upperRandom1, 1, 1));
                wist.scale(new THREE.Vector3(upperRandom2, upperRandom2, 1));
                hip.scale(new THREE.Vector3(upperRandom3, upperRandom3, 1));

                //动态人群位置
                var distance = Math.random() * 15;
                var distance1 = Math.random() * 20;
                newMesh.scene.position.set(distance+40, -8.5, distance1+241);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                newMesh.scene.children[0].children[3].material = material;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupWalk.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll7 = Promise.all(arr7).then((data) => {

            var temp, number;
            if(surplus>=43&&surplus<=53){
                number = multi * 10 + surplus - 43;
            }
            else if(surplus < 43){
                number = multi * 10;
            }
            else {
                number = multi * 10 + 10;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 31;
                var newMesh, textureURL, textureURL1;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/business01_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/business01_f_30_hair.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/business02_f_50.jpg';
                    textureURL1 = './Model/avatar/texture/business02_f_50.jpg';
                }
                if (temp === 2) {
                    textureURL = './Model/avatar/texture/business03_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/business03_f_25.jpg';
                }
                if (temp === 3) {
                    textureURL = './Model/avatar/texture/business04_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/business04_f_25_hair.jpg';
                }
                if (temp === 4) {
                    textureURL = './Model/avatar/texture/business05_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/business05_f_35.jpg';
                }
                if (temp === 5) {
                    textureURL = './Model/avatar/texture/casual01_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual01_f_20_hair.jpg';
                }
                if (temp === 6) {
                    textureURL = './Model/avatar/texture/casual02_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual02_f_25.jpg';
                }
                if (temp === 7) {
                    textureURL = './Model/avatar/texture/casual03_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual03_f_25_hair_alpha.jpg';
                }
                if (temp === 8) {
                    textureURL = './Model/avatar/texture/casual04_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual04_f_30.jpg';
                }
                if (temp === 9) {
                    textureURL = './Model/avatar/texture/casual05_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual05_f_25_hair.jpg';
                }
                if (temp === 10) {
                    textureURL = './Model/avatar/texture/casual06_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual06_f_hair_alpha.jpg';
                }
                if (temp === 11) {
                    textureURL = './Model/avatar/texture/casual07_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual07_f_20_hair.jpg';
                }
                if (temp === 12) {
                    textureURL = './Model/avatar/texture/casual08_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual08_f_25_hair.jpg';
                }
                if (temp === 13) {
                    textureURL = './Model/avatar/texture/casual09_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual09_f_25.jpg';
                }
                if (temp === 14) {
                    textureURL = './Model/avatar/texture/casual10_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual10_f_30_hair.jpg';
                }
                if (temp === 15) {
                    textureURL = './Model/avatar/texture/casual11_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual11_f_30_hair.jpg';
                }
                if (temp === 16) {
                    textureURL = './Model/avatar/texture/casual12_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual12_f_30_hair.jpg';
                }
                if (temp === 17) {
                    textureURL = './Model/avatar/texture/casual13_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual13_f_30_hair.jpg';
                }
                if (temp === 18) {
                    textureURL = './Model/avatar/texture/casual14_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual14_f_25_hair.jpg';
                }
                if (temp === 19) {
                    textureURL = './Model/avatar/texture/casual15_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual15_f_20_hair_alpha.jpg';
                }
                if (temp === 20) {
                    textureURL = './Model/avatar/texture/casual16_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual16_f_30.jpg';
                }
                if (temp === 21) {
                    textureURL = './Model/avatar/texture/casual17_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/casual17_f_35_hair.jpg';
                }
                if (temp === 22) {
                    textureURL = './Model/avatar/texture/casual18_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual18_f_30.jpg';
                }
                if (temp === 23) {
                    textureURL = './Model/avatar/texture/casual19_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual19_f_20_hair.jpg';
                }
                if (temp === 24) {
                    textureURL = './Model/avatar/texture/casual20_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual20_f_25_hair.jpg';
                }
                if (temp === 25) {
                    textureURL = './Model/avatar/texture/casual21_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual21_f_30_hair.jpg';
                }
                if (temp === 26) {
                    textureURL = './Model/avatar/texture/casual22_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual22_f_25_hair.jpg';
                }
                if (temp === 27) {
                    textureURL = './Model/avatar/texture/casual23_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/casual23_f_35.jpg';
                }
                if (temp === 28) {
                    textureURL = './Model/avatar/texture/casual24_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual24_f_20_hair.jpg';
                }
                if (temp === 29) {
                    textureURL = './Model/avatar/texture/casual25_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual25_f_20.jpg';
                }
                if (temp === 30) {
                    textureURL = './Model/avatar/texture/casual26_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual26_f_25.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'bend';
                newMesh.scene.visible = false;
                newMesh.scene.rotation.set(0, Math.PI/4, 0);

                //人物骨骼参数化
                var headRandom =1 +  Math.random()* 4/number;
                var upperRandom1 = 1 + Math.random()*2/number;
                var upperRandom2 = 1 + Math.random()*3/number;
                var thighRandom = 1 + Math.random()*3/number;

                var head = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[2];
                var chest = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[0];
                var wist = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[4];
                var lThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[7];
                var lThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[8];
                var rThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[17];
                var rThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[18];

                head.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest.scale(new THREE.Vector3(upperRandom1, upperRandom1, 1));
                wist.scale(new THREE.Vector3(upperRandom2,  upperRandom2, 1));
                lThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 15;
                var distance1 = Math.random() * 20;
                newMesh.scene.position.set(distance+40, -8.5, distance1+222);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var texture1 = loader.load(textureURL1, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                var material1 = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                // texture1.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                texture1.flipY = false;
                texture1.repeat.set(1, 1);
                material1.skinning = true;
                material1.map = texture1;
                newMesh.scene.children[0].children[3].children[0].material = material;
                newMesh.scene.children[0].children[3].children[1].material = material1;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupBend.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll8 = Promise.all(arr8).then((data) => {

            var temp, number;
            if(surplus>=53&&surplus<=63){
                number = multi * 10 + surplus - 53;
            }
            else if(surplus < 53){
                number = multi * 10;
            }
            else {
                number = multi * 10 + 10;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 39;
                var newMesh, textureURL;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/business01_m_60.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/business02_m_35.jpg';
                }
                if (temp === 2) {
                    textureURL = './Model/avatar/texture/business03_m_35.jpg';
                }
                if (temp === 3) {
                    textureURL = './Model/avatar/texture/business04_m_35.jpg';
                }
                if (temp === 4) {
                    textureURL = './Model/avatar/texture/business05_m_25.jpg';
                }
                if (temp === 5) {
                    textureURL = './Model/avatar/texture/business06_m_25.jpg';
                }
                if (temp === 6) {
                    textureURL = './Model/avatar/texture/business07_m_25.jpg';
                }
                if (temp === 7) {
                    textureURL = './Model/avatar/texture/casual01_m_35.jpg';
                }
                if (temp === 8) {
                    textureURL = './Model/avatar/texture/casual02_m_25.jpg';
                }
                if (temp === 9) {
                    textureURL = './Model/avatar/texture/casual03_m_25.jpg';
                }
                if (temp === 10) {
                    textureURL = './Model/avatar/texture/casual04_m_25.jpg';
                }
                if (temp === 11) {
                    textureURL = './Model/avatar/texture/casual05_m_35.jpg';
                }
                if (temp === 12) {
                    textureURL = './Model/avatar/texture/casual06_m_25.jpg';
                }
                if (temp === 13) {
                    textureURL = './Model/avatar/texture/casual07_m_25.jpg';
                }
                if (temp === 14) {
                    textureURL = './Model/avatar/texture/casual08_m_30.jpg';
                }
                if (temp === 15) {
                    textureURL = './Model/avatar/texture/casual09_m_30.jpg';
                }
                if (temp === 16) {
                    textureURL = './Model/avatar/texture/casual10_m_30.jpg';
                }
                if (temp === 17) {
                    textureURL = './Model/avatar/texture/casual11_m_30.jpg';
                }
                if (temp === 18) {
                    textureURL = './Model/avatar/texture/casual12_m_30.jpg';
                }
                if (temp === 19) {
                    textureURL = './Model/avatar/texture/casual13_m_30.jpg';
                }
                if (temp === 20) {
                    textureURL = './Model/avatar/texture/casual14_m_30.jpg';
                }
                if (temp === 21) {
                    textureURL = './Model/avatar/texture/casual15_m_30.jpg';
                }
                if (temp === 22) {
                    textureURL = './Model/avatar/texture/casual16_m_35.jpg';
                }
                if (temp === 23) {
                    textureURL = './Model/avatar/texture/casual17_m_35.jpg';
                }
                if (temp === 24) {
                    textureURL = './Model/avatar/texture/casual18_m_35.jpg';
                }
                if (temp === 25) {
                    textureURL = './Model/avatar/texture/casual19_m_35.jpg';
                }
                if (temp === 26) {
                    textureURL = './Model/avatar/texture/casual20_m_20.jpg';
                }
                if (temp === 27) {
                    textureURL = './Model/avatar/texture/casual21_m_35.jpg';
                }
                if (temp === 28) {
                    textureURL = './Model/avatar/texture/casual22_m_35.jpg';
                }
                if (temp === 29) {
                    textureURL = './Model/avatar/texture/casual23_m_40.jpg';
                }
                if (temp === 30) {
                    textureURL = './Model/avatar/texture/casual24_m_40.jpg';
                }
                if (temp === 31) {
                    textureURL = './Model/avatar/texture/casual25_m_40.jpg';
                }
                if (temp === 32) {
                    textureURL = './Model/avatar/texture/casual26_m_40.jpg';
                }
                if (temp === 33) {
                    textureURL = './Model/avatar/texture/casual27_m_70.jpg';
                }
                if (temp === 34) {
                    textureURL = './Model/avatar/texture/casual28_m_70.jpg';
                }
                if (temp === 35) {
                    textureURL = './Model/avatar/texture/casual29_m_70.jpg';
                }
                if (temp === 36) {
                    textureURL = './Model/avatar/texture/casual30_m_30.jpg';
                }
                if (temp === 37) {
                    textureURL = './Model/avatar/texture/casual31_m_30.jpg';
                }
                if (temp === 38) {
                    textureURL = './Model/avatar/texture/casual32_m_25.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'bend';
                newMesh.scene.visible = false;
                newMesh.scene.rotation.set(0, Math.PI/4, 0);

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()/number;
                var upperRandom2 = 1 + Math.random()/number;
                var thighRandom = 1 + Math.random()/number;

                var head0 = newMesh.scene.children[0].children[2].skeleton.boneInverses[2];
                var chest0 = newMesh.scene.children[0].children[2].skeleton.boneInverses[0];
                var wist0 = newMesh.scene.children[0].children[2].skeleton.boneInverses[4];
                var lThigh10 = newMesh.scene.children[0].children[2].skeleton.boneInverses[8];
                var lThigh20 = newMesh.scene.children[0].children[2].skeleton.boneInverses[9];
                var rThigh10 = newMesh.scene.children[0].children[2].skeleton.boneInverses[5];
                var rThigh20 = newMesh.scene.children[0].children[2].skeleton.boneInverses[18];

                head0.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest0.scale(new THREE.Vector3(upperRandom1, upperRandom1, 1));
                wist0.scale(new THREE.Vector3(upperRandom2,  upperRandom2, 1));
                rThigh10.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh20.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh10.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh20.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 15;
                var distance1 = Math.random() * 20;
                newMesh.scene.position.set(distance+40, -8.5, distance1+222);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                newMesh.scene.children[0].children[2].material = material;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupBend.push(newMesh.scene);
                _this.scene.add(newMesh.scene);
            }
        });

        var promiseAll9 = Promise.all(arr9).then((data) => {

            var temp, number;
            if(surplus>=63&&surplus<=64){
                number = multi + surplus - 63;
            }
            else if(surplus < 63){
                number = multi;
            }
            else {
                number = multi + 1;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 2;
                var newMesh, textureURL;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (i % 2 === 0) {
                    textureURL = './Model/avatar/texture/granny01.jpg';
                }
                if (i % 2 === 1) {
                    textureURL = './Model/avatar/texture/granny02.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'bend';
                newMesh.scene.visible = false;
                newMesh.scene.rotation.set(0, Math.PI/4, 0);

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()*0.5/number;
                var upperRandom2 = 1 + Math.random()*0.5/number;
                var upperRandom3 = 1 + Math.random()*0.5/number;

                var head = newMesh.scene.children[0].children[3].skeleton.boneInverses[9];
                var chest = newMesh.scene.children[0].children[3].skeleton.boneInverses[7];
                var wist = newMesh.scene.children[0].children[3].skeleton.boneInverses[1];
                var hip = newMesh.scene.children[0].children[3].skeleton.boneInverses[0];

                head.scale(new THREE.Vector3(headRandom, 1+(headRandom-1)/3, 1));
                chest.scale(new THREE.Vector3(upperRandom1, 1, 1));
                wist.scale(new THREE.Vector3(upperRandom2, upperRandom2, 1));
                hip.scale(new THREE.Vector3(upperRandom3, upperRandom3, 1));


                //动态人群位置
                var distance = Math.random() * 15;
                var distance1 = Math.random() * 20;
                newMesh.scene.position.set(distance+40, -8.5, distance1+222);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                newMesh.scene.children[0].children[3].material = material;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupBend.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll10 = Promise.all(arr10).then((data) => {

            var temp, number;
            if(surplus>=64&&surplus<=74){
                number = multi * 10 + surplus - 64;
            }
            else if(surplus < 64){
                number = multi * 10;
            }
            else {
                number = multi * 10 + 10;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {

                temp = i % 31;
                var newMesh, textureURL, textureURL1;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/business01_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/business01_f_30_hair.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/business02_f_50.jpg';
                    textureURL1 = './Model/avatar/texture/business02_f_50.jpg';
                }
                if (temp === 2) {
                    textureURL = './Model/avatar/texture/business03_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/business03_f_25.jpg';
                }
                if (temp === 3) {
                    textureURL = './Model/avatar/texture/business04_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/business04_f_25_hair.jpg';
                }
                if (temp === 4) {
                    textureURL = './Model/avatar/texture/business05_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/business05_f_35.jpg';
                }
                if (temp === 5) {
                    textureURL = './Model/avatar/texture/casual01_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual01_f_20_hair.jpg';
                }
                if (temp === 6) {
                    textureURL = './Model/avatar/texture/casual02_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual02_f_25.jpg';
                }
                if (temp === 7) {
                    textureURL = './Model/avatar/texture/casual03_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual03_f_25_hair_alpha.jpg';
                }
                if (temp === 8) {
                    textureURL = './Model/avatar/texture/casual04_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual04_f_30.jpg';
                }
                if (temp === 9) {
                    textureURL = './Model/avatar/texture/casual05_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual05_f_25_hair.jpg';
                }
                if (temp === 10) {
                    textureURL = './Model/avatar/texture/casual06_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual06_f_hair_alpha.jpg';
                }
                if (temp === 11) {
                    textureURL = './Model/avatar/texture/casual07_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual07_f_20_hair.jpg';
                }
                if (temp === 12) {
                    textureURL = './Model/avatar/texture/casual08_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual08_f_25_hair.jpg';
                }
                if (temp === 13) {
                    textureURL = './Model/avatar/texture/casual09_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual09_f_25.jpg';
                }
                if (temp === 14) {
                    textureURL = './Model/avatar/texture/casual10_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual10_f_30_hair.jpg';
                }
                if (temp === 15) {
                    textureURL = './Model/avatar/texture/casual11_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual11_f_30_hair.jpg';
                }
                if (temp === 16) {
                    textureURL = './Model/avatar/texture/casual12_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual12_f_30_hair.jpg';
                }
                if (temp === 17) {
                    textureURL = './Model/avatar/texture/casual13_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual13_f_30_hair.jpg';
                }
                if (temp === 18) {
                    textureURL = './Model/avatar/texture/casual14_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual14_f_25_hair.jpg';
                }
                if (temp === 19) {
                    textureURL = './Model/avatar/texture/casual15_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual15_f_20_hair_alpha.jpg';
                }
                if (temp === 20) {
                    textureURL = './Model/avatar/texture/casual16_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual16_f_30.jpg';
                }
                if (temp === 21) {
                    textureURL = './Model/avatar/texture/casual17_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/casual17_f_35_hair.jpg';
                }
                if (temp === 22) {
                    textureURL = './Model/avatar/texture/casual18_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual18_f_30.jpg';
                }
                if (temp === 23) {
                    textureURL = './Model/avatar/texture/casual19_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual19_f_20_hair.jpg';
                }
                if (temp === 24) {
                    textureURL = './Model/avatar/texture/casual20_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual20_f_25_hair.jpg';
                }
                if (temp === 25) {
                    textureURL = './Model/avatar/texture/casual21_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual21_f_30_hair.jpg';
                }
                if (temp === 26) {
                    textureURL = './Model/avatar/texture/casual22_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual22_f_25_hair.jpg';
                }
                if (temp === 27) {
                    textureURL = './Model/avatar/texture/casual23_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/casual23_f_35.jpg';
                }
                if (temp === 28) {
                    textureURL = './Model/avatar/texture/casual24_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual24_f_20_hair.jpg';
                }
                if (temp === 29) {
                    textureURL = './Model/avatar/texture/casual25_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual25_f_20.jpg';
                }
                if (temp === 30) {
                    textureURL = './Model/avatar/texture/casual26_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual26_f_25.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'crawl';
                newMesh.scene.visible = false;
                newMesh.scene.rotation.set(0, Math.PI*4/5, 0);

                //动态人群位置
                var distance = Math.random() * 17;
                var distance1 = Math.random() * 26;
                newMesh.scene.position.set(distance+43, -8.5, distance1+197);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var texture1 = loader.load(textureURL1, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                var material1 = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                // texture1.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                texture1.flipY = false;
                texture1.repeat.set(1, 1);
                material1.skinning = true;
                material1.map = texture1;
                newMesh.scene.children[0].children[3].children[0].material = material;
                newMesh.scene.children[0].children[3].children[1].material = material1;

                //人物骨骼参数化
                var headRandom =1 +  Math.random()* 4/number;
                var upperRandom1 = 1 + Math.random()*2/number;
                var upperRandom2 = 1 + Math.random()*3/number;
                var thighRandom = 1 + Math.random()*3/number;

                var head = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[2];
                var chest = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[0];
                var wist = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[4];
                var lThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[7];
                var lThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[8];
                var rThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[17];
                var rThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[18];

                head.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest.scale(new THREE.Vector3(upperRandom1, upperRandom1, 1));
                wist.scale(new THREE.Vector3(upperRandom2,  upperRandom2, 1));
                lThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupCrawl.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll11 = Promise.all(arr11).then((data) => {

            var temp, number;
            if(surplus>=74&&surplus<=84){
                number = multi * 10 + surplus - 78;
            }
            else if(surplus < 74){
                number = multi * 10;
            }
            else {
                number = multi * 10 + 10;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 39;
                var newMesh, textureURL;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/business01_m_60.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/business02_m_35.jpg';
                }
                if (temp === 2) {
                    textureURL = './Model/avatar/texture/business03_m_35.jpg';
                }
                if (temp === 3) {
                    textureURL = './Model/avatar/texture/business04_m_35.jpg';
                }
                if (temp === 4) {
                    textureURL = './Model/avatar/texture/business05_m_25.jpg';
                }
                if (temp === 5) {
                    textureURL = './Model/avatar/texture/business06_m_25.jpg';
                }
                if (temp === 6) {
                    textureURL = './Model/avatar/texture/business07_m_25.jpg';
                }
                if (temp === 7) {
                    textureURL = './Model/avatar/texture/casual01_m_35.jpg';
                }
                if (temp === 8) {
                    textureURL = './Model/avatar/texture/casual02_m_25.jpg';
                }
                if (temp === 9) {
                    textureURL = './Model/avatar/texture/casual03_m_25.jpg';
                }
                if (temp === 10) {
                    textureURL = './Model/avatar/texture/casual04_m_25.jpg';
                }
                if (temp === 11) {
                    textureURL = './Model/avatar/texture/casual05_m_35.jpg';
                }
                if (temp === 12) {
                    textureURL = './Model/avatar/texture/casual06_m_25.jpg';
                }
                if (temp === 13) {
                    textureURL = './Model/avatar/texture/casual07_m_25.jpg';
                }
                if (temp === 14) {
                    textureURL = './Model/avatar/texture/casual08_m_30.jpg';
                }
                if (temp === 15) {
                    textureURL = './Model/avatar/texture/casual09_m_30.jpg';
                }
                if (temp === 16) {
                    textureURL = './Model/avatar/texture/casual10_m_30.jpg';
                }
                if (temp === 17) {
                    textureURL = './Model/avatar/texture/casual11_m_30.jpg';
                }
                if (temp === 18) {
                    textureURL = './Model/avatar/texture/casual12_m_30.jpg';
                }
                if (temp === 19) {
                    textureURL = './Model/avatar/texture/casual13_m_30.jpg';
                }
                if (temp === 20) {
                    textureURL = './Model/avatar/texture/casual14_m_30.jpg';
                }
                if (temp === 21) {
                    textureURL = './Model/avatar/texture/casual15_m_30.jpg';
                }
                if (temp === 22) {
                    textureURL = './Model/avatar/texture/casual16_m_35.jpg';
                }
                if (temp === 23) {
                    textureURL = './Model/avatar/texture/casual17_m_35.jpg';
                }
                if (temp === 24) {
                    textureURL = './Model/avatar/texture/casual18_m_35.jpg';
                }
                if (temp === 25) {
                    textureURL = './Model/avatar/texture/casual19_m_35.jpg';
                }
                if (temp === 26) {
                    textureURL = './Model/avatar/texture/casual20_m_20.jpg';
                }
                if (temp === 27) {
                    textureURL = './Model/avatar/texture/casual21_m_35.jpg';
                }
                if (temp === 28) {
                    textureURL = './Model/avatar/texture/casual22_m_35.jpg';
                }
                if (temp === 29) {
                    textureURL = './Model/avatar/texture/casual23_m_40.jpg';
                }
                if (temp === 30) {
                    textureURL = './Model/avatar/texture/casual24_m_40.jpg';
                }
                if (temp === 31) {
                    textureURL = './Model/avatar/texture/casual25_m_40.jpg';
                }
                if (temp === 32) {
                    textureURL = './Model/avatar/texture/casual26_m_40.jpg';
                }
                if (temp === 33) {
                    textureURL = './Model/avatar/texture/casual27_m_70.jpg';
                }
                if (temp === 34) {
                    textureURL = './Model/avatar/texture/casual28_m_70.jpg';
                }
                if (temp === 35) {
                    textureURL = './Model/avatar/texture/casual29_m_70.jpg';
                }
                if (temp === 36) {
                    textureURL = './Model/avatar/texture/casual30_m_30.jpg';
                }
                if (temp === 37) {
                    textureURL = './Model/avatar/texture/casual31_m_30.jpg';
                }
                if (temp === 38) {
                    textureURL = './Model/avatar/texture/casual32_m_25.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'crawl';
                newMesh.scene.visible = false;
                newMesh.scene.rotation.set(0, Math.PI*4/5, 0);

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()/number;
                var upperRandom2 = 1 + Math.random()/number;
                var thighRandom = 1 + Math.random()/number;

                var head0 = newMesh.scene.children[0].children[2].skeleton.boneInverses[2];
                var chest0 = newMesh.scene.children[0].children[2].skeleton.boneInverses[0];
                var wist0 = newMesh.scene.children[0].children[2].skeleton.boneInverses[4];
                var lThigh10 = newMesh.scene.children[0].children[2].skeleton.boneInverses[8];
                var lThigh20 = newMesh.scene.children[0].children[2].skeleton.boneInverses[9];
                var rThigh10 = newMesh.scene.children[0].children[2].skeleton.boneInverses[5];
                var rThigh20 = newMesh.scene.children[0].children[2].skeleton.boneInverses[18];

                head0.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest0.scale(new THREE.Vector3(upperRandom1, upperRandom1, 1));
                wist0.scale(new THREE.Vector3(upperRandom2,  upperRandom2, 1));
                rThigh10.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh20.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh10.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh20.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 17;
                var distance1 = Math.random() * 26;
                newMesh.scene.position.set(distance+43, -8.5, distance1+197);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                newMesh.scene.children[0].children[2].material = material;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupCrawl.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll12 = Promise.all(arr12).then((data) => {

            var temp, number;
            if(surplus>=84&&surplus<=85){
                number = multi + surplus - 84;
            }
            else if(surplus < 84){
                number = multi;
            }
            else {
                number = multi + 1;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 2;
                var newMesh, textureURL, textureURL1;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/child01_f.jpg';
                    textureURL1 = './Model/avatar/texture/child01_f_hair.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/child02_f.jpg';
                    textureURL1 = './Model/avatar/texture/child02_f_hair.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'crawl';
                newMesh.scene.visible = false;
                newMesh.scene.rotation.set(0, Math.PI*4/5, 0);

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()*1.5/number;
                var upperRandom2 = 1 + Math.random()*0.5/number;
                var thighRandom = 1 + Math.random()*0.5/number;

                var head = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[4];
                var chest = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[0];
                var wist = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[1];
                var lThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[9];
                var lThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[18];
                var rThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[8];
                var rThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[10];

                head.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest.scale(new THREE.Vector3(upperRandom1, 1, 1));
                wist.scale(new THREE.Vector3(upperRandom2,  upperRandom2, 1));
                lThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 17;
                var distance1 = Math.random() * 26;
                newMesh.scene.position.set(distance+43, -8.5, distance1+197);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var texture1 = loader.load(textureURL1, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                var material1 = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                // texture1.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                texture1.flipY = false;
                texture1.repeat.set(1, 1);
                material1.skinning = true;
                material1.map = texture1;
                newMesh.scene.children[0].children[3].children[0].material = material;
                newMesh.scene.children[0].children[3].children[1].material = material1;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupCrawl.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll13 = Promise.all(arr13).then((data) => {

            var temp, number;
            number = multi;
            if(surplus>=85&&surplus<=86){
                number = multi + surplus - 85;
            }
            else if(surplus < 85){
                number = multi;
            }
            else {
                number = multi + 1;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 2;
                var newMesh, textureURL;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/child01_m.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/child02_m.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'crawl';
                newMesh.scene.visible = false;
                newMesh.scene.rotation.set(0, Math.PI*4/5, 0);

                //动态人群位置
                var distance = Math.random() * 17;
                var distance1 = Math.random() * 26;
                newMesh.scene.position.set(distance+43, -8.5, distance1+197);

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()/number;
                var upperRandom2 = 1 + Math.random()*0.5/number;
                var thighRandom = 1 + Math.random()*0.5/number;

                var head = newMesh.scene.children[0].children[3].skeleton.boneInverses[2];
                var chest = newMesh.scene.children[0].children[3].skeleton.boneInverses[0];
                var wist = newMesh.scene.children[0].children[3].skeleton.boneInverses[4];
                var lThigh1 = newMesh.scene.children[0].children[3].skeleton.boneInverses[7];
                var lThigh2 = newMesh.scene.children[0].children[3].skeleton.boneInverses[8];
                var rThigh1 = newMesh.scene.children[0].children[3].skeleton.boneInverses[18];
                var rThigh2 = newMesh.scene.children[0].children[3].skeleton.boneInverses[13];

                head.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest.scale(new THREE.Vector3(upperRandom1, 1, 1));
                wist.scale(new THREE.Vector3(upperRandom2, upperRandom2, 1));
                lThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                newMesh.scene.children[0].children[3].material = material;

                // 调用动画
                _this.isFinishLoadCharactor = true;
                _this.isStartRun = true;
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupCrawl.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });
        var promiseAll14 = Promise.all(arr14).then((data) => {

            var temp, number;
            if(surplus>=86&&surplus<=87){
                number = multi + surplus - 86;
            }
            else if(surplus < 86){
                number = multi;
            }
            else {
                number = multi + 1;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 2;
                var newMesh, textureURL;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (i % 2 === 0) {
                    textureURL = './Model/avatar/texture/granny01.jpg';
                }
                if (i % 2 === 1) {
                    textureURL = './Model/avatar/texture/granny02.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'idle';
                newMesh.scene.visible = false;

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()*0.5/number;
                var upperRandom2 = 1 + Math.random()*0.5/number;
                var upperRandom3 = 1 + Math.random()*0.5/number;

                var head = newMesh.scene.children[0].children[3].skeleton.boneInverses[9];
                var chest = newMesh.scene.children[0].children[3].skeleton.boneInverses[7];
                var wist = newMesh.scene.children[0].children[3].skeleton.boneInverses[1];
                var hip = newMesh.scene.children[0].children[3].skeleton.boneInverses[0];

                head.scale(new THREE.Vector3(headRandom, 1+(headRandom-1)/3, 1));
                chest.scale(new THREE.Vector3(upperRandom1, 1, 1));
                wist.scale(new THREE.Vector3(upperRandom2, upperRandom2, 1));
                hip.scale(new THREE.Vector3(upperRandom3, upperRandom3, 1));

                //动态人群位置
                var distance = Math.random() * 18;
                var distance1 = Math.random() * 30;
                newMesh.scene.position.set(distance+43, -8.5, distance1+170);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                newMesh.scene.children[0].children[3].material = material;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupIdle.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll15 = Promise.all(arr15).then((data) => {

            var temp, number;
            if(surplus>=87&&surplus<=88){
                number = multi + surplus - 87;
            }
            else if(surplus < 87){
                number = multi;
            }
            else {
                number = multi + 1;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 2;
                var newMesh, textureURL, textureURL1;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/child01_f.jpg';
                    textureURL1 = './Model/avatar/texture/child01_f_hair.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/child02_f.jpg';
                    textureURL1 = './Model/avatar/texture/child02_f_hair.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'idle';
                newMesh.scene.visible = false;

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()/number;
                var upperRandom2 = 1 + Math.random()*0.5/number;
                var thighRandom = 1 + Math.random()*0.5/number;

                var head = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[4];
                var chest = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[0];
                var wist = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[1];
                var lThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[9];
                var lThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[18];
                var rThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[8];
                var rThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[10];

                head.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest.scale(new THREE.Vector3(upperRandom1, 1, 1));
                wist.scale(new THREE.Vector3(upperRandom2,  upperRandom2, 1));
                lThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 18;
                var distance1 = Math.random() * 30;
                newMesh.scene.position.set(distance+43, -8.5, distance1+170);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var texture1 = loader.load(textureURL1, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                var material1 = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                // texture1.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                texture1.flipY = false;
                texture1.repeat.set(1, 1);
                material1.skinning = true;
                material1.map = texture1;
                newMesh.scene.children[0].children[3].children[0].material = material;
                newMesh.scene.children[0].children[3].children[1].material = material1;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupIdle.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll16 = Promise.all(arr16).then((data) => {

            var temp, number;
            if(surplus>=88&&surplus<=89){
                number = multi + surplus - 88;
            }
            else if(surplus < 88){
                number = multi ;
            }
            else {
                number = multi+ 1;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 2;
                var newMesh, textureURL;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/child01_m.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/child02_m.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'idle';
                newMesh.scene.visible = false;

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()/number;
                var upperRandom2 = 1 + Math.random()*0.5/number;
                var thighRandom = 1 + Math.random()*0.5/number;

                var head = newMesh.scene.children[0].children[3].skeleton.boneInverses[2];
                var chest = newMesh.scene.children[0].children[3].skeleton.boneInverses[0];
                var wist = newMesh.scene.children[0].children[3].skeleton.boneInverses[4];
                var lThigh1 = newMesh.scene.children[0].children[3].skeleton.boneInverses[7];
                var lThigh2 = newMesh.scene.children[0].children[3].skeleton.boneInverses[8];
                var rThigh1 = newMesh.scene.children[0].children[3].skeleton.boneInverses[18];
                var rThigh2 = newMesh.scene.children[0].children[3].skeleton.boneInverses[13];

                head.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest.scale(new THREE.Vector3(upperRandom1, 1, 1));
                wist.scale(new THREE.Vector3(upperRandom2, upperRandom2, 1));
                lThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 18;
                var distance1 = Math.random() * 30;
                newMesh.scene.position.set(distance+43, -8.5, distance1+170);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                newMesh.scene.children[0].children[3].material = material;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupIdle.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll17 = Promise.all(arr17).then((data) => {

            var temp, number;
            if(surplus>=89&&surplus<=99){
                number = multi * 10 + surplus - 89;
            }
            else if(surplus < 89){
                number = multi * 10;
            }
            else {
                number = multi * 10 + 10;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {

                temp = i % 31;
                var newMesh, textureURL, textureURL1;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/business01_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/business01_f_30_hair.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/business02_f_50.jpg';
                    textureURL1 = './Model/avatar/texture/business02_f_50.jpg';
                }
                if (temp === 2) {
                    textureURL = './Model/avatar/texture/business03_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/business03_f_25.jpg';
                }
                if (temp === 3) {
                    textureURL = './Model/avatar/texture/business04_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/business04_f_25_hair.jpg';
                }
                if (temp === 4) {
                    textureURL = './Model/avatar/texture/business05_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/business05_f_35.jpg';
                }
                if (temp === 5) {
                    textureURL = './Model/avatar/texture/casual01_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual01_f_20_hair.jpg';
                }
                if (temp === 6) {
                    textureURL = './Model/avatar/texture/casual02_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual02_f_25.jpg';
                }
                if (temp === 7) {
                    textureURL = './Model/avatar/texture/casual03_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual03_f_25_hair_alpha.jpg';
                }
                if (temp === 8) {
                    textureURL = './Model/avatar/texture/casual04_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual04_f_30.jpg';
                }
                if (temp === 9) {
                    textureURL = './Model/avatar/texture/casual05_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual05_f_25_hair.jpg';
                }
                if (temp === 10) {
                    textureURL = './Model/avatar/texture/casual06_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual06_f_hair_alpha.jpg';
                }
                if (temp === 11) {
                    textureURL = './Model/avatar/texture/casual07_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual07_f_20_hair.jpg';
                }
                if (temp === 12) {
                    textureURL = './Model/avatar/texture/casual08_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual08_f_25_hair.jpg';
                }
                if (temp === 13) {
                    textureURL = './Model/avatar/texture/casual09_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual09_f_25.jpg';
                }
                if (temp === 14) {
                    textureURL = './Model/avatar/texture/casual10_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual10_f_30_hair.jpg';
                }
                if (temp === 15) {
                    textureURL = './Model/avatar/texture/casual11_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual11_f_30_hair.jpg';
                }
                if (temp === 16) {
                    textureURL = './Model/avatar/texture/casual12_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual12_f_30_hair.jpg';
                }
                if (temp === 17) {
                    textureURL = './Model/avatar/texture/casual13_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual13_f_30_hair.jpg';
                }
                if (temp === 18) {
                    textureURL = './Model/avatar/texture/casual14_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual14_f_25_hair.jpg';
                }
                if (temp === 19) {
                    textureURL = './Model/avatar/texture/casual15_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual15_f_20_hair_alpha.jpg';
                }
                if (temp === 20) {
                    textureURL = './Model/avatar/texture/casual16_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual16_f_30.jpg';
                }
                if (temp === 21) {
                    textureURL = './Model/avatar/texture/casual17_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/casual17_f_35_hair.jpg';
                }
                if (temp === 22) {
                    textureURL = './Model/avatar/texture/casual18_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual18_f_30.jpg';
                }
                if (temp === 23) {
                    textureURL = './Model/avatar/texture/casual19_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual19_f_20_hair.jpg';
                }
                if (temp === 24) {
                    textureURL = './Model/avatar/texture/casual20_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual20_f_25_hair.jpg';
                }
                if (temp === 25) {
                    textureURL = './Model/avatar/texture/casual21_f_30.jpg';
                    textureURL1 = './Model/avatar/texture/casual21_f_30_hair.jpg';
                }
                if (temp === 26) {
                    textureURL = './Model/avatar/texture/casual22_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual22_f_25_hair.jpg';
                }
                if (temp === 27) {
                    textureURL = './Model/avatar/texture/casual23_f_35.jpg';
                    textureURL1 = './Model/avatar/texture/casual23_f_35.jpg';
                }
                if (temp === 28) {
                    textureURL = './Model/avatar/texture/casual24_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual24_f_20_hair.jpg';
                }
                if (temp === 29) {
                    textureURL = './Model/avatar/texture/casual25_f_20.jpg';
                    textureURL1 = './Model/avatar/texture/casual25_f_20.jpg';
                }
                if (temp === 30) {
                    textureURL = './Model/avatar/texture/casual26_f_25.jpg';
                    textureURL1 = './Model/avatar/texture/casual26_f_25.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'idle';
                newMesh.scene.visible = false;

                //人物骨骼参数化
                var headRandom =1 +  Math.random()* 4/number;
                var upperRandom1 = 1 + Math.random()*2/number;
                var upperRandom2 = 1 + Math.random()*3/number;
                var thighRandom = 1 + Math.random()*3/number;

                var head = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[2];
                var chest = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[0];
                var wist = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[4];
                var lThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[7];
                var lThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[8];
                var rThigh1 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[17];
                var rThigh2 = newMesh.scene.children[0].children[3].children[0].skeleton.boneInverses[18];

                head.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest.scale(new THREE.Vector3(upperRandom1, upperRandom1, 1));
                wist.scale(new THREE.Vector3(upperRandom2,  upperRandom2, 1));
                lThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh1.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh2.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 18;
                var distance1 = Math.random() * 30;
                newMesh.scene.position.set(distance+43, -8.5, distance1+170);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var texture1 = loader.load(textureURL1, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                var material1 = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                // texture1.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                texture1.flipY = false;
                texture1.repeat.set(1, 1);
                material1.skinning = true;
                material1.map = texture1;
                newMesh.scene.children[0].children[3].children[0].material = material;
                newMesh.scene.children[0].children[3].children[1].material = material1;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupIdle.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

        var promiseAll18 = Promise.all(arr18).then((data) => {

            var temp, number;
            if(surplus>=99&&surplus<=109){
                number = multi * 10 + surplus - 99;
            }
            else if(surplus < 99){
                number = multi * 10;
            }
            else {
                number = multi * 10 + 10;
            }
            // number = multi;
            for (var i = 0; i < number; i++) {
                temp = i % 39;
                var newMesh, textureURL;
                newMesh = cloneGltf(data[temp]);

                //贴图参数化
                if (temp === 0) {
                    textureURL = './Model/avatar/texture/business01_m_60.jpg';
                }
                if (temp === 1) {
                    textureURL = './Model/avatar/texture/business02_m_35.jpg';
                }
                if (temp === 2) {
                    textureURL = './Model/avatar/texture/business03_m_35.jpg';
                }
                if (temp === 3) {
                    textureURL = './Model/avatar/texture/business04_m_35.jpg';
                }
                if (temp === 4) {
                    textureURL = './Model/avatar/texture/business05_m_25.jpg';
                }
                if (temp === 5) {
                    textureURL = './Model/avatar/texture/business06_m_25.jpg';
                }
                if (temp === 6) {
                    textureURL = './Model/avatar/texture/business07_m_25.jpg';
                }
                if (temp === 7) {
                    textureURL = './Model/avatar/texture/casual01_m_35.jpg';
                }
                if (temp === 8) {
                    textureURL = './Model/avatar/texture/casual02_m_25.jpg';
                }
                if (temp === 9) {
                    textureURL = './Model/avatar/texture/casual03_m_25.jpg';
                }
                if (temp === 10) {
                    textureURL = './Model/avatar/texture/casual04_m_25.jpg';
                }
                if (temp === 11) {
                    textureURL = './Model/avatar/texture/casual05_m_35.jpg';
                }
                if (temp === 12) {
                    textureURL = './Model/avatar/texture/casual06_m_25.jpg';
                }
                if (temp === 13) {
                    textureURL = './Model/avatar/texture/casual07_m_25.jpg';
                }
                if (temp === 14) {
                    textureURL = './Model/avatar/texture/casual08_m_30.jpg';
                }
                if (temp === 15) {
                    textureURL = './Model/avatar/texture/casual09_m_30.jpg';
                }
                if (temp === 16) {
                    textureURL = './Model/avatar/texture/casual10_m_30.jpg';
                }
                if (temp === 17) {
                    textureURL = './Model/avatar/texture/casual11_m_30.jpg';
                }
                if (temp === 18) {
                    textureURL = './Model/avatar/texture/casual12_m_30.jpg';
                }
                if (temp === 19) {
                    textureURL = './Model/avatar/texture/casual13_m_30.jpg';
                }
                if (temp === 20) {
                    textureURL = './Model/avatar/texture/casual14_m_30.jpg';
                }
                if (temp === 21) {
                    textureURL = './Model/avatar/texture/casual15_m_30.jpg';
                }
                if (temp === 22) {
                    textureURL = './Model/avatar/texture/casual16_m_35.jpg';
                }
                if (temp === 23) {
                    textureURL = './Model/avatar/texture/casual17_m_35.jpg';
                }
                if (temp === 24) {
                    textureURL = './Model/avatar/texture/casual18_m_35.jpg';
                }
                if (temp === 25) {
                    textureURL = './Model/avatar/texture/casual19_m_35.jpg';
                }
                if (temp === 26) {
                    textureURL = './Model/avatar/texture/casual20_m_20.jpg';
                }
                if (temp === 27) {
                    textureURL = './Model/avatar/texture/casual21_m_35.jpg';
                }
                if (temp === 28) {
                    textureURL = './Model/avatar/texture/casual22_m_35.jpg';
                }
                if (temp === 29) {
                    textureURL = './Model/avatar/texture/casual23_m_40.jpg';
                }
                if (temp === 30) {
                    textureURL = './Model/avatar/texture/casual24_m_40.jpg';
                }
                if (temp === 31) {
                    textureURL = './Model/avatar/texture/casual25_m_40.jpg';
                }
                if (temp === 32) {
                    textureURL = './Model/avatar/texture/casual26_m_40.jpg';
                }
                if (temp === 33) {
                    textureURL = './Model/avatar/texture/casual27_m_70.jpg';
                }
                if (temp === 34) {
                    textureURL = './Model/avatar/texture/casual28_m_70.jpg';
                }
                if (temp === 35) {
                    textureURL = './Model/avatar/texture/casual29_m_70.jpg';
                }
                if (temp === 36) {
                    textureURL = './Model/avatar/texture/casual30_m_30.jpg';
                }
                if (temp === 37) {
                    textureURL = './Model/avatar/texture/casual31_m_30.jpg';
                }
                if (temp === 38) {
                    textureURL = './Model/avatar/texture/casual32_m_25.jpg';
                }

                newMesh.scene.scale.set(1, 1, 1);
                newMesh.scene.name = 'idle';
                newMesh.scene.visible = false;

                //人物骨骼参数化
                var headRandom =1 +  Math.random()/number;
                var upperRandom1 = 1 + Math.random()/number;
                var upperRandom2 = 1 + Math.random()/number;
                var thighRandom = 1 + Math.random()/number;

                var head0 = newMesh.scene.children[0].children[3].skeleton.boneInverses[2];
                var chest0 = newMesh.scene.children[0].children[3].skeleton.boneInverses[0];
                var wist0 = newMesh.scene.children[0].children[3].skeleton.boneInverses[4];
                var lThigh10 = newMesh.scene.children[0].children[3].skeleton.boneInverses[8];
                var lThigh20 = newMesh.scene.children[0].children[3].skeleton.boneInverses[9];
                var rThigh10 = newMesh.scene.children[0].children[3].skeleton.boneInverses[5];
                var rThigh20 = newMesh.scene.children[0].children[3].skeleton.boneInverses[18];

                head0.scale(new THREE.Vector3(headRandom, headRandom, 1));
                chest0.scale(new THREE.Vector3(upperRandom1, upperRandom1, 1));
                wist0.scale(new THREE.Vector3(upperRandom2,  upperRandom2, 1));
                rThigh10.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                rThigh20.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh10.scale(new THREE.Vector3(thighRandom, thighRandom, 1));
                lThigh20.scale(new THREE.Vector3(thighRandom, thighRandom, 1));

                //动态人群位置
                var distance = Math.random() * 18;
                var distance1 = Math.random() * 30;
                newMesh.scene.position.set(distance+43, -8.5, distance1+170);

                // 将模型的材质附在newMesh上
                var loader = new THREE.TextureLoader();
                var texture = loader.load(textureURL, function () {
                });
                var material = new THREE.MeshStandardMaterial();
                // texture.anisotropy = renderer.getMaxAnisotropy();
                //texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.flipY = false;
                texture.repeat.set(1, 1);
                material.skinning = true;
                material.map = texture;
                newMesh.scene.children[0].children[3].material = material;

                // 调用动画
                meshMixer = new THREE.AnimationMixer(newMesh.scene);
                self.action = meshMixer.clipAction(newMesh.animations[0]);
                self.mixerArr.push(meshMixer);
                self.activateAction(self.action);

                self.groupIdle.push(newMesh.scene);
                _this.scene.add(newMesh.scene);

            }
        });

    }

};


//动画随机速度，除去速度为0的情况
People.prototype.activateAction = function (action) {
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

People.prototype.setWeight=function (action, weight) {
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

People.prototype.isfinishedloadchar = function (_this)
{
    if(_this.isFinishLoadCharactor)
    {
        for(let i=0; i<_this.people.mixerArr.length;i++)
        {
            _this.people.mixerArr[i].update(_this.delta);
        }
    }
};

People.prototype.ifstartRun = function (_this)
{
    let self = this;
    if(_this.isStartRun)
    {
        for(var key in self.pathControlMap)
        {
            self.pathControlMap[key].update(_this.delta);
            if(self.pathControlMap[key].isArrive)
            {
                //去掉场景中的人物并修改计数器，当计数器为0时，显示结果列表
                _this.scene.remove(self.pathControlMap[key].object);
                _this.scene.remove(self.pathControlMap[key].lod_low_level_obj);
                if(self.pathControlMap[key] instanceof THREE.FollowerControl)
                    _this.number--;
                delete self.pathControlMap[key];
            }
        }
    }
};

People.prototype.update = function (_this)
{
    this.isfinishedloadchar(_this);
    this.ifstartRun(_this);
};

// function animate() {
//     requestAnimationFrame(animate);
//     for (var i = 0; i < mixers.length; i++) { // 重复播放动画
//         mixers[i].update(delta);
//     }
// }
//
