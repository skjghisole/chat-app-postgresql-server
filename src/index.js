import '@babel/polyfill'
import express from 'express'
import bodyParser from 'body-parser'
// import { createServer } from 'http'
import cors from 'cors'

import io from 'socket.io'

import { Client } from 'pg'
import { MessageRoutes, UserRoutes } from './routes'


const app = express()
app.use(cors())

// const wss = io(createServer(app))
// console.log(wss)



// wss.emit('connection', { msg: 'Hello' })
// wss.on('Say this', socket => {
// 	console.log(`Someone said: ${socket.msg}`)
// })


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


const port = process.env.PORT || 2020
const server = app.listen(port, console.log(`Server started at http://localhost:${port}`))

// creation of ws server
const wss = io(server)

wss.on('connection', function(socket) {
	socket.emit('connectedUser', { user: socket.id })
	socket.on('userConnected', function() {
		socket.broadcast.emit('newUser', { msg: 'a new User is connected!'})
	})
})

const applySocketMiddleware = (req, res, next) => {
	req.socket = wss
	next()
}

app.use('/messages', applySocketMiddleware, MessageRoutes)
app.use('/users', applySocketMiddleware, UserRoutes)

