import React, { Component } from 'react';
import ChatBuyItem from '../ChatBuyItem/ChatBuyItem';
import ChatSellItem from '../ChatSellItem/ChatSellItem';
import {
  ChatRole,
  UserInfo,
  ChatStore,
  ChatMode,
  chatBuyObject,
  chatSellObject
} from '../../../store/types';
import { AppStore } from '../../../store/reducers';
import styles from './index.module.scss';
import chatStyles from '../Chat.module.scss';
import Icon from '../../Icon';
import { connect } from 'react-redux';
// import { addActiveRoomId } from '../../../store/actions/chat';
import { UnionChatRouteGoTo } from '../../../store/actions/route';
import IconFont from '../../ui/TradexIcon';
import util from '../../../common/util';

import loadImg from '../../../assets/img/image-logo-blue@3x.png';

import { setChatBuyList, setChatSellList } from '../../../store/actions/chat';
import { getChatBuyList, getChatSellList } from '../../../api/chat';

import { Spin } from 'antd';

// const mapStateToProps = (state: AppStore) => ({
//   activeRole: state.chat.activeRole,
//   chatList: state.chat.chatList
// });

interface Props {
  chatList: AppStore['chat']['chatList'];
  activeRole: ChatRole;
  updateRoomId: any;
  changeMode: any;
  setActiviteRoomIdAndCategoryId?: any;
  activeRoomId?: string;
  activeCategoryId: string;
  hasnextBuylistPage?: boolean;
  buyListCurrentPage: number;
  setChatBuyList: typeof setChatBuyList;
  setChatSellList: typeof setChatSellList;
  hasnextSelllistPage?: boolean;
  sellListCurrentPage: number;
}

@(connect(
  (state: AppStore) => ({
    chatList: { ...state.chat.chatList }
  }),
  dispatch => ({
    setChatBuyList: (buyList: any, buyListCurrentPage: any, hasnextBuylistPage: any) =>
      dispatch(setChatBuyList(buyList, buyListCurrentPage, hasnextBuylistPage) as any),
    setChatSellList: (sellList: any, sellListCurrentPage: any, hasnextSelllistPage: any) =>
      dispatch(setChatSellList(sellList, sellListCurrentPage, hasnextSelllistPage) as any),
    changeMode: (roomId: string, categoryId: string, activeRole: ChatRole) =>
      dispatch(UnionChatRouteGoTo(ChatMode.WINDOW_MODE, {
        roomId,
        categoryId,
        activeRole
      }) as any)
  })
) as any)
class ChatListBox extends React.Component<Props, object> {
  // static defaultProps: Props;
  private list1 = React.createRef<any>();
  private list2 = React.createRef<any>();

  static defaultProps: Props;

  state = {
    //点击高亮的订单
    activeRoomId: this.props.activeRoomId || '',
    buyLoading: true,
    sellLoading: true
  };

  setActiviteRoomIdAndCategoryId = (activeRoomId: string, activeCategoryId: string) => {
    this.setState({ activeRoomId: activeRoomId });

    if (this.props.setActiviteRoomIdAndCategoryId) {
      this.props.setActiviteRoomIdAndCategoryId(activeRoomId, activeCategoryId);
    }

    // this.props.changeMode(activeRoomId, activeCategoryId, this.props.activeRole);
  };

  componentDidMount() {
    const { setChatBuyList, chatList, setChatSellList } = this.props;
    const {
      chatBuyList,
      chatSellList,
      buyListCurrentPage,
      sellListCurrentPage,
      hasnextBuylistPage,
      hasnextSelllistPage
    } = chatList;
    if (chatBuyList.length || chatSellList.length || !hasnextBuylistPage || !hasnextSelllistPage) {
      this.setState({
        buyLoading: false,
        sellLoading: false
      });
    }
    this.listScroll();
    util.lockScroll(styles.chatListBox, true);
    util.lockScroll(styles.chatListLoading, true);

    if (!chatBuyList.length && hasnextBuylistPage) {
      // setChatBuyList(buyListCurrentPage + 1);
      this.updateChatBuyList();
    }

    if (!chatSellList.length && hasnextSelllistPage) {
      this.updateChatSellList();
    }
  }

  componentWillUnmount() {
    this.list1.current.removeEventListener('scroll', throttle(this.detectScroll, 300, {}));
    this.list2.current.removeEventListener('scroll', throttle(this.detectScroll, 300, {}));
  }

  updateChatBuyList = () => {
    const { setChatBuyList, chatList } = this.props;
    let { hasnextBuylistPage } = chatList;
    this.setState({
      buyLoading: true
    });

    let buyParm = { page: chatList.buyListCurrentPage + 1 };
    let buyList = [];
    // let hasnextBuylistPage = false;
    getChatBuyList(buyParm)
      .then(response => {
        // console.log('🍎🍎', response);
        if (response.data.next) {
          hasnextBuylistPage = true;
        } else {
          hasnextBuylistPage = false;
        }
        buyList = response.data.results.filter((i: any) => i.type === 1);
        setChatBuyList(buyList, chatList.buyListCurrentPage + 1, hasnextBuylistPage);
        this.setState({
          buyLoading: false
        });
      })
      .catch(error => {
        console.log('getChatBuyList err', error);
        this.setState({
          buyLoading: false
        });
      });
  };

  updateChatSellList = () => {
    const { setChatSellList, chatList } = this.props;
    let { hasnextSelllistPage } = chatList;
    // console.log('hasnextSelllistPage',hasnextSelllistPage)
    this.setState({
      sellLoading: true
    });

    let sellParm = { page: chatList.sellListCurrentPage + 1 };
    let sellList = [];
    // let hasnextSelllistPage = false;
    getChatSellList(sellParm)
      .then(response => {
        // console.log('🍎🍎', response);
        if (response.data.next) {
          hasnextSelllistPage = true;
        } else {
          hasnextSelllistPage = false;
        }
        sellList = response.data.results.filter((i: any) => i.type === 1);
        setChatSellList(sellList, chatList.sellListCurrentPage + 1, hasnextSelllistPage);
        this.setState({
          sellLoading: false
        });
      })
      .catch(error => {
        console.log('getChatSellList err', error);
        this.setState({
          sellLoading: false
        });
      });
  };

  listScroll = () => {
    // console.log('🍎',this.list1,this.list2)
    this.list1.current.addEventListener('scroll', throttle(this.detectScroll, 300, {}));
    this.list2.current.addEventListener('scroll', throttle(this.detectScroll, 300, {}));
  };

  detectScroll = (e: any) => {
    const { activeRole, setChatBuyList, setChatSellList, chatList } = this.props;
    const {
      buyListCurrentPage,
      hasnextBuylistPage,
      sellListCurrentPage,
      hasnextSelllistPage
    } = chatList;
    // console.log('🍎🍎', e)
    // console.log('🍎🍎', e.target.scrollHeight)
    const st = e.target.scrollTop;
    // console.log(st);
    const isBottom = e.target.scrollTop + e.target.clientHeight === e.target.scrollHeight;
    if (isBottom) {
      // console.log('🍎🍎🍎🍎到底部啦');
      // if (hasnextBuylistPage && activeRole === ChatRole.Buyer) {
      // console.log('🍎🍎🍎🍎hasnextBuylistPage', hasnextBuylistPage);
      // console.log('🍎🍎🍎🍎activeRole === ChatRole.Buyer', activeRole === ChatRole.Buyer);
      activeRole === ChatRole.Buyer
        ? hasnextBuylistPage
          ? this.updateChatBuyList()
          : ''
        : hasnextSelllistPage
        ? this.updateChatSellList()
        : '';
      // setChatBuyList(buyListCurrentPage+1);
      // }
    }
  };

  chatRoomScroll = (el: any) => {
    // console.log(el);
    // console.log('this.list1.current.offsetHeight', this.list1.current.offsetHeight);
    // console.log('this.list1.current.scrollTop', this.list1.current.scrollTop);
    // console.log('el.current.offsetTop', el.current.offsetTop);
    // console.log('el.current.offsetHeight', el.current.offsetHeight);
    this.list1.current.scrollTop - el.current.offSetTop;

    const { activeRole } = this.props;
    const list = activeRole === ChatRole.Buyer ? this.list1 : this.list2;

    // if(el.current.offsetTop + el.current.offsetHeight >  this.list1.current.offsetHeight){
    if (
      el.current.offsetTop + el.current.offsetHeight >
      list.current.offsetHeight + list.current.scrollTop
    ) {
      // console.log('this.list1.current.offsetHeight - el.current.offsetHeight', list.current.offsetHeight - el.current.offsetHeight)
      if (el.current.offsetHeight > list.current.offsetHeight) {
        list.current.scroll({
          top: Math.max(el.current.offsetTop, list.current.scrollTop),
          behavior: 'smooth'
        });
        return;
      }
      list.current.scroll({
        top: el.current.offsetHeight + el.current.offsetTop - list.current.offsetHeight,
        behavior: 'smooth'
      });
    }
  };

  render() {
    let { activeRole, activeCategoryId, chatList } = this.props;
    const { buyLoading, sellLoading } = this.state;
    // console.log('activeCategoryId: ', activeCategoryId);
    // console.log('--- chatList ---', chatList);
    // console.log('--- activeRole ---', activeRole);
    return (
      <>
        <div
          ref={this.list1}
          className={`${styles.chatListBox} ${
            activeRole === ChatRole.Buyer ? chatStyles.show : chatStyles.hide
          }`}
        >
          <div
            className={`${styles.chatListLoading} ${
              buyLoading ? chatStyles.show : chatStyles.hide
            }`}
          >
            <div className={styles.loadingCon}>
              {/*<img src={loadImg} className={styles.loadImg} alt="" />*/}
              <Spin size="default" />
            </div>
          </div>

          {chatList.chatBuyList.map((buyItem, index) => (
            <ChatBuyItem
              key={index}
              chatBuyObject={buyItem}
              activeRoomId={this.state.activeRoomId}
              activeCategoryId={buyItem.user.id}
              setActiviteRoomIdAndCategoryId={this.setActiviteRoomIdAndCategoryId}
              chatRoomScroll={this.chatRoomScroll}
              unfoldInitialStaus={activeCategoryId === buyItem.user.id}
            />
          ))}
          {!buyLoading && activeRole === ChatRole.Buyer && chatList.chatBuyList.length === 0 ? (
            <div className={chatStyles.noMsg}>
              <Icon kind="picture_nomessage" width={220} height={165} />
              <p className={chatStyles.nomsgCon}>You don’t have any messages yet.</p>
            </div>
          ) : null}
        </div>
        <div
          ref={this.list2}
          className={`${styles.chatListBox} ${
            activeRole === ChatRole.Seller ? chatStyles.show : chatStyles.hide
          }`}
        >
          <div
            className={`${styles.chatListLoading} ${
              sellLoading ? chatStyles.show : chatStyles.hide
            }`}
          >
            <div className={styles.loadingCon}>
              {/*<img src={loadImg} className={styles.loadImg} alt="" />*/}
              <Spin size="default" />
            </div>
          </div>
          {chatList.chatSellList.map((orderItem, index) => (
            <ChatSellItem
              key={index}
              chatSellObject={orderItem}
              activeRoomId={this.state.activeRoomId}
              activeCategoryId={orderItem.car_info.id}
              setActiviteRoomIdAndCategoryId={this.setActiviteRoomIdAndCategoryId}
              chatRoomScroll={this.chatRoomScroll}
              unfoldInitialStaus={activeCategoryId === orderItem.car_info.id}
            />
          ))}
          {!sellLoading && activeRole === ChatRole.Seller && chatList.chatSellList.length === 0 ? (
            <div className={chatStyles.noMsg}>
              <Icon kind="picture_nomessage" width={220} height={165} />
              <p className={chatStyles.nomsgCon}>You don’t have any messages yet.</p>
            </div>
          ) : null}
        </div>
      </>
    );
  }
}

export default ChatListBox;

export const msgIcon = (latest_msg_icon: string) => {
  let type = '';
  // switch(latest_msg_icon){
  //   case 'Offer':
  //     break;
  // }
  if (latest_msg_icon === 'Offer') {
    type = 'iconicon_offer_line';
  } else if (latest_msg_icon === 'PA') {
    type = 'iconicon_pa_line';
  } else if (latest_msg_icon === 'Deposit') {
    type = 'iconicon_deposit_line';
  } else if (latest_msg_icon === 'Deal') {
    type = 'iconicon_deal_line';
  } else if (latest_msg_icon === 'Picture') {
    type = 'iconicon_pic_line';
  } else if (latest_msg_icon === 'TradeX') {
    type = 'iconicon_warn_line';
  }
  if (type) {
    return <IconFont type={type} className={chatStyles.lastMsgIcon} />;
  }
  return null;
};

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
  return function(this: any) {
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
