
// ========================================================
// Import Packages
// ========================================================

import React
  from 'react'
import { TouchableHighlight }
  from 'react-native'
import Colors from '../Themes/Colors'
// ========================================================
// Stylesheet
// ========================================================

// ========================================================
// Core Component
// ========================================================

const ShadowedContainer = ({children, style, onPress, size, noShadow, accessible, accessibilityLabel, accessibilityRole}) => {
  const containerSize = size || 70
  return (
    <TouchableHighlight
      style={{
        height: containerSize,
        width: containerSize,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Math.round(containerSize / 2),
        backgroundColor: Colors.white,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: noShadow ? 0 : 0.16,
        ...style
      }}
      onPress={() => onPress && onPress()}
      underlayColor={Colors.transparent}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
    >
      {children}
    </TouchableHighlight>
  )
}

export default ShadowedContainer
