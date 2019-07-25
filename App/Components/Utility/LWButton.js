/* eslint-disable no-unused-vars,no-trailing-spaces */

/**
 * Created by demon on 11/10/17.
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
import {Button}
  from 'react-native-elements'
import styles
  from '../../Themes/ApplicationStyles'
import {BUTTON_TYPES}
  from '../../Utility/Mapper/Common'

// ========================================================
// Components
// ========================================================

class LWButton extends Component {

  render () {
    const {title, onPress, extraStyle, buttonType, extraTextStyle} = this.props
    let bStyle = buttonType === BUTTON_TYPES.DECISION_BUTTON ? styles.screen.buttons.decisionButton.button : styles.screen.buttons.verticalGroup.button
    let tStyle = buttonType === BUTTON_TYPES.DECISION_BUTTON ? styles.screen.buttons.decisionButton.text : styles.screen.buttons.verticalGroup.text
    return (
      <Button
        title={title}
        onPress={onPress}
        textStyle={[tStyle, extraTextStyle]}
        buttonStyle={{...bStyle, ...extraStyle}}
      />
    )
  }
}

// ========================================================
// Exports
// ========================================================

LWButton.propTypes = {
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
  extraTextStyle: PropTypes.object,

  // type of button
  // DECISION_BUTTON
  // VERTICIAL_GROUP
  buttonType: PropTypes.string,

  // title for button
  title: PropTypes.string.isRequired,

  // on press function for button
  onPress: PropTypes.func.isRequired,

  iconName: PropTypes.string,
  iconSize: PropTypes.number
}

LWButton.defaultProps = {
  // by default, container view stretches out
  // making inner content in center
  flexValue: 1,

  // normally follow the standard with for button
  spread: false,

  // assume decisionButton if none provided
  buttonType: BUTTON_TYPES.DECISION_BUTTON,

  // title not provide
  title: 'no title',

  small: PropTypes.bool,

  // simple log function if no press function provided
  onPress: () => console.log('no title pressed'),

  extraStyle: {},

  iconName: 'undefined',
  iconSize: 1
}

export default LWButton
