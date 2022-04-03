const jsChessEngine = require('js-chess-engine');

module.exports = class Chess{
    constructor(){
        this.game = new jsChessEngine.Game();
    }
    turn(){
        return this.game.board.configuration.turn;
    }
    getSMID(){
        return
    }
    setPiece(v1,v2){
        this.game.setPiece(v1,v2)
    }
    aiMove(level){
        return this.game.aiMove(level);
    }
  
    print(){
        return this.game.printToConsole()
    }
    configurations(){
        return this.game.board.configuration;
    }
    combinations(from){
        return this.game.moves(from)
    }

    course(start){
        return this.game.moves(start)
    }
    isValid(start,end){
        const possible =this.game.moves(start);
        if(possible.length != 0){
            if(possible.indexOf(end.toUpperCase()) >=0){
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

    history(){
        return this.game.getHistory();
    }

    move(start,end){
        if(this.isValid(start,end)){
           this.game.move(start,end);
            return true;
        }
        else{
            return false
        }
    }
    checkMate(){
        return this.game.board.configuration.checkMate;
    }

    isFinished(){
        return this.game.board.configuration.isFinished;

    }


 






}  


