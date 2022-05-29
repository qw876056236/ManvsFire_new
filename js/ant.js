var Ant = function(){
    this.pheromone = [];
    this.normal = 1;//默认的初始的信息素浓度
    this.ph_path = 1;//最优路径信息素
    this.ph_sign = 1;//指示牌信息素
    this.diagonal = true;//是否允许对角移动
    this.PathFindeM;this.finder;
    this.trace_step = 4;
}

var Grid = function(){
    this.ph = 0;// 信息素浓度
    this.people_number = 0;// 记录当前格子中的人数

    this.isfire = false;// 是否着火，计算A时使用
    this.fear = 0;// 记录总的恐惧度用于计算人物自身的恐惧度
    this.A_number = 0;// 记录总的A用于计算人物自身的A

    this.issign = 0;
    this.sign_orientation = 0;
}

Ant.prototype.init_pheromone = function(grid){//初始化信息素矩阵，将不可走的路径设置为0，其他的为normal
    this.pheromone = new Array(grid.nodes.length).fill(new Grid()).map(()=>{
        return Array(grid.nodes[0].length).fill(new Grid())
    });
    for(var i = 0; i < grid.nodes.length; i++)
        for(var j = 0; j < grid.nodes[0].length; j++)
            if(grid.nodes[i][j].walkable)
                this.pheromone[i][j].ph = this.normal;
    // console.log(this.pheromone);
    this.PathFindeM = grid;
}

Ant.prototype.init_pheromone_floor1 = function(grid){//针对地下一层的信息素矩阵初始化
    this.pheromone = new Array(grid.nodes[0].length).fill(0).map(()=>{
        return Array(grid.nodes.length).fill(0)
    });

    for(var x = 0; x < grid.nodes[0].length; x++)
        for(var y = 0; y < grid.nodes.length; y++)
            this.pheromone[x][y] = new Grid()
    
    for(var i = 0; i < grid.nodes.length; i++)
        for(var j = 0; j < grid.nodes[0].length; j++)
            if(j>80 && j <= 99 && grid.nodes[i][j].walkable)
                //if(grid.nodes[i][j].walkable)
                this.pheromone[j][i].ph = this.normal;
    //设置出口位置信息素
    for(var i = 100;i <= 101;i++)
        for(var j = 1;j <= 4;j++)
            this.pheromone[i][j].ph = this.normal;
    for(var i = 80;i >= 75;i--)
        for(var j = 72;j <= 78;j++)
            this.pheromone[i][j].ph = this.normal;
    for(var i = 100;i <= 103;i++)
        for(var j = 155;j <= 158;j++)
            this.pheromone[i][j].ph = this.normal;

    this.PathFindeM = grid;
}

Ant.prototype.init_sign = function(signs, exitPosArr){
    for(var i = 0; i < signs.length; i++){
        if(signs[i][3] > -10){// 处于地下一层
            if(signs[i][0] == 0){
                //this.add_signs([Math.round(signs[i][2])+39,Math.round(signs[i][4])-112], 2)// 将指示牌信息素加入矩阵
                this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].issign = 2;
            }else if(signs[i][0] == 5){
                //this.add_signs([Math.round(signs[i][2])+39,Math.round(signs[i][4])-112], 2)// 将指示牌信息素加入矩阵
                this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].issign = 2;
                if(signs[i][1] == 5)
                    this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].sign_orientation = 4;
                else if(signs[i][1] == 6)
                    this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].sign_orientation = 5;
                else if(signs[i][1] == 7)
                    this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].sign_orientation = 7;
                else if(signs[i][1] == 8)
                    this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].sign_orientation = 2;
            }else{
                //this.add_signs([Math.round(signs[i][2])+39,Math.round(signs[i][4])-112], 3)// 将指示牌信息素加入矩阵
                if(signs[i][1] == 1){
                    if(signs[i][0] == 1){
                        this.pheromone[Math.round(signs[i][2])+39 +1][Math.round(signs[i][4])-112].issign = 1;
                        this.pheromone[Math.round(signs[i][2])+39 +1][Math.round(signs[i][4])-112].sign_orientation = 2;
                    }else if(signs[i][0] == 2){
                        this.pheromone[Math.round(signs[i][2])+39 +1][Math.round(signs[i][4])-112].issign = 1;
                        this.pheromone[Math.round(signs[i][2])+39 +1][Math.round(signs[i][4])-112].sign_orientation = 7;
                    }
                    else if(signs[i][0] == 3){
                        this.pheromone[Math.round(signs[i][2])+39 +2][Math.round(signs[i][4])-112 +2].issign = 2;
                        this.pheromone[Math.round(signs[i][2])+39 +2][Math.round(signs[i][4])-112 +2].sign_orientation = 4;
                    }else if(signs[i][0] == 4){
                        this.pheromone[Math.round(signs[i][2])+39 +2][Math.round(signs[i][4])-112 -2].issign = 2;
                        this.pheromone[Math.round(signs[i][2])+39 +2][Math.round(signs[i][4])-112 -2].sign_orientation = 4;
                    }
                }else if(signs[i][1] == 2){
                   if(signs[i][0] == 1){
                        this.pheromone[Math.round(signs[i][2])+39 -1][Math.round(signs[i][4])-112].issign = 1;
                        this.pheromone[Math.round(signs[i][2])+39 -1][Math.round(signs[i][4])-112].sign_orientation = 7;
                    }else if(signs[i][0] == 2){
                        this.pheromone[Math.round(signs[i][2])+39 -1][Math.round(signs[i][4])-112].issign = 1;
                        this.pheromone[Math.round(signs[i][2])+39 -1][Math.round(signs[i][4])-112].sign_orientation = 2;
                    }
                    else if(signs[i][0] == 3){
                        this.pheromone[Math.round(signs[i][2])+39 -2][Math.round(signs[i][4])-112 -2].issign = 2;
                        this.pheromone[Math.round(signs[i][2])+39 -2][Math.round(signs[i][4])-112 -2].sign_orientation = 5;
                    }else if(signs[i][0] == 4){
                        this.pheromone[Math.round(signs[i][2])+39 -2][Math.round(signs[i][4])-112 +2].issign = 2;
                        this.pheromone[Math.round(signs[i][2])+39 -2][Math.round(signs[i][4])-112 +2].sign_orientation = 5;
                    }
                }else if(signs[i][0] == 2 && signs[i][1] == 4){
                    this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112 +1].issign = 1;
                    this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112 +1].sign_orientation = 4;
                }
            }
        }
    }
    for(var i = 0; i < exitPosArr.length; i++){
        if(exitPosArr[i][1] > -10){// 处于地下一层
            //this.add_signs([Math.round(exitPosArr[i][0])+39,Math.round(exitPosArr[i][2])-112], 3)// 将指示牌信息素加入矩阵
            this.pheromone[Math.round(exitPosArr[i][0])+39][Math.round(exitPosArr[i][2])-112].issign = 2;
        }
    }
    this.init_blok()
}


Ant.prototype.init_blok = function(){// 添加楼梯等障碍物
    for(var x = 48; x < 55; x++){
        for(var y = 190; y < 206; y++)
            this.set_block([x,y])
        for(var y = 257; y < 270; y++)
            this.set_block([x,y])
        for(var y = 304; y < 317; y++)
            this.set_block([x,y])
        for(var y = 342; y < 354; y++)
            this.set_block([x,y])
    }
    for(var x = 48; x < 51; x++)
        for(var y = 220; y < 232; y++)
            this.set_block([x,y])
    for(var x = 51; x < 55; x++)
        for(var y = 232; y < 242; y++)
            this.set_block([x,y])
    for(var x = 48; x < 53; x++)
        for(var y = 244; y < 248; y++)
            this.set_block([x,y])
}

Ant.prototype.set_block = function(point){
    this.pheromone[point[0]][point[1]].ph = 0;
}

Ant.prototype.set_free = function(point){
    this.pheromone[point[0]][point[1]].ph = this.normal;
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

Ant.prototype.step_no = function(begin, orientation){//根据信息素浓度，计算下一步位置（不允许对角）需要修改存在问题
    var ends = [this.pheromone[begin[0]][begin[1] + 1].ph,this.pheromone[begin[0] - 1][begin[1]].ph,this.pheromone[begin[0] + 1][begin[1]].ph,this.pheromone[begin[0]][begin[1] - 1]].ph;
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
        if(this.pheromone[x][y].ph > 0)
            this.pheromone[x][y].ph += ph;
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
                    return begin;                                                                                                                                                                                                                                                                                                                                                                                                                                                                begin;
            }
      };
}

Ant.prototype.get_steps = function(begin, orientation){
    try{var n1 = this.pheromone[begin[0] - 1][begin[1] + 1].ph;if(n1==undefined)n1 = 0;}catch{var n1 = 0;}
    try{var n2 = this.pheromone[begin[0]][begin[1] + 1].ph;if(n2==undefined)n2 = 0;}catch{var n2 = 0;}
    try{var n3 = this.pheromone[begin[0] + 1][begin[1] + 1].ph;if(n3==undefined)n3 = 0;}catch{var n3 = 0;}
    try{var n4 = this.pheromone[begin[0] - 1][begin[1]].ph;if(n4==undefined)n4 = 0;}catch{var n4 = 0;}
    try{var n5 = this.pheromone[begin[0] + 1][begin[1]].ph;if(n5==undefined)n5 = 0;}catch{var n5 = 0;}
    try{var n6 = this.pheromone[begin[0] - 1][begin[1] - 1].ph;if(n6==undefined)n6 = 0;}catch{var n6 = 0;}
    try{var n7 = this.pheromone[begin[0]][begin[1] - 1].ph;if(n7==undefined)n7 = 0;}catch{var n7 = 0;}
    try{var n8 = this.pheromone[begin[0] + 1][begin[1] - 1].ph;if(n8==undefined)n8 = 0;}catch{var n8 = 0;}
    var ends = [n1,n2,n3,n4,n5,n6,n7,n8]
    if(orientation) ends[8 - orientation] *= 0.2 // 身后方向信息素浓度减少80%
    return ends
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
Ant.prototype.get_ends = function(begin, orientation){
    ends = this.get_steps(begin, orientation)
    // switch(orientation){
    //     case 1:
    //         ends[2] = 0; ends[4] = 0; ends[5] = 0; ends[6] = 0; ends[7] = 0;
    //         break;
    //     case 2:
    //         ends[3] = 0; ends[4] = 0; ends[5] = 0; ends[6] = 0; ends[7] = 0;
    //         break;
    //     case 3:
    //         ends[0] = 0; ends[3] = 0; ends[5] = 0; ends[6] = 0; ends[7] = 0;
    //         break;
    //     case 4:
    //         ends[1] = 0; ends[2] = 0; ends[4] = 0; ends[6] = 0; ends[7] = 0;
    //         break;
    //     case 5:
    //         ends[0] = 0; ends[1] = 0; ends[3] = 0; ends[5] = 0; ends[6] = 0;
    //         break;
    //     case 6:
    //         ends[0] = 0; ends[1] = 0; ends[2] = 0; ends[4] = 0; ends[7] = 0;
    //         break;
    //     case 7:
    //         ends[0] = 0; ends[1] = 0; ends[2] = 0; ends[3] = 0; ends[4] = 0;
    //         break;
    //     case 8:
    //         ends[0] = 0; ends[1] = 0; ends[2] = 0; ends[3] = 0; ends[5] = 0;
    //         break;
    //     default:
    //         break;
    // }
    return ends
}
Ant.prototype.sum = function(data){
    var n = 0;
    for(var i = 0; i < data.length; i++)
        n += data[i];
    return n;
}

Ant.prototype.expend = function(begin, ends, range){
    if(range == 0) 
        return ends
    if(range >= 1){
        var new_end =  new Array(ends.length).fill(0);
        var d = 1 / 2
        for(var i = 0; i < ends.length; i++){
            if(ends[i] > 0)
                switch(i + 1){
                    case 1:
                        new_begin = [begin[0] - 1, begin[1] + 1];
                        var new_ends = this.expend(new_begin, this.get_ends(new_begin, i+1), range - 1);
                        new_end[i] = ends[i] + d * 1 / 3 * this.sum(new_ends);
                        break;
                    case 2:
                        new_begin = [begin[0], begin[1] + 1];
                        var new_ends = this.expend(new_begin, this.get_ends(new_begin, i+1), range - 1);
                        new_end[i] = new_ends[i] + d * 1 / 3 * this.sum(new_ends);
                        break;
                    case 3:
                        new_begin = [begin[0] + 1, begin[1] + 1];
                        var new_ends = this.expend(new_begin, this.get_ends(new_begin, i+1), range - 1);
                        new_end[i] = new_ends[i] + d * 1 / 3 * this.sum(new_ends);
                        break;
                    case 4:
                        new_begin = [begin[0] - 1, begin[1]];
                        var new_ends = this.expend(new_begin, this.get_ends(new_begin, i+1), range - 1);
                        new_end[i] = new_ends[i] + d * 1 / 3 * this.sum(new_ends);
                        break;
                    case 5:
                        new_begin = [begin[0] + 1, begin[1]];
                        var new_ends = this.expend(new_begin, this.get_ends(new_begin, i+1), range - 1);
                        new_end[i] = new_ends[i] + d * 1 / 3 * this.sum(new_ends);
                        break;
                    case 6:
                        new_begin = [begin[0] - 1, begin[1] - 1];
                        var new_ends = this.expend(new_begin, this.get_ends(new_begin, i+1), range - 1);
                        new_end[i] = new_ends[i] + d * 1 / 3 * this.sum(new_ends);
                        break;
                    case 7:
                        new_begin = [begin[0], begin[1] - 1];
                        var new_ends = this.expend(new_begin, this.get_ends(new_begin, i+1), range - 1);
                        new_end[i] = new_ends[i] + d * 1 / 3 * this.sum(new_ends);
                        break;
                    case 8:
                        new_begin = [begin[0] + 1, begin[1] - 1];
                        var new_ends = this.expend(new_begin, this.get_ends(new_begin, i+1), range - 1);
                        new_end[i] = new_ends[i] + d * 1 / 3 * this.sum(new_ends);
                        break;
                    default:
                        console.log("expend_range"+range+" error!")
                        break;
                }
        }
        return new_end
    }
    else{
        console.log('range error');
        return ends;
    }
}

Ant.prototype.step = function(_this, begin){//移动，是否遗留信息素（遗留几步）
    var ends = this.expend(begin, this.get_ends(begin, _this.orientation), 0, 0);
    if(this.diagonal)
        var end = this.Random(ends, begin);
    else
        var end = this.step_no(begin, _this.orientation);//存在问题
    //加入_this.orientation的设置，将人物的移动方向记录下来，计算下一步时可以进行加权
    return end;
}

Ant.prototype.volatilize = function(trace, ph){
    for(var i = 0; i < trace.length; i++)
        this.pheromone[trace[i][0]][trace[i][1]].ph -= ph / this.trace_step;
}

Ant.prototype.countspeed = function(people, range = 1, speed = 1){//速度衰减算法，需要输入期望速度作为初速度
    var De = 0.54, a = 0.266;
    var n = 0;

    for(var x = people[0]- range; x < people[0] + range; x++){
        for(var y = people[1]- range; y < people[1] + range; y++){
            try{var number = this.pheromone[x][y].people_number;if(number==undefined)number = 0;}catch{var number = 0;}
            n += number;
            //console.log(number)
        }
    }
            
    var D = n / (range + 1) / (range + 1);
    //console.log(D)
    if(D > 3.8)
        speed = 0.1;
    else if(D > 0.54)
        speed = (1 - a * D) /(1 - a * De) * speed;

    return speed>0 ? speed : 0;
}

Ant.prototype.countA = function(people, range = 2, a = 1){//计算警觉度
    var A = 0, L = 0, h = 0, n = 0;
    var u1 = 1; u2 = 1; u3 = 1;//权重需要设定

    for(var x = people[0] - range; x <= people[0] + range; x++){
        for(var y = people[1] - range; y <= people[1] + range; y++){
            if(x == 0 && y ==0){}
            else{
                try{var A = this.pheromone[x][y].A_number;if(A_number==undefined)A_number = 0;}catch{var A_number = 0;}
                n += A;
                try{var isfire = this.pheromone[x][y].isfire;if(isfire==undefined)isfire = false;}catch{var isfire = false;}
                if(isfire)
                    L = 1;
            }
        }
    }
        
    h = 1;//需要烟雾厚度

    A = a * (u1 * L + u2 * h + u3 * n);
    return A
}

Ant.prototype.countfear = function(people, me, range = 2, r = 1){//计算恐慌度
    var Fear = 0, n = 0, p = 0;
    for(var x = people[0]- range; x <= people[0] + range; x++){
        for(var y = people[1]- range; y <= people[1] + range; y++){
            try{var number = this.pheromone[x][y].people_number;if(number==undefined)number = 0;}catch{var number = 0;}
            n += number;
            try{var other_p = this.pheromone[x][y].fear;if(other_p==undefined)other_p = 0;}catch{var other_p = 0;}
            p += other_p;
        }
    }
    if(n==0)
        return me;
         
    Fear = (me + (n - 1) * (p / n)) / (n * r);
    return Fear
}

Ant.prototype.countDensity = function(people, range = 0, a = 1){//计算密度
    var self = this;
    var n = 0;
    for(var x = people[0]- range; x <= people[0] + range; x++){
        for(var y = people[1]- range; y <= people[1] + range; y++){
            try{var number = self.pheromone[x][y].people_number;if(number==undefined)number = 0;}catch{var number = 0;}
            n += number;
        }
    }
    n = n/Math.pow(2*range+1,2);
    return n;
}

Ant.prototype.GoBySigns = function(people, _this, range = 5){
    var end = [0,0];
    end[0] = people[0]; end[1] = people[1];
    var path = [];
    switch(_this.ore){
        case 2:
            outside:
            for(var y = 1; y <= range; y++)
                for(var x = -1 * range; x <= range; x++)
                    {
                        path = this.Find_sign([people[0],people[1]], _this, x, y);
                        if(path.length)
                            break outside;
                    }
            break;
        case 7:
            outside:
            for(var y = -1; y >= -1 * range; y--)
                for(var x = -1 * range; x <= range; x++)
                    {
                        path = this.Find_sign([people[0],people[1]], _this, x, y);
                        if(path.length)
                            break outside;
                    }
            break;
        case 4:
            outside:
            for(var x = -1; x >= -1 * range; x--)
                for(var y = -1 * range; y <= range; y++)
                    {
                        path = this.Find_sign([people[0],people[1]], _this, x, y);
                        if(path.length)
                            break outside;
                    }
            break;
        case 5:
            outside:
            for(var x = 1; x <= range; x++)
                for(var y = -1 * range; y <= range; y++)
                    {
                        path = this.Find_sign([people[0],people[1]], _this, x, y);
                        if(path.length)
                            break outside;
                    }
            break;
        default:
            var x1 = range - 1;
            var y1 = range - 1;
            var x2 = range + 1;
            var y2 = range + 1;
            outside:
            while(x1 >= 0 && y1 >= 0 && path.length == 0){
                for(var x = x2 - 1; x >= x1; x--){
                    path = this.Find_sign([people[0],people[1]], _this, x - range, y2 - range);
                    if(path.length != 0) break outside;
                }  
                for(var y = y2 - 1; y >= y1; y--){
                    path = this.Find_sign([people[0],people[1]], _this, x1 - range, y - range);
                    if(path.length != 0) break outside;
                }
                for(var x = x1 + 1; x <= x2; x++){
                    path = this.Find_sign([people[0],people[1]], _this, x - range, y1 - range);
                    if(path.length != 0) break outside;
                }
                for(var y = y1 + 1; y <= y2; y++){
                    path = this.Find_sign([people[0],people[1]], _this, x2 - range, y - range);
                    if(path.length != 0) break outside;
                }
                x1--;
                x2++;
                y1--;
                y2++;
            }
        break;   
    }
    if(path.length == 0){
        switch(_this.ore){
            case 2:
                try{var ph = this.pheromone[people[0]][people[1]+1].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                try{var pha = this.pheromone[people[0]+1][people[1]+1].pha;if(ph==undefined)pha = 0;}catch{var pha = 0;};
                try{var phb = this.pheromone[people[0]-1][people[1]+1].phb;if(ph==undefined)phb = 0;}catch{var phb = 0;};
                if(ph)
                    path.push([people[0], people[1]+1]);
                else if(pha)
                    path.push([people[0]+1, people[1]+1])
                else if(phb)
                    path.push([people[0]-1, people[1]+1])
                else
                    path.push(this.Step_random(people, _this))
                break;
            case 7:
                try{var ph = this.pheromone[people[0]][people[1]-1].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                try{var pha = this.pheromone[people[0]+1][people[1]-1].pha;if(ph==undefined)pha = 0;}catch{var pha = 0;};
                try{var phb = this.pheromone[people[0]-1][people[1]-1].phb;if(ph==undefined)phb = 0;}catch{var phb = 0;};
                if(ph)
                    path.push([people[0], people[1]-1]);
                else if(pha)
                    path.push([people[0]+1, people[1]-1])
                else if(phb)
                    path.push([people[0]-1, people[1]-1])
                else
                    path.push(this.Step_random(people, _this))
                break;
            case 4:
                try{var ph = this.pheromone[people[0]-1][people[1]].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                try{var pha = this.pheromone[people[0]-1][people[1]+1].pha;if(ph==undefined)pha = 0;}catch{var pha = 0;};
                try{var phb = this.pheromone[people[0]-1][people[1]-1].phb;if(ph==undefined)phb = 0;}catch{var phb = 0;};
                if(ph)
                    path.push([people[0]-1, people[1]]);
                else if(pha)
                    path.push([people[0]-1, people[1]+1])
                else if(phb)
                    path.push([people[0]-1, people[1]-1])
                else
                    path.push(this.Step_random(people, _this))
                break;
            case 5:
                try{var ph = this.pheromone[people[0]+1][people[1]].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                try{var pha = this.pheromone[people[0]+1][people[1]+1].pha;if(ph==undefined)pha = 0;}catch{var pha = 0;};
                try{var phb = this.pheromone[people[0]+1][people[1]-1].phb;if(ph==undefined)phb = 0;}catch{var phb = 0;};
                if(ph)
                    path.push([people[0]+1, people[1]]);
                else if(pha)
                    path.push([people[0]+1, people[1]+1])
                else if(phb)
                    path.push([people[0]+1, people[1]-1])
                else
                    path.push(this.Step_random(people, _this))
                break;
            default:
                path.push(this.Step_random(people, _this))
                break;
        }
    }
    return path;
}

Ant.prototype.Find_sign = function(people, _this, x, y){
    var path = [];
    var end = [0, 0];
    end[0] = people[0]; end[1] = people[1]
    try{var if_sign = this.pheromone[people[0]+x][people[1]+y].issign;if(if_sign==undefined)if_sign = 0;}catch{var if_sign = 0;}
    try{var ore = this.pheromone[people[0]+x][people[1]+y].sign_orientation;if(ore==undefined)ore = 0;}catch{var ore = 0;}
    if(ore) _this.ore = ore
    if(if_sign > 0){end[0] += x; end[1] += y;}
    if(if_sign == 2){
        path = this.Walktoward(people, end, _this);
    }else if(if_sign == 1){
        switch(ore){
            case 2:
                try{var ph = this.pheromone[people[0]][people[1]+1].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                if(ph)
                    path.push([people[0], people[1]+1]);
                break;
            case 7:
                try{var ph = this.pheromone[people[0]][people[1]-1].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                if(ph)
                    path.push([people[0], people[1]-1]);
                break;
            case 4:
                try{var ph = this.pheromone[people[0]-1][people[1]].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                if(ph)
                    path.push([people[0]-1, people[1]]);
                break;
            case 5:
                try{var ph = this.pheromone[people[0]+1][people[1]].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                if(ph)
                    path.push([people[0]+1, people[1]]);
                break;
        }
    }
    return path;
}

Ant.prototype.Walktoward = function(people, end, _this){// 添加绕过障碍物的方法
    var path = [];
    var ore = _this.ore;
    do{
        if(people[0] - end[0] != 0 && people[1] - end[1] != 0){
            try{var ph = this.pheromone[people[0]+(end[0]-people[0])/(Math.abs(end[0]-people[0]))][people[1]+(end[1]-people[1])/(Math.abs(end[1]-people[1]))].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
            if(ph) {
                path.push([people[0]+(end[0]-people[0])/(Math.abs(end[0]-people[0])), people[1]+(end[1]-people[1])/(Math.abs(end[1]-people[1]))]);
                people[0]+=(end[0]-people[0])/(Math.abs(people[0]-end[0]));
                people[1]+=(end[1]-people[1])/(Math.abs(end[1]-people[1]));
            }else{
                switch(ore){
                    case 5:
                        try{var ph = this.pheromone[people[0]+1][people[1]].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                        if(ph){
                            path.push([people[0]+1, people[1]]);
                            people[0]+=1;
                        }
                        else
                            people = end;
                        break;
                    case 4:
                        try{var ph = this.pheromone[people[0]-1][people[1]].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                        if(ph){
                            path.push([people[0]-1, people[1]]);
                            people[0]-=1;
                        }
                        else
                            people = end;
                        break;
                    case 2:
                        try{var ph = this.pheromone[people[0]][people[1]+1].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                        if(ph){
                            path.push([people[0], people[1]+1]);
                            people[1]+=1;
                        }
                        else
                            people = end;
                        break;
                    case 7:
                        try{var ph = this.pheromone[people[0]][people[1]-1].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                        if(ph){
                            path.push([people[0], people[1]-1]);
                            people[1]-=1;
                        }
                        else
                            people = end;
                        break;
                    default:
                            try{var ph = this.pheromone[people[0]+(end[0]-people[0])/(Math.abs(end[0]-people[0]))][people[1]].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                            if(ph) {
                                path.push([people[0]+(end[0]-people[0])/(Math.abs(end[0]-people[0])), people[1]]);
                                people[0] += (end[0]-people[0])/(Math.abs(end[0]-people[0]));
                            }
                            else {
                                try{var ph = this.pheromone[people[0]][people[1]+(end[1]-people[1])/(Math.abs(end[1]-people[1]))].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                                if(ph) {
                                    path.push([people[0], people[1]+(end[1]-people[1])/(Math.abs(end[1]-people[1]))]);
                                    people[1] += (end[1]-people[1])/(Math.abs(end[1]-people[1]));
                                }
                                else
                                    people = end;
                            }
                        break;    
                }
            }
        }else if(people[0] - end[0] == 0){
            try{var ph = this.pheromone[people[0]][people[1]+(end[1]-people[1])/(Math.abs(end[1]-people[1]))].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
            if(ph) {
                path.push([people[0], people[1]+(end[1]-people[1])/(Math.abs(end[1]-people[1]))]);
                people[1]+=(end[1]-people[1])/(Math.abs(end[1]-people[1]));
            }else
                people = end;
        }else if(people[1] - end[1] == 0){
            try{var ph = this.pheromone[people[0]+(end[0]-people[0])/(Math.abs(end[0]-people[0]))][people[1]].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
            if(ph) {
                path.push([people[0]+(end[0]-people[0])/(Math.abs(end[0]-people[0])), people[1]]);
                people[0]+=(end[0]-people[0])/(Math.abs(end[0]-people[0]));
            }else
                people = end;
        }
            
    }while(people[0] != end[0] || people[1] != end[1])

    return path
}

Ant.prototype.Step_random = function(begin, _this, range=1){
    
    if(range==0)
        range =  Math.floor(Math.random() * 1.99 + 1);
    var count=[];
    for(var x = -1 * range; x <= range; x++){
        for(var y = -1 * range; y <= range; y++){
            if(x != 0 && y != 0){
                try{var if_ph = this.pheromone[begin[0]+x][begin[1]+y].ph;if(if_ph==undefined)if_ph = 0;}catch{var if_ph = 0;}
                switch(_this.orientation){
                    case 1:
                        if(x > 0 && y < 0) if_ph = 0;
                        break;
                    case 2:
                        if(x == 0 && y < 0) if_ph = 0;
                        break;
                    case 3:
                        if(x < 0 && y < 0) if_ph = 0;
                        break;
                    case 4:
                        if(x > 0 && y == 0) if_ph = 0;
                        break;
                    case 5:
                        if(x < 0 && y == 0) if_ph = 0;
                        break;
                    case 6:
                        if(x > 0 && y > 0) if_ph = 0;
                        break;
                    case 7:
                        if(x == 0 && y > 0) if_ph = 0;
                        break;
                    case 8:
                        if(x < 0 && y > 0) if_ph = 0;
                        break;
                }
                if(if_ph)
                    count.push([x,y]);
            }
        }
    }

    var end = [0,0];
    end[0] = begin[0]; end[1] = begin[1];
    if(count.length){
        var n = Math.floor(Math.random() * (count.length - 0.01));
        end[0] += count[n][0];
        end[1] += count[n][1];
    }else{
        try{var if_ph = this.pheromone[begin[0]][begin[1]-1].ph;if(if_ph==undefined)if_ph = 0;}catch{var if_ph = 0;}
        console.log(if_ph)
        var if_ph = 0;
        switch(_this.orientation){
            case 1:
                try{var if_ph = this.pheromone[begin[0]+1][begin[1]-1].ph;if(if_ph==undefined)if_ph = 0;}catch{var if_ph = 0;}
                if(if_ph) end[0]+=1; end[1]-=1;
                break;
            case 2:
                try{var if_ph = this.pheromone[begin[0]][begin[1]-1].ph;if(if_ph==undefined)if_ph = 0;}catch{var if_ph = 0;}
                if(if_ph) end[1]-=1;
                break;
            case 3:
                try{var if_ph = this.pheromone[begin[0]-1][begin[1]-1].ph;if(if_ph==undefined)if_ph = 0;}catch{var if_ph = 0;}
                if(if_ph) end[0]-=1; end[1]-=1;
                break;
            case 4:
                try{var if_ph = this.pheromone[begin[0]+1][begin[1]].ph;if(if_ph==undefined)if_ph = 0;}catch{var if_ph = 0;}
                if(if_ph) end[0]+=1;
                break;
            case 5:
                try{var if_ph = this.pheromone[begin[0]-1][begin[1]].ph;if(if_ph==undefined)if_ph = 0;}catch{var if_ph = 0;}
                if(if_ph) end[0]-=1;
                break;
            case 6:
                try{var if_ph = this.pheromone[begin[0]+1][begin[1]+1].ph;if(if_ph==undefined)if_ph = 0;}catch{var if_ph = 0;}
                if(if_ph) end[0]+=1; end[1]+=1;
                break;
            case 7:
                try{var if_ph = this.pheromone[begin[0]][begin[1]+1].ph;if(if_ph==undefined)if_ph = 0;}catch{var if_ph = 0;}
                if(if_ph) end[1]+=1;
                break;
            case 8:
                try{var if_ph = this.pheromone[begin[0]-1][begin[1]+1].ph;if(if_ph==undefined)if_ph = 0;}catch{var if_ph = 0;}
                if(if_ph) end[0]-=1; end[1]+=1;
                break;
        }
        if(if_ph == 0){
            console.log('随机走所有方向均不可走？！！')
        }
    }
    return end;
}

Ant.prototype.Stuck = function(_this, people){
    var end = []
    var count = []
    for(var j = 1; j >= -1; j--){
        for(var i = -1; i <= 1; i++){
            if(i != 0 || j != 0){
                try{var ph = this.pheromone[people[0]+i][people[1]+j].ph;if(ph==undefined)ph = 0;}catch{var ph = 0;};
                try{var people_number = this.pheromone[people[0]+i][people[1]+j].people_number;if(people_number==undefined)people_number = 1;}catch{var people_number = 1;};
                if(ph && people_number == 0){end.push([i, j]); count.push([i, j])} 
                else end.push([0,0]);
            }     
        }
    }

    if(count.length){
        if(_this.ore && (end[_this.ore-1][0] != 0 || end[_this.ore-1][1] != 0)){
            return[people[0]+end[_this.ore-1][0], people[1]+end[_this.ore-1][1]];
        }
        else{
            var n = Math.floor(Math.random() * (count.length - 0.01));
            return [people[0]+count[n][0], people[1]+count[n][1]];
        }
    }
    else
        return [people[0], people[1]]
}

// Ant.prototype.GoByOrientation = function(begin, orientation){
//     switch(orientation){
//         case 2:
//             begin[1] += 1;
//         case 4:
//             begin[0] -= 1;
//         case 5:
//             begin[0] += 1;
//         case 7:
//             begin[1] -= 1;
//     }
// }