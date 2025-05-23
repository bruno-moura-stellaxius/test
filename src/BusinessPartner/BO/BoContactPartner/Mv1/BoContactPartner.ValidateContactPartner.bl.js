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
 * @function validateContactPartner
 * @this BoContactPartner
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {messageCollector} messageCollector
 */
function validateContactPartner(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
if (Utils.isEmptyString(me.getLastName()) && me.getObjectStatus() !== STATE.PERSISTED){
  messageCollector.add({
    "level": "error", 
    "objectClass": "BoContactPartner", 
    "messageID": "CasBpaMainContactPartnerLastNameMustNotBeEmpty",
    "messageParams": {}
  });
}

var email1 = me.getEmail1();
if (me.getEmailEditable() == '1' && !Utils.isEmptyString(email1) && !SalesforceTools.isValidEmail(email1))
{
  messageCollector.add({
    "level": "error", 
    "objectClass": "BoContactPartner", 
    "messageID": "CasBpaMainContactPartnerEmailInvalid",
    "messageParams": {}
  });
}
var email2 = me.getMyEmail2();
if (me.getMyEmail2Editable() == '1' && !Utils.isEmptyString(email2) && !SalesforceTools.isValidEmail(email2))
{
  messageCollector.add({
    "level": "error", 
    "objectClass": "BoContactPartner", 
    "messageID": "CasBpaMainContactPartnerEmail2Invalid",
    "messageParams": {}
  });
}

var currentPContext = Framework.getProcessContext();
if (currentPContext.myContactsForDuplicateCheck != null) {
  var myContactsForDuplicateCheck = currentPContext.myContactsForDuplicateCheck._all;
  for(var i = 0; i < myContactsForDuplicateCheck.length; i++) {
    var existingCon = myContactsForDuplicateCheck[i];
    if( me.pKey!= existingCon.pKey && me.firstName == existingCon.firstName && me.lastName == existingCon.lastName && me.email1 == existingCon.email1 && me.phone1 == existingCon.phone1 ){
      messageCollector.add({
        "level": "warning", 
        "objectClass": "BoContactPartner", 
        "messageID": "CasBpaMyContactPartnerDuplicate",
        "messageParams": {}
      });
      break;
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}