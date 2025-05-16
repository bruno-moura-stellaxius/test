"use strict";

/**
 * @function myOpenLibraryItem
 * @this LoMyLibraryList
 * @kind "businessobject"
 * @async
 * @namespace CUSTOM
 * @param {Object} url
 * @returns promise
 */
function myOpenLibraryItem(url){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var url = "https://www.google.com";
    var promise = Facade.startThirdPartyAsync(url,{});
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}