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
 * @function createAsync
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} jsonQuery
 * @returns promise
 */
function createAsync(jsonQuery){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    if (!jsonQuery) {
  jsonQuery = {};
}

var pKey = PKey.next();
me.setPKey(pKey);
me.initId();
me.initCommitDate();
me.initDeliveryDate();
me.initPhase();
me.initTotalValue();
me.initGrossTotalValue();
me.initDeliveryRecipientPKey();
me.initOrdererPKey();
me.initCustomerOrderId();
me.initCancelReason();
me.initSdoMetaPKey();
me.initResponsiblePKey();
me.initClbMainPKey();
me.initCurrency();
me.initBillToCustomerPKey();
me.initDeliverToCustomerPKey();
me.initShipToCustomerPKey();
me.initPayerCustomerPKey();
me.initReleaseTime();
me.initBrokerCustomerPKey();
me.initDistribChannel();
me.initDivision();
me.initInvoiceId();
me.initSplittingOption();
me.initSplittingRule();
me.initSalesOrg();
me.initEtpWarehousePKey();
me.updateProperties(jsonQuery);
me.setPaymentReason(" ");
me.setPaymentMethod(" ");
me.setSelectedPromotionPKey(" ");
me.setDeliveryRecipientPKey("");
me.setBrokerCustomerPKey("");

me.setMyByPassAgreements("0");
//Reset stored register and category filters on order creation
ApplicationContext.set("registerFilter", null);
ApplicationContext.set("categoryFilter", null);

// EtpWarehousePKey is passed as a parameter to updateProperties, if it is reset to null there, setting it back to blank
if (me.getEtpWarehousePKey() === null) {
  me.setEtpWarehousePKey(" ");
}

if(jsonQuery.myIsSplitOrder) {
  me.setMyIsSplitOrder(true);
} else {
  me.setMyIsSplitOrder(false);
}

if(me.getMyIsSplitOrder() != true){
  me.setMyIsOrderChanged(true);
}
var user = ApplicationContext.get("user");
me.setSalesOrg(user.getBoUserSales().getSalesOrg());
me.setCurrency(ApplicationContext.get("salesOrg").getCurrency());
me.setPaidAmountCurrency(ApplicationContext.get("salesOrg").getCurrency());
// Actual value for TmgMainPKey will be set in PrepareOrder method since order meta is not available to verify SdoSubType
me.setTmgMainPKey(" ");
var jsonParams = me.prepareLookupsLoadParams(me);
var promise = Facade.loadLookupsAsync(jsonParams)
  .then(function (lookups) {
    me.assignLookups(lookups);
    var orderMetaParams = [];
    var orderMetaQuery = {};
    orderMetaParams.push({ field: "pKey", value: me.getSdoMetaPKey() });
    orderMetaParams.push({
      field: "considerModule",
      value: me.getLuOrderer().getConsiderModule(),
    });
    orderMetaParams.push({ field: "createOrOpenOrder", value: "1" });

    orderMetaQuery.params = orderMetaParams;

    return BoFactory.loadObjectByParamsAsync(BO_ORDERMETA, orderMetaQuery);
  })
  .then(function (object) {
    if (Utils.isDefined(object.getLoOrderItemMetas())) {
      me.setBoOrderMeta(object);

      //Preset order attributes
      //Needs to be done before getting the item list because the list finding uses order and order meta values
      return me
        .prepareOrder()
        .then(function () {
          if (
            me.getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE ||
            me.getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE
          ) {
            //Set CompleXPricingSchemaPKey for Replenishment Orders
            if (
              me.getDocumentType() === "Replenishment" &&
              !Utils.isEmptyString(
                me.getBoOrderMeta().getCndCpCalculationSchemaPKey()
              )
            ) {
              me.setCndCpCalculationSchemaPKey(
                me.getBoOrderMeta().getCndCpCalculationSchemaPKey()
              );
            } else {
              return me.cpDetermineCalculationSchema();
            }
          }
        }).then(function () {
          return BoFactory.loadObjectByParamsAsync("LoMyExchangeableQuotas", {});
        }).then(function (exchangeableQuotas) {
          if (Utils.isDefined(exchangeableQuotas)) {
            me.setLoMyExchangeableQuotas(exchangeableQuotas);
          } else {
            me.setLoMyExchangeableQuotas(null);
          }

          return BoFactory.createListAsync("LoSplittingGroupResult", {});
        })
        .then(function (list) {
          if (Utils.isDefined(list)) {
            me.setLoSplittingGroups(list);
          }

          return BoFactory.loadObjectByParamsAsync(
            "BoDeliveryRole",
            me.getQueryBy("customerPKey", me.getOrdererPKey())
          );
        })
        .then(function (boDeliveryRole) {
          //Load the BoDeliveryRole of the customer to get the splitting option and rule of the customer
          me.determineSplittingOption(boDeliveryRole.getSdoSplittingOption());
          me.determineSplittingRule(
            boDeliveryRole.getSdoSplittingOption(),
            boDeliveryRole.getSdoSplittingRule()
          );         
          return BoFactory.loadObjectByParamsAsync(
            "LuMyAccountRelationship",
            {"customerPKey" : jsonQuery.ordererPKey,"relationshipType":"AG" }
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
            {"customerPKey" : jsonQuery.ordererPKey,"relationshipType":"ZC" }
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
            {"customerPKey" : jsonQuery.ordererPKey,"relationshipType":"RE" }
          )
        })
        .then(function(billTo) {
          if (Utils.isDefined(billTo)) {
            me.setLuMyDefaultBillTo(billTo);
          } else {
            me.setLuMyDefaultBillTo(null);
          }
          return BoFactory.loadObjectByParamsAsync(
            "LuMyAccountRelationship",
            {"customerPKey" : jsonQuery.ordererPKey,"relationshipType":"WE" }
          )
        })
        .then(function(shipTo) {
          if (Utils.isDefined(shipTo)) {
            me.setLuMyDefaultShipTo(shipTo);
          } else {
            me.setLuMyDefaultShipTo(null);
          }
          return BoFactory.loadObjectByParamsAsync(
            "BoMyPricingTerms",
            {"pKey" : jsonQuery.myPricingTermPKey }
          )
        }).then(function(pricingTerms) {
          if (Utils.isDefined(pricingTerms)) {
            me.setBoMyPricingTerms(pricingTerms);
            me.setMyPreSalesId(jsonQuery.myPricingTermPKey);
            me.setMyByPassAgreements(jsonQuery.myByPassAgreements);
            // We have pricing terms -> This is a presales
          } else {
            me.setBoMyPricingTerms(null);
          }
        
          if (me.boOrderMeta.id === 'PreSales') {
            return BoFactory.loadObjectByParamsAsync("LoMyPricingCondition", {"pKey": jsonQuery.myPricingTermPKey });
          } else if (me.boOrderMeta.id === 'Cycle') {
            return BoFactory.loadObjectByParamsAsync("LuMyPricingCondition");
          }else if (me.boOrderMeta.id === 'Exchange') {
            return BoFactory.loadObjectByParamsAsync("LuMySplitForExchange", {"pKey": jsonQuery.mySplitForExchange });
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
              me.setDeliveryDate(response.myDeliveryDate);
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
          var jsonParams = {
            recordType: "Main",
          };
          return Facade.selectSQL("DsLuRecordType", "UserTask", jsonParams)
        }).then(function(recordType){
          if(me.getMyIsSplitOrder() != true){
            me.setMyRecordTypeId(recordType[0].pKey);
          }
        })
        .then(function () {
          if (jsonQuery.copy) {
            me.setOrderStatus("copy");
            var jsonPrms = [];
            jsonPrms.push({
              field: "sdoMetaPKey",
              value: me.getSdoMetaPKey(),
            });
            jsonPrms.push({
              field: "sdoSubType",
              value: me.getBoOrderMeta().getSdoSubType(),
            });

            var jsonQry = {};
            jsonQry.params = jsonPrms;

            return BoFactory.loadObjectByParamsAsync(
              LO_ITEMFILTER,
              jsonQry
            ).then(function (object) {
              me.setLoItemFilter(object);
              me.setObjectStatus(STATE.NEW | STATE.DIRTY);
            });
          } else {
            //Load list instead of create to use the Merge Engine (shared load and create)
            //Encapsulated in the function "loadOrderItems"
            return me
              .loadOrderItems()
              .then(function (object) {
                me.setLoItems(object);
                me.get("loItems").addItemChangedEventListener(me.onOrderItemChanged,me,"loItems");
                me.get("loItems").addItemChangedBatchEventListener(me.onOrderItemChanged,me,"loItems");
                if(me.getMyIsSplitOrder() == false){
                  me.myUpdateOrderItems();
                }
                    
                return me.myLoadDiscountEngine().then(
                  function(orderItemsforDiscountEngine){
                    me.myPrepareFlattenItemList("orderCreate",orderItemsforDiscountEngine); 

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
                return BoFactory.createListAsync(LO_ORDERNOTES, {});
              })
              .then(function (object) {
                me.setLoNotes(object);

                var jsonParams = [];
                jsonParams.push({
                  field: "sdoMetaPKey",
                  value: me.getSdoMetaPKey(),
                });
                jsonParams.push({
                  field: "sdoSubType",
                  value: me.getBoOrderMeta().getSdoSubType(),
                });

                var jsonQuery = {};
                jsonQuery.params = jsonParams;

                return BoFactory.loadObjectByParamsAsync(
                  LO_ITEMFILTER,
                  jsonQuery
                );
              })
              .then(function (object) {
                me.setLoItemFilter(object);


                // Load item tab manager
                return me.loadItemTabManager();
              })
              .then(function () {
                //Set item filter counts
                me.setItemFilterCounts();
                me.getBoItemTabManager().setBoCallCache(jsonQuery.boCallCache);
                if (
                  me.getBoOrderMeta().getConsiderSelectablePromotion() == "1"
                ) {
                  return BoFactory.loadObjectByParamsAsync(
                    "LoSelectablePromotion",
                    {
                      currentDate: Utils.createAnsiDateToday(),
                      customer: me.getOrdererPKey(),
                      specialOrderHandling: me
                        .getBoOrderMeta()
                        .getSpecialOrderHandling(),
                    }
                  )
                    .then(function (selectablePromotions) {
                      me.setLoSelectablePromotion(selectablePromotions);
                      return BoFactory.createObjectAsync(
                        "BoHurdleEvaluationHelper",
                        {
                          selectablePromotions: selectablePromotions,
                          orderCache: me,
                        }
                      );
                    })
                    .then(function (hurdleEvaluationHelper) {
                      me.setHurdleEvaluationHelper(hurdleEvaluationHelper);
                      return me.restoreRewardInformation();
                    });
                }
                return when.resolve();
              })
              .then(function () {
                me.setPromotionCount(0);
                if (
                  Utils.isSfBackend() &&
                  me.boOrderMeta.considerSelectablePromotion == "1"
                ) {
                  return Facade.getObjectAsync("LuPromotionCount", {
                    params: [
                      {
                        field: "currentDate",
                        value: Utils.createAnsiDateToday(),
                      },
                      { field: "customer", value: me.ordererPKey },
                    ],
                  }).then(function (luPromotionCount) {
                    me.setPromotionCount(luPromotionCount.promotionCount);
                  });
                }
              })
              .then(function () {
                var filterItems = me.getLoItemFilter().getAllItems();
                var defaultItemFilter;
                var alternativeDefaultItemFilter;

                for (var i = 0; i < filterItems.length; i++) {
                  if (
                    !Utils.isDefined(alternativeDefaultItemFilter) &&
                    filterItems[i].getSortOrder() != "-1"
                  ) {
                    alternativeDefaultItemFilter = filterItems[i];
                  }

                  if (filterItems[i].getDefaultGroup() == "1") {
                    defaultItemFilter = filterItems[i];
                    break;
                  }
                }

                // Store default filter at BoItemTabManager for category selection
                if (Utils.isDefined(defaultItemFilter)) {
                  me.getBoItemTabManager().setDefaultItemFilter(
                    defaultItemFilter
                  );
                } else {
                  me.getBoItemTabManager().setDefaultItemFilter(
                    alternativeDefaultItemFilter
                  );
                }

                // Set default item filter if flat list is configured
                if (
                  me.getBoItemTabManager().getIsShowCategories() == "0" &&
                  Utils.isDefined(defaultItemFilter)
                ) {
                  me.getLoItemFilter().setCurrent(defaultItemFilter);
                  me.getBoItemTabManager().setCurrentItemFilterId(
                    me
                      .getBoItemTabManager()
                      .getDefaultItemFilter()
                      .getFilterCode()
                  );
                }

                me.setObjectStatus(STATE.NEW | STATE.DIRTY);

                return me.setEARight();
              })
              .then(function () {
                me.setCalculationStatus("0");

                me.setFirstCalculation("0");

                //Read complex pricing configuration (calculation schema)
                if (
                  Utils.isDefined(CP) &&
                  (me.getBoOrderMeta().getComputePrice() === BLConstants.Order.BUTTON_MODE ||
                    me.getBoOrderMeta().getComputePrice() === BLConstants.Order.EDIT_MODE) &&
                  me.getCndCpCalculationSchemaPKey() !== " "
                ) {
                  return CP.PricingHandler.getInstance()
                    .initOrder(
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
                    )
                    .then(function () {
                      //Push order items with qty > 0 to pricing engine
                      var items = me.createPricingInformationForList();
                      var orderItemsBiggerZero = [];
                      var variantItemAttributes = [];
                      var currentItem;
                      var orderItem;

                      for (var i = 0; i < items.length; i++) {
                        orderItem = items[i].getData();

                        if (
                          Utils.isDefined(orderItem.quantity) &&
                          orderItem.quantity > 0
                        ) {
                          orderItemsBiggerZero.push(orderItem);
                          variantItemAttributes.push({
                            SdoItemPKey: orderItem.pKey,
                            VariantAttributes: me.cpGetVariantItemVariables(
                              orderItem.pKey
                            ),
                          });
                        }
                      }

                      if (orderItemsBiggerZero.length > 0) {
                        return CP.PricingHandler.getInstance().addProducts(
                          orderItemsBiggerZero,
                          variantItemAttributes
                        );
                      }
                    });
                } else {
                  return BoFactory.createObjectAsync(
                    "BoHelperSimplePricingCalculator",
                    {}
                  ).then(function (calculator) {
                    me.setSimplePricingCalculator(calculator);
                    if (
                      me.getBoOrderMeta().getConsiderSelectablePromotion() ==
                      "1"
                    ) {
                      me.getHurdleEvaluationHelper().setSimplePricingCalculator(
                        calculator
                      );
                    }
                  });
                }
              });
          }
        })
        .then(function () {
          //Cleanup Boolean Values
          if(me.getMyByPassAgreements() === "true") me.setMyByPassAgreements("1");
          if(me.getSf_mobilityRelease() === "true") me.setSf_mobilityRelease("1");
          if(me.getMyImDeliverySplit() === "true") me.setMyImDeliverySplit("1");
          if(me.getMyIsSoldToSplit() === "true") me.setMyIsSoldToSplit("1");

          if(me.getMyByPassAgreements() === "false") me.setMyByPassAgreements("0");
          if(me.getSf_mobilityRelease() === "false") me.setSf_mobilityRelease("0");
          if(me.getMyImDeliverySplit() === "false") me.setMyImDeliverySplit("0");
          if(me.getMyIsSoldToSplit() === "false") me.setMyIsSoldToSplit("0");

          if(me.getMyByPassAgreements() === " ") me.setMyByPassAgreements("0");
          if(me.getSf_mobilityRelease() === " ") me.setSf_mobilityRelease("0");
          if(me.getMyImDeliverySplit() === " ") me.setMyImDeliverySplit("0");
          if(me.getMyIsSoldToSplit() === " ") me.setMyIsSoldToSplit("0");
          return me;
        });
    } else {
      me.setIsInvalidOrder("1");
      return me;
    }
  });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
