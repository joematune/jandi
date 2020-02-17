
'use strict';

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ color: '#aaaaaa' }, function () {
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