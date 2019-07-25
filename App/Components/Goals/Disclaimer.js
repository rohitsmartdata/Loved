/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 12/6/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, WebView, Text, Alert, Image, LayoutAnimation, TouchableOpacity, Dimensions }
  from 'react-native'
import Fonts
  from '../../Themes/Fonts'
import {Icon}
  from 'react-native-elements'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'

// ========================================================
// Core Component
// ========================================================

class Disclaimer extends Component {

  constructor (props) {
    super(props)
    const {height, width} = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }
  // ---------------------------------------------------------------
  // Action Handlers

  pop () {
    const {handleLocalAction, localActions, navigator, hideDisclaimer} = this.props
    if (navigator) {
      handleLocalAction({type: localActions.POP_SCREEN, [COMMON_ENTITIES.NAVIGATOR]: navigator})
    } else {
      hideDisclaimer && hideDisclaimer()
    }
  }

  // ---------------------------------------------------------------
  // Top Containers

  renderHeader () {
    const isX = this.isX || false
    return (
      <View style={{backgroundColor: 'transparent', paddingTop: isX ? 30 : 22, height: isX ? 100 : 70, flexDirection: 'row'}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Clear'}
          accessibilityRole={'button'}
          onPress={() => this.pop()} style={{width: 70, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name='clear' color='#000' size={28} />
        </TouchableOpacity>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontFamily: Fonts.type.medium, fontSize: 17, color: '#000'}}>
            Disclaimer
          </Text>
        </View>
        <View style={{width: 70, justifyContent: 'center', alignItems: 'center'}} />
      </View>
    )
  }

  renderBody () {
    return (
      <View style={{paddingHorizontal: 16}}>
        <Text style={{fontSize: 15, fontFamily: Fonts.type.regular, textAlign: 'justify'}}>
          Investments always hold inherent risk and past investment performance does not guarantee future performance. Understand any historical and expected returns, and projections, are hypothetical and may not reflect actual performance.
        </Text>
      </View>
    )
  }

  // ---------------------------------------------------------------
  // Core render method

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        {this.renderHeader()}
        {this.renderBody()}
      </View>
    )
  }

}

Disclaimer.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // navigator object
  navigator: PropTypes.object.isRequired
}

Disclaimer.defaultProps = {

}

// ========================================================
// Export
// ========================================================

export default Disclaimer
