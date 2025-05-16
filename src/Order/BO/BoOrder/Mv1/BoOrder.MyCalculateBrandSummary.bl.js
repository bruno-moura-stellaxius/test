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
 * @function myCalculateBrandSummary
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 
 */
function myCalculateBrandSummary() {
    var me = this;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    var currencySymbolMap = {
        "USD": "$",
        "EUR": "€"
    };
    var orderItems = me.getLoItems().getAllItems();
    let allBrandsName = 'All';
    let allBrandsTotalQuantities = 0;
    let allBrandsTotalBasePrices = 0;
    let allBrandsTotalPrices = 0;
    let allBrandsTotalFreeGoods = 0;
    let allBrandsDistinctSKUs = 0;
    let allBrandsAverageDiscounts = 0;
    let allBrandsAverageDiscountValues = 0;
    let allBrandsMyCurrencySimbol = '';
    // Filter items and group by 'groupText'
    let summary = orderItems.reduce((acc, item) => {
        if (item.myTotalQuantity > 0 && item.myIsBOMPart === '0') {
            const existingBrand = acc.find(brand => brand.brand === item.groupText);
            let totalFreeGoods = item.type.includes('Free Good') ? parseFloat(item.value) : 0;
            let myCurrencySymbol = me.currency in currencySymbolMap ? currencySymbolMap[me.currency] : me.currency;
            let totalBasePrice = parseFloat(item.basePrice * item.myTotalQuantity);
            let discountValue = parseFloat(totalBasePrice * (item.discount / 100));
            // If group already exists, aggregate the values
            if (existingBrand) {
                existingBrand.totalQuantity += parseFloat(item.myTotalQuantity);
                existingBrand.totalBasePrice += totalBasePrice;
                allBrandsTotalBasePrices += totalBasePrice;
                existingBrand.averageDiscount += discountValue;
                existingBrand.averageDiscount = (existingBrand.averageDiscount / allBrandsTotalBasePrices) * 100;
                existingBrand.averageDiscountValue += discountValue;
                existingBrand.totalPrice += parseFloat(item.value);
                existingBrand.totalFreeGoods += totalFreeGoods;
                existingBrand.distinctSKU += 1;
                existingBrand.myCurrencySymbol = myCurrencySymbol;
            } else {
                // Create new group summary
                acc.push({
                    'brand': item.groupText,
                    'totalQuantity': parseFloat(item.myTotalQuantity),
                    'totalBasePrice': parseFloat(item.basePrice * item.myTotalQuantity),
                    'averageDiscount': (discountValue / totalBasePrice) * 100,
                    'averageDiscountValue': discountValue,
                    'totalPrice': parseFloat(item.value),
                    'totalFreeGoods': totalFreeGoods,
                    'distinctSKU': 1,
                    'myCurrencySymbol': myCurrencySymbol
                });
            }
        }
        return acc;
    }, []);

    summary.forEach(item => {
        //FIX THE DISCOUNT PERCENTAGE - PCSCI-1791
        item.averageDiscount = parseFloat(((item.totalBasePrice-item.totalPrice)/item.totalBasePrice)*100);

        allBrandsTotalQuantities += item.totalQuantity;
        allBrandsTotalPrices += item.totalPrice;
        allBrandsTotalFreeGoods += item.totalFreeGoods;
        allBrandsDistinctSKUs += item.distinctSKU;
        allBrandsAverageDiscounts += (item.averageDiscount / 100) * item.averageDiscountValue;
        allBrandsAverageDiscountValues += item.averageDiscountValue;
        allBrandsMyCurrencySimbol = me.currency in currencySymbolMap ? currencySymbolMap[me.currency] : me.currency;
    });
    me.loMyBrandSummary.removeAllItems();
    // Convert the object back to an array if needed
    let summaryList = Object.values(summary);
    if (summaryList.length > 0) {
        summaryList.push({
            'brand': allBrandsName,
            'totalQuantity': allBrandsTotalQuantities,
            'totalBasePrice': allBrandsTotalBasePrices,
            'totalPrice': allBrandsTotalPrices,
            'totalFreeGoods': allBrandsTotalFreeGoods,
            'distinctSKU': allBrandsDistinctSKUs,
            'averageDiscount': (allBrandsAverageDiscounts / allBrandsAverageDiscountValues) * 100 || 0,
            'averageDiscountValue': allBrandsAverageDiscountValues,
            'myCurrencySymbol': allBrandsMyCurrencySimbol
        });
    }
    me.loMyBrandSummary.addItems(summaryList);
    return me;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

}