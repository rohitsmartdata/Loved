/* eslint-disable space-before-function-paren,no-unused-vars,comma-dangle,semi */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Fonts
  from '../../../Themes/Fonts'
import Colors from '../../../Themes/Colors'

export default class Range extends Component {

  props: {
    name: string,
    active: boolean,
    onPress: (range: string) => void,
  };

  state = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  }

  onPress = () => {
    const {
      name,
      index,
      onPress
    } = this.props;
    onPress(index);
  };

  onLayout = (e) => {
    if (!this.initPass) {
      this.setState({
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
        x: e.nativeEvent.layout.x,
        y: e.nativeEvent.layout.y
      })
      this.props.getRangeBtnWidth(e.nativeEvent.layout.width, this.props.index)
      this.initPass = true
    }
  }

  render() {
    const {
      name,
      active,
      width,
      index,
      ageIndexs,
      verLine,
      lineWidth
    } = this.props;
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={name}
        style={[styles.container, {left: verLine[ageIndexs[index]] - this.state.width / 4 + 3}]} onPress={this.onPress}>
        {/* <View style = {[{position: 'absolute', width: lineWidth, left: this.state.width / 2 + 5, height: 10, backgroundColor: 'yellow'}]}/> */}
        <View onLayout={this.onLayout} style={active ? styles.bottomActive : styles.bottomInactive}>
          <Text style={[styles.text, active ? styles.active : {}, {fontSize: 11, fontFamily: Fonts.type.bold, color: active ? '#FFF' : Colors.darkBlue}]}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    // borderWidth: 1,
    position: 'absolute'
  },
  text: {
    color: '#FFF',
    fontFamily: 'Avenir',
    fontSize: 12,
    fontWeight: 'bold'
  },
  bottomInactive: {
    borderRadius: 5,
    padding: 4,
    paddingLeft: 6,
    paddingRight: 6,
    justifyContent: 'center',
  },
  bottomActive: {
    borderRadius: 5,
    padding: 4,
    paddingLeft: 6,
    paddingRight: 6,
    justifyContent: 'center',
    backgroundColor: Colors.appBlue,
    // backgroundColor: '#fff'
  },
  active: {
    color: '#000',
  },
})
