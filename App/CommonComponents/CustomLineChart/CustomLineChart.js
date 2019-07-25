/* eslint-disable no-trailing-spaces */
import React, { Component } from 'react'

import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native'

import { AreaChart, Path } from 'react-native-svg-charts'

import * as shape from 'd3-shape'
import Fonts from '../../Themes/Fonts'
import Colors from '../../Themes/Colors'

const { width } = Dimensions.get('window')
var Spinner = require('react-native-spinkit')

type
  Props = {};
export default class CustomLineChart extends Component<Props> {

  props: {
    width: number,
    height: number,
    itemIndex: number,
    chartPaddingTop: number,
    chartPaddingRight: number,
    chartPaddingLeft: number,
    chartPaddingBottom: number,
    data: Array<number>,
    backgroundColor: string,
    fillColor: string,
    lineColor: string,
    lineWidth: string,
    bottomBoxHeight: number,
    bottomBoxPaddingLeft: number,
    bottomBoxPaddingRight: number,
    bottomBoxMarginBottom: number,
    bottomBoxCellBottom: number,
    bottomBoxCellTop: number,
    bottomBoxBackgroundColor: string,
    bottomStrProgress: Array<string>,
    bottomStrYear: Array<string>,
    isLoading: boolean,
  }

  static defaultProps = {
    width,
    height: 150,
    itemIndex: 0,
    chartPaddingTop: 0,
    chartPaddingRight: 0,
    chartPaddingLeft: 0,
    chartPaddingBottom: 0,
    data: [],
    backgroundColor: 'rgba(255, 0, 255, 0.0)',
    fillColor: 'rgba(255, 0, 255, 0.)',
    lineColor: 'rgb(134, 65, 244, 0.8)',
    lineWidth: '0.5',
    bottomBoxHeight: 46,
    bottomBoxPaddingLeft: 30,
    bottomBoxPaddingRight: 30,
    bottomBoxMarginBottom: 10,
    bottomBoxCellBottom: 4,
    bottomBoxCellTop: 4,
    bottomBoxBackgroundColor: 'rgba(28, 60, 112, 0.08)',
    bottomBoxActiveColor: 'rgba(255, 255, 255, 255)',
    bottomStrProgress: ['10%', '40%', '70%', '90%'],
    bottomStrYear: ['1yr', '3yr', '5yr', '10yr'],
    isLoading: false
  }

  constructor (props) {
    super(props)

    // calculate current index.
    let initialIndex = this.props.itemIndex
    if (this.props.bottomStrProgress[3] !== '--') {
      initialIndex = 3
    } else if (this.props.bottomStrProgress[2] !== '--') {
      initialIndex = 2
    } else if (this.props.bottomStrProgress[1] !== '--') {
      initialIndex = 1
    } else initialIndex = 0

    this.state = {
      currentIndex: initialIndex
    }
    this.data = props.data || []
  }

  componentWillReceiveProps (nextProps) {
    this.data = nextProps.data
  }

  setCurrentElement (index) {
    this.setState({ currentIndex: index })
    this.props.onChange(index)
  }

  renderChartArea () {
    const {isLoading, bottomStrProgress} = this.props
    if (isLoading) {
      return (
        <View style={{ height: this.props.height, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner isVisible size={30} type={'Circle'} color={Colors.lightGray} />
        </View>
      )
    }

    if (bottomStrProgress[this.state.currentIndex] === '--') {
      return (
        <View style={{ height: this.props.height, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, lineHeight: 18, fontFamily: Fonts.type.book, color: Colors.lightGray }}>No Data Available</Text>
        </View>
      )
    }

    if (this.data.length > 1) {
      const Line = ({ line }) => (
        <Path
          key={'line '}
          d={line}
          stroke={this.props.lineColor}
          strokeWidth={this.props.lineWidth}
          fill={'none'}
        />
      )
      return (
        <AreaChart
          style={{ height: this.props.height }}
          data={this.data}
          contentInset={{ top: this.props.chartPaddingTop, bottom: this.props.chartPaddingBottom, left: this.props.chartPaddingLeft, right: this.props.chartPaddingRight }}
          svg={{ fill: this.props.fillColor }}
          curve={shape.curveNatural}
        >
          <Line />
        </AreaChart>
      )
    }
    return (
      <View style={{ height: this.props.height, justifyContent: 'center', alignItems: 'center' }}>
        {/* <Text style={{ fontSize: 14, lineHeight: 18, fontFamily: Fonts.type.book, color: Colors.lightGray }}>No Data Available</Text> */}
        <Spinner isVisible size={30} type={'Circle'} color={Colors.lightGray} />
      </View>
    )
  }

  render () {
    const self = this
    const BottomElement = (props) => {
      const index = props.index
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => self.setCurrentElement(index)}
        >
          <View
            style={[{
              width: (width - 50) / 4 - 4,
              height: this.props.bottomBoxHeight - this.props.bottomBoxCellBottom - this.props.bottomBoxCellTop,
              marginBottom: this.props.bottomBoxCellBottom,
              marginLeft: 2,
              marginRight: 2,
              marginTop: this.props.bottomBoxCellTop,
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              shadowOffset: { x: 0, y: 3 },
              shadowOpacity: 0.16,
              shadowColor: Colors.black
            },
              self.state.currentIndex === index ? {borderBottomWidth: 2} : null
            ]}
          >
            <Text style={{ letterSpacing: 1, fontSize: 10, lineHeight: 10, fontFamily: Fonts.type.bold, opacity: self.state.currentIndex === index ? 1 : 0.70 }}>{props.year}</Text>
            <Text style={{ letterSpacing: 1, fontSize: 12, lineHeight: 15, fontFamily: Fonts.type.bold, opacity: self.state.currentIndex === index ? 1 : 0.70 }}>{props.progress}</Text>
          </View>
        </TouchableOpacity>
      )
    }

    return (
      <View style={[styles.container, {backgroundColor: this.props.backgroundColor}]}>
        <View style={{
          height: this.props.bottomBoxHeight,
          marginBottom: this.props.bottomBoxMarginBottom
        }}>
          <View style={{
            height: this.props.bottomBoxHeight,
            borderRadius: 8,
            backgroundColor: this.props.bottomBoxBackgroundColor,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            {
              this.props.bottomStrProgress[0] !== '--' &&
              <BottomElement
                index={0}
                progress={this.props.bottomStrProgress[0]}
                year={this.props.bottomStrYear[0]} />
            }
            {
              this.props.bottomStrProgress[1] !== '--' &&
              <BottomElement
                index={1}
                progress={this.props.bottomStrProgress[1]}
                year={this.props.bottomStrYear[1]}
              />
            }
            {
              this.props.bottomStrProgress[2] !== '--' &&
              <BottomElement
                index={2}
                progress={this.props.bottomStrProgress[2]}
                year={this.props.bottomStrYear[2]}
              />
            }
            {
              this.props.bottomStrProgress[3] !== '--' &&
              <BottomElement
                index={3}
                progress={this.props.bottomStrProgress[3]}
                year={this.props.bottomStrYear[3]}
              />
            }
          </View>
        </View>
        {this.renderChartArea()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  bottomCell: {

  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  }
})
