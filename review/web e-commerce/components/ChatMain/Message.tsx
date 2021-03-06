/**
 * @description: pure ui component, mutiple messages
 * @param {Props}
 * @return {ReactNode}
 * @author zixiu
 */

import React, { useState } from "react";
import IconFont from "../ui/TradexIcon";
import Mask from "../feedback/Mask";
import { MessageStatus, RoomStatus } from "./common";
import MessageLoading from "../../assets/img/loading.gif";
import OfficialIcon from "../../assets/img/icon_logowithbluecircle.svg";
import styles from "./Message.module.scss";

interface TimeMessageProps {
  time: string;
}

export const TimeMessage: React.SFC<TimeMessageProps> = ({ time }) => (
  <div className={styles.timeMessage}>{time}</div>
);

interface CarMessageProps {
  carMakeLogo?: string;
  carImage: string;
  carName: string;
  carStatus: number;
  carUnit: number;
  carMileage: number;
  carMileageUnit: string;
  orderType: number;
}

export const CarMessage: React.SFC<CarMessageProps> = ({
  carMakeLogo,
  carImage,
  carName,
  carStatus,
  carUnit,
  carMileage,
  carMileageUnit,
  orderType
}) => {
  return carImage ? (
    <div className={`${styles.message_car} ${styles.message}`}>
      <div className={styles.imageArea}>
        <img src={carMakeLogo} className={styles.makeLogo} />
        <img src={carImage} className={styles.cover} />
      </div>
      <div className={styles.infoArea}>
        <div className={styles.carName}>{carName}</div>
        <div className={styles.carStatus}>
          {carStatus === 1 && orderType !== 2 && (
            <span className={styles.instock}>IN STOCK</span>
          )}
          {carStatus === 2 && orderType !== 2 && (
            <span className={styles.incoming}>INCOMING</span>
          )}
          {orderType === 2 && (
            <span className={styles.instant_max}>INSTANT REQUEST</span>
          )}
          <span className={styles.carUnit}>
            <span className={styles.number}>{carUnit}</span>
            {carUnit > 1 ? "UNITS" : "UNIT"}
          </span>
        </div>
        <div className={styles.carMileage}>
          <IconFont type="iconicon_mileage_area" />
          <span>
            {carMileage}
            {carMileageUnit}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <React.Fragment />
  );
};

interface User {
  headshot: string;
  location: string;
}

type positionType = "left" | "right";
type colorType = "white" | "blue";
interface BubbleProps {
  text: string;
  position: positionType;
  color?: colorType;
}

export const Bubble: React.SFC<BubbleProps> = ({ text, position, color }) => {
  return (
    <div
      className={`${styles.bubble} ${
        position === "left" ? styles.bubble_left : styles.bubble_right
      } ${color === "white" ? styles.bubble_white : ""} ${
        color === "blue" ? styles.bubble_blue : ""
      }
      `}
    >
      {text}
    </div>
  );
};

interface TextMessageProps extends User {
  content: string;
  bubblePosition: positionType;
  roomType: RoomStatus;
  bubbleColor?: colorType;
  messageStatus?: MessageStatus;
  resendMessage?: any;
}

export const TextMessage: React.SFC<TextMessageProps> = ({
  content,
  headshot,
  location,
  roomType,
  bubblePosition,
  bubbleColor,
  messageStatus,
  resendMessage
}) => {
  return (
    <div
      className={`${styles.message_text} ${
        bubblePosition === "left" ? styles.text_left : styles.text_right
      } ${roomType === "max" ? styles.message_text_max : ""}`}
    >
      {messageStatus === "pending" && (
        <div className={styles.message_status}>
          <img src={MessageLoading} />
        </div>
      )}
      {messageStatus === "error" && (
        <div
          className={`${styles.message_status} ${styles.resend}`}
          onClick={resendMessage}
        >
          <IconFont type="iconicon_warning_area" />
        </div>
      )}
      <div className={styles.contentWrap}>
        <Bubble text={content} position={bubblePosition} color={bubbleColor} />
      </div>
      <div className={styles.user}>
        <img className={styles.headshot} src={headshot} />
        <img
          className={styles.location}
          src={require(`../../assets/img/flag/${location}.png`)}
        />
      </div>
    </div>
  );
};

interface ImageMessageProps extends User {
  url: string;
  bubblePosition: positionType;
  onLoad: any;
  messageStatus: "pending" | "success" | "error";
  roomType: RoomStatus;
  resendMessage: any;
}

export const ImageMessage: React.SFC<ImageMessageProps> = ({
  url,
  bubblePosition,
  headshot,
  location,
  onLoad,
  roomType,
  messageStatus,
  resendMessage
}) => {
  const [preview, setPreview] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={`${styles.message_text} ${
        bubblePosition === "left" ? styles.text_left : styles.text_right
      } ${roomType === "max" ? styles.message_text_max : ""}`}
    >
      <div className={styles.contentWrap} onClick={() => setPreview(true)}>
        <img
          src={url}
          className={styles.message_image}
          style={loaded ? {} : { width: 225, height: 340 }}
          onLoad={() => {
            onLoad();
            setLoaded(true);
          }}
        />
        {messageStatus === "pending" && (
          <div className={styles.image_loading}>
            <img src={MessageLoading} />
          </div>
        )}
        {messageStatus === "error" && (
          <div className={`${styles.image_error}`} onClick={resendMessage}>
            <div className={styles.error_wrap}>
              <IconFont type="iconicon_warning" />
            </div>
          </div>
        )}
      </div>
      <div className={styles.user}>
        <img className={styles.headshot} src={headshot} />
        <img
          className={styles.location}
          src={require(`../../assets/img/flag/${location}.png`)}
        />
      </div>

      {preview && (
        <Mask onClose={() => setPreview(false)} title={""}>
          <img
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            src={url}
            alt=""
          />
        </Mask>
      )}
    </div>
  );
};

interface OfferMessageProps {
  headshot: string;
  location?: string;
  children: React.ReactChild;
  bubblePosition: "left" | "right";
  roomType: RoomStatus;
  hideAvatar: boolean;
}

export const OfferMessage: React.SFC<OfferMessageProps> = ({
  children,
  bubblePosition,
  headshot,
  location,
  roomType,
  hideAvatar
}) => {
  return (
    <div
      className={`${styles.message_text} ${
        bubblePosition === "left" ? styles.text_left : styles.text_right
      } ${hideAvatar ? styles.hideAvatarWrap : ""} ${
        roomType === "max" ? styles.message_text_max : ""
      }`}
    >
      <div className={styles.contentWrap}>{children}</div>
      {/* <div className={styles.user} style={{ opacity: hideAvatar ? 0 : 1 }}> */}
      <div
        className={styles.user}
        style={{ display: hideAvatar ? "none" : "inline-block" }}
      >
        <img className={styles.headshot} src={headshot} />
        {location && (
          <img
            className={styles.location}
            src={require(`../../assets/img/flag/${location}.png`)}
          />
        )}
      </div>
    </div>
  );
};

interface OfferSuccessProps {
  text: string;
}

export const OfferSuccess: React.SFC<OfferSuccessProps> = ({ text }) => {
  return (
    <div className={styles.message_offer_success} title={text}>
      <IconFont type="iconicon_offer_line" className={styles.icon} />
      <span className={styles.content}>
        {text} You can <a className={styles.track_order}>click here</a> to track
        your Order.
      </span>
      <span className={styles.officialIcon}>
        <img src={OfficialIcon} alt="icon" />
      </span>
    </div>
  );
};

interface OfferRevokeProps {
  text: string;
}

export const OfferRevoke: React.SFC<OfferRevokeProps> = ({ text }) => {
  return (
    <div className={styles.message_offer_revoke} title={text}>
      <IconFont type="iconicon_offer_line" className={styles.icon} />
      <span className={styles.content}>{text}</span>
      <span className={styles.officialIcon}>
        <img src={OfficialIcon} alt="icon" />
      </span>
    </div>
  );
};
