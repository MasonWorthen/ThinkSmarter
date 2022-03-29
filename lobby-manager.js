const generate = require("random-key");
const userController = require('./controllers/user.controller');
const jsChessEngine = require('js-chess-engine')

module.exports = class LobbyManager{
    constructor(){
        this.lobby = [];
        this.matches ={};
        this.active = [];
        this.puid =[];
    }

    connected(socket,io){
        socket.on('user', (username,name) => {
            socket.username = username;
            socket.name = name;
            this.puid.push(socket.username);
            this.addPlayer(socket);
            this.canCreate(io);
            this.active.push(name);
            console.log(this.active);
            io.emit("success",this.active,this.active.length);
        });
    }
    possibility(socket,io){
        socket.on('possible', (from,mid) => {
            const game = this.matches[mid].game;
            io.to(socket.id).emit("rpossible",game.moves(from));
        });

    }

    _valid(socket,io,game,start,finish){
        const possible = game.moves(start);
        if(possible.length != 0){
            if(possible.indexOf(finish.toUpperCase()) >=0){
                    return true;
            }
            else{
                return false
            }
        }
        else{
            return false;
        }
    }

    check(socket,io){
        socket.on('isFinished', (mid) => {
            console.log(this.matches[mid].game.board.configuration.isFinished);
            if(this.matches[mid].game.board.configuration.isFinished){
                const players = this.matches[mid].players

                userController.iterateLoses(socket.username);

                if(socket.username != this.matches[mid].puid[0]){
                    userController.iterateWins(this.matches[mid].puid[0]);

                }
                else{
                    userController.iterateWins(this.matches[mid].puid[1]);
                }
                for(let r=0;r< players.length;r++){
                    io.to(players[r]).emit("end", this.matches[mid].game.board.configuration,null);
                }
            }
        });
    }

    surrender(socket,io){
        socket.on('surrender', (mid,color) => {
                const players = this.matches[mid].players
                userController.iterateLoses(socket.username);


               if(socket.username != this.matches[mid].puid[0]){
                   userController.iterateWins(this.matches[mid].puid[0]);

               }
               else{
                   userController.iterateWins(this.matches[mid].puid[1]);
               }


                for(let r=0;r< players.length;r++){
                    io.to(players[r]).emit("end", this.matches[mid].game.board.configuration,color,this.matches[mid].game.getHistory());
                }
            });
    }
    moves(socket,io){

        socket.on('moves', (move,mid) => {
            const players = this.matches[mid].players
            console.log(this.matches[mid].game.board.configuration.turn);
                if(this._valid(socket,io,this.matches[mid].game,move.start,move.last)){
                    this.matches[mid].game.move(move.start,move.last);
                    if(move.condition){
                        let temp = "";

                        if(move.piece == "♞" || move.piece == "♘"){
                            temp = "n";
                            if(this.matches[mid].game.board.configuration.turn == "white"){
                                this.matches[mid].game.setPiece(move.last,temp.toLowerCase());
                            }
                            else{
                                this.matches[mid].game.setPiece(move.last,temp.toUpperCase());
                            }
                        }

                        if(move.piece == "♝" || move.piece == "♗"){
                            temp = "b";
                            if(this.matches[mid].game.board.configuration.turn == "white"){
                                this.matches[mid].game.setPiece(move.last,temp.toLowerCase());
                            }
                            else{
                                this.matches[mid].game.setPiece(move.last,temp.toUpperCase());
                            }
                        }

                        if(move.piece == "♖" || move.piece == "♜"){
                            temp = "r";
                            if(this.matches[mid].game.board.configuration.turn == "white"){
                                this.matches[mid].game.setPiece(move.last,temp.toLowerCase());
                            }
                            else{
                                this.matches[mid].game.setPiece(move.last,temp.toUpperCase());
                            }
                        }
                    }

                    for(let r=0;r< players.length;r++){

                        io.to(players[r]).emit("rmoves", move);
                        io.to(players[r]).emit("switch",this.matches[mid].game.board.configuration.turn);
                    }
                }
        });
    }

    message(socket,io){
        socket.on('message', (message,user) => {
                io.emit("rmessage", message,user);

        });
    }

    disconnect(socket,io){
        socket.on('disconnect', (user) => {
            this.active.splice(user);
    
            for( var i = 0; i < this.active.length; i++){ 
                if ( this.active[i] === user) { 
                    this.active.splice(i, 1); 
                }
            }
            io.emit("success",this.active);
            console.log(this.active);
            console.log("disconnecd user "+ socket.name);
        
        });
    }

    addPlayer(socket){
        this.lobby.push(socket.id)
        this._message();
    }

    canCreate(io){
        if(this.lobby.length >= 2){
            this._createMatch(io);
        }
    }

    _createMatch(io){
        const mid = generate.generate();

        let players = [this.lobby.shift(),this.lobby.shift()];
        let uid = [this.puid.shift(),this.puid.shift()]

        this.matches[mid] = {
            players:players,
            puid:uid,
            status:"ongoing",
            turn:"white",
            game: new jsChessEngine.Game()
        }
        console.log(this.matches);

        io.to(players[0]).emit("lobby",mid,"white","white");
        io.to(players[1]).emit("lobby",mid,"black","white");

        console.log("match has been created- size: "+this.lobby.length);
    }

    _message(){
        console.log("player joined lobby- size: "+this.lobby.length);

    }

}






