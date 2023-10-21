const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

// ** app configuration
app.set('view engin', 'ejs');
app.use(express.static('public'))

// to create random id if we have new guest with URL('/')
app.get('/', (req,res) => {
    res.redirect(`/${uuidV4}`)
});

// render ejs
app.get('/:page', (req,res) => {
    res.render('page' , {pageId: req.params.page})
})

// ** connection configuration

io.on('connection', socket => {
    socket.on('join-room' , (pageId, userId) => {
        socket.join(pageId);
        socket.to(pageId).broudcast.emit('user-connected',userId)

        socket.on('disconnected' , () => {
            socket.to(pageId).broadcast.emit('user-disconnected', userId)
        })
    })
})
