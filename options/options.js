'use strict';

const kButtonColors = ['#444444', '#888888', '#aaaaaa', '#cccccc', '#ffffff'];

function constructOptions(kButtonColors) {
    let buttonDiv = document.getElementById('buttonDiv');
    for (let item of kButtonColors) {
        let button = document.createElement('button');
        button.style.backgroundColor = item;
        button.addEventListener('click', function () {
            chrome.storage.sync.set({ color: item }, function () {
                console.log('color is ' + item);
            })
        });
        buttonDiv.appendChild(button);
    }
}
constructOptions(kButtonColors);