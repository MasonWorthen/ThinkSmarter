const ChessSocketHandler = require('./chess.sockets');
const MessageSocketHandler = require('./message.sockets');


module.exports = {
    CHESS: new ChessSocketHandler(),
    MESSAGES:new MessageSocketHandler(),
} 
