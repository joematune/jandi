'use strict';

let exampleStudents = {
    "2061728": {
        sId: "2061728",
        sName: "Tuantuan"
    }
}

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ color: '#aaaaaa', students: exampleStudents }, function () {
        console.log("The color is grey.");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'teacher.landi.com' },
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.commands.onCommand.addListener(function (command) {
    if (command == "addComments") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                { file: '/popup/addComments.js' }
            )
        });
    }
});