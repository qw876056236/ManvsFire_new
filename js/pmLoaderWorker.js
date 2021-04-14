
onmessage = function (event)
{
    importScripts('../lib/three.js');
    //console.log("子线程："+event.data);
    let loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
    //加载基模的三个JSON文件,然后进行解析、执行parse函数
    loader.load(event.data[0], function(baseMesh){
        loader.load(event.data[1], function(skeleton){
            loader.load(event.data[2], function(skeletonIndex){
                let data = [baseMesh, skeleton, skeletonIndex];
                postMessage(data);
            });
        });
    });
}


