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
 * @function myCheckOrderValidation
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CUSTOM
 
 */
function myCheckOrderValidation(){
    var me = this;
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //add only blocking messages here
    var promise;
    var messageCollector = new MessageCollector();
    var buttonValues = {};
    buttonValues[Localization.resolve("OK")] = "ok";
    if (me.boOrderMeta.id != "Exchange" && (me.myIsOrderChanged || me.getPricingDate() != Utils.createAnsiDateTimeToday())) {
      var messageCollector = new MessageCollector();
      var newError = {
        "level": "error", 
        "objectClass": "BoOrder", 
        "messageID": "CasSdoMyOrderValidationMessage",
        "messageParams": {}
      };
      messageCollector.add(newError);
    } else if (me.boOrderMeta.id != "Exchange") {
      for (let i = 1; i <= 6; i++) {
        const splitDate = me[`myDDSplit${i}`];
        const billTo = me[`myBillTo${i}`];
        const shipTo = me[`myShipTo${i}`];
        const deliverTo = me[`myDeliverTo${i}`];
        const splitType = me[`myType${i}`];
        const wholesaler = me[`myWholesalerS${i}`];

        for (let j = 0; j < me.getLoItems().getAllItems().length; j++){
          var liOrderItem = me.getLoItems().getAllItems()[j];
          // Combined Validation with immediate throw on error
          if ((liOrderItem[`mySplit${i}Q`] > 0 &&
            ((splitDate && billTo == ' ') ||
            (splitDate && splitType == 'Transfer' &&
            wholesaler == ' ') ||
            (splitDate && shipTo == ' ')))) {
            if (messageCollector.getCount() == 0) {
              var newError = {
                "level": "error", 
                "objectClass": "BoOrder", 
                "messageID": "CasSdoMyOrderSplitValidationMessage",
                "messageParams": {}
              };
              messageCollector.add(newError);
              break;
            }
          }
        }
      }
    } 
  
    if(!messageCollector.containsNoErrors()){
      var messages = messageCollector.getMessages().join("<br>");
      promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Error"), messages, buttonValues).then(function (result) {
        return result;
      });
    } else
    {
      promise = when.resolve("1");
    }
    return promise;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}