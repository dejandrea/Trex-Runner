//declarando as variáveis
var trex, trexRunning;
var ground;
var groundImage;
var ground2;
var cloudImage;
//preload carrega as mídias do jogo
function preload() {
  //criando animação do trex correndo
  trexRunning = loadAnimation("./images/trex3.png", "./images/trex4.png");
  groundImage = loadImage("./images/ground2.png");
  cloudImage = loadImage("./images/cloud.png");
}

//setup faz a configuração
function setup() {
  createCanvas(600, 200);

  //sprite trex
  trex = createSprite(50, 160, 20, 50);
  //adcionando animação ao trex
  trex.addAnimation("running", trexRunning);
  trex.scale = 0.5;
  //sprite Solo
  ground = createSprite(300, 180, 600, 20);
  ground.addImage(groundImage);
  ground2 = createSprite(300, 190, 600, 10);
  ground2.visible = false;
}

//draw faz o movimento, a ação do jogo
function draw() {
  background(190);

  //pulo do trex

  if (keyDown("space") && trex.y > 160) {
    trex.velocityY = -10;
  }
  trex.velocityY += 0.5;
  trex.collide(ground2);
  //console.log(trex.y)
  ground.velocityX = -2;
  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }

  //chamando a função de gerar nuvens
  spawnClouds();

  //coordenadas do mouse na tela
  text("X: " + mouseX + " / Y: " + mouseY, mouseX, mouseY);

  drawSprites();

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
}

//função para gerar nuvens
function spawnClouds() {
  if (frameCount % 90 == 0) {
    var cloud = createSprite(600, 30, 20, 20);
    cloud.velocityX = -2;
    cloud.addImage(cloudImage)
    cloud.scale = random(0.3,1.3)
    cloud.y = random(20,100)
  }
}
