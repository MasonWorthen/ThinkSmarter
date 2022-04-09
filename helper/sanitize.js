let err = {
    'LoginErrorMessgae': '',
    'RegisterErrorMessage':'',
    'RecoveryPageMessage':'',
    'SurveyPageMessage': ''
}
const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;


module.exports = function(req,type){
    const fields = Object.keys(req.body);

    for(let c=0;c<fields.length;c++){
            req.body[fields[c]] =  req.body[fields[c]].replace(/[\\$'"]/g, "\\$&");
            req.body[fields[c]] =  req.body[fields[c]].trim();
    }

    if(type == 'login'){
        if(req.body.email == "" || req.body.password == ""){
                err["isValid"] = false
                err['LoginErrorMessage'] = 'Email or password field is missing'
                return [err,req.body]; 
        }
    }
    else if(type=='register'){
         if(req.body.email == ""||req.body.password == ""||req.body.username == ""||req.body.repassword == "" ){
            err["isValid"] = false
            err['RegisterErrorMessage'] = 'Some fields are empty please try again';
            return [err,req.body]; 
         }
         if(specialChars.test(req.body.username)){
            err["isValid"] = false
            err['RegisterErrorMessage'] = 'The username you entered contains special characters.';
            return [err,req.body]; 
         }

         if(req.body.username != req.body.username.replace(' ','')){
            err["isValid"] = false
            err['RegisterErrorMessage'] = 'The user name you enter is invalid please try again.';
            return [err,req.body]; 
         }
         if(req.body.password != req.body.repassword){
            err["isValid"] = false
            err['RegisterErrorMessage'] = 'The password & the password you enter do not match';
            return [err,req.body]; 
         }


    }
    else if(type=='recovery'){
        if(req.body.email == ""){
            err["isValid"] = false
            err['RecoveryErrorMessage'] = 'Your email field is missing.';
            err['RecoveryPageMessage'] = '';
            return [err,req.body]; 
        }
    }
    else if(type=='survey'){

        if(req.body.gender == ""||req.body.age == ""||req.body.critical == ""||req.body.improvementdec == "" ||req.body.improvementmem == "" ){
            err["isValid"] = false
            err['SurveyErrorMessage'] = 'One or more of your required fields are empty';
            err['SurveyPageMessage'] = '';
            return [err,req.body]; 
        }
            
    }

    err["isValid"] = true;

    return [err,req.body]; 
    
}