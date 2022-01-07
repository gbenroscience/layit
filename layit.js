/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


let SCRIPTS_BASE = getScriptBaseUrl();

const PATH_TO_LAYOUTS_FOLDER = SCRIPTS_BASE + 'layouts/';
const PATH_TO_COMPILER_SCRIPTS = SCRIPTS_BASE;

document.currentScript = document.currentScript || (function() {
  var scripts = document.getElementsByTagName('script');
  return scripts[scripts.length - 1];
})();



let nativeScripts = [
    SCRIPTS_BASE + 'autolayout.js',
    SCRIPTS_BASE + 'main.js',
    SCRIPTS_BASE + 'compiler-constants.js',
    SCRIPTS_BASE + 'libs/utils/colorutils.js',
    SCRIPTS_BASE + 'libs/utils/constants.js',
    SCRIPTS_BASE + 'libs/utils/stringutils.js',
    SCRIPTS_BASE + 'libs/utils/graphics.js',
    SCRIPTS_BASE + 'libs/compilerui/clock.js',
    SCRIPTS_BASE + 'libs/compilerui/iconbtn.js',
    SCRIPTS_BASE + 'libs/compilerui/iconlabel.js',
    SCRIPTS_BASE + 'libs/compilerui/imagebox.js',
    SCRIPTS_BASE + 'libs/compilerui/list.js',
    SCRIPTS_BASE + 'libs/compilerui/pager.js',
    SCRIPTS_BASE + 'libs/compilerui/popup.js',
    SCRIPTS_BASE + 'libs/compilerui/progress.js',
    SCRIPTS_BASE + 'libs/compilerui/style.js',
    SCRIPTS_BASE + 'libs/compilerui/textwithlines.js',
    SCRIPTS_BASE + 'libs/compilerui/tables/table.js',
    SCRIPTS_BASE + 'libs/compilerui/tables/inputtable.js',
    SCRIPTS_BASE + 'libs/compilerui/tables/growabletable.js',
    SCRIPTS_BASE + 'libs/compilerui/tables/searchabletable.js'

];
/**
 * Stores the views by the html id.
 * @type Map a map of all views
 */
let viewMap = new Map();
let allStyles = [];
/**
 * Store prefetched xml-layouts here
 * @type {Map<any, any>}
 */
let xmlIncludes = new Map();
/**
 * Document all workers here
 * @type {Map<any, any>}
 */
let workersMap = new Map();

let rootCount = 0;
const system_root_id = 'html_main';
const DISABLE_INPUT_SHADOW = true;

const sizes = {
    MATCH_PARENT: 'match_parent',
    WRAP_CONTENT: 'wrap_content'
};


const orientations = {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal'
};


const xmlKeys = {
    imports: "imports",
    rootOpen: "ConstraintLayout",
    viewOpen: "View",
    buttonOpen: "Button",
    fieldOpen: "TextField",
    areaOpen: "TextArea",
    imageViewOpen: "ImageView",
    progressOpen: "ProgressBar",
    checkOpen: "CheckBox",
    radiogroupOpen: "RadioGroup",
    radioOpen: "Radio",
    separatorOpen: "Separator",
    dropDownOpen: "DropDown",
    guideOpen: "Guideline",
    tableOpen: "Table",
    inputTable: "InputTable",
    growableTable: "GrowableTable",
    searchableTable: "SearchableTable",
    customTable: "CustomTable",
    popup: "Popup",
    listOpen: "List",
    labelOpen: "Label",
    multiLabelOpen: "MultiLineLabel",
    clock: "Clock",
    canvasOpen: "Canvas",
    include: "include"
};


const attrKeys = {
    id: "id",
    layout: "layout", //specifies the layout file to use with an include tag
    layout_width: "layout_width",
    layout_height: "layout_height",

    layout_maxWidth: "layout_maxWidth",
    layout_maxHeight: "layout_maxHeight",
    layout_minWidth: "layout_minWidth",
    layout_minHeight: "layout_minHeight",

    width: "width",//on canvas element
    height: "height",//on canvas element
    translationZ: "translationZ", //the z index
    layout_margin: "layout_margin",
    layout_marginStart: "layout_marginStart",
    layout_marginEnd: "layout_marginEnd",
    layout_marginTop: "layout_marginTop",
    layout_marginBottom: "layout_marginBottom",
    layout_marginHorizontal: "layout_marginHorizontal",
    layout_marginVertical: "layout_marginVertical",
    layout_padding: "layout_padding",
    layout_paddingStart: "layout_paddingStart",
    layout_paddingEnd: "layout_paddingEnd",
    layout_paddingTop: "layout_paddingTop",
    layout_paddingBottom: "layout_paddingBottom",
    layout_paddingHorizontal: "layout_paddingHorizontal",
    layout_paddingVertical: "layout_paddingVertical",
    layout_constraintTop_toTopOf: "layout_constraintTop_toTopOf",
    layout_constraintBottom_toBottomOf: "layout_constraintBottom_toBottomOf",
    layout_constraintStart_toStartOf: "layout_constraintStart_toStartOf",
    layout_constraintEnd_toEndOf: "layout_constraintEnd_toEndOf",
    layout_constraintTop_toBottomOf: "layout_constraintTop_toBottomOf",
    layout_constraintStart_toEndOf: "layout_constraintStart_toEndOf",
    layout_constraintEnd_toStartOf: "layout_constraintEnd_toStartOf",
    layout_constraintBottom_toTopOf: "layout_constraintBottom_toTopOf",
    layout_constraintCenterXAlign: "layout_constraintCenterXAlign",
    layout_constraintCenterYAlign: "layout_constraintCenterYAlign",
    layout_constraintGuide_percent: "layout_constraintGuide_percent",
    orientation: "orientation", //
    entries: 'entries', // an array of items to display in a list or a dropdown
    tableItems: 'tableItems', //a 2d array of items to display on a table
    cssClass: "cssClass",
    resize: "resize",

    files: "files",
    src: "src",
    alt: "alt", //image tag
    border: "border", //e.g 1px solid red
    borderRadius: "borderRadius", //e.g 1px solid red
    background: "background",
    backgroundImage: "backgroundImage",
    backgroundColor: "backgroundColor",
    backgroundAttachment: "backgroundAttachment",
    boxShadow: "boxShadow",
    inputType: "inputType", //text or password
    text: "text",
    items: "items",
    textColor: "textColor",
    textSize: "textSize",
    textStyle: "textStyle",
    font: "font",
    fontFamily: "fontFamily",
    fontSize: "fontSize",
    fontWeight: "fontWeight",
    fontStyle: "fontStyle",
    fontStretch: "fontStretch",
    checked: "checked",
    name: "name",
    value: "value",
    placeholder: "placeholder",
    maxLength: 'maxLength',
    rows: 'rows',
    cols: 'cols',
    clockOuterColor: 'clockOuterColor',
    clockMiddleColor: 'clockMiddleColor',
    clockInnerColor: 'clockInnerColor',
    clockTickColor: 'clockTickColor',
    clockSecondsColor: "clockSecondsColor",
    clockMinutesColor: 'clockMinutesColor',
    clockHoursColor: 'clockHoursColor',
    clockCenterSpotWidth: 'clockHoursColor',
    clockOuterCircleAsFractionOfFrameSize: 'clockOuterCircleAsFractionOfFrameSize',
    clockShowBaseText: 'clockShowBaseText',
    description: 'description'

};



/*
 * Sample for recursive parse
 function nodeMarkup( node ){
 if( node.childNodes.length ) {
 var list = '', header = '';
 for( var index = 0; index < node.childNodes.length; index++ ) {
 if( node.childNodes[index].tagName == 'name' ) {
 header = node.childNodes[index].textContent;
 } else {
 list += nodeMarkup( node.childNodes[index] );
 };
 };
 return node.hasAttribute( 'submenu' ) 
 ? '<li>' + header + '<ul>' + list + '</ul></li>'
 : list;
 } else {
 return '<li>' + node.textContent + '</li>';
 };  
 };
 */

function Parser(xml, parentId) {

    this.constraints = [];
    this.html = new StringBuffer('');
    this.parentId = parentId && typeof parentId === "string" && parentId.length > 0 ? parentId : '';//needed for includes.
    this.rootView = null;

    this.styleSheet = document.createElement('style');
    this.styleSheet.setAttribute('type', 'text/css');


   if(!parentId){
       let generalStyle = new Style("*", []);
       generalStyle.addFromOptions({
           'margin': '0',
           'padding': '0',
           'box-sizing': 'border-box',
           '-webkit-box-sizing': 'border-box',
           '-moz-box-sizing': 'border-box'
       });
       injectStyleSheets(this.styleSheet, [generalStyle]);
       allStyles.push(generalStyle);

   }


    /**
     * Set this flag when the parse is done.
     * @type {boolean}
     */
    this.doneParsing = false;
    this.errorOccured = false;
    /**
     * An array of parsers that were born because this Parser encountered includes
     * which needed to be parsed.
     * @type {Parser[]}
     */
    this.childParsers = [];
    this.nodeProcessor(new NodeMaker(xml).rootNode);

}


function NodeMaker(xml) {
    if (xml && typeof xml === "string" && xml.length > 0) {
        let xmlDoc = doXmlParse(xml);
        this.nodes = xmlDoc.getElementsByTagName('*');
        if (this.nodes.length > 0) {
            this.rootNode = this.nodes[0];
        } else {
            this.rootNode = null;
        }
    } else {
        this.rootNode = null;
    }
}


let parseImports = function (scriptsText) {
    scriptsText = scriptsText.trim();

    let scrLen = scriptsText.length;
    if (scrLen === 0) {
        throw new Error('Please remove the empty import tag in xml layout file');
    }
    if (scriptsText.substring(scrLen - 1) !== ";") {
        throw new Error('each js file definition in an import tag must end with a `;`');
    }
    let files = scriptsText.split(';');

    for (let i = 0; i < files.length; i++) {
        let file = files[i].trim();
        let len = file.length;
        if (file.substring(len - 3) === '.js') {
            files[i] = PATH_TO_COMPILER_SCRIPTS + "uiscripts/" + file;
        }

    }
    return files;
};


function getScriptBaseUrl() {

    let scripts = document.getElementsByTagName('script');
    
    for(let i=0;i<scripts.length;i++){
        let script = scripts[i];
        let src = script.src;
        let ender = 'layit.js';
        let fullLen = src.length;
        let endLen = ender.length;
        //check if script.src ends with layit.js
        if(src.indexOf(ender, 0) === fullLen - endLen){
            return src.substring(0 , fullLen - endLen);
        }

    }

    return null;
}

function setContentView(layoutFileName) {

    /**
     * Recursively loads all the scripts natively used by the compiler, so that the user wont be stressed with this.
     * The user only needs load this file(layit.js) on their html page, in order to use this library.
     * @param i
     */
    function loadnative(i) {

        if (typeof i !== 'number') {
            throw new Error('Please supply a number for the load index');
        }
        if (i < nativeScripts.length) {
            let newScript = document.createElement("script");
            newScript.setAttribute('src', nativeScripts[i]);
            let head = document.getElementsByTagName('head')[0];
            head.appendChild(newScript);

            newScript.onload = function () {
                loadnative(i + 1);
            };
        } else {
            console.log('Compiler Scripts Fully Loaded');
            prefetchAllLayouts(layoutFileName, function(){
                console.log('Resetting engine parameters...');
                workersMap.clear();
                viewMap.clear();
                xmlIncludes.clear();
                rootCount = 0;
                allStyles.length = 0;
                layoutCount = 0;
                loadedCount = 0;
                deadEnds = 0;
                rootXml = null;

                console.log('Now loading layout and associated layouts(included layouts)');
            }, function (xml) {
                console.log('Loaded layout and '+(xmlIncludes.size - 1) +' included layouts');
                if (xml.length > 0) {
                    let parser = new Parser(xml, null);
                    console.log('Parsed loaded file!');
                } else {
                    console.log('Awaiting loaded file!');
                }
            })

        }
    }

    loadnative(0);
}

function loadScripts(scripts) {
    for (let i = 0; i < scripts.length; i++) {
        let newScript = document.createElement("script");
        newScript.src = scripts[i];
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(newScript);
    }
}


let layoutCount = 0;
let loadedCount = 0;
let deadEnds = 0;
let rootXml = null;


function prefetchAllLayouts(rootLayout, onPreStart, onload) {

    if (onload.length !== 1) {
        throw new Error('onload must have only one argument.');
    }

    if (onPreStart.length !== 0) {
        throw new Error('onPreStart must have no argument.');
    }

    function findIncludes(xml) {

        let check = attrKeys.layout+'=';

        //change layout[space....]=[space.....] to layout=
        let regex = /(layout)(^|\s*)((?<!=)=(?!=))(^|\s*)/;
        xml = xml.replace(regex, check);
        let open = 0, close = 0, layouts = [];
        if (rootXml === null) {
            onPreStart();
            rootXml = xml;
        }

        while ((open = xml.indexOf(check, open)) !== -1) {
            open = open + check.length + 1;
            close = xml.indexOf("\"", open);
            if (close === -1) {
                close = xml.indexOf("'", open);
            }
            if (close !== -1) {
                let layout = xml.substring(open, close);
                layouts.push(layout);
            }
        }
        layoutCount += layouts.length;
        return layouts;
    }


    startFetchWorker(rootLayout, function (layoutXml) {
        let layouts = findIncludes(layoutXml);
        loadedCount++;
        xmlIncludes.set(rootLayout, layoutXml);
        if (layouts.length === 0) {
            deadEnds++;
            if (layoutCount === loadedCount - 1) {
                console.log("DONE! , layout: " + rootLayout + ", layoutCount: " + layoutCount + ", loadedCount: " + loadedCount, ", deadEnds: ", deadEnds);
                onload(rootXml);
                layoutCount = loadedCount = deadEnds = 0;
                rootXml = null;

                for (let m in workersMap) {
                    for (let i = 0; i < workersMap[m].length; i++) {
                        let worker = workersMap[m][i];
                        let workerName = worker.name;
                        stopFetchWorker(workerName);
                        console.log('closed: ' + workerName);
                    }
                }
            }
        } else {
            for (let i = 0; i < layouts.length; i++) {
                let rawLayoutName = layouts[i];
                let layout = rawLayoutName + '.xml';
                prefetchAllLayouts(layout, onPreStart, onload);
            }
        }
    });


}

function findHtmlViewById(viewId){
    let view = viewMap.get(viewId);
    if(view){
         return view.htmlElement;   
    }
   return null;
}

function findViewById(viewId){
   return viewMap.get(viewId);
}

/**
 *
 * @param {string} xml The xml ui text to parse
 * @return {ActiveXObject, doXmlParse.xmlDoc}
 */
function doXmlParse(xml) {

    let xmlDoc, parser;

    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml, "text/xml");
    } else { // Internet Explorer
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xml);
    }

    return xmlDoc;
}

Parser.prototype.nodeProcessor = function (node) {
    //use node.parentNode to access the parent of this node
    let childNodes = node.childNodes;

    //process it
    let view = null;
    const nodeName = node.nodeName;
    switch (nodeName) {
        case xmlKeys.rootOpen:
            let nodeId = node.getAttribute(attrKeys.id);
            if (!nodeId || nodeId === '') {
                rootCount += 1;
                node.setAttribute('id', 'root_' + rootCount);
            }

            view = new View(node);//view adds to viewMap automatically in constructor

            if (viewMap.size === 1) {//first ConstraintLayout tag in the Parser
                view.topLevel = true;
                this.rootView = view;
            } else {//child ConstraintLayout tags
                if (this.parentId) {//another Parser handling an include in recursion, this Parser will have collected the id of the include tag
                    view.parentId = this.parentId;
                    this.rootView = view;
                }
                let parent = viewMap.get(view.parentId);
                parent.childrenIds.push(view.id);
            }

            break;
        case xmlKeys.include:
            view = new IncludedView(node);


            break;
        case xmlKeys.imports:
            let files = node.getAttribute(attrKeys.files);
            let scripts = parseImports(files);
            loadScripts(scripts);
            break;
        case xmlKeys.viewOpen:
            view = new View(node);
            break;
        case xmlKeys.buttonOpen:
            view = new Button(node);
            break;
        case xmlKeys.imageViewOpen:
            view = new ImageView(node);
            break;
        case xmlKeys.progressOpen:
            view = new ProgressBar(node);
            break;

        case xmlKeys.fieldOpen:
            view = new TextField(node);

            break;
        case xmlKeys.areaOpen:
            view = new TextArea(node);
            break;

        case xmlKeys.checkOpen:
            view = new CheckBox(node);

            break;

        case xmlKeys.radiogroupOpen:
            view = new RadioGroup(node);
            break;

        case xmlKeys.radioOpen:
            view = new Radio(node);
            break;

        case xmlKeys.separatorOpen:
            view = new Separator(node);
            break;

        case xmlKeys.guideOpen:
            view = new Guideline(node);
            break;

        case xmlKeys.tableOpen:
            view = new Table(node);
            break;

        case xmlKeys.listOpen:
            view = new List(node);

            break;

        case xmlKeys.labelOpen:
            view = new Label(node);
            break;

        case xmlKeys.dropDownOpen:
            view = new DropDown(node);
            break;

        case xmlKeys.multiLabelOpen:
            view = new MultiLineLabel(node);
            break;
        case xmlKeys.clock:
            view = new ClockView(node);
            break;
        case xmlKeys.canvasOpen:
            view = new CanvasView(node);
            break;
        default:
            break;
    }

    if (view !== null) {
        this.constraints.push(view.makeVFL());
        allStyles.push(view.style);
    } else {
        if (nodeName !== xmlKeys.imports) {
            this.doneParsing = true;
            this.errorOccured = true;
            throw new Error('This node: `' + nodeName + '` does not map to a valid view!!');
        } else {

        }
    }


    if (node.hasChildNodes()) {
        childNodes = node.childNodes;
        for (let j = 0; j < childNodes.length; j++) {
            let childNode = childNodes[j];
            if (childNode.nodeName !== '#text' && childNode.nodeName !== '#comment') {
                let childId = childNode.getAttribute(attrKeys.id);
                if (view !== null) {
                    if (childNode.nodeName !== xmlKeys.imports) {
                        view.childrenIds.push(childId);//register the child with the parent
                    }
                }
                this.nodeProcessor(childNode);
            }
        }//end for loop

    } else {

    }

    this.doneParsing = true;
    this.errorOccured = false;

    if (view) {
        if (view.topLevel === true) {
            this.buildUI();
        }
    }


};


Parser.prototype.buildUI = function () {


    injectButtonDefaults:{
        let defBtnStyle = new Style("input[type='button']:hover", []);
        defBtnStyle.addStyleElement('cursor', 'pointer');
        allStyles.push(defBtnStyle);
    }

    injectAbsCss:{
        let styleObj = new Style('.abs', []);
        styleObj.addStyleElement('position', 'absolute');
        styleObj.addStyleElement('padding', '0');
        styleObj.addStyleElement('margin', '0');

        allStyles.push(styleObj);
    }

    injectInputShadowRemover:{
        if (DISABLE_INPUT_SHADOW === true) {
            let inputShadowRemoveStyle = new Style('input', []);
            inputShadowRemoveStyle.addStyleElement(' background-image', 'none');
            inputShadowRemoveStyle.addStyleElement('outline', '0');
            //inputShadowRemoveStyle.addStyleElement('box-shadow', 'none');

            allStyles.push(inputShadowRemoveStyle);
        }
    }



    let clocks = [];
    let includes = [];
    let progressBars = [];
    viewMap.forEach(function (view, id) {

        if (view.constructor.name === 'IncludedView') {
            includes.push(view);
        }
        for (let i = 0; i < view.childrenIds.length; i++) {
            let childId = view.childrenIds[i];
            let child = viewMap.get(childId);
            view.htmlElement.appendChild(child.htmlElement);
            if (child.constructor.name === 'ClockView') {
                clocks.push(child);
            }
            if (child.constructor.name === 'ProgressBar') {
                progressBars.push(child);
            }
        }
    });


    this.html = this.rootView.toHTML();
    injectStyleSheets(this.styleSheet, allStyles);

    makeDefaultPositioningDivs:{
        let body = document.body;

        body.id = system_root_id;
        body.style.backgroundColor = 'red';
        body.appendChild(this.rootView.htmlElement);

        // main layout
        autoLayout(undefined, [
            'HV:|-0-[' + system_root_id + ']-0-|'
        ]);

        // layout the root layout on the body
        autoLayout(body, [
            'HV:|-0-[' + this.rootView.htmlElement.id + ']-0-|'
        ]);


        // layout the xml layout with respect to its rootview
        autoLayout(this.rootView.htmlElement, this.constraints);


//layout the includes
        includes.forEach((view) => {
            let rootChild = viewMap.get(view.childrenIds[0]);
            //layout the root of an included layout with respect to its include parent element(which is just a div)
            autoLayout(view.htmlElement, view.directChildConstraints);
            //console.log('id:  ', view.id, '    ', view.directChildConstraints);
            //layout the xml of an included layout with respect to its root
            autoLayout(rootChild.htmlElement, view.constraints);
            //console.log('Generated Child Constraints for ', view.id, view.constraints);
        });

        //////////console.log('Generated Constraints', this.constraints);


        clocks.forEach((child) => {
            child.runClock();
        });

        progressBars.forEach((child) => {
            child.runProgress();
        });


    }

    console.log('UI construction logic done...', viewMap.size);

};


function addClass(element, className) {
    let arr = element.className.split(" ");
    if (arr.indexOf(className) === -1) {
        element.className += " " + className;
    }
}

function startFetchWorker(layoutFileName, onSucc) {

    let worker = new WorkerBot("worker-" + layoutFileName, PATH_TO_COMPILER_SCRIPTS + 'layout-worker.js',
        function (e) {
            let layoutXML = e.data.content;
            if (onSucc.length === 1) {
                onSucc(layoutXML);
            }
        }, function (e) {
            throw e;
        });

    let args = {};
    args.layout = layoutFileName;

    worker.postMessage(args);

    workersMap.set(worker.name, worker);
}

function stopFetchWorkerByLayoutName(layoutFileName) {
    let worker = workersMap.get("worker-" + layoutFileName);
    worker.stop();
    worker = null;
}


function stopFetchWorker(workerName) {
    let worker = workersMap.get(workerName);
    worker.stop();
    worker = null;
}


/**
 *
 * @param name A label given to this Worker
 * @param src THe path to the worker script
 * @param onmessage A function to listen for incoming messages from the Worker's process
 * @param onerror A function to listen for incoming errors from the Worker's process
 * @constructor
 */
function WorkerBot(name, src, onmessage, onerror) {
    this.name = name;
    this.worker = null;
    this.src = src;
    this.onmessage = onmessage;
    this.onerror = onerror;

    if (typeof (Worker) !== "undefined") {
        this.worker = new Worker(src);
        this.worker.name = name;
        this.worker.onmessage = onmessage;
        this.worker.onerror = onerror;
    } else {
        throw new Error("Sorry your browser does not support web-workers");
    }
}


WorkerBot.prototype.postMessage = function (message, transferable) {
    this.worker.postMessage.apply(this.worker, this.postMessage.arguments);
    this.dead = false;
};


WorkerBot.prototype.stop = function () {
    this.worker.terminate();
    this.dead = true;
    this.worker = undefined;
};


WorkerBot.prototype.recreate = function () {
    this.worker = new Worker(this.src);
    this.dead = false;
    this.worker.onmessage = this.onmessage;
    this.worker.onerror = this.onerror;
};



setContentView(document.currentScript.getAttribute('data-launcher'));
console.log(document.currentScript.getAttribute('data-launcher'));