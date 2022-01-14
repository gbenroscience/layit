/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global workspaces */

function ViewController(wid) {
    if(typeof wid === 'string'){
      this.workspaceId = wid;
    }else{
        throw new Error('Invalid type for workspace id');
    }
    
}

/**
 * Don't try to access your views here please.
 * The views may not be ready yet! 
 * This only signifies that your ViewController has been created.
 * @param {string} wid The workspace id
 * @returns {undefined}
 */
ViewController.prototype.onCreate = function(wid){

};

/**
 * You may now begin to use your views.
 * @param {string} wid The workspace id
 * @returns {undefined}
 */
ViewController.prototype.onViewsAttached = function(wid){
    
};

/**
 * Not yet implemented
 * @param {string} wid The workspace id
 * @returns {undefined}
 */
ViewController.prototype.onDestroy = function(wid){
    
};
/**
 * Locates the logical view used to place the html view.
 * @param {string} viewId The id of the view
 * @returns {unresolved}
 */
ViewController.prototype.findViewById = function(viewId){
    if(typeof viewId !== 'string'){
        throw new Error('Invalid type for view id');
    }
    let wkspc = workspaces.get(this.workspaceId);
    if(wkspc){
        return wkspc.findViewById(viewId);
    }
};

/**
 * Locates the actual html view which is what most users will need
 * @param {type} viewId The id of the view
 * @returns {unresolved}
 */
ViewController.prototype.findHtmlViewById = function(viewId){
    if(typeof viewId !== 'string'){
        throw new Error('Invalid type for view id');
    }
    let wkspc = workspaces.get(this.workspaceId);
    if(wkspc){
        return wkspc.findHtmlViewById(viewId);
    }
};