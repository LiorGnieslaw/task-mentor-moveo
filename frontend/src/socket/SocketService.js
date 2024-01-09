import io from "socket.io-client";
import { BASE_URL } from "../constants";

let socket = null;
const url = encodeURI(BASE_URL);
export const SocketService = {
  init,
  terminate,
  on,
  emit,
};

function init() {
    if (!socket) {
        socket = io(url, { transports: ['websocket'], cors: { origin: '*' } });
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