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
 * @function myCalculateDiscounts
 * @this BoOrder
 * @kind businessobject
 * @namespace CUSTOM
 */
function myCalculateDiscounts(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    me.setMyIsOrderChanged(false);
    me.setPricingDate(Utils.createDateToday());

    AppLog.log("Discount Engine Start" + Utils.createAnsiDateNow());
    AppLog.log("Discount Engine Start (ms)" + Date.now());

    var orderItems = me.getLoItems().getAllItems();
    var flattenedSkuDict = Utils.createDictionary();
    var flattenedSubBrandDict = Utils.createDictionary();
    var flattenedBrandDict = Utils.createDictionary();
    var orderItemDisposalListDict = Utils.createDictionary();
    var freeItemsToDelete = Utils.createDictionary();
      //Loop through all the order Items and 3 individual product level based dictionaries (commercial policy based flattening) 
      for (var i = 0; i < orderItems.length; i++){
          var currentOrderItem = orderItems[i];
          var isPreSalesOrder = me.boOrderMeta.id === "PreSales" ? true : false;
          var isImmediateDeliveryEligible = me.getBoMyPricingTerms().getImmediateDeliveryEligible() == "1" ? true : false;
          //We are looping through the order Items, so we build a dict and use it to fetch data while adding free items
          if (currentOrderItem.getParentType() != "FreeGoods" && currentOrderItem.getParentType() != "FreeOfCharge" && currentOrderItem.getParentType() != "ManualAdd"){
          orderItemDisposalListDict.add(currentOrderItem.getPrdMainPKey(),currentOrderItem);
            //If BOM_Type__c is empty then they are prd parts so only include them for Flatenning process.
            if (currentOrderItem.getMyTotalQuantity() > 0){
            var currentPrdSubBrand = currentOrderItem.getCriterion4();
            var currentPrdBrand = currentOrderItem.getCriterion3();
            var currentSku = currentOrderItem.getPrdMainPKey();
            var currentItemQuantity = currentOrderItem.getMyTotalQuantity();

            var currentFlattenedOrderItem = flattenedSkuDict ? flattenedSkuDict.get(currentSku) : null;
            var currentFlattenedSubBrand = flattenedSubBrandDict ? flattenedSubBrandDict.get(currentPrdSubBrand) : null;
            var currentFlattenedBrand = flattenedBrandDict ? flattenedBrandDict.get(currentPrdBrand) : null;
            var isCountOverTotalDiscount = currentOrderItem.getCountOverTotalDiscount() == "1" ? true : false;
            var allSplitsValid = isPreSalesOrder && isImmediateDeliveryEligible && isCountOverTotalDiscount ;
            var checkIndividualSplit = isPreSalesOrder && !isImmediateDeliveryEligible && isCountOverTotalDiscount;

            var currentItemSplit1Q, currentItemSplit2Q, currentItemSplit3Q, currentItemSplit4Q, currentItemSplit5Q, currentItemSplit6Q;
            var currentItemQuantity, currentItemValue;

            if(!isPreSalesOrder || allSplitsValid){
            currentItemSplit1Q = currentOrderItem.getMySplit1Q();
            currentItemSplit2Q = currentOrderItem.getMySplit2Q();
            currentItemSplit3Q = currentOrderItem.getMySplit3Q();
            currentItemSplit4Q = currentOrderItem.getMySplit4Q();
            currentItemSplit5Q = currentOrderItem.getMySplit5Q();
            currentItemSplit6Q = currentOrderItem.getMySplit6Q();
            }
            else{
              currentItemSplit1Q = checkIndividualSplit && me.getMySplit1ImDelivery() == "0" ? currentOrderItem.getMySplit1Q() : 0;
              currentItemSplit2Q = checkIndividualSplit && me.getMySplit2ImDelivery() == "0" ? currentOrderItem.getMySplit2Q() : 0;
              currentItemSplit3Q = checkIndividualSplit && me.getMySplit3ImDelivery() == "0" ? currentOrderItem.getMySplit3Q() : 0;
              currentItemSplit4Q = checkIndividualSplit && me.getMySplit4ImDelivery() == "0" ? currentOrderItem.getMySplit4Q() : 0;
              currentItemSplit5Q = checkIndividualSplit && me.getMySplit5ImDelivery() == "0" ? currentOrderItem.getMySplit5Q() : 0;
              currentItemSplit6Q = checkIndividualSplit && me.getMySplit6ImDelivery() == "0" ? currentOrderItem.getMySplit6Q() : 0;
            }
            currentItemQuantity = currentItemSplit1Q + currentItemSplit2Q + currentItemSplit3Q + currentItemSplit4Q + currentItemSplit5Q + currentItemSplit6Q;
            currentItemValue = currentItemQuantity * currentOrderItem.getBasePrice();
            var incrementValue = currentItemQuantity > 0 ? 1 : 0;

            var currentItemSplit1Q = currentOrderItem.getMySplit1Q();
            var currentItemSplit2Q = currentOrderItem.getMySplit2Q();
            var currentItemSplit3Q = currentOrderItem.getMySplit3Q();
            var currentItemSplit4Q = currentOrderItem.getMySplit4Q();
            var currentItemSplit5Q = currentOrderItem.getMySplit5Q();
            var currentItemSplit6Q = currentOrderItem.getMySplit6Q();

            if(Utils.isDefined(currentFlattenedOrderItem)){
              currentFlattenedOrderItem.totalVolume = currentItemQuantity;
              currentFlattenedOrderItem.totalValue = currentItemValue;
              currentFlattenedOrderItem.currentItemSplit1Q = currentItemSplit1Q;
              currentFlattenedOrderItem.currentItemSplit2Q = currentItemSplit2Q;
              currentFlattenedOrderItem.currentItemSplit3Q = currentItemSplit3Q;
              currentFlattenedOrderItem.currentItemSplit4Q = currentItemSplit4Q;
              currentFlattenedOrderItem.currentItemSplit5Q = currentItemSplit5Q;
              currentFlattenedOrderItem.currentItemSplit6Q = currentItemSplit6Q;
            }
            else {
              var flattenedItem = {
                "product" : currentSku,
                "subBrand" : currentPrdSubBrand,
                "brand" : currentPrdBrand,
                "totalVolume" : currentItemQuantity,
                "totalValue" : currentItemValue,
                "noOfSkus" : incrementValue,
                "split1Q" : currentItemSplit1Q,
                "split2Q" : currentItemSplit2Q,
                "split3Q" : currentItemSplit3Q,
                "split4Q" : currentItemSplit4Q,
                "split5Q" : currentItemSplit5Q,
                "split6Q" : currentItemSplit6Q
              }
                flattenedSkuDict.add(currentSku,flattenedItem);
            }
            // Virtual or Physical BOMs can be scope or applications of commercial policy rules, so include them on the Sku dict but not in SubBrand & Brand dict.
            if(Utils.isEmptyString(currentOrderItem.getMyBOMType())){
              if(Utils.isDefined(currentFlattenedSubBrand)){
                  currentFlattenedSubBrand.totalVolume += currentItemQuantity;
                  currentFlattenedSubBrand.totalValue += currentItemValue;
                  currentFlattenedSubBrand.split1Q += currentItemSplit1Q;
                  currentFlattenedSubBrand.split2Q += currentItemSplit2Q;
                  currentFlattenedSubBrand.split3Q += currentItemSplit3Q;
                  currentFlattenedSubBrand.split4Q += currentItemSplit4Q;
                  currentFlattenedSubBrand.split5Q += currentItemSplit5Q;
                  currentFlattenedSubBrand.split6Q += currentItemSplit6Q;
                  currentFlattenedSubBrand.noOfSkus += incrementValue;
              }
              else{
                var flattenedItem = {
                  "product" : currentPrdSubBrand,
                  "subBrand" : currentPrdSubBrand,
                  "brand" : currentPrdBrand,
                  "totalVolume" : currentItemQuantity,
                  "totalValue" : currentItemValue,
                  "noOfSkus" : incrementValue,
                  "split1Q" : currentItemSplit1Q,
                  "split2Q" : currentItemSplit2Q,
                  "split3Q" : currentItemSplit3Q,
                  "split4Q" : currentItemSplit4Q,
                  "split5Q" : currentItemSplit5Q,
                  "split6Q" : currentItemSplit6Q
                }
                flattenedSubBrandDict.add(currentPrdSubBrand,flattenedItem);
              }

              if(Utils.isDefined(currentFlattenedBrand)){
                currentFlattenedBrand.totalVolume += currentItemQuantity;
                currentFlattenedBrand.totalValue += currentItemValue;
                currentFlattenedBrand.split1Q += currentItemSplit1Q;
                currentFlattenedBrand.split2Q += currentItemSplit2Q;
                currentFlattenedBrand.split3Q += currentItemSplit3Q;
                currentFlattenedBrand.split4Q += currentItemSplit4Q;
                currentFlattenedBrand.split5Q += currentItemSplit5Q;
                currentFlattenedBrand.split6Q += currentItemSplit6Q;

                currentFlattenedBrand.noOfSkus += incrementValue;
                  if(!currentFlattenedBrand.subBrand.includes(currentPrdSubBrand)){
                    currentFlattenedBrand.noOfSubBrands += incrementValue;
                  }
                  currentFlattenedBrand.subBrand = currentFlattenedBrand.subBrand + ";" + currentPrdSubBrand;
              }
              else{
                var flattenedItem = {
                  "product" : currentPrdBrand,
                  "subBrand" : currentPrdSubBrand,
                  "brand" : currentPrdBrand,
                  "totalVolume" : currentItemQuantity,
                  "totalValue" : currentItemValue,
                  "noOfSkus" : incrementValue,
                  "noOfSubBrands" : incrementValue,
                  "noOfBrands" : incrementValue,
                  "split1Q" : currentItemSplit1Q,
                  "split2Q" : currentItemSplit2Q,
                  "split3Q" : currentItemSplit3Q,
                  "split4Q" : currentItemSplit4Q,
                  "split5Q" : currentItemSplit5Q,
                  "split6Q" : currentItemSplit6Q
                }
                flattenedBrandDict.add(currentPrdBrand,flattenedItem);
              }
            }
            }
          }
        else if(currentOrderItem.getParentType() == "FreeGoods" || currentOrderItem.getParentType() == "FreeOfCharge"){
          freeItemsToDelete.add(currentOrderItem.getPKey());
        }
      }
      me.getBoMyDiscountEngineManager().setFlattenedSkuDict(flattenedSkuDict);
      me.getBoMyDiscountEngineManager().setFlattenedSubBrandDict(flattenedSubBrandDict);
      me.getBoMyDiscountEngineManager().setFlattenedBrandDict(flattenedBrandDict);

      var prdRuleAppliedDict = Utils.createDictionary();
      var freeItemsToAdd = Utils.createDictionary();
      var freeOfChargeItemsToadd = Utils.createDictionary();
      
      //Loop through all order Items and build ProductRulesApplied dictionary.
      //Below logic will handle all the commercial policy rule validations, calculate the discounts and set on order items.
      for (var i = 0; i < orderItems.length; i++){
        var currentOrderItem = orderItems[i];
          //Handle change in the Qty value and reset discounts accordingly
          if (currentOrderItem.getMyTotalQuantity() == 0){
            me.getLoItems().suspendListRefresh();
            currentOrderItem.setDiscount(0);
            currentOrderItem.setValue(0);
            currentOrderItem.setMyDiscountA(0);
            currentOrderItem.setMyDiscountB(0);
            currentOrderItem.setMyDiscountC(0);
            currentOrderItem.setMyDiscountD(0);
            currentOrderItem.setMyDiscountE(0);
            currentOrderItem.setMyDiscountF(0);
            currentOrderItem.setMyDiscountBase(0);
            me.getLoItems().resumeListRefresh(true);
          }
          //Handle 100% discount scenario
          else if (currentOrderItem.getMyTotalQuantity() > 0 && currentOrderItem.getOneHundredDiscount() == "1"){
            me.getLoItems().suspendListRefresh();
            currentOrderItem.setDiscount(100);
            currentOrderItem.setValue(0);
            currentOrderItem.setMyDiscountA(100);
            currentOrderItem.setMyDiscountB(0);
            currentOrderItem.setMyDiscountC(0);
            currentOrderItem.setMyDiscountD(0);
            currentOrderItem.setMyDiscountE(0);
            currentOrderItem.setMyDiscountF(0);
            currentOrderItem.setMyDiscountBase(0);
            me.getLoItems().resumeListRefresh(true);
          }
          //Handle Commercial Policy Rule Determinations
          else if (currentOrderItem.getMyTotalQuantity() > 0 && 
          currentOrderItem.getMyIsPrdFlattenedByAgreements() != '1' && currentOrderItem.getNotDiscountable() != '1' && 
          currentOrderItem.getParentType() != "FreeGoods" && currentOrderItem.getParentType() != "FreeOfCharge" && currentOrderItem.getParentType() != "ManualAdd" && 
          (currentOrderItem.getMyBOMType() == "Physical" || (Utils.isEmptyString(currentOrderItem.getMyBOMType()) && currentOrderItem.getMyParentBOMType() == "Virtual") ||
          (Utils.isEmptyString(currentOrderItem.getMyBOMType()) && Utils.isEmptyString(currentOrderItem.getMyParentBOMType())))){
          var layerADiscount = 0, layerBDiscount =0, layerCDiscount=0, layerDDiscount=0, layerEDiscount=0, layerFDiscount=0, layerBaseDiscount=0 ;
          var layerAConditionApplied, layerBConditionApplied, layerCConditionApplied, layerDConditionApplied, layerEConditionApplied, layerFConditionApplied;
          var layerAFreeItem,layerBFreeItem,layerCFreeItem,layerDFreeItem,layerEFreeItem,layerFFreeItem;
          var layerAFreeQty = 0,layerBFreeQty = 0,layerCFreeQty = 0,layerDFreeQty = 0,layerEFreeQty = 0,layerFFreeQty = 0;
          var commercialPolicyValidRulesDict = me.getBoMyDiscountEngineManager().getCommercialPolicyValidRulesDict();
          for (var key in commercialPolicyValidRulesDict.data) {
            var currentRule = commercialPolicyValidRulesDict.get(key);
            currentRule.isRuleSatisfied = false;
            var isSkuInApplication = !Utils.isEmptyString(currentRule.application) && currentRule.application.includes(currentOrderItem.getPrdMainPKey());
            var isSubBrandInApplication = !Utils.isEmptyString(currentRule.application) &&  currentRule.application.includes(currentOrderItem.getCriterion4());
            var isBrandInApplication = !Utils.isEmptyString(currentRule.application) &&  currentRule.application.includes(currentOrderItem.getCriterion3());

            if(currentRule.typeOfDiscount == 'Free of Charge' && isSkuInApplication){
              var factor = 0;
              if(Utils.isDefined(currentRule.qtyToBuy) && (currentRule.qtyToBuy > 0) && Utils.isDefined(currentRule.qtyToGive) && (currentRule.qtyToGive > 0) && (currentOrderItem.getMyTotalQuantity() >= currentRule.qtyToBuy)){
                 factor = Utils.roundDown((currentOrderItem.getMyTotalQuantity() / currentRule.qtyToBuy),0);
              }
              var freeItemQty = factor * currentRule.qtyToGive;
              var freeItemPkey = currentRule.application;
              
              var freeItem = freeOfChargeItemsToadd.get(freeItemPkey);
              if(freeItemQty > 0){
                if(!freeItem){
                  var freeItem = {
                    "prdMainPKey" : freeItemPkey,
                    "quantity" : freeItemQty,
                    "condition" : currentRule.pricingConditionPKey,
                    "typeOfDisc" : currentRule.typeOfDiscount
                  }
                  freeOfChargeItemsToadd.add(freeItemPkey, freeItem);
                }
                else{
                  //duplicate line items for same product can result in free item summation
                  if(!(currentRule.pricingConditionPKey == freeItem.condition && freeItem.prdMainPKey == currentOrderItem.prdMainPKey)){
                  freeItem.quantity += freeItemQty;
                  }
                }
              }
            }

            if((isSkuInApplication || isSubBrandInApplication || isBrandInApplication)){
              var currentRuleScope = currentRule.scope;
              var totalQuantity = 0;
              var totalValue = 0;
              var totalSkuCount = 0;
              var totalBrandCount = 0;
              currentRuleScope.forEach(function(scope){
                var flattendSku = scope ? flattenedSkuDict.get(scope) : null;
                var flattenedSubBrand = scope ? flattenedSubBrandDict.get(scope) : null;
                var flattenedBrand = scope ? flattenedBrandDict.get(scope) : null;
    
                var currentQuantity = flattendSku ? flattendSku.totalVolume : flattenedSubBrand ? flattenedSubBrand.totalVolume : flattenedBrand ? flattenedBrand.totalVolume : 0;
                totalQuantity = totalQuantity + currentQuantity;
                var currentValue = flattendSku ? flattendSku.totalValue : flattenedSubBrand ? flattenedSubBrand.totalValue : flattenedBrand ? flattenedBrand.totalValue : 0;
                totalValue = totalValue + currentValue;
                var currentSkuCount = flattendSku ? flattendSku.noOfSkus : flattenedSubBrand ? flattenedSubBrand.noOfSkus : flattenedBrand ? flattenedBrand.noOfSkus : 0;
                totalSkuCount = totalSkuCount + currentSkuCount;
                var currentBrandCount = flattenedBrand ? flattenedBrand.noOfBrands : 0;
                totalBrandCount = totalBrandCount + currentBrandCount;
              });

              var isValidMinQty = currentRule.minQty && currentRule.minQty != 0 ? true : false;
              var isValidMaxQty = currentRule.maxQty && currentRule.maxQty != 0 ? true : false;
              var isValidMinValue = currentRule.minValue && currentRule.minValue != 0 ? true : false;
              var isValidMaxValue = currentRule.maxValue && currentRule.maxValue != 0 ? true : false;
              var isValidMinRef = currentRule.minRef && currentRule.minRef != 0 ? true : false;
              var isValidMaxRef = currentRule.maxRef && currentRule.maxRef != 0 ? true : false;
              var isValidMinBrands = currentRule.minBrands && currentRule.minBrands != 0 ? true : false; 
              var isValidMaxBrands = currentRule.maxBrands && currentRule.maxBrands != 0 ? true : false;
              var isValidConditionProductMin = currentRule.conditionProductMin && currentRule.conditionProductMin != 0 ? true : false;
              var isValidConditionProductMax = currentRule.conditionProductMax && currentRule.conditionProductMax != 0 ? true : false;

              var checkMandatoryCondition = function(){
                var isSuccess = false;
                
                var currentRuleMandatory = currentRule.mandatory;
                var totalQuantity = 0;
                currentRuleMandatory.forEach(function(mandatory){
                  var flattendSku = mandatory ? flattenedSkuDict.get(mandatory) : null;
                  var flattenedSubBrand = mandatory ? flattenedSubBrandDict.get(mandatory) : null;
                  var flattenedBrand = mandatory ? flattenedBrandDict.get(mandatory) : null;
      
                  var currentQuantity = flattendSku ? flattendSku.totalVolume : flattenedSubBrand ? flattenedSubBrand.totalVolume : flattenedBrand ? flattenedBrand.totalVolume : 0;
                  totalQuantity = totalQuantity + currentQuantity;
                });

                return isSuccess = ((isValidConditionProductMax && isValidConditionProductMin) && (currentRule.conditionProductMin <= totalQuantity) && (totalQuantity <= currentRule.isValidConditionProductMax)) ? true :
                ((isValidConditionProductMin && !isValidConditionProductMax) && (currentRule.conditionProductMin <= totalQuantity)) ? true :
                ((!isValidConditionProductMin && isValidConditionProductMax) && (totalQuantity <= currentRule.isValidConditionProductMax)) ? true : false ;
              };
              var isMandatoryCheckNeeded = ((isValidConditionProductMin || isValidConditionProductMax) && currentRule.mandatory.length > 0) ? true : false;
              var mandatoryConditionResult = isMandatoryCheckNeeded ? checkMandatoryCondition() : null;
              var appliedDiscount = 0;

              var checkQuantity = function(){
                var isSuccess = false;
                if(mandatoryConditionResult == true || mandatoryConditionResult == null){
                  
                return isSuccess = ((isValidMinQty && isValidMaxQty) && (currentRule.minQty <= totalQuantity) && (totalQuantity <= currentRule.maxQty)) ? true :
                  ((isValidMinQty && !isValidMaxQty) && (currentRule.minQty <= totalQuantity)) ? true :
                  ((!isValidMinQty && isValidMaxQty) && (totalQuantity <= currentRule.maxQty)) ? true :
                  currentRule.minQty == 0 && currentRule.maxQty == 0 ? true : false;
                }
              };

              var checkValue = function(){
                var isSuccess = false;
                if(mandatoryConditionResult == true || mandatoryConditionResult == null){

                return isSuccess = ((isValidMinValue && isValidMaxValue) && (currentRule.minValue <= totalValue) && (totalValue <= currentRule.maxValue)) ? true :
                  ((isValidMinValue && !isValidMaxValue) && (currentRule.minValue <= totalValue)) ? true :
                  ((isValidMinValue && !isValidMaxValue) && (currentRule.minValue <= totalValue)) ? true :
                  currentRule.minValue == 0 && currentRule.maxValue == 0 ? true : false;
                }
              };

              var checkSkuRef = function(){
                var isSuccess = false;
                if(mandatoryConditionResult == true || mandatoryConditionResult == null){
                return isSuccess = ((isValidMinRef && isValidMaxRef) && (currentRule.minRef <= totalSkuCount) && (totalSkuCount <= currentRule.maxRef)) ? true :
                  ((isValidMinRef && !isValidMaxRef) && (currentRule.minRef <= totalSkuCount)) ? true :
                  ((!isValidMinRef && isValidMaxRef) && (totalSkuCount <= currentRule.maxRef)) ? true :
                  currentRule.minRef == 0 && currentRule.maxRef == 0 ? true : false;
                }
              };

              var checkBrandCount = function(){
                var isSuccess = false;
                if(mandatoryConditionResult == true || mandatoryConditionResult == null){
                return isSuccess = ((isValidMinBrands && isValidMaxBrands) && (currentRule.minBrands <= totalBrandCount) && (totalBrandCount <= currentRule.maxBrands)) ? true :
                  ((isValidMinBrands && !isValidMaxBrands) && (currentRule.minBrands <= totalBrandCount)) ? true :
                  ((!isValidMinBrands && isValidMaxBrands) && (totalBrandCount <= currentRule.maxBrands)) ? true :
                  currentRule.minBrands == 0 && currentRule.maxBrands == 0 ? true : false;
                }
              };
  
              if(currentRule.layer == "A"){
                currentRule.isRuleSatisfied = currentRule.layerAThresholdType == 'Ordered volume' ? checkQuantity() : currentRule.layerAThresholdType ==    'Ordered value' ? checkValue() : false;
                var appliedDiscount = currentRule.isRuleSatisfied ? currentRule.discountPercent : 0;
                }
              if(currentRule.layer == "B" || currentRule.layer == "C" || currentRule.layer == "E" || currentRule.layer == "F"){
                if(checkQuantity() && checkSkuRef() && checkBrandCount()) {
                  currentRule.isRuleSatisfied = true;
                }
                var appliedDiscount = currentRule.isRuleSatisfied ? currentRule.discountPercent : 0;
              }
              if(currentRule.layer == "D"){
                var scope = currentRuleScope[0]; //It’s a time dependent layer and we can have only one rule per product maximum.
                var flattendSku = flattenedSkuDict ? flattenedSkuDict.get(scope) : null;
                var flattenedSubBrand = flattenedSubBrandDict ? flattenedSubBrandDict.get(scope) : null;
                var flattenedBrand = flattenedBrandDict ? flattenedBrandDict.get(scope) : null;
                var maxDeliveryDate = currentRule.maxDeliveryDate;

                var split1Qty = (flattendSku && currentOrderItem.getMySplit1DDAnsi() <= maxDeliveryDate) ? flattendSku.split1Q : (flattenedSubBrand && currentOrderItem.getMySplit1DDAnsi() <= maxDeliveryDate) ? flattenedSubBrand.split1Q : (flattenedBrand && currentOrderItem.getMySplit1DDAnsi() <= maxDeliveryDate) ? flattenedBrand.split1Q : 0;
                var split2Qty = (flattendSku && currentOrderItem.getMySplit2DDAnsi() <= maxDeliveryDate) ? flattendSku.split2Q : (flattenedSubBrand && currentOrderItem.getMySplit2DDAnsi() <= maxDeliveryDate) ? flattenedSubBrand.split2Q : (flattenedBrand && currentOrderItem.getMySplit2DDAnsi() <= maxDeliveryDate) ? flattenedBrand.split2Q : 0;
                var split3Qty = (flattendSku && currentOrderItem.getMySplit3DDAnsi() <= maxDeliveryDate) ? flattendSku.split3Q : (flattenedSubBrand && currentOrderItem.getMySplit3DDAnsi() <= maxDeliveryDate) ? flattenedSubBrand.split3Q : (flattenedBrand && currentOrderItem.getMySplit3DDAnsi() <= maxDeliveryDate) ? flattenedBrand.split3Q : 0;
                var split4Qty = (flattendSku && currentOrderItem.getMySplit4DDAnsi() <= maxDeliveryDate) ? flattendSku.split4Q : (flattenedSubBrand && currentOrderItem.getMySplit4DDAnsi() <= maxDeliveryDate) ? flattenedSubBrand.split4Q : (flattenedBrand && currentOrderItem.getMySplit4DDAnsi() <= maxDeliveryDate) ? flattenedBrand.split4Q : 0;
                var split5Qty = (flattendSku && currentOrderItem.getMySplit5DDAnsi() <= maxDeliveryDate) ? flattendSku.split5Q : (flattenedSubBrand && currentOrderItem.getMySplit5DDAnsi() <= maxDeliveryDate) ? flattenedSubBrand.split5Q : (flattenedBrand && currentOrderItem.getMySplit5DDAnsi() <= maxDeliveryDate) ? flattenedBrand.split5Q : 0;
                var split6Qty = (flattendSku && currentOrderItem.getMySplit6DDAnsi() <= maxDeliveryDate) ? flattendSku.split6Q : (flattenedSubBrand && currentOrderItem.getMySplit6DDAnsi() <= maxDeliveryDate) ? flattenedSubBrand.split6Q : (flattenedBrand && currentOrderItem.getMySplit6DDAnsi() <= maxDeliveryDate) ? flattenedBrand.split6Q : 0;

                var qtyBeforeDeliveryDate = split1Qty + split2Qty + split3Qty + split4Qty + split5Qty + split6Qty;
                var totalQuantity = flattendSku ? flattendSku.totalVolume : flattenedSubBrand ? flattenedSubBrand.totalVolume : flattenedBrand ? flattenedBrand.totalVolume : 0;
                var actualPercent = (qtyBeforeDeliveryDate / totalQuantity) * 100;
                var minPercentBeforeMaxDeliveryDate = currentRule.minPercentBeforeMaxDeliveryDate;
                
                if((mandatoryConditionResult == true || mandatoryConditionResult == null) && (actualPercent >= minPercentBeforeMaxDeliveryDate)){
                  appliedDiscount = currentRule.discountPercent;
                  currentRule.isRuleSatisfied = true;
                }
            }
            if(currentRule.isRuleSatisfied){
                switch (currentRule.layer){
                      case "A":
                        layerADiscount = appliedDiscount;
                        layerAConditionApplied = currentRule.pricingConditionPKey;
                        layerAFreeItem = currentRule.freeGoodProduct;
                        layerAFreeQty = currentRule.freeGoodQty;
                        layerBaseDiscount = currentRule.baseDiscount;
                      break;
                      case "B":
                        layerBDiscount = appliedDiscount;
                        layerBConditionApplied = currentRule.pricingConditionPKey;
                        layerBFreeItem = currentRule.freeGoodProduct;
                        layerBFreeQty = currentRule.freeGoodQty;
                      break;
                      case "C":
                        layerCDiscount = appliedDiscount;
                        layerCConditionApplied = currentRule.pricingConditionPKey;
                        layerCFreeItem = currentRule.freeGoodProduct;
                        layerCFreeQty = currentRule.freeGoodQty;
                      break;
                      case "D":
                        layerDDiscount = appliedDiscount;
                        layerDConditionApplied = currentRule.pricingConditionPKey;
                        layerDFreeItem = currentRule.freeGoodProduct;
                        layerDFreeQty = currentRule.freeGoodQty;
                      break;
                      case "E":
                        layerEDiscount = appliedDiscount;
                        layerEConditionApplied = currentRule.pricingConditionPKey;
                        layerEFreeItem = currentRule.freeGoodProduct;
                        layerEFreeQty = currentRule.freeGoodQty;
                      break;
                      case "F":
                        layerFDiscount = appliedDiscount;
                        layerFConditionApplied = currentRule.pricingConditionPKey;
                        layerFFreeItem = currentRule.freeGoodProduct;
                        layerFFreeQty = currentRule.freeGoodQty;
                      break;
                }
                var prdRuleAvailable = prdRuleAppliedDict.get(currentOrderItem.getPrdMainPKey());
                if(!prdRuleAvailable){
                  var ruleAppliedOnItem ={
                    "layerADisc" : layerADiscount,
                    "layerBDisc" : layerBDiscount,
                    "layerCDisc" : layerCDiscount,
                    "layerDDisc" : layerDDiscount,
                    "layerEDisc" : layerEDiscount,
                    "layerFDisc" : layerFDiscount,
                    "layerAConditionApplied" : layerAConditionApplied,
                    "layerBConditionApplied" : layerBConditionApplied,
                    "layerCConditionApplied" : layerCConditionApplied,
                    "layerDConditionApplied" : layerDConditionApplied,
                    "layerEConditionApplied" : layerEConditionApplied,
                    "layerFConditionApplied" : layerFConditionApplied,
                    "layerAFreeItem" : layerAFreeItem,
                    "layerAFreeQty" : layerAFreeQty,
                    "layerBFreeItem" : layerBFreeItem,
                    "layerBFreeQty" : layerBFreeQty,
                    "layerCFreeItem" : layerCFreeItem,
                    "layerCFreeQty" : layerCFreeQty,
                    "layerDFreeItem" : layerDFreeItem,
                    "layerDFreeQty" : layerDFreeQty,
                    "layerEFreeItem" : layerEFreeItem,
                    "layerEFreeQty" : layerEFreeQty,
                    "layerFFreeItem" : layerFFreeItem,
                    "layerFFreeQty" : layerFFreeQty,
                    "layerBaseDiscount" : layerBaseDiscount
                  };
                  prdRuleAppliedDict.add(currentOrderItem.getPrdMainPKey(), ruleAppliedOnItem);
                }
                else 
                {
                  if(layerADiscount > prdRuleAvailable.layerADisc){
                    prdRuleAvailable.layerADisc = layerADiscount;
                    prdRuleAvailable.layerAConditionApplied = layerAConditionApplied;
                    prdRuleAvailable.layerAFreeItem = layerAFreeItem;
                    prdRuleAvailable.layerAFreeQty = layerAFreeQty;
                    prdRuleAvailable.layerBaseDiscount = layerBaseDiscount;
                  }
                  if(layerBDiscount > prdRuleAvailable.layerBDisc){
                    prdRuleAvailable.layerBDisc = layerBDiscount;
                    prdRuleAvailable.layerBConditionApplied = layerBConditionApplied;
                    prdRuleAvailable.layerBFreeItem = layerBFreeItem;
                    prdRuleAvailable.layerBFreeQty = layerBFreeQty;
                  }
                  if(layerCDiscount > prdRuleAvailable.layerCDisc){
                    prdRuleAvailable.layerCDisc = layerCDiscount;
                    prdRuleAvailable.layerCConditionApplied = layerCConditionApplied;
                    prdRuleAvailable.layerCFreeItem = layerCFreeItem;
                    prdRuleAvailable.layerCFreeQty = layerCFreeQty;
                  }
                  if(layerDDiscount > prdRuleAvailable.layerDDisc){
                    prdRuleAvailable.layerDDisc = layerDDiscount;
                    prdRuleAvailable.layerDConditionApplied = layerDConditionApplied;
                    prdRuleAvailable.layerDFreeItem = layerDFreeItem;
                    prdRuleAvailable.layerDFreeQty = layerDFreeQty;
                  }
                  if(layerEDiscount > prdRuleAvailable.layerEDisc){
                    prdRuleAvailable.layerEDisc = layerEDiscount;
                    prdRuleAvailable.layerEConditionApplied = layerEConditionApplied;
                    prdRuleAvailable.layerEFreeItem = layerEFreeItem;
                    prdRuleAvailable.layerEFreeQty = layerEFreeQty;
                  }
                  if(layerFDiscount > prdRuleAvailable.layerFDisc){
                    prdRuleAvailable.layerFDisc = layerFDiscount;
                    prdRuleAvailable.layerFConditionApplied = layerFConditionApplied;
                    prdRuleAvailable.layerFFreeItem = layerFFreeItem;
                    prdRuleAvailable.layerFFreeQty = layerFFreeQty;
                  }
                }
              }
          }
        }
        var finalDiscountApplied = prdRuleAppliedDict.get(currentOrderItem.getPrdMainPKey());
        var layerA = Utils.isDefined(finalDiscountApplied) ? finalDiscountApplied.layerADisc : 0;
        var layerB = (layerA > 0) ? finalDiscountApplied.layerBDisc : 0;
        var layerC = (layerA > 0) ? finalDiscountApplied.layerCDisc : 0;
        var layerD = (layerA > 0) ? finalDiscountApplied.layerDDisc : 0;
        var layerE = (layerA > 0) ? finalDiscountApplied.layerEDisc : 0;
        var layerF = (layerA > 0) ? finalDiscountApplied.layerFDisc : 0;
        var layerG = (layerA > 0) ? currentOrderItem.getMyDiscountG() : 0;
        var baseDiscount = (layerA > 0) ? finalDiscountApplied.layerBaseDiscount : 0;

        var totalDiscount = layerA + layerB + layerC + layerD + layerE + layerF + layerG;
        var basePrice = currentOrderItem.getBasePrice();
        var orderPrice = basePrice * currentOrderItem.getMyTotalQuantity();
        var discountAmount = (orderPrice * (totalDiscount / 100));
        var value = (orderPrice - discountAmount).toFixed(2);
        me.getLoItems().suspendListRefresh();
        if (totalDiscount !== 0) {
          currentOrderItem.setDiscount(totalDiscount);
        }
        currentOrderItem.setValue(value);
        currentOrderItem.setMyDiscountA(layerA);
        currentOrderItem.setMyDiscountB(layerB);
        currentOrderItem.setMyDiscountC(layerC);
        currentOrderItem.setMyDiscountD(layerD);
        currentOrderItem.setMyDiscountE(layerE);
        currentOrderItem.setMyDiscountF(layerF);
        currentOrderItem.setMyDiscountBase(baseDiscount);
        currentOrderItem.setMyDiscountSource("Commercial Policy");
        if (prdRuleAppliedDict.containsKey(currentOrderItem.prdMainPKey)){
          currentOrderItem.setMyIsPrdFlattenedByCommercialPolicies("1");
        }
        else{
          currentOrderItem.setMyIsPrdFlattenedByCommercialPolicies("0");
        }
        var productPart = me.getBoItemTabManager().getLoMyBOMProductParts().getAllItems().find( (part) => part.prdKey == currentOrderItem.getPrdMainPKey());
        if(Utils.isDefined(productPart)){
          productPart.setPrdDiscount(totalDiscount);
        }
        me.getLoItems().resumeListRefresh(true);
      }
      }
      //Loop through all order Items and build the Virtual BOM(Parent s' value and discounts based on their direct children)
      for (var i = 0; i < orderItems.length; i++){
        var currentOrderItem = orderItems[i];
        if (currentOrderItem.getMyTotalQuantity() > 0 && currentOrderItem.getOneHundredDiscount() != "1" &&
          currentOrderItem.getMyIsPrdFlattenedByAgreements() != '1' && currentOrderItem.getNotDiscountable() != '1' && currentOrderItem.getMyBOMType() == "Virtual"){
            if( me.boItemTabManager && me.boItemTabManager.loMyBOMProductParts){
              var loProductParts = me.boItemTabManager.loMyBOMProductParts.getAllItems();
              var filteredParts = loProductParts.filter(part => part.parentPrdKey === currentOrderItem.prdMainPKey);
              var loItems = me.loItems.getAllItems();
              var parentBomValue = 0, parentBomValueA = 0, parentBomValueB = 0, parentBomValueC = 0, parentBomValueD = 0, parentBomValueE = 0, parentBomValueF = 0, parentBomValueTotal = 0;
              filteredParts.forEach((part)=>{
                // Find the corresponding item in loItems
                var matchingItem = loItems.find(item => item.prdMainPKey === part.childPrdKey && item.myIsBOMPart == '1' && (item.changedBOMType == '0' || item.changedBOMType == 'true' || item.changedBOMType == 'false' || item.changedBOMType == null));
                // If a matching item is found, update its properties.
                if (matchingItem) {
                  var childBasePrice = matchingItem.getBasePrice();
                  var childItemprice = childBasePrice * matchingItem.getMyTotalQuantity();
                  var totalDiscount = matchingItem.getDiscount();
                  var childItemvalue = (childItemprice - (childItemprice * totalDiscount / 100)); 
                  
                  matchingItem.unitPriceBeforeDisc = childBasePrice;
                  var uPriceAfterTotalDisc = (childBasePrice - (childBasePrice * totalDiscount / 100));
                  matchingItem.uPriceAfterTotalDisc = uPriceAfterTotalDisc;
                  var uDiscValueA = (childBasePrice * matchingItem.getMyDiscountA() / 100);
                  var uDiscValueB = (childBasePrice * matchingItem.getMyDiscountB() / 100);
                  var uDiscValueC = (childBasePrice * matchingItem.getMyDiscountC() / 100);
                  var uDiscValueD = (childBasePrice * matchingItem.getMyDiscountD() / 100);
                  var uDiscValueE = (childBasePrice * matchingItem.getMyDiscountE() / 100);
                  var uDiscValueF = (childBasePrice * matchingItem.getMyDiscountF() / 100);
                  var uDiscValueSKU = childBasePrice - uPriceAfterTotalDisc;
                  matchingItem.unitDiscA = uDiscValueA;
                  matchingItem.unitDiscB = uDiscValueB;
                  matchingItem.unitDiscC = uDiscValueC;
                  matchingItem.unitDiscD = uDiscValueD;
                  matchingItem.unitDiscE = uDiscValueE;
                  matchingItem.unitDiscF = uDiscValueF;
                  matchingItem.uDiscValueSKU = uDiscValueSKU;

                  var totalDiscValueA = part.prdDefaultQuantity * uDiscValueA;
                  var totalDiscValueB = part.prdDefaultQuantity * uDiscValueB;
                  var totalDiscValueC = part.prdDefaultQuantity * uDiscValueC;
                  var totalDiscValueD = part.prdDefaultQuantity * uDiscValueD;
                  var totalDiscValueE = part.prdDefaultQuantity * uDiscValueE;
                  var totalDiscValueF = part.prdDefaultQuantity * uDiscValueF;

                  parentBomValue += childItemvalue;
                  parentBomValueA += totalDiscValueA;
                  parentBomValueB += totalDiscValueB;
                  parentBomValueC += totalDiscValueC;
                  parentBomValueD += totalDiscValueD;
                  parentBomValueE += totalDiscValueE;
                  parentBomValueF += totalDiscValueF;
                }
              });
              currentOrderItem.setValue(parentBomValue);
              var basePrice = currentOrderItem.getBasePrice();
              var parentBomDiscA = isFinite((parentBomValueA / basePrice) * 100) ? (parentBomValueA / basePrice) * 100 : 0;
              var parentBomDiscB = isFinite((parentBomValueB / basePrice) * 100) ? (parentBomValueB / basePrice) * 100 : 0;
              var parentBomDiscC = isFinite((parentBomValueC / basePrice) * 100) ? (parentBomValueC / basePrice) * 100 : 0;
              var parentBomDiscD = isFinite((parentBomValueD / basePrice) * 100) ? (parentBomValueD / basePrice) * 100 : 0;
              var parentBomDiscE = isFinite((parentBomValueE / basePrice) * 100) ? (parentBomValueE / basePrice) * 100 : 0;
              var parentBomDiscF = isFinite((parentBomValueF / basePrice) * 100) ? (parentBomValueF / basePrice) * 100 : 0;
              var parentBomDiscTotal = parentBomDiscA + parentBomDiscB + parentBomDiscC + parentBomDiscD + parentBomDiscE + parentBomDiscF;
              parentBomDiscTotal = isFinite(parentBomDiscTotal) || !isNaN(parentBomDiscTotal) ? parentBomDiscTotal : 0;
              currentOrderItem.setMyDiscountA(parentBomDiscA);
              currentOrderItem.setMyDiscountB(parentBomDiscB);
              currentOrderItem.setMyDiscountC(parentBomDiscC);
              currentOrderItem.setMyDiscountD(parentBomDiscD);
              currentOrderItem.setMyDiscountE(parentBomDiscE);
              currentOrderItem.setMyDiscountF(parentBomDiscF);
              currentOrderItem.setDiscount(parentBomDiscTotal);
            }
          }
      }
    var freeItemCdnDict = Utils.createDictionary();
    var freeItemPrdDict = Utils.createDictionary();
    //Loop through all valid rules applied and prepare the final list of free items to be added to disposal list.
    for (var key in prdRuleAppliedDict.data) {
      var currentRule = prdRuleAppliedDict.get(key); 

      var addFreeItemToDictionary = function(freeItemPkey, freeItemQty, freeItemCondition){
        var freeItemCdnAvailable = freeItemCdnDict.containsKey(freeItemCondition);
        var freeItemPrdAvailable = freeItemPrdDict.containsKey(freeItemPkey);
        var freeItem = freeItemsToAdd.get(freeItemPkey);
        if(!freeItemCdnAvailable){
          if(!freeItemPrdAvailable){
            var freeItem = {
              "prdMainPKey" : freeItemPkey,
              "quantity" : freeItemQty,
              "condition" : freeItemCondition
            }
            freeItemPrdDict.add(freeItemPkey);
            freeItemsToAdd.add(freeItemPkey, freeItem);
          }
          else{
            freeItem.quantity += freeItemQty;
          }
          freeItemCdnDict.add(freeItemCondition);
        }
      };


      if(!Utils.isEmptyString(currentRule.layerAFreeItem)){
        addFreeItemToDictionary(currentRule.layerAFreeItem,currentRule.layerAFreeQty,currentRule.layerAConditionApplied);
      }
      if(!Utils.isEmptyString(currentRule.layerBFreeItem)){
        addFreeItemToDictionary(currentRule.layerBFreeItem,currentRule.layerBFreeQty,currentRule.layerBConditionApplied);
      }
      if(!Utils.isEmptyString(currentRule.layerCFreeItem)){
        addFreeItemToDictionary(currentRule.layerCFreeItem,currentRule.layerCFreeQty,currentRule.layerCConditionApplied);
      }
      if(!Utils.isEmptyString(currentRule.layerDFreeItem)){
        addFreeItemToDictionary(currentRule.layerDFreeItem,currentRule.layerDFreeQty,currentRule.layerDConditionApplied);
      }
      if(!Utils.isEmptyString(currentRule.layerEFreeItem)){
        addFreeItemToDictionary(currentRule.layerEFreeItem,currentRule.layerEFreeQty,currentRule.layerEConditionApplied);
      }
      if(!Utils.isEmptyString(currentRule.layerFFreeItem)){
        addFreeItemToDictionary(currentRule.layerFFreeItem,currentRule.layerFFreeQty,currentRule.layerFConditionApplied);
      }
    }
    //Loop throught the deleted free items and remove it from the list.
    for (var key in freeItemsToDelete.data) {
      var freeItemDetail = me.getLoItems().getItemByPKey(key);
      me.getLoItems().suspendListRefresh();
      freeItemDetail.setMyTotalQuantity(0);
      freeItemDetail.setMySplit1Q(0);
      freeItemDetail.setMySplit2Q(0);
      freeItemDetail.setMySplit3Q(0);
      freeItemDetail.setMySplit4Q(0);
      freeItemDetail.setMySplit5Q(0);
      freeItemDetail.setMySplit6Q(0);
      freeItemDetail.setDeletedFreeItem("1");
      freeItemDetail.setShowInBasket("0");
      freeItemDetail.setShowInFreeGoods("0");
      me.getLoItems().resumeListRefresh(true);
    }

    //Loop through the free items and add it to disposal list.
    var itemsToAdd = [];
    var freeGoodItemTemplates = me.getBoOrderMeta().getLoOrderItemMetas().getItemsByParamArray([{"erpCode": "Policy"}, {"active": "1"}, {"validFrom": Utils.createAnsiDateToday(), "op": "LE"}, {"validThru": Utils.createAnsiDateToday(), "op": "GE"}]);
    var freeOfChargeItemTemplates = me.getBoOrderMeta().getLoOrderItemMetas().getItemsByParamArray([{"erpCode": "PolicyFOC"}, {"active": "1"}, {"validFrom": Utils.createAnsiDateToday(), "op": "LE"}, {"validThru": Utils.createAnsiDateToday(), "op": "GE"}]);

    var addItemToDisposalList = function(itemTemplate,orderItemDetail,parentType,split1FreeQty,split2FreeQty,split3FreeQty,split4FreeQty,split5FreeQty,split6FreeQty){

      split1DD = me.myDDSplit1 ? me.myDDSplit1.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) :  Utils.getMinDate();
      split1DDAnsi = me.myDDSplit1 ? Utils.convertDate2Ansi(me.myDDSplit1) : Utils.getMinDate();
      split2DD = me.myDDSplit2 ? me.myDDSplit2.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) :  Utils.getMinDate();
      split2DDAnsi = me.myDDSplit2 ? Utils.convertDate2Ansi(me.myDDSplit2) : Utils.getMinDate();
      split3DD = me.myDDSplit3 ? me.myDDSplit3.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) :  Utils.getMinDate();
      split3DDAnsi = me.myDDSplit3 ? Utils.convertDate2Ansi(me.myDDSplit3) : Utils.getMinDate();
      split4DD = me.myDDSplit4 ? me.myDDSplit4.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) :  Utils.getMinDate();
      split4DDAnsi = me.myDDSplit4 ? Utils.convertDate2Ansi(me.myDDSplit4) : Utils.getMinDate();
      split5DD = me.myDDSplit5 ? me.myDDSplit5.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) :  Utils.getMinDate();
      split5DDAnsi = me.myDDSplit5 ? Utils.convertDate2Ansi(me.myDDSplit5) : Utils.getMinDate();
      split6DD = me.myDDSplit6 ? me.myDDSplit6.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) :  Utils.getMinDate();
      split6DDAnsi = me.myDDSplit6 ? Utils.convertDate2Ansi(me.myDDSplit6) : Utils.getMinDate();

      var itemToAdd = {
        "pKey" : PKey.next(),
        "basePrice" : orderItemDetail.basePrice,
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
        "parentType" : parentType,
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
        "mySplit1Q" : split1FreeQty,
        "mySplit1DD" : split1DD,
        "mySplit1DDAnsi" : split1DDAnsi,
        "mySplit2Q" : split2FreeQty,
        "mySplit2DD" : split2DD,
        "mySplit2DDAnsi" : split2DDAnsi,
        "mySplit3Q" : split3FreeQty,
        "mySplit3DD" : split3DD,
        "mySplit3DDAnsi" : split3DDAnsi,
        "mySplit4Q" : split4FreeQty,
        "mySplit4DD" : split4DD,
        "mySplit4DDAnsi" : split4DDAnsi,
        "mySplit5Q" : split5FreeQty,
        "mySplit5DD" : split5DD,
        "mySplit5DDAnsi" : split5DDAnsi,
        "mySplit6Q" : split6FreeQty,
        "mySplit6DD" : split6DD,
        "mySplit6DDAnsi" : split6DDAnsi,
        "discount" : 100
      };
      
      itemsToAdd.push(itemToAdd);
    };

    for(var key in freeOfChargeItemsToadd.data){
      var freeItem = freeOfChargeItemsToadd.get(key);
      var itemTemplate = freeOfChargeItemTemplates[0];
      var parentType = "FreeOfCharge";
      //FOC will always have a corresponding Std order item.
      let orderItemDetail =  orderItemDisposalListDict.get(key); 
      split1FreeQty = (orderItemDetail.getMySplit1DD() != Utils.getMinDate() && orderItemDetail.getMySplit1Q() > 0 
      && orderItemDetail.getMySplit1Q() == orderItemDetail.getMyTotalQuantity()) ? freeItem.quantity : 0;
      split2FreeQty = (orderItemDetail.getMySplit2DD() != Utils.getMinDate() && orderItemDetail.getMySplit2Q() > 0 
      && orderItemDetail.getMySplit1Q() + orderItemDetail.getMySplit2Q() == orderItemDetail.getMyTotalQuantity()) ? freeItem.quantity : 0;
      split3FreeQty = (orderItemDetail.getMySplit3DD() != Utils.getMinDate() && orderItemDetail.getMySplit3Q() > 0 
      && orderItemDetail.getMySplit1Q() + orderItemDetail.getMySplit2Q() + orderItemDetail.getMySplit3Q() == orderItemDetail.getMyTotalQuantity()) ? freeItem.quantity : 0;
      split4FreeQty = (orderItemDetail.getMySplit4DD() != Utils.getMinDate() && orderItemDetail.getMySplit4Q() > 0 
      && orderItemDetail.getMySplit1Q() + orderItemDetail.getMySplit2Q() + orderItemDetail.getMySplit3Q() + orderItemDetail.getMySplit4Q() == orderItemDetail.getMyTotalQuantity()) ? freeItem.quantity : 0;
      split5FreeQty = (orderItemDetail.getMySplit5DD() != Utils.getMinDate() && orderItemDetail.getMySplit5Q() > 0 
      && orderItemDetail.getMySplit1Q() + orderItemDetail.getMySplit2Q() + orderItemDetail.getMySplit3Q() + orderItemDetail.getMySplit4Q() + orderItemDetail.getMySplit5Q() == orderItemDetail.getMyTotalQuantity()) ? freeItem.quantity : 0;
      split6FreeQty = (orderItemDetail.getMySplit6DD() != Utils.getMinDate() && orderItemDetail.getMySplit6Q() > 0 
      && orderItemDetail.getMySplit1Q() + orderItemDetail.getMySplit2Q() + orderItemDetail.getMySplit3Q() + orderItemDetail.getMySplit4Q() + orderItemDetail.getMySplit5Q() + orderItemDetail.getMySplit6Q() == orderItemDetail.getMyTotalQuantity()) ? freeItem.quantity : 0;

      addItemToDisposalList(itemTemplate,orderItemDetail,parentType,split1FreeQty,split2FreeQty,split3FreeQty,split4FreeQty,split5FreeQty,split6FreeQty);
    }
    for (var key in freeItemsToAdd.data) {
      var freeItem = freeItemsToAdd.get(key); 
      var itemTemplate = freeGoodItemTemplates[0];
      var parentType = "FreeGoods";
      //FG might or might not have a Std order item. So take details from FreemItemProductInfo.
      var orderItemDetail = me.getBoMyDiscountEngineManager().getLoMyFreeItemProductsInfo().getAllItems().find( (orderItem) => orderItem.prdMainPKey == key);
      var split1FreeQty = freeItem.quantity, split2FreeQty = 0, split3FreeQty = 0, split4FreeQty = 0, split5FreeQty = 0, split6FreeQty = 0;

      addItemToDisposalList(itemTemplate,orderItemDetail,parentType,split1FreeQty,split2FreeQty,split3FreeQty,split4FreeQty,split5FreeQty,split6FreeQty);
    }  
      me.getLoItems().addItems(itemsToAdd);
      me.getBoMyDiscountEngineManager().setCommercialPolicyAppliedRulesDict(prdRuleAppliedDict);
      me.getBoMyDiscountEngineManager().setFreeItemsToAdd(freeItemsToAdd);
      AppLog.log("Discount Engine End" + Utils.createAnsiDateNow());
      AppLog.log("Discount Engine End (ms)" + Date.now());
      return me;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}