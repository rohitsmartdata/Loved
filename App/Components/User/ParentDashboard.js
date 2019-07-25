/* eslint-disable no-unused-vars,no-multiple-empty-lines,no-trailing-spaces,operator-linebreak,camelcase,spaced-comment */
/**
 * Created by demon on 7/12/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {
  View, Alert, Text, StatusBar, ActionSheetIOS, LayoutAnimation, RefreshControl, NativeModules, TouchableOpacity, Keyboard,
  ScrollView, Image, ActivityIndicator, TextInput, Dimensions, AsyncStorage, ImageBackground, Animated
}
  from 'react-native'
import TypeWriter from 'react-native-typewriter'
import {Icon}
  from 'react-native-elements'
import Fonts
  from '../../Themes/Fonts'
import styles
  from '../../Themes/ApplicationStyles'
import ChildView
  from '../../Containers/Sprout/ChildView'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import LinearGradient
  from 'react-native-linear-gradient'
import {formatPrice, formatFloatPrice, limitText}
  from '../../Utility/Transforms/Converter'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import Avatar
  from '../../Containers/Utility/Avatar'
import moment
  from 'moment-timezone'
import { LEARN_ENTITIES }
  from '../../Utility/Mapper/Learn'
import InfoTip
  from '../../Containers/User/InfoTip'
import GoalBase
  from '../../Containers/Goals/GoalBase'
import LI_InvestmentBase
  from '../../Containers/Invest/LI_InvestmentBase'
import ImagePicker
  from 'react-native-image-picker'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import { SPROUT } from '../../Utility/Mapper/Screens'
import Colors from '../../Themes/Colors'
var Spinner = require('react-native-spinkit')
import CustomGraph
  from '../../CommonComponents/CustomGraph/CustomGraph'
import CustomCounter
  from '../../CommonComponents/CustomCounter/index'
const jsonData = require('../Sprout/data.json')
import SSNPopup
  from '../../Containers/Sprout/SSNPopup'
import UserSSNPopup
  from '../../Containers/User/UserSSNPopup'
import BankVerification
  from '../../Containers/Sprout/BankVerification'
import { analytics } from '../../Config/AppConfig'
import { events } from '../../Utility/Mapper/Tracking'
import { getDebugMode } from '../../Redux/Reducers/UserReducer'
import _ from 'lodash'
import { isBankAdded } from '../../Redux/Reducers/ChildReducer'
import branch from 'react-native-branch'
var PlaidBridgeModule = NativeModules.PlaidBridgeModule

// ========================================================
// Utility
// ========================================================

const xTopPadding = 30
const xHeaderHeight = 90
const topPadding = 22
const topHeader = 80

// ========================================================
// Core Component
// ========================================================

class ParentDashboard extends Component {

  // ------------------------------------------------------
  // lifecycle methods

  constructor (props) {
    super(props)
    this.state = {
      _selectedChild: props.selectedChild,
      age: props.selectedChild && props.selectedChild.age,
      y: props.selectedChild && props.selectedChild[CHILD_ENTITIES.AVAILABLE_VALUE],
      _showPortfolio: false,
      contentHeight: 0,
      portfolioLayout: undefined,
      infoTipVisible: false,
      infoTipCode: undefined,
      demoVisible: false,
      moving: true,
      ssnPopupVisible: false,
      userSSNPopupVisible: false,
      verificationPopupVisible: false,
      showUserFundingStatus: false,
      showChildAccountStatus: false,
      showChildFundingStatus: false,
      scrollY: new Animated.Value(0),
      showChildrenScroll: false
    }
    props.selectedChild && this.updateSelectedChild(props.selectedChild)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentWillMount () {
    const {shouldRefresh, newChildID, childArr} = this.props
    if (shouldRefresh) {
      this.refreshState()
    }
    if (newChildID) {
      this.setSelectedChild(childArr[newChildID])
    }
    const {_selectedChild} = this.state
    this.fetchStockPerformance(_selectedChild && _selectedChild.childID)
    this.getfundingAccountStatus()
  }

  getfundingAccountStatus (isSelectedChild) {
    const {_selectedChild} = this.state
    const {userFundingStatus} = this.props

    AsyncStorage.getItem('SHOW_FUNDING_STATUS', (err, result) => {
      if (err) {
        return
      } else if (result) {
        let statusData = JSON.parse(result)
        if (statusData && statusData['show_user_funding_status']) {
          if (userFundingStatus === 0) {
            this.setState({showUserFundingStatus: true})
          }
        }
        if ((statusData && statusData['show_child_funding_status']) || isSelectedChild) {
          if (_selectedChild && _selectedChild.childFundingStatus && _selectedChild.childFundingStatus === 0) {
            this.setState({showChildFundingStatus: true})
          }
        }
        if ((statusData && statusData['show_child_account_status']) || isSelectedChild) {
          if (_selectedChild && _selectedChild.childFundingStatus && _selectedChild.childFundingStatus === 0) {
            this.setState({showChildAccountStatus: true})
          }
        }
      } else {
        this.setDefaultValue()
      }
    })
  }

  setDefaultValue () {
    let statusData = {
      'show_user_funding_status': true,
      'show_child_account_status': true,
      'show_child_funding_status': true
    }
    try {
      AsyncStorage.setItem('SHOW_FUNDING_STATUS', JSON.stringify(statusData))
    } catch (err) {
      console.log('error while logging out user : ', err)
    }
    setTimeout(() => {
      this.getfundingAccountStatus()
    }, 500)
  }

  removeStatus (item) {
    AsyncStorage.getItem('SHOW_FUNDING_STATUS', (err, result) => {
      if (err) {
        return
      }
      if (result) {
        let statusData = JSON.parse(result)
        statusData[item] = false
        if (item === 'show_user_funding_status') {
          this.setState({showUserFundingStatus: false})
        } else if (item === 'show_child_funding_status') {
          this.setState({showChildFundingStatus: false})
        } else if (item === 'show_child_account_status') {
          this.setState({showChildAccountStatus: false})
        }
        AsyncStorage.setItem('SHOW_FUNDING_STATUS', JSON.stringify(statusData))
      }
    })
  }

  componentWillReceiveProps (nextProp) {
    const {selectedChild} = nextProp
    const {_selectedChild} = this.state
    if (selectedChild && !_.isEqual(selectedChild, _selectedChild)) {
      this.setState({_selectedChild: selectedChild, age: selectedChild.age, y: selectedChild[CHILD_ENTITIES.AVAILABLE_VALUE]}, () => {
        this.getfundingAccountStatus(true)
      })
    }
  }

  // ------------------------------------------------------
  // action handlers

  fetchStockPerformance (childID) {
    const {handleLocalAction, localActions, userID, email} = this.props
    handleLocalAction({type: localActions.FETCH_CHILD_STOCK_PERFORMANCE, [CHILD_ENTITIES.CHILD_ID]: childID, [USER_ENTITIES.USER_ID]: userID, [AUTH_ENTITIES.EMAIL]: email, [SETTINGS_ENTITIES.IMAGE_TYPE]: 'CHILD'})
  }

  showDisclaimer () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_DISCLAIMER, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  toggleShowSSN (visibility) {
    this.setState({
      ssnPopupVisible: visibility
    })
  }

  toggleShowUserSSN (visibility) {
    this.setState({
      userSSNPopupVisible: visibility
    })
  }

  toggleVerificationPopup (visibility) {
    this.setState({
      verificationPopupVisible: visibility
    })
  }

  toggleInfoTip (visibility, code) {
    this.setState({
      infoTipVisible: visibility
    })
    code && this.setState({
      infoTipCode: code
    })
  }

  toggleDemo (visibility) {
    this.setState({
      demoVisible: visibility
    })
  }

  updatePortfolioHeight (layout) {
    this.setState({portfolioLayout: layout})
  }

  updateSelectedChild (_selectedChild) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.SET_SELECTED_CHILD, [USER_ENTITIES.SELECTED_CHILD]: _selectedChild})
  }

  togglePortfolioVisibility () {
    this.setState((prevState, props) => {
      return {_showPortfolio: !prevState._showPortfolio}
    })
  }

  verifyBankAccount () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({
      type: localActions.VERIFY_BANK_ACCOUNT,
      [COMMON_ENTITIES.SCREEN_TYPE]: SPROUT.BANK_VERIFICATION_1,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  showSettings () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.OPEN_SETTINGS, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  showAcademy () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_ACADEMY, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  setSelectedChild (childObj) {
    LayoutAnimation.spring()
    this.setState({_selectedChild: childObj, age: childObj.age, y: childObj[CHILD_ENTITIES.AVAILABLE_VALUE], showChildrenScroll: false}, () => {
      this.fetchStockPerformance(childObj && childObj.childID)
      this.getfundingAccountStatus(true)
    })
    childObj && this.updateSelectedChild(childObj)
  }

  updateChildAvatar () {
    const { _selectedChild } = this.state
    const childID = _selectedChild && _selectedChild.childID

    if (childID) {
      const { handleLocalAction, localActions, email, token, userID } = this.props
      var options = {
        title: 'Select',
        quality: 0.1,
        mediaType: 'photo',
        maxWidth: 200,
        maxHeight: 200,
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      }

      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
          // console.log('User cancelled image picker')
        } else if (response.error) {
          // console.log('ImagePicker Error: ', response.error)
        } else if (response.customButton) {
          // console.log('User tapped custom button: ', response.customButton)
        } else {
          handleLocalAction({
            type: localActions.UPLOAD_PHOTO,
            [SETTINGS_ENTITIES.IMAGE_METADATA]: response,
            [SETTINGS_ENTITIES.IMAGE_TYPE]: ['USER', 'CHILD'],
            [AUTH_ENTITIES.EMAIL]: email,
            [AUTH_ENTITIES.ID_TOKEN]: token,
            [USER_ENTITIES.USER_ID]: userID, // userId
            [CHILD_ENTITIES.CHILD_ID]: childID, // childId,
            [GOAL_ENTITIES.GID]: null, // goalId,
            [CHILD_ENTITIES.IS_UPDATING_CHILD_IMAGE]: true
          })
        }
      })
    }
  }

  addNewGoal () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.ADD_NEW_GOAL, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  addNewInvestment () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.ADD_NEW_INVESTMENT, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  addNewChild () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.ADD_NEW_CHILD, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  showActionSheet () {
    // Uncomment next 2 lines to test branch event.
    // Branch.userCompletedAction('Event 1');
    // return;
    const {goal} = this.props
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Create new custodial account'],
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 1:
          this.addNewChild()
          break
      }
    })
  }

  refreshState () {
    const {handleLocalAction, localActions, userID, childIDs, navigator} = this.props
    userID && handleLocalAction({type: localActions.REFRESH_STATE, [USER_ENTITIES.USER_ID]: userID, [CHILD_ENTITIES.CHILD_IDs]: childIDs, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  openArticle (datum) {
    const {handleLocalAction, localActions, navigator} = this.props
    datum && handleLocalAction({type: localActions.OPEN_ARTICLE, [COMMON_ENTITIES.NAVIGATOR]: navigator, [LEARN_ENTITIES.MODULE]: datum})
  }

  reAuthenticateBankAccount (accountID) {
    const {handleLocalAction, localActions, userID, sourceReferenceID, navigator} = this.props
    if (accountID) {
      handleLocalAction({type: localActions.RE_AUTHENTICATE_BANK_ACCOUNT_WITH_ACCOUNT_ID, [USER_ENTITIES.USER_ID]: userID, [USER_ENTITIES.SOURCE_REFERENCE_ID]: sourceReferenceID, [USER_ENTITIES.PLAID_ACCOUNT_ID]: accountID, [USER_ENTITIES.SOURCE_REFERENCE_ID]: sourceReferenceID, [COMMON_ENTITIES.CALLBACK_FUCTION]: this.showSuccessMessage.bind(this), [COMMON_ENTITIES.NAVIGATOR]: navigator})
    } else {
      handleLocalAction({type: localActions.RE_AUTHENTICATE_BANK_ACCOUNT, [USER_ENTITIES.USER_ID]: userID, [USER_ENTITIES.SOURCE_REFERENCE_ID]: sourceReferenceID, [COMMON_ENTITIES.CALLBACK_FUCTION]: this.openPlaidForUpdateMode.bind(this), [COMMON_ENTITIES.NAVIGATOR]: navigator})
    }
  }

  showSuccessMessage (showMessage) {
    if (showMessage === true) {
      Alert.alert('Bank information updated successfully.')
    }
  }
  plaidConnectSuccess (accountID, publicToken) {
    const {handleLocalAction, localActions, userID, emailID, childID, goalID, recurringAmount, goalName, navigator} = this.props
    handleLocalAction({type: localActions.CONNECT_BANK,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [USER_ENTITIES.PLAID_PUBLIC_TOKEN]: publicToken,
      [USER_ENTITIES.PLAID_ACCOUNT_ID]: accountID,
      [GOAL_ENTITIES.NAME]: goalName,
      [USER_ENTITIES.EMAIL_ID]: emailID,
      [GOAL_ENTITIES.RECURRING_AMOUNT]: recurringAmount,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  openPlaidForUpdateMode (publicToken) {
    // alert(publicToken)
    PlaidBridgeModule.showPlaidViewControllerForUpdateMode(publicToken, (error, token, metadata) => {
      if (error) {
        // this.reAuthenticateBankAccount()
        // this.exit()
      } else if (metadata) {
        let metadataObject = (typeof metadata === 'string') ? JSON.parse(metadata) : metadata
        if (metadataObject.account_id) {
          this.reAuthenticateBankAccount(metadataObject.account_id)
        }
      }
    })

    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.PLAID_INITIATED
    })
    // *********** Log Analytics ***********
  }

  // eslint-disable-next-line no-undef
  toggleChildrenScroll = () => this.setState({showChildrenScroll: !this.state.showChildrenScroll})

  // ------------------------------------------------------
  // child components

  renderCard (o, index) {
    const {childrenAvailable} = this.props
    let title = o[LEARN_ENTITIES.MODULE_NAME]
    let description = o[LEARN_ENTITIES.MODULE_DESCRIPTION]
    let imageArr = [
      {
        imageOne: require('../../../Img/learn/light-bulb.png'),
        imageTwo: require('../../../Img/learn/fireworks.png'),
        imageThree: require('../../../Img/learn/rocket-launch.png')
      },
      {
        imageOne: require('../../../Img/learn/blackboard.png'),
        imageTwo: require('../../../Img/learn/backpack.png'),
        imageThree: require('../../../Img/learn/automobile.png')
      }
    ]
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Open Artical'}
        accessibilityRole={'button'}
        onPress={() => this.openArticle(o)}
        style={{height: 180, marginBottom: 25, borderRadius: 15, backgroundColor: '#FFF', justifyContent: 'space-around', alignItems: 'center', shadowOpacity: 0.3, shadowOffset: {width: 1, height: 3}}}>
        <LinearGradient colors={[index ? '#39B762' : '#FFF', index ? '#256612' : '#FFF']} start={{x: 0, y: -1}} end={{x: 3, y: 0}} locations={[0, 0.7]} style={{height: 180, borderRadius: 15, backgroundColor: '#FFF'}}>
          <View style={{marginTop: 10}}>
            <Text style={{marginTop: 10, textAlign: 'center', color: index ? '#FFF' : '#4A4A4A', fontFamily: Fonts.type.bold, fontSize: 25}}>
              {limitText(title, 25)}
            </Text>
            <Text style={{marginTop: 10, textAlign: 'center', color: index ? 'rgba(255, 255, 255, 0.4)' : '#9B9B9B', fontFamily: Fonts.type.bold, fontSize: 16}}>
              {limitText(description, 50)}
            </Text>
          </View>
          {
            index ?
              <View style={{flexDirection: 'row', backgroundColor: 'transparent', flex: 1, width: '100%'}}>
                <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginHorizontal: 10}}>
                  <Image source={imageArr[index]['imageOne']} style={{height: 70, width: 70, marginRight: 0, marginBottom: 0}} resizeMode='stretch' />
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'transparent'}}>
                  <Image source={imageArr[index]['imageTwo']} style={{height: 80, width: 80, marginBottom: 0}} resizeMode='stretch' />
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginHorizontal: 10}}>
                  <Image source={imageArr[index]['imageThree']} style={{height: 50, width: 100, marginLeft: 0, marginBottom: 0}} resizeMode='stretch' />
                </View>
              </View>
              :
              <View style={{flexDirection: 'row', backgroundColor: 'transparent', flex: 1}}>
                <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'transparent'}}>
                  <Image source={imageArr[index]['imageThree']} style={{height: 90, width: 90, marginRight: 60}} resizeMode='stretch' />
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'transparent'}}>
                  <Image source={imageArr[index]['imageTwo']} style={{height: 95, width: 91}} resizeMode='stretch' />
                </View>
                <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'transparent'}}>
                  <Image source={imageArr[index]['imageOne']} style={{height: 90, width: 70, marginLeft: 40}} resizeMode='stretch' />
                </View>
              </View>
          }
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  renderHeader () {
    const isX = this.isX
    const {_selectedChild} = this.state
    const {isDebugMode} = this.props
    const firstName = _selectedChild && _selectedChild['firstname']
    return (
      <View style={{flexDirection: 'row', paddingTop: isX ? xTopPadding : topPadding, height: isX ? xHeaderHeight : topHeader, backgroundColor: '#2948FF', alignItems: 'flex-end', paddingBottom: 19}}>
        <View style={{flex: 3, left: 19, paddingTop: 15}}>
          {this.renderChildPanel()}
        </View>
        {/* <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'Show Settings'}
          accessibilityRole={'button'}
          style={{flex: 1.5, alignItems: 'center'}}
          onPress={_.debounce(_.bind(() => this.showSettings(), this), 700, {'leading': true, 'trailing': false})}>
          <Image source={require('../../../Img/assets/dashboard/settings-work-tool/settings-work-tool.png')} style={{width: 20, height: 20}} resizeMode={'contain'} />
        </TouchableOpacity> */}
        <View style={{flex: 4, alignItems: 'center'}}>
          <Image source={require('../../../Img/dashboardIcons/appIconHeader.png')} style={{width: 74, height: 22}} resizeMode={'contain'} />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          accessible
          style={{flex: 3}}
          accessibilityLabel={'Show Settings'}
          accessibilityRole={'button'}>
          <View style={{width: 18, height: 16}} resizeMode={'contain'} />
        </TouchableOpacity>
      </View>
    )
  }

  renderCamera () {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Update Child Avatar'}
        accessibilityRole={'button'}
        onPress={() => this.updateChildAvatar()} style={{marginHorizontal: 5, paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-end'}}>
        <Icon
          name='camera'
          type='entypo'
          color='#FFF'
          size={15}
        />
      </TouchableOpacity>
    )
  }

  renderChildBadge (c, i) {
    const {_selectedChild} = this.state
    const {imageUrl = '', childImage = '', childID} = c
    const {userID} = this.props
    const imageType = ['USER', 'CHILD']
    const imageId = [userID, c.childID]
    let initials = c.firstname && c.firstname.charAt(0)
    let marked = false // add condition to display dot

    const isSelected = (_selectedChild && _selectedChild.childID === c.childID) || false
    let isAddChild = c === 'Add Child'

    const avatarOpacity = 7
    const headerHeight = 70
    // const avatarOpacity = this.state.scrollY.interpolate({
    //   inputRange: [0, 10, 20],
    //   outputRange: [1, 0.5, 0],
    //   extrapolate: 'clamp'
    // })
    //
    // const headerHeight = this.state.scrollY.interpolate({
    //   inputRange: [0, 10, 20],
    //   outputRange: [70, 60, 50],
    //   extrapolate: 'clamp'
    // })

    let image = null
    if (isSelected) {
      image = <View style={{marginTop: 6}}>
        <Avatar isSelected borderWidth={1} avatarSize={32} showAddButton imageRadius={17} imageUrl={imageUrl} image={childImage} imageType={imageType} imageId={imageId} />
      </View>
    } else if (isAddChild) {
      image = <Icon type='feather' name={'plus'} size={15} style={{width: 10, height: 10}} containerStyle={{marginTop: 20, borderWidth: 1, borderRadius: 10}} color={Colors.darkBlue} />
    } else if (imageUrl || childImage) {
      image = <Avatar isSelected={isSelected} avatarSize={0} name={c.firstname} showAddButton={false} initials={initials} imageRadius={15} imageUrl={imageUrl} image={childImage} imageType={imageType} imageId={imageId} marked={marked} />
    } else {
      image = <Image source={require('../../../Img/dashboardIcons/addChildDefault.png')} style={{height: 70, width: 100}} />
    }

    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={`Select child ${c.firstname}`}
        accessibilityRole={'button'}
        onPress={_.debounce(_.bind(() => isAddChild ? this.showActionSheet() : this.setSelectedChild(c), this), 700, {'leading': true, 'trailing': false})} style={{ marginRight: 10, shadowColor: 'black', shadowOpacity: 0.2, shadowOffset: {height: 2, width: 0}, borderRadius: 3, overflow: 'hidden' }}>
        <Animated.View style={{height: headerHeight, width: 100}}>
          <ImageBackground blurRadius={isSelected ? 7 : null} style={{flex: 1, backgroundColor: (isAddChild) ? 'rgb(191, 200, 251)' : Colors.transparent, alignItems: 'center'}} source={(isAddChild) ? null : (imageUrl || childImage) ? {uri: childImage} : require('../../../Img/dashboardIcons/addChildDefault.png')} resizeMode={'cover'}>
            <Animated.View style={{opacity: avatarOpacity}}>
              {image}
            </Animated.View>
            {(!isSelected && !isAddChild) && <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)'}} />}
            <View style={{position: 'absolute', bottom: 10, alignSelf: 'center'}}>
              <Text style={{fontSize: 14, lineHeight: 16, color: isAddChild ? Colors.darkBlue : isSelected ? Colors.buttonYellow : '#fff', fontFamily: Fonts.type.bold}}>{isAddChild ? c : limitText(c.firstname, 12)}
              </Text>
              { isSelected && <View style={{height: 1, backgroundColor: Colors.buttonYellow}} /> }
            </View>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    )
  }

  // eslint-disable-next-line no-undef
  renderChildrenScroll = () => {
    const {childArr} = this.props
    const {showChildrenScroll, _selectedChild} = this.state
    const delayMap = [
      { at: ' ', delay: 500 }
    ]
    const newChildren = {...childArr, key: 'Add Child'}
    return (
      <View style={{flexDirection: 'row', marginLeft: 19, height: 36, alignItems: 'center'}}>
        {showChildrenScroll ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} automaticallyAdjustContentInsets={false}>
            {newChildren && Object.values(newChildren).map((c, index) => {
              const isSelected = (_selectedChild && _selectedChild.childID === c.childID) || false
              if (isSelected) {
                return null
              }
              if (c === 'Add Child') {
                return (
                  <TouchableOpacity
                    style={{height: 36, width: 36, borderRadius: 18, backgroundColor: 'rgba(255, 255, 255, 0.25)', alignItems: 'center', justifyContent: 'center'}}
                    onPress={_.debounce(_.bind(() => this.showActionSheet(), this), 700, {'leading': true, 'trailing': false})}
                  >
                    <Icon name='plus' type='feather' color='#FFF' size={20} />
                  </TouchableOpacity>
                )
              }
              const {imageUrl = '', childImage = '', childID} = c
              return (
                <TouchableOpacity
                  style={{height: 36, width: 36, backgroundColor: 'white', borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 10}}
                  onPress={_.debounce(_.bind(() => this.setSelectedChild(c), this), 700, {'leading': true, 'trailing': false})}
                >
                  <Text style={{fontSize: 14, fontFamily: Fonts.type.book}}>{c && c.firstname && c.firstname[0]}</Text>
                  {childImage && (
                  <Image style={{height: 36, width: 36, borderRadius: 18, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                    source={{uri: childImage}}
                  />
                )}
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        ) : (
          <Text style={{color: 'white', fontSize: 20, letterSpacing: 1, marginLeft: 0, fontFamily: Fonts.type.book}}>Hey there {_selectedChild.firstname}</Text>
        )}
      </View>
    )
  }

  renderChildPanel () {
    const {_selectedChild, showChildrenScroll} = this.state

    const {imageUrl = '', childImage = '', childID} = _selectedChild
    return (
      <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{height: 36, width: 36, backgroundColor: 'white', borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 10}}
            onPress={this.toggleChildrenScroll}
          >
            <React.Fragment>
              <Text style={{fontSize: 14, fontFamily: Fonts.type.book}}>{_selectedChild && _selectedChild.firstname && _selectedChild.firstname[0]}</Text>
              {childImage && (
                <Image style={{height: 36, width: 36, borderRadius: 18, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                  source={{uri: childImage}}
                />
              )}
            </React.Fragment>
          </TouchableOpacity>
          {showChildrenScroll && (
            <TouchableOpacity
              style={{height: 36, width: 36, borderRadius: 18, backgroundColor: 'rgba(255, 255, 255, 0.25)', alignItems: 'center', justifyContent: 'center'}}
              onPress={_.debounce(_.bind(() => this.updateChildAvatar(), this), 700, {'leading': true, 'trailing': false})}
            >
              <Icon name='camera' type='font-awesome' color='#FFF' size={16} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  renderLastUpdateTime () {
    const {lastUpdatedTime} = this.props
    if (lastUpdatedTime) {
      let m = moment(lastUpdatedTime).tz('America/New_York').format('MMM DD, h:MM A z')
      return (
        <View>
          <Text style={{fontSize: 12, color: '#FFF', fontFamily: Fonts.type.book}}>
            At {m}
          </Text>
        </View>
      )
    } else {
      return null
    }
  }

  renderAllInformation () {
    const isX = this.isX
    const {isDebugMode, isLearningProcessing, learningModules, tileOne, tileTwo} = this.props
    const {height} = Dimensions.get('window')
    const {portfolioLayout} = this.state
    const portfolioHeight = (portfolioLayout && portfolioLayout.height) || 250
    let difference = isX ? xHeaderHeight + xTopPadding + 70 + portfolioHeight : topHeader + topPadding + 60 + portfolioHeight
    const spinnerBackdropHeight = height - difference

    if (isLearningProcessing) {
      return (
        <View style={{backgroundColor: 'transparent', marginTop: 0, height: spinnerBackdropHeight, justifyContent: 'center', alignItems: 'center'}}>
          <Spinner isVisible size={80} type={'ThreeBounce'} color='#000' />
        </View>
      )
    } else {
      return (
        <View style={{backgroundColor: 'transparent'}}>
          <View style={{marginVertical: 20, paddingHorizontal: 16}}>
            {
              tileOne && this.renderCard(tileOne, 0)
            }
            {
              tileTwo && this.renderCard(tileTwo, 1)
            }
            {this.renderLastUpdateTime()}
            {isDebugMode && this.renderCurrentValue()}
            {isDebugMode && this.renderStocks()}
          </View>
        </View>
      )
    }
  }

  // eslint-disable-next-line no-undef
  inviteFriends = async () => {
    let branchUniversalObject = await branch.createBranchUniversalObject(
      'dashboard_child_view_referral_link',
      {
        title: 'Check this out'
      },
    )
    let {
      channel,
      completed,
      error
    } = await branchUniversalObject.showShareSheet()
  }

  renderInvite () {
    return (
      <TouchableOpacity onPress={this.inviteFriends} style={{backgroundColor: '#FFF', marginHorizontal: 5, borderRadius: 6, marginTop: 5, paddingVertical: 10, alignItems: 'center', paddingLeft: 20, paddingRight: 14, flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={require('../../../Img/assets/dashboard/invite/invite.png')} style={{marginRight: 10, height: 22, width: 22}} />
          <Text style={{fontFamily: Fonts.type.medium, letterSpacing: 1, fontSize: 16, color: '#050D13'}}>
            Invite your friends
          </Text>
        </View>
        <Icon name='angle-right' type='font-awesome' color='#000' />
      </TouchableOpacity>
    )
  }

  renderCallToAction () {
    // render correct notification based on priority
    const {userSSNAdded} = this.props
    if (userSSNAdded === 0) {
      return this.renderUserSSNNotification()
    }
    const {_selectedChild} = this.state
    const firstName = _selectedChild && _selectedChild['firstname']
    const isSSNAdded = (_selectedChild && _selectedChild[CHILD_ENTITIES.IS_SSN_ADDED])
    if (isSSNAdded !== 1) {
      return this.renderSSNNotification()
    }
    const {isDebugMode, userIsBankAdded} = this.props
    const isBankAdded = (_selectedChild && _selectedChild[CHILD_ENTITIES.IS_BANK_ADDED])
    if (userIsBankAdded === 3) {
      return this.renderBankReauthentication()
    }
    if (isBankAdded === 2) {
      return this.renderMicroDepositNotification(userIsBankAdded, isSSNAdded)
    }
    return this.renderInvite()
  }

  renderChildInformation (childID) {
    const {navigator, isDebugMode} = this.props
    if (childID) {
      return (
        <View style={{backgroundColor: '#F4F4F4', flex: 1}}>
          {this.renderCallToAction()}
          <ChildView childID={childID} navigator={navigator} />
          {isDebugMode && this.renderStocks()}
        </View>
      )
    } else return null
  }

  renderInformation () {
    const isX = this.isX
    const {_selectedChild} = this.state
    const {height} = Dimensions.get('window')
    const bottomBarHeight = isX ? 70 : 60
    const topBarHeight = isX ? 30 : 22
    const paddingHeight = isX ? 80 : 70
    const scrollViewHeight = height - bottomBarHeight - topBarHeight - paddingHeight
    const {userDetailProcessing, defaultIndex, childArr} = this.props
    const childID = _selectedChild && _selectedChild.childID

    const paddingBottom = childArr.length === 0 ? scrollViewHeight : 100
    return (
      <View style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='always'
          scrollEnabled={this.state.moving}
          scrollEventThrottle={16}
          contentContainerStyle={{paddingBottom}}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
          // refreshControl={
          //   <RefreshControl
          //     style={{backgroundColor: 'transparent'}}
          //     refreshing={userDetailProcessing}
          //     onRefresh={this.refreshState.bind(this)}
          //     tintColor='#FFF'
          //   />}
        >
          {this.renderChildrenScroll()}
          {this.renderPortfolioCube()}
          {childID && this.renderChildInformation(childID)}
          {!childID && this.renderAllInformation()}
        </ScrollView>
      </View>
    )
  }

  renderGoalComponent () {
    const {demoVisible} = this.state
    const { navigator } = this.props
    // {/*<LI_InvestmentBase navigator={navigator} isVisible={demoVisible} foo={this.toggleDemo.bind(this)} />*/}
    if (demoVisible) {
      return (
        <GoalBase navigator={navigator} isVisible={demoVisible} foo={this.toggleDemo.bind(this)} />
      )
    } else {
      return null
    }
  }

  renderBlankPortfolioState () {
    return (
      <View style={{marginTop: 10, paddingHorizontal: 20}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 26, color: '#FFF'}}>
          Welcome to Harriette’s dashboard!
        </Text>
        <Text style={{marginTop: 10, fontFamily: Fonts.type.book, fontSize: 18, color: '#DDDDDD'}}>
          Here you will learn more about your investment future.
        </Text>
      </View>
    )
  }

  renderPortfolioCube () {
    const {_selectedChild} = this.state
    const graphData = _selectedChild && _selectedChild[CHILD_ENTITIES.STOCK_PERFORMANCE_DATA]
    const graphDataAvailable = (graphData && graphData.length > 0)
    const {width} = Dimensions.get('window')
    return (
      <View style={{width: width, height: graphDataAvailable ? 210 : 160, backgroundColor: Colors.appBlue}}>
        {graphDataAvailable && this.renderGraphComponent()}
        {this.renderChildPortfolio()}
      </View>
    )
  }

  numberWithCommas (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  renderChildPortfolio () {
    const {_selectedChild, y} = this.state
    const balance = y || 0
    const growthAmount = _selectedChild && _selectedChild[CHILD_ENTITIES.GROWTH_IN_VALUE]
    const growthPercentage = _selectedChild && _selectedChild[CHILD_ENTITIES.GROWTH_IN_PERCENTAGE]
    const pendingTransfer = _selectedChild && _selectedChild[CHILD_ENTITIES.PENDING_TRANSFER_AMOUNT]
    const pendingWithdrawl = _selectedChild && _selectedChild[CHILD_ENTITIES.PENDING_WITHDRAWAL_AMOUNT]
    return (
      <View style={{paddingHorizontal: 20, position: 'absolute', marginLeft: 5}}>
        <View style={{width: '100%', marginVertical: 10}}>
          {/* <Text style={{fontFamily: Fonts.type.medium, fontSize: 36, color: '#FFDC00'}}>
            {formatFloatPrice(balance)}
          </Text> */}
          <CustomCounter text={`$${this.numberWithCommas(balance.toString())}`} textStyle={{fontFamily: Fonts.type.medium, fontSize: 36, color: '#FFDC00'}} rotateItems={[]}>
            {/* {formatFloatPrice(balance)} */}
          </CustomCounter>
          <Text style={{fontFamily: Fonts.type.medium, fontSize: 12, color: '#FFDC00'}}>
            {parseFloat(pendingTransfer) === 0 ? 'Your Balance' : formatPrice(pendingTransfer) + ' Pending Balance'}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontFamily: Fonts.type.medium, fontSize: 12, color: '#FFF'}}>
            {'Return' + '  '}
          </Text>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: '#FFF'}}>
            {(growthAmount > 0) && '+'}{growthAmount && formatPrice(growthAmount)}  ({(growthPercentage > 0) && '+'}{growthPercentage}%)
          </Text>
        </View>
        {this.renderLastUpdateTime()}
      </View>
    )
  }

  renderSSNNotification () {
    const {_selectedChild} = this.state
    const firstName = _selectedChild && _selectedChild['firstname']
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={`Verify ${firstName}'s SSN`}
        accessibilityRole={'button'}
        onPress={() => this.toggleShowSSN(true)}
        style={{backgroundColor: '#FFF', marginHorizontal: 5, borderRadius: 6, marginTop: 5, paddingVertical: 10, alignItems: 'center', paddingLeft: 20, paddingRight: 14, flexDirection: 'row', justifyContent: 'space-between'}}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={require('../../../Img/assets/dashboard/verify-ssn/verify-ssn.png')} style={{marginRight: 10, height: 22, width: 22}} />
          <Text style={{fontFamily: Fonts.type.medium, letterSpacing: 1, fontSize: 16, color: '#050D13'}}>
            Verify {firstName}'s SSN
          </Text>
        </View>
        <Icon name='angle-right' type='font-awesome' color='#000' />
      </TouchableOpacity>
    )
  }

  renderUserSSNNotification () {
    return (
      <TouchableOpacity
        onPress={() => this.toggleShowUserSSN(true)}
        style={{backgroundColor: '#FFF', marginHorizontal: 5, borderRadius: 6, marginTop: 5, paddingVertical: 10, alignItems: 'center', paddingLeft: 20, paddingRight: 14, flexDirection: 'row', justifyContent: 'space-between'}}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={require('../../../Img/assets/dashboard/verify-ssn/verify-ssn.png')} style={{marginRight: 10, height: 22, width: 22}} />
          <Text style={{fontFamily: Fonts.type.medium, letterSpacing: 1, fontSize: 16, color: '#050D13'}}>
            Verify your SSN
          </Text>
        </View>
        <Icon name='angle-right' type='font-awesome' color='#000' />
      </TouchableOpacity>
    )
  }

  renderBankReauthentication () {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Re-authentication needed.'}
        accessibilityRole={'button'}
        onPress={() => this.reAuthenticateBankAccount()}
        style={{backgroundColor: '#FFF', marginHorizontal: 5, borderRadius: 6, marginTop: 5, paddingVertical: 10, alignItems: 'center', paddingLeft: 20, paddingRight: 14, flexDirection: 'row', justifyContent: 'space-between'}}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={require('../../../Img/assets/dashboard/update-bank/update-bank.png')} style={{marginRight: 10, height: 22, width: 22}} />
          <Text style={{fontFamily: Fonts.type.medium, letterSpacing: 1, fontSize: 16, color: '#050D13'}}>
            Update bank account
          </Text>
        </View>
        <Icon name='angle-right' type='font-awesome' color='#000' />
      </TouchableOpacity>
      // <TouchableOpacity
      //   accessible
      //   accessibilityLabel={'Re-authentication needed.'}
      //   accessibilityRole={'button'}
      //   onPress={() => this.reAuthenticateBankAccount()} style={{position: 'absolute', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, bottom: !isSSNAdded || isSSNAdded === 1 ? 95 : 170, left: 0, right: 0, height: 75, backgroundColor: '#1C3C70', shadowOpacity: 0.5, shadowRadius: 5, shadowOffset: {height: -3}}}>
      //   <View style={{flex: 8}}>
      //     <Text style={{fontFamily: Fonts.type.book, fontSize: 20, color: '#FFF'}}>
      //       Update bank account
      //     </Text>
      //   </View>
      //   <View style={{flex: 2, alignItems: 'flex-end'}}>
      //     <Icon name='keyboard-arrow-right' color='#FFF' size={40} />
      //   </View>
      // </TouchableOpacity>
    )
  }

  renderMicroDepositNotification (userIsBankAdded, isSSNAdded) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Verify Microdeposits'}
        accessibilityRole={'button'}
        onPress={() => this.toggleVerificationPopup(true)}
        style={{backgroundColor: '#FFF', marginHorizontal: 5, borderRadius: 6, marginTop: 5, paddingVertical: 10, alignItems: 'center', paddingLeft: 20, paddingRight: 14, flexDirection: 'row', justifyContent: 'space-between'}}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={require('../../../Img/assets/dashboard/micro-deposit/micro-deposit.png')} style={{marginRight: 10, height: 22, width: 22}} />
          <Text style={{fontFamily: Fonts.type.medium, letterSpacing: 0.5, fontSize: 16, color: '#050D13'}}>
            Verify Microdeposits
          </Text>
        </View>
        <Icon name='angle-right' type='font-awesome' color='#000' />
      </TouchableOpacity>
      // <TouchableOpacity
      //   accessible
      //   accessibilityLabel={'Verify micro-deposits into your bank.'}
      //   accessibilityRole={'button'}
      //   onPress={() => this.toggleVerificationPopup(true)}
      //   style={{
      //       position: 'absolute', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, bottom: userIsBankAdded === 3 && isDebugMode ? 170 : !isSSNAdded || isSSNAdded === 1 ? 95 : 170, left: 0, right: 0, height: 75, backgroundColor: '#1C3C70', shadowOpacity: 0.5, shadowRadius: 5, shadowOffset: {height: -3}
      //   }}>
      //   <View style={{flex: 8}}>
      //     <Text style={{fontFamily: Fonts.type.book, fontSize: 20, color: '#FFF'}}>
      //       Verify micro-deposits into your bank.
      //     </Text>
      //   </View>
      //   <View style={{flex: 2, alignItems: 'flex-end'}}>
      //     <Icon name='keyboard-arrow-right' color='#FFF' size={40} />
      //   </View>
      // </TouchableOpacity>
    )
  }

  renderFundingPopups () {
    const {isDebugMode, firstname, userIsBankAdded} = this.props

    if (isDebugMode) {
      const {_selectedChild, showUserFundingStatus, showChildAccountStatus, showChildFundingStatus} = this.state
      const isBankAdded = (_selectedChild && _selectedChild[CHILD_ENTITIES.IS_BANK_ADDED])
      const isSSNAdded = (_selectedChild && _selectedChild[CHILD_ENTITIES.IS_SSN_ADDED])
      let bottom = userIsBankAdded === 3 ? 240 : isBankAdded === 2 || isBankAdded === 3 || isSSNAdded !== 1 ? 170 : 95

      return (
        <View style={{position: 'absolute', bottom, left: 0, right: 0, backgroundColor: '#fff'}}>
          {
            showUserFundingStatus &&
            <View
              style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, bottom: 0, left: 0, right: 0, height: 75, backgroundColor: '#1C3C70', shadowOpacity: 0.5, shadowRadius: 5, shadowOffset: {height: -3}}}>
              <Text style={{fontFamily: Fonts.type.book, fontSize: 20, color: '#FFF'}}>
                {firstname}'s bank account is either linked yet or in progress.
              </Text>
              <View style={{position: 'absolute', alignItems: 'flex-end', right: 10, top: 10}}>
                <Icon name='close' color='#FFF' size={20} onPress={() => this.removeStatus('show_user_funding_status')} />
              </View>
            </View> || null

          }
          {
            showChildAccountStatus &&
            <View
              style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, bottom: 0, left: 0, right: 0, height: 75, backgroundColor: '#1C3C70', shadowOpacity: 0.5, shadowRadius: 5, shadowOffset: {height: -3}}}>
              <Text style={{fontFamily: Fonts.type.book, fontSize: 20, color: '#FFF'}}>
                {_selectedChild.firstname} account is in progress or is not active.
              </Text>
              <View style={{position: 'absolute', alignItems: 'flex-end', right: 10, top: 10}}>
                <Icon name='close' color='#FFF' size={20} onPress={() => this.removeStatus('show_child_account_status')} />
              </View>
            </View> || null

          }
          {
            showChildFundingStatus &&
            <View
              style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, bottom: 0, left: 0, right: 0, height: 75, backgroundColor: '#1C3C70', shadowOpacity: 0.5, shadowRadius: 5, shadowOffset: {height: -3}}}>
              <Text style={{fontFamily: Fonts.type.book, fontSize: 20, color: '#FFF'}}>
                {_selectedChild.firstname} bank account is either linked yet or in progress.
              </Text>
              <View style={{position: 'absolute', alignItems: 'flex-end', right: 10, top: 10}}>
                <Icon name='close' color='#FFF' size={20} onPress={() => this.removeStatus('show_child_funding_status')} />
              </View>
            </View> || null
          }
        </View>
      )
    } else {
      return <View />
    }
  }

  renderGraphComponent () {
    const {isFetchingStockPerformance} = this.props
    const {_selectedChild, age} = this.state
    const graphData = _selectedChild && _selectedChild[CHILD_ENTITIES.STOCK_PERFORMANCE_DATA]
    const childCurrentAge = _selectedChild && _selectedChild['age']
    let seperation = age || 1
    if (isFetchingStockPerformance) {
      return (
        <View style={{position: 'absolute', bottom: 50, left: 0, right: 0}}>
          <ActivityIndicator animating color={Colors.white} size={'large'} />
        </View>
      )
    } else if (graphData && (graphData.length > 0)) {
      return (
        <View style={{position: 'absolute', bottom: 2, left: 0, right: 0}}>
          <CustomGraph
            data={graphData}
            height={120}
            itemIndex={age || 0}
            chartPaddingTop={20}
            fillColorA={Colors.buttonYellow}
            fillColorB={Colors.buttonYellow}
            chartPaddingLeft={0}
            chartPaddingRight={0}
            sphereBorderWidth={0}
            sphereBorderColor='transparent'
            sphereBackGroundColor='transparent'
            backgroundDivdePros={seperation}
            childCurrentAge={childCurrentAge}
            lineEndColor={'rgba(41,72,255, 1)'}
            chartColor={'#2948FF'}
            readonly={false}
            onChange={(age, y) => {
              this.setState({ age, y })
            }}
            onMoving={(moving) => {
              this.setState({moving})
            }}
          />
        </View>
      )
    } else {
      return (
        <View style={{position: 'absolute', bottom: 50, left: 0, right: 0}}>
          <Text style={{fontFamily: Fonts.type.medium, letterSpacing: 0.5, fontSize: 15, color: '#FFF', textAlign: 'center'}}>
            NO GRAPH DATA PRESENT
          </Text>
        </View>
      )
    }
  }

  renderDisclaimer () {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Open Disclaimer'}
        accessibilityRole={'button'}
        onPress={_.debounce(_.bind(() => this.showDisclaimer(), this), 500, {'leading': true, 'trailing': false})}>
        <Text style={{alignSelf: 'flex-end', marginRight: 15, fontSize: 12, fontFamily: Fonts.type.book, color: Colors.white}}>Disclaimer</Text>
      </TouchableOpacity>
    )
  }

  renderNotificationPopup () {
    const {ssnPopupVisible, _selectedChild} = this.state
    const {navigator} = this.props
    const childID = _selectedChild && _selectedChild.childID
    if (ssnPopupVisible) {
      return (
        <View style={{flex: 1}}>
          <SSNPopup hideModal={this.toggleShowSSN.bind(this)} childID={childID} navigator={navigator} isVisible={ssnPopupVisible} />
        </View>
      )
    } else {
      return null
    }
  }

  renderUserSSNPopup () {
    const {userSSNPopupVisible} = this.state
    const {navigator} = this.props
    if (userSSNPopupVisible) {
      return (
        <View style={{flex: 1}}>
          <UserSSNPopup hideModal={this.toggleShowUserSSN.bind(this)} navigator={navigator} isVisible={userSSNPopupVisible} />
        </View>
      )
    } else {
      return null
    }
  }

  renderVerificationPopup () {
    const {verificationPopupVisible, _selectedChild} = this.state
    const childID = _selectedChild && _selectedChild.childID

    const {navigator} = this.props

    if (verificationPopupVisible) {
      return (
        <BankVerification hideModal={this.toggleVerificationPopup.bind(this)} childID={childID} navigator={navigator} isVisible={verificationPopupVisible} />
      )
    } else {
      return null
    }
  }

  // ------------------------------------------------------
  // Debug components

  renderCurrentValue () {
    const {currentValue} = this.props
    return (
      <View style={{backgroundColor: 'rgba(0, 0, 0, 0.1)', marginHorizontal: 16, marginVertical: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
          Current Value
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 5}}>
          {currentValue}
        </Text>
      </View>
    )
  }

  renderStock (tickerName, stockName, stockUnitPrice, stockUnits, stockInvestedAmount, stockGrowthInPercentage, stockGrowthValue, stockCurrentValue, stockUnitsAvailable, stockTime) {
    return (
      <View style={{backgroundColor: 'rgba(0, 0, 0, 0.1)', marginVertical: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
          Ticker Name
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {tickerName}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Stock Name
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {stockName}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Stock Invested Amount
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {stockInvestedAmount}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Stock Unit Price
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {stockUnitPrice}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Stock Units
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {stockUnits}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Stock Growth percentage
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {stockGrowthInPercentage}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Stock Growth Value
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {stockGrowthValue}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Stock Current Value
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {stockCurrentValue}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Stock Units Available
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {stockUnitsAvailable}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 10}}>
          Stock Fetch Time
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 3}}>
          {stockTime}
        </Text>
      </View>
    )
  }

  renderStocks () {
    const {stocks} = this.props
    return (
      <View style={{paddingHorizontal: 16}}>
        {(stocks && stocks.length > 0) ? <Text>STOCKS</Text> : <View />}
        {stocks && stocks.map(s => this.renderStock(s['stock_ticker'], s['stock_name'], s['stock_unit_price'], s['stock_units'], s['stock_invested_amount'], s['stock_growth_in_percentage'], s['stock_growth_in_value'], s['stock_current_value'], s['stock_available_units'], s['stock_fetch_time']))}
      </View>
    )
  }

  // ------------------------------------------------------
  // Core components

  render () {
    const {width, height} = Dimensions.get('window')
    const {infoTipVisible, infoTipCode} = this.state
    const { updatingChildImage } = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#F4F4F4'}}>
        <View style={{position: 'absolute', width: width, top: 0, left: 0, right: 0, height: height / 2.3, backgroundColor: '#2948FF'}} />
        <StatusBar barStyle='light-content' />
        {this.renderHeader()}
        {this.renderInformation()}
        <InfoTip isVisible={infoTipVisible} isGlossary={false} code={infoTipCode} foo={this.toggleInfoTip.bind(this)} />
        {this.renderGoalComponent()}
        {this.renderNotificationPopup()}
        {this.renderUserSSNPopup()}
        {this.renderVerificationPopup()}
        {this.renderFundingPopups()}
        <ProcessingIndicator isProcessing={updatingChildImage} />
      </View>
    )
  }

}

// ========================================================
// Prop verifiers
// ========================================================

ParentDashboard.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  childrenAvailable: PropTypes.bool.isRequired,

  firstname: PropTypes.string,

  userSSNAdded: PropTypes.number,

  childIDs: PropTypes.array.isRequired,

  userID: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,

  // total parent portfolio value
  currentValue: PropTypes.string.isRequired,
  // available value
  availableValue: PropTypes.string.isRequired,
  // pending transfer amount
  pendingTransferAmount: PropTypes.string.isRequired,
  // pending withdrawal amount
  pendingWithdrawalAmount: PropTypes.string.isRequired,
  // invested to date
  totalContribution: PropTypes.string.isRequired,
  // growth value of parent
  growthValue: PropTypes.string.isRequired,
  // growth percentage of parent
  growthPercentage: PropTypes.string.isRequired,
  // total weekly invested
  monthlyInvestment: PropTypes.number.isRequired,
  // last updated time
  lastUpdatedTime: PropTypes.string,

  // is confirmations/statements processing
  isFetchProcessing: PropTypes.bool.isRequired,
  // is user detail processing
  userDetailProcessing: PropTypes.bool.isRequired,

  // tile one
  tileOne: PropTypes.object,
  // tile two
  tileTwo: PropTypes.object,

  // child array
  childArr: PropTypes.object.isRequired,
  // default index
  defaultIndex: PropTypes.number,
  // selected child
  selectedChild: PropTypes.object.isRequired,
  // should refersh the store on construction
  shouldRefresh: PropTypes.bool.isRequired,

  newChildID: PropTypes.string,

  isLearningProcessing: PropTypes.bool.isRequired,
  learningModules: PropTypes.array.isRequired,

  // is debug mode
  isDebugMode: PropTypes.bool.isRequired,
  // stocks
  stocks: PropTypes.array,

  // fetching stock performance
  isFetchingStockPerformance: PropTypes.bool,

  updatingChildImage: PropTypes.bool,

  // have goals
  haveGoals: PropTypes.bool.isRequired,

  // have investments
  haveInvestments: PropTypes.bool.isRequired,

  sourceReferenceID: PropTypes.string,
  // total weekly invested
  userFundingStatus: PropTypes.number.isRequired,

  userIsBankAdded: PropTypes.number
}

ParentDashboard.defaultProps = {
  shouldRefresh: false,
  isFetchingStockPerformance: false
}

// ========================================================
// Export
// ========================================================

export default ParentDashboard
