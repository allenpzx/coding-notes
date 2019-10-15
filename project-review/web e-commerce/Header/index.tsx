/**
 * Header组件，一般不需要单独引入，链接了router和store无需以额外的props
 * 如果要单独使用的话直接放到容器内第一个组件即可
 * 引入Header组件必须登陆！！！
 * @author zixiu
 * @since 1.0.1
 * @version 1.0
 */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Badge, Avatar } from 'antd';
import { UserInfoStore } from '../../store/types';
import { AppStore } from '../../store/reducers';
import { FormattedMessage } from 'react-intl';
import IconFont from '../ui/TradexIcon';
import CusPopover, { CustomPopover } from '../CusPopover';
import { logout } from '../../api/user';
import _get from '../../common/get';
import { removeCookie } from '../../common/cookie';
import { path as allPath } from '../../routes/routers';
import styles from './index.module.scss';

interface State {
  menuShow: boolean;
  mainMenu: number;
  path: string;
  notification: boolean;
}

export interface InnerProps extends RouteComponentProps<{}> {
  user: UserInfoStore;
  getNotification?: any;
  compoName: string;
}

export interface OutterProps extends InnerProps {}

@(withRouter as any)
@(connect(
  (state: AppStore) => ({
    user: state.user
  }),
  dispatch => ({
    getNotification: () => false
  })
) as any)
class Header extends React.Component<OutterProps, State> {
  static defaultProps: InnerProps;

  state = {
    menuShow: false,
    mainMenu: 0,
    path: '',
    notification: false
  };

  async componentDidMount() {
    const path = await this.getPath();
    const notification = await this.getNotification();
    this.setState({ path, notification });
  }

  async componentDidUpdate(prevProps: any) {
    const {
      location: { pathname }
    } = prevProps;
    if (pathname !== this.props.location.pathname) {
      const path = await this.getPath();
      const notification = await this.getNotification();
      this.setState({ path, notification });
    }
  }

  async getPath() {
    const { location } = this.props;
    return location.pathname;
  }

  async getNotification() {
    const { getNotification } = this.props;
    const res = await getNotification();
    return res;
  }

  goto = (path: string) => () => {
    const {
      history: { push }
    } = this.props;
    push(path);
  };

  onMainMouseOver = (mainMenu: number) => (e: React.MouseEvent) => {
    if (this.state.menuShow) return;
    this.setState({ mainMenu: mainMenu, menuShow: true });
  };

  onMainMouseLeave = (e: any) => {
    if (!this.state.menuShow) return;
    this.setState({ menuShow: false });
  };

  logout = async () => {
    try {
      const { status } = await logout();
      if (status === 200) {
        removeCookie('Authorization');
        window.location.href = 'https://tradexport.com';
      }
    } catch (e) {
      if (_get(e, ['response', 'status']) === 401) {
        this.props.history.push('/login');
      }
    } finally {
      removeCookie('Authorization');
    }
  };

  render() {
    const {
      user: {
        userInfo: { display_name, headshot }
      }
    } = this.props;
    const { menuShow, mainMenu, path, notification } = this.state;

    const matchPath = (arg: string): boolean =>
      allPath.BuyMarket.replace(/^\/trade/, '').startsWith(arg);

    return (
      <header className={styles.container}>
        <div className={styles.main}>
          <div className={styles.logoWrap}>
            <img src={require('../../assets/img/logo.png')} alt="logo" className={styles.logo} />
          </div>

          <ul className={styles.menu}>
            <li
              className={`${styles.menuItem} ${matchPath('/buy') ? styles.active : ''} ${
                menuShow && mainMenu === 1 ? styles.menuItemActive : ''
              }`}
              onMouseOver={this.onMainMouseOver(1)}
              onMouseLeave={this.onMainMouseLeave}
            >
              <IconFont type="iconicon_buy_line" className={styles.itemPre} />
              <span>
                <FormattedMessage id="header_buy" defaultMessage="Buy" />
              </span>
              <IconFont type="iconicon_dropdown_line" className={styles.itemNex} />
            </li>
            <li
              className={`${styles.menuItem} ${matchPath('/sell') ? styles.active : ''} ${
                menuShow && mainMenu === 2 ? styles.menuItemActive : ''
              }`}
              onMouseOver={this.onMainMouseOver(2)}
              onMouseLeave={this.onMainMouseLeave}
            >
              <IconFont type="iconicon_sell_line" className={styles.itemPre} />
              <span>
                <FormattedMessage id="header_sell" defaultMessage="Sell" />
              </span>
              <IconFont type="iconicon_dropdown_line" className={styles.itemNex} />
            </li>
          </ul>

          <div className={styles.userInfo}>
            <CustomPopover type="comingsoon">
              <div className={styles.userInfoItem}>
                <Badge dot={notification} className={styles.hackDot}>
                  <IconFont type="iconicon_warn_line" className={styles.prefix} />
                </Badge>
                <span className={styles.tag}>
                  <FormattedMessage id="header_notification" defaultMessage="Notification" />
                </span>
              </div>
            </CustomPopover>

            <CustomPopover type="comingsoon">
              <div className={`${styles.userInfoItem} ${styles.pl32}`}>
                <IconFont type="iconicon_pa_line" className={styles.prefix} />
                <span className={styles.tag}>
                  <FormattedMessage id="header_ordercetner" defaultMessage="Order Center" />
                </span>
              </div>
            </CustomPopover>

            <CustomPopover type="logout" hoverContent={<span onClick={this.logout}>Log out</span>}>
              <div className={`${styles.userInfoItem} ${styles.pl32} ${styles.hackToggle}`}>
                <Avatar src={headshot} />
                <span className={styles.userName}>{display_name}</span>
                <IconFont type="iconicon_dropdown_line" className={styles.userInfoRightIcon} />
                <IconFont type="iconicon_fold_line" className={styles.userInfoRightIconHover} />
              </div>
            </CustomPopover>
          </div>
        </div>

        <div className={styles.sub}>
          <div
            className={`${styles.subMenu} ${menuShow && mainMenu === 1 ? styles.subMenu1 : ''}`}
            onMouseOver={this.onMainMouseOver(1)}
            onMouseLeave={this.onMainMouseLeave}
          >
            <span
              className={`${styles.subMenuItem} ${matchPath('/buy/market') ? styles.active : ''}`}
              onClick={this.goto(allPath.BuyMarket)}
            >
              Market
            </span>
            <CustomPopover type="comingsoon">
              <span
                className={`${styles.subMenuItem} ${
                  matchPath('/sell/market') ? styles.active : ''
                }`}
              >
                Create Instant Request
              </span>
            </CustomPopover>
          </div>

          <div
            className={`${styles.subMenu} ${menuShow && mainMenu === 2 ? styles.subMenu2 : ''}`}
            onMouseOver={this.onMainMouseOver(2)}
            onMouseLeave={this.onMainMouseLeave}
          >
            <CustomPopover type="comingsoon">
              <span
                // onClick={this.goto('/market')}
                className={`${styles.subMenuItem} ${
                  matchPath('/sell/market') ? styles.active : ''
                }`}
              >
                Market
              </span>
            </CustomPopover>
            <CustomPopover type="comingsoon">
              <span
                // onClick={this.goto('/garage')}
                className={`${styles.subMenuItem} ${
                  matchPath('/sell/garage') ? styles.active : ''
                }`}
              >
                Garage
              </span>
            </CustomPopover>
            <CustomPopover type="comingsoon">
              <span
                // onClick={this.goto('/create')}
                className={`${styles.subMenuItem} ${
                  matchPath('/sell/create') ? styles.active : ''
                }`}
              >
                Create
              </span>
            </CustomPopover>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
