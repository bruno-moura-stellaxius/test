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
 * @function selectItemAfterAdd
 * @this BoItemTabManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {Object} addProductResult
 * @param {DomSdoBarcodeScanBehavior} barcodeScanBehavior
 * @param {String} mode
 * @returns resultForProcess
 */
function selectItemAfterAdd(addProductResult, barcodeScanBehavior, mode){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var bSelectLastCurrentItem = false;
var filterList = this.getBoOrder().getLoItemFilter();
var filterItems = filterList.getItemObjects();

var allItems = this.getBoOrder().getLoItems();

if (Utils.isDefined(addProductResult)) {
  var _addProductResult = addProductResult; //JSON.parse(JSON.stringify(addProductResult));

  if (Utils.isDefined(_addProductResult.selectPKey)) {
    // Reset item filter bar to first item filter (which is potentially the "All" filter, consistent 
    // behaviour between FlatList and Hierarchy) to be able to select the added item
    let index = filterItems.findIndex(filter => filter.filterCode === 'FreeGoods');
    index = index != -1 ? index : 0;
    if (filterItems.length > 0 ) {
      filterList.setCurrent(filterItems[index]);
    }

    var mainItem = allItems.getItemByPKey(_addProductResult.selectPKey);
    // Select added item
    allItems.setCurrent(mainItem);

    if ((mode === "addScannedProduct" && barcodeScanBehavior === "OnlySelect") || (mode === "addProduct" && addProductResult.filterCountIncrements.length !== 0))
    {
      if (mainItem.getACL().isEditable(AclObjectType.OBJECT, "LiOrderItem"))
      {
        allItems.setFocus(mainItem, "quantity");
      }
    }
    
    this.setCurrentSelectedOrderItem(mainItem);

    // Simulate changed event
    //this.simulateItemChangedEvent(addProductResult.selectPKey);
  } else {
    bSelectLastCurrentItem = true;
  }
} else {
  bSelectLastCurrentItem = true;
}

if (bSelectLastCurrentItem === true) {
  // Reset item filter bar to first item filter (which is potentially the "All" filter, consistent 
  // behaviour between FlatList and Hierarchy) to be able to select the added item

  if (filterItems.length > 0) {
    filterList.setCurrent(filterItems[0]);
  }

  var mainItem = this.getCurrentSelectedOrderItem();
  mainItem = !Utils.isDefined(mainItem) && allItems.length > 0 ? allItems.getFirstItem() : mainItem; 
  if (Utils.isDefined(mainItem)) 
  {
    allItems.setCurrent(mainItem);
    //* UoM REWORK NEEDED *//
	if ((mode === "addScannedProduct") && (barcodeScanBehavior === "OnlySelect") && mainItem.getACL().isEditable(AclObjectType.OBJECT, "LiOrderItem") || (mode === "addProduct" && addProductResult.filterCountIncrements.length !== 0))
    {
      allItems.setFocus(mainItem, "quantity");              
    }
    this.setCurrentSelectedOrderItem(mainItem);
  }
}
// Return value to reset process variable
var resultForProcess;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return resultForProcess;
}