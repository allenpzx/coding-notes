import React from "react";
import { UserInfoStore } from "../../store/types";

export type RoomStatus = "max" | "min" | "common";
export type MessageType = "text" | "image" | "offer" | "car" | "time";
export type MessageStatus = "pending" | "success" | "error";
export const RoomPageSize = 10;
export const CarMessageType = "carMessage";
export const TimeMessageType = "timeMessage";
export interface MessageProps {
  msg_type: number | string;
  extra: {
    content?: string;
    url?: string;
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

export const getMessageTime = (last: string) => {
  if (!last) return false;
  const originPrev = new Date(Number(last));
  const prev = originPrev.getTime();
  const now = Date.now();
  const dateDiff = now - prev;
  const minuteDiff = Math.floor(dateDiff / (60 * 1000));
  if (!Number.isInteger(minuteDiff) || minuteDiff < 11) {
    return false;
  }
  const dayDiff = Math.floor(dateDiff / (24 * 60 * 60 * 1000));
  const year = `${originPrev.getFullYear()}`;
  const month = `${
    originPrev.getMonth() + 1 < 10 ? "0" : ""
  }${originPrev.getMonth() + 1}`;
  const day = `${originPrev.getDate() < 10 ? "0" : ""}${originPrev.getDate()}`;
  const hour = `${
    originPrev.getHours() < 10 ? "0" : ""
  }${originPrev.getHours()}`;
  const minute = `${
    originPrev.getMinutes() < 10 ? "0" : ""
  }${originPrev.getMinutes()}`;
  if (dayDiff <= 1) {
    return `${hour}:${minute}`;
  }
  if (dayDiff <= 2) {
    return `yesterday ${hour}:${minute}`;
  }
  if (dayDiff <= 365) {
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
