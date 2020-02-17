if (document.querySelector('.memo-div')) {
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
    function insertNames() {
        let stu = getNamesIds();
        let textAreaPerformance = document.querySelectorAll('.per-textarea');
        for (i = 0; i < stu.length; i++) {
            textAreaPerformance[i].value = stu[i].sName + ' ';
        }
    }
    insertNames();
} else {
    console.log(`Not on memo page :(`);
}