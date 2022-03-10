


const PATH_TO_LAYOUTS_FOLDER = SCRIPTS_BASE + 'layouts/';
const PATH_TO_IMAGES = SCRIPTS_BASE + 'images/';
const PATH_TO_COMPILER_SCRIPTS = SCRIPTS_BASE + "sys/";
const PATH_TO_UI_SCRIPTS = SCRIPTS_BASE + "uiscripts/";








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
    root: "ConstraintLayout",
    view: "View",
    button: "Button",
    imageButton: "ImageButton",
    field: "TextField",
    area: "TextArea",
    video: 'VideoView',
    audio: 'AudioView',
    imageView: "ImageView",
    progress: "ProgressBar",
    check: "CheckBox",
    radiogroup: "RadioGroup",
    radio: "Radio",
    separator: "Separator",
    dropDown: "DropDown",
    guide: "Guideline",
    customList: "CustomList",
    list: "NativeList",
    table: "NativeTable",
    inputTable: "InputTableView",
    growableTable: "GrowableTableView",
    searchableTable: "SearchableTableView",
    customTable: "CustomTableView",
    label: "Label",
    multiLabel: "MultiLineLabel",
    clock: "Clock",
    canvas: "Canvas",
    include: "include"
};


const attrKeys = {
    id: "id",
    layout: "layout", //specifies the layout file to use with an include tag
    layout_width: "width",
    layout_height: "height",

    layout_maxWidth: "maxWidth",
    layout_maxHeight: "maxHeight",
    layout_minWidth: "minWidth",
    layout_minHeight: "minHeight",

    width: "width", //on canvas element
    height: "height", //on canvas element
    translationZ: "translationZ", //the z index
    layout_margin: "margin",
    layout_marginStart: "marginStart",
    layout_marginEnd: "marginEnd",
    layout_marginTop: "marginTop",
    layout_marginBottom: "marginBottom",
    layout_marginHorizontal: "marginHorizontal",
    layout_marginVertical: "marginVertical",
    layout_padding: "padding",
    layout_paddingStart: "paddingStart",
    layout_paddingEnd: "paddingEnd",
    layout_paddingTop: "paddingTop",
    layout_paddingBottom: "paddingBottom",
    layout_paddingHorizontal: "paddingHorizontal",
    layout_paddingVertical: "paddingVertical",
    layout_constraintTop_toTopOf: "top_top",
    layout_constraintBottom_toBottomOf: "bottom_bottom",
    layout_constraintStart_toStartOf: "start_start",
    layout_constraintEnd_toEndOf: "end_end",
    layout_constraintTop_toBottomOf: "top_bottom",
    layout_constraintStart_toEndOf: "start_end",
    layout_constraintEnd_toStartOf: "end_start",
    layout_constraintBottom_toTopOf: "bottom_top",
    layout_constraintCenterXAlign: "cx_align",
    layout_constraintCenterYAlign: "cy_align",
    layout_constraintGuide_percent: "guide_percent",
    dimension_ratio: "dim_ratio",
    orientation: "orientation", //

    listType: 'listType', //ol or ul
    showBullets: 'showBullets', //for lists, if true, will show the bullets or numbers

    items: "items", // an array of items to display in a list or a dropdown
    tableItems: 'tableItems', //a 2d array of items to display on a table
    title: 'title', // table title
    showBorders: 'showBorders', // show the custom table's inner borders(does not apply to the native table)
    pagingEnabled: 'pagingEnabled',
    tableTheme: 'tableTheme', // for custom tables only
    cellPadding: 'cellPadding', //works only for the custom tables
    headerPadding: 'headerPadding',
    showLeftBtn: 'showLeftBtn', // only works for the SeachableTableView
    buttonText: "buttonText", // the text on the top left button
    hasHeader: "hasHeader", //check if a native html table node must have an header row
    hasFooter: "hasFooter", //check if a native html table node or a custom table must have a footer row
    hasContainer: "hasContainer", //check if a custom table must have a container
    actionColumns: "actionColumns", // a list of columns on an InputTableView, GrowableTableView or a SearchableTableView that will be rendered as buttons
    checkableColumns: "checkableColumns", // a list of columns on an InputTableView, GrowableTableView or a SearchableTableView that will be rendered as checkboxes
    textColumns: "textColumns", // a list of columns on an InputTableView, GrowableTableView or a SearchableTableView that will be rendered as textfields
    selectColumns: "selectColumns", // a list of columns on an InputTableView, GrowableTableView or a SearchableTableView that will be rendered as dropdowns


//for video and audio
    sources: 'sources', // sources='[{"src": "/videos/stuff.mp4","type": "/videos/stuff.mp4", "codecs": "avc1.42E01E, mp4a.40.2, theora, vorbis"},]'
    autoplay: 'autoplay', //boolean
    muted: 'muted', //boolean
    controls: 'controls', // boolean
    preload: 'preload', //boolean
    
    
    hasCaption: "hasCaption",
    caption: "caption",
    scrollHeight: "scrollHeight",
    withNumbering: "withNumbering",
    cssClass: "cssClass",
    resize: "resize",
    progressColor: "progressColor",

    files: "files",
    controller: "controller",
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
    textColor: "textColor",
    textSize: "textSize",
    textStyle: "textStyle",
    font: "font",
    fontFamily: "fontFamily",
    fontSize: "fontSize",
    fontWeight: "fontWeight", // normal | bold | oblique
    fontStyle: "fontStyle", // normal | italic | oblique
    gravity: 'gravity', 
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
