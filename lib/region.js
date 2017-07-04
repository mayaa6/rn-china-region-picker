/**
 * 省市区级联
 */
import React, { Component } from 'react';

import {
    View,
    Text,
    Animated,
    PickerIOS,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import webapi from './webapi';

const { HEIGHT, WIDTH } = Dimensions.get('window');

// var noop = () => {};
const noop = () => {};


class Region extends Component {
  constructor(props) {
      super(props);
      /**
       * 初始化状态
       */
      this.state = {
          //距离顶部的距离
          topValue: new Animated.Value(0),
          //省
          province: [],
          //市
          city: [],
          //地区
          area: [],
          //选中的省
          selectedProvince: this.props.selectedProvince,
          //选中的市
          selectedCity: this.props.selectedCity,
          //选中的地区
          selectedArea: this.props.selectedArea
      }
  }

  componentWillReceiveProps(nextProps) {
        if (nextProps.visible != this.props.visible) {
          //开始动画
          Animated.spring(this.state.topValue, {
              toValue: nextProps.visible ? HEIGHT : 0,
              friction: 10,
              tension: 30
          }).start();
        }
      },
  componentWillMount() {
      //开始动画
      Animated.spring(this.state.topValue, {
          toValue: this.props.visible ? HEIGHT : 0,
          friction: 10,
          tension: 30
      }).start();
  },
  componentDidMount() {
    webapi.fetchRegionData().then((data) => {
            //cache it.
            this._data = data;

            //过滤省
            var province = this._filter('086');
            this._selectedProvinceName = this._data[this.state.selectedProvince][0];

            //过滤省对于的市
            var city = this._filter(this.state.selectedProvince);

            //市的名字
            this._selectedCityName = '';
            if (this.state.selectedCity) {
                this._selectedCityName = this._data[this.state.selectedCity][0];
            }

            //过滤第一个市对应的区
            var area = [];
            if (this.state.selectedCity) {
                area = this._filter(this.state.selectedCity);

                this._selectAreaName = '';
                if (this.state.selectedArea) {
                    this._selectAreaName = this._data[this.state.selectedArea][0];
                }
            }

            this.setState({
                province: province,
                city: city,
                area: area
            });
        });
  },
  render() {
    return (
      <Animated.View ref='region' style={[styles.container, {
          top: this.state.topValue.interpolate({
            inputRange: [0, HEIGHT],
            outputRange: [HEIGHT, 0]
          })
        }]}>
        <View style={styles.region}>
          {/*头部按钮*/}
          <View style={styles.nav}>
            <TouchableOpacity onPress={this._handleCancel}>
              <Text style={styles.text}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._handleSubmit}>
              <Text style={styles.text}>确认</Text>
            </TouchableOpacity>
          </View>

          {/*省市区级联*/}
          <View style={styles.regionArea}>
            {/*省*/}
            <PickerIOS
              style={styles.regionItem}
              onValueChange={this._handleProvinceChange}
              selectedValue={this.state.selectedProvince}>
              {this.state.province.map((v, k) => {
                return (
                  <PickerIOS.Item value={v[0]} label={v[1]} key={k}/>
                );
              })}
            </PickerIOS>

            {/*市*/}
            <PickerIOS
              style={styles.regionItem}
              onValueChange={this._handleCityChange}
              selectedValue={this.state.selectedCity}>
              {this.state.city.map((v, k) => {
                return (<PickerIOS.Item value={v[0]} label={v[1]} key={k}/>);
              })}
            </PickerIOS>

            {/*区*/}
            <PickerIOS
              style={styles.regionItem}
              onValueChange={this._handleAreaChange}
              selectedValue={this.state.selectedArea}>
              {this.state.area.map((v, k) => {
                return (<PickerIOS.Item value={v[0]} label={v[1]} key={k}/>);
              })}
            </PickerIOS>
          </View>
        </View>
      </Animated.View>
    );
  },
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT,
    left: 0,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  nav: {
    height: 60,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'blue',
    flexDirection: 'row'
  },
  text: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold'
  },
  region: {
    flex: 1,
    marginTop: HEIGHT/2,
    backgroundColor: '#FFF'
  },
  regionArea: {
    flexDirection: 'row'
  },
  regionItem: {
    flex: 1
  }
});

export default Region
