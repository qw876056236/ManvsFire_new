//主要负责人群生成和初始位置的设定
import {PeopleController} from "./PeopleController.js";
export {Crowd};
class Crowd{//将PM和实例化渲染结合起来
    obj;
    people;
    number;
    constructor(){
        var scope=this;
        this.obj=new THREE.Object3D();
        this.init(3,function () {
            scope.people.positionSet(0, [59.24,-8.54,216.22]);
            scope.people.positionSet(1, [58.91,-8.54,181.01]);
            scope.people.positionSet(2, [59.78,-8.54,159.48]);
            var loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
            loader.load("grid.json", function(str){//dataTexture
                var grid0=JSON.parse(str).grid;
                loader.load("grid_1.json", function(str1){//dataTexture
                    var grid1=JSON.parse(str1).grid;//"./Model/avatar/male_run.glb",
                    for(var kkk=0;kkk<scope.people.instanceCount;kkk++)
                        new PeopleController().init({
                            myMain:scope.people,
                            obstacle0:grid0,
                            obstacle1:grid1,
                            people_index:kkk
                        });
                });
            });
        })
    }
    init=function(number,config) {
        var scope=this;
        var obj=scope.obj;
        scope.number=number;
        var pmLoader = new MyPMLoader(
            {animations: []},
            './peopleModel/Male',    //模型路径
            [],//没有LOD分级//LOD等级的数组
            null,  //LOD需要判断到相机的距离//实例化渲染难以使用LOD
            0,       //有多个动画时,表示第0个动画//可以通过pmLoader.updateAnimation(i)来切换动画
            0,     //动画播放速度//可以通过调整pmLoader.animationSpeed来调整速度
            [],
            function () {
                var mesh = pmLoader.rootObject.children[0];
                var people = new InstancedGroup(
                    number,//人数
                    [mesh],//这些mesh的网格应该一致
                    true//有动画
                );
                scope.people=people;
                people.neckPosition=0.68;
                people.init(
                    ['./peopleTexture/m/m0.jpg'],
                    32
                );
                if(config)config();
                for (var i = 0; i < people.instanceCount; i++) {
                    people.rotationSet(i, [Math.PI / 2, 0, 0]);
                    //people.positionSet(i, [8 * i, 0, 0]);
                    people.scaleSet(i, [0.01, 0.01, 0.01]);
                    people.animationSet(i,Math.floor(Math.random()*3));
                    people.speedSet(i,Math.random()+0.5);
                    people.textureSet(i,[Math.floor(Math.random()*16),Math.floor(Math.random()*16),Math.floor(Math.random()*16)]);
                }
                obj.add(people.obj);
                obj.people=people;
                var timeId = setInterval(function () {
                    mesh = pmLoader.rootObject.children[0];
                    people.setGeometry(mesh.geometry);
                    console.log(pmLoader.finished);
                    if (pmLoader.finished) window.clearInterval(timeId)
                }, 1000);
            }
        );
    }
}
