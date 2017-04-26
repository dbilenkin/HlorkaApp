import SocketIOClient from 'socket.io-client';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let WebSocket = {

  socket: new SockJS('http://localhost:8090/websocket/tracker'),
  subscribe : function(topic, callback) {
    return this.stompClient.subscribe(topic, callback);

  },

  init: function() {
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect({});
  }

}

WebSocket.init();

export default WebSocket;
