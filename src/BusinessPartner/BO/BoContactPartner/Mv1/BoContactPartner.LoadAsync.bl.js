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
 * @this BoContactPartner
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} jsonQuery
 * @returns promise
 */
function loadAsync(jsonQuery){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
if (!jsonQuery){
  jsonQuery={};
}

var promise = Facade.getObjectAsync(BO_CONTACTPARTNER, jsonQuery).then(
  function (selfJson) {
    me.setProperties(selfJson);
    var picklistCondition = " AND length(trim(code__c)) <= 2";
    if (me.myPrimaryContact) {
      picklistCondition = " AND length(trim(code__c)) > 2";
    }
    return BoFactory.loadListAsync("LoMyMainFunction", {"pl_condition": picklistCondition });
  }).then(
    function(loMyMainFunction) {
      me.setLoMyMainFunction(loMyMainFunction);
      return BoFactory.loadListAsync("LoContactPartnerAddress", me.getQueryBy("referencePKey", me.getPKey()));
  }).then(
  function (loBpaAddressJson) {
    me.setLoContactPartnerAddress(loBpaAddressJson);
    return BoFactory.loadListAsync(LO_CUSTOMERCONTACTPARTNERRELATION, me.getQueryBy("toPKey", me.getPKey()));
  }).then(
  function (loContactPartnerCustomerRelationJson) {
    var newParams = Utils.convertDsParamsOldToNew(jsonQuery);
    if(Utils.isDefined(newParams.customerPKey)){
      // Add Customer to ContactPartner relation
      if(Utils.isSfBackend()){
        me.setAccount(newParams.customerPKey);
      }
      else{
        loContactPartnerCustomerRelationJson.addItem(newParams.customerPKey, me.getPKey());
      }
    }
    
    // Due to differences regarding the validation of emails on the mobile device compared to the salesforce backend,
    // we are checking whether an email is valid as per the mobile device validation upon load.
    // If the email is NOT valid as per the mobile device validation, it will be set to readonly and cannot be changed.
    var email1 = me.getEmail1();  
    var isValidEmail = '1';
    if (!Utils.isEmptyString(email1) && !SalesforceTools.isValidEmail(email1)) {
      isValidEmail = '0';
    }
    me.setEmailEditable(isValidEmail);
    
    var email2 = me.getMyEmail2();  
    var isValidEmail2 = '1';
    if (!Utils.isEmptyString(email2) && !SalesforceTools.isValidEmail(email2)) {
      isValidEmail2 = '0';
    }
    me.setMyEmail2Editable(isValidEmail2);


    me.setLoContactPartnerCustomerRelation(loContactPartnerCustomerRelationJson);
    me.setObjectStatus(STATE.PERSISTED);
    me.setEARights();
    return me;
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}