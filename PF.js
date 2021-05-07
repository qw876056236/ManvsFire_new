(()=>{var t={191:(t,e,i)=>{i(925)},925:(t,e,i)=>{PF={Heap:i(353),Node:i(561),Grid:i(481),Util:i(902),DiagonalMovement:i(911),Heuristic:i(223),AStarFinder:i(878),BestFirstFinder:i(174),BreadthFirstFinder:i(634),DijkstraFinder:i(929),BiAStarFinder:i(534),BiBestFirstFinder:i(57),BiBreadthFirstFinder:i(764),BiDijkstraFinder:i(738),IDAStarFinder:i(807),JumpPointFinder:i(544)},t.exports=PF},911:t=>{t.exports={Always:1,Never:2,IfAtMostOneObstacle:3,OnlyWhenNoObstacles:4}},481:(t,e,i)=>{var n=i(561),s=i(911);function r(t,e,i){var n;"object"!=typeof t?n=t:(e=t.length,n=t[0].length,i=t),this.width=n,this.height=e,this.nodes=this._buildNodes(n,e,i)}r.prototype._buildNodes=function(t,e,i){var s,r,o=new Array(e);for(s=0;s<e;++s)for(o[s]=new Array(t),r=0;r<t;++r)o[s][r]=new n(r,s);if(void 0===i)return o;if(i.length!==e||i[0].length!==t)throw new Error("Matrix size does not fit");for(s=0;s<e;++s)for(r=0;r<t;++r)i[s][r]&&(o[s][r].walkable=!1);return o},r.prototype.getNodeAt=function(t,e){return this.nodes[e][t]},r.prototype.isWalkableAt=function(t,e){return this.isInside(t,e)&&this.nodes[e][t].walkable},r.prototype.isInside=function(t,e){return t>=0&&t<this.width&&e>=0&&e<this.height},r.prototype.setWalkableAt=function(t,e,i){this.nodes[e][t].walkable=i},r.prototype.getNeighbors=function(t,e){var i=t.x,n=t.y,r=[],o=!1,a=!1,l=!1,h=!1,u=!1,p=!1,c=!1,f=!1,d=this.nodes;if(this.isWalkableAt(i,n-1)&&(r.push(d[n-1][i]),o=!0),this.isWalkableAt(i+1,n)&&(r.push(d[n][i+1]),l=!0),this.isWalkableAt(i,n+1)&&(r.push(d[n+1][i]),u=!0),this.isWalkableAt(i-1,n)&&(r.push(d[n][i-1]),c=!0),e===s.Never)return r;if(e===s.OnlyWhenNoObstacles)a=c&&o,h=o&&l,p=l&&u,f=u&&c;else if(e===s.IfAtMostOneObstacle)a=c||o,h=o||l,p=l||u,f=u||c;else{if(e!==s.Always)throw new Error("Incorrect value of diagonalMovement");a=!0,h=!0,p=!0,f=!0}return a&&this.isWalkableAt(i-1,n-1)&&r.push(d[n-1][i-1]),h&&this.isWalkableAt(i+1,n-1)&&r.push(d[n-1][i+1]),p&&this.isWalkableAt(i+1,n+1)&&r.push(d[n+1][i+1]),f&&this.isWalkableAt(i-1,n+1)&&r.push(d[n+1][i-1]),r},r.prototype.clone=function(){var t,e,i=this.width,s=this.height,o=this.nodes,a=new r(i,s),l=new Array(s);for(t=0;t<s;++t)for(l[t]=new Array(i),e=0;e<i;++e)l[t][e]=new n(e,t,o[t][e].walkable);return a.nodes=l,a},t.exports=r},223:t=>{t.exports={manhattan:function(t,e){return t+e},euclidean:function(t,e){return Math.sqrt(t*t+e*e)},octile:function(t,e){var i=Math.SQRT2-1;return t<e?i*t+e:i*e+t},chebyshev:function(t,e){return Math.max(t,e)}}},561:t=>{t.exports=function(t,e,i){this.x=t,this.y=e,this.walkable=void 0===i||i}},902:(t,e)=>{function i(t){for(var e=[[t.x,t.y]];t.parent;)t=t.parent,e.push([t.x,t.y]);return e.reverse()}function n(t,e,i,n){var s,r,o,a,l,h,u=Math.abs,p=[];for(s=t<i?1:-1,r=e<n?1:-1,l=(o=u(i-t))-(a=u(n-e));p.push([t,e]),t!==i||e!==n;)(h=2*l)>-a&&(l-=a,t+=s),h<o&&(l+=o,e+=r);return p}e.backtrace=i,e.biBacktrace=function(t,e){var n=i(t),s=i(e);return n.concat(s.reverse())},e.pathLength=function(t){var e,i,n,s,r,o=0;for(e=1;e<t.length;++e)i=t[e-1],n=t[e],s=i[0]-n[0],r=i[1]-n[1],o+=Math.sqrt(s*s+r*r);return o},e.interpolate=n,e.expandPath=function(t){var e,i,s,r,o,a,l=[],h=t.length;if(h<2)return l;for(o=0;o<h-1;++o)for(e=t[o],i=t[o+1],r=(s=n(e[0],e[1],i[0],i[1])).length,a=0;a<r-1;++a)l.push(s[a]);return l.push(t[h-1]),l},e.smoothenPath=function(t,e){var i,s,r,o,a,l,h,u,p,c=e.length,f=e[0][0],d=e[0][1],g=e[c-1][0],b=e[c-1][1];for(r=[[i=f,s=d]],o=2;o<c;++o){for(h=n(i,s,(l=e[o])[0],l[1]),p=!1,a=1;a<h.length;++a)if(u=h[a],!t.isWalkableAt(u[0],u[1])){p=!0;break}p&&(lastValidCoord=e[o-1],r.push(lastValidCoord),i=lastValidCoord[0],s=lastValidCoord[1])}return r.push([g,b]),r},e.compressPath=function(t){if(t.length<3)return t;var e,i,n,s,r,o,a=[],l=t[0][0],h=t[0][1],u=t[1][0],p=t[1][1],c=u-l,f=p-h;for(c/=r=Math.sqrt(c*c+f*f),f/=r,a.push([l,h]),o=2;o<t.length;o++)e=u,i=p,n=c,s=f,c=(u=t[o][0])-e,f=(p=t[o][1])-i,f/=r=Math.sqrt(c*c+f*f),(c/=r)===n&&f===s||a.push([e,i]);return a.push([u,p]),a}},878:(t,e,i)=>{var n=i(353),s=i(902),r=i(223),o=i(911);function a(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.heuristic=t.heuristic||r.manhattan,this.weight=t.weight||1,this.diagonalMovement=t.diagonalMovement,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=o.OnlyWhenNoObstacles:this.diagonalMovement=o.IfAtMostOneObstacle:this.diagonalMovement=o.Never),this.diagonalMovement===o.Never?this.heuristic=t.heuristic||r.manhattan:this.heuristic=t.heuristic||r.octile}a.prototype.findPath=function(t,e,i,r,o){var a,l,h,u,p,c,f,d,g=new n((function(t,e){return t.f-e.f})),b=o.getNodeAt(t,e),A=o.getNodeAt(i,r),v=this.heuristic,y=this.diagonalMovement,k=this.weight,m=Math.abs,W=Math.SQRT2;for(b.g=0,b.f=0,g.push(b),b.opened=!0;!g.empty();){if((a=g.pop()).closed=!0,a===A)return s.backtrace(A);for(u=0,p=(l=o.getNeighbors(a,y)).length;u<p;++u)(h=l[u]).closed||(c=h.x,f=h.y,d=a.g+(c-a.x==0||f-a.y==0?1:W),(!h.opened||d<h.g)&&(h.g=d,h.h=h.h||k*v(m(c-i),m(f-r)),h.f=h.g+h.h,h.parent=a,h.opened?g.updateItem(h):(g.push(h),h.opened=!0)))}return[]},t.exports=a},174:(t,e,i)=>{var n=i(878);function s(t){n.call(this,t);var e=this.heuristic;this.heuristic=function(t,i){return 1e6*e(t,i)}}s.prototype=new n,s.prototype.constructor=s,t.exports=s},534:(t,e,i)=>{var n=i(353),s=i(902),r=i(223),o=i(911);function a(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.heuristic=t.heuristic||r.manhattan,this.weight=t.weight||1,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=o.OnlyWhenNoObstacles:this.diagonalMovement=o.IfAtMostOneObstacle:this.diagonalMovement=o.Never),this.diagonalMovement===o.Never?this.heuristic=t.heuristic||r.manhattan:this.heuristic=t.heuristic||r.octile}a.prototype.findPath=function(t,e,i,r,o){var a,l,h,u,p,c,f,d,g=function(t,e){return t.f-e.f},b=new n(g),A=new n(g),v=o.getNodeAt(t,e),y=o.getNodeAt(i,r),k=this.heuristic,m=this.diagonalMovement,W=this.weight,M=Math.abs,w=Math.SQRT2;for(v.g=0,v.f=0,b.push(v),v.opened=1,y.g=0,y.f=0,A.push(y),y.opened=2;!b.empty()&&!A.empty();){for((a=b.pop()).closed=!0,u=0,p=(l=o.getNeighbors(a,m)).length;u<p;++u)if(!(h=l[u]).closed){if(2===h.opened)return s.biBacktrace(a,h);c=h.x,f=h.y,d=a.g+(c-a.x==0||f-a.y==0?1:w),(!h.opened||d<h.g)&&(h.g=d,h.h=h.h||W*k(M(c-i),M(f-r)),h.f=h.g+h.h,h.parent=a,h.opened?b.updateItem(h):(b.push(h),h.opened=1))}for((a=A.pop()).closed=!0,u=0,p=(l=o.getNeighbors(a,m)).length;u<p;++u)if(!(h=l[u]).closed){if(1===h.opened)return s.biBacktrace(h,a);c=h.x,f=h.y,d=a.g+(c-a.x==0||f-a.y==0?1:w),(!h.opened||d<h.g)&&(h.g=d,h.h=h.h||W*k(M(c-t),M(f-e)),h.f=h.g+h.h,h.parent=a,h.opened?A.updateItem(h):(A.push(h),h.opened=2))}}return[]},t.exports=a},57:(t,e,i)=>{var n=i(534);function s(t){n.call(this,t);var e=this.heuristic;this.heuristic=function(t,i){return 1e6*e(t,i)}}s.prototype=new n,s.prototype.constructor=s,t.exports=s},764:(t,e,i)=>{var n=i(902),s=i(911);function r(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=s.OnlyWhenNoObstacles:this.diagonalMovement=s.IfAtMostOneObstacle:this.diagonalMovement=s.Never)}r.prototype.findPath=function(t,e,i,s,r){var o,a,l,h,u,p=r.getNodeAt(t,e),c=r.getNodeAt(i,s),f=[],d=[],g=this.diagonalMovement;for(f.push(p),p.opened=!0,p.by=0,d.push(c),c.opened=!0,c.by=1;f.length&&d.length;){for((l=f.shift()).closed=!0,h=0,u=(o=r.getNeighbors(l,g)).length;h<u;++h)if(!(a=o[h]).closed)if(a.opened){if(1===a.by)return n.biBacktrace(l,a)}else f.push(a),a.parent=l,a.opened=!0,a.by=0;for((l=d.shift()).closed=!0,h=0,u=(o=r.getNeighbors(l,g)).length;h<u;++h)if(!(a=o[h]).closed)if(a.opened){if(0===a.by)return n.biBacktrace(a,l)}else d.push(a),a.parent=l,a.opened=!0,a.by=1}return[]},t.exports=r},738:(t,e,i)=>{var n=i(534);function s(t){n.call(this,t),this.heuristic=function(t,e){return 0}}s.prototype=new n,s.prototype.constructor=s,t.exports=s},634:(t,e,i)=>{var n=i(902),s=i(911);function r(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=s.OnlyWhenNoObstacles:this.diagonalMovement=s.IfAtMostOneObstacle:this.diagonalMovement=s.Never)}r.prototype.findPath=function(t,e,i,s,r){var o,a,l,h,u,p=[],c=this.diagonalMovement,f=r.getNodeAt(t,e),d=r.getNodeAt(i,s);for(p.push(f),f.opened=!0;p.length;){if((l=p.shift()).closed=!0,l===d)return n.backtrace(d);for(h=0,u=(o=r.getNeighbors(l,c)).length;h<u;++h)(a=o[h]).closed||a.opened||(p.push(a),a.opened=!0,a.parent=l)}return[]},t.exports=r},929:(t,e,i)=>{var n=i(878);function s(t){n.call(this,t),this.heuristic=function(t,e){return 0}}s.prototype=new n,s.prototype.constructor=s,t.exports=s},807:(t,e,i)=>{i(902);var n=i(223),s=i(561),r=i(911);function o(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.diagonalMovement=t.diagonalMovement,this.heuristic=t.heuristic||n.manhattan,this.weight=t.weight||1,this.trackRecursion=t.trackRecursion||!1,this.timeLimit=t.timeLimit||1/0,this.diagonalMovement||(this.allowDiagonal?this.dontCrossCorners?this.diagonalMovement=r.OnlyWhenNoObstacles:this.diagonalMovement=r.IfAtMostOneObstacle:this.diagonalMovement=r.Never),this.diagonalMovement===r.Never?this.heuristic=t.heuristic||n.manhattan:this.heuristic=t.heuristic||n.octile}o.prototype.findPath=function(t,e,i,n,r){var o,a,l,h=(new Date).getTime(),u=function(t,e){return this.heuristic(Math.abs(e.x-t.x),Math.abs(e.y-t.y))}.bind(this),p=function(t,e,i,n,o){if(this.timeLimit>0&&(new Date).getTime()-h>1e3*this.timeLimit)return 1/0;var a,l,c,d,g=e+u(t,f)*this.weight;if(g>i)return g;if(t==f)return n[o]=[t.x,t.y],t;var b,A,v=r.getNeighbors(t,this.diagonalMovement);for(c=0,a=1/0;d=v[c];++c){if(this.trackRecursion&&(d.retainCount=d.retainCount+1||1,!0!==d.tested&&(d.tested=!0)),(l=p(d,e+(A=d,(b=t).x===A.x||b.y===A.y?1:Math.SQRT2),i,n,o+1))instanceof s)return n[o]=[t.x,t.y],l;this.trackRecursion&&0==--d.retainCount&&(d.tested=!1),l<a&&(a=l)}return a}.bind(this),c=r.getNodeAt(t,e),f=r.getNodeAt(i,n),d=u(c,f);for(o=0;;++o){if((l=p(c,0,d,a=[],0))===1/0)return[];if(l instanceof s)return a;d=l}return[]},t.exports=o},227:(t,e,i)=>{var n=i(150),s=i(911);function r(t){n.call(this,t)}r.prototype=new n,r.prototype.constructor=r,r.prototype._jump=function(t,e,i,n){var s=this.grid,r=t-i,o=e-n;if(!s.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(s.getNodeAt(t,e).tested=!0),s.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==r&&0!==o){if(s.isWalkableAt(t-r,e+o)&&!s.isWalkableAt(t-r,e)||s.isWalkableAt(t+r,e-o)&&!s.isWalkableAt(t,e-o))return[t,e];if(this._jump(t+r,e,t,e)||this._jump(t,e+o,t,e))return[t,e]}else if(0!==r){if(s.isWalkableAt(t+r,e+1)&&!s.isWalkableAt(t,e+1)||s.isWalkableAt(t+r,e-1)&&!s.isWalkableAt(t,e-1))return[t,e]}else if(s.isWalkableAt(t+1,e+o)&&!s.isWalkableAt(t+1,e)||s.isWalkableAt(t-1,e+o)&&!s.isWalkableAt(t-1,e))return[t,e];return this._jump(t+r,e+o,t,e)},r.prototype._findNeighbors=function(t){var e,i,n,r,o,a,l,h,u=t.parent,p=t.x,c=t.y,f=this.grid,d=[];if(u)e=u.x,i=u.y,n=(p-e)/Math.max(Math.abs(p-e),1),r=(c-i)/Math.max(Math.abs(c-i),1),0!==n&&0!==r?(f.isWalkableAt(p,c+r)&&d.push([p,c+r]),f.isWalkableAt(p+n,c)&&d.push([p+n,c]),f.isWalkableAt(p+n,c+r)&&d.push([p+n,c+r]),f.isWalkableAt(p-n,c)||d.push([p-n,c+r]),f.isWalkableAt(p,c-r)||d.push([p+n,c-r])):0===n?(f.isWalkableAt(p,c+r)&&d.push([p,c+r]),f.isWalkableAt(p+1,c)||d.push([p+1,c+r]),f.isWalkableAt(p-1,c)||d.push([p-1,c+r])):(f.isWalkableAt(p+n,c)&&d.push([p+n,c]),f.isWalkableAt(p,c+1)||d.push([p+n,c+1]),f.isWalkableAt(p,c-1)||d.push([p+n,c-1]));else for(l=0,h=(o=f.getNeighbors(t,s.Always)).length;l<h;++l)a=o[l],d.push([a.x,a.y]);return d},t.exports=r},169:(t,e,i)=>{var n=i(150),s=i(911);function r(t){n.call(this,t)}r.prototype=new n,r.prototype.constructor=r,r.prototype._jump=function(t,e,i,n){var s=this.grid,r=t-i,o=e-n;if(!s.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(s.getNodeAt(t,e).tested=!0),s.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==r&&0!==o){if(s.isWalkableAt(t-r,e+o)&&!s.isWalkableAt(t-r,e)||s.isWalkableAt(t+r,e-o)&&!s.isWalkableAt(t,e-o))return[t,e];if(this._jump(t+r,e,t,e)||this._jump(t,e+o,t,e))return[t,e]}else if(0!==r){if(s.isWalkableAt(t+r,e+1)&&!s.isWalkableAt(t,e+1)||s.isWalkableAt(t+r,e-1)&&!s.isWalkableAt(t,e-1))return[t,e]}else if(s.isWalkableAt(t+1,e+o)&&!s.isWalkableAt(t+1,e)||s.isWalkableAt(t-1,e+o)&&!s.isWalkableAt(t-1,e))return[t,e];return s.isWalkableAt(t+r,e)||s.isWalkableAt(t,e+o)?this._jump(t+r,e+o,t,e):null},r.prototype._findNeighbors=function(t){var e,i,n,r,o,a,l,h,u=t.parent,p=t.x,c=t.y,f=this.grid,d=[];if(u)e=u.x,i=u.y,n=(p-e)/Math.max(Math.abs(p-e),1),r=(c-i)/Math.max(Math.abs(c-i),1),0!==n&&0!==r?(f.isWalkableAt(p,c+r)&&d.push([p,c+r]),f.isWalkableAt(p+n,c)&&d.push([p+n,c]),(f.isWalkableAt(p,c+r)||f.isWalkableAt(p+n,c))&&d.push([p+n,c+r]),!f.isWalkableAt(p-n,c)&&f.isWalkableAt(p,c+r)&&d.push([p-n,c+r]),!f.isWalkableAt(p,c-r)&&f.isWalkableAt(p+n,c)&&d.push([p+n,c-r])):0===n?f.isWalkableAt(p,c+r)&&(d.push([p,c+r]),f.isWalkableAt(p+1,c)||d.push([p+1,c+r]),f.isWalkableAt(p-1,c)||d.push([p-1,c+r])):f.isWalkableAt(p+n,c)&&(d.push([p+n,c]),f.isWalkableAt(p,c+1)||d.push([p+n,c+1]),f.isWalkableAt(p,c-1)||d.push([p+n,c-1]));else for(l=0,h=(o=f.getNeighbors(t,s.IfAtMostOneObstacle)).length;l<h;++l)a=o[l],d.push([a.x,a.y]);return d},t.exports=r},410:(t,e,i)=>{var n=i(150),s=i(911);function r(t){n.call(this,t)}r.prototype=new n,r.prototype.constructor=r,r.prototype._jump=function(t,e,i,n){var s=this.grid,r=t-i,o=e-n;if(!s.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(s.getNodeAt(t,e).tested=!0),s.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==r&&0!==o){if(this._jump(t+r,e,t,e)||this._jump(t,e+o,t,e))return[t,e]}else if(0!==r){if(s.isWalkableAt(t,e-1)&&!s.isWalkableAt(t-r,e-1)||s.isWalkableAt(t,e+1)&&!s.isWalkableAt(t-r,e+1))return[t,e]}else if(0!==o&&(s.isWalkableAt(t-1,e)&&!s.isWalkableAt(t-1,e-o)||s.isWalkableAt(t+1,e)&&!s.isWalkableAt(t+1,e-o)))return[t,e];return s.isWalkableAt(t+r,e)&&s.isWalkableAt(t,e+o)?this._jump(t+r,e+o,t,e):null},r.prototype._findNeighbors=function(t){var e,i,n,r,o,a,l,h,u,p=t.parent,c=t.x,f=t.y,d=this.grid,g=[];if(p){if(e=p.x,i=p.y,n=(c-e)/Math.max(Math.abs(c-e),1),r=(f-i)/Math.max(Math.abs(f-i),1),0!==n&&0!==r)d.isWalkableAt(c,f+r)&&g.push([c,f+r]),d.isWalkableAt(c+n,f)&&g.push([c+n,f]),d.isWalkableAt(c,f+r)&&d.isWalkableAt(c+n,f)&&g.push([c+n,f+r]);else if(0!==n){u=d.isWalkableAt(c+n,f);var b=d.isWalkableAt(c,f+1),A=d.isWalkableAt(c,f-1);u&&(g.push([c+n,f]),b&&g.push([c+n,f+1]),A&&g.push([c+n,f-1])),b&&g.push([c,f+1]),A&&g.push([c,f-1])}else if(0!==r){u=d.isWalkableAt(c,f+r);var v=d.isWalkableAt(c+1,f),y=d.isWalkableAt(c-1,f);u&&(g.push([c,f+r]),v&&g.push([c+1,f+r]),y&&g.push([c-1,f+r])),v&&g.push([c+1,f]),y&&g.push([c-1,f])}}else for(l=0,h=(o=d.getNeighbors(t,s.OnlyWhenNoObstacles)).length;l<h;++l)a=o[l],g.push([a.x,a.y]);return g},t.exports=r},427:(t,e,i)=>{var n=i(150),s=i(911);function r(t){n.call(this,t)}r.prototype=new n,r.prototype.constructor=r,r.prototype._jump=function(t,e,i,n){var s=this.grid,r=t-i,o=e-n;if(!s.isWalkableAt(t,e))return null;if(!0===this.trackJumpRecursion&&(s.getNodeAt(t,e).tested=!0),s.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==r){if(s.isWalkableAt(t,e-1)&&!s.isWalkableAt(t-r,e-1)||s.isWalkableAt(t,e+1)&&!s.isWalkableAt(t-r,e+1))return[t,e]}else{if(0===o)throw new Error("Only horizontal and vertical movements are allowed");if(s.isWalkableAt(t-1,e)&&!s.isWalkableAt(t-1,e-o)||s.isWalkableAt(t+1,e)&&!s.isWalkableAt(t+1,e-o))return[t,e];if(this._jump(t+1,e,t,e)||this._jump(t-1,e,t,e))return[t,e]}return this._jump(t+r,e+o,t,e)},r.prototype._findNeighbors=function(t){var e,i,n,r,o,a,l,h,u=t.parent,p=t.x,c=t.y,f=this.grid,d=[];if(u)e=u.x,i=u.y,n=(p-e)/Math.max(Math.abs(p-e),1),r=(c-i)/Math.max(Math.abs(c-i),1),0!==n?(f.isWalkableAt(p,c-1)&&d.push([p,c-1]),f.isWalkableAt(p,c+1)&&d.push([p,c+1]),f.isWalkableAt(p+n,c)&&d.push([p+n,c])):0!==r&&(f.isWalkableAt(p-1,c)&&d.push([p-1,c]),f.isWalkableAt(p+1,c)&&d.push([p+1,c]),f.isWalkableAt(p,c+r)&&d.push([p,c+r]));else for(l=0,h=(o=f.getNeighbors(t,s.Never)).length;l<h;++l)a=o[l],d.push([a.x,a.y]);return d},t.exports=r},544:(t,e,i)=>{var n=i(911),s=i(427),r=i(227),o=i(410),a=i(169);t.exports=function(t){return(t=t||{}).diagonalMovement===n.Never?new s(t):t.diagonalMovement===n.Always?new r(t):t.diagonalMovement===n.OnlyWhenNoObstacles?new o(t):new a(t)}},150:(t,e,i)=>{var n=i(353),s=i(902),r=i(223);function o(t){t=t||{},this.heuristic=t.heuristic||r.manhattan,this.trackJumpRecursion=t.trackJumpRecursion||!1}i(911),o.prototype.findPath=function(t,e,i,r,o){var a,l=this.openList=new n((function(t,e){return t.f-e.f})),h=this.startNode=o.getNodeAt(t,e),u=this.endNode=o.getNodeAt(i,r);for(this.grid=o,h.g=0,h.f=0,l.push(h),h.opened=!0;!l.empty();){if((a=l.pop()).closed=!0,a===u)return s.expandPath(s.backtrace(u));this._identifySuccessors(a)}return[]},o.prototype._identifySuccessors=function(t){var e,i,n,s,o,a,l,h,u,p,c=this.grid,f=this.heuristic,d=this.openList,g=this.endNode.x,b=this.endNode.y,A=t.x,v=t.y,y=Math.abs;for(Math.max,s=0,o=(e=this._findNeighbors(t)).length;s<o;++s)if(i=e[s],n=this._jump(i[0],i[1],A,v)){if(a=n[0],l=n[1],(p=c.getNodeAt(a,l)).closed)continue;h=r.octile(y(a-A),y(l-v)),u=t.g+h,(!p.opened||u<p.g)&&(p.g=u,p.h=p.h||f(y(a-g),y(l-b)),p.f=p.g+p.h,p.parent=t,p.opened?d.updateItem(p):(d.push(p),p.opened=!0))}},t.exports=o},353:t=>{var i,n,s,r,o,a,l,h,u,p,c,f,d,g,b;s=Math.floor,p=Math.min,n=function(t,e){return e>t?-1:t>e?1:0},u=function(t,e,i,r,o){var a;if(null==i&&(i=0),null==o&&(o=n),0>i)throw new Error("lo must be non-negative");for(null==r&&(r=t.length);r>i;)o(e,t[a=s((i+r)/2)])<0?r=a:i=a+1;return[].splice.apply(t,[i,i-i].concat(e)),e},a=function(t,e,i){return null==i&&(i=n),t.push(e),g(t,0,t.length-1,i)},o=function(t,e){var i,s;return null==e&&(e=n),i=t.pop(),t.length?(s=t[0],t[0]=i,b(t,0,e)):s=i,s},h=function(t,e,i){var s;return null==i&&(i=n),s=t[0],t[0]=e,b(t,0,i),s},l=function(t,e,i){var s;return null==i&&(i=n),t.length&&i(t[0],e)<0&&(e=(s=[t[0],e])[0],t[0]=s[1],b(t,0,i)),e},r=function(t,e){var i,r,o,a,l,h;for(null==e&&(e=n),l=[],r=0,o=(a=function(){h=[];for(var e=0,i=s(t.length/2);i>=0?i>e:e>i;i>=0?e++:e--)h.push(e);return h}.apply(this).reverse()).length;o>r;r++)i=a[r],l.push(b(t,i,e));return l},d=function(t,e,i){var s;return null==i&&(i=n),-1!==(s=t.indexOf(e))?(g(t,0,s,i),b(t,s,i)):void 0},c=function(t,e,i){var s,o,a,h,u;if(null==i&&(i=n),!(o=t.slice(0,e)).length)return o;for(r(o,i),a=0,h=(u=t.slice(e)).length;h>a;a++)s=u[a],l(o,s,i);return o.sort(i).reverse()},f=function(t,e,i){var s,a,l,h,c,f,d,g,b;if(null==i&&(i=n),10*e<=t.length){if(!(l=t.slice(0,e).sort(i)).length)return l;for(a=l[l.length-1],h=0,f=(d=t.slice(e)).length;f>h;h++)i(s=d[h],a)<0&&(u(l,s,0,null,i),l.pop(),a=l[l.length-1]);return l}for(r(t,i),b=[],c=0,g=p(e,t.length);g>=0?g>c:c>g;g>=0?++c:--c)b.push(o(t,i));return b},g=function(t,e,i,s){var r,o,a;for(null==s&&(s=n),r=t[i];i>e&&s(r,o=t[a=i-1>>1])<0;)t[i]=o,i=a;return t[i]=r},b=function(t,e,i){var s,r,o,a,l;for(null==i&&(i=n),r=t.length,l=e,o=t[e],s=2*e+1;r>s;)r>(a=s+1)&&!(i(t[s],t[a])<0)&&(s=a),t[e]=t[s],s=2*(e=s)+1;return t[e]=o,g(t,l,e,i)},i=function(){function t(t){this.cmp=null!=t?t:n,this.nodes=[]}return t.push=a,t.pop=o,t.replace=h,t.pushpop=l,t.heapify=r,t.nlargest=c,t.nsmallest=f,t.prototype.push=function(t){return a(this.nodes,t,this.cmp)},t.prototype.pop=function(){return o(this.nodes,this.cmp)},t.prototype.peek=function(){return this.nodes[0]},t.prototype.contains=function(t){return-1!==this.nodes.indexOf(t)},t.prototype.replace=function(t){return h(this.nodes,t,this.cmp)},t.prototype.pushpop=function(t){return l(this.nodes,t,this.cmp)},t.prototype.heapify=function(){return r(this.nodes,this.cmp)},t.prototype.updateItem=function(t){return d(this.nodes,t,this.cmp)},t.prototype.clear=function(){return this.nodes=[]},t.prototype.empty=function(){return 0===this.nodes.length},t.prototype.size=function(){return this.nodes.length},t.prototype.clone=function(){var e;return(e=new t).nodes=this.nodes.slice(0),e},t.prototype.toArray=function(){return this.nodes.slice(0)},t.prototype.insert=t.prototype.push,t.prototype.remove=t.prototype.pop,t.prototype.top=t.prototype.peek,t.prototype.front=t.prototype.peek,t.prototype.has=t.prototype.contains,t.prototype.copy=t.prototype.clone,t}(),("undefined"!=typeof e&&null!==e?e.exports:void 0)?e.exports=i:window.Heap=i,t.exports=i}},i={};!function e(n){var s=i[n];if(void 0!==s)return s.exports;var r=i[n]={exports:{}};return t[n](r,r.exports,e),r.exports}(191)})();