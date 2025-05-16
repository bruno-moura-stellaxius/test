"use strict";

///////////////////////////////////////////////////////////////////////////////////////////////
//                 IMPORTANT - DO NOT MODIFY AUTO-GENERATED CODE OR COMMENTS                 //
//Parts of this file are auto-generated and modifications to those sections will be          //
//overwritten. You are allowed to modify:                                                    //
// - the tags in the jsDoc as described in the corresponding section                         //
// - the function name and its parameters                                                    //
// - the function body between the insertion ranges                                          //
//         "Add your customizing javaScript code below / above"                              //
//                                                                                           //
// NOTE:                                                                                     //
// - If you have created PRE and POST functions, they will be executed in the same order     //
//   as before.                                                                              //
// - If you have created a REPLACE to override core function, only the REPLACE function will //
//   be executed. PRE and POST functions will be executed in the same order as before.       //
//                                                                                           //
// - For new customizations, you can directly modify this file. There is no need to use the  //
//   PRE, POST, and REPLACE functions.                                                       //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Use the following jsDoc tags to describe the BL function. Setting these tags will
 * change the runtime behavior in the mobile app. The values specified in the tags determine
 * the name of the contract file. The filename format is “@this . @function .bl.js”.
 * For example, LoVisit.BeforeLoadAsync.bl.js
 * -> function: Name of the businessLogic function.
 * -> this: The LO, BO, or LU object that this function belongs to (and it is part of the filename).
 * -> kind: Type of object this function belongs to. Most common value is "businessobject".
 * -> async: If declared as async then the function should return a promise.
 * -> param: List of parameters the function accepts. Make sure the parameters match the function signature.
 * -> module: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.
 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 * @function myCancelOrderAndSplits
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CUSTOM
 * @returns promise
 */
function myCancelOrderAndSplits(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
var promise = when.resolve();
if (!me.myIsSplitOrder && me.boOrderMeta.id != "Exchange") {
  promise = BoFactory.loadListAsync("LoMyOrderSplits", { "mainOrderPKey": me.getPKey()})
  .then(function (loMyOrderSplits) {
    let deferreds = [];
    if (Utils.isDefined(loMyOrderSplits)) {
      var splits = loMyOrderSplits.getAllItems();
      for (var i = 0; i < splits.length; i++ ) {
        var jsonQuery = {};
        jsonQuery.params = [];
        jsonQuery.params.push({
          "field" : "pKey",
          "value" : splits[i].pKey
        });
        jsonQuery.params.push( {
          "field" : "myIsSplitOrder", 
          "value": true
        });
        jsonQuery.params.push({
          "field" : "isCanceling",
          "value" : 1
        });
        deferreds.push(BoFactory.loadObjectByParamsAsync("BoOrder", jsonQuery));
      }
    }
    return when.all(deferreds);
  }).then (function(allBoOrders) {
    let deferreds = []; 
    me.setPhase("Canceled");
    me.cancelingSplits = true; // Avoid a call to mySaveSplits, we're already saving them
    deferreds.push(Facade.saveObjectAsync(me));
    if (Utils.isDefined(allBoOrders) && allBoOrders.length > 0 ) {
      me.loMyOrderSplits = allBoOrders;
      for (var i = 0; i < allBoOrders.length; i++) {
        allBoOrders[i].setPhase("Canceled");
        deferreds.push(Facade.saveObjectAsync(allBoOrders[i]));
      }
    }

    return when.all(deferreds);
  }).then(function() {
    return Facade.commitTransaction();
  });
} else {
  me.setPhase("Canceled");
  promise = Facade.saveObjectAsync(me).then(function() { 
    return Facade.commitTransaction();
  });
}

return promise;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////


}