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
 * @function mySaveSplits
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CUSTOM
 * @returns promise
 */
function mySaveSplits(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var phaseOfMainOrder = me.getPhase();
var jsonParams = {
  recordType: "Split",
};
let deferreds = [];
var promise =  Facade.selectSQL("DsLuRecordType", "UserTask", jsonParams).
  then(function (recordType) {
    var jsonQuery = {};
    var jsonParams = [];
    var splitNumber = 1;
    while (Utils.isDefined(me['myDDSplit'+splitNumber]) &&
        me['myDDSplit'+splitNumber] != "1700-01-01 00:00:00") {   
        if(me.loMyOrderSplits && me.loMyOrderSplits.getAllItems()[splitNumber-1]){
          jsonQuery = {};
          jsonParams = [];
          jsonParams.push( {"field" : "clbMainPKey", "value": me.getClbMainPKey()});
          jsonParams.push( {"field" : "callInContext_clbMainPKey", "value": me.getClbMainPKey()});
          jsonParams.push( {"field" : "callOutOfStockProducts", "value": me.getCallOutOfStockProducts()});
          jsonParams.push( {"field" : "boCallCache", "value": {}});
          jsonParams.push( {"field" : "myIsSplitOrder", "value": true});
          jsonParams.push( {"field" : "pKey", "value": me.loMyOrderSplits.getAllItems()[splitNumber-1].pKey});
          jsonParams.push( {"field" : "myPreSalesDelivery", "value": me['myPreSalesDelivery'+splitNumber]});
          jsonQuery.params = jsonParams;
          deferreds.push(BoFactory.loadObjectByParamsAsync("BoOrder", jsonQuery));
        } else {
          jsonQuery = {};
          jsonParams = [];
          jsonParams.push( {"field" : "sdoMetaPKey", "value": me.getSdoMetaPKey()});
          jsonParams.push( {"field" : "pKey", "value": me['mySplit'+splitNumber+'PKey']});
          if(me['myType'+splitNumber] == 'Direct'){
            if(me['mySoldTo'+splitNumber] && me['mySoldTo'+splitNumber].trim()!='' && me.myDefaultDirectSoldToPKey && me['mySoldTo'+splitNumber] == me.myDefaultDirectSoldToPKey){
              jsonParams.push( {"field" : "myIsSoldToSplit", "value": "1"});
              jsonParams.push( {"field" : "ordererPKey", "value": me.myDefaultDirectSoldToPKey});
            }
            else{
              jsonParams.push( {"field" : "myIsSoldToSplit", "value": "0"});
              jsonParams.push( {"field" : "ordererPKey", "value": me.myDefaultTransferSoldToPKey});
            }
          }
          else if(me['myType'+splitNumber] == 'Transfer'){
            if(me['mySoldTo'+splitNumber] && me['mySoldTo'+splitNumber].trim()!='' && me.myDefaultTransferSoldToPKey && me['mySoldTo'+splitNumber] == me.myDefaultTransferSoldToPKey){
              jsonParams.push( {"field" : "myIsSoldToSplit", "value": "1"});
            }
            else{
              jsonParams.push( {"field" : "myIsSoldToSplit", "value": "0"});
            }
          }
          //jsonParams.push( {"field" : "shipToPKey", "value": me.getShipToPKey()});
          jsonParams.push( {"field" : "clbMainPKey", "value": me.getClbMainPKey()});
          jsonParams.push( {"field" : "etpWarehousePKey", "value": me.getEtpWarehousePKey()});
          jsonParams.push( {"field" : "callInContext_clbMainPKey", "value": me.getClbMainPKey()});
          jsonParams.push( {"field" : "ownerPKey", "value": me.getOwnerPKey()});
          jsonParams.push( {"field" : "responsiblePKey", "value": me.getResponsiblePKey()});
          jsonParams.push( {"field" : "callOutOfStockProducts", "value": me.getCallOutOfStockProducts()});
          jsonParams.push( {"field" : "boCallCache", "value": {}});
          jsonParams.push( {"field" : "doNotUpdateItems", "value": "true"});
          jsonParams.push( {"field" : "myIsSplitOrder", "value": true});
          jsonParams.push( {"field" : "myMainOrderPKey", "value": me.getPKey()});
          jsonParams.push( {"field" : "myRecordTypeId", "value": recordType[0].pKey});
          jsonParams.push( {"field" : "myPricingTermPKey", "value": me.getMyPreSalesId()}); 
          jsonParams.push( {"field" : "myPreSalesDelivery", "value": me['myPreSalesDelivery'+splitNumber]});
          jsonParams.push( {"field" : "billToCustomerPKey", "value": me['myBillTo'+splitNumber]});
          jsonParams.push( {"field" : "deliverToCustomerPKey", "value": me['myDeliverTo'+splitNumber]});
          jsonParams.push( {"field" : "shipToCustomerPKey", "value": me['myShipTo'+splitNumber]});
          jsonParams.push( {"field" : "myImDeliverySplit", "value": me['mySplit'+splitNumber+'ImDelivery']});
          jsonQuery.params = jsonParams;
          deferreds.push(BoFactory.createObjectAsync("BoOrder", jsonQuery));
      }
      splitNumber++;
    } 
    return when.all(deferreds);
  }).then(function(orderSplitCreationPromises){
    var orderSaveDeferreds = [];
    let splitIndex = 1;
    let price = 0;
    let discountAmount = 0;
    let value = 0;
    let totalMainOrderValue = 0;
    let totalMainOrderGrossValue = 0;
    orderSplitCreationPromises.forEach(function(orderSplit) {
      let totalOrderSplitValue = 0;
      let totalOrderSplitGrossValue = 0;
      let totalOrderSplitFreeGoodsValue = 0;
      let pSDeliveryDate = new Date (me['myDDSplit'+splitIndex]);
      orderSplit.setDeliveryDate(pSDeliveryDate);
      orderSplit.setPhase(phaseOfMainOrder);
      orderSplit.setMyPONumber(me['myPONumber'+splitIndex]);
      orderSplit.setMySplitType(me['myType'+splitIndex]);
      orderSplit.setMyWholesaler(me['myWholesalerS'+splitIndex]);
      orderSplit.setDeliverToCustomerPKey(me['myDeliverTo'+splitIndex]);
      orderSplit.setShipToCustomerPKey(me['myShipTo'+splitIndex]);
      orderSplit.setBillToCustomerPKey(me['myBillTo'+splitIndex]);
      if(!Utils.isEmptyString(me['mySoldTo'+splitIndex])){
        orderSplit.setOrdererPKey(me['mySoldTo'+splitIndex]);
      }
      orderSplit.setMyPreSalesId(me['myPreSalesId']);
      orderSplit.setFreeItemsInSplitDict(me.getFreeItemsInSplitDict());
      orderSplit.setMyImDeliverySplit(me['mySplit'+ splitIndex + 'ImDelivery']);
      orderSplit.setMyPreSalesDelivery(me['myPreSalesDelivery'+splitIndex]);
      var freeItemsToDelete = orderSplit.getFreeItemsInSplitDict();
      if(Utils.isDefined(freeItemsToDelete)){
        //Loop through dictionary and remove old free items from the list.
        for (var key in freeItemsToDelete.data) {
          let splitOrderFreeItem = orderSplit.getLoItems().getAllItems().find((orderItem) => orderItem.prdMainPKey == key && (orderItem.parentType == 'FreeGoods' || orderItem.parentType == 'FreeOfCharge'));
          if(Utils.isDefined(splitOrderFreeItem)){
            splitOrderFreeItem.setMyTotalQuantity(0);
            splitOrderFreeItem.setQuantity(0);
            splitOrderFreeItem.setMySplit1Q(0);
            splitOrderFreeItem.setMySplit2Q(0);
            splitOrderFreeItem.setMySplit3Q(0);
            splitOrderFreeItem.setMySplit4Q(0);
            splitOrderFreeItem.setMySplit5Q(0);
            splitOrderFreeItem.setMySplit6Q(0);
            splitOrderFreeItem.setDeletedFreeItem("1");
            splitOrderFreeItem.setShowInBasket("0");
            splitOrderFreeItem.delete();
          }
        }
      }

      // Go through all the orderItems in the main Entry
      var itemsToAdd = [];
      me.getLoItems().getAllItems().forEach(function(liOrderItem) { //Filter with Changed items only To Do
        let quantityInMainOrder = liOrderItem["mySplit"+splitIndex+"Q"];
        
        if (quantityInMainOrder || liOrderItem.mySplitQtyReset) {
          // And find the entry in the Split Order
          
          let splitLiOrderItem;
          //FIND ENTRY IN THE SPLIT ORDER
          orderSplit.getLoItems().getAllItems().forEach(function(orderItem){
            if(orderItem.prdMainPKey == liOrderItem.prdMainPKey 
              && 
              ((orderItem.myEligibleForExchange == liOrderItem.myEligibleForExchange  
              && orderItem.myAvailableForExchange == liOrderItem.myAvailableForExchange)
            || (orderItem.discount==100 && orderItem.type.startsWith('Free Good')))
            && (orderItem.changedBOMType == liOrderItem.changedBOMType || orderItem.type.startsWith('Free Good'))
          ){
                if(orderItem.parentType == liOrderItem.parentType || (orderItem.parentType == null && liOrderItem.parentType == " ") || (orderItem.parentType == " " && liOrderItem.parentType == null) || (orderItem.parentType == null && liOrderItem.parentType == null)){
                  splitLiOrderItem = orderItem;
                }
            }
          });
          
          /* Removed the find method because it was not handling null parent types correctly.
          let splitLiOrderItem = orderSplit.getLoItems().getAllItems().find( (orderItem) => orderItem.prdMainPKey == liOrderItem.prdMainPKey 
          && orderItem.parentType == liOrderItem.parentType 
          && orderItem.myEligibleForExchange == liOrderItem.myEligibleForExchange  
          && orderItem.myAvailableForExchange == liOrderItem.myAvailableForExchange);
          */
          
          if((liOrderItem.parentType == 'FreeGoods' || liOrderItem.parentType == 'FreeOfCharge' || liOrderItem.parentType == 'ManualAdd') && !splitLiOrderItem){
              //add a new splitLiOrderItem
              var itemToAdd = {
                "pKey" : PKey.next(),
                "quantity" : quantityInMainOrder,//liOrderItem.myTotalQuantity,
                "prdMainPKey" : liOrderItem.prdMainPKey,
                "sdoMainPKey" : orderSplit.getPKey(),
                "sdoItemMetaPKey" : liOrderItem.sdoItemMetaPKey,
                "parentType" : liOrderItem.getParentType(),
                "quantityLogisticUnit" : liOrderItem.quantityLogisticUnit,
                "discount" : 100,
                "myDiscountA" : liOrderItem.myDiscountA || 0,
                "myDiscountB" : liOrderItem.myDiscountB || 0,
                "myDiscountC" : liOrderItem.myDiscountC || 0,
                "myDiscountD" : liOrderItem.myDiscountD || 0,
                "myDiscountE" : liOrderItem.myDiscountE || 0,
                "myDiscountF" : liOrderItem.myDiscountF || 0,
                "myDiscountG" : liOrderItem.myDiscountG || 0,
                "myDiscountBase" : liOrderItem.myDiscountBase,
                "myDiscountSource" : liOrderItem.myDiscountSource,
                "value" : 0,
                "basePrice" : liOrderItem.basePrice,
                "myDeliveryValidFrom": liOrderItem.myDeliveryValidFrom,
                "myDeliveryValidThru": liOrderItem.myDeliveryValidThru,
                "changedBOMType": liOrderItem.changedBOMType
              };
              itemsToAdd.push(itemToAdd);
          }
          else if (splitLiOrderItem) {
            splitLiOrderItem["quantity"]= quantityInMainOrder;
            splitLiOrderItem["sdoItemMetaPKey"] = liOrderItem.sdoItemMetaPKey;
            splitLiOrderItem["discount"] = liOrderItem.discount;
            orderPrice = liOrderItem.basePrice * quantityInMainOrder;
            discountAmount = (orderPrice * (liOrderItem.discount / 100));
            value = (orderPrice - discountAmount);
            splitLiOrderItem["value"] = value;
            splitLiOrderItem["basePrice"] = liOrderItem.getBasePrice();
            splitLiOrderItem["price"] = liOrderItem.getBasePrice() * (1-(liOrderItem.discount/100));
            totalOrderSplitValue += parseFloat(value);
            totalOrderSplitGrossValue += parseFloat(orderPrice);
            splitLiOrderItem["myDiscountA"] = liOrderItem.getMyDiscountA() || 0;
            splitLiOrderItem["myDiscountB"] = liOrderItem.getMyDiscountB() || 0;
            splitLiOrderItem["myDiscountC"] = liOrderItem.getMyDiscountC() || 0;
            splitLiOrderItem["myDiscountD"] = liOrderItem.getMyDiscountD() || 0;
            splitLiOrderItem["myDiscountE"] = liOrderItem.getMyDiscountE() || 0;
            splitLiOrderItem["myDiscountF"] = liOrderItem.getMyDiscountF() || 0;
            splitLiOrderItem["myDiscountG"] = liOrderItem.getMyDiscountG() || 0;
            splitLiOrderItem["myDiscountBase"] = liOrderItem.getMyDiscountBase();
            splitLiOrderItem["myDiscountSource"] = liOrderItem.getMyDiscountSource();
            splitLiOrderItem["myApprovalNote"] = liOrderItem["myItemApprovalNote"+splitIndex];
           }
        }
        else if(liOrderItem.changedBOMType == '1'){
          let splitLiOrderItem;
          //FIND ENTRY IN THE SPLIT ORDER
          orderSplit.getLoItems().getAllItems().forEach(function(orderItem){
            if(orderItem.prdMainPKey == liOrderItem.prdMainPKey 
              && 
              ((orderItem.myEligibleForExchange == liOrderItem.myEligibleForExchange  
              && orderItem.myAvailableForExchange == liOrderItem.myAvailableForExchange)
            || (orderItem.discount==100 && orderItem.type.startsWith('Free Good')))
            && orderItem.changedBOMType == liOrderItem.changedBOMType
          ){
                if(orderItem.parentType == liOrderItem.parentType || (orderItem.parentType == null && liOrderItem.parentType == " ") || (orderItem.parentType == " " && liOrderItem.parentType == null) || (orderItem.parentType == null && liOrderItem.parentType == null)){
                  splitLiOrderItem = orderItem;
                }
            }
          });
          if (splitLiOrderItem){
            splitLiOrderItem.delete()
          }
        }
      });
      orderSplit.getLoItems().addItems(itemsToAdd);
      orderSplit.setTotalValue(totalOrderSplitValue);
      orderSplit.setTotalValueReceipt(totalOrderSplitValue);
      orderSaveDeferreds.push(orderSplit.saveAsync());
      totalMainOrderValue += parseFloat(totalOrderSplitValue);
      totalMainOrderGrossValue += parseFloat(totalOrderSplitGrossValue);
      splitIndex++;
    });
    // itemsToAdd.forEach(function(liOrderFreeItem) {
    //   totalOrderSplitFreeGoodsValue += liOrderFreeItem.basePrice * quantityInMainOrder;
    // });
    me.setTotalValue(totalMainOrderValue);
    me.setTotalValueReceipt(totalMainOrderValue);
    me.setGrossTotalValue(totalMainOrderGrossValue);
    return when.all(orderSaveDeferreds);
  });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
