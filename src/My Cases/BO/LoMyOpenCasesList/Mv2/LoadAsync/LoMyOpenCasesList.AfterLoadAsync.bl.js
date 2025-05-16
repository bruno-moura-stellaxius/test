"use strict";

/**
 * @function afterLoadAsync
 * @this LoMyOpenCasesList
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

    if (context.jsonQuery && context.jsonQuery.fromCockpit) {
      var noOfCases = 5;
      if (Utils.isPhone()) {
        noOfCases = 3;
      }

      if (me.getAllItemsCount() > noOfCases) {
        let items = me.getAllItems().splice(0, noOfCases);
        me.removeAllItems();
        me.addItems(items);
      }
    }

    var promise=when.resolve(result);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}