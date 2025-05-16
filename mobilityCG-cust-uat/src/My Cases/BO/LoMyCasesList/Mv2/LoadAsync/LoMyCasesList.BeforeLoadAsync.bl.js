"use strict";

/**
 * @function beforeLoadAsync
 * @this LoMyCasesList
 * @kind "businessobject"
 * @async
 * @namespace CUSTOM
 * @param {Object} context
 * @returns promise
 */
function beforeLoadAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var jsonParams = context.jsonQuery.params;
    jsonParams.push({
      "field" : "UserPKey",
      "operator" : "EQ",
      "value" : ApplicationContext.get('user').getPKey()
    });
  
    var promise=when.resolve(context);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}