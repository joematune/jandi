// Access popup.html buttons
let changeColor = document.getElementById('log');
let logStudent = document.getElementById('log-student');

// Retrieve data (color) from background.js storage.
chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

// Change body background to gray
changeColor.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let color = element.target.value;
        chrome.tabs.executeScript(
            tabs[0].id,
            { code: 'document.body.style.backgroundColor = "' + color + '";console.log("Changed bg color to grey");' });
    });
};

// Gather student names and IDs, then insert name into textarea
logStudent.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {  file: '/popup/addStudentName.js' }
        )
    });
};