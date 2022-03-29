const survey = require("../controllers/survey.controller")
module.exports = app => {
    const router = require("express").Router();

    router.post('/survey',survey.addSurvey);
   
    app.use("/", router);
}