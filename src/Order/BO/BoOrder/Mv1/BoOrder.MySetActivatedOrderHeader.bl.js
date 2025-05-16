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
 * @function mySetActivatedOrderHeader
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CUSTOM
 * @returns promise
 */
function mySetActivatedOrderHeader(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    var promise = when.resolve();

    var myActivatedOrderHeader = {};

    let date = new Date(me.commitDate); // Create a Date object
    let orderIdentifier = '     ' + me.myOrderName+ ' - ';
    if (!Utils.isEmptyString(me.mySplitType) ) {
        orderIdentifier += me.myImDeliverySplit ? 'PreSales - ' : '';
        date = new Date(me.deliveryDate);
        myActivatedOrderHeader.mySplitInfo = me.mySplitType;
        if ('Transfer'==me.mySplitType) {
            // wholesaler = brokerCustomer (Wholesaler__c field)
            myActivatedOrderHeader.mySplitInfo += ' ( '+me.luBrokerCustomer.name+' )';
        }
        myActivatedOrderHeader.myPoNumber = me.myPoNumber ? me.myPoNumber : 'N/A';
    } else {
        orderIdentifier += me.boOrderMeta.id + ' - ';
    }
    // Format the date to 'DD/MM/YYYY'
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    orderIdentifier += formattedDate;
    myActivatedOrderHeader.myOrderIdentifier = orderIdentifier;

    var orderAcl = me.getACL();
    if(me.boOrderMeta){
        if(me.boOrderMeta.id == 'Exchange'){ //EXCHANGE
            if(me.myExchangeType == 'Credit Note'){
                myActivatedOrderHeader.myOrderIdentifier = '     Exchange - '+ formattedDate+', Main: '+ me.myOrderName;
                orderAcl.removeRight(AclObjectType.PROPERTY, "mySplitType", AclPermission.VISIBLE);
                orderAcl.removeRight(AclObjectType.PROPERTY, "myPONumber", AclPermission.VISIBLE);
            }else{
                myActivatedOrderHeader.myOrderIdentifier = '     Split for Exchange: '+ me.mySplitForExchangeName +' - '+ me.boOrderMeta.id +' - '+ formattedDate+', Main: '+ me.myOrderName;
                orderAcl.removeRight(AclObjectType.PROPERTY, "mySplitType", AclPermission.VISIBLE);
                orderAcl.removeRight(AclObjectType.PROPERTY, "myPONumber", AclPermission.VISIBLE);
            }
        }else if(me.boOrderMeta.id == 'Cycle' || me.boOrderMeta.id == 'PreSales'){
            myActivatedOrderHeader.myOrderIdentifier = '     Split: '+ me.myOrderName +' - '+ me.boOrderMeta.id +' - '+ formattedDate+', Main: '+ me.myMainOrderName +', SAP: '+ me.mySapOrderId;
            me.setMySplitType(me.mySplitType);
            if ('Transfer'==me.mySplitType) {
                me.setMySplitType(me.mySplitType +' ( '+me.myWholesalerNameX+' )');
            }
            if(!me.myPONumber || me.myPONumber==' '){
                me.setMyPONumber(" - ");
            }else{
                me.setMyPONumber(me.myPONumber);
            }
        }
    }

    me.setMyActivatedOrderHeader(myActivatedOrderHeader);

    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
    
}