/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let AutoLayout = window.AutoLayout;


/**
 *
 * VFL:
 * [a(b)] view a has same width as b
 * [a(==b/2)] view a has half the width of view b
 * Set the absolute size and position for a DOM element.
 *
 * To connect a view to another use [a]-[b]
 *
 *
 * To give a view same width as height:
 *
 * |-[a]-|
 * V:|-[a(a.width)]
 * Supported attributes are:
 *
 * .width
 * .height
 * .left
 * .top
 * .right
 * .bottom
 * .centerX
 * .centerY
 *
 * The next 2 commands will make the child stretch across the parent with system-standard margins at the edges
 * H:|-[child]-|
 * V:|-[child]-|
 *
 * The next 2 commands will make the child stretch across the parent with the specified margins at the edges
 * H:|-50-[child]-50-|
 * V:|-50-[child]-50-|
 *
 * Pin a child view to left edge of its parent:
 * H:|[child]
 *
 * Pin a child view to right edge of its parent:
 * H:[child]|
 *
 * Make view 100 points wide:
 * H:|[child(==100)]
 *
 * Make view at least 100 points wide:
 * H:|[child(>=100)]
 *
 *
 * Share size with another view:
 * Where childWidth is another view and child is the view that will share the width of `childWidth`
 * H:|[child(childWidth)]
 *
 * Specify width and priority:
 * H:|[child(childWidth@999)]
 *
 *
 * The DOM element must have the following CSS styles applied to it:
 * - position: absolute;
 * - padding: 0;
 * - margin: 0;
 *
 * @param {Element} elm DOM element.
 * @param {Number} left left position.
 * @param {Number} top top position.
 * @param {Number} width width.
 * @param {Number} height height.
 */
let transformAttr = ('transform' in document.documentElement.style) ? 'transform' : undefined;
transformAttr = transformAttr || (('-webkit-transform' in document.documentElement.style) ? '-webkit-transform' : 'undefined');
transformAttr = transformAttr || (('-moz-transform' in document.documentElement.style) ? '-moz-transform' : 'undefined');
transformAttr = transformAttr || (('-ms-transform' in document.documentElement.style) ? '-ms-transform' : 'undefined');
transformAttr = transformAttr || (('-o-transform' in document.documentElement.style) ? '-o-transform' : 'undefined');

function setAbsoluteSizeAndPosition(elm, left, top, width, height) {
    elm.setAttribute('style', 'width: ' + width + 'px; height: ' + height + 'px; ' + transformAttr + ': translate3d(' + left + 'px, ' + top + 'px, 0px);');
}


/* global AutoLayout, attrKeys, xmlKeys, viewMap, orientations, sizes, dummyDiv, dummyCanvas, PATH_TO_LAYOUTS_FOLDER, PATH_TO_COMPILER_SCRIPTS, rootCount, CssSizeUnits */
/**
 *
 * @param {type} node The node that represents this View in the android style xml document
 * @returns {View}
 */
function View(node) {
    const zaId = node.getAttribute(attrKeys.id);

    if (typeof zaId === 'undefined' || zaId === null || zaId === '') {
        throw 'Please specify the view id properly';
    }

    if (typeof viewMap.get(zaId) !== 'undefined') {
        throw 'A view with this id(`' + zaId + '`) exists already';
    }

    let nodeName = node.nodeName;

    this.nodeName = nodeName;
    this.root = nodeName === xmlKeys.root || nodeName === xmlKeys.include;

    //The main ConstraintLayout tag in the original layout file
    this.topLevelRoot = this.root === true && viewMap.size === 0;

    this.id = zaId;

    this.parentId = (node.parentNode.getAttribute) ? node.parentNode.getAttribute(attrKeys.id).trim() : null;

    this.childrenIds = [];
    this.style = new Style("#" + this.id, []);

    this.refIds = new Map();
    this.htmlElement = null;
    let cssClasses = null;

    if (node.attributes && node.attributes.length > 0) {

        this.marginTop = node.getAttribute(attrKeys.layout_marginTop);
        this.marginBottom = node.getAttribute(attrKeys.layout_marginBottom);
        this.marginStart = node.getAttribute(attrKeys.layout_marginStart);
        this.marginEnd = node.getAttribute(attrKeys.layout_marginEnd);
        this.margin = node.getAttribute(attrKeys.layout_margin);

        const emptyMargin = 'x';

        if (typeof this.marginTop === 'undefined' || this.marginTop === null || this.marginTop === '' || Number.isNaN(parseInt(this.marginTop)) ) {
            this.marginTop = '0';
        }
        if (typeof this.marginBottom === 'undefined' || this.marginBottom === null || this.marginBottom === '' || Number.isNaN(parseInt(this.marginBottom))) {
            this.marginBottom = '0';
        }
        if (typeof this.marginStart === 'undefined' || this.marginStart === null || this.marginStart === '' || Number.isNaN(parseInt(this.marginStart))) {
            this.marginStart = '0';
        }
        if (typeof this.marginEnd === 'undefined' || this.marginEnd === null || this.marginEnd === '' || Number.isNaN(parseInt(this.marginEnd))) {
            this.marginEnd = '0';
        }
        if (typeof this.margin === 'undefined' || this.margin === null || this.margin === '' || Number.isNaN(parseInt(this.margin))) {
            this.margin = emptyMargin;
        }


        if (this.marginTop.startsWith("+")) {
            this.marginTop = this.marginTop.substr(1);
        }
        if (this.marginBottom.startsWith("+")) {
            this.marginBottom = this.marginBottom.substr(1);
        }
        if (this.marginStart.startsWith("+")) {
            this.marginStart = this.marginStart.substr(1);
        }
        if (this.marginEnd.startsWith("+")) {
            this.marginEnd = this.marginEnd.substr(1);
        }
        if (this.margin.startsWith("+")) {
            this.margin = this.margin.substr(1);
        }


        if (this.marginTop.startsWith("-")) {
            throw 'Negative margins (margin-top) not supported by layout engine';
        }
        if (this.marginBottom.startsWith("-")) {
            throw 'Negative margins (margin-bottom) not supported by layout engine';
        }
        if (this.marginStart.startsWith("-")) {
            throw 'Negative margins (margin-start) not supported by layout engine';
        }
        if (this.marginEnd.startsWith("-")) {
            throw 'Negative margins (margin-end) not supported by layout engine';
        }
        if (this.margin.startsWith("-")) {
            throw 'Negative margins (margin) not supported by layout engine';
        }


        this.width = node.getAttribute(attrKeys.layout_width);
        this.height = node.getAttribute(attrKeys.layout_height);

        this.wrapWidth = "";
        this.wrapHeight = "";


        const err = new Error();
        if (typeof this.width === 'undefined' || this.width === null || this.width === '') {
            err.name = 'UnspecifiedWidthError';
            err.message = 'Please specify the width for \'' + this.id + '\'';
            throw err;
        }

        if (typeof this.height === 'undefined' || this.height === null || this.height === '') {
            err.name = 'UnspecifiedHeightError';
            err.message = 'Please specify the height for \'' + this.id + '\'';
            throw err;
        }

        //override all specified margins for the sides
        if (this.margin !== emptyMargin) {
            this.marginTop = this.marginBottom = this.marginStart = this.marginEnd = this.margin;
        }

        let fontWeight = 'normal';
        let fontSz = '13px';
        let fontName = 'serif';
        let fnt = '';
//store all references to other view ids here, alongside the property that references the id
//So, the prop will be the key and the id will be the value
        for (let i = 0; i < node.attributes.length; i++) {

            let attrName = node.attributes[i].nodeName;
            let attrValue = node.attributes[i].nodeValue;

            if (attrValue === 'parent') {
                attrValue = this.parentId;
            }

            switch (attrName) {
                case attrKeys.layout:
                    this.refIds.set(attrKeys.layout, attrValue);
                    break;
                case attrKeys.layout_width:
                    if (Number.isNaN(parseInt(attrName))) {
                        this.refIds.set(attrKeys.layout_width, attrValue);
                    }
                    break;
                case attrKeys.layout_height:
                    if (Number.isNaN(parseInt(attrName))) {
                        this.refIds.set(attrKeys.layout_height, attrValue);
                    }
                    break;

                case attrKeys.layout_maxWidth:
                    if (Number.isNaN(parseInt(attrName))) {
                        this.refIds.set(attrKeys.layout_maxWidth, attrValue);
                    //    this.style.addStyleElement("max-width", attrValue);
                    }
                    break;
                case attrKeys.layout_maxHeight:
                    if (Number.isNaN(parseInt(attrName))) {
                        this.refIds.set(attrKeys.layout_maxHeight, attrValue);
                     //   this.style.addStyleElement("max-height", attrValue);
                    }
                    break;
                case attrKeys.layout_minWidth:
                    if (Number.isNaN(parseInt(attrName))) {
                        this.refIds.set(attrKeys.layout_minWidth, attrValue);
                     //   this.style.addStyleElement("min-width", attrValue);
                    }
                    break;
                case attrKeys.layout_minHeight:
                    if (Number.isNaN(parseInt(attrName))) {
                        this.refIds.set(attrKeys.layout_minHeight, attrValue);
                      //  this.style.addStyleElement("min-height", attrValue);

                    }
                    break;

                case attrKeys.layout_constraintTop_toTopOf:
                    this.refIds.set(attrKeys.layout_constraintTop_toTopOf, attrValue);
                    break;
                case attrKeys.layout_constraintTop_toBottomOf:
                    this.refIds.set(attrKeys.layout_constraintTop_toBottomOf, attrValue);
                    break;
                case attrKeys.layout_constraintBottom_toTopOf:
                    this.refIds.set(attrKeys.layout_constraintBottom_toTopOf, attrValue);
                    break;
                case attrKeys.layout_constraintBottom_toBottomOf:
                    this.refIds.set(attrKeys.layout_constraintBottom_toBottomOf, attrValue);
                    break;
                case attrKeys.layout_constraintStart_toStartOf:
                    this.refIds.set(attrKeys.layout_constraintStart_toStartOf, attrValue);
                    break;
                case attrKeys.layout_constraintStart_toEndOf:
                    this.refIds.set(attrKeys.layout_constraintStart_toEndOf, attrValue);
                    break;
                case attrKeys.layout_constraintEnd_toStartOf:
                    this.refIds.set(attrKeys.layout_constraintEnd_toStartOf, attrValue);
                    break;
                case attrKeys.layout_constraintEnd_toEndOf:
                    this.refIds.set(attrKeys.layout_constraintEnd_toEndOf, attrValue);
                    break;
                case attrKeys.layout_constraintCenterXAlign:
                    this.refIds.set(attrKeys.layout_constraintCenterXAlign, attrValue);
                    break;
                case attrKeys.layout_constraintCenterYAlign:
                    this.refIds.set(attrKeys.layout_constraintCenterYAlign, attrValue);
                    break;
                case attrKeys.layout_constraintGuide_percent:
                    this.refIds.set(attrKeys.layout_constraintGuide_percent, attrValue);
                    break;
                case attrKeys.orientation:
                    this.refIds.set(attrKeys.orientation, attrValue);
                    break;

                //as a bonus save the paddings in this pass
                case attrKeys.layout_padding:
                    this.style.addStyleElement("padding", attrValue);
                    break;
                case attrKeys.layout_paddingTop:
                    this.style.addStyleElement("padding-top", attrValue);
                    break;
                case attrKeys.layout_paddingBottom:
                    this.style.addStyleElement("padding-bottom", attrValue);
                    break;
                case attrKeys.layout_paddingStart:
                    this.style.addStyleElement("padding-left", attrValue);
                    break;
                case attrKeys.layout_paddingEnd:
                    this.style.addStyleElement("padding-right", attrValue);
                    break;
                case attrKeys.border:
                    this.style.addStyleElement("border", attrValue);
                    break;
                case attrKeys.borderRadius:
                    this.style.addStyleElement("border-radius", attrValue);
                    break;
                case attrKeys.boxShadow:
                    this.style.addStyleElement("box-shadow", attrValue);
                    this.style.addStyleElement("-moz-box-shadow", attrValue);
                    this.style.addStyleElement("-webkit-box-shadow", attrValue);
                    this.style.addStyleElement("-khtml-box-shadow", attrValue);
                    break;
                case attrKeys.background:
                    this.style.addStyleElement("background", attrValue);
                    break;
                case attrKeys.backgroundImage:
                    this.style.addStyleElement("background-image", attrValue);
                    break;
                case attrKeys.backgroundColor:
                    this.style.addStyleElement("background-color", attrValue);
                    break;
                case attrKeys.font:
                    fnt = attrValue;
                    break;
                case attrKeys.fontSize:
                    fontSz = attrValue;
                    break;
                case attrKeys.fontStretch:
                    this.style.addStyleElement("font-stretch", attrValue);
                    break;
                case attrKeys.fontStyle:
                    this.style.addStyleElement("font-style", attrValue);
                    break;
                case attrKeys.fontFamily:
                    fontName = attrValue;
                    break;
                case attrKeys.fontWeight:
                    fontWeight = attrValue;
                    break;
                case attrKeys.textSize:
                    fontSz = attrValue;
                    break;
                case attrKeys.textStyle:
                    fontWeight = attrValue;
                    break;
                case attrKeys.textColor:
                    this.style.addStyleElement("color", attrValue);
                    break;
                case attrKeys.cssClass:
                    this.refIds.set(attrKeys.cssClass, attrValue);
                    cssClasses = attrValue;
                    break;
                case attrKeys.resize:
                    this.refIds.set(attrKeys.resize, attrValue);
                    this.style.addStyleElement(attrKeys.resize, attrValue);

                    break;
//paddings saved
                default:
                    break;
            }
        }
        let font = '';
        if (attributeNotEmpty(fnt)) {
            font = fnt;
        } else {
            font = fontWeight + ' ' + fontSz + ' ' + fontName;
        }
        this.style.addStyleElement("font", font);
    }

    if (!this.id) {
        throw 'Your view must have an id!';
    }
    if (typeof this.id !== 'string') {
        throw 'The view id must be a string!';
    }
    if (this.id.trim().length === 0) {
        throw 'The view id cannot be an empty string!';
    }


    this.createElement(node);
    viewMap.set(this.id, this);
    if (cssClasses !== null) {
        addClass(this.htmlElement, cssClasses);
    }


}

View.prototype.getTextSize = function (txt) {

    let span = document.createElement("span");
    document.body.appendChild(span);
    span.style.font = this.style.getValue('font');
    span.id = "za_span";
    span.style.height = 'auto';
    span.style.width = 'auto';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'no-wrap';
    span.innerHTML = txt;

    let size = {
        width: Math.ceil(span.clientWidth),
        height: Math.ceil(span.clientHeight) * 1.5
    };

    let formattedWidth = size.width + "px";

    document.querySelector('#za_span').textContent
        = formattedWidth;
    document.body.removeChild(span);

    return size;
};
View.prototype.getWrapSize = function (text) {
    let padTop = this.style.getValue('padding-top');
    let padBot = this.style.getValue('padding-bottom');


    let padStart = this.style.getValue('padding-left');
    let padEnd = this.style.getValue('padding-right');

    let paddingTop = 0;
    let paddingBottom = 0;
    let paddingLeft = 0;
    let paddingRight = 0;


    if (padTop !== null) {
        paddingTop = parseInt(padTop);
    }
    if (padBot !== null) {
        paddingBottom = parseInt(padBot);
    }
    if (padStart !== null) {
        paddingLeft = parseInt(padStart);
    }
    if (padEnd !== null) {
        paddingRight = parseInt(padEnd);
    }

    let sz = this.getTextSize(text);
    this.wrapWidth = sz.width + paddingLeft + paddingRight;
    this.wrapHeight = sz.height + paddingTop + paddingBottom;

    return {width: this.wrapWidth, height: this.wrapHeight};
};

/**
 * Parses a number and unit string into the number and the units.
 * Performs no validation!
 * @param val e.g 22px or 22%
 * @return the number and the units
 */
function parseNumberAndUnits(val) {
    if (typeof val !== "string") {
        throw new Error('parses only string input');
    }
    let units = '';
    let number = '';
    for (let i = val.length - 1; i > 0; i--) {
        let token = val.substring(i, i + 1);
        if (token !== '0' && token !== '1' && token !== '2' && token !== '3' && token !== '4' && token !== '5' &&
            token !== '6' && token !== '7' && token !== '8' && token !== '9') {
            units = token + units;
        } else {
            number = val.substring(0, i + 1);
            break;
        }
    }
    return {number: number, units: units};
}

/**
 * Layout the content of an xml file relative to its root
 * @return {string}
 */
View.prototype.makeVFL = function () {

    let mt = parseInt(this.marginTop);
    let mb = parseInt(this.marginBottom);
    let ms = parseInt(this.marginStart);
    let me = parseInt(this.marginEnd);


    let maxWid = this.refIds.get(attrKeys.layout_maxWidth);
    let maxHei = this.refIds.get(attrKeys.layout_maxHeight);
    let minWid = this.refIds.get(attrKeys.layout_minWidth);
    let minHei = this.refIds.get(attrKeys.layout_minHeight);


    let maxWidth , maxHeight, minWidth, minHeight;


    if(endsWith(maxWid , '%') === false){
        maxWidth = parseInt(maxWid+'');
    }else{
        maxWidth = maxWid;
    }
    if(endsWith(minWid , '%') === false){
        minWidth = parseInt(minWid+'');
    }else{
        minWidth = minWid;
    }
    if(endsWith(maxHei , '%') === false){
        maxHeight = parseInt(maxHei+'');
    }else{
        maxHeight = maxHei;
    }
    if(endsWith(minHei , '%') === false){
        minHeight = parseInt(minHei+'');
    }else{
        minHeight = minHei;
    }


    if (this.width === sizes.MATCH_PARENT) {
        this.width = '100%';
    }
    if (this.height === sizes.MATCH_PARENT) {
        this.height = '100%';
    }

    let isWidPct = endsWith(this.width, '%');
    let isHeiPct = endsWith(this.height, '%');

    let pw = parseInt(this.width);
    let ph = parseInt(this.height);


    let parent, hasIncludedParent;
    if (attributeNotEmpty(this.parentId)) {
        parent = viewMap.get(this.parentId);
        hasIncludedParent = parent && parent.constructor.name === 'IncludedView';
    }
    /**
     * Must be the root node in an included file
     */
    if (hasIncludedParent === true) {
        let mtt = endsWith(this.marginTop, "%") ? this.marginTop : mt;
        let mbb = endsWith(this.marginBottom, "%") ? this.marginBottom : mb;
        let mss = endsWith(this.marginStart, "%") ? this.marginStart : ms;
        let mee = endsWith(this.marginEnd, "%") ? this.marginEnd : me;

        if( mtt !== '0' && mtt !== 0){
            throw new Error('No margins allowed on the root element of an `include`! Errant margin: margin-top...on include id: '+this.parentId);
        }
        if( mbb !== '0' && mbb !== 0){
            throw new Error('No margins allowed on the root element of an `include`!  Errant margin: margin-bottom...on include id: '+this.parentId);
        }
        if( mss !== '0' && mss !== 0){
            throw new Error('No margins allowed on the root element of an `include`!  Errant margin: margin-start...on include id: '+this.parentId);
        }
        if( mee !== '0' && mee !== 0){
            throw new Error('No margins allowed on the root element of an `include`!  Errant margin: margin-end...on include id: '+this.parentId);
        }




        if(maxWid && minWid){
            parent.directChildConstraints.push('H:|~[' + this.id + '(==' + this.width+',<='+maxWidth+',>='+minWidth+')]~|\n');
        }else if(!maxWid && !minWid){
            parent.directChildConstraints.push('H:|~[' + this.id + '(==' + this.width + ')]~|\n');
        }else if(maxWid){
            parent.directChildConstraints.push('H:|~[' + this.id + '(==' + this.width + ',<='+maxWidth+')]~|\n');
        }else if(minWid){
            parent.directChildConstraints.push('H:|~[' + this.id + '(==' + this.width + ',>='+minWidth+')]~|\n');
        }

        if(maxHei && minHei){
            parent.directChildConstraints.push('V:|~[' + this.id + ',<='+maxHeight+',>='+minHeight+')]~|\n');
        }else if(!maxHei && !minHei){
            parent.directChildConstraints.push('V:|~[' + this.id + '(==' + this.height + ')]~|\n');
        }else if(maxHei){
            parent.directChildConstraints.push('V:|~[' + this.id + '(==' + this.height + ',<='+maxHeight+')]~|\n');
        }else if(minHei){
            parent.directChildConstraints.push('V:|~[' + this.id + '(==' + this.height + ',>='+minHeight+')]~|\n');
        }



        return '';
    }


    let ss = this.refIds.get(attrKeys.layout_constraintStart_toStartOf);
    let se = this.refIds.get(attrKeys.layout_constraintStart_toEndOf);
    let es = this.refIds.get(attrKeys.layout_constraintEnd_toStartOf);
    let ee = this.refIds.get(attrKeys.layout_constraintEnd_toEndOf);

    let tt = this.refIds.get(attrKeys.layout_constraintTop_toTopOf);
    let tb = this.refIds.get(attrKeys.layout_constraintTop_toBottomOf);
    let bt = this.refIds.get(attrKeys.layout_constraintBottom_toTopOf);
    let bb = this.refIds.get(attrKeys.layout_constraintBottom_toBottomOf);

    let cx = this.refIds.get(attrKeys.layout_constraintCenterXAlign);
    let cy = this.refIds.get(attrKeys.layout_constraintCenterYAlign);


    let vfl = new StringBuffer();


    if (isWidPct === true) {

        if(maxWid && minWid){
            vfl.append('H:[' + this.id + '(==' + this.width+',<='+maxWidth+',>='+minWidth+')]\n');
        }else if(!maxWid && !minWid){
            vfl.append('H:[' + this.id + '(==' + this.width + ')]\n');
        }else if(maxWid){
            vfl.append('H:[' + this.id + '(==' + this.width + ',<='+maxWidth+')]\n');
        }else if(minWid){
            vfl.append('H:[' + this.id + '(==' + this.width + ',>='+minWidth+')]\n');
        }
    } else {
         if (this.width === sizes.WRAP_CONTENT) {
            let w = parseInt(this.wrapWidth);
            if (!Number.isNaN(w)) {
                if(maxWid && minWid){
                    vfl.append('H:[' + this.id + '(==' + w+',<='+maxWidth+',>='+minWidth+')]\n');
                }else if(!maxWid && !minWid){
                    vfl.append('H:[' + this.id + '(==' + w + ')]\n');
                }else if(maxWid){
                    vfl.append('H:[' + this.id + '(==' + w + ',<='+maxWidth+')]\n');
                }else if(minWid){
                    vfl.append('H:[' + this.id + '(==' + w + ',>='+minWidth+')]\n');
                }
            } else {
                throw 'Please implement wrap_content functionality for (' + this.constructor.name + ") , width of `" + this.id + "` set to wrap_content";
            }
        } else if (Number.isNaN(pw)) {
             if(maxWid && minWid){
                 vfl.append('H:[' + this.id + '(' + this.width+',<='+maxWidth+',>='+minWidth+')]\n');
             }else if(!maxWid && !minWid){
                 vfl.append('H:[' + this.id + '(' + this.width + ')]\n');
             }else if(maxWid){
                 vfl.append('H:[' + this.id + '(' + this.width + ',<='+maxWidth+')]\n');
             }else if(minWid){
                 vfl.append('H:[' + this.id + '(' + this.width + ',>='+minWidth+')]\n');
             }
        } else {
             if(maxWid && minWid){
                 vfl.append('H:[' + this.id + '(==' + pw+',<='+maxWidth+',>='+minWidth+')]\n');
             }else if(!maxWid && !minWid){
                 vfl.append('H:[' + this.id + '(==' + pw + ')]\n');
             }else if(maxWid){
                 vfl.append('H:[' + this.id + '(==' + pw + ',<='+maxWidth+')]\n');
             }else if(minWid){
                 vfl.append('H:[' + this.id + '(==' + pw + ',>='+minWidth+')]\n');
             }
        }
    }


    if (isHeiPct === true) {
        if(maxHei && minHei){
            vfl.append('V:[' + this.id + '(==' + this.height+',<='+maxHeight+',>='+minHeight+')]\n');
        }else if(!maxHei && !minHei){
            vfl.append('V:[' + this.id + '(==' + this.height + ')]\n');
        }else if(maxHei){
            vfl.append('V:[' + this.id + '(==' + this.height + ',<='+maxHeight+')]\n');
        }else if(minHei){
            vfl.append('V:[' + this.id + '(==' + this.height + ',>='+minHeight+')]\n');
        }
    } else {
       if (this.height === sizes.WRAP_CONTENT) {
            let h = parseInt(this.wrapHeight);
            if (!Number.isNaN(h)) {
                if(maxHei && minHei){
                    vfl.append('V:[' + this.id + '(==' + h+',<='+maxHeight+',>='+minHeight+')]\n');
                }else if(!maxHei && !minHei){
                    vfl.append('V:[' + this.id + '(==' + h + ')]\n');
                }else if(maxHei){
                    vfl.append('V:[' + this.id + '(==' + h + ',<='+maxHeight+')]\n');
                }else if(minHei){
                    vfl.append('V:[' + this.id + '(==' + h + ',>='+minHeight+')]\n');
                }
            } else {
                throw 'Please implement wrap_content functionality for (' + this.constructor.name + ") , height of `" + this.id + "` set to wrap_content";
            }
        } else if (Number.isNaN(ph)) {
           if(maxHei && minHei){
               vfl.append('V:[' + this.id + '(' + this.height+',<='+maxHeight+',>='+minHeight+')]\n');
           }else if(!maxHei && !minHei){
               vfl.append('V:[' + this.id + '(' + this.height + ')]\n');
           }else if(maxHei){
               vfl.append('V:[' + this.id + '(' + this.height + ',<='+maxHeight+')]\n');
           }else if(minHei){
               vfl.append('V:[' + this.id + '(' + this.height + ',>='+minHeight+')]\n');
           }
        } else {
           if(maxHei && minHei){
               vfl.append('V:[' + this.id + '(==' + ph+',<='+maxHeight+',>='+minHeight+')]\n');
           }else if(!maxHei && !minHei){
               vfl.append('V:[' + this.id + '(==' + ph + ')]\n');
           }else if(maxHei){
               vfl.append('V:[' + this.id + '(==' + ph + ',<='+maxHeight+')]\n');
           }else if(minHei){
               vfl.append('V:[' + this.id + '(==' + ph + ',>='+minHeight+')]\n');
           }
        }
    }


    if (cx) {
        if (this.parentId === cx) {
            vfl.append('H:|~[' + this.id + ']~|\n');//margins do not work when centering in parent
        } else {
            vfl.append('C:' + this.id + '.centerX(' + cx + '.centerX*1+' + ms + ')\n');
        }
    }

    if (cy) {
        if (this.parentId === cy) {
            vfl.append('V:|~[' + this.id + ']~|\n');//margins do not work when centering in parent
        } else {
            vfl.append('C:' + this.id + '.centerY(' + cy + '.centerY)\n');
        }
    }

    if (ss) {
        if (this.parentId === ss) {
            if (ss === ee) {
                vfl.append('H:|~[' + this.id + ']~|\n');
            } else {
                vfl.append('H:|-' + ms + '-[' + this.id + ']\n');
            }
        } else {
            if (ss === ee) {
                vfl.append('C:' + this.id + '.centerX(' + ss + '.centerX*1+' + ms + ')\n');
            } else {
                vfl.append('C:' + this.id + '.left(' + ss + '.left*1+' + ms + ')\n');
            }
        }


    }
    if (ee) {
        if (this.parentId === ee) {
            if (ss !== ee) {
                vfl.append('H:[' + this.id + ']-' + me + '-|\n');
            }
        } else {
            if (ss !== ee) {
                vfl.append('C:' + this.id + '.right(' + ee + '.right*1-' + me + ')\n');
            }
        }
    }

    if (tt) {
        if (this.parentId === tt) {
            if (tt === bb) {
                vfl.append('V:|~[' + this.id + ']~|\n');
            } else {
                vfl.append('V:|-' + mt + '-[' + this.id + ']\n');
            }

        } else {
            if (tt === bb) {
                vfl.append('C:' + this.id + '.centerY(' + tt + '.centerY*1+' + mt + ')\n');
            } else {
                vfl.append('C:' + this.id + '.top(' + tt + '.top*1+' + mt + ')\n');
            }

        }
    }

    if (bb) {
        if (this.parentId === bb) {
            if (tt !== bb) {
                vfl.append('V:[' + this.id + ']-' + mb + '-|\n');
            }
        } else {
            if (tt !== bb) {
                vfl.append('C:' + this.id + '.bottom(' + bb + '.bottom*1-' + mb + ')\n');
            }
        }
    }

    if (se) {
        if (this.parentId === se) {
            throw 'Align start to parent end currently not possible..id = `' + this.id + '`';
        } else {
            vfl.append('C:' + this.id + '.left(' + se + '.right+' + ms + ')\n');
        }
    }

    if (es) {
        if (this.parentId === es) {
            throw 'Align end to parent start currently not possible..id = `' + this.id + '`';
        } else {
            vfl.append('C:' + this.id + '.right(' + es + '.left-' + me + ')\n');
        }
    }

    if (tb) {
        if (this.parentId === tb) {
            throw 'Align top to parent bottom currently not possible..id = `' + this.id + '`';
        } else {
            vfl.append('C:' + this.id + '.top(' + tb + '.bottom+' + mt + ')\n');
        }
    }

    if (bt) {
        if (this.parentId === bt) {
            throw 'Align bottom to parent top currently not possible..id = `' + this.id + '`';
        } else {
            vfl.append('C:' + this.id + '.bottom(' + bt + '.top-' + mb + ')\n');
        }
    }


    return vfl.toString().trim();
};
View.prototype.register = function () {
    viewMap.set(this.id, this);
};

View.prototype.unregister = function () {
    viewMap.delete(this.id);
};

function isHTMLTagName(tagName) {
    if (typeof tagName === 'string') {
        const tags = 'a b u i body head header h1 h2 h3 h4 h5 h6 style title div p span button checkbox radio input label textarea select legend ul ol li link table tbody thead tfoot tr td th option optgroup video meta img hr picture pre script section small strong noscript object canvas caption blockquote article audio time var cite code iframe nav noframes menu br'.split(' ');
        return tags.indexOf(tagName.trim().toLowerCase()) > -1;
    }
    return false;
}

function getSignedValue(val) {
    if (typeof val === 'undefined') {
        return '+0.0';
    }
    if (typeof val === 'string') {
        var p = parseInt(val);
        return Number.isNaN(p) ? "+0.0" : (p >= 0 ? "+" + p : "" + p);
    }
    if (typeof val === 'number') {
        return (val > 0 ? "+" + val : "-" + val);
    }
}

View.prototype.assignId = function () {
    if (this.htmlElement) {
        this.htmlElement.id = this.id;
        const cssClass = this.refIds.get(attrKeys.cssClass);
        if (attributeNotEmpty(cssClass)) {
            addClass(this.htmlElement, cssClass);
        }
    }
};


/**
 *
 * @returns {string}
 */
View.prototype.toHTML = function () {
    var node = this.htmlElement;
    if (node) {
        var outerHtmlHackElem = null;
        const nodeName = node.nodeName.toLowerCase();
        if (isHTMLTagName(nodeName)) {

            if (nodeName === 'li') {
                outerHtmlHackElem = document.createElement('ul');
            } else if (nodeName === 'tbody' || nodeName === 'thead' || nodeName === 'tfoot') {
                outerHtmlHackElem = document.createElement('table');
            } else if (nodeName === 'tr') {
                outerHtmlHackElem = document.createElement('table');
            } else if (nodeName === 'td' || nodeName === 'th') {
                outerHtmlHackElem = document.createElement('tr');
            } else if (nodeName === 'option') {
                outerHtmlHackElem = document.createElement('select');
            } else {//A div should be able to wrap most of the remaining element types
                outerHtmlHackElem = document.createElement('div');
            }
            outerHtmlHackElem.appendChild(node);
            var outerHtmlHack = outerHtmlHackElem.innerHTML;
            return outerHtmlHack;

        } else {
            throw 'Invalid HTML element!';
        }
    }
    throw 'Please specify an HTML element here!';
};

/**
 * Lays out the child elements of a parent element absolutely
 * using the visual format language.
 *
 * When the window is resized, the AutoLayout view is re-evaluated
 * and the child elements are resized and repositioned.
 *
 * @param {Element} parentElm Parent DOM element
 * @param {String|Array} visualFormat One or more visual format strings
 */
function autoLayout(parentElm, visualFormat) {
    let view = new AutoLayout.View();
    view.addConstraints(AutoLayout.VisualFormat.parse(visualFormat, {extended: true}));
    let elements = {};
    for (let key in view.subViews) {
        let elm = document.getElementById(key);
        if (elm) {
            elm.className += elm.className ? ' abs' : 'abs';
            elements[key] = elm;
        }
    }
    var updateLayout = function () {
        view.setSize(parentElm ? parentElm.clientWidth : window.innerWidth, parentElm ? parentElm.clientHeight : window.innerHeight);
        for (key in view.subViews) {
            var subView = view.subViews[key];
            if (elements[key]) {
                setAbsoluteSizeAndPosition(elements[key], subView.left, subView.top, subView.width, subView.height);
            }
        }
    };
    window.addEventListener('resize', updateLayout);
    updateLayout();
    return updateLayout;
}

/**
 *
 * @param {type} node The xml node
 * @returns {undefined}
 */
View.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('div');

    var id = node.getAttribute(attrKeys.id);
    this.htmlElement.id = id;

    this.calculateWrapContentSizes(node);

};


View.prototype.calculateWrapContentSizes = function (node) {
    this.wrapWidth = 180;
    this.wrapHeight = 75;
};


CheckBox.prototype = Object.create(View.prototype);
CheckBox.prototype.constructor = CheckBox;


Button.prototype = Object.create(View.prototype);
Button.prototype.constructor = Button;


NativeTable.prototype = Object.create(View.prototype);
NativeTable.prototype.constructor = NativeTable;


TextField.prototype = Object.create(View.prototype);
TextField.prototype.constructor = TextField;


TextArea.prototype = Object.create(View.prototype);
TextArea.prototype.constructor = TextArea;


DropDown.prototype = Object.create(View.prototype);
DropDown.prototype.constructor = DropDown;


List.prototype = Object.create(View.prototype);
List.prototype.constructor = List;


Label.prototype = Object.create(View.prototype);
Label.prototype.constructor = Label;


MultiLineLabel.prototype = Object.create(View.prototype);
MultiLineLabel.prototype.constructor = MultiLineLabel;


RadioGroup.prototype = Object.create(View.prototype);
RadioGroup.prototype.constructor = RadioGroup;

Radio.prototype = Object.create(View.prototype);
Radio.prototype.constructor = Radio;


ImageView.prototype = Object.create(View.prototype);
ImageView.prototype.constructor = ImageView;


ProgressBar.prototype = Object.create(View.prototype);
ProgressBar.prototype.constructor = ProgressBar;


Separator.prototype = Object.create(View.prototype);
Separator.prototype.constructor = Separator;


Guideline.prototype = Object.create(View.prototype);
Guideline.prototype.constructor = Guideline;

CanvasView.prototype = Object.create(View.prototype);
CanvasView.prototype.constructor = CanvasView;


ClockView.prototype = Object.create(View.prototype);
ClockView.prototype.constructor = ClockView;


IncludedView.prototype = Object.create(View.prototype);
IncludedView.prototype.constructor = IncludedView;

/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function CheckBox(node) {
    View.call(this, node);
}

CheckBox.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('input');
    this.htmlElement.type = 'checkbox';

    var id = node.getAttribute(attrKeys.id);
    this.htmlElement.id = id;

    var value = node.getAttribute(attrKeys.value);
    if (attributeNotEmpty(value)) {
        this.htmlElement.value = value;
    }
    var name = node.getAttribute(attrKeys.name);
    if (attributeNotEmpty(name)) {
        this.htmlElement.name = name;
    }


};
CheckBox.prototype.calculateWrapContentSizes = function (node) {
    this.wrapWidth = 32;
    this.wrapHeight = 32;
};

/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function Button(node) {
    View.call(this, node);
}

Button.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('input');
    this.htmlElement.type = 'button';
    this.style.addStyleElementCss('text-align:center;');

    let id = node.getAttribute(attrKeys.id);
    this.htmlElement.id = id;

    let value = node.getAttribute(attrKeys.value);
    let text = node.getAttribute(attrKeys.text);
    if (attributeNotEmpty(value)) {
        this.htmlElement.value = value;// button label
    }
    if (attributeNotEmpty(text)) {
        this.htmlElement.value = text;// button label
    }

    let name = node.getAttribute(attrKeys.name);
    if (attributeNotEmpty(name)) {
        this.htmlElement.name = name;
    }

    this.calculateWrapContentSizes(node);


};

Button.prototype.calculateWrapContentSizes = function (node) {
    //bold 12pt arial;
    this.getWrapSize(this.htmlElement.value);
};

/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function NativeTable(node) {
    View.call(this, node);
}

NativeTable.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('table');
    this.assignId();
    
    
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let tfoot = document.createElement('tfoot');
    
    
    let entries = node.getAttribute(attrKeys.tableItems);
    let hasHeader = node.getAttribute(attrKeys.hasHeader);
    let hasFooter = node.getAttribute(attrKeys.hasFooter);
    
    
    if(!attributeNotEmpty(hasHeader)){
        hasHeader = false;
    }
    if(!attributeNotEmpty(hasFooter)){
        hasFooter = false;
    }

    if (attributeNotEmpty(entries)) {
        let array = parseTableItems(entries);
        let tableSize = array.length;
        for (var i = 0; i < tableSize; i++) {
             let tr = document.createElement('tr');
            for(var j=0;j<array[i].length;j++){
               let td = document.createElement('td');
               td.innerHTML = array[i][j];
               tr.appendChild(td);
            }
            if(tableSize === 1){
                   tbody.appendChild(tr);
                   break;
            }
            else if(tableSize === 2){
               if(i === 0){
                if(hasHeader){
                     thead.appendChild(tr);
                }else{
                       tbody.appendChild(tr);
                }
            }
            
            else if(i === array.length - 1){
                if(hasFooter){
                     tfoot.appendChild(tr);
                }else{
                       tbody.appendChild(tr);
                }
            }
            }
            else if(tableSize > 2){
             if(i === 0){
                if(hasHeader){
                     thead.appendChild(tr);
                }else{
                       tbody.appendChild(tr);
                }
            }
            
             else if(i === array.length - 1){
                if(hasFooter){
                     tfoot.appendChild(tr);
                }else{
                       tbody.appendChild(tr);
                }
             }
             else{
                   tbody.appendChild(tr);
             }
            }
            
         
         
        }
        
    this.htmlElement.appendChild(tbody);
    if(hasHeader){
         this.htmlElement.appendChild(thead);
    }
        if(hasFooter){
         this.htmlElement.appendChild(tfoot);
    }
    this.calculateWrapContentSizes(node);
    }

};

NativeTable.prototype.calculateWrapContentSizes = function (node) {
    this.wrapWidth = 200;
    this.wrapHeight = 250;
};

/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function TextField(node) {
    View.call(this, node);
}

TextField.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('input');


    var id = node.getAttribute(attrKeys.id);
    this.htmlElement.id = id;


    var value = node.getAttribute(attrKeys.value);
    var text = node.getAttribute(attrKeys.text);
    var type = node.getAttribute(attrKeys.inputType);

    if (!type) {
        type = 'text';//default
    }
    if (type && type !== 'text' && type !== 'password' && type !== 'file' && type !== 'date' && type !== 'search' && type !== 'datetime'
        && type !== 'tel' && type !== 'phone' && type !== 'time' && type !== 'color' && type !== 'url') {
        throw 'Unsupported input type';
    }

    if (attributeNotEmpty(value)) {
        this.htmlElement.value = value;
    }
    if (attributeNotEmpty(text)) {
        this.htmlElement.value = text;// button label
    }
    var name = node.getAttribute(attrKeys.name);
    if (attributeNotEmpty(name)) {
        this.htmlElement.name = name;
    }

    if (attributeNotEmpty(type)) {
        this.htmlElement.type = type;
    }


    var placeholder = node.getAttribute(attrKeys.placeholder);
    if (attributeNotEmpty(placeholder)) {
        this.htmlElement.placeholder = placeholder;
    }


    this.calculateWrapContentSizes(node);
};

TextField.prototype.calculateWrapContentSizes = function (node) {
    this.getWrapSize(this.htmlElement.value);
    this.wrapWidth *= 1.25;
};

/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function ProgressBar(node) {
    this.options = {};
    this.progress = null;
    View.call(this, node);
}

ProgressBar.prototype.createElement = function (node) {

    let id = node.getAttribute(attrKeys.id);
    let val = node.getAttribute(attrKeys.value);
    let description = node.getAttribute(attrKeys.description);
    let textColor = node.getAttribute(attrKeys.textColor);
    let progressColor = node.getAttribute(attrKeys.progressColor);
    let backgroundColor = node.getAttribute(attrKeys.backgroundColor);
    let fontSize = node.getAttribute(attrKeys.fontSize);
    let fontName = node.getAttribute(attrKeys.fontName);
    let fontStyle = node.getAttribute(attrKeys.fontStyle);

    this.htmlElement = document.createElement('canvas');
    this.htmlElement.id = id;

    this.options = {
        id: id,
        value: parseInt(val),
        description: description,
        textColor: textColor,
        progressColor: progressColor,
        backgroundColor: backgroundColor,
        fontName: fontName,
        fontSize: fontSize,
        sizeUnits: CssSizeUnits.PX,
        fontStyle: fontStyle
    };

    this.assignId();
    this.calculateWrapContentSizes(node);
};

ProgressBar.prototype.calculateWrapContentSizes = function (node) {
    this.wrapWidth = 150;
    this.wrapHeight = 40;
};


ProgressBar.prototype.runProgress = function () {
    this.progress = new Progress(this.options);
};

/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function TextArea(node) {
    View.call(this, node);
}

/**
 *
 * @param {Node} node
 */
TextArea.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('textarea');


    var id = node.getAttribute(attrKeys.id);
    var name = node.getAttribute(attrKeys.name);
    var maxLength = node.getAttribute(attrKeys.maxLength);
    var rows = node.getAttribute(attrKeys.rows);
    var cols = node.getAttribute(attrKeys.cols);

    var value = node.getAttribute(attrKeys.value);
    var text = node.getAttribute(attrKeys.text);
    if (attributeNotEmpty(value)) {
        this.htmlElement.value = value;
    }
    if (attributeNotEmpty(text)) {
        this.htmlElement.value = text;// button label
    }

    this.htmlElement.id = id;
    if (attributeNotEmpty(name)) {
        this.htmlElement.name = name;
    }

    if (attributeNotEmpty(rows)) {
        this.htmlElement.rows = parseInt(rows);
    }
    if (attributeNotEmpty(cols)) {
        this.htmlElement.cols = parseInt(cols);
    }
    if (attributeNotEmpty(maxLength)) {
        this.htmlElement.maxLength = parseInt(maxLength);
    }


    let width = this.htmlElement.clientWidth, height = this.htmlElement.clientHeight;

    let ta = this.htmlElement;
    ta.addEventListener("mouseup", function () {
        if (ta.clientWidth !== width || ta.clientHeight !== height) {
            //do Something


        }
        width = ta.clientWidth;
        height = ta.clientHeight;
    });
    this.calculateWrapContentSizes(node);
};

TextArea.prototype.calculateWrapContentSizes = function (node) {
    this.getWrapSize(this.htmlElement.value);
    this.wrapWidth *= 1.25;
};

/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function DropDown(node) {
    View.call(this, node);
}


DropDown.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('SELECT');
    var items = node.getAttribute(attrKeys.items);

    if (attributeNotEmpty(items)) {
        let scanner = new Scanner(items, false, new Array('\'', '\"', '[', ']', ','));
        let data = scanner.scan();
        for (var i = 0; i < data.length; i++) {
            this.htmlElement.options[this.htmlElement.options.length] = new Option(data[i], i + "");
        }
    }

    this.assignId();

};
DropDown.prototype.calculateWrapContentSizes = function (node) {

};

/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function List(node) {
    View.call(this, node);
}

List.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('ul');
    this.assignId();

};

List.prototype.calculateWrapContentSizes = function (node) {

};

/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function Label(node) {
    View.call(this, node);
}


Label.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('span');
    var text = node.getAttribute(attrKeys.text);
    var value = node.getAttribute(attrKeys.value);
    var fontSz = node.getAttribute(attrKeys.fontSize);
    this.style.addStyleElementCss('text-align:center;');


    if (attributeNotEmpty(text)) {
        this.htmlElement.textContent = text;// label
    }
    if (attributeNotEmpty(value)) {
        this.htmlElement.textContent = value;// label
    }
    this.assignId();
    this.calculateWrapContentSizes(node);
};

Label.prototype.calculateWrapContentSizes = function (node) {
    this.getWrapSize(this.htmlElement.textContent);

};


/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function MultiLineLabel(node) {
    View.call(this, node);
}


MultiLineLabel.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('p');


    var text = node.getAttribute(attrKeys.text);
    var value = node.getAttribute(attrKeys.value);
    if (attributeNotEmpty(text)) {
        var textNode = document.createTextNode(text);
        this.htmlElement.appendChild(textNode);
    }
    if (attributeNotEmpty(value)) {
        var textNode = document.createTextNode(value);
        this.htmlElement.appendChild(textNode);
    }

    this.assignId();
    this.calculateWrapContentSizes(node);
};

MultiLineLabel.prototype.calculateWrapContentSizes = function (node) {
    this.getWrapSize(node);
};

function CanvasView(node) {
    View.call(this, node);
}

CanvasView.prototype.createElement = function (node) {
    let width = node.getAttribute(attrKeys.width);
    let height = node.getAttribute(attrKeys.height);

    if (!attributeNotEmpty(width)) {
        width = this.refIds.get(attrKeys.layout_width);
    }
    if (!attributeNotEmpty(height)) {
        height = this.refIds.get(attrKeys.layout_height);
    }


    let id = this.id;
    this.htmlElement = document.createElement('canvas');
    this.htmlElement.id = id;
    this.htmlElement.setAttribute('width', parseInt(width));
    this.htmlElement.setAttribute('height', parseInt(height));

    this.calculateWrapContentSizes(node);
}

CanvasView.prototype.calculateWrapContentSizes = function (node) {
    this.wrapWidth = this.htmlElement.getAttribute('width');
    this.wrapHeight = this.htmlElement.getAttribute('height');
};

function ClockView(node) {
    this.clockOptions = {};
    this.clock = null;
    View.call(this, node);

}


ClockView.prototype.createElement = function (node) {

    var outerColor = node.getAttribute(attrKeys.clockOuterColor);
    var middleColor = node.getAttribute(attrKeys.clockMiddleColor);
    var innerColor = node.getAttribute(attrKeys.clockInnerColor);
    var tickColor = node.getAttribute(attrKeys.clockTickColor);
    var secondsColor = node.getAttribute(attrKeys.clockSecondsColor);
    var minutesColor = node.getAttribute(attrKeys.clockMinutesColor);
    var hoursColor = node.getAttribute(attrKeys.clockHoursColor);
    var centerSpotWidth = node.getAttribute(attrKeys.clockCenterSpotWidth);
    var outerCircleAsFractionOfFrameSize = node.getAttribute(attrKeys.clockOuterCircleAsFractionOfFrameSize);
    var showBaseText = node.getAttribute(attrKeys.clockShowBaseText) === true;


    if (!attributeNotEmpty(outerColor)) {
        outerColor = 'transparent';
    }
    if (!attributeNotEmpty(middleColor)) {
        middleColor = 'white';
    }
    if (!attributeNotEmpty(innerColor)) {
        innerColor = 'lightgray';
    }
    if (!attributeNotEmpty(tickColor)) {
        tickColor = 'black';
    }
    if (!attributeNotEmpty(secondsColor)) {
        secondsColor = 'red';
    }
    if (!attributeNotEmpty(minutesColor)) {
        minutesColor = 'black';
    }
    if (!attributeNotEmpty(hoursColor)) {
        hoursColor = 'black';
    }
    if (!attributeNotEmpty(centerSpotWidth)) {
        centerSpotWidth = 2;
    }
    if (!attributeNotEmpty(outerCircleAsFractionOfFrameSize)) {
        outerCircleAsFractionOfFrameSize = 1.0;
    }

    if (!attributeNotEmpty(showBaseText)) {
        showBaseText = false;
    }


    var id = this.id;
    this.htmlElement = document.createElement('canvas');
    this.htmlElement.id = id;

    this.clockOptions = {
        canvasId: id,
        floating: false,
        outerColor: outerColor,
        middleColor: middleColor,
        innerColor: innerColor,
        tickColor: tickColor,
        secondsColor: secondsColor,
        minutesColor: minutesColor,
        hoursColor: hoursColor,
        centerSpotWidth: parseInt(centerSpotWidth), // a number
        outerCircleAsFractionOfFrameSize: parseInt(outerCircleAsFractionOfFrameSize), //a floating point value between 0.0 and 1.0
        showBaseText: showBaseText
    };

    this.assignId();
    this.calculateWrapContentSizes(node);
};


ClockView.prototype.runClock = function () {
    this.clock = new Clock(this.clockOptions);
    this.clock.run();
};

ClockView.prototype.calculateWrapContentSizes = function (node) {
    this.wrapWidth = 120;
    this.wrapHeight = 120;
};


/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function RadioGroup(node) {
    View.call(this, node);
}

RadioGroup.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('div');
    this.assignId();
};
RadioGroup.prototype.calculateWrapContentSizes = function (node) {

};

/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function Radio(node) {
    View.call(this, node);
}

Radio.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('input');
    this.htmlElement.setAttribute("type", "radio");


    var name = node.getAttribute(attrKeys.name);
    var checked = node.getAttribute(attrKeys.checked);

    if (attributeNotEmpty(name)) {
        this.htmlElement.setAttribute('name', name);
    }

    if (attributeNotEmpty(checked)) {
        this.htmlElement.checked = checked === 'true';
    }
    this.assignId();
};

Radio.prototype.calculateWrapContentSizes = function (node) {

};

function ImageView(node) {
    View.call(this, node);
}

ImageView.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('img');
    this.htmlElement.src = PATH_TO_COMPILER_SCRIPTS + "images/" + node.getAttribute(attrKeys.src);
    this.htmlElement.alt = node.getAttribute(attrKeys.alt);
    this.assignId();
};

ImageView.prototype.calculateWrapContentSizes = function (node) {

};

/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function Separator(node) {
    View.call(this, node);

}

Separator.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('div');
    this.assignId();
    this.calculateWrapContentSizes(node);
};

Separator.prototype.calculateWrapContentSizes = function (node) {
    const orientation = this.refIds.get(attrKeys.orientation);
    if (typeof orientation === 'undefined' || orientation === null || orientation === '') {
        throw 'Please specify the orientation of the Guideline whose id is `' + this.id + '`';
    }

    if (orientation === orientations.VERTICAL) {
        this.wrapWidth = 1;
        this.wrapHeight = 32;
    } else {
        this.wrapWidth = 32;
        this.wrapHeight = 1;
    }
};

/**
 *
 * @param {type} node key-value object
 * @returns {undefined}
 */
function Guideline(node) {
    View.call(this, node);
}

Guideline.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('div');
    this.htmlElement.style.backgroundColor = 'red';
    this.assignId();
    this.calculateWrapContentSizes();

};

Guideline.prototype.calculateWrapContentSizes = function (node) {
    const orientation = this.refIds.get(attrKeys.orientation);
    if (typeof orientation === 'undefined' || orientation === null || orientation === '') {
        throw 'Please specify the orientation of the Guideline whose id is `' + this.id + '`';
    }

    if (orientation === orientations.VERTICAL) {
        this.wrapWidth = '1';
        this.wrapHeight = sizes.MATCH_PARENT;
    } else {
        this.wrapWidth = sizes.MATCH_PARENT;
        this.wrapHeight = '1';
    }
};

Guideline.prototype.makeVFL = function () {
    const orientation = this.refIds.get(attrKeys.orientation);
    if (typeof orientation === 'undefined' || orientation === null || orientation === '') {
        throw 'Please specify the orientation of the Guideline whose id is `' + this.id + '`';
    }

    let guidePct = this.refIds.get(attrKeys.layout_constraintGuide_percent);


    if (typeof guidePct === 'undefined' || guidePct === null || guidePct === '') {
        throw 'Please specify the constraint-guide-percentage of the Guideline whose id is `' + this.id + '`';
    }

    let val = 0;
    if (endsWith(guidePct, '%')) {
        if (Number.isNaN(val = parseInt(guidePct))) {
            throw 'Please specify a floating point number between 0 and 1 to signify 0 - 100% of width';
        }
        val += '%';
    } else if (Number.isNaN(val = parseFloat(guidePct))) {
        throw 'Please specify a floating point number between 0 and 1 to signify 0 - 100% of width';
    } else {
        if (val >= 1) {
            val = '100%';
        } else {
            val *= 100;
            val += '%';
        }
    }


    var vfl = new StringBuffer();
    if (orientation === orientations.VERTICAL) {
        vfl.append('V:|-0-[' + this.id + ']-0-|\nH:|-(' + val + ')-[' + this.id + '(<=1)]-|');
    } else if (orientation === orientations.HORIZONTAL) {
        vfl.append('H:|-0-[' + this.id + ']-0-|\nV:|-(' + val + ')-[' + this.id + '(<=1)]-|');
    }

    return vfl.toString();

};

function IncludedView(node) {
    View.call(this, node);

    let rawLayoutName = node.getAttribute(attrKeys.layout);
    let layout = rawLayoutName;

    if (!layout || typeof layout !== 'string') {
        throw 'An included layout must be the name of a valid xml file in the `' + PATH_TO_LAYOUTS_FOLDER + '` folder';
    }
    let len = layout.length;
    if (layout.substring(len - 4) !== '.xml') {
        layout += '.xml';
    }
    /**
     * Notifies an include of the constraints that it needs to apply to the root element of the linked document
     * @type {string[]}
     */
    this.directChildConstraints = [];
    this.constraints = [];

    let xmlLayout = xmlIncludes.get(layout);


    let mp = new Parser(xmlLayout, this.id);

    this.constraints = mp.constraints;

}


IncludedView.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('div');

    let id = node.getAttribute(attrKeys.id);
    this.htmlElement.id = id;
    this.calculateWrapContentSizes(node);
};


IncludedView.prototype.calculateWrapContentSizes = function (node) {
    this.wrapWidth = 300;
    this.wrapHeight = 320;
};


function attributeNotEmpty(attrVal) {
    if (attrVal && attrVal.trim().length > 0) {
        return true;
    }
    return false;
}
/**
 * Parses bracketed expressions of the type: [row['a',bb,c,dd],row[],row[],row[],...row[]]
 * @param {type} input The expression containing a kind of bracketed structure
 * @returns {Array[]} a 2d array of table data
 */
function parseTableItems(input){

    input = input.trim();alert(endsWith(input,']'));
    if(startsWith(input , '[') && endsWith(input,']')){
        input = input.substring(1, input.length - 1);
    }else{
        throw new Error('Data in table not in correct format! Must be: [row[row-data],row[row-data]...]');
    }
   
    
    let tokens = new Scanner(input, false, new Array(',row', 'row')).scan();
    

let tableData = [];
    for(let i=0;i<tokens.length;i++){
     let rowStr = tokens[i];
     let rowData = new Scanner(rowStr, false, [',']).scan();
     tableData.push(rowData);
    }
    
    
    if(tableData.length > 0){
    let len = tableData[0].length;
    for(let i=1; i<tableData.length; i++){
        if(tableData[i].length !== len){
          throw new Error('The rows of your table should have equal lenth, please');   
        }
    }
    
    }
    
    return tableData;
}