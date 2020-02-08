import React from 'react';
import { connect } from 'react-redux';
import util from '../../../common/util';
import TradexIcon from '../../ui/TradexIcon';
import '../../../assets/style/common.scss';
import styles from './index.module.scss';
import { LayoutStatus } from '../../../store/types';
import { AppStore } from '../../../store/reducers';
import { FormattedNumber } from 'react-intl';

const mapStateToProps = (state: AppStore) => ({
  unreadNum: state.chat.unreadNum
});

interface Props {
  unreadNum: AppStore['chat']['unreadNum'];
  toggleChatShow: Function;
  listShow: boolean;
}

class ListMin extends React.Component<Props, object> {
  render() {
    const {
        unreadNum: { buy, sell },
        toggleChatShow
      } = this.props,
      _num = buy + sell;
    const { listShow } = this.props;
    return (
      <div
        className={`${styles.listMin} ${listShow ? styles.hide : ''}`}
        onClick={() => toggleChatShow()}
      >
        <TradexIcon
          type="iconicon_comment_area"
          className={`${styles.commentLine} ${_num ? styles.unread : ''}`}
        />
        <div className={styles.msg}>
          <FormattedNumber value={_num}></FormattedNumber>
          <span>{`Message${_num > 1 ? 's' : ''}`}</span>
        </div>
        <TradexIcon type="iconicon_fullscreen" className={styles.fullscreen} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(ListMin);
