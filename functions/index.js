const functions = require("firebase-functions");

const app = require("express")();

const {

} = require("./handlers/dataBack")

const {
    registerClass,
    loginClass,
    addSubProfile,
    registerClassUrlReference,
    loginClassWithUrlCard,
    cardLinkRandomAdd, //carde url Link urteiyor
    cardLinkRandomAddNormalAccount, //cARD Link Normal Type Üretiyor
    socialUrlAdd,
    socialUrlAddNew,
    facebookUrlAdd,
    uploadProfile,
    ClickUrlCardLink,
    ClickProfileLink,
    deleteUser,
    singleUserInfo,
    singleUserInfoWithgeneraluserId,
    getAuthenticatedUser,
    deleteSingleProfile,
    getAllSubprofileOfGeneralUser,
    updateGeneralUserData,
    updateSingleUserData,
    getallSocialMediaofSingleprofile,
    socialUrlUpdate,
    deleteSocialMediaOfProfile,
    postContactInfopanel,
    postFaturaBillInfopanel,
    postFaturaBillInfopanelLater,
    postUrlLinkiInfopanel,
    postUrlLinkiInfopanelllll,
    postBanInfopanel,
    UpdateUserInfoMessageFirstDeneme,
    UpdateUserInfoMessageFirstStandart,
    UpdateUserInfoHideLogo,
    UpdateUserInfoMessageFirstPremium,
    transferDataToanother,
    updateLinkCardToReadOnce,
    allHomePageLinkTo,
    getAlluserDataaaaa,
    uploadFilePdf,
    getpanelInfFromHere,
    backgorundImageChange,
    darkThemeOrLight,
    positionOfSocialMedia,
    updateBankInfo,
    updateStattuModeBank,
    updateStattuModeProfileUrl,
    updateStattuModeContact,
    updateStattuModeFaturaBu,
    adminPanelInfo,
    adminPanelAllCArdLink,
    adminPanelSearchUser,
    sparisTipiDenemeHesap,
    adminPanellastRegister,
    getOnlyTheuserWithoutUser,
    updateStattuModeDocumentToChange,
    postDocumentInfopanel,
    updateDocumentFormInfo,
    updateContactInfo,
    updateFaturaBillInfo,
    updateContactInfoArrayPhoneOnly,
    updateContactInfoArrayPhoneOnlyAgain,
    updateBankInfoArrayDataOnly,
    updateContactInfoEmailOnly,
    updateContactInfoArrayEmailOnlyAgain,
    NormalToPremiumAccount,
    onlyNormalToPremiumDashboard,
    sendMessageToEveryone,
    sendTwilioToTarik,
    sendMessageToEveryoneAfterDeploy,
    getkartfiyatlari,
    updateStandartFiyat,
    updatePremiumFiyat,
    updateURLpanelLinki,
    uploadFilePdfChange,
    BillInfoData,
    parolaChangeOfUser,
    emailChangeOfUser,
    postUserDatafromheer,
    clickSosyalDataNumber,
    clickBankaDataNumber,
    clickUploadFileDataNumber,
    clickCustomerFormDataNumber,
    clickFaturaDataNumber,
    clickContactDataNumber,
    updateOrderOfBank,
    updateStattuModeFileUploadToView,
    passwordForget,
    updateOrderOfContact,
    updateOrderOfFaturaBill,
    updateOrderOfDocument,
    updateOrderOfFileUploaded,
    getTherandomUrInfo,
    bankPanelDelete,
    contactPanelDelete,
    FaturaBillPanelDelete,
    profileUrlPanelDelete,
    singleUserInfoWithgeneraluserIdPreviewPageToken,
    DocumentFormPanelDelete,
    fileUploadedPanelDelete,
    updateConatctPanelTitle,
    updateFaturaBillPanelTitle,
    updatePanelUrlLinkPanelTitle,
    updateBankPanelTitle,
    updateDocumentPanelTitle,
    updateFileUploadPanelTitle,
    postFirstPlaceWhereToPutUploadFilepanel,
    updateOrderOfPanelProfileUrl,
    updateProfileUrlLinksDataOnly,
    updateProfileUrlFromAfterDelete,
    deleteArrayInsidePhone,
    deleteArrayInsideEmail,
    deleteArrayInsideFileUploadArrayOnly,
    deleteArrayInsideBankArrayOnlyElement,
    deleteArrayProfileUrlLinksArrayOnlyElement,
    updateSocialMediaOfPanelChanges,
    updateSocialMediaWhenUrlLinkofPanel

} = require("./handlers/userActions")

const {
    getAllUser,
    getAllProfileClickDate,

    getAllDateOfAuser
} = require("./handlers/dataBack")




// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const { db } = require("./importantDoc/admin"); //

const FBAuth = require("./importantDoc/fbAuth"); //need to bring authentication

const cors = require("cors");

//swagger integerations
var swaggerUI = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");
app.use("/swaggerHibritcard", swaggerUI.setup(swaggerDocument))
    //end of swagger

const fbAuth = require("./importantDoc/fbAuth");

app.use(cors());

//all the request made from here.
app.post("/register", registerClass); //register function
app.post("/registerWithUrlCard", registerClassUrlReference) //register with card url
app.post("/login", loginClass); //login into system from here.
app.post("/loginWithCardUrl", FBAuth, loginClassWithUrlCard); //login into system from here.
app.post("/addProfile", FBAuth, addSubProfile);
app.post("/cardLinkAddPremium", FBAuth, cardLinkRandomAdd); //create card Link Url Premium
app.post("/cardLinkAddNormal", FBAuth, cardLinkRandomAddNormalAccount); //normal Type CARD send
app.post("/newSocialUrlAdd/:profileId", FBAuth, socialUrlAdd) //add social url link  

app.post("/newSocialUrlAddArray/:profileId", FBAuth, socialUrlAddNew)



app.post("/facebookUrlAdd", FBAuth, facebookUrlAdd) //facebook url add here

//reset password forget
app.post("/resetPasswordForget", passwordForget) //password forget mail sent

app.post("/themeChange/:profileId", FBAuth, darkThemeOrLight); //dark or Light theme

app.post("/ChangesocialPosition/:profileId", FBAuth, positionOfSocialMedia)

app.post("/uploadProfile/:profileId", FBAuth, uploadProfile); //upload profile from dashboard
app.post("/uploadFileDoucment/:profileId", FBAuth, uploadFilePdf) //UPLOAD FİLE DOCUMENT        postFirstPlaceWhereToPutUploadFilepanel

app.post("/uploadFileDoucmentFirstTime/:profileId", FBAuth, postFirstPlaceWhereToPutUploadFilepanel) //post Data from upload

app.put("/changeUploadImage/:fileUploadDocumentId", FBAuth, uploadFilePdfChange);


app.post("/uploadBackgroundImage/:profileId", FBAuth, backgorundImageChange) //change the background ImagebackgorundImageChange
app.post("/AddBillInfoData/:profileId", FBAuth, BillInfoData); //fatura Info Data

app.put("/user/updateUser", FBAuth, updateGeneralUserData); //update genral user Info

app.put("/updateProfile/:profilId", FBAuth, updateSingleUserData); //single profile update



app.put("/updateSocialMediaUrl/:socialMediaId", FBAuth, socialUrlUpdate) //updated social   

app.put("/updateSocialFromPanel", FBAuth, updateSocialMediaOfPanelChanges)

app.put("/updateSocialfromUrlPanel", FBAuth, updateSocialMediaWhenUrlLinkofPanel)

app.put("/bankdataUpdate/:bankDataId", FBAuth, updateBankInfo); //update bank Info  updateContactInfo
app.put("/changeStatusModeOfBank/:bankDataId", FBAuth, updateStattuModeBank) //update status bank here 
app.put("/changeStatusModeOfContact/:contactDataId", FBAuth, updateStattuModeContact) //update contact Mode statatue    updateStattuModeProfileUrl
app.put("/changeStatusModeOfProfileUrl/:panelProfileUrlDataId", FBAuth, updateStattuModeProfileUrl) //sttaue Mode of Profile Url  

app.put("/changeStatusModeOfFaturaBill/:faturaDataId", FBAuth, updateStattuModeFaturaBu)


//panel DASHBOARD FROM HERE
app.get("/allcardLinkInfo", adminPanelInfo);
app.get("/allcardLinkCardInfo", adminPanelAllCArdLink);
app.get("/alluserBydate", adminPanellastRegister);
app.post("/searchbyValue", adminPanelSearchUser);

//update Order Type
app.put("/updateOrderType", FBAuth, sparisTipiDenemeHesap)



app.get("/getonlyUserWithoutAuth/:eMail", getOnlyTheuserWithoutUser)




app.put("/changeStatusModeOfDocument/:documentDataFormId", FBAuth, updateStattuModeDocumentToChange) //update document statusMode   
app.put("/changeStatusModeOfFileUpload/:belgeDocumentId", FBAuth, updateStattuModeFileUploadToView) //update File Upload here  

app.put("/changeOrdreIdOfBank/:bankDataId", FBAuth, updateOrderOfBank) //update order of Id Bank   
app.put("/changeOrdreIdOfContact/:contactDataId", FBAuth, updateOrderOfContact) //updated order of Contact
app.put("/changeOrdreIdOfdocument/:documentDataFormId", FBAuth, updateOrderOfDocument) //updaed order of Document 
app.put("/changeOrdreIdOfFileUploaded/:belgeDocumentId", FBAuth, updateOrderOfFileUploaded) //uploaded order of File Uploaded 
app.put("/changeOrdreIdOfprofileUrlPanel/:panelProfileUrlDataId", FBAuth, updateOrderOfPanelProfileUrl)

app.put("/changeOrdreIdOfFaturaBill/:faturaDataId", FBAuth, updateOrderOfFaturaBill)


//panel Title update here
app.put("/changepanelTitle/:contactDataId", FBAuth, updateConatctPanelTitle);
app.put("/changepanelProfileUrlPanelTitle/:panelProfileUrlDataId", FBAuth, updatePanelUrlLinkPanelTitle);
app.put("/changepanelTitleBank/:bankDataId", FBAuth, updateBankPanelTitle)
app.put("/changepanelTitleDocument/:documentDataFormId", FBAuth, updateDocumentPanelTitle)
app.put("/changepanelTitleFileUpload/:belgeDocumentId", FBAuth, updateFileUploadPanelTitle)

app.put("/changepanelTitleOfFatura/:faturaDataId", FBAuth, updateFaturaBillPanelTitle);


app.put("/contactdataUpdate/:conatctDataId", FBAuth, updateContactInfo); //update contact data 

app.put("/faturaBilldataUpdate/:faturaDataId", FBAuth, updateFaturaBillInfo);


app.put("/documentdataUpdate/:documentDatId", FBAuth, updateDocumentFormInfo) //update document form from here   
app.put("/updatePanelProfileUrl/:panelProfileUrlDataId", FBAuth, updateURLpanelLinki)

app.put("/updatePhoneNumbersHere/:conatctDataId", FBAuth, updateContactInfoArrayPhoneOnly);


app.put("/updatePhoneNumbersAfterDelete/:conatctDataId", FBAuth, updateContactInfoArrayPhoneOnlyAgain);


app.put("/updateBankDataOnly/:BankDataId", FBAuth, updateBankInfoArrayDataOnly);

app.put("/updateProfileUrlLinksDataOnly/:panelProfileUrlDataId", FBAuth, updateProfileUrlLinksDataOnly);

app.put("/updateProfileUrlLinksDataOnlyAfterDelete/:panelProfileUrlDataId", FBAuth, updateProfileUrlFromAfterDelete);





app.put("/updateEmailPostasHere/:conatctDataId", FBAuth, updateContactInfoEmailOnly);

app.put("/updateEmailPostasOnlyAfterDelte/:conatctDataId", FBAuth, updateContactInfoArrayEmailOnlyAgain);


// Change AccounType To Premium To Normal  
app.put("/changeAccountType/:secretKod", FBAuth, NormalToPremiumAccount);

app.put("/changeOnlyToPremium/:eMail", onlyNormalToPremiumDashboard)


app.post("/sendSmsTo", sendMessageToEveryone);

//tryt send meassage sendTwilioToTarik

app.get("/sendSmsToooo", sendTwilioToTarik);

app.get("/getUserPhonesAll", sendMessageToEveryoneAfterDeploy);

//get the price dashboard from here
app.get("/getkartfiyat", getkartfiyatlari);

//update kart fiyat from  here
app.put("/updatekartfiyatstandart/:kartturu", updateStandartFiyat);
app.put("/updatekartfiyatpremium/:kartturu", updatePremiumFiyat);



//create contact data of profile
app.post("/conatctAddData/:profileId", FBAuth, postContactInfopanel)

app.post("/conatctAddDataaaa/:profileId", postContactInfopanel)

app.post("/faturaBillAddData/:profileId", FBAuth, postFaturaBillInfopanel);
app.post("/faturaBillAddDataaaaaa/:profileId", postFaturaBillInfopanelLater);



app.post("/bankAddData/:profileId", FBAuth, postBanInfopanel);


app.post("/bankAddDataaaa/:profileId", postBanInfopanel);


//first deneme INFO

app.post("/updateFirstDenemeOpen", FBAuth, UpdateUserInfoMessageFirstDeneme);
app.post("/updateFirstStandartOpen", FBAuth, UpdateUserInfoMessageFirstStandart);
app.post("/updatePremiumOpen", FBAuth, UpdateUserInfoMessageFirstPremium);

app.post("/hideLogo", FBAuth, UpdateUserInfoHideLogo);



// postData from a to B

app.post("/addDataFrom/:userHandle", transferDataToanother);

//Finish of Transfer Data A to B

app.get("/updateReadCrad", updateLinkCardToReadOnce); //update read CARD


app.get("/allUrlOldCard", allHomePageLinkTo);

app.get("/kontrolFor", getAlluserDataaaaa);


app.post("/documentData/:profileId", FBAuth, postDocumentInfopanel) //POST DOCUMENT
app.post("/changegePassword", FBAuth, parolaChangeOfUser) //change Passworrd  
app.post("/panelUrlLinkAddData/:profileId", FBAuth, postUrlLinkiInfopanel) //profile Url Link  

app.post("/panelUrlLinkAddDataaaaa/:profileId", postUrlLinkiInfopanelllll) //profile Url Link  

app.post("/changegeEmailofUser", FBAuth, emailChangeOfUser)


app.post("/addpostToChange", postUserDatafromheer);

//click  Number form here contact
app.post("/updateclikNumberContact/:contactDataId", clickContactDataNumber);

//click Number sosyal link
app.post("/updateclikNumberSosyalLink/:sosyalUrlLink", clickSosyalDataNumber);


//click Number Banka form 
app.post("/updateclikNumberBanka/:bankDataId", clickBankaDataNumber);



//click Number File Upload click Number 
app.post("/updateclikNumberFileUpload/:uploadFileId", clickUploadFileDataNumber);

//click Number customer form
app.post("/updateclikNumberCustomerForm/:customerPanelId", clickCustomerFormDataNumber);

//click Number Fatura  Data
app.post("/updateclikNumberFatura/:faturaDataId", clickFaturaDataNumber);






app.get("/user/:userHandleName", singleUserInfo); //get all data with  Name.

app.get("/userid/:userId", singleUserInfoWithgeneraluserId); //kullancici bilgiler getir bana with GENRALUSERıD 

app.get("/userPreviewPage/:userId", FBAuth, singleUserInfoWithgeneraluserIdPreviewPageToken);



app.get("/panelData/:profileId", FBAuth, getpanelInfFromHere); //get data of panel
app.get("/geturlcardRandom/:urlRandomId", getTherandomUrInfo) ///get url card form Link card Read

//user Info get with authenticated
app.get("/userAuthData", FBAuth, getAuthenticatedUser);




// delete array  from here
app.put("/deleteArrayPhone/:conatctDataId", FBAuth, deleteArrayInsidePhone);

app.put("/deleteArrayEmail/:conatctDataId", FBAuth, deleteArrayInsideEmail);

app.put("/deleteArrayFileUpload/:belgeDocumentId", FBAuth, deleteArrayInsideFileUploadArrayOnly);

app.put("/deleteArrayBankOnlyArray/:bankDataId", FBAuth, deleteArrayInsideBankArrayOnlyElement);

app.put("/deleteArrayProfileUrlOnlyArray/:panelProfileUrlDataId", FBAuth, deleteArrayProfileUrlLinksArrayOnlyElement);



// delete user
app.delete("/deleteUser", FBAuth, deleteUser);
app.delete("/deleteProfile/:profilId", FBAuth, deleteSingleProfile);
app.delete("/deleteSocialMediaofProfile/:socialMediaId", FBAuth, deleteSocialMediaOfProfile);


//**********Panel delete */
app.delete("/bankPanelDelete/:bankDataId", FBAuth, bankPanelDelete);

app.delete("/contactPanelDelete/:contactDataId", FBAuth, contactPanelDelete);

app.delete("/documentPanelDelete/:documenttDataId", FBAuth, DocumentFormPanelDelete);
app.delete("/fileUploadPanelDelete/:fileuploadedDataId", FBAuth, fileUploadedPanelDelete);

//fatura delete From HERE   
app.delete("/faturaPanelDelete/:faturaDataId", FBAuth, FaturaBillPanelDelete);


app.delete("/profileUrlPanelDelete/:panelProfileUrlDataId", FBAuth, profileUrlPanelDelete); //delete profile Url from here





//All userbring
app.get("/allUser", getAllUser);

app.post("/clickUrlDate/:cardlinkid/add", ClickUrlCardLink);
app.post("/clickProfile/:profileId/add", ClickProfileLink);


//when click to download


app.get("/getallDateofClick", FBAuth, getAllDateOfAuser);
app.get("/getAllDateofProfileClick/:profileId", FBAuth, getAllProfileClickDate);


//subprofile
app.get("/getAllProfile", FBAuth, getAllSubprofileOfGeneralUser)

// get all social media of user
app.get("/getAllSocialMedia/:profileId", FBAuth, getallSocialMediaofSingleprofile);


// The api to send to fireabase
exports.api = functions.https.onRequest(app);


// firebase trigger
// get the notifications when the click on the link