/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 27/10/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, {Component}
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, ActivityIndicator, Animated, TouchableWithoutFeedback, LayoutAnimation}
  from 'react-native'
var Spinner = require('react-native-spinkit')
// import LottieLoader from 'react-native-lottie-loader'

// ========================================================
// Components
// ========================================================

class ProcessingIndicator extends Component {

  // -------------------------------------------------------
  // Core render method

  render () {
    const {isProcessing, yellowBackground} = this.props
    let processingColor = yellowBackground ? '#FFF' : 'rgb(253, 198, 23)'
    // <LottieLoader visible source={require('../../../assets/animationFiles/anim_1.json')} animationStyle={{height: 80, width: 80}} />
    if (isProcessing) {
      return (
        <View style={{...styles.container, backgroundColor: 'rgba(0, 0, 0, 0.6)'}} >
          <Spinner isVisible size={100} type={'ThreeBounce'} color={processingColor} />
        </View>
      )
    } else {
      return null
    }
  }
}

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  dot: {
    height: 20,
    width: 20,
    backgroundColor: '#FFF',
    borderRadius: 30,
    marginLeft: 10,
    marginRight: 10
  },
  active: 'rgba(255, 255, 255, 1)',
  inactive: 'rgba(255, 255, 255, 0.4)'
}

// ========================================================
// Exports
// ========================================================

ProcessingIndicator.propTypes = {
  // flag to decide whether to show
  // the processing indicator
  isProcessing: PropTypes.bool.isRequired,
  // yellow background
  yellowBackground: PropTypes.bool
}

ProcessingIndicator.defaultProps = {
  isProcessing: false,
  yellowBackground: false
}

export default ProcessingIndicator
