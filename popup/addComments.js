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
            students.push({ sName: split[0], sId: split[1]});
        })
        console.log(students);
        return students;
    }
    // Array with current page students
    let stu = getNamesIds();
    // Search for each student in the chrome.storage
    stu.forEach((pageStudent, index) => {
        findStudentInStorage(index);
    });
    function findStudentInStorage(stuNumber) {
        // Add student to chrome.storage.sync
        chrome.storage.sync.get((data) => {
            if (data.students.hasOwnProperty(stu[stuNumber].sId) && data.students[stu[stuNumber].sId].gender) {
                // Found Student in 
                console.log(`Found ${stu[stuNumber].sName}. Is a ${data.students[stu[stuNumber].sId].gender}`);
            } else {
                // Didn't find student. Add button to pick gender
                insertButtons(stuNumber);
            }
        });
    }



    // Get focusableItemsArray
    function getFocusableItems() {
        return [...document.querySelectorAll('textarea.textarea, textarea.per-textarea, button.jandi')]
    }
    // Focus items with Enter event listeners
    function focusOnEnter() {
        let focusable = getFocusableItems();
        focusable.forEach((item, idx) => {
            item.setAttribute('id', idx);
            item.addEventListener('keyup', function (e) {
                if (e.keyCode === 13 && !e.shiftKey) {
                    let nextItem;
                    focusable = [...document.querySelectorAll('textarea.textarea, textarea.per-textarea, button.jandi')];
                    nextItem = focusable[(idx + 1) % focusable.length];
                    nextItem.focus();
                }
            });
        });
        return focusable;
    }
    // Instantiate focusable items
    let focusableArray = getFocusableItems();
    // Focus on initial textarea
    focusableArray[0].focus();



    // Create gender picker button
    function createButton(gender, stuNumber) {
        let pickGender = document.createElement('button');
        pickGender.setAttribute('class', `el-button jandi gender student${stuNumber}`);
        pickGender.setAttribute('style', 'margin-right: 10px;');
        pickGender.setAttribute('type', 'button');
        pickGender.innerText = gender;
        pickGender.value = gender;
        pickGender.addEventListener('click', function(e) {
            // Add gender to stu instance
            stu[stuNumber].gender = e.target.value;
            // Add student to chrome.storage.sync.set( )
            chrome.storage.sync.get((data) => {
                // Check if student has exists (may just be missing gender)
                if (data.students.hasOwnProperty(stu[stuNumber].sId)) {
                    // Add gender to student
                    data.students[stu[stuNumber].sId].gender = stu[stuNumber].gender;
                    chrome.storage.sync.set({ "students": data.students }, () => {
                        console.log(`Added ${stu[stuNumber].gender} to student: ${stu[stuNumber].sName}`);
                    });
                } else {
                    // Add whole stu[stuNumber] into chrome.storage.sync students Object
                    data.students[stu[stuNumber].sId] = stu[stuNumber];
                    chrome.storage.sync.set({ "students": data.students }, () => {
                        console.log(`Added ${stu[stuNumber].sName} to DB as a ${stu[stuNumber].gender}`);
                    });
                }
            });
        })
        return pickGender;
    }
    function destroyButtons(stuNumber) {
        let genderButtons = [...document.querySelectorAll(`button.student${stuNumber}`)];
        genderButtons.forEach(btn => btn.parentNode.removeChild(btn));
        focusableArray = focusOnEnter();
    }
    // Insert buttons next to Save & Submit buttons
    function insertButtons(stuNumber) {
        // Check if gender buttons exist for stuNumber student
        if (document.querySelector(`.student${stuNumber}`)) return;
        
        let genderWrap = document.createElement('div');
        genderWrap.setAttribute('class', `btn_wrap student${stuNumber}`);
        genderWrap.style.width = '400px';
        let textareaTextarea = [...document.querySelectorAll('textarea.textarea')];
        textareaTextarea[stuNumber].parentNode.appendChild(genderWrap);
        genderWrap.appendChild(createButton('boy', stuNumber));
        genderWrap.appendChild(createButton('girl', stuNumber));
        focusableArray = focusOnEnter();
    }
    // Duplicate & insert Areas to Focus on textarea CURRENTLY UNUSED
    function duplicateAreasToFocus() {
        let areasToFocus = [...document.querySelectorAll('textarea.textarea')];
        areasToFocus[1] = areasToFocus[0];
    }
    // Insert student names into 'Overall Performance' textarea
    function insertNames() {
        let sIdArray;
        let textAreaPerformance = document.querySelectorAll('.per-textarea');
        for (let i = 0; i < stu.length; i++) {
            // Add student name to textarea
            textAreaPerformance[i].value = stu[i].sName + ' ';
        }
    }
    insertNames();
    focusableArray = focusOnEnter();
} else {
    console.log(`Not on memo page :(`);
}