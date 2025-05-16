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
 * @function myPrepopulateDefaultSplitInfo
 * @this BoWizardCreateNewWithCustomer
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 */
function myPrepopulateDefaultSplitInfo(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var promise = when.resolve(me);
    if(me.ordererPKey){
        //Wholesaler
        promise = BoFactory.loadObjectByParamsAsync(
                "LuMyAccountRelationship",
                { "customerPKey": me.ordererPKey, "relationshipType":"ZC", "orderCreation": true  }
            )
        .then(function(Wholesaler) {
            if(Utils.isDefined(Wholesaler.myPartnerPKey)){
                me.setMyDefaultTransferWholesalerPKey(Wholesaler.myPartnerPKey);
            }else{
                me.setMyDefaultTransferWholesalerPKey(" ");
            }
            //BillTo
            return BoFactory.loadObjectByParamsAsync(
                    "LuMyAccountRelationship",
                    { "customerPKey": Utils.isDefined(Wholesaler.myPartnerPKey) ? Wholesaler.myPartnerPKey : '', "relationshipType":"RE", "orderCreation": true }
                )
        }).then (function(BillToTransfer) {
            if(Utils.isDefined(BillToTransfer.myPartnerPKey)){
                me.setMyDefaultTransferBillToPKey(BillToTransfer.myPartnerPKey);
            }
            else{
                me.setMyDefaultTransferBillToPKey(" ");
            }
            return BoFactory.loadObjectByParamsAsync(
                "LuMyAccountRelationship",
                { "customerPKey": me.ordererPKey, "relationshipType":"RE", "orderCreation": true }
            )
        }).then (function(BillToDirect) {
                if(Utils.isDefined(BillToDirect.myPartnerPKey)){
                    me.setMyDefaultDirectBillToPKey(BillToDirect.myPartnerPKey);
                }
                else{
                    me.setMyDefaultDirectBillToPKey(" ");
                }
            //ShipTo
            return BoFactory.loadObjectByParamsAsync(
                "LuMyAccountRelationship",
                { "customerPKey": Utils.isDefined(BillToDirect.myPartnerPKey) ? BillToDirect.myPartnerPKey : '', "relationshipType":"WE", "orderCreation": true  }
                )
        }).then(function (ShipToDirect) {
            if(Utils.isDefined(ShipToDirect.myPartnerPKey)){
                me.setMyDefaultDirectShipToPKey(ShipToDirect.myPartnerPKey);
            }else{
                me.setMyDefaultDirectShipToPKey(" ");
            }
            return BoFactory.loadObjectByParamsAsync(
                "LuMyAccountRelationship",
                { "customerPKey": me.ordererPKey, "relationshipType":"WE", "orderCreation": true  }
                )
        }).then(function (ShipToTransfer) {
            if(Utils.isDefined(ShipToTransfer.myPartnerPKey)){
                me.setMyDefaultTransferShipToPKey(ShipToTransfer.myPartnerPKey);
            }else{
                me.setMyDefaultDirectShipToPKey(" ");
            }
            //SoldTo
            return BoFactory.loadObjectByParamsAsync(
                "LuMyAccountRelationship",
                { "customerPKey": me.ordererPKey, "relationshipType":"AG", "orderCreation": true  }
                )
        }).then(function(SoldTo) {
            if(Utils.isDefined(SoldTo.myPartnerPKey)){
                me.setMyDefaultDirectSoldToPKey(SoldTo.myPartnerPKey);
                me.setMyDefaultTransferSoldToPKey(SoldTo.myPartnerPKey);
            }else{
                me.setMyDefaultDirectSoldToPKey(" ");
                me.setMyDefaultTransferSoldToPKey(" ");
            }
            //DeliverTo
            return BoFactory.loadObjectByParamsAsync(
                "LuMyAccountRelationship",
                { "customerPKey": me.ordererPKey, "relationshipType":"ZE", "orderCreation": true  }
                )
        }).then(function(DeliverTo) {
            if(Utils.isDefined(DeliverTo.myPartnerPKey)){
                //me.setMyDefaultDirectDeliverToPKey(DeliverTo.myPartnerPKey);
            }else{
                //me.setMyDefaultDirectDeliverToPKey(" ");
            }
        })
    }
    return promise
  
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}