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
 * @function myChangeSplitType
 * @this BoMyWizardOrderSplits
 * @kind businessobject
 * @namespace CUSTOM

 */
function myChangeSplitType(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    let myMainOrder = Framework.getProcessContext().myMainOrder;

        if(me.getLuMySplitType().getPKey() == 'Direct'){
          me.setSoldtoPKey(myMainOrder.luMyDefaultDirectSoldTo.pKey);
          me.setSoldtoName(myMainOrder.luMyDefaultDirectSoldTo.name);

          me.setBillToPKey(myMainOrder.luMyDefaultDirectBillTo.pKey);
          me.setBillToName(myMainOrder.luMyDefaultDirectBillTo.name);

          me.setShipToPKey(myMainOrder.luMyDefaultDirectShipTo.pKey);
          me.setShipToName(myMainOrder.luMyDefaultDirectShipTo.name);

          me.setConsideredCustomerToBillTo(myMainOrder.luOrderer.pKey);
          me.setConsideredCustomerToShipTo(myMainOrder.luMyDefaultDirectBillTo.pKey);

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
          
        }
        else{

          me.setSoldtoPKey(myMainOrder.luMyDefaultTransferSoldTo.pKey);
          me.setSoldtoName(myMainOrder.luMyDefaultTransferSoldTo.name);
          
          me.setShipToPKey(myMainOrder.luMyDefaultTransferShipTo.pKey);
          me.setShipToName(myMainOrder.luMyDefaultTransferShipTo.name);

          me.setWholesalerPKey(myMainOrder.luMyDefaultTransferWholesaler.pKey);
          me.setWholesalerName(myMainOrder.luMyDefaultTransferWholesaler.name);

          me.setBillToPKey(myMainOrder.luMyDefaultTransferBillTo.pKey);
          me.setBillToName(myMainOrder.luMyDefaultTransferBillTo.name);
          
          me.setConsideredCustomerToBillTo(myMainOrder.luMyDefaultTransferWholesaler.pKey);
          me.setConsideredCustomerToShipTo(myMainOrder.luOrderer.pKey);
          
          me.setDeliverToPKey(null);
          me.setDeliverToName(null);

        }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}