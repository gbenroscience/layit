/* global attrKeys, ListView */

HorizontalListAdapter.prototype = Object.create(ListAdapter.prototype);
HorizontalListAdapter.prototype.constructor = HorizontalListAdapter;
/**
 *
 * @param list The layit List which encapsulates an html list
 * @param callback A function that runs when the adapter has loaded and rendered the list data
 * @constructor
 */
function HorizontalListAdapter(list, callback) {
    ListAdapter.call(this, list, callback);
    this.protoWidth = '0px';
}

/**
 * Fetch all template cells at the beginning
 * @param list The ListView intance that has prototype cells(they are in the list.itemViews array)
 * @param callback Call this function once all template cells have been loaded.
 */
HorizontalListAdapter.prototype.fetchPrototypeCells = function (list, callback) {
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
                const dim = getRootDimensions(xml);
                let w = dim.width;
                let h = dim.height;
                if (self.adapterViewInstanceName === 'GridView') {
                    if (!endsWith(w, "%")) {
                        protoLi.style.width = w;
                    }
                    let liStyle = new Style('ul#' + list.id + " > li", []);
                    liStyle.addFromOptions({
                        width: w
                    });
                    editSelectorInStyleSheet(styleSheet, liStyle);
                }

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

HorizontalListAdapter.prototype.makeCell = function (adapterView , viewType) {
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



    if (this.adapterViewInstanceName === 'ListView') {
        let cellWidth = clone.style.width;
        let cellHeight = clone.style.height;
        li.style.width = cellWidth;
        li.style.height = cellHeight;
    }

    let cloneId = clone.id + "_" + childrenCount;
    clone.setAttribute(attrKeys.id, cloneId);
    renameIds(clone, childrenCount, cloneId);
    li.appendChild(clone);
    htmlElement.appendChild(li);

    return li;
};
