var Ant = function(){
    this.pheromone = [];
    this.normal = 1;//默认的初始的信息素浓度
    this.ph_path = 1;//最优路径信息素
    this.ph_sign = 1;//指示牌信息素
    this.diagonal = true;//是否允许对角移动
    this.PathFindeM;this.finder;
}

var Grid = function(){
    this.ph = 0;// 信息素浓度
    this.people_number = 0;// 记录当前格子中的人数
    this.trace_step = 0;// 人物遗留信息素衰减使用

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
                
    this.PathFindeM = grid;
}

Ant.prototype.init_sign = function(signs){
    for(var i = 0; i < signs.length; i++){
        if(signs[i][3] > -10){// 处于地下一层
            if(signs[i][0] == 0){
                this.add_signs([Math.round(signs[i][2])+39,Math.round(signs[i][4])-112], 2)// 将指示牌信息素加入矩阵
                this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].issign = 2;
            }else if(signs[i][0] == 5){
                this.add_signs([Math.round(signs[i][2])+39,Math.round(signs[i][4])-112], 2)// 将指示牌信息素加入矩阵
                this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].issign = 1;
                if(signs[i][1] == 5)
                    this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].sign_orientation = 4;
                else if(signs[i][1] == 6)
                    this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].sign_orientation = 5;
                else if(signs[i][1] == 7)
                    this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].sign_orientation = 7;
            }else{
                this.add_signs([Math.round(signs[i][2])+39,Math.round(signs[i][4])-112], 3)// 将指示牌信息素加入矩阵
                this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].issign = 1;
                if(signs[i][1] == 1){
                    if(signs[i][0] == 1)
                        this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].sign_orientation = 2;
                    else if(signs[i][0] == 2)
                        this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].sign_orientation = 7;
                    else if(signs[i][0] > 2)
                        this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].issign = 2;    
                }else if(signs[i][1] == 2){
                    if(signs[i][0] == 1)
                        this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].sign_orientation = 7;
                    else if(signs[i][0] == 2)
                        this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].sign_orientation = 2;
                    else if(signs[i][0] > 2)
                        this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].issign = 2;    
                }else if(signs[i][0] == 2 && signs[i][1] == 4)
                    this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].sign_orientation = 4;
            }
        }
        console.log(signs[i]+'  '+this.pheromone[Math.round(signs[i][2])+39][Math.round(signs[i][4])-112].sign_orientation)
    }
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

Ant.prototype.get_steps = function(begin){
    try{var n1 = this.pheromone[begin[0] - 1][begin[1] + 1].ph;if(n1==undefined)n1 = 0;}catch{var n1 = 0;}
    try{var n2 = this.pheromone[begin[0]][begin[1] + 1].ph;if(n2==undefined)n2 = 0;}catch{var n2 = 0;}
    try{var n3 = this.pheromone[begin[0] + 1][begin[1] + 1].ph;if(n3==undefined)n3 = 0;}catch{var n3 = 0;}
    try{var n4 = this.pheromone[begin[0] - 1][begin[1]].ph;if(n4==undefined)n4 = 0;}catch{var n4 = 0;}
    try{var n5 = this.pheromone[begin[0] + 1][begin[1]].ph;if(n5==undefined)n5 = 0;}catch{var n5 = 0;}
    try{var n6 = this.pheromone[begin[0] - 1][begin[1] - 1].ph;if(n6==undefined)n6 = 0;}catch{var n6 = 0;}
    try{var n7 = this.pheromone[begin[0]][begin[1] - 1].ph;if(n7==undefined)n7 = 0;}catch{var n7 = 0;}
    try{var n8 = this.pheromone[begin[0] + 1][begin[1] - 1].ph;if(n8==undefined)n8 = 0;}catch{var n8 = 0;}
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
Ant.prototype.get_ends = function(begin, orientation){
    ends = this.get_steps(begin)
    switch(orientation){
        case 1:
            ends[2] = 0; ends[4] = 0; ends[5] = 0; ends[6] = 0; ends[7] = 0;
            break;
        case 2:
            ends[3] = 0; ends[4] = 0; ends[5] = 0; ends[6] = 0; ends[7] = 0;
            break;
        case 3:
            ends[0] = 0; ends[3] = 0; ends[5] = 0; ends[6] = 0; ends[7] = 0;
            break;
        case 4:
            ends[1] = 0; ends[2] = 0; ends[4] = 0; ends[6] = 0; ends[7] = 0;
            break;
        case 5:
            ends[0] = 0; ends[1] = 0; ends[3] = 0; ends[5] = 0; ends[6] = 0;
            break;
        case 6:
            ends[0] = 0; ends[1] = 0; ends[2] = 0; ends[4] = 0; ends[7] = 0;
            break;
        case 7:
            ends[0] = 0; ends[1] = 0; ends[2] = 0; ends[3] = 0; ends[4] = 0;
            break;
        case 8:
            ends[0] = 0; ends[1] = 0; ends[2] = 0; ends[3] = 0; ends[5] = 0;
            break;
        default:
            break;
    }
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

Ant.prototype.step = function(_this, begin, orientation = 0, trace = 0){//移动，是否遗留信息素（遗留几步）
    this.volatilize();
    var ends = this.expend(begin, this.get_ends(begin, orientation), 0, 0);
    if(trace){
        this.pheromone[begin[0]][begin[1]].ph += 1;
        this.pheromone[begin[0]][begin[1]].trace_step += 4;
    }
    if(this.diagonal)
        var end = this.Random(ends, begin);
    else
        var end = this.step_no(begin, orientation);//存在问题

    this.pheromone[begin[0]][begin[1]].people_number -= 1;
    if(_this.form >= 1){
        this.pheromone[begin[0]][begin[1]].A_number -= 1;
        this.pheromone[end[0]][end[1]].A_number += 1;
    }
    this.pheromone[begin[0]][begin[1]].fear -= _this.fear;    
    this.pheromone[end[0]][end[1]].people_number += 1;
    this.pheromone[end[0]][end[1]].fear += _this.fear;
    //加入_this.orientation的设置，将人物的移动方向记录下来，计算下一步时可以进行加权
    return end;
}

Ant.prototype.volatilize = function(){
    for(var x = 0; x < this.pheromone.length; x++){
        for(var y = 0; y < this.pheromone[x].length; y++){
            if(this.pheromone[x][y].trace){
                people.ph -= 0.25
                people.trace_step -= 1;
            }
        }
    }
}

Ant.prototype.countspeed = function(people, range = 2, speed = 1){//速度衰减算法，需要输入期望速度作为初速度
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
        speed = 0;
    else if(D > 0.54)
        speed = (1 - a * D) /(1 - a * De) * speed;

    return speed;
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
         
    Fear = (me + (n - 1) * (p / n)) / (n * r)

    return Fear
}

Ant.prototype.GoBySigns = function(people, range = 2){
    var end = people;
    var change = 2 * range + 1;
    for(var x = -1 * range; x <= range; x++){
        for(var y = -1 * range; y <= range; y++){
            if(x == 0 && y == 0){}
            else{
                try{var if_sign = this.pheromone[people[0]+x][people[1]+y].issign;if(if_sign==undefined)if_sign = 0;}catch{var if_sign = 0;}
                if(if_sign == 2 && change > Math.abs(x) + Math.abs(y)){
                    if(x > 0) end[0] += 1; else end[0] -= 1;
                    if(y > 0) end[1] += 1; else end[1] -= 1;
                    change = Math.abs(x) + Math.abs(y);
                }else if(if_sign == 1 && change > Math.abs(x) + Math.abs(y)){
                    switch(this.pheromone[people[0]+x][people[1]+y].sign_orientation){
                        case 2:
                            end[1] += 1;
                            if(x > 0) end[0] += 1; else end[0] -= 1;
                            break;
                        case 4:
                            end[0] -= 1;
                            if(y > 0) end[1] += 1; else end[1] -= 1;
                            break;
                        case 5:
                            end[0] += 1;
                            if(y > 0) end[1] += 1; else end[1] -= 1;
                            break;
                        case 7:
                            end[1] -= 1;
                            if(x > 0) end[0] += 1; else end[0] -= 1;
                            break;
                    }
                    change = Math.abs(x) + Math.abs(y);
                }
            }
        }
    }
    if(change == 2 * range + 1)
        end = this.Step_random(end)
    return end;
}

Ant.prototype.Step_random = function(begin, range=1){
    if(range==0)
        range =  Math.floor(Math.random() * 1.99 + 1);
    var count=[];
    for(var x = -1 * range; x <= range; x++){
        for(var y = -1 * range; y <= range; y++){
            if(x == 0 && y == 0){}
            else{
                try{var if_ph = this.pheromone[begin[0]+x][begin[1]+y].ph;if(if_ph==undefined)if_ph = 0;}catch{var if_ph = 0;}
                if(if_ph)
                    count.push([x,y]);
            }
        }
    }
    console.log(range+'   '+count)
    var end = begin;
    if(count.length){
        var n = Math.floor(Math.random() * (count.length - 0.01));
        end[0] += count[n][0];
        end[1] += count[n][1];
    }
    return end;
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