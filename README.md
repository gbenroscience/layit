# layit
Its an android xml style layout library for web interfaces!<br>
Layouts on steroids with android-style xml constraint-layouts on the web, backed by autolayout.js!

This project already works, but is currently under development and new ui widgets are been added to it.

You can achieve very complex layouts very quickly using constraints. In addition, we adopted the cool xml style of Google's android xml layouts which allow you build layouts very quickly instead of the weird but **powerful?** syntax of VFL and EVFL.
To make things even sweeter, we have changed the long names given to the constraint properties in the android xml syntax, to much shorter versions to allow for quick typing and to reduce bloat, e.g: `app:layout_constraintBottom_toBottomOf="parent"` becomes: `bottom_bottom='parent'`

## NOTE: Some of the more advanced constraint properties in Android xml Constraintlayout are not yet supported, such as chaining, layout weight etc.  
## Usage

You need the entire project folder, so clone this repo and place it(the `layit` folder) in the root of your web project.<br>
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

You will not need to worry about importing the other js files, the layit project does that for you. **ABSOLUTELY ENSURE THAT YOUR RUN YOUR CODE IN A WEB-SERVER ENVIRONMENT!**<br>

The code above will go and fetch an xml layout called `test.xml` from the `layouts` sub-folder in the `layit` folder and use it as the ui definition for the current html page.


### Layouts
All your xml layouts must be placed in the `layit/layouts` folder.<br>
No sub-folders are allowed here.
All your view tags, with the exception of the root view tag in the xml must have an `id`

### Layout Construction & Syntax
The syntax of your xml file is basically same as that of Android's xml.
The constraint properties with long names have been renamed to shorter forms to allow for quicker typing and other advantages, e.g:

```
    layout_constraintTop_toTopOf -> top_top
    layout_constraintBottom_toBottomOf -> bottom_bottom
    layout_constraintStart_toStartOf -> start_start
    layout_constraintEnd_toEndOf  -> end_end
    layout_constraintTop_toBottomOf -> top_bottom
    layout_constraintStart_toEndOf -> start_end
    layout_constraintEnd_toStartOf -> end_start
    layout_constraintBottom_toTopOf -> bottom_top
    layout_constraintCenterXAlign -> cx_align
    layout_constraintCenterYAlign -> cy_align
    layout_constraintGuide_percent -> guide_percent
```

#### layout_width and layout_height

#### cx_align and cy_align

Allow a layout's center to be constrained horizontally or vertically to another layout's center.<br>
The values accepted are either, `parent` or `view_id`; the id of the view we are constraining this view with respect to.



These properties are used to specify the size of the view. You may specify the values without a dimension, e.g. `layout_width='200'`, or with a dimension, e.g. `layout_width='200px'` or `layout_width='45%'` , or relative to another view in the same layout file, e.g `layout_width='another_views_id/2'` or `layout_width='another_views_id/0.85'`. Multiplication operation is not supported here, only division.

`layout_width='match_parent'` and `layout_height='match_parent'` are supported.
`layout_width='wrap_content'` and `layout_height='wrap_content'` are only partially supported. The implementation is not yet complete as regards these, for various reasons.

The underlying `autolayout.js` library does not seem to support `wrap_content`,so we are trying to provide some implementation for it.

Note that where no units are specified, pixels are used. So `layout_width='200'` and `layout_width='200px'` are equivalent.
All these apply to `layout_height` also.<br>
**CSS calc operations are not supported**<br>

#### layout_maxWidth and layout_maxHeight , layout_minWidth and layout_minHeight 
These are all supported.
    
    

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


_**ReadME still under-development**_
