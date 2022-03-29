const { initializeApp } = require('firebase/app');
const  { getDatabase, ref , set, get ,child,push,postRef} = require('firebase/database');
const { getAuth, signInWithEmailAndPassword , signOut, signInWithCustomToken, createUserWithEmailAndPassword,sendPasswordResetEmail} =require("firebase/auth");
const fs = require("fs");
require("dotenv").config()
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId:process.env.APPID,
    measurementId: process.env.MEASUREMENTID
};

const firebaseApp = initializeApp(firebaseConfig);



module.exports ={getDatabase,firebaseApp,getAuth,signInWithEmailAndPassword,ref,set,get,child,signOut,signInWithCustomToken,createUserWithEmailAndPassword,push,sendPasswordResetEmail}