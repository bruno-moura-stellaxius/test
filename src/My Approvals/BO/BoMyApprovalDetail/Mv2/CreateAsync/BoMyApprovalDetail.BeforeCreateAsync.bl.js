"use strict";
/**
 * @function beforeCreateAsync
 * @this BoMyApprovalDetail
 * @kind "businessobject"
 * @async
 * @namespace CUSTOM
 * @param {Object} context
 * @returns promise
 */
function beforeCreateAsync(context){
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