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
 * @function myManipulateNavigationPanel
 * @this BoOrder
 * @kind businessobject
 * @namespace CORE
 * @param {String} stage
 * 
 */
function myManipulateNavigationPanel(stage){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var promise = when.resolve(me);
    const itemList = {
      "id":"ItemList",
      "image":"ShoppingCartItem",
      "label":"orderItems",
      "defaultLabel":"Items","process":"Order::ItemListTabProcess",
      "action":"setCurrentTabName_itemList",
      "imageType":".svg","__hostName":"startSfNavigation",
      "__hostProcess":"Order::PreOrderNavigationProcess"
    }
    const brandSummary = {
      "id":"MyBrandSummary",
      "image":"Survey_LM",
      "label":"MyBrandSummary",
      "defaultLabel":"Brands Preview",
      "process":"Order::MyBrandSummaryTabProcess",
      "action":"setCurrentTabName_myBrandSummary",
      "imageType":".svg","__hostName":"startSfNavigation",
      "__hostProcess":"Order::PreOrderNavigationProcess"
    }
    const splitSummary = {
      "id":"MySplitSummary",
      "image":"Survey_LM",
      "label":"MySplitSummary",
      "defaultLabel":"Splits Preview",
      "process":"Order::MySoldToSummaryTabProcess",
      "action":"setCurrentTabName_mySplitSummary",
      "imageType":".svg","__hostName":"startSfNavigation",
      "__hostProcess":"Order::PreOrderNavigationProcess"
    }
    const header = {
      "id":"Header",
      "image":"Info",
      "label":"orderHeader",
      "defaultLabel":"Header",
      "process":"Order::HeaderTabProcess",
      "action":"workflow_Load_Decision",
      "imageType":".svg","__hostName":"startSfNavigation",
      "__hostProcess":"Order::PreOrderNavigationProcess"
    }
    const expiredList = {
      "id":"ExpiredItemList",
      "image":"ShoppingCartItem",
      "label":"Expired Items",
      "defaultLabel":"Expired Items",
      "process":"Order::MyExpiredItemListTabProcess",
      "action":"setCurrentTabName_expireditemList",
      "imageType":".svg","__hostName":"myStartSfCreditNoteExchangeNavigation",
      "__hostProcess":"Order::PreOrderNavigationProcess"
    }

    var navigationPanel = []
   
    if(stage == 'Exchange'){
      navigationPanel = [expiredList, header]
    }
    else{
      navigationPanel = [itemList, brandSummary, splitSummary, header]
    }

    Framework.getProcessContext().__navigationPanel = navigationPanel

    return promise;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

}
