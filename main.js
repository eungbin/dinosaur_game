let canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// 플레이어 Object
let dino = {
  x: 10,
  y: 200,
  width: 50,
  height: 50,
  moveY: 0,
  collisionBox: {
    x1: this.x,
    x2: this.x+this.width,
    y1: this.y,
    y2: this.y+this.height,
  },
  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.collisionBox = {
      x1: this.x,
      x2: this.x+this.width,
      y1: this.y,
      y2: this.y+this.height,
    };
  },
  jump() {
    this.y += this.moveY;
  }
}

// 장애물 Class
class Cactus {
  constructor() {
    this.x = 500;
    this.y = 200;
    this.width = 50;
    this.height = 50;
    this.collisionBox = {
      x1: this.x,
      x2: this.x + this.width,
      y1: this.y,
      y2: this.y + this.height,
    };
  }
  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.collisionBox = {
      x1: this.x,
      x2: this.x + this.width,
      y1: this.y,
      y2: this.y + this.height,
    };
  }
}

// 플레이어가 점프중인지 아닌지(true일 경우 점프 중)
let jump = false;

// 이벤트 리스너 등록 (키다운)
document.addEventListener('keydown', function(e) {
  if(e.code === 'Space')
    if(dino.y === 200 && jump === false)
      jump = true;
})

// 장애물 생성 Timer & 게임 Timer
let timer = 0;

// 장애물 배열
const cactusArr = [];

// Animation 변수
let animation;

function perFrame() {
  animation = requestAnimationFrame(perFrame);
  timer++;

  // canvas 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dino.draw();
  dino.jump();

  // 플레이어 점프 제어구문
  if(jump === true && dino.y > 100) {
    dino.moveY = -1;
  } else if(jump === true && dino.y === 100) {
    jump = false;
    dino.moveY = 1;
  } else if(jump === false && dino.y === 200) {
    dino.moveY = 0;
  }
  
  // 144Hz 모니터 기준 2초
  if(timer%288 == 0) {
    let cactus = new Cactus();
    cactusArr.push(cactus);
  }

  // 장애물 반복문
  cactusArr.forEach((a, index) => {
    a.draw();
    a.x--;
    isCollision(dino, a);
    
    // 장애물이 화면 밖으로 나가면 제거
    if(a.x < 0) {
      cactusArr.splice(index, 1);
    }
  });


}
perFrame();


// 두 번째 인자의 오브젝트가 첫 번째 인자의 오브젝트와 충돌하였는가
function isCollision(dino, cactus) {
  if(cactus.collisionBox.x1 <= dino.collisionBox.x2 &&
     cactus.collisionBox.y1 <= dino.collisionBox.y2 &&
     cactus.collisionBox.x2 >= dino.collisionBox.x1 &&
     cactus.collisionBox.y2 >= dino.collisionBox.y1) {
    console.log("부딪힘");
    cancelAnimationFrame(animation);
  }
}