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
 * @function myLoadDiscountEngine
 * @this BoOrder
 * @kind businessobject
 * @async
 * @namespace CUSTOM
 * @returns promise
 */
function myLoadDiscountEngine(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var promise=when.resolve();
    var orderItemsforDiscountEngine = [];

    if(Utils.isDefined(me.loMyOrderSplits)){ //Prepare the array only on order reload
        me.loMyOrderSplits.getAllItems().forEach(function (OrderSplit) {
            OrderSplit.loMySplitItems.getAllItems().forEach(function (SplitOrderItem){
                if(!orderItemsforDiscountEngine.includes(SplitOrderItem.prdMainPKey) && (SplitOrderItem.parentType != "FreeGoods" || SplitOrderItem.parentType != "FreeOfCharge")){
                    orderItemsforDiscountEngine.push(SplitOrderItem.prdMainPKey);
                }
            });
        });
    }

    me.setBoMyDiscountEngineManager(BoFactory.instantiate("BoMyDiscountEngineManager", {
        orderPkey: me.getPKey(),
        ordererPKey: me.getOrdererPKey(),
        sdoMetaPKey: me.getSdoMetaPKey()
        }));

        promise = BoFactory.loadObjectByParamsAsync("LoMyAgreements", {"ordererPKey": me.getOrdererPKey() })

        .then(function(agreements) {
            var agreementIdx
            var agreementIds = "";
            var items = agreements.getItems();
            for (var agreementIdx = 0; agreementIdx < items.length; agreementIdx++) {
                if (agreementIdx > 0){
                    agreementIds += ",";
                }
                agreementIds += "'" + items[agreementIdx].agreementPKey + "'";
            }
        me.getBoMyDiscountEngineManager().setLoMyAgreements(agreements);

        var prdIdx
        var productIds = "";
        var items = me.getLoItems().getItems();
        for (var prdIdx = 0; prdIdx < items.length; prdIdx++) {
            var item = items[prdIdx];
            if ((prdIdx > 0) && (!productIds.includes(item.prdMainPKey))){
                productIds += ",";
            }
            if(!productIds.includes(item.prdMainPKey)){
                productIds += "'" + item.prdMainPKey + "'";
            }
        }
        var agreementPrdsParams = {};
        agreementPrdsParams.agreementIds = agreementIds;
        agreementPrdsParams.productIds = productIds;

        return BoFactory.loadObjectByParamsAsync("LoMyAgreementProducts", agreementPrdsParams)
        }).then(function(agreementProducts) {
        me.getBoMyDiscountEngineManager().setLoMyAgreementProducts(agreementProducts);
        var pricingTermPrdsParams = {};
        pricingTermPrdsParams.orderMetaName = Utils.isDefined(me.getBoOrderMeta().getId()) ? me.getBoOrderMeta().getId() : '' ;
        pricingTermPrdsParams.pricingTermId = Utils.isDefined(me.getMyPreSalesId()) ? me.getMyPreSalesId() : '';

        return BoFactory.loadObjectByParamsAsync("LoMyPricingTermProductsInfo", pricingTermPrdsParams)
        }).then(function(pricingTermProducts) {
            me.getBoMyDiscountEngineManager().setLoMyPricingTermProductsInfo(pricingTermProducts);
            var freeItemProductIds = [];
            var items = pricingTermProducts.getItems();
            for (var Idx = 0; Idx < items.length; Idx++) {
               if(items[Idx].typeOfDiscount == "Regular" && !Utils.isEmptyString(items[Idx].freeGoodProduct) && !freeItemProductIds.includes(items[Idx].freeGoodProduct) && items[Idx].freeGoodQty > 0){
                freeItemProductIds.push(Utils.convertForDBParam(items[Idx].freeGoodProduct, 'DomPKey'));
               }
                else if (items[Idx].typeOfDiscount == "Free of Charge" && !Utils.isEmptyString(items[Idx].scope) && !freeItemProductIds.includes(items[Idx].scope) && items[Idx].qtyToGive > 0){
                    freeItemProductIds.push(Utils.convertForDBParam(items[Idx].scope, 'DomPKey'));
                }            
            } 
            if (me.loMyOrderSplits?.getAllItemsCount() > 0) {
                me.loMyOrderSplits.getAllItems().forEach((myOrderSplit) => {
                    myOrderSplit.loMySplitItems.getAllItems().forEach((splitOrderItem) => {
                        if (splitOrderItem.parentType === "ManualAdd") {
                            freeItemProductIds.push(splitOrderItem.prdMainPKey);
                        }
                    });
                });
            }            

        return BoFactory.loadObjectByParamsAsync("LoMyFreeItemProductsInfo",{ freeItemProductIds : freeItemProductIds })
        }).then(function(freeItemProducts) {
            me.getBoMyDiscountEngineManager().setLoMyFreeItemProductsInfo(freeItemProducts); 

            me.getBoMyDiscountEngineManager().setLoMyFlattenedDiscountEngineList(
            BoFactory.instantiate("LoMyFlattenedDiscountEngineList", {}));
            return orderItemsforDiscountEngine;
        });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}