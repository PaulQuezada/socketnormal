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
var viaje_enviado = null;
var pasajaro_enviado = null;
io.on('connection', (socket) => {
  usuariosConectados++;

  socket.on('disconnect', () => {
    usuariosConectados--;

  });
  socket.on("mensaje:enviado", async (data) => {
    // Envía el mensaje a todos los clientes conectads, except el q lo envia
    console.log("MENSAJE AHORA")
    console.log(data)
    console.log("MENSJAES ANTERIORES")
    console.log(viaje_enviado)
    console.log(pasajaro_enviado)

    console.log(viaje_enviado + "!=" + data.idviaje + " && " + pasajaro_enviado + " != " + data.nombrepasajero)
    if (viaje_enviado == null) {
      await socket.broadcast.emit("mensaje:recibido", data);
    } else if (viaje_enviado != data.idviaje) {
      await socket.broadcast.emit("mensaje:recibido", data);
    }
    else if (viaje_enviado == data.idviaje && pasajaro_enviado != data.nombrepasajero) {
      await socket.broadcast.emit("mensaje:recibido", data);
    } else {
      console.log("Mensaje ERROR no ENVIADO:")
    }
    viaje_enviado = data.idviaje
    pasajaro_enviado = data.nombrepasajero
  });

  socket.on("viaje:enviado", (data) => {
    // Envía el mensaje a todos los clientes conectads, except el q lo envia
    console.log("Mensaje Enviado:")
    socket.broadcast.emit("viaje:recibido", data);
    console.log("Mensaje Recibido:", data)
  });

});

//Puerto de socket
// Cerramos por completo el servidor para desconectar a los usuarios q esten dentro

var portsocket = process.env.PORT || 5003;

http.listen(portsocket, () => {
  console.log('listening on :', portsocket);
});

