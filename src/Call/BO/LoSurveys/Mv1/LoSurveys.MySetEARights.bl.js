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
 * @function mySetEARights
 * @this LoSurveys
 * @kind listobject
 * @namespace CORE
 * @param {DomBool} isReadOnly
 */
function mySetEARights(isReadOnly){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var aclRights;

if(isReadOnly){
  //For read only calls, adding edit rights to camera button
  aclRights = me.getACL();
  aclRights.addRight(AclObjectType.OBJECT, "LoSurveys", AclPermission.EDIT);
  aclRights.removeRight(AclObjectType.PROPERTY, "done", AclPermission.EDIT);
  aclRights.removeRight(AclObjectType.PROPERTY, "value", AclPermission.EDIT);
  aclRights.removeRight(AclObjectType.PROPERTY, "surveyText", AclPermission.EDIT);
  aclRights.removeRight(AclObjectType.PROPERTY, "mandatoryImageId", AclPermission.EDIT);

  me.getItems().forEach(function(survey){
    aclRights = survey.getACL();
    //If pictureCount is Empty or Zero remove the camera icon
    if(Utils.isEmptyString(survey.getPictureCount()) || survey.getPictureCount() == "0"){
      aclRights.removeRight(AclObjectType.PROPERTY, "myCameraIcon", AclPermission.VISIBLE);
    }
    else {
      aclRights.addRight(AclObjectType.PROPERTY, "myCameraIcon", AclPermission.VISIBLE);
    }
  });
} 
else{
  me.getItems().forEach(function(survey){
    aclRights = survey.getACL();
    if(survey.getMyCameraIcon() != "CapturePictureIcon"){
      aclRights.removeRight(AclObjectType.PROPERTY, "myCameraIcon", AclPermission.VISIBLE);
    } else {
      aclRights.addRight(AclObjectType.PROPERTY, "myCameraIcon", AclPermission.VISIBLE);
    }
    /*if(survey.getVisible() == "1"){
      if(!aclRights.isVisible(AclObjectType.OBJECT, "LiSurvey")){
        aclRights.addRight(AclObjectType.OBJECT, "LiSurvey", AclPermission.VISIBLE);
      }
      if(survey.getMyCameraIcon() != "CapturePictureIcon"){
        aclRights.removeRight(AclObjectType.PROPERTY, "myCameraIcon", AclPermission.VISIBLE);
      }
    } 
    else {
      if(aclRights.isVisible(AclObjectType.OBJECT, "LiSurvey")){
        //aclRights.removeRight(AclObjectType.OBJECT, "LiSurvey", AclPermission.VISIBLE);
      }
    } */
  });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}