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
 * @function afterCreateAsync
 * @this BoMyWizardOrderSplits
 * @kind businessobject
 * @async
 * @namespace CUSTOM
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterCreateAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    var myMainOrder = context.jsonQuery.myMainOrder;
	var promise = when.resolve(me);
    var tempSplits = [];
    let wholesaler1;
    let billTo1;
    promise = BoFactory.loadListAsync(LO_MYOPERATIONTYPE,  {})
    .then (function(LoMyOperationType) {
        me.setLoMyOperationType(LoMyOperationType);
        return BoFactory.loadListAsync(LO_MYSPLITTYPE,  {});
    }).then(function (loMySplitType) {
        me.setLoMySplitType(loMySplitType);
        return BoFactory.loadObjectByParamsAsync(
        "LuCustomer",
        { pKey: myMainOrder['myWholesalerS1']}
        )
    }).then(function(wholesaler) {
        wholesaler1 = wholesaler;
        return BoFactory.loadObjectByParamsAsync(
        "LuCustomer",
        { pKey: myMainOrder['myBillTo1']}
        )
    }).then(function(billTo) {
        billTo1 = billTo;
        return BoFactory.loadObjectByParamsAsync(
        "LuCustomer",
        { pKey: myMainOrder['myShipTo1']}
        )
    }).then(function(shipTo1) {
        me.setLuMyDefaultWholesaler(myMainOrder.luMyDefaultWholesaler);
        me.setLuMyDefaultBillTo(myMainOrder.luMyDefaultBillTo);
        me.setLuMyDefaultShipTo(myMainOrder.luMyDefaultShipTo);
        // Initialize temporary splits' data from values in myMainOrder
        var splitIndex = 1;
        let allSplitTypes = me.getLoMySplitType().getAllItems();
        while (myMainOrder['myDDSplit'+splitIndex] &&
            myMainOrder['myDDSplit'+splitIndex] != Utils.getMinDate() && splitIndex <= myMainOrder.boOrderMeta.myNumberOfSplits ) {
                let deliveryDate = Utils.convertDate2Ansi(myMainOrder['myDDSplit'+splitIndex]);
                let splitType = myMainOrder['myType'+splitIndex];
                let splitTypeName = "";
                if (splitType) {
                    let currentSplitType = allSplitTypes.find ((liMySplitType) => (liMySplitType.pKey == splitType) );
                    if (currentSplitType) {
                        splitTypeName =  " - " + currentSplitType.name;
                    }
                }
                // Default to "0" if the dynamic property is undefined or falsy
                let myImDeliverySplit = myMainOrder['mySplit'+splitIndex+'ImDelivery'] || false
                // Check if loMyOrderSplits exists and the specified index is valid
                if (myMainOrder.loMyOrderSplits && myMainOrder.loMyOrderSplits.getAllItems()[splitIndex-1] !== undefined) {
                    // Update with the value from loMyOrderSplits if available
                    myImDeliverySplit = myMainOrder.loMyOrderSplits.getAllItems()[splitIndex-1]['myImDeliverySplit'];
                }
                let wholesalerPKey = myMainOrder['myWholesalerS'+splitIndex];
                let billToPKey = myMainOrder['myBillTo'+splitIndex];
                let luSoldTo = myMainOrder['luMySoldTo'+splitIndex];
                let soldTo =  myMainOrder['mySoldTo'+splitIndex];
                let deliverTo = myMainOrder['myDeliverTo'+splitIndex]
                let shipToPKey = myMainOrder['myShipTo'+splitIndex]
                let poNumber = myMainOrder['myPONumber'+splitIndex];
                let pKey = myMainOrder['mySplit'+splitIndex+'PKey'];
                let myPreSalesDelivery = myMainOrder['myPreSalesDelivery'+splitIndex];
                tempSplits.push({
                    index: splitIndex,
                    pKey: pKey,
                    myImDeliverySplit:myImDeliverySplit,
                    deliveryDate: deliveryDate,
                    splitType: splitType,
                    wholesalerPKey: wholesalerPKey,
                    wholesalerName: myMainOrder['luMyWholesaler'+splitIndex]['name'],
                    soldToName: myMainOrder['luMySoldTo'+splitIndex]['name'],
                    soldTo: soldTo,
                    deliverToPKey: deliverTo,
                    deliverToName: myMainOrder['luMyDeliverTo'+splitIndex]['name'],
                    shipToPKey: shipToPKey,
                    shipToName: myMainOrder['luMyShipTo'+splitIndex]['name'],
                    poNumber: poNumber,
                    myPreSalesDelivery:myPreSalesDelivery,
                    billToPKey: billToPKey,
                    billToName: myMainOrder['luMyBillTo'+splitIndex]['name'],
                    description:
                        'Split #'+splitIndex + ': ' +
                        deliveryDate + 
                        splitTypeName
                });
            splitIndex++;
        }
        me.loMyTempOrderSplits.addItems(tempSplits);
        
        //me.luMyPreferredWholesaler.pKey = preferredWholesaler.pKey;
        //me.luMyPreferredWholesaler.name = preferredWholesaler.name;
        // default operation: add split
        if(tempSplits.length > 0){
            me.operationType = "edit";
            me.splitIndex = 1;
            me.myChangeSplitData(1);
        }
        else{
            let myMainOrder = Framework.getProcessContext().myMainOrder
            me.operationType = "add";
            if(myMainOrder.myDefaultSplitType == 'Transfer'){
                me.setWholesalerPKey(myMainOrder.luMyDefaultTransferWholesaler.pKey);
                me.setWholesalerName(myMainOrder.luMyDefaultTransferWholesaler.name);

                me.setSoldtoPKey(myMainOrder.luMyDefaultTransferSoldTo.pKey);
                me.setSoldtoName(myMainOrder.luMyDefaultTransferSoldTo.name);
      
                me.setBillToPKey(myMainOrder.luMyDefaultTransferBillTo.pKey);
                me.setBillToName(myMainOrder.luMyDefaultTransferBillTo.name);
      
                me.setShipToPKey(myMainOrder.luMyDefaultTransferShipTo.pKey);
                me.setShipToName(myMainOrder.luMyDefaultTransferShipTo.name);
            }
            else{
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
            }
                
            if(myMainOrder.boOrderMeta.id === 'Cycle'){
                me.setMyImDeliverySplit(1);
            }

            me.splitType = myMainOrder.myDefaultSplitType;
            me.luMySplitType.pKey = myMainOrder.myDefaultSplitType;
        }

        // At creation time, check if we can create splits or not
        // If we can, set our preferred wholesales as wholesaler
        // Otherwise, initialise values from the initial split
        if (myMainOrder 
            && myMainOrder.boOrderMeta 
            && tempSplits.length >= myMainOrder.boOrderMeta.myNumberOfSplits) {
            // We can only edit
            me.operationType = "edit";
            me.splitIndex = 1;
            me.myChangeSplitData(1);
        } else {
            //me.setWholesalerPKey(preferredWholesaler.pKey);
            //me.setWholesalerName(preferredWholesaler.name);
        }



        let defaultDeliveryDate = Utils.createDateToday();
        defaultDeliveryDate.setDate(defaultDeliveryDate.getDate() + 2);
        if(!me.getDeliveryDate){
            me.setDeliveryDate(Utils.convertDate2Ansi(defaultDeliveryDate));
        }

        return me;
      });
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}