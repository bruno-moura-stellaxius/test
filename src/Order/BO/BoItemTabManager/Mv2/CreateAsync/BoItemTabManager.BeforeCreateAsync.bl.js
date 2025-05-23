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
 * @function beforeCreateAsync
 * @this BoItemTabManager
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 */
function beforeCreateAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    if (me.beforeInitialize) {
  me.beforeInitialize.apply(me, [context]);
}

me.updateProperties(context.jsonQuery);

if (me.afterInitialize) {
  me.afterInitialize.apply(me, [context]);
}

// Create dictionary
me.setLoadedLevels(Utils.createDictionary());

// Initialize currently displayed hierarchy level    
var levels = me.getNumberOfLevels();
var values = [];

for (var i=0; i < levels; i++) {
  values.push("");
}

me.setLastDisplayedHierarchyLevel({"fieldName" : "id", "values" : values});

// Initialize current item filter id
me.setCurrentItemFilterId("All");

me.setResetCurrentItemFilterOnShowProducts("1");

// Initialize list objects that are empty at the beginning (no item selected)
var promise = BoFactory.createListAsync("LoPromotionsForProduct", {})
.then(
  function (loPromotionsForProduct) {
    me.setLoPromotionsForCurrentProduct(loPromotionsForProduct);
    return BoFactory.loadListAsync("LoMyOrderItemMetas", {})
    
  }).then(
    function (loMyOrderItemMetas) {
      me.setLoMyOrderItemMetas(loMyOrderItemMetas);
      return BoFactory.createListAsync("LoMyBOMProductParts", {})
    }).then(
    function(loMyBOMProductParts) { 
      me.setLoMyBOMProductParts(loMyBOMProductParts);
      if (me.getIsShowCategories() == "1") { 
        context.jsonQuery.params.push({ "field" : "criterionAttribute", "value" : me.getCriterionAttribute_Level1(), "operator" : "EQ" });        
        return BoFactory.loadListAsync(LO_BREADCRUMBLEVEL1, context.jsonQuery);
      } 
    }
  ).then(
  function (loBreadCrumbLevel1) {
    if (Utils.isDefined(loBreadCrumbLevel1)) {
      me.setLoBreadCrumbLevel1(loBreadCrumbLevel1);
      if (me['setObjectStatus'] ) {
        me.setObjectStatus(this.self.STATE_NEW);
      }
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