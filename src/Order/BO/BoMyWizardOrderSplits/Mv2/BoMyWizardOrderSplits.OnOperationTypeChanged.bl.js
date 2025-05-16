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
 * @function onOperationTypeChanged
 * @this BoMyWizardOrderSplits
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CUSTOM
 * @param {Object} handlerParams
 * @returns promise
 */
function onOperationTypeChanged(handlerParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    // Deal with operation changes from "add" (create split) and "edit" (change split)

		let promise = when.resolve();
		if (handlerParams.oldValue != handlerParams.newValue) {
      // Reset all  form values
      if (handlerParams.newValue == "add") {

        let myMainOrder = Framework.getProcessContext().myMainOrder

        if(me.getLuMySplitType().getPKey() == 'Direct'){
          me.setSoldtoPKey(myMainOrder.luMyDefaultDirectSoldTo.pKey);
          me.setSoldtoName(myMainOrder.luMyDefaultDirectSoldTo.name);

          me.setBillToPKey(myMainOrder.luMyDefaultDirectBillTo.pKey);
          me.setBillToName(myMainOrder.luMyDefaultDirectBillTo.name);

          me.setShipToPKey(myMainOrder.luMyDefaultDirectShipTo.pKey);
          me.setShipToName(myMainOrder.luMyDefaultDirectShipTo.name);

          if(myMainOrder.luOrderer.mySalesOrg == 'C088'){
            me.setDeliverToPKey(myMainOrder.luMyDefaultDirectDeliverTo.pKey);
            me.setDeliverToName(myMainOrder.luMyDefaultDirectDeliverTo.name);
          }
          else{
            me.setDeliverToPKey(null);
            me.setDeliverToName(null);
          }

          me.setWholesalerPKey(null);
          me.setWholesalerName(null);

          me.setPKey(PKey.next());
          
        }
        else{

          me.setSoldtoPKey(myMainOrder.luMyDefaultTransferSoldTo.pKey);
          me.setSoldtoName(myMainOrder.luMyDefaultTransferSoldTo.name);

          me.setBillToPKey(myMainOrder.luMyDefaultTransferBillTo.pKey);
          me.setBillToName(myMainOrder.luMyDefaultTransferBillTo.name);

          me.setShipToPKey(myMainOrder.luMyDefaultTransferShipTo.pKey);
          me.setShipToName(myMainOrder.luMyDefaultTransferShipTo.name);

          me.setWholesalerPKey(myMainOrder.luMyDefaultTransferWholesaler.pKey);
          me.setWholesalerName(myMainOrder.luMyDefaultTransferWholesaler.name);

          me.setDeliverToPKey(null);
          me.setDeliverToName(null);

          me.setPKey(PKey.next());

        }


        me.splitIndex = undefined;
        let defaultDeliveryDate = Utils.createDateToday();
        defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + 2);
        me.setDeliveryDate(Utils.convertDate2Ansi(defaultDeliveryDate));
        me.splitType = myMainOrder.myDefaultSplitType;
        me.luMySplitType.pKey = myMainOrder.myDefaultSplitType;
        me.poNumber = undefined;
        if(myMainOrder.boOrderMeta.id == 'Cycle'){
          me.setMyImDeliverySplit(1);
        }
      } else {
        // Initialize at sdplit 1
        me.splitIndex = 1;
        promise = me.myChangeSplitData(1);
      }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}