/* eslint-disable no-unused-vars,no-undef */
/**
 * Created by demon on 20/9/17.
 */

// ---------------------------------------------------------------
// Required packages
// ---------------------------------------------------------------

import React, {Component}
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Dimensions, Text, StyleSheet, requestAnimationFrame }
  from 'react-native'
import {Button} from 'react-native-elements'
import * as d3scale
  from 'd3-scale'
import * as d3shape
  from 'd3-shape'
import {Shape, Surface, Path, Group}
  from 'ReactNativeART'
import Morph
  from 'art/morph/path'
export const projectionType = {
  ONE_DAY: '1D',
  ONE_WEEK: '1W',
  ONE_MONTH: '1M',
  SIX_MONTH: '6M',
  ONE_YEAR: '1Y',
  ALL: 'ALL'
}

// ---------------------------------------------------------------
// Core Component
// ---------------------------------------------------------------
const viewBoxHeight = 150
const AnimationDurationMs = 300

class LWGraph extends Component {

  constructor (props) {
    super(props)
    this.state = {
      linePath: undefined,
      linePathEndpoint: undefined,
      investmentPath: undefined
    }
  }

  componentWillMount () {
    let {init, d, i} = this.props
    const marketDate = getDateRange(d[init])
    const investmentDate = getDateRange(i[init])
    const marketValue = getValueRange(d[init])
    const investmentValue = getValueRange(i[init])

    let linePath = this.createGraphData(d[init].slice(0, 1), init, {end_date: marketDate._maxDate, end_value: marketValue._maxValue})
    let investmentPath = this.createGraphData(i[init].slice(0, 1), init, {end_date: marketDate._maxDate, end_value: marketValue._maxValue})
    let linePathEnpoint = this.createEndpointPath(d[init].slice(0, 1), init, {end_date: marketDate._maxDate, end_value: marketValue._maxValue})
    this.setState({linePath: linePath, investmentPath: investmentPath})
    setTimeout(() => this.switchRange(init), 300)
  }

  animate (start) {
    this.animating = requestAnimationFrame((timestamp) => {
      if (!start) {
        // eslint-disable-next-line no-param-reassign
        start = timestamp
      }

      // Get the delta on how far long in our animation we are.
      const delta = (timestamp - start) / AnimationDurationMs

      // If we're above 1 then our animation should be complete.
      if (delta > 1) {
        this.animating = null
        // Just to be safe set our final value to the new graph path.
        this.setState({
          linePath: this.previousGraph,
          investmentPath: this.previousInvestment,
          linePathEndpoint: this.previousGraphEndpoint
        })

        // Stop our animation loop.
        return
      }

      // Tween the SVG path value according to what delta we're currently at.
      this.state.linePath.tween(delta)
      this.state.investmentPath.tween(delta)
      this.state.linePathEndpoint.tween(delta)

      // Update our state with the new tween value and then jump back into
      // this loop.
      this.setState(this.state, () => {
        this.animate(start)
      })
    })
  }

  switchRange (title) {
    let linePath = this.createGraphData(this.props.d[title], title)
    let investmentPath = this.createGraphData(this.props.i[title], title)
    let linePathEndpoint = this.createEndpointPath(this.props.d[title], title)
    let prevPath = this.state.linePath
    let prevInv = this.state.investmentPath
    let prevPathEndpoint = this.state.linePathEndpoint
    this.setState({linePath: Morph.Tween(prevPath, linePath), investmentPath: Morph.Tween(prevInv, investmentPath), linePathEndpoint: Morph.Tween(prevPathEndpoint, linePathEndpoint)})

    this.previousGraph = linePath
    this.previousInvestment = investmentPath
    this.previousGraphEndpoint = linePathEndpoint
  }

  render () {
    const {width} = Dimensions.get('window')
    const {linePath, investmentPath, linePathEndpoint} = this.state
    let colors = ['yellow', 'rgb(180, 222, 199)', 'black']
    return (
      <View style={styles.container}>
        <View>
          <Surface width={width} height={150} >
            <Group>
              <Shape
                d={linePath}
                stroke={colors[0]}
                strokeWidth={2}
              />
              <Shape
                d={investmentPath}
                stroke={colors[1]}
                strokeWidth={2}
                strokeCap='butt'
                strokeDash={[5, 10]}
                strokeJoin='miter'
              />
            </Group>
          </Surface>
          <LWGraphButtons n={6} titles={this.props.projection_range} foo={this.switchRange.bind(this)} init={projectionType.ALL} />
        </View>
      </View>
    )
  }

  createGraphData = (obj, title, draw) => {
    const {xScale, yScale} = this.createScale(obj, title, draw)

    // Create our line generator.
    const lineGenerator = d3shape.line()
      .x(function (d) {
        // console.log('x-d : ', d[0], '\n : ', x_scale(d[0]))
        return xScale(d[0])
      })
      .y(function (d) {
        // console.log('y-d : ', d[1], '\n : ', y_scale(d[1]))
        return yScale(d[1])
      })

    // Given the data create the d path value!
    let path = lineGenerator(obj)
    return path
  }

  createEndpointPath = (obj, title, draw) => {
    const {xScale, yScale} = this.createScale(obj, title, draw)
    let x = xScale(obj[obj.length - 1][0] - 1)
    let y = yScale(obj[obj.length - 1][1] + 1)
    let radius = 6
    const circle = Path()
      .move(x, y)
      .arc(0, radius * 2, radius)
      .arc(0, radius * -2, radius)
    return circle
  }

  createScale (obj, title, draw) {
    const {d, i} = this.props
    var dateRange = getDateRange(obj)

    let marketValue = getValueRange(d[title])
    let investmentValue = getValueRange(i[title])

    var maxDate = draw ? draw.end_date : dateRange._maxDate
    var minDate = dateRange._minDate
    var maxValue = Math.max(marketValue._maxValue, investmentValue._maxValue)
    var minValue = Math.min(marketValue._minValue, investmentValue._minValue)

    var timeDiff = Math.abs(maxDate.getTime() - minDate.getTime())
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    let increment = diffDays !== 0 ? diffDays / 3 : 1
    maxDate.setDate(maxDate.getDate() + increment)

    var valueDiff = Math.abs((maxValue - minValue) / 10)
    minValue -= valueDiff
    maxValue += valueDiff

    // Create a new linear scale instance, which we'll use as your y-scale.
    const yScale = d3scale.scaleLinear()
    // Set our domain, which is our input data, which is our test scores,
    // which can be between 0 and 100.
      .domain([minValue, maxValue])
      // Set our range, which is our output data, which is the height of our
      // screen, which is 640 pixels.
      .range([viewBoxHeight, 0])

    // Create our x-scale.
    const xScale = d3scale.scaleTime()
    // Our domain is now a week of time.
      .domain([minDate, maxDate])
      // That we're going to show on our screen which is also 640 pixels wide.
      .range([0, Dimensions.get('window').width])

    return {xScale, yScale}
  }

}

class LWGraphButtons extends Component {
  constructor (props) {
    super(props)
    this.state = {
      current: undefined
    }
  }

  componentWillMount (props) {
    this.setState({current: this.props.init})
  }

  setCurrentActive (title) {
    this.setState({current: title})
  }

  handleTouch (title) {
    const {foo} = this.props
    this.setCurrentActive(title)
    foo(title)
  }

  renderButton (titleValue) {
    return (
      <Button
        title={titleValue}
        key={titleValue}
        onPress={() => this.handleTouch(titleValue)}
        color={titleValue === this.state.current ? 'black' : '#FFF'}
        buttonStyle={{backgroundColor: titleValue === this.state.current ? '#FFF' : 'rgba(256, 256, 256, 0.2)', borderRadius: 5, width: 45, height: 30, marginLeft: 0, marginRight: 0, padding: 0}}
        textStyle={{fontSize: 12}}
        fontWeight='400'
    />)
  }

  render () {
    const {n, titles} = this.props
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, paddingLeft: 10, paddingRight: 10}}>
        {titles.map(title => this.renderButton(title))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30
  }
})

// ---------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------

const getDateRange = (obj) => {
  var dates = []
  obj.map(d => dates.push(d[0]))
  const _maxDate = new Date(Math.max.apply(null, dates))
  const _minDate = new Date(Math.min.apply(null, dates))
  return {_maxDate, _minDate}
}

const getValueRange = (obj) => {
  var values = []
  obj.map(d => values.push(d[1]))
  const _maxValue = Math.max(...values)
  const _minValue = Math.min(...values)
  return {_maxValue, _minValue}
}

LWGraphButtons.propTypes = {
  'n': PropTypes.number.isRequired,
  'titles': PropTypes.array.isRequired,
  'foo': PropTypes.func.isRequired,
  'init': PropTypes.string.isRequired
}

LWGraph.propTypes = {
  // number of elements to project
  n: PropTypes.number.isRequired,
  // data of elements
  d: PropTypes.object.isRequired,

  i: PropTypes.object.isRequired,
  // projection range
  projection_range: PropTypes.array.isRequired,

  init: PropTypes.string.isRequired
}

LWGraph.defaultProps = {
  // number of elements to project
  n: 0,
  // data of elements
  d: undefined
}

// ---------------------------------------------------------------
// Exports
// ---------------------------------------------------------------
export default LWGraph
