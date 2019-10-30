/**
 * @description: pure ui component, mutiple rooms
 * @param {Props}
 * @return {ReactNode}
 * @author zixiu
 */

import React, { ReactNode } from 'react';
import IconFont from '../ui/TradexIcon';
import _get from '../../common/get';
import { UserInfoStore } from '../../store/types';
import { FormattedTime } from 'react-intl';
import { Spin } from 'antd';
import {
  CarMessage,
  TextMessage,
  OfferMessage,
  ImageMessage,
  OfferSuccess,
  TimeMessage
} from './Message';
import OfferBubble from '../OfferBubble';
import { format } from 'timeago.js';
import util from '../../common/util';
import { CarMessageType, TimeMessageType, RoomStatus, MessageProps, uniqueID } from './common';
import { Notification } from '../Notification';
import styles from './Room.module.scss';

const upload_image_type = 'image/png, image/jpeg, image/jpg';
interface BasicProps {
  results: MessageProps[];
  loading: boolean;
  onPageChange: any;
  textMessage: any;
  imageMessage: any;
}

interface BasicState {
  inputContent: string;
}
class BasicRoom<P, S> extends React.Component<BasicProps & P, BasicState> {
  protected main = React.createRef<HTMLDivElement>();
  protected inputArea = React.createRef<HTMLTextAreaElement>();

  state = {
    inputContent: ''
  };

  detectScroll = (e: any) => {
    const st = e.target.scrollTop;
    st <= 0 && !this.props.loading && this.props.onPageChange();
  };

  detectRoomScroll = () => {
    this.main.current &&
      this.main.current.addEventListener('scroll', throttle(this.detectScroll, 300, {}));
  };

  undetectRoomScroll = () => {
    this.main.current &&
      this.main.current.removeEventListener('scroll', throttle(this.detectScroll, 300, {}));
  };

  scrollToBottom = () => this.main.current && scrollToBottom(this.main.current);

  focusOnInput = () => this.inputArea.current && this.inputArea.current.focus();

  onTextMessage = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.props.textMessage(this.state.inputContent);
      this.setState({ inputContent: '' });
    }
  };

  onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    this.setState({ inputContent: e.target.value });

  onImageMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      e.persist();
      const files = _get(e, ['target', 'files']);
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        const base64Image = event.target.result;
        const formData = new FormData();
        const uuid = uniqueID();
        formData.append('image', files[0]);
        formData.append('message_id', uuid);
        this.props.imageMessage(formData, base64Image, uuid);
        e.target.value = '';
      };
      reader.readAsDataURL(files[0]);
    } catch (e) {
      Notification({
        type: 'error',
        message: 'Upload image error',
        description: _get(e, ['response', 'data', 'message']) || ''
      });
    }
  };

  componentDidMount() {
    this.detectRoomScroll();
    this.main.current &&
      this.main.current.classList.length > 0 &&
      util.lockScroll(this.main.current.classList[0]);
    this.inputArea.current && this.inputArea.current.focus();
  }

  componentWillUnmount() {
    this.undetectRoomScroll();
  }

  componentDidUpdate(prevProps: BasicProps) {
    const beforeLatest = prevProps.results.slice(-1)[0];
    const latest = this.props.results.slice(-1)[0];
    if (
      prevProps.results.length < this.props.results.length &&
      (_get(beforeLatest, ['id']) !== _get(latest, ['id']) ||
        _get(beforeLatest, ['message_id']) !== _get(latest, ['message_id']))
    ) {
      this.scrollToBottom();
    }
  }
}

const generateMessages = ({
  results,
  userId,
  chatroom,
  resendMessage,
  scrollToBottom,
  roomType,
  carImage,
  carMakeLogo,
  carMileage,
  carMileageUnit,
  carName,
  carUnit,
  carStatus,
  orderType
}: {
  results: MessageProps[];
  userId: string;
  resendMessage: any;
  chatroom: any;
  scrollToBottom: any;
  roomType: RoomStatus;

  carImage?: string;
  carMakeLogo?: string;
  carMileage?: number;
  carMileageUnit?: string;
  carName?: string;
  carUnit?: number;
  carStatus?: number;
  orderType?: number;
}): ReactNode => {
  return results.map((v: any, index: number, arr: any[]) => {
    const bubblePosition =
      roomType === 'max' ? (_get(v, ['sender', 'id']) === userId ? 'left' : 'right') : 'right';
    const bubbleColor = roomType === 'common' ? 'blue' : undefined;

    if (v.msg_type === TimeMessageType) {
      return <TimeMessage key={index} time={_get(v, ['extra', 'content'])} />;
    }
    // 特殊的卡片位置
    if (
      roomType === 'max' &&
      carName &&
      carMileage &&
      carMileageUnit &&
      carUnit &&
      carStatus &&
      orderType &&
      v.msg_type === CarMessageType
    ) {
      return (
        <CarMessage
          key={index}
          carImage={carImage || ''}
          carMakeLogo={carMakeLogo}
          carName={carName}
          carMileage={carMileage}
          carMileageUnit={carMileageUnit}
          carUnit={carUnit}
          carStatus={carStatus}
          orderType={orderType}
        />
      );
    }

    // 文本处理
    if (v.msg_type === 1) {
      return (
        <TextMessage
          key={index}
          content={_get(v, ['extra', 'content'])}
          headshot={_get(v, ['sender', 'headshot'])}
          location={_get(v, ['sender', 'company_country'])}
          bubblePosition={bubblePosition}
          bubbleColor={bubbleColor}
          resendMessage={resendMessage(v)}
          messageStatus={_get(v, ['messageStatus'])}
        />
      );
    }

    // 图片处理
    if (v.msg_type === 2) {
      return (
        <ImageMessage
          key={index}
          url={_get(v, ['extra', 'url'])}
          headshot={_get(v, ['sender', 'headshot'])}
          location={_get(v, ['sender', 'company_country'])}
          onLoad={() => !v.isFromHistory && scrollToBottom()}
          bubblePosition={bubblePosition}
          messageStatus={_get(v, ['messageStatus'])}
          resendMessage={resendMessage(v)}
        />
      );
    }

    // offer 处理
    if (v.msg_type === 6) {
      return (
        <OfferMessage
          key={index}
          headshot={_get(v, ['sender', 'headshot'])}
          location={_get(v, ['sender', 'company_country'])}
          children={<OfferBubble chatroom={chatroom} result={v} />}
          bubblePosition={bubblePosition}
          hideAvatar={false}
        />
      );
    }

    // offer success
    if (v.msg_type === 8) {
      return (
        <OfferMessage
          key={index}
          headshot={require('../../assets/img/chat_system_avatar.png')}
          children={<OfferSuccess text={_get(v, ['extra', 'content'])} />}
          bubblePosition={roomType === 'max' ? 'left' : 'right'}
          hideAvatar={false}
        />
      );
    }
  });
};

function scrollToBottom(el: Element): void {
  el && el.scroll({ top: 9999, behavior: 'smooth' });
}

function requireF(targetLocale: string, cb?: (...args: any) => any) {
  try {
    return require(`../../assets/img/flag/${targetLocale}.png`);
  } catch (e) {
    console.log('requireF(): The file "' + targetLocale + '".png could not be loaded.', e);
    cb && cb();
    return false;
  }
}

function throttle(func: any, wait: number, options: any) {
  var context: any, args: any, result: any;
  var timeout: any = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function(this: void) {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

interface LoadingProps {
  type?: 'common';
}

const ChatLoading: React.SFC<LoadingProps> = ({ type }) => (
  <div className={`${styles.chatLoading} ${type === 'common' ? styles.chatLoading_common : ''}`}>
    <Spin />
  </div>
);

const getJoined = (date: string, locale: string): ReactNode => format(date, locale);

const getLocal = (localTime: string): ReactNode => <FormattedTime value={localTime} />;

interface MaxRoomProps extends React.SFC {
  id: string;
  chatroom: object;

  targetName: string;
  targetJoined: string;
  targetTotalTrad: number;
  targetActive: string;
  targetLocalTime: string;

  carImage: string;
  carMakeLogo: string;
  carName: string;
  carMileage: number;
  carStatus: number;
  carUnit: number;
  carMileageUnit: string;

  orderType: number;

  results: MessageProps[];
  loading: boolean;

  user: UserInfoStore;

  imageMessage: (data: FormData) => any;
  textMessage: (text: string) => any;
  onClose: () => any;
  onPageChange: () => any;
  resendMessage: any;
}

interface MaxRoomState {
  inputContent: string;
}

export class MaxRoom extends BasicRoom<MaxRoomProps, MaxRoomState> {

  onMaxRoomClose = (e: React.KeyboardEvent) => {
    e.preventDefault();
    this.props.onClose();
  };

  render() {
    const {
      id,
      chatroom,

      targetName,
      targetJoined,
      targetTotalTrad,
      targetActive,
      targetLocalTime,
      results,
      orderType,

      carImage,
      carMakeLogo,
      carName,
      carStatus,
      carUnit,
      carMileage,
      carMileageUnit,
      user: {
        userInfo: { userId, company_country }
      },
      loading,
      resendMessage
    } = this.props;
    const { inputContent } = this.state;
    const randomId = uniqueID();
    return (
      <article className={styles.container_max}>
        <header className={styles.header_max}>
          <div className={styles.header_max_row1}>{targetName}</div>
          {targetJoined && (
            <div className={styles.header_max_row2}>
              <div className={styles.tagGroup}>
                <span className={styles.label}>Joined:</span>
                <span className={styles.value}>{getJoined(targetJoined, company_country)}</span>
              </div>
              <div className={styles.tagGroup}>
                <span className={styles.label}>Total traded cars:</span>
                <span className={styles.value}>{targetTotalTrad}</span>
              </div>
              <div className={styles.tagGroup}>
                <span className={styles.label}>Active:</span>
                <span className={styles.value}>{targetActive}</span>
              </div>
              <div className={styles.tagGroup}>
                <span className={styles.label}>Local time:</span>
                <span className={styles.value}>
                  <FormattedTime value={targetLocalTime} />
                </span>
              </div>
            </div>
          )}
          <IconFont
            type="iconicon_cancel_small"
            className={styles.closeIcon}
            onClick={this.onMaxRoomClose}
          />
        </header>

        <div className={styles.main_max} ref={this.main}>
          {generateMessages({
            roomType: 'max',
            carImage,
            carMakeLogo,
            carMileage,
            carMileageUnit,
            carName,
            carUnit,
            carStatus,
            orderType,
            results,
            userId,
            chatroom,
            resendMessage,
            scrollToBottom: () => this.scrollToBottom()
          })}
        </div>
        {loading && <ChatLoading />}
        <footer className={styles.footer_max}>
          <div className={styles.toolsArea}>
            <label htmlFor={randomId} className={styles.iconWrap}>
              <IconFont type="iconicon_pic_line" className={styles.icon} />
              <input
                type="file"
                name="fileMax"
                id={randomId}
                accept={upload_image_type}
                onChange={this.onImageMessage}
              />
            </label>
          </div>
          <textarea
            ref={this.inputArea}
            value={inputContent}
            className={styles.inputArea}
            onChange={this.onInputChange}
            onKeyDown={this.onTextMessage}
          ></textarea>
        </footer>
      </article>
    );
  }
}

interface CommonRoomProps extends React.SFC {
  id: string;
  chatroom: object;

  targetHeadshot: string;
  targetLocale: string;
  targetName: string;
  targetActive: string;
  targetLocalTime: string;

  carName: string;
  carMileage: number | null;
  carStatus: number | null;
  carMileageUnit: string;

  orderType: number | null;

  results: MessageProps[];
  loading: boolean;

  user: UserInfoStore;

  // imageMessage: (e: React.ChangeEvent<HTMLInputElement>) => any;
  imageMessage: any;
  textMessage: (text: string) => any;
  changRoomStatus: (nextStatus?: RoomStatus) => any;
  closeRoom: () => any;
  // maxRoom: () => any;
  onPageChange: () => any;
  resendMessage: any;
}

interface CommonRoomState {
  inputContent: string;
}

export class CommonRoom extends BasicRoom<CommonRoomProps, CommonRoomState> {
  render() {
    const {
      id,
      chatroom,

      targetHeadshot,
      targetLocale,
      targetName,
      targetActive,
      targetLocalTime,

      carName,
      carMileage,
      carMileageUnit,
      carStatus,

      results,
      loading,
      orderType,

      user: {
        userInfo: { userId }
      },
      changRoomStatus,
      closeRoom,
      imageMessage,
      resendMessage
      // maxRoom
    } = this.props;
    const { inputContent } = this.state;
    const randomId = uniqueID();
    return (
      <article className={styles.container_common}>
        <header className={styles.header_common} onClick={() => changRoomStatus()}>
          {targetHeadshot && (
            <div className={styles.user}>
              <img src={targetHeadshot} className={styles.headshot} />
              {targetLocale && requireF(targetLocale) && (
                <img src={requireF(targetLocale)} className={styles.locale} />
              )}
            </div>
          )}
          {targetName && (
            <div className={styles.info_common}>
              <span className={styles.targetName}>{targetName}</span>
              <div className={styles.infoGroup}>
                <div className={styles.info}>
                  <span className={styles.label}>Active:</span>
                  <span className={styles.value}>{targetActive}</span>
                </div>

                <div className={styles.info}>
                  <span className={styles.label}>Local Time:</span>
                  <span className={styles.value}>{getLocal(targetLocalTime)}</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.btnGroup}>
            <IconFont type="iconicon_minus_line_thin" className={styles.btn} />
            <IconFont
              type="iconicon_cancel"
              className={styles.btn}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                closeRoom();
              }}
            />
          </div>
        </header>
        <div className={styles.carInfo}>
          <div className={styles.carName}>{carName}</div>
          <div className={styles.carStatus}>
            {carMileageUnit && <IconFont type="iconicon_mileage_area" className={styles.icon} />}
            <span className={styles.mileage}>
              {carMileage}
              {carMileageUnit}
            </span>
            {carStatus === 1 && orderType !== 2 && <span className={styles.instock}>IN STOCK</span>}
            {carStatus === 2 && orderType !== 2 && (
              <span className={styles.incoming}>INCOMING</span>
            )}
            {orderType === 2 && <span className={styles.instant}>INSTANT REQUEST</span>}
          </div>
        </div>

        <div className={styles.main_common} ref={this.main}>
          {generateMessages({
            roomType: 'common',
            results,
            userId,
            chatroom,
            resendMessage,
            scrollToBottom: () => this.scrollToBottom()
          })}
        </div>
        {loading && <ChatLoading type="common" />}
        <footer className={styles.footer_common}>
          <div className={styles.toolsArea}>
            <label htmlFor={randomId} className={styles.iconWrap}>
              <IconFont type="iconicon_pic_line" className={styles.icon} />
              <input
                type="file"
                name="fileCommon"
                id={randomId}
                accept={upload_image_type}
                onChange={this.onImageMessage}
              />
            </label>
          </div>
          <textarea
            ref={this.inputArea}
            value={inputContent}
            className={styles.inputArea}
            onChange={this.onInputChange}
            onKeyDown={this.onTextMessage}
          ></textarea>
        </footer>
      </article>
    );
  }
}

interface MinRoomProps extends React.SFC {
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
  changRoomStatus: (nextStatus?: RoomStatus) => any;
  closeRoom: () => any;
}

export class MinRoom extends React.Component<MinRoomProps, {}> {
  render() {
    const {
      targetName,
      targetLocale,
      targetActive,
      targetHeadshot,
      carName,
      carMileage,
      carMileageUnit,
      carStatus,
      orderType,
      changRoomStatus,
      closeRoom
    } = this.props;

    return (
      <article className={styles.container_min}>
        <header className={styles.header_min} onClick={() => changRoomStatus()}>
          <div className={styles.user}>
            {targetHeadshot && <img src={targetHeadshot} className={styles.headshot} />}
            {requireF(targetLocale) && (
              <img src={requireF(targetLocale)} className={styles.locale} />
            )}
          </div>
          <div className={styles.info_min}>
            <span className={styles.targetName}>{targetName}</span>
            <div className={styles.infoGroup}>
              {targetActive && (
                <div className={styles.info}>
                  <span className={styles.label}>Active:</span>
                  <span className={styles.value}>{targetActive}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.btnGroup}>
            <IconFont type="iconicon_zoom" className={styles.btn} />
            <IconFont
              type="iconicon_cancel"
              className={styles.btn}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                closeRoom();
              }}
            />
          </div>
        </header>
        <div className={styles.carInfo_min}>
          <div className={styles.carName}>{carName}</div>
          <div className={styles.carStatus}>
            {carMileageUnit && <IconFont type="iconicon_mileage_area" className={styles.icon} />}
            <span className={styles.mileage}>
              {carMileage}
              {carMileageUnit}
            </span>
            {carStatus === 1 && orderType !== 2 && <span className={styles.instock}>INSTOCK</span>}
            {carStatus === 2 && orderType !== 2 && (
              <span className={styles.incoming}>INCOMING</span>
            )}
            {orderType === 2 && <span className={styles.instant}>INSTANT REQUEST</span>}
          </div>
        </div>
      </article>
    );
  }
}
