"use strict";
/**
 * @function afterLoadAsync
 * @this LoMyOrderStatusCustomer
 * @kind "businessobject"
 * @async
 * @namespace CUSTOM
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterLoadAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    
    var promise=when.resolve(result);

    let currencyLabel = Utils.getToggleText("DomCurrency", ApplicationContext.get('user').getBoUserSales().getMySalesOrgCurrency());
    me.getAllItems().forEach(function(item){
        if(Utils.isDefined(item.orderAmount)){
          item.orderAmount = item.orderAmount.toFixed(2) + " " + currencyLabel;
        } else {
          item.orderAmount = 0 + " " + currencyLabel;
        }
        
      }); 
   
  
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}