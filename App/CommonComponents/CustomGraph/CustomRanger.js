import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Text
} from 'react-native'

const deviceWidth = Dimensions.get('window').width
// eslint-disable-next-line no-unused-vars
const deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 21,
    borderTopWidth: 2,
    borderTopColor: '#ffdc00',
    paddingTop: 20,
    paddingBottom: 10
  },
  rangeElement: {
    width: 32,
    height: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6
  },
  rangeElementSelected: {
    backgroundColor: '#ffdc00'
  },
  rangeTextElement: {
    color: '#ffdc00',
    fontSize: 14,
    fontWeight: 'bold'
  },
  rangeTextElementSelected: {
    color: '#ffffff'
  }
})

export default class CustomRanger extends Component {

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     currentIndex: this.props.current
  //   }
  // }

  // eslint-disable-next-line no-undef
  onRangerSelected = (index) => {
  // this.setState({ currentIndex })
    this.props.onSelectRange(index)
  };
  render () {
    // eslint-disable-next-line no-mixed-spaces-and-tabs
    const {
    ranges
    // current,
    // onSelectRange,
    // width,
    // ageIndexs,
    // verLine,
    // lineWidth,
    // getRangeBtnWidth
  } = this.props
  // const { currentIndex } = this.state;
    const currentIndex = 2
    return (
      <View style={styles.container}>
        {ranges.map((item, index) => {
          return (
            <TouchableOpacity onPress={() => { this.onRangerSelected(index) }} style={styles.rangeElement}>
              <View style={[styles.rangeElement, currentIndex === index ? styles.rangeElementSelected : null]}>
                <Text style={[styles.rangeTextElement, currentIndex === index ? styles.rangeTextElementSelected : null]}>{item}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

}
