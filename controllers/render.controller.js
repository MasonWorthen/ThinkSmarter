const firebase = require("../config/firebase.config");

function renderHome(req,res){
    if(!req.session.status){
         res.redirect('login')
    }
    else{  
    const db = firebase.getDatabase(firebase.firebaseApp)
    const referenceCount = firebase.ref(db);

    firebase.get(firebase.child(referenceCount, '/users/'+req.session.status)).then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val();
            res.render("profile",{"data":data,"uid":req.session.status});
            res.end();
        } else {
            res.end();
        }
    }).catch((error) => {
        res.end()
    });
    }
  
}
function renderGame(req,res){
    res.render('game',{uid:req.session.status});
}

function renderRecovery(req,res){
    res.render('recover',{'RecoveryPageMessage':'','RecoveryErrorMessage':''})
}

function renderResults(req,res){
    console.log(req.params.data);
    res.render('results',{data:req.params.data});
}
function renderSurvey(req,res){
  res.render('survey',{});
}
function renderResearch(req,res){{
    res.render("research",{});
}}
function renderRegister(req,res){
    res.render('register',{'RegisterErrorMessage':''});
}
function renderLogin(req,res){
    res.render('login',{'LoginErrorMessage':''});
}

function renderSearch(req,res){
    res.render('search');
}
module.exports = {renderLogin,renderHome,renderGame,renderRegister,renderSearch,renderResults,renderSurvey,renderResearch,renderRecovery}
