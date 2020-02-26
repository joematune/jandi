if (document.querySelector('.memo-div')) {
    let comments = {
        student1: {
            areasToFocusOn: '',
            overallPerformance: ''
        },
        student2: {
            areasToFocusOn: '',
            overallPerformance: ''
        }
    };
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
    // Look for students; if missing, add buttons to pick gender
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
    // Instantiate focusable items
    let focusableArray = getFocusableItems();
    // Focus items with Enter event listeners
    function focusOnEnter(focusableArray) {
        // let focusable = getFocusableItems();
        focusableArray.forEach((item, idx) => {
            item.setAttribute('id', idx);
            if ([...item.classList].includes('gender')) {
                item.addEventListener('keyup', function handleReturnKey(e) {
                    if (e.keyCode === 13 && !e.shiftKey) {
                        let stuNumber = idx < 4 ? 0 : 1;
                        destroyButtons(stuNumber);
                        let nextItem;
                        nextItem = focusableArray[(idx + 1) % focusableArray.length];
                        nextItem.focus();
                    }
                });
            } else {
                item.addEventListener('keyup', function handleReturnKey(e) {
                    if (e.keyCode === 13 && !e.shiftKey) {
                        let nextItem;
                        nextItem = focusableArray[(idx + 1) % focusableArray.length];
                        nextItem.focus();
                    }
                });
            }
        });
    }
    focusOnEnter(getFocusableItems());
    function getAreasToFocus() {
        // Insert start "Be sure to focus on..."
        focusableArray[0].value = 'Be sure to focus on ';
        // Focus on initial textarea
        focusableArray[0].focus();
        // Store final value on 'Return' keydown
        focusableArray[0].addEventListener('keydown', (e) => {
            if (e.keyCode == 13) {
                let focusText = document.querySelector('textarea.textarea').value;
                comments.student1.areasToFocusOn = focusText;
                comments.student2.areasToFocusOn = focusText;
            }
        })
    }
    getAreasToFocus();

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
                // Check if student exists (may just be missing gender)
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
    // Remove buttons with specified student number, recalc focusableArray
    function destroyButtons(stuNumber) {
        let genderButtons = [...document.querySelectorAll(`button.student${stuNumber}`)];
        genderButtons.forEach(btn => btn.parentNode.removeChild(btn));
        // Ignores normal focus and directly focus next per-textarea
        let studentPerTextAreas = [...document.querySelectorAll('textarea.per-textarea')];
        studentPerTextAreas[stuNumber].focus();
    }
    // Make buttons light grey - appearance of inoperable
    function flattenButtons(stuNumber) {
        let genderButtons = [...document.querySelectorAll(`button.student${stuNumber}`)];
        genderButtons.forEach(btn => {
            btn.classList.add('greyedOut');
        });
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
        focusableArray = focusOnEnter(getFocusableItems());
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
} else {
    console.log(`Not on memo page :(`);
}