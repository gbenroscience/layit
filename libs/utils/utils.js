/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function isOneDimArray(array) {
    return Object.prototype.toString.call(array) === '[object Array]';
}

function isTwoDimArray(arr) {

    if (Object.prototype.toString.call(arr) === '[object Array]') {
        for (var i = 0; i < arr.length; i++) {
            if (Object.prototype.toString.call(arr[i]) !== '[object Array]') {
                return false;
            }
        }
        return true;
    }

    return false;
}