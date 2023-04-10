//declarando as variáveis
var trex, trexRunning, trexCollided;
var ground;
var groundImage;
var ground2;
var cloudImage, cloudsGroup;
var obs1, obs2, obs3, obs4, obs5, obs6, obstaclesGroup;
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
  trexCollided = loadAnimation("/images/trex_collided.png")
  groundImage = loadImage("./images/ground2.png");
  cloudImage = loadImage("./images/cloud.png");
  obs1 = loadImage("./images/obstacle1.png");
  obs2 = loadImage("./images/obstacle2.png");
  obs3 = loadImage("./images/obstacle3.png");
  obs4 = loadImage("./images/obstacle4.png");
  obs5 = loadImage("./images/obstacle5.png");
  obs6 = loadImage("./images/obstacle6.png");
  gameOverImage = loadImage("./images/gameOver.png")
  restartImage = loadImage("./images/restart.png")

  jump = loadSound("./sounds/jump.mp3")
  die = loadSound("./sounds/die.mp3")
  checkPoint = loadSound("./sounds/checkPoint.mp3")
}
//setup faz a configuração
function setup() {
  createCanvas(600, 200);

  //sprite trex
  trex = createSprite(50, 160, 20, 50);
  //adcionando animação ao trex
  trex.addAnimation("running", trexRunning);
  trex.addAnimation("collided",trexCollided)
  trex.scale = 0.5;
  trex.debug = false
  //trex.setCollider("circle",0,0,30)
  trex.setCollider("rectangle",0,0,30,100,40)

  //fazendo o trex IA
  //trex.setCollider("rectangle",0,0,100,100,0)

  //sprite Solo
  ground = createSprite(300, 180, 600, 20);
  ground.addImage(groundImage);
  ground.depth = trex.depth - 1;
  ground2 = createSprite(300, 190, 600, 10);
  ground2.visible = false;

  //criando grupos
  cloudsGroup = new Group()
  obstaclesGroup = new Group()

  //criando gameOver
  gameOver = createSprite(300,100,20,20)
  gameOver.addImage(gameOverImage)
  gameOver.scale = 0.5
  gameOver.visible = false

  //criando Restart
  restart = createSprite(300,140,20,20)
  restart.addImage(restartImage)
  restart.scale = 0.5
  restart.visible = false


  // var nome = "João";
  // var idade = 15;
  // console.log("Olá " + nome)
  // console.log("Meu nome é " + nome + " e eu tenho " + idade + " anos")
}
//draw faz o movimento, a ação do jogo
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
    //o que acontece quando o jogo é play
    score = score + Math.round(getFrameRate()/60);
    

    if (score % 100 == 0) {
      checkPoint.play()
    }

    //pulo do trex
    if (keyDown("space") && trex.y > 160) {
      trex.velocityY = -10;
      jump.play();
    }

    ground.velocityX = -(3 + 3*score/100);
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //chamando a função de gerar nuvens
    spawnClouds();

    //chamando a função para gerar cactos
    spawnObstacles();
  }

  if (gameState == END) {
    //o que acontece no modo end
    ground.velocityX = 0
    //parando os grupos
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    //fazendo o gameOver aparecer na tela
    gameOver.visible = true
    restart.visible = true
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)

    if (score > highScore) {
      highScore = score
    }

    if (mousePressedOver(restart)) {
      reset()
    }
  }
  textAlign(CENTER, CENTER);
  //criando o score
  text("Score: " + score, 500, 25);
  text("HI: " + highScore, 430, 25);

  trex.velocityY += 0.5;
  trex.collide(ground2); 
  //console.log(trex.y)
  // console.log(trex.depth)
  // console.log(ground.depth)
  //coordenadas do mouse na tela
  text("X: " + mouseX + " / Y: " + mouseY, mouseX, mouseY);

  drawSprites();
}

//contagem de quadros
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
    var cloud = createSprite(600, 30, 20, 20);
    cloud.velocityX = -(3 + 3*score/100);
    cloud.addImage(cloudImage);
    cloud.scale = random(0.3, 1.3);
    cloud.y = random(20, 100);
    cloud.depth = trex.depth - 1;
    cloud.lifetime = 400;
    //adicionando as nuvens ao grupo de nuvens
    cloudsGroup.add(cloud)
  }
}

//função para gerar cactos
function spawnObstacles() {
  if (frameCount % 150 == 0) {
    var obstacle = createSprite(650, 170, 20, 30);
    obstacle.velocityX = -(3 + 3*score/100);

    //gerando números aleatórios para imagens do cacto
    var rand = Math.round(random(1, 6));
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
      default:
        break;
    }
    obstacle.scale = 0.4;
    obstacle.depth = trex.depth - 1;
    obstacle.lifetime = 400;
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