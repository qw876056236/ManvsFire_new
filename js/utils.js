/** =======================================================
 *
 *  公共工具函数
 *
 *  ======================================================== */

Utils = {};

Utils.inherit = function (classChild, classSuper) {
    var p = function () {};
    p.prototype = classSuper.prototype;
    classChild.prototype = new p();
};

Utils.randomFrom = function (lower, upper) {
    return Math.random() * (upper - lower + 1) + lower;
};

Utils.getRandomColor = function() {
    var color = 0xffffff;
    var random = Math.floor(Math.random() * 16);
    return color << random;
};

Utils.getNumberInNormalDistribution = function (mean, std_dev){
    return mean + (randomNormalDistribution() * std_dev);
};

function randomNormalDistribution(){
    var u = 0.0, v = 0.0, w = 0.0, c = 0.0;
    do {
        //获得两个（-1,1）的独立随机变量
        u = Math.random() * 2 - 1.0;
        v = Math.random() * 2 - 1.0;
        w = u * u + v * v;
    } while(w === 0.0 || w >= 1.0)
    //这里就是 Box-Muller转换
    c = Math.sqrt((-2 * Math.log(w)) / w);
    return u * c;
}

Utils.generateFragment = function () {
    var canvas = document.createElement( 'canvas' );
    canvas.width = 64;
    canvas.height = 64;

    var context = canvas.getContext( '2d' );
    context.fillStyle = "rgba(255,255,255,0)";

    var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    gradient.addColorStop( 0.0, "rgba(150,150,150, 0.6)" );
    gradient.addColorStop( 0.5, "rgba(150,150,150, 0.2)" );
    gradient.addColorStop( 1, 'rgba(255,255,255, 0.01)' );

    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    return canvas;
}

Utils.generateWaterFragment = function () {
    var canvas = document.createElement( 'canvas' );
    canvas.width = 64;
    canvas.height = 64;

    var context = canvas.getContext( '2d' );
    context.fillStyle = "rgba(255,255,255,0)";

    var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    gradient.addColorStop( 0.35, "rgba(25,129,197, 0.5)" );
    gradient.addColorStop( 0.65, "rgba(25,129,197, 0.3)" );
    gradient.addColorStop( 1, 'rgba(255,255,255, 0.01)' );

    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    return canvas;
}

Utils.generateRandomNum = function(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
            break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            break;
        default:
            return 0;
            break;
    }
}

//数组复制
Utils.copyArray = function(arr){
    var result = [];
    for(var i = 0; i < arr.length; i++){
        result.push(arr[i]);
    }
    return result;
}

Utils.getClosePoint = function(obj, objArr, maxDis){
    /**
     * 在原来的基础上设置一个距离阈值，只有当距离小于这个阈值的时候，才会找到满足最近距离点的index
     * 否则返回-1
     */
    var clostIndex=-1;
    var dis = maxDis;
    for(var i =0 ;i<objArr.length; i++ ){
        if(obj.position.y === objArr[i].position.y){
            var currentDis = Math.abs(obj.position.x-objArr[i].position.x)+Math.abs(obj.position.z-objArr[i].position.z);
            if(currentDis<dis){
                dis = currentDis;
                clostIndex = i;
            }
        }
    }
    return clostIndex;
}

Utils.loading = function(timeout){
    setTimeout(function(){
        document.getElementById('loading').style.display = 'none';
    },timeout);
};

Utils.Queue = function ()
{
    var self = this;
    this.dataStore = [];
    this.enqueue = enqueue;     //入队
    this.dequeue = dequeue;     //出队
    this.front = front;         //查看队首元素
    this.back = back;           //查看队尾元素
    this.toString = toString;   //显示队列所有元素
    this.clear = clear;         //清空当前队列
    this.empty = empty;         //判断当前队列是否为空
    this.count = count;         //队列长度

    function enqueue ( element )
    {
        self.dataStore.push( element );
    }

    function dequeue ()
    {
        //删除队列首的元素，可以利用 JS 数组中的 shift 方法
        if( !self.empty() )
            self.dataStore.shift();
    }

    function empty()
    {
        //我们通过判断 dataStore 的长度就可知道队列是否为空
        return self.dataStore.length === 0;
    }

    //查看队首元素，直接返回数组首个元素即可
    function front()
    {
        return self.dataStore[0];
    }

    //读取队列尾的元素
    function back ()
    {
        if( self.empty() )
            return 'This queue is empty';
        else
            return self.dataStore[ self.dataStore.length - 1 ];
    }

    //查看对了所有元素，我这里采用数组的 join 方法实现

    function toString()
    {
        return self.dataStore.join('\n');
    }

    //清空当前队列，也很简单，我们直接将 dataStore 数值清空即可

    function clear()
    {
        delete self.dataStore;
        this.dataStor = [];
    }

    function count()
    {
        return self.dataStore.length;
    }

}

Utils.clone = function(obj){
    var o;
    if (typeof obj == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(Utils.clone(obj[i]));
                }
            } else {
                o = {};
                for (var j in obj) {
                    o[j] = Utils.clone(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
};

Utils.distant = function(a,b)
{
    return Math.sqrt(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2) +Math.pow(a.z-b.z,2));
};

Utils.mergeUniforms = function( uniforms ) {

    var merged = {};

    for ( var u = 0; u < uniforms.length; u ++ ) {

        var tmp = this.cloneUniforms( uniforms[ u ] );

        for ( var p in tmp ) {

            merged[ p ] = tmp[ p ];

        }

    }

    return merged;

};

Utils.cloneUniforms = function( src ) {

    var dst = {};

    for ( var u in src ) {

        dst[ u ] = {};

        for ( var p in src[ u ] ) {

            var property = src[ u ][ p ];

            if ( property && ( property.isColor ||
                property.isMatrix3 || property.isMatrix4 ||
                property.isVector2 || property.isVector3 || property.isVector4 ||
                property.isTexture ) ) {

                dst[ u ][ p ] = property.clone();

            } else if ( Array.isArray( property ) ) {

                dst[ u ][ p ] = property.slice();

            } else {

                dst[ u ][ p ] = property;

            }

        }

    }

    return dst;

}

//一元二次方程计算
Utils.computeQuadratic = function(a,b,c){
    if(b*b-4*a*c < 0)
    {
        console.log("方程无解");
        return;
    }
    x1 = (Math.pow(b*b-4*a*c,1/2) - b) / (2*a);
    x2 = (-Math.pow(b*b-4*a*c,1/2) - b) / (2*a);
    if(x1<0)
    {
        console.log("两个解都小于0");
        return;
    }
    if(x2<=0)
    {
        return x1;
    }
    if(x2>0)
    {
        console.log("两个解都大于0");
        return x1>x2 ? x1 : x2;
    }
}

Utils.hexToVec3 = function (col) {
    let num = parseInt(col.substr(1), 16);
    let r = (num / 256 / 256) % 256;
    let g = (num / 256) % 256;
    let b = num % 256;
    return [r / 255.0, g / 255.0, b / 255.0];
};
Utils.formatZero = function (val) {
    if (val.length === 1)
        return '0' + val;
    return val;
};
Utils.vec3ToHex = function (col) {
    return '#' +
        this.formatZero(col[0].toString(16)) +
        this.formatZero(col[1].toString(16)) +
        this.formatZero(col[2].toString(16));
};
Utils.vec3Blend = function (cola, colb, t) {
    let a = this.hexToVec3(cola);
    let b = this.hexToVec3(colb);
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t
    ];
};