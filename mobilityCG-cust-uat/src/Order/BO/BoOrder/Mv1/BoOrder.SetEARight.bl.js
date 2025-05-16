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
 * @function setEARight
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} promotionPKey
 * @param {String} myDiscountHideOrShow
 * @returns promise
 */
function setEARight(promotionPKey,myDiscountHideOrShow){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();
var orderAcl = me.getACL();
var orderItems = me.getLoItems();
var orderItemsACL = orderItems.getACL();
var MAX_SPLITS = me.boOrderMeta.myNumberOfSplits;
var action = me.getMyDiscountHideOrShow();
  if(myDiscountHideOrShow == 'Show'){
    if(action == 'Shown' || Utils.isEmptyString(action) ){
      me.setMyDiscountHideOrShow('Hidden');
      orderItemsACL.removeRight(AclObjectType.PROPERTY, "myDiscountSummaryInfo", AclPermission.VISIBLE);
    }
    
     if(action == 'Hidden'){
      me.setMyDiscountHideOrShow('Shown');
      orderItemsACL.addRight(AclObjectType.PROPERTY, "myDiscountSummaryInfo", AclPermission.VISIBLE);
    }
  }

  if(me.boOrderMeta.id != "PreSales"){
    orderItemsACL.removeRight(AclObjectType.PROPERTY, "myUnitPresales", AclPermission.VISIBLE);
  }

  for (var splitIndex = 1; splitIndex <= 6; splitIndex++) {
    if (Utils.isDefined(me['myDDSplit'+splitIndex]) && splitIndex <= 6) {
      orderAcl.addRight(AclObjectType.PROPERTY, "mySplitStr" + splitIndex, AclPermission.VISIBLE);
    } else {
      orderAcl.removeRight(AclObjectType.PROPERTY, "mySplitStr" + splitIndex, AclPermission.VISIBLE);
    }
  }

//Iterate over each item and update the product quantity editability based on SoldTo Account
//if(me.boOrderMeta.mySoldToApplicable == '1' && me.luMySoldTo.myPartnerPKey && (me.mySoldTo1 || me.mySoldTo2 || me.mySoldTo3 || me.mySoldTo4 || me.mySoldTo5 || me.mySoldTo6)){
  let itemList = orderItems.getAllItems();
  const soldtoExclusionProductKeys = new Set(me.loMySoldToItems.getAllItems().map(item => item.pKey));
  const shiptoExclusionProductKeys = new Set(me.loMyShipToItems.getAllItems().map(item => item.pKey));
  for (var i = 0; i < itemList.length; i++) {
    const itemACL = itemList[i].getACL();
    const prdMainPKey = itemList[i].prdMainPKey; 
    if(itemList[i].getParentType() == "FreeGoods" || itemList[i].getParentType() == "FreeOfCharge"){
      itemACL.removeRight(AclObjectType.OBJECT, "LiOrderItem", AclPermission.EDIT);
    }
    if (itemList[i].getOneHundredDiscount() == "1" || itemList[i].getMyDiscountA() == 0) {
      itemACL.removeRight(AclObjectType.PROPERTY, "myDiscountG", AclPermission.EDIT);
    } else {
      itemACL.addRight(AclObjectType.PROPERTY, "myDiscountG", AclPermission.EDIT);
    }

    // Iterate over each SoldTo object
    for (let j = 1; j <= 6; j++) {
      const soldTo = me[`luMySoldTo${j}`];
      const splitDateAnsi = Utils.convertDate2Ansi(me[`myDDSplit${j}`]);  
      if (Utils.isDefined(me['myDDSplit'+j]) && me['myDDSplit'+j] != Utils.getMinDate() && j <= MAX_SPLITS) {
        itemACL.addRight(AclObjectType.PROPERTY, "mySplit" + j+ "DD", AclPermission.VISIBLE);
        itemACL.addRight(AclObjectType.PROPERTY, "mySplit" + j+ "Q", AclPermission.VISIBLE);
        if(shiptoExclusionProductKeys.has(prdMainPKey) || ((splitDateAnsi < itemList[i].getMyDeliveryValidFrom() || splitDateAnsi >= itemList[i].getMyDeliveryValidThru()) && itemList[i].getParentType() != "ManualAdd")){
          itemACL.removeRight(AclObjectType.PROPERTY, "mySplit" + j+ "Q", AclPermission.EDIT);
        } else {
          itemACL.addRight(AclObjectType.PROPERTY, "mySplit" + j+ "Q", AclPermission.EDIT);
        }
      } else {
        itemACL.removeRight(AclObjectType.PROPERTY, "mySplit" + j+ "DD", AclPermission.VISIBLE);
        itemACL.removeRight(AclObjectType.PROPERTY, "mySplit" + j+ "Q", AclPermission.VISIBLE);
      }

      //Condition to disable edit if assortment for split type
      if( 
          ( Utils.isDefined(itemList[i].myAssortmentOrderType) && 
            itemList[i].myAssortmentOrderType.includes( me["myType"+j] ) 
          ) 
            || 
          ( Utils.isDefined(itemList[i].myAssortmentSoldTo) &&
            itemList[i].myAssortmentSoldTo.includes( me["myType"+j] ) && 
            itemList[i].myAssortmentSoldTo.includes( me["mySoldTo"+j]) 
          )
      ){
        itemACL.removeRight(AclObjectType.PROPERTY, "mySplit" + j+ "Q", AclPermission.EDIT);
      }
      if(!soldTo.pKey){
        continue;
      }
      // Making the ShipToExclusionProducts Editable and checking for SoldToExclusionProducts
      if(shiptoExclusionProductKeys.has(prdMainPKey) && !soldtoExclusionProductKeys.has(prdMainPKey) && splitDateAnsi > itemList[i].getMyDeliveryValidFrom() && splitDateAnsi < itemList[i].getMyDeliveryValidThru()){
        itemACL.addRight(AclObjectType.PROPERTY, "mySplit" + j+ "Q", AclPermission.EDIT);
      }
      // Check if the OrderItem attributes match the SoldTo attributes
      if (
        (itemList[i].myIsFood == soldTo.myIsFood && itemList[i].myIsFood != "0") ||
        (itemList[i].myIsPharmaceutical == soldTo.myIsPharmaceutical && itemList[i].myIsPharmaceutical != "0") ||
        (itemList[i].myIsMedicalDev == soldTo.myIsMedicalDev && itemList[i].myIsMedicalDev != "0") ||
        (itemList[i].myIsCosmetics == soldTo.myIsCosmetics && itemList[i].myIsCosmetics != "0") ||
        (itemList[i].myIsBiocides == soldTo.myIsBiocides && itemList[i].myIsBiocides != "0") ||
        (itemList[i].myIsVeterinary == soldTo.myIsVeterinary && itemList[i].myIsVeterinary != "0") ||
        (soldtoExclusionProductKeys.has(prdMainPKey))
      ) {
        itemACL.removeRight(AclObjectType.PROPERTY, "mySplit" + j+ "Q", AclPermission.EDIT);
      }
      
    }
  }
//}

var userPKey = ApplicationContext.get('user').getPKey();

if (me.getPhase() != "Draft" || me.getResponsiblePKey() != userPKey) {
  orderAcl.removeRight(AclObjectType.OBJECT, "BoOrder", AclPermission.EDIT);
}

  promise = when.resolve();


    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}