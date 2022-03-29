const generate = require("random-key");
const userController = require('../controllers/user.controller');
const Chess = require('../chess');
module.exports = class ChessSocketHandler{
    constructor(){
            this.users = {}
            this.lobby = {}
            this.matches = {}
        }
    createLobby(socket,io){
        socket.on('create', () => {
         
            const matchid = generate.generate();
            this.matches[matchid] = {
                players:[socket.id],
                puid:[socket.puid],
                status:"queue",
                game: new Chess()
            }
            socket.match = matchid;
            this.lobby[socket.username] = [socket.id];
            io.emit("matches",socket.username,matchid,this.matches[matchid].status);
            io.to(socket.id).emit('set',matchid);
    });
}

    cancelLobby(socket,io){

        socket.on('cancel' ,(mid,type,from,to)=>{


            if(type == 'request'){
                io.to(this.users[to].id).emit("cancelChallenger",from);
            }
            delete this.matches[mid];

            const matchkeys = Object.keys(this.matches);

            let status =[]
            let matchids=[]

            for(let s=0;s<matchkeys.length;s++){
                status.push(this.matches[matchkeys[s]].status);
                matchids.push(matchkeys[s])
            }
            
            io.emit("updtmatch",matchids,status)
            });    

    }

    connected(socket,io){
        socket.on('user', (id,name) => {
            socket.username = name;
            socket.match = null;
            socket.puid = id
            this.users[name] = {id: socket.id, puid: id}
            const allUsers = Object.keys(this.users);
            io.emit("users",allUsers,allUsers.length);

            const allMatches = Object.keys(this.matches);
            io.emit("users",allUsers,allUsers.length);

            const matchkeys = Object.keys(this.matches);
            let status =[]
            let matchids=[]

            for(let s=0;s<matchkeys.length;s++){
                status.push(this.matches[matchkeys[s]].status);
                matchids.push(matchkeys[s])
            }
            
            io.emit("updtmatch",matchids,status)
        });
    }
    
    disconnect(socket,io){
        //stop here challenger disconnect with active challenger request
        //delete from opponent user to provent server crash from game not existing
        // 03/19/22
        socket.on('disconnect', () => {
          
            
            try{
                if(socket.match && this.matches[socket.match].players.length == 1){
                      console.log(socket.challenger);
                    io.to(this.users[socket.challenger['to']].id).emit("cancelChallenger",socket.challenger['from']);
                }
                else{
                
                if(socket.id != this.matches[socket.match].players[0]){
                    io.to(this.matches[socket.match].players[0]).emit("default",this.matches[socket.match].game.history());
                    }
                else{
                    io.to(this.matches[socket.match].players[1]).emit("default",this.matches[socket.match].game.history());
                }
                userController.iterateLoses(socket.puid);

                if(socket.puid != this.matches[socket.match].puid[0]){
                    userController.iterateWins(this.matches[socket.match].puid[0]);
                }
                else{
                    userController.iterateWins(this.matches[socket.match].puid[1]);
                }

                }

                delete this.matches[socket.match];

                let matchkeys = Object.keys(this.matches);
               
                let status =[]
                let matchids=[]
                
    
                for(let s=0;s<matchkeys.length;s++){
                    status.push(this.matches[matchkeys[s]].status);
                    matchids.push(matchkeys[s])
                }
                
              io.emit("updtmatch",matchids,status)

              delete this.users[socket.username]
              const allUsers = Object.keys(this.users);
              io.emit("users",allUsers,allUsers.length);
             
            
                
              
                
            }catch(e){

            }
                    
        
        });
    }
    possibility(socket,io){
        socket.on('possible', (from,mid) => {
            const game = this.matches[mid].game;
            
            io.to(socket.id).emit("rpossible",game.combinations(from));
        });

    }

    check(socket,io){
        socket.on('isFinished', (mid) => {
            try{
            const game = this.matches[mid].game;
            if(game.isFinished()){
                const players = this.matches[mid].players


                userController.iterateLoses(socket.puid);

                if(socket.puid != this.matches[mid].puid[0]){
                    userController.iterateWins(this.matches[mid].puid[0]);
                }
                else{
                    userController.iterateWins(this.matches[mid].puid[1]);
                }
                for(let r=0;r< players.length;r++){
                    io.to(players[r]).emit("end", this.matches[mid].game.configurations(),null);
                }
              
                if(this.matches[mid]){
                    delete this.matches[mid];

                    const matchkeys = Object.keys(this.matches);
        
                    let status =[]
                    let matchids=[]
        
                    for(let s=0;s<matchkeys.length;s++){
                        status.push(this.matches[matchkeys[s]].status);
                        matchids.push(matchkeys[s])
                    }
                    
                    io.emit("updtmatch",matchids,status)
                    }
                }}catch(e){

                }    
             
        });
    }

    surrender(socket,io){
        socket.on('surrender', (mid,color) => {
                const players = this.matches[mid].players

                userController.iterateLoses(socket.puid);
            


               if(socket.puid != this.matches[mid].puid[0]){
                    userController.iterateWins(this.matches[mid].puid[0]);

                }
                else{
                    userController.iterateWins(this.matches[mid].puid[1]);
                }

                for(let r=0;r< players.length;r++){
                    io.to(players[r]).emit("end", this.matches[mid].game.configurations(),color,this.matches[mid].game.history());
                }
            delete this.matches[mid];

            const matchkeys = Object.keys(this.matches);

            let status =[]
            let matchids=[]

            for(let s=0;s<matchkeys.length;s++){
                status.push(this.matches[matchkeys[s]].status);
                matchids.push(matchkeys[s])
            }
            
            io.emit("updtmatch",matchids,status)
            });    
    }

    moves(socket,io){

        socket.on('moves', (move,mid) => {
            const players = this.matches[mid].players
                if(this.matches[mid].game.move(move.start,move.last)){

                    if(move.condition){
                        let temp = "";

                        if(move.piece == "♞" || move.piece == "♘"){
                            temp = "n";
                            if(this.matches[mid].game.turn() == "white"){
                                this.matches[mid].game.setPiece(move.last,temp.toLowerCase());
                            }
                            else{
                                this.matches[mid].game.setPiece(move.last,temp.toUpperCase());
                            }
                        }

                        if(move.piece == "♝" || move.piece == "♗"){
                            temp = "b";
                            if(this.matches[mid].game.turn() == "white"){
                                this.matches[mid].game.setPiece(move.last,temp.toLowerCase());
                            }
                            else{
                                this.matches[mid].game.setPiece(move.last,temp.toUpperCase());
                            }
                        }

                        if(move.piece == "♖" || move.piece == "♜"){
                            temp = "r";
                            if(this.matches[mid].game.turn() == "white"){
                                this.matches[mid].game.setPiece(move.last,temp.toLowerCase());
                            }
                            else{
                                this.matches[mid].game.setPiece(move.last,temp.toUpperCase());
                            }
                        }
                    }


                    for(let r=0;r< players.length;r++){

                        io.to(players[r]).emit("rmoves", move);
                        io.to(players[r]).emit("switch",this.matches[mid].game.turn());
                    }
                }
        });
    }

    requestLobby(socket,io){
        socket.on('request', (username,requester) => {
            socket.challenger = {"from":requester,"to":username}
            const matchid = generate.generate();
            this.matches[matchid] = {
                puid:[socket.puid],
                players:[socket.id],
                status:"queue",
                game: new Chess()
            }
            socket.match = matchid;
            io.to(socket.id).emit('set',matchid);
            io.to(this.users[username].id).emit("challenger",matchid,requester);
    });

    }

   

    confirmMove(socket,io){

    }

    isFinished(socket,io){

    }

    joinLobby(socket,io){
        socket.on('join', (matchid) => {
            socket.match = matchid;
            this.matches[matchid].players.push(socket.id);
            this.matches[matchid].puid.push(socket.puid);
            this.matches[matchid].status = "ongoing"
            
            const matchkeys = Object.keys(this.matches);
            let status =[]
            let matchids=[]

            for(let s=0;s<matchkeys.length;s++){
                status.push(this.matches[matchkeys[s]].status);
                matchids.push(matchkeys[s])
            }
            
            io.emit("updtmatch",matchids,status)
        
              io.to(this.matches[matchid].players[0]).emit("lobby",matchid,"black","white");
              io.to(this.matches[matchid].players[1]).emit("lobby",matchid,"white","white");
    });

    


    }
}
