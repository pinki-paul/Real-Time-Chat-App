const express = require('express');

const app = express();
const port = process.env.port || 8000;

const http = require('http').Server(app);
const io = require('socket.io')(http);

const path = require('path');
const mainfile = path.join(__dirname,"../");
//console.log(mainfile);

app.use(express.static(mainfile));

app.get("/", (req,res)=>{
   res.sendFile(mainfile + "/index.html");
})

const activeusers = {};

io.on("connection",(socket)=>{
    socket.on("new_user_joined", (username)=>{
        //console.log("new user ",username );
        activeusers[socket.id] = username;
        socket.broadcast.emit("user-joined", username);

        socket.on("disconnect",()=>{
            //console.log("user left ",username);
            socket.broadcast.emit("user-left", username);
        })

    });
    socket.on("send",(message)=>{
       // console.log(message);
         socket.broadcast.emit("recieve",{message: message, username: activeusers[socket.id]});
    })
})

http.listen(port,'127.0.0.1',()=>{
    console.log(`Server running at port ${port}`);
});