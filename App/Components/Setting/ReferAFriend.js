
// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, ScrollView }
  from 'react-native'
import Colors from '../../Themes/Colors'
import * as Constants from '../../Themes/Constants'
import CustomNav from '../../Containers/Common/CustomNav'
import styles from '../../Themes/ApplicationStyles'
import Options from '../../CommonComponents/Options'
import _ from 'lodash'
import { SPROUT } from '../../Utility/Mapper/Screens'
import Fonts from '../../Themes/Fonts'

const optionData = [
  {
    detail: 'SMS',
    value: SPROUT.REFER_A_FRIEND,
    color: Colors.parrotGreen
  },
  {
    detail: 'Facebook',
    value: SPROUT.ACTIVITY_SETTING,
    color: Colors.FBBlue
  },
  {
    detail: 'Twitter',
    value: SPROUT.DOCUMENTS_SETTING,
    color: Colors.twitterBlue
  },
  {
    detail: 'Facebook Messenger',
    value: SPROUT.BANK_SETTING,
    color: Colors.messengerBlue
  },
  {
    detail: 'Copy Link',
    value: SPROUT.FAQ_SETTING,
    color: Colors.copyLink
  }
]

// ========================================================
// Core Component
// ========================================================

class ReferAFriend extends Component {

  renderHeading () {
    const imgWidth = Constants.screen.width - 150
    const imgHeight = imgWidth * 0.71
    return (
      <View style={{ ...styles.screen.h2.containerStyle, marginTop: 20 }}>
        <Text style={{ ...styles.text.mainHeader, alignSelf: 'center', marginBottom: 10, fontFamily: Fonts.type.bold }}>
          {'Harriette earns $5 for each\nfriend that joins Loved.'}
        </Text>
        <Text style={{ ...styles.text.subTitle, alignSelf: 'center', fontWeight: 'normal', color: Colors.blue, fontFamily: Fonts.type.book }}>
          {'Invite friends and contribute to start earning.'}
        </Text>
        <View style={{ width: imgWidth, height: imgHeight, backgroundColor: 'orange', alignSelf: 'center', marginTop: 25 }} />
      </View>
    )
  }

  renderSettingOptions () {
    return (
      <View style={{marginTop: 30, marginHorizontal: 35, alignItems: 'center'}}>
        {
          optionData.map((item, index) => {
            return (
              <Options
                buttonText={item.detail}
                style={{ backgroundColor: item.color, paddingVertical: 20, borderWidth: 0, width: '100%' }}
                buttonTextStyle={{ color: Colors.white, fontFamily: Fonts.type.book }}
                onPress={_.debounce(_.bind(() => console.log(item.detail), this), 500, {'leading': true, 'trailing': false})}
              />
            )
          })
        }
      </View>
    )
  }

  render () {
    const { navigator } = this.props

    return (
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Refer a Friends' />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor: Colors.transparent}}>
          {this.renderHeading()}
          {this.renderSettingOptions()}
        </ScrollView>
      </View>
    )
  }

}

ReferAFriend.propTypes = {
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

export default ReferAFriend

