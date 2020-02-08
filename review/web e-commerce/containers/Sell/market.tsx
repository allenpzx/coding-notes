import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import BasicLayout from '../../components/Layout/BasicLayout';
import Card from '../../components/Card';
import { getMygarage, moveToGarage, deletedCar } from '../../api/sell';
import { getUserInfo } from '../../api/user';
import { getSetting } from '../../api/setting';
import { CardType, cardEventType } from '../../components/Card/CardTypes';
import Pagination from '../../components/Pagination';
import _get from '../../common/get';
import Loading from '../../components/Card/loading';
import { connect } from 'react-redux';
import { compose, bindActionCreators, Dispatch } from 'redux';
import { AppStore } from '../../store/reducers/index';
import { SettingInfoStore, UserActions } from '../../store/types';
import { SetUserInfo } from '../../store/actions/user';
import { SetSettingInfo } from '../../store/actions/setting';
import Empty from '../../components/Empty/Empty';
import { getCookie } from '../../common/cookie';
import { path } from '../../routes/routers';
import Modal from '../../components/Modal';
import { Notification } from '../../components/Notification';
import styles from '../../components/Card/index.module.scss';

interface IStateProps {
  setting: SettingInfoStore;
  company_country: string;
}

interface IDispatchProps {
  setUser: (arg: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    username: string;
    company_country: string;
    headshot: string;
    display_name: string;
  }) => UserActions;
}

const mapStateToProps = (state: AppStore): IStateProps => ({
  setting: state.setting,
  company_country: state.user.userInfo.company_country
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
  bindActionCreators(
    {
      setUser: ({
        id = '',
        first_name = '',
        last_name = '',
        phone = '',
        username = '',
        company_country = '',
        headshot = '',
        display_name = ''
      }) =>
        SetUserInfo({
          userId: id,
          first_name,
          last_name,
          phone,
          username,
          company_country,
          headshot,
          display_name
        })
    },
    dispatch
  );

type IProps = IStateProps & IDispatchProps & RouteComponentProps;

interface IState {
  page: number;
  pageSize: number;
  loading: boolean;
  count: number;
  next: string;
  previous: string | null;
  results: object[];
  server_time: string;

  // modal
  modal_visible: boolean;
  modal_title: string;
  modal_message: string;
  modal_ok_fn: any;
  modal_ok_text: string;
  modal_cancel_text: string;
}

class SellMarket extends React.Component<IProps, IState> {
  static defaultProps: IProps;
  state = {
    page: 1,
    pageSize: 15,
    loading: false,
    count: 0,
    next: '',
    previous: '',
    results: [],
    server_time: '',

    modal_visible: false,
    modal_title: '',
    modal_message: '',
    modal_ok_fn: () => {},
    modal_ok_text: '',
    modal_cancel_text: ''
  };

  isUnMounted = false;

  async componentDidMount() {
    this.loadData();
  }

  onChange = (page: number, pageSize: number) => {
    if (this.state.loading) return;
    this.setState({ page, pageSize }, () => this.loadData());
  };

  onFilterChange = (opt: object) => this.loadData({ ...opt });

  goto = (path: string) => {
    const {
      history: { push }
    } = this.props;
    push(path);
  };

  loadSetting = async () => {
    const { data } = await getSetting();
    const { ALL_CURRENCIES } = data;
    SetSettingInfo(ALL_CURRENCIES);
  };

  loadUserInfo = async () => {
    const res = await getUserInfo();
    const {
      id = '',
      first_name = '',
      last_name = '',
      phone = '',
      username = '',
      company_country = '',
      headshot = '',
      display_name = ''
    } = res.data;
    this.props.setUser({
      id,
      first_name,
      last_name,
      phone,
      username,
      company_country,
      headshot,
      display_name
    });
  };

  async loadData(opt?: object) {
    try {
      if (!getCookie('Authorization')) {
        this.goto('/login');
      }
      const { setting, company_country } = this.props;
      const { page, pageSize, loading } = this.state;
      if (loading) return;
      this.setState({ loading: true });

      // check user and setting infomation
      if (this.props.setting.ALL_CURRENCIES.length === 0 && !this.props.company_country) {
        await Promise.all([this.loadSetting(), this.loadUserInfo()]);
      }
      if (this.props.setting.ALL_CURRENCIES.length === 0) {
        await this.loadSetting();
      }
      if (!this.props.company_country) {
        await this.loadUserInfo();
      }

      const res = await getMygarage({
        page,
        size: pageSize,
        car_type: 2,
        ...opt
      });
      // 跳页前禁止setState
      if (this.isUnMounted) return;
      !!res.data && this.setState({ loading: false, ...res.data });
    } catch (e) {
      this.setState({ loading: false });
      const _self = this;
      if (_get(e, ['response', 'status']) === 401) {
        _self.goto('/login');
      }
    }
  }

  moveToGarage = async (id: string) => {
    try {
      await moveToGarage(id);
    } catch (error) {
      const message = _get(error, ['response', 'data', 'detail']);
      Notification({
        type: 'error',
        message: 'Submission failed, please try again',
        description: message
      });
    } finally {
      this.loadData();
    }
  };

  removeCar = async (id: string) => {
    try {
      await deletedCar(id);
    } catch (error) {
      const message = _get(error, ['response', 'data', 'detail']);
      Notification({
        type: 'error',
        message: 'Submission failed, please try again',
        description: message
      });
    } finally {
      this.loadData();
    }
  };

  modalHide = () =>
    this.setState({
      modal_visible: false,
      modal_title: '',
      modal_message: '',
      modal_ok_fn: () => {},
      modal_ok_text: '',
      modal_cancel_text: ''
    });

  onCardClick = (id: string) => (e: React.MouseEvent<HTMLDivElement>) =>
    window.open(`${path.BuyCarDetail}/${id}`);

  onCardBottomClick = (arg: { id: string; type: cardEventType }) => (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    if (arg.type === 'edit_sell_market') {
      // this.goto('/')
    }
    if (arg.type === 'move_to_garage') {
      this.setState({
        modal_visible: true,
        modal_title: 'Move to Garage',
        modal_message:
          'Ongoing orders will not be affected, only the remaining unit(s) from this car listing will be moved.',
        modal_ok_fn: () => {
          this.moveToGarage(arg.id);
          this.modalHide();
        },
        modal_cancel_text: 'Cancel',
        modal_ok_text: 'Move'
      });
    }
    if (arg.type === 'remove_sell_market') {
      this.setState({
        modal_visible: true,
        modal_title: 'Remove this Car?',
        modal_message:
          'Ongoing orders will not be affected, only the remaining unit(s) from this car listing will be removed.',
        modal_ok_fn: () => {
          this.removeCar(arg.id);
          this.modalHide();
        },
        modal_cancel_text: 'Cancel',
        modal_ok_text: 'Delete'
      });
    }
  };

  componentWillUnmount() {
    this.isUnMounted = true;
  }

  render() {
    const {
      loading,
      results,
      page,
      pageSize,
      count,
      modal_visible,
      modal_title,
      modal_message,
      modal_ok_fn,
      modal_cancel_text,
      modal_ok_text,
      next
    } = this.state;
    const {
      setting: { ALL_CURRENCIES },
      company_country
    } = this.props;
    function matchSymbol(currency: string): string {
      const matched = ALL_CURRENCIES.find(v => v.code === currency);
      return matched ? matched.symbol : '$';
    }

    return (
      <BasicLayout>
        <div className={styles.wrappedContainer}>
          {loading && <Loading />}
          {!loading && results.length === 0 && <Empty emptyType="empty_market" />}
          {!loading && results.length > 0 && (
            <div className={styles.CardContainer}>
              {results.map((v: CardType) => (
                <Card
                  key={v.id}
                  type="sell_market"
                  id={v.id}
                  is_new_car={v.is_new_car}
                  image={v.image}
                  make_logo={v.make_logo}
                  make_name={v.make_name}
                  view_count={v.view_count}
                  display_name={v.display_name}
                  distance_to_warehouse={v.distance_to_warehouse}
                  distance_unit={v.distance_unit}
                  exterior_color={v.exterior_color}
                  exterior_color_name={v.exterior_color_name}
                  interior_color={v.interior_color}
                  interior_color_name={v.interior_color_name}
                  warehouse={v.warehouse}
                  car_status={v.car_status}
                  user={v.user}
                  quantity={v.quantity}
                  available={v.available}
                  price={v.price}
                  currency={v.currency}
                  msrp={v.msrp}
                  user_company_country={company_country}
                  money_symbol={matchSymbol(v.currency)}
                  onCardClick={this.onCardClick}
                  onCardBottomClick={this.onCardBottomClick}
                />
              ))}
            </div>
          )}
          {results.length > 0 && next && (
            <Pagination
              currentPage={page}
              total={count}
              pageSize={pageSize}
              onChange={this.onChange}
              loading={loading}
            />
          )}
          <Modal
            visible={modal_visible}
            title={modal_title}
            message={modal_message}
            onOk={modal_ok_fn}
            onCancel={this.modalHide}
            okText={modal_ok_text}
            cancelText={modal_cancel_text}
          />
        </div>
      </BasicLayout>
    );
  }
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SellMarket);
