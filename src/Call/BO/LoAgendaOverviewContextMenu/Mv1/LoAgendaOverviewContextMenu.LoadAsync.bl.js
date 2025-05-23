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
 * @this LoAgendaOverviewContextMenu
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
    var dicJsonQuery = Utils.convertDsParamsOldToNew(jsonQuery);
var clbStatus = dicJsonQuery.clbStatus.getId();
var deleteAllowed = dicJsonQuery.deleteAllowed.getId();
var currentUsrMainPKey = ApplicationContext.get('user').getPKey();
var responsiblePKey = dicJsonQuery.responsiblePKey;
var mode = dicJsonQuery.mode;
var myVisitStartDate =Utils.isDefined(dicJsonQuery.myVisitStartDate) ?dicJsonQuery.myVisitStartDate :'' 
var lookupParams = [undefined];
var defereds = [];

var bCallIsReadOnly = clbStatus === "Completed" || clbStatus === "Canceled";

if (!Utils.isEmptyString(dicJsonQuery.bpaMainPKey)) {
  //check management / substitution info for EA-Rights
  var cmiParams = [];
  var cmiQuery = {};

  cmiParams.push({
    "field" : "customerPKey",
    "value" : dicJsonQuery.bpaMainPKey
  });
  cmiParams.push({
    "field" : "referenceDate",
    "value" : dicJsonQuery.referenceDate
  });
  cmiParams.push({
    "field" : "referenceUserPKey",
    "value" : dicJsonQuery.referenceUserPKey
  });
  cmiQuery.params = cmiParams;

  defereds.push(BoFactory.loadObjectByParamsAsync("LuCustomerManagementInfo", cmiQuery).then(
    function (customerManagementInfoLookup) {

    if (Utils.isDefined(customerManagementInfoLookup)) {
      if (customerManagementInfoLookup.getIsSubstituted() == "1") {
        if (customerManagementInfoLookup.getSubstitutedInLeadFollowUpTime() == "1") {
          bCallIsReadOnly = true; 
        }
      }	else if (customerManagementInfoLookup.getHasSubstitute() == "1") {
        if (responsiblePKey === customerManagementInfoLookup.getReferenceUsrMainPKey() && customerManagementInfoLookup.getHasSubstituteInLeadFollowUpTime() === "0") {
          // read only if current user is responsible and being substituted on the call's date
          bCallIsReadOnly = true;
        }
      } else if (customerManagementInfoLookup.getHasSubstitute() === "0") {
        if (responsiblePKey !== customerManagementInfoLookup.getReferenceUsrMainPKey()) {
          // read only if current user is not responsible and not substituting the responsible
          bCallIsReadOnly = true;
        }
      }
    }
  }));
}

if(Utils.isSfBackend())
{
  defereds.push(BoFactory.createObjectAsync("BoSfReplicationCallbacks", {}).then(
    function (sfReplicationCallbacks){
      return sfReplicationCallbacks.isCallOnDemandDataAvailable(dicJsonQuery.pKey, dicJsonQuery.bpaMainPKey);
  }));
}

//dataAvailable will be a boolean in CGCloud (there we use it) and undefined for onPremises (there we don't use it)
var promise = when.all(defereds)
  .then(function(dataAvailable) // <!-- SF/CASDIF End -->
        {
  if(Utils.isDefined(ApplicationContext.get('currentTourPKey')) && 
    !Utils.isEmptyString(ApplicationContext.get('currentTourPKey')) && 
    ApplicationContext.get('currentTourStatus') !== "Running"){

    bCallIsReadOnly = true;
  }
  
  if(dataAvailable.length > 1){
    dataAvailable = dataAvailable[1];
  }

  var isFollowUpCard = mode === "FollowUp";
  var contextMenuItemList = [];
  var menuEntry0 = {
    "id" : "0000001",
    "actionImg" : "ExecuteDarkGrey24",
    "actionId" : "Execute",
    "processEvent" : "Execute",
    "actionVisible" : !isFollowUpCard,
    "actionEnabled" : "1"
  };
  
  var menuEntry1 = {
    "id" : "0000002",
    "actionImg" : "CompleteDarkGrey24",
    "actionId" : "Complete",
    "processEvent" : "Complete",
    "actionVisible" : !isFollowUpCard,
    "actionEnabled" : !bCallIsReadOnly && Utils.isDefined(dicJsonQuery.bpaMainPKey) && !Utils.isEmptyString(dicJsonQuery.bpaMainPKey) && (!Utils.isEmptyString(myVisitStartDate) && !(myVisitStartDate == Utils.getMinDate()))  ? "1" : "0"
  };
  var menuEntry2 = {
    "id" : "0000003",
    "actionImg" : "CancelDarkGrey24",
    "actionId" : "Cancel",
    "processEvent" : "Cancel",
    "actionVisible" : !isFollowUpCard,
    "actionEnabled" : "1"
  };
  var menuEntry3 = {
    "id" : "0000004",
    "actionImg" : "RescheduleDarkGrey24",
    "actionId" : "Reschedule",
    "processEvent" : "Re-Schedule",
    "actionVisible" : "1",
    "actionEnabled" : "1"
  };
  var menuEntry4 = {
    "id" : "0000005",
    "actionImg" : "TrashcanDarkGrey24",
    "actionId" : "Delete",
    "processEvent" : "Delete",
    "actionVisible" : "1",
    "actionEnabled" : "1"
  };
  var menuEntry5 = {
    "id" : "0000006",
    "actionImg" : "InfoDarkGrey24",
    "actionId" : "Info",
    "processEvent" : "Info",
    "actionVisible" : "1",
    "actionEnabled" : "1"
  };
  var menuEntry6 = {
    "id" : "0000007",
    "actionImg" : "TripDarkGrey24",
    "actionId" : "NavigateToCustomer",
    "processEvent" : "NavigateToCustomer",
    "actionVisible" : !isFollowUpCard,
    "actionEnabled" : Utils.isDefined(dicJsonQuery.bpaMainPKey) && !Utils.isEmptyString(dicJsonQuery.bpaMainPKey) ? "1" : "0"
  };

  var menuEntry7 = {
    "id" : "0000008",
    "actionImg" : "CheckBlueGrey24Inv",
    "actionId" : "Confirm",
    "processEvent" : "Confirm",
    "actionVisible" : !isFollowUpCard,
    "actionEnabled" : "0"
  };

  var menuEntry8 = {
    "id" : "0000009",
    "actionImg" : "CheckBlueGrey24Inv",
    "actionId" : "BackToPlanned",
    "processEvent" : "BackToPlanned",
    "actionVisible" : !isFollowUpCard,
    "actionEnabled" : "0"
  };
  if(Utils.isSfBackend())
  {
    menuEntry1.actionEnabled = menuEntry1.actionEnabled == "1" && dataAvailable == "1"  ? "1" : "0";
    menuEntry2.actionEnabled = Utils.isDefined(dicJsonQuery.bpaMainPKey) && !Utils.isEmptyString(dicJsonQuery.bpaMainPKey) ? "1" : "0";
    menuEntry6.actionEnabled = Utils.isDefined(dicJsonQuery.bpaMainPKey) && !Utils.isEmptyString(dicJsonQuery.bpaMainPKey) ? "1" : "0";
  }

  contextMenuItemList.push(menuEntry7);
  contextMenuItemList.push(menuEntry0);
  contextMenuItemList.push(menuEntry8);
  contextMenuItemList.push(menuEntry1);
  contextMenuItemList.push(menuEntry2);
  contextMenuItemList.push(menuEntry3);
  contextMenuItemList.push(menuEntry4);
  contextMenuItemList.push(menuEntry5);
  contextMenuItemList.push(menuEntry6);

  if (deleteAllowed === "0") {
    menuEntry4.actionEnabled = "0";
  }

  if (bCallIsReadOnly) {
    menuEntry1.actionEnabled = "0";
    menuEntry2.actionEnabled = "0";
    menuEntry3.actionEnabled = "0";
    menuEntry4.actionEnabled = "0";
  }

  if(clbStatus =='Unscheduled' || clbStatus =='Suggested'){
    menuEntry0.actionEnabled = "0";
    menuEntry1.actionEnabled = "0";
    menuEntry7.actionEnabled = "1";
  }

  if(clbStatus =='Planned') {
    menuEntry1.actionEnabled = "0";
  }

  if(clbStatus =='Completed') {
    menuEntry0.actionEnabled = "0";
  }

  if(clbStatus =='Planned' && !Utils.isEmptyString(myVisitStartDate) && !(myVisitStartDate == Utils.getMinDate()) && !(myVisitStartDate == Utils.convertAnsiDateTime2AnsiDate(Utils.getMinDate()))){
    menuEntry0.actionEnabled = "0";
    menuEntry8.actionEnabled = "1";
  }
  me.addItems(contextMenuItemList);
  return me;
});
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}