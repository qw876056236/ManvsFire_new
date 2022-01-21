var Ant = function(){
    this.pheromone = [];

    this.normal = 1;//默认的初始的信息素浓度
    this.ph_path = 1;//最优路径信息素
    this.ph_sign = 1;//指示牌信息素
    this.diagonal = false;//是否允许对角移动
}


Ant.prototype.init_pheromone = function(grid){//初始化信息素矩阵，将不可走的路径设置为0，其他的为normal
    this.pheromone = new Array(grid.nodes.length).fill(0).map(()=>{
        return Array(grid.nodes[0].length).fill(0)
    });
    for(var i = 0; i < grid.nodes.length; i++)
        for(var j = 0; j < grid.nodes[0].length; j++)
            if(grid.nodes[i][j].walkable)
                this.pheromone[i][j] = this.normal;
    console.log(this.pheromone);
}

Ant.prototype.init_pheromone_floor1 = function(grid){//针对地下一层的信息素矩阵初始化
    this.pheromone = new Array(grid.nodes[0].length).fill(0).map(()=>{
        return Array(grid.nodes.length).fill(0)
    });
    for(var i = 0; i < grid.nodes.length; i++)
        for(var j = 0; j < grid.nodes[0].length; j++)
            if(j>80 && j <= 99 && grid.nodes[i][j].walkable)
                //if(grid.nodes[i][j].walkable)
                this.pheromone[j][i] = this.normal;
    console.log(this.pheromone);
}

Ant.prototype.find_path = function(leader, end){
    var finder = new PF.BiAStarFinder({
        allowDiagonal: this.diagonal,//允许对角线
        dontCrossCorners: false,//不要拐弯?
        heuristic: PF.Heuristic["manhattan"],//启发式["曼哈顿"]
        weight: 1
    });
    return finder.findPath(leader[0], leader[1], end[0], end[1], this.pheromone);
}

Ant.prototype.set_block = function(point){
    this.pheromone[point[0]][point[1]] = 0;
}

Ant.prototype.set_free = function(point){
    this.pheromone[point[0]][point[1]] = this.normal;
}

Ant.prototype.Find_leader = function(people,ends){//输入人群的坐标集合和出口的坐标集合，返回一个数组：距离第i个出口最近的人是人群中的第j个人
    var d = 1000;
    var out = new Array(ends.length).fill(0).map(()=>{
        return Array(ends[0].length).fill(0)
    });
    for(var i = 0; i < ends.length; i++)
        for(var j = 0; j < people.length; j++){
            var Dis = people[i][0]+people[i][1]-ends[i][0]-ends[i][1]
            if(Dis < d)
                out[i] = j;
        }
    return out;
}

Ant.prototype.speed = function(people, range){
    var change = 1;
    for(var i = 0; i < people.length; i++)
        for(var j = i + 1; j < people.length; j++)
            if(this.diagonal){
                var n = people[i][0] + people[i][1] - people[j][0] - people[j][1];
                if(Math.abs(n) <= range)
                    change -= 1/n
            }
    return change;
}

Ant.prototype.step_no = function(begin, orientation){//根据信息素浓度，计算下一步位置（不允许对角）
    var ends = [this.pheromone[begin[0]][begin[1] + 1],this.pheromone[begin[0] - 1][begin[1]],this.pheromone[begin[0] + 1][begin[1]],this.pheromone[begin[0]][begin[1] - 1]];
    switch(orientation){
        case 1:
            return [begin[0], begin[1] + 1];
        case 2:
            return [begin[0] - 1, begin[1]];
        case 3:
            return [begin[0] + 1, begin[1]];
        case 4:
            return [begin[0], begin[1] - 1];
        default:
            return this.Random(ends, begin);
    }
}

Ant.prototype.add = function(x, y, ph=1, from=""){
    try{
        if(this.pheromone[x][y] > 0)
            this.pheromone[x][y] += ph;
    }catch{
        console.log(from+":out of range")
    }
}

Ant.prototype.add_path = function(path){//向信息素矩阵中加入最优路径信息素，必须输入二维矩阵
    for(var i = 0; i < path.length; i++)
        this.add(path[i][0], path[i][1], this.ph_path, "add_path")
}

Ant.prototype.add_signs = function(signs, range){//向信息素矩阵中加入指示牌信息素，必须输入二维矩阵
    for(var i = 0; i < signs.length; i++){
        if(signs[i][1] < this.pheromone.length)
            if(signs[i][0] < this.pheromone[signs[i][1]].length){
                if(this.diagonal)
                    for(var x = 0 - range; x <= range; x++){
                        for(var y = 0 - range; y <= range; y++)
                            if(x + y)
                                this.add(signs[i][0] + x, signs[i][1] + y, this.ph_sign / (Math.max(Math.abs(x),Math.abs(y)) + 1), "signs")
                    }                          
                else
                    for(var x = range; x >= 0 - range; x--){
                        for(var y = range - x; y >= x - range; y--)
                            if(x + y)
                                this.add(signs[i][0] + x, signs[i][1] + y, this.ph_sign / (Math.abs(x) + Math.abs(y) + 1), "signs")
                    }   
            }           
    }
}

Ant.prototype.Random = function(ends, begin){
    var sum = 0;
    var factor = 0;
    var random = Math.random();
    for(var i = ends.length - 1; i >= 0; i--) 
        sum += ends[i];
      random *= sum;
      for(var i = ends.length - 1; i >= 0; i--) {
        factor += ends[i];
        if(random <= factor) 
            switch(i + 1){
                case 1:
                    return [begin[0] - 1, begin[1] + 1];
                case 2:
                    return [begin[0], begin[1] + 1];
                case 3:
                    return [begin[0] + 1, begin[1] + 1];
                case 4:
                    return [begin[0] - 1, begin[1]];
                case 5:
                    return [begin[0] + 1, begin[1]];
                case 6:
                    return [begin[0] - 1, begin[1] - 1];
                case 7:
                    return [begin[0], begin[1] - 1];
                case 8:
                    return [begin[0] + 1, begin[1] - 1];
                default:
                    console.log("random error!")
                    return                                                                                                                                                                                                                                                                                                                                                                                                                                                                 begin;
            }
      };
}

Ant.prototype.get_steps = function(begin){
    try{var n1 = this.pheromone[begin[0] - 1][begin[1] + 1];if(n1==undefined)n1 = 0;}catch{var n1 = 0;}
    try{var n2 = this.pheromone[begin[0]][begin[1] + 1];if(n2==undefined)n2 = 0;}catch{var n2 = 0;}
    try{var n3 = this.pheromone[begin[0] + 1][begin[1] + 1];if(n3==undefined)n3 = 0;}catch{var n3 = 0;}
    try{var n4 = this.pheromone[begin[0] - 1][begin[1]];if(n4==undefined)n4 = 0;}catch{var n4 = 0;}
    try{var n5 = this.pheromone[begin[0] + 1][begin[1]];if(n5==undefined)n5 = 0;}catch{var n5 = 0;}
    try{var n6 = this.pheromone[begin[0] - 1][begin[1] - 1];if(n6==undefined)n6 = 0;}catch{var n6 = 0;}
    try{var n7 = this.pheromone[begin[0]][begin[1] - 1];if(n7==undefined)n7 = 0;}catch{var n7 = 0;}
    try{var n8 = this.pheromone[begin[0] + 1][begin[1] - 1];if(n8==undefined)n8 = 0;}catch{var n8 = 0;}
    return [n1,n2,n3,n4,n5,n6,n7,n8]
}
/*
orientation为朝向，数值设置如下
向y轴正方向为1，x轴负方向为2，……
   | 1 |
-----------
 2 |   | 3
-----------
   | 4 |
当diagonal为true时，朝向包括该方向上的两个角
当diagonal为false时，朝向不包括两个角
 1 | 2 | 3
-----------
 4 |   | 5
-----------
 6 | 7 | 8
移动方向由以上数字表示
*/
Ant.prototype.step_d = function(begin, orientation){//根据信息素浓度，计算下一步位置（允许对角）
    var ends = this.get_steps(begin);
    switch(orientation){
        case 1:
            ends[4] = 0; ends[5] = 0; ends[6] = 0; ends[7] = 0; ends[8] = 0;
            break;
        case 2:
            ends[2] = 0; ends[3] = 0; ends[5] = 0; ends[7] = 0; ends[8] = 0;
            break;
        case 3:
            ends[1] = 0; ends[2] = 0; ends[4] = 0; ends[6] = 0; ends[7] = 0;
            break;
        case 4:
            ends[1] = 0; ends[2] = 0; ends[3] = 0; ends[4] = 0; ends[5] = 0;
            break;
        default:
            console.log("no orientation")
            break;
    }
    return this.Random(ends, begin);
}

Ant.prototype.step = function(begin, orientation = 0, trace = 0){//移动，是否遗留信息素，遗留的信息素是否扩散
    if(trace)//如果遗留信息素，则将当前位置当作一个指示牌，并添加信息素（如果只在当前位置添加信息素，则将范围设置为0）
        this.add_signs(begin, 0);
    if(this.diagonal)
        return this.step_d(begin, orientation);
    else
        return this.step_no(begin, orientation);
}
