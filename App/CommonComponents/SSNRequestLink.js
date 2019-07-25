/* eslint-disable no-unused-vars,camelcase */
import React
  from 'react'
import { Image, Text, TouchableOpacity, TouchableHighlight, View }
  from 'react-native'
import Modal
  from 'react-native-modal'
import styles from '../Themes/ApplicationStyles'
import Colors from '../Themes/Colors'
import * as Constants from '../Themes/Constants'
import Fonts from '../Themes/Fonts'
import Share from 'react-native-share'

export const SSNRequestLink = ({showModal = false, toggleModal, childName = '', requestSSN, getMessage}) => {
  const imgWidth = (Constants.screen.width * 174) / 375
  const imgHeight = (Constants.screen.height * 80) / 812
  return (
    <Modal
      keyboardShouldPersistTaps='always'
      style={{justifyContent: 'center', marginHorizontal: 32}}
      backdropColor='black'
      animationOut='slideOutDown'
      backdropOpacity={0.6}
      isVisible={showModal}>
      <View style={{backgroundColor: Colors.white, justifyContent: 'center', paddingTop: 40, paddingBottom: 46, borderRadius: 10, shadowColor: Colors.black, shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.16}}>
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'close'}
          accessibilityRole={'button'}
          onPress={() => toggleModal && toggleModal(false)}
        >
          <Image source={require('../../Img/iconImages/closeGray.png')} style={{width: 20, height: 20, marginRight: 42, alignSelf: 'flex-end'}} />
        </TouchableOpacity>
        <Image source={require('../../Img/requestSSN.png')} style={{alignSelf: 'center', marginTop: 90, marginBottom: 35, height: imgHeight, width: imgWidth}} resizeMode={'contain'} />
        <Text style={{ ...styles.text.mainHeader, color: Colors.blue }}>
          {`Do you need to ask\nsomeone for ${childName}’s SSN?`}
        </Text>
        <Text style={{ ...styles.text.header, marginTop: 22, marginBottom: 82, color: Colors.darkBlue, fontFamily: Fonts.type.medium, fontWeight: 'normal' }}>
          {`You can ask one of ${childName}’s\nfamily members to\ninput ${childName}’s SSN at the\nbelow weblink.`}
        </Text>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Okay'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 3, width: 0},
            marginHorizontal: 60
          }}
          onPress={() => {
            let message = getMessage()
            const shareOptions = {
              title: 'Share via',
              url: 'some share url',
              message: message,
              social: [Share.Social.WHATSAPP, Share.Social.EMAIL, Share.Social.FACEBOOK, Share.Social.INSTAGRAM]
            }
            Share.open(shareOptions).then(res => {
              console.log(' [[[[ it was success ]]]] ')
              requestSSN()
              toggleModal(false)
            }).catch(err => console.log(' [[[ ERROR caught ]]] :: ', err))
          }}
        >
          <Text style={{color: Colors.blue, fontFamily: Fonts.type.book, fontSize: 18}}>Get Link</Text>
        </TouchableHighlight>
      </View>
    </Modal>
  )
}
