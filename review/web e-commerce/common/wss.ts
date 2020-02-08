import { getCookie } from "../../common/cookie";

let WSS_ROOT = process.env.WSS_ROOT
  ? process.env.WSS_ROOT + "/ws"
  : "wss://tradex-ws-pre.tradex-cdn.com/ws";

let token = getCookie("Authorization");
token = token ? token.replace("Token ", "") : "";

const HEART_BEAT_INTERVAL = 30000;

function heartCheck(wss: WebSocket) {
  const timer = setInterval(() => {
    wss.send(JSON.stringify({ type: "ping" }));
  }, HEART_BEAT_INTERVAL);
}

function getWebSocketURL(chatroom_id?: string) {
  if (chatroom_id) {
    return `${WSS_ROOT}/chatroom/${chatroom_id}/?token=${token}`;
  } else {
    return `${WSS_ROOT}/user/?token=${token}`;
  }
}

interface WebSocketManagerParam {
  onOpen?: Function;
  onClose?: Function;
  onError?: Function;
  onMessage?: Function;
  chatroom_id?: string;
}

export class WebSocketManager {
  wss: WebSocket;
  isManual: Boolean;

  constructor(params: WebSocketManagerParam = {}) {
    this.isManual = false;

    this.wss = new WebSocket(getWebSocketURL(params.chatroom_id));

    this.wss.onopen = () => {
      heartCheck(this.wss);
      params.onOpen && params.onOpen();
    };

    this.wss.onmessage = (data: any) => {
      params.onMessage && params.onMessage(JSON.parse(data.data));
    };

    this.wss.onclose = () => {
      params.onClose && params.onClose();

      if (!this.isManual) {
        this.wss = new WebSocket(getWebSocketURL(params.chatroom_id));
      }
    };

    this.wss.onerror = () => {
      params.onError && params.onError();

      if (!this.isManual) {
        this.wss = new WebSocket(getWebSocketURL(params.chatroom_id));
      }
    };
  }

  send = (data: any) => {
    this.wss.send(JSON.stringify(data));
  };

  close = () => {
    this.isManual = true;
    this.wss.close();
  };
}
