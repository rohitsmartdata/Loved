/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 2/5/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Alert, Image, LayoutAnimation, TouchableOpacity, Dimensions }
  from 'react-native'
import Fonts
  from '../../Themes/Fonts'
import LinearGradient
  from 'react-native-linear-gradient'
import {DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'

// ========================================================
// Core Component
// ========================================================

class Toast extends Component {

  constructor (props) {
    super(props)
    const {height, width} = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
    this.state = {
      top: isIPhoneX ? -80 : -50
    }
  }

  componentWillMount () {
    const {toast} = this.props
    if (toast) {
      this.toast()
    }
  }

  // ---------------------------------------------------------------
  // Action Handlers

  toast () {
    const isX = this.isX || false
    setTimeout(() => {
      LayoutAnimation.linear()
      this.setState({
        top: 0
      })
    }, 1000)
    setTimeout(() => {
      LayoutAnimation.linear()
      this.setState({
        top: isX ? -80 : -50
      })
    }, 4000)
  }

  // ---------------------------------------------------------------
  // Top Containers

  renderComponent () {
    const {heading, subheading, shouldFloat} = this.props
    const isX = this.isX || false
    if (!heading) {
      return null
    }
    return (
      <LinearGradient
        colors={['rgb(244, 171, 24)', 'rgb(250, 229, 169)']}
        style={{position: shouldFloat ? 'absolute' : 'relative', top: this.state.top, left: 0, right: 0, height: isX ? 80 : 50, backgroundColor: '#FFFD00', borderColor: 'black', borderBottomWidth: 0, justifyContent: 'flex-end', paddingBottom: 5, shadowOpacity: 0.7, shadowOffset: {width: 1, height: 1}, shadowRadius: 10}}>
        <Text style={{textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 20, backgroundColor: 'transparent'}}>
          {heading}
        </Text>
        <Text style={{textAlign: 'center', fontFamily: Fonts.type.regular, fontSize: 14, backgroundColor: 'transparent'}}>
          {subheading}
        </Text>
      </LinearGradient>
    )
  }

  // ---------------------------------------------------------------
  // Core render method

  render () {
    const isX = this.isX || false
    const { backgroundColor } = this.props
    return (
      <View style={{zIndex: 400}}>
        {this.renderComponent()}
      </View>
    )
  }

}

Toast.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // navigator object
  navigator: PropTypes.object.isRequired,

  // should toast now ?
  toast: PropTypes.object,

  // should float at space or occupy it
  shouldFloat: PropTypes.bool,

  // heading of toast
  heading: PropTypes.string,

  // subheading of toast
  subheading: PropTypes.string
}

Toast.defaultProps = {
  toast: false,
  shouldFloat: true
}

// ========================================================
// Export
// ========================================================

export default Toast
