/* eslint-disable no-unused-vars */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, WebView }
  from 'react-native'
import Colors
  from '../../Themes/Colors'
import Styles
  from '../../Themes/ApplicationStyles'
import CustomNav
  from '../../Containers/Common/CustomNav'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'

// ========================================================
// Core Component
// ========================================================

class FAQ extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isLoading: false
    }
  }

  render () {
    const { navigator } = this.props

    return (
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='FAQ' />
        <View style={{ flex: 1 }}>
          <ProcessingIndicator isProcessing={this.state.isLoading} />
          <WebView
            style={{flex: 1, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderBottomWidth: 2}}
            onLoadStart={() => this.setState({isLoading: true})}
            onLoadEnd={() => this.setState({isLoading: false})}
            canGoBack
            canGoForward
            source={{uri: 'http://help.loved.com'}}
          />
        </View>
      </View>
    )
  }

}

FAQ.propTypes = {
  // used for navigation, comes via react-navigation
  navigation: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func
}

// ========================================================
// Export
// ========================================================

export default FAQ

