import React from "react";
import { UserInfoStore } from "../../store/types";
import { injectIntl, IntlShape } from "react-intl";

export type RoomStatus = "max" | "min" | "common";
export type MessageType = "text" | "image" | "offer" | "car" | "time";
export type MessageStatus = "pending" | "success" | "error";
export const RoomPageSize = 10;
export const CarMessageType = "carMessage";
export const TimeMessageType = "timeMessage";
export const message_display_type = [1, 2, 6, 8, 9];
export const message_type = [1, 2, 6, 7, 8, 9];

export const mapMessageTypeToOfferBubbleStatus = new Map(
  Object.entries({
    7: 3,
    9: 4
  })
);

export interface MessageProps {
  msg_type: number | string;
  extra: {
    content?: string;
    url?: string;
    offer_status?: number;
  };
  messageStatus?: MessageStatus;
  sender?: {
    id: string;
    headshot: string;
    company_country: string;
    [key: string]: any;
  };
  receiver?: {
    id: string;
    headshot: string;
    company_country: string;
    [key: string]: any;
  };
  id?: string;
  message_id?: string;
  [key: string]: any;
  created_at: string;
}

export function uniqueID() {
  function chr4() {
    return Math.random()
      .toString(16)
      .slice(-4);
  }
  return (
    chr4() +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    "-" +
    chr4() +
    chr4() +
    chr4()
  );
}

export const SEND_MESSAGE_TIMEOUT = 10000;

export const timeTo24 = (time: string) => {
  const t = new Date(time);
  const hours = t.getHours();
  const minutes = t.getMinutes();
  return `${hours < 10 ? "0" : ""}${hours || ""}:${
    minutes < 10 ? "0" : ""
  }${minutes || ""}`;
};

interface IGetLocalTimeProps {
  timezone: string;
  intl: IntlShape;
}

interface IGetLocalTimeState {
  now: string;
}

class GetLocalTimeClass extends React.Component<
  IGetLocalTimeProps,
  IGetLocalTimeState
> {
  static defaultProps: IGetLocalTimeProps;
  private timer: any;
  state = {
    now: ""
  };

  getNow = () =>
    this.props.intl.formatTime(Date.now(), {
      timeZone: this.props.timezone,
      hour: "numeric",
      minute: "numeric",
      hour12: false
    });

  componentDidMount() {
    this.setState({ now: this.getNow() });
    const timer = setInterval(
      () => this.setState({ now: this.getNow() }),
      60000
    );
    this.timer = timer;
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  render() {
    return this.state.now;
  }
}

export const GetLocalTime = injectIntl(GetLocalTimeClass);

export const getJoinedTime = (last: string) => {
  if (!last) return "";
  const originPrev = new Date(Number(last));
  const prev = originPrev.getTime();
  const now = Date.now();
  const dateDiff = now - prev;
  const minuteDiff = Math.floor(dateDiff / (60 * 1000));
  const hourDiff = Math.floor(dateDiff / (60 * 1000 * 60));
  const dayDiff = Math.floor(dateDiff / (24 * 60 * 60 * 1000));
  const mounthDiff = Math.floor(dateDiff / (30 * 24 * 60 * 60 * 1000));

  if (minuteDiff <= 1) {
    return `1 minute ago`;
  }
  if (minuteDiff < 60) {
    return `${minuteDiff} minutes ago`;
  }
  if (hourDiff <= 1) {
    return `${hourDiff} hour ago`;
  }
  if (hourDiff < 24) {
    return `${hourDiff} hours ago`;
  }
  if (dayDiff <= 1) {
    return `${dayDiff} day ago`;
  }
  if (dayDiff < 30) {
    return `${dayDiff} days ago`;
  }
  if (mounthDiff <= 1) {
    return `${mounthDiff} month ago`;
  }
  if (mounthDiff < 12) {
    return `${mounthDiff} months ago`;
  }
  return `1 year ago`;
};

export const getMessageTime = (
  left: string,
  right: string,
  min_interval = 10
) => {
  if (!left && !right) return false;
  const originLeft = new Date(Number(left));
  const left_time = originLeft.getTime();
  const originRight = new Date(Number(right));
  const right_time = originRight.getTime();
  const dateDiff = Math.abs(right_time - left_time);
  const minuteDiff = Math.floor(dateDiff / (60 * 1000));
  if (!Number.isInteger(minuteDiff) || minuteDiff <= min_interval) {
    return false;
  }
  const now = new Date();
  const now_date = now.getDate();
  const now_year = now.getFullYear();

  const n = new Date();
  n.setDate(n.getDate() - 1);
  const yesterday = n.getDate();

  const right_date = originRight.getDate();
  const right_year = originRight.getFullYear();
  const year = `${originRight.getFullYear()}`;
  const month = `${
    originRight.getMonth() + 1 < 10 ? "0" : ""
  }${originRight.getMonth() + 1}`;
  const day = `${
    originRight.getDate() < 10 ? "0" : ""
  }${originRight.getDate()}`;
  const hour = `${
    originRight.getHours() < 10 ? "0" : ""
  }${originRight.getHours()}`;
  const minute = `${
    originRight.getMinutes() < 10 ? "0" : ""
  }${originRight.getMinutes()}`;

  if (right_date === now_date) {
    return `${hour}:${minute}`;
  }
  if (right_date === yesterday) {
    return `Yesterday ${hour}:${minute}`;
  }
  if (right_year === now_year) {
    return `${month}-${day} ${hour}:${minute}`;
  }
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

export const base64ToBlob = (base64Image: string) =>
  fetch(base64Image)
    .then(res => res.blob())
    .then(
      blob => new File([blob], `image_from_chat.${blob.type.split("/")[1]}`)
    );

export interface RoomProps extends React.SFC {
  id: string;
  carName: string;
  carMileage: number;
  carMileageUnit: string;
  carStatus: number;
  targetName: string;
  targetLocale: string;
  targetActive: string;
  targetHeadshot: string;
  orderType: number;
}

export interface MaxRoomProps {
  chatroom: object;
  targetJoined: string;
  targetTotalTrad: number;
  targetLocalTime: string;
  carImage: string;
  carMakeLogo: string;
  carUnit: number;
  results: any[];
  loading: boolean;
  user: UserInfoStore;
  imageMessage: (data: FormData) => any;
  textMessage: (text: string) => any;
  onClose: () => any;
  onPageChange: () => any;
  resendMessage: any;
}

export interface CommonRoomProps {
  chatroom: object;
  targetLocalTime: string;
  results: any[];
  loading: boolean;
  user: UserInfoStore;
  imageMessage: (data: FormData) => any;
  textMessage: (text: string) => any;
  changRoomStatus: (nextStatus?: RoomStatus) => any;
  closeRoom: () => any;
  onPageChange: () => any;
  resendMessage: any;
}

export interface MinRoomProps extends RoomProps {
  targetLocale: string;
  targetActive: string;
  changRoomStatus: (nextStatus?: RoomStatus) => any;
  closeRoom: () => any;
}

export type TSendImageMessage = (
  data: FormData,
  base64Image: string,
  uuid: string
) => void;
export type TSendTextMessage = (message_id: string) => void;
export type TReSendMessage = (
  message: MessageProps
) => (e: React.MouseEvent<HTMLDivElement>) => void;
export type TChangRoomStatus = () => void;
export type TCloseRoom = () => void;
export type TOnPageChange = () => void;
