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
 * @function myCalculateOrderTotals
 * @this BoOrder
 * @kind businessobject
 * @namespace CUSTOM
 */
function myCalculateOrderTotals(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var promise = when.resolve();
    me.totalQuantity = 0;
    me.grossTotalValue = 0;
    me.grossTotalValueReceipt = 0;
    me.myTotalDiscountValue = 0;
    me.totalValue = 0;
    me.totalValueReceipt = 0;
    me.myTotalFreeGoodsValue = 0;
    const commercialPolicyValidRulesDict = me.getBoMyDiscountEngineManager().getCommercialPolicyValidRulesDict();
    const freeOfChargeProductsMap = new Map();

    for (var key in commercialPolicyValidRulesDict.data) {
      var currentRule = commercialPolicyValidRulesDict.get(key);
      if(currentRule.typeOfDiscount == 'Free of Charge' && Utils.isDefined(currentRule.qtyToBuy) && (currentRule.qtyToBuy > 0) && Utils.isDefined(currentRule.qtyToGive) && (currentRule.qtyToGive > 0)){
          freeOfChargeProductsMap.set(
                                      currentRule.application,
                                      {
                                        "typeOfDiscount": currentRule.typeOfDiscount,
                                        "qtyToGive": currentRule.qtyToGive,
                                        "qtyToBuy": currentRule.qtyToBuy,
                                        "isCalculated": false
                                      });
      }
    }

    const nonStandardItemMetaPkeys = me.getBoItemTabManager().getLoMyOrderItemMetas().getAllItems().reduce((pKeyList, itemMeta) => {
      if (itemMeta.id !== 'Standard') {
        pKeyList.push(itemMeta.pKey);
      }
      return pKeyList;
    }, []);

    //Track Items already counted
    let countedList = {};

    for (let j = 1; j <= 6; j++) {
      countedList = {};
      me.getLoItems().getAllItems().forEach(function(liOrderItem) {
        if(Utils.isDefined(countedList[liOrderItem.getRefPKey()])){
          return;
        }
        //Add pKey to the counted list  
        countedList[liOrderItem.getRefPKey()] = "";
       
        const focKey = freeOfChargeProductsMap.get(liOrderItem.getPrdMainPKey());
        if (Utils.isDefined(focKey)) {
            if (!focKey.isCalculated) {
              let factor = 0;
              factor = Utils.roundDown((liOrderItem.getMyTotalQuantity() / focKey.qtyToBuy), 0);
              let focItemQty = factor * focKey.qtyToGive;
              me.totalQuantity += liOrderItem.getMyTotalQuantity() + focItemQty;
              let focOrderPrice = liOrderItem.basePrice * (liOrderItem.getMyTotalQuantity() + focItemQty);
              focOrderPrice = isNaN(focOrderPrice) ? 0 : focOrderPrice;
              me.grossTotalValue += focOrderPrice;
              me.grossTotalValueReceipt += focOrderPrice;
              let orderPrice = (liOrderItem.basePrice * liOrderItem.getMyTotalQuantity());
              let discountAmount = (orderPrice * (liOrderItem.discount / 100)) || 0;
              let focDiscountAmount = discountAmount + (liOrderItem.basePrice * focItemQty);
              me.myTotalDiscountValue += focDiscountAmount;
              me.totalValue += orderPrice - discountAmount;
              me.totalValueReceipt += orderPrice - discountAmount;
              freeOfChargeProductsMap.get(liOrderItem.getPrdMainPKey()).isCalculated = true;
            }
        } else {
              if (nonStandardItemMetaPkeys.includes(liOrderItem.getSdoItemMetaPKey()) || liOrderItem.getParentType() == "FreeGoods" || liOrderItem.getParentType() == "FreeOfCharge") {
                me.myTotalFreeGoodsValue += Utils.isDefined(liOrderItem.basePrice) && Utils.isDefined(liOrderItem['mySplit'+j+'Q'])
                                            ? liOrderItem.basePrice * liOrderItem['mySplit'+j+'Q']
                                            : 0;
              } else {
                if (liOrderItem['myIsBOMPart'] === '0' || liOrderItem['showInBasket'] === '1') {
                  me.totalQuantity += liOrderItem['mySplit'+j+'Q'];
                  let orderPrice = liOrderItem.basePrice * liOrderItem['mySplit'+j+'Q'];
                  orderPrice = isNaN(orderPrice) ? 0 : orderPrice;
                  me.grossTotalValue += orderPrice;
                  me.grossTotalValueReceipt += orderPrice;
                  let discountAmount = (orderPrice * (liOrderItem.discount / 100));
                  if (discountAmount) {
                    me.myTotalDiscountValue += discountAmount;
                    me.totalValue += orderPrice - discountAmount;
                    me.totalValueReceipt += orderPrice - discountAmount;
                  } else {
                    me.totalValue += orderPrice;
                    me.totalValueReceipt += orderPrice;
                  }
                }
              }
        }
      });
    }
    return promise;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}