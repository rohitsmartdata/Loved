
// ========================================================
// Import Packages
// ========================================================

import React
  from 'react'
import { LayoutAnimation, Text, TouchableHighlight, View }
  from 'react-native'
import Colors from '../Themes/Colors'
import Fonts from '../Themes/Fonts'
import ApplicationStyles from '../Themes/ApplicationStyles'
import * as Constants from '../Themes/Constants'
// ========================================================
// Stylesheet
// ========================================================

const styles = {
  container: {
    height: 46,
    borderRadius: 23,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: Colors.lightGrayBG
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    ...ApplicationStyles.text.title,
    fontFamily: Fonts.type.book,
    color: Colors.blue
  }
}

// ========================================================
// Core Component
// ========================================================

const ButtonGroup = ({data, selectedIndex, onPress, style}) => {
  let buttonWidth = (Constants.screen.width - 40) / data.length

  return (
    <View style={{ ...styles.container, ...style }}>
      {
        data.map((item, index) => {
          return (
            <TouchableHighlight
              style={{ ...styles.textContainer }}
              onPress={() => {
                onPress && onPress(index)
                LayoutAnimation.configureNext({
                  duration: 250,
                  create: {
                    type: 'linear',
                    property: 'opacity'
                  },
                  update: {
                    type: 'linear',
                    property: 'opacity'
                  },
                  delete: {
                    type: 'linear',
                    property: 'opacity'
                  }
                })
              }}
              underlayColor={Colors.transparent}>
              <Text style={{ ...styles.text }}>
                {(selectedIndex === index) ? '' : item}
              </Text>
            </TouchableHighlight>
          )
        })
      }
      <View
        style={{ position: 'absolute', left: buttonWidth * selectedIndex + 3, top: 3, bottom: 3, width: buttonWidth - 6, borderRadius: 100, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', shadowOffset: { x: 0, y: 3 }, shadowOpacity: 0.16, shadowColor: Colors.black }}
        onPress={() => this.showConfirmations()}
        underlayColor={Colors.transparent}>
        <Text style={{ ...styles.text }}>{data[selectedIndex]}</Text>
      </View>
    </View>
  )
}

export default ButtonGroup
