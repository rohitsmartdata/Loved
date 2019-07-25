/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 26/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, Image, ActivityIndicator }
  from 'react-native'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {COMMON_ENTITIES, BUTTON_TYPES}
  from '../../Utility/Mapper/Common'
import LinearGradient
  from 'react-native-linear-gradient'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class SkipConfirm extends Component {

  // --------------------------------------------------------
  // Action handlers

  continue () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.CONTINUE, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  back () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.BACK, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // --------------------------------------------------------
  // Child Components

  renderTextComponent () {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', paddingLeft: 45, paddingRight: 45, marginTop: 30, marginBottom: 70}}>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 16, color: '#9B9B9B', textAlign: 'center', backgroundColor: 'transparent'}}>
          Connecting your bank now means we can start growing your money sooner.
        </Text>
      </View>
    )
  }

  renderHeading () {
    return (
      <View style={{paddingLeft: 30, paddingRight: 30}}>
        <Text style={{textAlign: 'center', fontFamily: Fonts.type.regular, fontSize: 30, color: '#4A4A4A', backgroundColor: 'transparent'}}>
          Are you sure you {'\n'} want to skip?
        </Text>
      </View>
    )
  }

  renderDecisionButtons () {
    return (
      <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, flexDirection: 'row'}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          onPress={() => this.continue()}
          style={{flex: 5, height: 50, backgroundColor: '#F1F1F1', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#00CBCE', fontSize: 18, fontFamily: 'Lato-Bold', backgroundColor: 'transparent'}}>
            Continue
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'BACK'}
          accessibilityRole={'button'}
          onPress={() => this.back()}
          style={{flex: 5, height: 50, backgroundColor: '#F1F1F1'}}>
          <LinearGradient colors={['#00CBCE', '#6BEAC0']} start={{x: 0, y: 0}} end={{x: 3, y: 1}} locations={[0, 0.7]} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#FFF', fontSize: 18, fontFamily: 'Lato-Bold', backgroundColor: 'transparent'}}>
              BACK
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }

  renderImage () {
    return (
      <Image source={require('../../../Img/intermediateScreen/bankSkipConfirm.png')} style={{height: 200, width: 300, right: 10, bottom: 60}} />
    )
  }

  // --------------------------------------------------------
  // Core Render Component

  render () {
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <View style={{flex: 5, justifyContent: 'flex-end', alignItems: 'center'}}>
          {this.renderImage()}
        </View>
        <View style={{flex: 5, justifyContent: 'flex-start'}}>
          <View style={{flex: 0.8}}>
            {this.renderHeading()}
            {this.renderTextComponent()}
          </View>
          {this.renderDecisionButtons()}
        </View>
      </View>
    )
  }

}

SkipConfirm.propTypes = {
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

export default SkipConfirm
