const firebase = require("../config/firebase.config");
const key = require('random-key');
const VALIDATOR = require("../helper/sanitize");
function addSurvey(req,res){

    let validatorObject = VALIDATOR(req,'survey');
    if(validatorObject[0].isValid){
    req.body = validatorObject[1];
    const db = firebase.getDatabase(firebase.firebaseApp);
    firebase.set(firebase.ref(db, 'surveys/'+key.generate(20)),req.body).then((userCredential) => {
        res.render('survey',{'SurveyPageMessage':'Survey has sucessfully been submitted. Thank you!','SurveyErrorMessage': ''});
    })
        .catch((error) => {
        });
    }
    else{
            res.render("survey",validatorObject[0])
    }
        
}

module.exports = {addSurvey}