// Access popup.html buttons
let changeColor = document.getElementById('log');
let logStudent = document.getElementById('log-student');

// Retrieve data (color) from background.js storage.
chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

// Gather student names and IDs, run addComments.js
logStudent.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {  file: '/popup/addComments.js' }
        )
    });
};

// Change body background to gray
changeColor.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let color = element.target.value;
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'document.body.style.backgroundColor = "' + color + '";console.log("Changed bg color to grey");' }
        );
    });
};