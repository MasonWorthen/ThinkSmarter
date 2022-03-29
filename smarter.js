const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const http = require('http').Server(app);
require("dotenv").config();
const session = require('express-session');

const io = require('socket.io')(http);
const path = require('path');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
    origin: '*'
}));

//uses this when deploying server code for sockets
/*app.use(cors({
    origin: '*',
    credentials:true,
    methods: ["GET", "POST"]
}));*/

app.use(session({
    secret: process.env.SECRET,
    cookie:{},
    resave:false,
    saveUninitialized: false
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

if(app.get("env") === "production"){
    session.cookie.secure = true;
}
const port = process.env.PORT || 3005;
let activeUsers = {};

app.set('view engine', 'ejs');

app.set('views',path.join(__dirname,'views'));
app.use(express.static('public'));

//app.use(express.static(path.join(__dirname,'public'))); use this if needed to for the server deployment version
app.use(express.json());
app.use(express.urlencoded({extended:false}));

require('./routes/app.routes')(app);
require('./routes/user.routes')(app);
require("./routes/survey.routes")(app);
require('./sockets')(io);


http.listen(port,()=>{
    console.log('Server started on port ' + port);
})