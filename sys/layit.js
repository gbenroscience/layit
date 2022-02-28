/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global PATH_TO_UI_SCRIPTS, xmlKeys, attrKeys, DISABLE_INPUT_SHADOW, PATH_TO_COMPILER_SCRIPTS, ViewController */
/**
 * All workspaces loaded for this page.
 * Each workspace has the ability to parse a root xml layout which may have several included layouts.
 * A workspace will be needed to parse the root layout for the main page. Another workspace may be needed to parse a layout file
 * which is used for a popup view. Another might be used to parse a layout file loaded dynamically with ajax and whose parsed content
 * will be shown on a div or other item.
 * So a page may have several workspaces.
 * 
 * Workspaces accomplish their work using background loaders(using the fetch API and workers) and Parser objects.
 * The key to the workspaces Map is the workspace id, and its value is the workspace itself
 * @type Map
 */

/**
 * When this is specified as the Workspace's system_root_id field,
 * the library will attach the parsed layout to document.body
 * @type String
 */
const BODY_ID = 'html_main';

const SCRIPTS_BASE = getScriptBaseUrl();


const nativeScripts = [
    SCRIPTS_BASE + 'sys/mustache420.js',
    SCRIPTS_BASE + 'sys/resizesensor.js',
    SCRIPTS_BASE + 'sys/autolayout.js',
    SCRIPTS_BASE + 'sys/main.js',
    SCRIPTS_BASE + 'sys/compiler-constants.js',
    SCRIPTS_BASE + 'sys/sdk/viewcontroller.js',
    SCRIPTS_BASE + 'libs/ext/canvas2blob.js',
    SCRIPTS_BASE + 'libs/utils/utils.js',
    SCRIPTS_BASE + 'libs/utils/stringutils.js',
    SCRIPTS_BASE + 'libs/utils/domutils.js',
    SCRIPTS_BASE + 'libs/utils/colorutils.js',
    SCRIPTS_BASE + 'libs/utils/constants.js',
    SCRIPTS_BASE + 'libs/utils/graphicsutils.js',
    SCRIPTS_BASE + 'libs/utils/graphics.js',
    SCRIPTS_BASE + 'libs/ui/clock.js',
    SCRIPTS_BASE + 'libs/ui/iconbtn.js',
    SCRIPTS_BASE + 'libs/ui/iconlabel.js',
    SCRIPTS_BASE + 'libs/ui/imagebox.js',
    SCRIPTS_BASE + 'libs/ui/list.js',
    SCRIPTS_BASE + 'libs/ui/pager.js',
    SCRIPTS_BASE + 'libs/ui/popupview.js',
    SCRIPTS_BASE + 'libs/ui/sidemenu.js',
    SCRIPTS_BASE + 'libs/ui/customsidemenu.js',
    SCRIPTS_BASE + 'libs/ui/progress.js',
    SCRIPTS_BASE + 'libs/ui/style.js',
    SCRIPTS_BASE + 'libs/ui/textwithlines.js',
    SCRIPTS_BASE + 'libs/ui/tables/table.js',
    SCRIPTS_BASE + 'libs/ui/tables/inputtable.js',
    SCRIPTS_BASE + 'libs/ui/tables/growabletable.js',
    SCRIPTS_BASE + 'libs/ui/tables/searchabletable.js'
];



if (!HTMLCanvasElement.prototype.toBlob) {
    console.log("Your browser does not support Canvas.toBlob...loading polyfill!");
    nativeScripts.push(SCRIPTS_BASE + 'libs/ext/canvas2blob.js');
}

let workspaces = new Map();


/**
 * 
 * 
 * This method will help fetch this workspace from the cache if it has been previously created, or create a new one if not.
 * The Workspace options may take 3 or 4 properties:
 * 
 * They do different things so please take note!
 
 {
 layoutName: 'layout.xml',
 bindingElemId: 'id_of_element_layout_will_be_attached_to',
 onComplete: 'A function to run when the layout has been parsed and loaded',
 }
 
 OR 
 
 {
 layoutName: 'layout.xml',
 bindingElemId: 'id_of_element_layout_will_be_attached_to',
 xmlContent: 'You do not wish to load the xml from the supplied layout name. So supply the xml here directly',
 onComplete: 'A function to run when the layout has been parsed and loaded',
 }
 
 
 * If it takes 3, then the args are:
 * 
 * 1. The layout name...e.g test.xml,
 * 2. The html id of the DOM element that the generated html layout
 * will be bound to, and lastly, 
 * 3. A callback function to run when the xml document has been parsed into html.
 * 
 * If it takes 4, then the args are:
 * 
 * 1. The layout name...e.g test.xml, may be a dummy name! It is only required for identifying the xml content supplied
 * 2. The html id of the DOM element that the generated html layout
 * will be bound to
 * 3. The xml content of the specified layout, and lastly, 
 * 4. A callback function to run when the xml document has been parsed into html.
 * 
 * The 4 args property-type options is important because, a user may have generated some xml dynamically and wish to load it on the interface.
 * This dummy content of course has no file representation in the layouts folder. So we need the user to supply a unique file name that we may use to
 * identify this xml.
 * 
 * 
 * 
 * @param {Object} options An object that defines the properties needed to load the workspace
 * @returns {Workspace}
 */
function getWorkspace(options) {

    let rootLayoutName = null;
    if (options.layoutName && typeof options.layoutName === 'string') {
        rootLayoutName = options.layoutName;
    } else {
        throw new Error('Please supply the root layout name! even if you are supplying your xmlcontent directly, specify a dummy layout name for it! we need it to create a unique id for your layout');
    }

    let bindingElemId = BODY_ID;
    if (options.bindingElemId && typeof options.bindingElemId === 'string') {
        bindingElemId = options.bindingElemId;
    }


    let spaceId = bindingElemId + '_' + rootLayoutName;
    let space = workspaces.get(spaceId);
    if (!space) {
        return new Workspace(options);
    }

    let onComplete = function () {};
    if (options.onComplete) {
        if (typeof options.onComplete === 'function') {
            onComplete = options.onComplete;
        } else {
            throw new Error('If you are supplying this callback, then it must be a function!');
        }
    }
    if (onComplete) {
        onComplete();
    }
    return space;
}
/**
 * This function returns true if the supplied param is a number string
 * or a number.
 * For example:
 * isNumber('2') will return true as will isNumber(2).
 * But isNumber('2a') will return false 
 * @param {string|Number} number
 * @returns {Boolean}
 */
let isNumber = function (number) {
    return isNaN(number) === false;
};


document.currentScript = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
})();



/**
 * 
 * Creates a new Workspace.
 * The Workspace options may take a maximum of 4 or 5 properties:
 * 
 * They do different things so please take note!
 
 {
 layoutName: 'layout.xml',
 bindingElemId: 'id_of_element_layout_will_be_attached_to',
 templateData: A JSON object that contains data that can be passed into specified areas of the xml. This allows the lbrary to work with server-side technology.
 onComplete: 'A function to run when the layout has been parsed and loaded',
 }
 
 OR 
 
 {
 layoutName: 'layout.xml',
 bindingElemId: 'id_of_element_layout_will_be_attached_to',
 templateData: A JSON object that contains data that can be passed into specified areas of the xml. This allows the lbrary to work with server-side technology.
 xmlContent: 'You do not wish to load the xml from the supplied layout name. So supply the xml here directly',
 onComplete: 'A function to run when the layout has been parsed and loaded',
 }
 
 
 * If it takes 4, then the args are:
 * 
 * 1. The layout name...e.g test.xml,
 * 2. The html id of the DOM element that the generated html layout
 * will be bound to, and lastly, 
 * 3. A JSON object that contains data that can be passed into the xml layouts using the appropriate syntax
 * 4. A callback function to run when the xml document has been parsed into html.
 * 
 * If it takes 5, then the args are:
 * 
 * 1. The layout name...e.g test.xml, may be a dummy name! It is only required for identifying the xml content supplied
 * 2. The html id of the DOM element that the generated html layout
 * will be bound to
 * 3. A JSON object that contains data that can be passed into the xml layouts using the appropriate syntax
 * 4. The xml content of the specified layout, and lastly, 
 * 5. A callback function to run when the xml document has been parsed into html.
 * 
 * The 4 args property-type options is important because, a user may have generated some xml dynamically and wish to load it on the interface.
 * This dummy content of course has no file representation in the layouts folder. So we need the user to supply a unique file name that we may use to
 * identify this xml.
 * 
 * Basically, the discriminator here is the xmlContent field. Once it exists, the constructor's behaviour changes from trying to load xml from a source,
 * to using the supplied xml string and creating a dummy key for it in the cache.
 * 
 * @param {Object} options An object that defines the properties needed to load the workspace
 * @returns {Workspace}
 */
function Workspace(options) {

    if (!options) {
        throw new Error("Please supply the options to create this workspace");
    }

    this.layoutName = null;
    if (options.layoutName && typeof options.layoutName === 'string') {
        this.layoutName = options.layoutName;
    } else {
        throw new Error('Please supply the root layout name! even if you are supplying your xmlcontent directly, specify a dummy layout name for it! we need it to create a unique id for your layout');
    }


    this.systemRootId = BODY_ID;
    if (options.bindingElemId && typeof options.bindingElemId === 'string') {
        this.systemRootId = options.bindingElemId;
    }

    this.templateData = null;
    if (options.templateData && typeof options.templateData === 'object') {
        this.templateData = options.templateData;
    }

    let xmlContent = null;
    if (options.xmlContent && typeof options.xmlContent === 'string') {
        xmlContent = options.xmlContent;
    }


    this.onComplete = function () {};
    if (options.onComplete) {
        if (typeof options.onComplete === 'function') {
            this.onComplete = options.onComplete;
        } else {
            throw new Error('If you are supplying this callback, then it must be a function!');
        }
    }


    this.id = this.systemRootId + '_' + this.layoutName.replace(".", "_");//This is the workspace id.

    this.viewMap = new Map();
    this.allStyles = [];
    this.xmlIncludes = new Map();
    this.workersMap = new Map();
    this.rootCount = 0;
    this.rootParser = null;
    this.layoutCount = 0;
    this.loadedCount = 0;
    this.deadEnds = 0;
    this.styleSheet = document.createElement('style');
    this.styleSheet.setAttribute('type', 'text/css');
    this.rootXml = null;
    /**
     * The ViewController that can be used with the view.
     */
    this.controller = null;

    workspaces.set(this.id, this);

    if (xmlContent) {
        this.setContentView(this.layoutName, xmlContent);
    } else {
        this.setContentView(this.layoutName);
    }

}


/**
 * @param {Workspace} workspace 
 * @param {type} xml The xml being parsed
 * @param {type} parentId The id of the view that hosts the resultant parsed xml layout, usually applies to included views
 * @returns {Parser}
 */
function Parser(workspace, xml, parentId) {

    if (workspace.templateData) {//RCN: 2015483397
        xml = Mustache.render(xml, workspace.templateData);
    }

    this.constraints = [];
    this.html = new StringBuffer('');
    this.parentId = parentId && typeof parentId === "string" && parentId.length > 0 ? parentId : '';//needed for includes.
    this.rootView = null;


    if (!parentId) {
        let generalStyle = new Style("*", []);
        generalStyle.addFromOptions({
            'margin': '0',
            'padding': '0',
            'box-sizing': 'border-box',
            '-webkit-box-sizing': 'border-box',
            '-moz-box-sizing': 'border-box',
            'overscroll-behavior': 'none'
        });
        injectStyleSheets(workspace.styleSheet, [generalStyle]);
        workspace.allStyles.push(generalStyle);

    }


    /**
     * Set this flag when the parse is done.
     * @type {boolean}
     */
    this.doneParsing = false;
    this.errorOccured = false;
    if (!workspace.rootParser) {
        workspace.rootParser = this;
    }

    this.nodeProcessor(workspace, new NodeMaker(xml).rootNode);

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
    let cleanedFiles = [];


    for (let i = 0; i < files.length; i++) {
        let file = files[i].trim();
        let len = file.length;
        if (file.substring(len - 3) === '.js') {
            cleanedFiles.push(PATH_TO_UI_SCRIPTS + file);
        }
    }
    return cleanedFiles;
};


function getScriptBaseUrl() {

    let scripts = document.getElementsByTagName('script');

    for (let i = 0; i < scripts.length; i++) {
        let script = scripts[i];
        let src = script.src;
        let ender = 'sys/layit.js';
        let fullLen = src.length;
        let endLen = ender.length;

        //check if script.src ends with layit.js
        if (src.lastIndexOf(ender) === fullLen - endLen) {
            return src.substring(0, fullLen - endLen);
        }

    }

    return null;
}
/**
 * The root view is the root of the expanded xml layout, not the view that the layout was attached to!
 * @returns {undefined}
 */
Workspace.prototype.rootView = function () {
    //let id = 'root_html_main_test_xml_1';
    //"root_menu_x_id_side_menux_frame_popup_xml_1"
    return this.viewMap.get('root_' + this.id + "_1");
};

Workspace.prototype.resetLoaderIndices = function () {
    this.layoutCount = this.loadedCount = this.deadEnds = 0;
    this.rootXml = null;
};

Workspace.prototype.resetAllIndices = function () {
    this.workersMap.clear();
    this.viewMap.clear();
    this.xmlIncludes.clear();
    this.rootCount = 0;
    this.allStyles.length = 0;
    this.resetLoaderIndices();
};

Workspace.prototype.setContentView = function (layoutFileName, xmlContent) {


    let self = this;
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
            if (!isScriptLoaded(nativeScripts[i])) {
                let newScript = document.createElement("script");
                newScript.setAttribute('src', nativeScripts[i]);
                let head = document.getElementsByTagName('head')[0];
                head.appendChild(newScript);

                newScript.onload = function () {
                    loadnative(i + 1);
                };
            } else {
                loadnative(i + 1);
            }

        } else {
            console.log('Compiler Scripts Fully Loaded... xmlContent: ', xmlContent);

            self.prefetchAllLayouts(layoutFileName, xmlContent, function () {
                console.log('Resetting engine parameters...');
                self.resetAllIndices();
                console.log('Now loading layout and associated layouts(included layouts)');
            }, function (xml) {
                console.log('Loaded layout and ' + (self.xmlIncludes.size - 1) + ' included layouts');
                if (xml.length > 0) {
                    let parser = new Parser(self, xml, null);
                    console.log('Parsed loaded file!');
                } else {
                    console.log('Awaiting loaded file!');
                }
            });



        }
    }

    loadnative(0);
};

function loadScripts(scripts, onload) {
    if (scripts.length === 0) {
        return;
    }
    if (typeof onload !== 'function') {
        throw new Error('Please supply a function callback for the second argument.');
    }
    function loadAt(i) {
        if (typeof i !== 'number') {
            throw new Error('Please supply a number for the load index');
        }
        if (i < scripts.length) {
            if (!isScriptLoaded(scripts[i])) {
                let newScript = document.createElement("script");
                newScript.setAttribute('src', scripts[i]);
                let head = document.getElementsByTagName('head')[0];
                head.appendChild(newScript);

                newScript.onload = function () {
                    loadAt(i + 1);
                };
            } else {
                loadAt(i + 1);
            }

        } else {
            console.log('User imported scripts fully loaded');
            onload();
        }
    }

    loadAt(0);

}

/**
 * 
 * @param {type} rootLayoutName The name of the layout
 * @param {type} xmlContent The xmlcontent(Optional), if the Workspace constructor specified any xml content
 * @param {type} onPreStart A function to call before loading of any xml files start
 * @param {type} onload The function to call when all layouts including the included ones have been loaded
 * @returns {undefined}
 */
Workspace.prototype.prefetchAllLayouts = function (rootLayoutName, xmlContent, onPreStart, onload) {


    let self = this;

    if (onload.length !== 1) {
        throw new Error('onload must have only one argument.');
    }

    if (onPreStart.length !== 0) {
        throw new Error('onPreStart must have no argument.');
    }

    let callback = function (layoutXml) {
        let layouts = findIncludes(layoutXml);
        self.loadedCount++;
        self.xmlIncludes.set(rootLayoutName, layoutXml);
        if (layouts.length === 0) {
            self.deadEnds++;
            if (self.layoutCount === self.loadedCount - 1) {
                //console.log("DONE! , layout: " + rootLayoutName + ", layoutCount: " + self.layoutCount + ", loadedCount: " + self.loadedCount, ", deadEnds: ", self.deadEnds);
                onload(self.rootXml);
                self.resetLoaderIndices();

                for (let m in self.workersMap) {
                    for (let i = 0; i < self.workersMap[m].length; i++) {
                        let worker = self.workersMap[m][i];
                        let workerName = worker.name;
                        self.stopFetchWorker(workerName);
                        console.log('closed: ' + workerName);
                    }
                }
            }
        } else {
            for (let i = 0; i < layouts.length; i++) {
                let rawLayoutName = layouts[i];
                let layout = rawLayoutName + '.xml';
                self.prefetchAllLayouts(layout, xmlContent, onPreStart, onload);
            }
        }
    };


    function findIncludes(xml) {
        let check = attrKeys.layout + '=';

        //change layout[space....]=[space.....] to layout=
        let regex = /(layout)(^|\s*)((?<!=)=(?!=))(^|\s*)/;
        xml = xml.replace(regex, check);
        let open = 0, close = 0, layouts = [];
        if (self.rootXml === null) {
            onPreStart();
            self.rootXml = xml;
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
        self.layoutCount += layouts.length;
        return layouts;
    }


    if (xmlContent) {
        callback(xmlContent);
    } else {
        this.startFetchWorker(rootLayoutName, callback);
    }



};

Workspace.prototype.findHtmlViewById = function (viewId) {
    let view = this.viewMap.get(viewId);
    if (view) {
        return view.htmlElement;
    }
    return null;
};
/**
 * 
 * @param {string} viewId
 * @returns {View|undefined}
 */
Workspace.prototype.findViewById = function (viewId) {
    return this.viewMap.get(viewId);
};

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

Parser.prototype.nodeProcessor = function (wkspc, node) {
    //use node.parentNode to access the parent of this node
    let childNodes = node.childNodes;

    //process it
    let view = null;
    const nodeName = node.nodeName;
    switch (nodeName) {
        case xmlKeys.root:
            let nodeId = node.getAttribute(attrKeys.id);
            if (!nodeId || nodeId === '') {
                wkspc.rootCount += 1;
                node.setAttribute('id', 'root_' + wkspc.id.replace('.', '_') + '_' + wkspc.rootCount);
            }

            view = new View(wkspc, node);//view adds to viewMap automatically in constructor

            if (wkspc.viewMap.size === 1) {//first ConstraintLayout tag in the Parser
                view.topLevel = true;
                this.rootView = view;
            } else {//child ConstraintLayout tags
                if (this.parentId) {//another Parser handling an include in recursion, this Parser will have collected the id of the include tag
                    view.parentId = this.parentId;
                    this.rootView = view;
                }
                let parent = wkspc.viewMap.get(view.parentId);
                parent.childrenIds.push(view.id);
            }

            break;
        case xmlKeys.include:
            view = new IncludedView(wkspc, node);


            break;

        case xmlKeys.imports:
            if (this === wkspc.rootParser) {
                let files = node.getAttribute(attrKeys.files);
                let scripts = parseImports(files);
                loadScripts(scripts, function () {
                    let controllerName = node.getAttribute(attrKeys.controller);
                    if (typeof controllerName === 'string' && controllerName.length > 0) {
                        let viewController = new window[controllerName](wkspc.id);

                        if (viewController && viewController instanceof ViewController) {
                            wkspc.controller = viewController;
                            wkspc.controller.onCreate(wkspc);
                            if (wkspc.rootParser.doneParsing === true) {
                                wkspc.controller.onViewsAttached(wkspc);
                            }
                        } else {
                            throw new Error("Couldn't initialize ViewController...");
                        }

                    }
                });
            } else {
                console.log(wkspc.rootParser);
                throw new Error('Please insert your imports in the root xml layout(' + wkspc.id + ') alone. ');
            }



            break;
        case xmlKeys.view:
            view = new View(wkspc, node);
            break;
        case xmlKeys.button:
            view = new Button(wkspc, node);
            break;
        case xmlKeys.imageView:
            view = new ImageView(wkspc, node);
            break;
        case xmlKeys.progress:
            view = new ProgressBar(wkspc, node);
            break;

        case xmlKeys.field:
            view = new TextField(wkspc, node);

            break;
        case xmlKeys.area:
            view = new TextArea(wkspc, node);
            break;

        case xmlKeys.check:
            view = new CheckBox(wkspc, node);

            break;

        case xmlKeys.radiogroup:
            view = new RadioGroup(wkspc, node);
            break;

        case xmlKeys.radio:
            view = new Radio(wkspc, node);
            break;

        case xmlKeys.separator:
            view = new Separator(wkspc, node);
            break;

        case xmlKeys.guide:
            view = new Guideline(wkspc, node);
            break;

        case xmlKeys.table:
            view = new NativeTable(wkspc, node);
            break;

        case xmlKeys.customTable:
            view = new CustomTableView(wkspc, node);
            break;
        case xmlKeys.inputTable:
            view = new InputTableView(wkspc, node);
            break;
        case xmlKeys.growableTable:
            view = new GrowableTableView(wkspc, node);
            break;
        case xmlKeys.searchableTable:
            view = new SearchableTableView(wkspc, node);
            break;

        case xmlKeys.list:
            view = new NativeList(wkspc, node);

            break;

        case xmlKeys.label:
            view = new Label(wkspc, node);
            break;

        case xmlKeys.multiLabel:
            view = new MultiLineLabel(wkspc, node);
            break;

        case xmlKeys.dropDown:
            view = new DropDown(wkspc, node);
            break;

        case xmlKeys.clock:
            view = new ClockView(wkspc, node);
            break;
        case xmlKeys.canvas:
            view = new CanvasView(wkspc, node);
            break;

        case xmlKeys.video:
            view = new VideoView(wkspc, node);
            break;
        case xmlKeys.audio:
            view = new AudioView(wkspc, node);
            break;


        default:
            break;
    }

    if (view !== null) {
        this.constraints.push(view.makeVFL(wkspc));
        wkspc.allStyles.push(view.style);
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
                this.nodeProcessor(wkspc, childNode);
            }
        }//end for loop

    } else {

    }


    if (view) {
        if (view.topLevel === true) {
            this.buildUI(wkspc);
        }
    }

    this.doneParsing = true;
    this.errorOccured = false;
};


Parser.prototype.buildUI = function (wkspc) {


    injectButtonDefaults:{
        let defBtnStyle = new Style("input[type='button']:hover", []);
        defBtnStyle.addStyleElement('cursor', 'pointer');
        wkspc.allStyles.push(defBtnStyle);
    }

    injectAbsCss:{
        let styleObj = new Style('.abs', []);
        styleObj.addStyleElement('position', 'absolute');
        styleObj.addStyleElement('padding', '0');
        styleObj.addStyleElement('margin', '0');

        wkspc.allStyles.push(styleObj);
    }

    injectInputShadowRemover:{
        if (DISABLE_INPUT_SHADOW === true) {
            let inputShadowRemoveStyle = new Style('input', []);
            inputShadowRemoveStyle.addStyleElement(' background-image', 'none');
            inputShadowRemoveStyle.addStyleElement('outline', '0');
            //inputShadowRemoveStyle.addStyleElement('box-shadow', 'none');

            wkspc.allStyles.push(inputShadowRemoveStyle);
        }
    }



    let compounds = [];
    let includes = [];
    wkspc.viewMap.forEach(function (view, id) {

        if (view.constructor.name === 'IncludedView') {
            includes.push(view);
        }

        for (let i = 0; i < view.childrenIds.length; i++) {
            let childId = view.childrenIds[i];
            let child = wkspc.viewMap.get(childId);
            if (child.constructor.name === 'PopupView') {
                //popup views will not be shown by default. They are launched by the user with some action
                continue;
            }

            view.htmlElement.appendChild(child.htmlElement);
            if (child.constructor.name === 'ClockView' || child.constructor.name === 'LabelView' 
                    || child.constructor.name === 'ProgressBar' || child instanceof CustomTableView) {
                compounds.push(child);
            }
        }
    });


    this.html = this.rootView.toHTML();
    injectStyleSheets(wkspc.styleSheet, wkspc.allStyles);

    makeDefaultPositioningDivs:{

        let baseRoot = null;
        if (wkspc.systemRootId === BODY_ID) {
            baseRoot = document.body;
            baseRoot.id = wkspc.systemRootId;
        } else {
            baseRoot = document.getElementById(wkspc.systemRootId);
        }


        baseRoot.style.backgroundColor = 'white';
        baseRoot.appendChild(this.rootView.htmlElement);


        //If the baseRoot is the document.body, then specify its own constraints on the page
        if (baseRoot === document.body) {
            // main layout
            autoLayout(undefined, [
                'HV:|-0-[' + wkspc.systemRootId + ']-0-|'
            ]);
        }

        // layout the root layout on the baseRoot(the element we are attaching the xml layout to)
        autoLayout(baseRoot, [
            'HV:|-0-[' + this.rootView.htmlElement.id + ']-0-|'
        ]);


        // layout the xml layout with respect to its rootview
        autoLayout(this.rootView.htmlElement, this.constraints);


//layout the includes
        includes.forEach((include) => {//Each view is an include
            let rootChild = wkspc.viewMap.get(include.childrenIds[0]);
            //layout the root of an included layout with respect to its include parent element(which is just a div)
            autoLayout(include.htmlElement, include.directChildConstraints);
            //console.log('id:  ', view.id, '    ', view.directChildConstraints);
            //layout the xml of an included layout with respect to its root
            autoLayout(rootChild.htmlElement, include.constraints);
            //console.log('Generated Child Constraints for ', view.id, view.constraints);
        });

        compounds.forEach((child) => {
            child.runView();
        });

    }

    if (wkspc.controller && wkspc.controller instanceof ViewController) {
        wkspc.controller.onResume(wkspc);
    }

    if (wkspc.onComplete) {
        wkspc.onComplete();
    }

    //  console.log('UI construction logic done...', wkspc.viewMap.size);

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
    /* 
     * To change this license header, choose License Headers in Project Properties.
     * To change this template file, choose Tools | Templates
     * and open the template in the editor.
     */

    let AutoLayout = window.AutoLayout;
    let view = new AutoLayout.View();
    view.addConstraints(AutoLayout.VisualFormat.parse(visualFormat, {extended: true}));
    let elements = {};


    for (let key in view.subViews) {
        let elm = document.getElementById(key);
        if (elm) {
            elm.className += elm.className ? ' abs' : 'abs';
            elements[key] = elm;
           /* new ResizeSensor(elm, function () {
                console.log('Changed to ' + elm.clientWidth);
                updateLayout();
            });*/
        }
    }
    var updateLayout = function () {
        view.setSize(parentElm ? parentElm.clientWidth : window.innerWidth, parentElm ? parentElm.clientHeight : window.innerHeight);
        for (key in view.subViews) {
            var subView = view.subViews[key];
            let elm = elements[key];
            if (elm) {
                setAbsoluteSizeAndPosition(elm, subView.left, subView.top, subView.width, subView.height);
            }
        }
    };

    window.addEventListener('resize', updateLayout);
    updateLayout();
    return updateLayout;
}


Workspace.prototype.startFetchWorker = function (layoutFileName, onSucc) {

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

    this.workersMap.set(worker.name, worker);
};

Workspace.prototype.stopFetchWorkerByLayoutName = function (layoutFileName) {
    let worker = this.workersMap.get("worker-" + layoutFileName);
    worker.stop();
    worker = null;
};


Workspace.prototype.stopFetchWorker = function (workerName) {
    let worker = this.workersMap.get(workerName);
    worker.stop();
    worker = null;
};


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

function isScriptLoaded(scriptURL) {

    let scripts = document.getElementsByTagName('script');

    for (let i = 0; i < scripts.length; i++) {
        let script = scripts[i];

        if (script.src === scriptURL) {
            return true;
        }

    }

    return null;
}

/**
 * Runs a default workspace based on the file name supplied by the user on the layit.js script tag in the html file.
 * @returns {undefined}
 */
function baseLauncher() {
    let templateJson = document.currentScript.getAttribute('data-template');
    let fileName = document.currentScript.getAttribute('data-launcher');
    if (fileName && typeof fileName === 'string' && fileName.length > 0)
        launcher(fileName, BODY_ID, templateJson);
}

/**
 * Runs a workspace based on the file name supplied by the user and the id of the element that the layout should be attached to.
 * @param {string} fileName
 * @param {string} elemId
 * @param {string} templateData A json string containing information to pass into the xml layout 
 * @returns {undefined}
 */
function launcher(fileName, elemId, templateData) {

    if (elemId && typeof elemId === 'string' && elemId.length > 0) {
        if (fileName && typeof fileName === 'string' && fileName.length > 0) {
            let len = fileName.length;
            let endItem = '.xml';
            let endLen = endItem.length;

            const isXML = fileName.lastIndexOf(endItem) === len - endLen;

            if (isXML === true) {
                let workspace;
                if (templateData) {
                    if (typeof templateData === 'string') {
                        if (templateData.length > 0) {
                            try {
                                let data = JSON.parse(templateData);
                                workspace = new Workspace({layoutName: fileName, bindingElemId: elemId, templateData: data});
                            } catch (err) {
                                throw new Error('Template data specified but is not valid JSON!...' + templateData);
                            }
                        } else {
                            throw new Error('Template data specified but has no content');
                        }
                    } else if (typeof templateData === 'object') {
                        workspace = new Workspace({layoutName: fileName, bindingElemId: elemId, templateData: templateData});
                    } else {
                        throw new Error('Template data specified but its typeis invalid');
                    }
                } else {
                    workspace = new Workspace({layoutName: fileName, bindingElemId: elemId});
                }
            } else {
                throw new Error('Invalid xml file specified in data-launcher attribute of `layit.js` script tag.');
            }
        } else {
            throw new Error('Invalid filename specified');
        }
    } else {
        throw new Error('Invalid parent element specified');
    }

}

baseLauncher();