"use strict";

let pixelM = (function() {
   let size = 10;
   let color = "black";

   const draw = (x, y) => {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.fillRect(x - (size / 2), y - (size / 2), size, size);
   };

   const changePixelColor = (newColor) => color = newColor;
   const changePixelSize = (newSize) => size = newSize;   

   return {draw, changePixelColor, changePixelSize};
})();

/*
 * SETUP CANVAS
*/

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let canDraw = false;

// Set canvas´ background color
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

// Mouse events
canvas.addEventListener("mousedown", (e) => {
   canDraw = true;
   pixelM.draw(e.offsetX, e.offsetY);
});

canvas.addEventListener("mouseup", () => canDraw = false);

canvas.addEventListener("mousemove", (e) => {
   if(canDraw) pixelM.draw(e.offsetX, e.offsetY);
});

canvas.addEventListener("mouseout", () => canDraw = false);

/*
 * CONTROLS
*/

// Change size
const sizeOption = document.querySelector("#sizes");
sizeOption.addEventListener("input", (e) => pixelM.changePixelSize(e.target.value));

// Set background color to the color buttons 
const colorItems = document.querySelectorAll(".colors__item");
colorItems.forEach(ele => {
   let color = ele.getAttribute("data-color");
   ele.style.backgroundColor = color;
});

// Change color
const colorList = document.querySelector("#color-list");
let previousColor = colorItems[colorItems.length -2];

colorList.addEventListener("click", changeColor);

function changeColor(e) {
   if(e.target.classList.contains("colors__item")) {
      previousColor.classList.remove("colors__item--selected");
      e.target.classList.add("colors__item--selected");
      previousColor = e.target;

      let color = e.target.getAttribute("data-color");
      pixelM.changePixelColor(color);
   }
}

// Reset canvas
document.querySelector("#reset-button").addEventListener("click", () => {
   ctx.fillStyle = "white";
   ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
});

// Save draw
const generateBtn = document.querySelector("#create-img-button");
const drawUl =  document.querySelector("#draws-list");

generateBtn.addEventListener("click", generateDraw);

function generateDraw() {
   // Creates a LI, A and IMG elements.
   let imgUrl = canvas.toDataURL();

   const li = document.createElement("li");
   li.className = "user-draws__li";

   const a = document.createElement("a");
   a.className = "user-draws__a";
   a.href = imgUrl;
   a.target = "_blank";

   const img = document.createElement("img");
   img.className = "user-draws__img";
   img.src = imgUrl;

   a.appendChild(img);
   li.appendChild(a);
   drawUl.appendChild(li);
}

/*
 * CLOSE / OPEN PANEL
*/

class Panel {
   constructor(state, direction, node) {
      this.state = state;
      this.direction = direction;
      this.node = node;
   }

   togglePanel() {
      let moveLeft = "translate(calc(-100% + 30px), 0)";
      let moveRight = "translate(calc(100% - 30px), 0)";
      
      let leftImg = "images/leftArrow.png";
      let rightImg = "images/rightArrow.png";
      
      let moveTo;
      let firstImg, secondImg;
      
      if(this.direction === "left") {
         // Left panel
         moveTo = moveLeft;
         firstImg = leftImg;
         secondImg = rightImg;
      } else {
         // Right panel
         moveTo = moveRight;
         firstImg = rightImg;
         secondImg = leftImg;
      }
   
      if(this.state) {
         // Close panel
         this.node.style.backgroundImage = `url(${secondImg})`;
         this.node.parentElement.style.transform = moveTo;
      } else {
         // Open panel
         this.node.style.backgroundImage = `url(${firstImg})`;
         this.node.parentElement.style.transform = "translate(0, 0)";
      }

      this.state = !this.state;
   }
}        

const leftPanel = document.querySelector("#left-panel");
const rightPanel = document.querySelector("#right-panel");

let panel1 = new Panel(true, "left", leftPanel);
let panel2 = new Panel(true, "right", rightPanel);

leftPanel.addEventListener("click", panel1.togglePanel.bind(panel1));
rightPanel.addEventListener("click", panel2.togglePanel.bind(panel2));

