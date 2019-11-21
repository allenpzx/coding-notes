/**
 * 放到容器内最后一个位置，一般无需引入，参考BasicLayout
 * @author zixiu
 * @since 1.0.1
 * @version 1.0
 */

import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import IconFont from '../ui/TradexIcon';
import styles from './index.module.scss';

const QRIcon = <IconFont type="iconicon_qrcode_line" className={styles.qrIcon} />;

interface InProps extends RouteComponentProps {}

interface OutProps extends InProps {}

@(withRouter as any)
class Footer extends React.PureComponent<InProps, {}> {
  static defaultProps: OutProps;

  goto = (path: string) => () => {
    const isOutLink = path.startsWith('http') || path.startsWith('https') || path.startsWith('www');
    if (isOutLink) {
      return (window.location.href = path);
    }
    const {
      history: { push }
    } = this.props;
    push(path);
  };

  render() {
    return (
      <footer className={styles.footer}>
        <div className={styles.col1}>
          <b>About</b>
          <span onClick={this.goto('https://tradexport.cn/#scene-who-we-are')}>About us</span>
          <span onClick={this.goto('https://www.linkedin.com/company/trade-x-global/about/')}>
            Join us
          </span>
          <span onClick={this.goto('https://tradexport.com/terms')}>Terms</span>
        </div>
        <div className={styles.col2}>
          <b></b>
          <span onClick={this.goto('https://tradexport.cn/#section-services')}>Services</span>
          <span>
            <a href="mailto:hello@tradexport.com?Subject=ToCustomerService">Contact us</a>
          </span>
          <span onClick={this.goto('https://tradexport.com/privacy')}>Privacy</span>
        </div>
        <div className={styles.col3}>
          <div className={styles.qrcodeItem}>
            {QRIcon}
            <span>iOS</span>
          </div>
          <div className={styles.qrcodeItem}>
            {QRIcon}
            <span>Android</span>
          </div>
        </div>
      </footer>
    );
  }
}
export default Footer;
