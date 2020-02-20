if (document.querySelector('.memo-div')) {
    // Create and add <link rel="stylesheet"...>
    function addJandiStyle() {
        // Checks if gender button exists
        if (document.querySelector('button.gender')) return;
        // Creates <link> stylesheet tag
        let styleLink = document.createElement('link');
        styleLink.setAttribute('rel', "stylesheet");
        styleLink.setAttribute('type', "text/css")
        styleLink.setAttribute('href', "chrome-extension://aolldfofbamfbbmefjmcennookbpdnlg/jandi.css");
        document.head.appendChild(styleLink);
        // Add .jandi class to all buttons and text areas
        [...document.querySelectorAll('.el-button, textarea')].forEach(el => {
            el.classList.remove('el-button--primary');
                el.classList.add('jandi');
            }
        );
    }
    addJandiStyle();
    // Retrieve student names & IDs as an array of student objects
    function getNamesIds() {
        let memoHeaders = [];
        let memoHeadersCollection = document.querySelectorAll('.memo-header>span');
        for (i = 0; i < memoHeadersCollection.length; i++) {
            memoHeaders.push(memoHeadersCollection[i]);
        }
        let headerText = [];
        memoHeaders.forEach(memo => {
            headerText.push(memo.innerText);
        });
        let namesAndIds = [];
        headerText.forEach(header => {
            namesAndIds.push(header.split(' ').pop());
        });
        let students = [];
        namesAndIds.forEach(nameAndId => {
            let split = nameAndId.split('@');
            students.push({ sName: split[0], sId: split[1] });
        })
        return students;
    }
    // Insert student names into 'Overall Performance' textarea
    function insertNames() {
        let stu = getNamesIds();
        console.log(stu);
        let sIdArray;
        let textAreaPerformance = document.querySelectorAll('.per-textarea');
        for (let i = 0; i < stu.length; i++) {
            // Add student name to textarea
            textAreaPerformance[i].value = stu[i].sName + ' ';
            // Add student to chrome.storage.sync
                chrome.storage.sync.get((data) => {
                    if (data.students.hasOwnProperty(stu[i].sId) && data.students[stu[i].sId].gender) {
                        // Found Student in 
                        console.log(`Found ${stu[i].sName}. Is a ${data.students[stu[i].sId].gender}`);

                    } else {
                        // Add button to pick gender
                        console.log(`${stu[i].sName} not found. Add button to pick gender`);
                    }
                });
        }
    }
    insertNames();
    // Create gender picker button
    function createButton(gender) {
        let pickGender = document.createElement('button');
        pickGender.setAttribute('class', 'el-button jandi gender');
        pickGender.setAttribute('style', 'margin-right: 10px;');
        pickGender.setAttribute('type', 'button');
        pickGender.innerText = gender;
        pickGender.value = gender;
        pickGender.addEventListener('click', function(e) {
            // Add student to chrome.storage.sync.set( )
            console.log(`Add ${e.target.value} student to DB with gender`);
        })
        return pickGender;
    }
    // Insert buttons next to Save & Submit buttons
    function insertButtons() {
        // Check if students exist in local storage with gender
        // chrome.storage.sync.get(``);

        // Check if gender buttons exist
        if (document.querySelector('button.gender')) return;
        // Get button wrappers and insert gender picker buttons
        let buttonWrappers = [...document.querySelectorAll('.btn_wrap')];
        buttonWrappers.forEach(wrapper => { 
            wrapper.style.width = '400px'
            wrapper.insertBefore(createButton('boy'), wrapper.firstChild);
            wrapper.insertBefore(createButton('girl'), wrapper.firstChild);
        });
    }
    insertButtons();
    // Focus items with Enter event listeners
    function focusOnEnter() {
        let focusable = [...document.querySelectorAll('textarea.textarea, textarea.per-textarea, button.jandi')];
        focusable.forEach((item, idx) => {
            item.setAttribute('id', idx);
            item.addEventListener('keyup', function(e) {
                if (e.keyCode === 13 && !e.shiftKey) {
                    let nextItem = focusable[(idx + 1) % focusable.length];
                    nextItem.focus();
                }
            });
        });
        return focusable;
    }
    // Instantiate focusable items
    let focusableArray = focusOnEnter();
    // Focus on initial textarea
    focusableArray[0].focus();
} else {
    console.log(`Not on memo page :(`);
}