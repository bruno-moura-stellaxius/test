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
 * -> namespace: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.

 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 *
 * ------- METHOD RELEVANT GENERATOR PARAMETERS BELOW - ADAPT WITH CAUTION -------
 * @function myPrepareFlattenItemList
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CUSTOM
 * @param {String} mode
 * @param {Object} orderItemsforDiscountEngine
 * @returns promise
 */
function myPrepareFlattenItemList(mode,orderItemsforDiscountEngine){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var promise=when.resolve();
    var flattenedItem;
    var addItemToArray = function(item, currentOrderItem){
        flattenedItem = {
            "brand" : currentOrderItem.getCriterion3(),
            "subBrand" : currentOrderItem.getCriterion4(),
            "sku" : currentOrderItem.getPrdMainPKey(),
            "totalQuantity" : currentOrderItem.getMyTotalQuantity(),
            "split1DateDD" : currentOrderItem.getMySplit1DD(),
            "split1Qty" : currentOrderItem.getMySplit1Q(),
            "split2DateDD" : currentOrderItem.getMySplit2DD(),
            "split2Qty" : currentOrderItem.getMySplit2Q(),
            "split3DateDD" : currentOrderItem.getMySplit3DD(),
            "split3Qty" : currentOrderItem.getMySplit3Q(),
            "split4DateDD" : currentOrderItem.getMySplit4DD(),
            "split4Qty" : currentOrderItem.getMySplit4Q(),
            "split5DateDD" : currentOrderItem.getMySplit5DD(),
            "split5Qty" : currentOrderItem.getMySplit5Q(),
            "split6DateDD" : currentOrderItem.getMySplit6DD(),
            "split6Qty" : currentOrderItem.getMySplit6Q(),
            "layerA" : item.layerA || 0,
            "layerB" : item.layerB || 0,
            "layerC" : item.layerC || 0,
            "layerD" : item.layerD || 0,
            "layerE" : item.layerE || 0,
            "layerF" : item.layerF || 0,
            "layerG" : currentOrderItem.getMyDiscountG() || 0,
            "baseDiscount" : item.baseDiscount,
            "myDiscountSource" : item.myDiscountSource,
            "totalDiscount" : (item.layerA || 0) + (item.layerB || 0) + (item.layerC || 0) + (item.layerD || 0) + (item.layerE || 0) + (item.layerF || 0) + (currentOrderItem.getMyDiscountG() || 0)
        };
    };
    var buildFlattenedList = function(currentOrderItem)
    {
        var currentSku = currentOrderItem.getPrdMainPKey();
        var currentPrdSubBrand = currentOrderItem.getCriterion4();
        var currentPrdBrand = currentOrderItem.getCriterion3();
        var salesAgreementFound = 0;
        var preSalesAgreementFound = 0;
        var agreementProductList = me.getBoMyDiscountEngineManager().getLoMyAgreementProducts().getItems();

        var layerAList = [];
        var layerBList = [];
        var layerCList = [];
        var layerDList = [];
        var layerEList = [];
        var layerFList = [];
        var layerBaseList = [];

        agreementProductList.forEach(function(item){
            if(item.getRecordTypeName() == "Sales Agreement" && item.getAgreementProductPKey() == currentPrdBrand){           
                    salesAgreementFound = 1;
                    item.myDiscountSource = "Sales Agreement";
                    addItemToArray(item, currentOrderItem);             
                }
            if(salesAgreementFound == 0 && item.getRecordTypeName() == "Pre-Sales Agreement" &&
            (item.getAgreementProductPKey() == currentPrdBrand || item.getAgreementProductPKey() == currentPrdSubBrand || item.getAgreementProductPKey() == currentSku)) {  
                preSalesAgreementFound = 1;  
                layerAList.push(item.getLayerA());
                layerBList.push(item.getLayerB());
                layerCList.push(item.getLayerC());
                layerDList.push(item.getLayerD());
                layerEList.push(item.getLayerE());
                layerFList.push(item.getLayerF());
                layerBaseList.push(item.getBaseDiscount());
            }       
        });
        if(salesAgreementFound == 0 && preSalesAgreementFound == 1) {

            var bestPreSaleDiscountItem ={
                "baseDiscount" : layerBaseList.reduce(function (p, v) {return (p > v ? p : v);}),
                "layerA" : layerAList.reduce(function (p, v) { return (p > v ? p : v); }),
                "layerB" : layerBList.reduce(function (p, v) { return (p > v ? p : v); }),
                "layerC" : layerCList.reduce(function (p, v) { return (p > v ? p : v); }),
                "layerD" : layerDList.reduce(function (p, v) { return (p > v ? p : v); }),
                "layerE" : layerEList.reduce(function (p, v) { return (p > v ? p : v); }),
                "layerF" : layerFList.reduce(function (p, v) { return (p > v ? p : v); }),
                "myDiscountSource" : "PreSales Agreement"
            }
            addItemToArray(bestPreSaleDiscountItem, currentOrderItem);
        }   
        if(Utils.isDefined(flattenedItem)){
          var totalDiscount = flattenedItem.layerA + flattenedItem.layerB + flattenedItem.layerC + flattenedItem.layerD + flattenedItem.layerE + flattenedItem.layerF + currentOrderItem.getMyDiscountG();
          var basePrice = currentOrderItem.getBasePrice();
          var price = basePrice * currentOrderItem.getMyTotalQuantity();
          var value = (price - (price * totalDiscount / 100)).toFixed(2);
          me.getBoMyDiscountEngineManager().getLoMyFlattenedDiscountEngineList().addListItem(flattenedItem);
          me.getLoItems().suspendListRefresh();
          currentOrderItem.setMyIsPrdFlattenedByAgreements("1");
          currentOrderItem.setMyDiscountSource(flattenedItem.myDiscountSource);
          
          if(currentOrderItem.getMyBOMType() == "Virtual"){
            if( me.boItemTabManager && me.boItemTabManager.loMyBOMProductParts){
              var loProductParts = me.boItemTabManager.loMyBOMProductParts.getAllItems();
              var filteredParts = loProductParts.filter(part => part.parentPrdKey === currentOrderItem.prdMainPKey);
              var loItems = me.loItems.getAllItems();
              var parentBomValue = 0, parentBomValueA = 0, parentBomValueB = 0, parentBomValueC = 0, parentBomValueD = 0, parentBomValueE = 0, parentBomValueF = 0, parentBomValueTotal = 0;
              filteredParts.forEach((part)=>{
                part.setPrdDiscount(totalDiscount);
                // Find the corresponding item in loItems
                var matchingItem = loItems.find(item => item.prdMainPKey === part.childPrdKey && item.myIsBOMPart == '1' && (item.changedBOMType == '0' || item.changedBOMType == 'true' || item.changedBOMType == 'false' || item.changedBOMType == null));
                // If a matching item is found, update its properties.
                if (matchingItem) {
                  var childBasePrice = matchingItem.getBasePrice();
                  var childItemprice = childBasePrice * matchingItem.getMyTotalQuantity();
                  var childItemvalue = (childItemprice - (childItemprice * totalDiscount / 100)); 
                  matchingItem.setMyIsPrdFlattenedByAgreements("1");
                  matchingItem.setMyDiscountA(flattenedItem.layerA);
                  matchingItem.setMyDiscountB(flattenedItem.layerB);
                  matchingItem.setMyDiscountC(flattenedItem.layerC);
                  matchingItem.setMyDiscountD(flattenedItem.layerD);
                  matchingItem.setMyDiscountE(flattenedItem.layerE);
                  matchingItem.setMyDiscountF(flattenedItem.layerF);
                  matchingItem.setDiscount(totalDiscount);
                  matchingItem.unitPriceBeforeDisc = childBasePrice;
                  uPriceAfterTotalDisc = (childBasePrice - (childBasePrice * totalDiscount / 100));
                  matchingItem.uPriceAfterTotalDisc = uPriceAfterTotalDisc;
                  uDiscValueA = (childBasePrice * flattenedItem.layerA / 100);
                  uDiscValueB = (childBasePrice * flattenedItem.layerB / 100);
                  uDiscValueC = (childBasePrice * flattenedItem.layerC / 100);
                  uDiscValueD = (childBasePrice * flattenedItem.layerD / 100);
                  uDiscValueE = (childBasePrice * flattenedItem.layerE / 100);
                  uDiscValueF = (childBasePrice * flattenedItem.layerF / 100);
                  uDiscValueSKU = childBasePrice - uPriceAfterTotalDisc;
                  matchingItem.unitDiscA = uDiscValueA;
                  matchingItem.unitDiscB = uDiscValueB;
                  matchingItem.unitDiscC = uDiscValueC;
                  matchingItem.unitDiscD = uDiscValueD;
                  matchingItem.unitDiscE = uDiscValueE;
                  matchingItem.unitDiscF = uDiscValueF;
                  matchingItem.uDiscValueSKU = uDiscValueSKU;

                  totalDiscValueA = part.prdDefaultQuantity * uDiscValueA;
                  totalDiscValueB = part.prdDefaultQuantity * uDiscValueB;
                  totalDiscValueC = part.prdDefaultQuantity * uDiscValueC;
                  totalDiscValueD = part.prdDefaultQuantity * uDiscValueD;
                  totalDiscValueE = part.prdDefaultQuantity * uDiscValueE;
                  totalDiscValueF = part.prdDefaultQuantity * uDiscValueF;

                  matchingItem.setMyDiscountSource(flattenedItem.myDiscountSource);
                  matchingItem.setValue(childItemvalue);
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
              parentBomDiscA = (parentBomValueA / basePrice) * 100;
              parentBomDiscB = (parentBomValueB / basePrice) * 100;
              parentBomDiscC = (parentBomValueC / basePrice) * 100;
              parentBomDiscD = (parentBomValueD / basePrice) * 100;
              parentBomDiscE = (parentBomValueE / basePrice) * 100;
              parentBomDiscF = (parentBomValueF / basePrice) * 100;
              parentBomDiscTotal = parentBomDiscA + parentBomDiscB + parentBomDiscC + parentBomDiscD + parentBomDiscE + parentBomDiscF;
              parentBomDiscTotal = isNaN(parentBomDiscTotal) ? 0 : parentBomDiscTotal;
              currentOrderItem.setMyDiscountA(parentBomDiscA);
              currentOrderItem.setMyDiscountB(parentBomDiscB);
              currentOrderItem.setMyDiscountC(parentBomDiscC);
              currentOrderItem.setMyDiscountD(parentBomDiscD);
              currentOrderItem.setMyDiscountE(parentBomDiscE);
              currentOrderItem.setMyDiscountF(parentBomDiscF);
              currentOrderItem.setDiscount(parentBomDiscTotal);
            }
          }
          else{
            currentOrderItem.setDiscount(totalDiscount);
            currentOrderItem.setValue(value);
            currentOrderItem.setMyDiscountA(flattenedItem.layerA);
            currentOrderItem.setMyDiscountB(flattenedItem.layerB);
            currentOrderItem.setMyDiscountC(flattenedItem.layerC);
            currentOrderItem.setMyDiscountD(flattenedItem.layerD);
            currentOrderItem.setMyDiscountE(flattenedItem.layerE);
            currentOrderItem.setMyDiscountF(flattenedItem.layerF);
            currentOrderItem.setMyDiscountBase(flattenedItem.baseDiscount);
          }
          me.getLoItems().resumeListRefresh(true);
          flattenedItem = null;
        }
    }
    //Build agreement rules
    if(me.getMyByPassAgreements() != "1") {
      if (mode == "itemchanged") {
          var currentOrderItem = me.getLoItems().getCurrent();

          if(currentOrderItem.getOneHundredDiscount() == "1"){
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
          else if(currentOrderItem.getMyIsPrdFlattenedByAgreements() != "1" && currentOrderItem.getNotDiscountable() != "1" && currentOrderItem.getMyTotalQuantity() > 0){
              buildFlattenedList(currentOrderItem)
          }
          else{
              if(currentOrderItem.getMyTotalQuantity() == 0){
                  var flattenedItemToRemove =  me.getBoMyDiscountEngineManager().getLoMyFlattenedDiscountEngineList().getItemsByParam({"sku" : currentOrderItem.getPrdMainPKey()})[0];

                  if(flattenedItemToRemove)flattenedItemToRemove.delete();
                  me.getBoMyDiscountEngineManager().getLoMyFlattenedDiscountEngineList().setFilter("objectStatus", STATE.DIRTY | STATE.DELETED, "NCB");
                  me.getLoItems().suspendListRefresh();

                  if(currentOrderItem.getMyBOMType() == "Virtual"){
                    if( me.boItemTabManager && me.boItemTabManager.loMyBOMProductParts){
                      var loProductParts = me.boItemTabManager.loMyBOMProductParts.getAllItems();
                      var filteredParts = loProductParts.filter(part => part.parentPrdKey === currentOrderItem.prdMainPKey);
                      var loItems = me.loItems.getAllItems();
                      currentOrderItem.setValue(0);
                      filteredParts.forEach((part)=>{
                        part.setPrdDiscount(0);
                        // Find the corresponding item in loItems
                        var matchingItem = loItems.find(item => item.prdMainPKey === part.childPrdKey && item.myIsBOMPart == '1' && (item.changedBOMType == '0' || item.changedBOMType == 'true' || item.changedBOMType == null));
                        // If a matching item is found, update its quantity
                        if (matchingItem) {
                          matchingItem.setMyIsPrdFlattenedByAgreements("0");
                          matchingItem.setDiscount(0);
                          matchingItem.setMyDiscountSource("");
                        }
                      });
                    }
                  }
                  currentOrderItem.setMyIsPrdFlattenedByAgreements("0");
                  currentOrderItem.setMyDiscountA(0);
                  currentOrderItem.setMyDiscountB(0);
                  currentOrderItem.setMyDiscountC(0);
                  currentOrderItem.setMyDiscountD(0);
                  currentOrderItem.setMyDiscountE(0);
                  currentOrderItem.setMyDiscountF(0);
                  currentOrderItem.setMyDiscountBase(0);
                  currentOrderItem.setMyDiscountSource("");
                  currentOrderItem.setDiscount(0);
                  currentOrderItem.setValue(0);
                  me.getLoItems().resumeListRefresh(true);
              }
              else{
                  var flattenedItemToUpdate =  me.getBoMyDiscountEngineManager().getLoMyFlattenedDiscountEngineList().getItemsByParam({"sku" : currentOrderItem.getPrdMainPKey()})[0];
                  if(currentOrderItem.getMyBOMType() == "Virtual"){
                    if( me.boItemTabManager && me.boItemTabManager.loMyBOMProductParts){
                      var loProductParts = me.boItemTabManager.loMyBOMProductParts.getAllItems();
                      var filteredParts = loProductParts.filter(part => part.parentPrdKey === currentOrderItem.prdMainPKey);
                      var loItems = me.loItems.getAllItems();
                      var parentBomValue = 0;
                      filteredParts.forEach((part)=>{
                        // Find the corresponding item in loItems
                        var matchingItem = loItems.find(item => item.prdMainPKey === part.childPrdKey && item.myIsBOMPart == '1' && (item.changedBOMType == '0' || item.changedBOMType == 'true' || item.changedBOMType == null));
                        // If a matching item is found, update its properties.
                        if (matchingItem) {
                          var basePrice = matchingItem.getBasePrice();
                          var childItemprice = basePrice * matchingItem.getMyTotalQuantity();
                          var childItemvalue = (childItemprice - (childItemprice * matchingItem.getDiscount() / 100));
                          matchingItem.setValue(childItemvalue);
                          parentBomValue += childItemvalue;
                        }
                      });
                      currentOrderItem.setValue(parentBomValue);
                    }
                  }
                  else{
                    flattenedItemToUpdate.setSplit1DateDD(currentOrderItem.getMySplit1DD());
                    flattenedItemToUpdate.setSplit1Qty(currentOrderItem.getMySplit1Q());
                    flattenedItemToUpdate.setSplit2DateDD(currentOrderItem.getMySplit2DD());
                    flattenedItemToUpdate.setSplit2Qty(currentOrderItem.getMySplit2Q());
                    flattenedItemToUpdate.setSplit3DateDD(currentOrderItem.getMySplit3DD());
                    flattenedItemToUpdate.setSplit3Qty(currentOrderItem.getMySplit3Q());
                    flattenedItemToUpdate.setSplit4DateDD(currentOrderItem.getMySplit4DD());
                    flattenedItemToUpdate.setSplit4Qty(currentOrderItem.getMySplit4Q());
                    flattenedItemToUpdate.setSplit5DateDD(currentOrderItem.getMySplit5DD());
                    flattenedItemToUpdate.setSplit5Qty(currentOrderItem.getMySplit5Q());
                    flattenedItemToUpdate.setSplit6DateDD(currentOrderItem.getMySplit6DD());
                    flattenedItemToUpdate.setSplit6Qty(currentOrderItem.getMySplit6Q());
                    flattenedItemToUpdate.setTotalQuantity(currentOrderItem.getMyTotalQuantity());
                    //Change in Qty will not affect the discount percentage, so jus calculate the final value based on changed Qty.
                    var basePrice = currentOrderItem.getBasePrice();
                    var price = basePrice * currentOrderItem.getMyTotalQuantity();
                    var totalDiscount = currentOrderItem.getDiscount();
                    var value = (price - (price * totalDiscount / 100)).toFixed(2);
                    me.getLoItems().suspendListRefresh();
                    currentOrderItem.setValue(value);
                    me.getLoItems().resumeListRefresh(true);
                  }
              }
          }
      }
      if (mode == "orderLoad") {
          orderItemsforDiscountEngine.forEach(function(prdMainPKey){
              let currentOrderItem = me.getLoItems().getAllItems().find( (orderItem) => (orderItem.prdMainPKey == prdMainPKey));
              if(currentOrderItem && currentOrderItem.getOneHundredDiscount() == "1"){
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
              else if(currentOrderItem && currentOrderItem.getNotDiscountable() != "1"){
                buildFlattenedList(currentOrderItem);
              }      
          });
      }
    }
    //Build commercial policies rules dictionary
    if (mode == "orderCreate" || mode == "orderLoad"){

        var orderItems = me.getLoItems().getItems();
        var pricingTermProductList = me.getBoMyDiscountEngineManager().getLoMyPricingTermProductsInfo().getItems();
        var scopeDict = Utils.createDictionary();
        var applicationDict = Utils.createDictionary();
        var mandatoryDict = Utils.createDictionary();
        var layerGRulesDict = Utils.createDictionary();
    
        for (var i = 0; i < orderItems.length; i++)
        {
          var currentOrderItem = orderItems[i];
          var currentPrdSubBrand = currentOrderItem.getCriterion4();
          var currentPrdBrand = currentOrderItem.getCriterion3();
          var currentSku = currentOrderItem.getPrdMainPKey();
          // For all order items which has a valid qty and doesn't take discount from agreements 
            pricingTermProductList.forEach(function(item){
    
              if (!Utils.isEmptyString(item.getScope()) && (item.getScope() == currentPrdBrand || item.getScope() == currentPrdSubBrand || item.getScope() == currentSku)) {
                var currentScopeRule = scopeDict.get(item.getPricingConditionPKey());
                //If the pricing condion is not present in the array add a new item 
                
                  if(!currentScopeRule){
                    var scopeArray = [];
                    var mandatoryArray = [];
                    scopeArray.push(item.getScope());
                    var rule = {
                      "scope" : scopeArray,
                      "minQty" : item.getMinQty(),
                      "maxQty" : item.getMaxQty(),
                      "minValue" : item.getMinValue(),
                      "maxValue" : item.getMaxValue(),
                      "minRef" : item.getMinRef(),
                      "maxRef" : item.getMaxRef(),
                      "minBrands" : item.getMinBrands(),
                      "maxBrands" : item.getMaxBrands(),
                      "conditionProductMin" : item.getConditionProductMin(),
                      "conditionProductMax" : item.getConditionProductMax(),
                      "minPercentBeforeMaxDeliveryDate" : item.getMinPercentBeforeMaxDeliveryDate(),
                      "maxDeliveryDate" : item.getMaxDeliveryDate(),
                      "layer" : item.getLayer(),
                      "discountPercent" : item.getDiscountPercent(),
                      "application" : item.getApplication(),
                      "pricingConditionPKey" : item.getPricingConditionPKey(),
                      "mandatory" : mandatoryArray,
                      "baseDiscount" : item.getBaseDiscount(),
                      "layerAThresholdType" : item.getLayerAThresholdType(),
                      "pricingConditionPKey" : item.getPricingConditionPKey(),
                      "freeGoodProduct" : item.getFreeGoodProduct(),
                      "freeGoodQty" : item.getFreeGoodQty(),
                      "typeOfDiscount" : item.getTypeOfDiscount(),
                      "qtyToBuy" : item.getQtyToBuy(),
                      "qtyToGive" : item.getQtyToGive(),
                      "isRuleSatisfied" : false
                    }
                    scopeDict.add(rule.pricingConditionPKey, rule);
                  }
                  //If pricing condition is present and has a different product as scope [to do - handle 1 pricing condition with different scopes.]
                  else if(currentScopeRule && !currentScopeRule.scope.includes(item.getScope())) {
                    currentScopeRule.scope.push(item.getScope());
                  }
                }
              // Build Application Array - rules are same as scope array
              else if(!Utils.isEmptyString(item.getApplication()) && (item.getApplication() == currentPrdBrand || item.getApplication() == currentPrdSubBrand || item.getApplication() == currentSku)){
                var currentApplicationRule = applicationDict.get(item.getPricingConditionPKey());
    
                  if(!currentApplicationRule){
                  var rule ={
                    "application" : item.getApplication(),
                    "pricingConditionPKey" : item.getPricingConditionPKey()
                  }
                  applicationDict.add(rule.pricingConditionPKey, rule);
                  }
                  else if (currentApplicationRule && !currentApplicationRule.application.includes(item.getApplication())){
                    currentApplicationRule.application = currentApplicationRule.application + ";" + item.getApplication();
                  }
                }
              // Build Mandatory Array - rules are same as scope array
              else if(!Utils.isEmptyString(item.getMandatory()) && (item.getMandatory() == currentPrdBrand || item.getMandatory() == currentPrdSubBrand || item.getMandatory() == currentSku)){
                  var currentMandatoryRule = mandatoryDict.get(item.getPricingConditionPKey());
                
                    if(!currentMandatoryRule){
                      var mandatoryArray = [];
                      mandatoryArray.push(item.getMandatory());
                    var rule ={
                      "mandatory" : mandatoryArray,
                      "pricingConditionPKey" : item.getPricingConditionPKey(),
                      "conditionProductMin" : item.getConditionProductMin(),
                      "conditionProductMax" : item.getConditionProductMax(),
                    }
                    mandatoryDict.add(rule.pricingConditionPKey, rule);
                    }
                    else if (currentMandatoryRule && !currentMandatoryRule.mandatory.includes(item.getMandatory())){
                      currentMandatoryRule.mandatory.push(item.getMandatory());
                    }
                }
              // Build LayerG Array - rules are same as scope array
              if(item.getLayer() == "G" && !Utils.isEmptyString(item.getApplication()) && (item.getApplication() == currentPrdBrand || item.getApplication() == currentPrdSubBrand || item.getApplication() == currentSku)){
                var currentLayerGRule = layerGRulesDict.get(item.getPricingConditionPKey());
    
                  if(!currentLayerGRule){
                  var rule ={
                    "application" : item.getApplication(),
                    "pricingConditionPKey" : item.getPricingConditionPKey(),
                    "maxDiscountPercent" : item.getMaxDiscountPercent(),
                    "minDiscountPercent" : item.getMinDiscountPercent(),
                    "behaviourIfHigherDiscount" : item.getBehaviourIfHigherDiscount(),
                    "errorMsg" : item.getErrorMsg()
                  }
                  layerGRulesDict.add(rule.pricingConditionPKey, rule);
                  }
                  else if (currentLayerGRule && !currentLayerGRule.application.includes(item.getApplication())){
                    currentLayerGRule.application = currentLayerGRule.application + ";" + item.getApplication();
                  }
                }
            });
        }
        // For all records in Scope dict merge scope, application & mandatory to form Final rule dictionary.
        for (var key in scopeDict.data) {
            var scopeRule = scopeDict.get(key);
            var applicationRule = applicationDict.get(key);
            var mandatoryRule = mandatoryDict.get(key);
            if(Utils.isDefined(scopeRule) && Utils.isDefined(applicationRule)){
              scopeRule.application = applicationRule.application;
            }
            if(Utils.isDefined(scopeRule) && Utils.isDefined(mandatoryRule)){
              scopeRule.mandatory = mandatoryRule.mandatory;
              scopeRule.conditionProductMin = mandatoryRule.conditionProductMin;
              scopeRule.conditionProductMax = mandatoryRule.conditionProductMax;
            }
        }
        me.getBoMyDiscountEngineManager().setCommercialPolicyValidRulesDict(scopeDict);
        me.getBoMyDiscountEngineManager().setLayerGRulesDict(layerGRulesDict);

    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    return promise;
}