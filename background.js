'use strict';

let exampleStudents = {
    "112112": {
        id: "112112",
        name: "Chingching",
        gender: "boy"
    },
    "424242": {
        id: "424242",
        name: "jimmy",
        gender: "boy"
    },
    "848484": {
        id: "848484",
        name: "johnny",
        gender: "boy"
    },
    "911911": {
        id: "911911",
        name: "jamie",
        gender: "girl"
    },
    "2061728": {
        id: "2061728",
        name: "Tuantuan",
        gender: "boy"
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