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
 * @this BoOrder
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
    
var promise;
var phase;
var checkIfPhaseConditionIsMet;
var currencySymbolMap = {
  "USD": "$",
  "EUR": "€"
};

//Reset stored register and category filters on order load
ApplicationContext.set("registerFilter", null);
ApplicationContext.set("categoryFilter", null);

var canceling = jsonQuery.params.map(function (a) {return a.field;}).indexOf("isCanceling") != -1;
var deletion = jsonQuery.params.map(function (a) {return a.field;}).indexOf("deletion") != -1;
me.setMyIsSplitOrder ( jsonQuery.params.map(function (a) {return a.field;}).indexOf("myIsSplitOrder") != -1 );

if (canceling) {
  me.setIsCancel("1");
  promise = me.loadForCancel(jsonQuery);
} else if (deletion) {
  promise = me.loadForDelete(jsonQuery);
} else {
  promise = Facade.getObjectAsync(BO_ORDER, jsonQuery).then(
    function (selfJson) {
      me.setProperties(selfJson);
      me.setSelectedPromotionPKey(" ");
      // Set additional properties that are passed by the process
      // (Add out of stock information that is not already stored on the database from current call)
      var index = 0;
      var callInContext_clbMainPKey;
      var callOutOfStockProducts;

      for (index in jsonQuery.params) {
        switch (jsonQuery.params[index].field) {
          case "clbMainPKey":
            let clbMainPKey = jsonQuery.params[index].value;
            // The order can be opened from a context outside a call
            // Don't overwrite order's visit value unless we are
            // passing an actual call(visit) pKey
            if (!Utils.isEmptyString(clbMainPKey)) {
              me.setCallInContext_clbMainPKey(clbMainPKey);
              me.setClbMainPKey();
            }
            break;
          case "callOutOfStockProducts":
            me.setCallOutOfStockProducts(jsonQuery.params[index].value);
            break;
        }
      }

      // Set CallInContext_clbMainPKey for Pre-order created from Visit Execution
      if (Utils.isEmptyString(me.getCallInContext_clbMainPKey()) && !Utils.isEmptyString(me.getClbMainPKey())) {
        me.setCallInContext_clbMainPKey(me.getClbMainPKey());
      }
      me.myCurrencySymbol = me.currency in currencySymbolMap ? currencySymbolMap[me.currency] : me.currency;
      /*if (me.getPaidAmount() >= 0) {
        me.setDebitCredit("Debit");
      } else {
        me.setDebitCredit("Credit");
      } */

      var jsonParams = me.prepareLookupsLoadParams(selfJson);
      return Facade.loadLookupsAsync(jsonParams);
    }).then(
    function (lookups) {
      me.assignLookups(lookups);

      return BoFactory.loadObjectByParamsAsync(
        "LuMyAccountRelationship",
        {"customerPKey" : me.getOrdererPKey(),"relationshipType":"AG" }
      )
    })
    .then(function(soldTo) {
      if (Utils.isDefined(soldTo)) {
        me.setLuMySoldTo(soldTo);
      } else {
        me.setLuMySoldTo(null);
      }
      return BoFactory.loadObjectByParamsAsync(
        "LuMyAccountRelationship",
        {"customerPKey" : me.getOrdererPKey(),"relationshipType":"ZC" }
      )
    })
    .then(function(wholesaler) {
      if (Utils.isDefined(wholesaler)) {
        me.setLuMyDefaultWholesaler(wholesaler);
      } else {
        me.setLuMyDefaultWholesaler(null);
      }
      return BoFactory.loadObjectByParamsAsync(
        "LuMyAccountRelationship",
        {"customerPKey" : me.getOrdererPKey(),"relationshipType":"WE" }
      )
    })
    .then(function(shipTo) {
      if (Utils.isDefined(shipTo)) {
        me.setLuMyDefaultShipTo(shipTo);
      } else {
        me.setLuMyDefaultShipTo(null);
      }
      return BoFactory.loadObjectByParamsAsync(
        "LuMyAccountRelationship",
        {"customerPKey" : me.getOrdererPKey(),"relationshipType":"RE" }
      )
    })
    .then(function(billTo) {
      if (Utils.isDefined(billTo)) {
        me.setLuMyDefaultBillTo(billTo);
      } else {
        me.setLuMyDefaultBillTo(null);
      }
      var orderMetaParams = [];
      var orderMetaQuery = {};
      orderMetaParams.push({field: "pKey", value: me.getSdoMetaPKey()});
      orderMetaParams.push({field: "considerModule", value: me.getLuOrderer().getConsiderModule()});
      orderMetaParams.push({field: "phase", value: me.getPhase()});
      orderMetaParams.push({field: "syncStatus", value: me.getSyncStatus()});
      orderMetaParams.push({field: "createOrOpenOrder", value: "1"});
      orderMetaQuery.params = orderMetaParams;

      return BoFactory.loadObjectByParamsAsync(BO_ORDERMETA, orderMetaQuery);
    }).then(
    function (boOrderMeta) {
      if (Utils.isDefined(boOrderMeta.getLoOrderItemMetas())) {
        me.setBoOrderMeta(boOrderMeta);

        //Load list instead of create to use the Merge Engine (shared load and create)
        //Encapsulated in the function "loadOrderItems"
        return me.loadOrderItems().then(
          function (loOrderItemsJson) {
            me.setLoItems(loOrderItemsJson);
            me.getLoItems().addItemChangedEventListener(me.onOrderItemChanged,me,"loItems");
            me.getLoItems().addItemChangedBatchEventListener(me.onOrderItemChanged,me,"loItems");

            var jsonParams = [];
            var filterQuery = {};
            jsonParams.push({field: "sdoMetaPKey", value: me.getSdoMetaPKey()});
            jsonParams.push({field: "sdoSubType", value: me.getBoOrderMeta().getSdoSubType()});
            filterQuery.params = jsonParams;

            return BoFactory.loadObjectByParamsAsync(LO_ITEMFILTER, filterQuery);
          }).then(
          function (loItemFilter) {
            me.setLoItemFilter(loItemFilter);
            //Set item filter counts
            //me.setItemFilterCounts();
            // Load item tab manager
            return me.loadItemTabManager();
          }).then(
          function () {
            //Set item filter counts
            //me.setItemFilterCounts();
            me.getBoItemTabManager().setBoCallCache(jsonQuery.boCallCache);
            //Perrigo is not using Selectable promotions.
            /*if (me.getBoOrderMeta().getConsiderSelectablePromotion() == "1") {
              return BoFactory.loadObjectByParamsAsync("LoSelectablePromotion", {
                currentDate: Utils.createAnsiDateToday(),
                customer: me.getOrdererPKey(),
                specialOrderHandling: me.getBoOrderMeta().getSpecialOrderHandling()}).then(
                function (selectablePromotions) {
                  me.setLoSelectablePromotion(selectablePromotions);
                  return BoFactory.createObjectAsync("BoHurdleEvaluationHelper", {selectablePromotions: selectablePromotions, orderCache: me});
                }).then(
                function (hurdleEvaluationHelper) {
                  me.setHurdleEvaluationHelper(hurdleEvaluationHelper);
                });
            } */
          }).then(
          /*function () {
            if (Utils.isEmptyString(me.getSplittingRule()) && me.isGroupingEnabled()) {
              me.determineSplittingRule();
            }
            me.determineItemSplittingGroups();

            return me.determinePaymentMethods(); 
          }).then( */
          function () {
            if (me.getPhase() === BLConstants.Order.PHASE_RELEASED || me.getSyncStatus() === BLConstants.Order.NOT_SYNCABLE) {
              return me.determineSysReleaseProcessPKey();
            } else {
              return "";
            }
          }).then(
          function (sysReleaseProcessPKey) {
            if (!Utils.isEmptyString(sysReleaseProcessPKey)) {
              return BoFactory.loadListAsync("LoSysReleaseProcessStep",  me.getQueryBy("sysReleaseProcessPKey", sysReleaseProcessPKey));
            } else {
              return undefined;
            }
          }).then(
          function (loSysReleaseProcessStep) {
            me.setSysReleaseProcessStepsExists("0");
            if (Utils.isDefined(loSysReleaseProcessStep)) {
              var stepItems = loSysReleaseProcessStep.getAllItems();
              if (stepItems.length > 0) {
                me.setSysReleaseProcessStepsExists("1");
              }
            }
            return BoFactory.loadListAsync("LoOrderAttachment", me.getQueryBy("sdoMainPKey", me.getPKey()));
          }).then(
          function (attachment) {
            if (Utils.isDefined(attachment)) {
              me.setLoOrderAttachment(attachment);
            }
            return BoFactory.loadObjectByParamsAsync("LoMyExchangeableQuotas", {});
          }).then(
            function (exchangeableQuotas) {
              if (Utils.isDefined(exchangeableQuotas)) {
                me.setLoMyExchangeableQuotas(exchangeableQuotas);
              } else {
                me.setLoMyExchangeableQuotas(null);
              }
              return BoFactory.loadObjectByParamsAsync(
                "BoMyPricingTerms",
                {"pKey" : me.getMyPreSalesId() }
              )
          })
          .then(function(pricingTerms) {
            if (Utils.isDefined(pricingTerms)) {
              me.setBoMyPricingTerms(pricingTerms);
              // We have pricing terms -> This is a presales
            } else {
              me.setBoMyPricingTerms(null);
            }
            //return BoFactory.loadObjectByParamsAsync(LO_ORDERNOTES, me.getQueryBy("sdoMainPKey", me.getPKey()));
            if (me.boOrderMeta.id === 'PreSales') {
              return BoFactory.loadObjectByParamsAsync("LoMyPricingCondition", {"pKey": pricingTerms.pKey });
            } else if (me.boOrderMeta.id === 'Cycle') {
              return BoFactory.loadObjectByParamsAsync("LuMyPricingCondition");
            }else if (me.boOrderMeta.id === 'Exchange') {
              return BoFactory.loadObjectByParamsAsync("LuMySplitForExchange", {"pKey": me.mySplitForExchange });
            }
          })
          .then(function(response) {
            if (me.boOrderMeta.id === 'PreSales') {
              if (Utils.isDefined(response)) {
                me.getBoMyPricingTerms().setLoMyPricingCondition(response);
              } else {
                me.getBoMyPricingTerms().setLoMyPricingCondition(null);
              }
            } else if (me.boOrderMeta.id === 'Cycle') {
              if (Utils.isDefined(response)) {
                var pTermId = response.pTermId;
                jsonQuery.myPricingTermPKey = pTermId;
                return BoFactory.loadObjectByParamsAsync("LoMyPricingCondition", {"pKey": pTermId });
              } else {
                me.getBoMyPricingTerms().setLuMyPricingCondition(null);
                return Promise.resolve(null); // Ensure a resolved promise for the next .then() chain
              }
            }else if (me.boOrderMeta.id === 'Exchange') {
              if (Utils.isDefined(response)) {
                me.setLuMySplitForExchange(response);
                return BoFactory.loadObjectByParamsAsync("LoMyExchangeItems", me.getQueryBy('orderPKey', me.mySplitForExchange));
              } else {
                me.setLuMySplitForExchange(null);
                return Promise.resolve(null);
              }
            }
          })
          .then(function(response) {
            if (me.boOrderMeta.id === 'Cycle' && Utils.isDefined(response)) {
              me.getBoMyPricingTerms().setLoMyPricingCondition(response);
            }
            if (me.boOrderMeta.id === 'Exchange' && Utils.isDefined(response)) {
              me.setLoMyExchangeItems(response);
            }
            return BoFactory.loadListAsync("LoMyOrderSplits", { "mainOrderPKey": me.getPKey()})
            }).then(function (loMyOrderSplits) {
              let deferreds = [];
              if (Utils.isDefined(loMyOrderSplits)) {
                // load order splits
                me.setLoMyOrderSplits(loMyOrderSplits);
                loMyOrderSplits.getAllItems().forEach(function(liMyOrderSplit) {
                  deferreds.push(BoFactory.loadObjectByParamsAsync("BoMySplitOrder",
                    { "pKey" :  liMyOrderSplit.pKey }));
                });
              }
              return when.all(deferreds);
            }).then(
              function(allSplitOrders) {
                me.getLoMyOrderSplits().removeAllItems();

                /*Clean List for Cycle Order -- Remove all Exchange Lines */

                /*CLEAN LIST - Remove Exchange Orders for Cycle Orders */
                let cleanedList = [];
                if (me.boOrderMeta.id === 'Cycle' || me.boOrderMeta.id === 'PreSales') {
                  allSplitOrders.forEach(function(liMyOrderSplit){

                    let dupeCheck = {};
                    let dupeCheckKey;
                    let cleanedItems = [];
                    liMyOrderSplit.loMySplitItems._all.forEach(function(splitItem){
                      dupeCheckKey = splitItem.pKey+splitItem.sdoItemMetaPKey;
                      if(splitItem.sdoItemMetaName != "Exchanged" && !Utils.isDefined(dupeCheck[dupeCheckKey])){
                        cleanedItems.push(splitItem);
                        dupeCheck[dupeCheckKey] = " ";
                      }
                    });
                    liMyOrderSplit.loMySplitItems._all = cleanedItems;
                    liMyOrderSplit.loMySplitItems._filtered = cleanedItems;
                  
                    cleanedList.push(liMyOrderSplit);
                  });


                  me.getLoMyOrderSplits().addListItems(cleanedList);
                }else{
                  me.getLoMyOrderSplits().addListItems(allSplitOrders);
                }

            return me.myLoadDiscountEngine().then(
              function(orderItemsforDiscountEngine){
                //FreeItemProductsInfo is loaded in MyLoadDiscountEngine, so call MyUpdateOrderItems after laoding the list.
                if(me.getMyIsSplitOrder() == false){
                  me.myUpdateOrderItems(jsonQuery.productAssotmentProductList);
                }
                me.setItemFilterCounts();

                me.myPrepareFlattenItemList("orderLoad",orderItemsforDiscountEngine);        

                return BoFactory.createListAsync(LO_MYBRANDSUMMARY, {})});
              })
              .then(function (object) {
                me.setLoMyBrandSummary(object);
                return BoFactory.createListAsync(LO_MYSOLDTO1SUMMARY, {});
              })
              .then(function (object) {
                me.setLoMySoldTo1Summary(object);
                return BoFactory.createListAsync(LO_MYSOLDTO2SUMMARY, {});
              })
              .then(function (object) {
                me.setLoMySoldTo2Summary(object);
                return BoFactory.createListAsync(LO_MYSOLDTO3SUMMARY, {});
              })
              .then(function (object) {
                me.setLoMySoldTo3Summary(object);
                return BoFactory.createListAsync(LO_MYSOLDTO4SUMMARY, {});
              })
              .then(function (object) {
                me.setLoMySoldTo4Summary(object);
                return BoFactory.createListAsync(LO_MYSOLDTO5SUMMARY, {});
              })
              .then(function (object) {
                me.setLoMySoldTo5Summary(object);
                return BoFactory.createListAsync(LO_MYSOLDTO6SUMMARY, {});
              })
              .then(function (object) {
                me.setLoMySoldTo6Summary(object);
                return BoFactory.loadListAsync("LoOrderOverview");
              })
              //set the exchange order on the main order
              .then(function(boList){
                if(me.loMyOrderSplits.getAllItems().length > 0 && Utils.isEmptyString(me.myExchangeOrder) && me.myOrderType != 'Exchange'){
                  for(var i = 0; i < me.loMyOrderSplits.getAllItems().length; i++){
                    for(var j = 0; j < boList.getAllItems().length; j++){
                      if(!Utils.isEmptyString(boList.getAllItems()[j].mySplitForExchange) && boList.getAllItems()[j].mySplitForExchange == me.loMyOrderSplits.getAllItems()[i].pKey && boList.getAllItems()[j].myExchangeType == 'Exchange'){
                        me.myExchangeOrder = boList.getAllItems()[j].pKey;
                      }
                    }
                  }
                }
                return BoFactory.loadObjectByParamsAsync(LO_ORDERNOTES, Utils.getParamsForDeprecatedDS("sdoMainPKey", me.getPKey()));
          }).then(
           function (loNotes) {
            me.setLoNotes(loNotes);

            var filterItems = me.getLoItemFilter().getAllItems();
            var defaultItemFilter;
            var alternativeDefaultItemFilter;
            var basketFilter;

            for (var i = 0; i < filterItems.length; i++) {
              if (!Utils.isDefined(alternativeDefaultItemFilter) && filterItems[i].getSortOrder() != "-1") {
                alternativeDefaultItemFilter = filterItems[i];
              }
              if (!Utils.isDefined(basketFilter) && filterItems[i].getFilterCode() == "Basket") {
                basketFilter = filterItems[i];
              }
              if (filterItems[i].getDefaultGroup() == "1") {
                defaultItemFilter = filterItems[i];
              }
            }

            // If order is read only (e.g. released) then set default filter to basket
            phase = me.getPhase();
            checkIfPhaseConditionIsMet = (phase == BLConstants.Order.PHASE_RELEASED || phase == BLConstants.Order.PHASE_CLOSED || phase == BLConstants.Order.PHASE_CANCELED ||
                                          phase == BLConstants.Order.PHASE_READY || phase == BLConstants.Order.PHASE_FEEDBACK || phase == BLConstants.Order.PHASE_VOIDED);
            if (checkIfPhaseConditionIsMet ||
                me.getBoOrderMeta().getMobilityRelevant() == "0" ||
                me.getResponsiblePKey() != ApplicationContext.get("user").getPKey()
               ) {
              defaultItemFilter = basketFilter;
            }

            // Store default filter at BoItemTabManager for category selection
            if (Utils.isDefined(defaultItemFilter)) {
              me.getBoItemTabManager().setDefaultItemFilter(defaultItemFilter);
            } else {
              me.getBoItemTabManager().setDefaultItemFilter(alternativeDefaultItemFilter);
            }

            // Set default item filter if flat list is configured
            if (me.getBoItemTabManager().getIsShowCategories() == "0" && Utils.isDefined(defaultItemFilter)) {
              me.getLoItemFilter().setCurrent(defaultItemFilter);
              me.getBoItemTabManager().setCurrentItemFilterId(me.getBoItemTabManager().getDefaultItemFilter().getFilterCode());
            }

            //Set IvcRefPKeys
            //me.setIvcRefPKeys();

            //Set inventory search keys for item meta and payment metas
            /*me.getBoOrderMeta().setIvcSearchKeysForItemMetas(
              me.getOrdererPKey(),
              me.getIvcRef1PKey(),
              me.getIvcRef2PKey(),
              me.getIvcRef3PKey(),
              me.getIvcRef4PKey(),
              me.getIvcRef5PKey()
            ); */

            /*me.getBoOrderMeta().setIvcSearchKeysForPaymentMetas(
              me.getPayerCustomerPKey(),
              me.getIvcRef1PKey(),
              me.getIvcRef2PKey(),
              me.getIvcRef3PKey(),
              me.getIvcRef4PKey(),
              me.getIvcRef5PKey()
            ); */

            //Preserve original value of phase and initialize ValidateForRelease variable
            me.setOrgPhase(me.getPhase());
            me.setValidateForRelease("0");

            //me.setPromotionCount(0);
            /*if (Utils.isSfBackend() && me.boOrderMeta.considerSelectablePromotion == "1") {
              var jsonParams = [];
              var jsonQuery = {};
              jsonParams.push({field: "currentDate", value: Utils.createAnsiDateToday()});
              jsonParams.push({field: "customer", value: me.ordererPKey});
              jsonQuery.params = jsonParams;

              return Facade.getObjectAsync("LuPromotionCount", jsonQuery).then(
                function (luPromotionCount) {
                  me.setPromotionCount(luPromotionCount.promotionCount);
                });
            } */
          }).then(
          /*function () {
            var loadPaymentPromise = when.resolve();
            checkIfPhaseConditionIsMet = ![BLConstants.Order.PHASE_RELEASED, BLConstants.Order.PHASE_READY].includes(me.getPhase());
            //set isPaymentCollected flag during order load if order payment exists for order in context
            if (me.getIsOrderPaymentRelevant() === '1' && checkIfPhaseConditionIsMet && me.getSyncStatus() != BLConstants.Order.NOT_SYNCABLE) {
              loadPaymentPromise = me.loadPayments().then(
                function(){
                  var loPayments = me.getLoPayments().getAllItems();
                  if (loPayments.length > 0) {
                    var savedPaymentMethod = loPayments[0].getPaymentMethod();
                    var currentPaymentMethod = me.getPaymentMethod();
                    if(savedPaymentMethod === currentPaymentMethod){
                      me.setIsPaymentCollected("1");
                    } else{
                      //if the payment method changes then delete order payment
                      me.getLoPayments().delete();
                    }
                  }
                });
            }
            return loadPaymentPromise;
          }).then( */
          function () {
            var checkOutdatedPromise = when.resolve();
            me.setObjectStatus(STATE.PERSISTED);
            phase = me.getPhase();
            checkIfPhaseConditionIsMet = (phase == BLConstants.Order.PHASE_RELEASED || phase == BLConstants.Order.PHASE_CLOSED || phase == BLConstants.Order.PHASE_CANCELED ||
                                          phase == BLConstants.Order.PHASE_READY || phase == BLConstants.Order.PHASE_FEEDBACK || phase == BLConstants.Order.PHASE_VOIDED);

            if (checkIfPhaseConditionIsMet ||
                me.getBoOrderMeta().getMobilityRelevant() == "0" ||
                me.getResponsiblePKey() != ApplicationContext.get("user").getPKey()
               ) {
              me.setObjectStatusFrozen(true);
            }

            if (!(checkIfPhaseConditionIsMet ||
                  me.getBoOrderMeta().getMobilityRelevant() == "0" ||
                  me.getResponsiblePKey() != ApplicationContext.get("user").getPKey()
                 )) {
              checkOutdatedPromise = me.checkOutdated();
            }

            return checkOutdatedPromise;
          }).then(
          function () {
            me.setFirstCalculation("1");

            //Read complex pricing configuration (calculation schema)
            if (
              Utils.isDefined(CP) &&
              (me.getBoOrderMeta().getComputePrice() === BLConstants.Order.BUTTON_MODE || me.getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE) &&
              me.getCndCpCalculationSchemaPKey() !== " "
            ) {
              return CP.PricingHandler.getInstance().initOrder(
                me.getPKey(),
                me.getSdoMetaPKey(),
                me.getOrdererPKey(),
                Utils.createDateToday(),
                me.getCurrency(),
                me.getCndCpCalculationSchemaPKey(),
                me.cpGetRelevantOrderAttributes(),
                me.getDistribChannel(),
                me.getDivision(),
                me.cpGetVariantOrderVariables(),
                me.getBoOrderMeta().getGeneratePricingLog()
              ).then(
                function () {
                  //Push order items with qty > 0 to pricing engine
                  var items = me.createPricingInformationForList();
                  var orderItemsBiggerZero = [];
                  var variantItemAttributes = [];
                  var orderItem;
                  var addProductsPromise = when.resolve();

                  for (var i = 0; i < items.length; i++) {
                    orderItem = items[i].getData();

                    if (Utils.isDefined(orderItem.quantity) && orderItem.quantity > 0) {
                      orderItemsBiggerZero.push(orderItem);
                      variantItemAttributes.push({
                        SdoItemPKey: orderItem.pKey,
                        VariantAttributes: me.cpGetVariantItemVariables(orderItem.pKey)
                      });
                    }
                  }

                  if (orderItemsBiggerZero.length > 0) {
                    addProductsPromise = CP.PricingHandler.getInstance().addProducts(orderItemsBiggerZero, variantItemAttributes);
                  } 

                  return addProductsPromise.then(
                    function () {
                      phase = me.getPhase();
                      checkIfPhaseConditionIsMet = (phase == BLConstants.Order.PHASE_RELEASED || 
                                                    phase == BLConstants.Order.PHASE_CANCELED || 
                                                    phase == BLConstants.Order.PHASE_READY);
                      if (!checkIfPhaseConditionIsMet && me.getSyncStatus() !== BLConstants.Order.NOT_SYNCABLE) {
                        var jsonParamsForProducts = me.getJsonQueryForProductForAdd();
                       /*during order load, if any product is found to be invalid then its quantity is set to 0
                        this change in quantity triggers determineSatisfiedRewardGroups which causes unexpected behaviour towards reward selection on ui
                        therefore, IsNotReadyForHurdleEvaluation is used to skip determineSatisfiedRewardGroups when it is triggered from this flow */
                        me.setIsNotReadyForHurdleEvaluation("1"); 

                        return me.getLoItems().processInvalidatedItems(
                          jsonParamsForProducts,
                          me.getBoItemTabManager().getAddProduct_CriterionAttribute(),
                          me.getBoOrderMeta().getLoOrderItemMetas(),
                          me.getHurdleEvaluationHelper()
                        );
                      } else {
                        return me.getLoItems().resetMergeEngineInvalidated(me.getBoItemTabManager().getAddProduct_CriterionAttribute());
                      }
                    }).then(
                    function (selfJson) {
                      return me.setEARight(selfJson);
                    }).then(
                    function () {
                      //reset IsNotReadyForHurdleEvaluation once processInvalidatedItems call is done
                      me.setIsNotReadyForHurdleEvaluation("0");

                      if ((me.getBoOrderMeta().getConsiderSelectablePromotion() == "1" && 
                           ![BLConstants.Order.PHASE_RELEASED, BLConstants.Order.PHASE_READY].includes(me.getPhase())) && me.getSyncStatus() !== BLConstants.Order.NOT_SYNCABLE) {
                        //onRewardChanged has a dependency to the Order object in the Pricing Engine
                        //therefore restoreRewardInformation and determineSatisfiedRewardGroups have to be called after CP.PricingHandler.getInstance().initOrder()
                        return me.restoreRewardInformation().then(
                          function () {
                            return me.getHurdleEvaluationHelper().evaluateHurdles(me, me.getBoItemTabManager().getBoCallCache(), " ").then(
                              function () {
                                return me.getHurdleEvaluationHelper().determineSatisfiedRewardGroups(" ", me.getLoSelectablePromotion());
                              });
                          });
                      }
                    }).then(
                    function () {
                      var isOrderValidForCalculation = ![BLConstants.Order.PHASE_RELEASED, BLConstants.Order.PHASE_READY].includes(me.getPhase()) &&
                          me.getDocTaType() !== "NonValuatedDeliveryNote";
                      var isEditMode = me.getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE;
                      var isButtonMode = me.getBoOrderMeta().getComputePrice() === BLConstants.Order.BUTTON_MODE;
                      var isCalculationMandatory = me.getBoOrderMeta().getRecalculationRequired() === BLConstants.Order.ALWAYS_CALCULATE;
                      var isCalculationRequired = me.getCalculationStatus() === BLConstants.Order.CALCULATION_REQUIRED;

                      if (isOrderValidForCalculation && isEditMode && (isCalculationMandatory || isCalculationRequired) && me.getSyncStatus() !== BLConstants.Order.NOT_SYNCABLE) {
                        if(me.getIsOrderPaymentRelevant() === '1'){
                          var oldPaidAmountReceipt = Utils.round(me.getPaidAmountReceipt(), 2, 1);
                          return me.cpCalculate().then(
                            function () {
                              var newPaidAmountReceipt = Utils.round(me.getPaidAmountReceipt(), 2, 1);
                              if(newPaidAmountReceipt < 0){
                                me.setPaidAmountReceipt(0);
                                newPaidAmountReceipt = 0;
                              }
                              //set paid amount and absolute paid amount manually since event handler is not attached to paid amount receipt yet
                              me.setPaidAmount(me.getPaidAmountReceipt());
                              me.setAbsolutePaidAmount(Math.abs(me.getPaidAmount()));
                              //compare old and new paid amount receipt, in case of difference, reset payment collected flag and delete order payment
                              if(oldPaidAmountReceipt !== newPaidAmountReceipt){
                                me.setIsPaymentCollected("0");
                                me.getLoPayments().delete();
                              }
                              return me;
                            });
                        } else{
                          return me.cpCalculate().then(
                            function () {
                              return me;
                            });
                        }
                      } else if (isOrderValidForCalculation && isButtonMode && isCalculationMandatory && !isCalculationRequired) {
                        me.setCalculationStatus(BLConstants.Order.CALCULATION_REQUIRED);
                        return me;
                      } else {
                        return me;
                      }
                    });
                });
            } else {
              return BoFactory.createObjectAsync("BoHelperSimplePricingCalculator", {}).then(
                function (calculator) {
                  me.setSimplePricingCalculator(calculator);
                  return me.setEARight();
                  /*phase = me.getPhase();
                  checkIfPhaseConditionIsMet = (phase == BLConstants.Order.PHASE_RELEASED || phase == BLConstants.Order.PHASE_CANCELED || phase == BLConstants.Order.PHASE_READY);

                  if (!checkIfPhaseConditionIsMet && me.getSyncStatus() !== BLConstants.Order.NOT_SYNCABLE) {
                    var jsonParamsForProducts = me.getJsonQueryForProductForAdd();
                    me.setIsNotReadyForHurdleEvaluation("1");

                    return me.getLoItems().processInvalidatedItems(
                      jsonParamsForProducts,
                      me.getBoItemTabManager().getAddProduct_CriterionAttribute(),
                      me.getBoOrderMeta().getLoOrderItemMetas(),
                      me.getHurdleEvaluationHelper()
                    );
                  } else {
                    return me.getLoItems().resetMergeEngineInvalidated(me.getBoItemTabManager().getAddProduct_CriterionAttribute());
                  }
                }).then(
                function (selfJson) {
                  return me.setEARight(selfJson); */
                }).then(
                function () {
                  me.setIsNotReadyForHurdleEvaluation("0");

                  if(me.getBoOrderMeta().getConsiderSelectablePromotion() == "1" && 
                     ![BLConstants.Order.PHASE_RELEASED, BLConstants.Order.PHASE_READY].includes(me.getPhase()) && me.getSyncStatus() !== BLConstants.Order.NOT_SYNCABLE) {
                    me.getHurdleEvaluationHelper().setSimplePricingCalculator(me.getSimplePricingCalculator());
                    return me.restoreRewardInformation().then(
                      function () {
                        return me.getHurdleEvaluationHelper().evaluateHurdles(me, me.getBoItemTabManager().getBoCallCache(), " ").then(
                          function () {
                            return me.getHurdleEvaluationHelper().determineSatisfiedRewardGroups(" ", me.getLoSelectablePromotion()).then(
                              function () {
                                return me;
                              });
                          });
                      });
                  }
                  return me;
                });
            }
          });
      } else {
        me.setIsInvalidOrder("1");
        return me;
      }
    });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}