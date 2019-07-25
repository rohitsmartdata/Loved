/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 7/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Alert, Text, Image, ActivityIndicator, WebView, LayoutAnimation }
  from 'react-native'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES, PLAID_ACTIONS}
  from '../../Utility/Mapper/Common'
import {parsePlaidAction}
  from '../../Utility/Transforms/Parsers'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class PlaidConnect extends Component {

  onSuccess (data) {
    const {handleLocalAction, localActions, navigator, parentNavigator, userID, childID, goalID} = this.props
    handleLocalAction({type: localActions.SUCCESS, [COMMON_ENTITIES.NAVIGATOR]: navigator, [COMMON_ENTITIES.PARENT_NAVIGATOR]: parentNavigator, [USER_ENTITIES.USER_ID]: userID, [USER_ENTITIES.PLAID_ACCOUNT_ID]: data['metadata']['account_id'], [USER_ENTITIES.PLAID_PUBLIC_TOKEN]: data['metadata']['public_token'], childID: childID, goalID: goalID})
  }

  onExit () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.EXIT, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  skip () {
    const {handleLocalAction, localActions, navigator, parentNavigator} = this.props
    handleLocalAction({type: localActions.SKIP, [COMMON_ENTITIES.NAVIGATOR]: parentNavigator})
  }

  onMessage (event) {
    let data
    try {
      data = JSON.parse(event.nativeEvent.data)
      let action = parsePlaidAction(data['action'])
      if (action) {
        switch (action) {

          case PLAID_ACTIONS.CONNECTED:
            this.onSuccess(data)
            break

          case PLAID_ACTIONS.EXIT:
            this.onExit(data)
            break
        }
      }
    } catch (err) {
      console.log('**** error while parsing plaid event ****', err)
    }
  }

  renderWebview () {
    let publicKey = '8718862d2816f18ab24087db6dc45a'
    let clientID = '58f82c39bdc6a4280851bbad'
    let secret = '0152ce945634b095cb5df1878d3154'
    let env = 'sandbox'
    let clientName = 'SproutApp'
    let product = 'auth'

    return (
      <View style={{flex: 1, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, backgroundColor: '#FFF'}}>
        <WebView
          style={{flex: 1, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderBottomWidth: 2, backgroundColor: '#FFF'}}
          onError={err => console.log('error: ', err)}
          canGoBack
          canGoForward
          onMessage={event => this.onMessage(event)}
          source={{uri: `https://cdn.plaid.com/link/v2/stable/link.html?key=${publicKey}&apiVersion=v2&env=${env}&product=${product}&clientName=${clientName}&isWebView=true&isMobile=true&selectAccount=true&client_id=${clientID}&secret=${secret}`}}
        />
      </View>
    )
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        {
          this.renderWebview()
        }
      </View>
    )
  }

}

PlaidConnect.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // parent navigator
  parentNavigator: PropTypes.object.isRequired,

  // user ID
  userID: PropTypes.string.isRequired,
  childID: PropTypes.string.isRequired,
  goalID: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

export default PlaidConnect
