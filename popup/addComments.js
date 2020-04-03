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
                if (![...el.classList].includes('el-button--mini')) {
                    el.classList.add('jandi');
                }
            }
        );
    }
    addJandiStyle();
    // Retrieve student names & IDs as an array of student objects
    function getNamesIds() {
        let headerText = [];
        [...document.querySelectorAll('.stu-avatar')].forEach(avatar => {
            headerText.push(avatar.parentNode.innerText);
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
                // Found Student in DB
                console.log(`Found ${stu[stuNumber].sName} - student #${stuNumber}. Is a ${data.students[stu[stuNumber].sId].gender}`);
                let textareaTextarea = [...document.querySelectorAll('textarea.textarea')];
                textareaTextarea[stuNumber].addEventListener('keyup', e => {
                    if (e.keyCode == 13) {
                        // Add gender property to stu for found students
                        stu[stuNumber].gender = data.students[stu[stuNumber].sId].gender;
                        insertComment(stuNumber, commentGen(stu[stuNumber]));
                    }
                });
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
    function getFirstTextarea() {
        // Insert start "1. Be sure to focus on..."
        let focusText;
        if (focusableArray[0].value == '') {
            focusText = '1. Be sure to focus on '
        } else {
            focusText = focusableArray[0].value;
        };
        focusableArray[0].value = focusText;
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
    getFirstTextarea();
    function clickStars() {
        let stars = [...document.querySelectorAll('.el-rate__item')];
        for (i = 0; i < stars.length; i++) {
            if (i % 5 === 4) {
                stars[i].dispatchEvent(new Event('click'));
            }
        }
    }
    clickStars();
    function firstSaveButton() {
        let saveButton = document.querySelector('.submit-btn');
        saveButton.addEventListener('keyup', (e) => {
            if (e.keyCode == 13) {
                let secondTextarea = [...document.querySelectorAll('textarea.textarea')][1]
                secondTextarea.value = comments.student2.areasToFocusOn;
            }
        });
    }
    firstSaveButton();
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
                        insertComment(stuNumber, commentGen(stu[stuNumber]));
                    });
                } else {
                    // Add whole stu[stuNumber] into chrome.storage.sync students Object
                    data.students[stu[stuNumber].sId] = stu[stuNumber];
                    chrome.storage.sync.set({ "students": data.students }, () => {
                        console.log(`Added ${stu[stuNumber].sName} to DB as a ${stu[stuNumber].gender}`);
                        insertComment(stuNumber, commentGen(stu[stuNumber]));
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
    // Student comment arrays
    let first = [
        "NAME had an absolutely amazing class today and was " +
            "willing to learn for the entire duration of the lesson.",
        "NAME was truly and without a doubt a fantastic student " +
            "in regards to learning during today's lesson.",
        "NAME is on a streak of excellent behavior and a high " +
            "level of performance during our classes.",
        "NAME is working diligently during our class time and I couldn't " +
            "be prouder of POS efforts and strength.",
        "NAME had so many opportunities to display POS skills and PRO " +
            "took advantage of each and every chance.",
        "NAME is a lovely student and I find time and time again that " +
            "PRO is a highly intelligent student.",
        "NAME gives POS best effort during all of our classes together " +
            "and I couldn't be prouder to have OBJ in my learning " +
            "environment."
    ];
    let second = [
        "PRO has a stunning knack for understanding the difficult " +
            "concepts of the lesson within such a short amount of time " +
            "and with such efficiency.",
        "PRO has tremendous English skills, especially in the area of " +
            "listening. PRO is consistently paying close attention to " +
            "my pronunciation and the correct way to speak.",
        "PRO has outstanding abilities and I am so pleased to say that " +
            "PRO will continue to improve with this drive that NAME " +
            "brings into the class.",
        "PRO tried to listen carefully when I spoke about the slides and " +
            "gave the most meaningful replies when I asked questions that " +
            "required processing to answer.",
        "Specifically, I have noticed that NAME is improving in the area " +
            "of reading and that PRO is willing to attempt the " +
            "pronunciation of words that certainly would have been too " +
            "difficult when we first began together.",
        "In particular, I have noticed that NAME's speaking skills are " +
            "improving and that PRO is willing to pronounce difficult, " +
            "and often times unfamiliar, words in the lesson."
    ];
    let third = [
        "NAME is doing wonderful work in class and PRO must keep up " +
            "the great work.",
        "POS cheerful attitude is bound to bring OBJ success in the " +
            "future.",
        "Keep up the delightful attitude towards learning because " +
            "you're doing great, NAME!",
        "Keep on giving it your all in class because I can absolutely " +
            "tell that you're making progress, NAME!",
        "Keep on the track that you're on because you are truly making " +
            "a difference in the quality of your performance, NAME!",
        "I really am pleased with how well you're doing in class and " +
            "wish for you to keep up the splendid work, NAME!",
        "You're doing so tremendously in class and I can't begin to " +
            "imagine how far you will grow as a student. Great job, NAME!"
    ];
    // Returns random item of an array and logs number
    function random(a) {
        let rndm = Math.floor(Math.random() * a.length);
        console.log(rndm);
        return a[rndm];
    }
    // Takes a student object and returns a string.
    function commentGen(student) {
        let { sName, sId, gender } = student;
        sName = cap(sName);
        let PRO = gender == 'girl' ? 'she' : 'he';
        let POS = gender == 'girl' ? 'her' : 'his';
        let OBJ = gender == 'girl' ? 'her' : 'him';
        let c = '';
        c += `${random(first)} `;
        c += `${random(second)} `;
        c += `${random(third)} `;
        c = c.replace(/NAME/g, sName);
        c = c.replace(/PRO/g, PRO);
        c = c.replace(/POS/g, POS);
        c = c.replace(/OBJ/g, OBJ);
        c = c.replace(/\. \w/g, s => s.toUpperCase());
        return c;
    }
    // Capitalizes entire string
    function cap(s) {
        return s[0].toUpperCase() + s.slice(1);
    }
    function insertComment(stuNumber, comment) {
        let perTextarea = [...document.querySelectorAll('textarea.per-textarea')][stuNumber];
        perTextarea.value = comment;
    }
} else {
    console.log(`Not on memo page :(`);
}