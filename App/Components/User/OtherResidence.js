/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 25/10/17.
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

// ========================================================
// Core Component
// ========================================================

class OtherResidence extends Component {
  // --------------------------------------------------------
  // Inner components render
  goBack () {
    const { handleLocalAction, localActions, navigator } = this.props
    handleLocalAction({ type: localActions.BACK, [COMMON_ENTITIES.NAVIGATOR]: navigator })
  }

  renderHeading () {
    return (
      <View style={{ ...styles.screen.h1.containerStyle, marginTop: 54 }}>
        <Text style={{ ...styles.screen.h1.textStyle, fontSize: 30, color: '#4A4A4A' }}>Sorry</Text>
      </View>
    )
  }
  renderImage () {
    return (
      <View style={{ marginTop: 169, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../../../Img/intermediateScreen/userSorry.png')} style={{ width: 72, height: 91 }} />
      </View>
    )
  }
  renderBackButton () {
    const { handleSubmit } = this.props
    const isX = this.isX || false
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Return'}
        accessibilityRole={'button'}
        style={{ ...styles.bottomNavigator.containerStyle, height: 35 }}
        onPress={() => this.goBack()}>
        <Text style={styles.bottomNavigator.textStyle}>RETURN</Text>
      </TouchableOpacity>
    )
  }
  renderDescription () {
    return (
      <View style={{ ...styles.screen.containers.centeringContainer, marginBottom: 40, paddingLeft: 30, paddingRight: 30 }}>
        <Text style={{ fontFamily: Fonts.type.regular, fontSize: 16, color: '#9B9B9B', backgroundColor: 'transparent', textAlign: 'center' }}>
          Sorry, you must be a US citizen or Green card holder to create a Loved account.
        </Text>
        <Text
          style={{
            fontFamily: Fonts.type.regular,
            marginTop: 20,
            fontSize: 16,
            color: '#9B9B9B',
            backgroundColor: 'transparent',
            textAlign: 'center'
          }}
        >
          Contact support service for any queries at support@lovedwealth.com
        </Text>
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

OtherResidence.propTypes = {
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

export default OtherResidence
