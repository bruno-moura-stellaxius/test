"use strict";

/**
 * @function afterLoadAsync
 * @this BoMyCaseDetail
 * @kind "businessobject"
 * @async
 * @namespace CUSTOM
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterLoadAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    function createProxy(object) {
        return new Proxy (object, {
            get(target, prop) {
                if (prop in target) {
                    if (prop.endsWith('Time')) {
                        // Time properties can have values even if
                        // the corresponding date is not filled
                        // Check if we have an empty date (==min date in the framework)
                        // so we can return an empty time as well
                        var dateProp = prop.replace('Time', 'Date');
                        if (target[dateProp] == '1700-01-01') {
                            return '';
                        }
                    }
                    var value = target[prop];
                    if (Utils.isEmptyString(target[prop])) {
                        return 'N/A';
                    }
                    if (target[prop].isModel && target[prop].proxy == null) {
                        target[prop].proxy = createProxy(target[prop]);
                    }
                    return target[prop];
                } else {
                    // Property not present at all
                    return 'N/A';
                }
            }
        });
    }
    me.proxy = createProxy(me);
    var promise=when.resolve(result);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}