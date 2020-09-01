//Create variables here
var dog, happyDog;
var database;
var foodS, foodStock, feedButton, addFood, number, milkImage, lastFed, fedRef;
var foodObj;
function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png")
}

function setup() {
  foodObj = new Food();
  canvas = createCanvas(1000,400);
  dog = createSprite(200,400);
  //happyDog = createSprite();
  dog.addImage(dogImg);
  //happyDog.addImage(happyDogImg);
  dog.scale = 0.3;
  database = firebase.database();
  foodStock = database.ref("Food");
  foodStock.on("value",readStock);
  feedButton = createButton("Feed the dog");
  feedButton.position(50,20);
  addFood = createButton("Add food");
  addFood.position(150,20);
}


function draw() {
  background(46, 139, 87);
  foodObj.display();
    fedRef = database.ref("Last Fed");
    fedRef.on('value', function(data){
    lastFed = data.val();
  })
  addFood.mousePressed(function(){
    addFoods();
  })
  feedButton.mousePressed(function(){
    feedDog();
  })
  drawSprites();
  //add styles here
  textSize(20);
  //text("Note: Press the up arrow key to feed Drago!",50,50);
  text("Food Remaining:"+foodS,200,100);
  if(lastFed>=12){
    text("Last Fed:"+ lastFed%12+"PM", 350,30);
  }
  else if(lastFed === 0){
    text("Last Fed: 12 AM",350,30);
  }
  else{
    text("Last Fed:"+ lastFed+"AM",350,30);
  }
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodS(foodS);
}
function readTime(data){
  time = data.val();
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function feedDog(){
  dog.addImage(happyDogImg);
  foodObj.updateFoodS(foodObj.getFoodStock()-1);
  foodS = foodS-1;
  database.ref('/').update({
    Food:foodObj.getFoodS(),
    Time: hour()
  })
}
