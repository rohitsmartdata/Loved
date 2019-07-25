/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 31/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, {Component}
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, ActivityIndicator, Animated, TouchableWithoutFeedback}
  from 'react-native'
import styles
  from './Styles/SimpleButtonStyle'
import {Button}
  from 'react-native-elements'

// ========================================================
// Components
// ========================================================

class SimpleButton extends Component {

  render () {
    const {title, onPress, spread, extraStyle, themeColor} = this.props
    return (
      <Button title={title} onPress={onPress} color={themeColor || '#FFF'} buttonStyle={{...styles.buttonStyle, width: spread ? undefined : 156, borderColor: themeColor || styles.buttonStyle.borderColor, ...extraStyle}} />
    )
  }
}

// ========================================================
// Exports
// ========================================================

SimpleButton.propTypes = {
  // flex value of the container view, in case
  // you want to make the container view exactly
  // as per size of button view
  flexValue: PropTypes.number,

  // should the button spread all over the
  // container view or follow the standard with
  spread: PropTypes.bool,

  // extra styling you need to provide
  // for the button object
  extraStyle: PropTypes.object,

  // color for button
  themeColor: PropTypes.string
}

SimpleButton.defaultProps = {
  // by default, container view stretches out
  // making inner content in center
  flexValue: 1,

  // normally follow the standard with for button
  spread: false,

  extraStyle: {}
}

export default SimpleButton
