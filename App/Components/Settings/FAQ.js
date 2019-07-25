/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 23/11/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, ActivityIndicator, WebView, Modal, TouchableOpacity }
  from 'react-native'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class FAQ extends Component {

  constructor (props) {
    super(props)
    this.state = {
      modalVisible: true
    }
  }

  dismissModal () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.POP_SCREEN, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  renderWebview () {
    return (
      <View style={{flex: 1, borderBottomRightRadius: 10, borderBottomLeftRadius: 10}} />
    )
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: 'rgb(91, 185, 115)'}}>
        <Modal
          animationType='slide'
          transparent
          visible={this.state.modalVisible}
        >
          <TouchableOpacity
            accessible
            accessibilityLabel={'Close'}
            accessibilityRole={'button'}
            onPress={() => this.dismissModal()} style={{height: 50, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 18, color: '#000'}}>
              Close
            </Text>
          </TouchableOpacity>
          <WebView
            style={{flex: 1, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderBottomWidth: 2}}
            onError={err => console.log('error: ', err)}
            onLoad={() => console.log('---- loaded ----')}
            canGoBack
            canGoForward
            source={{uri: `https://lovedwealth.freshdesk.com/support/home`}}
          />
        </Modal>
      </View>
    )
  }

}

FAQ.propTypes = {
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

export default FAQ
