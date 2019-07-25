import React, { Component } from 'react'
import { StyleSheet, Text, View, Animated } from 'react-native'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    overflow: 'hidden'
  },
  hide: {
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 0
  }
})

const range = length => Array.from({ length }, (x, i) => i)
const getPosition = ({ text, items, height }) => {
  const index = items.findIndex(p => p === text)
  return index * height * -1
}
const getBoosterDuration = (length, delta, value, index) => {
  return index < 2 ? value : value + (value * delta * (length - 1 - index))
}
const splitText = (text = '') => (text + '').split('')
const isNumber = (text = '') => !isNaN(parseInt(text, 10))
const numberRange = range(10).map(p => p + '')

const getAnimationStyle = animation => {
  return {
    transform: [
      {
        translateY: animation
      }
    ]
  }
}

const StaticElement = ({ children, style, height, textStyle }) => {
  return (
    <View style={style}>
      <Text style={[textStyle, { height }]}>{children}</Text>
    </View>
  )
}

class CustomCounter extends Component {
  // eslint-disable-next-line no-undef
  static propTypes = {
    text: PropTypes.string,
    textStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array])
  };
  // eslint-disable-next-line no-undef
  static defaultProps = {
    durationTime: 100,
    durationDelta: 1.2,
    isAutoDuration: true
  };
  // eslint-disable-next-line no-undef
  state = {
    measured: false,
    height: 0,
    fontSize: StyleSheet.flatten(this.props.textStyle).fontSize
  };

  componentWillReceiveProps (nextProps) {
    this.setState({
      fontSize: StyleSheet.flatten(nextProps.textStyle).fontSize
    })
  }
  // eslint-disable-next-line no-undef
  handleMeasure = e => {
    const height = e.nativeEvent.layout.height
    this.setState(state => {
      if (state.measured) {
        return null
      }
      return {
        measured: true,
        height
      }
    })
  };

  render () {
    const { text, children, textStyle, style, durationTime, durationDelta, isAutoDuration } = this.props
    const { height, measured } = this.state
    const opacity = measured ? 1 : 0

    const childs = text || children

    return (
      <View style={[styles.row, { height, opacity }, style]}>
        {generalRenderer({
          children: childs,
          textStyle,
          height,
          durationTime,
          durationDelta,
          isAutoDuration,
          rotateItems: numberRange
        })}
        <Text style={[textStyle, styles.hide]} onLayout={this.handleMeasure} pointerEvents='none'>
          0
        </Text>
      </View>
    )
  }
}

const generalRenderer = ({ children, textStyle, height, durationTime, durationDelta, isAutoDuration, rotateItems }) => {
  return splitText(children).map((piece, i) => {
    let duration = durationTime
    if (isAutoDuration) duration = getBoosterDuration(children.length, durationDelta, durationTime, i)
    if (!isNumber(piece)) {
      return (
        <StaticElement key={i} style={{ height }} textStyle={textStyle}>
          {piece}
        </StaticElement>
      )
    }
    return (
      <AnimationElement
        duration={duration}
        key={i}
        text={piece}
        textStyle={textStyle}
        height={height}
        rotateItems={rotateItems}
      />
    )
  })
}

class AnimationElement extends Component {
  // eslint-disable-next-line no-undef
  state = {
    animation: new Animated.Value(
      getPosition({
        text: this.props.text,
        items: this.props.rotateItems,
        height: this.props.height
      }),
    )
  };
  componentDidMount () {
    // If we first render then don't do a mounting animation
    if (this.props.height !== 0) {
      this.setState({
        animation: new Animated.Value(
          getPosition({
            text: this.props.text,
            items: this.props.rotateItems,
            height: this.props.height
          }),
        )
      })
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.height !== this.props.height) {
      this.setState({
        animation: new Animated.Value(
          getPosition({
            text: nextProps.text,
            items: nextProps.rotateItems,
            height: nextProps.height
          }),
        )
      })
    }
  }
  componentDidUpdate (prevProps) {
    const { height, duration, rotateItems, text } = this.props

    if (prevProps.text !== text) {
      Animated.timing(this.state.animation, {
        toValue: getPosition({
          text: text,
          items: rotateItems,
          height
        }),
        duration,
        useNativeDriver: true
      }).start()
    }
  }

  render () {
    const { animation } = this.state
    const { textStyle, height, rotateItems } = this.props

    return (
      <View style={{ height }}>
        <Animated.View style={getAnimationStyle(animation)}>
          {rotateItems.map(v => (
            <Text key={v} style={[textStyle, { height }]}>
              {v}
            </Text>
          ))}
        </Animated.View>
      </View>
    )
  }
}

export { AnimationElement, numberRange }
export default CustomCounter
