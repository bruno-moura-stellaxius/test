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
 * @function myUpdateOrderItems
 * @this BoOrder
 * @kind businessobject
 * @namespace CUSTOM
 * @param {Object} productAssotmentProductList
 * @returns filteredItems
 */
function myUpdateOrderItems(productAssotmentProductList){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var filteredItems = me.getLoItems().getItems();
    var itemsToAdd = [];
    var freeItemDict = Utils.createDictionary();
    var freeItemMap = {};
    var freeItemsToAdd = Utils.createDictionary();
    var splitInfoDict = Utils.createDictionary();
    var deliveriesQuantity = 0;
    var soldToDiffDefault = '';
    if (me.loMyOrderSplits && me.loMyOrderSplits.getAllItemsCount() > 0) {
      // We already have saved this order and its splits... We load them, and assign them to the "in-memory" splits
      let splitIndex = 1;
      let parsedValue = 0.00;
      me.loMyOrderSplits.getAllItems().forEach(function (myOrderSplit) {
        //Date Created in Local Timezone, and Potentially incorrect based on GMT
        let tempDate = new Date(myOrderSplit.deliveryDate);
        //Date Created as Midnight of the UTC Delivery Date 
        let pSDeliveryDate = Utils.createSpecificDate(tempDate.getUTCFullYear(),(tempDate.getUTCMonth()),tempDate.getUTCDate());//new Date(myOrderSplit.deliveryDate);
        me['myDDSplit'+splitIndex] = pSDeliveryDate;
        me['myPreSalesDelivery'+splitIndex] = myOrderSplit.myPreSalesDelivery;
        me['myType'+splitIndex] = myOrderSplit.mySplitType;
        me['myWholesalerS'+splitIndex] = myOrderSplit.myWholesaler;
        me['myPONumber'+splitIndex] = myOrderSplit.myPONumber;
        me['myBillTo'+splitIndex] = myOrderSplit.myBillToPKey;
        me['myDeliverTo'+splitIndex] = myOrderSplit.myDeliverToPKey;
        me['myShipTo'+splitIndex] = myOrderSplit.myShipToPKey;
        me['mySplit'+splitIndex+'ImDelivery'] = myOrderSplit.myImDeliverySplit;
        me['mySoldTo'+splitIndex] = myOrderSplit.myOrdererPKey;
        me['mySplit'+splitIndex+'PKey'] = myOrderSplit.pKey;
        /*if(myOrderSplit.myIsSoldToSplit == "1"){
          me['mySoldTo'+splitIndex] = myOrderSplit.myOrdererPKey;
        }*/

        if (me.boMyPricingTerms && me.boOrderMeta.getId() == 'PreSales'){
          var preSalesDelFound = me.boMyPricingTerms.loMyPreSalesDeliveries.getAllItems().find( (psd) => (psd.pKey == me['myPreSalesDelivery'+splitIndex] ));
          if(Utils.isDefined(preSalesDelFound)) {
            me['myPreSalesMinQuantity'+(splitIndex)] = preSalesDelFound.myMinQuantity;
            me['myPreSalesMinValue'+(splitIndex)] = preSalesDelFound.myMinValue;
          }
       }
        // create a split info dictionary so that we use it while adding free items.
        var displayDateValue = pSDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'});
        var ansiDateValue = Utils.convertDate2Ansi(pSDeliveryDate);
        var orderSplit ={          
          splitIndex : splitIndex,
          displayDateValue : displayDateValue,
          ansiDateValue : ansiDateValue
        }
        splitInfoDict.add(splitIndex, orderSplit);
        // check for free Items in the list and add them to order disposal list
        myOrderSplit.loMySplitItems.getAllItems().forEach(function (splitOrderItem){
          splitOrderItem.index = splitIndex;
          if (splitOrderItem.parentType == "FreeGoods"){
            freeItemDict.add(splitOrderItem.prdMainPKey+"FG",splitOrderItem);
            freeItemMap[splitOrderItem.prdMainPKey+"FG"+"-"+splitOrderItem.index] = splitOrderItem;
          }
          else if (splitOrderItem.parentType == "FreeOfCharge"){
            freeItemDict.add(splitOrderItem.prdMainPKey+"FOC",splitOrderItem);
            freeItemMap[splitOrderItem.prdMainPKey+"FOC"+"-"+splitOrderItem.index] = splitOrderItem;
          } 
          else if (splitOrderItem.parentType == "ManualAdd"){
            freeItemDict.add(splitOrderItem.prdMainPKey+"MA",splitOrderItem);
            freeItemMap[splitOrderItem.prdMainPKey+"MA"+"-"+splitOrderItem.index] = splitOrderItem;
          }
        });
       
        me.loItems.getAllItems().forEach (function(mainOrderItem) {
          //let splitOrderItem = myOrderSplit.loMySplitItems.getAllItems().find( (orderItem) => (orderItem.prdMainPKey == mainOrderItem.prdMainPKey && orderItem.parentType != "FreeGoods" && orderItem.parentType != "FreeOfCharge"));
          let splitOrderItem = myOrderSplit.loMySplitItems.getAllItems().find( (orderItem) => (orderItem.prdMainPKey == mainOrderItem.prdMainPKey && orderItem.parentType != "FreeGoods" && orderItem.parentType != "FreeOfCharge" && orderItem.sdoItemMetaPKey == mainOrderItem.sdoItemMetaPKey && orderItem.changedBOMType == mainOrderItem.changedBOMType));  
          
            mainOrderItem["mySplit"+splitIndex+"Q"] =  Utils.isDefined(splitOrderItem) ? splitOrderItem.getQuantity() : 0 ;
            mainOrderItem["myItemApprovalNote"+splitIndex] =  Utils.isDefined(splitOrderItem) ? splitOrderItem.getMyApprovalNote() : "" ;
            mainOrderItem["mySplit"+splitIndex+"DDAnsi"] = Utils.convertDate2Ansi(pSDeliveryDate);
            if(myOrderSplit.myIsSoldToSplit == "1"){
              if(!Utils.isEmptyString(myOrderSplit.myWholesaler)){
                mainOrderItem["mySplit"+splitIndex+"DD"] = pSDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) + '^';
              } else {
                mainOrderItem["mySplit"+splitIndex+"DD"] = pSDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) + '*';
              }
            } else if(myOrderSplit.myIsSoldToSplit != "1") {
              if(!Utils.isEmptyString(myOrderSplit.myWholesaler)){
                mainOrderItem["mySplit"+splitIndex+"DD"] = pSDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) + '#';
              } else {
                mainOrderItem["mySplit"+splitIndex+"DD"] = pSDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'});
              }
            }
          if(Utils.isDefined(splitOrderItem)){
          mainOrderItem.myTotalQuantity = (Utils.isDefined(mainOrderItem.myTotalQuantity) ? mainOrderItem.myTotalQuantity : 0) +  splitOrderItem.getQuantity();
          mainOrderItem.myDiscountA = splitOrderItem.myDiscountA || 0;
          mainOrderItem.myDiscountB = splitOrderItem.myDiscountB || 0;
          mainOrderItem.myDiscountC = splitOrderItem.myDiscountC || 0;
          mainOrderItem.myDiscountD = splitOrderItem.myDiscountD || 0;
          mainOrderItem.myDiscountE = splitOrderItem.myDiscountE || 0;
          mainOrderItem.myDiscountF = splitOrderItem.myDiscountF || 0;
          mainOrderItem.myDiscountG = splitOrderItem.myDiscountG || 0;
          mainOrderItem.myDiscountBase = splitOrderItem.myDiscountBase;
          mainOrderItem.myDiscountSource = splitOrderItem.myDiscountSource;
          mainOrderItem.oneHundredDiscount = splitOrderItem.oneHundredDiscount;
          parsedValue = (Utils.isDefined(mainOrderItem.value) ? mainOrderItem.value : 0) +  splitOrderItem.getValue();
          mainOrderItem.value = Number.parseFloat((parsedValue).toFixed(2));
          mainOrderItem.basePrice = mainOrderItem.simplePricingBasePrice;//splitOrderItem.basePrice;
          mainOrderItem.price = splitOrderItem.price;
          mainOrderItem.sdoItemMetaPKey = splitOrderItem.sdoItemMetaPKey;
          mainOrderItem.discount = (splitOrderItem.myDiscountA || 0) + (splitOrderItem.myDiscountB || 0) + (splitOrderItem.myDiscountC || 0) + (splitOrderItem.myDiscountD || 0) + (splitOrderItem.myDiscountE || 0) + (splitOrderItem.myDiscountF || 0) + (splitOrderItem.myDiscountG || 0);
      }
    });
        splitIndex++;
      });

      var freeGoodItemTemplates = me.getBoOrderMeta().getLoOrderItemMetas().getItemsByParamArray([{"erpCode": "Policy"}, {"active": "1"}, {"validFrom": Utils.createAnsiDateToday(), "op": "LE"}, {"validThru": Utils.createAnsiDateToday(), "op": "GE"}]);
      var freeOfChargeItemTemplates = me.getBoOrderMeta().getLoOrderItemMetas().getItemsByParamArray([{"erpCode": "PolicyFOC"}, {"active": "1"}, {"validFrom": Utils.createAnsiDateToday(), "op": "LE"}, {"validThru": Utils.createAnsiDateToday(), "op": "GE"}]);
      var itemTemplate = freeGoodItemTemplates[0];//confirm on the type of discount placement

      for (var key in freeItemDict.data) {  
        var freeItem = freeItemDict.get(key); 
        var orderItemDetail = me.getBoMyDiscountEngineManager().getLoMyFreeItemProductsInfo().getAllItems().find( (orderItem) => orderItem.prdMainPKey == freeItem.prdMainPKey);  
        var itemTemplate = freeItem.parentType == "FreeGoods" ? freeGoodItemTemplates[0] : freeItem.parentType == "FreeOfCharge" ? freeOfChargeItemTemplates[0] : null;

        if(key.endsWith('MA')){
          itemTemplate = me.getBoOrderMeta().getLoOrderItemMetas().getItemsByParamArray([{"pKey": freeItem.sdoItemMetaPKey}])[0];
        }

        //Get the Split Values from FreeItemMap based on index
        let q1 = freeItemMap[key+"-1"]?freeItemMap[key+"-1"].quantity:0;
        let q2 = freeItemMap[key+"-2"]?freeItemMap[key+"-2"].quantity:0;
        let q3 = freeItemMap[key+"-3"]?freeItemMap[key+"-3"].quantity:0;
        let q4 = freeItemMap[key+"-4"]?freeItemMap[key+"-4"].quantity:0;
        let q5 = freeItemMap[key+"-5"]?freeItemMap[key+"-5"].quantity:0;
        let q6 = freeItemMap[key+"-6"]?freeItemMap[key+"-6"].quantity:0;

            var itemToAdd = {
              "pKey" : PKey.next(),
              "basePrice" : freeItem.basePrice,
              "simplePricingBasePrice" : freeItem.basePrice,
              "basePriceReceipt" : 0,
              "calculationGroup" : itemTemplate.getCalculationGroup(),
              "category" : orderItemDetail.category,
              "customerAssortment" : "0",
              "deletedFreeItem" : "0",
              "deliveryState" : orderItemDetail.deliveryState,
              "eAN" : orderItemDetail.eAN,
              "editedQty" : orderItemDetail.quantity,
              "fieldState" : orderItemDetail.fieldState,
              "freeItemUnit" : orderItemDetail.logisticUnit,
              "freeItemMetaPKey" : itemTemplate.getPKey(),
              "freeItemCreationStep" : " ",
              "grossValue" : 0,
              "grossValueReceipt" : 0,
              "groupId" : orderItemDetail.groupId,
              "groupName" : Localization.resolve("Order_Free"),
              "groupText" : orderItemDetail.groupText,
              "groupSort" : orderItemDetail.productName,
              "groupIdSort" : "1001$",
              "history" : "0",
              "isOrderUnit" : orderItemDetail.isOrderUnit,
              "listed" : "0",
              "movementDirection" : itemTemplate.getMovementDirection(),
              "newState" : orderItemDetail.newState,
              "objectStatus" : STATE.NEW | STATE.DIRTY,
              "outOfStock" : "0",
              "parentType" : freeItem.parentType,
              "piecesPerSmallestUnitForBasePrice" : orderItemDetail.piecesPerSmallestUnitForBasePrice,
              "prdId" : orderItemDetail.prdId,
              "prdMainPKey" : orderItemDetail.prdMainPKey,
              "prdType" : orderItemDetail.prdType,
              "price" : 0,
              "priceEffect" : itemTemplate.getPriceEffect(),
              "priceReceipt" : 0,
              "promotionPKey" : null,
              "myTotalQuantity" : freeItem.quantity,
              "defaultQuantityLogisticUnit" : orderItemDetail.quantityLogisticUnit,
              "quantityLogisticUnit" : orderItemDetail.quantityLogisticUnit,
              "refPKey" : orderItemDetail.prdId + itemTemplate.getPKey(),
              "rewardPKey" : null,
              "saveZeroQuantity" : itemTemplate.getSaveZeroQuantity(),
              "shortId" : orderItemDetail.shortId,
              "sdoMainPKey" : me.getPKey(),
              "sdoItemMetaPKey" : itemTemplate.getPKey(),
              "sdoParentItemPKey" : " ",
              "splittingGroup" : " ",
              "sort" : "1",
              "shortType" : itemTemplate.getShortText(),
              "suggestedQuantity" : orderItemDetail.quantity,
              "targetQuantity" : orderItemDetail.quantity,
              "taxClassification" : orderItemDetail.taxClassification,
              "text1" : orderItemDetail.text1,
              "type" : itemTemplate.getText(),
              "value" : 0,
              "valueReceipt" : 0,
              "showInBasket" : "0",
              "showInFreeGoods" : "1",
              "mySplit1Q" : q1,//freeItem.index == 1 ? freeItem.quantity : 0,
              "mySplit1DD" : splitInfoDict.get(1) ? splitInfoDict.get(1).displayDateValue : Utils.getMinDate(),
              "mySplit1DDAnsi" : splitInfoDict.get(1) ? splitInfoDict.get(1).ansiDateValue : Utils.getMinDate(),
              "mySplit2Q" : q2,//freeItem.index == 2 ? freeItem.quantity : 0,
              "mySplit2DD" : splitInfoDict.get(2) ? splitInfoDict.get(2).displayDateValue : Utils.getMinDate(),
              "mySplit2DDAnsi" : splitInfoDict.get(2) ? splitInfoDict.get(2).ansiDateValue : Utils.getMinDate(),
              "mySplit3Q" : q3,//freeItem.index == 3 ? freeItem.quantity : 0,
              "mySplit3DD" : splitInfoDict.get(3) ? splitInfoDict.get(3).displayDateValue : Utils.getMinDate(),
              "mySplit3DDAnsi" : splitInfoDict.get(3) ? splitInfoDict.get(3).ansiDateValue : Utils.getMinDate(),
              "mySplit4Q" : q4,//freeItem.index == 4 ? freeItem.quantity : 0,
              "mySplit4DD" : splitInfoDict.get(4) ? splitInfoDict.get(4).displayDateValue : Utils.getMinDate(),
              "mySplit4DDAnsi" : splitInfoDict.get(4) ? splitInfoDict.get(4).ansiDateValue : Utils.getMinDate(),
              "mySplit5Q" : q5,//freeItem.index == 5 ? freeItem.quantity : 0,
              "mySplit5DD" : splitInfoDict.get(5) ? splitInfoDict.get(5).displayDateValue : Utils.getMinDate(),
              "mySplit5DDAnsi" : splitInfoDict.get(5) ? splitInfoDict.get(5).ansiDateValue : Utils.getMinDate(),
              "mySplit6Q" : q6,//freeItem.index == 6 ? freeItem.quantity : 0,
              "mySplit6DD" : splitInfoDict.get(6) ? splitInfoDict.get(6).displayDateValue : Utils.getMinDate(),
              "mySplit6DDAnsi" : splitInfoDict.get(6) ? splitInfoDict.get(6).ansiDateValue : Utils.getMinDate(),
              "myDiscountA" : orderItemDetail.myDiscountA || 0,
              "myDiscountB" : orderItemDetail.myDiscountB || 0,
              "myDiscountC" : orderItemDetail.myDiscountC || 0,
              "myDiscountD" : orderItemDetail.myDiscountD || 0,
              "myDiscountE" : orderItemDetail.myDiscountE || 0,
              "myDiscountF" : orderItemDetail.myDiscountF || 0,
              "myCurrencySymbol": me.currencySymbol,
              "discount" : freeItem.discount
            };
            itemsToAdd.push(itemToAdd);
            freeItemsToAdd.add(freeItem.prdMainPKey, itemToAdd);
        } 

      me.getLoItems().addItems(itemsToAdd);
      me.setFreeItemsInSplitDict(freeItemsToAdd);

    } else if (me.boMyPricingTerms && me.boOrderMeta.getId() == 'PreSales') {
      // If there are pricing terms, add splits based on presales records
      if (me.boMyPricingTerms.loMyPreSalesDeliveries) {
        // TODO: add here Info for Immediate Delivery
        let defaultSplitType = me.myDefaultSplitType != ' ' ? me.myDefaultSplitType : 'Direct';
        filteredItems['hasSplits'] = true;

        var preSalesDeliveries = [];
        if(me.boOrderMeta.myAddOneSplitAutomatically == "1"){
          var liImmediateDelivery = {
            "pKey": '',
            "deliveryDate": Utils.addDays2AnsiDate(Utils.createDateToday(), me.boOrderMeta.myDeliveryLeadTime),
            "myImDeliverySplit": true,
            "mySplitType": defaultSplitType
          };
          me.setMyImDeliverySplitPl(true);
          preSalesDeliveries.push(liImmediateDelivery);
        }

        /*if(me.boOrderMeta.myAddOneSplitAutomatically == "1" && me.boOrderMeta.mySoldToApplicable =="1" && me.luMySoldTo.myPartnerPKey){
          var liImmediateDelivery = {
            "pKey": '',
            "deliveryDate": Utils.addDays2AnsiDate(Utils.createDateToday(), me.boOrderMeta.myDeliveryLeadTime),
            "myImDeliverySplit": true,
            "mySplitType": defaultSplitType
          };
          preSalesDeliveries.push(liImmediateDelivery);
        }*/
        var deliveriesFromPricingTerm = me.boMyPricingTerms.loMyPreSalesDeliveries.getAllItems();
        var promise = when.resolve(me);
        var soldToDefault = defaultSplitType == 'Transfer' ? me.luMyDefaultTransferSoldTo.pKey : me.luMyDefaultDirectSoldTo.pKey
        promise = BoFactory.loadObjectByParamsAsync(
          "LuMyAccountRelationship",
          { "customerPKey": me.ordererPKey, "relationshipType":"AG", "orderCreation": true,  "notThisCustomer": soldToDefault }
          )
      .then (function(soldTo) {
          if(Utils.isDefined(soldTo.myPartnerPKey)){
            soldToDiffDefault = soldTo.myPartnerPKey
          }
          deliveriesFromPricingTerm.forEach(function(delivery) {
            preSalesDeliveries.push(delivery);
            /*if(me.boOrderMeta.myAddOneSplitAutomatically == "1" && me.boOrderMeta.mySoldToApplicable =="1" && me.luMySoldTo.myPartnerPKey){
              preSalesDeliveries.push(delivery);
            }*/
          });
          deliveriesQuantity = preSalesDeliveries.length;
          var quantityToDuplicate = 0;
          
          if(!Utils.isEmptyString(soldToDiffDefault)){
            quantityToDuplicate = deliveriesQuantity > 3 ? (6 - deliveriesQuantity) : deliveriesQuantity;
          }

          const originalPreSalesDeliveries = [...preSalesDeliveries];
  
          if(quantityToDuplicate > 0){
            for(var i = 0; i < quantityToDuplicate; i++){
              var splicePosition = (((i + 1) * 2) - 1)
              preSalesDeliveries.splice(splicePosition,0,originalPreSalesDeliveries[i]);
            }
          }
  
          for (var i = 0; i < preSalesDeliveries.length; i++) {
            me['myDDSplit'+(i+1)] = Utils.convertAnsiDate2Date(preSalesDeliveries[i].deliveryDate);
            me['myPreSalesDelivery'+(i+1)] = preSalesDeliveries[i].pKey;
            me['myPreSalesMinQuantity'+(i+1)] = preSalesDeliveries[i].myMinQuantity;
            me['myPreSalesMinValue'+(i+1)] = preSalesDeliveries[i].myMinValue;
            me['myType'+(i+1)] =  preSalesDeliveries[i].wholesaler && preSalesDeliveries[i].wholesaler != ' ' ? 'Transfer' : defaultSplitType;
            me['mySplit'+(i+1)+'PKey'] = PKey.next();
            /*if(defaultSplitType == 'Transfer' || ( preSalesDeliveries[i].wholesaler && preSalesDeliveries[i].wholesaler != ' ')){
              me['myWholesalerS'+(i+1)] = preSalesDeliveries[i].wholesaler != ' ' ? preSalesDeliveries[i].wholesaler : me.luMyDefaultTransferWholesaler.pKey;
            }*/
            if(defaultSplitType == 'Transfer'){
              if(quantityToDuplicate > 0 && ((i + 1) / 2) <= quantityToDuplicate && (i + 1) % 2 == 0){
                me['mySoldTo'+(i+1)] = soldToDiffDefault;
                me['myBillTo'+(i+1)] = " ";
                me['myShipTo'+(i+1)] = " ";
                me['myWholesalerS'+(i+1)] = " ";
              }
              else{
                me['mySoldTo'+(i+1)] = me.luMyDefaultTransferSoldTo.pKey;
                me['myBillTo'+(i+1)] = me.luMyDefaultTransferBillTo.pKey;
                me['myShipTo'+(i+1)] = me.luMyDefaultTransferShipTo.pKey;
                me['myWholesalerS'+(i+1)] = me.luMyDefaultTransferWholesaler.pKey;
              }
              
            }
            else{
              if(quantityToDuplicate > 0 && ((i + 1) / 2) <= quantityToDuplicate && (i + 1) % 2 == 0){
                me['mySoldTo'+(i+1)] = soldToDiffDefault;
                me['myBillTo'+(i+1)] = " ";
                me['myShipTo'+(i+1)] = " ";
                me['myDeliverTo'+(i+1)] = " ";
              }
              else{
                me['mySoldTo'+(i+1)] = me.luMyDefaultDirectSoldTo.pKey;
                me['myBillTo'+(i+1)] = me.luMyDefaultDirectBillTo.pKey;
                me['myShipTo'+(i+1)] = me.luMyDefaultDirectShipTo.pKey;
                if(me.salesOrg == 'C088'){
                  me['myDeliverTo'+(i+1)] = me.luMyDefaultDirectDeliverTo.pKey;
                }
              }
            }    
            
            me['myPaymentTerm'+(i+1)] = Utils.getToggleText("DomMyPaymentTerms", preSalesDeliveries[i].paymentTerms);
            /*if ((i+1) % 2 === 0 && me.boOrderMeta.myAddOneSplitAutomatically == "1" && me.boOrderMeta.mySoldToApplicable =="1" && me.luMySoldTo.myPartnerPKey) {
              me['mySoldTo'+(i+1)] = me.luMySoldTo.myPartnerPKey;
            }*/
            me['mySplit'+(i+1)+'ImDelivery'] = preSalesDeliveries[i].myImDeliverySplit ? "1" : "0";  
             filteredItems.forEach(function(orderItem) {
                 pSDeliveryDate = new Date (preSalesDeliveries[i].deliveryDate)
                 orderItem["mySplit"+(i+1)+"DDAnsi"] = Utils.convertDate2Ansi(pSDeliveryDate);
                 if(!Utils.isEmptyString(me['mySoldTo'+(i+1)])){
                  if(!Utils.isEmptyString(me['myWholesalerS'+(i+1)])){
                    orderItem["mySplit"+(i+1) +"DD"] = pSDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) + '^';
                  } else {
                    orderItem["mySplit"+(i+1) +"DD"] = pSDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) + '*';
                  }
                 } else if(Utils.isEmptyString(me['mySoldTo'+(i+1)])) {
                  if(!Utils.isEmptyString(me['myWholesalerS'+(i+1)])){
                    orderItem["mySplit"+(i+1) +"DD"] = pSDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) + '#';
                  } else {
                    orderItem["mySplit"+(i+1) +"DD"] = pSDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'});
                  }
                  }
                });                      
              }
        })
        
          }
        // TODO: Adapt LoOrderItems.AddItem and/or LoOrderItems.AddItemFromObject
        //  We are setting here only LOItems coming from product selection
        // If a product is added via scan or the UI, the values have to be added
        //
        //Adding the SoldToSplit automatically to the cycle order when AddOneSplitAutomatically and SoldToApplicable are checked on the order template.
    } else if(me.boOrderMeta.getId() == 'Cycle' && me.boOrderMeta.myAddOneSplitAutomatically == "1"){
      filteredItems['hasSplits'] = true;
      let defaultSplitType = me.myDefaultSplitType != ' ' ? me.myDefaultSplitType : 'Direct';
      var preSalesDeliveries = [];
      var liDelivery = {
        "pKey": '',
        "deliveryDate": Utils.addDays2AnsiDate(Utils.createDateToday(), me.boOrderMeta.myDeliveryLeadTime),
        "myImDeliverySplit": true,
        "mySplitType": defaultSplitType
      };
      preSalesDeliveries.push(liDelivery);

      /*if(Utils.isDefined(me.luMySoldTo.myPartnerPKey) && !Utils.isEmptyString(me.luMySoldTo.myPartnerPKey)){
        var liDelivery2 = {
          "pKey": '',
          "deliveryDate": Utils.addDays2AnsiDate(Utils.createDateToday(), me.boOrderMeta.myDeliveryLeadTime),
          "myImDeliverySplit": true,
          "mySplitType": defaultSplitType      
        };
        preSalesDeliveries.push(liDelivery2);
      }*/

      for (var i = 0; i < preSalesDeliveries.length; i++) {
        me['myDDSplit'+(i+1)] = Utils.convertAnsiDate2Date(preSalesDeliveries[i].deliveryDate);
        me['myType'+(i+1)] = defaultSplitType;
        me['mySplit'+(i+1)+'ImDelivery'] = preSalesDeliveries[i].myImDeliverySplit ? "1" : "0";
        me['mySplit'+(i+1)+'PKey'] = PKey.next();
        if(defaultSplitType == 'Transfer'){
          me['myWholesalerS'+(i+1)] = me.luMyDefaultTransferWholesaler.pKey;
          me['myBillTo'+(i+1)] = me.luMyDefaultTransferBillTo.pKey;
          me['myShipTo'+(i+1)] = me.luMyDefaultTransferShipTo.pKey;
          me['mySoldTo'+(i+1)] = me.luMyDefaultTransferSoldTo.pKey;
        }
        else {
          if(me.salesOrg == 'C088'){
            me['myDeliverTo'+(i+1)] = me.luMyDefaultDirectDeliverTo.pKey;
          }
          me['myBillTo'+(i+1)] = me.luMyDefaultDirectBillTo.pKey;
          me['myShipTo'+(i+1)] = me.luMyDefaultDirectShipTo.pKey;
          me['mySoldTo'+(i+1)] = me.luMyDefaultDirectSoldTo.pKey;
        }
        
        me['myPaymentTerm'+(i+1)] = Utils.getToggleText("DomMyPaymentTerms", preSalesDeliveries[i].paymentTerms);
          /*if ((i+1) % 2 === 0 && me.boOrderMeta.myAddOneSplitAutomatically == "1" && me.boOrderMeta.mySoldToApplicable =="1" && me.luMySoldTo.myPartnerPKey) {
            me['mySoldTo'+(i+1)] = me.luMySoldTo.myPartnerPKey;
          }*/

        filteredItems.forEach(function(orderItem) {
            pSDeliveryDate = new Date (preSalesDeliveries[i].deliveryDate);
            orderItem["mySplit"+(i+1)+"DDAnsi"] = Utils.convertDate2Ansi(pSDeliveryDate);
               if(!Utils.isEmptyString(me['mySoldTo'+(i+1)])){
                orderItem["mySplit"+(i+1) +"DD"] = pSDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) + '*';
              } else if(Utils.isEmptyString(me['mySoldTo'+(i+1)])) {
                orderItem["mySplit"+(i+1) +"DD"] = pSDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'});
              }
            });
          }
        }

    // Additional filter based on preSales products
    if (me.boMyPricingTerms.loMyPreSalesProducts && me.boOrderMeta.getId() == 'PreSales') {
      var preSalesProductsPKeys =  me.boMyPricingTerms.loMyPreSalesProducts.getAllItems() ;
      var filterForProducts = [];
      var filterForBrands = [];
      var filterForSubBrands = [];
      let fullboxMap ={};
      preSalesProductsPKeys.forEach(function (preSalesProductsPKey) {
        if(preSalesProductsPKey.productLevel == 'Product'){
          filterForProducts.push(preSalesProductsPKey.productPKey);
        }
        if(preSalesProductsPKey.productLevel == 'Brand'){
          filterForBrands.push(preSalesProductsPKey.myGroupId);
        }
        if(preSalesProductsPKey.productLevel == 'Flavor'){
          filterForSubBrands.push(preSalesProductsPKey.productPKey);
        }
        fullboxMap[preSalesProductsPKey.productPKey]= preSalesProductsPKey.myFullBoxOnly;
      });
      var filteredProducts = filteredItems.filter((oi) => filterForProducts.includes(oi.prdMainPKey));
      var filteredBrands = filteredItems.filter(oi => filterForBrands.includes(oi.groupId) && !filterForSubBrands.includes(oi.prdMainPKey));
      var filteredSubBrands = filteredItems.filter((oi) => filterForSubBrands.includes(oi.mySubBrandId));
      var filteredFreeItems = [];
      for (var key in freeItemsToAdd.data) {
        filteredFreeItems.push(freeItemsToAdd.get(key));
      }
      var filteredVirtualBOMTypeProducts = filteredItems.filter((oi) => oi.myBOMType == 'Virtual');

      me.getLoItems().removeAllItems();
      me.getLoItems().addItems(filteredProducts);
      me.getLoItems().addItems(filteredBrands);
      me.getLoItems().addItems(filteredSubBrands);
      me.getLoItems().addItems(filteredFreeItems);
      me.getLoItems().addItems(filteredVirtualBOMTypeProducts);
      me.getLoItems().forEach(item => {
        const prdMainPKey = item.prdMainPKey;
        if (prdMainPKey in fullboxMap) {
            item.myFullBoxOnly = fullboxMap[prdMainPKey];
        } else {
            item.myFullBoxOnly = null;  
        }
      });
    }

    // Filter Assortment 
    if (Utils.isDefined(productAssotmentProductList)) {
      var filteredItems = me.getLoItems().getItems();
      var assotmentProductsPkeys =  productAssotmentProductList.getAllItems().map( (oi) => (oi.prdMainPKey) );
      var filteredList = filteredItems.filter( (oi) => assotmentProductsPkeys.includes(oi.prdMainPKey));
      me.getLoItems().removeAllItems();
      me.getLoItems().addItems(filteredList);
    }
     

    if(me.boOrderMeta.id == "Exchange"){
      const exchangeAndExpired = me.getLoItems().getAllItems().filter(oi => oi.myAvailableForExchange == "1" && oi.myEligibleForExchange == "1");
      if(exchangeAndExpired.length > 0){
        const newItems = [];
        exchangeAndExpired.forEach(function(exAndExpired) {
          const newItem = {...exAndExpired};
          newItem.refPKey =`${exAndExpired.getRefPKey()}Exchanged`;
          newItem.myEligibleForExchange = "0"
          exAndExpired.myAvailableForExchange = "0";
          newItem.pKey = PKey.next();
          newItems.push(newItem);
        });
        me.getLoItems().addItems(newItems);
      }
      let itemFound;
      me.loMyExchangeItems.getAllItems().forEach(function (exItem){
        itemFound = me.loItems.getAllItems().find( (item) => (exItem.prdMainPKey == item.prdMainPKey && item.myAvailableForExchange == "1" && item.myEligibleForExchange == "0" ));
        if(Utils.isDefined(itemFound)){
          itemFound.setQuantity(exItem.quantity);
          itemFound.setDiscount(100);
          itemFound.setValue(exItem.value);
          itemFound.setBasePrice(exItem.basePrice);
          itemFound.setPrice(exItem.price);
        }
      });
    }

    me.setEARight();
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return filteredItems;
}