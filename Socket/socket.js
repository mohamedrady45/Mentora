
let io;

module.exports = {
    init:httpServer => {
        io = require('socket.io')(httpServer);
        return io;
    },
    gitIO: () => {
        if (!io)
        console.log("Socket.IO not initialized");
        throw new Error("Socket.IO not initialized");
        return io;
    }
}