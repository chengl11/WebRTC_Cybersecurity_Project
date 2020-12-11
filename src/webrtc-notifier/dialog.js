
var continueButton = window.document.getElementById("continue-button");

continueButton.addEventListener("click", closeWin);

function closeWin() {
    window.close();
}


// function changePosition() {
//     var screenAvailWidth = window.screen.availWidth;
//     var screenAvailHeight = window.screen.availHeight;
//     var iHeight = 400;
//     var iWidth = 400;
//     var iTop = (screenAvailHeight - iHeight) / 2;
//     var iLeft = (screenAvailWidth - iWidth) / 2;

//     window.resizeTo(iHeight,iWidth);
//     window.moveTo(iLeft,iTop);
// }
// changePosition();

