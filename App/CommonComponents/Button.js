
// ========================================================
// Import Packages
// ========================================================

import React
  from 'react'
import { Text, TouchableHighlight }
  from 'react-native'
import Colors from '../Themes/Colors'
// ========================================================
// Stylesheet
// ========================================================

const styles = {
  container: {
    borderRadius: 22,
    height: 44,
    backgroundColor: Colors.appColor,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B4B4B4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3
  },
  text: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: 'bold',
    color: Colors.white
  }
}

// ========================================================
// Core Component
// ========================================================

const Button = ({style, onPress, buttonText, buttonTextStyle}) => {
  return (
    <TouchableHighlight
      style={{...styles.container, ...style}}
      onPress={() => onPress && onPress()}
      underlayColor={Colors.transparent}>
      <Text style={{...styles.text, ...buttonTextStyle}}>{buttonText}</Text>
    </TouchableHighlight>
  )
}

export default Button
