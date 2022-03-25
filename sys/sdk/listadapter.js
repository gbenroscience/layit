/**
 *
 * @param list The layit List which encapsulates an html list
 * @param callback A function that runs when the adapter has loaded and rendered the list data
 * @constructor
 */
function ListAdapter(list, callback) {
    if (!list) {
        throw new Error('Please specify a CustomList for this adapter');
    }
    if (list.constructor.name !== 'CustomList') {
        throw new Error('No CustomList specified for this adapter');
    }
    let self = this;
    this.data = list.data;
    this.adapterViewId = list.htmlElement.id;
    this.viewTypeCount = list.itemViews.length;
    this.viewTemplates = [];// the key is the viewtype , the value is the template to use for that view type
    this.fetchPrototypeCells(list.itemViews, function () {
        self.notifyDataSetChanged(list.htmlElement);
        callback();
    });
}

/**
 * Fetch all template cells at the beginning
 * @param itemViews An array of xml layout filenames that will be used for the list cells
 * @param callback Call this function once all template cells have been loaded.
 */
ListAdapter.prototype.fetchPrototypeCells = function (itemViews , callback) {
    let self = this;
    let load = function (index) {
        let template = itemViews[index];
        getWorkspace({
            layoutName: template,
            bindingElemId: self.adapterViewId,
            onComplete: function (rootView) {
                self.viewTemplates.push(rootView.htmlElement);
                index++;
                if (index < itemViews.length) {
                    load(index);
                } else {
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
    }
    load(0);
};

ListAdapter.prototype.makeCell = function (viewType) {
    if (typeof viewType === "undefined") {
        throw new Error('Please specify a view type...');
    }
    if (typeof viewType !== "number") {
        throw new Error('The view type should be a number');
    }

    let adapterView = document.getElementById(this.adapterViewId);
    let self = this;
    let htmlElement = adapterView;

    let childrenCount = adapterView.getElementsByTagName("li").length;
    let viewTemplate = self.viewTemplates[viewType];
    let li = document.createElement('li');
    li.setAttribute('id', this.adapterViewId + "_li_" + childrenCount);

    let clone = viewTemplate.cloneNode(true);


    let cellWidth  = clone.style.width;
    let cellHeight = clone.style.height;

    li.style.width = cellWidth;
    li.style.height = cellHeight;

    clone.setAttribute(attrKeys.id , clone.id+"_"+childrenCount);
    renameIds(clone, childrenCount);
    li.appendChild(clone);
    htmlElement.appendChild(li);

    return li;
};

/**
 * May be called with or without the html list param.
 * If not called, the method will search for the list in the DOM
 * If you make any changes to the data supplied to this adapter,
 * call this method to refresh the list, so it reflects the updated data.
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
 * @param pos The index of the view in the list
 * @returns {*|HTMLLIElement}
 */
ListAdapter.prototype.getView = function (pos) {
    let viewType = this.getItemViewType(pos);
    let li = this.makeCell(viewType);
    this.bindData(pos, li);
    return li;
};

ListAdapter.prototype.build = function (list) {
    for (let i = 0; i < this.data.length; i++) {
        let li = this.getView(i);
    }
};
/**
 *
 * @param pos The zero based index of the parent li in the ul
 * @param viewId The id of the child in the layit xml file.
 * @returns {HTMLElement} The html view for the cell... the direct child of the li
 */
ListAdapter.prototype.getChildView = function (pos , viewId) {
return document.getElementById(viewId+'_'+pos);
};

/**
 *
 * Processes an html node that represents a generated view and produces reusable duplicates with changed ids.
 * A template view is one which can be reused in a list or other recurring structure
 * @param {Node} htmlNode
 * @param {Number} index
 * @returns {undefined}
 */
let renameIds = function (htmlNode, index) {
    if (htmlNode.hasChildNodes()) {
        let childNodes = htmlNode.childNodes;
        for (let j = 0; j < childNodes.length; j++) {
            let childNode = childNodes[j];
            if (childNode.nodeName !== '#text' && childNode.nodeName !== '#comment') {
                let childId = childNode.getAttribute(attrKeys.id);
                childNode.setAttribute(attrKeys.id, childId + '_' + index);
                renameIds(childNode, index + 1);
            }
        }//end for loop
    }
};