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
 * @function getDisplayedSubcomponentName
 * @this BoStoreCockpitHelper
 * @kind businessobject
 * @namespace CORE
 * @param {Object} loItems
 * @param {String} type
 * @returns sDisplayedSubcomponentName
 */
function getDisplayedSubcomponentName(loItems, type){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var sDisplayedSubcomponentName = type;
if( type === "StepX" || !loItems || loItems.getCount() === 0){
  sDisplayedSubcomponentName = "CardNoDataMessageUiPlugin";
}
else if(type == "SurveyExceptions"){
  var notDistributedItems = 0;
  var outOfStockItems = 0;
  var facingMismatchItems = 0;
  var priceMismatchItems = 0;

  loItems.forEach(function(item){
    if(item.hide != "1"){

      if(item.value == "NotDistributed"){
        notDistributedItems++;
      }

      if(item.value == "OutOfStock"){
        outOfStockItems++;
      }

      if(item.targetValue != " " && item.dataWareHouseKey == "Facings" &&
         ((!Utils.isEmptyString(item.targetValue) && item.value!= item.targetValue) || (!Utils.isEmptyString(item.lastValue) && item.value != item.lastValue))){
        facingMismatchItems++;
      }

      if(item.targetValue != " " && item.dataWareHouseKey == "PriceSurvey" &&
         ((!Utils.isEmptyString(item.targetValue) && item.value != item.targetValue) || (!Utils.isEmptyString(item.lastValue) && item.value != item.lastValue))){
        priceMismatchItems++;
      }
    }
  });

  if((notDistributedItems + outOfStockItems + facingMismatchItems + priceMismatchItems) === 0){
    sDisplayedSubcomponentName = "CardNoDataMessageUiPlugin";
  }
  else{
    sDisplayedSubcomponentName = "CardSurveyExceptionsUiPlugin";
  }
}
else if (type == "Pictures") {
  if (!Utils.isDefined(loItems.getLatestLiAttachment())) {
    sDisplayedSubcomponentName = "CardNoDataMessageUiPlugin";
  }
  else {
    sDisplayedSubcomponentName = "CardLatestPictureUiPlugin";
  }
} else if (type == "OrderHistory") {
  var t = "what The hello";
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return sDisplayedSubcomponentName;
}