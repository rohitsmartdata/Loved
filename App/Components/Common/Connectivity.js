/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 19/4/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Alert, LayoutAnimation, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, Image, ActivityIndicator, TouchableOpacity }
  from 'react-native'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class Connectivity extends Component {

  // --------------------------------------------------------
  // Lifecycle methods

  constructor (props) {
    super(props)
    this.state = {
      showInternetError: false
    }
  }

  // --------------------------------------------------------
  // Action handlers

  showInternetError () {
    LayoutAnimation.spring()
    this.setState({showInternetError: true})
  }
  hideInternetError () {
    LayoutAnimation.spring()
    this.setState({showInternetError: false})
  }

  // --------------------------------------------------------
  // Child Components

  renderConnectionError () {
    const {showInternetError} = this.state
    return (
      <View style={{backgroundColor: '#ff6666', height: showInternetError ? 40 : 0, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: '#FFF', fontFamily: 'Lato-Bold', fontSize: 16}}>
          No Internet Connection
        </Text>
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    return (
      <View>
        {this.renderConnectionError()}
      </View>
    )
  }

}

Connectivity.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // connected
  connected: PropTypes.bool.isRequired
}

// ========================================================
// Export
// ========================================================

export default Connectivity
