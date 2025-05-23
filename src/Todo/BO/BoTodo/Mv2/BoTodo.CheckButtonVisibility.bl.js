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
 * @function checkButtonVisibility
 * @this BoTodo
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {String} mode
 * @returns visible
 */
function checkButtonVisibility(mode){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var visible = false;    
var nextStates;

var ownerPKey = me.getOwnerPKey();
var responsiblePKey = me.getResponsiblePKey();
var ownerIsResponsible = ownerPKey === responsiblePKey;

var isResponsible = responsiblePKey === ApplicationContext.get('user').getPKey();
var ownerAndResponsibleNotEmptyAndUserIsResponsible = !Utils.isEmptyString(ownerPKey) && !Utils.isEmptyString(responsiblePKey) && isResponsible;
var issuePhase = me.getIssuePhase();

//SF/CASDIF: no workflow in salesforce thats why we emulate it.
if(Utils.isSfBackend())
{
  switch (mode) {

    case "release":
      visible = ownerAndResponsibleNotEmptyAndUserIsResponsible && issuePhase === "initial" && !ownerIsResponsible;
      break;

    case "complete":
      visible = ownerAndResponsibleNotEmptyAndUserIsResponsible && issuePhase != "Completed" && issuePhase != "Cancelled"  && ownerIsResponsible;
      break;

      /*no capture in salesforce because no attachments
      case "capture":
        if (isResponsible && issuePhase !== "Closed" && issuePhase !== "Cancelled") {
          visible = true;
        }
        break;   */
  }
}
else
{
  switch (mode) {

    case "release":
      nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Released");
      if(Utils.isDefined(nextStates[0]) && isResponsible){
        visible = true;
      }
      break;

    case "complete":
      nextStates = me.getBoWorkflow().getNextStatesByStateType(me.getActualStatePKey(), "Closed");
      if(Utils.isDefined(nextStates[0]) && isResponsible){
        visible = true;
      }
      break;

    case "capture":
      if (isResponsible && me.getIssuePhase() !== "Closed" && me.getIssuePhase() !== "Cancelled") {
        visible = true;
      }
      break;  
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return visible;
}