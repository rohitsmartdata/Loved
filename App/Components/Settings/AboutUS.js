/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 9/2/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Image, ActivityIndicator, WebView, Modal, TouchableOpacity }
  from 'react-native'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'
import {COMMON_ENTITIES, PLAID_ACTIONS}
  from '../../Utility/Mapper/Common'
import CustomNav
  from '../../Containers/Common/CustomNav'
import Fonts
  from '../../Themes/Fonts'
import {CURRENT_VERSION}
  from '../../Config/AppConfig'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class AboutUS extends Component {

  showWebWindow (url, title) {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_WEB_WINDOW, [SETTINGS_ENTITIES.URL]: url, [SETTINGS_ENTITIES.HEADING]: title, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  renderLinkButton (title, foo, showBottomBorder, showArrow, disabled) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={title}
        accessibilityRole={'button'}
        onPress={() => foo && foo()} disabled={disabled === undefined ? false : disabled} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 75, paddingVertical: 15, paddingHorizontal: 16, borderBottomWidth: showBottomBorder ? 1 : 0, borderColor: 'rgba(155, 155, 155, 0.3)'}}>
        <Text style={{color: '#10427E', opacity: disabled === undefined ? 1 : disabled ? 0.5 : 1, fontFamily: Fonts.type.regular, fontSize: 16}}>
          {title}
        </Text>
        {
          showArrow && <Image source={require('../../../Img/iconImages/rightArrow.png')} />
        }
      </TouchableOpacity>
    )
  }

  renderSimpleButton (title, foo, showBottomBorder, showArrow, disabled) {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 75, paddingVertical: 15, paddingHorizontal: 16, borderBottomWidth: showBottomBorder ? 1 : 0, borderColor: 'rgba(155, 155, 155, 0.3)'}}>
        <Text style={{color: '#000', opacity: disabled === undefined ? 1 : disabled ? 0.5 : 1, fontFamily: Fonts.type.regular, fontSize: 16}}>
          {title}
        </Text>
      </View>
    )
  }

  render () {
    const {navigator} = this.props
    const versionString = 'Version ' + CURRENT_VERSION
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} titlePresent leftButtonPresent rightButtonPresent={false} title='About Loved' />
        {this.renderLinkButton('Customer Agreement - Third Party Trade', () => this.showWebWindow('https://www.thirdparty.com/files/TPT_Customer_Agreement.pdf', 'CUSTOMER AGREEMENT - THIRD PARTY TRADE'), true, true, false)}
        {this.renderLinkButton('Customer Agreement - Apex Clearing', () => this.showWebWindow('https://www.thirdparty.com/files/Apex%20Clearing%20Corporation%20-%20Customer%20Account%20Agreement.pdf', 'CUSTOMER AGREEMENT - APEX CLEARING'), true, true, false)}
        {this.renderLinkButton('Privacy Policy', () => this.showWebWindow('http://www.loved.com/privacy_policy.html', 'PRIVACY POLICY'), true, true, false)}
        {this.renderSimpleButton(versionString, undefined, false, false, false)}
      </View>
    )
  }

}

AboutUS.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired
}

// ========================================================
// Export
// ========================================================

export default AboutUS
