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
 * @function loadAsync
 * @this LoOrderOverview
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} jsonParams
 * @returns promise
 */
function loadAsync(jsonParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
// Set appropriate advanced search profile
if (Utils.isDefined(jsonParams.callCustomerPKey) && !Utils.isEmptyString(jsonParams.callCustomerPKey)){
  // Take profile for visit navigation
  jsonParams.params.push({
    "field" : "asoName",
    "value" : "AsoOrderCallOverview"
  });    
}
else{
  // Stand alone mode
  jsonParams.params.push({
    "field" : "asoName",
    "value" : "AsoOrderOverview"
  });
}
 
if ( !(jsonParams.myInitialDeliveryFilterApplied == "1") &&
  (jsonParams.myFutureOrPastDelivery == "PAST" || 
   jsonParams.myFutureOrPastDelivery == "FUTURE")) {
  if (jsonParams.myFutureOrPastDelivery == "FUTURE") {
    jsonParams.params.push({
      "field" : "deliveryDateComp",
      "value" : "GT"
    });
  } else if (jsonParams.myFutureOrPastDelivery == "PAST") {
    jsonParams.params.push({
      "field" : "deliveryDateComp",
      "value" : "LE"
    });
  }
  jsonParams.params.push({
    "field" : "deliveryDate",
    "value" : Utils.createAnsiToday()
  });
  if(jsonParams.phaseFilterFromMyDayPage){
    jsonParams.params.push({
      "field" : "phaseFilterFromMyDayPage",
      "value" : "1"
    });
  }
  // Once applied the initial filter, make sure it is not applied in future invocations
  jsonParams.params.push({"field": "myInitialDeliveryFilterApplied", "value": "1"});
}

var promise = me.addAsoInformation(jsonParams).then(
  function() {
    return Facade.getListAsync(LO_ORDEROVERVIEW, jsonParams);
  }).then(
  function (items) {
    me.addItems(items, jsonParams);
    var jsonQuerySysSetting = {};
    jsonQuerySysSetting.iD = "CndCpUoMRoundingFactor";
    return BoFactory.loadObjectByParamsAsync("LuSysSettingById", jsonQuerySysSetting);
  }).then(
  function (luSysSettingById) {
    if(Utils.isEmptyString(luSysSettingById.getValue())){
      CP.CalcMatrix.getInstance();
    }else{
      CP.CalcMatrix.getInstance(+luSysSettingById.getValue());
    }
    return me;
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}