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
 * @function getButtonVisibility
 * @this BoCall
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {String} token
 * @returns visible
 */
function getButtonVisibility(token){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var visible = true;
var bCallIsReadOnly = me.isReadOnly();

// Execute Break Button for initial time cards
// hide button if:
// 1. if there is no open time card available for the logged in user
// 2. if the default break time entry template is not specified for the current time card
// 3. if the call itself represents the default break of the time card (UsrDocMeta.BreakUsrTimeEntryMetaPKey = ClbMeta.UsrTimeEntryMetaPKey)
if (token === "btnBreak"){
  if( !Utils.isDefined(ApplicationContext.get("openTimeCardPKey")) || 
     Utils.isEmptyString(ApplicationContext.get("openTimeCardPKey"))  ||
     !Utils.isDefined(ApplicationContext.get("openTimeCardBreakMetaPKey")) || 
     Utils.isEmptyString(ApplicationContext.get("openTimeCardBreakMetaPKey")) ||
     ApplicationContext.get("openTimeCardBreakMetaPKey") === me.getLuCallMeta().getUsrTimeEntryMetaPKey()
    ) {
    return false;
  } else {
    return true;
  }
}

if(Utils.isDefined(ApplicationContext.get('currentTourPKey')) && 
   !Utils.isEmptyString(ApplicationContext.get('currentTourPKey')) && 
   ApplicationContext.get('currentTourStatus') !== "Running"){
  bCallIsReadOnly=true;
}

switch (token) {
  // Custom Perrigo: Add pictures from Gallery even if call is completed (but not for Abandoned)
  case "btnSelectPicture":
    visible = !bCallIsReadOnly || me.getClbStatus() === "Completed";
  break;

  case "btnComplete":
    visible = !bCallIsReadOnly && Utils.isDefined(me.getBpaMainPKey()) && !Utils.isEmptyString(me.getBpaMainPKey());
    break;

  case "btnBreak":
  case "btnQuestionsAddQuestion":
  case "btnSurveyAddProduct":
  case "btnSurveyScanProduct":
  case "btnRegisterUnknownAsset":
  case "btnScanBarcode":
  case "btnTakePicture":
  case "btnCreateNewDelivery":
  case "btnEditNote":
  case "btnSketch":
  case "btnDeletePicture":
    visible = !bCallIsReadOnly;
    break;

  case "btnTakeNewOrder":
    visible = !(me.luCallMeta.myNewOrderAvailable == 0 || me.getClbStatus() === "Completed" || me.getClbStatus() === "Abandoned"  || me.getMyVisitStartDate() == Utils.getMinDate() ) ;
    break;
  case "btnCompleteCall":
    visible = !(me.getClbStatus() === "Completed" || me.getClbStatus() === "Abandoned"  || me.getMyVisitStartDate() == Utils.getMinDate() ) ;
    break;
  
  case "myCmpBtnJoint":
    visible = me.getLuCallMeta().getId()=='Joint' && me.getClbStatus() != "Completed";
    break;
  case "btnConfirmCall":
    visible = (me.getClbStatus() === "Unscheduled" || me.getClbStatus() === "Suggested" ) ;
    break;
    case "btnResetToPlannedStateCall":
    visible = (me.getClbStatus() === "Planned" && me.getMyActualStatus() === "InProgress" ) ;
    break;
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return visible;
}