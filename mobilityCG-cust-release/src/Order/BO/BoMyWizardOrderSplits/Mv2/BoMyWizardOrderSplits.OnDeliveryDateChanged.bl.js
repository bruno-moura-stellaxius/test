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
 * @function onDeliveryDateChanged
 * @this BoMyWizardOrderSplits
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CUSTOM
 * @param {Object} handlerParams
 * @returns promise
 */
function onDeliveryDateChanged(handlerParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
		let promise = when.resolve();
		if (handlerParams.oldValue != handlerParams.newValue) {
      let mainOrder = Framework.getProcessContext().myMainOrder;
      if (mainOrder ) {
        let buttonValues = {};
        buttonValues[Localization.resolve("OK")] = "ok";
        buttonValues[Localization.resolve("Cancel")] = "cancel";

        let newDate = Utils.convertAnsiDate2Date(handlerParams.newValue);
        let oldDate = Utils.convertAnsiDate2Date(handlerParams.oldValue);
        let tomorrow = Utils.createDateToday();
        tomorrow.setDate(tomorrow.getDate() + 1);
        let minDate;
        let maxDate;
        let formattedMinDate;
        let formattedMaxDate;
        if (mainOrder.boOrderMeta.id === 'PreSales'){
          if(me.myImDeliverySplit == 1){
            minDate = Utils.convertAnsiDate2Date(mainOrder.boMyPricingTerms.startDate);
            maxDate = Utils.convertAnsiDate2Date(mainOrder.boMyPricingTerms.endDate);
          }else{
            let preSalesDeliveries = mainOrder.boMyPricingTerms?.loMyPreSalesDeliveries?.getAllItems();
            var currentDelivery = preSalesDeliveries.find(delivery => delivery.pKey == me.myPreSalesDelivery);
            if(currentDelivery){
              minDate = Utils.convertAnsiDate2Date(currentDelivery.dateFrom);
              maxDate = Utils.convertAnsiDate2Date(currentDelivery.dateThru);
            }
          }
        }else if (mainOrder.boOrderMeta.id === 'Cycle' && mainOrder.boMyDiscountEngineManager.loMyPricingTermProductsInfo.getAllItems().length>0){
          minDate = Utils.convertAnsiDate2Date(mainOrder.boMyDiscountEngineManager.loMyPricingTermProductsInfo.getAllItems()[0].pricingTermStartDate);
          maxDate = Utils.convertAnsiDate2Date(mainOrder.boMyDiscountEngineManager.loMyPricingTermProductsInfo.getAllItems()[0].pricingTermEndDate);
        }
        if(me.myImDeliverySplit == 1){
          minDate.setDate(minDate.getDate() + mainOrder.boOrderMeta.myDeliveryLeadTime);
          maxDate.setDate(maxDate.getDate() + mainOrder.boOrderMeta.myMaxDeliveryDaysAfterPolicy);
        }
        if (newDate < tomorrow || (minDate && newDate < minDate) || (maxDate && newDate > maxDate) ) {
          let errMsg = '';
          const formatDate = (date) => `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
          formattedMinDate = formatDate(minDate);
          formattedMaxDate = formatDate(maxDate);
          if ((minDate && newDate < minDate && (tomorrow < minDate || tomorrow > maxDate) )|| (maxDate && newDate > maxDate)) {
            errMsg = Localization.resolve("MyEditOrderSplitUI_DeliveryDateOutOfRange");
            errMsg = errMsg.replace('#dateFrom#', formattedMinDate).replace('#dateThru#', formattedMaxDate);
          } else {
            errMsg = Localization.resolve("MyEditOrderSplitUI_DeliveryDateTooEarly");
          }
          promise = MessageBox.displayMessage(
            Localization.resolve("MessageBox_Title_Notification"), 
            errMsg, buttonValues)
          .then(
            function(input){
              if (minDate && newDate < minDate ||  tomorrow < minDate ) {
                me.setDeliveryDate(Utils.convertDate2Ansi(minDate));
              } else if(maxDate && newDate > maxDate || tomorrow > maxDate){
                me.setDeliveryDate(Utils.convertDate2Ansi(maxDate));
              } else{
                me.setDeliveryDate(Utils.convertDate2Ansi(tomorrow));
              }
            });
        }

      }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}