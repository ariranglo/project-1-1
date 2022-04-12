let webcam;
let detector;

let myVidoeRec;

let videoFrame;

let state = 0;
// 0: main page  1: recording page  2: paused page  3: saved page

let btn_pause = [];
let btn_record = [];
let btn_stop = [];

let recordingTime = '00:00:00'; //Text type variable
let recordingStartTime = 0; //Number type varialbe
let pausedStartTime = 0; //Number type variable
let pausedTime = 0; //Number type variable
let totalPausedTime = 0; //Number type variable

let peopleNumber = 0;

let detectedObjects = [];

let myWriter;
let writerMsg='';
let v = 2;

function preload() {  
  detector = ml5.objectDetector('cocossd');
  
  
  btn_pause[0] = loadImage('icon/pause_1.png');
  btn_pause[1] = loadImage('icon/pause_2.png');
  btn_pause[2] = loadImage('icon/pause_3.png');
  
  btn_record[0] = loadImage('icon/start_1.png');
  btn_record[1] = loadImage('icon/start_2.png');
  btn_record[2] = loadImage('icon/start_3.png');
  btn_record[3] = loadImage('icon/start_4.png');
  
  btn_stop[0] = loadImage('icon/stop_1.png');
  btn_stop[1] = loadImage('icon/stop_2.png');
  btn_stop[2] = loadImage('icon/stop_3.png');
  
  
 }

function setup() {
  createCanvas(375 * v,812 * v);
  //webcam = createCapture(VIDEO);
  webcam = createVideo('C:/Users/bo/Downloads/climb.MOV', playVideo)
  //webcam = createVideo('', playVideo);
  webcam.size(375 * v,600 * v);
  webcam.hide();
  
  myVideoRec = new P5MovRec();
  
  detector.detect(webcam, gotDetections);
}

function draw() {
  background(0);
  
  calculateRecordingTime();
  
  drawVideoPreview(0,75 * v,375 * v,600 * v);
  
  doCOCOSSD(state);
  
  drawButtons(state);
  drawStatusBar(state);

  writeLog(state);
  
  peopleNumber = 0;
}

function drawVideoPreview(x, y, w, h){
  image(webcam, x, y, w, h);
  
}



function drawButtons(currentState){
  let pause_stop_button_number = 0;
  if(currentState == 0){
    image(btn_pause[0], 77.5 * v, 725 * v, 50 * v, 50 * v);
    image(btn_record[0], 157.5 * v, 725 * v, 50 * v, 50 * v);
    image(btn_stop[0], 237.5 * v, 725 * v, 50 * v, 50 * v);
  } if(currentState == 1){
    pause_stop_button_number = 1;
    image(btn_pause[1], 77.5 * v, 725 * v, 50 * v, 50 * v);
    image(btn_record[1], 157.5 * v, 725 * v, 50 * v, 50 * v);
    image(btn_stop[1], 237.5 * v, 725 * v, 50 * v, 50 * v);
  } if(currentState == 2){
    
    image(btn_pause[0], 77.5 * v, 725 * v, 50 * v, 50 * v);
    image(btn_record[2], 157.5 * v, 725* v, 50 * v, 50 * v);
    image(btn_stop[2], 237.5 * v, 725 * v, 50 * v, 50 * v);
  } if(currentState == 3){
    
    image(btn_pause[2], 77.5 * v, 725 * v, 50 * v, 50 * v);
    image(btn_record[3], 157.5 * v, 725 * v, 50 * v, 50 * v);
    image(btn_stop[1], 237.5 * v, 725 * v, 50 * v, 50 * v);
  } 

}



function drawStatusBar(currentState){

  textFont('Inter');
  
  
  let yy = year();
  let mm = month();
  let dd = day();
  let ho = hour();
  let mi = minute();
  let se = second();
  
  let realTime = ''+yy+'/'+nf(mm,2,0)+'/'+nf(dd,2,0)+'/'+nf(ho,2,0)+':'+nf(mi,2,0)+':'+nf(se,2,0);
 
  if(currentState == 0){
    
    fill(255);
    noStroke();
    textAlign(CENTER);
    textSize(20 * v);
    text(recordingTime, 182.5 * v, 64 * v);
    textSize(14 * v);
    textAlign(RIGHT);
    text(realTime, 370 * v, 695 * v);
    textAlign(LEFT);
    text('Perform: '+peopleNumber,5 * v, 695 * v)
    
  }else if(currentState == 1){
    

    fill(255, 134,228);
    noStroke();
    rect(130 * v, 45 * v,105 * v,25 * v,5);
    fill(255);
    noStroke();
    textAlign(CENTER);
    textSize(20 * v);
    text(recordingTime, 182.5 * v, 64 * v);
    textSize(14 * v);
    textAlign(RIGHT);
    text(realTime, 370 * v, 695 * v);
    textAlign(LEFT);
    text('Perform: '+peopleNumber,5 * v, 695 * v);
    
  }else if(currentState == 2){
    fill(255);
    noStroke();
    textAlign(CENTER);
    textSize(20 * v);
    text(recordingTime, 182.5 * v, 64 * v);
    textSize(14 * v);
    fill(255,153);
    textAlign(RIGHT);
    text(realTime, 370 * v, 695 * v);
    textAlign(LEFT);
    text('Perform: '+peopleNumber,5 * v, 695 * v);
    
    fill(255, 134, 228);
    noStroke();
    rect(70 * v, 345 * v, 225 * v, 55 * v, 5);
    fill(255);
    textAlign(CENTER);
    text('Total Recording Time: '+recordingTime,182.5 * v, 364 * v);
    text('Click check button for saving',182.5 * v, 390 * v);
    

  }else if(currentState == 3){
    
    fill(255, 134,228);
    noStroke();
    textAlign(CENTER);
    textSize(20 * v);
    text(recordingTime, 182.5 * v, 64 * v);
    textSize(14 * v);
    fill(255);
    textAlign(RIGHT);
    text(realTime, 370 * v, 695 * v);
    textAlign(LEFT);
    text('Perform: '+peopleNumber,5 * v, 695 * v);
    
  }
}

function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  
  detectedObjects = results;
  detector.detect(webcam, gotDetections);
}
//==========================BUTTON ACTION ADDED===============================
function mouseReleased(){
  if(state == 0){
    if(dist(mouseX, mouseY, 182.5 * v, 750 * v) <= 25){ // for Recording BTN
      state = 1; //go to 1.Recording Page from 0.Main Page.
      recordingStartTime = millis();
      startLog();
      myVideoRec.startRec(); // start recording video
    }
  }else if(state == 1){
    if(dist(mouseX, mouseY, 102.5 * v, 750 * v) <= 25){ // for Pause BTN
      state = 3; //go to 2.Paused Page from 1.Recording Page.
      pausedStartTime = millis();
    }
    if(dist(mouseX, mouseY, 252.5 * v, 750 * v) <= 25){ // for Stop BTN
      state = 2; //go to 3.Saved Page from 1.Recording Page.
      initializeTimes();
       // stop and save the video
    }
  }else if(state == 3){
    if(dist(mouseX, mouseY, 182.5 * v, 750 * v) <= 25){ // for Recording BTN
      state = 1; //go to 1.Recording Page from 2.Paused Page.
      totalPausedTime = totalPausedTime + pausedTime;
    }if(dist(mouseX, mouseY, 252.5 * v, 750 * v) <= 25){ // for Stop BTN
      state = 2; //go to 3.Saved Page from 1.Recording Page.
      initializeTimes();
       // stop and save the video
    }
  }else if(state == 2){
    if(dist(mouseX, mouseY, 182.5 * v, 750 * v) <= 25){ // for Recording BTN
      state = 0; //go to 0.Main Page from 3.Saved Page.
      saveLog();
      myVideoRec.stopRec();
    }
  }
}
function initializeTimes(){
  recordingStartTime = 0;
  pausedStartTime = 0;
  pausedTime = 0;
  totalPausedTime = 0;
}
function calculateRecordingTime(){
  let cur_time = millis();
  
  if(state == 0){ //0.Main Page
    recordingTime = '00:00:00';
  }else if(state == 1){ //1.Recording Page
    let rec_time = cur_time - recordingStartTime - totalPausedTime;
    let rec_sec = int(rec_time / 1000) % 60;
    let rec_min = int(rec_time / (1000*60)) % 60;
    let rec_hour = int(rec_time / (1000*60*60)) % 60;
    
    recordingTime = ''+nf(rec_hour,2,0)+':'+nf(rec_min,2,0)+':'+nf(rec_sec,2,0);
  }else if(state == 3){ //2.Paused Page
    pausedTime = millis() - pausedStartTime;
  }
}
//==========================COCOSSD ADDED===============================
function doCOCOSSD(){
  let tempMsg='';
  for (let i = 0; i < detectedObjects.length; i++) {
    let object = detectedObjects[i];
    
    if(object.label == 'person'){
      peopleNumber = peopleNumber + 1;
      
      stroke(255, 134, 228);
      strokeWeight(2 * v);
      noFill();
      rect(object.x , object.y+75* v, object.width , object.height);
      noStroke();
      fill(255, 134, 228);
      textSize(10 * v);
      text(object.label+' '+peopleNumber, object.x , object.y -5 + 75* v );
      
      let centerX = object.x  + object.width/2;
      let centerY = object.y+75* v + object.height/2;
      strokeWeight(4 * v);
      stroke(255, 134,228);
      point(centerX , centerY+75 * v);
      
      tempMsg = tempMsg+','+peopleNumber+','+centerX+','+centerY +','+object.width +','+object.height;
      //개별 사람마다의 X, Y 좌표값 저장
    }
  }
  let millisTime = int(millis() - recordingStartTime - totalPausedTime);
  writerMsg = ''+recordingTime+','+millisTime+','+peopleNumber+''+tempMsg;
  // 현재 레코딩 타임과 함께 tempMsg 저장
}
//==========================WRITER ADDED===============================
function startLog(){
  let mm = nf(month(),2,0);
  let dd = nf(day(),2,0);
  let ho = nf(hour(),2,0);
  let mi = nf(minute(),2,0);
  let se = nf(second(),2,0);
  
  let fileName = 'data_'+ mm + dd +'_'+ ho + mi + se+'.csv';
  
  myWriter = createWriter(fileName);
}
function saveLog(){
  myWriter.close();
  myWriter.clear();
}
function writeLog(currentState){
  if(currentState == 1){
    myWriter.print(writerMsg);
  }
}

function playVideo(){
  webcam.loop();
}