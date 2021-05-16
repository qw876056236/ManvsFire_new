var resourceloaderTest = function(){
    this.camera = null;
}

resourceloaderTest.prototype.init = function(_this){
    var scope = this;
    scope.camera = _this.camera;
    //开启多线程对模型资源信息进行加载
    let data = [];
    data.flag = 1 ;
    let frustum = new THREE.Frustum();
    frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( _this.camera.projectionMatrix,_this.camera.matrixWorldInverse ) );

    // const projScreenMatrix = new THREE.Matrix4();
    // projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
    // frustum.setFromProjectionMatrix(projScreenMatrix);

    data.camera = frustum;
    let worker = new Worker('js/resourceLoaderWorkerTest.js');
    worker.postMessage(data);
    worker.onmessage = function (event)
    {
        if(event.data.flag === 1)
        {
            _this.scene.add(event.data.object);
        }
        else if(event.data.flag === 2)
        {
            _this.scene.traverse(function (object) {
                if(object.name === "resource"){
                    _this.scene.remove(object);
                }
            });
            _this.scene.add(event.data.object);
            updateCameraPre();
            let myInterval=setInterval(function () {
                if(cameraHasChanged()){//如果相机位置和角度发生了变化
                    let data = [];
                    data.flag = 2;
                    data.camera = _this.camera.frustum.clone();
                    postMessage(data);
                    clearInterval(myInterval);
                }
            },300);
        }
    }

    function updateCameraPre(){
        scope.cameraPre.position=scope.camera.position.clone();
        scope.cameraPre.rotation=scope.camera.rotation.clone();
    }
    function cameraHasChanged(){
        return scope.camera.position.x !== scope.cameraPre.position.x ||
            scope.camera.position.y !== scope.cameraPre.position.y ||
            scope.camera.position.z !== scope.cameraPre.position.z ||
            scope.camera.rotation.x !== scope.cameraPre.rotation.x ||
            scope.camera.rotation.y !== scope.cameraPre.rotation.y ||
            scope.camera.rotation.z !== scope.cameraPre.rotation.z;
    }

}