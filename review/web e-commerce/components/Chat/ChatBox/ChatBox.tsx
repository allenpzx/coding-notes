import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Badge, Avatar } from 'antd';
import { AppStore } from '../../../store/reducers';
import IconFont from '../../ui/TradexIcon';
import styles from './ChatBox.module.scss';
import chatStyles from '../Chat.module.scss';
import { FormattedMessage } from 'react-intl';

import { UnionChatRouteGoTo } from '../../../store/actions/route';

import ChatNum from '../ChatNum/ChatNum';

import {
  ChatRole,
  UnionChatStore,
  ChatMode,
  chatBuyObject,
  chatSellObject
} from '../../../store/types';

import ListMin from '../ListMin';

import { setUnreadNum, setChatBuyList, setChatSellList } from '../../../store/actions/chat';

import { getChatBuyList, getChatSellList } from '../../../api/chat';

import ChatListBox from '../ChatListBox';

import axios from 'axios';

const mapStateToProps = (state: AppStore) => ({
  user: state.user.userInfo,
  unreadNum: state.chat.unreadNum,
  activeRole: state.route.params[ChatMode.LIST_MODE].activeRole,
  activeCategoryId: state.route.params[ChatMode.LIST_MODE].categoryId,
  timestamp: state.route.params[ChatMode.LIST_MODE].timestamp,
  chatAList: { ...state.chat.chatList }
});

const mapDispatchToProps = (dispatch: any) => ({
  setUnreadNum: () => dispatch(setUnreadNum()),
  changeMode: (roomId: string, categoryId: string, activeRole: ChatRole) =>
    dispatch(UnionChatRouteGoTo(ChatMode.WINDOW_MODE, {
      roomId,
      categoryId,
      activeRole
    }) as any),
  openAllInOneMode: (roomId: string, categoryId: string, activeRole: ChatRole) => {
    dispatch(
      UnionChatRouteGoTo(ChatMode.ALL_IN_ONE, {
        roomId,
        categoryId,
        activeRole
      })
    );
  }
});

interface Props {
  user: AppStore['user']['userInfo'];
  unreadNum: AppStore['chat']['unreadNum'];
  activeRole?: AppStore['route']['params']['WINDOW_MODE']['activeRole'];
  roomId: string;
  categoryId?: AppStore['route']['params']['WINDOW_MODE']['categoryId'];
  chatAList: AppStore['chat']['chatList'];
  setUnreadNum: any;
  openAllInOneMode: Function;
  changeMode: any;
  timestamp?: number;
}

interface State {
  mainMenu: number;
  allUnreadMsgNum: number;
  listShow: boolean;
  activeRoomid: string;
  activeCategoryid?: string;
  activeRole?: ChatRole;
}

class ChatBox extends React.Component<Props, State> {
  // static defaultProps: Props;
  constructor(props: Props) {
    super(props);

    this.state = {
      mainMenu: 1,
      allUnreadMsgNum: 18,
      //展示列表？展示列表：展示缩小状态
      listShow: false,
      activeRoomid: props.roomId,
      activeCategoryid: props.categoryId,
      activeRole: props.activeRole
    };
  }

  toggleChatShow = () => {
    this.setState({ listShow: !this.state.listShow });
  };

  componentDidMount() {
    const { setUnreadNum, chatAList } = this.props;
    const { chatBuyList, chatSellList } = chatAList;
    setUnreadNum();

    // if (!chatBuyList.length) {
    //   setChatBuyList();
    // }

    // if (!chatSellList.length) {
    //   setChatSellList();
    // }
  }

  setActiviteRoomIdAndCategoryId = (activeRoomid: string, activeCategoryid: string) => {
    this.props.changeMode(activeRoomid, activeCategoryid, this.state.activeRole);
    this.setState({ activeRoomid, activeCategoryid });
  };

  setActiveRole = (chatRole: ChatRole) => {
    this.setState({ activeRole: chatRole });
  };

  componentDidUpdate(preProps: Props) {
    if (preProps.timestamp !== this.props.timestamp) {
      this.setState({
        listShow: true
      });
    }
  }

  render() {
    const { user, unreadNum, chatAList, openAllInOneMode, categoryId } = this.props;
    const { listShow, activeRole, activeRoomid, activeCategoryid } = this.state;

    return (
      <>
        <ListMin listShow={listShow} toggleChatShow={this.toggleChatShow} />
        <div className={`${styles.ChatBox} ${listShow ? '' : styles.hide}`}>
          <div className={styles.ChatBox__Header} onClick={() => this.toggleChatShow()}>
            {user.company_country ? (
              <img
                src={require(`../../../assets/img/flag/${user.company_country}.png`)}
                alt=""
                className={styles.location}
              />
            ) : null}

            <Avatar src={user.headshot} className={styles.userHead} />
            <span className={styles.userName}>{user.display_name}</span>
            <IconFont
              type="iconicon_fullscreen"
              className={styles.fullscreen}
              // onClick={setLayoutStatus.bind(null, 'main', LayoutStatus.Maxmize)}
              onClick={(e: { stopPropagation: () => void }) => {
                e.stopPropagation();
                openAllInOneMode(activeRoomid, activeCategoryid, activeRole);
              }}
            />
            <IconFont type="iconicon_cancel" className={styles.cancel} />
          </div>
          <div className={styles.ChatBox__title}>
            <div
              className={`${styles.ChatBox__title__item} ${
                activeRole === ChatRole.Buyer ? styles.menuItemActive : ''
              }`}
            >
              <div className={styles.box} onClick={() => this.setActiveRole(ChatRole.Buyer)}>
                <IconFont type="iconicon_buy_line" className={styles.itemPre} />
                <span className={styles.MenuItem}>Buy</span>
                {unreadNum.buy > 0 ? (
                  <ChatNum num={unreadNum.buy} style={styles.titleMsgNum} />
                ) : null}
              </div>
            </div>
            <div
              className={`${styles.ChatBox__title__item} ${
                activeRole === ChatRole.Seller ? styles.menuItemActive : ''
              }`}
            >
              <div className={styles.box} onClick={() => this.setActiveRole(ChatRole.Seller)}>
                <IconFont type="iconicon_sell_line" className={styles.itemPre} />
                <span className={styles.MenuItem}>Sell</span>
                {unreadNum.sell > 0 ? (
                  <ChatNum num={unreadNum.sell} style={styles.titleMsgNum} />
                ) : null}
              </div>
            </div>
          </div>
          <div className={styles.ChatBox__Content}>
            <ChatListBox
              activeRole={activeRole}
              activeCategoryId={categoryId}
              setActiviteRoomIdAndCategoryId={this.setActiviteRoomIdAndCategoryId}
            />
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
