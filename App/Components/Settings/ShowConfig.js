/* eslint-disable no-unused-vars */
/**
 * Created by demon on 13/12/17.
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
import {client, transferClient, tptClient, fundingClient, detailClient, AuthCredentials} from '../../Config/AppConfig'

// ========================================================
// Core Component
// ========================================================

class ShowConfig extends Component {

  render () {
    return (
      <View style={{flex: 1, backgroundColor: 'rgb(91, 185, 115)', justifyContent: 'center'}}>
        <Text style={{fontSize: 16, backgroundColor: 'transparent', marginBottom: 20}}>
          Client {'\n'}{client.networkInterface._uri}
        </Text>
        <Text style={{fontSize: 16, backgroundColor: 'transparent', marginBottom: 20}}>
          Transfers Client {'\n'}{transferClient.networkInterface._uri}
        </Text>
        <Text style={{fontSize: 16, backgroundColor: 'transparent', marginBottom: 20}}>
          Funding Client {'\n'}{fundingClient.networkInterface._uri}
        </Text>
        <Text style={{fontSize: 16, backgroundColor: 'transparent', marginBottom: 20}}>
          Account Client {'\n'}{tptClient.networkInterface._uri}
        </Text>
        <Text style={{fontSize: 16, backgroundColor: 'transparent', marginBottom: 20}}>
          Detail Client {'\n'}{detailClient.networkInterface._uri}
        </Text>
        <Text style={{fontSize: 16, backgroundColor: 'transparent', marginBottom: 20}}>
          Cognito {'\n'}{AuthCredentials.ClientId}{'\n'}{AuthCredentials.UserPoolId}
        </Text>
      </View>
    )
  }

}

ShowConfig.propTypes = {
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

export default ShowConfig
