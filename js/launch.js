(function ()
{

    var MainScene = new mainScene();
    MainScene.init();
    Utils.loading(1500);
    MainScene.start();

    MainScene.HCI.fuc3(MainScene);

    /*document.addEventListener( 'mouseup', onMouseUp, true);
    function onMouseUp(){
        alert();
    }*/
    new PlayerControl(MainScene.camera);
//开始自动漫游路径
    var mydata = [//自动漫游路径
        [60,3,146,-0.0138,0.3864,0.00519,100]
        ,[54,-6,159,-2.88231,0.28582,3.06694,100]
        ,[50,-7,181,-2.88998,0.56064,3.00574,100]
        ,[45,-6,196,-3.00686,-0.02462,-3.13826,100]
    ];
    var myPreviewManager=new PreviewManager(MainScene.camera,mydata);
    myPreviewManager.isLoop=false;
    //结束自动漫游路径

}).call(this)
