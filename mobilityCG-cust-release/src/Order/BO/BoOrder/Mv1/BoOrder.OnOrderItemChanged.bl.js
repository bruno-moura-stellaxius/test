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
 * @function onOrderItemChanged
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} bufferedEvents
 * @returns promise
 */
function onOrderItemChanged(bufferedEvents){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise;
var mainItem;
var currentEvent;
var sdoItemMeta;
var orderUnitItem;

var isUpdateRequired = false;
if (!Array.isArray(bufferedEvents)) {
  bufferedEvents = [bufferedEvents];
}
//variables for checking what processes need to be done
var calculationProcessTriggers = [];
var groupingProcessTriggers = [];
var reasonCodeProcessTriggers = [];
var quantityProcessTriggers = [];
var discountEngineTriggers = [];
var modReasonTriggerObj;
var pricingTriggerObject;
var groupingTriggerObj;
var quantityChangedTriggerObj;
var discountEngineTriggerObj;
var quotasMain;
var quotas;
const globalQuotasMap = new Map();

if (Utils.isDefined(me.getLoMyExchangeableQuotas())) {
  quotasMain = me.getLoMyExchangeableQuotas();
  quotas = quotasMain.getAllItems();
  
  quotas.forEach(function(quota) {
      if (quota.getMyScope() === 'Global' && quota.getMyCategory() === 'Exchangeable' && Utils.isDefined(quota.getMyProductId())) {
        globalQuotasMap.set(quota.getMyProductId(),
                      {
                        "myRemainingQuota": quota.getMyRemainingQuota(),
                        "myOwnerId": quota.getMyOwnerId(),
                        "myScope": quota.getMyScope(),
                        "myCategory": quota.getMyCategory(),
                        "myStatus": quota.getMyStatus(),
                        "myProductId": quota.getMyProductId(),
                        "myProductName": quota.getMyProductName(),
                        "myCustomerId": quota.getMyCustomerId(),
                        "myIndustryCode": quota.getMyIndustryCode(),
                        "myValidFrom": Utils.convertAnsiDate2Date(quota.getMyValidFrom()),
                        "myValidTo": Utils.convertAnsiDate2Date(quota.getMyValidTo())
                      });
      }
  });
}

for (var j = 0; j < bufferedEvents.length; j++) {
  currentEvent = bufferedEvents[j];

  //setting up the environment
  mainItem = currentEvent.listItem;
  var buttonValues = {};
    buttonValues[Localization.resolve("OK")] = "ok";
  
  //IMPORTANT: Perf fix, commenting this here and executing it separately in every case statement below! Do not "optimize"!
  //orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);

  //processing all the changed attributes of the event
  for (var i = 0; i < currentEvent.modified.length; i++) {

    var setItemValue = function(mainItem){
      var totalDiscount = (mainItem.getMyDiscountA() || 0) + (mainItem.getMyDiscountB() || 0) + (mainItem.getMyDiscountC() || 0) + (mainItem.getMyDiscountD() || 0) + (mainItem.getMyDiscountE() || 0) + (mainItem.getMyDiscountF() || 0) + (mainItem.getMyDiscountG() || 0);
      var basePrice = mainItem.getBasePrice();
      var orderPrice = basePrice * mainItem.getMyTotalQuantity();
      var discountAmount = (orderPrice * (totalDiscount / 100));
      var value = (orderPrice - discountAmount).toFixed(2);
      me.getLoItems().suspendListRefresh();
      mainItem.setDiscount(totalDiscount);
      mainItem.setValue(value);
      me.getLoItems().resumeListRefresh(true);
    };

    //reacting on the different attributes
    switch (currentEvent.modified[i]) {

      case "myDiscountG":
        me.setMyIsOrderChanged(true);
        //mainItem.setMyItemChangeTriggered("1");
        mainItem.setDiscount((mainItem.myDiscountA || 0) + (mainItem.myDiscountB || 0) + (mainItem.myDiscountC || 0) + (mainItem.myDiscountD || 0) + (mainItem.myDiscountE || 0) + (mainItem.myDiscountF || 0));
      if (mainItem.myDiscountG + mainItem.discount < 0 || mainItem.myDiscountG + mainItem.discount > 100 || mainItem.myDiscountA == 0) {
        me.getLoItems().suspendListRefresh();
        mainItem['myDiscountG'] = 0;
        me.getLoItems().resumeListRefresh();
      }
      // Setting the pricing condition
      var myPricingCondtion = me.boMyPricingTerms.loMyPricingCondition.current; 
      var layerGRulesDict = me.getBoMyDiscountEngineManager().getLayerGRulesDict();
      var firstBlockRuleKey = "", firstApprovalRuleKey = "", blockRules = 0, approvalRules = 0;

      for(var key in layerGRulesDict.data) {
        var rule = layerGRulesDict.get(key);
          var currentPrdSubBrand = mainItem.getCriterion4();
          var currentPrdBrand = mainItem.getCriterion3();
          var currentSku = mainItem.getPrdMainPKey();
          if(rule.application.includes(currentSku) || rule.application.includes(currentPrdBrand) || rule.application.includes(currentPrdSubBrand)){
            if(rule.behaviourIfHigherDiscount == 'Block + Message'){
              firstBlockRuleKey = (blockRules == 0) ? key : firstBlockRuleKey;
              blockRules += 1;
            }
            else{
              firstApprovalRuleKey = (approvalRules == 0) ? key : firstApprovalRuleKey;
              approvalRules += 1;
            }
          }
      }
      var finalRule = (blockRules > 0) ? layerGRulesDict.get(firstBlockRuleKey) : (blockRules == 0 && approvalRules > 0) ? layerGRulesDict.get(firstApprovalRuleKey) : null;
      // Validate My Discount
      if( Utils.isDefined(finalRule) && mainItem.myDiscountG > finalRule.maxDiscountPercent) {
        if(finalRule.behaviourIfHigherDiscount == 'Block + Message'){
          return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Warning"), finalRule.errorMsg, buttonValues).then(function(){
          }).then(function(){
            mainItem[currentEvent.modified[i]]=currentEvent.oldValues[currentEvent.modified[i]];
            mainItem.setDiscount(mainItem.getDiscount() + currentEvent.oldValues[currentEvent.modified[i]]);
          });

        } else if (finalRule.behaviourIfHigherDiscount == 'Approval Process'){
          let approvalCategory = me.getMyApprovalCategory();
          if(approvalCategory.indexOf('Policy Rule') == -1 && Utils.isEmptyString(approvalCategory)){
            approvalCategory = 'Policy Rule';
          } else if(!Utils.isEmptyString(approvalCategory) && approvalCategory.indexOf('Policy Rule') == -1) {
              approvalCategory = approvalCategory + ';' + 'Policy Rule';
          }
          me.setMyApprovalCategory(approvalCategory);
          mainItem.setMyItemApprovalNote1(mainItem.getMyItemApprovalNote1() + '\nLayer G discount exceeds the allowed max discount percentage of ' + finalRule.maxDiscountPercent);
          mainItem.setMyItemApprovalNote2(mainItem.getMyItemApprovalNote2() + '\nLayer G discount exceeds the allowed max discount percentage of ' + finalRule.maxDiscountPercent);
          mainItem.setMyItemApprovalNote3(mainItem.getMyItemApprovalNote3() + '\nLayer G discount exceeds the allowed max discount percentage of ' + finalRule.maxDiscountPercent);
          mainItem.setMyItemApprovalNote4(mainItem.getMyItemApprovalNote4() + '\nLayer G discount exceeds the allowed max discount percentage of ' + finalRule.maxDiscountPercent);
          mainItem.setMyItemApprovalNote5(mainItem.getMyItemApprovalNote5() + '\nLayer G discount exceeds the allowed max discount percentage of ' + finalRule.maxDiscountPercent);
          mainItem.setMyItemApprovalNote6(mainItem.getMyItemApprovalNote6() + '\nLayer G discount exceeds the allowed max discount percentage of ' + finalRule.maxDiscountPercent);
          me.setMyApprovalNote(mainItem.getMyApprovalNote() + '\nLayer G discount exceeds the allowed max discount percentage of ' + finalRule.maxDiscountPercent);  
          mainItem.setDiscount(mainItem.getDiscount() + mainItem.getMyDiscountG());
          setItemValue(mainItem);
        }    
      }
      else{
        setItemValue(mainItem);
      }

      break;

      case "mySplit1Q":
      case "mySplit2Q":
      case "mySplit3Q":
      case "mySplit4Q":
      case "mySplit5Q":
      case "mySplit6Q":

      me.setMyIsOrderChanged(true);
      
      //set a flag if split quantity was set to zero 0
      if(currentEvent.newValues[ currentEvent.modified[i] ] == 0 && currentEvent.oldValues[ currentEvent.modified[i] ] != 0){
        mainItem.mySplitQtyReset = true;
      }

      // Validate Delivery Unit else validate Full Box
      if (me.getLuOrderer().myApplyDeliveryUnit === 1 && mainItem.myApplyDeliveryUnit === '1' && isFinite(mainItem.myDeliveryUnit) && mainItem.myDeliveryUnit > 0) {
        if (mainItem[currentEvent.modified[i]] % mainItem.myDeliveryUnit !== 0) {
          let qty = Math.ceil(mainItem[currentEvent.modified[i]] / mainItem.myDeliveryUnit) * mainItem.myDeliveryUnit;
          let setQuantity = 'set' + currentEvent.modified[i].charAt(0).toUpperCase() + currentEvent.modified[i].slice(1);
          me.getLoItems().suspendListRefresh();
          mainItem[setQuantity](qty);
          me.getLoItems().resumeListRefresh(true);
        }
      } else if (mainItem.myFullBoxOnly == '1' && isFinite(mainItem.myShipperPiecesPerSmallestUnit) && mainItem.myShipperPiecesPerSmallestUnit > 0) {
        if (mainItem[currentEvent.modified[i]]%mainItem.myShipperPiecesPerSmallestUnit !== 0 ) {
          let qty = Math.ceil(mainItem[currentEvent.modified[i]] / mainItem.myShipperPiecesPerSmallestUnit) * mainItem.myShipperPiecesPerSmallestUnit;
          let setQuantity = 'set'+currentEvent.modified[i].charAt(0).toUpperCase() + currentEvent.modified[i].slice(1);
          // Dynamically calling setter methods like setMySplit1Q, setMySplit2Q, etc., based on split index
          me.getLoItems().suspendListRefresh();
          mainItem[setQuantity](qty);
          me.getLoItems().resumeListRefresh(true);
        }
      }
      // Validate Quota Limit
      var totalQuantity = (mainItem.mySplit1Q || 0) + (mainItem.mySplit2Q || 0) + (mainItem.mySplit3Q || 0) + (mainItem.mySplit4Q || 0) + (mainItem.mySplit5Q || 0) + (mainItem.mySplit6Q || 0);
      
      var mySplit1Q = mainItem.mySplit1Q || 0;
      var mySplit2Q = mainItem.mySplit2Q || 0;
      var mySplit3Q = mainItem.mySplit3Q || 0;
      var mySplit4Q = mainItem.mySplit4Q || 0;
      var mySplit5Q = mainItem.mySplit5Q || 0;
      var mySplit6Q = mainItem.mySplit6Q || 0;

      var mySplit1DDAnsi = Utils.isDefined(me.myDDSplit1) ? me.myDDSplit1 : Utils.getMinDate();
      var mySplit2DDAnsi = Utils.isDefined(me.myDDSplit2) ? me.myDDSplit2 : Utils.getMinDate();
      var mySplit3DDAnsi = Utils.isDefined(me.myDDSplit3) ? me.myDDSplit3 : Utils.getMinDate();
      var mySplit4DDAnsi = Utils.isDefined(me.myDDSplit4) ? me.myDDSplit4 : Utils.getMinDate();
      var mySplit5DDAnsi = Utils.isDefined(me.myDDSplit5) ? me.myDDSplit5 : Utils.getMinDate();
      var mySplit6DDAnsi = Utils.isDefined(me.myDDSplit6) ? me.myDDSplit6 : Utils.getMinDate();

      var mySalesRepQuotaValidFrom = mainItem.mySalesRepQuotaValidFrom !== " " ? Utils.convertAnsiDate2Date(mainItem.mySalesRepQuotaValidFrom) : " ";
      var myCustomerQuotaValidFrom = mainItem.myCustomerQuotaValidFrom !== " " ? Utils.convertAnsiDate2Date(mainItem.myCustomerQuotaValidFrom) : " ";
      var myChannelQuotaValidFrom = mainItem.myChannelQuotaValidFrom !== " " ? Utils.convertAnsiDate2Date(mainItem.myChannelQuotaValidFrom) : " ";
      var mySalesRepQuotaValidTo = mainItem.mySalesRepQuotaValidTo !== " " ? Utils.convertAnsiDate2Date(mainItem.mySalesRepQuotaValidTo) : " ";
      var myCustomerQuotaValidTo = mainItem.myCustomerQuotaValidTo !== " " ? Utils.convertAnsiDate2Date(mainItem.myCustomerQuotaValidTo) : " ";
      var myChannelQuotaValidTo = mainItem.myChannelQuotaValidTo !== " " ? Utils.convertAnsiDate2Date(mainItem.myChannelQuotaValidTo) : " ";

      const remainingQuotas = new Map();
      if (mainItem.mySalesRepQuota != 'NA' && isFinite(mainItem.mySalesRepQuota)) {
        remainingQuotas.set("mySalesRepQuota", mainItem.mySalesRepQuota);
      }
      if (mainItem.myCustomerQuota != 'NA' && isFinite(mainItem.myCustomerQuota)) {
        remainingQuotas.set("myCustomerQuota", mainItem.myCustomerQuota);
      }
      if (mainItem.myChannelQuota != 'NA' && isFinite(mainItem.myChannelQuota)) {
        remainingQuotas.set("myChannelQuota", mainItem.myChannelQuota);
      }
      var lowestQuota = Math.min(...Array.from(remainingQuotas.values()));
      const mySalesRepQuotaKey = remainingQuotas.get("mySalesRepQuota");
      const myCustomerQuotaKey = remainingQuotas.get("myCustomerQuota");
      const myChannelQuotaKey = remainingQuotas.get("myChannelQuota");
      const QuotaCategories = ['POS Material', 'Loyalty Card', 'Personal Usage'];
      var myCompleteSalesRepQuotaCategory = QuotaCategories.includes(mainItem.mySalesRepQuotaCategory) ?
                                            'Free Good - ' + mainItem.mySalesRepQuotaCategory :
                                            mainItem.mySalesRepQuotaCategory;
      var myCompleteCustomerQuotaCategory = QuotaCategories.includes(mainItem.myCustomerQuotaCategory) ?
                                            'Free Good - ' + mainItem.myCustomerQuotaCategory :
                                            mainItem.myCustomerQuotaCategory;
      var myCompleteChannelQuotaCategory = QuotaCategories.includes(mainItem.myChannelQuotaCategory) ?
                                            'Free Good - ' + mainItem.myChannelQuotaCategory :
                                            mainItem.myChannelQuotaCategory;


      const matchSalesRepQuota = Utils.isDefined(mySalesRepQuotaKey) && 
                                  mySalesRepQuotaKey === mainItem.mySalesRepQuota && 
                                  myCompleteSalesRepQuotaCategory === mainItem.orderItemTemplate &&
                                  mySalesRepQuotaValidFrom !== " " && mySalesRepQuotaValidTo !== "" &&
                                  (
                                    (currentEvent.modified[i] === "mySplit1Q" && mySplit1Q > 0 && mySplit1Q > lowestQuota && mySplit1DDAnsi >= mySalesRepQuotaValidFrom && mySplit1DDAnsi <= mySalesRepQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit2Q" && mySplit2Q > 0 && mySplit2Q > lowestQuota && mySplit2DDAnsi >= mySalesRepQuotaValidFrom && mySplit2DDAnsi <= mySalesRepQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit3Q" && mySplit3Q > 0 && mySplit3Q > lowestQuota && mySplit3DDAnsi >= mySalesRepQuotaValidFrom && mySplit3DDAnsi <= mySalesRepQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit4Q" && mySplit4Q > 0 && mySplit4Q > lowestQuota && mySplit4DDAnsi >= mySalesRepQuotaValidFrom && mySplit4DDAnsi <= mySalesRepQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit5Q" && mySplit5Q > 0 && mySplit5Q > lowestQuota && mySplit5DDAnsi >= mySalesRepQuotaValidFrom && mySplit5DDAnsi <= mySalesRepQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit6Q" && mySplit6Q > 0 && mySplit6Q > lowestQuota && mySplit6DDAnsi >= mySalesRepQuotaValidFrom && mySplit6DDAnsi <= mySalesRepQuotaValidTo)
                                  );
      const matchCustomerQuota = Utils.isDefined(myCustomerQuotaKey) && 
                                  myCustomerQuotaKey === mainItem.myCustomerQuota && 
                                  myCompleteCustomerQuotaCategory === mainItem.orderItemTemplate &&
                                  myCustomerQuotaValidFrom !== " " && myCustomerQuotaValidTo !== "" &&
                                  (
                                    (currentEvent.modified[i] === "mySplit1Q" && mySplit1Q > 0 && mySplit1Q > lowestQuota && mySplit1DDAnsi >= myCustomerQuotaValidFrom && mySplit1DDAnsi <= myCustomerQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit2Q" && mySplit2Q > 0 && mySplit2Q > lowestQuota && mySplit2DDAnsi >= myCustomerQuotaValidFrom && mySplit2DDAnsi <= myCustomerQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit3Q" && mySplit3Q > 0 && mySplit3Q > lowestQuota && mySplit3DDAnsi >= myCustomerQuotaValidFrom && mySplit3DDAnsi <= myCustomerQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit4Q" && mySplit4Q > 0 && mySplit4Q > lowestQuota && mySplit4DDAnsi >= myCustomerQuotaValidFrom && mySplit4DDAnsi <= myCustomerQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit5Q" && mySplit5Q > 0 && mySplit5Q > lowestQuota && mySplit5DDAnsi >= myCustomerQuotaValidFrom && mySplit5DDAnsi <= myCustomerQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit6Q" && mySplit6Q > 0 && mySplit6Q > lowestQuota && mySplit6DDAnsi >= myCustomerQuotaValidFrom && mySplit6DDAnsi <= myCustomerQuotaValidTo)
                                  );
      const matchChannelQuota = Utils.isDefined(myChannelQuotaKey) && 
                                  myChannelQuotaKey === mainItem.myChannelQuota && 
                                  myCompleteChannelQuotaCategory === mainItem.orderItemTemplate &&
                                  myChannelQuotaValidFrom !== " " && myChannelQuotaValidTo !== "" &&
                                  (
                                    (currentEvent.modified[i] === "mySplit1Q" && mySplit1Q > 0 && mySplit1Q > lowestQuota && mySplit1DDAnsi >= myChannelQuotaValidFrom && mySplit1DDAnsi <= myChannelQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit2Q" && mySplit2Q > 0 && mySplit2Q > lowestQuota && mySplit2DDAnsi >= myChannelQuotaValidFrom && mySplit2DDAnsi <= myChannelQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit3Q" && mySplit3Q > 0 && mySplit3Q > lowestQuota && mySplit3DDAnsi >= myChannelQuotaValidFrom && mySplit3DDAnsi <= myChannelQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit4Q" && mySplit4Q > 0 && mySplit4Q > lowestQuota && mySplit4DDAnsi >= myChannelQuotaValidFrom && mySplit4DDAnsi <= myChannelQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit5Q" && mySplit5Q > 0 && mySplit5Q > lowestQuota && mySplit5DDAnsi >= myChannelQuotaValidFrom && mySplit5DDAnsi <= myChannelQuotaValidTo) ||
                                    (currentEvent.modified[i] === "mySplit6Q" && mySplit6Q > 0 && mySplit6Q > lowestQuota && mySplit6DDAnsi >= myChannelQuotaValidFrom && mySplit6DDAnsi <= myChannelQuotaValidTo)
                                  );

      if (matchSalesRepQuota || matchCustomerQuota || matchChannelQuota) {
        var validationMsg = Localization.resolve("BoOrder_CasSdoMyOrderQuotaLimitValidationMessage");
        validationMsg = validationMsg.replace("#remainingQuota#", lowestQuota);
        return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Warning"), validationMsg, buttonValues).then(function(){
          }).then(function(){
            mainItem[currentEvent.modified[i]] = 0;
          });
      }

      if(mainItem.myBOMType && mainItem.myBOMType.trim()){
        //Check if this can be optimized
        if( me.boItemTabManager && me.boItemTabManager.loMyBOMProductParts){
          var loProductParts = me.boItemTabManager.loMyBOMProductParts.getAllItems();
          var filteredParts = loProductParts.filter(part => part.parentPrdKey === mainItem.prdMainPKey);
          var loItems = me.loItems.getAllItems();
          filteredParts.forEach((part)=>{
            if(isFinite(totalQuantity)){
              part.setPrdQuantity(part.prdDefaultQuantity * totalQuantity);
            }
            // Find the corresponding item in loItems
            var matchingItem = loItems.find(item => item.prdMainPKey === part.childPrdKey && item.myIsBOMPart == '1' && (item.changedBOMType == '0' || item.changedBOMType == 'true' || item.changedBOMType == 'false' || item.changedBOMType == null));

            // If a matching item is found, update its quantity
            if (matchingItem) {
              matchingItem.myParentBOMType = part.myParentBOMType;
              switch (currentEvent.modified[i]) {
                case 'mySplit1Q':
                  matchingItem.setMySplit1Q(part.prdQuantity);
                  break;
                case 'mySplit2Q':
                  matchingItem.setMySplit2Q(part.prdQuantity);
                  break;
                case 'mySplit3Q':
                  matchingItem.setMySplit3Q(part.prdQuantity);
                  break;
                case 'mySplit4Q':
                  matchingItem.setMySplit4Q(part.prdQuantity);
                  break;
                case 'mySplit5Q':
                  matchingItem.setMySplit5Q(part.prdQuantity);
                  break;
                case 'mySplit6Q':
                  matchingItem.setMySplit6Q(part.prdQuantity);
                  break;
                default:
                  // Handle any cases that don't match, if necessary
                  break;
              }
            }
          });
        }
      }

      var nonPreSalesQty = 0;
      if(Utils.isDefined(me.getMySplit1ImDelivery()) && me.getMySplit1ImDelivery() == "1"){
        nonPreSalesQty = nonPreSalesQty + (mainItem.mySplit1Q || 0);
      }
      if(Utils.isDefined(me.getMySplit2ImDelivery()) && me.getMySplit2ImDelivery() == "1"){
        nonPreSalesQty = nonPreSalesQty + (mainItem.mySplit2Q || 0);
      }
      me.getLoItems().suspendListRefresh();
      mainItem.setMyTotalQuantity(totalQuantity);
      mainItem.setMyUnitPresales(totalQuantity - nonPreSalesQty);
      me.getLoItems().resumeListRefresh(true);
      discountEngineTriggerObj = {
        mainItem: mainItem
      };
      discountEngineTriggers.push(discountEngineTriggerObj);
      orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);
      pricingTriggerObject = {
        mainItem: mainItem,
        orderUnitItem: orderUnitItem,
        modifiedAttribute: currentEvent.modified[i]
      };
      calculationProcessTriggers.push(pricingTriggerObject);

      isUpdateRequired = true;
      
    break;


        /******************************************************* Quantity ***********************************************************/
      case "quantity": {

        if (me.boOrderMeta.id == "Exchange" && me.myExchangeType == "Exchange") {
          if (
              me.getLuOrderer().myApplyDeliveryUnit === 1 &&
              mainItem.myApplyDeliveryUnit === '1' &&
              isFinite(mainItem.myDeliveryUnit) &&
              mainItem.myDeliveryUnit > 0
            ) {
            if (mainItem[currentEvent.modified[i]] % mainItem.myDeliveryUnit !== 0) {
              let qty = Math.ceil(mainItem[currentEvent.modified[i]] / mainItem.myDeliveryUnit) * mainItem.myDeliveryUnit;
              let setQuantity = 'set' + currentEvent.modified[i].charAt(0).toUpperCase() + currentEvent.modified[i].slice(1);
              me.getLoItems().suspendListRefresh();
              mainItem[setQuantity](qty);
              me.getLoItems().resumeListRefresh(true);
            }
          }
  
          const globalQuotaKey = globalQuotasMap.get(mainItem.getPrdMainPKey());
  
          if (Utils.isDefined(globalQuotaKey)) {
            if (
                isFinite(globalQuotaKey.myRemainingQuota) &&
                mainItem.getQuantity() > 0 &&
                mainItem.getQuantity() > globalQuotaKey.myRemainingQuota &&
                Utils.convertAnsiDate2Date(me.getDeliveryDate()) >= globalQuotaKey.myValidFrom &&
                Utils.convertAnsiDate2Date(me.getDeliveryDate()) <= globalQuotaKey.myValidTo
                ) {
                  var validationMsg = Localization.resolve("BoOrder_CasSdoMyExchangeOrderGlobalQuotaLimitValidationMessage");
                  validationMsg = validationMsg.replace("#productName#", globalQuotaKey.myProductName);
                  return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Warning"), validationMsg, buttonValues).then(function(){
                    }).then(function(){
                      let setQuantity = 'set' + currentEvent.modified[i].charAt(0).toUpperCase() + currentEvent.modified[i].slice(1);
                      mainItem[setQuantity](0);
                    });   
            }
          }
        }
        //Set Discount as the depreciation percentage for Exchange Orders
        if(me.boOrderMeta.id=='Exchange' && mainItem.myEligibleForExchange == "1"){
          mainItem.setDiscount(mainItem.myPrdDepreciationPercentage)
        }
        //Check if changed item is a free item which comes from pricing engine
        var isPEFreeItem = false;
        var parentType = mainItem.getParentType();
        if (Utils.isDefined(parentType) && (parentType === "Order" || parentType === "Item")) {
          isPEFreeItem = true;
        }

        //Set myIsOrderChanged to true
        me.setMyIsOrderChanged(true);
        //perf fix
        orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);
        modReasonTriggerObj = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem
        };
        reasonCodeProcessTriggers.push(modReasonTriggerObj);

        quantityChangedTriggerObj = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem,
          oldValue: currentEvent.oldValues.quantity,
          newValue: currentEvent.newValues.quantity
        };
        quantityProcessTriggers.push(quantityChangedTriggerObj);

        groupingTriggerObj = {
          mainItem: mainItem
        };
        groupingProcessTriggers.push(groupingTriggerObj);


        //only create calculationTrigger if qty change comes not from a Pricing Engine FreeItem
        if (!isPEFreeItem) {
          pricingTriggerObject = {
            mainItem: mainItem,
            orderUnitItem: orderUnitItem,
            modifiedAttribute: currentEvent.modified[i]
          };
          calculationProcessTriggers.push(pricingTriggerObject);
        }


        if (mainItem.getIsSuggestedClicked() === "0") {
          me.getLoItems().suspendListRefresh();
          mainItem.setEdited("1");
          me.getLoItems().resumeListRefresh(true);
        }
        else {
          me.getLoItems().suspendListRefresh();
          mainItem.setIsSuggestedClicked("0");
          me.getLoItems().resumeListRefresh(true);
        }
        isUpdateRequired = true;
        break;
      }

        /******************************************************* ModReason ***********************************************************/
      case "modReason": {
        //perf fix
        orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);
        modReasonTriggerObj = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem
        };
        reasonCodeProcessTriggers.push(modReasonTriggerObj);
        isUpdateRequired = true;

        break;
      }

        /******************************************************* Discount ***********************************************************/
      case "discount": {
        //perf fix
        orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);
        pricingTriggerObject = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem,
          modifiedAttribute: currentEvent.modified[i]
        };
        calculationProcessTriggers.push(pricingTriggerObject);

        groupingTriggerObj = {
          mainItem: mainItem
        };
        groupingProcessTriggers.push(groupingTriggerObj);
        isUpdateRequired = true;

        break;
      }

        /******************************************************* Special Price ***********************************************************/
      case "specialPriceReceipt": {
        //perf fix
        orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);
        pricingTriggerObject = {
          mainItem: mainItem,
          orderUnitItem: orderUnitItem,
          modifiedAttribute: currentEvent.modified[i]
        };
        calculationProcessTriggers.push(pricingTriggerObject);

        groupingTriggerObj = {
          mainItem: mainItem
        };
        groupingProcessTriggers.push(groupingTriggerObj);
        isUpdateRequired = true;

        break;
      }

        /******************************************************* PricingInfo ***********************************************************/
      case "pricingInfo1":
      case "pricingInfo2":
      case "pricingInfo3":
      case "pricingInfo4":
      case "pricingInfo5":
      case "pricingInfo6":
      case "pricingInfo7":
      case "pricingInfo8":
      case "pricingInfo9":
      case "pricingInfo10":
        //perf fix
        if (mainItem.getQuantity() > 0) {
          orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);
          pricingTriggerObject = {
            mainItem: mainItem,
            orderUnitItem: orderUnitItem,
            modifiedAttribute: currentEvent.modified[i]
          };
          calculationProcessTriggers.push(pricingTriggerObject);
          isUpdateRequired = true;
        }
        break;
          /******************************************************* Split Quantity ***********************************************************/
    }
  }
}

/***************************************************************************************************************/
/*                       Handling the different processes that are needed                                      */
/***************************************************************************************************************/
//Skipped for other events like display information changes.
if (isUpdateRequired) {

  //defining the handler functions
  var qtyChangedHandler = function(x) {
    var mainItem = x.mainItem;
    orderUnitItem = x.orderUnitItem;
    var oldValue = x.oldValue;
    var newValue = x.newValue;
    var messagePromise = when.resolve();
    //check quantity modification allowed
    var buttonValues = {};
    buttonValues[Localization.resolve("OK")] = "ok";
    var sdoItemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(mainItem.getSdoItemMetaPKey());
    
    // Free item are not defined anymore with getSdoParentItemPKey , right way to check thru parentType
    //var isFreeItem = (mainItem.sdoItemMetaPKey === me.boOrderMeta.luOrderMetaForFreeItems.sdoItemMetaPKey && !Utils.isEmptyString(mainItem.getSdoParentItemPKey()));
    
    var isFreeItem = false;
    var parentType = mainItem.getParentType();
    if (Utils.isDefined(parentType) && (parentType === "Order" || parentType === "Item")) {
      isFreeItem = true;
    }

    if ((me.getBoOrderMeta().getConsiderQuantitySuggestion() === "PQty" || isFreeItem || mainItem.getSpecialPromoted() =="1") &&
        (mainItem.getMergeEngine_invalidated() === "0") && mainItem.getEdited() !== "0") {
      var modifyPresetQuantityOption = " ";
      if (!Utils.isEmptyString(me.getLuDeliveryRecipient().getPKey()) && !Utils.isEmptyString(me.getLuDeliveryRecipient().getSdoModifyPresetQuantity())) {
        modifyPresetQuantityOption= me.getLuDeliveryRecipient().getSdoModifyPresetQuantity();
      }
      else if (Utils.isDefined(sdoItemMeta)) {
        modifyPresetQuantityOption= sdoItemMeta.getModifyPresetQuantity();
      }
      var setPresetQuantity = function(item, modifyPresetQtyOption, presetValue){
        if (modifyPresetQtyOption === "No") {
          me.getLoItems().suspendListRefresh();
          item.setQuantity(presetValue);
          me.getLoItems().resumeListRefresh(true);
        }
        else {
          item.setQuantity(item.getSuggestedQuantity());
        }
        item.setEdited("0");
        return when.resolve();
      };

      if (mainItem.getDeletedFreeItem() === "0" && (
        (modifyPresetQuantityOption === "ODec" && newValue > mainItem.getSuggestedQuantity()) ||
        (modifyPresetQuantityOption === "OInc" && newValue < mainItem.getSuggestedQuantity()) ||
        (modifyPresetQuantityOption === "No" && newValue != oldValue))) {
        return MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Warning"), Localization.resolve("QtyEditNotAllowed"), buttonValues).then(function(){
          return when(setPresetQuantity(mainItem,modifyPresetQuantityOption,oldValue));
        }).then(function(){
          me.getLoItems().suspendListRefresh();
          return me.roundOrderItemQuantity(mainItem);
        }).then(function(){
          me.getLoItems().resumeListRefresh(true);
          return when(mainItem.setEditedQty(mainItem.getQuantity()));
        }).then(function(){
          me.getLoItems().createDisplayInformationForItem(orderUnitItem, me.getBoOrderMeta());
        });
      }
      else {
        return when(mainItem.setEditedQty(mainItem.getQuantity())).then(function(){
          me.getLoItems().createDisplayInformationForItem(orderUnitItem, me.getBoOrderMeta());
        });
      }
    }
    else {
      //Quantity rounding logic
      me.getLoItems().suspendListRefresh();
      return me.roundOrderItemQuantity(mainItem).then(function(){
        mainItem.setEditedQty(mainItem.getQuantity());
        me.getLoItems().resumeListRefresh(true);
        me.getLoItems().createDisplayInformationForItem(orderUnitItem, me.getBoOrderMeta());
      });
    }
  };

  var groupingHandler = function(x) {
    me.determineItemSplittingGroups(x.mainItem);
  };

  var discountEngineHandler = function() {
    var discountEngineHandlerPromise = when.resolve();
    discountEngineHandlerPromise = me.myPrepareFlattenItemList("itemchanged");
    return discountEngineHandlerPromise;
  };

  var pricingUpdateHandler = function(x) {
    var pricingPromise;
    var mainItem = x.mainItem;
    var isFreeItem = mainItem.sdoItemMetaPKey === me.boOrderMeta.luOrderMetaForFreeItems.sdoItemMetaPKey ;

    if (Utils.isDefined(CP) && (me.getBoOrderMeta().getComputePrice() === "4" || me.getBoOrderMeta().getComputePrice() === "5")) {
      var isNewItem = !(CP.PricingHandler.getInstance().hasOrderItem(mainItem.getPKey()));
      pricingPromise = CP.PricingHandler.getInstance().updateProduct(mainItem.getData(), x.modifiedAttribute).then(function () {
        if (isNewItem) {
          CP.PricingHandler.getInstance().setVariantItemAttributes(mainItem.getPKey(), me.cpGetVariantItemVariables(mainItem.getPKey()));
        }
      });
    }
    else {
      pricingPromise = me.calculateItemValue(mainItem);
    }
    return pricingPromise.then(function(){
      if (!isFreeItem) {
        return me.resetFreeItems(mainItem);
      }
    });
  };

  var resetCalculationHandler = function() {
    var resetCalculationPromise = when.resolve();

    if(me.getCalculationStatus() !== BLConstants.Order.CALCULATION_REQUIRED){
      me.setCalculationStatus(BLConstants.Order.CALCULATION_REQUIRED);
      resetCalculationPromise = me.resetCalculationResult();
    }
    return resetCalculationPromise;
  };

  var pricingCalculateHandler = function() {
    var pricingPromise = when.resolve();

    if (Utils.isDefined(CP) && (me.getBoOrderMeta().getComputePrice() === "4" || me.getBoOrderMeta().getComputePrice() === "5")) {
      if (me.getBoOrderMeta().getComputePrice() === "5" && me.getDocTaType() !== "NonValuatedDeliveryNote") {
        pricingPromise = me.cpCalculate();
      }
    }
    else {
      pricingPromise = me.calculateOrderValue().then(function(){
        me.setCalculationStatus("1");
        me.esDetermineSplittingGroups();
      });
    }
    return pricingPromise;
  };

  var modReasonHandler = function(x) {
    var sdoItemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemByPKey(mainItem.getSdoItemMetaPKey());
    return me.reasonCodeItemValidation(x.mainItem, sdoItemMeta, "1");
  };

  /****************** Quantity Changed Handling ********************/
  var qtyChangedDeferreds = quantityProcessTriggers.map(qtyChangedHandler);

  promise = when.all(qtyChangedDeferreds).then(function() {
    /****************** Hurdles Evaluation ********************/
    if (me.getBoOrderMeta().getConsiderSelectablePromotion() == "1" && quantityProcessTriggers.length > 0 && 
        !Utils.isEmptyString(quantityProcessTriggers[0].mainItem.getPromotionPKey()) && me.getIsNotReadyForHurdleEvaluation() !== "1") {
      return me.getHurdleEvaluationHelper().evaluateHurdles(me, me.getBoItemTabManager().getBoCallCache(), quantityProcessTriggers[0].mainItem.getPromotionPKey()).then(function () {
        var promotionPkey = quantityProcessTriggers[0].mainItem.getPromotionPKey();
        return me.getHurdleEvaluationHelper().determineSatisfiedRewardGroups(promotionPkey, me.getLoSelectablePromotion()).then(function() {
          me.updateRewardGroupSatisfactionCounter(promotionPkey);
        });
      });
    }
  }).then(function () {
    /****************** Grouping Handling ********************/
    groupingProcessTriggers.forEach(groupingHandler);


    /****************** Pricing Handling ********************/
    if (calculationProcessTriggers.length !== 0) {
      return resetCalculationHandler();
    }
  }).then(function () {    
    var pricingUpdateDeferreds = calculationProcessTriggers.map(pricingUpdateHandler);

    return when.all(pricingUpdateDeferreds);
  }).then(function() {
    if (calculationProcessTriggers.length !== 0) {
      return pricingCalculateHandler();
    }
  }).then(function() {
    /****************** Discount Engine Handling ********************/
    if (discountEngineTriggers.length !== 0) {
      return discountEngineHandler();
    }
  }).then(function() {
    /****************** ModReason Handling ********************/
    var reasonCodeDeferreds = reasonCodeProcessTriggers.map(modReasonHandler);

    return when.all(reasonCodeDeferreds);
  }).then(function() {
    if (Utils.isDefined(me.getBoItemTabManager())) {
      var filterId = me.getBoItemTabManager().getCurrentItemFilterId();
      var categoryId = me.getBoItemTabManager().getCurrentFilterId();
      me.getLoItems().setItemFilter(filterId, categoryId, me.getSelectedPromotionPKey());
      me.setItemFilterCounts();
    }
  }).then(function(){
      me.myCalculateOrderTotals();
  }).then(function(){
      me.updateItemFilterTotalValue();
  });
}
else {
  promise = when.resolve();
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}