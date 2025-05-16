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
 * @function mySetSplitStrings
 * @this BoOrder
 * @kind businessobject
 * @namespace CUSTOM
 * @returns isEnabled
 */
function mySetSplitStrings(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    for (var splitIndex = 1; splitIndex <= 6; splitIndex++) {
        if (Utils.isDefined(me['myDDSplit'+splitIndex]) && splitIndex <= 6) {
          if(Utils.isEmptyString(me['myPaymentTerm'+splitIndex])){
            me['myPaymentTerm'+splitIndex] = Utils.getToggleText("DomMyPaymentTerms", me.luOrderer.myPaymentTerms);
          }
        }
    }
    
    const splitStr1 = "Type - " + me.boOrderMeta.id + " - " + me.myType1 + (Utils.isDefined(me.luMySoldTo1.name) ?  "\n" + "Sold-To - " +  me.luMySoldTo1.name : '') + (Utils.isDefined(me.luMyWholesaler1.name) ? "\n" + "Wholesaler - " + me.luMyWholesaler1.name : '')
    + (Utils.isDefined(me.myPaymentTerm1) ? "\n" + "PT - " + me.myPaymentTerm1 : '');
    const splitStr2 = "Type - " + me.boOrderMeta.id + " - " + me.myType2 + (Utils.isDefined(me.luMySoldTo2.name) ?  "\n" + "Sold-To - " +  me.luMySoldTo2.name : '') + (Utils.isDefined(me.luMyWholesaler2.name) ? "\n" + "Wholesaler - " + me.luMyWholesaler2.name : '')
    + (Utils.isDefined(me.myPaymentTerm2) ? "\n" + "PT - " + me.myPaymentTerm2 : '');
    const splitStr3 = "Type - " + me.boOrderMeta.id + " - " + me.myType3 + (Utils.isDefined(me.luMySoldTo3.name) ?  "\n" + "Sold-To - " +  me.luMySoldTo3.name : '') + (Utils.isDefined(me.luMyWholesaler3.name) ? "\n" + "Wholesaler - " + me.luMyWholesaler3.name : '')
    + (Utils.isDefined(me.myPaymentTerm3) ? "\n" + "PT - " + me.myPaymentTerm3 : '');
    const splitStr4 = "Type - " + me.boOrderMeta.id + " - " + me.myType4 + (Utils.isDefined(me.luMySoldTo4.name) ?  "\n" + "Sold-To - " +  me.luMySoldTo4.name : '') + (Utils.isDefined(me.luMyWholesaler4.name) ? "\n" + "Wholesaler - " + me.luMyWholesaler4.name : '')
    + (Utils.isDefined(me.myPaymentTerm4) ? "\n" + "PT - " + me.myPaymentTerm4 : '');
    const splitStr5 = "Type - " + me.boOrderMeta.id + " - " + me.myType5 + (Utils.isDefined(me.luMySoldTo5.name) ?  "\n" + "Sold-To - " +  me.luMySoldTo5.name : '') + (Utils.isDefined(me.luMyWholesaler5.name) ? "\n" + "Wholesaler - " + me.luMyWholesaler5.name : '')
    + (Utils.isDefined(me.myPaymentTerm5) ? "\n" + "PT - " + me.myPaymentTerm5 : '');
    const splitStr6 = "Type - " + me.boOrderMeta.id + " - " + me.myType6 + (Utils.isDefined(me.luMySoldTo6.name) ?  "\n" + "Sold-To - " +  me.luMySoldTo6.name : '') + (Utils.isDefined(me.luMyWholesaler6.name) ? "\n" + "Wholesaler - " + me.luMyWholesaler6.name : '')
    + (Utils.isDefined(me.myPaymentTerm6) ? "\n" + "PT - " + me.myPaymentTerm6 : '');

    me.setMySplitStr1(splitStr1);
    me.setMySplitStr2(splitStr2);
    me.setMySplitStr3(splitStr3);
    me.setMySplitStr4(splitStr4);
    me.setMySplitStr5(splitStr5);
    me.setMySplitStr6(splitStr6);




    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return isEnabled;
}