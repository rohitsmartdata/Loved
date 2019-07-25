/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 24/11/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, KeyboardAvoidingView, Keyboard, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import styles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import Communications from 'react-native-communications'

// ========================================================
// Core Component
// ========================================================

class AgeLimitationNotification extends Component {
  goBack () {
    const { handleLocalAction, localActions, navigator } = this.props
    handleLocalAction({ type: localActions.BACK, [COMMON_ENTITIES.NAVIGATOR]: navigator })
  }

  // --------------------------------------------------------
  // Inner components render
  renderHeading () {
    return (
      <View style={{ ...styles.screen.h1.containerStyle, marginTop: 54 }}>
        <Text style={{ ...styles.screen.h1.textStyle, fontSize: 30, color: '#4A4A4A' }}>Sorry</Text>
      </View>
    )
  }

  renderDescription () {
    return (
      <View style={{ ...styles.screen.containers.centeringContainer, marginTop: 60, marginBottom: 40, paddingLeft: 30, paddingRight: 30 }}>
        <Text style={{ fontFamily: Fonts.type.regular, fontSize: 16, color: '#9B9B9B', backgroundColor: 'transparent', textAlign: 'center' }}>
          Sorry, you must be over 18 years old to create a Loved Wealth account. Contact support service for any queries at
        </Text>

        <TouchableOpacity
          accessible
          accessibilityLabel={'return'}
          accessibilityRole={'button'}
          onPress={() => Communications.email(['support@loved.com'], null, null, 'Your topic here...', 'Your concern here...')}>
          <Text style={{ fontFamily: Fonts.type.regular, fontSize: 16, color: '#9B9B9B', backgroundColor: 'transparent', textAlign: 'center' }}>
            support@loved.com
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderBackButton () {
    const { handleSubmit } = this.props
    const isX = this.isX || false
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'return'}
        accessibilityRole={'button'}
        style={{ ...styles.bottomNavigator.containerStyle, height: 35 }} onPress={() => this.goBack()}>
        <Text style={styles.bottomNavigator.textStyle}>RETURN</Text>
      </TouchableOpacity>
    )
  }

  renderImage () {
    return (
      <View style={{ marginTop: 169, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../../../Img/intermediateScreen/userSorry.png')} style={{ width: 72, height: 91 }} />
      </View>
    )
  }

  // --------------------------------------------------------
  // Core component render

  render () {
    return (
      <View style={{ ...styles.screen.containers.root, backgroundColor: '#FFF' }}>
        <View style={{ flex: 0.9, paddingHorizontal: 40 }}>
          {this.renderImage()}
          {this.renderHeading()}
          {this.renderDescription()}
        </View>
        <View
          style={{
            flex: 0.1,
            marginHorizontal: 22
          }}
        >
          {this.renderBackButton()}
        </View>
      </View>
    )
  }
}

AgeLimitationNotification.propTypes = {
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

export default AgeLimitationNotification
