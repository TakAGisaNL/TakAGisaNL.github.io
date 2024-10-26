// const myHeading = document.querySelector("h1");
// myHeading.textContent = "Hello world!";

const myImage = document.querySelector("img");

myImage.onclick = () => {
  const mySrc = myImage.getAttribute("src");
  if (mySrc === "images/shirogo.webp") {
    myImage.setAttribute("src", "images/shirogo_back.jpg");
  } else {
    myImage.setAttribute("src", "images/shirogo.webp");
  }
};

let myButton = document.querySelector("button");
let myHeading = document.querySelector("h1");

// function setUserName() {
//   const myname = prompt("please enter your name.");
//   localStorage.setItem("name", myname);
//   myHeading.textContent = `Shirogo is cooll, ${myname}`;
// }

// if (!localStorage.getItem("name")) {
//   setUserName();
// } else {
//   const storedName = localStorage.getItem("name");
//   myHeading.textContent = `Shirogo is cool, ${storedName}`;
// }

// myButton.onclick = function () {
//   setUserName();
// };
