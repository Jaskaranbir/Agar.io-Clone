var canvas = document.getElementById("canvas");
var stage = new Stage(canvas);

window.addEventListener("resize", function () {
  stage.resize();
});

document.addEventListener("click", function () {
  window.location.replace("index.html");
});