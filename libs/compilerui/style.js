/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * 
 * @param {string} attr The attribute
 * @param {string} value Its value
 * @returns {StyleElement}
 */
function StyleElement(attr,value){
    if(typeof attr === 'string' && typeof value === 'string'){
    this.attr = attr.trim();
    this.value = value.trim();
}else{
    console.log("attr or value must be string.");
}
}

StyleElement.prototype.setAttr = function(attr){
     this.attr = attr;
     };
StyleElement.prototype.getAttr = function(){
    return this.attr;
};
StyleElement.prototype.setValue = function(value){
     this.value = value;
     };
StyleElement.prototype.getValue = function(){
    return this.value;
};
StyleElement.prototype.getCss = function(){
    return this.attr+":"+this.value+";";
};


/**
 * 
 * @param {string} name The name of the Style
 * @param {StyleElement[]} values An array of StyleElement values
 * @returns {Style}
 */
function Style(name,values){
    this.name = name.trim();
    this.styleElements = values!==null?values:[];
}

Style.prototype.setName = function(name){
     this.name = name;
     };
Style.prototype.getName = function(){
    return this.name;
};
 
Style.prototype.setStyleElements = function(styleElements){
     this.styleElements = styleElements;
     };
Style.prototype.getStyleElements = function(){
    return this.styleElements;
};
/**
 * Checks if the Style object contains any css styles.
 * @return {boolean}
 */
Style.prototype.isEmpty = function (){
    return this.styleElements.length === 0;
}


/**
 *  @param {string} entryName The class or  id or other selector name just the
 *  way it must appear in the stylesheet...e.g .cols or #values or table > tbody > tr > td > span
 * @returns {String} The pure css that can be injected directly
 * into a stylesheet
 */
Style.prototype.styleSheetEntry = function(entryName){
    let styleBuffer = new StringBuffer();
    if(this.styleElements.length === 0){return '';}
    styleBuffer.append(entryName).append(" { \n");
    for(let i=0;i<this.styleElements.length;i++){
        let styleObj = this.styleElements[i];
        styleBuffer.append(styleObj.getCss()).append("\n");
    }
    styleBuffer.append("} \n");
    return styleBuffer.toString();
};


Style.prototype.injectStyleSheet = function(){
    if(typeof this.name === 'undefined' || this.name === null || this.name === ''){
        throw 'Please define the name of this style!... e.g #name or .name';
    }
      let style = document.createElement('style');
    if (this.styleElements.length > 0) {
        style.type = 'text/css';
        style.innerHTML = this.styleSheetEntry(this.name);
        document.getElementsByTagName('head')[0].appendChild(style);
    }
};

/**
 * @param htmlStyleElement An html style element <<<htmlStyleElement = document.createElement('style');>>>
 * @param stylesArray An array of Style objects
 */
function injectStyleSheets(htmlStyleElement , stylesArray){
    if(Object.prototype.toString.call(stylesArray) === '[object Array]'){
        let cssSheet = new StringBuffer('');
        cssSheet.append(htmlStyleElement.innerHTML);
        for(let i=0; i<stylesArray.length; i++){
            let style = stylesArray[i];
            if(style.constructor.name !== 'Style'){
                throw new Error('Please put only styles in the supplied array');
            }
            if(typeof style.name === 'undefined' || style.name === null || style.name === ''){
                throw 'Please define the name of this style!... e.g #name or .name';
            }
            cssSheet.append(style.styleSheetEntry(style.name));
            cssSheet.append('\n');
        }//end for loop
        htmlStyleElement.innerHTML = cssSheet.toString();
        document.getElementsByTagName('head')[0].appendChild(htmlStyleElement);
    }else{
        throw new Error("Please supply an array of styles");
    }
};

/**
 * 
 * @param {type} options A map of css keys and values, e.g.
 * {
 * width: "12em",
 * height: "100%",
 * color: "red",
 * border: "1px solid red"
 * }
 * @returns {undefined}
 */
Style.prototype.addFromOptions = function(options){
     for(let key in options){
         this.addStyleElement(key , options[key]);
     }
};
/**
 * 
 * @returns {String} A css that can be injected as inline css on an html element.
 */
Style.prototype.getCss = function(){
    let styleBuffer = new StringBuffer();
  if(this.styleElements.length === 0){return '';}
      styleBuffer.append(" style = \'");
  for(let i=0;i<this.styleElements.length;i++){
      let styleObj = this.styleElements[i];
      styleBuffer.append(styleObj.getCss());
  }
      styleBuffer.append("\' ");
      return styleBuffer.toString();
};
/**
 * 
 * @returns {String} The pure css that can be injected directly 
 * into a stylesheet, but without the id or class or the curly braces
 */
Style.prototype.rawCss = function(){
    let styleBuffer = new StringBuffer();
  if(this.styleElements.length === 0){return '';}
      styleBuffer.append(" ");
  for(let i=0;i<this.styleElements.length;i++){
      let styleObj = this.styleElements[i];
      styleBuffer.append(styleObj.getCss());
  }
      styleBuffer.append(" ");
      return styleBuffer.toString();
};




/**
 * 
 * @param {StyleElement} style The style object to remove
 * @returns {undefined}
 */
Style.prototype.removeStyleElementObj = function (style) {
    if( StyleElement.prototype.isPrototypeOf(style) ){
        let attr = style.getAttr();
    for(let index=0;index<this.styleElements.length;index++){
        let styl = this.styleElements[index];
        if(styl.getAttr() === attr){
          this.styleElements.splice(index,1); 
          return;
        }
    }
    
    }
};
/**
 * 
 * @param {string} styleAttr The attribute name of the StyleElement object to remove
 * @returns {undefined}
 */
Style.prototype.removeStyleElementByAttr = function (styleAttr) {
     for(let index=0;index<this.styleElements.length;index++){
         let styl = this.styleElements[index];
        if(styl.getAttr() === styleAttr){
          this.styleElements.splice(index,1); 
          return;
        }
    }
};



/**
 * 
 * @param {string} attr The attribute name of the StyleElement
 * @param {string} val The value of the style
 * @returns {void}
 */
Style.prototype.addStyleElement = function (attr,val) { 
     
    for(let index=0;index<this.styleElements.length;index++){
        let styl = this.styleElements[index];
        if(styl.getAttr() === attr){//attribute exists already..update and exit
          this.styleElements[index] = new StyleElement(attr,val); 
          return;
        }
    }
    this.styleElements[this.styleElements.length] = new StyleElement(attr,val);
    
    
};

/**
 * 
 * Adds an array of style elements to this Style object.
 * @param {Array} styleElemsArray An array of StyleElement objects 
 * @returns {undefined}
 * 
 */
Style.prototype.addStyleElementsArray = function ( styleElemsArray ) { 
     
    for(let index=0;index < styleElemsArray.length;index++){
        let styl = styleElemsArray[index];
       this.addStyleElementObj(styl);
    }
    
};
/**
 * 
 * @param {StyleElement} style The style element object
 * @returns {undefined}
 */
Style.prototype.addStyleElementObj = function (style) {
    
  if( StyleElement.prototype.isPrototypeOf(style) ){   
      var attr = style.getAttr();
    for(var index=0;index<this.styleElements.length;index++){
        var styl = this.styleElements[index];
        if(styl.getAttr() === attr){//attribute exists already..update and exit
          this.styleElements[index] = style; 
          return;
        }
    }
    this.styleElements[this.styleElements.length] = style;
    
  }

    
};
/**
 * The library handles all the details for you. The string MUST describe only 1 style element..e.g. width:10px;
 * @param {string} style The style string to add e.g. width:10;
 * @returns {void}
 */
Style.prototype.addStyleElementCss = function (style) {
    
    if(style){
        let indexOfColon = style.indexOf(":");
        let indexOfSemiColon = style.indexOf(";");
        
    if( indexOfSemiColon !== -1 && indexOfSemiColon === style.length - 1 && indexOfColon !== -1  ){

        let attr = style.substring(0,indexOfColon);
        let val = style.substring(indexOfColon+1,indexOfSemiColon);
    
    if(attr.indexOf(":") === -1 && attr.indexOf(";") === -1 && val.indexOf(":") === -1 && val.indexOf(";") === -1  ){

                let styleObj = new StyleElement(attr,val);

   for(let index=0;index<this.styleElements.length;index++){
        let styl = this.styleElements[index];
        if(styl.getAttr() === attr){//attribute exists already..update and exit
          this.styleElements[index] = styleObj; 
          return;
        }
    }
    this.styleElements[this.styleElements.length] = styleObj;
    
            }
    }
    
    }
};
/**
 * 
 * @param {string} attr The attribute name
 * @returns {string}  the value of the attribute in this style object.
 */
Style.prototype.getValue = function (attr){
    
    for(var i=0;i<this.styleElements.length; i++){
        var elem = this.styleElements[i];
        if(elem.attr === attr){
            return elem.value;
        }
    }
    
    return null;
    
};