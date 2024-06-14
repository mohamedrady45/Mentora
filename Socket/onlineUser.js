
let onlineUsers = [];
//Online users
const onlineUser = (io) => {
    io.on('connection', (socket ) => {
        const userId = socket.handshake.query.userId;
        console.log("client connected", userId);

        socket.on('addNewUser', userId => {
            !onlineUsers.some((user) => user.userId === userId) &&
                onlineUsers.push({
                    userId: userId,
                    socketId: socket.id
                })
            io.emit('getOnlineUsers', onlineUsers)
        })

        socket.on('disconnect', () => {
            onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
            io.emit('getOnlineUsers', onlineUsers);
            console.log("client disconnected");
        })
    })  
}


module.exports = onlineUser;
