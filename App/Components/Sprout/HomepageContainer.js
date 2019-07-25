/* eslint-disable no-unused-vars,no-trailing-spaces,operator-linebreak,spaced-comment */
/**
 * Created by viktor on 14/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  ART,
  AsyncStorage,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Animated
} from 'react-native'
import branch from 'react-native-branch'
import Fonts from '../../Themes/Fonts'
import {
  COMMON_ENTITIES,
  DEVICE_LOGICAL_RESOLUTION
} from '../../Utility/Mapper/Common'
import * as Constants
  from '../../Themes/Constants'
import Invest from '../../Containers/Sprout/Invest'
import ParentDashboard from '../../Containers/User/ParentDashboard'
import Grow from '../../Containers/Grow/Homepage'
import AddInvestment from '../../Containers/Invest/AddInvestment'
import { AUTH_ENTITIES } from '../../Utility/Mapper/Auth'
import { handleDeeplinking } from '../../Config/BranchDeeplinking'
import TabNavigator from 'react-native-tab-navigator'
import Setting from '../../Containers/Setting/Setting'
import SelectInvestment from '../../Containers/Invest/LI_SelectInvestment'

// ========================================================
// Core Component
// ========================================================

const { height, width } = Dimensions.get('window')

class HomepageContainer extends Component {
  // ------------------------------------------------------------
  // Lifecycle methods & event handlers

  constructor (props) {
    super(props)
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
    this.state = {
      translateX: 0,
      currentIndex: 0,
      selectedTab: 'dashboard',
      refresh: true,
      x: new Animated.Value(-width)
    }
    this.isX =
      height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height &&
      width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentWillMount () {
    const { userID, emailID } = this.props
    console.log({ userID, emailID })
    // branch.setIdentity(userID); // <- Identifiy the user in branch

    // setUpPushNotification(userID, emailID, this.onNotificationReceive.bind(this))
    // handleDeeplinking()
  }

  componentWillReceiveProps (nextProps) {
    let tabValue = nextProps.navTab
    const {selectedTab} = this.state
    if (tabValue === 'invest' && selectedTab !== 'invest') {
      this.updateSelectedTab('invest')
      this.resetNavTab()
    }
  }

  onNotificationReceive (notification) {
    // const type = this.getNotificationType(notification._data.type || 'dashboard')
    // this.updateSelectedTab(type)
  }

  getNotificationType = type => {
    switch (type) {
      case 'dream':
        return 'dream'
      case 'desire':
        return 'desire'
      default:
        return 'dashboard'
    }
  }

  onNavigatorEvent (event) {
    // handle a deep link
    if (event.type === 'DeepLink') {
      const screen = event.link // Link parts
      if (screen) {
        if (event.payload === 'RESET') {
          this.handleLogout()
        } else if (event.payload === 'FETCH DOCUMENTS') {
          this.showDocuments()
        } else {
          this.navigateToScreen(screen)
        }
      }
    }
  }

  // ------------------------------------------------------------
  // Action handlers

  resetNavTab () {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.RESET_NAV_TAB})
  }

  updateSelectedTab = tab => {
    this.setState({
      selectedTab: tab,
      refresh: false
    })
  };

  addAccount () {
    const { handleLocalAction, localActions, navigator } = this.props
    handleLocalAction({
      type: localActions.ADD_ACCOUNT,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  navigateToScreen (screen) {
    const { handleLocalAction, localActions, navigator } = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO,
      [COMMON_ENTITIES.SCREEN_TYPE]: screen,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  handleLogout () {
    const { handleLocalAction, localActions, navigator } = this.props
    handleLocalAction({
      type: localActions.LOGOUT,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  showDocuments () {
    const { handleLocalAction, localActions, idToken, navigator } = this.props
    handleLocalAction({
      type: localActions.SHOW_DOCUMENTS,
      [AUTH_ENTITIES.ID_TOKEN]: idToken,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  // ------------------------------------------------------------
  // Child render methods

  renderInvestTab () {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
        {this.renderInvestPanel()}
      </View>
    )
  }

  renderInvestPanel () {
    const { navigator } = this.props
    return <AddInvestment navigator={navigator} />
  }

  renderParentView () {
    const { shouldRefresh, newChildID, navigator } = this.props
    const { refresh } = this.state
    this.closeModal()
    return (
      <View style={{ flex: 1 }}>
        <ParentDashboard
          navigator={navigator}
          shouldRefresh={shouldRefresh && refresh}
          newChildID={newChildID}
        />
      </View>
    )
  }

  renderLearnView () {
    const { navigator } = this.props
    return (
      <View style={{ flex: 1 }}>
        <Grow navigator={navigator} />
      </View>
    )
  }

  openModal () {
    Animated.timing(this.state.x, {
      duration: 300,
      toValue: 0,
      delay: 100
    }).start()
  }

  closeModal () {
    Animated.timing(this.state.x, {
      duration: 500,
      toValue: -width,
      delay: 100
    }).start()
  }

  renderAccountView () {
    const { navigator } = this.props
    const {x} = this.state

    return (
      <View style={{flex: 1}}>
        <Setting popup={false} navigator={navigator} />
      </View>
    )
  }

  renderInvestView () {
    const { navigator } = this.props
    this.closeModal()
    return (
      <View style={{ flex: 1 }}>
        <SelectInvestment isDashboardView navigator={navigator} />
      </View>
    )
  }

  // ------------------------------------------------------------
  // Tab navigator components

  renderPlayground () {
    const { selectedTab } = this.state
    let renderFunction
    switch (selectedTab) {
      case 'dashboard':
        renderFunction = () => this.renderParentView()
        break
      case 'invest':
        renderFunction = () => this.renderInvestView()
        break
      case 'account':
        renderFunction = () => this.renderAccountView()
        break
      default:
        renderFunction = () => this.renderParentView()
        break
    }
    const isX = this.isX || false
    return <View style={{ flex: 1 }}>{renderFunction()}</View>
  }

  renderTab (tab, title, icon, selectedIcon) {
    const { selectedTab } = this.state
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={`Open tab ${title}`}
        accessibilityRole={'button'}
        onPress={() => this.updateSelectedTab(tab)}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: 10
        }}
      >
        <Image
          source={selectedTab === tab ? selectedIcon : icon}
          style={{
            height: 20,
            width: 20,
            tintColor: selectedTab === tab ? 'rgb(255, 208, 23)' : '#FFF'
          }}
        />
        <Text
          style={{
            marginTop: 3,
            fontFamily: Fonts.type.semibold,
            fontSize: 12,
            color: selectedTab === tab ? 'rgb(255, 208, 23)' : '#FFF'
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    )
  }

  renderTabNavigator () {
    const { selectedTab } = this.state
    return (
      <View style={{flexDirection: 'row', backgroundColor: '#FFF', position: 'absolute', bottom: 0, right: 0, left: 0, height: 95}}>

        <TouchableOpacity onPress={() => this.setState({selectedTab: 'dashboard'})} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{bottom: 10, height: 28, width: 28}} source={selectedTab === 'dashboard' ? require('../../../Img/assets/dashboard/tab/home/home.png') : require('../../../Img/assets/dashboard/tab/homeDisable/Home.png')} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.setState({selectedTab: 'invest'})} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{bottom: 10, height: 27, width: 28}} source={selectedTab === 'invest' ? require('../../../Img/assets/dashboard/tab/discover/discover.png') : require('../../../Img/assets/dashboard/tab/discoverDisable/DISCOVER.png')} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.setState({selectedTab: 'account'})} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{bottom: 10, height: 28, width: 28}} source={selectedTab === 'account' ? require('../../../Img/assets/dashboard/tab/account/account.png') : require('../../../Img/assets/dashboard/tab/accountDisable/ACCOUNT.png')} />
        </TouchableOpacity>

      </View>
    )
  }

  // ------------------------------------------------------------
  // Core component

  render () {
    const { children, childIDs, navigator, childrenAvailable } = this.props
    const { width, height } = Dimensions.get('window')
    let cubeWidth = width / 4
    let imageWidth = cubeWidth * 2
    const isX = this.isX || false
    return (
      <View style={{ flex: 1 }}>
        {this.renderPlayground()}
        {this.renderTabNavigator()}
      </View>
    )
  }
}

HomepageContainer.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // is it processing
  isProcessing: PropTypes.bool.isRequired,

  // list of children
  children: PropTypes.object,
  childIDs: PropTypes.array,
  userID: PropTypes.string.isRequired,

  childrenAvailable: PropTypes.bool.isRequired,

  shouldRefresh: PropTypes.bool.isRequired,

  newChildID: PropTypes.string,

  navTab: PropTypes.string,

  // email id
  emailID: PropTypes.string.isRequired,
  // id token
  idToken: PropTypes.string.isRequired
}

HomepageContainer.defaultProps = {
  childrenAvailable: false,
  shouldRefresh: false
}

// ========================================================
// Export
// ========================================================

export default HomepageContainer
