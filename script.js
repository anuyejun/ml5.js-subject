let imgElement; // 업로드된 이미지를 저장할 변수
let poseNet; // PoseNet 모델 저장을 위한 변수
let poses = []; // 인식된 포즈를 저장할 배열

function setup() {
  // p5.js의 createCanvas 대신 HTML canvas 요소를 직접 선택
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  // PoseNet 모델 초기화
  poseNet = ml5.poseNet(modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
    drawSkeleton(ctx); // 포즈가 인식되면 스켈레톤 그리기 함수 호출
  });

  // 이미지 업로드 핸들러
  document.getElementById('imageUpload').addEventListener('change', function(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function(fileEvent) {
        imgElement = new Image();
        imgElement.onload = function() {
          // 캔버스 사이즈를 이미지 사이즈에 맞춤
          canvas.width = imgElement.width;
          canvas.height = imgElement.height;
          ctx.drawImage(imgElement, 0, 0);
          poseNet.singlePose(imgElement);
        }
        imgElement.src = fileEvent.target.result;
      }
      reader.readAsDataURL(file);
    }
  });
}

function modelReady() {
  console.log("Model is ready!");
}

// 포즈에 따른 스켈레톤 그리기 함수
function drawSkeleton(ctx) {
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      ctx.beginPath();
      ctx.moveTo(partA.position.x, partA.position.y);
      ctx.lineTo(partB.position.x, partB.position.y);
      ctx.strokeStyle = 'green';
      ctx.stroke();
    }
  }
}

// setup 함수 실행
setup();