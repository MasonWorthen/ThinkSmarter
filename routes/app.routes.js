const render = require("../controllers/render.controller")
module.exports = app => {
    const router = require("express").Router();

    router.get('/',render.renderHome);
    router.get('/login',render.renderLogin);
    router.get('/home',function (req,res){
        res.redirect("/");
        res.end();
    });
    router.get('/forgot',render.renderRecovery);
    router.get('/game',render.renderGame);
    router.get('/survey',render.renderSurvey);
    router.get('/research',render.renderResearch);
    router.get('/results/:data',render.renderResults);
    router.get('/register',render.renderRegister);

    app.use("/", router);
}
