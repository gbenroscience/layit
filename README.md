# layit
Its an android xml style layout library for web interfaces!<br>
Layouts on steroids with android-style xml constraint-layouts on the web, backed by autolayout.js!

This project already works, but is currently under development and new ui widgets are been added to it.

You can achieve very complex layouts very quickly using constraints. In addition, we adopted the cool xml style of Google's android xml layouts which allow you build layouts very quickly instead of the weird but **powerful?** syntax of VFL and EVFL.
To make things even sweeter, we have changed the long names given to the constraint properties in the android xml syntax, to much shorter versions to allow for quick typing and to reduce bloat, e.g: `app:layout_constraintBottom_toBottomOf="parent"` becomes: `bottom_bottom='parent'`

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

ReadME still under-development
