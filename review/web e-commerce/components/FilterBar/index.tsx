/**
 * @description filter and sort list toolbar
 * @param {IProps}
 * @returns {ReactNode}
 * @author zixiu
 */

import React, { SFC, MouseEvent, ReactNode } from "react";
import { Spin } from "antd";
import IconFont from "../ui/TradexIcon";
import { getCountrySpecs, getMakes } from "../../api/searchBar";
import _get from "../../common/get";
import HackCheckBox from "../CheckBox";
import SliderInput from "../SliderInput";
import RadioBtn from "../RadioBtn";
import thousands from "../../common/thousands";
import { Notification } from "../Notification";
import { compose } from "redux";
import styles from "./index.module.scss";

interface IProps extends SFC {
  total: number;
  loading: boolean;
  onChange: any;
}

interface IColor {
  checked: boolean;
  key: string;
  value: string;
}

const colors = {
  White: "F9F6F6",
  Black: "333538",
  Silvery: "9BA5AE",
  Blue: "4A90E2",
  Brown: "7E6E65",
  Red: "E5515A",
  Yellow: "F5CD23",
  Green: "21C442"
};

const _colors: IColor[] = Object.entries(colors).map(([k, v]) => ({
  checked: false,
  key: k,
  value: v
}));

interface ICountry {
  count: number;
  specification_location: {
    display_value: string;
    key: string;
  };
  checked: boolean;
}

interface IMakeItem {
  count: number;
  make: {
    key: string;
    display_value: string;
  };
  make_logo: string;
  checked: boolean;
}

interface IMake {
  name: string;
  results: IMakeItem[];
}

type _ordering =
  | "recommendation"
  | "price_in_usd"
  | "-price_in_usd"
  | "-publish_time"
  | "publish_time"
  | "distance_to_warehouse";
type _transmission = "All" | "Manual" | "Automatic";
type _car_status = "All" | "1" | "2";
type _steering_position = "All" | "Left Hand Drive" | "Right Hand Drive";

const orderingType = {
  recommendation: "Recommendation",
  price_in_usd: "Price Low To High",
  "-price_in_usd": "Price High To Low",
  "-publish_time": "Publish Time Recent to Old",
  publish_time: "Publish Time Old to Recent",
  distance_to_warehouse: "Mileage Low to High"
};

const transmission_group: Record<"key" | "value", _transmission>[] = [
  { key: "All", value: "All" },
  { key: "Manual", value: "Manual" },
  { key: "Automatic", value: "Automatic" }
];

interface IVehicleStatus {
  key: "All" | "In Stock" | "Incoming";
  value: _car_status;
}

const vehicle_status_group: IVehicleStatus[] = [
  { key: "All", value: "All" },
  { key: "In Stock", value: "1" },
  { key: "Incoming", value: "2" }
];

interface ISteeringPosition {
  key: "All" | "Left" | "Right";
  value: _steering_position;
}

const steering_position_group: ISteeringPosition[] = [
  { key: "All", value: "All" },
  { key: "Left", value: "Left Hand Drive" },
  { key: "Right", value: "Right Hand Drive" }
];

interface IState {
  filterMenuShow: boolean;
  sortMenuShow: boolean;
  ordering: _ordering;
  countries: ICountry[];
  makes: IMake[];
  yearRange: [number, number];
  priceRange: [number, number];
  mileageRange: [number, number];
  readyToShipRange: [number, number];
  exterior_colors: IColor[];
  interior_colors: IColor[];
  transmission: _transmission;
  vehicle_status: _car_status;
  steering_position: _steering_position;
  conditions: IConditionItem[];
}

const nowYear = new Date().getFullYear();
const _priceRange = [2600, 500000];
const _yearRange = [nowYear - 20, nowYear + 2];
const _mileageRange = [0, 500];
const _readyToShipRange = [0, 60];

const initialState = {
  filterMenuShow: false,
  sortMenuShow: false,
  ordering: "recommendation" as _ordering,
  countries: [],
  makes: [],
  yearRange: [_yearRange[0], _yearRange[1]] as [number, number],
  priceRange: [_priceRange[0], _priceRange[1]] as [number, number],
  mileageRange: [_mileageRange[0], _mileageRange[1]] as [number, number],
  readyToShipRange: [_readyToShipRange[0], _readyToShipRange[1]] as [
    number,
    number
  ],
  exterior_colors: _colors,
  interior_colors: _colors,
  transmission: "All" as _transmission,
  vehicle_status: "All" as _car_status,
  steering_position: "All" as _steering_position,
  conditions: []
};

enum mapStateKeyToConditionsName {
  countries = "Country Specification",
  makes = "Make",
  priceRange = "Price Range",
  yearRange = "Model year",
  mileageRange = "Mileage(KMs)",
  exterior_colors = "Exterior Color",
  interior_colors = "Interior Color",
  transmission = "Transmission",
  vehicle_status = "Vehicle Status",
  readyToShipRange = "Ready to ship in(days)",
  steering_position = "Steering Position"
}

type TConditions =
  | "Country Specification"
  | "Make"
  | "Price Range"
  | "Model year"
  | "Mileage(KMs)"
  | "Exterior Color"
  | "Interior Color"
  | "Transmission"
  | "Vehicle Status"
  | "Ready to ship in(days)";

interface IConditionItem {
  type: TConditions;
  desc: string | ReactNode;
  onClose: any;
}

const ConditionItem: SFC<IConditionItem> = ({ type, desc, onClose }) => {
  return (
    <div className={styles.item}>
      <span className={styles.type}>{type}</span>
      <span className={styles.desc}>{desc}</span>
      <span className={styles.close} onClick={onClose}>
        <IconFont type="iconicon_cancel_small" />
      </span>
    </div>
  );
};

class FilterBar extends React.PureComponent<IProps, IState> {
  state = initialState;
  private filter_menu_ref = React.createRef<HTMLDivElement>();

  toggleFilterMenu = () => {
    this.setState((prev: IState) => ({ filterMenuShow: !prev.filterMenuShow }));
  };

  onFilterMouseOver = (): void => {
    if (this.state.filterMenuShow) return;
    this.setState({ filterMenuShow: true });
  };

  onFilterMouseLeave = (): void => {
    if (!this.state.filterMenuShow) return;
    this.setState({ filterMenuShow: false });
  };

  onSortMouseOver = (): void => {
    if (this.state.sortMenuShow) return;
    this.setState({ sortMenuShow: true });
  };

  onSortMouseLeave = (): void => {
    if (!this.state.sortMenuShow) return;
    this.setState({ sortMenuShow: false });
  };

  onCountryChange = (item: ICountry) => () => {
    this.setState(
      (prev: IState) => ({
        countries: prev.countries.map((v: ICountry) =>
          v.specification_location.display_value ===
          item.specification_location.display_value
            ? { ...v, checked: !v.checked }
            : v
        ),
        conditions: item.checked
          ? prev.conditions.filter((v: IConditionItem) =>
              v.type === "Country Specification" &&
              v.desc === item.specification_location.display_value
                ? false
                : true
            )
          : prev.conditions.concat({
              type: "Country Specification",
              desc: item.specification_location.display_value,
              onClose: () => this.onCountryChange({ ...item, checked: true })()
            })
      }),
      () => this.updateFilter()
    );
  };

  onMakeChange = (item: IMakeItem) => () => {
    const isChecked = item.checked;
    this.setState(
      (prev: IState) => {
        const next_makes = prev.makes;
        next_makes.find((v: IMake) =>
          v.results.find((it: IMakeItem) => {
            if (it.make.key === item.make.key) {
              it.checked = !it.checked;
              return true;
            }
            return false;
          })
        );
        return {
          makes: next_makes,
          conditions: isChecked
            ? prev.conditions.filter((v: IConditionItem) =>
                v.type === "Make" && v.desc === item.make.display_value
                  ? false
                  : true
              )
            : prev.conditions.concat({
                type: "Make",
                desc: item.make.display_value,
                onClose: () => this.onMakeChange({ ...item, checked: true })()
              })
        };
      },
      () => this.updateFilter()
    );
  };

  onRangeChange = (
    key: "priceRange" | "yearRange" | "mileageRange" | "readyToShipRange",
    shouldUpdate = true
  ) => (range: [number, number]) =>
    this.setState(
      (prev: IState): IState => {
        const _conditions = ((con: IConditionItem[]) => {
          const _key = mapStateKeyToConditionsName[key];
          const left = range[0];
          const right = range[1];
          let _con = con.slice();
          const index = _con.findIndex(v => v.type === _key);

          if (left === initialState[key][0] && right === initialState[key][1]) {
            return _con.filter((v: IConditionItem) => v.type !== _key);
          }
          if (index >= 0) {
            _con[index].desc = `${thousands(left)}-${thousands(right)}`;
          }
          if (index === -1) {
            _con.push({
              type: _key as TConditions,
              desc: `${thousands(left)}-${thousands(right)}`,
              onClose: () =>
                this.onRangeChange(key)([
                  initialState[key][0],
                  initialState[key][1]
                ])
            });
          }
          return _con;
        })(prev.conditions);
        return {
          ...prev,
          [key]: [range[0], range[1]],
          conditions: _conditions
        };
      },
      () => (shouldUpdate ? this.updateFilter() : null)
    );

  onColorChange = (
    key: "exterior_colors" | "interior_colors",
    item: IColor
  ) => () => {
    this.setState(
      (prev: IState): IState => {
        let conditions = prev.conditions.slice();
        const isChecked = item.checked;
        const _key = mapStateKeyToConditionsName[key];
        const index = conditions.findIndex(
          (v: IConditionItem) => v.type === _key
        );

        if (!isChecked && index === -1) {
          conditions.push({
            type: _key as TConditions,
            desc: (
              <div className={styles.inlineBlock}>
                <span
                  className={styles.miniCircle}
                  style={{ backgroundColor: `#${item.value}` }}
                ></span>
              </div>
            ),
            onClose: () =>
              this.setState(
                (prev: IState) => ({
                  ...prev,
                  [key]: initialState[key],
                  conditions: prev.conditions.filter(
                    (it: IConditionItem) => it.type !== _key
                  )
                }),
                () => this.updateFilter()
              )
          });
        }
        if (!isChecked && index !== -1) {
          conditions[index].desc = (
            <div className={styles.inlineBlock}>
              {prev[key]
                .filter((v: IColor) => v.checked)
                .concat({ ...item, checked: true })
                .map((v: IColor) => (
                  <span
                    key={v.value}
                    className={styles.miniCircle}
                    style={{ backgroundColor: `#${v.value}` }}
                  ></span>
                ))}
            </div>
          );
        }
        if (isChecked) {
          const _next = prev[key].filter(
            (v: IColor) => v.checked && v.value !== item.value
          );
          if (_next.length > 0) {
            conditions[index].desc = (
              <div className={styles.inlineBlock}>
                {_next.map((v: IColor) => (
                  <span
                    key={v.value}
                    className={styles.miniCircle}
                    style={{ backgroundColor: `#${v.value}` }}
                  ></span>
                ))}
              </div>
            );
          }
          if (_next.length === 0) {
            conditions = conditions.filter(
              (v: IConditionItem) => v.type !== _key
            );
          }
        }

        return {
          ...prev,
          [key]: prev[key].map(v =>
            v.value === item.value ? { ...v, checked: !v.checked } : v
          ),
          conditions: conditions
        };
      },
      () => this.updateFilter()
    );
  };

  onRadioChange = (
    key: "transmission" | "vehicle_status" | "steering_position"
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(
      (prev: IState): IState => {
        const _next = e.target.value;
        const _key = mapStateKeyToConditionsName[key];
        let _conditions = prev.conditions.slice();
        const index = _conditions.findIndex(
          (v: IConditionItem) => v.type === _key
        );
        if (_next === "All") {
          _conditions = _conditions.filter(
            (v: IConditionItem) => v.type !== _key
          );
        }
        if (_next !== "All") {
          index === -1
            ? _conditions.push({
                type: _key as TConditions,
                desc: `${_next}`,
                onClose: () =>
                  this.setState(
                    (prev: IState) => ({
                      ...prev,
                      [key]: initialState[key],
                      conditions: prev.conditions.filter(v => v.type !== _key)
                    }),
                    () => this.updateFilter()
                  )
              })
            : (_conditions[index].desc = `${_next}`);
        }

        return {
          ...prev,
          [key]: _next,
          conditions: _conditions
        };
      },
      () => this.updateFilter()
    );
  };

  onSortMenuClick = (e: MouseEvent<HTMLDivElement>) => {
    if (this.props.loading) return;
    const sort = (e.target as any).dataset.sort;
    if (sort === this.state.ordering) return;
    sort &&
      this.setState({ ordering: sort }, () => {
        this.onSortMouseLeave();
        this.updateFilter();
      });
  };

  getCountries = async () => {
    try {
      const { data, status } = await getCountrySpecs();
      const res = _get(data, ["results"]);
      status === 200 &&
        res &&
        this.setState({
          countries: res.map((v: ICountry) => ({ ...v, checked: false }))
        });
    } catch (error) {
      Notification({
        type: "error",
        message: "Get menu config error",
        description: _get(error, ["response", "data", "detail"])
      });
    }
  };

  getMakes = async () => {
    try {
      const { data, status } = await getMakes();
      const res = _get(data, ["results"]);
      status === 200 &&
        res &&
        this.setState({
          makes: res.map((v: IMake) => ({
            ...v,
            results: v.results.map((re: IMakeItem) => ({
              ...re,
              checked: false
            }))
          }))
        });
    } catch (error) {
      Notification({
        type: "error",
        message: "Get menu config error",
        description: _get(error, ["response", "data", "detail"])
      });
    }
  };

  setDynamicHeight = () => {
    const main = document.getElementById("basic_layout_main");
    const filter_bar = this.filter_menu_ref.current;
    if (main && filter_bar) {
      const _target =
        (filter_bar as HTMLDivElement).clientHeight || 1069 + 80 + 32;
      (main as any).style.minHeight = `${_target}px`;
    }
  };

  getConditions = () => {
    const {
      ordering,
      yearRange,
      priceRange,
      mileageRange,
      readyToShipRange,
      transmission,
      vehicle_status,
      steering_position
    } = this.state;
    const _query = {
      ordering: ordering === "recommendation" ? "" : ordering,
      price_in_usd:
        priceRange[0] !== _priceRange[0] || priceRange[1] !== _priceRange[1]
          ? `${priceRange[0]} ${priceRange[1]}`
          : null,
      model_year:
        yearRange[0] !== _yearRange[0] || yearRange[1] !== _yearRange[1]
          ? `${yearRange[0]} ${yearRange[1]}`
          : null,
      distance_to_warehouse:
        mileageRange[0] !== _mileageRange[0] ||
        mileageRange[1] !== _mileageRange[1]
          ? `${mileageRange[0]} ${mileageRange[1]}`
          : null,
      days_to_warehouse:
        readyToShipRange[0] !== readyToShipRange[0] ||
        readyToShipRange[1] !== readyToShipRange[1]
          ? `${readyToShipRange[0]} ${readyToShipRange[1]}`
          : null,
      specification_location:
        this.checked_countries.length > 0
          ? this.checked_countries.reduce(
              (prev: string, curr: ICountry) =>
                `${prev} ${curr.specification_location.key}`,
              ""
            )
          : null,
      make_name:
        this.checked_makes.length > 0
          ? this.checked_makes.reduce(
              (prev: string, curr: IMakeItem) => `${prev} ${curr.make.key}`,
              ""
            )
          : null,
      exterior_colors:
        this.checked_exterior_colors.length > 0
          ? this.checked_exterior_colors.reduce(
              (prev: string, curr: IColor) => `${prev} ${curr.value}`,
              ""
            )
          : null,

      interior_colors:
        this.checked_interior_colors.length > 0
          ? this.checked_interior_colors.reduce(
              (prev: string, curr: IColor) => `${prev} ${curr.value}`,
              ""
            )
          : null,
      transmission: transmission === "All" ? null : transmission,
      l_or_r: steering_position === "All" ? null : steering_position,
      car_status: vehicle_status === "All" ? null : vehicle_status
    };
    return _query;
  };

  get checked_countries() {
    return this.state.countries.filter((v: ICountry) => v.checked);
  }

  get checked_makes() {
    return this.state.makes.reduce(
      (prev: IMakeItem[], curr: IMake) =>
        prev.concat(curr.results.filter((it: IMakeItem) => it.checked)),
      []
    );
  }

  get checked_exterior_colors() {
    return this.state.exterior_colors.filter((v: IColor) => v.checked);
  }

  get checked_interior_colors() {
    return this.state.interior_colors.filter((v: IColor) => v.checked);
  }

  updateFilter = () =>
    compose(
      () => this.setState({ filterMenuShow: false, sortMenuShow: false }),
      this.props.onChange,
      this.getConditions
    )();

  componentDidUpdate() {
    this.setDynamicHeight();
  }

  async componentDidMount() {
    this.setDynamicHeight();
    await Promise.all([this.getCountries(), this.getMakes()]);
  }

  render() {
    const { total, loading } = this.props;
    const {
      filterMenuShow,
      sortMenuShow,
      countries,
      makes,
      ordering,
      priceRange,
      yearRange,
      mileageRange,
      exterior_colors,
      interior_colors,
      transmission,
      vehicle_status,
      steering_position,
      readyToShipRange,
      conditions
    } = this.state;

    const filterMenu = (
      <div className={styles.filterMenuWrap}>
        <div
          className={`${styles.filterMenu} 
          ${filterMenuShow ? styles.filterShow : ""}
          `}
          ref={this.filter_menu_ref}
          // onMouseOver={this.onFilterMouseOver}
          // onMouseLeave={this.onFilterMouseLeave}
        >
          <div className={styles.title} onClick={this.toggleFilterMenu}>
            <span className={styles.symbol}></span>
            <span>Filters By</span>
            <IconFont
              type="iconicon_flod_square"
              className={styles.titleIcon}
            />
          </div>

          {/* countries */}
          <div className={styles.subMenuArea}>
            <div className={styles.menu}>
              <span className={styles.menuTitle}>Country Specification</span>
              <IconFont
                type="iconicon_rightarrow"
                className={styles.arrowIcon}
              />
            </div>

            <ul className={styles.menuList}>
              {countries.map((v: ICountry) => (
                <li key={v.specification_location.key}>
                  <HackCheckBox
                    text={v.specification_location.display_value}
                    checked={v.checked}
                    onChange={this.onCountryChange(v)}
                  />
                </li>
              ))}
            </ul>

            <ul className={styles.menuListChosen}>
              {this.checked_countries.map((v: ICountry) => (
                <li key={v.specification_location.key}>
                  <span
                    className={styles.tag}
                    key={v.specification_location.key}
                  >
                    {v.specification_location.display_value}
                  </span>{" "}
                  <IconFont
                    type="iconicon_cancel"
                    onClick={this.onCountryChange(v)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* makes */}
          <div className={styles.subMenuArea}>
            <div className={styles.menu}>
              <span className={styles.menuTitle}>Make</span>
              <IconFont
                type="iconicon_rightarrow"
                className={styles.arrowIcon}
              />
            </div>

            <ul className={`${styles.menuList} ${styles.menuListMakes}`}>
              {makes.map((v: IMake) => {
                return (
                  <li key={v.name} className={styles.makeLi}>
                    <span className={styles.alpha}>{v.name}</span>
                    {v.results.map((it: IMakeItem) => (
                      <div className={styles.makeItem} key={it.make.key}>
                        <img
                          className={styles.makeItemLogo}
                          src={it.make_logo}
                        />
                        <HackCheckBox
                          text={it.make.display_value}
                          checked={it.checked}
                          onChange={this.onMakeChange(it)}
                        />
                        <span className={styles.makeItemCount}>{it.count}</span>
                      </div>
                    ))}
                  </li>
                );
              })}
            </ul>

            <ul className={styles.menuListChosen}>
              {this.checked_makes.map((v: IMakeItem) => (
                <li key={v.make.key}>
                  <span className={styles.tag} key={v.make.key}>
                    {v.make.display_value}
                  </span>{" "}
                  <IconFont
                    type="iconicon_cancel"
                    // onClick={this.deleteCheckedMake(v)}
                    onClick={this.onMakeChange(v)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* price */}
          <div className={styles.rangeArea}>
            <span className={styles.title}>Price Range</span>
            <div className={styles.sliderArea}>
              <SliderInput
                min={_priceRange[0]}
                max={_priceRange[1]}
                left={priceRange[0]}
                right={priceRange[1]}
                onChange={this.onRangeChange("priceRange", false)}
                onAfterChange={this.onRangeChange("priceRange")}
              />
            </div>
          </div>

          {/* year */}
          <div className={styles.rangeArea}>
            <span className={styles.title}>Model Year</span>
            <div className={styles.sliderArea}>
              <SliderInput
                min={_yearRange[0]}
                max={_yearRange[1]}
                left={yearRange[0]}
                right={yearRange[1]}
                onChange={this.onRangeChange("yearRange", false)}
                onAfterChange={this.onRangeChange("yearRange")}
              />
            </div>
          </div>

          {/* mileage */}
          <div className={styles.rangeArea}>
            <span className={styles.title}>Mileage(KMs)</span>
            <div className={styles.sliderArea}>
              <SliderInput
                min={_mileageRange[0]}
                max={_mileageRange[1]}
                left={mileageRange[0]}
                right={mileageRange[1]}
                onChange={this.onRangeChange("mileageRange", false)}
                onAfterChange={this.onRangeChange("mileageRange")}
              />
            </div>
          </div>

          {/* exterior_color */}
          <div className={`${styles.subMenuArea} ${styles.colorArea}`}>
            <div className={styles.menu}>
              <span className={styles.menuTitle}>Exterior Color</span>
            </div>
            <ul className={styles.menuList}>
              {exterior_colors.map((v: IColor) => (
                <li key={v.value}>
                  <span
                    className={styles.colorCircle}
                    style={{ backgroundColor: `#${v.value}` }}
                  ></span>
                  <HackCheckBox
                    text={v.key}
                    checked={v.checked}
                    onChange={this.onColorChange("exterior_colors", v)}
                  />
                </li>
              ))}
            </ul>
            <div className={styles.colors}>
              <ul className={styles.colorsBox}>
                {this.checked_exterior_colors.map((v: IColor) => (
                  <li
                    key={v.value}
                    className={styles.miniCircle}
                    style={{ backgroundColor: `#${v.value}` }}
                  ></li>
                ))}
              </ul>
              <IconFont
                type="iconicon_rightarrow"
                className={styles.arrowIcon}
              />
            </div>
          </div>

          {/* interior_color */}
          <div className={`${styles.subMenuArea} ${styles.colorArea}`}>
            <div className={styles.menu}>
              <span className={styles.menuTitle}>Interior Color</span>
            </div>
            <ul className={styles.menuList}>
              {interior_colors.map((v: IColor) => (
                <li key={v.value}>
                  <span
                    className={styles.colorCircle}
                    style={{ backgroundColor: `#${v.value}` }}
                  ></span>
                  <HackCheckBox
                    text={v.key}
                    checked={v.checked}
                    onChange={this.onColorChange("interior_colors", v)}
                  />
                </li>
              ))}
            </ul>
            <div className={styles.colors}>
              <ul className={styles.colorsBox}>
                {this.checked_interior_colors.map((v: IColor) => (
                  <li
                    key={v.value}
                    className={styles.miniCircle}
                    style={{ backgroundColor: `#${v.value}` }}
                  ></li>
                ))}
              </ul>
              <IconFont
                type="iconicon_rightarrow"
                className={styles.arrowIcon}
              />
            </div>
          </div>

          {/* transmission */}
          <div className={styles.radioArea}>
            <div className={styles.menuTitle}>Transmission</div>
            <div className={styles.btnGroup}>
              <RadioBtn
                all={transmission_group}
                value={transmission}
                onChange={this.onRadioChange("transmission")}
              />
            </div>
          </div>

          {/* vehicle */}
          <div className={styles.radioArea}>
            <div className={styles.menuTitle}>Vehicle Status</div>
            <div className={styles.btnGroup}>
              <RadioBtn
                all={vehicle_status_group}
                value={vehicle_status}
                onChange={this.onRadioChange("vehicle_status")}
              />
            </div>
          </div>

          {/* day */}
          <div className={styles.rangeArea}>
            <span className={styles.title}>Ready to ship in(days)</span>
            <div className={styles.sliderArea}>
              <SliderInput
                min={_readyToShipRange[0]}
                max={_readyToShipRange[1]}
                left={readyToShipRange[0]}
                right={readyToShipRange[1]}
                onChange={this.onRangeChange("readyToShipRange", false)}
                onAfterChange={this.onRangeChange("readyToShipRange")}
              />
            </div>
          </div>

          {/* steer */}
          <div className={styles.radioArea}>
            <div className={styles.menuTitle}>Steering Position</div>
            <div className={styles.btnGroup}>
              <RadioBtn
                all={steering_position_group}
                value={steering_position}
                onChange={this.onRadioChange("steering_position")}
              />
            </div>
          </div>
        </div>
      </div>
    );

    const sortMenu = (
      <div
        className={`${styles.sortMenu} ${sortMenuShow ? styles.show : ""}`}
        onMouseOver={this.onSortMouseOver}
        onMouseLeave={this.onSortMouseLeave}
        onClick={this.onSortMenuClick}
      >
        <div
          data-sort={"recommendation"}
          className={`${styles.item} ${
            ordering === "recommendation" ? styles.sortMenuItemActive : ""
          }`}
        >
          Recommendation
        </div>
        <div
          data-sort={"price_in_usd"}
          className={`${styles.item} ${
            ordering === "price_in_usd" ? styles.sortMenuItemActive : ""
          }`}
        >
          Price Low to High
        </div>
        <div
          data-sort={"-price_in_usd"}
          className={`${styles.item} ${
            ordering === "-price_in_usd" ? styles.sortMenuItemActive : ""
          }`}
        >
          Price High to Low
        </div>
        <div
          data-sort={"-publish_time"}
          className={`${styles.item} ${
            ordering === "-publish_time" ? styles.sortMenuItemActive : ""
          }`}
        >
          Publish Time Recent to Old
        </div>
        <div
          data-sort={"publish_time"}
          className={`${styles.item} ${
            ordering === "publish_time" ? styles.sortMenuItemActive : ""
          }`}
        >
          Publish Time Old to Recent
        </div>
        <div
          data-sort={"distance_to_warehouse"}
          className={`${styles.item} ${
            ordering === "distance_to_warehouse"
              ? styles.sortMenuItemActive
              : ""
          }`}
        >
          Mileage Low to High
        </div>
      </div>
    );

    return (
      <div className={styles.container}>
        <Spin spinning={loading} style={{ width: 1200, height: 60 }}>
          <div className={styles.FilterBar}>
            <div
              className={styles.left}
              // onMouseOver={this.onFilterMouseOver}
              // onMouseLeave={this.onFilterMouseLeave}
              onClick={this.toggleFilterMenu}
            >
              <IconFont
                type="iconicon_filter_vertical"
                className={styles.bigFilterIcon}
              />
              <span className={styles.filterTitle}>Filters</span>
              <IconFont
                type="iconicon_dropdown_square"
                className={styles.statusIcon}
              />
            </div>

            <div className={styles.right}>
              <div
                className={styles.btnGroup}
                onMouseOver={this.onSortMouseOver}
                onMouseLeave={this.onSortMouseLeave}
              >
                <IconFont
                  type="iconicon_triangle_updown"
                  className={styles.rightIcon}
                />
                <span className={styles.rightSpan}>
                  {Reflect.get(orderingType, ordering)}
                </span>
              </div>
              <span className={styles.total}>
                {total} {total > 1 ? "vehicles" : "vehicle"} found
              </span>
            </div>
          </div>

          <div className={styles.menuDisplay}>
            {filterMenu}
            {sortMenu}
          </div>

          <div className={styles.conditions}>
            {conditions.map(
              (v: IConditionItem, i: number): ReactNode => (
                <ConditionItem
                  key={i}
                  type={v.type}
                  desc={v.desc}
                  onClose={v.onClose}
                />
              )
            )}
          </div>
        </Spin>
      </div>
    );
  }
}

export default FilterBar;
