/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global Table */

/**
 * 
 * @param {type} options Normal options of a Table element. Add to the options the `checkablecolumns`
 *  element to  show the columns that should be checkboxes. e.g:
 *  {
 *   ...,
 *   checkablecolumns : ['Name' , 'Email', 'Password' ], checkboxes
 *   actioncolumns : ['Add' , 'Delete', 'Edit' ]...buttons.
 *   textcolumns : ['Value1' ,'Value2','Value3']...textfields
 *   selectcolumns : [
 {
 "Title1": ["Entry A1", "Entry B1, Entry C1"]
 },
 {
 "Title2": ["Entry A2", "Entry B2, Entry C2"]
 },
 {
 "Title3": ["Entry A3", "Entry B3, Entry C3"]
 }
 ] 
 *  }
 * @returns {InputTable}
 */
function InputTable(options) {
    Table.call(this, options);

    if (this.validObject === false) {
        return;
    }

    this.clickedRow = -1;
    this.clickedColumn = -1;


    if (typeof options.checkablecolumns !== 'undefined' && this.isOneDimensionalArray(options.checkablecolumns)) {
        this.checkablecolumns = options.checkablecolumns;


        modifyRowsByAddingCheckableColumns:{

            var i = 0;
            for (var i = 0; i < this.rows.length; i++) {
                var row = this.rows[i];



                var len = row.tableCells.length;
                for (var j = 0; j < this.checkablecolumns.length; j++) {


                    if (i === 0) {
                        var cell = new TableCell(this.checkablecolumns[j], row.header, row.footer);
                        cell.setId(row.getCellIdAt(len + j));
                        cell.setStyle(new Style("#" + cell.getId(), []));



                        cell.className = this.getTableCellClass();
                        //cell.addStyle("max-width", "calc( 100% / " + row.tableCells.length + "  )");


                        row.tableCells.push(cell);
                    } else {
                        var checkHtml = new StringBuffer("<input type='checkbox' class='").append(this.getTableCellCheckBoxTypeClass()).append(" ")
                                .append(this.getTableCellCheckBoxColumnClass(len + j)).append("' />");


                        var cell = new TableCell(new Array(checkHtml.toString()), row.header, row.footer);
                        cell.setId(row.getCellIdAt(len + j));
                        cell.setStyle(new Style("#" + cell.getId(), []));
                        cell.className = this.getTableCellClass();
                        row.tableCells.push(cell);
                    }
                }

            }

            /*
             * Addition of the colums for the check boxes does not contain
             *  the equal width specification for the cells so recalculate the cell widths now
             *  and apply the borders of the cells if 
             
             */colWidthCorrection:{

                var i = 0;
                for (var i = this.rows.length - this.checkablecolumns.length - 1; i < this.rows.length; i++) {

                    var row = this.rows[i];

                    if (typeof row === 'undefined') {
                        break;
                    }

                    for (var j = 0; j < row.tableCells.length; j++) {
                        if (options.showBorders === true) {
                            row.tableCells[j].addStyle("border", "1px solid #e7ecf1");
                        }
                        row.tableCells[j].addStyle("padding", this.cellpadding);
                        row.tableCells[j].addStyle("max-width", "calc( 100% / " + row.tableCells.length + "  )");
                        row.tableCells[j].addStyle("overflow", "hidden");
                        row.tableCells[j].addStyle("text-overflow", "ellipsis");
                        row.tableCells[j].addStyle("white-space", "nowrap");

                    }


                }

            }

        }
    } else {
        this.checkablecolumns = [];
    }
    if (typeof options.actioncolumns !== 'undefined' && this.isOneDimensionalArray(options.actioncolumns)) {
        this.actioncolumns = options.actioncolumns;


        modifyRowsByAddingActionColumns:{

            var i = 0;
            for (var i = 0; i < this.rows.length; i++) {
                var row = this.rows[i];



                var len = row.tableCells.length;
                for (var j = 0; j < this.actioncolumns.length; j++) {


                    if (i === 0) {
                        var cell = new TableCell(this.actioncolumns[j], row.header, row.footer);
                        cell.setId(row.getCellIdAt(len + j));
                        cell.setStyle(new Style("#" + cell.getId(), []));



                        cell.className = this.getTableCellClass();
                        //cell.addStyle("max-width", "calc( 100% / " + row.tableCells.length + "  )");


                        row.tableCells.push(cell);

                    } else {
                        var btnHtml = new StringBuffer("<input type='button' class='").append(this.getTableCellButtonTypeClass()).append(" ")
                                .append(this.getTableCellButtonColumnClass(len + j)).append("' value='").append(this.actioncolumns[j]).append("' />");
                        var cell = new TableCell(new Array(btnHtml.toString()), row.header, row.footer);
                        cell.setId(row.getCellIdAt(len + j));
                        cell.setStyle(new Style("#" + cell.getId(), []));
                        cell.className = this.getTableCellClass();
                        row.tableCells.push(cell);
                    }
                }

            }

            /*
             * Addition of the colums for the check boxes does not contain
             *  the equal width specification for the cells so recalculate the cell widths now
             *  and apply the borders of the cells if 
             
             */colWidthCorrection:{

                var i = 0;
                for (var i = this.rows.length - this.checkablecolumns.length - 1; i < this.rows.length; i++) {

                    var row = this.rows[i];
                    if (typeof row === 'undefined') {
                        break;
                    }

                    for (var j = 0; j < row.tableCells.length; j++) {
                        if (options.showBorders === true) {
                            row.tableCells[j].addStyle("border", "1px solid #e7ecf1");
                        }
                        row.tableCells[j].addStyle("padding", this.cellpadding);
                        row.tableCells[j].addStyle("max-width", "calc( 100% / " + row.tableCells.length + "  )");
                        row.tableCells[j].addStyle("overflow", "hidden");
                        row.tableCells[j].addStyle("text-overflow", "ellipsis");
                        row.tableCells[j].addStyle("white-space", "nowrap");

                    }


                }

            }

        }
    } else {
        this.actioncolumns = [];
    }

    if (typeof options.textcolumns !== 'undefined' && this.isOneDimensionalArray(options.textcolumns)) {
        this.textcolumns = options.textcolumns;


        modifyRowsByAddingTextColumns:{

            var i = 0;
            for (var i = 0; i < this.rows.length; i++) {
                var row = this.rows[i];



                var len = row.tableCells.length;
                for (var j = 0; j < this.textcolumns.length; j++) {


                    if (i === 0) {
                        var cell = new TableCell(this.textcolumns[j], row.header, row.footer);
                        cell.setId(row.getCellIdAt(len + j));
                        cell.setStyle(new Style("#" + cell.getId(), []));



                        cell.className = this.getTableCellClass();
                        //cell.addStyle("max-width", "calc( 100% / " + row.tableCells.length + "  )");


                        row.tableCells.push(cell);
                    } else {
                        var textfieldHtml = new StringBuffer("<input type='text' class='").append(this.getTableCellTextFieldTypeClass()).append(" ")
                                .append(this.getTableCellTextFieldColumnClass(len + j)).append("' />");


                        var cell = new TableCell(new Array(textfieldHtml.toString()), row.header, row.footer);
                        cell.setId(row.getCellIdAt(len + j));
                        cell.setStyle(new Style("#" + cell.getId(), []));
                        cell.className = this.getTableCellClass();
                        row.tableCells.push(cell);
                    }
                }

            }

            /*
             * Addition of the colums for the text columns does not contain
             *  the equal width specification for the cells so recalculate the cell widths now
             *  and apply the borders of the cells if 
             
             */colWidthCorrection:{

                var i = 0;
                for (var i = this.rows.length - this.textcolumns.length - 1; i < this.rows.length; i++) {

                    var row = this.rows[i];

                    if (typeof row === 'undefined') {
                        break;
                    }

                    for (var j = 0; j < row.tableCells.length; j++) {
                        if (options.showBorders === true) {
                            row.tableCells[j].addStyle("border", "1px solid #e7ecf1");
                        }
                        row.tableCells[j].addStyle("padding", this.cellpadding);
                        row.tableCells[j].addStyle("max-width", "calc( 100% / " + row.tableCells.length + "  )");
                        row.tableCells[j].addStyle("overflow", "hidden");
                        row.tableCells[j].addStyle("text-overflow", "ellipsis");
                        row.tableCells[j].addStyle("white-space", "nowrap");

                    }


                }

            }

        }
    } else {
        this.textcolumns = [];
    }


    if (typeof options.selectcolumns !== 'undefined' && typeof options.selectcolumns[0] === 'string'
            && this.isOneDimensionalArray(options.selectcolumns[1])) {
        this.selectcolumns = options.selectcolumns;


        modifyRowsByAddingSelectColumns:{

            var i = 0;
            for (var i = 0; i < this.rows.length; i++) {
                var row = this.rows[i];


                var len = row.tableCells.length;
                /*
                 * selectcolumns : 
                 * [
                 {
                 "Title1": ["Entry A1", "Entry B1, Entry C1"]
                 },
                 {
                 "Title2": ["Entry A2", "Entry B2, Entry C2"]
                 },
                 {
                 "Title3": ["Entry A3", "Entry B3, Entry C3"]
                 }
                 ]
                 * <select id="access-edit" class="access-edit" name="access" >
                 <option value="">Set Access Level</option>
                 <option value="0">BASE</option> 
                 <option value="1">ADMIN</option>
                 </select> 
                 */
                for (var j = 0; j < this.selectcolumns.length; j++) {


                    if (i === 0) {
                        /*
                         * The keys to an array are its indexes.(i.e. 0,1,2..), so calling Object.keys(this.selectcolumns)
                         * will return [0,1,2...].
                         * Calling Object.keys(this.selectcolumns[j]) will return an array containing the keys to
                         * the first json entry i.e. [Title1]. To get that key, just get the element at the zeroth index, so:
                         * Object.keys(this.selectcolumns[j])[0]
                         */
                        var cell = new TableCell(Object.keys(this.selectcolumns[j])[0], row.header, row.footer);
                        cell.setId(row.getCellIdAt(len + j));
                        cell.setStyle(new Style("#" + cell.getId(), []));



                        cell.className = this.getTableCellClass();
                        //cell.addStyle("max-width", "calc( 100% / " + row.tableCells.length + "  )");


                        row.tableCells.push(cell);

                    } else {

                        var selectHtml = new StringBuffer('<select class="').append(this.getTableCellSelectTypeClass()).append(" ")
                                .append(this.getTableCellSelectColumnClass(len + j)).append('" >');

                        for (var k = 0; k < this.selectcolumns[j].length; k++) {
                            selectHtml.append("<option value='").append(k + "'>").append(this.selectcolumns[j][k]).append("</option>");
                        }
                        selectHtml.append("</select>");



                        var cell = new TableCell(new Array(selectHtml.toString()), row.header, row.footer);
                        cell.setId(row.getCellIdAt(len + j));
                        cell.setStyle(new Style("#" + cell.getId(), []));
                        cell.className = this.getTableCellClass();
                        row.tableCells.push(cell);
                    }
                }

            }

            /*
             * Addition of the colums for the check boxes does not contain
             *  the equal width specification for the cells so recalculate the cell widths now
             *  and apply the borders of the cells if 
             
             */colWidthCorrection:{

                var i = 0;
                for (var i = this.rows.length - this.checkablecolumns.length - 1; i < this.rows.length; i++) {

                    var row = this.rows[i];
                    if (typeof row === 'undefined') {
                        break;
                    }

                    for (var j = 0; j < row.tableCells.length; j++) {
                        if (options.showBorders === true) {
                            row.tableCells[j].addStyle("border", "1px solid #e7ecf1");
                        }
                        row.tableCells[j].addStyle("padding", this.cellpadding);
                        row.tableCells[j].addStyle("max-width", "calc( 100% / " + row.tableCells.length + "  )");
                        row.tableCells[j].addStyle("overflow", "hidden");
                        row.tableCells[j].addStyle("text-overflow", "ellipsis");
                        row.tableCells[j].addStyle("white-space", "nowrap");

                    }


                }

            }

        }
    } else {
        this.selectcolumns = [];
    }

}

InputTable.prototype.constructor = InputTable;

InputTable.prototype = Object.create(Table.prototype);


/**
 * 
 * @returns {String}
 */
InputTable.prototype.getTableCellCheckBoxTypeClass = function () {
    return this.id + "_tbody_checkbox_class";
};


/**
 * A constant class name for a column of checkboxes
 * @param {type} column The column of the checkbox.
 * @returns {String}
 */
InputTable.prototype.getTableCellCheckBoxColumnClass = function (column) {
    return this.id + "_tbody_checkbox_class_" + column;
};


/**
 * 
 * @returns {String}
 */
InputTable.prototype.getTableCellTextFieldTypeClass = function () {
    return this.id + "_tbody_textfield_class";
};

/**
 * A constant class name for a column of textfields
 * @param {type} column The column of the textfield.
 * @returns {String}
 */
InputTable.prototype.getTableCellTextFieldColumnClass = function (column) {
    return this.id + "_tbody_textfield_class_" + column;
};


/**
 * 
 * @returns {String}
 */
InputTable.prototype.getTableCellSelectTypeClass = function () {
    return this.id + "_tbody_select_class";
};

/**
 * A constant class name for a column of html select objects
 * @param {type} column The column of the textfield.
 * @returns {String}
 */
InputTable.prototype.getTableCellSelectColumnClass = function (column) {
    return this.id + "_tbody_select_class_" + column;
};




/**
 *  
 * @returns {String}
 */
InputTable.prototype.getTableCellButtonTypeClass = function () {
    return this.id + "_tbody_button_class";
};

/**
 * A constant class name for a column of buttons
 * @param {type} column The column of the checkbox
 * @returns {String}
 */
InputTable.prototype.getTableCellButtonColumnClass = function (column) {
    return this.id + "_tbody_button_class_" + column;
};

InputTable.prototype.build = function (parent) {
    var checkBoxStyle = new Style("#" + this.getTableCellCheckBoxTypeClass(), []);

    checkBoxStyle.addFromOptions({
        'display': "table",
        'background': "red",
        'margin': "0 auto",
        'cursor': "pointer"
    });
    var btnStyle = new Style("#" + this.getTableCellButtonTypeClass(), []);
    btnStyle.addFromOptions({
        'display': "table",
        'margin': "0 auto",
        'padding': '3px 1em'
    });

    var textFieldStyle = new Style("#" + this.getTableCellTextFieldTypeClass(), []);
    textFieldStyle.addFromOptions({
        'display': "table",
        'margin': "0 auto",
        'padding': '3px 1em',
        'border': '0.5px solid gray'
    });

    var selectStyle = new Style("#" + this.getTableCellSelectTypeClass(), []);
    selectStyle.addFromOptions({
        'display': "table",
        'margin': "0 auto",
        'padding': '3px 1em',
        'border': '0.5px solid gray'
    });


    this.registry[this.getTableCellCheckBoxTypeClass()] = checkBoxStyle;
    this.registry[this.getTableCellButtonTypeClass()] = btnStyle;
    this.registry[this.getTableCellTextFieldTypeClass()] = textFieldStyle;
    this.registry[this.getTableCellSelectTypeClass()] = selectStyle;

//call to the overriden function from Table
    Object.getPrototypeOf(InputTable.prototype).build.call(this, parent);


};


/**
 * 
 * @param {type} data A 2d array of textual rows to add to the table.
 * @returns {undefined}
 */
InputTable.prototype.addRows = function (data) {


    if (this.is2DArray(data)) {


        for (var i = 0; i < data.length; i++) {

            var rw = data[i];
            var row = new TableRow(rw, this.rows.length === 0, false);
            row.className = this.id + "_row";
            for (var j = 0; j < row.tableCells.length; j++) {
                row.tableCells[j].className = this.getTableCellClass();
                row.tableCells[j].addStyle("max-width", "calc( 100% / " + row.tableCells.length + " )");
            }

            this.rows.push(row);
        }

        for (var i = 0; i < this.rows.length; i++) {

            var row = this.rows[i];
            row.setHeader(i === 0);
            row.setFooter(this.hasFooter === true ? i === this.rows.length - 1 : false);

        }


        ///checkableColumns


        for (var i = this.rows.length - data.length; i < this.rows.length; i++) {
            var row = this.rows[i];



            var len = row.tableCells.length;
            for (var j = 0; j < this.checkablecolumns.length; j++) {


                if (i === 0) {
                    var cell = new TableCell(this.checkablecolumns[j], row.header, row.footer);
                    cell.setId(row.getCellIdAt(len + j));
                    cell.setStyle(new Style("#" + cell.getId(), []));



                    cell.className = this.getTableCellClass();


                    row.tableCells.push(cell);
                } else {
                    var checkHtml = new StringBuffer("<input type='checkbox' class='").append(this.getTableCellCheckBoxTypeClass()).append(" ")
                            .append(this.getTableCellCheckBoxColumnClass(len + j)).append("' />");
                    var cell = new TableCell(new Array(checkHtml.toString()), row.header, row.footer);
                    cell.setId(row.getCellIdAt(len + j));
                    cell.setStyle(new Style("#" + cell.getId(), []));
                    cell.className = this.getTableCellClass();
                    row.tableCells.push(cell);
                }
            }

        }
        //actionColumns
        for (var i = this.rows.length - data.length; i < this.rows.length; i++) {
            var row = this.rows[i];



            var len = row.tableCells.length;
            for (var j = 0; j < this.actioncolumns.length; j++) {

                if (i === 0) {
                    var cell = new TableCell(this.actioncolumns[j], row.header, row.footer);
                    cell.setId(row.getCellIdAt(len + j));
                    cell.setStyle(new Style("#" + cell.getId(), []));



                    cell.className = this.getTableCellClass();
                    //cell.addStyle("max-width", "calc( 100% / " + row.tableCells.length + "  )");


                    row.tableCells.push(cell);
                } else {
                    var btnHtml = new StringBuffer("<input type='button' class='").append(this.getTableCellButtonTypeClass()).append(" ")
                            .append(this.getTableCellButtonColumnClass(len + j)).append("' value='").append(this.actioncolumns[j]).append("' />");
                    var cell = new TableCell(new Array(btnHtml.toString()), row.header, row.footer);
                    cell.setId(row.getCellIdAt(len + j));
                    cell.setStyle(new Style("#" + cell.getId(), []));
                    cell.className = this.getTableCellClass();
                    row.tableCells.push(cell);
                }
            }

        }


///textcolumns
        for (var i = this.rows.length - data.length; i < this.rows.length; i++) {
            var row = this.rows[i];

            var len = row.tableCells.length;
            for (var j = 0; j < this.textcolumns.length; j++) {

                if (i === 0) {
                    var cell = new TableCell(this.textcolumns[j], row.header, row.footer);
                    cell.setId(row.getCellIdAt(len + j));
                    cell.setStyle(new Style("#" + cell.getId(), []));



                    cell.className = this.getTableCellClass();
                    //cell.addStyle("max-width", "calc( 100% / " + row.tableCells.length + "  )");

                    row.tableCells.push(cell);
                } else {
                    var textFieldHtml = new StringBuffer("<input type='text' class='").append(this.getTableCellTextFieldTypeClass()).append(" ")
                            .append(this.getTableCellTextFieldColumnClass(len + j)).append("' value='").append(this.textcolumns[j]).append("' />");
                    var cell = new TableCell(new Array(textFieldHtml.toString()), row.header, row.footer);
                    cell.setId(row.getCellIdAt(len + j));
                    cell.setStyle(new Style("#" + cell.getId(), []));
                    cell.className = this.getTableCellClass();
                    row.tableCells.push(cell);
                }
            }

        }



///selectColumns
        for (var i = this.rows.length - data.length; i < this.rows.length; i++) {
            var row = this.rows[i];

            var len = row.tableCells.length;
            for (var j = 0; j < this.selectcolumns.length; j++) {

                if (i === 0) {
                    var cell = new TableCell(Object.keys(this.selectcolumns[j])[0], row.header, row.footer);
                    cell.setId(row.getCellIdAt(len + j));
                    cell.setStyle(new Style("#" + cell.getId(), []));



                    cell.className = this.getTableCellClass();
                    //cell.addStyle("max-width", "calc( 100% / " + row.tableCells.length + "  )");

                    row.tableCells.push(cell);
                } else {


                    var selectHtml = new StringBuffer('<select class="').append(this.getTableCellSelectTypeClass()).append(" ")
                            .append(this.getTableCellSelectColumnClass(len + j)).append('" >');

                    for (var k = 0; k < this.selectcolumns[j].length; k++) {
                        selectHtml.append("<option value='").append(k + "'>").append(this.selectcolumns[j][k]).append("</option>");
                    }
                    selectHtml.append("</select>");



                    var cell = new TableCell(new Array(selectHtml.toString()), row.header, row.footer);
                    cell.setId(row.getCellIdAt(len + j));
                    cell.setStyle(new Style("#" + cell.getId(), []));
                    cell.className = this.getTableCellClass();
                    row.tableCells.push(cell);


                }
            }

        }




        this.notifyDataSetChanged();

    }

};

/**
 * Only use this when the table has been attached to the DOM.
 * @param {type} column A column of checkboxes
 * @param {function} listenerFunction The function.
 * @returns {undefined}
 */
InputTable.prototype.setCheckListener = function (column, listenerFunction) {

    var className = this.getTableCellCheckBoxColumnClass(column);
    var matchingElems = document.getElementsByClassName(className);

    if (matchingElems.length === 0) {
        console.log("No check-items found!... for class: "+className+" on column: "+column);
        return;
    }

    var self = this;
    var fun = function (index) {
        var id = matchingElems[index].parentNode.id;
        self.computeRowAndColumnFromCellId(id);
        listenerFunction();
    };

    for (var i = 0; i < matchingElems.length; i++) {
        var checkbox = matchingElems[i];
        checkbox.addEventListener('change', fun.bind(null, i));
    }

};


/**
 * 
 * @param {type} row The row of the textfield
 * @param {type} column The column of the textfield
 * @param {type} text The place holder
 * @returns {undefined}
 */
InputTable.prototype.setTextFieldPlaceholder = function (row, column, text) {


    if ((typeof row !== 'undefined' && typeof row === 'number') &&
            (typeof column !== 'undefined' && typeof column === 'number') && typeof text === 'string') {

        var id = this.id + "_" + row + "_" + column;
        var td = document.getElementById(id);
        if (td !== null) {
            var textfield = td.childNodes[0];
            textfield.placeholder = text;
        }

    }



};

/**
 * 
 * Only use this when the table has been attached to the DOM.
 * @param {type} column A column of textfields.
 * @param {function} listenerFunction The function. 
 * @returns {undefined}
 */
InputTable.prototype.setTextFieldEnterPressedListener = function (column, listenerFunction) {

    var className = this.getTableCellTextFieldColumnClass(column);
    var matchingElems = document.getElementsByClassName(className);

    if (matchingElems.length === 0) {
        console.log('No textfields found');
        return;
    }

    var self = this;
    var fun = function (index) {
        var id = matchingElems[index].parentNode.id;
        self.computeRowAndColumnFromCellId(id);
        listenerFunction();
    };

    for (var i = 0; i < matchingElems.length; i++) {
        var field = matchingElems[i];
        field.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                fun.bind(null, i);
            }
        });
    }

};


/**
 * 
 * Only use this when the table has been attached to the DOM.
 * @param {type} column A column of buttons.
 * @param {function} listenerFunction The function. 
 * @returns {undefined}
 */
InputTable.prototype.setClickListener = function (column, listenerFunction) {

    var className = this.getTableCellButtonColumnClass(column);
    var matchingElems = document.getElementsByClassName(className);

    if (matchingElems.length === 0) {
        console.log('No buttons found');
        return;
    }

    var self = this;
    var fun = function (index) {
        var id = matchingElems[index].parentNode.id;
        self.computeRowAndColumnFromCellId(id);
        listenerFunction();
    };

    for (var i = 0; i < matchingElems.length; i++) {
        var btn = matchingElems[i];
        btn.addEventListener('click', fun.bind(null, i));
    }

};



/**
 * 
 * Only use this when the table has been attached to the DOM.
 * @param {type} column A column of html select(dropdowns) items.
 * @param {function} listenerFunction The function. 
 * @returns {undefined}
 */
InputTable.prototype.setSelectListener = function (column, listenerFunction) {



    var className = this.getTableCellSelectColumnClass(column);
    var matchingElems = document.getElementsByClassName(className);

    if (matchingElems.length === 0) {
        console.log('No html selects found');
        return;
    }

    var self = this;
    var fun = function (index) {
        var id = matchingElems[index].parentNode.id;
        self.computeRowAndColumnFromCellId(id);
        listenerFunction();
    };

    for (var i = 0; i < matchingElems.length; i++) {
        var select = matchingElems[i];
        select.addEventListener("change", function (event) {
            fun.bind(null, i);
        }, false);
    }

};


InputTable.prototype.computeRowAndColumnFromCellId = function (id) {


    if (id && typeof id === 'string') {


        var countUnderScore = 0;
        var i = 0;
        for (i = id.length - 1; i >= 0; i--) {
            if (id.substring(i, i + 1) === "_") {
                countUnderScore++;
            }
            if (countUnderScore === 2) {
                break;
            }
        }
        var activeArea = id.substring(i + 1, id.length).split("_");


        this.clickedRow = parseInt(activeArea[0]);
        this.clickedColumn = parseInt(activeArea[1]);



    }

};


InputTable.prototype.checkBox = function (row, column, check) {


    if ((row && typeof row === 'number') && (column && typeof column === 'number') && typeof check === 'boolean') {

        var id = this.id + "_" + row + "_" + column;
        var td = document.getElementById(id);
        if (td !== null) {
            var checkbox = td.childNodes[0];
            checkbox.checked = check;
        }

    }

};