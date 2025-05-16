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
 * -> namespace: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.

 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 *
 * ------- METHOD RELEVANT GENERATOR PARAMETERS BELOW - ADAPT WITH CAUTION -------
 * @function afterCreateAsync
 * @this BoMyOrderSplit
 * @kind businessobject
 * @async
 * @namespace CUSTOM
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterCreateAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var splitIndex = context.jsonQuery.splitIndex;
	if (Utils.isDefined(context.jsonQuery.deliveryDate)) {
        me.setDeliveryDate(context.jsonQuery.deliveryDate);
    }
    // We're "cloning" properties from the original orderItem
    // into the orderItem of the SplitOrder
    var propertiesToCopy = [
        "prdMainPKey", "text1", "prdId", "erpId", "shortId", "taxClassification", 
        "eAN", "price", "category"
    ];
    var deferreds = [];
    if (Utils.isDefined(context.jsonQuery.loItems)) {
        context.jsonQuery.loItems.getAllItems().forEach(function(liOrderItem) {
            // Add LiItems with quantities in their split
            if (liOrderItem['mySplit'+(splitIndex+1)+'Q'] > 0) {
                deferreds.push (
                    // var splitOrderLiItem = BoFactory.instantiate("LiOrderItem"); 
                    BoFactory.createObjectAsync("LiOrderItem", {}).then (function(splitOrderLiItem){
                        propertiesToCopy.forEach(function(propName) {
                            splitOrderLiItem[propName] = liOrderItem[propName];
                        });
                        // Adapt properties that are specific
                        splitOrderLiItem.quantity = liOrderItem['mySplit'+(splitIndex+1)+'Q'];
                        // Set Order Item's reference to the Order
                        splitOrderLiItem.sdoMainPKey = me.pKey;
                        // ...
                        me.loItems.addListItems([splitOrderLiItem]);

                    })

                );
            }
        });
    }

    var promise = when.all(deferreds).then(
        function() { return when.resolve(result); }
    )


    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}