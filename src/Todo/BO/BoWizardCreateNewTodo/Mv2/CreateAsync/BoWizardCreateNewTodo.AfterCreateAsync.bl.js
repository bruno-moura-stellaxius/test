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
 * @function afterCreateAsync
 * @this BoWizardCreateNewTodo
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
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
    
var pKey = PKey.next();
me.setPKey(pKey);
me.getLuUser().getACL().addRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);

// if (me.getLuSvcRequestMeta().getIsPrivate() == '0') {
//   me.getLuUser().getACL().addRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
// }
// else {                    
//   me.getLuUser().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
// }
me.getLuUser().setName(ApplicationContext.get('user').getName());
me.getLuUser().setPKey(ApplicationContext.get('user').getPKey());
if (Utils.isDefined(context.jsonQuery.cardDate)) {
  //Creating new task from user cockpit
  var dCardDate = Utils.convertAnsiDate2Date(context.jsonQuery.cardDate);
  dCardDate.setHours(0, 0, 0, 0);
  me.setDueDate(dCardDate);
} else{
  //Creating new task through dashboard
  var dToday = Utils.createDateToday();
  dToday.setHours(0, 0, 0, 0);
  me.setDueDate(dToday);
}
if(Utils.isDefined(context.jsonQuery.copy) && context.jsonQuery.copy) {
  me.setText(context.jsonQuery.originalObject.getText());
}
else {
  me.setText("");
}
if(Utils.isDefined(context.jsonQuery.myRelatedTo) && context.jsonQuery.myRelatedTo) {
  me.luMyRelatedTo.pKey = context.jsonQuery.myRelatedTo;
  me.luMyRelatedTo.name = context.jsonQuery.myRelatedToName;
// For the moment, todo creation is only made from the My Day page, or from the Visit page
// so if a relatedTo is provided, we know it's a visit
  me.luMyRelatedToType.pKey = "visit";
  me.luMyRelatedToType.name = Localization.resolve("RelatedToType_VisitId");
  me.getLuMyRelatedToType().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.EDIT);
  me.getLuMyRelatedTo().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.EDIT);
} else {
  me.luMyRelatedToType.pKey = "none";
  me.luMyRelatedToType.name = Localization.resolve("RelatedToType_NoneId");
}
me.setObjectStatus(STATE.NEW);
var promise = when.resolve(me);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}