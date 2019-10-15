import { IntlShape } from 'react-intl';

export enum CarType {
  garage = 'garage',
  market = 'market',
  IR = 4
}

export enum CarStatus {
  InStock = 'in stock',
  InComing = 'incoming'
}

export interface IMakeName {
  key: string;
  display_value: string;
}

export interface IWareHouse {
  id?: string;
  name?: object;
  location?: object;
  city_location?: object;
  country?: {
    key?: string;
    display_value?: string;
  };
}

export interface UserType {
  company_country: 'string';
}

export interface BuyMarketListItemType {
  id: string;
  display_name: string;
  price: string;
  car_status: number;
  make_logo: string;
  make_name: IMakeName;
  currency: string;
  msrp: string;
  quantity: number;
  available: number;
  warehouse: IWareHouse;
  distance_to_warehouse: number;
  user: UserType;
  exterior_color: string;
  exterior_color_name: string;
  interior_color: string;
  interior_color_name: string;
  distance_unit: object;
  view_count: number;
  image: string;
  type: 'buy_market' | 'sell_market' | 'sell_garage';
  intl: IntlShape;
  user_company_country: string;
  money_symbol: string;
  onCardClick: (id: string) => any;
  onCardBottomClick: (id: string) => any;
}
