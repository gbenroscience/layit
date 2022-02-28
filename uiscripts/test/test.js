/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




/* global ViewController */

TestController.prototype = Object.create(ViewController.prototype);
TestController.prototype.constructor = TestController;

function TestController(workspace) {
    ViewController.call(this, workspace);
}


/**
 * Don't try to access your views here please.
 * The views may or may not be ready yet! 
 * This only signifies that your ViewController has been created.
 * @param {string} wid The workspace id
 * @returns {undefined}
 */
TestController.prototype.onCreate = function (wid) {
    ViewController.prototype.onCreate.call(this, wid);
//Your code goes below here
};

/**
 * You may now begin to use your views.
 * @param {string} wid The workspace id
 * @returns {undefined}
 */
TestController.prototype.onViewsAttached = function (wid) {
    ViewController.prototype.onViewsAttached.call(this, wid);
//Your code goes below here


    let view = this.findHtmlViewById('site_title');
    view.style.color = 'yellow';
    let loginBtn = this.findHtmlViewById('login_btn');
    let checkBtn = this.findHtmlViewById('check_btn');

    let self = this;

    let sideMenuX = new SideMenuX({
        id: 'menu_x_id',
        layout: 'sidemenu.xml',
        width: '550px',
        background: 'pink'
    });
    
    let sideMenu = new SideMenu({id: 'menu_mi', width: '20%', menuType: 'overlay', hPadding: '24px', vPadding: '10px', fontSize: '17px', fontName: 'Arial', iconSpacing: '32px',
        sections: '[{"title": "Media Queries","items": [{"text": "Phone screens 320 x 280 ","src":  "logo_small.png"},{"text": "TV Screens 4320 x 2160","src":  "splash.png"}]},{"title": "CSS Support","items": [{"text": "CSS 2.0 stuff","src":  "logo_small.png"},{"text": "CSS 3.1 stuff", "src":  "splash.png"}]}]'});
    checkBtn.onclick = function () {
        //let popup = new Popup({id: 'my_very_own_states','width':'420px','height':'300px',layout: 'popup.xml'});
        //popup.build(); 

        sideMenuX.open();

    };
    loginBtn.onclick = function () {
        let progress = self.findViewById('progress').progress;

        let val = 0;
        let interval = setInterval(function () {
            val += 0.8;
            val = Math.round(val, 2);
            if (val < 10) {
                progress.setValue(val, "Starting...");
            } else if (val >= 10 && val < 20) {
                progress.setValue(val, "Picking up...");
            } else if (val >= 20 && val < 30) {
                progress.setValue(val, "Powering up...");
            } else if (val >= 30 && val < 40) {
                progress.setValue(val, "Accelerating...");
            } else if (val >= 40 && val < 50) {
                progress.setValue(val, "Reaching top speed...");
            } else if (val >= 50 && val < 60) {
                progress.setValue(val, "Speed levels out...");
            } else if (val >= 60 && val < 80) {
                progress.setValue(val, "Constant rate...");
            } else if (val >= 80 && val < 90) {
                progress.setValue(val, "Cooling off...");
            } else if (val >= 90 && val < 100) {
                progress.setValue(val, "Powering down...");
            } else {
                progress.setValue(val = 100, "Upload done");

                clearInterval(interval);
            }

        }, 100);
    };





};


