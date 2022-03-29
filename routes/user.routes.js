const user = require("../controllers/user.controller")
module.exports = app => {

    const router = require("express").Router();
    router.post("/login", user.authenticateUser);
    router.post("/register", user.createUser);
    router.post("/forgot",user.forgotPassword);
    router.get("/logout",user.terminateSession);

    app.use("/", router);
}
