
// ========================================================
// Import Packages
// ========================================================

import React
  from 'react'
import { Text, TouchableOpacity }
  from 'react-native'
import Colors from '../Themes/Colors'
import ApplicationStyles from '../Themes/ApplicationStyles'
// ========================================================
// Stylesheet
// ========================================================

const styles = {
  container: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.blue,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    paddingVertical: 20,
    marginBottom: 20
  },
  text: {
    ...ApplicationStyles.text.title,
    color: Colors.blue,
    textAlign: 'left'
  }
}

// ========================================================
// Core Component
// ========================================================

const Options = ({style, onPress, buttonText, buttonTextStyle, underlayColor}) => {
  return (
    <TouchableOpacity
      style={{...styles.container, ...style}}
      onPress={() => onPress && onPress()}
      activeOpacity={1}>
      <Text style={{...styles.text, ...buttonTextStyle}}>{buttonText}</Text>
    </TouchableOpacity>
  )
}

export default Options
