
onmessage = function (event)
{
    importScripts('../lib/three.js');
    //console.log("子线程："+event.data);
    let loader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
    loader.load(event.data, function(str){//dataTexture
        postMessage(str);
    });
}


