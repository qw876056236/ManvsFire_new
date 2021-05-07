//version:2021-5-7
export {MoveManager};
//移动控制对象用于自动漫游的相机移动和寻路算法的化身移动
class MoveManager{
    avatar;//每一个移动控制器只能控制一个对象
    roamPath;
    myPreviewflag;//确定目标节点
    stopFlag;//控制是否开始移动
    isLoop;//如果不进行循环漫游的话，第一行的初始状态就没用了
    finished;//到达终点后执行的函数

    myMakeOneRoamStep;

    constructor(avatar,roamPath,finished){
        this.myMakeOneRoamStep=new MakeOneRoamStep();
        if(avatar)this.newAvatar(avatar,roamPath,finished);
    }
    newAvatar=function (avatar,roamPath,finished) {//添加了新的对象
        var scope=this;
        scope.avatar=avatar;
        scope.roamPath=roamPath;
        scope.myPreviewflag=1;//确定目标节点
        scope.stopFlag=false;//true;
        scope.isLoop=false;//如果不进行循环漫游的话，第一行的初始状态就没用了
        scope.finished=finished?finished:function(){};
        scope.myMakeOneRoamStep=new MakeOneRoamStep();
        scope.#autoRoam();//创建后自动执行
    }
    #autoRoam=function () {
        var scope=this;
        autoRoam0();
        function autoRoam0(){
            if(!scope.stopFlag)//是否停止自动漫游
                if(scope.myMakeOneRoamStep.preview(scope.myPreviewflag,scope.avatar,scope.roamPath)) {
                    scope.myPreviewflag++;
                    if(scope.myPreviewflag=== scope.roamPath.length){//到达了目标点
                        if(scope.isLoop)scope.myPreviewflag = 0;
                        else scope.stopFlag=true;
                        scope.finished();
                    }
                }
            requestAnimationFrame(autoRoam0);
        }
    }
    static getArray=function(arr1){//通过平面位置获取输入数据
        //arr1:  x,z
        //arr2:  x,y,z,  a,b,c, time
        var arr2=[];
        var timeCoefficient=25;
        arr2.push([
            arr1[0][0],arr1[0][1],arr1[0][2],
            0,0,0,
            Math.pow(
                40
                ,0.5)
        ]);
        for(var i=1;i<arr1.length;i++){
            var time=Math.pow(
                Math.pow(arr1[i][0]-arr1[i-1][0],2)+
                Math.pow(arr1[i][1]-arr1[i-1][1],2)+
                Math.pow(arr1[i][2]-arr1[i-1][2],2)
                ,0.5)*timeCoefficient
            arr2.push([
                arr1[i][0],arr1[i][1],arr1[i][2],
                0,Math.atan2(
                    (arr1[i][0]-arr1[i-1][0]),
                    (arr1[i][2]-arr1[i-1][2])
                ),0,
                time
            ]);
        }
        return arr2;
    }
}
class MakeOneRoamStep{
    pattern;
    rectify;//记录这是第几步//第一步更新参数，最后一步纠正状态
    stepIndex_max;

    targetStatus;//目标状态

    dx;dy;dz;//一步的位移

    q1;q2;qt;

    constructor(){
        var scope=this;
        scope.rectify=true;//
        scope.stepIndex=1;//记录这是第几步//第一步更新参数，最后一步纠正状态
    }

    setPosition(avatar,pos){
        avatar.position.set(pos[0],pos[1],pos[2]);
    }
    getPosition(avatar){
        return [avatar.position.x,avatar.position.y,avatar.position.z];
    }
    #addPosition(avatar,add){
        var pos=this.getPosition(avatar);
        this.setPosition(avatar,[
            pos[0]+add[0],
            pos[1]+add[1],
            pos[2]+add[2],
        ])
    }

    setRotation(avatar,pos){
        avatar.rotation.set(pos[0],pos[1],pos[2]);
    }
    getRotation(avatar){
        return [avatar.rotation.x,avatar.rotation.y,avatar.rotation.z];
    }


    #updateParam=function(x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time){
        var scope=this;

        scope.dx=(x2-x1)/time;
        scope.dy=(y2-y1)/time;
        scope.dz=(z2-z1)/time;

        scope.q1=euler2quaternion(a1,b1,c1);
        scope.q2=euler2quaternion(a2,b2,c2);

        scope.qt=scope.stepIndex/scope.stepIndex_max;

        function euler2quaternion(x,y,z) {
            var euler=new THREE.Euler(x,y,z, 'XYZ');
            var quaternion=new THREE.Quaternion();
            quaternion.setFromEuler(euler);
            return quaternion;
        }
        scope.targetStatus=[x2,y2,z2,a2,b2,c2];
    }
    #initParam=function(x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time){
        var scope=this;
        scope.stepIndex_max=time;
        scope.#updateParam(x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time);
    }
    preview=function(mystate,avatar,mydata){//thisObj,time,myavatar,k//thisObj,x1,y1,z1,x2,y2,z2,time,myavatar,k
        var scope=this;
        var x1,y1,z1,x2,y2,z2,//位置
            a1,b1,c1,a2,b2,c2;//角度//a=c

        var time=mydata[mystate][6];
        //当前状态
        [x1,y1,z1]=scope.getPosition(avatar);
        [a1,b1,c1]=scope.getRotation(avatar);
        //目标状态
        x2=mydata[mystate][0];
        y2=mydata[mystate][1];
        z2=mydata[mystate][2];
        a2=mydata[mystate][3];
        b2=mydata[mystate][4];
        c2=mydata[mystate][5];

        if(scope.stepIndex===1){//新的阶段
            scope.#initParam(x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time);
        }else if(scope.rectify){//如果有路径纠正功能
            scope.#updateParam(x1,y1,z1,x2,y2,z2,a1,b1,c1,a2,b2,c2,time-scope.stepIndex+1);
        }
        return movetoPos(avatar,scope);
        function movetoPos(avatar,scope){//移动
            if(scope.stepIndex<scope.stepIndex_max){
                scope.#addPosition(avatar,[scope.dx,scope.dy,scope.dz])

                avatar.quaternion.x=scope.q1.x;
                avatar.quaternion.y=scope.q1.y;
                avatar.quaternion.z=scope.q1.z;
                avatar.quaternion.w=scope.q1.w;

                avatar.quaternion.slerp (scope.q2, scope.qt);
                scope.stepIndex++;
                return false;
            }else{
                scope.setPosition(avatar,[scope.targetStatus[0],scope.targetStatus[1],scope.targetStatus[2]])
                scope.setRotation(avatar,[scope.targetStatus[3],scope.targetStatus[4],scope.targetStatus[5]])
                scope.stepIndex=1;
                return true;
            }
        }
    }
}
