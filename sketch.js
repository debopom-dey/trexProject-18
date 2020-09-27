var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running,bgImage,bg ;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("download (13).png");

  
  cloudImage = loadImage("download (15).png");
  
  obstacle1 = loadImage("download (16).png");
  obstacle2 = loadImage("download (18).png");
  
  restartImg = loadImage("download (21).png")
  gameOverImg = loadImage("download (20).png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("gameover.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  bgImage=loadImage("sky.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
    
  bg= createSprite(width-350,height-350);
  bg.addImage(bgImage);
  bg.scale=2;
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  

  trex.scale = 1;
  
  ground = createSprite(width/2,height-20,width+15,width-600);
  //ground.addImage("ground",groundImage);
  //ground.x = ground.width /2;
  ground.shapeColor="green";
  //ground.scale=10
  gameOver = createSprite(width/2,height/2-200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);

 
  gameOver.scale = 3;
  restart.scale = 1;
  
  invisibleGround = createSprite(width/2,height-35,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",-1,5,50,30);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);

  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
   //ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(touches.length>0||keyDown("space")&& trex.y >= height/2+170) {
        trex.velocityY = -12;
        jumpSound.play();
      touches= []
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
  
      ground.velocityX = 0;
      trex.velocityY = 0
   
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
 
  if(mousePressedOver(restart)) {
      reset();
    }
   }
//stop trex from falling down
  trex.collide(invisibleGround);
  drawSprites();
  
    //displaying score
  textSize(20);
  fill("yellow");
  text("Score: "+ score, width-730,height-70);
}

function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score=0;
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width-5,height-105,height+100,width+20);
   //obstacle.scale=5;
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1)
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

