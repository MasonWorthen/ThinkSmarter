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
  res.render('survey',{'SurveyPageMessage':'','SurveyErrorMessage': ''});
}
function renderResearch(req,res){
    const db = firebase.getDatabase(firebase.firebaseApp)
    const referenceCount = firebase.ref(db);

    firebase.get(firebase.child(referenceCount, '/surveys')).then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val();
            console.log(data);
            let keys = Object.keys(data);
            let criTotal = 0;
            let male = 0;
            let female=0;
            let non_binary = 0;
            let memTotal = 0;
            let decTotal = 0;

            for(let x=0; x< keys.length;x++){
                if(data[keys[x]]['improvementmem'] == 'Yes'){
                    memTotal +=1;
                }
                if(data[keys[x]]['critical']= 'Yes'){
                    criTotal +=1;
                }
                if(data[keys[x]]['improvementdec']='Yes'){
                    decTotal +=1;
                }

                if(data[keys[x]]['gender'] == 'Male'){
                    male +=1;
                }
                else if(data[keys[x]]['gender'] == 'Female'){
                    female +=1;
                }
                else{
                    non_binary +=1;
                }
                console.log(memTotal);
                console.log(criTotal);
                console.log(decTotal);
                console.log(male);
                console.log(female)
                console.log(non_binary);
                
            }
            const researchObj = {
                'memory':memTotal,
                'critical':criTotal,
                'decision':decTotal,
                'male':male,
                'percentage':{
                    'male':(male/keys.length)*100,
                    'female':(female/keys.length)*100,
                    'non-binary':(non_binary/keys.length)*100
                },
                'female':female,
                'non-binary':non_binary,
                'total':keys.length
            }
            res.render("research",{"data":researchObj});
            res.end();
        } else {
            res.render("research",{"data":{}});
            res.end();
        }
    }).catch((error) => {
        res.end(error)
    });
    }
    
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
