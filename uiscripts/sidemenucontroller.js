/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




/* global ViewController */

SideMenuController.prototype = Object.create(ViewController.prototype);
SideMenuController.prototype.constructor = SideMenuController;

function SideMenuController(workspace) {
    ViewController.call(this, workspace);
}


/**
 * Don't try to access your views here please.
 * The views may or may not be ready yet! 
 * This only signifies that your ViewController has been created.
 * @param {string} wid The workspace id
 * @returns {undefined}
 */
SideMenuController.prototype.onCreate = function (wid) {
    ViewController.prototype.onCreate.call(this, wid);
//Your code goes below here
};

/**
 * You may now begin to use your views.
 * @param {string} wid The workspace id
 * @returns {undefined}
 */
SideMenuController.prototype.onViewsAttached = function (wid) {
    ViewController.prototype.onViewsAttached.call(this, wid);
//Your code goes below here


let controller = this;
    let btn = this.findHtmlViewById('side_login_btn_ux');
    btn.onclick = function(){
       let email = controller.findHtmlViewById('side_field_ux');
       let pwd = controller.findHtmlViewById('side_passkey_ux');
       
       alert('Email: '+email.value);
       alert('Password: '+pwd.value);
       
       
    };
    

   





};


