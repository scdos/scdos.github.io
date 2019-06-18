//点击开始，出现三米长的蛇开始运动，
//上下左右控制蛇头方向，界面中随机出现食物，
//判断吃到食物，食物消失，蛇++，分++
//碰撞到除食物外的物体，判断游戏结束
var kaishi = document.getElementsByClassName('kaishi')[0]	//开始按钮
var tanchuang = document.getElementById('tanchuang');		//废物弹窗
var fen = document.getElementById('shuzi');					//分数
var content = document.getElementById('content');			//主界面
var snakeMove;							//运动定时器
var speed = 150;						//定时器速度
//点击开始时的初始化
kaishi.onclick =function(){
	fen.innerHTML = "0";				//分数归零
	tanchuang.style.display = "none";	//废物
 	content.style.display = "block";	//主界面
	kaishi.innerHTML="加油";				//按钮变化
	fen.style.fontSize = "50px";
	fen.style.top = "800px";
	clearInterval(snakeMove);			//定时器清除，防止速度叠加
	removeClass("food");				//食物清除
	init();								//后续运行
}
//后续初始化运行
function init() {
	//地图大小
	this.mapW = parseInt(getComputedStyle(content).width);	
	this.mapH = parseInt(getComputedStyle(content).height);
	this.mapDiv = content;
	//食物大小位置
	this.foodW = 40;
	this.foodH = 40;
	this.foodX = 0;
	this.foodY = 0;
	//蛇大小位置初始化
	this.snakeW = 40;
	this.snakeH = 40;
	this.snakeBody = [[2,0,"head"],
					 [1,0,"body"],
					 [0,0,"body"]];
	//方向属性
	 this.direct = "right";
	 this.left = false;
	 this.right = false;
	 this.up = true;
	 this.down = true;
	 //分数初始化
	 this.shuzi = 0;
	startGame();	//正式开始
}
//实际开始运行函数
function startGame(){
	food();									//出现食物
	snake();								//出现蛇
	snakeMove = setInterval(function(){ 	//蛇运动函数
		move();				
	},speed);
	bindEvent();							//分数函数
}
function food(){
	var food = document.createElement("div");					//创造随机食物
	food.style.width = this.foodW + "px";						//宽
	food.style.height = this.foodH + "px";						//长
	food.style.position = "absolute";							//绝对定位
	this.foodX = Math.floor(Math.random()*(this.mapW/ 40));		//随机伪位置20*20
	this.foodY = Math.floor(Math.random()*(this.mapH/ 40));		//随机伪位置20*20
	food.style.left = this.foodX * 40 + "px";					//实际位置
	food.style.top = this.foodY * 40 + "px";					//实际位置
	this.mapDiv.appendChild(food).setAttribute("class","food");	//插入food，并赋予其class
}

function snake(){
	for (var i = 0; i < this.snakeBody.length; i++) {
		var snake = document.createElement("div");				//根据初始化时蛇的长度创造蛇
		snake.style.width = this.snakeW + "px";					//宽
		snake.style.height = this.snakeH + "px";				//高
		snake.style.position = "absolute";						//绝对定位
		snake.style.left = this.snakeBody[i][0] * 40 + "px";	//蛇每一节的位置
		snake.style.top = this.snakeBody[i][1] * 40 + "px";		//蛇每一节的位置
		snake.classList.add(this.snakeBody[i][2]);				//给定每一节蛇的类名
		this.mapDiv.appendChild(snake).classList.add("snake");	//插入snake，赋予其class
	}
}

function move(){
	for (var i = this.snakeBody.length - 1; i > 0 ; i--) {		//蛇的移动关键点
		this.snakeBody[i][0] = this.snakeBody[i - 1][0];		//在于后一位覆盖前一位
		this.snakeBody[i][1] = this.snakeBody[i - 1][1];
	}
	switch(this.direct){										//判断方向						
		case "right":  											//决定蛇头移动方向
		this.snakeBody[0][0] +=1;
		break;
		case "up":
		this.snakeBody[0][1] -=1;
		break;
		case "left":
		this.snakeBody[0][0] -=1;
		break;
		case "down":
		this.snakeBody[0][1] +=1;
		break;
		default:
		break;
	}
	removeClass("snake");										//清除前一刻的蛇
	snake();													//创建当前的蛇
	if (this.snakeBody[0][0] ==this.foodX && this.snakeBody[0][1] ==this.foodY) {	//判断蛇头是否碰撞到食物
		var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];				//获取蛇尾的伪坐标
		var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];				//获取蛇尾的伪坐标
		switch(this.direct){											//根据蛇运动方向在蛇尾前
			case "right": 												//再添加一个body
			this.snakeBody.push([snakeEndX + 1,snakeEndY,"body"]);
			break;
			case "up":
			this.snakeBody.push([snakeEndX,snakeEndY - 1,"body"]);
			break;
			case "left":
			this.snakeBody.push([snakeEndX - 1,snakeEndY,"body"]);
			break;
			case "down":
			this.snakeBody.push([snakeEndX,snakeEndY + 1,"body"]);
			break;
			default:
			break;
		}
		this.shuzi += 1;												//分数++
		fen.innerHTML = this.shuzi;										//分数添加到页面中
		removeClass("food");											//清除吃到的食物
		food();															//创建新食物
	}
	if (this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW/40) {			//判断碰撞边界
			relodGame();															//游戏结束
	}
	if (this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH/40) {			//判断碰撞边界
			relodGame();															//游戏结束
	}
	var snakeHX = this.snakeBody[0][0];												//蛇头伪坐标
	var snakeHY = this.snakeBody[0][1];												//蛇头伪坐标
	for (var i = 1; i < this.snakeBody.length; i++) {								
		if (snakeHX == snakeBody[i][0] && snakeHY ==snakeBody[i][1]) {				//判断蛇头碰撞蛇身
			relodGame();															//游戏结束
		}
	}

}
function relodGame(){							//游戏结束函数
	removeClass("snake");						//清除蛇
	removeClass("food");						//清除食物
	clearInterval(snakeMove);					//清除蛇运动函数
	this.snakeBody = [[3,1,"head"],				//重新初始化蛇位置
					 [2,1,"body"],
					 [1,1,"body"]];
	this.direct = "right";						//初始化蛇的方向属性
	 this.left = false;
	 this.right = false;
	 this.up = true;
	 this.down = true;
	 this.fen.style.fontSize = "200px";			//分数字体突出显示
	 this.fen.style.top = "700px";				//分数位置
	 this.tanchuang.style.display = "block";	//废物弹窗出现
	 this.tanchuang.style.color = "#f40";		//废物字色
	 this.content.style.display = "none";		//主界面隐藏
	 kaishi.innerHTML="重来";					//主按钮初始化

}
//清除函数
function removeClass(className){
	var ele = document.getElementsByClassName(className);	//选中传入参数
	while(ele.length > 0){
		ele[0].parentNode.removeChild(ele[0]);				//清除语法
	}
}

function setDerict(code){
	switch(code){							//根据按键返回值判断方向如何改变
		case 37: 							//并判断按键的可用性
		if(this.left){
			this.direct = "left";
			this.left = false;
			this.right = false;
			this.up = true;
			this.down = true;
		}
		break;
		case 38:
		if(this.up){
			this.direct = "up";
			this.left = true;
			this.right = true;
			this.up = false;
			this.down = false;
		}
		break;
		case 39:
		if(this.right){
			this.direct = "right";
			this.left = false;
			this.right = false;
			this.up = true;
			this.down = true;
		}
		break;
		case 40:
		if(this.down){
			this.direct = "down";
			this.left = true;
			this.right = true;
			this.up = false;
			this.down = false;
		}
		break;
		default:
		break;
	}
}
function bindEvent(e){					//绑定上下左右按键
	document.onkeydown = function(e){
		var code = e.keyCode;
		setDerict(code);				//返回阿斯克码
	}

}