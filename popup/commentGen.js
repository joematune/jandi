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
    "NAME had an absolutely amazing class today and was " + 
        "willing to learn for the entire duration of the lesson.",
    "NAME was truly and without a doubt a fantastic student " + 
        "and learning during today's lesson. "
];
let second = [
    "PRO has a stunning knack for understanding the difficult " +
        "concepts of the lesson at such a short amound of time " +
        "and with such efficiency.",
    "PRO has tremendous English skills, especially in th area of " +
        "listening. PRO is consistently paying close attention to " +
        "my pronunciation and the correct way to speak.",
    "PRO has outstanding abilities and I am so pleased to say that " +
        "they will continue to improve with this drive that NAME " +
        "brings into the class."
];
let third = [
    "NAME is doing wonderful work in class and PRO must keep up " +
        "the great work.",
    "POS cheerful attitude is bound to bring OBJ success in the " +
        "future.",
    "Keep up the delightful attitude towards learning becuase " +
        "you're doing great, NAME!"
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
    return console.log(c);
}
function cap(s) {
    return s[0].toUpperCase() + s.slice(1);
}

commentGen(sample['1299315']); // BOY
commentGen(sample['2057281']); // GIRL