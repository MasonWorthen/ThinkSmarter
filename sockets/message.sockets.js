//These are just a list of words that are banned.
//ThinkSmarter is an inclusive and negative free environment foul lanagauge will not be tollerated.
const banned = ["bitch","nigga","nigger","ass","stupid","whore","pussy","fuck","dick","cracker","stupid","loser","fag"];
module.exports = class MessageSocketHandler{
    _botChecker(message){
            for(let r=0; r< banned.length;r++){
                    if(message.includes(banned[r])){
                        return false;
                    }
            }
            return true
    }

    message(socket,io){
        socket.on('message', (message,user) => {
            if(this._botChecker(message)){

                if(message.includes("#ThinkSmarter")){
                   
                    io.emit("transfer",`Giving a huge shout out to ${user} thanks for support`,"@Admin");
                    io.emit("transfer", message,user);
                }
                else{
                    io.emit("transfer", message,user);
                }
               
                
            }
            else{
                io.to(socket.id).emit("transfer", "Be careful remember to think before you post","@Admin");
            }

            
            


  

               
        });
    }


}