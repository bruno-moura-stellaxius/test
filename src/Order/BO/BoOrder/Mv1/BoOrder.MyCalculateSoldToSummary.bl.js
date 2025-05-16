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
 * @function myCalculateSoldToSummary
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 
 */
function myCalculateSoldToSummary() {
    var me = this;
 
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var soldtoSummaries = {};
    var orderItems = me.getLoItems().getAllItems();
    let currentPContext = Framework.getProcessContext();
    let wholesalerList = currentPContext.myWholesalerList.getAllItems();
    let soldtoList = currentPContext.mySoldToList.getAllItems();
    let shipToList = currentPContext.myShipToList.getAllItems();

    for (let i = 1; i <= 6; i++) {
        if (me[`myDDSplit${i}`] && me[`myDDSplit${i}`] !== Utils.getMinDate()) {
            let mySoldTo = me[`mySoldTo${i}`];
            if (!mySoldTo || mySoldTo == ' ') {
                mySoldTo = me.luOrderer.pKey;
            }
        }
    }
    // Loop through mySoldTo1 to mySoldTo6
    for (let i = 1; i <= 6; i++) {
        if (me[`myDDSplit${i}`] && me[`myDDSplit${i}`] !== Utils.getMinDate()) {
            let mySoldTo = me[`mySoldTo${i}`];
            let mySoldToName = soldtoList.find(soldto => soldto.relatedAccountPKey == me[`mySoldTo${i}`])?.name || "";
            let wholesaler = wholesalerList.find(wholesaler => wholesaler.relatedAccountPKey == me[`myWholesalerS${i}`])?.name || "";
            let myShipToName = shipToList.find(shipTo => shipTo.relatedAccountPKey == me[`myShipTo${i}`])?.name || "";
            let discountAmount = 0;
            let myTotalPrice = 0;
            let myTotalQuantity = 0;
            if (!mySoldTo || mySoldTo == ' ') {
                mySoldTo = me.luOrderer.pKey;
                mySoldToName = me.luOrderer.name;
            }
            orderItems.forEach(function (liOrderItem) {
                if (liOrderItem['mySplit' + i + 'Q'] > 0 && liOrderItem['myIsBOMPart'] === '0') {
                    myTotalQuantity += liOrderItem[`mySplit${i}Q`] || 0;
                    orderPrice = liOrderItem.basePrice * liOrderItem['mySplit' + i + 'Q'];
                    discountAmount += (orderPrice * (liOrderItem.discount / 100));
                    itemDiscount = (orderPrice * (liOrderItem.discount / 100));
                    value = (orderPrice - itemDiscount);
                    myTotalPrice += value;
                }
            });
            let deliveryDate = new Date((me[`myDDSplit${i}`]));
            let day = String(deliveryDate.getDate()).length === 1 ? '0' + String(deliveryDate.getDate()) : String(deliveryDate.getDate());
            let month = String(deliveryDate.getMonth() + 1).length === 1 ? '0' + String(deliveryDate.getMonth() + 1) : String(deliveryDate.getMonth() + 1);
            let year = String(deliveryDate.getFullYear());
            let formattedDeliveryDate = day + '/' + month + '/' + year;

            let soldtoSummary = {
                "soldTo": mySoldTo,
                "soldToName": mySoldToName,
                "deliveryDate": formattedDeliveryDate,
                "totalQuantity": myTotalQuantity,
                "myDiscountValue": discountAmount.toFixed(2),
                "totalPrice": myTotalPrice.toFixed(2),
                "type": me[`myType${i}`],
                "wholesaler": wholesaler,
                "myCurrencySymbol": me.myCurrencySymbol,
                "myMainOrderName": me.myOrderName,
                "shipToName": myShipToName,
                "mySplitOrderName": me.loMyOrderSplits && me.loMyOrderSplits.getAllItems()[i - 1] ? me.loMyOrderSplits.getAllItems()[i - 1].mySplitOrderName : ' ',
                "poNumber": me[`myPONumber${i}`]
            }
            if (!soldtoSummaries[mySoldTo]) {
                // If not, initialize it with the first split info
                soldtoSummaries[mySoldTo] = [soldtoSummary];
            } else {
                // If it exists, push a new split info object
                soldtoSummaries[mySoldTo].push(soldtoSummary);
            }
        }
    }
    // Convert Set to array if needed
    me.loMySoldTo1Summary.removeAllItems();
    me.loMySoldTo2Summary.removeAllItems();
    me.loMySoldTo3Summary.removeAllItems();
    me.loMySoldTo4Summary.removeAllItems();
    me.loMySoldTo5Summary.removeAllItems();
    me.loMySoldTo6Summary.removeAllItems();
    let index = 1;
    Object.keys(soldtoSummaries).forEach(key => {
        let mySoldToName = soldtoList.find(soldto => soldto.relatedAccountPKey == me[`mySoldTo${index}`])?.name || "";
        let totalQuantity = 0;
        let myTotalDiscountValue = 0;
        let totalPrice = 0;

        soldtoSummaries[key].forEach(item => {
            totalQuantity += parseFloat(item.totalQuantity);
            myTotalDiscountValue += parseFloat(item.myDiscountValue);
            totalPrice += parseFloat(item.totalPrice);
        });

        soldtoSummaries[key].push({
            "soldTo": me[`mySoldTo${index}`],
            "soldToName": mySoldToName,
            "deliveryDate": 'All',
            "totalQuantity": totalQuantity,
            "myDiscountValue": myTotalDiscountValue,
            "totalPrice": totalPrice,
            "type": '-',
            "wholesaler": '-',
            "myCurrencySymbol": me.myCurrencySymbol,
            "myMainOrderName": me.myOrderName,
            "mySplitOrderName": '-',
            "poNumber": '-'
        });
        me['loMySoldTo' + index + 'Summary'].addItems(soldtoSummaries[key]);
        me['loMySoldTo' + index + 'Summary'].setVisible("true");
        me['loMySoldTo' + index + 'Summary'].setCurrent(soldtoSummaries[key][0]);
        currentPContext['mySoldTo' + index + 'SummaryVisibility'] = true;
        index++;
    });
    for (; index <= 6; index++) {
        me['loMySoldTo' + index + 'Summary'].setVisible("false");
        currentPContext['mySoldTo' + index + 'SummaryVisibility'] = false;
    }
    return me;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

}