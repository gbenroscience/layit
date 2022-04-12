/* global attrKeys, ListView */

const PROTO_LI_ID = "proto_item";
/**
 *
 * @param list The layit List which encapsulates an html list
 * @param callback A function that runs when the adapter has loaded and rendered the list data
 * @constructor
 */
function ListAdapter(list, callback) {

    if (list && list instanceof ListView) {
        let self = this;
        this.data = null;
        this.adapterViewId = null;
        this.viewTypeCount = 0;
        this.adapterViewInstanceName = list.constructor.name;
        /**
         * Necessary for styling the cells generated from the prototype
         */
        this.protoClassName = null;
        this.viewTemplates = [];// the key is the viewtype , the value is the template to use for that view type
        self.bind(list, callback);
    } else {
        //make sure you call setAdapter on ListView or subclass if you didn't specify list in adapter's constructor
    }

}

ListAdapter.prototype.bind = function (list, callback) {
    if (!list) {
        throw new Error('Please specify a ListView|HorizontalListView|GridView for this adapter');
    }
    if (!(list instanceof ListView)) {
        throw new Error('No ListView|HorizontalListView|GridView specified for this adapter');
    }
    let self = this;
    this.data = list.data;
    this.adapterViewInstanceName = list.constructor.name;
    this.adapterViewId = list.htmlElement.id;
    this.viewTypeCount = list.itemViews.length;
    this.viewTemplates = [];// the key is the viewtype , the value is the template to use for that view type
    this.fetchPrototypeCells(list, function () {
        self.notifyDataSetChanged(list.htmlElement);
        callback();
    });
};

ListAdapter.prototype.protoListItemId = function () {
    return this.adapterViewId + "_li_" + PROTO_LI_ID;
};


/**
 * Uses a quick hack to retrieve the width and height of the root element(<ConstrainLayout/>) in a layit layout
 *  xml document
 * @param {type} layoutXML
 * @returns {undefined}
 */
function getRootDimensions(layoutXML) {

    let index = layoutXML.indexOf("<" + xmlKeys.root);
    let closeTagIndex = layoutXML.indexOf(">", index + xmlKeys.root.length);

    let rootTagString = layoutXML.substring(index, closeTagIndex + 1);

    let arr = new Scanner(rootTagString, false, ["\"", "'", "=", "\r\n", "  "]).scan();
    let w, h;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].trim() === "width") {
            w = arr[i + 1];
        }
        if (arr[i].trim() === "height") {
            h = arr[i + 1];
        }
    }

    return {
        width: w,
        height: h
    };
}
/**
 * Fetch all template cells at the beginning
 * @param list The ListView intance that has prototype cells(they are in the list.itemViews array)
 * @param callback Call this function once all template cells have been loaded.
 */
ListAdapter.prototype.fetchPrototypeCells = function (list, callback) {
    let self = this;
    let itemViews = list.itemViews;
    let load = function (index) {
        let template = itemViews[index];
        let protoLi = document.createElement('li');
        protoLi.setAttribute(attrKeys.id, self.protoListItemId());
        list.htmlElement.appendChild(protoLi);

        getWorkspace({
            layoutName: template,
            bindingElemId: self.protoListItemId(),
            isTemplate: true,
            onLayoutLoaded: function (fileName, xml) {

            },
            onComplete: function (rootView) {
                self.viewTemplates.push(rootView.htmlElement);
                index++;
                if (index < itemViews.length) {
                    load(index);
                } else {
                    protoLi.remove();
                    if (callback) {
                        if (typeof callback === "function") {
                            callback();
                        } else {
                            throw new Error('The callback should be a function!');
                        }
                    } else {
                        throw new Error('Please supply a callback function to indicate when all views have been loaded');
                    }
                }
            }
        });
    };
    load(0);
};

ListAdapter.prototype.makeCell = function (adapterView, viewType) {
    if (typeof viewType === "undefined") {
        throw new Error('Please specify a view type...');
    }
    if (typeof viewType !== "number") {
        throw new Error('The view type should be a number');
    }

    let self = this;
    let htmlElement = adapterView;

    let childrenCount = adapterView.getElementsByTagName("li").length;
    let viewTemplate = self.viewTemplates[viewType];
    let li = document.createElement('li');
    li.setAttribute('id', this.adapterViewId + "_li_" + childrenCount);

    let clone = viewTemplate.cloneNode(true);

        let cellWidth = clone.style.width;
        let cellHeight = clone.style.height;
        li.style.width = cellWidth;
        li.style.height = cellHeight;

    let cloneId = clone.id + "_" + childrenCount;
    clone.setAttribute(attrKeys.id, cloneId);
    renameIds(clone, childrenCount, cloneId);
    li.appendChild(clone);
    htmlElement.appendChild(li);

    return li;
};

/**
 * May be called with or without the html list param.
 * If not called, the method will search for the list in the DOM
 * If you make any changes to the data supplied to this adapter,
 * call this method to refresh the list, so it reflects the updated data.
 * @param {ListView} list 
 */
ListAdapter.prototype.notifyDataSetChanged = function (list) {
    //choose the one that first returns a value. If dev didnt supply the html list, then search for it in the DOM.
    let adapterView = list || document.getElementById(this.adapterViewId);

    adapterView.innerHTML = "";
    this.build(adapterView);
};

ListAdapter.prototype.getItem = function (i) {
    return this.data[i];
};

ListAdapter.prototype.getItemViewType = function (i) {
    return 0;
};

ListAdapter.prototype.getViewTypeCount = function () {
    return this.viewTypeCount;
};
ListAdapter.prototype.isEmpty = function () {
    return this.getCount() === 0;
};

/**
 *
 * @returns {number} The number of items in the dataset we are presenting.
 */
ListAdapter.prototype.getCount = function () {
    return this.data.length;
};
/**
 * Ooverride this to bind(apply) the data to the view
 * @param pos The index where this view will reside on the ul
 * @param view The created customized li
 */
ListAdapter.prototype.bindData = function (pos, view) {

};

/**
 * Upgrade to recyclerview in future
 * @param adapterView The ListView instance
 * @param pos The index of the view in the list
 * @returns {*|HTMLLIElement}
 */
ListAdapter.prototype.getView = function (adapterView, pos) {
    let viewType = this.getItemViewType(pos);
    let li = this.makeCell(adapterView, viewType);
    this.bindData(pos, li);
    return li;
};
/**
 * Build the ListView's cells
 * @param list The ListView instance
 * @returns {*|HTMLLIElement}
 */
ListAdapter.prototype.build = function (list) {
    for (let i = 0; i < this.data.length; i++) {
        let li = this.getView(list, i);
    }
};
/**
 *
 * @param li The parent li of this child view
 * @param viewId The id of the child in the layit xml file.
 * @returns {HTMLElement} The html view for the cell... the direct child of the li
 */
ListAdapter.prototype.getChildView = function (li, viewId) {
    let rootView = li.firstChild;
    let id = rootView.getAttribute(attrKeys.id);
    return document.getElementById(id + "_" + viewId);
};

/**
 *
 * Processes an html node that represents a generated view and produces reusable duplicates with changed ids.
 * A template view is one which can be reused in a list or other recurring structure
 * @param {Node} htmlNode
 * @param {Number} index
 * @param {string} rootNodeId The id of the root node that is the root parent of all the children
 * @returns {undefined}
 */
let renameIds = function (htmlNode, index, rootNodeId) {
    if (htmlNode.hasChildNodes()) {
        let childNodes = htmlNode.childNodes;
        for (let j = 0; j < childNodes.length; j++) {
            let childNode = childNodes[j];
            if (childNode.nodeName !== '#text' && childNode.nodeName !== '#comment') {
                let childId = childNode.getAttribute(attrKeys.id);
                childNode.setAttribute(attrKeys.id, rootNodeId + "_" + childId);
                renameIds(childNode, index + 1);
            }
        }//end for loop
    }
};