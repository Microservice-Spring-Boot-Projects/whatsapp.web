import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {environment} from "../environments/environment";
export const WS_ENDPOINT = environment.wsEndpoint;
export const RECONNECT_INTERVAL = environment.reconnectInterval;


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  webSocketEndPoint: string = 'https://localhost:8445/whatsapp/websocket';
  topic: string = "/topic/message";
  stompClient: any;

  constructor() {
  }

  connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    // @ts-ignore
    _this.stompClient.connect({}, function (frame) {
      // @ts-ignore
      _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
        _this.onMessageReceived(sdkEvent);
      });
      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  };

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  // @ts-ignore
  errorCallBack(error) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  /**
   * Send message to sever via web socket
   * @param {*} message
   */
  // @ts-ignore
  send(message) {
    console.log("calling logout api via web socket");
    this.stompClient.send("/app/message", {}, JSON.stringify(message));
  }

  // @ts-ignore
  onMessageReceived(message) {
    console.log("Message Recieved from Server :: ");
    console.log(message);
    //this.appComponent.handleMessage(JSON.stringify(message.body));
  }

}
