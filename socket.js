let io;
module.exports = {
    init:httpServer => {
        io = require('socket.io')(httpServer);
        return io;
    },
    gitIO: () => {
        if (!io)
        throw new Error("Socket.IO not initialized");
        return io;
    }
}