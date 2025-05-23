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
 * @function esSetHeaderAttributes
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {BoOrder} splittingDoc
 * @param {LiSplittingGroupResult} splittingGroup
 * @returns promise
 */
function esSetHeaderAttributes(splittingDoc, splittingGroup){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();

if (Utils.isDefined(splittingDoc) && Utils.isDefined(splittingGroup)) {

  /*#############################################
  //### Created or patched header attributes  ###
  //###########################################*/
  var pKey = PKey.next();
  splittingDoc.setPKey(pKey);
  splittingDoc.setSplittingParentSdoMainPKey(me.getPKey());

  /*###########################
  //### Pricing information ###
  //###########################*/
  splittingDoc.setGrossTotalValueReceipt(splittingGroup.getGrossTotalValueReceipt());
  splittingDoc.setGrossTotalValue(splittingGroup.getGrossTotalValue());
  splittingDoc.setMerchandiseValueReceipt(splittingGroup.getMerchandiseValueReceipt());
  splittingDoc.setMerchandiseValue(splittingGroup.getMerchandiseValue());
  splittingDoc.setTotalValueReceipt(splittingGroup.getTotalValueReceipt());
  splittingDoc.setTotalValue(splittingGroup.getTotalValue());
  splittingDoc.setMyTotalFreeGoodsValue(splittingGroup.getMyTotalFreeGoodsValue());

  promise = splittingDoc.setPaidAmountReceipt(splittingGroup.getGrossTotalValueReceipt()).then(
    function () {
      if (Utils.isDefined(splittingGroup.getPricingJson())) {
        splittingDoc.setPricingJSON(splittingGroup.getPricingJson());
      }
      if (Utils.isDefined(splittingGroup.getSdoConditions())) {
        splittingDoc.setSdoConditionsJson(JSON.stringify(splittingGroup.getSdoConditions()));
      }
      //invoice id
      var sysNumberParams = [];
      var sysNumberQuery = {};

      sysNumberParams.push(
        {
          "field" : "sdoMetaPKey",
          "value" : splittingDoc.getSdoMetaPKey()
        }
      );
      sysNumberParams.push(
        {
          "field" : "docTaType",
          "value" : splittingDoc.getDocTaType()
        }
      );
      sysNumberQuery.params = sysNumberParams;

      /*################################
  //### setting id and invoiceId ###
  //################################*/
      return BoFactory.loadObjectByParamsAsync("LuSdoMetaDocTATypeSysNumber", sysNumberQuery).then(
        function (luSdoMetaDocTATypeSysNumber) {
          if (!Utils.isEmptyString(luSdoMetaDocTATypeSysNumber.getSysNumberPKey())) {
            return SysNumber.getSysNumberAsync(luSdoMetaDocTATypeSysNumber.getSysNumberPKey());
          }
          else {
            return SysNumber.getSysNumberAsync(splittingDoc.getBoOrderMeta().getSysNumberPKey());
          }
        }
      ).then(
        function (invoicenumber) {
          if (Utils.isDefined(invoicenumber)) {
            splittingDoc.setInvoiceId(invoicenumber);
          }
          return SysNumber.getSysNumberAsync(splittingDoc.getBoOrderMeta().getSysNumberPKey());
        }
      ).then(
        function (splittingDocId) {
          splittingDoc.setOrderId(splittingDocId);
          splittingDoc.setObjectStatus(STATE.NEW | STATE.DIRTY);
        });
    });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}