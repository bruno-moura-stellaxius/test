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
 * @function myCheckVisitCompletion
 * @this BoCall
 * @kind businessobject
 * @async
 * @namespace CUSTOM
 * @param {LoCustomerCall} customerCalls Customer's list of visits
 * @param {Object} tasks Tasks related to Visits
 * @returns promise
 */
function myCheckVisitCompletion(customerCalls, tasks){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var promise;

    var NO_ACTION = "No Action";
    var errorFields = [];
    var warningFields = [];

    var currentVisitTime = new Date(
      Utils.convertAnsiDate2Date(me.beginTime).getTime() + 60 * 1000
    );
    var nextMeetingAction = Utils.isEmptyString(
      me.getLuCallMeta().getMyCompleteMeetingFollowUp()
    )
      ? NO_ACTION
      : me.getLuCallMeta().getMyCompleteMeetingFollowUp();
    var taskAction = Utils.isEmptyString(
      me.getLuCallMeta().getMyCompleteMeetingTask()
    )
      ? NO_ACTION
      : me.getLuCallMeta().getMyCompleteMeetingTask();
    var noteAction = Utils.isEmptyString(
      me.getLuCallMeta().getMyCompleteMeetingNote()
    )
      ? NO_ACTION
      : me.getLuCallMeta().getMyCompleteMeetingNote();

    if (nextMeetingAction && NO_ACTION != nextMeetingAction) {
      var nextVisitFound = customerCalls
        .getAllItems()
        .find(
          (visit) =>
            me.getLuCallMeta().getId() == "Joint" ||
            (visit.clbStatus == "Planned" &&
              Utils.convertAnsiDate2Date(visit.myDateFrom) > currentVisitTime)
        );
      AppLog.info("N_MF Error: " + (!nextVisitFound ? "Yes" : "No"));
      if (!nextVisitFound) {
        if ("Required" == nextMeetingAction) {
          errorFields.push(Localization.resolve("CompleteMeeting_Followup"));
        } else {
          warningFields.push(Localization.resolve("CompleteMeeting_Followup"));
        }
      }
    }

    if (taskAction && NO_ACTION != taskAction) {
      AppLog.info(
        "Task Error: " + (!tasks.getAllItems().length > 0 ? "Yes" : "No")
      );
      if (!tasks.getAllItems().length > 0) {
        if ("Required" == taskAction) {
          errorFields.push(Localization.resolve("CompleteMeeting_Task"));
        } else {
          warningFields.push(Localization.resolve("CompleteMeeting_Task"));
        }
      }
    }

    if (noteAction && NO_ACTION != noteAction) {
      AppLog.info(
        "Note Error: " + (Utils.isEmptyString(me.getNote()) ? "Yes" : "No")
      );
      if (Utils.isEmptyString(me.getNote())) {
        if ("Required" == noteAction) {
          errorFields.push(Localization.resolve("CompleteMeeting_Note"));
        } else {
          warningFields.push(Localization.resolve("CompleteMeeting_Note"));
        }
      }
    }

    if (errorFields.length > 0) {
      var buttonValues = {};
      buttonValues[Localization.resolve("OK")] = "ok";
      AppLog.info(JSON.stringify(buttonValues));
      promise = MessageBox.displayMessage(
        Localization.resolve("MessageBox_Title_Error"),
        Localization.resolve("CompleteMeeting_Error_Msg_1") +
          errorFields.join(', ') + '\n' + Localization.resolve("CompleteMeeting_Error_Msg_2"),
        buttonValues
      ).then(function (result) {
        return result;
      });
    } else if(warningFields.length > 0) {
      var buttonValues = {};
      buttonValues[Localization.resolve("OK")] = "yes";
      buttonValues[Localization.resolve("Cancel")] = "no";
      AppLog.info(JSON.stringify(buttonValues));
      promise = MessageBox.displayMessage(
        Localization.resolve("MessageBox_Title_Warning"),
        Localization.resolve("CompleteMeeting_Warning_Msg_1") +
        warningFields.join(', ') + '\n' + Localization.resolve("CompleteMeeting_Warning_Msg_2"),
        buttonValues
      ).then(function (result) {
        return result;
      });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}