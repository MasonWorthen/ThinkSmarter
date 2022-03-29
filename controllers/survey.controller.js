const firebase = require("../config/firebase.config");
const key = require('random-key');
function addSurvey(req,res){
    
    const db = firebase.getDatabase(firebase.firebaseApp);
    firebase.set(firebase.ref(db, 'surveys/'+key.generate(20)),req.body).then((userCredential) => {
        res.redirect('/survey');
    })
        .catch((error) => {
        });
        
}

module.exports = {addSurvey}