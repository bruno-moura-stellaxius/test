"use strict";

/**
 * @function beforeSaveAsync
 * @this BoMyCaseDetail
 * @kind "businessobject"
 * @async
 * @namespace CUSTOM
 * @param {Object} context
 * @returns promise
 */
function beforeSaveAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var promise=when.resolve(context);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}