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
 * @function mySubmitOrderForApproval
 * @this BoOrder
 * @kind businessobject
 * @namespace CUSTOM
 * @param {String} approvalType
 * @param {String} myManualRequestComment
 */
function mySubmitOrderForApproval(approvalType, myManualRequestComment){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var approvalNoteOnOrder = me.getMyApprovalNote();
    var approvalCategory = me.getMyApprovalCategory();
    
    if(approvalType == 'SalesOrgMinSplitValue'){
      if(approvalCategory.indexOf('Delivery Rule') == -1 && Utils.isEmptyString(approvalCategory)){
        approvalCategory = 'Delivery Rule';
      } else if(!Utils.isEmptyString(approvalCategory) && approvalCategory.indexOf('Delivery Rule') == -1) {
          approvalCategory = approvalCategory + ';' + 'Delivery Rule';
      }
      me.setMyApprovalCategory(approvalCategory);
      approvalNoteOnOrder = approvalNoteOnOrder + " \n" + me.getMyApprovalNoteToAdd();
      me.setMyApprovalNote(approvalNoteOnOrder);
    }
    if(approvalType == 'ManualRequest'){
      if(Utils.isDefined(myManualRequestComment) && Utils.isDefined(myManualRequestComment.myManualRequestComment) && !Utils.isEmptyString(myManualRequestComment.myManualRequestComment)){
        if(approvalCategory.indexOf('Manual Request') == -1 && Utils.isEmptyString(approvalCategory)){
          approvalCategory = 'Manual Request';
        } else if(!Utils.isEmptyString(approvalCategory) && approvalCategory.indexOf('Manual Request') == -1) {
            approvalCategory = approvalCategory + ';' + 'Manual Request';
        }
        me.setMyApprovalCategory(approvalCategory);
        me.setMyManualRequestComment(myManualRequestComment.myManualRequestComment);
        //me.setPhase('Under Processing');  
      }
    }
    if(approvalType == 'TenderIdentificationCode'){
      if(approvalCategory.indexOf('TenderIdentificationCode') == -1 && Utils.isEmptyString(approvalCategory)){
        approvalCategory = 'TenderIdentificationCode';
      } else if(!Utils.isEmptyString(approvalCategory) && approvalCategory.indexOf('TenderIdentificationCode') == -1) {
          approvalCategory = approvalCategory + ';' + 'TenderIdentificationCode';
      }
      me.setMyApprovalCategory(approvalCategory);
      approvalNoteOnOrder = approvalNoteOnOrder + " \n" + me.getMyApprovalNoteToAdd();
      me.setMyApprovalNote(approvalNoteOnOrder);
      //me.setPhase('Under Processing');  
    }
    if(approvalType == 'Exchange'){
        if(approvalCategory.indexOf('Exchange') == -1 && Utils.isEmptyString(approvalCategory)){
          approvalCategory = 'Exchange';
        } else if(!Utils.isEmptyString(approvalCategory) && approvalCategory.indexOf('Exchange') == -1) {
            approvalCategory = approvalCategory + ';' + 'Exchange';
        }
        me.setMyApprovalCategory(approvalCategory);
        approvalNoteOnOrder = approvalNoteOnOrder + " \n" + me.getMyApprovalNoteToAdd();
        me.setMyApprovalNote(approvalNoteOnOrder);
        //me.setPhase('Under Processing');  
    }

    if(approvalType == 'Quota'){
      if(approvalCategory.indexOf('Quota') == -1 && Utils.isEmptyString(approvalCategory)){
        approvalCategory = 'Quota';
      } else if(!Utils.isEmptyString(approvalCategory) && approvalCategory.indexOf('Quota') == -1) {
          approvalCategory = approvalCategory + ';' + 'Quota';
      }
      me.setMyApprovalCategory(approvalCategory);
      approvalNoteOnOrder = approvalNoteOnOrder + " \n" + me.getMyApprovalNoteToAdd();
      me.setMyApprovalNote(approvalNoteOnOrder);
      //me.setPhase('Under Processing');  
  }
 
  if(approvalType == 'PreSales'){
    if(approvalCategory.indexOf('Policy Rule') == -1 && Utils.isEmptyString(approvalCategory)){
      approvalCategory = 'Policy Rule';
    } else if(!Utils.isEmptyString(approvalCategory) && approvalCategory.indexOf('Policy Rule') == -1) {
        approvalCategory = approvalCategory + ';' + 'Policy Rule';
    }
    me.setMyApprovalCategory(approvalCategory);
    approvalNoteOnOrder = approvalNoteOnOrder + " \n" + me.getMyApprovalNoteToAdd();
    me.setMyApprovalNote(approvalNoteOnOrder);
  }
 
  if(approvalType == 'Free/Sample Products'){
    if(approvalCategory.indexOf('Free/Sample Products') == -1 && Utils.isEmptyString(approvalCategory)){
      approvalCategory = 'Free/Sample Products';
    } else if(!Utils.isEmptyString(approvalCategory) && approvalCategory.indexOf('Free/Sample Products') == -1) {
        approvalCategory = approvalCategory + ';' + 'Free/Sample Products';
    }
    me.setMyApprovalCategory(approvalCategory);
    approvalNoteOnOrder = approvalNoteOnOrder + " \n" + me.getMyApprovalNoteToAdd();
    me.setMyApprovalNote(approvalNoteOnOrder);
  }
  if(approvalType == 'MonitoredCustomer'){
    if(approvalCategory.indexOf('MonitoredCustomer') == -1 && Utils.isEmptyString(approvalCategory)){
      approvalCategory = 'MonitoredCustomer';
    } else if(!Utils.isEmptyString(approvalCategory) && approvalCategory.indexOf('MonitoredCustomer') == -1) {
        approvalCategory = approvalCategory + ';' + 'MonitoredCustomer';
    }
    me.setMyApprovalCategory(approvalCategory);
    approvalNoteOnOrder = approvalNoteOnOrder + " \n" + me.getMyApprovalNoteToAdd();
    me.setMyApprovalNote(approvalNoteOnOrder);
  }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}