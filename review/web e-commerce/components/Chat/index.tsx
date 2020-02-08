import React from 'react';
import { connect } from 'react-redux';
import Main from './Main';
import { AppStore } from '../../store/reducers';
import { ChatMode } from '../../store/types';
import ChatBox from './ChatBox/ChatBox';
import ChatMain from '../ChatMain';

const mapStateToProps = (state: AppStore) => ({
  modes: state.route.modes,
  params: state.route.params
});

const mapDispatchToProps = {};

interface Props {
  modes: AppStore['route']['modes'];
  params: AppStore['route']['params'];
}

class Chat extends React.Component<Props, object> {
  render() {
    const { modes, params } = this.props;
    return (
      <>
        {modes.includes(ChatMode.ALL_IN_ONE) && <Main {...params[ChatMode.ALL_IN_ONE]} />}
        {modes.includes(ChatMode.WINDOW_MODE) && <ChatMain {...params[ChatMode.WINDOW_MODE]} />}
        {modes.includes(ChatMode.LIST_MODE) && <ChatBox {...params[ChatMode.LIST_MODE]} />}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
