const {
    db,
    admin
} = require("../importantDoc/admin");


// initialize App here
const firebaseConfig = require("../importantDoc/config");
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);


const {
    validateSignUpData,
    validateLoginData,
    validateRegisterCardRefer,
    reduceGeneralUserInfo,
    reduceSingleUserInfo,
    reduceContactStatusMode,
    reduceFaturaBillStatusMode,
    reducekulBill,
    reduceDarkMokAktif,
    reduceBankStatusMode,
    reduceProfileUrlStatusMode,
    reducePositionOfSocail,
    reduceDocumentStatusMode,
    reduceFileUploadToStatusMode,
    reduceOrderIdofBank,
    reduceOrderIdofprofileUrl,
    reduceDocumentInfo,
    reduceBankInfo,
    reduceContactInfo,
    validateResetPassordForget,
    reduceOrderIdofContact,
    reduceOrderIdofDocument,
    reduceOrderIdofFileUploaded,
    reduceTitleUpdatePanel,
    reduceTitleUpdatePanelBank,
    reduceTitleUpdatePanelDocument,
    reduceTitleUpdatePanelFileUpload,
    reduceTitleUpdatePanelProfileUrl,
    reduceUrlPanelInfo


} = require("../importantDoc/validatorData");
const {
    user
} = require("firebase-functions/v1/auth");


exports.registerClass = (req, res) => {

    const newPersonInfo = {
        eMail: req.body.eMail,
        publicName: req.body.publicName,
        publicSurname: req.body.publicSurname,
        userHandleName: req.body.userHandleName,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword

    }

    const {
        valid,
        allErrors
    } = validateSignUpData(newPersonInfo);


    if (!valid) {
        return res.status(400).json({
            allErrors
        });
    }

    // the Image will bbe in hold for some second
    //const defaultImage = "no-img.png"
    //const backImag = "back-img.jpg"
    //const checkUserHandleName = db.collection("userGeneral").where("userHandleName", "==", req.body.userHandleName)

    let generalToken
    let generalUserId

    singleUserData = {}
    db.collection("userGeneral").where("userHandleName", "==", newPersonInfo.userHandleName).get().then((data) => {
        singleUserData.dataInfo = [];
        data.forEach(doc => {
            singleUserData.dataInfo.push(
                doc.data())
        })

    }).then(() => {


        if (singleUserData.dataInfo.length > 0 && singleUserData.dataInfo[0].userHandleName == newPersonInfo.userHandleName) {
            return res.status(400).json({
                userHabdleExist: "This userHandle has already registered"
            });

        }
        console.log("isism kontrtolu:", singleUserData.dataInfo)

    }).then(() => {

        console.log("hata girmiyor")

        db.doc(`/userGeneral/${newPersonInfo.eMail}`).get().then((doc) => {

            if (doc.exists) {
                return res.status(400).json({
                    eMailAccountExist: "This Email has already registered"
                });
            } else {

                return firebase.auth().createUserWithEmailAndPassword(newPersonInfo.eMail, newPersonInfo.password);

            }

        }).then((data) => {
            generalUserId = data.user.uid;
            return data.user.getIdToken();

        }).then((tokenReceived) => {
            generalToken = tokenReceived


            const userCredentials = {

                eMail: newPersonInfo.eMail,
                publicName: newPersonInfo.publicName,
                publicSurname: newPersonInfo.publicSurname,
                generalUserId,
                userHandleName: newPersonInfo.userHandleName,
                startDateCount: new Date().toISOString(),
                birthDate: "",
                phoneNumber: "",
                gender: 0,
                cardPairing: "",
                passwordOfUser: newPersonInfo.password,
                accountNormalTo: ""

            }


            return db.doc(`/userGeneral/${newPersonInfo.eMail}`).set(userCredentials);

        }).then(() => {
            res.status(201).json({
                generalToken
            });
        }).catch((err) => {
            console.error(err);
            if (err.code == "auth/email-already-in-use") {
                return res.status(400).json({
                    Error: "This Email is already in use...!"
                })
            } else if (err.code == "auth/weak-password") {
                return res.status(400).json({
                    Error: "password must be at least 6 charachter!"
                })
            } else {
                return res.status(500).json({
                    GeneralError: "Something went wrong with the backend, please try again!!"
                })
            }
        })

    }).catch((err) => {
        res.status(400).json({
            errorHere: "error here"
        })
    })

}

// card refer to another url not workinkg anymore
exports.registerClassUrlReference = (req, res) => {

    const newPersonUrlRefer = {
        eMail: req.body.eMail,
        publicName: req.body.publicName,
        publicSurName: req.body.publicSurName,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        userHandleName: req.body.userHandleName,
        secretkod: req.body.secretkod
    }

    const {
        valid,
        erreorReferRegister
    } = validateRegisterCardRefer(newPersonUrlRefer);

    if (!valid) {
        return res.status(400).json({
            erreorReferRegister
        });
    }

    //const noImg="no-image.png"
    //const backImg="baha2.jpg"
    let generalToken
    let generalUserId
    db.doc(`/userGeneral/${newPersonInfo.eMail}`).get().then(doc => {
        if (doc.exists) {
            return res.status(400).json({
                eMail: "This Email has already registred."
            });
        } else {
            return firebase.auth().createUserWithEmailAndPassword(newPersonInfo.eMail, newPersonInfo.password);
        }

    }).then((data) => {
        generalUserId = data.user.uid;
        return data.user.getIdToken();
    }).then((tokenReceived) => {
        generalToken = tokenReceived

        const userCredentials = {
            eMail: newPersonInfo.eMail,
            publicName: newPersonInfo.publicName,
            publicSurname: newPersonInfo.publicSurname,
            generalUserId,
            userHandleName: newPersonInfo.userHandleName,
            birthDate: "",
            phoneNumber: "",
            gender: "",
            cardPairing: "",
            verificationkod: "",
            secretkod: newPersonUrlRefer.secretkod
        }
        return (
            db.doc(`/userGeneral/${newPersonInfo.eMail}`).set(userCredentials),
            db.doc(`/cardUrlLinks/${newPersonUrlRefer.secretkod}`).set(userCredentials)
        )

    }).then(() => {
        res.status(201).json({
            generalToken
        });
    }).catch((err) => {
        console.error(err);
        if (err.code == "auth/email-already-in-use") {
            return res.status(400).json({
                Error: "This Email is already in use...!"
            })
        } else if (err.code == "auth/weak-password") {
            return res.status(400).json({
                Error: "password must be at least 6 charachter!"
            })
        } else {
            return res.status(500).json({
                GeneralError: "Something went wrong with the backend, please try again!!"
            })
        }
    })

}


exports.loginClass = (req, res) => {

    const loginPerson = {
        eMail: req.body.eMail,
        password: req.body.password
    }

    const {
        valid,
        errorLogin
    } = validateLoginData(loginPerson);
    if (!valid) {
        return res.status(400).json({
            errorLogin
        });
    } else {

        firebase.auth().signInWithEmailAndPassword(loginPerson.eMail, loginPerson.password).then((data) => {
            return data.user.getIdToken()
        }).then((givenToken) => {
            return res.status(201).json({
                LoginToken: givenToken
            })
        }).catch(err => {
            console.error(err)
                //auth/wrong-password
                //auth/user-not-user
            if (err.code == "auth/wrong-password") {
                return res.status(400).json({
                    error: "Email or Password is wrong"
                });
            } else if (err.code == "auth/user-not-found") {
                return res.status(400).json({
                    error: "please Try again, Wrong Informations!!"
                })
            } else if (err.code == "auth/too-many-requests") {
                return res.status(400).json({
                    error: "Please try later!!"
                })
            } else {
                return res.status(500).json({
                    err: err.code
                })
            }
        })
    }
}

//this is my activate card link function form now
exports.loginClassWithUrlCard = (req, res) => {

    if (req.body.secretKod.trim() === "") {
        return res.status(400).json({
            Body: " This field should be fill !!"
        })
    }
    if (req.body.verificationCode.trim() === "") {
        return res.status(400).json({
            Body: " This field should be fill !!"
        })
    }

    const loginPerson = {
        secretKod: req.body.secretKod,
        verificationCode: req.body.verificationCode
    }

    //const noImg = "no-image.png"; 
    //const { valid, errorLoginCard } = validateLoginWithCardUrl(loginPerson);

    //let givenToken, generalUserId;
    const userCredentials = {
            eMail: req.user.eMail,
            secretkod: loginPerson.secretKod,
            generalUserId: req.user.generalUserId
        }
        // const userCredentials2 = {
        //     secretkod: loginPerson.secretKod,
        //     verificationCode: loginPerson.verificationCode
        // }

    db.doc(`/cardUrlLinks/${loginPerson.secretKod}`).get().then((doc) => {

        if (doc.data().verificationCode === loginPerson.verificationCode) {

            if (loginPerson.verificationCode.slice(-2) === "1P") {

                loginPerson.accountType = "Premium";
                loginPerson.accountTypeStartDate = new Date().toISOString();


                db.doc(`/userGeneral/${req.user.eMail}`).update(loginPerson).then(() => {

                    db.doc(`/cardUrlLinks/${loginPerson.secretKod}`).set(userCredentials)

                }).then(() => {

                    let loginCardData = {}

                    db.doc(`/userGeneral/${req.user.eMail}`).get().then(doc => {
                        loginCardData = doc.data()
                        loginCardData.cardUrlLinksId = doc.id

                        return db.doc(`/cardUrlLinks/${loginPerson.secretKod}`).update(loginCardData)

                    }).catch((err) => {

                        res.status(400).json({
                            error: "hata var burada"
                        });

                    })
                }).then(() => {

                    return res.status(201).json({
                        Succesful: "card url succesfully added"
                    });

                }).catch(err => {
                    console.error(err)
                        //auth/wrong-password
                        //auth/user-not-user
                    return res.status(500).json({
                        err: err.code
                    });
                })

            } else {

                loginPerson.accountType = "Normal";
                loginPerson.accountTypeStartDate = new Date().toISOString();


                db.doc(`/userGeneral/${req.user.eMail}`).update(loginPerson).then(() => {

                    db.doc(`/cardUrlLinks/${loginPerson.secretKod}`).set(userCredentials)

                }).then(() => {

                    let loginCardData = {}

                    db.doc(`/userGeneral/${req.user.eMail}`).get().then(doc => {
                        loginCardData = doc.data()
                        loginCardData.cardUrlLinksId = doc.id

                        return db.doc(`/cardUrlLinks/${loginPerson.secretKod}`).update(loginCardData)

                    }).catch((err) => {

                        res.status(400).json({
                            error: "hata var burada"
                        });

                    })
                }).then(() => {

                    return res.status(201).json({
                        Succesful: "card url succesfully added"
                    });

                }).catch(err => {
                    console.error(err)
                        //auth/wrong-password
                        //auth/user-not-user
                    return res.status(500).json({
                        err: err.code
                    });
                })


            }

        } else {
            res.status(500).json({
                verificationCodeError: "Verification Code is not matching"
            });
        }
    }).catch((err) => {

        console.log(err);
        return res.status(500).json({
            err: err.code
        });

    })
}


//Normal Account To Premium Accoumt

exports.NormalToPremiumAccount = (req, res) => {

    const newInfoToUpdate = {
        accountType: req.body.accountType,
        accountTypeStartDate: new Date().toISOString()
    }

    db.doc(`/userGeneral/${req.user.eMail}`).update({


        accountType: newInfoToUpdate.accountType,
        accountTypeStartDate: newInfoToUpdate.accountTypeStartDate



    }).then((data) => {

        db.doc(`/cardUrlLinks/${req.params.secretKod}`).update({

            accountType: newInfoToUpdate.accountType,
            accountTypeStartDate: newInfoToUpdate.accountTypeStartDate


        }).then((data) => {

            return res.status(400).json({
                Successfully: "Successfully added"
            });


        }).catch((err) => {

            return res.status(500).json({
                err: err.code
            });

        })
    }).catch((err) => {
        return res.status(500).json({
            err: err.code
        })

    })



}






//uploafd Profile from here
exports.uploadProfile = (req, res) => {

    const BusBoy = require("busboy")
    const path = require("path")
    const os = require("os")
    const fs = require("fs")



    const busboy = BusBoy({
        headers: req.headers
    });


    let imageFileName;
    let imageToBeUploaded = {};


    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

        if (Object.values(filename)[2] !== "image/jpeg" && Object.values(filename)[2] !== "image/png") {
            return res.status(400).json({
                err: "Fotoğraf  png yada jpeg formatı olmak zorunda!!"
            })
        }




        const trueFile = Object.values(filename)[0]

        const imageExtension = trueFile.split(".")[trueFile.split(".").length - 1];

        console.log("Extension here: ", imageExtension);
        console.log("fle size uzunluk:", file.length)

        imageFileName = `${Math.round(
            Math.random() * 1000000000000
          ).toString()}.${imageExtension}`;

        const filePath = path.join(os.tmpdir(), imageFileName);
        console.log("filePath:", filePath);

        imageToBeUploaded = {
            filePath,
            mimetype
        }

        //to create the file
        file.pipe(fs.createWriteStream(filePath));


    });
    busboy.on("finish", () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        }).then(() => {
            const imageUrlUploaded = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
            // if (req.user.secretKod) {
            //     db.doc(`/cardUrlLinks/${req.user.secretKod}`).update({ profileUrl: imageUrlUploaded })
            // }

            return (db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update({
                profileUrl: imageUrlUploaded
            }));
        }).then(() => {
            return res.json({
                mesaj: "Image Successfully Updated"
            });
        }).catch(err => {
            console.error(err)
            return res.status(500).json({
                error: err.code
            })
        })

    });

    busboy.end(req.rawBody);

}


//upload Background Images
exports.backgorundImageChange = (req, res) => {
    const BusBoy = require("busboy")
    const path = require("path")
    const os = require("os")
    const fs = require("fs")

    const busboy = BusBoy({
        headers: req.headers
    })

    let imageFileName;
    let imageToBeUploaded = {};


    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

        if (Object.values(filename)[2] !== "image/jpeg" && Object.values(filename)[2] !== "image/png") {
            return res.status(400).json({
                err: "The Image Format should be  png or jpeg!!"
            })
        }


        const trueFile = Object.values(filename)[0]

        const imageExtension = trueFile.split(".")[trueFile.split(".").length - 1];

        console.log("Extension here: ", imageExtension);

        //transform the image took here to another format: example,83475834895.png
        imageFileName = `${Math.round(
            Math.random() * 1000000000000
          ).toString()}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);

        imageToBeUploaded = {
            filePath,
            mimetype
        }

        //to create the file
        file.pipe(fs.createWriteStream(filePath));
    });
    busboy.on("finish", () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {

            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        }).then(() => {
            const imageUrlUploaded = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;


            let userProfile = {}
            const allpanelProfile = db.collection("profilesOfGeneralUser").where("generalUserId", "==", req.user.generalUserId)
            allpanelProfile.get().then((data) => {
                userProfile.profileInfo = []
                data.forEach((doc) => {
                    userProfile.profileInfo.push({
                        generalUserId: doc.data().generalUserId,
                        profileId: doc.id
                    });
                })
            }).then(() => {
                if (userProfile.profileInfo[0].generalUserId == req.user.generalUserId) {
                    return (db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update({
                        backgorundImage: imageUrlUploaded
                    }));
                } else {
                    return res.status(400).json({
                        Error: "No permission"
                    })
                }
            }).then(() => {
                return res.json({
                    mesaj: "Backgorund successfully changed"
                });
            }).catch((err) => {
                return res.json(err)
            })
        }).catch(err => {
            console.error(err)
            return res.status(500).json({
                error: err.code
            })
        })
    });

    busboy.end(req.rawBody);

}


// add the subProfile 
exports.addSubProfile = (req, res) => {

    defaultImage = "no-img.png",
        backImag = "back-img.jpg"


    if (req.body.profileTag.trim() === "") {
        return res.status(400).json({
            Error: "This field can't be empty!!"
        });
    }

    const newProfileAdd = {
        profileTag: req.body.profileTag,
        generalUserId: req.user.uid,
        eMail: req.user.eMail,
        customUrl: "",
        dateofCreation: new Date().toISOString(),
        orderOfProfile: req.body.orderOfProfile,
        phoneNumber: "",
        profileAdres: "",
        profileCompany: "",
        profilDescription: "",
        profileEmail: "",
        profileTheme: "light",
        publicName: "",
        publicSurName: "",
        statusMode: true,
        statusOfUrl: true,
        placeOfSocialMediaPosition: "top",
        telNumber: "",
        taxNumber: "",
        taxAdministration: "",
        companyStatus: "",
        officeEmail: "",
        websiteUrlLink: "",
        officePhoneNumber: "",
        location: "",
        position: "",
        profileUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/profileMages%2F${defaultImage}?alt=media`,
        backgorundImage: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/backgroundMages%2F${backImag}?alt=media`,
    }

    let allgenraluserIdCount = [];
    db.doc(`/userGeneral/${req.user.eMail}`).get().then(doc => {
        if (!doc.exists) {

            return res.status(404).json({
                Error: "This  general profile doesn't exist!!"
            })

        } else {
            // check length of generalUserId
            db.collection("profilesOfGeneralUser").where("generalUserId", "==", req.user.generalUserId).get().then((data) => {
                    data.forEach((doc) => {
                        allgenraluserIdCount.push({
                            profileId: doc.id,
                            generalUserId: doc.data().generalUserId,
                            eMail: doc.data().eMail,
                        })
                    });
                    //     return res.json(allgenraluserIdCount)
                }).then(() => {
                    if (allgenraluserIdCount.length >= 6) {
                        ///return db.doc(`/profilesOfGeneralUser/${req.user.generalUserId}`).set(newProfileAdd);
                        console.log("Sorry you account has reach the limit of profile")
                        return res.json({
                            fullAccount: "Sorry you account has reach the limit of profile"
                        })

                    } else {
                        return db.collection("profilesOfGeneralUser").add(newProfileAdd);
                    }

                }).then((doc) => {
                    newProfileAdd.newProfileId = doc.id

                    return res.json(newProfileAdd)
                })
                .catch(err => {
                    console.error(err)
                        //return res.status(500).json({ fullAccount: "Sorry you account has reach the limit of profile" })
                })
                // return db.collection("profilesOfGeneralUser").add(newProfileAdd);
                //res.json(allgenraluserIdCount.length)
        }
    }).catch((err) => {
        console.log(err)
        return res.status(500).json({
            Error: err.code
        })
    })
}

//get the the Info of Url random add
exports.getTherandomUrInfo = (req, res) => {

    let randomUrlData = {}
    db.doc(`/cardUrlLinks/${req.params.urlRandomId}`).get().then(doc => {
        if (!doc.exists) {
            return res.status(404).json({
                Mesaj: "This link doesn't exist!!!"
            })

        } else {
            randomUrlData = doc.data()
            randomUrlData.urlRandomId = doc.id
        }


    }).then(() => {
        return res.json(randomUrlData)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({
            Mesaj: err.code
        })
    })

}


//random Link id functşon for the card Premium From Here
exports.cardLinkRandomAdd = (req, res) => {

    if (req.body.randomurlText.trim() == "") {

        return res.status(400).json({
            Body: "Please write something !!"
        })
    }

    var verificationCode = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 4; i++) {
        verificationCode += possible.charAt(Math.floor(Math.random() * possible.length));

    }

    const createIkon = {
        randomurlText: req.body.randomurlText,
        admingeneralUserIdOnly: req.user.generalUserId,
        eMail: req.user.eMail,
        verificationCode: verificationCode + "1P"
    }

    db.collection("cardUrlLinks").add(createIkon).then((data) => {
        if (req.user.generalUserId === "XDlWtH4Dd2ZyZ2iCzHGL8H9rbAN2") {
            const resScream = createIkon
            resScream.cardUrlLinksId = data.id
            res.json({
                resScream
            });
        }
    }).catch((err) => {

        res.status(500).json({
            error: "something went wrong!!"
        });
        console.error(err)
    })

}

//random Link id Function for the card Normal Account

exports.cardLinkRandomAddNormalAccount = (req, res) => {


    if (req.body.randomurlText.trim() == "") {

        return res.status(400).json({
            Body: "Please write something !!"
        })
    }

    var verificationCode = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


    for (var i = 0; i < 4; i++) {
        verificationCode += possible.charAt(Math.floor(Math.random() * possible.length));

    }


    // for (var i = 0; i < 5; i++) {
    //     verificationCode += possible.charAt(Math.floor(Math.random() * possible.length)) + "1N";
    // }


    const createIkon = {
        randomurlText: req.body.randomurlText,
        admingeneralUserIdOnly: req.user.generalUserId,
        eMail: req.user.eMail,
        verificationCode: verificationCode + "1N"
    }

    db.collection("cardUrlLinks").add(createIkon).then((data) => {
        if (req.user.generalUserId === "XDlWtH4Dd2ZyZ2iCzHGL8H9rbAN2") {
            const resScream = createIkon
            resScream.cardUrlLinksId = data.id
            res.json({
                resScream
            });
        }
    }).catch((err) => {

        res.status(500).json({
            error: "something went wrong!!"
        });
        console.error(err)
    })


}



//Add Socaial Url from here general social that need url
exports.socialUrlAdd = (req, res) => {

    if (req.body.socialUrlLink.trim() === "") {
        return res.status(400).json({
            Error: "This Url can't be Empty!!"
        });
    }

    if (req.body.socialtype.trim() === "") {
        return res.status(400).json({
            Error: "This Url can't be Empty!!"
        });
    }

    const newComments = {

        socialUrlLink: req.body.socialUrlLink,
        socialtype: req.body.socialtype,
        eMail: req.user.eMail,
        generalUserId: req.user.generalUserId,
        profileId: req.params.profileId,
        statuMode: true,
        socialOrder: req.body.socialOrder,


    }

    db.collection("userSocialMediaUrl").add(newComments).then((doc) => {


        newComments.socialMediaPanelId = doc.id


    }).then(() => {

        res.json(newComments)

    }).catch(err => {
        console.log(err)
        return res.status(500).json({
            Error: err.code
        })
    })



}


//update social from panel Changes
exports.updateSocialMediaOfPanelChanges = (req, res) => {

    //let infoToChange = reduceSingleUserInfo(req.body);
    let profilId = req.body.profileId
    let socialMediaId = req.body.socialMediaId
    let socialMediaType = req.body.socialMediaType
    let socialUrlLink = req.body.socialUrlLink


    let allSocialMedia = []


    db.collection("userSocialMediaUrl").where("profileId", "==", profilId).get().then((doc) => {

        allSocialMedia.push({
            eMail: doc.data().eMail,
            profileId: doc.data().profileId,
            socialUrlLink: doc.data().socialUrlLink,
            socialtype: doc.data().socialtype,
            socialMediaId: doc.id
        })

    }).then(() => {

        if (allSocialMedia.socialtype === socialMediaType) {

            db.doc(`/userSocialMediaUrl/${socialMediaId}`).update({

                socialUrlLink

            })

        }
    })

}

//update only social Url Link to social


exports.updateSocialMediaWhenUrlLinkofPanel = (req, res) => {

    //let infoToChange = reduceSingleUserInfo(req.body);

    let socialMediaId = req.body.socialMediaId
    let socialUrlLink = req.body.socialUrlLink

    db.doc(`/userSocialMediaUrl/${socialMediaId}`).update({
        socialUrlLink: socialUrlLink
    }).then(() => {
        console.log("social updated")
    }).catch((err) => {
        console.log(err)
    })



}






//Add New social Media Url from here
exports.socialUrlAddNew = (req, res) => {


    let socialUrlLinkvariable = req.body.socialUrlLink
    let socialTypeVariable = req.body.socialtype
    let socialOrder = req.body.socialOrder



    const newComments = {

        AllUserSocials: [{

            "socialUrlLink": socialUrlLinkvariable,
            "socialtype": socialTypeVariable,
            "eMail": req.user.eMail,
            "generalUserId": req.user.generalUserId,
            "profileId": req.params.profileId,
            "statuMode": true,
            "socialOrder": socialOrder

        }],

        generalUserId: req.user.generalUserId,
        profileId: req.params.profileId,
        statueMode: true,
        panelTitle: "",
        OrderId: req.body.OrderId,
        isOpen: false,
        isDeleteOpen: false,
        isEditTitle: false,
        type: "urlLinkPanel"
    }


    db.doc(`/userSocialMediaUrl/${req.params.profileId}`).get().then(async(doc) => {

        if (doc.exists) {

            await db.doc(`/userSocialMediaUrl/${req.params.profileId}`).update({
                AllUserSocials: admin.firestore.FieldValue.arrayUnion({
                    "socialUrlLink": socialUrlLinkvariable,
                    "socialtype": socialTypeVariable,
                    "eMail": req.user.eMail,
                    "generalUserId": req.user.generalUserId,
                    "profileId": req.params.profileId,
                    "statuMode": true,
                    "socialOrder": socialOrder
                })
            });

            res.json({
                Message: "social Exist, that's why array updated"
            });

        } else {

            await db.doc(`/userSocialMediaUrl/${req.params.profileId}`).set(newComments);
            res.json({
                "First Push Social": newComments
            });

        }

    }).catch(err => {
        console.log(err)
        return res.status(500).json({
            Error: err.code
        })
    })
}

//silinecek after adds social media from here

exports.socialUrlAddNewwwww = (req, res) => {


    let socialUrlLinkvariable = req.body.socialUrlLink
    let socialTypeVariable = req.body.socialtype
    let socialOrder = req.body.socialOrder
    let emaill = req.body.eMail
    let genralUserIddd = req.body.generalUserId



    const newComments = {

        AllUserSocials: [{

            "socialUrlLink": socialUrlLinkvariable,
            "socialtype": socialTypeVariable,
            "eMail": emaill,
            "generalUserId": genralUserIddd,
            "profileId": req.params.profileId,
            "statuMode": true,
            "socialOrder": socialOrder

        }],

        generalUserId: genralUserIddd,
        profileId: req.params.profileId,
        statueMode: true,
        panelTitle: "",
        OrderId: req.body.OrderId,
        isOpen: false,
        isDeleteOpen: false,
        isEditTitle: false,
        type: "urlLinkPanel"
    }


    db.doc(`/userSocialMediaUrl/${req.params.profileId}`).get().then(async(doc) => {

        if (doc.exists) {

            await db.doc(`/userSocialMediaUrl/${req.params.profileId}`).update({
                AllUserSocials: admin.firestore.FieldValue.arrayUnion({
                    "socialUrlLink": socialUrlLinkvariable,
                    "socialtype": socialTypeVariable,
                    "eMail": emaill,
                    "generalUserId": genralUserIddd,
                    "profileId": req.params.profileId,
                    "statuMode": true,
                    "socialOrder": socialOrder
                })
            });

            res.json({
                Message: "social Exist, that's why array updated"
            });

        } else {

            await db.doc(`/userSocialMediaUrl/${req.params.profileId}`).set(newComments);
            res.json({
                "First Push Social": newComments
            });

        }

    }).catch(err => {
        console.log(err)
        return res.status(500).json({
            Error: err.code
        })
    })
}








//add facebook from here url
//facebook
exports.facebookUrlAdd = (req, res) => {
    if (req.body.socialUrlLink.trim() === "") {
        return res.status(400).json({
            Error: "Url alanı boş geçilemez!!"
        });
    }
    const newComments = {
        socialUrlLink: `facebook.com/${req.body.socialUrlLink}`,
        eMail: req.user.eMail,
        generalUserId: req.user.generalUserId,
        socialMediaName: req.body.socialMediaName,
        statuMode: true
    }
    return db.collection("userSocialMediaUrl").add(newComments).then(() => {
        res.json(newComments)
    }).catch(err => {
        console.log(err)
        return res.status(500).json({
            Error: err.code
        })
    })

}


// count when click link here on Date from general User
exports.ClickUrlCardLink = (req, res) => {

    const cardUrlidDocument = db.doc(`/cardUrlLinks/${req.params.cardlinkid}`);
    cardUrlClcikDate = db.collection("cardUrlDate")


    let cardLinkData
    cardUrlidDocument.get().then(doc => {
        if (doc.exists) {
            cardLinkData = doc.data()
            cardLinkData.urlcardId = doc.id
                //return cardUrlClcikDate.get()
            return db.doc(`/cardUrlDate/${cardLinkData.generalUserId}`).get()
        } else {
            return res.status(400).json({
                Error: "card url not found !!"
            })
        }
    }).then((doc) => {

        const neCredentials = {
            cardlinkid: req.params.cardlinkid,
            clickDate: [new Date().toISOString()],
            genralUserId: cardLinkData.generalUserId,
            eMail: cardLinkData.eMail
        }
        if (doc.exists) {
            console.log("buaraya girdi")
            db.doc(`/cardUrlDate/${cardLinkData.generalUserId}`).update({
                clickDate: admin.firestore.FieldValue.arrayUnion(new Date().toISOString())
            }).then(() => {
                return res.json({
                    Ok: "succesfully added"
                })
            })
        } else {
            console.log("buraya girmeedi")
            db.doc(`/cardUrlDate/${cardLinkData.generalUserId}`).set(neCredentials).then(() => {
                return res.json({
                    Ok: "succesfully added"
                })
            })


        }
    }).catch(err => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}


/// click  rehbere kaydetme


//count when click profile from here
exports.ClickProfileLink = (req, res) => {

    const cardUrlidDocument = db.doc(`/profilesOfGeneralUser/${req.params.profileId}`);

    cardUrlClcikDate = db.collection("cartProfileDate")


    let cardLinkData
    cardUrlidDocument.get().then(doc => {
        if (doc.exists) {
            cardLinkData = doc.data()
            cardLinkData.urlProfilecardId = doc.id
                //return cardUrlClcikDate.get()
            return db.doc(`/cartProfileDate/${cardLinkData.urlProfilecardId}`).get()
        } else {
            return res.status(400).json({
                Error: "card url not found !!"
            })
        }
    }).then((doc) => {

        const neCredentials = {
            cardlinkid: req.params.profileId,
            clickDate: [new Date().toISOString()],
            genralUserId: cardLinkData.generalUserId,
            eMail: cardLinkData.eMail,
            profileId: cardLinkData.urlProfilecardId
        }
        if (doc.exists) {
            console.log("buaraya girdi")
            db.doc(`/cartProfileDate/${cardLinkData.urlProfilecardId}`).update({
                clickDate: admin.firestore.FieldValue.arrayUnion(new Date().toISOString())
            }).then(() => {
                return res.json({
                    Ok: "succesfully added"
                })
            })
        } else {
            console.log("buraya girmeedi")
            db.doc(`/cartProfileDate/${cardLinkData.urlProfilecardId}`).set(neCredentials).then(() => {
                return res.json({
                    Ok: "succesfully added"
                })
            })


        }
    }).catch(err => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}




exports.deleteSingleProfile = (req, res) => {
    const subProfilDocument = db.doc(`/profilesOfGeneralUser/${req.params.profilId}`);
    subProfilDocument.get().then((doc) => {
        if (!doc.exists) {
            return res.status(404).json({
                Error: "Profile Not Found!!"
            });
        }
        if (doc.data().genralUserId !== req.user.genralUserId) {
            return res.status(403).json({
                Error: "don't have permission to delete Account  !!"
            })
        } else {
            return subProfilDocument.delete();
        }

    }).then(() => {
        return res.json({
            Mesaj: "Profile Successfully deleted !!!"
        })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            Err: err.code
        })
    })

}


//delete user from system
//delete user
exports.deleteUser = (req, res) => {

    const generalUserDocument = db.doc(`/userGeneral/${req.user.eMail}`);
    const cardUrlfield = db.doc(`/cardUrlLinks/${req.user.secretKod}`);
    // get the reference to the doc
    //let docRef=this.db.doc(`ProfileUser/${userId}/followersCount/FollowersCount`);
    //firebase.auth().currentUser.delete() All Account
    admin.auth().deleteUser(req.user.uid).then(() => {
            console.log('Successfully deleted user');
        })
        .catch((error) => {
            console.log('Error deleting user:', error);
        });

    generalUserDocument.get().then((doc) => {
        generalUserDocument.delete();

    }).then(() => {
        console.log("user deleted")
        if (req.user.secretKod) {
            // remove the {currentUserId} field from the document
            cardUrlfield.update({
                [currentUserId]: firebase.firestore.FieldValue.delete()
            })
        }

    }).then(() => {
        return res.json({
            Mesaj: "user succesfully deleted !!!"
        })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            Err: err.code
        })
    })


}


//single user data Info with userName, userView
exports.singleUserInfo = (req, res) => {

    let singleUserData = {}

    // db.doc(`/userabd/${req.params.eMail}`).get()
    db.collection("userGeneral").where("userHandleName", "==", req.params.userHandleName).get().then((doc) => {
        if (!doc.empty) {
            return db.collection("cardUrlLinks").where("userHandleName", "==", req.params.userHandleName).get();
        } else {
            return res.status(404).json({
                Error: "we dont't have such user"
            });
        }

    }).then((data) => {
        singleUserData.dataInfo = [];
        data.forEach(doc => {
            singleUserData.dataInfo.push({
                publicName: doc.data().publicName,
                publicSurname: doc.data().publicSurname,
                userHandleName: doc.data().userHandleName,
                eMail: doc.data().eMail,
                generalUserId: doc.data().generalUserId,
                generalProfilId: doc.id
            })
        })

        console.log("genraluserId:", singleUserData.dataInfo[0].generalUserId)

        return db.collection("profilesOfGeneralUser").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).get()

        //return res.json(singleUserData);
    }).then((data) => {
        singleUserData.allSubProfileInfo = [];
        data.forEach(doc => {
            singleUserData.allSubProfileInfo.push({
                publicName: doc.data().publicName,
                publicSurName: doc.data().publicSurname,
                generalUserId: doc.data().generalUserId,
                profileTag: doc.data().profileTag,
                eMail: doc.data().eMail,
                backgorundImage: doc.data().backgorundImage,
                profileUrl: doc.data().profileUrl,
                statusMode: doc.data().statusMode,
                dateofCreation: doc.data().dateofCreation,
                phoneNumber: doc.data().phoneNumber,
                profilDescription: doc.data().profilDescription,
                profileAdres: doc.data().profileAdres,
                profileBanner: doc.data().profileBanner,
                profileCompany: doc.data().profileCompany,
                profileEmail: doc.data().profileEmail,
                profileTheme: doc.data().profileTheme,
                placeOfSocialMediaPosition: doc.data().placeOfSocialMediaPosition,
                position: doc.data().position,
                statusOfUrl: doc.data().statusOfUrl
            })
        })

        return db.collection("userSocialMediaUrl").where("generalUserId", "==", singleUserData.allSubProfileInfo[0].generalUserId).get()

    }).then((data) => {

        singleUserData.allsocial = []
        data.forEach((doc) => {
            singleUserData.allsocial.push(doc.data());
        })
    })

    .then(() => {
        return res.json(singleUserData);
    }).catch(err => {
        console.error(err)
        return res.status(500).json({
            Error: err.code
        })
    })

}

//single user data Info with generaluserId from userView
exports.singleUserInfoWithgeneraluserId = (req, res) => {

    let singleUserData = {}
        // db.doc(`/userabd/${req.params.eMail}`).get()
    db.collection("userGeneral").where("generalUserId", "==", req.params.userId).get().then((doc) => {
        if (!doc.empty) {
            return db.collection("cardUrlLinks").where("generalUserId", "==", req.params.userId).get();
        } else {
            return res.status(404).json({
                Error: "we dont't have such user"
            });

        }

    }).then((data) => {
        singleUserData.dataInfo = [];
        data.forEach(doc => {
            singleUserData.dataInfo.push({
                publicName: doc.data().publicName,
                publicSurname: doc.data().publicSurname,
                userHandleName: doc.data().userHandleName,
                eMail: doc.data().eMail,
                generalUserId: doc.data().generalUserId
            })
        })
        return db.collection("profilesOfGeneralUser").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).get()

    }).then((data) => {
        singleUserData.allSubProfileInfo = [];
        data.forEach(doc => {
            singleUserData.allSubProfileInfo.push({
                publicName: doc.data().publicName,
                publicSurName: doc.data().publicSurName,
                profileTag: doc.data().profileTag,
                generalUserId: doc.data().generalUserId,
                eMail: doc.data().eMail,
                backgorundImage: doc.data().backgorundImage,
                profileUrl: doc.data().profileUrl,
                statusMode: doc.data().statusMode,
                dateofCreation: doc.data().dateofCreation,
                phoneNumber: doc.data().phoneNumber,
                profilDescription: doc.data().profilDescription,
                orderOfProfile: doc.data().orderOfProfile,
                profileAdres: doc.data().profileAdres,
                profileBanner: doc.data().profileBanner,
                profileCompany: doc.data().profileCompany,
                profileEmail: doc.data().profileEmail,
                profileTheme: doc.data().profileTheme,
                placeOfSocialMediaPosition: doc.data().placeOfSocialMediaPosition,
                position: doc.data().position,
                statusOfUrl: doc.data().statusOfUrl,
                profileId: doc.id,
                taxNumber: doc.data().taxNumber,
                telNumber: doc.data().telNumber,
                websiteUrlLink: doc.data().websiteUrlLink,
                taxAdministration: doc.data().taxAdministration,
                companyStatus: doc.data().companyStatus,
                officeEmail: doc.data().officeEmail,
                officePhoneNumber: doc.data().officePhoneNumber,
                location: doc.data().location
            })
        })

        return db.collection("userSocialMediaUrl").where("generalUserId", "==", singleUserData.allSubProfileInfo[0].generalUserId).where("statuMode", "==", true).get()

    }).then((data) => {
        singleUserData.allsocial = []
        data.forEach((doc) => {
            singleUserData.allsocial.push(doc.data());
        })

        return db.collection("bankData").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get()

    }).then((data) => {

        singleUserData.allPanelInfo = []

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({


                bankDataAll: doc.data().bankDataAll,
                profileId: doc.data().profileId,
                BankDataId: doc.id,
                statueMode: doc.data().statueMode,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                OrderId: doc.data().OrderId,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle


            });
        })

        return db.collection("contactData").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();


    }).then((data) => {

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({

                panelEmailPostas: doc.data().panelEmailPostas,
                panelPhoneNumbers: doc.data().panelPhoneNumbers,
                profilId: doc.data().profilId,
                profileCity: doc.data().profileCity,
                profileCountry: doc.data().profileCountry,
                profileNot: doc.data().profileNot,
                profilePosition: doc.data().profilePosition,
                publicName: doc.data().publicName,
                publicOrganization: doc.data().publicOrganization,
                publicsurname: doc.data().publicsurname,
                streetAdress: doc.data().streetAdress,
                statueMode: doc.data().statueMode,
                contactDataId: doc.id,
                isOpen: doc.data().isOpen,
                profileId: doc.data().profileId,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                OrderId: doc.data().OrderId,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,


            });
        })

        return db.collection("documentDataForm").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();

    }).then((data) => {

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({

                statusNameSurname: doc.data().statusNameSurname,
                statusEmail: doc.data().statusEmail,
                statusTelefon: doc.data().statusTelefon,
                statusMessage: doc.data().statusMessage,
                emailToSend: doc.data().emailToSend,
                publicstreetAdress: doc.data().publicstreetAdress,
                publicDropNot: doc.data().publicDropNot,
                OrderId: doc.data().OrderId,
                type: doc.data().type,
                isOpen: doc.data().isOpen,
                profileId: doc.data().profileId,
                isDeleteOpen: doc.data().isDeleteOpen,
                documentDataFormId: doc.id,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,
            });
        })

        return db.collection("fileUploadDocument").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();

    }).then((data) => {

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({

                belgeDocumentUploads: doc.data().belgeDocumentUploads,
                belgeDocumentId: doc.id,
                OrderId: doc.data().OrderId,
                isOpen: doc.data().isOpen,
                profileId: doc.data().profileId,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle





            });
        })

        return db.collection("panelUrlLinkOfUser").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();
        // db.collection("panelUrlLinkOfUser").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId)

    }).then((data) => {
        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({


                profileUrlPanel: doc.data().profileUrlPanel,
                panelProfileUrlDataId: doc.id,
                OrderId: doc.data().OrderId,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,
                profileId: doc.data().profileId



            });
        })

        return db.collection("BillFaturaData").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();


    }).then((data) => {

        data.forEach((doc) => {


            singleUserData.allPanelInfo.push({
                taxNumber: doc.data().taxNumber,
                taxAdministration: doc.data().taxAdministration,
                companyStatus: doc.data().companyStatus,
                officeEmail: doc.data().officeEmail,
                officePhoneNumber: doc.data().officePhoneNumber,
                location: doc.data().location,
                faturaDataId: doc.id,
                OrderId: doc.data().OrderId,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,
                profileId: doc.data().profileId
            });


        })


    }).then(() => {
        return res.json(singleUserData);
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            Error: err
        })
    })
}

//single user data Info with generalUserId from preview page Auth
exports.singleUserInfoWithgeneraluserIdPreviewPageToken = (req, res) => {
    let singleUserData = {}
        // db.doc(`/userabd/${req.params.eMail}`).get()
    db.collection("userGeneral").where("generalUserId", "==", req.params.userId).get().then((doc) => {
        if (!doc.empty) {
            return db.collection("cardUrlLinks").where("generalUserId", "==", req.params.userId).get();
        } else {
            return res.status(404).json({
                Error: "we dont't have such user"
            });

        }

    }).then((data) => {
        singleUserData.dataInfo = [];
        data.forEach(doc => {
            singleUserData.dataInfo.push({
                publicName: doc.data().publicName,
                publicSurname: doc.data().publicSurname,
                userHandleName: doc.data().userHandleName,
                eMail: doc.data().eMail,
                generalUserId: doc.data().generalUserId
            })
        })
        return db.collection("profilesOfGeneralUser").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).get()

    }).then((data) => {
        singleUserData.allSubProfileInfo = [];
        data.forEach(doc => {
            singleUserData.allSubProfileInfo.push({
                publicName: doc.data().publicName,
                publicSurName: doc.data().publicSurName,
                profileTag: doc.data().profileTag,
                generalUserId: doc.data().generalUserId,
                eMail: doc.data().eMail,
                backgorundImage: doc.data().backgorundImage,
                profileUrl: doc.data().profileUrl,
                statusMode: doc.data().statusMode,
                dateofCreation: doc.data().dateofCreation,
                phoneNumber: doc.data().phoneNumber,
                profilDescription: doc.data().profilDescription,
                orderOfProfile: doc.data().orderOfProfile,
                profileAdres: doc.data().profileAdres,
                profileBanner: doc.data().profileBanner,
                profileCompany: doc.data().profileCompany,
                profileEmail: doc.data().profileEmail,
                profileTheme: doc.data().profileTheme,
                placeOfSocialMediaPosition: doc.data().placeOfSocialMediaPosition,
                position: doc.data().position,
                statusOfUrl: doc.data().statusOfUrl,
                profileId: doc.id,
                taxNumber: doc.data().taxNumber,
                telNumber: doc.data().telNumber,
                websiteUrlLink: doc.data().websiteUrlLink,
                taxAdministration: doc.data().taxAdministration,
                companyStatus: doc.data().companyStatus,
                officeEmail: doc.data().officeEmail,
                officePhoneNumber: doc.data().officePhoneNumber,
                location: doc.data().location
            })
        })

        return db.collection("userSocialMediaUrl").where("generalUserId", "==", singleUserData.allSubProfileInfo[0].generalUserId).where("statuMode", "==", true).get()

    }).then((data) => {
        singleUserData.allsocial = []
        data.forEach((doc) => {
            singleUserData.allsocial.push(doc.data());
        })

        return db.collection("bankData").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get()

    }).then((data) => {

        singleUserData.allPanelInfo = []

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({
                accountOwner: doc.data().accountOwner,
                bankIban: doc.data().bankIban,
                bankName: doc.data().bankName,
                bankStation: doc.data().bankStation,
                profileId: doc.data().profileId,
                BankDataId: doc.id,
                statueMode: doc.data().statueMode,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                OrderId: doc.data().OrderId
            });
        })

        return db.collection("contactData").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();


    }).then((data) => {

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({

                kisiselEmail: doc.data().kisiselEmail,
                kisiselTelefon: doc.data().kisiselTelefon,
                kurumsalEmail: doc.data().kurumsalEmail,

                profilId: doc.data().profilId,
                profileCity: doc.data().profileCity,
                profileCountry: doc.data().profileCountry,
                profileNot: doc.data().profileNot,
                profilePosition: doc.data().profilePosition,
                publicName: doc.data().publicName,
                publicOrganization: doc.data().publicOrganization,
                publicsurname: doc.data().publicsurname,
                streetAdress: doc.data().streetAdress,
                statueMode: doc.data().statueMode,
                profileId: doc.data().profileId,
                contactDataId: doc.id,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                OrderId: doc.data().OrderId


            });
        })

        return db.collection("documentDataForm").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();

    }).then((data) => {

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({
                statusNameSurname: doc.data().statusNameSurname,
                statusEmail: doc.data().statusEmail,
                statusTelefon: doc.data().statusTelefon,
                statusMessage: doc.data().statusMessage,
                emailToSend: doc.data().emailToSend,
                publicstreetAdress: doc.data().publicstreetAdress,
                publicDropNot: doc.data().publicDropNot,
                OrderId: doc.data().OrderId,
                profileId: doc.data().profileId,
                type: doc.data().type,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                documentDataFormId: doc.id,
                statueMode: doc.data().statueMode
            });
        })

        return db.collection("fileUploadDocument").orderBy("OrderId", "asc").where("generalUserId", "==", singleUserData.dataInfo[0].generalUserId).where("statueMode", "==", true).get();

    }).then((data) => {

        data.forEach((doc) => {
            singleUserData.allPanelInfo.push({
                belgeDocument: doc.data().belgeDocument,
                belgeDocumentId: doc.id,
                OrderId: doc.data().OrderId,
                isOpen: doc.data().isOpen,
                profileId: doc.data().profileId,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                statueMode: doc.data().statueMode
            });
        })


    }).then(() => {
        return res.json(singleUserData);
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            Error: err
        })
    })
}



//kayıtlı olan  kullanıcı bilgileri Getir
exports.getAuthenticatedUser = ((req, res) => {
    let userDataInfo = {}

    db.doc(`/userGeneral/${req.user.eMail}`).get().then((doc) => {

        if (doc.exists) {
            userDataInfo.credentials = doc.data(); //userCredentials olabilir

            return db.collection("profilesOfGeneralUser").where("generalUserId", "==", req.user.generalUserId).get()

        }
    }).then((data) => {
        userDataInfo.profileofGeneralUser = []

        data.forEach((doc) => {
            userDataInfo.profileofGeneralUser.push({

                publicSurName: doc.data().publicSurName,
                profileUrl: doc.data().profileUrl,
                profilDescription: doc.data().profilDescription,
                customUrl: doc.data().customUrl,
                phoneNumber: doc.data().phoneNumber,

                backgorundImage: doc.data().backgorundImage,
                profileTag: doc.data().profileTag,
                eMail: doc.data().eMail,
                profileAdres: doc.data().profileAdres,
                profileCompany: doc.data().profileCompany,
                telNumber: doc.data().telNumber,
                profileEmail: doc.data().profileEmail,
                statusOfUrl: doc.data().statusOfUrl,
                orderOfProfile: doc.data().orderOfProfile,
                dateofCreation: doc.data().dateofCreation,
                generalUserId: doc.data().generalUserId,
                publicName: doc.data().publicName,
                position: doc.data().position,
                profileTheme: doc.data().profileTheme,
                placeOfSocialMediaPosition: doc.data().placeOfSocialMediaPosition,
                profileId: doc.id,
                taxNumber: doc.data().taxNumber,
                websiteUrlLink: doc.data().websiteUrlLink,
                taxAdministration: doc.data().taxAdministration,
                companyStatus: doc.data().companyStatus,
                officeEmail: doc.data().officeEmail,
                officePhoneNumber: doc.data().officePhoneNumber,
                location: doc.data().location

            });
        })

    }).then(() => {
        return res.json(userDataInfo)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })

})





//all SubAccount get
exports.getAllSubprofileOfGeneralUser = ((req, res) => {
        let subUserDataInfo = {}

        const allSubprofile = db.collection("profilesOfGeneralUser").where("generalUserId", "==", req.user.generalUserId)

        allSubprofile.get().then((data) => {
            subUserDataInfo.personalInfo = []
            console.log("hatalar ehere")
            data.forEach((doc) => {
                subUserDataInfo.personalInfo.push({
                    eMail: doc.data().eMail,
                    profileTag: doc.data().profileTag,
                    customUrl: doc.data().customUrl,
                    dateofCreation: doc.data().dateofCreation,
                    publicSurName: doc.data().publicSurName,
                    profilDescription: doc.data().profilDescription,
                    profileAdres: doc.data().profileAdres,
                    profileEmail: doc.data().profileEmail,
                    backgorundImage: doc.data().backgorundImage,
                    profileCompany: doc.data().profileCompany,
                    generalUserId: doc.data().generalUserId,
                    profileTheme: doc.data().profileTheme,
                    statusOfUrl: doc.data().statusOfUrl,
                    publicName: doc.data().publicName,
                    orderOfProfile: doc.data().orderOfProfile,
                    phoneNumber: doc.data().phoneNumber,
                    telNumber: doc.data().telNumber,
                    statusMode: doc.data().statusMode,
                    websiteUrlLink: doc.data().websiteUrlLink,
                    profileUrl: doc.data().profileUrl,
                    SubprofileId: doc.id
                });
            })
        }).then(() => {
            console.log("veiler:", subUserDataInfo)
            return res.json(subUserDataInfo)
        }).catch(() => {
            return res.status(400).json({
                errorgetSuprofile: "error wihle..."
            })
        })

    })
    ///check all handleName



// userUpdate Info DATA
exports.updateGeneralUserData = (req, res) => {
    let infoToChange = reduceGeneralUserInfo(req.body);
    db.doc(`/userGeneral/${req.user.eMail}`).update(infoToChange).then(() => {

        return res.json({
            success: "Successfully updated!"
        })

    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })

    if (req.user.secretKod) {
        db.doc(`/cardUrlLinks/${req.user.secretKod}`).update(infoToChange).then(() => {
            return res.json({
                Mesaj: "Successfully updated!!"
            })
        }).catch((err) => {
            console.error(err)
            return res.status(500).json({
                err: err.code
            })
        })
    }
}

// update of single profile
exports.updateSingleUserData = (req, res) => {

    let infoToChange = reduceSingleUserInfo(req.body);
    const subProfilDocument = db.doc(`/profilesOfGeneralUser/${req.params.profilId}`);
    subProfilDocument.update(infoToChange).then(() => {

        return res.json({
            success: "Succvessfully updated!"
        })

    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}

// all social media of a single user with Auth
exports.getallSocialMediaofSingleprofile = ((req, res) => {
    let socialMedia = {}

    const allsocialMedia = db.collection("userSocialMediaUrl").where("profileId", "==", req.params.profileId)

    allsocialMedia.get().then((data) => {
        socialMedia.allsocial = []

        data.forEach((doc) => {
            socialMedia.allsocial.push({
                eMail: doc.data().eMail,
                socialtype: doc.data().socialtype,
                socialUrlLink: doc.data().socialUrlLink,
                profileId: doc.data().profileId,
                statuMode: doc.data().statuMode,
                generalUserId: doc.data().generalUserId,
                socialMediaUrlId: doc.id,
                socialOrder: doc.data().socialOrder
            });
        })
    }).then(() => {
        return res.json(socialMedia)
    }).catch(() => {
        return res.status(400).json({
            errorgetSuprofile: "error wihle..."
        })
    })

})

//get All Social Media from there

// exports.getallSocialMediaofSingleprofileFromUrlPanel = ((req, res) => {


//     let socialMedia = {}

//     const allsocialMedia = db.collection("panelUrlLinkOfUser").where("profileId", "==", req.params.profileId)

//     allsocialMedia.get().then((data) => {


//         socialMedia.allsocial = []

//         data.forEach((doc) => {
//             socialMedia.allsocial.push({

//                 profileUrlPanel: doc.data().profileUrlPanel,
//                 OrderId: doc.data().OrderId,
//                 type: doc.data().type,
//                 profileId: doc.data().profileId,
//                 statueMode: doc.data().statueMode

//                 // eMail: doc.data().eMail,
//                 // socialtype: doc.data().socialtype,
//                 // socialUrlLink: doc.data().socialUrlLink,
//                 // profileId: doc.data().profileId,
//                 // statuMode: doc.data().statuMode,
//                 // generalUserId: doc.data().generalUserId,
//                 // socialMediaUrlId: doc.id,
//                 // socialOrder: doc.data().socialOrder


//             });
//         })
//     }).then(() => {
//         return res.json(socialMedia)
//     }).catch(() => {
//         return res.status(400).json({ errorgetSuprofile: "error wihle..." })
//     })

// })


// sosyal Media gucelleme
exports.socialUrlUpdate = (req, res) => {

    if (req.body.socialUrlLink.trim() === "") {
        return res.status(400).json({
            Error: "This Url can't be Empty!!"
        });
    }

    if (req.body.socialtype.trim() === "") {
        return res.status(400).json({
            Error: "This Url can't be Empty!!"
        });
    }

    const newComments = {
        socialUrlLink: req.body.socialUrlLink,
        socialtype: req.body.socialtype,
        statuMode: req.body.statuMode,
        socialOrder: req.body.socialOrder
    }

    db.doc(`/userSocialMediaUrl/${req.params.socialMediaId}`).update(newComments).then(() => {

        return res.json({
            success: "Succvessfully updated!"
        })
    }).catch(err => {
        console.log(err)
        return res.status(500).json({
            Error: err.code
        })
    })
}

// delete social media of a profile
exports.deleteSocialMediaOfProfile = (req, res) => {
    const subProfilDocument = db.doc(`/userSocialMediaUrl/${req.params.socialMediaId}`);
    subProfilDocument.get().then((doc) => {
        if (!doc.exists) {
            return res.status(404).json({
                Error: "Social Media Not Found!!"
            });
        }
        if (doc.data().genralUserId !== req.user.genralUserId) {
            return res.status(403).json({
                Error: "don't have permission to delete socialMedia  !!"
            })
        } else {
            return subProfilDocument.delete();
        }

    }).then(() => {
        return res.json({
            Mesaj: "Profile Successfully deleted !!!"
        })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            Err: err.code
        })
    })
}

//panel contact Info register
exports.postContactInfopanel = (req, res) => {

    let takenPhoneNumber = req.body.takenPhoneNumber
    let takenEmailEposta = req.body.takenEmailEposta

    // let takenDefaultNumber = req.body.takenDefaultNumber
    //let takenDefaultEmail = req.body.takenDefaultEmail

    const createContact = {
        publicName: req.body.publicName,
        publicsurname: req.body.publicsurname,
        publicOrganization: req.body.publicOrganization,
        profilePosition: req.body.profilePosition,
        panelPhoneNumbers: [{
            "phoneNumber": takenPhoneNumber != "" ? takenPhoneNumber : "",
            "defaultNumber": true
        }],
        panelEmailPostas: [{
            "emailPosta": takenEmailEposta != "" ? takenEmailEposta : "",
            "defaultEmaill": true
        }],
        streetAdress: req.body.streetAdress,
        profileCountry: req.body.profileCountry,
        profileCity: req.body.profileCity,
        profileNot: req.body.profileNot,
        generalUserId: req.user.generalUserId,
        // generalUserId: req.body.generalUserId,
        profileId: req.params.profileId,
        statueMode: true,
        panelTitle: "",
        OrderId: req.body.OrderId,
        isOpen: false,
        isDeleteOpen: false,
        isEditTitle: false,
        type: "conatctAddForm"

    }



    // db.doc(`/cardUrlDate/${cardLinkData.generalUserId}`).update({
    //     clickDate: admin.firestore.FieldValue.arrayUnion(new Date().toISOString())
    // }).then(()

    db.collection("contactData").add(createContact).then((data) => {
        const resScream = createContact
        resScream.contactDataId = data.id
        res.json({
            resScream
        });
    }).catch((err) => {
        res.status(500).json({
            error: "something went wrong!!"
        });
        console.error(err)
    })


}

// post Fatura Panel from here
exports.postFaturaBillInfopanel = (req, res) => {


    const createBillData = {

        taxNumber: req.body.taxNumber,
        taxAdministration: req.body.taxAdministration,
        companyStatus: req.body.companyStatus,
        officeEmail: req.body.officeEmail,
        officePhoneNumber: req.body.officePhoneNumber,
        location: req.body.location,

        generalUserId: req.user.generalUserId,
        profileId: req.params.profileId,
        statueMode: true,
        panelTitle: "",
        OrderId: req.body.OrderId,
        isOpen: false,
        isDeleteOpen: false,
        isEditTitle: false,
        type: "faturaData"

    }

    // db.doc(`/cardUrlDate/${cardLinkData.generalUserId}`).update({
    //     clickDate: admin.firestore.FieldValue.arrayUnion(new Date().toISOString())
    // }).then(()

    db.collection("BillFaturaData").add(createBillData).then((data) => {
        const resScream = createContact
        resScream.faturaDataId = data.id
        res.json({
            resScream
        });
    }).catch((err) => {
        res.status(500).json({
            error: "something went wrong!!"
        });
        console.error(err)
    })
}


exports.updateLinkCardToReadOnce = async(req, res) => {

    // let firstRead = req.body.firstRead
    // let slug = req.body.slug

    let cardUrlData = []

    db.collection("cardUrlLinks").get().then((data) => {



        data.forEach((doc) => {

            cardUrlData.push(

                {
                    eMail: doc.data().eMail,
                    cardUrlId: doc.id
                }

            )
        });

        // return res.json(userPhone)
    }).then(() => {

        // console.log("NumaraSayısı:", cardUrlData.length)
        // return res.json(cardUrlData)


        cardUrlData.forEach((v, i, array) => {

            console.log("dataHere", v.cardUrlId)

            if (v.cardUrlId) {

                console.log("tourata", v.cardUrlId)



                db.doc(`/cardUrlLinks/${v.cardUrlId}`).update({ firstRead: true }).then(() => {
                    console.log("daatSebdf", v.cardUrlId)

                }).catch((err) => {

                    console.log(err)

                })



            }


        })



    }).then(() => {

        return res.json({
            Success: "SuccessFully Updated !!!"
        })


    }).catch(err => {

        console.error(err)

    })



}




////Post Fatura To delete Later

exports.postFaturaBillInfopanelLater = (req, res) => {


    const createBillData = {

        taxNumber: req.body.taxNumber,
        taxAdministration: req.body.taxAdministration,
        companyStatus: req.body.companyStatus,
        officeEmail: req.body.officeEmail,
        officePhoneNumber: req.body.officePhoneNumber,
        location: req.body.location,

        generalUserId: req.body.generalUserId,
        profileId: req.params.profileId,
        statueMode: true,
        panelTitle: "",
        OrderId: req.body.OrderId,
        isOpen: false,
        isDeleteOpen: false,
        isEditTitle: false,
        type: "faturaData"

    }

    // db.doc(`/cardUrlDate/${cardLinkData.generalUserId}`).update({
    //     clickDate: admin.firestore.FieldValue.arrayUnion(new Date().toISOString())
    // }).then(()

    db.collection("BillFaturaData").add(createBillData).then((data) => {
        const resScream = createContact
        resScream.faturaDataId = data.id
        res.json({
            resScream
        });
    }).catch((err) => {
        res.status(500).json({
            error: "something went wrong!!"
        });
        console.error(err)
    })



}



// panel Bank Info register

exports.postBanInfopanel = (req, res) => {

    let accountOwner = req.body.accountOwner;
    let bankName = req.body.bankName;
    let bankStation = req.body.bankStation;
    let bankIban = req.body.bankIban;
    let bankAccountNumber = req.body.bankAccountNumber


    const createBank = {

        bankDataAll: [{
            "accountOwner": accountOwner,
            "bankName": bankName,
            "bankStation": bankStation,
            "bankIban": bankIban,
            "bankAccountNumber": bankAccountNumber
        }],
        profileId: req.params.profileId,
        generalUserId: req.user.generalUserId,
        // generalUserId: req.body.generalUserId,
        isOpen: false,
        panelTitle: "",
        isDeleteOpen: false,
        isEditTitle: false,
        statueMode: true,
        OrderId: req.body.OrderId,
        type: "bankform",

    }


    db.collection("bankData").add(createBank).then((data) => {

        const resScream = createBank
        resScream.bankId = data.id
        res.json({
            resScream
        });


    }).catch((err) => {

        res.status(500).json({
            error: "something went wrong!!"
        });
        console.error(err)
    })


}


//post document to data where to send

exports.postDocumentInfopanel = (req, res) => {

    const createDocument = {
        statusNameSurname: req.body.statusNameSurname,
        statusEmail: req.body.statusEmail,
        statusTelefon: req.body.statusTelefon,
        statusMessage: req.body.statusMessage,
        profileId: req.params.profileId,
        emailToSend: req.body.emailToSend,
        publicstreetAdress: req.body.publicstreetAdress,
        generalUserId: req.user.generalUserId,
        publicDropNot: req.body.publicDropNot,
        OrderId: req.body.OrderId,
        panelTitle: "",
        statueMode: true,
        isEditTitle: false,
        isOpen: false,
        isDeleteOpen: false,
        type: "documentForm"
    }
    db.collection("documentDataForm").add(createDocument).then((data) => {

        const resScream = createDocument
        resScream.doncumentDataId = data.id
        res.json({
            resScream
        });
    }).catch((err) => {
        res.status(500).json({
            error: "something went wrong!!"
        });
        console.error(err)
    })
}

//post Panel Linki URL
exports.postUrlLinkiInfopanel = (req, res) => {

    //let panelUrlLinkadd = req.body.panelUrlLink


    let socialUrlLinkvariable = req.body.socialUrlLink
    let socialTypeVariable = req.body.socialtype
    let socialOrder = req.body.socialOrder


    const createSocialInfo = {

        socialUrlLink: socialUrlLinkvariable,
        socialtype: "web",
        profileId: req.params.profileId,
        eMail: req.user.eMail,
        statuMode: true,
        socialOrder: socialOrder

    }

    const createContact = {

        profileUrlPanel: [

            //     {

            //     "socialUrlLink": socialUrlLinkvariable,
            //     "socialtype": socialTypeVariable,
            //     "eMail": req.user.eMail,
            //     "generalUserId": req.user.generalUserId,
            //     "profileId": req.params.profileId,
            //     "statuMode": true,
            //     "socialOrder": socialOrder,
            //     "socialUrlHead": "http://",
            //     "placeholder": "",
            //     "socialMediaLinkMatch": ""

            // }


        ],
        generalUserId: req.user.generalUserId,
        profileId: req.params.profileId,
        statueMode: true,
        panelTitle: "",
        OrderId: req.body.OrderId,
        isOpen: false,
        isDeleteOpen: false,
        isEditTitle: false,
        type: "urlLinkPanel"
    }



    db.collection("panelUrlLinkOfUser").add(createContact).then((data) => {

        //db.collection("userSocialMediaUrl").add(createSocialInfo)

    }).then((data) => {

        const resScream = createContact

        // resScream.contactDataId = data.id

        res.json({
            resScream
        });
    }).catch((err) => {
        res.status(500).json({
            error: "something went wrong!!"
        });
        console.error(err)
    })

}


//expose social add all form heer
exports.postUrlLinkiInfopanelllll = (req, res) => {

    //let panelUrlLinkadd = req.body.panelUrlLink


    let socialUrlLinkvariable = req.body.socialUrlLink
    let socialTypeVariable = req.body.socialtype
    let socialOrder = req.body.socialOrder
    let emaill = req.body.eMail
    let genaraluseridd = req.body.generalUserId


    const createSocialInfo = {

        socialUrlLink: socialUrlLinkvariable,
        socialtype: req.body.socialtype,
        profileId: req.params.profileId,
        generalUserId: genaraluseridd,
        eMail: emaill,
        statuMode: true,
        socialOrder: socialOrder

    }

    const createContact = {

        profileUrlPanel: [{

            "socialUrlLink": socialUrlLinkvariable,
            "socialtype": socialTypeVariable,
            "eMail": emaill,
            "generalUserId": genaraluseridd,
            "profileId": req.params.profileId,
            "statuMode": true,
            "socialOrder": socialOrder,
            "socialUrlHead": "http://",
            "placeholder": "",
            "socialMediaLinkMatch": ""

        }],
        generalUserId: genaraluseridd,
        profileId: req.params.profileId,
        statueMode: true,
        panelTitle: "",
        OrderId: req.body.OrderId,
        isOpen: false,
        isDeleteOpen: false,
        isEditTitle: false,
        type: "urlLinkPanel"
    }



    db.collection("panelUrlLinkOfUser").add(createContact).then((data) => {

        db.collection("userSocialMediaUrl").add(createSocialInfo)

    }).then((data) => {

        const resScream = createContact
            // resScream.contactDataId = data.id
        res.json({
            resScream
        });
    }).catch((err) => {
        res.status(500).json({
            error: "something went wrong!!"
        });
        console.error(err)
    })

}


//updatae  Url Linki always from here
exports.updateURLpanelLinki = (req, res) => {

    let contactbilgi = reduceUrlPanelInfo(req.body);
    db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update(contactbilgi).then(() => {
        return res.json({
            Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })

}


// panelUrl Link rewirte Again

exports.updateProfileUrlFromAfterDelete = (req, res) => {

    // example from here

    let oldSocialMatch = req.body.oldSocialMediaMatch
    let socialUrlLink = req.body.socialUrlLink
    let socialType = req.body.socialtype
    let profileId = req.body.profileId
    let socialOrderr = req.body.socialOrder
    let socialHead = req.body.socialUrlHead
    let placeHolderr = req.body.placeholder





    db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update({

        profileUrlPanel: admin.firestore.FieldValue.arrayRemove({
            "eMail": req.user.eMail,
            "generalUserId": req.user.generalUserId,
            "socialOrder": req.body.oldSocialorder,
            "socialUrlHead": req.body.oldSocialHead,
            "socialUrlLink": req.body.oldSocialUrlLink,
            "socialtype": req.body.oldSocialType,
            "statuMode": req.body.oldStatueMode,
            "placeholder": req.body.oldplaceHolder,
            "socialMediaLinkMatch": oldSocialMatch
        })

    }).then(() => {

        if (oldSocialMatch === "" || oldSocialMatch === undefined) {

            console.log("okconto")

            const newComments = {

                socialUrlLink: socialUrlLink,
                socialtype: socialType,
                eMail: req.user.eMail,
                generalUserId: req.user.generalUserId,
                profileId: profileId,
                statuMode: true,
                socialOrder: socialOrderr,


            }

            db.collection("userSocialMediaUrl").add(newComments).then((doc) => {


                return newComments.socialMediaPanelId = doc.id


            }).then(() => {


                db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update({

                    profileUrlPanel: admin.firestore.FieldValue.arrayUnion({
                        "eMail": req.user.eMail,
                        "generalUserId": req.user.generalUserId,
                        "socialOrder": socialOrderr,
                        "socialUrlHead": socialHead,
                        "socialUrlLink": socialUrlLink,
                        "socialtype": socialType,
                        "statuMode": true,
                        "placeholder": req.body.placeholder,
                        "socialMediaLinkMatch": newComments.socialMediaPanelId
                    })

                })

                // res.json(newComments)

            }).catch(err => {
                console.log(err)
                return res.status(500).json({
                    Error: err.code
                })
            })


        } else {

            console.log("ElseGirdi")

            const newComments = {
                socialUrlLink: socialUrlLink
            }

            db.doc(`/userSocialMediaUrl/${oldSocialMatch}`).update(newComments).then(() => {




                db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update({

                    profileUrlPanel: admin.firestore.FieldValue.arrayUnion({
                        "eMail": req.user.eMail,
                        "generalUserId": req.user.generalUserId,
                        "socialOrder": socialOrderr,
                        "socialUrlHead": socialHead,
                        "socialUrlLink": socialUrlLink,
                        "socialtype": socialType,
                        "statuMode": true,
                        "placeholder": placeHolderr,
                        "socialMediaLinkMatch": oldSocialMatch
                    })

                })

            }).catch(err => {
                console.log(err)
                return res.status(500).json({
                    Error: err.code
                })
            })



        }


    }).then(() => {


        return res.json({

            SuccessMesaj: "PanelUrlGüncelledi Only"

        })

    })
}





//update Url Linki Array from heree
exports.updateProfileUrlLinksDataOnly = (req, res) => {

    let ArrayIndexTochange = req.body.arrayIndexthis
    let socialOrder = req.body.socialOrder
    let socialUrlHead = req.body.socialUrlHead
    let socialUrlLink = req.body.socialUrlLink
    let socialtype = req.body.socialtype
    let statuMode = req.body.statuMode
    let placeholder = req.body.placeholder
    let socialMediaLinkMatch = req.body.socialMediaLinkMatch

    //let profileId = req.body.profileId


    // const createSocialInfo = {

    //     socialUrlLink: socialUrlLink,
    //     socialtype: socialtype,
    //     profileId: profileId,
    //     eMail: req.user.eMail,
    //     statuMode: true,
    //     socialOrder: socialOrder

    // }


    let profilUrlArraysOfpanel = []
    db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).get().then((doc) => {

        profilUrlArraysOfpanel = doc.data().profileUrlPanel

    }).then(() => {

        if (profilUrlArraysOfpanel[ArrayIndexTochange] == undefined) {

            profilUrlArraysOfpanel.push({
                "eMail": req.user.eMail,
                "generalUserId": req.user.generalUserId,
                "socialOrder": socialOrder,
                "socialUrlHead": socialUrlHead,
                "socialUrlLink": socialUrlLink,
                "socialtype": socialtype,
                "statuMode": statuMode,
                "placeholder": placeholder,
                "socialMediaLinkMatch": socialMediaLinkMatch
            })


            return db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update({

                profileUrlPanel: profilUrlArraysOfpanel



            }).then(() => {


                return res.json({
                    Mesaj: "Array fazla, o yüzden Union Yapıldı pUSH!!"
                })


                // db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update({

                //     profileUrlPanel: admin.firestore.FieldValue.arrayUnion({

                //         "eMail": req.user.eMail,
                //         "generalUserId": req.user.generalUserId,
                //         "socialOrder": socialOrder,
                //         "socialUrlHead": socialUrlHead,
                //         "socialUrlLink": socialUrlLink,
                //         "socialtype": socialtype,
                //         "statuMode": statuMode,
                //         "placeholder": placeholder,

                //     })
                // }).then(() => {

                //     return res.json({ Mesaj: "Array fazla, o yüzden Union Yapıldı!!" })
                // }).catch((eror) => {
                //     return res.json({ Mesaj: "Union yaparken hata var!!" })
                // })


            }).catch((err) => {
                console.log("index fazla hata oluştu")
            })
        } else {

            profilUrlArraysOfpanel[ArrayIndexTochange].socialOrder = socialOrder;
            profilUrlArraysOfpanel[ArrayIndexTochange].socialUrlHead = socialUrlHead;
            profilUrlArraysOfpanel[ArrayIndexTochange].socialUrlLink = socialUrlLink;
            profilUrlArraysOfpanel[ArrayIndexTochange].socialtype = socialtype;
            profilUrlArraysOfpanel[ArrayIndexTochange].statuMode = statuMode;
            profilUrlArraysOfpanel[ArrayIndexTochange].placeholder = placeholder;
            profilUrlArraysOfpanel[ArrayIndexTochange].socialMediaLinkMatch = socialMediaLinkMatch;


        }

    }).then(() => {

        return db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update({
            profileUrlPanel: profilUrlArraysOfpanel
        }).then(() => {


            // db.doc(`/userSocialMediaUrl/${req.params.socialMediaId}`).update({
            //     eMail:req.user.eMail,
            //     generalUserId: req.user.generalUserId,
            //     socialOrder:socialOrder,
            //     socialtype: socialtype,
            //     statuMode:statuMode
            // })
            // socialUrlLink: socialUrlLink,
            //     socialtype: socialtype,
            //     profileId: profileId,
            //     eMail: req.user.eMail,
            //     statuMode: true,
            //     socialOrder: socialOrder

            // return db.collection("userSocialMediaUrl").add({

            //     socialUrlLink: "socialUrlLink",
            //     socialtype: "socialtype",
            //     profileId: "profileId",
            //     eMail: req.user.eMail,
            //     statuMode: true,
            //     socialOrder: "socialOrder"

            // })


        }).then(() => {

            return res.json({
                Mesaj: "Kullanıcı bilgileri doğru gücelendi index var!!"
            })


        }).catch((err) => {
            console.error(err)
            return res.status(500).json({
                err: err.code
            })

        })
    })



}


//belge yükle register Panel
exports.uploadFilePdf = (req, res) => {
    const BusBoy = require("busboy")
    const path = require("path")
    const os = require("os")
    const fs = require("fs")


    const busboy = BusBoy({
        headers: req.headers
    })

    let imageFileName;
    let imageToBeUploaded = {};


    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

        // if (Object.values(filename)[2] !== "image/jpeg" && Object.values(filename)[2] !== "image/png") {
        //     return res.status(400).json({ err: "Fotoğraf  png yada jpeg formatı olmak zorunda!!" })
        // }

        const trueFile = Object.values(filename)[0]

        const imageExtension = trueFile.split(".")[trueFile.split(".").length - 1];

        console.log("Extension here: ", imageExtension);

        imageFileName = `${Math.round(
            Math.random() * 1000000000000
          ).toString()}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        console.log("filePath:", filePath)

        imageToBeUploaded = {
            filePath,
            mimetype
        }

        //to create the file
        file.pipe(fs.createWriteStream(filePath));



    });
    busboy.on("finish", () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        }).then(() => {
            const imageUrlUploaded = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
            // if (req.user.secretKod){
            //     db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update({ belgeDocument: imageUrlUploaded })
            // }
            console.log("hee bak:", imageUrlUploaded)

            const fileUploadInfo = {
                belgeDocument: imageUrlUploaded,
                isOpen: false,
                isDeleteOpen: false,
                statueMode: true,
                isEditTitle: false,
                panelTitle: "",
                generalUserId: req.user.generalUserId,
                OrderId: 0,
                profileId: req.params.profileId,
                type: "uploadFileDocument"


            }
            return db.collection("fileUploadDocument").add(fileUploadInfo)

            //return (db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update({ belgeDocument: imageUrlUploaded }));


        }).then(() => {
            return res.json({
                mesaj: "File Successfully Updated"
            });
        }).catch(err => {
            console.error(err)
            return res.status(500).json({
                error: err.code
            })
        })

    });

    busboy.end(req.rawBody);

}

//create first Where to upload file from here
exports.postFirstPlaceWhereToPutUploadFilepanel = (req, res) => {


    let belgeDocumentTo = req.body.belgeDocument



    const fileUploadInfo = {

        belgeDocumentUploads: [{
            "belgeDocument": belgeDocumentTo,
            "fileIndex": 0
        }],
        isOpen: false,
        isDeleteOpen: false,
        statueMode: true,
        isEditTitle: false,
        panelTitle: "",
        generalUserId: req.user.generalUserId,
        OrderId: req.body.OrderId,
        profileId: req.params.profileId,
        type: "uploadFileDocument"

    }

    db.collection("fileUploadDocument").add(fileUploadInfo).then((data) => {

        const resScream = fileUploadInfo
        resScream.belgeDocumentId = data.id

        res.json({
            resScream
        });


    }).catch((err) => {
        res.status(500).json({
            error: "something went wrong!!"
        });
        console.error(err)
    })
}




//belgeyi yenle
exports.uploadFilePdfChange = (req, res) => {




    const BusBoy = require("busboy")
    const path = require("path")
    const os = require("os")
    const fs = require("fs")


    const busboy = BusBoy({
        headers: req.headers
    })

    let imageFileName;
    let imageToBeUploaded = {};


    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

        // if (Object.values(filename)[2] !== "image/jpeg" && Object.values(filename)[2] !== "image/png") {
        //     return res.status(400).json({ err: "Fotoğraf  png yada jpeg formatı olmak zorunda!!" })
        // }

        const trueFile = Object.values(filename)[0]

        const imageExtension = trueFile.split(".")[trueFile.split(".").length - 1];

        console.log("Extension here: ", imageExtension);

        imageFileName = `${Math.round(
            Math.random() * 1000000000000
          ).toString()}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(), imageFileName);
        console.log("filePath:", filePath)

        imageToBeUploaded = {
            filePath,
            mimetype
        }

        //to create the file
        file.pipe(fs.createWriteStream(filePath));


    });

    busboy.on("finish", () => {

        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }


        }).then(() => {

            const imageUrlUploaded = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;







            // if (req.user.secretKod){
            //     db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update({ belgeDocument: imageUrlUploaded })
            // }

            // const fileUploadInfo = {
            //     belgeDocument: imageUrlUploaded,
            //     isOpen: false,
            //     isDeleteOpen: false,
            //     statueMode: true,
            //     OrderId: 0,
            //     profileId: req.params.profileId,
            //     type: "uploadFileDocument"


            // }
            //return db.collection("fileUploadDocument").add(fileUploadInfo)

            //update ONLy Bank Info Array




            // let accountOwner = req.body.accountOwner;
            // let bankName = req.body.bankName;
            // let bankStation = req.body.bankStation;
            // let bankIban = req.body.bankIban;
            // let bankAccountNumber = req.body.bankAccountNumber





            let uploadofArraysOfpanel = []
                // let ArrayIndexTochange = req.body.arrayLentghToChange

            let arraySayac = 0;

            return db.doc(`/fileUploadDocument/${req.params.fileUploadDocumentId}`).get().then((doc) => {


                uploadofArraysOfpanel = doc.data().belgeDocumentUploads

                //console.log("uploadaData::", doc.data().belgeDocumentUploads)


            }).then(() => {


                uploadofArraysOfpanel.push({
                    "belgeDocument": imageUrlUploaded
                })

                return db.doc(`/fileUploadDocument/${req.params.fileUploadDocumentId}`).update({

                    belgeDocumentUploads: uploadofArraysOfpanel

                })



                // for (let index = 0; index <= 3; index++){

                //     console.log("arrayburada", uploadofArraysOfpanel)

                //     console.log("arrayburada", index)

                //     if (uploadofArraysOfpanel[index] == undefined) {

                //         uploadofArraysOfpanel.push({
                //             "belgeDocument": imageUrlUploaded
                //         })


                //         return db.doc(`/fileUploadDocument/${req.params.fileUploadDocumentId}`).update({

                //             belgeDocumentUploads: uploadofArraysOfpanel

                //         })

                //     } else {

                //         uploadofArraysOfpanel[index].belgeDocument = uploadofArraysOfpanel[arraySayac].belgeDocument;

                //         console.log("allFile", uploadofArraysOfpanel);

                //         return db.doc(`/fileUploadDocument/${req.params.fileUploadDocumentId}`).update({

                //             belgeDocumentUploads: uploadofArraysOfpanel


                //         }).then(() => {
                //             console.log("bauaraya girddi index var ")
                //         })
                //     }

                // }

            })

        }).then(() => {

            return res.json({
                mesaj: "File Successfully Updated"
            });


        }).catch(err => {
            console.error(err)
            return res.status(500).json({
                error: err.code
            })
        })

    });

    busboy.end(req.rawBody);

}

//exports get Bank Info
exports.getpanelInfFromHere = (req, res) => {

    let panelDataInfo = {}

    const allpanelProfile = db.collection("bankData").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId)

    let countId = 0

    console.log("ilk hata girdi")

    allpanelProfile.get().then((data) => {
        panelDataInfo.bankDataInfo = []

        data.forEach((doc) => {
            panelDataInfo.bankDataInfo.push({

                bankDataAll: doc.data().bankDataAll,
                profileId: doc.data().profileId,
                BankDataId: doc.id,
                statueMode: doc.data().statueMode,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                OrderId: doc.data().OrderId,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,
                clickCountNumber: doc.data().clickCountNumber ? doc.data().clickCountNumber : 0

            });
        })

        console.log("second hata girdi")
        return db.collection("contactData").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId).get();

    }).then((data) => {
        data.forEach((doc) => {
            panelDataInfo.bankDataInfo.push({
                panelEmailPostas: doc.data().panelEmailPostas,
                panelPhoneNumbers: doc.data().panelPhoneNumbers,
                profilId: doc.data().profilId,
                profileCity: doc.data().profileCity,
                profileCountry: doc.data().profileCountry,
                profileNot: doc.data().profileNot,
                profilePosition: doc.data().profilePosition,
                publicName: doc.data().publicName,
                publicOrganization: doc.data().publicOrganization,
                publicsurname: doc.data().publicsurname,
                streetAdress: doc.data().streetAdress,
                statueMode: doc.data().statueMode,
                contactDataId: doc.id,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                OrderId: doc.data().OrderId,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,
                clickCountNumber: doc.data().clickCountNumber ? doc.data().clickCountNumber : 0
            });
        })

        return db.collection("documentDataForm").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId).get();

    }).then((data) => {

        data.forEach((doc) => {
            panelDataInfo.bankDataInfo.push({

                statusNameSurname: doc.data().statusNameSurname,
                statusEmail: doc.data().statusEmail,
                statusTelefon: doc.data().statusTelefon,
                statusMessage: doc.data().statusMessage,
                emailToSend: doc.data().emailToSend,
                publicstreetAdress: doc.data().publicstreetAdress,
                publicDropNot: doc.data().publicDropNot,
                OrderId: doc.data().OrderId,
                type: doc.data().type,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                documentDataFormId: doc.id,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,
                clickCountNumber: doc.data().clickCountNumber ? doc.data().clickCountNumber : 0

            });
        })
        return db.collection("fileUploadDocument").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId).get();
    }).then((data) => {

        data.forEach((doc) => {

            panelDataInfo.bankDataInfo.push({
                belgeDocumentUploads: doc.data().belgeDocumentUploads,
                belgeDocumentId: doc.id,
                OrderId: doc.data().OrderId,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,
                clickCountNumber: doc.data().clickCountNumber ? doc.data().clickCountNumber : 0




            });
        })

        return db.collection("panelUrlLinkOfUser").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId).get();

    }).then((data) => {

        data.forEach((doc) => {

            panelDataInfo.bankDataInfo.push({
                profileUrlPanel: doc.data().profileUrlPanel,
                panelProfileUrlDataId: doc.id,
                OrderId: doc.data().OrderId,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,
                clickCountNumber: doc.data().clickCountNumber ? doc.data().clickCountNumber : 0

            });
        })

        return db.collection("BillFaturaData").orderBy("OrderId", "asc").where("profileId", "==", req.params.profileId).get();

    }).then((data) => {

        data.forEach((doc) => {

            panelDataInfo.bankDataInfo.push({

                taxNumber: doc.data().taxNumber,
                taxAdministration: doc.data().taxAdministration,
                companyStatus: doc.data().companyStatus,
                officeEmail: doc.data().officeEmail,
                officePhoneNumber: doc.data().officePhoneNumber,
                location: doc.data().location,
                faturaDataId: doc.id,
                OrderId: doc.data().OrderId,
                isOpen: doc.data().isOpen,
                isDeleteOpen: doc.data().isDeleteOpen,
                type: doc.data().type,
                statueMode: doc.data().statueMode,
                panelTitle: doc.data().panelTitle,
                isEditTitle: doc.data().isEditTitle,
                clickCountNumber: doc.data().clickCountNumber ? doc.data().clickCountNumber : 0

            });
        })

    }).then(() => {
        return res.json(panelDataInfo)
    }).catch((err) => {
        console.log("hata burada:", err)
        return res.status(400).json({
            errorgetPanel: err
        })
    })
}



// update bank Info
exports.updateBankInfo = (req, res) => {

    let bankbilgi = reduceBankInfo(req.body);
    db.doc(`/bankData/${req.params.bankDataId}`).update(bankbilgi).then(() => {

        return res.json({
            Mesaj: "Succesfully updated!!"
        })

    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })

}

//update ONLy Bank Info Array
exports.updateBankInfoArrayDataOnly = (req, res) => {

    let accountOwner = req.body.accountOwner;
    let bankName = req.body.bankName;
    let bankStation = req.body.bankStation;
    let bankIban = req.body.bankIban;
    let bankAccountNumber = req.body.bankAccountNumber

    let ArrayIndexTochange = req.body.arrayLentghToChange



    let bankInfoArraysOfpanel = []
    db.doc(`/bankData/${req.params.BankDataId}`).get().then((doc) => {

        console.log("veri geldi::", doc.data().bankDataAll)

        bankInfoArraysOfpanel = doc.data().bankDataAll

    }).then(() => {

        if (bankInfoArraysOfpanel[ArrayIndexTochange] == undefined) {

            console.log("fazla geldii array::")

            return db.doc(`/bankData/${req.params.BankDataId}`).update({

                bankDataAll: bankInfoArraysOfpanel
            }).then(() => {

                db.doc(`/bankData/${req.params.BankDataId}`).update({
                    bankDataAll: admin.firestore.FieldValue.arrayUnion({
                        "accountOwner": accountOwner,
                        "bankAccountNumber": bankAccountNumber,
                        "bankIban": bankIban,
                        "bankName": bankName,
                        "bankStation": bankStation
                    }),
                }).then(() => {
                    console.log("union yapıldı burada")
                    return res.json({
                        Mesaj: "Array fazla, o yüzden Union Yapıldı!!"
                    })
                }).catch((eror) => {
                    return res.json({
                        Mesaj: "Union yaparken hata var!!"
                    })
                })
            }).catch((err) => {
                console.log("index fazla hata oluştu")
            })
        } else {
            bankInfoArraysOfpanel[ArrayIndexTochange].accountOwner = accountOwner;
            bankInfoArraysOfpanel[ArrayIndexTochange].bankAccountNumber = bankAccountNumber;
            bankInfoArraysOfpanel[ArrayIndexTochange].bankIban = bankIban;
            bankInfoArraysOfpanel[ArrayIndexTochange].bankName = bankName;
            bankInfoArraysOfpanel[ArrayIndexTochange].bankStation = bankStation;
        }
    }).then(() => {
        db.doc(`/bankData/${req.params.BankDataId}`).update({
            bankDataAll: bankInfoArraysOfpanel
        })
    }).then(() => {
        return res.json({
            Mesaj: "Kullanıcı bilgileri doğru gücelendi!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })


}






// update ContactData Info
exports.updateContactInfo = (req, res) => {
    let contactbilgi = reduceContactInfo(req.body);
    db.doc(`/contactData/${req.params.conatctDataId}`).update(contactbilgi).then(() => {
        return res.json({
            Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })


    // .then(() => {
    //     db.doc(`/contactData/${req.params.conatctDataId}`).update({
    //         panelPhoneNumbers: admin.firestore.FieldValue.arrayUnion({ "phoneNumber": contactbilgi.takenPhoneNumber }),
    //         panelEmailPostas: admin.firestore.FieldValue.arrayUnion({ "emailPosta": contactbilgi.takenEmailEposta })
    //     })
    // })

}

//udate Faturea Bill

exports.updateFaturaBillInfo = (req, res) => {
    let contactbilgi = reducekulBill(req.body);
    db.doc(`/BillFaturaData/${req.params.faturaDataId}`).update(contactbilgi).then(() => {
        return res.json({
            Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })

}



//UPDATE ONLY PHONE rEWRİTE AGAİN
exports.updateContactInfoArrayPhoneOnlyAgain = (req, res) => {


    db.doc(`/contactData/${req.params.conatctDataId}`).update({

        panelPhoneNumbers: admin.firestore.FieldValue.arrayRemove({
            "phoneNumber": req.body.existPhoneNumber,
            "defaultNumber": req.body.existDefaultPhone
        })





    }).then(() => {

        db.doc(`/contactData/${req.params.conatctDataId}`).update({

            panelPhoneNumbers: admin.firestore.FieldValue.arrayUnion({
                "phoneNumber": req.body.newPhoneInputValue,
                "defaultNumber": req.body.newDefaultPhonenumber
            }),

        })
    }).then(() => {


        return res.json({

            SuccessMesaj: "Gucenllendi Contact Only"


        })

    }).catch((eror) => {

        return res.json({
            Mesaj: " Contact  Union yaparken hata var!!"
        })

    })
}



// update Email AGian Rewite

exports.updateContactInfoArrayEmailOnlyAgain = (req, res) => {


    db.doc(`/contactData/${req.params.conatctDataId}`).update({



        panelEmailPostas: admin.firestore.FieldValue.arrayRemove({
            "emailPosta": req.body.existEmail,
            "defaultEmaill": req.body.existDefaultEamil
        })

    }).then(() => {

        db.doc(`/contactData/${req.params.conatctDataId}`).update({



            panelEmailPostas: admin.firestore.FieldValue.arrayUnion({
                "emailPosta": req.body.newEmailInputValue,
                "defaultEmaill": req.body.newDefautEmail
            })

        })
    }).then(() => {


        return res.json({

            SuccessMesaj: "Gucenllendi Email Only"


        })

    }).catch((eror) => {

        return res.json({
            Mesaj: " Contact  Union yaparken hata var!!"
        })

    })

}



//update ONLY pHONE nUMBER aRRAY
exports.updateContactInfoArrayPhoneOnly = (req, res) => {

    // let oldphoneInputValue = req.body.alreadyPhoneNumber
    let newPhoneInputValue = req.body.newEnterPhoneInput

    let newDefaultPhonenumber = req.body.newDefaultPhonenumber

    let ArrayIndexTochange = req.body.arrayLentghToChange

    let phoneNumbersOfpanel = []
    db.doc(`/contactData/${req.params.conatctDataId}`).get().then((doc) => {

        console.log("veri geldi::", doc.data().panelPhoneNumbers)

        return phoneNumbersOfpanel = doc.data().panelPhoneNumbers

    }).then(() => {

        if (phoneNumbersOfpanel[ArrayIndexTochange] === undefined) {

            console.log("fazla geldii array::")

            return db.doc(`/contactData/${req.params.conatctDataId}`).update({

                panelPhoneNumbers: phoneNumbersOfpanel

            }).then(() => {

                db.doc(`/contactData/${req.params.conatctDataId}`).update({
                    panelPhoneNumbers: admin.firestore.FieldValue.arrayUnion({
                        "phoneNumber": newPhoneInputValue,
                        "defaultNumber": newDefaultPhonenumber
                    }),


                }).then(() => {
                    console.log("union yapıldı burada")
                    return res.json({

                        Mesaj: "Array fazla, o yüzden Union Yapıldı!!"

                    })
                }).catch((eror) => {
                    return res.json({
                        Mesaj: "Union yaparken hata var!!"
                    })
                })


            }).catch((err) => {
                console.log("index fazla hata oluştu")
            })
        } else {
            phoneNumbersOfpanel[ArrayIndexTochange].phoneNumber = newPhoneInputValue;
            phoneNumbersOfpanel[ArrayIndexTochange].defaultNumber = newDefaultPhonenumber;
            console.log("indexoyaa:", phoneNumbersOfpanel[ArrayIndexTochange])
        }
    }).then(() => {
        db.doc(`/contactData/${req.params.conatctDataId}`).update({
            panelPhoneNumbers: phoneNumbersOfpanel
        })
    }).then(() => {
        return res.json({
            Mesaj: "Kullanıcı bilgileri doğru gücelendi!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}



// update only Email Array from here
exports.updateContactInfoEmailOnly = (req, res) => {


    let newEmailInputValue = req.body.newEmailPosta
    let newDefautEmail = req.body.newDefaultEmail
    let ArrayIndexTochange = req.body.arrayLentghToChange

    let emailPostaOfpanel = []
    db.doc(`/contactData/${req.params.conatctDataId}`).get().then((doc) => {

        console.log("veri geldi::", doc.data().panelEmailPostas)

        emailPostaOfpanel = doc.data().panelEmailPostas
    }).then(() => {


        if (emailPostaOfpanel[ArrayIndexTochange] == undefined) {

            console.log("fazla geldii array::")

            return db.doc(`/contactData/${req.params.conatctDataId}`).update({

                panelEmailPostas: emailPostaOfpanel
            }).then(() => {

                db.doc(`/contactData/${req.params.conatctDataId}`).update({
                    panelEmailPostas: admin.firestore.FieldValue.arrayUnion({
                        "emailPosta": newEmailInputValue,
                        "defaultEmaill": newDefautEmail
                    }),

                }).then(() => {
                    console.log("union yapıldı burada")
                    return res.json({
                        Mesaj: "Array fazla, o yüzden Union Yapıldı!!"
                    })
                }).catch((eror) => {
                    return res.json({
                        Mesaj: "Union yaparken hata var!!"
                    })
                })
            }).catch((err) => {
                console.log("index fazla hata oluştu")
            })
        } else {

            emailPostaOfpanel[ArrayIndexTochange].emailPosta = newEmailInputValue;
            emailPostaOfpanel[ArrayIndexTochange].defaultEmaill = newDefautEmail;

        }



        // for (let index = 0; index < ArrayLenght; index++) {

        //     if (emailPostaOfpanel[index] == undefined) {
        //         return res.json({ Mesaj: "Nope index too long!!" })
        //     } else {

        //         emailPostaOfpanel[index].emailPosta = newEmailInputValue;
        //     }

        // }

    }).then(() => {
        db.doc(`/contactData/${req.params.conatctDataId}`).update({
            panelEmailPostas: emailPostaOfpanel
        })
    }).then(() => {
        return res.json({
            Mesaj: "Kullanıcı bilgileri doğru gücelendi!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err
        })
    })
}

//Delete Phone Only from here

exports.deleteArrayInsidePhone = (req, res) => {

    // let currentId = req.body.currentIdd

    // let existPhone = req.body.existPhoneNumber
    // let existDefaultPhoneNumber = req.body.existDefaultPhone

    db.doc(`/contactData/${req.params.conatctDataId}`).update({

        panelPhoneNumbers: admin.firestore.FieldValue.arrayRemove({
            "phoneNumber": req.body.existPhoneNumber,
            "defaultNumber": req.body.existDefaultPhone
        })


    }).then(() => {

        console.log("union yapıldı burada")

        return res.json({
            Mesaj: "Array fazla, o yüzden Union Yapıldı!!"
        })


    }).catch((eror) => {

        return res.json({
            Mesaj: "Union yaparken hata var!!"
        })

    })

}


// Delete Email Array inside Contact Here

exports.deleteArrayInsideEmail = (req, res) => {

    // let currentId = req.body.currentIdd
    let existEmail = req.body.existEmail
    let existDefaultEmail = req.body.existDefaultEmail

    db.doc(`/contactData/${req.params.conatctDataId}`).update({

        panelEmailPostas: admin.firestore.FieldValue.arrayRemove({
            "emailPosta": existEmail,
            "defaultEmaill": existDefaultEmail
        })

    }).then(() => {
        console.log("union yapıldı burada")
        return res.json({
            Mesaj: "Array fazla, o yüzden Union Yapıldı!!"
        })
    }).catch((eror) => {
        return res.json({
            Mesaj: "Union yaparken hata var!!"
        })
    })

}


//delete Inside File Upload Arrray Only one Delete

exports.deleteArrayInsideFileUploadArrayOnly = (req, res) => {


    db.doc(`/fileUploadDocument/${req.params.belgeDocumentId}`).update({

        belgeDocumentUploads: admin.firestore.FieldValue.arrayRemove({
            "belgeDocument": req.body.existUrlLinkOfFileUpload
        })

    }).then(() => {
        console.log("union yapıldı burada")
        return res.json({
            Mesaj: "Array fazla, o yüzden Union Yapıldı!!"
        })
    }).catch((eror) => {
        return res.json({
            Mesaj: "Union yaparken hata var!!"
        })
    })

}

// delete Banka Array only Element
exports.deleteArrayInsideBankArrayOnlyElement = (req, res) => {

    db.doc(`/bankData/${req.params.bankDataId}`).update({

        bankDataAll: admin.firestore.FieldValue.arrayRemove({
            "bankIban": req.body.exisBankIban,
            "accountOwner": req.body.existAccountOwner,
            "bankAccountNumber": req.body.existbankNumber,
            "bankName": req.body.existbankName,
            "bankStation": req.body.existbankStation

        })

    }).then(() => {
        console.log("union yapıldı burada")
        return res.json({
            Mesaj: "Array fazla, o yüzden Union Yapıldı!!"
        })
    }).catch((eror) => {
        return res.json({
            Mesaj: "Union yaparken hata var!!"
        })
    })

}

//profile Url Linkler only Url Link Element

exports.deleteArrayProfileUrlLinksArrayOnlyElement = (req, res) => {




    let existsocialUrlLink = req.body.socialUrlLink
    let exitsocialtype = req.body.socialtype

    let socialMediaLinkMatch = req.body.socialMediaLinkMatch



    let deletePartFrom = db.doc(`/userSocialMediaUrl/${socialMediaLinkMatch}`);




    db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update({


        profileUrlPanel: admin.firestore.FieldValue.arrayRemove({

            "eMail": req.body.exiseMail,
            "generalUserId": req.body.existgeneralUserId,
            "placeholder": req.body.existplaceholder,
            "socialOrder": req.body.existsocialOrder,
            "socialUrlHead": req.body.existsocialUrlHead,
            "socialUrlLink": existsocialUrlLink,
            "socialtype": exitsocialtype,
            "statuMode": req.body.existstatuMode,
            "socialMediaLinkMatch": socialMediaLinkMatch

        })

    }).then(() => {
        deletePartFrom.delete()

    }).then(() => {
        console.log("union yapıldı burada")
        return res.json({
            Mesaj: "Array fazla, o yüzden Union Yapıldı!!"
        })
    }).catch((eror) => {
        return res.json({
            Mesaj: "Union yaparken hata var!!"
        })
    })

}







///UPDATE Document from here
exports.updateDocumentFormInfo = (req, res) => {

    let documentFormbilgi = reduceDocumentInfo(req.body);
    db.doc(`/documentDataForm/${req.params.documentDatId}`).update(documentFormbilgi).then(() => {

        return res.json({
            Mesaj: "Kullanıcı bilgileri doğru girilmiştir!!"
        })

    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}



//dark theme or Light
//geceModu
exports.darkThemeOrLight = (req, res) => {

    let darkModu = reduceDarkMokAktif(req.body);
    db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update(darkModu).then(() => {
        return res.json({
            Mesaj: "template theme changed!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}

// position of social media on view
exports.positionOfSocialMedia = (req, res) => {
    let positionSocial = reducePositionOfSocail(req.body);
    db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update(positionSocial).then(() => {
        return res.json({
            Mesaj: "position of social media changed!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}


// update StauMode Bank
exports.updateStattuModeBank = (req, res) => {
    let bankbilgi = reduceBankStatusMode(req.body);

    db.doc(`/bankData/${req.params.bankDataId}`).update(bankbilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully added!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })

}


//update StatuMode of Profile url here
exports.updateStattuModeProfileUrl = (req, res) => {
    let bankbilgi = reduceProfileUrlStatusMode(req.body);

    db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update(bankbilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully added!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })

}


//update statusMode contactData
exports.updateStattuModeContact = (req, res) => {

    let contactbilgi = reduceContactStatusMode(req.body);

    db.doc(`/contactData/${req.params.contactDataId}`).update(contactbilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully added!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })

}

// Fatura StatueMode

exports.updateStattuModeFaturaBu = (req, res) => {

    let contactbilgi = reduceFaturaBillStatusMode(req.body);

    db.doc(`/BillFaturaData/${req.params.faturaDataId}`).update(contactbilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully added!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })

}


//update statueMode Document BELGE
exports.updateStattuModeDocumentToChange = (req, res) => {

    let documentbilgi = reduceDocumentStatusMode(req.body);

    db.doc(`/documentDataForm/${req.params.documentDataFormId}`).update(documentbilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully added!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })

}

//update statueMode of File Upload
exports.updateStattuModeFileUploadToView = (req, res) => {

    let fileUploadbilgi = reduceFileUploadToStatusMode(req.body);
    db.doc(`/fileUploadDocument/${req.params.belgeDocumentId}`).update(fileUploadbilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully added!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })

}

//update Orderof Bank data
exports.updateOrderOfBank = (req, res) => {
    let bankbilgi = reduceOrderIdofBank(req.body);
    db.doc(`/bankData/${req.params.bankDataId}`).update(bankbilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully added!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}

//update order of Profile Url Panel
exports.updateOrderOfPanelProfileUrl = (req, res) => {
    let bankbilgi = reduceOrderIdofprofileUrl(req.body);
    db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update(bankbilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully added!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}

//update Orderof contact
exports.updateOrderOfContact = (req, res) => {
    let contactbilgi = reduceOrderIdofContact(req.body);
    db.doc(`/contactData/${req.params.contactDataId}`).update(contactbilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully added!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}

//update order of Fatura
exports.updateOrderOfFaturaBill = (req, res) => {
    let contactbilgi = reduceOrderIdofContact(req.body);
    db.doc(`/BillFaturaData/${req.params.faturaDataId}`).update(contactbilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully added!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}



//order of Document Form
exports.updateOrderOfDocument = (req, res) => {
    let Documentbilgi = reduceOrderIdofDocument(req.body);
    db.doc(`/documentDataForm/${req.params.documentDataFormId}`).update(Documentbilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully added!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}

//order of File Uploaded
exports.updateOrderOfFileUploaded = (req, res) => {
    let FileUploadedbilgi = reduceOrderIdofFileUploaded(req.body);
    db.doc(`/fileUploadDocument/${req.params.belgeDocumentId}`).update(FileUploadedbilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully added!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}

///panel updated ***************************************************


//******* panel Title//
//update panel Title from here Conatct panel title
exports.updateConatctPanelTitle = (req, res) => {
    let updateTitlebilgi = reduceTitleUpdatePanel(req.body);
    db.doc(`/contactData/${req.params.contactDataId}`).update(updateTitlebilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully updated!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}

// update Panel Title fatura
exports.updateFaturaBillPanelTitle = (req, res) => {
    let updateTitlebilgi = reduceTitleUpdatePanel(req.body);
    db.doc(`/BillFaturaData/${req.params.faturaDataId}`).update(updateTitlebilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully updated!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}


//upadte Panel title of Panel Url from here
exports.updatePanelUrlLinkPanelTitle = (req, res) => {
    let updateTitlebilgi = reduceTitleUpdatePanelProfileUrl(req.body);
    db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`).update(updateTitlebilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully updated!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}

//bank Title panel
exports.updateBankPanelTitle = (req, res) => {
    let updateTitlebilgi = reduceTitleUpdatePanelBank(req.body);
    db.doc(`/bankData/${req.params.bankDataId}`).update(updateTitlebilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully updated!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}

//Document panel Title
exports.updateDocumentPanelTitle = (req, res) => {
    let updateTitlebilgi = reduceTitleUpdatePanelDocument(req.body);
    db.doc(`/documentDataForm/${req.params.documentDataFormId}`).update(updateTitlebilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully updated!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}

//File Upload Title Panel
exports.updateFileUploadPanelTitle = (req, res) => {

    let updateTitlebilgi = reduceTitleUpdatePanelFileUpload(req.body);
    db.doc(`/fileUploadDocument/${req.params.belgeDocumentId}`).update(updateTitlebilgi).then(() => {
        return res.json({
            Mesaj: "SuccessFully updated!!"
        })
    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })

}

//****************en of panel Title */



//delete Bank Panel from here
exports.bankPanelDelete = (req, res) => {

    const bankDataId = db.doc(`/bankData/${req.params.bankDataId}`);
    bankDataId.get().then((doc) => {
        bankDataId.delete();
    }).then(() => {
        return res.json({
            Message: "SuccessFully Deleted !!!"
        })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            Err: err.code
        })
    })
}

// delete Contact Form here
exports.contactPanelDelete = (req, res) => {

    const contactDataId = db.doc(`/contactData/${req.params.contactDataId}`);
    contactDataId.get().then((doc) => {
        contactDataId.delete();
    }).then(() => {
        return res.json({
            Message: "SuccessFully Deleted !!!"
        })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            Err: err.code
        })
    })
}

//delete Fatura Bill Time 
exports.FaturaBillPanelDelete = (req, res) => {

    const contactDataId = db.doc(`/BillFaturaData/${req.params.faturaDataId}`);
    contactDataId.get().then((doc) => {
        contactDataId.delete();
    }).then(() => {
        return res.json({
            Message: "SuccessFully Deleted !!!"
        })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            Err: err.code
        })
    })


}

//delete Profile Url from heer   
exports.profileUrlPanelDelete = (req, res) => {

    const contactDataId = db.doc(`/panelUrlLinkOfUser/${req.params.panelProfileUrlDataId}`);
    contactDataId.get().then((doc) => {
        contactDataId.delete();
    }).then(() => {
        return res.json({
            Message: "SuccessFully Deleted !!!"
        })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            Err: err.code
        })
    })
}

// delete Document form heer
exports.DocumentFormPanelDelete = (req, res) => {
    const documentDataId = db.doc(`/documentDataForm/${req.params.documenttDataId}`);
    documentDataId.get().then((doc) => {
        documentDataId.delete();
    }).then(() => {
        return res.json({
            Message: "SuccessFully Deleted !!!"
        })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            Err: err.code
        })
    })
}

// delete File Uploaded

exports.fileUploadedPanelDelete = (req, res) => {
    const fileuploadedDataId = db.doc(`/fileUploadDocument/${req.params.fileuploadedDataId}`);
    fileuploadedDataId.get().then((doc) => {
        fileuploadedDataId.delete();
    }).then(() => {
        return res.json({
            Message: "SuccessFully Deleted !!!"
        })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            Err: err.code
        })
    })
}


// I forget password
exports.passwordForget = (req, res) => {

    const personEnterForgetPassword = {
        eMail: req.body.eMail
    }
    const {
        valid,
        errorPersonEnter
    } = validateResetPassordForget(personEnterForgetPassword);
    if (!valid) {
        return res.status(400).json({
            errorPersonEnter
        });
    }

    firebase.auth().sendPasswordResetEmail(personEnterForgetPassword.eMail).then((data) => {

        return res.status(200).json({
            emailSent: "successfully sent"
        });


    }).catch(err => {
        console.error(err)
            //auth/wrong-password
            //auth/user-not-user
        return res.status(500).json({
            errorHata: err
        })

    })

}




//Fatura Information

exports.BillInfoData = (req, res) => {
    let userProfileData = reducekulBill(req.body);
    db.doc(`/profilesOfGeneralUser/${req.params.profileId}`).update(userProfileData).then(() => {

        return res.json({
            Mesaj: "Successfully added!"
        })

    }).catch((err) => {
        console.error(err)
        return res.status(500).json({
            err: err.code
        })
    })
}



//change Password from 
exports.parolaChangeOfUser = (req, res) => {

    const userInfoProfile = {
        oldpassword: req.body.oldpassword,
        newPassword: req.body.newPassword,
        confirmNewpassword: req.body.confirmNewpassword,
        eMail: req.user.eMail
    }

    console.log("data here:", req.user)

    if (userInfoProfile.newPassword != userInfoProfile.confirmNewpassword) {

        return res.status(400).json({
            Mesaj: "Password are not conformed!!"
        })

    } else {

        firebase.auth().signInWithEmailAndPassword(req.user.eMail, userInfoProfile.oldpassword).then((data) => {

            admin.auth().updateUser(req.user.uid, {
                    emailVerified: true,
                    password: userInfoProfile.newPassword

                }).then(() => {

                    db.doc(`/userGeneral/${req.user.eMail}`).update({
                        passwordOfUser: userInfoProfile.newPassword
                    })


                }).then((userRecord) => {
                    // See the UserRecord reference doc for the contents of userRecord.
                    // console.log('Successfully updated user', userRecord.toJSON());
                    return res.status(200).json({
                        Success: "SuccesFully Change Password!!"
                    })

                })
                .catch((error) => {
                    console.log('Error updating user:', error);
                    return res.status(500).json({
                        Fail: error
                    })
                });

        }).catch(() => {

            return res.status(201).json({
                Mesaj: "This password does'nt exist!!"
            })

        })


    }
}


///change Email of user

exports.emailChangeOfUser = (req, res) => {

    const userInfoProfile = {
        oldpassword: req.user.passwordOfUser,
        newEmailTochange: req.body.newEmailTochange,
        eMail: req.user.eMail
    }

    console.log("data here:", req.user)

    if (userInfoProfile.newPassword != userInfoProfile.confirmNewpassword) {

        return res.status(400).json({
            Mesaj: "Password are not conformed!!"
        })

    } else {

        firebase.auth().signInWithEmailAndPassword(req.user.eMail, userInfoProfile.oldpassword).then((data) => {

            admin.auth().updateUser(req.user.uid, {

                    email: userInfoProfile.newEmailTochange

                }).then(() => {


                    db.collection("userGeneral").doc(userInfoProfile.eMail).get().then((doc) => {

                        if (doc && doc.exists) {
                            var data = doc.data();
                            db.collection("userGeneral").doc(userInfoProfile.newEmailTochange).set(data).then(() => {

                                db.collection("userGeneral").doc(userInfoProfile.eMail).delete();
                            }).then(() => {

                                db.doc(`/userGeneral/${userInfoProfile.newEmailTochange}`).update({
                                    eMail: userInfoProfile.newEmailTochange
                                })

                            })
                        }
                    })

                }).then((userRecord) => {
                    // See the UserRecord reference doc for the contents of userRecord.
                    // console.log('Successfully updated user', userRecord.toJSON());
                    return res.status(200).json({
                        Success: "SuccesFully Change Email!!"
                    });

                })
                .catch((error) => {
                    console.log('ErrorupdatingUser:', error);
                    return res.status(500).json({
                        Fail: error
                    })
                });

        }).catch((err) => {

            console.log("errorHATA", err)

            return res.status(201).json({
                Mesaj: "This Email does'nt exist!!"
            })

        })
    }
}



//upoad data from here Data transfer
///************************************************************ independant from heer */
exports.postUserDatafromheer = (req, res) => {



    // const newPersonInfo = {
    //     eMail: req.body.eMail,
    //     publicName: req.body.publicName,
    //     publicSurname: req.body.publicSurname,
    //     userHandleName: req.body.userHandleName,

    // }



    const userCredentials = {
        accountType: "Normal",
        eMail: req.body.eMail,
        publicName: req.body.publicName,
        publicSurname: req.body.publicSurname,
        accountTypeStartDate: new Date().toISOString(),
        cardPairing: "",
        gender: "0",
        generalUserId: "",
        passwordOfUser: "",
        secretKod: req.body.secretKod,
        userHandleName: req.body.userHandleName,
        startDateCount: new Date().toISOString(),
        verificationCode: req.body.verificationCode,
        birthDate: "",
        phoneNumber: "",

    }


    const newProfileAdd = {
        profileTag: req.body.profileTag,
        generalUserId: userCredentials.generalUserId,
        eMail: userCredentials.eMail,
        customUrl: "",
        dateofCreation: new Date().toISOString(),
        orderOfProfile: 0,
        phoneNumber: "",
        profileAdres: "",
        profileCompany: req.body.profileCompany,
        profilDescription: req.body.profilDescription,
        profileEmail: "",
        profileTheme: "light",
        publicName: userCredentials.publicName,
        publicSurName: userCredentials.publicSurname,
        statusMode: true,
        statusOfUrl: true,
        placeOfSocialMediaPosition: "top",
        telNumber: "",
        taxNumber: req.body.taxNumber,
        taxAdministration: req.body.taxAdministration,
        companyStatus: req.body.companyStatus,
        officeEmail: req.body.officeEmail,
        websiteUrlLink: "",
        officePhoneNumber: req.body.officePhoneNumber,
        location: req.body.location,
        position: "",
        // profileUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/profileMages%2F${defaultImage}?alt=media`,
        // backgorundImage: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/backgroundMages%2F${backImag}?alt=media`,
        profileUrl: req.body.profileUrl,
        backgorundImage: req.body.backgorundImage

    }




    db.doc(`/userGeneral/${userCredentials.eMail}`).set(userCredentials).then(() => {
        db.collection("profilesOfGeneralUser").add(newProfileAdd).then(() => {
            db.doc(`/cardUrlLinks/${userCredentials.secretKod}`).set(userCredentials)
        }).then(() => {
            return res.json({
                resul: "Succesfully Updated"
            })
        }).catch((err) => {
            res.status(500).json({
                Hata: err.code
            })
        })

    }).catch((err) => {
        res.status(500).json({
            ErrorCode: err.code
        })
    })




    //       .then(()=>{
    //         db.collection("bankData").add(createBank).then((data) => {
    //             const resScream = createBank
    //             resScream.bankId = data.id
    //            // res.json({ resScream });

    //       })
    //     }).then(()=>{


    //         db.collection("contactData").add(createContact).then((data) => {
    //             const resScream = createContact
    //             resScream.contactDataId = data.id
    //             res.json({ resScream });
    //     })

    // })


}



//fİLL THE sOCİAL MEDİA AND Bank  Bank

// exports.addBankSocial = (req, res) => {

//     let accountOwner = req.body.accountOwner;
//     let bankName = req.body.bankName;
//     let bankStation = req.body.bankStation;
//     let bankIban = req.body.bankIban;
//     let bankAccountNumber = req.body.bankAccountNumber


//     const createBank = {

//         bankDataAll: [{ "accountOwner": accountOwner, "bankName": bankName, "bankStation": bankStation, "bankIban": bankIban, "bankAccountNumber": bankAccountNumber }],
//         profileId: req.params.profileId,
//         generalUserId: req.user.generalUserId,
//         isOpen: false,
//         panelTitle: "",
//         isDeleteOpen: false,
//         isEditTitle: false,
//         statueMode: true,
//         OrderId: req.body.OrderId,
//         type: "bankform",

//     }


//     db.collection("bankData").add(createBank).then((data) => {

//         const resScream = createBank
//         resScream.bankId = data.id
//         res.json({ resScream });


//     }).catch((err) => {

//         res.status(500).json({ error: "something went wrong!!" });
//         console.error(err)
//     })



// }

//add contact


// transfer Data toeach other

exports.transferDataToanother = (req, res) => {


    let genralUserId = req.body.generalUserId

    let profileIdFrom = "";

    let newAddUrlId = "";
    let socialMediaAddId = "";

    let panelLinkAddUrl = "";

    let userAllInfo = {}

    let onlyBankDataFrom = [];
    let onlySocialData = [];
    let onlySocialMediaEmail = [];

    let socialMediaForpanelUrl = [];
    let socialAgainPart = [];


    var itemsProcessed = 0;


    const allGeneralProfile = db.collection("userabd").where("userHandle", "==", req.params.userHandle)

    allGeneralProfile.get().then((data) => {

        userAllInfo.profile = []

        data.forEach((doc) => {

            userAllInfo.profile.push(

                doc.data()

            )
        })


        return db.collection("homepageLink").where("userHandle", "==", req.params.userHandle).get();


    }).then((data) => {

        console.log("seeYouu", userAllInfo)


        userAllInfo.urlLinkInfo = []

        data.forEach((doc) => {

            userAllInfo.urlLinkInfo.push(
                doc.data()
            )
        })

        console.log("linkUrl", userAllInfo.profile[0].onurlLinkiId)


        return db.collection("linkUrlAll").where("userHandle", "==", req.params.userHandle).get();

    }).then((data) => {

        userAllInfo.socialConatact = []

        data.forEach((doc) => {

            userAllInfo.socialConatact.push(

                doc.data()
            )
        })

        return db.collection("linkUrlAll").where("userHandle", "==", req.params.userHandle).where("durumu", "==", true).get();


    }).then((data) => {

        userAllInfo.onlySocialMediaData = []


        data.forEach((doc) => {
            userAllInfo.onlySocialMediaData.push(
                doc.data()
            )
        })



    }).then(() => {

        // here will be the data userGeneralOfUser

        const userCredentials = {
            accountType: "Normal",
            eMail: userAllInfo.profile[0].email,
            publicName: userAllInfo.profile[0].nameSurname,
            publicSurname: "",
            accountTypeStartDate: new Date().toISOString(),
            cardPairing: "",
            gender: "0",
            generalUserId: genralUserId,
            passwordOfUser: "",
            secretKod: userAllInfo.profile[0].onurlLinkiId ? userAllInfo.profile[0].onurlLinkiId : "",
            userHandleName: userAllInfo.profile[0].userHandle,
            startDateCount: new Date().toISOString(),
            verificationCode: "abd31N",
            birthDate: "",
            phoneNumber: userAllInfo.profile[0].phoneNumber ? userAllInfo.profile[0].phoneNumber : "",

        }


        const newProfileAdd = {
            profileTag: userAllInfo.profile[0].userHandle,
            generalUserId: userCredentials.generalUserId,
            eMail: userCredentials.eMail,
            customUrl: "",
            dateofCreation: new Date().toISOString(),
            orderOfProfile: 0,
            phoneNumber: "",
            profileAdres: "",
            profileCompany: userAllInfo.profile[0].company ? userAllInfo.profile[0].company : "",
            profilDescription: "",
            profileEmail: "",
            profileTheme: "light",
            publicName: userCredentials.publicName,
            publicSurName: userCredentials.publicSurname,
            statusMode: true,
            statusOfUrl: true,
            placeOfSocialMediaPosition: "top",
            telNumber: "",
            taxNumber: userAllInfo.profile[0].vergiNumarasi ? userAllInfo.profile[0].vergiNumarasi : "",
            taxAdministration: userAllInfo.profile[0].vergidairesi ? userAllInfo.profile[0].vergidairesi : "",
            companyStatus: userAllInfo.profile[0].firmaUnvani ? userAllInfo.profile[0].firmaUnvani : "",
            officeEmail: userAllInfo.profile[0].ofisMaili ? userAllInfo.profile[0].ofisMaili : "",
            websiteUrlLink: "",
            officePhoneNumber: userAllInfo.profile[0].ofistelefonu ? userAllInfo.profile[0].ofistelefonu : "",

            location: userAllInfo.profile[0].location ? userAllInfo.profile[0].location : "",
            position: "",
            // profileUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/profileMages%2F${defaultImage}?alt=media`,
            // backgorundImage: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/backgroundMages%2F${backImag}?alt=media`,
            profileUrl: userAllInfo.profile[0].profileUrl ? userAllInfo.profile[0].profileUrl : "",
            backgorundImage: userAllInfo.profile[0].backgorundImage ? userAllInfo.profile[0].backgorundImage : ""

        }




        db.doc(`/userGeneral/${userCredentials.eMail}`).set(userCredentials).then(() => {
            db.collection("profilesOfGeneralUser").add(newProfileAdd).then((doc) => {

                console.log("dataaFrom", doc.id)

                profileIdFrom = doc.id

                console.log("dataFrom", profileIdFrom)

            }).then(() => {
                db.doc(`/cardUrlLinks/${userCredentials.secretKod}`).set(userCredentials)
            }).then(() => {

                const createBillData = {

                    taxNumber: userAllInfo.profile[0].vergiNumarasi ? userAllInfo.profile[0].vergiNumarasi : "",
                    taxAdministration: userAllInfo.profile[0].vergidairesi ? userAllInfo.profile[0].vergidairesi : "",
                    companyStatus: userAllInfo.profile[0].firmaUnvani ? userAllInfo.profile[0].firmaUnvani : "",
                    officeEmail: userAllInfo.profile[0].ofisMaili ? userAllInfo.profile[0].ofisMaili : "",
                    officePhoneNumber: userAllInfo.profile[0].ofistelefonu ? userAllInfo.profile[0].ofistelefonu : "",
                    location: userAllInfo.profile[0].location ? userAllInfo.profile[0].location : "",
                    generalUserId: genralUserId,
                    profileId: profileIdFrom,
                    statueMode: true,
                    panelTitle: "",
                    OrderId: "0",
                    isOpen: false,
                    isDeleteOpen: false,
                    isEditTitle: false,
                    type: "faturaData"

                }

                if (userAllInfo.profile[0].vergiNumarasi) {

                    db.collection("BillFaturaData").add(createBillData)


                }



                // return res.json({ resul: "Succesfully Updated" })
            }).then(() => {



                const createBank = {

                    profileId: profileIdFrom,
                    generalUserId: genralUserId,
                    isOpen: false,
                    panelTitle: "",
                    isDeleteOpen: false,
                    isEditTitle: false,
                    statueMode: true,
                    OrderId: "0",
                    type: "bankform"
                }



                db.collection("bankData").add(createBank).then((doc) => {

                    return newAddUrlId = doc.id


                }).then(() => {


                    userAllInfo.socialConatact.map((v, i) => {

                        if (v.iban) {

                            onlyBankDataFrom.push({
                                accountOwner: v.hesabSahibi,
                                bankName: "",
                                bankStation: "",
                                bankIban: v.iban,
                                bankAccountNumber: v.hesapNumarasi
                            })
                        }
                    })


                }).then(() => {


                    db.doc(`/bankData/${newAddUrlId}`).update({

                        bankDataAll: onlyBankDataFrom

                    });


                }).catch((err) => {
                    res.status(500).json({
                        error: "something went wrong Banka Transfer DATA!!"
                    });
                    console.error(err)
                })




            }).then(() => {



                const createContact = {
                    publicName: userAllInfo.profile[0].nameSurname,
                    publicsurname: "",
                    publicOrganization: userAllInfo.profile[0].company ? userAllInfo.profile[0].company : "",
                    profilePosition: userAllInfo.profile[0].position ? userAllInfo.profile[0].position : "",
                    streetAdress: userAllInfo.profile[0].location ? userAllInfo.profile[0].location : "",
                    profileCountry: "Turkey",
                    profileCity: "",
                    profileNot: "",
                    // generalUserId: req.user.generalUserId,
                    generalUserId: genralUserId,
                    profileId: profileIdFrom,
                    statueMode: true,
                    panelTitle: "",
                    OrderId: "",
                    isOpen: false,
                    isDeleteOpen: false,
                    isEditTitle: false,
                    type: "conatctAddForm"

                }



                db.collection("contactData").add(createContact).then((doc) => {

                    newAddUrlId = doc.id



                }).then(() => {

                    // onlySocialData

                    userAllInfo.onlySocialMediaData.map((v, i) => {


                        // data.forEach((doc) => {
                        //     userAllInfo.onlySocialMediaData.push(
                        //         doc.data()
                        //     )
                        // })

                        if (v.UrlLinki) {
                            onlySocialData.push({
                                phoneNumber: v.UrlLinki,
                                defaultNumber: true
                            })
                            onlySocialMediaEmail.push({
                                emailPosta: v.UrlLinki,
                                defaultEmaill: true
                            })

                        }

                    })

                }).then((data) => {

                    //console.log("dataHGER", userAllInfo.socialConatact)



                    db.doc(`/contactData/${newAddUrlId}`).update({
                        panelPhoneNumbers: onlySocialData,
                        panelEmailPostas: onlySocialMediaEmail,
                    })


                }).catch((err) => {
                    res.status(500).json({
                        error: "something went wrong!! contact from"
                    });
                    console.error(err)
                })










            }).then(() => {

                let socialOrder = "0"
                let emaill = userAllInfo.profile[0].email


                const createContact = {

                    generalUserId: genralUserId,
                    profileId: profileIdFrom,
                    statueMode: true,
                    panelTitle: "",
                    OrderId: "0",
                    isOpen: false,
                    isDeleteOpen: false,
                    isEditTitle: false,
                    type: "urlLinkPanel"

                }

                db.collection("panelUrlLinkOfUser").add(createContact).then((doc) => {


                    panelLinkAddUrl = doc.id

                }).then(() => {



                    console.log("NedirBuLink", panelLinkAddUrl)


                    userAllInfo.onlySocialMediaData.forEach((v, i, array) => {

                        itemsProcessed++;


                        db.collection("userSocialMediaUrl").add({

                            socialUrlLink: v.UrlLinki,
                            socialtype: v.UrlLinki,
                            profileId: profileIdFrom,
                            generalUserId: genralUserId,
                            eMail: emaill,
                            statuMode: true,
                            socialOrder: socialOrder

                        }).then((doc) => {

                            socialMediaAddId = doc.id


                        }).then(() => {

                            socialMediaForpanelUrl.push({
                                socialUrlLink: v.UrlLinki,
                                socialtype: v.UrlLinki,
                                eMail: emaill,
                                generalUserId: genralUserId,
                                profileId: profileIdFrom,
                                statuMode: true,
                                socialOrder: "0",
                                socialUrlHead: v.UrlLinki,
                                placeholder: "",
                                socialMediaLinkMatch: socialMediaAddId

                            })



                        }).then(() => {

                            console.log("dayu", socialMediaForpanelUrl.length)
                            console.log("datyr", array.length)



                            if (socialMediaForpanelUrl.length === array.length) {

                                console.log("oneTo", itemsProcessed)
                                console.log("TwoTo", array.length)


                                //console.log("VERdtaa", socialMediaForpanelUrl)

                                // console.log("youhh", socialMediaForpanelUrl)

                                // console.log("youmap", socialAgainPart)

                                db.doc(`/panelUrlLinkOfUser/${panelLinkAddUrl}`).update({

                                    profileUrlPanel: socialMediaForpanelUrl

                                }).then(() => {

                                    console.log("tama1")

                                }).catch((err) => {
                                    console.log("tamna3");
                                    console.log("HtaNe", err)



                                    // return res.status(500).json({
                                    //     error: "something went wrong Social Add panell3!!"
                                    // });

                                })


                            }

                        }).catch((err) => {

                            return res.status(500).json({
                                errorPANEL: "something went wrong Social Add and Panel !!"
                            });

                        })


                        //buaradan yok



                    })

                    console.log("buNeeuy", socialAgainPart)














                }).catch((err) => {
                    return res.status(500).json({
                        error: "something went wrong Social Add panell2!!"
                    });

                })



            }).then(() => {

                console.log("okullda", socialMediaForpanelUrl)
            }).catch((err) => {
                res.status(500).json({
                    HataVar: err
                })
            })

        }).then(() => {

            console.log("scholda", socialMediaForpanelUrl)

        }).catch((err) => {
            res.status(500).json({
                ErrorCode: err
            })
        })

        // return res.json(userAllInfo);

    }).then(() => {

        console.log("sonnnn", socialMediaForpanelUrl)


    }).then(() => {


        return res.json({
            OkAll: "Succesfully Allwell"
        });



    }).catch((err) => {
        console.log(err)
    })

}

//send Message from here DAY 0
exports.sendMessageToEveryone = (req, res) => {

    let phoneNumberTo = req.body.phoneNumberTo;


    //get all the number and send sms to everyone
    let userPhone = [];

    db.collection("userGeneral").get().then((data) => {

        data.forEach((doc) => {
            userPhone.push({
                phoneNumber: doc.data().phoneNumber,
                userNameSurname: doc.data().publicName
            })
        });
        return res.json(userPhone)
    }).then(() => {

        var NexMo = require('nexmo');

        const nexxmo = new NexMo({
            apiKey: 'fc7d1c8c',
            apiSecret: 'rmSUywDnxvSEU9Pw'


        })


        const from = " HibritCard "
        const to = phoneNumberTo;
        const text = "HibritCard uygulaması yeni arayüzü ve özellikleriyle artık daha da kullanışlı. Üstelik eski kullanıcılarımız için 2 ay boyunca Premium Hesaba özel 6 ilave profil HEDİYE!. Detaylar için https://www.hibritcard.com/features"


        nexxmo.message.sendSms(from, to, text);


    }).catch(err => {

        console.error(err)

    })
}

//sending Sms after Receiving Money.
exports.sendMessageAfterPayment = (req, res) => {

    let phoneNumberTo = req.body.phoneNumberTo
    let smsActifKod = req.body.smsActifKod

    var NexMo = require('nexmo')

    const nexxmo = new NexMo({

        apiKey: 'fc7d1c8c',
        apiSecret: 'rmSUywDnxvSEU9Pw',
    })

    const from = " HibritCard"
    const to = phoneNumberTo;
    const text = `Premium Hesabınızı aktifleştirmek için aşağıdaki kodu: ${smsActifKod} Premiıum a Geç bölümünde ilgili alana yazarak aktivasyonu tamamalayın.`
    nexxmo.message.sendSms(from, to, text);

}



exports.sendTwilioToTarik = (req, res) => {

    var sid = 'AC63864dd4bf68a19a48be0f713db9b99d'
    var auth_token = '7cd73a0ee911a8f00462d788b141bd53'

    var twilio = require('twilio')(sid, auth_token)


    twilio.messages.create({

        // from: "+12069446761",
        to: "+905306104278",
        body: "HibritCard uygulaması yeni arayüzü ve özellikleriyle artık daha da kullanışlı.Üstelik eski kullanıcılarımız için 2 ay boyunca Premium Hesaba özel 3 ilave profil HEDİYE!. Detaylar için: "



    }).then((data) => {

        console.log("Success Başarılı");
        return res.status(200).json({
            Success: "SuccesFully Sent Message!!"

        });

    }).catch((err) => {

        console.log("hataHere", err)

        return res.status(201).json({

            Mesaj: "This Message does'nt sent!!"

        })

    })


}



//send Message to Afetr Deploy
exports.sendMessageToEveryoneAfterDeploy = (req, res) => {

    //let phoneNumberTo = req.body.phoneNumberTo;


    //get all the number and send sms to everyone
    let userPhone = [];

    db.collection("userGeneral").get().then((data) => {

        console.log("allLong", data.length)

        data.forEach((doc) => {



            let numberUser = doc.data().phoneNumber
            let charcter = "5"

            if (numberUser.includes(charcter) && numberUser !== "") {

                if (numberUser.startsWith("5")) {

                    userPhone.push(
                        "90" + numberUser.substr(0),
                    )
                } else if (numberUser.startsWith("0")) {

                    userPhone.push(
                        "90" + numberUser.substr(1),
                    )

                } else if (numberUser.startsWith("9")) {

                    userPhone.push(
                        "90" + numberUser.substr(2),
                    )

                } else if (numberUser.startsWith("+")) {

                    userPhone.push(
                        "90" + numberUser.substr(3),
                    )

                }

                // userPhone.push(
                //     doc.data().phoneNumber,
                // )

            }

        });

        // return res.json(userPhone)
    }).then(() => {

        console.log("NumaraSayısı:", userPhone.length)

        return res.json(userPhone)


    }).catch(err => {

        console.error(err)

    })
}



//all homepage Link send

exports.allHomePageLinkTo = (req, res) => {




    let allkartUrl = []
    var verificationCode = "";

    const domaiUrl = db.collection("homepageLink")

    domaiUrl.get().then((data) => {

        data.forEach((doc) => {


            allkartUrl.push(

                {
                    urldata: doc.id
                }
            )
        })

    }).then(() => {

        allkartUrl.forEach((v, i) => {

            //console.log("idler", v.urldata)

            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 4; i++) {
                verificationCode += possible.charAt(Math.floor(Math.random() * possible.length));

            }

            const createIkon = {
                randomurlText: "deployTime",
                admingeneralUserIdOnly: "Ok",
                eMail: "abdoulkowiyy2020@gmail.com",
                verificationCode: verificationCode + "1P"
            }


            db.doc(`/cardUrlLinks/${v.urldata}`).get().then((doc) => {

                if (!doc.exists) {

                    console.log("okuldata", v.urldata)
                    db.doc(`/cardUrlLinks/${v.urldata}`).set(createIkon).then(() => {


                        console.log("dataaSend", v.urldata)
                    })

                    // db.collection("cardUrlLinks").add(createIkon).then(() => {

                    //     console.log("dataaSend", v.urldata)
                    // })


                } else {
                    console.log("dataYOK", v.urldata)
                }
            }).then(() => {

                //console.log(v.urldata)

            })


        })


    }).then(() => {
        return res.status(200).json({
            Success: "SuccesFully Sent All Link!!"

        });

        // return res.json(allkartUrl)

    }).catch((err) => {
        console.error(err)
    })

}


//get user data according to name
exports.getAlluserDataaaaa = (req, res) => {

    let allkartUrl = []

    const domaiUrl = db.collection("userGeneral").where("publicName", "==", "Melih Sandalcı")

    domaiUrl.get().then((data) => {

        data.forEach((doc) => {

            allkartUrl.push(

                doc.data()
            )
        })

    }).then(() => {
        return res.json(allkartUrl)

    }).catch((err) => {
        console.error(err)
    })


}


//admin panel Info bring from here
exports.adminPanelInfo = (req, res) => {

    let LinkDataToshow = []
    let connectedNotAllLink = []


    let AllInfoToputOut = []

    var uretilenAllLink;
    var bosLinklerBu;



    const linkCardHere = db.collection("cardUrlLinks");
    const connectedNotLinks = db.collection("cardUrlLinks").where("admingeneralUserIdOnly", "==", "Ok");




    linkCardHere.get().then((data) => {

        data.forEach((doc) => {

            LinkDataToshow.push(
                doc.data()
            )
        })

        return connectedNotLinks.get()


    }).then((data) => {

        data.forEach((doc) => {

            connectedNotAllLink.push(
                doc.data()
            )
        })

        //  return db.collection("userGeneral").where("startDateCount", "!=", "")

    }).then(() => {

        AllInfoToputOut.push({
            ToplamLinkCard: LinkDataToshow.length,
            connectedNotLinks: connectedNotAllLink.length,
            connectedAllLinks: LinkDataToshow.length - connectedNotAllLink.length,
            giveNotConnected: 0

        })

    }).then(() => {

        return res.json(AllInfoToputOut)



    }).catch((err) => {

        console.log("ahaat", err)

    })

}


// hide logo from here
exports.UpdateUserInfoHideLogo = (req, res) => {


    console.log("Ohyouare::", req.user.eMail)
    console.log("Ohyotr::", req.body.isDenemeTrue)


    db.doc(`/userGeneral/${req.user.eMail}`).update({

        hideLogo: req.body.hideLogo,

    }).then(() => {

        return res.status(400).json({
            Successfully: "Successfully deneme True"
        });


    }).catch((err) => {

        console.log(err)
        return res.status(500).json({
            err: err.code
        })

    })


}

// get only the users from the top

exports.getOnlyTheuserWithoutUser = (req, res) => {

    let userInfo = {}
    db.doc(`/userGeneral/${req.params.eMail}`).get().then(doc => {
        if (!doc.exists) {
            return res.status(404).json({ Mesaj: "kullanıcı not found!!" })
        }
        userInfo = doc.data()

    }).then(data => {
        return res.json(userInfo)
    }).catch(err => {
        console.error(err)
        return res.status(500).json({ Mesaj: err.code })

    })
}






//fİRST OPEN Message deneme

exports.UpdateUserInfoMessageFirstDeneme = (req, res) => {


    console.log("Ohyouare::", req.user.eMail)
    console.log("Ohyotr::", req.body.isDenemeTrue)


    db.doc(`/userGeneral/${req.user.eMail}`).update({

        isDenemeTrue: req.body.isDenemeTrue,

    }).then(() => {

        return res.status(400).json({
            Successfully: "Successfully deneme True"
        });


    }).catch((err) => {

        console.log(err)
        return res.status(500).json({
            err: err.code
        })

    })


}

//first stanadrt mesaage opene
exports.UpdateUserInfoMessageFirstStandart = (req, res) => {

    const newInfoToUpdate = {
        isStanadrtTrue: req.body.isStanadrtTrue,
    }

    db.doc(`/userGeneral/${req.user.eMail}`).update({


        isStanadrtTrue: newInfoToUpdate.isStanadrtTrue,

    }).then(() => {

        return res.status(400).json({
            Successfully: "Successfully deneme True"
        });


    }).catch((err) => {
        return res.status(500).json({
            err: err.code
        })

    })
}

//First Premium Message from here
exports.UpdateUserInfoMessageFirstPremium = (req, res) => {

    const newInfoToUpdate = {
        isPremiumTrue: req.body.isPremiumTrue,
    }

    db.doc(`/userGeneral/${req.user.eMail}`).update({


        isPremiumTrue: newInfoToUpdate.isPremiumTrue,

    }).then(() => {

        return res.status(400).json({
            Successfully: "Successfully deneme True"
        });


    }).catch((err) => {
        return res.status(500).json({
            err: err.code
        })

    })
}

// click Number to view contact Data
exports.clickContactDataNumber = (req, res) => {

    const newInfoToUpdate = {
        clickCountNumber: req.body.clickCountNumber,
    }

    db.doc(`/contactData/${req.params.contactDataId}`).update({


        clickCountNumber: newInfoToUpdate.clickCountNumber,

    }).then(() => {

        return res.status(400).json({
            Successfully: "Successfully contact Number Update"
        });


    }).catch((err) => {
        return res.status(500).json({
            err: err.code
        })

    })
}

// click Number to view sosyal Medya Link Url
exports.clickSosyalDataNumber = (req, res) => {

    const newInfoToUpdate = {
        clickCountNumber: req.body.clickCountNumber,
    }

    db.doc(`/panelUrlLinkOfUser/${req.params.sosyalUrlLink}`).update({


        clickCountNumber: newInfoToUpdate.clickCountNumber,

    }).then(() => {

        return res.status(400).json({
            Successfully: "Successfully contact Number Update"
        });


    }).catch((err) => {
        return res.status(500).json({
            err: err.code
        })

    })
}

// click Number to view Banka Hesap
exports.clickBankaDataNumber = (req, res) => {

    const newInfoToUpdate = {
        clickCountNumber: req.body.clickCountNumber,
    }

    db.doc(`/bankData/${req.params.bankDataId}`).update({


        clickCountNumber: newInfoToUpdate.clickCountNumber,

    }).then(() => {

        return res.status(400).json({
            Successfully: "Successfully contact Number Update"
        });


    }).catch((err) => {
        return res.status(500).json({
            err: err.code
        })

    })
}

//click Number to view Upload file
exports.clickUploadFileDataNumber = (req, res) => {

    const newInfoToUpdate = {
        clickCountNumber: req.body.clickCountNumber,
    }

    db.doc(`/fileUploadDocument/${req.params.uploadFileId}`).update({


        clickCountNumber: newInfoToUpdate.clickCountNumber,

    }).then(() => {

        return res.status(400).json({
            Successfully: "Successfully contact Number Update"
        });


    }).catch((err) => {
        return res.status(500).json({
            err: err.code
        })

    })
}

//click Number to view Customer Form
exports.clickCustomerFormDataNumber = (req, res) => {

    const newInfoToUpdate = {
        clickCountNumber: req.body.clickCountNumber,
    }

    db.doc(`/documentDataForm/${req.params.customerPanelId}`).update({


        clickCountNumber: newInfoToUpdate.clickCountNumber,

    }).then(() => {

        return res.status(400).json({
            Successfully: "Successfully contact Number Update"
        });


    }).catch((err) => {
        return res.status(500).json({
            err: err.code
        })

    })
}

//click Fatura from Form here
exports.clickFaturaDataNumber = (req, res) => {

    const newInfoToUpdate = {
        clickCountNumber: req.body.clickCountNumber,
    }

    db.doc(`/BillFaturaData/${req.params.faturaDataId}`).update({

        clickCountNumber: newInfoToUpdate.clickCountNumber,

    }).then(() => {

        return res.status(400).json({
            Successfully: "Successfully contact Number Update"
        });


    }).catch((err) => {
        return res.status(500).json({
            err: err.code
        })

    })
}