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
 * @function loadOrderItems
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function loadOrderItems(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
  var loOrderItems;

  var promise;
    var jsonQuery = {
      params : []
    };
    var orderItemsQuery = me.getJsonQueryForLoItems();
    var useMergeEngine = orderItemsQuery.useMergeEngine;
    promise = BoFactory.createListAsync("LoOrderItems", {}).then(
      function (loItems) {
        loOrderItems = loItems;
        if (Utils.isCasBackend() || (!useMergeEngine && me.getMyIsSplitOrder() == false)) {
          return loOrderItems.mergeOrderItemList(orderItemsQuery).then(
            function () {
              jsonQuery.params= loOrderItems.buildQueryCondition(orderItemsQuery, "ALL");

              return BoFactory.loadObjectByParamsAsync("LoOrderItems", jsonQuery);
            }
          );
        } else if (Utils.isCasBackend() || (!useMergeEngine && me.getMyIsSplitOrder() == true)) {
          jsonQuery.params= loOrderItems.buildQueryCondition(orderItemsQuery, "ALL");
          return BoFactory.loadObjectByParamsAsync("LoOrderItems", jsonQuery);
        }
        else {
          return BoFactory.loadObjectByParamsAsync("LoOrderItems", orderItemsQuery).then(
            function (items) {
              return me.addMissingUoMsForAllItems(items, items.getAllItems()).then(
                function () {
                  items.orderByDefaultOrder();
                  return items;
                }
              );
            }
          );
        }
      }).then(
      function (result) {
        let itemsToExclude = []
        let itemsToAdd = []
        result.getAllItems().forEach(item => {
          if(item.myPrdState == null){
            //it's a empty product with quantity
            result.getAllItems().forEach(itemToFind => {
              if(item.prdMainPKey == itemToFind.prdMainPKey && item.pKey != itemToFind.pKey && itemToFind.myEligibleForExchange == '1'){
                let itemPKey = item.pKey
                let itemToFindPKey = itemToFind.pKey

                itemToFind.pKey = itemPKey
                itemToFind.quantity = item.quantity

                item.pKey = itemToFindPKey

                itemsToExclude.push(itemToFindPKey)
              }
            })
          }})
            result.removeItems(itemsToExclude)
            result.getAllItems().forEach(item => {
            if(item.myEligibleForExchange == '1' && item.myAvailableForExchange == '1' && me.getBoOrderMeta().getId() == "Exchange"){
              let newItem = {...item}
              newItem.pKey = PKey.next()
              newItem.myEligibleForExchange = '0'
              item.myAvailableForExchange = '0'
              BoFactory.loadObjectByParamsAsync("LoMyExchangeItems", me.getQueryBy('orderPKey', me.mySplitForExchange))
              .then(function(existingExchangeItems){
                  let exchangeItemFound = existingExchangeItems.getAllItems().find( (exItem) => exItem.prdMainPKey == newItem.prdMainPKey );
                  if(exchangeItemFound){
                    newItem.setQuantity(exchangeItemFound.getQuantity())
                    newItem.setValue(exchangeItemFound.getValue())
                  }
                  else{
                    newItem.setQuantity(0)
                    newItem.setValue(0)
                  }
              })
              itemsToAdd.push(newItem)
            }
            if(item.myIsBOMPart == '1' && (item.changedBOMType == '0' || item.changedBOMType == 'true' || item.changedBOMType == 'false' || item.changedBOMType == null)){
              let alreadyExistItemFound = result.getAllItems().find((exItem) => exItem.prdMainPKey == item.prdMainPKey && item.pKey != exItem.pKey && exItem.changedBOMType == '1');
              if(!alreadyExistItemFound){
                let newItem = {...item}
                newItem.pKey = PKey.next()
                newItem.myIsBOMPart = '0'
                newItem.changedBOMType = '1'
                newItem.quantity = 0
                newItem.value = 0
                newItem.myTotalQuantity = 0
                itemsToAdd.push(newItem)
              }
            }
          })
        result.addItems(itemsToAdd)
        result.getAllItems().forEach(item => {
          let value = (Utils.isDefined(item.value) ? item.value : 0)
          if(item.orderItemTemplate && item.orderItemTemplate == 'Exchanged' && item.basePrice && item.quantity){
            value = item.basePrice * item.quantity;
          }
          item.value = Number.parseFloat((value).toFixed(2));
          if(item.changedBOMType == 'true' || item.changedBOMType == 'false' || item.changedBOMType == null){
            item.changedBOMType = '0'
          }
        })
        result.getAllItems().forEach(currentOrderItem => {
          if(!Utils.isEmptyString(currentOrderItem.getMyBOMType())){
            var jsonQuery = {};
              var jsonParams = [];

              jsonParams.push(
                {
                  "field" : "customerPKey",
                  "value" : me.getLuOrderer().getPKey()
                }
              );
              jsonParams.push(
                {
                  "field" : "myBOMType",
                  "value" : currentOrderItem.getMyBOMType()
                }
              );
              jsonParams.push(
                {
                  "field" : "productPKey",
                  "value" : currentOrderItem.getPrdMainPKey()
                }
              );

              jsonQuery.params = jsonParams;
              BoFactory.loadObjectByParamsAsync("LoMyBOMProductParts", jsonQuery).then(function(loProductPartsItems){
                var loProductParts = loProductPartsItems.getAllItems();
                //var filteredParts = loProductParts.filter(part => part.parentPrdKey === currentOrderItem.prdMainPKey);
                var loItems = result.getAllItems();
                var parentBomSimpleBasePrice = 0;
                var prdParentPKey
                loProductParts.forEach((part)=>{
                  prdParentPKey = part.parentPrdKey;
                  // Find the corresponding item in loItems
                  var matchingItem = loItems.find(item => item.prdMainPKey === part.childPrdKey && item.myIsBOMPart == '1' && (item.changedBOMType == '0' || item.changedBOMType == 'true' || item.changedBOMType == 'false' || item.changedBOMType == null));
                  var matchingItemCurrentInner = loItems.find(item => item.prdMainPKey === prdParentPKey && !Utils.isEmptyString(item.myBOMType));
                  // If a matching item is found, update its properties.
                  if (matchingItem) {
                    if(Utils.isDefined(matchingItemCurrentInner)){
                      var sdoItemMetaPKey = matchingItemCurrentInner.sdoItemMetaPKey
                      var simpleBasePrice = matchingItem.getSimplePricingBasePrice();
                      if(matchingItemCurrentInner.orderItemTemplate == 'Standard'){        
                        sdoItemMetaPKey = me.boOrderMeta.getLoOrderItemMetas().getAllItems().find(item => item.id === 'BOM Parts - Standard').pKey;
                      }
                      else{
                        sdoItemMetaPKey = me.boOrderMeta.getLoOrderItemMetas().getAllItems().find(item => item.id === 'BOM Parts - Promo').pKey;
                      }
                      parentBomSimpleBasePrice += (part.prdQuantity * simpleBasePrice);
                      matchingItem.sdoItemMetaPKey = sdoItemMetaPKey;
                      matchingItem.parentItem = matchingItemCurrentInner.pKey;
                    }
                  }
                });
                var matchingItemCurrent = loItems.find(item => item.prdMainPKey === prdParentPKey && item.myBOMType == "Virtual");
                if(Utils.isDefined(matchingItemCurrent)){
                  if(matchingItemCurrent.myBOMType == "Virtual"){
                    matchingItemCurrent.setSimplePricingBasePrice(parentBomSimpleBasePrice);
                  }
                }
              })
          }
        })
        result.orderBy({ "myCycleBrandPriority": "ASC", "groupText": "ASC", "text1": "ASC" });
        loOrderItems = result;
        var suggestedQtyParams = [];
        var suggestedQtyQuery = {};   
        suggestedQtyParams.push( { "field" : "ordererPKey", "value": me.getOrdererPKey()});
        suggestedQtyParams.push( { "field" : "sdoMetaPKey", "value": me.getSdoMetaPKey()});
        suggestedQtyParams.push( { "field" : "documentType", "value":me.getDocumentType()});
        suggestedQtyParams.push( { "field" : "numberOfHistValues", "value": me.getBoOrderMeta().getNumberOfHistValues() < '0' ? 0 : me.getBoOrderMeta().getNumberOfHistValues() });

        suggestedQtyQuery.params = suggestedQtyParams;

        return (me.getBoOrderMeta().getConsiderQuantitySuggestion() === "LQty" && me.getPhase() === "Initial") ? BoFactory.loadObjectByParamsAsync("LoSuggestedQuantity", suggestedQtyQuery): undefined;
      }).then(function (loSuggestedQuantity) {
      if (Utils.isDefined(loSuggestedQuantity)) {
        me.setLoSuggestedQuantity(loSuggestedQuantity);
      }
      if (me.getIsCancel() !== "1") {
        loOrderItems.createDisplayInformation(me.getBoOrderMeta(),me.getLoSuggestedQuantity()); 
      }
      // Getting the Assortment Products with Type 'Exclusion' and filtering out those products from LoOrderItems
      var myAssortmentProductParams = [];
      var myAssortmentProductQuery = {};   
      myAssortmentProductParams.push( { "field" : "customerSalesOrg", "value": me.luOrderer.mySalesOrg});
      myAssortmentProductParams.push( { "field" : "customerIndustry", "value":me.luOrderer.myIndustryCode});
      myAssortmentProductQuery.params = myAssortmentProductParams;
      return BoFactory.loadObjectByParamsAsync("LoMyAssortmentProducts", myAssortmentProductQuery)
    }).then(function (loMyAssortmentProducts) {
      if (Utils.isDefined(loMyAssortmentProducts)) {
        me.setLoMyAssortmentProducts(loMyAssortmentProducts);
        
        // Create a Set of pKeys from myAssortmentProduct for faster lookup
        const assortmentProductKeys = new Set(
          loMyAssortmentProducts.getAllItems()
            .filter(item => (item.assortmentCode !== "KOTG947" && item.assortmentCode !== "KOTG948") ) // Exclude specific values
            .map(item => item.pKey)
        );
        
        // Initialize two arrays, one for filtered Assortment Items and one for filtered Ordered Items
        let filteredAssortmentItems = [];
        let filteredOrderedItems = [];
        let hasProductAssortmentItems = false;

        // Loop through LoItems only once
        loOrderItems.getAllItems().forEach(item => {
            if (item.myIsAssortmentProduct == '1') {
              hasProductAssortmentItems = true;
                if (!assortmentProductKeys.has(item.prdMainPKey) || item.type.startsWith('Free Good') || (item.parentType == 'FreeGoods' || item.parentType == 'FreeOfCharge' || item.parentType == 'ManualAdd')) {
                  filteredAssortmentItems.push(item);  // Keep the item if not in AssortmentProducts
                }else{

                }
            } else {
                if (!assortmentProductKeys.has(item.prdMainPKey) || item.type.startsWith('Free Good') || (item.parentType == 'FreeGoods' || item.parentType == 'FreeOfCharge' || item.parentType == 'ManualAdd')) {
                  filteredOrderedItems.push(item);  // Keep the item if not in AssortmentProducts
                }
            }           

        });
        // Now deciding which list to return based on the presence of assortment items
        const filteredItems = hasProductAssortmentItems ? filteredAssortmentItems : filteredOrderedItems;

        // Clear all items from loOrderItems
        loOrderItems.removeAllItems();
        // Add the filtered order items back to the loOrderItems list
        loOrderItems.addItems(filteredItems);
      }
      // Getting the Assortment Products with Type 'Exclusion' for ShipTo
      var myAssortmentProductParams = [];
      var myAssortmentProductQuery = {};   
      myAssortmentProductParams.push( { "field" : "customerIndustry", "value":me.luOrderer.myIndustryCode});
      myAssortmentProductQuery.params = myAssortmentProductParams;
      return BoFactory.loadObjectByParamsAsync("LoMyAssortmentProducts", myAssortmentProductQuery)
    })
    .then(function (loMyShipToItems) {
      if (Utils.isDefined(loMyShipToItems) ) {
        me.setLoMyShipToItems(loMyShipToItems);
      }
      // Getting the Assortment Products with Type 'Exclusion' for SoldTo
      var myAssortmentProductParams = [];
      var myAssortmentProductQuery = {};   
      var myIndustryCode = me.luMySoldTo && me.luMySoldTo.myIndustryCode ? me.luMySoldTo.myIndustryCode : ' ';
      myAssortmentProductParams.push( {"field" : "customerIndustry", "value":myIndustryCode});
      myAssortmentProductQuery.params = myAssortmentProductParams;
      return BoFactory.loadObjectByParamsAsync("LoMyAssortmentProducts", myAssortmentProductQuery)
    })
    .then(function (loMySoldToItems) {
      if (Utils.isDefined(loMySoldToItems) ) {
        me.setLoMySoldToItems(loMySoldToItems);
      }

      var orderItems = loOrderItems.getAllItems().map( item => ({...item, myCurrencySymbol: me.myCurrencySymbol }));
      loOrderItems.removeAllItems();
      loOrderItems.addListItems(orderItems);
      
      // Getting the Assortment Products with Type 'Exclusion' and filtering out those products from LoOrderItems
      var myAssortmentProductParams = [];
      var myAssortmentProductQuery = {};   
      myAssortmentProductParams.push( {"field" : "customerIndustry", "value":"FAKE_INDUSTRY"});
      myAssortmentProductParams.push( { "field" : "customerSalesOrg", "value": me.luOrderer.mySalesOrg});
      myAssortmentProductQuery.params = myAssortmentProductParams;
      return BoFactory.loadObjectByParamsAsync("LoMyAssortmentProducts", myAssortmentProductQuery)
    }).then(function (loMyAssortmentProducts) {
      if (Utils.isDefined(loMyAssortmentProducts)) {
        me.setLoMyAssortmentProducts(loMyAssortmentProducts);
      
        // Create a Set of pKeys from myAssortmentProduct for faster lookup
        const assortmentProductKeys = new Set(
          loMyAssortmentProducts.getAllItems()
            .filter(item => (item.assortmentCode === "KOTG947" || item.assortmentCode === "KOTG948")) // Exclude specific values
            .map(item => item.pKey)
        );

        // Loop through LoItems only once
        loOrderItems.getAllItems().forEach(item => {
          item.myAssortmentOrderType = '9999';
          item.myAssortmentSoldTo = '9999';
          if (!Utils.isEmptyString(item.eAN)) {
            item.myProductOrderItemCode = "EAN: " + item.eAN;
          }
          item.mySAPCode = Utils.startsWith(item.prdId, me.getSalesOrg() + "_") && Utils.startsWith(item.prdId.substr(5), '0') ? item.prdId.substr(13, item.prdId.length - 1) : 1;
          loMyAssortmentProducts.getAllItems().forEach(assortmentItem => {
            if(assortmentItem.pKey === item.prdMainPKey && assortmentItem.assortmentCode === 'KOTG947'){
              item.myAssortmentOrderType += "_"+ assortmentItem.type; //concats the several split types
            }
            if(assortmentItem.pKey === item.prdMainPKey && assortmentItem.assortmentCode === 'KOTG948'){
              item.myAssortmentSoldTo += "_"+ assortmentItem.type +"_"+ assortmentItem.AccountId; //concats the several split types
            }
          });
        });
      }
      
      //Clean the non Order Unit Products
      let cleanList = [];
      loOrderItems.getAllItems().forEach(i => {
        if(i.isOrderUnit == 1){
          cleanList.push(i);
        }
      });
    
      loOrderItems.removeAllItems();
      loOrderItems.addListItems(cleanList);
      
      return loOrderItems;
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

  return promise;
}
