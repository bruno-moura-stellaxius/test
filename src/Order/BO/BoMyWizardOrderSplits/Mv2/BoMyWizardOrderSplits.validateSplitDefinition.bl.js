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
 * @function validateSplitDefinition
 * @this BoMyWizardOrderSplits
 * @kind businessobject
 * @namespace CUSTOM
 * @param {messageCollector} messageCollector
 */
function validateSplitDefinition(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var newError;
let currentDate = Utils.createAnsiDateToday();
let maxDeliveryDate= Utils.addDays2AnsiDate(currentDate, 23);
let minDeliveryDate= Utils.addDays2AnsiDate(currentDate, 2);

if(!Utils.isDefined(me.getDeliveryDate())) {
  newError = {
    "level": "error",
    "objectClass": "BoMyWizardOrderSplits",
    "messageID": "CasWizardDeliveryDateEmpty"
  };
  messageCollector.add(newError);
}
// if(me.myImDeliverySplit == "1" && (me.getDeliveryDate()>maxDeliveryDate || me.getDeliveryDate() <minDeliveryDate)) {
//   newError = {
//     "level": "error",
//     "objectClass": "BoMyWizardOrderSplits",
//     "messageID": "CasWizardDeliveryDateValidationError",
//     "messageParams": {"startDate":Utils.convertAnsiDate2Date(minDeliveryDate).toLocaleDateString(), "endDate":Utils.convertAnsiDate2Date(maxDeliveryDate).toLocaleDateString()}
//   };
//   messageCollector.add(newError);
// }
if (!Utils.isDefined( me.luMySplitType) || Utils.isEmptyString(me.luMySplitType.pKey) ) {
  newError = {
    "level": "error",
    "objectClass": "BoMyWizardOrderSplits",
    "messageID": "CasWizardSplitTypeEmpty"
  };
  messageCollector.add(newError);
} else if (me.luMySplitType.pKey == "Transfer" && ( !Utils.isDefined(me.wholesalerPKey) || Utils.isEmptyString(me.wholesalerPKey) )) {
  newError = {
    "level": "error",
    "objectClass": "BoMyWizardOrderSplits",
    "messageID": "CasWizardWholesalerEmpty"
  };
  messageCollector.add(newError);
}else if ( !Utils.isDefined(me.billToPKey) || Utils.isEmptyString(me.billToPKey) ) {
  newError = {
    "level": "error",
    "objectClass": "BoMyWizardOrderSplits",
    "messageID": "CasWizardBillToEmpty"
  };
  messageCollector.add(newError);
}
else if ( !Utils.isDefined(me.shipToPKey) || Utils.isEmptyString(me.shipToPKey) ) {
  newError = {
    "level": "error",
    "objectClass": "BoMyWizardOrderSplits",
    "messageID": "CasWizardShipToEmpty"
  };
  messageCollector.add(newError);
}


    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}