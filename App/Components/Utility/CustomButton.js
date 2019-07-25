/* eslint-disable no-unused-vars,no-trailing-spaces,key-spacing,no-multi-spaces */
/**
 * Created by viktor on 21/6/17.
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
  from './Styles/CustomButtonStyle'
import {Button}
  from 'react-native-elements'
import colors from '../../Themes/Colors'
import fonts from '../../Themes/Fonts'

// ========================================================
// Components
// ========================================================

class CustomButton extends Component {

  renderButton (title, foo) {
    var {customHeight, customWidth, customRadius, topMargin, bottomMargin, rightMargin, isLoading, leftMargin, backgroundColor, color, isIcon} = this.props
    customHeight  || (customHeight = styles.buttonStyle.height)
    customWidth   || (customWidth = styles.buttonStyle.width)
    customRadius  || (customRadius = styles.buttonStyle.borderRadius)
    rightMargin   || (rightMargin = 0)
    leftMargin    || (leftMargin = 0)
    topMargin     || (topMargin = 0)
    bottomMargin  || (bottomMargin = 0)
    backgroundColor || (backgroundColor = styles.buttonStyle.backgroundColor)
    color || (color = styles.buttonTitleStyle.color)
    return (
      <Button
        buttonStyle={{...styles.buttonStyle, height: customHeight, width: customWidth, borderRadius: customRadius, marginRight: rightMargin, marginLeft: leftMargin, marginTop: topMargin, marginBottom: bottomMargin, backgroundColor: backgroundColor}}
        onPress={foo}
        title={title}
        loading={isLoading}
        textStyle={{color: color, fontSize: 14, fontFamily: 'helvetica'}}
      />
    )
  }

  render () {
    const {onClick, title, alignment, isLoading} = this.props
    return (
      <View style={{...styles.container, alignItems: alignment || styles.stretchContainer.alignItems}}>
        {this.renderButton(title, onClick)}
      </View>
    )
  }

}

CustomButton.propTypes = {
  // title to display over button
  title : PropTypes.string.isRequired,

  // function to call when button pressed
  onClick   : PropTypes.func.isRequired,

  customHeight: PropTypes.number,
  customWidth: PropTypes.number,
  customRadius: PropTypes.number,
  alignment : PropTypes.string,
  customBorderWidth: PropTypes.number,
  isAnimatable: PropTypes.bool,
  backgroundColor: PropTypes.string,
  color: PropTypes.string
}

// ========================================================
// Exports
// ========================================================

export default CustomButton
