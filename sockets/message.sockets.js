module.exports = class MessageSocketHandler{

    message(socket,io){
        socket.on('message', (message,user) => {
                io.emit("transfer", message,user);
        });
    }


}