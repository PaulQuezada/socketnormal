import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
const http = require('http').createServer(app);

const app = express();

//Conexion DB Local
/* const uri = 'mongodb://localhost:27017/myapp'; */
//hola
//Conexion DB nubr

// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
/* app.get('/', (req, res) => {
  res.send('Hello World!');
}); */




// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

const io = require('socket.io')(http, {
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
  },
});

let usuariosConectados = 0
io.on('connection', (socket) => {
  usuariosConectados++;
  console.log("Total Usuarios(CON):", usuariosConectados);
  console.log("Usuario Conectado:", socket.id);
  socket.on('disconnect', () => {
    usuariosConectados--;
    console.log("Usuario Conectado:", socket.id);
    console.log("Total Usuarios(DES):", usuariosConectados);
  });
  socket.on("mensaje:enviado", (data) => {
    // Envía el mensaje a todos los clientes conectads, except el q lo envia
    console.log("Mensaje Enviado:")
    socket.broadcast.emit("mensaje:recibido", data);
    console.log("Mensaje Recibido:")
  });

});

//Puerto de socket
// Cerramos por completo el servidor para desconectar a los usuarios q esten dentro

var portsocket = process.env.SOCKETPORT || 5003;

http.listen(portsocket, () => {
  console.log('listening on :', portsocket);
});

