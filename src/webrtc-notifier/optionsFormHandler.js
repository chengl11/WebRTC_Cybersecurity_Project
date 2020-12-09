if (typeof browser === 'undefined') {
  browser = chrome;
}

var form = document.querySelector("form");
var log = document.querySelector("#log");
form.addEventListener("submit", function(event) {
  var data = new FormData(form);
  var output = "Your setting ";
  
  for (const entry of data) {
    console.log(entry);
    browser.runtime.sendMessage({
      'from': 'notifierOptions',
      'option': entry[0],
      'choice': entry[1],
    });
    if (entry[0] === 'activate') {
      output += 'is set to ';
      if (entry[1] === 'onConnect') {
        output += '"Activate automatically"'
      } else {
        output += '"Activate when clicked"'
      }
      chrome.storage.local.set({activate: entry[1]});
    }
  }
  log.innerText = output;
  // log.innerText = output+" is saved";
  event.preventDefault();
}, false);
