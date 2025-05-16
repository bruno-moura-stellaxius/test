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
 * @function mySaveDataInMainOrder
 * @this BoMyWizardOrderSplits
 * @kind businessobject
 * @namespace CUSTOM
 */
function mySaveDataInMainOrder(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    let myMainOrder = Framework.getProcessContext().myMainOrder;
    let activeIndex = 1;
    let saveData = true;
    if (me.operationType == "add") {
        // TODO: check again max in order template?
        while (Utils.isDefined(myMainOrder['myDDSplit'+activeIndex]) && 
            myMainOrder['myDDSplit'+activeIndex] != Utils.getMinDate() ) {
                activeIndex++;
            }
        if (activeIndex > myMainOrder.boOrderMeta.myNumberOfSplits) {
            saveData = false;
        }

    } else {
        activeIndex = me.splitIndex;
    }
    if (saveData) {
            let newDeliveryDate;
            myMainOrder['myDDSplit'+activeIndex] = Utils.convertAnsiDate2Date(me.deliveryDate);
            myMainOrder['myPreSalesDelivery'+activeIndex] = me.myPreSalesDelivery;
            myMainOrder['myWholesalerS'+activeIndex] = me.wholesalerPKey;
            myMainOrder['mySoldTo'+activeIndex] = me.soldtoPKey;
            myMainOrder['myDeliverTo'+activeIndex] = me.deliverToPKey;
            myMainOrder['myShipTo'+activeIndex] = me.shipToPKey;
            myMainOrder['myType'+activeIndex] = me.luMySplitType.pKey;
            myMainOrder['myIsOrderChanged'] = true;
            myMainOrder['myPONumber'+activeIndex] = me.poNumber;
            myMainOrder['myBillTo'+activeIndex] = me.billToPKey;
            myMainOrder['mySplit'+activeIndex+'ImDelivery'] = me.myImDeliverySplit;
            myMainOrder['mySplit'+activeIndex+'PKey'] = me.pKey;
            const propName = `myDDSplit${activeIndex}`;
            const setterName = `setMySplit${activeIndex}DD`;
            const setterNameAnsi = `setMySplit${activeIndex}DDAnsi`;
            myMainOrder.getLoItems().getAllItems().forEach(function(liOrderItem) {
                
                for (let j = 1; j <= 6; j++) {
                    //Condition to disable edit if assortment for split type
                    if( 
                        ( Utils.isDefined(liOrderItem.myAssortmentOrderType) && 
                          liOrderItem.myAssortmentOrderType.includes( myMainOrder["myType"+j] ) 
                        )
                        || 
                        ( Utils.isDefined(liOrderItem.myAssortmentSoldTo) &&
                          liOrderItem.myAssortmentSoldTo.includes( myMainOrder["myType"+j] ) &&
                          liOrderItem.myAssortmentSoldTo.includes( myMainOrder["mySoldTo"+j]) 
                        )
                    ){
                        const qtyPropertyName = `mySplit${j}Q`;
                        const qtySetterName = `setMySplit${j}Q`;
                        let oldValue = liOrderItem[qtyPropertyName];
                        liOrderItem[qtySetterName](0);
                        let tempBuffEvent = {
                            listObjectName: 'loItems', 
                            listItem: liOrderItem, 
                            modified: [qtyPropertyName],
                            oldValues: {
                                qtyPropertyName : oldValue
                            },
                            newValues: {
                                qtyPropertyName : 0
                            }  
                        }
                        var promise = myMainOrder.onOrderItemChanged(tempBuffEvent);
                    }
                }

                newDeliveryDate = new Date(myMainOrder[propName]);
                if(!Utils.isEmptyString(me.soldtoPKey)){
                    if(!Utils.isEmptyString(me.wholesalerPKey)){
                        liOrderItem[setterName](newDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) + '^');
                    } else {
                        liOrderItem[setterName](newDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) + '*');
                    }
                } else if(Utils.isEmptyString(me.soldtoPKey)){
                    if(!Utils.isEmptyString(me.wholesalerPKey)){
                        liOrderItem[setterName](newDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}) + '#');
                    } else {
                        liOrderItem[setterName](newDeliveryDate.toLocaleDateString('en-in',{day:'2-digit',month:'2-digit'}));
                    }
                }
                liOrderItem[setterNameAnsi](Utils.convertDate2Ansi(newDeliveryDate));
            });
        }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}