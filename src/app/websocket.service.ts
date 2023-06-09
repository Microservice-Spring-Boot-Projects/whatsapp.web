import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {environment} from "../environments/environment";
import {Subject} from "rxjs";
import {Message} from "./pojos";
import {Frame} from "stompjs";
export const WS_ENDPOINT = environment.wsEndpoint;
export const RECONNECT_INTERVAL = environment.reconnectInterval;


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  webSocketEndPoint: string = 'https://localhost:8445/whatsapp/websocket';
  topic: string = "/topic/message";
  stompClient: any;

  // @ts-ignore
  private myFunc: (message) => void;
  onWebsocketEvent(fn: (message:Message) => void) {
    this.myFunc = fn;
    // from now on, call myFunc wherever you want inside this service
  }

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
  send(message: Message) {
    console.log("calling logout api via web socket");
    this.stompClient.send("/app/message", {}, JSON.stringify(message));
  }

  // @ts-ignore
  onMessageReceived(msg: Frame) {
    let message: Message = JSON.parse(msg.body);
    this.myFunc(message);
  }

}
