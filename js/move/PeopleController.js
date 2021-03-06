//主要负责单个化身的寻路
import {MoveManager} from './MoveManager.js';
//import {PF} from './lib/PF.js';
export {PeopleController};
class PeopleController{
    //myMain;
    model;
    xMin;zMin;
    floor0;floor1;
    setPosition;getPosition;setRotation;getRotation;
    updateModel(){}
    goToPosition(pos,finished){
        var scope=this;
        scope.updateModel();

        var y1=Math.floor(scope.model.position.y);//化身当前的位置
        var y2=pos.y?Math.round(pos.y):y1;//目标位置

        if(Math.abs(y2-y1)<2){//路径不跨层//
            if(y1>-1){//地面
                console.log("地面的移动");
                scope.floor0.goToPosition(pos,finished);
            } else {//地下一层
                console.log("地下一层的移动");
                scope.floor1.goToPosition(pos,finished);
            }
        } else diffFloor();

        function diffFloor() {//路径跨层
            console.log(y1,y2)
            if(y1>-1){//起点在地面
                console.log("-起点在地面-");
                scope.goToPosition({x:94,y:1.17,z:196},function () {
                    console.log("到了楼梯入口");
                    move0to_1(function () {
                        console.log("到了楼梯出口");
                        scope.goToPosition(pos);
                    });
                });

            }else if(y2>-1){//终点在地面
                console.log("-终点在地面-");
                scope.goToPosition({x:50,y:-8.53,z:189},function () {
                    console.log("到了楼梯入口");
                    move_1to0(function () {
                        console.log("到了楼梯出口");
                        scope.goToPosition(pos);
                    });
                });

            }

            function move0to_1(f){
                move([
                    [94,1.17,196],
                    [90.28,1.17,196.0],
                    [75.3,-3.7,196.05],
                    [74.52,-3.7,206.92],
                    [52.29,-3.7,206.17],
                    [49.62,-3.67,203.3],
                    [50,-8.53,189],
                ],f);
            }
            function move_1to0(f){
                move([
                    [50,-8.53,189],
                    [49.62,-3.67,203.3],
                    [52.29,-3.7,206.17],
                    [74.52,-3.7,206.92],
                    [75.3,-3.7,196.05],
                    [90.28,1.17,196.0],
                    [94,1.17,196],
                ],f);
            }
            function move(arr,f) {
                new MoveManager(//从0地面到-1层
                    //{obj:avatar,roamPath:roamPath,finished:finished}
                    {
                        obj:scope.model,
                        roamPath:MoveManager.getArray(arr),
                        finished:f,

                        setPosition:scope.setPosition,
                        getPosition:scope.getPosition,
                        setRotation:scope.setRotation,
                        getRotation:scope.getRotation
                    }
                );
            }
        }
    }
    constructor(myMain,obstacle0,obstacle1,pos){
        if(myMain)this.init({myMain:myMain,obstacle0:obstacle0,obstacle1:obstacle1,pos:pos})
    }
    init(opt){
        var myMain=opt.myMain,
            obstacle0=opt.obstacle0,
            obstacle1=opt.obstacle1,
            pos=opt.pos,
            people_index=opt.people_index;

        var scope=this;

        if(typeof(people_index)!=="undefined"){
            scope.updateModel=function () {
                var pos0=myMain.positionGet(people_index);
                scope.model.position={x:pos0[0],y:pos0[1],z:pos0[2]}
            }
            scope.setPosition=function(avatar,pos){
                avatar.positionSet(people_index,pos);
            };
            scope.getPosition=function(avatar){
                return avatar.positionGet(people_index);
            };


            scope.setRotation=function(avatar,rot){
                var m1=new THREE.Mesh();
                m1.rotation.set(Math.PI/2,0,0);
                m1.applyMatrix4(new THREE.Matrix4().identity ());

                var m2=new THREE.Mesh();
                m2.rotation.set(rot[0],rot[1],rot[2]);
                m2.applyMatrix4(new THREE.Matrix4().identity ());


                m1.applyMatrix4(m2.matrix);

                return avatar.rotationSet(people_index,[
                    m1.rotation.x,m1.rotation.y,m1.rotation.z
                ]);
            };
            scope.getRotation=function(avatar){
                var m1=new THREE.Mesh();
                m1.rotation.set(-Math.PI/2,0,0);
                m1.applyMatrix4(new THREE.Matrix4().identity ());
                var m2=new THREE.Mesh();
                var rot=avatar.rotationGet(people_index);
                m2.rotation.set(rot[0],rot[1],rot[2]);
                m2.applyMatrix4(new THREE.Matrix4().identity ());
                m1.applyMatrix4(m2.matrix);
                return [
                    m1.rotation.x,m1.rotation.y,m1.rotation.z
                ];
            };
        }
        scope.model=myMain;
        if(scope.model.position){
            scope.model.position.set(pos[0],pos[1],pos[2]);//(58.91,-8.54,181.01);//(100,0,194);//(90,0,196);//(90,1.17,196);
            scope.model.scale.set(0.5,0.5,0.5);
        }

        //scope.myMain=myMain;
        scope.#radiographicTesting();

        scope.floor0=new SameFloorPF({
            model:scope.model,obstacle:obstacle0,
            setPosition:scope.setPosition,
            getPosition:scope.getPosition,
            setRotation:scope.setRotation,
            getRotation:scope.getRotation
        });
        scope.floor1=new SameFloorPF({
            model:scope.model,obstacle:obstacle1,
            xMin:-39,xMax:262,
            zMin:112, zMax:531,
            setPosition:scope.setPosition,
            getPosition:scope.getPosition,
            setRotation:scope.setRotation,
            getRotation:scope.getRotation
        });

    }
    #test=function (){
        var scope=this;
        new MoveManager(
            //{obj:avatar,roamPath:roamPath,finished:finished}

            {obj:scope.model,
                roamPath:MoveManager.getArray([
                [90,1.17,196],
                [90.28,1.17,196.0],
                [75.3,-3.7,196.05],
                [74.52,-3.7,206.92],
                [52.29,-3.7,206.17],
                [49.62,-3.67,203.3],
                [49.96,-8.53,188.86],
            ]),

                setPosition:scope.setPosition,
                getPosition:scope.getPosition,
                setRotation:scope.setRotation,
                getRotation:scope.getRotation
            }
        );
    }
    #addCamera=function(){
        myMain.camera.position.set(0,2,-3);
        myMain.camera.rotation.set(0,135,0);
        glb.scene.add(myMain.camera);
    }
    #radiographicTesting=function(){
        var scope=this;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        var flag=0;
        function mouseDown0( event ) {
            flag++;
            if(flag!==2)return;
            flag=0;
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            raycaster.setFromCamera( mouse, window.c );
            const intersects = raycaster.intersectObjects(
                scope.myMain.scene.children[1].children[0].children
            );////myRoomManager.room
            if(intersects.length){
                console.log('['+
                    Math.floor(intersects[0].point.x*100)/100+','+
                    Math.floor(intersects[0].point.y*100)/100+','+
                    Math.floor(intersects[0].point.z*100)/100+']'
                );//0是射线穿过的第一个对象
                scope.goToPosition(intersects[0].point)
            }else console.log("没有点击到");
        }
        //window.addEventListener( 'mousedown',mouseDown0, true );
        setInterval(function () {
            flag=0;
        },1000);
        test();
        function test() {
            if(window.testFlag>0){
                window.testFlag--;
                scope.goToPosition({x:96.53,y:0.15,z:194.53})
            }
            //[96.53,0.15,194.53]
            requestAnimationFrame(test);
        }
    }
}
class SameFloorPF{
    model;
    obstacle;
    grid;finder;
    xMin;zMin;xMax;zMax;

    setPosition;getPosition;setRotation;getRotation;

    canPass(area){
        for(var i=0;i<area.length;i++){
            this.grid.setWalkableAt(
                area[i][0]-this.xMin,
                area[i][1]-this.zMin,
                true);
        }
    }
    getPos2(pos){
        return {
            x:Math.round(pos.x)-this.xMin,
            z:Math.round(pos.z)-this.zMin
        }
    }
    goToPosition(pos,finished){
        var scope=this;
        //化身当前的位置
        var x1=Math.floor(this.model.position.x)-this.xMin;
        var z1=Math.floor(this.model.position.z)-this.zMin;
        //目标位置
        var x2=Math.round(pos.x)-this.xMin;
        var z2=Math.round(pos.z)-this.zMin;

        if(x1===x2&&z1===z2){
            if(finished)finished();
        }else{
            var grid=this.grid.clone();
            var path = this.finder.findPath(x1,z1,x2,z2,grid);
            for(var i=0;i<path.length;i++){
                path[i].splice(1,0,this.model.position.y);
                path[i][0]+=this.xMin;
                path[i][2]+=this.zMin;
            }
            if(path.length){
                new MoveManager(
                    {
                        obj:this.model,
                        roamPath:MoveManager.getArray(path),
                        finished:finished,

                        setPosition:scope.setPosition,
                        getPosition:scope.getPosition,
                        setRotation:scope.setRotation,
                        getRotation:scope.getRotation
                    }
                );
            }else{
                console.log("没有找到路径!");
            }
        }
    }
    constructor(options){//model,obstacle//,xMin,zMin
        options = options || {};
        var scope=this;
        scope.model=options.model||new THREE.Object3D();
        scope.obstacle=options.obstacle||[];
        scope.xMin=(typeof(options.xMin)==="undefined")?-1000:options.xMin;
        scope.zMin=(typeof(options.zMin)==="undefined")?-1000:options.zMin;
        scope.xMax=(typeof(options.xMax)==="undefined")?1000:options.xMax;//options.xMax||1000;
        scope.zMax=(typeof(options.zMax)==="undefined")?1000:options.zMax;//options.zMax||1000;

        scope.setPosition=options.setPosition;
        scope.getPosition=options.getPosition;
        scope.setRotation=options.setRotation;
        scope.getRotation=options.getRotation;
        initPF();
        function initPF(){
            scope.grid = new PF.Grid(scope.xMax-scope.xMin+1,scope.zMax-scope.zMin+1);//生成网格
            for(var i=0;i<scope.obstacle.length;i++){
                scope.grid.setWalkableAt(
                    scope.obstacle[i][0]-scope.xMin,
                    scope.obstacle[i][1]-scope.zMin,
                    false);
            }
            scope.finder = new PF.BiAStarFinder({
                allowDiagonal: true,//允许对角线
                dontCrossCorners: false,//不要拐弯?
                heuristic: PF.Heuristic["manhattan"],//启发式["曼哈顿"]
                weight: 1
            });
        }
    }
}
