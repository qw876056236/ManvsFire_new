import {mainScene} from './mainScene.js';
var MainScene = new mainScene();
MainScene.init();
Utils.loading(1500);
MainScene.start();

MainScene.HCI.fuc3(MainScene);
//new PlayerControl(MainScene.camera);
//开始自动漫游路径

import {PreviewManager} from './move/PreviewManager.js';
//window.PreviewManager=PreviewManager;
//console.log(window.PreviewManager)

var mydata = [//自动漫游路径
    [60,3,146,-0.0138,0.3864,0.00519,100]
    ,[54,-6,159,-2.88231,0.28582,3.06694,100]
    ,[50,-7,181,-2.88998,0.56064,3.00574,100]
    ,[45,-6,196,-3.00686,-0.02462,-3.13826,100]
    ,[45,-7,249,-3.0779,-0.03294,-3.1395,100]
    ,[52,-6,257,-2.71302,0.01091,3.1366,100]
    ,[52,-12,275,-2.96581,0.12998,3.11857,100]
    ,[55,-11,283,-0.14754,-0.05416,-0.00805,100]
    ,[56,-12,187,-0.04319,0.08017,0.00346,100]
    ,[49,-12,183,-3.02238,-0.10293,-3.12929,100]
    //以下是上电梯
    ,[49.59,-12.99,188.96,2.78839,-0.0371,3.09644,100],[49.62,-7.02,201.4,3.09312,0.0504,-3.13915,100]
    ,[51.38,-7.05,209.43,-1.76594,1.48958,1.76655,100]
];
//console.log(window.PreviewManager)
var myPreviewManager=new PreviewManager(MainScene.camera,mydata);
//myPreviewManager.autoRoam();
myPreviewManager.createCameraButton('./img/1.png','./img/2.png');
//结束自动漫游路径
