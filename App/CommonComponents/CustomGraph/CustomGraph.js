/* eslint-disable no-trailing-spaces,space-before-function-paren,jsx-equals-spacing,operator-linebreak,no-unused-vars,no-undef,semi,comma-dangle, indent */
/**
 * Sample React Native CustomGraph
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'

import { View, StyleSheet, Dimensions } from 'react-native'

import {
  Defs,
  LinearGradient,
  Stop,
  G,
  Line,
} from 'react-native-svg'

import { AreaChart } from 'react-native-svg-charts'

import * as shape from 'd3-shape'

import { createResponder } from 'react-native-gesture-responder'

import MetricsPath from 'art/metrics/path'

import Switcher from './range/switcher'

const LinearGradientA = require('react-native-linear-gradient').default

const { width } = Dimensions.get('window')

import _ from 'lodash'
import Colors from '../../Themes/Colors'

export default class CustomGraph extends Component {

  props: {
    readonly: boolean,
    width: number,
    height: number,
    itemIndex: number,
    backgroundDivdePros: number,
    chartPaddingTop: number,
    chartPaddingRight: number,
    chartPaddingLeft: number,
    chartPaddingBottom: number,
    data: Array<number>,
    fillColorA: string,
    fillColorB: string,
    sphereWidth: number,
    sphereBorderWidth: number,
    sphereBorderColor: string,
    sphereBorderRadius: number,
    sphereBackGroundColor: string,
    lineWidth: number,
    lineHeight: number,
    lineStartColor: string,
    lineEndColor: string,
    onMoving: func,
    onChange: func,
    onReady: func,
    ageTitles: Array<string>,
    ageIndexs: Array<number>,
    segmentCount: number,
    childCurrentAge: number,
    chartColor: string
  };

  static defaultProps = {
    readonly: false,
    width: width,
    height: 200,
    itemIndex: 4,
    backgroundDivdePros: 8,
    chartPaddingTop: 80,
    chartPaddingRight: 10,
    chartPaddingLeft: 10,
    chartPaddingBottom: 0,
    data: [0, 20, 18, 32, 24, 36, 18, 36, 48, 50, 40, 30, 20, 10, 20, 40, 50, 70, 80, 60, 50, 40, 0],
    fillColorA: 'rgb(248, 248, 248)',
    fillColorB: 'rgb(216, 234, 239)',
    sphereWidth: 40,
    sphereBorderWidth: 20,
    sphereBorderColor: 'rgba(255, 255, 0, 0.3)',
    sphereBorderRadius: 50,
    sphereBackGroundColor: 'rgba(255, 255, 0, 0.8)',
    lineWidth: 2,
    lineHeight: 200 * 0.8,
    lineStartColor: 'rgba(255,255,255,0.0)',
    lineEndColor: 'rgba(253, 182, 20, 1)',
    onChange: null,
    onReady: null,
    onMoving: null,
    ageTitles: ['age 0', 'age 4', 'age 8', 'age 12', 'age 16', 'age 20'],
    ageIndexs: [0, 4, 8, 12, 16, 20],
    segmentCount: 1000,
    childCurrentAge: 0
  }

  constructor(props) {
    super(props);
    this.state = {
      xAxisProgress: 0,
      chartLineData: '',
      chartXAxisData: '',
      RangeBtnWidth: [],
      currentRange: this.props.itemIndex % 4 === 0 ? parseInt(this.props.itemIndex / 4) : -1,
    };

    this.verLine = [];
    this.backgroundDivdePros = 0;

    this.data = [];
    this.data.push(0);
    this.props.data.forEach((value) => {
      this.data.push(value);
    });
    let finalVal = this.props.data[this.props.data.length - 1] + this.props.data[this.props.data.length - 1] - this.props.data[this.props.data.length - 2];
    this.data.push(finalVal);

    this.inputRange = null;
    this.outputRangeX = null;
    this.outputRangeY = null;
  }

  getSelectPros (index) {
    const xAxisValue = this.state.chartXAxisData[index + 1] - 20
    for (let i = 0; i < this.props.segmentCount; i++) {
      if (parseInt(this.outputRangeX[i]) >= xAxisValue) {
        return i
      }
    }
    return 0
  }

  selectRange (currentRange, layout) {
    let index = currentRange * 4;
    let xAxisProgress = this.getSelectPros(index)
    this.setState({currentRange, xAxisProgress});
    let value = 0
    if (this.outputRangeY != null) {
      value = this.data[currentRange * 4 + 1];
      this.props.onChange(index, value);
    }
  }

  getRangeBtnWidth (width, index) {
    const RangeBtnWidth = this.state.RangeBtnWidth
    RangeBtnWidth[index] = width
    this.setState({RangeBtnWidth})
  }

  componentWillMount () {
    this.gestureResponder = createResponder({
      onStartShouldSetResponder: (evt, gestureState) => true,
      onStartShouldSetResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetResponder: (evt, gestureState) => true,
      onMoveShouldSetResponderCapture: (evt, gestureState) => true,

      onResponderGrant: (evt, gestureState) => {
        this.setState({
          gestureState: {
            ...gestureState
          }
        })
        this.props.onMoving(false);
      },
      onResponderMove: (evt, gestureState) => {
        if (this.props.readonly) {
          return
        }
        let xAxisProgress = this.state.xAxisProgress
        xAxisProgress += parseInt(((gestureState.moveX - gestureState.previousMoveX) * this.props.segmentCount) / (this.props.width))
        const startxAxis = this.getSelectPros(0)
        const endxAxis = this.getSelectPros(20)
        if (xAxisProgress < startxAxis) {
          xAxisProgress = startxAxis
        }
        if (xAxisProgress > endxAxis) {
          xAxisProgress = endxAxis
        }
        if (this.outputRangeY != null) {
          let index = parseInt(xAxisProgress * this.data.length / this.props.segmentCount - 0.5)
          if (index <= 0) index = 0
          if (index >= 20) index = 20
          let currentRange = this.state.RangeBtnWidth.findIndex((btn, index) => {
            const axisPosition = this.getSelectPros(index * 4);
            return Math.abs(axisPosition - xAxisProgress) < 10
          });
          if (currentRange) {
            this.setState({ currentRange, xAxisProgress })
          } else {
            this.setState({ currentRange: -1, xAxisProgress })
          }
          if (this.outputRangeY != null) {
            const value = this.data[index + 1]
            this.props.onChange(index, value)
          }
        }
      },
      onResponderTerminationRequest: (evt, gestureState) => true,
      onResponderRelease: (evt, gestureState) => {
        this.props.onMoving(true);
        // const xAxisProgress = this.getSelectPros(this.props.itemIndex);
        this.setState({
          gestureState: {
            ...gestureState
          }
        })
        let xAxisProgress = this.getSelectPros(this.props.childCurrentAge)
        if (this.outputRangeY != null) {
          let index = this.props.childCurrentAge
          if (index <= 0) index = 0
          if (index >= 20) index = 20
          let currentRange = -1
          if (index % 4 === 0) {
            currentRange = index / 4
          }
          this.setState({ currentRange, xAxisProgress })
          if (this.outputRangeY != null) {
            const value = this.data[index + 1]
            this.props.onChange(index, value)
          }
        }
      },
      onResponderTerminate: (evt, gestureState) => {
      },
      onResponderSingleTapConfirmed: (evt, gestureState) => {
      },
      debug: false,
    });
  }

  componentWillReceiveProps (nextProp) {
    if (!_.isEqual(nextProp.data, this.data)) {
      this.data = [];
      this.data.push(0);
      nextProp.data.forEach((value) => {
        this.data.push(value);
      });
      let finalVal = nextProp.data[nextProp.data.length - 1] + nextProp.data[nextProp.data.length - 1] - nextProp.data[nextProp.data.length - 2];
      this.data.push(finalVal);
    }
  }
  render() {
    if (this.state.chartLineData !== '' && this.outputRangeY == null) {
      const pathMetrics = new MetricsPath(this.state.chartLineData);
      const segmentLength = pathMetrics.length / this.props.segmentCount;
      const pointCount = this.props.segmentCount + 1;
      this.inputRange = new Array(pointCount);
      this.outputRangeX = new Array(pointCount);
      this.outputRangeY = new Array(pointCount);
      for (let i = 0; i < pointCount; i++) {
        const offset = i * segmentLength;
        const { x, y } = pathMetrics.point(offset);
        this.inputRange[i] = i;
        this.outputRangeX[i] = offset - this.props.sphereWidth / 2;
        this.outputRangeY[i] = this.props.height - y - this.props.sphereWidth / 2;
      }
      for (let index = 0; index < this.data.length - 2; index++) {
        const xAxisProgress = this.getSelectPros(index);
        this.verLine.push(this.outputRangeX[xAxisProgress]);
      }
      const xAxisProgress = this.getSelectPros(this.props.itemIndex);
      this.setState({xAxisProgress});
    }

    if (this.verLine.length > 0) {
      this.backgroundDivdePros = (this.verLine[this.props.backgroundDivdePros] + this.state.RangeBtnWidth[parseInt(this.props.backgroundDivdePros / 4)] / 2) / this.props.width * 100;
    }

    const PathData = ({ x, y, ...props }) => {
      const chartLineData = props.line;
      const chartXAxisData = [];
      props.data.map((_, index) => (
        chartXAxisData.push(x(index))
      ));
      this.setState({ chartLineData, chartXAxisData });
      return null
    };

    // const CustomGrid = ({ x, y, data, ticks }) => (
    //   <G>
    //     {
    //       // Vertical grid
    //       data.map((_, index) => (
    //         <Line
    //           key={index}
    //           y1={'0%'}
    //           y2={'100%' }
    //           x1={x(index)}
    //           x2={x(index)}
    //           stroke={ 'rgba(0,0,0,0.2)' }
    //         />
    //       ))
    //     }
    //   </G>
    // );

    return (
      <View style={styles.container}>
        <View {...this.gestureResponder} style={{ backgroundColor: Colors.blue, marginBottom: 28, width: this.props.width, height: this.props.height, borderTopWidth: 0 }}>
          <AreaChart
            style={{height: this.props.height, backgroundColor: this.props.chartColor}}
            data={this.data}
            contentInset={{ top: this.props.chartPaddingTop, bottom: this.props.chartPaddingBottom, left: this.props.chartPaddingLeft, right: this.props.chartPaddingRight }}
            svg={{ fill: 'url(#gradient)' }}
            curve={shape.curveNatural}
          >
            {/* <CustomGrid /> */}
            <Defs>
              <LinearGradient id={'gradient'} x1={'0%'} y={'0%'} x2={'100%'} y2={'0%'}>
                <Stop offset={'0%'} stopColor={this.props.fillColorA} stopOpacity={1} />
                <Stop offset={`${this.backgroundDivdePros}%`} stopColor={this.props.fillColorA} stopOpacity={1} />
                <Stop offset={`${this.backgroundDivdePros + 0.01}%`} stopColor={this.props.fillColorB} stopOpacity={1} />
              </LinearGradient>
            </Defs>
            {
              this.state.chartLineData === '' ?
                <PathData /> : null
            }

          </AreaChart>

          {
            this.props.readonly && this.outputRangeY != null ?
              null :
              <LinearGradientA
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={[this.props.lineStartColor, this.props.lineEndColor]}
                style={[
                  { width: this.props.lineWidth,
                    height: this.props.lineHeight - 30,
                    position: 'absolute' },
                  {
                    left: this.outputRangeX == null
                      ?
                      0
                      :
                      (this.outputRangeX[this.state.xAxisProgress] + (this.props.sphereWidth / 2))
                      - (this.props.lineWidth / 2),
                  }]} />
          }

          <View
            style={[
              { width: this.props.sphereWidth,
                height: this.props.sphereWidth,
                borderRadius: this.props.sphereBorderRadius,
                backgroundColor: this.props.sphereBorderColor,
                position: 'absolute',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center' },
              {
                left: this.outputRangeX == null ? 0 : this.outputRangeX[this.state.xAxisProgress],
                bottom: this.outputRangeY == null ? 0
                  : this.outputRangeY[this.state.xAxisProgress] }]}
            {...this.gestureResponder} >
            <View style={
              [
                {
                  borderRadius: 50,
                  backgroundColor: this.props.sphereBackGroundColor,
                  width: this.props.sphereWidth - this.props.sphereBorderWidth,
                  height: this.props.sphereWidth - this.props.sphereBorderWidth,
                },
              ]
            } />
          </View>
        </View>
        <View style={{position: 'absolute', bottom: 0}}>
          <Switcher
            width={this.props.width}
            verLine={this.verLine}
            lineWidth={this.props.lineWidth}
            ageIndexs={this.props.ageIndexs}
            ranges={this.props.ageTitles}
            current={this.state.currentRange}
            onSelectRange={this.selectRange.bind(this)}
            getRangeBtnWidth={this.getRangeBtnWidth.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.buttonYellow
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
});
