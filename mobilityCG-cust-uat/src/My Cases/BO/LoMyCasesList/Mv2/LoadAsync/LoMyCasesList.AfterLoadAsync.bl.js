"use strict";

/**
 * @function afterLoadAsync
 * @this LoMyCasesList
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
    
    var promise=when.resolve(result);
    var displayItems = me.getAllItems();
    me.totalCustomerCases = displayItems.length;
    me.cardItems = displayItems.slice(5);
    let currentPContext = Framework.getProcessContext();
    if(currentPContext.customerPKey ){
        me.setFilterArray([ {"accountId" : currentPContext.customerPKey , "op" : "EQ"} ] );
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}