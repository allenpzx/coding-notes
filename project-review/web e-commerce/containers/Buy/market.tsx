import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import BasicLayout from '../../components/Layout/BasicLayout';
import Card from '../../components/Card';
import { searchMarketList } from '../../api/buy';
import { getUserInfo } from '../../api/user';
import { getSetting } from '../../api/setting';
import { CardType } from '../../components/Card/CardTypes';
import Pagination from '../../components/Pagination';
import _get from '../../common/get';
import Loading from '../../components/Card/loading';
import FilterBar from '../../components/FilterBar';
import { connect } from 'react-redux';
import { AppStore } from '../../store/reducers/index';
import { SettingInfoStore } from '../../store/types';
import { SetUserInfo } from '../../store/actions/user';
import { SetSettingInfo } from '../../store/actions/setting';
import Empty from '../../components/Empty/Empty';
import { getCookie } from '../../common/cookie';
import { path } from '../../routes/routers';
import styles from '../../components/Card/index.module.scss';
import { bindActionCreators } from 'redux';

interface OutProps extends Props {}
interface Props {
  setting: SettingInfoStore;
  company_country: string;
  setUser: any;
}

interface State {
  page: number;
  pageSize: number;
  loading: boolean;
  count: number;
  next: string;
  previous: string | null;
  results: object[];
  server_time: string;
}

@(withRouter as any)
@(connect(
  (state: AppStore) => ({
    setting: state.setting,
    company_country: state.user.userInfo.company_country
  }),
  dispatch =>
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
    )
) as any)
class BuyMarket extends React.Component<Props & RouteComponentProps<{}>, State> {
  static defaultProps: OutProps;

  state = {
    page: 1,
    pageSize: 15,
    loading: false,
    count: 0,
    next: '',
    previous: '',
    results: [],
    server_time: ''
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

  loadData = async (opt?: object) => {
    try {
      if (!getCookie('Authorization')) {
        this.goto('/login');
      }

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

      const res = await searchMarketList({
        page,
        size: pageSize,
        // is_new_car: 0,
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
  };

  onCardClick = (id: string) => (e: React.MouseEvent<HTMLDivElement>) =>
    window.open(`${path.BuyCarDetail}/${id}`);

  onCardBottomClick = (arg: any) => (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // console.log(arg, '留着给聊天需求用的');
  };

  componentWillUnmount() {
    this.isUnMounted = true;
  }

  render() {
    const { loading, results, page, pageSize, count, next } = this.state;
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
          <FilterBar total={count} loading={loading} onChange={this.loadData} />
          {loading && <Loading />}
          {!loading && results.length === 0 && <Empty emptyType="empty_market" />}
          {!loading && results.length > 0 && (
            <div className={styles.CardContainer}>
              {results.map((v: CardType) => (
                <Card
                  key={v.id}
                  type="buy_market"
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
        </div>
      </BasicLayout>
    );
  }
}

export default BuyMarket;
