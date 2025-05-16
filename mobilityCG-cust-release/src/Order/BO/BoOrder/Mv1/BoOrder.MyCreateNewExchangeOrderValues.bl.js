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
 * @function myCreateNewExchangeOrderValues
 * @this BoOrder
 * @kind businessobject
 * @namespace CORE
 * 
 */
function myCreateNewExchangeOrderValues(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    //var promise = when.resolve(me);
    var exchangeOrder = {};
    exchangeOrder.myExchangeType = 'Exchange';
    //exchangeOrder.orderMetaPKey = me.getBoOrderMeta().pKey;
    exchangeOrder.ordererPKey = me.getLuOrderer().pKey;
    exchangeOrder.myPricingTermPKey = me.getBoMyPricingTerms().pKey;
    //exchangeOrder.mySplitForExchangePKey = me.getLuMySplitForExchange().pKey;
    exchangeOrder.myByPassAgreements = me.myByPassAgreements;
    var splitType = '';
    var boOrderMetaPkey = ''
    function stripTime(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    var promise = BoFactory.loadObjectByParamsAsync(
        "LoOrderMeta",
        { "customerPKey": me.getLuOrderer().pKey }
    ).then(orderMetaList => {
        let items = orderMetaList.getAllItems();
        var pKeyToReturn = ''
        for (let i = 0; i < items.length; i++) {
            if (items[i].originalText === 'Exchange') {
                pKeyToReturn = items[i].pKey;
                break;
            }
        }
        return pKeyToReturn;
    }).then(pKey => {
        boOrderMetaPkey = pKey
        return BoFactory.loadListAsync("LoMyOrderSplits", { "mainOrderPKey": me.getPKey()})
    }).then(LoMyOrderSplits => {

              let deferreds = [];
              if (Utils.isDefined(LoMyOrderSplits)) {
                // load order splits
                LoMyOrderSplits.getAllItems().forEach(function(liMyOrderSplit) {
                  deferreds.push(BoFactory.loadObjectByParamsAsync("BoMySplitOrder",
                    { "pKey" :  liMyOrderSplit.pKey }));
                });
              }
              return when.all(deferreds);
            }).then(allSplitOrders => {
                if(Utils.isDefined(me.getBoOrderMeta().myProcessExchangeVia) && !Utils.isEmptyString(me.getBoOrderMeta().myProcessExchangeVia)){
                    if(me.getBoOrderMeta().myProcessExchangeVia == 'Only Transfer'){
                        splitType = 'Transfer' ;
                    }
                    else if(me.getBoOrderMeta().myProcessExchangeVia == 'Only Direct'){
                        splitType = 'Direct';
                    }
                    else if(me.getBoOrderMeta().myProcessExchangeVia == 'Direct & Transfer'){
                        splitType = 'Both';
                    }
                    var minDiffSplitDate = Utils.convertAnsiDate2Date(Utils.createDateToday()) - Utils.convertAnsiDate2Date(Utils.getMinDate());
                    var splitPkey = '';
                    var deliveryDate = '';
                    for(var i = 1; i <= 6; i++){
                        if(Utils.isDefined(me['myDDSplit' + i])){
                            var today = stripTime(Utils.convertAnsiDate2Date(Utils.createDateToday()));
                            var splitDate = stripTime(Utils.convertAnsiDate2Date(me['myDDSplit' + i]));
                            
                            var calculatePredDiffSplitDate = Math.floor((today - splitDate) / (1000 * 60 * 60 * 24));
                            var calculatedDiffSplitDate = Math.abs(calculatePredDiffSplitDate);
                            if((me['myType' + i] == splitType || splitType == 'Both') && minDiffSplitDate > calculatedDiffSplitDate){
                                splitPkey = me['mySplit' + i + 'PKey'];
                                deliveryDate = me['myDDSplit' + i];
                                minDiffSplitDate = calculatedDiffSplitDate;
                            }
                            else if((me['myType' + i] == splitType || splitType == 'Both') 
                                && minDiffSplitDate == calculatedDiffSplitDate){
                                    if(me['mySoldTo' + i] == me.myDefaultDirectSoldToPKey && me['myType' + i] == 'Direct'){
                                        splitPkey = me['mySplit' + i + 'PKey'];
                                        deliveryDate = me['myDDSplit' + i];
                                        minDiffSplitDate = calculatedDiffSplitDate;
                                    }
                                    else if(me['mySoldTo' + i] == me.myDefaultTransferSoldToPKey && me['myType' + i] == 'Transfer'){
                                        splitPkey = me['mySplit' + i + 'PKey'];
                                        deliveryDate = me['myDDSplit' + i];
                                        minDiffSplitDate = calculatedDiffSplitDate;
                                    }
                            }
                        }
                    }
                    exchangeOrder.deliveryDate = deliveryDate;
                    exchangeOrder.mySplitForExchangePKey = splitPkey;
                    exchangeOrder.orderMetaPKey = boOrderMetaPkey;

                    if(!Utils.isEmptyString(splitPkey)) me.setObjExchangeOrder(exchangeOrder);

        }
    })

    return promise;
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

}