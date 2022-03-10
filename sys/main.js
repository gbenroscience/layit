let TEMPLATE_INDEX = 0;


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


/* global AutoLayout, attrKeys, xmlKeys, orientations, sizes, dummyDiv, dummyCanvas, PATH_TO_LAYOUTS_FOLDER, PATH_TO_COMPILER_SCRIPTS, rootCount, CssSizeUnits, PATH_TO_IMAGES, FontStyle, Gravity */
/**
 * 
 * @param {type} node The node that represents this View in the android style xml document
 * @returns {View}
 */

/**
 * 
 * @param {Workspace} wkspc
 * @param {XMLNode} node
 * @returns {View}
 */
function View(wkspc, node) {
    const zaId = node.getAttribute(attrKeys.id);

    if (typeof zaId === 'undefined' || zaId === null || zaId === '') {
        throw 'Please specify the view id properly';
    }

    if (typeof wkspc.findViewById(zaId) !== 'undefined') {
        throw 'A view with this id(`' + zaId + '`) exists already';
    }

    let nodeName = node.nodeName;

    this.nodeName = nodeName;
    this.root = nodeName === xmlKeys.root || nodeName === xmlKeys.include;

    //The main ConstraintLayout tag in the original layout file
    this.topLevelRoot = this.root === true && wkspc.viewMap.size === 0;

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
        this.marginHorizontal = node.getAttribute(attrKeys.layout_marginHorizontal);
        this.marginVertical = node.getAttribute(attrKeys.layout_marginVertical);


        const emptyMargin = 'x';

        if (typeof this.marginTop === 'undefined' || this.marginTop === null || this.marginTop === '' || isNaN(parseInt(this.marginTop))) {
            this.marginTop = '0';
        }
        if (typeof this.marginBottom === 'undefined' || this.marginBottom === null || this.marginBottom === '' || isNaN(parseInt(this.marginBottom))) {
            this.marginBottom = '0';
        }
        if (typeof this.marginStart === 'undefined' || this.marginStart === null || this.marginStart === '' || isNaN(parseInt(this.marginStart))) {
            this.marginStart = '0';
        }
        if (typeof this.marginEnd === 'undefined' || this.marginEnd === null || this.marginEnd === '' || isNaN(parseInt(this.marginEnd))) {
            this.marginEnd = '0';
        }
        if (typeof this.marginHorizontal === 'undefined' || this.marginHorizontal === null || this.marginHorizontal === '' || isNaN(parseInt(this.marginHorizontal))) {
            this.marginHorizontal = '0';
        }
        if (typeof this.marginVertical === 'undefined' || this.marginVertical === null || this.marginVertical === '' || isNaN(parseInt(this.marginVertical))) {
            this.marginVertical = '0';
        }
        if (typeof this.margin === 'undefined' || this.margin === null || this.margin === '' || isNaN(parseInt(this.margin))) {
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
        if (this.marginHorizontal.startsWith("+")) {
            this.marginHorizontal = this.marginHorizontal.substr(1);
        }
        if (this.marginVertical.startsWith("+")) {
            this.marginVertical = this.marginVertical.substr(1);
        }
        if (this.margin.startsWith("+")) {
            this.margin = this.margin.substr(1);
        }


        if (this.marginTop.startsWith("-")) {
            throw 'Negative margins (margin-top) on view(' + this.id + ') not supported by layout engine';
        }
        if (this.marginBottom.startsWith("-")) {
            throw 'Negative margins (margin-bottom) on view(' + this.id + ') not supported by layout engine';
        }
        if (this.marginStart.startsWith("-")) {
            throw 'Negative margins (margin-start) on view(' + this.id + ') not supported by layout engine';
        }
        if (this.marginEnd.startsWith("-")) {
            throw 'Negative margins (margin-end) on view(' + this.id + ') not supported by layout engine';
        }
        if (this.marginHorizontal.startsWith("-")) {
            throw 'Negative margins (marginHorizontal) on view(' + this.id + ') not supported by layout engine';
        }
        if (this.marginVertical.startsWith("-")) {
            throw 'Negative margins (marginVertical) on view(' + this.id + ') not supported by layout engine';
        }
        if (this.margin.startsWith("-")) {
            throw 'Negative margins (margin) on view(' + this.id + ') not supported by layout engine';
        }


        this.width = node.getAttribute(attrKeys.layout_width);
        this.height = node.getAttribute(attrKeys.layout_height);


        changePxToUnitLess:{

            if (endsWith(this.width, 'px')) {
                this.width = parseInt(this.width);
            }
            if (endsWith(this.height, 'px')) {
                this.height = parseInt(this.height);
            }

        }



        this.dimRatio = -1;//Not specified... dimRatio is width/height

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
                    if (isNaN(parseInt(attrName))) {
                        this.refIds.set(attrKeys.layout_width, attrValue);
                    }
                    break;
                case attrKeys.layout_height:
                    if (isNaN(parseInt(attrName))) {
                        this.refIds.set(attrKeys.layout_height, attrValue);
                    }
                    break;

                case attrKeys.layout_maxWidth:
                    if (isNaN(parseInt(attrName))) {
                        this.refIds.set(attrKeys.layout_maxWidth, attrValue);
                        //    this.style.addStyleElement("max-width", attrValue);
                    }
                    break;
                case attrKeys.layout_maxHeight:
                    if (isNaN(parseInt(attrName))) {
                        this.refIds.set(attrKeys.layout_maxHeight, attrValue);
                    }
                    break;
                case attrKeys.layout_minWidth:
                    if (isNaN(parseInt(attrName))) {
                        this.refIds.set(attrKeys.layout_minWidth, attrValue);
                    }
                    break;
                case attrKeys.layout_minHeight:
                    if (isNaN(parseInt(attrName))) {
                        this.refIds.set(attrKeys.layout_minHeight, attrValue);

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
                case attrKeys.dimension_ratio:
                    if (isDimensionRatio(attrValue) === true) {
                        this.refIds.set(attrKeys.dimension_ratio, attrValue);
                        let arr = attrValue.split(':');
                        let num = parseFloat(arr[0]);
                        let den = parseFloat(arr[1]);
                        if (num <= 0) {
                            throw new Error('Bad ratio specified! LHS can neither be 0 nor less than 0');
                        }
                        if (den <= 0) {
                            throw new Error('Bad ratio specified! RHS can neither be 0 nor less than 0');
                        }
                        if (isNumber(attrValue)) {
                            this.dimRatio = parseFloat(attrValue);
                        } else {
                            this.dimRatio = num / den;
                        }
                    } else {
                        throw new Error('Invalid dimension ratio specified on view with id: ' + this.id);
                    }
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
    wkspc.viewMap.set(this.id, this);
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

function isDimensionRatio(val) {
    if (!isNaN(val)) {
        val = val + ':1';
        return true;
    }
    let count = 0;
    for (let i = 0; i < val.length; i++) {
        if (val.substring(i, i + 1) === ':') {
            count++;
            if (count > 1) {
                return false;
            }
        }
    }
    if (count === 0 || count > 1) {
        return false;
    }
    let arr = val.split(':');
    return arr.length = 2 && !isNaN(arr[0]) && !isNaN(arr[1]);
}

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
 * @param {Workspace} wkspc 
 * @return {string} the vfl definition for this View
 */
View.prototype.makeVFL = function (wkspc) {


    let mt = parseInt(this.marginTop);
    let mb = parseInt(this.marginBottom);
    let ms = parseInt(this.marginStart);
    let me = parseInt(this.marginEnd);

    let mh = parseInt(this.marginHorizontal);
    let mv = parseInt(this.marginVertical);

    if (isNumber(mh) && mh > 0) {
        ms = me = mh;//override individual horizontal margins if a general horizontal margin is defined
    }
    if (isNumber(mv) && mv > 0) {
        mt = mb = mv;//override individual horizontal margins if a general horizontal margin is defined
    }



    let maxWid = this.refIds.get(attrKeys.layout_maxWidth);
    let maxHei = this.refIds.get(attrKeys.layout_maxHeight);
    let minWid = this.refIds.get(attrKeys.layout_minWidth);
    let minHei = this.refIds.get(attrKeys.layout_minHeight);



    let maxWidth, maxHeight, minWidth, minHeight;


    if (endsWith(maxWid, '%') === false) {
        maxWidth = parseInt(maxWid + '');
    } else {
        maxWidth = maxWid;
    }
    if (endsWith(minWid, '%') === false) {
        minWidth = parseInt(minWid + '');
    } else {
        minWidth = minWid;
    }
    if (endsWith(maxHei, '%') === false) {
        maxHeight = parseInt(maxHei + '');
    } else {
        maxHeight = maxHei;
    }
    if (endsWith(minHei, '%') === false) {
        minHeight = parseInt(minHei + '');
    } else {
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




    if (this.dimRatio > 0) {
        //dimRatio = w/h
        if (pw === 0) {
            if (isNaN(ph)) {
                this.width = this.height + "/" + (1.0 / this.dimRatio);
            } else {
                this.width = pw = ph * this.dimRatio;
            }
        }
        if (ph === 0) {
            if (isNaN(pw)) {
                this.height = this.width + "/" + this.dimRatio;
            } else {
                this.height = ph = pw / this.dimRatio;
            }
        }
    }



    let parent, hasIncludedParent;
    if (attributeNotEmpty(this.parentId)) {
        parent = wkspc.viewMap.get(this.parentId);
        hasIncludedParent = parent && (parent.constructor.name === 'IncludedView');
    }
    /**
     * Must be the root node in an included file
     */
    if (hasIncludedParent === true) {
        let mtt = endsWith(this.marginTop, "%") ? this.marginTop : mt;
        let mbb = endsWith(this.marginBottom, "%") ? this.marginBottom : mb;
        let mss = endsWith(this.marginStart, "%") ? this.marginStart : ms;
        let mee = endsWith(this.marginEnd, "%") ? this.marginEnd : me;

        if (mtt !== '0' && mtt !== 0) {
            throw new Error('No margins allowed on the root element of an `include`! Errant margin: margin-top...on include id: ' + this.parentId);
        }
        if (mbb !== '0' && mbb !== 0) {
            throw new Error('No margins allowed on the root element of an `include`!  Errant margin: margin-bottom...on include id: ' + this.parentId);
        }
        if (mss !== '0' && mss !== 0) {
            throw new Error('No margins allowed on the root element of an `include`!  Errant margin: margin-start...on include id: ' + this.parentId);
        }
        if (mee !== '0' && mee !== 0) {
            throw new Error('No margins allowed on the root element of an `include`!  Errant margin: margin-end...on include id: ' + this.parentId);
        }




        if (maxWid && minWid) {
            parent.directChildConstraints.push('H:|~[' + this.id + '(==' + this.width + ',<=' + maxWidth + ',>=' + minWidth + ')]~|\n');
        } else if (!maxWid && !minWid) {
            parent.directChildConstraints.push('H:|~[' + this.id + '(==' + this.width + ')]~|\n');
        } else if (maxWid) {
            parent.directChildConstraints.push('H:|~[' + this.id + '(==' + this.width + ',<=' + maxWidth + ')]~|\n');
        } else if (minWid) {
            parent.directChildConstraints.push('H:|~[' + this.id + '(==' + this.width + ',>=' + minWidth + ')]~|\n');
        }

        if (maxHei && minHei) {
            parent.directChildConstraints.push('V:|~[' + this.id + ',<=' + maxHeight + ',>=' + minHeight + ')]~|\n');
        } else if (!maxHei && !minHei) {
            parent.directChildConstraints.push('V:|~[' + this.id + '(==' + this.height + ')]~|\n');
        } else if (maxHei) {
            parent.directChildConstraints.push('V:|~[' + this.id + '(==' + this.height + ',<=' + maxHeight + ')]~|\n');
        } else if (minHei) {
            parent.directChildConstraints.push('V:|~[' + this.id + '(==' + this.height + ',>=' + minHeight + ')]~|\n');
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

        if (maxWid && minWid) {
            vfl.append('H:[' + this.id + '(==' + this.width + ',<=' + maxWidth + ',>=' + minWidth + ')]\n');
        } else if (!maxWid && !minWid) {
            vfl.append('H:[' + this.id + '(==' + this.width + ')]\n');
        } else if (maxWid) {
            vfl.append('H:[' + this.id + '(==' + this.width + ',<=' + maxWidth + ')]\n');
        } else if (minWid) {
            vfl.append('H:[' + this.id + '(==' + this.width + ',>=' + minWidth + ')]\n');
        }
    } else {
        if (this.width === sizes.WRAP_CONTENT) {
            let w = parseInt(this.wrapWidth);
            if (!isNaN(w)) {
                if (maxWid && minWid) {
                    vfl.append('H:[' + this.id + '(==' + w + ',<=' + maxWidth + ',>=' + minWidth + ')]\n');
                } else if (!maxWid && !minWid) {
                    vfl.append('H:[' + this.id + '(==' + w + ')]\n');
                } else if (maxWid) {
                    vfl.append('H:[' + this.id + '(==' + w + ',<=' + maxWidth + ')]\n');
                } else if (minWid) {
                    vfl.append('H:[' + this.id + '(==' + w + ',>=' + minWidth + ')]\n');
                }
            } else {
                throw 'Please implement wrap_content functionality for (' + this.constructor.name + ") , width of `" + this.id + "` set to wrap_content";
            }
        } else if (isNaN(pw)) {
            if (maxWid && minWid) {
                vfl.append('H:[' + this.id + '(' + this.width + ',<=' + maxWidth + ',>=' + minWidth + ')]\n');
            } else if (!maxWid && !minWid) {
                vfl.append('H:[' + this.id + '(' + this.width + ')]\n');
            } else if (maxWid) {
                vfl.append('H:[' + this.id + '(' + this.width + ',<=' + maxWidth + ')]\n');
            } else if (minWid) {
                vfl.append('H:[' + this.id + '(' + this.width + ',>=' + minWidth + ')]\n');
            }
        } else {
            if (maxWid && minWid) {
                vfl.append('H:[' + this.id + '(==' + pw + ',<=' + maxWidth + ',>=' + minWidth + ')]\n');
            } else if (!maxWid && !minWid) {
                vfl.append('H:[' + this.id + '(==' + pw + ')]\n');
            } else if (maxWid) {
                vfl.append('H:[' + this.id + '(==' + pw + ',<=' + maxWidth + ')]\n');
            } else if (minWid) {
                vfl.append('H:[' + this.id + '(==' + pw + ',>=' + minWidth + ')]\n');
            }
        }
    }


    if (isHeiPct === true) {
        if (maxHei && minHei) {
            vfl.append('V:[' + this.id + '(==' + this.height + ',<=' + maxHeight + ',>=' + minHeight + ')]\n');
        } else if (!maxHei && !minHei) {
            vfl.append('V:[' + this.id + '(==' + this.height + ')]\n');
        } else if (maxHei) {
            vfl.append('V:[' + this.id + '(==' + this.height + ',<=' + maxHeight + ')]\n');
        } else if (minHei) {
            vfl.append('V:[' + this.id + '(==' + this.height + ',>=' + minHeight + ')]\n');
        }
    } else {
        if (this.height === sizes.WRAP_CONTENT) {
            let h = parseInt(this.wrapHeight);
            if (!isNaN(h)) {
                if (maxHei && minHei) {
                    vfl.append('V:[' + this.id + '(==' + h + ',<=' + maxHeight + ',>=' + minHeight + ')]\n');
                } else if (!maxHei && !minHei) {
                    vfl.append('V:[' + this.id + '(==' + h + ')]\n');
                } else if (maxHei) {
                    vfl.append('V:[' + this.id + '(==' + h + ',<=' + maxHeight + ')]\n');
                } else if (minHei) {
                    vfl.append('V:[' + this.id + '(==' + h + ',>=' + minHeight + ')]\n');
                }
            } else {
                throw 'Please implement wrap_content functionality for (' + this.constructor.name + ") , height of `" + this.id + "` set to wrap_content";
            }
        } else if (isNaN(ph)) {
            if (maxHei && minHei) {
                vfl.append('V:[' + this.id + '(' + this.height + ',<=' + maxHeight + ',>=' + minHeight + ')]\n');
            } else if (!maxHei && !minHei) {
                vfl.append('V:[' + this.id + '(' + this.height + ')]\n');
            } else if (maxHei) {
                vfl.append('V:[' + this.id + '(' + this.height + ',<=' + maxHeight + ')]\n');
            } else if (minHei) {
                vfl.append('V:[' + this.id + '(' + this.height + ',>=' + minHeight + ')]\n');
            }
        } else {
            if (maxHei && minHei) {
                vfl.append('V:[' + this.id + '(==' + ph + ',<=' + maxHeight + ',>=' + minHeight + ')]\n');
            } else if (!maxHei && !minHei) {
                vfl.append('V:[' + this.id + '(==' + ph + ')]\n');
            } else if (maxHei) {
                vfl.append('V:[' + this.id + '(==' + ph + ',<=' + maxHeight + ')]\n');
            } else if (minHei) {
                vfl.append('V:[' + this.id + '(==' + ph + ',>=' + minHeight + ')]\n');
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
        return isNaN(p) ? "+0.0" : (p >= 0 ? "+" + p : "" + p);
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

ImageButton.prototype = Object.create(View.prototype);
ImageButton.prototype.constructor = ImageButton;




NativeTable.prototype = Object.create(View.prototype);
NativeTable.prototype.constructor = NativeTable;


CustomTableView.prototype = Object.create(View.prototype);
CustomTableView.prototype.constructor = CustomTableView;


InputTableView.prototype = Object.create(CustomTableView.prototype);
InputTableView.prototype.constructor = InputTableView;


GrowableTableView.prototype = Object.create(InputTableView.prototype);
GrowableTableView.prototype.constructor = GrowableTableView;


SearchableTableView.prototype = Object.create(GrowableTableView.prototype);
SearchableTableView.prototype.constructor = SearchableTableView;


TextField.prototype = Object.create(View.prototype);
TextField.prototype.constructor = TextField;


TextArea.prototype = Object.create(View.prototype);
TextArea.prototype.constructor = TextArea;


DropDown.prototype = Object.create(View.prototype);
DropDown.prototype.constructor = DropDown;


NativeList.prototype = Object.create(View.prototype);
NativeList.prototype.constructor = NativeList;


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

VideoView.prototype = Object.create(View.prototype);
VideoView.prototype.constructor = VideoView;

AudioView.prototype = Object.create(View.prototype);
AudioView.prototype.constructor = AudioView;



/**
 * @param {Workspace} wkspc 
 * @param {type} node key-value object
 * @returns {CheckBox}
 */
function CheckBox(wkspc, node) {
    View.call(this, wkspc, node);
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
 * @param {Workspace} wkspc 
 * @param {type} node key-value object
 * @returns {undefined}
 */
function Button(wkspc, node) {
    View.call(this, wkspc, node);
}

Button.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('input');
    this.htmlElement.type = 'button';
    this.style.addStyleElementCss('text-align: center;');

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
 * @param {Workspace} wkspc 
 * @param {type} node key-value object
 * @returns {undefined}
 */
function ImageButton(wkspc, node) {
    View.call(this, wkspc, node);
}

ImageButton.prototype.createElement = function (node) {
    
    this.htmlElement = document.createElement('input');
    this.htmlElement.type = 'button';
    
    
    
    this.style.addStyleElementCss('border: 0;');
    this.style.addStyleElementCss('background-repeat: no-repeat;');
    this.style.addStyleElementCss('background-position: center;');
    this.style.addStyleElementCss('background-size: contain;');
    this.style.addStyleElementCss('background-origin: content-box;');
    this.style.addStyleElementCss('background-image: url(\''+PATH_TO_IMAGES + node.getAttribute(attrKeys.src)+'\');');


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

ImageButton.prototype.calculateWrapContentSizes = function (node) {
    //bold 12pt arial;
    this.getWrapSize(this.htmlElement.value);
};


/**
 * @param {Workspace} wkspc 
 * @param {type} node key-value object
 * @returns {undefined}
 */
function NativeTable(wkspc, node) {
    View.call(this, wkspc, node);
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


    if (!attributeNotEmpty(hasHeader)) {
        hasHeader = false;
    }
    if (!attributeNotEmpty(hasFooter)) {
        hasFooter = false;
    }

    if (attributeNotEmpty(entries)) {
        let array;
        try {
            array = JSON.parse(entries);
            validateTableJson(array);
        } catch (e) {
            throw new Error('Invalid table json! JSON should be a 2D array of table rows');
        }

        let tableSize = array.length;
        for (var i = 0; i < tableSize; i++) {
            let tr = document.createElement('tr');
            for (var j = 0; j < array[i].length; j++) {
                let td = document.createElement('td');
                td.innerHTML = array[i][j];
                tr.appendChild(td);
            }
            if (tableSize === 1) {
                tbody.appendChild(tr);
                break;
            } else if (tableSize === 2) {
                if (i === 0) {
                    if (hasHeader) {
                        thead.appendChild(tr);
                    } else {
                        tbody.appendChild(tr);
                    }
                } else if (i === array.length - 1) {
                    if (hasFooter) {
                        tfoot.appendChild(tr);
                    } else {
                        tbody.appendChild(tr);
                    }
                }
            } else if (tableSize > 2) {
                if (i === 0) {
                    if (hasHeader) {
                        thead.appendChild(tr);
                    } else {
                        tbody.appendChild(tr);
                    }
                } else if (i === array.length - 1) {
                    if (hasFooter) {
                        tfoot.appendChild(tr);
                    } else {
                        tbody.appendChild(tr);
                    }
                } else {
                    tbody.appendChild(tr);
                }
            }



        }

        this.htmlElement.appendChild(tbody);
        if (hasHeader) {
            this.htmlElement.appendChild(thead);
        }
        if (hasFooter) {
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
 * @param {Workspace} wkspc
 * @param {type} node
 * @returns {CustomTableView}
 */
function CustomTableView(wkspc, node) {
    this.options = {};
    this.customTable = null;
    View.call(this, wkspc, node);
}




CustomTableView.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('div');
    this.assignId();

    let hasCaption = node.getAttribute(attrKeys.hasCaption);
    let caption = node.getAttribute(attrKeys.caption);
    let scrollHeight = node.getAttribute(attrKeys.scrollHeight);
    let withNumbering = node.getAttribute(attrKeys.withNumbering);
    let hasContainer = node.getAttribute(attrKeys.hasContainer);

    let hasFooter = node.getAttribute(attrKeys.hasFooter);

    let entries = node.getAttribute(attrKeys.tableItems);
    let data = [];
    let title = node.getAttribute(attrKeys.title);
    let showBorders = node.getAttribute(attrKeys.showBorders);
    let pagingEnabled = node.getAttribute(attrKeys.pagingEnabled);
    let icon = PATH_TO_IMAGES + node.getAttribute(attrKeys.src);
    let cellPadding = node.getAttribute(attrKeys.cellPadding);
    let headerPadding = node.getAttribute(attrKeys.headerPadding);
    let fontSize = node.getAttribute(attrKeys.fontSize);
    let cssClass = node.getAttribute(attrKeys.cssClass);
    let theme = node.getAttribute(attrKeys.tableTheme);
    let scrollable = node.getAttribute(attrKeys.scrollable);
    let footertext = node.getAttribute(attrKeys.footerText);



    if (attributeNotEmpty(hasCaption)) {
        hasCaption = hasCaption === 'true';
    } else {
        hasCaption = false;
    }
    if (attributeEmpty(caption)) {
        caption = '';
    }

    if (attributeEmpty(scrollHeight)) {
        scrollHeight = '120px';
    }
    if (attributeNotEmpty(withNumbering)) {
        withNumbering = withNumbering === 'true';
    } else {
        withNumbering = false;
    }

    if (attributeNotEmpty(hasContainer)) {
        hasContainer = hasContainer === 'true';
    } else {
        hasContainer = true;
    }

    if (attributeNotEmpty(hasFooter)) {
        hasFooter = hasFooter === 'true';
    } else {
        hasFooter = false;
    }


    if (attributeNotEmpty(showBorders)) {
        showBorders = showBorders === 'true';
    } else {
        showBorders = true;
    }


    if (attributeNotEmpty(pagingEnabled)) {
        pagingEnabled = pagingEnabled === 'true';
    } else {
        pagingEnabled = false;//set to true to enable paging by default
    }

    if (attributeNotEmpty(scrollable)) {
        scrollable = scrollable === 'true';
    } else {
        scrollable = true;
    }

    if (attributeNotEmpty(entries)) {
        try {
            data = JSON.parse(entries);
            validateTableJson(data);
        } catch (e) {
            throw new Error('Invalid table json! JSON should be a 2D array of table rows');
        }
    } else {
        data = [];
    }


    if (attributeEmpty(title)) {
        title = 'Set Title';
    }


    if (attributeEmpty(icon)) {
        icon = "";
    }

    if (attributeEmpty(cellPadding)) {
        cellPadding = "1.3em";
    }

    if (attributeEmpty(headerPadding)) {
        headerPadding = "4px";
    }

    if (attributeEmpty(fontSize)) {
        fontSize = "1.0em";
    }

    if (attributeEmpty(cssClass)) {
        cssClass = "";
    }

    if (attributeEmpty(theme)) {
        theme = "#444444";
    }

    if (attributeEmpty(footertext)) {
        footertext = "FOOTER TEXT GOES HERE";
    }


    this.options = {
        id: this.htmlElement.id + '_core',
        hasCaption: hasCaption,
        hasContainer: hasContainer,
        caption: caption,
        scrollHeight: scrollHeight,
        withNumbering: withNumbering,
        width: "100%",
        hasFooter: hasFooter,
        showBorders: showBorders,
        pagingEnabled: pagingEnabled,
        icon: icon,
        fontSize: fontSize,
        cellpadding: cellPadding,
        headerPadding: headerPadding,
        title: title,
        footerText: footertext,
        scrollable: scrollable,
        theme: theme,
        data: [data.shift()]
    };
    this.options.bodyData = data;//save the data after removing the headers
    if (cssClass && cssClass !== "") {
        this.options.classname = cssClass;
    }
    this.customTable = new Table(this.options);
    this.customTable.build(this.htmlElement);



};

CustomTableView.prototype.calculateWrapContentSizes = function (node) {
    this.wrapWidth = 350;
    this.wrapHeight = 300;
};

CustomTableView.prototype.runView = function () {
    this.customTable.loadTable(this.options.bodyData);
};
/**
 * 
 * @param {Workspace} wkspc
 * @param {type} node
 * @returns {InputTableView}
 */
function InputTableView(wkspc, node) {
    CustomTableView.call(this, wkspc, node);
}

InputTableView.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('div');
    this.assignId();

    let hasCaption = node.getAttribute(attrKeys.hasCaption);
    let caption = node.getAttribute(attrKeys.caption);
    let scrollHeight = node.getAttribute(attrKeys.scrollHeight);
    let withNumbering = node.getAttribute(attrKeys.withNumbering);
    let hasContainer = node.getAttribute(attrKeys.hasContainer);

    let hasFooter = node.getAttribute(attrKeys.hasFooter);

    let entries = node.getAttribute(attrKeys.tableItems);
    let data = [];
    let title = node.getAttribute(attrKeys.title);
    let showBorders = node.getAttribute(attrKeys.showBorders);
    let pagingEnabled = node.getAttribute(attrKeys.pagingEnabled);
    let icon = PATH_TO_IMAGES + node.getAttribute(attrKeys.src);
    let cellPadding = node.getAttribute(attrKeys.cellPadding);
    let headerPadding = node.getAttribute(attrKeys.headerPadding);
    let fontSize = node.getAttribute(attrKeys.fontSize);
    let cssClass = node.getAttribute(attrKeys.cssClass);
    let theme = node.getAttribute(attrKeys.tableTheme);
    let scrollable = node.getAttribute(attrKeys.scrollable);
    let footertext = node.getAttribute(attrKeys.footerText);

    let actionColumns = node.getAttribute(attrKeys.actionColumns);
    let checkableColumns = node.getAttribute(attrKeys.checkableColumns);
    let textColumns = node.getAttribute(attrKeys.textColumns);
    let selectColumns = node.getAttribute(attrKeys.selectColumns);


    if (attributeNotEmpty(hasCaption)) {
        hasCaption = hasCaption === 'true';
    } else {
        hasCaption = false;
    }
    if (attributeEmpty(caption)) {
        caption = '';
    }

    if (attributeEmpty(scrollHeight)) {
        scrollHeight = '120px';
    }
    if (attributeNotEmpty(withNumbering)) {
        withNumbering = withNumbering === 'true';
    } else {
        withNumbering = false;
    }

    if (attributeNotEmpty(hasContainer)) {
        hasContainer = hasContainer === 'true';
    } else {
        hasContainer = true;
    }

    if (attributeNotEmpty(hasFooter)) {
        hasFooter = hasFooter === 'true';
    } else {
        hasFooter = false;
    }


    if (attributeNotEmpty(showBorders)) {
        showBorders = showBorders === 'true';
    } else {
        showBorders = true;
    }


    if (attributeNotEmpty(pagingEnabled)) {
        pagingEnabled = pagingEnabled === 'true';
    } else {
        pagingEnabled = false;//set to true to enable paging by default
    }

    if (attributeNotEmpty(scrollable)) {
        scrollable = scrollable === 'true';
    } else {
        scrollable = true;
    }

    if (attributeNotEmpty(entries)) {
        try {
            data = JSON.parse(entries);
            validateTableJson(data);
        } catch (e) {
            throw new Error('Invalid table json! JSON should be a 2D array of table rows');
        }
    } else {
        data = [];
    }


    if (attributeEmpty(title)) {
        title = 'Set Title';
    }


    if (attributeEmpty(icon)) {
        icon = "";
    }

    if (attributeEmpty(cellPadding)) {
        cellPadding = "1.3em";
    }

    if (attributeEmpty(headerPadding)) {
        headerPadding = "4px";
    }

    if (attributeEmpty(fontSize)) {
        fontSize = "1.0em";
    }

    if (attributeEmpty(cssClass)) {
        cssClass = "";
    }

    if (attributeEmpty(theme)) {
        theme = "#444444";
    }

    if (attributeEmpty(footertext)) {
        footertext = "FOOTER TEXT GOES HERE";
    }
    if (attributeEmpty(actionColumns)) {
        actionColumns = [];
    } else {
        actionColumns = JSON.parse(actionColumns);
    }
    if (attributeEmpty(checkableColumns)) {
        checkableColumns = [];
    } else {
        checkableColumns = JSON.parse(checkableColumns);
    }
    if (attributeEmpty(textColumns)) {
        textColumns = [];
    } else {
        textColumns = JSON.parse(textColumns);
    }
    if (attributeEmpty(selectColumns)) {
        selectColumns = [];
    } else {
        selectColumns = JSON.parse(selectColumns);
    }



    this.options = {
        id: this.htmlElement.id + '_core',
        hasCaption: hasCaption,
        hasContainer: hasContainer,
        caption: caption,
        scrollHeight: scrollHeight,
        withNumbering: withNumbering,

        width: "100%",
        hasFooter: hasFooter,
        showBorders: showBorders,
        pagingEnabled: pagingEnabled,
        onAddBtnClicked: function () {},
        'main-style': {
            'margin-top': '1.2em'
        },
        icon: icon,
        fontSize: fontSize,
        cellpadding: cellPadding,
        headerPadding: headerPadding,
        title: title,
        footerText: footertext,
        scrollable: scrollable,
        theme: theme,
        data: [data.shift()],
        checkablecolumns: checkableColumns,
        actioncolumns: actionColumns,
        textcolumns: textColumns,
        selectcolumns: selectColumns
    };
    this.options.bodyData = data;//save the data after removing the headers
    if (cssClass && cssClass !== "") {
        this.options.classname = cssClass;
    }
    this.customTable = new InputTable(this.options);
    this.customTable.build(this.htmlElement);

};

/**
 * 
 @param {Workspace} wkspc
 * @param {type} node
 * @returns {GrowableTableView}
 */
function GrowableTableView(wkspc, node) {
    InputTableView.call(this, wkspc, node);
}


GrowableTableView.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('div');
    this.assignId();

    let hasCaption = node.getAttribute(attrKeys.hasCaption);
    let caption = node.getAttribute(attrKeys.caption);
    let scrollHeight = node.getAttribute(attrKeys.scrollHeight);
    let withNumbering = node.getAttribute(attrKeys.withNumbering);
    let hasContainer = node.getAttribute(attrKeys.hasContainer);

    let hasFooter = node.getAttribute(attrKeys.hasFooter);

    let entries = node.getAttribute(attrKeys.tableItems);
    let data = [];
    let title = node.getAttribute(attrKeys.title);
    let showBorders = node.getAttribute(attrKeys.showBorders);
    let pagingEnabled = node.getAttribute(attrKeys.pagingEnabled);
    let icon = PATH_TO_IMAGES + node.getAttribute(attrKeys.src);
    let cellPadding = node.getAttribute(attrKeys.cellPadding);
    let headerPadding = node.getAttribute(attrKeys.headerPadding);
    let fontSize = node.getAttribute(attrKeys.fontSize);
    let cssClass = node.getAttribute(attrKeys.cssClass);
    let theme = node.getAttribute(attrKeys.tableTheme);
    let scrollable = node.getAttribute(attrKeys.scrollable);
    let buttonText = node.getAttribute(attrKeys.buttonText);
    let footertext = node.getAttribute(attrKeys.footerText);
    let actionColumns = node.getAttribute(attrKeys.actionColumns);
    let checkableColumns = node.getAttribute(attrKeys.checkableColumns);
    let textColumns = node.getAttribute(attrKeys.textColumns);
    let selectColumns = node.getAttribute(attrKeys.selectColumns);


    if (attributeNotEmpty(hasCaption)) {
        hasCaption = hasCaption === 'true';
    } else {
        hasCaption = false;
    }
    if (attributeEmpty(caption)) {
        caption = '';
    }

    if (attributeEmpty(scrollHeight)) {
        scrollHeight = '120px';
    }
    if (attributeNotEmpty(withNumbering)) {
        withNumbering = withNumbering === 'true';
    } else {
        withNumbering = false;
    }

    if (attributeNotEmpty(hasContainer)) {
        hasContainer = hasContainer === 'true';
    } else {
        hasContainer = true;
    }

    if (attributeNotEmpty(hasFooter)) {
        hasFooter = hasFooter === 'true';
    } else {
        hasFooter = false;
    }


    if (attributeNotEmpty(showBorders)) {
        showBorders = showBorders === 'true';
    } else {
        showBorders = true;
    }


    if (attributeNotEmpty(pagingEnabled)) {
        pagingEnabled = pagingEnabled === 'true';
    } else {
        pagingEnabled = false;//set to true to enable paging by default
    }

    if (attributeNotEmpty(scrollable)) {
        scrollable = scrollable === 'true';
    } else {
        scrollable = true;
    }

    if (attributeNotEmpty(entries)) {
        try {
            data = JSON.parse(entries);
            validateTableJson(data);
        } catch (e) {
            throw new Error('Invalid table json! JSON should be a 2D array of table rows');
        }
    } else {
        data = [];
    }


    if (attributeEmpty(title)) {
        title = 'Set Title';
    }


    if (attributeEmpty(icon)) {
        icon = "";
    }

    if (attributeEmpty(cellPadding)) {
        cellPadding = '4px';
    }

    if (attributeEmpty(headerPadding)) {
        headerPadding = "4px";
    }

    if (attributeEmpty(fontSize)) {
        fontSize = "1.0em";
    }

    if (attributeEmpty(cssClass)) {
        cssClass = "";
    }

    if (attributeEmpty(theme)) {
        theme = "#444444";
    }

    if (attributeEmpty(footertext)) {
        footertext = "FOOTER TEXT GOES HERE";
    }

    if (attributeEmpty(buttonText)) {
        buttonText = "Button";
    }
    if (attributeEmpty(actionColumns)) {
        actionColumns = [];
    } else {
        actionColumns = JSON.parse(actionColumns);
    }
    if (attributeEmpty(checkableColumns)) {
        checkableColumns = [];
    } else {
        checkableColumns = JSON.parse(checkableColumns);
    }
    if (attributeEmpty(textColumns)) {
        textColumns = [];
    } else {
        textColumns = JSON.parse(textColumns);
    }
    if (attributeEmpty(selectColumns)) {
        selectColumns = [];
    } else {
        selectColumns = JSON.parse(selectColumns);
    }


    this.options = {
        id: this.htmlElement.id + '_core',
        hasCaption: hasCaption,
        hasContainer: hasContainer,
        caption: caption,
        scrollHeight: scrollHeight,
        withNumbering: withNumbering,

        width: "100%",
        hasFooter: hasFooter,
        showBorders: showBorders,
        pagingEnabled: pagingEnabled,
        onAddBtnClicked: function () {},
        'main-style': {
            'margin-top': '1.2em'
        },
        icon: icon,
        fontSize: fontSize,
        cellpadding: cellPadding,
        headerPadding: headerPadding,
        title: title,
        footerText: footertext,
        scrollable: scrollable,
        theme: theme,
        buttonText: buttonText,
        data: [data.shift()],
        checkablecolumns: checkableColumns,
        actioncolumns: actionColumns,
        textcolumns: textColumns,
        selectcolumns: selectColumns
    };

    this.options.bodyData = data;//save the data after removing the headers
    if (cssClass && cssClass !== "") {
        this.options.classname = cssClass;
    }
    this.customTable = new GrowableTable(this.options);
    this.customTable.build(this.htmlElement);


};

/**
 * 
 * @param {Workspace} wkspc
 * @param {type} node
 * @returns {SearchableTableView}
 */
function SearchableTableView(wkspc, node) {
    GrowableTableView.call(this, wkspc, node);
}

SearchableTableView.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('div');
    this.assignId();


    let hasCaption = node.getAttribute(attrKeys.hasCaption);
    let caption = node.getAttribute(attrKeys.caption);
    let scrollHeight = node.getAttribute(attrKeys.scrollHeight);
    let withNumbering = node.getAttribute(attrKeys.withNumbering);
    let hasContainer = node.getAttribute(attrKeys.hasContainer);

    let entries = node.getAttribute(attrKeys.tableItems);
    let hasFooter = node.getAttribute(attrKeys.hasFooter);

    let data = [];
    let title = node.getAttribute(attrKeys.title);
    let showBorders = node.getAttribute(attrKeys.showBorders);
    let pagingEnabled = node.getAttribute(attrKeys.pagingEnabled);
    let icon = PATH_TO_IMAGES + node.getAttribute(attrKeys.src);
    let cellPadding = node.getAttribute(attrKeys.cellPadding);
    let headerPadding = node.getAttribute(attrKeys.headerPadding);
    let fontSize = node.getAttribute(attrKeys.fontSize);
    let cssClass = node.getAttribute(attrKeys.cssClass);
    let theme = node.getAttribute(attrKeys.tableTheme);
    let scrollable = node.getAttribute(attrKeys.scrollable);
    let footertext = node.getAttribute(attrKeys.footerText);
    let buttonText = node.getAttribute(attrKeys.buttonText);
    let showLeftBtn = node.getAttribute(attrKeys.showLeftBtn);
    let actionColumns = node.getAttribute(attrKeys.actionColumns);
    let checkableColumns = node.getAttribute(attrKeys.checkableColumns);
    let textColumns = node.getAttribute(attrKeys.textColumns);
    let selectColumns = node.getAttribute(attrKeys.selectColumns);




    if (attributeNotEmpty(hasFooter)) {
        hasFooter = hasFooter === 'true';
    } else {
        hasFooter = false;
    }


    if (attributeNotEmpty(showBorders)) {
        showBorders = showBorders === 'true';
    } else {
        showBorders = true;
    }

    if (attributeNotEmpty(showLeftBtn)) {
        showLeftBtn = showLeftBtn === 'true';
    } else {
        showLeftBtn = true;
    }
    if (attributeNotEmpty(hasCaption)) {
        hasCaption = hasCaption === 'true';
    } else {
        hasCaption = attributeNotEmpty(caption);
    }

    if (attributeNotEmpty(hasContainer)) {
        hasContainer = hasContainer === 'true';
    } else {
        hasContainer = true;
    }

    if (attributeNotEmpty(withNumbering)) {
        withNumbering = withNumbering === 'true';
    } else {
        withNumbering = false;
    }

    if (attributeEmpty(scrollHeight)) {
        scrollHeight = '120px';
    }
    if (attributeNotEmpty(pagingEnabled)) {
        pagingEnabled = pagingEnabled === 'true';
    } else {
        pagingEnabled = false;//set to true to enable paging by default
    }

    if (attributeNotEmpty(scrollable)) {
        scrollable = scrollable === 'true';
    } else {
        scrollable = true;
    }

    if (attributeNotEmpty(entries)) {
        try {
            data = JSON.parse(entries);
            validateTableJson(data);
        } catch (e) {
            throw new Error('Invalid table json! JSON should be a 2D array of table rows...' + e);
        }
    } else {
        data = [];
    }


    if (attributeEmpty(title)) {
        title = 'Set Title';
    }


    if (attributeEmpty(icon)) {
        icon = "";
    }

    if (attributeEmpty(cellPadding)) {
        cellPadding = "4px";
    }

    if (attributeEmpty(headerPadding)) {
        headerPadding = "4px";
    }

    if (attributeEmpty(fontSize)) {
        fontSize = "1.0em";
    }

    if (attributeEmpty(cssClass)) {
        cssClass = "";
    }

    if (attributeEmpty(theme)) {
        theme = "#444444";
    }

    if (attributeEmpty(footertext)) {
        footertext = "FOOTER TEXT GOES HERE";
    }

    if (attributeEmpty(buttonText)) {
        buttonText = "Button";
    }

    if (attributeEmpty(caption)) {
        caption = "";
    }

    if (attributeEmpty(actionColumns)) {
        actionColumns = [];
    } else {
        actionColumns = JSON.parse(actionColumns);
    }
    if (attributeEmpty(checkableColumns)) {
        checkableColumns = [];
    } else {
        checkableColumns = JSON.parse(checkableColumns);
    }
    if (attributeEmpty(textColumns)) {
        textColumns = [];
    } else {
        textColumns = JSON.parse(textColumns);
    }
    if (attributeEmpty(selectColumns)) {
        selectColumns = [];
    } else {
        selectColumns = JSON.parse(selectColumns);
    }

    this.options = {
        id: this.htmlElement.id + '_core',
        hasCaption: hasCaption,
        hasContainer: hasContainer,
        caption: caption,
        scrollHeight: scrollHeight,
        withNumbering: withNumbering,
        width: "100%",
        hasFooter: hasFooter,
        showBorders: showBorders,
        pagingEnabled: pagingEnabled,
        onAddBtnClicked: function () {},
        'main-style': {
            'margin-top': '1.2em'
        },
        icon: icon,
        fontSize: fontSize,
        showLeftBtn: showLeftBtn,
        cellPadding: cellPadding,
        headerPadding: headerPadding,
        title: title,
        footerText: footertext,
        scrollable: scrollable,
        theme: theme,
        buttonText: buttonText,
        data: [data.shift()],//take the first row for rendering on the table.. the headers
        checkablecolumns: checkableColumns,
        actioncolumns: actionColumns,
        textcolumns: textColumns,
        selectcolumns: selectColumns
    };
    
    this.options.bodyData = data;//save the data after removing the headers

    if (cssClass && cssClass !== "") {
        this.options.classname = cssClass;
    }
    this.customTable = new SearchableTable(this.options);
    this.customTable.build(this.htmlElement);
};

SearchableTableView.prototype.calculateWrapContentSizes = function (node) {
    this.wrapWidth = 350;
    this.wrapHeight = 300;
};

/**
 * @param {Workspace} wkspc
 * @param {type} node key-value object
 * @returns {TextField}
 */
function TextField(wkspc, node) {
    View.call(this, wkspc, node);
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
            && type !== 'tel' && type !== 'phone' && type !== 'time' && type !== 'color' && type !== 'url' && type !== 'email') {
        throw 'Unsupported input type---(' + type + ')';
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
 * @param {Workspace} wkspc
 * @param {type} node key-value object
 * @returns {undefined}
 */
function ProgressBar(wkspc, node) {
    this.options = {};
    this.progress = null;
    View.call(this, wkspc, node);
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


ProgressBar.prototype.runView = function () {
    this.progress = new Progress(this.options);
};

/**
 * @param {Workspace} wkspc
 * @param {type} node key-value object
 * @returns {undefined}
 */
function TextArea(wkspc, node) {
    View.call(this, wkspc, node);
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
 * @param {Workspace} wkspc
 * @param {type} node key-value object
 * @returns {undefined}
 */
function DropDown(wkspc, node) {
    View.call(this, wkspc, node);
}


DropDown.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('SELECT');
    let items = node.getAttribute(attrKeys.items);
    items = items.replace(/\n|\r/g, '');//remove new lines
    let regex1 = /(')(\s*)(,)(\s*)(')/g;
    let regex2 = /(")(\s*)(,)(\s*)(")/g;

    items = items.replace(regex1, "','");
    items = items.replace(regex2, '","');



    if (attributeNotEmpty(items)) {
        let data = JSON.parse(items);
        for (var i = 0; i < data.length; i++) {
            this.htmlElement.options[this.htmlElement.options.length] = new Option(data[i], i + "");
        }
    }

    this.assignId();

};
DropDown.prototype.calculateWrapContentSizes = function (node) {

};

DropDown.prototype.editCurrentElement = function (value) {
    this.htmlElement.options[this.htmlElement.selectedIndex].innerText = value;
};

DropDown.prototype.editElement = function (index, value) {
    if (index < this.htmlElement.options.length) {
        this.htmlElement.options[index].innerText = value;
    }
};

/**
 * @param {Workspace} wkspc
 * @param {type} node key-value object
 * @returns {undefined}
 */
function NativeList(wkspc, node) {
    View.call(this, wkspc, node);
}

NativeList.prototype.createElement = function (node) {

    let listType = node.getAttribute(attrKeys.listType);


    if (attributeEmpty(listType)) {
        listType = 'ul';
    }

    this.htmlElement = document.createElement(listType);
    this.style.addStyleElementCss('list-style-position: inside;');
    this.style.addStyleElementCss('overflow: auto;');





    let showBullets = node.getAttribute(attrKeys.showBullets);

    let items = node.getAttribute(attrKeys.items);
    items = items.replace(/\n|\r/g, '');//remove new lines
    let regex1 = /(')(\s*)(,)(\s*)(')/g;
    let regex2 = /(")(\s*)(,)(\s*)(")/g;

    items = items.replace(regex1, "','");
    items = items.replace(regex2, '","');

    if (attributeNotEmpty(items)) {

        let data = JSON.parse(items);
        for (var i = 0; i < data.length; i++) {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(data[i]));
            this.htmlElement.appendChild(li);
        }
    }

    if (attributeNotEmpty(showBullets)) {
        showBullets = showBullets === 'true';
    }
    if (showBullets === false) {
        this.style.addStyleElementCss('list-style-type: none;');
    }


    this.assignId();
    this.calculateWrapContentSizes(node);

};

NativeList.prototype.calculateWrapContentSizes = function (node) {

    let elems = this.htmlElement.getElementsByTagName("li");
    let elemCount = elems.length;


    let minWidth = 0;
    let netHeight = 0;

    for (let i = 0; i < elemCount; i++) {
        let li = elems[i];
        View.prototype.getWrapSize.call(this, li.textContent);
        if (minWidth < this.wrapWidth) {
            minWidth = this.wrapWidth;
        }
        netHeight += this.wrapHeight;

    }

    this.wrapWidth = minWidth;
    this.wrapHeight = netHeight;
};

/**
 * @param {Workspace} wkspc
 * @param {type} node key-value object
 * @returns {undefined}
 */
function Label(wkspc, node) {
    View.call(this, wkspc, node);
}


Label.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('span');
    var text = node.getAttribute(attrKeys.text);
    var value = node.getAttribute(attrKeys.value);
    var fontSz = node.getAttribute(attrKeys.fontSize);



    this.style.addStyleElementCss('display: -webkit-inline-box;');
    this.style.addStyleElementCss('display: -ms-inline-flexbox;');
    this.style.addStyleElementCss('display: inline-flex;');
    this.style.addStyleElementCss('align-items: center;');
    this.style.addStyleElementCss('white-space: nowrap;');


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
 * @param {Workspace} wkspc
 * @param {type} node key-value object
 * @returns {undefined}
 */
function MultiLineLabel(wkspc, node) {
    View.call(this, wkspc, node);
}


MultiLineLabel.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('p');

    this.style.addStyleElementCss('overflow: hidden;');
    this.style.addStyleElementCss('text-overflow: ellipsis;');

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
/**
 * 
 * @param {Workspace} wkspc
 * @param {type} node
 * @returns {CanvasView}
 */
function CanvasView(wkspc, node) {
    View.call(this, wkspc, node);
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
};

CanvasView.prototype.calculateWrapContentSizes = function (node) {
    this.wrapWidth = this.htmlElement.getAttribute('width');
    this.wrapHeight = this.htmlElement.getAttribute('height');
};
/**
 * 
 * @param {Workspace} wkspc
 * @param {type} node
 * @returns {ClockView}
 */
function ClockView(wkspc, node) {
    this.clockOptions = {};
    this.clock = null;
    View.call(this, wkspc, node);

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


ClockView.prototype.runView = function () {
    this.clock = new Clock(this.clockOptions);
    this.clock.run();
};

ClockView.prototype.calculateWrapContentSizes = function (node) {
    this.wrapWidth = 120;
    this.wrapHeight = 120;
};


/**
 * @param {Workspace} wkspc
 * @param {type} node key-value object
 * @returns {undefined}
 */
function RadioGroup(wkspc, node) {
    View.call(this, wkspc, node);
}

RadioGroup.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('div');
    this.assignId();
};
RadioGroup.prototype.calculateWrapContentSizes = function (node) {

};

/**
 * @param {Workspace} wkspc
 * @param {type} node key-value object
 * @returns {undefined}
 */
function Radio(wkspc, node) {
    View.call(this, wkspc, node);
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

/**
 * 
 * @param {Workspace} wkspc
 * @param {type} node
 * @returns {ImageView}
 */
function ImageView(wkspc, node) {
    View.call(this, wkspc, node);
}

ImageView.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('img');
    this.htmlElement.src = PATH_TO_IMAGES + node.getAttribute(attrKeys.src);
    this.htmlElement.alt = node.getAttribute(attrKeys.alt);
    this.assignId();
};

ImageView.prototype.calculateWrapContentSizes = function (node) {

};

/**
 * @param {Workspace} wkspc
 * @param {type} node key-value object
 * @returns {undefined}
 */
function Separator(wkspc, node) {
    View.call(this, wkspc, node);

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
 * @param {Workspace} wkspc
 * @param {type} node key-value object
 * @returns {undefined}
 */
function Guideline(wkspc, node) {
    View.call(this, wkspc, node);
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
        if (isNaN(val = parseInt(guidePct))) {
            throw 'Please specify a floating point number between 0 and 1 to signify 0 - 100% of width';
        }
        val += '%';
    } else if (isNaN(val = parseFloat(guidePct))) {
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

/**
 * 
 * @param {Workspace} wkspc
 * @param {type} node
 * @returns {IncludedView}
 */
function IncludedView(wkspc, node) {
    View.call(this, wkspc, node);

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

    let xmlLayout = wkspc.xmlIncludes.get(layout);

    let mp = new Parser(wkspc, xmlLayout, this.id);

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

/**
 * 
 * @param {type} wkspc
 * @param {type} node
 * @returns {VideoView}
 */
function VideoView(wkspc, node) {
    View.call(this, wkspc, node);
}

VideoView.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('video');

    let id = node.getAttribute(attrKeys.id);
    if (attributeEmpty(id)) {
        throw new Error('`id` must be specified for view!');
    }

    let sources = node.getAttribute(attrKeys.sources);
    let autoplay = node.getAttribute(attrKeys.autoplay);
    let muted = node.getAttribute(attrKeys.muted);
    let controls = node.getAttribute(attrKeys.controls);
    let preload = node.getAttribute(attrKeys.preload);

    if (attributeEmpty(sources)) {
        throw new Error('`sources` must be specified for view!');
    }

    try {
        sources = JSON.parse(sources);
    } catch (e) {
        throw new Error('`sources` must be a valid JSON string');
    }


    if (attributeNotEmpty(autoplay)) {
        autoplay = autoplay === 'true';
    } else {
        autoplay = false;
    }
    if (attributeNotEmpty(muted)) {
        muted = muted === 'true';
    } else {
        muted = false;
    }
    if (attributeNotEmpty(controls)) {
        controls = controls === 'true';
    } else {
        controls = false;
    }
    if (attributeNotEmpty(preload)) {
        preload = preload === 'true';
    } else {
        preload = false;
    }

    if (this.validateSources(sources) === true) {
        for (let i = 0; i < sources.length; i++) {
            let srcData = sources[i];
            let source = document.createElement("source");
            if (srcData.src) {
                source.src = srcData.src;
            }
            if (srcData.type) {
                source.type = srcData.type;
            } else {
                throw new Error('Please specify a media type(e.g. video/mp4 or video/ogg or video/webm) for the given source');
            }
            if (srcData.codecs) {
                source.codecs = srcData.codecs;
            }
            if (this.htmlElement.canPlayType(source.type)) {
                this.htmlElement.appendChild(source);
            }
        }

        if (autoplay) {
            this.htmlElement.autoplay = true;
        }
        if (muted) {
            this.htmlElement.muted = true;
        }
        if (controls) {
            this.htmlElement.controls = true;
        }
        if (preload) {
            this.htmlElement.preload = true;
        }


    } else {
        throw new Error("Video source(s) are invalid!");
    }

    this.htmlElement.id = id;
    this.calculateWrapContentSizes(node);
};

VideoView.prototype.calculateWrapContentSizes = function (node) {
    this.wrapWidth = 300;
    this.wrapHeight = 320;
};

VideoView.prototype.validateSources = function (jsonObj) {
    if (Object.prototype.toString.call(jsonObj) === '[object Array]') {
        for (let i = 0; i < jsonObj.length; i++) {
            let item = jsonObj[i];
            let keys = Object.keys(item);
            for (let j = 0; j < keys.length; j++) {
                if (keys[j] !== 'src' && keys[j] !== 'type' && keys[j] !== 'codecs') {
                    throw new Error("Invalid key found: `" + keys[j] + "`");
                }
            }
        }
        return true;
    }
    return false;
};


/**
 * 
 * @param {type} wkspc
 * @param {type} node
 * @returns {VideoView}
 */
function AudioView(wkspc, node) {
    View.call(this, wkspc, node);
}

AudioView.prototype.createElement = function (node) {
    this.htmlElement = document.createElement('audio');

    let id = node.getAttribute(attrKeys.id);
    if (attributeEmpty(id)) {
        throw new Error('`id` must be specified for view!');
    }

    let sources = node.getAttribute(attrKeys.sources);
    let autoplay = node.getAttribute(attrKeys.autoplay);
    let muted = node.getAttribute(attrKeys.muted);
    let controls = node.getAttribute(attrKeys.controls);
    let preload = node.getAttribute(attrKeys.preload);

    if (attributeEmpty(sources)) {
        throw new Error('`sources` must be specified for view!');
    }

    try {
        sources = JSON.parse(sources);
    } catch (e) {
        throw new Error('`sources` must be a valid JSON string');
    }


    if (attributeNotEmpty(autoplay)) {
        autoplay = autoplay === 'true';
    } else {
        autoplay = false;
    }
    if (attributeNotEmpty(muted)) {
        muted = muted === 'true';
    } else {
        muted = false;
    }
    if (attributeNotEmpty(controls)) {
        controls = controls === 'true';
    } else {
        controls = false;
    }
    if (attributeNotEmpty(preload)) {
        preload = preload === 'true';
    } else {
        preload = false;
    }

    if (this.validateSources(sources) === true) {
        for (let i = 0; i < sources.length; i++) {
            let srcData = sources[i];
            let source = document.createElement("source");
            if (srcData.src) {
                source.src = srcData.src;
            }
            if (srcData.type) {
                source.type = srcData.type;
            }
            if (srcData.codecs) {
                source.codecs = srcData.codecs;
            }

            this.htmlElement.appendChild(source);
        }

        if (autoplay) {
            this.htmlElement.autoplay = true;
        }
        if (muted) {
            this.htmlElement.muted = true;
        }
        if (controls) {
            this.htmlElement.controls = true;
        }
        if (preload) {
            this.htmlElement.preload = true;
        }


    } else {
        throw new Error("Audio source(s) are invalid!");
    }


    this.htmlElement.id = id;
    this.calculateWrapContentSizes(node);
};

AudioView.prototype.validateSources = function (jsonObj) {
    if (Object.prototype.toString.call(jsonObj) === '[object Array]') {
        for (let i = 0; i < jsonObj.length; i++) {
            let item = jsonObj[i];
            let keys = Object.keys(item);
            for (let j = 0; j < keys.length; j++) {
                if (keys[j] !== 'src' && keys[j] !== 'type' && keys[j] !== 'codecs') {
                    throw new Error("Invalid key found: `" + keys[j] + "`");
                }
            }
        }
        return true;
    }
    return false;
};

function is2DArray(arr) {

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
;

function validateTableJson(jsonObj) {
    if (is2DArray(jsonObj)) {

        let colSize = -1;
        //validate row size.
        for (let i = 0; i < jsonObj.length; i++) {
            let obj = jsonObj[i];
            if (colSize === -1) {
                colSize = obj.length;
                continue;
            }

            if (colSize !== obj.length) {
                throw new Error("Table must have same number of columns on all rows!");
            }

        }
        return true;
    } else {
        throw new Error("The table json must be a 2d array!");
    }


}

/**
 * 
 * Processes an html node that represents a generated view and produces reusable duplicates with changed ids.
 * A template view is one which can be reused in a list or other recurring structure
 * @param {Workspace} wkspc
 * @param {HtmlNode} node
 * @returns {undefined}
 */

let indexAllNodes = function (htmlNode) {
    let templateIndex = (TEMPLATE_INDEX += 1);

    if (htmlNode.hasChildNodes()) {
        childNodes = htmlNode.childNodes;
        for (let j = 0; j < childNodes.length; j++) {
            let childNode = childNodes[j];
            if (childNode.nodeName !== '#text' && childNode.nodeName !== '#comment') {
                let childId = childNode.getAttribute(attrKeys.id);
                childNode.setAttribute(attrKeys.id, childId + '_index_' + templateIndex);
                this.createIndexedNodes(childNode);
            }
        }//end for loop
    }



};


function isFontWeight(val) {
    if (val && typeof val === 'string') {
        if (val === 'bold' || val === 'bolder' || val === 'lighter' || val === 'normal' ||
                val === '100' || val === '200' || val === '300' || val === '400' ||
                val === '500' || val === '600' || val === '700' || val === '800' || val === '900') {
            return true;
        }
    }
    return false;
}

function attributeNotEmpty(attrVal) {
    if (attrVal && attrVal.trim().length > 0) {
        return true;
    }
    return false;
}

function attributeEmpty(attrVal) {
    if (!attrVal || attrVal.trim().length === 0) {
        return true;
    }
    return false;
}
