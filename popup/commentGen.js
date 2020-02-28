// sample student list
let sample = {
    1299315: { gender: "boy", sId: "1299315", sName: "yinyin" },
    2005289: { gender: "boy", sId: "2005289", sName: "Seven" },
    2050619: { gender: "boy", sId: "2050619", sName: "Anan" },
    2051041: { gender: "boy", sId: "2051041", sName: "Hanry" },
    2056634: { gender: "boy", sId: "2056634", sName: "John" },
    2057281: { gender: "girl", sId: "2057281", sName: "Nicole" },
    2059492: { gender: "girl", sId: "2059492", sName: "Grace" },
    2061728: { gender: "boy", sId: "2061728", sName: "Tuantuan" },
    2086062: { gender: "boy", sId: "2086062", sName: "Lee" },
    2111070: { gender: "boy", sId: "2111070", sName: "chenchen" },
}
let first = [
    'amazing',
    'fantastic',
    'stunning',
    'tremendous',
    'outstanding',
    'wonderful',
    'cheerful',
    'delightful'
];
let second = [
    ''
];
let third = [
    ''
];
function random(a) {
    return a[Math.floor(Math.random()*a.length)];
}
// Takes a student object and returns a string.
function commentGen(student) {
    let { gender, sId, sName } = student;
    sName = cap(sName);
    let PRO = gender == 'girl' ? 'she' : 'he';
    let POS = gender == 'girl' ? 'her' : 'his';
    let c = '';
    c += `${sName} was ${random(first)}. PRO was focussed. `;
    c += `I am never surprised by POS effort. `;
    c += `${sName} listens when PRO is asked questions. `;
    c += `POS skills are ${random(first)}. `
    c = c.replace(/PRO/g, PRO);
    c = c.replace(/POS/g, POS);
    c = c.replace(/\. \w/g, s => s.toUpperCase());
    return console.log(c);
}
function cap(s) {
    return s[0].toUpperCase() + s.slice(1);
}

commentGen(sample['1299315']); // BOY
commentGen(sample['2057281']); // GIRL