# layit
Its an android xml style layout library for web interfaces!<br>
Layouts on steroids with android-style xml constraint-layouts on the web, backed by autolayout.js!

This project already works, but is currently under development and new ui widgets are been added to it.

You can achieve very complex layouts very quickly using constraints. In addition, we adopted the cool xml style of Google's android xml layouts which allow you build layouts very quickly instead of the weird but **powerful?** syntax of VFL and EVFL.
To make things even sweeter, we have changed the long names given to the constraint properties in the android xml syntax, to much shorter versions to allow for quick typing and to reduce bloat, e.g: `app:layout_constraintBottom_toBottomOf="parent"` becomes: `bottom_bottom='parent'`

### NOTE: Some of the more advanced constraint properties in Android xml's ConstraintLayout are not yet supported, such as chaining, layout weight, priorities(from autolayout) etc.
## Usage

You need the entire project folder, so clone this repository and place it(the `layit` folder) in the root of your web project.<br>
When you create an html file in your web project, depending on your code organization, it should look like this:
```html
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript" src="correct/path/to/layit.js" data-launcher="test.xml"></script>

        
    </head>
    <body>
<!--        <div>HAAAI!!!! MAIIIIY PIPUULLL!!!</div>-->
    </body>
</html>
```
The code above will go and fetch an xml layout called `test.xml` from the `layouts` sub-folder in the `layit` folder and use it as the ui definition for the current html page.

You will not need to worry about importing the other js files, the layit project does that for you. **ABSOLUTELY ENSURE THAT YOU RUN YOUR CODE IN A WEB-SERVER ENVIRONMENT!**<br>



### Layouts
All your xml layouts must be placed in the `layit/layouts` folder.<br>
No sub-folders are allowed here.
All your view tags, with the exception of the root view tag in the xml must have an `id`

A layout file must begin with a root element, called a `ConstraintLayout` element.
This root element is later translated into a `div` anyway, if you care to know.
Any `<View />` tag is also translated into a div later on.

With this library and similar libs, we are looking at the days of flatter layouts in web ui technologies, just as happened on mobile devices.
Nested layouts can only result if the user decides to use included files, as these are translated and laid out in their own div, before their parent div is appended into the including div(The div generated from the `<include />` tag.

The file would look like this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ConstraintLayout
    width="match_parent"
    height="match_parent">

     <View
        id="section_top"
        width="match_parent"
        height="128px"
        backgroundColor="#000044"
        top_top='parent'
        start_start='parent'
        end_end='parent'

    />
    <Label
        id="site_title"
        width="wrap_content"
        height="wrap_content"
        start_start='section_top'
        cy_align="section_top"
        marginStart="16"
        textColor="#eee"
        value="Layit Framework By Example"
        textSize="1.5em"
        textStyle="bold italic"
        fontFamily="Kartika"
    
    />
  
    <!--- ...Other xml tags -->
</ConstraintLayout>    
```



### Layout Construction & Syntax in more detail
The syntax of your xml file is basically same as that of Android's xml.
The constraint properties with long names have been renamed to shorter forms to allow for quicker typing and other advantages, e.g:

```
    layout_constraintTop_toTopOf       -> top_top
    layout_constraintBottom_toBottomOf -> bottom_bottom
    layout_constraintStart_toStartOf   -> start_start
    layout_constraintEnd_toEndOf       -> end_end
    layout_constraintTop_toBottomOf    -> top_bottom
    layout_constraintStart_toEndOf     -> start_end
    layout_constraintEnd_toStartOf     -> end_start
    layout_constraintBottom_toTopOf    -> bottom_top
    layout_constraintCenterXAlign      -> cx_align
    layout_constraintCenterYAlign      -> cy_align
    layout_constraintGuide_percent     -> guide_percent
    layout_constraintDimensionRatio    -> dim_ratio
    layout_constraintGuide_percent     -> guide_percent
```

#### layout_width and layout_height

These properties are used to specify the size of the view. You may specify the values without a dimension, e.g. `layout_width='200'`, or with a dimension, e.g. `layout_width='200px'` or `layout_width='45%'` , or relative to another view in the same layout file, e.g `layout_width='another_views_id/2'` or `layout_width='another_views_id/0.85'` or `layout_width='another_views_id'`. Multiplication operation is not supported here, only division.

`layout_width='match_parent'` and `layout_height='match_parent'` are supported.
`layout_width='wrap_content'` and `layout_height='wrap_content'` are only partially supported. The implementation is not yet complete as regards these, for various reasons.

The underlying `autolayout.js` library does not seem to support `wrap_content`,so we are trying to provide some implementation for it.

Note that where no units are specified, pixels are used. So `layout_width='200'` and `layout_width='200px'` are equivalent.
All these apply to `layout_height` also.<br>
**CSS calc operations are not supported**<br>

#### layout_maxWidth and layout_maxHeight , layout_minWidth and layout_minHeight 
These are all supported.
    

#### cx_align and cy_align

Allows a layout's center to be constrained horizontally or vertically to another layout's center.<br>
The values accepted are either, `parent` or `view_id`; where `view_id` is the id of the view we are constraining this view with respect to.



#### Includes
Sub layouts can be included in a layout up to several levels. Just use the <include/> tag and specify the layout to be included. e.g:
```xml
 <include
        layout="includer"
        id="included_details"
        width="100%"
        height="220"
        marginTop="12px"
        cx_align="parent"
        top_bottom="some_view"
        border="1px solid lightgray"
        borderRadius="1em"
    />
```

The above tag specifies that a div should be created and assigned the identity: `included_details`. The xml layout in the file called `includer.xml` should be rendered within this div. It should be horizontally aligned with its parent center and its top should be constrained to the bottom of a view whose id is `some_view` in the same xml file. The other properties are injected into the stylesheet for the page.<br><br>

### imports: Loading scripts to control your ui elements

`**imports**` are an important feature introduced here. They allow the library dynamically load scripts that the user wishes to use in working with the xml ui; e.g. a controller.

To import scripts, use the imports tag as such:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ConstraintLayout
    width="match_parent"
    height="match_parent">

    <imports
        files="aa/aaa.js;mm/mmm.js;" controller="controller_name"
    />
    
    <!--- ...Other xml tags -->
</ConstraintLayout>    
```
This will load the files `aaa.js` and `mmm.js` in the directories `aa` and `mm` respectively; where the directories `aa` and `mm` are both located in the `uiscripts` directory of the `layit` folder.<br>
Your ui scripts should be defined in the `uiscripts` directory. You may create folders and subfolders within the `uiscripts` directory


Define an `imports` tag anywhere in the xml layout and the library will load the scripts defined in the `imports` tag.<br>
This allows you to separate your ui(the xml layout) from its logic and other related logic.

The library allows you to define at most one viewcontroller per xml layout. Specify the name of the viewcontroller in the controller attribute of the `imports` tag.
Your controller must be defined in one of the files that you have imported in the `files` attribute of the `imports` tag.

#### ViewControllers

A `ViewController` is a standard way of interacting with your UI from code.
Your view controller must inherit from the base `ViewController` class of the library.

The minimum code to do this is:

Say you have created your `ViewController class` in the `uiscripts` folder; let's say its name is `TestController` in a file called `test.js`.



```Javascript
/* global ViewController */

TestController.prototype = Object.create(ViewController.prototype);
TestController.prototype.constructor = TestController;

function TestController(workspace){
    ViewController.call(this, workspace);
}


/**
 * Don't try to access your views here please.
 * The views may or may not be ready yet! 
 * This only signifies that your ViewController has been created.
 * @param {string} wid The workspace id
 * @returns {undefined}
 */
TestController.prototype.onCreate = function(wid){
     ViewController.prototype.onCreate.call(this, wid);
//Your code goes below here
};

/**
 * You may now begin to use your views.
 * @param {string} wid The workspace id
 * @returns {undefined}
 */
TestController.prototype.onViewsAttached = function(wid){
         ViewController.prototype.onViewsAttached.call(this, wid);
//Your code goes below here

//e.g let view = this.findHtmlViewById('site_title');
 

};
```

For now, the `ViewController` has only 2 implemented lifecycle methods; these are:
`onCreate` and `onViewsAttached`.

1. `onCreate` is fired when the ViewController has been successfully instantiated by the JS runtime. Do not try to access your UI Elements within this method!
  They may or may not be created yet!
2. `onViewsAttached` This is fired when all your ui elements have been successfully created and attached to the `DOM`. You may freely access them from within this method.

Your `ViewController` has also inherited some methods from the base viewcontroller which it may use to locate html elements in the DOM.

From within your `onViewsAttached` method or a method called from within that method, you may call: `this.findHtmlViewById(elementId)` to select a html element, and then use it in your code.

**_More methods will be added as needed_**

Now add this view controller to your xml layout, like this:

```XML
<?xml version="1.0" encoding="utf-8"?>
<ConstraintLayout
    width="match_parent"
    height="match_parent">

    <imports
        files="test.js;networking.js;" controller="TestController"
    />
    
    <!--- ...Other xml tags -->
</ConstraintLayout>
```


## Workspace

To load an xml file. the library uses the concept of a `Workspace`. A workspace is a Javascript class which on its is able to completely process an xml layout of valid syntax into a html document suitably laid out using autolayout technology. It has the ability to identify all included xml layouts, and load and process them also.



_**ReadME still under-development**_
