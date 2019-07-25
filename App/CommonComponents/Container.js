import React from 'react'
import { View } from 'react-native'
import Colors from '../Themes/Colors'
import * as Constants from '../Themes/Constants'

const Container = ({style, children}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.white, ...style}}>
      <View style={{flex: Constants.isX ? 0.15 : 0.12}} />
      <View style={{flex: 1}}>
        {children}
      </View>
      <View style={{flex: 0.08}} />
    </View>
  )
}

export default Container
