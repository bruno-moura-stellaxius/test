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
 * @function setEARights
 * @this BoWizardCreateNewWithCustomer
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 */
function setEARights(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    

    // Hide template selection if no customer is selected
    if (Utils.isEmptyString(this.getLuOrderer().getPKey()) ) {
        this.getLuOrderMeta().getACL().removeRight(AclObjectType.PROPERTY, "text", AclPermission.VISIBLE);
        this.getLuMyPricingTerm().getACL().removeRight(AclObjectType.PROPERTY, "text", AclPermission.VISIBLE);
        this.getLuMyExchangeType().getACL().removeRight(AclObjectType.PROPERTY, "pKey", AclPermission.VISIBLE);
        this.getLuMySplitForExchange().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
        this.getACL().removeRight(AclObjectType.PROPERTY, "myByPassAgreements", AclPermission.VISIBLE);
        //this.getLuMyPricingTerm().getACL().removeRight(AclObjectType.PROPERTY, "byPassAgreements", AclPermission.VISIBLE);
        this.getACL().removeRight(AclObjectType.PROPERTY, "luMyDefaultDirectBillTo", AclPermission.VISIBLE);
        this.getACL().removeRight(AclObjectType.PROPERTY, "luMyDefaultDirectDeliverTo", AclPermission.VISIBLE);
        this.getACL().removeRight(AclObjectType.PROPERTY, "luMyDefaultDirectShipTo", AclPermission.VISIBLE);
        this.getACL().removeRight(AclObjectType.PROPERTY, "luMyDefaultDirectSoldTo", AclPermission.VISIBLE);
        this.getACL().removeRight(AclObjectType.PROPERTY, "luMyDefaultTransferBillTo", AclPermission.VISIBLE);
        this.getACL().removeRight(AclObjectType.PROPERTY, "luMyDefaultTransferShipTo", AclPermission.VISIBLE);
        this.getACL().removeRight(AclObjectType.PROPERTY, "luMyDefaultTransferSoldTo", AclPermission.VISIBLE);
        this.getACL().removeRight(AclObjectType.PROPERTY, "luMyDefaultTransferWholesaler", AclPermission.VISIBLE);
        this.getACL().removeRight(AclObjectType.PROPERTY, "loMySplitType", AclPermission.VISIBLE);
        this.getACL().removeRight(AclObjectType.PROPERTY, "myDefaultSplitType", AclPermission.VISIBLE);
    } else {
        this.getLuOrderMeta().getACL().addRight(AclObjectType.PROPERTY, "text", AclPermission.VISIBLE);

        this.getACL().addRight(AclObjectType.PROPERTY, "luMyDefaultDirectBillTo", AclPermission.VISIBLE);
        this.getACL().addRight(AclObjectType.PROPERTY, "luMyDefaultDirectShipTo", AclPermission.VISIBLE);
        this.getACL().addRight(AclObjectType.PROPERTY, "luMyDefaultDirectSoldTo", AclPermission.VISIBLE);
        this.getACL().addRight(AclObjectType.PROPERTY, "luMyDefaultTransferBillTo", AclPermission.VISIBLE);
        this.getACL().addRight(AclObjectType.PROPERTY, "luMyDefaultTransferShipTo", AclPermission.VISIBLE);
        this.getACL().addRight(AclObjectType.PROPERTY, "luMyDefaultTransferSoldTo", AclPermission.VISIBLE);
        this.getACL().addRight(AclObjectType.PROPERTY, "luMyDefaultTransferWholesaler", AclPermission.VISIBLE);
        this.getACL().addRight(AclObjectType.PROPERTY, "loMySplitType", AclPermission.VISIBLE);
        this.getACL().addRight(AclObjectType.PROPERTY, "myDefaultSplitType", AclPermission.VISIBLE);

        if(this.getLuOrderer().getMySalesOrg() == 'C088'){
            this.getACL().addRight(AclObjectType.PROPERTY, "luMyDefaultDirectDeliverTo", AclPermission.VISIBLE);
        }
    }
    if(Utils.isEmptyString(this.getLuMyDefaultTransferWholesaler().getPKey())){
        this.getACL().removeRight(AclObjectType.PROPERTY, "luMyDefaultTransferBillTo", AclPermission.EDIT);
    }
    else{
        this.getACL().addRight(AclObjectType.PROPERTY, "luMyDefaultTransferBillTo", AclPermission.EDIT);
    }
    
    if(Utils.isEmptyString(this.getLuMyDefaultDirectBillTo().getPKey())){
        this.getACL().removeRight(AclObjectType.PROPERTY, "luMyDefaultDirectShipTo", AclPermission.EDIT);
    }
    else{
        this.getACL().addRight(AclObjectType.PROPERTY, "luMyDefaultDirectShipTo", AclPermission.EDIT);
    }
    if( this.getLuOrderMeta().name == 'PreSales'){
        this.getLuMyPricingTerm().getACL().addRight(AclObjectType.PROPERTY, "text", AclPermission.VISIBLE);
        this.myOrderMetaDeliveryDate='';
        this.getLuMyExchangeType().pKey = '';
        this.getACL().removeRight(AclObjectType.PROPERTY, "myOrderMetaDeliveryDate", AclPermission.VISIBLE);
        this.getLuMyExchangeType().getACL().removeRight(AclObjectType.PROPERTY, "pKey", AclPermission.VISIBLE);
        this.getLuMySplitForExchange().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
        this.getLuMySplitForExchange().pKey = '';
        if(!Utils.isEmptyString(this.getLuMyPricingTerm().text)){
            this.getACL().addRight(AclObjectType.PROPERTY, "myByPassAgreements", AclPermission.VISIBLE);
            //this.getLuMyPricingTerm().getACL().addRight(AclObjectType.PROPERTY, "byPassAgreements", AclPermission.VISIBLE);
        }
    }else if(this.getLuOrderMeta().name == 'Exchange'){
        this.getLuMyExchangeType().getACL().addRight(AclObjectType.PROPERTY, "pKey", AclPermission.VISIBLE);
        this.getACL().removeRight(AclObjectType.PROPERTY, "myOrderMetaDeliveryDate", AclPermission.VISIBLE);
        this.getLuMyPricingTerm().getACL().removeRight(AclObjectType.PROPERTY, "text", AclPermission.VISIBLE);
        this.getLuMySplitForExchange().getACL().addRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
        if(this.getLuMyExchangeType().getPKey() == 'Credit Note'){
            this.getLuMySplitForExchange().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
            this.getLuMySplitForExchange().pKey = '';
        }
    }else{
        this.getACL().removeRight(AclObjectType.PROPERTY, "myOrderMetaDeliveryDate", AclPermission.VISIBLE);
        this.getLuMyPricingTerm().getACL().removeRight(AclObjectType.PROPERTY, "text", AclPermission.VISIBLE);
        this.getLuMyExchangeType().getACL().removeRight(AclObjectType.PROPERTY, "pKey", AclPermission.VISIBLE);
        this.getLuMyExchangeType().pKey = '';
        this.getLuMySplitForExchange().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.VISIBLE);
        this.getLuMySplitForExchange().pKey = '';
        this.getACL().removeRight(AclObjectType.PROPERTY, "myByPassAgreements", AclPermission.VISIBLE);
        //this.getLuMyPricingTerm().getACL().removeRight(AclObjectType.PROPERTY, "byPassAgreements", AclPermission.VISIBLE);
    }

    if(Utils.isDefined(me.visitPKey) && me.visitPKey) {
        me.getLuOrderer().getACL().removeRight(AclObjectType.PROPERTY, "name", AclPermission.EDIT);
        if(this.getLuOrderer().getMySalesOrg() == 'C088'){
            this.getACL().addRight(AclObjectType.PROPERTY, "luMyDefaultDirectDeliverTo", AclPermission.VISIBLE);
        }
        else{
            this.getACL().removeRight(AclObjectType.PROPERTY, "luMyDefaultDirectDeliverTo", AclPermission.VISIBLE);
        }
    }
    if(Utils.isDefined(me.ordererPKey) && me.ordererPKey) {
        if((this.getLuOrderMeta().name == 'PreSales' || this.getLuOrderMeta().name == 'Cycle') && this.getLuOrderer().getMySalesOrg() == 'C155'){
            me.getLuOrderer().getACL().addRight(AclObjectType.PROPERTY, "myTenderIdentificationCode", AclPermission.VISIBLE);
            if(!Utils.isEmptyString(me.luOrderer.myTenderIdentificationCode)){
                me.getLuOrderer().getACL().removeRight(AclObjectType.PROPERTY, "myTenderIdentificationCode", AclPermission.EDIT);
            }
        }
        else{
            this.getLuOrderer().getACL().removeRight(AclObjectType.PROPERTY, "myTenderIdentificationCode", AclPermission.VISIBLE);
        }  
    }
   
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}