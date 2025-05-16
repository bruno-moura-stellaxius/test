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
 * @function myCheckPreSalesMinQtyValidation
 * @this BoOrder
 * @kind businessobject
 * @namespace CUSTOM
 */
function myCheckPreSalesMinQtyValidation(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////    
    var promise;
    var splitQtyError = false;
      for (var i = 1; i <= 6 && !splitQtyError; i++) {
        var splitQuantityKey = 'mySplit' + i + 'Q';
        var myOrderItems = me.loItems.getAllItems();
        for (var j = 0; j < myOrderItems.length && !splitQtyError; j++) {
          var orderItem = myOrderItems[j];
          if (orderItem[splitQuantityKey] > 0) {
            if ("Direct" == me['myType'+i]) {
              if (orderItem[splitQuantityKey] < orderItem.myDirectMinQuantity) {
                splitQtyError = true;
                orderItem['myItemApprovalNote'+i] = (orderItem['myApprovalNote'] + '\nItem does not fulfil minimum direct split quantity of ' + orderItem.myDirectMinQuantity);
              }
            } else if ("Transfer" == me['myType'+i]) {
              if (orderItem[splitQuantityKey] < orderItem.myTransferMinQuantity) {
                orderItem['myItemApprovalNote'+i] = (orderItem['myApprovalNote'] + '\nItem does not fulfil minimum transfer split quantity of ' + orderItem.myTransferMinQuantity);
                splitQtyError = true;
              }
            }
          }
        }
      }
      if (splitQtyError) {
        let approvalCategory = me.getMyApprovalCategory();
          if(approvalCategory.indexOf('Delivery Rule') == -1 && Utils.isEmptyString(approvalCategory)){
            approvalCategory = 'Delivery Rule';
          } else if(!Utils.isEmptyString(approvalCategory) && approvalCategory.indexOf('Delivery Rule') == -1) {
              approvalCategory = approvalCategory + ';' + 'Delivery Rule';
          }
          me.setMyApprovalCategory(approvalCategory);
          me.setMyApprovalNote(me.getMyApprovalNote() + '\nOne or more Item(s) do not fulfil minimum split quantity.'); 
      }

      if(me.boOrderMeta.id == "PreSales" ){
        var messageCollector = new MessageCollector();
        var approvalNote = '';
        var buttonValues = {};
        buttonValues[Localization.resolve("No")] = "no";
        buttonValues[Localization.resolve("Yes")] = "yes";
        var myOrderItems = me.loItems.getAllItems();
        for (var i = 0; i < 6; i++) {
          if (i == 0) {
            continue;
          }
          var totalSplitQuantity = 0;
          var totalSplitValue = 0;
  
          // Sum up mySplit(i+1)Q for all order items
          for (var j = 0; j < myOrderItems.length; j++) {
            var splitQuantityKey = 'mySplit' + (i) + 'Q';
            if (myOrderItems[j][splitQuantityKey] && isFinite(myOrderItems[j][splitQuantityKey])) {
                totalSplitQuantity += myOrderItems[j][splitQuantityKey];
            }
          }
  
          // Compare the total with the corresponding myPreSalesMinQuantity value
          var preSalesMinQuantityKey = 'myPreSalesMinQuantity' + (i);
          var preSalesMinValueKey = 'myPreSalesMinValue' + (i);

          if (totalSplitQuantity < me[preSalesMinQuantityKey] && isFinite(me[preSalesMinQuantityKey]) || (isFinite(me['mySplitTotal'+(i)]) && me['mySplitTotal'+(i)] < me[preSalesMinValueKey])) {
            newError = {
              "level": "error",
              "objectClass": "BoOrder",
              "messageID": "CasSdoMyPreSalesMinQtyValidation",
              "messageParams": {"splitNo": i, "minQty": me['myPreSalesMinQuantity'+(i)], "minValue": me['myPreSalesMinValue'+(i)]}
            };
            messageCollector.add(newError);
          }
        }
  if (!messageCollector.containsNoErrors()) {
    var messages = messageCollector.getMessages().join("<br>");
    messages = messages + '\n' + Localization.resolve('CasSdoMyAskSubmitForApproval');
    approvalNote = messageCollector.getMessages().join("\n");
    promise = MessageBox.displayMessage(
      Localization.resolve("MessageBox_Title_Error"),
      messages,
      buttonValues
    ).then(function (result) {
      if(result == "yes"){
        me.setMyApprovalNoteToAdd(Localization.resolve('CasSdoMyPreSalesQtyValueDeviation'));
      }
      return result;
    });
  } else {
    promise = when.resolve("1");
  }
} else {
  promise = when.resolve("1");
}
return promise;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}