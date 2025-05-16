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
 * @function myCalculateSummaryBySplit
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @returns boMySplitSummaryPDF
 
 */
function myCalculateSummaryBySplit(){
    var me = this;
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
        let itemDetails = [];
        let discountedPrice;
        let loMySplitItemsPDF = BoFactory.instantiate("LoMySplitItemsPDF");
        let boMySplitSummaryPDF = BoFactory.instantiate("BoMySplitSummaryPDF");
        boMySplitSummaryPDF.setLoMySplitItemsPDF(loMySplitItemsPDF);
        for(let i=1; i<6; i++){
            if(Utils.isDefined(me['myDDSplit'+i]) && me['myDDSplit'+i] != "1700-01-01 00:00:00"){
                boMySplitSummaryPDF['showSplit'+i] = "1";
                boMySplitSummaryPDF['myDD'+i] = Utils.convertAnsiDate2Date(me['myDDSplit'+i]).toLocaleDateString();
            } else {
                boMySplitSummaryPDF['showSplit'+i] = "0";
            }
        }
        
        me.getLoItems().getAllItems().forEach(function(liOrderItem) { 
            discountedPrice = liOrderItem.simplePricingBasePrice - liOrderItem.simplePricingBasePrice * (liOrderItem.discount/100);
            let tv1 = liOrderItem.mySplit1Q * discountedPrice;
            let tv2 = liOrderItem.mySplit2Q * discountedPrice;
            let tv3 = liOrderItem.mySplit3Q * discountedPrice;
            let tv4 = liOrderItem.mySplit4Q * discountedPrice;
            let tv5 = liOrderItem.mySplit5Q * discountedPrice;
            let tv6 = liOrderItem.mySplit6Q * discountedPrice;
            itemDetails.push({
                "productCode": liOrderItem.prdId,
                "productName": liOrderItem.text1,
                "basePrice": liOrderItem.simplePricingBasePrice,
                "discount": liOrderItem.discount,
                "discountedPrice": discountedPrice,
                "q1": liOrderItem.mySplit1Q,
                "totalValue1": tv1,
                "q2": liOrderItem.mySplit2Q,
                "totalValue2": tv2,
                "q3": liOrderItem.mySplit3Q,
                "totalValue3": tv3,
                "q4": liOrderItem.mySplit4Q,
                "totalValue4": tv4,
                "q5": liOrderItem.mySplit5Q,
                "totalValue5": tv5,
                "q6": liOrderItem.mySplit6Q,
                "totalValue6": tv6,
                "vatPerc": liOrderItem.myVATPercentage,
                    //cgcloud__Value__c * (1+ cgcloud__Product__r.VATPercentage__c)
                "totalValueWithVat1": tv1 * (1 + (liOrderItem.myVATPercentage/100)) ,
                "totalValueWithVat2": tv2 * (1 + (liOrderItem.myVATPercentage/100)) ,
                "totalValueWithVat3": tv3 * (1 + (liOrderItem.myVATPercentage/100)) ,
                "totalValueWithVat4": tv4 * (1 + (liOrderItem.myVATPercentage/100)) ,
                "totalValueWithVat5": tv5 * (1 + (liOrderItem.myVATPercentage/100)) ,
                "totalValueWithVat6": tv6 * (1 + (liOrderItem.myVATPercentage/100)) 
            });
        });
        loMySplitItemsPDF.addItems(itemDetails);

        if(me.mySignatureBlob == " " && me.boOrderMeta.myOrderSignatureMandatory){
            var attachments = me.getLoOrderAttachment().getAllItems();
            if(attachments.length>0){
                attachments.forEach(function(attachment) {
                    if(attachment.fileType == "png"){
                        me.mySignatureBlob = attachment.mediapath;
                    }
                });
            }
        }
        
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    return boMySplitSummaryPDF;
}