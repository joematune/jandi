function addStyle() {
    // Checks if gender button exists
    if (document.querySelector('button.gender')) return;
    // Creates <link> stylesheet tag
    let styleLink = document.createElement('link');
    styleLink.setAttribute('rel', "stylesheet");
    styleLink.setAttribute('type', "text/css")
    styleLink.setAttribute('href', "chrome-extension://aolldfofbamfbbmefjmcennookbpdnlg/darkTheme.css");
    document.head.appendChild(styleLink);
}
addStyle();
// Make and return new jandi logo SVG
function makeLogo() {
    let logo = `<g fill="none" fill-rule="evenodd">
                    <path id="subtract" fill="#FEC68A" d="M12.5001108,0.000110891089 C19.4033717,0.000110891089 25.0001109,5.59576306 25.0001109,12.5001108 C25.0001109,19.4033717 19.4033717,25.0001109 12.5001108,25.0001109 L3.35337176,25.0001109 C1.50119785,25.0001109 0.000110891089,23.4990239 0.000110891089,21.64685 L0.000110891089,3.35337176 C0.000110891089,1.50119785 1.50119785,0.000110891089 3.35337176,0.000110891089 L12.5001108,0.000110891089 Z M11.8791326,20.5690239 C15.3889152,20.5690239 18.2334804,17.7244587 18.2334804,14.2157631 C18.2334804,10.7059804 15.3889152,7.86250219 11.8791326,7.86250219 C8.37043697,7.86250219 5.52587176,10.7059804 5.52587176,14.2157631 C5.52587176,17.7244587 8.37043697,20.5690239 11.8791326,20.5690239 Z M4.42804567,10.0369587 C5.03130654,10.0369587 5.52043697,9.54782828 5.52043697,8.94456741 C5.52043697,8.34130654 5.03130654,7.85217611 4.42804567,7.85217611 C3.8247848,7.85217611 3.33565437,8.34130654 3.33565437,8.94456741 C3.33565437,9.54782828 3.8247848,10.0369587 4.42804567,10.0369587 Z M19.325437,10.0369587 C19.9286978,10.0369587 20.4178282,9.54782828 20.4178282,8.94456741 C20.4178282,8.34130654 19.9286978,7.85217611 19.325437,7.85217611 C18.7221761,7.85217611 18.2330457,8.34130654 18.2330457,8.94456741 C18.2330457,9.54782828 18.7221761,10.0369587 19.325437,10.0369587 Z"></path>
                    <path id="nose" fill="#FEC68A" d="M14.2405228,16.3976871 C14.0897109,16.1237861 13.8002851,16.0384 13.4864634,16.1858851 C13.4421069,16.2058455 13.2957307,16.2657267 13.130503,16.2657267 C12.6747406,16.2657267 12.6747406,15.8210535 12.6747406,15.7256871 L12.6747406,14.1610139 C12.6747406,14.1022416 12.7135525,14.0512317 12.768998,14.0312713 C13.5607604,13.7518257 14.1174337,12.9778059 14.0675327,12.0795881 C14.0120871,11.0948752 13.1992554,10.2898059 12.2134337,10.2432317 C11.0934337,10.190004 10.168602,11.0837861 10.168602,12.192697 C10.168602,13.0343604 10.7019881,13.7529347 11.450503,14.0257267 C11.5059485,14.0456871 11.5436515,14.0955881 11.5436515,14.1543604 L11.5436515,15.8920238 C11.5436515,16.8002218 12.1956911,17.3968158 13.130503,17.3968158 C13.5707406,17.3968158 13.9034139,17.2238257 13.9732752,17.1883406 C14.2682455,17.0364198 14.3913347,16.6715881 14.2405228,16.3976871"
                        transform="translate(12.236857, 13.818894) scale(-1, 1) translate(-12.236857, -13.818894) "></path>
                </g>`;
    let svgJandi = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgJandi.setAttributeNS(null, "width", "25px");
    svgJandi.setAttributeNS(null, "height", "25px");
    svgJandi.setAttributeNS(null, "viewBox", "0 0 25 25");
    svgJandi.setAttributeNS(null, "class", "jandi-logo");
    svgJandi.innerHTML = logo;
    return svgJandi;
}
let jandiLogo = makeLogo();
// Check DOM to see if .menu exists so logo can be inserted
var checkForMenu = setInterval(() => {
    if (document.querySelector('.menu') !== null) {
        let menu = document.querySelector('.menu');
        menu.insertBefore(jandiLogo, menu.childNodes[0]);
    }
    if (document.querySelector('#nose') !== null) {
        clearInterval(checkForMenu);
    }
}, 50);
// Make link tag for favicon
function makeIconLink() {
    let ico = document.createElement('link');
    ico.setAttribute('rel', 'shortcut icon');
    ico.setAttribute('class', 'jandi-icon');
    ico.setAttribute('href', chrome.extension.getURL('icons/jandiLogo.ico'));
    return ico;
}
let iconLink = makeIconLink();
// Check DOM to see if .jandi-icon link can be inserted
var checkForIconLink = setInterval(() => {
    if (document.querySelector('link').rel.includes('icon')) {
        document.head.appendChild(iconLink);
    }
    if (document.querySelector('.jandi-icon') !== null) {
        clearInterval(checkForIconLink);
    }
}, 50);
var checkForTitle = setInterval(() => {
    console.log('hey');
    if (document.querySelector('title') !== null) {
        document.querySelector('title').innerText = 'Jandi Teacher';
    }
    if (document.querySelector('title').innerText === 'Jandi Teacher') {
        clearInterval(checkForTitle);
    }
}, 10)