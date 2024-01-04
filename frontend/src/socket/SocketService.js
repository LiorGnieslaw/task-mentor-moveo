import io from "socket.io-client";
let socket = null;
const url = encodeURI("http://localhost:4000");
export const SocketService = {
  init,
  terminate,
  on,
  emit,
};

function init() {
    if (!socket) {
        socket = io(url);
    }
}

function terminate() {
    socket = null;
  }

function on(event, func) {
    if (socket) {
        socket.on(event, func);
    }
}

function emit(event, func) {
    if (socket) {
        socket.emit(event, func);
    }
}