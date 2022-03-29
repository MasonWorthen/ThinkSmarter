const manager = require("./sockets/main.sockets");


module.exports = io => {

    io.on('connection', (socket)=>{

        manager.CHESS.connected(socket,io);

        manager.CHESS.disconnect(socket,io);

        manager.CHESS.requestLobby(socket,io);
        
        manager.CHESS.possibility(socket,io);

        manager.CHESS.moves(socket,io);

        manager.CHESS.surrender(socket,io);
        
        manager.CHESS.cancelLobby(socket,io);

        manager.CHESS.check(socket,io);

        manager.CHESS.isFinished(socket,io);

        manager.MESSAGES.message(socket,io);
        
        manager.CHESS.createLobby(socket,io);
        manager.CHESS.joinLobby(socket,io);

    });
}