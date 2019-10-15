import React, { useState } from 'react';
import IconFont from '../ui/TradexIcon';
import Mask from '../feedback/Mask';
import styles from './Message.module.scss';

export const CarMessageType = 'carMessage';
export const TimeMessageType = 'timeMessage';

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
        {/* 等服务补字段 */}
        <img src={carMakeLogo} className={styles.makeLogo} />
        <img src={carImage} className={styles.cover} />
      </div>
      <div className={styles.infoArea}>
        <div className={styles.carName}>{carName}</div>
        <div className={styles.carStatus}>
          {carStatus === 1 && orderType !== 2 && <span className={styles.instock}>IN STOCK</span>}
          {carStatus === 2 && orderType !== 2 && <span className={styles.incoming}>INCOMING</span>}
          {orderType === 2 && <span className={styles.instant_max}>INSTANT REQUEST</span>}
          <span className={styles.carUnit}>
            <span className={styles.number}>{carUnit}</span>
            {carUnit > 1 ? 'UNITS' : 'UNIT'}
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

type positionType = 'left' | 'right';
type colorType = 'white' | 'blue';
interface BubbleProps {
  text: string;
  position: positionType;
  color?: colorType;
}

export const Bubble: React.SFC<BubbleProps> = ({ text, position, color }) => {
  return (
    <div
      className={`${styles.bubble} ${
        position === 'left' ? styles.bubble_left : styles.bubble_right
      } ${color === 'white' ? styles.bubble_white : ''} ${
        color === 'blue' ? styles.bubble_blue : ''
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
  bubbleColor?: colorType;
}

export const TextMessage: React.SFC<TextMessageProps> = ({
  content,
  headshot,
  location,
  bubblePosition,
  bubbleColor
}) => {
  return (
    <div
      className={`${styles.message_text} ${
        bubblePosition === 'left' ? styles.text_left : styles.text_right
      }`}
    >
      <div className={styles.contentWrap}>
        <Bubble text={content} position={bubblePosition} color={bubbleColor} />
      </div>
      <div className={styles.user}>
        <img className={styles.headshot} src={headshot} />
        <img className={styles.location} src={require(`../../assets/img/flag/${location}.png`)} />
      </div>
    </div>
  );
};

interface ImageMessageProps extends User {
  url: string;
  // title: string;
  bubblePosition: positionType;
  onLoad?: any;
}

export const ImageMessage: React.SFC<ImageMessageProps> = ({
  url,
  // title,
  bubblePosition,
  headshot,
  location,
  onLoad
}) => {
  const [preview, setPreview] = useState(false);
  return (
    <div
      className={`${styles.message_text} ${
        bubblePosition === 'left' ? styles.text_left : styles.text_right
      }`}
    >
      <div className={styles.contentWrap} onClick={() => setPreview(true)}>
        <img src={url} className={styles.message_image} onLoad={onLoad ? onLoad : ''} />
      </div>
      <div className={styles.user}>
        <img className={styles.headshot} src={headshot} />
        <img className={styles.location} src={require(`../../assets/img/flag/${location}.png`)} />
      </div>

      {preview && (
        <Mask onClose={() => setPreview(false)} title={''}>
          <img style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={url} alt="" />
        </Mask>
      )}
    </div>
  );
};

interface OfferMessageProps {
  headshot: string;
  location?: string;
  children: React.ReactChild;
  bubblePosition: 'left' | 'right';
  hideAvatar: boolean;
}

export const OfferMessage: React.SFC<OfferMessageProps> = ({
  children,
  bubblePosition,
  headshot,
  location,
  hideAvatar
}) => {
  return (
    <div
      className={`${styles.message_text} ${
        bubblePosition === 'left' ? styles.text_left : styles.text_right
      }`}
    >
      <div className={styles.contentWrap}>{children}</div>
      <div className={styles.user} style={{ opacity: hideAvatar ? 0 : 1 }}>
        <img className={styles.headshot} src={headshot} />
        {location && (
          <img className={styles.location} src={require(`../../assets/img/flag/${location}.png`)} />
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
      <IconFont type="iconicon_deal_line" className={styles.icon} />
      <span>{text}</span>
    </div>
  );
};
