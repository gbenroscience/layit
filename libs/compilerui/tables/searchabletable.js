


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global GrowableTable */

/**
 * 
 * This is a growable table that includes a search option.
 * 
 * @param {type} options Normal options of a GrowableTable element. It however allows you
 * to specify additional keys in the options:
 * {
 * ...,
 * "showLeftBtn" : true,
 * "search-label" : "Find",
 * "search-label-color" : "red",
 * "search-field-style" : {
 * //normal-css options.
 * }
 * "search-label-style" : {
 * //normal-css options.
 * }
 * }
 * @returns {SearchableTable}
 */
function SearchableTable(options) {
    GrowableTable.call(this, options);
    if (this.validObject === false) {
        return;
    }

    this.searchLabel = 'Search: ';
    if (typeof options['search-label'] === 'string') {
        this.searchLabel = options['search-label'];
    } else {
        this.searchLabel = "Search: ";
    }
    if (typeof options['search-label-color'] === 'string') {
        this.searchLabelColor = options['search-label-color'];
    } else {
        this.searchLabelColor = "#000000";
    }

    if (typeof options.showLeftBtn === 'undefined') {
        logIfConsole("`showLeftBtn: true|false` not specified. Defaulting to true");
        this.showLeftBtn = false;
    } else {
        this.showLeftBtn = options.showLeftBtn;
    }


    this.searchLabelStyle = new Style("#" + this.id, []);
    this.searchFieldStyle = new Style("#" + this.id, []);
    initSearchLabelStyleCss:{

        var options = {};
        options["float"] = "left";
        options["font-size"] = "0.8em";
        options["margin-right"] = "0.5em",
                options["font-family"] = "\"Open Sans\",sans-serif";
        options["color"] = "black";
        options["font-weight"] = "bold";
        options["height"] = "100%";
        options['padding'] = '0.5em';


        this.searchLabelStyle.addFromOptions(options);





        if (typeof options["search-label-style"] === "object") {
            var searchLabelStyleCss = options["search-label-style"];
            for (var key in searchLabelStyleCss) {
                this.searchLabelStyle.addStyleElement(key, searchLabelStyleCss[key]);
            }
        }
    }

    initSearchFieldStyleCss:{


        this.searchFieldStyle.addFromOptions({
            "float": "left",
            "width": "15em",
            "padding": "0.5em",
            "color": "black",
            "font-size": "0.8em",
            "font-weight": "normal",
            "font-family": "\"Open Sans\",sans-serif",
            "font-style": "italic",
            "border-radius": "0.5em"




        });
        if (typeof options["search-field-style"] === "object") {
            var searchFieldStyleCss = options["search-field-style"];
            for (var key in searchFieldStyleCss) {
                this.searchFieldStyle.addStyleElement(key, searchFieldStyleCss[key]);
            }
        }
    }





    this.registry[this.getSearchLabelClass()] = this.searchLabelStyle;
    this.registry[this.getSearchFieldClass()] = this.searchFieldStyle;
}


SearchableTable.prototype.constructor = SearchableTable;
SearchableTable.prototype = Object.create(GrowableTable.prototype);



/**
 * Override this function in Table to insert the button to the content-header.
 * Generate the ui portion just above the table but still within the 
 * content area that contains the table. SearchableTable and GrowableTable
 * work by adding a Search field and a button respectively to this ui-area.
 * @returns {unresolved}
 */
SearchableTable.prototype.buildContentHeader = function () {

    var html = new StringBuffer();
    if (this.showLeftBtn === true) {

        var div = document.createElement("div");
        div.setAttribute("id", this.getContentHeaderId());
        addClass(div, this.getContentHeaderClass());
        div.appendChild(this.buildButton());
        div.appendChild(this.buildSearchArea());

    } else {
        var div = document.createElement("div");
        div.setAttribute("id", this.getContentHeaderId());
        addClass(div, this.getContentHeaderClass());
        div.appendChild(this.buildSearchArea());
    }



    return div;
};
/**
 * A Table function
 * Generates the button above the table.
 * @returns {StringBuffer.prototype@pro;dataArray@call;join}
 */
SearchableTable.prototype.buildSearchArea = function () {

 var div = document.createElement("div");

    div.style.float = "right";


    var span = document.createElement("span");
    addClass(span, this.getSearchLabelClass());
    span.appendChild(document.createTextNode(this.searchLabel));
    
    var input = document.createElement("input");
    input.type = "text";
    input.setAttribute("id" , this.getSearchFieldClass());
    addClass(input , this.getSearchFieldClass());
    input.placeholder = "Search Table";
     
    div.appendChild(span);
    div.appendChild(input);
    
    
    return div;
    
 
  
};
SearchableTable.prototype.getSearchFieldClass = function () {
    return this.id + "_search_field_class";
};
SearchableTable.prototype.getSearchLabelClass = function () {
    return this.id + "_search_label_class";
};