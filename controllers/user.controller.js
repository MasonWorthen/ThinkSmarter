const firebase = require("../config/firebase.config");
const VALIDATOR = require("../helper/sanitize");

function terminateSession(req,res){
    const auth = firebase.getAuth();
    firebase.signOut(auth).then(() => {
        req.session.destroy((err) => {
            if(err) {
                return console.log(err);
            }
            res.redirect('/login');
        });
    }).catch((error) => {
        res.send({error:"session could not be terminated"})
    });

}
function addUser(uid,username,email){
        const db = firebase.getDatabase(firebase.firebaseApp);
        firebase.set(firebase.ref(db, 'users/'+uid), {
            profile:{name:{first:"",last:""},email: email,username:username},
            standings:{wins:0,loses:0}
        }).then((userCredential) => {

            
        })
            .catch((error) => {
            });
}

function forgotPassword(req,res){

let validatorObject = VALIDATOR(req,'recovery');
if(validatorObject[0].isValid){
    req.body = validatorObject[1];

const auth = firebase.getAuth();
firebase.sendPasswordResetEmail(auth, req.body.email)
  .then(() => {
    res.render("recover",{'RecoveryPageMessage':'Your account recovery email has sucessfully been sent.','RecoveryErrorMessage': ''})
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    res.render("recover",{'RecoveryPageMessage':'','RecoveryErrorMessage': "Your email could not be sent."})
  });

}
else{
    res.render("recover",validatorObject[0])
}
}

function iterateLoses(uid){
    const db = firebase.getDatabase(firebase.firebaseApp)
    const referenceCount = firebase.ref(db);
    firebase.get(firebase.child(referenceCount, '/users/'+uid)).then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val();
            data["standings"]["loses"] +=1;
            firebase.set(firebase.ref(db, 'users/'+uid),data
            ).then((userCredential) => {
            })
                .catch((error) => {
                });

        } else {
            
        }
    }).catch((error) => {
        console.error(error);
    });
}
function iterateWins(uid){
    const db = firebase.getDatabase(firebase.firebaseApp)
    const referenceCount = firebase.ref(db);
    firebase.get(firebase.child(referenceCount, '/users/'+uid)).then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val();
            data["standings"]["wins"] +=1;
            firebase.set(firebase.ref(db, 'users/'+uid),data
            ).then((userCredential) => {
            })
                .catch((error) => {
                });

        } else {
           
        }
    }).catch((error) => {
        console.error(error);
    });
}

function authenticateUser (req,res){
let validatorObject = VALIDATOR(req,'login');
if(validatorObject[0].isValid){
    req.body = validatorObject[1];
    const auth = firebase.getAuth();
    firebase.signInWithEmailAndPassword(auth, req.body.email, req.body.password)
        .then((userCredential) => {
            const user = userCredential.user;
            req.session.status = user["uid"];
            res.redirect("/");
        })
        .catch((error) => {
            res.render("login",{"LoginErrorMessage":" Login Falied Please Try Again"})
        });
}
else{
    res.render("login",validatorObject[0])
}



    
}

function createUser(req,res){
    let validatorObject = VALIDATOR(req,'register');
if(validatorObject[0].isValid){
    req.body = validatorObject[1];
    const auth = firebase.getAuth();
    firebase.createUserWithEmailAndPassword(auth,req.body.email,req.body.password)
        .then((userCredential) => {
            const user = userCredential.user;
            req.session.status = user["uid"];
            addUser(user["uid"],req.body.username,req.body.email);
            res.redirect("/");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            res.render("register",{'RegisterErrorMessage':'Your account could not be created please try again.'})
        });
    }
    else{
        res.render("register",validatorObject[0]);
    }
}

module.exports={authenticateUser, terminateSession, createUser,iterateLoses,iterateWins,forgotPassword}