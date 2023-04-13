//declarando as variáveis
var trex, trexRunning, trexDowning, trexCollided;
var ground;
var groundImage;
var ground2;
var cloudImage, cloudsGroup;
var obs1, obs2, obs3, obs4, obs5, obs6, obstaclesGroup;
var pteroAnimation,ptero
var score = 0;
const PLAY = 0;
const END = 1;
var gameState = PLAY;
var gameOver, gameOverImage
var restart, restartImage
var jump;
var die 
var checkPoint
var isDead = false
var highScore = 0

//preload carrega as mídias do jogo
function preload() {
  //criando animação do trex correndo
  trexRunning = loadAnimation("./images/trex3.png", "./images/trex4.png");
  trexCollided = loadAnimation("./images/trex_collided.png")
  trexDowning = loadAnimation("./images/trex5.png","./images/trex6.png")
  groundImage = loadImage("./images/ground2.png");
  cloudImage = loadImage("./images/cloud.png");
  obs1 = loadImage("./images/obstacle1.png");
  obs2 = loadImage("./images/obstacle2.png");
  obs3 = loadImage("./images/obstacle3.png");
  obs4 = loadImage("./images/obstacle4.png");
  obs5 = loadImage("./images/obstacle5.png");
  obs6 = loadImage("./images/obstacle6.png");
  pteroAnimation = loadAnimation("./images/ptero1.png","./images/ptero2.png")
  gameOverImage = loadImage("./images/gameOver.png")
  restartImage = loadImage("./images/restart.png")

  jump = loadSound("./sounds/jump.mp3")
  die = loadSound("./sounds/die.mp3")
  checkPoint = loadSound("./sounds/checkPoint.mp3")
}

function setup() {
  createCanvas(600,200);

  //sprite trex
  trex = createSprite(50, height-40, 20, 50);
  //adcionando animação ao trex
  trex.addAnimation("running", trexRunning);
  trex.addAnimation("collided",trexCollided);
  trex.addAnimation("downing",trexDowning);
  trex.scale = 0.5;
  trex.debug = false
  //trex.setCollider("circle",0,0,30)
  trex.setCollider("rectangle",0,0,90,30,120)

  //fazendo o trex IA
  //trex.setCollider("rectangle",0,0,100,100,0)

  //sprite Solo
  ground = createSprite(width/2, height-20, width, 20);
  ground.addImage(groundImage);
  ground.depth = trex.depth - 1;
  ground2 = createSprite(width/2, height-10, width, 10);
  ground2.visible = false;

  //criando grupos
  cloudsGroup = new Group()
  obstaclesGroup = new Group()

  //criando gameOver
  gameOver = createSprite(width/2,height-100,20,20)
  gameOver.addImage(gameOverImage)
  gameOver.scale = 0.5
  gameOver.visible = false

  //criando Restart
  restart = createSprite(width/2,height-60,20,20)
  restart.addImage(restartImage)
  restart.scale = 0.5
  restart.visible = false

}

function draw() {
  background(190);
  
  if (trex.isTouching(obstaclesGroup)) {
    // trex.velocityY = -10
    trex.changeAnimation("collided")
    gameState = END

    if (!isDead) {
      die.play()
      isDead = true
    }
  }

  if (gameState == PLAY) {

    score = score + Math.round((getFrameRate()/60));
   
    if (score % 100 == 0) {
      checkPoint.play()
    }

    //pulo do trex
    if ((keyDown("space") || touches.length > 0) && trex.y > height-40) {
      trex.velocityY = -10;
      jump.play();
      touches = []
    }

    if (keyDown("down")) {
      trex.changeAnimation("downing")
      trex.setCollider("rectangle",0,0,100,60,0)
    }else{
      trex.changeAnimation("running")
      trex.setCollider("rectangle",0,0,90,30,120)
    }
    ground.velocityX = -(2 + 2*score/100);
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    spawnClouds();

    spawnObstacles();
  }

  if (gameState == END) {
    ground.velocityX = 0
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    gameOver.visible = true
    restart.visible = true
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)

    if (score > highScore) {
      highScore = score
    }

    if (mousePressedOver(restart) || touches.length > 0) {
      reset()
      touches = []
    }
  }
  textAlign(CENTER, CENTER);
  //criando o score
  text("Score: " + score, width-100, height-175);
  text("HI: " + highScore, width-170, height-175);

  trex.velocityY += 0.5;
  trex.collide(ground2); 

  text("X: " + mouseX + " / Y: " + mouseY, mouseX, mouseY);

  drawSprites();
}


//console.log(frameCount)
// if (frameCount%60 == 0) {
//   console.log(frameCount)
// }

//números aleatórios
// var rand = Math.round(random(1,5))
// console.log(rand)

//arredondando números
//console.log(Math.round(1.9)) //arredonda para cima
//console.log(Math.floor(1.9)) //arredonda pra baixo

//função para gerar nuvens
function spawnClouds() {
  if (frameCount % 90 == 0) {
    var cloud = createSprite(width, 30, 20, 20);
    cloud.velocityX = -(2 + 2*score/100);
    cloud.addImage(cloudImage);
    cloud.scale = random(0.3, 1.3);
    cloud.y = random(height-180, height-100);
    cloud.depth = trex.depth - 1;
    cloud.lifetime = width/cloud.velocityX;
    //adicionando as nuvens ao grupo de nuvens
    cloudsGroup.add(cloud)
  }
}

function spawnObstacles() {
  if (frameCount % 150 == 0) {
    var obstacle = createSprite(width+50, height-30, 20, 30);
    obstacle.velocityX = -(2 + 2*score/100);

    var pteroPos = [height-40,height-70,height-50]
    //gerando números aleatórios para imagens do cacto
    var rand = Math.round(random(1, 7));
    //definindo as imagens dos cactos
    switch (rand) {
      case 1:
        obstacle.addImage(obs1);
        break;
      case 2:
        obstacle.addImage(obs2);
        break;
      case 3:
        obstacle.addImage(obs3);
        break;
      case 4:
        obstacle.addImage(obs4);
        break;
      case 5:
        obstacle.addImage(obs5);
        break;
      case 6:
        obstacle.addImage(obs6);
        break;
      case 7: 
        obstacle.addAnimation("ptero",pteroAnimation)
        obstacle.y = random(pteroPos)
        break
      default:
        break;
    }
    obstacle.scale = 0.4;
    obstacle.depth = trex.depth - 1;
    obstacle.lifetime = width/obstacle.velocityX;
    obstaclesGroup.add(obstacle)
  }
}

function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation("running")
  restart.visible = false
  gameOver.visible = false

  score = 0
}


