/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * @param str The string in consideration
 * @param endItem The string to check for at the end of <code>str</code>
 * @return true if the variable <code>str</code> ends with variable <code>endItem</code>
 */
function endsWith( str,endItem ) {
    if (typeof str === "string" && typeof endItem === "string") {
        const len = str.length;
        const otherLen = endItem.length;
        if (len === otherLen) {
            return str === endItem;
        } else if (len < otherLen) {
            return false;
        } else {
                return str.indexOf(endItem, 0) === len-otherLen;
        }
    } else {
        return false;
    }
}

/**
 * @param str The string in consideration
 * @param startItem The string to check for at the start of <code>str</code>
 * @return true if the variable <code>str</code> ends with variable <code>startItem</code>
 */
function startsWith( str,startItem ) {
    if (typeof str === "string" && typeof startItem === "string") {
        const len = str.length;
        const otherLen = startItem.length;
        if (len === otherLen) {
            return str === startItem;
        } else if (len < otherLen) {
            return false;
        } else {
            return str.indexOf(startItem, 0) === 0;
        }
    } else {
        return false;
    }
}


/**
 *
 * N.B..The name of this method should have been <code>contains(args..)</code>
 * but this name does not work, so the developer imagines that it could be a
 * reserved word in Javascript.
 * @param str The string in consideration
 * @param inneritem The string to check for inside <code>str</code>
 * @return true if the variable <code>str</code> contains variable <code>item</code>
 */
function contain( str,inneritem ){
       if(typeof str === "string" && typeof inneritem === "string" ){
            let len = str.length;
            let otherLen = inneritem.length;
        if( len === otherLen ){
            return str === inneritem;
        }
        else if( len < otherLen ){
            return false;
        }
        
        else{
            return str.indexOf(inneritem, 0) !== -1;
        }
    }
    else{
        return false;
    }
}//end function



/**
 * @param str The string in consideration
 * @param endItems An array containing the strings to check for at the end of <code>str</code>
 * @return true if the variable <code>str</code> ends with any of the variables in <code>endItems</code>
 */
function endsWithAnyOf( str,endItems ){
    var len = endItems.length;
for(var i=0;i<len;i++){
    if(endsWith(str, endItems[i])){
        return true;
    }
    
}
return false;

}//end function

/**
 * @param str The string in consideration
 * @param startItems An array containing the strings to check for at the start of <code>str</code>
 * @return true if the variable <code>str</code> starts with any of the variables in <code>startItems</code>
 */
function startsWithAnyOf( str,startItems ){
    var len = startItems.length;
for(var i=0;i<len;i++){
    if(startsWith(str, startItems[i])){
        return true;
    }
    
}
return false;

}//end function

/**
 * @param str The string in consideration
 * @param innerItems An array containing the strings to check for inside <code>str</code>
 * @return true if the variable <code>str</code> contains any of the variables in <code>endItems</code>
 */
function containsAnyOf( str,innerItems ){
    var len = innerItems.length;
for(var i=0;i<len;i++){
    if(contain(str, innerItems[i])){
        return true;
    }
    
}
return false;

}//end function




/**
 * @param str The string to reverse
 * @return the string in reversed order.
 */
function reverse( str ){
    var len =str.length;
    var reversed='';
    for(var i=len-1;i>=0;i--){
        reversed = reversed+str.charAt(i);
    }
    
    
    return reversed;
}//end function

/**
 * 
 * @param {type} input The input string to check
 * @returns {Boolean} true if the input contains only
 * white spaces or is null.
 */
function isWhiteSpacesOnly(input){
    if(input === null){
        return true;
    }
    if(!input){
       return true;
   }
    if (/\S/.test(input)) {
    return false;
   }
  
return true;
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateUserName(userName){
   var re = /(?=^.{3,20}$)^[a-zA-Z][a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+$/;
   return re.test(userName);
}