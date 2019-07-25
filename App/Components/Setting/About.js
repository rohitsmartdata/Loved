
// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, ScrollView, Image, TouchableOpacity }
  from 'react-native'
import Colors from '../../Themes/Colors'
import CustomNav from '../../Containers/Common/CustomNav'
import styles from '../../Themes/ApplicationStyles'
import { analytics, CURRENT_VERSION } from '../../Config/AppConfig'
import { events } from '../../Utility/Mapper/Tracking'
import { SETTINGS_ENTITIES } from '../../Utility/Mapper/Settings'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import Fonts from '../../Themes/Fonts'
import { Icon } from 'react-native-elements'

// ========================================================
// Core Component
// ========================================================

const AboutLink = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        width: '100%',
        height: 60,
        marginBottom: 5,
        backgroundColor: '#fff',
        borderRadius: 6,
        shadowOffset: { x: 0, y: 3 },
        shadowOpacity: 1,
        shadowColor: 'rgba(44, 120, 249, 0.05)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 17,
        paddingRight: 15
      }}
  >
      <Text style={{fontSize: 18, fontFamily: Fonts.type.bold, lineHeight: 23}}>{title}</Text>
      <Icon name='keyboard-arrow-right' color='black' />
    </View>
  </TouchableOpacity>
)

class About extends Component {

  visitThirdParty = () => {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.CHECKED_THIRD_PARTY_TERMS
    })
    // *********** Log Analytics ***********

    handleLocalAction({type: localActions.SHOW_URL, [SETTINGS_ENTITIES.URL]: 'https://www.thirdparty.com/files/TPT_Customer_Agreement.pdf', [SETTINGS_ENTITIES.HEADING]: 'THIRD PARTY TRADE', [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  visitApex = () => {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.CHECKED_APEX_TERMS
    })
    // *********** Log Analytics ***********

    handleLocalAction({type: localActions.SHOW_URL, [SETTINGS_ENTITIES.URL]: 'https://www.thirdparty.com/files/Apex%20Clearing%20Corporation%20-%20Customer%20Account%20Agreement.pdf', [SETTINGS_ENTITIES.HEADING]: 'APEX CLEARING CORPORATION', [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  visitWrapProgram = () => {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_URL, [SETTINGS_ENTITIES.URL]: 'https://s3.amazonaws.com/www.loved.com/legal/20180207+ADV+Wrap+-+Elevated+Principles+Inc.pdf', [SETTINGS_ENTITIES.HEADING]: 'LOVED WRAP PROGRAM BROCHURE', [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  visitAdvisory = () => {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_URL, [SETTINGS_ENTITIES.URL]: 'https://s3.amazonaws.com/www.loved.com/legal/Investment+Advisory+Agreement.pdf', [SETTINGS_ENTITIES.HEADING]: 'LOVED ADVISORY AGREEMENT', [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }
  renderMessage () {
    return (
      <React.Fragment>
        <AboutLink title='Third Party Trade Agreement' onPress={this.visitThirdParty} />
        <AboutLink title='Apex Clearing Agreement' onPress={this.visitApex} />
        <AboutLink title='Loved Wrap Program Brochure' onPress={this.visitWrapProgram} />
        <AboutLink title='Loved Advisory Agreement' onPress={this.visitAdvisory} />
      </React.Fragment>
    )
  }
  renderHeading () {
    return (
      <View style={{width: '100%', backgroundColor: Colors.appBlue, paddingBottom: 27, alignItems: 'center', justifyContent: 'center'}}>
        <Image source={require('../../../Img/assets/onboard/appLogo/logo.png')} style={{width: 150, height: 45, alignSelf: 'center'}} />
      </View>
    )
  }
  render () {
    const { navigator } = this.props

    return (
      <View style={{flex: 1, backgroundColor: Colors.white, alignItems: 'center'}}>
        <CustomNav
          blueBackdrop
          navigator={navigator}
          leftButtonPresent
          titlePresent
          title='About'
          dropTopMargin
          extraStyles={{paddingTop: 40, height: 100}}
          customIcon={<Icon name={'chevron-left'} type='feather' color={'#FFF'} size={37} />}
        />
        {this.renderHeading()}
        <ScrollView style={{flex: 1, width: '100%', paddingHorizontal: 5, paddingVertical: 10}} showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor: Colors.transparent}}>
          {this.renderMessage()}
        </ScrollView>
        <Text style={{...styles.text.description, textAlign: 'left', color: Colors.gray, position: 'absolute', bottom: 40, left: 35, fontFamily: Fonts.type.book}}>
          {'Version ' + CURRENT_VERSION}
        </Text>
      </View>
    )
  }

}

About.propTypes = {
  // used for navigation, comes via react-navigation
  navigation: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,
  // user id
  userID: PropTypes.string.isRequired

}

// ========================================================
// Export
// ========================================================

export default About

