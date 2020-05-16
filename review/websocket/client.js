let count = 0;

class WS {
  constructor(props) {
    this.props = props;
    this.connect();
    this.clientTimeout = 5000;
    this.serviceTimeout = 5000;
    this.clientCheckTimer = null;
    this.serviceCheckTimer = null;
    this.loading = false;
    this.isManualClosed = false;
    this.reconnectCountMax = 5;
    this.currentReconnectCount = 0;
  }

  connect() {
    console.log("connect");
    this.loading = true;
    const ws = new WebSocket(this.props.url);
    ws.onopen = this.onopen;
    ws.onclose = this.onclose;
    ws.onerror = this.onerror;
    ws.onmessage = this.onmessage;
    this.ws = ws;
  }

  reconnect = () => {
    console.log("reconnect", this.currentReconnectCount, this.reconectCountMax);
    if (this.loading || this.isManualClosed) return;
    this.clearAllTimer();
    if (this.currentReconnectCount >= this.reconnectCountMax) {
      this.props.onerror();
      return;
    }
    this.connect();
    this.currentReconnectCount++;
  };

  onopen = () => {
    console.log("onopen");
    this.loading = false;
    this.setHeartbeatCheck();
    this.props.onopen && this.props.onopen();
  };

  onclose = () => {
    console.log("onclose");
    this.reconnect();
    this.props.onclose && this.props.onclose();
  };

  onerror = () => {
    console.log("onerror");
    this.reconnect();
    this.props.onerror && this.props.onerror();
  };

  onmessage = (message) => {
    this.resetHeartbeatCheck();
    console.log("onMessage: ", message.data);
    this.props.onmessage && this.props.onmessage();
  };

  clearAllTimer = () => {
    clearTimeout(this.clientCheckTimer);
    clearTimeout(this.serviceCheckTimer);
  }

  resetHeartbeatCheck = () => {
    this.clearAllTimer();
    this.setHeartbeatCheck();
  };

  setHeartbeatCheck = () => {
    console.log('set')
    let _this = this;
    this.clientCheckTimer = setTimeout(() => {
      _this.ws.send("ping" + count++);
      console.log(_this.ws.readyState, "check client");
      _this.serviceCheckTimer = setTimeout(() => {
        console.log(_this.ws.readyState, "check service");
        _this.ws && _this.ws.close();
      }, _this.serviceTimeout);
    }, this.clientTimeout);
  };

  checkStatus = () => (!this.ws || this.ws.readyState !== 1 ? false : true);

  send = (msg) => {
    this.checkStatus() && this.ws.send(msg);
  };

  close = () => {
    this.isManualClosed = true;
    this.clearAllTimer();
    this.checkStatus() && this.ws.close();
  };
}

let ws = new WS({
  url: "ws://localhost:8080",
});