/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 4/6/17.
 */
// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import branch from 'react-native-branch'
import { View, StatusBar, ActionSheetIOS, Text, TouchableOpacity, ScrollView, ImageBackground, Dimensions, Image } from 'react-native'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import Colors from '../../Themes/Colors'
import ApplicationStyles from '../../Themes/ApplicationStyles'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import { Icon } from 'react-native-elements'
import Avatar from '../../Containers/Utility/Avatar'
import _ from 'lodash'
import { SPROUT } from '../../Utility/Mapper/Screens'
import Fonts from '../../Themes/Fonts'
import Communications from 'react-native-communications'
import ProcessingIndicator from '../Utility/ProcessingIndicator'
import * as Constants from '../../Themes/Constants'
import { AUTH_ENTITIES } from '../../Utility/Mapper/Auth'
import { formatFloatPrice } from '../../Utility/Transforms/Converter'

const imageUrl = 'https://www.w3schools.com/howto/img_avatar.png'
const borderColor = ['#FFDC00', '#2D50FE', '#F0595C', '#50C325']

const friend = [
  {
    detail: 'Invite Friends',
    value: SPROUT.REFER_A_FRIEND,
    showArrow: true
  }
]

const activity = [
  {
    detail: 'Activity',
    value: SPROUT.ACTIVITY_SETTING,
    showArrow: true
  },
  {
    detail: 'Trade Confirmations',
    showArrow: true
  },
  {
    detail: 'Statements',
    showArrow: true
  },
  {
    detail: 'Tax Statements',
    showArrow: true
  }
]

const edit = [
  {
    detail: 'Edit profile',
    value: SPROUT.EDIT_PROFILE_SETTING,
    showArrow: true
  },
  {
    detail: 'Bank',
    value: SPROUT.BANK_SETTING,
    showArrow: true
  }
]

const help = [
  {
    detail: 'FAQs',
    value: SPROUT.FAQ_SETTING,
    showArrow: true
  },
  {
    detail: 'Ask us a Question',
    value: SPROUT.FAQ_SETTING,
    showArrow: true
  },
  {
    detail: 'About Loved',
    value: SPROUT.ABOUT_SETTING,
    showArrow: true
  }
  // {
  //   detail: 'Delete Account',
  //   showArrow: false
  // },
  // {
  //   detail: 'Reset bank account',
  //   value: SPROUT.RESET_BANK_ACCOUNT,
  //   showArrow: true
  // }
]

const optionData = [
  friend,
  activity,
  edit,
  help
]

// ========================================================
// Core Component
// ========================================================

const Options = ({style, onPress, buttonText, showArrow, buttonTextStyle, underlayColor, index}) => {
  return (
    <TouchableOpacity
      style={{...style}}
      onPress={() => onPress && onPress()}
      activeOpacity={1}>
      <View style={{backgroundColor: '#FFF', flexDirection: 'row'}}>
        <Text style={{flex: 8, color: Colors.darkBlue, fontSize: 18, lineHeight: 23, textAlign: 'left', fontFamily: Fonts.type.bold}}>{buttonText}</Text>
        {
          showArrow &&
          <View style={{flex: 2, alignItems: 'flex-end'}}>
            <Icon name='keyboard-arrow-right' color={Colors.darkBlue} size={25} />
          </View>
        }
      </View>
    </TouchableOpacity>
  )
}

class Setting extends Component {
  componentWillMount () {
    const {height, width} = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  addNewChild () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.ADD_NEW_CHILD, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  showActionSheet () {
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

  showDocuments () {
    const {handleLocalAction, localActions, idToken, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_DOCUMENTS, [AUTH_ENTITIES.ID_TOKEN]: idToken, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  showConfirmations () {
    const {handleLocalAction, localActions, idToken, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_CONFIRMATIONS, [AUTH_ENTITIES.ID_TOKEN]: idToken, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  hideSettings () {
    const { handleLocalAction, localActions, navigator } = this.props
    handleLocalAction({
      type: localActions.HIDE_SETTINGS,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  deleteAccount () {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.DELETE_ACCOUNT})
  }

  async navigateToNextScreen (screen, index) {
    if (screen === SPROUT.REFER_A_FRIEND) {
      let branchUniversalObject = await branch.createBranchUniversalObject(
        'settings_page_referral_link',
        {
          title: 'Check this out'
        },
      )
      let {
        channel,
        completed,
        error
      } = await branchUniversalObject.showShareSheet()
      branch.userCompletedAction('share_via_settings_page', {
        channel
      })
      // let message =
      //   'Join me investing for my kids on Loved with commission-free custodial (Kids) Investing. Start building their future while learning together. app.loved.com';
      // const shareOptions = {
      //   title: 'Share via',
      //   message: message,
      //   social: [
      //     Share.Social.WHATSAPP,
      //     Share.Social.EMAIL,
      //     Share.Social.FACEBOOK,
      //     Share.Social.INSTAGRAM,
      //   ],
      // };
      // Share.open(shareOptions);
      return
    }
    const { handleLocalAction, localActions, navigator } = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO_SETTING_DETAIL_SCREEN,
      [COMMON_ENTITIES.SCREEN_TYPE]: screen,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  onNextPress (item, index) {
    if (item.detail === 'Delete Account') {
      this.deleteAccount()
      return
    }
    item.detail === 'Trade Confirmations' ? this.showConfirmations()
      : (item.detail === 'Statements' || item.detail === 'Tax Statements')
      ? this.showDocuments() : this.navigateToNextScreen(item.value, index)
  }

  renderHeading () {
    const { firstName, lastName, userID, userImage, imageUrl } = this.props
    const imageType = ['USER']
    const imageId = [userID]
    const imgSize = (Constants.screen.height * 100) / 812
    return (
      <View style={{ alignItems: 'center' }}>
        <Avatar
          isSelected
          borderWidth={0}
          avatarSize={imgSize}
          showAddButton={false}
          imageRadius={imgSize / 2}
          imageUrl={imageUrl}
          image={userImage}
          imageType={imageType}
          imageId={imageId}
        />
        <Text
          style={{
            ...ApplicationStyles.text.jumboHeader,
            marginTop: 5,
            fontFamily: Fonts.type.bold
          }}
        >
          {[firstName, lastName].join(' ')}
        </Text>
        <Text
          style={{
            ...ApplicationStyles.text.title,
            textDecorationLine: 'underline',
            color: Colors.white
          }}
          onPress={_.debounce(
            _.bind(
              () => this.navigateToNextScreen(SPROUT.EDIT_PROFILE_SETTING, -1),
              this,
            ),
            500,
            { leading: true, trailing: false },
          )}
        >
          Edit Profile
        </Text>
      </View>
    )
  }

  renderSettingOptions () {
    const cellSize = (Constants.screen.height * 60) / 812
    const marginTop = (Constants.screen.height * 12) / 812
    const {debugMode} = this.props

    return (
      <ScrollView contentContainerStyle={{ marginTop, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {optionData.map((data, dataIndex) => {
          return data.map((item, index) => {
            if (!debugMode && item.detail === 'Reset bank account') return null
            return (
              <Options
                index={index}
                showArrow={item.showArrow}
                buttonText={item.detail}
                style={{
                  backgroundColor: Colors.white,
                  paddingLeft: 18,
                  paddingRight: 10,
                  borderRadius: 6,
                  height: 60,
                  marginHorizontal: 5,
                  marginBottom: index === data.length - 1 ? 10 : 5,
                  paddingTop: index === 0 ? 12 : 18,
                  borderTopWidth: index === 0 ? 6 : 0,
                  borderTopColor: borderColor[dataIndex]
                }}
                buttonTextStyle={{
                  color: Colors.blue,
                  fontFamily: Fonts.type.bold,
                  fontSize: 18
                }}
                underlayColor={Colors.white}
                onPress={_.debounce(_.bind(() => this.onNextPress(item, index), this), 500, { leading: true, trailing: false })}
              />
            )
          })
        })}
      </ScrollView>
    )
  }

  renderBottom () {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          Communications.email(
            ['support@loved.com'],
            null,
            null,
            'Your topic here...',
            'Your concern here...',
          )
        }
      >
        <Text
          style={{
            ...ApplicationStyles.text.title,
            marginTop: 25,
            color: Colors.white,
            fontFamily: Fonts.type.book
          }}
        >
          Have further questions?
        </Text>
        <Text
          style={{
            ...ApplicationStyles.text.title,
            color: Colors.white,
            textDecorationLine: 'underline',
            fontFamily: Fonts.type.book
          }}
        >
          Email us
        </Text>
      </TouchableOpacity>
    )
  }

  renderCards (child, index) {
    return (
      <View style={{width: 130, height: 135, borderRadius: 6, marginRight: 15, overflow: 'hidden'}}>
        <View style={{backgroundColor: Colors.white, flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 7}}>
          <Text style={{fontFamily: Fonts.type.book, fontSize: 18, lineHeight: 23, color: Colors.darkBlue}}>{child.firstname}</Text>
        </View>
        <View style={{backgroundColor: Colors.buttonYellow, paddingHorizontal: 7, paddingTop: 7, paddingBottom: 11, borderBottomRightRadius: 6, borderBottomLeftRadius: 6}}>
          <Text style={{...ApplicationStyles.text.header, fontFamily: Fonts.type.medium, textAlign: 'left'}}>{child && formatFloatPrice(child.availableValue)}</Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon type={'octicon'} name={'calendar'} size={13} />
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 14, lineHeight: 28, color: Colors.darkBlue, marginLeft: 5}}>2019</Text>
          </View>

          {/* <Text style={{fontFamily: Fonts.type.book, fontSize: 12, lineHeight: 15, color: Colors.darkBlue}}>{child && formatFloatPrice(child.totalContributions)} invested</Text> */}

        </View>
      </View>
    )
  }

  renderHeader () {
    const {childArr, totalBalance} = this.props
    const isX = this.isX || false
    let topMargin = isX ? 40 : 32
    let headerHeight = isX ? 80 : 70
    return (
      <ImageBackground source={require('../../../Img/headerBackground.png')} style={{backgroundColor: Colors.appBlue}}>
        <View style={{height: headerHeight, backgroundColor: 'transparent'}} />
        <Text style={{fontFamily: Fonts.type.medium, fontSize: 36, lineHeight: 46, marginLeft: 23, color: Colors.buttonYellow}}>{formatFloatPrice(totalBalance)}</Text>
        <Text style={{fontFamily: Fonts.type.book, fontSize: 12, lineHeight: 15, marginLeft: 23, color: Colors.buttonYellow}}>Total Account Balances</Text>

        <TouchableOpacity onPress={() => this.addNewChild()} style={{flexDirection: 'row', marginVertical: 20, marginLeft: 23, alignItems: 'center'}}>
          <Text style={{fontFamily: Fonts.type.book, fontSize: 16, lineHeight: 20, color: Colors.white}}>Accounts</Text>
          <Image accessible accessibilityLabel={'addGoalIcon'} style={{marginLeft: 5, top: 1}} source={require('../../../Img/assets/dashboard/Plus-2/Plus.png')} />
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingLeft: 23}}>
          {childArr && Object.values(childArr).map((child, index) => this.renderCards(child, index))}
        </ScrollView>
      </ImageBackground>
    )
  }

  render () {
    const { navigator, popup, userImageProcessing } = this.props
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <ProcessingIndicator isProcessing={userImageProcessing} />
        <StatusBar barStyle='light-content' />
        <View style={{ flex: 1, backgroundColor: '#EAEAEA' }}>
          {this.renderHeader()}
          {this.renderSettingOptions()}
        </View>
      </View>
    )
  }
}

Setting.propTypes = {
  // used for navigation, comes via react-navigation
  navigation: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  imageUrl: PropTypes.any,
  userId: PropTypes.string,
  userImage: PropTypes.string,
  userImageProcessing: PropTypes.bool,
  popup: PropTypes.bool,
  debugMode: PropTypes.bool,
  // child array
  childArr: PropTypes.object.isRequired,
  totalBalance: PropTypes.number
}
Setting.defaultProps = {
  popup: true,
  debugMode: false
}

// ========================================================
// Export
// ========================================================

export default Setting
