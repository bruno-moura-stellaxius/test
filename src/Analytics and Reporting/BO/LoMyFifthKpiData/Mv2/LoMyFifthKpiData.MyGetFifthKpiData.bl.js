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
 * @function myGetFifthKpiData
 * @this LoMyFifthKpiData
 * @kind listobject
 * @async
 * @namespace CUSTOM
 * @param {DomPKey} user
 * @param {Date} currentDate
 * @returns promise
 */
function myGetFifthKpiData(user, currentDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
    if(!Utils.isDefined(currentDate)) {
        currentDate = Utils.createAnsiDateTimeToday();
    }
    var date = currentDate;
    var now = Utils.createDateByString(currentDate);
    var salesOrg = ApplicationContext.get('user').getSalesOrg();
    var endDate = Utils.createDateNow();
    endDate.setDate(endDate.getDate() + 7);
    var yesterday = new Date(Date.now() - 864e5);
    var salesOrg = ApplicationContext.get('user').getSalesOrg();

    var jsonQuery = {};
    var jsonParams = [];

    jsonParams.push({
    "field" : "salesOrg",
    "operator" : "EQ",
    "value" : salesOrg
    });
    jsonParams.push({
    "field" : "user",
    "operator" : "EQ",
    "value" : user
    });
    jsonParams.push({
    "field" : "date",
    "operator" : "EQ",
    "value" : date
    });
    jsonParams.push({
    "field" : "endDate",
    "operator" : "EQ",
    "value" : endDate
    });
    jsonParams.push({
    "field" : "yesterday",
    "operator" : "EQ",
    "value" : yesterday
    });

    jsonQuery.params = jsonParams;

    var promise = Facade.getListAsync("LoMyFifthKpiData", jsonQuery)
    .then(function(data) {
        if(salesOrg == "C172"){ // C172 - France - Average Basket per day (cycle)
            var second=1000, minute=second*60, hour=minute*60, day=hour*24;
            for (var i = 0; i < data.length; i++) {
                var periodStartDate =  Utils.convertAnsiDate2Date(Utils.unixepochToAnsiDate(data[i].periodStartDate));
                var numberOfDays = Math.round((yesterday - periodStartDate) / day);
                var avgDays = Math.round((numberOfDays / 7) * 5); 
                var itemValue = data[i] ? data[i].itemValue : 0;
                var avgBasketPerDay = (!isNaN(avgDays) && avgDays > 0) ? Math.round(itemValue / avgDays) : 0;
                data[i].value = avgBasketPerDay;
            }
            me.removeAllItems();
            me.addItems(data);
            return 0;
        } else{ //Other Countries - Planned Visit per day (Next 5 days)
            var visitCount = data[0] ? data[0].value : 0;
            var avgPlannedVisitsPerDay = Math.round(visitCount / 5);
            return avgPlannedVisitsPerDay; 
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}