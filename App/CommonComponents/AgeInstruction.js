import React
  from 'react'
import { Image, Text, TouchableHighlight, View }
  from 'react-native'
import Modal
  from 'react-native-modal'
import styles from '../Themes/ApplicationStyles'
import Colors from '../Themes/Colors'
import * as Constants from '../Themes/Constants'

export const AgeInstruction = ({showModal = false, toggleModal}) => {
  const imgWidth = (Constants.screen.width * 186) / 375
  const imgHeight = (Constants.screen.height * 225) / 812
  return (
    <Modal
      keyboardShouldPersistTaps='always'
      style={{justifyContent: 'center', marginHorizontal: 32}}
      backdropColor='black'
      animationOut='slideOutDown'
      backdropOpacity={0.6}
      isVisible={showModal}>
      <View style={{backgroundColor: Colors.white, justifyContent: 'center', paddingHorizontal: 16, paddingTop: 58, paddingBottom: 27, borderRadius: 10, shadowColor: Colors.black, shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.16}}>
        <Text style={{ ...styles.text.mainHeader }}>
          {'If you’re under 18, find\nyour favorite adult.'}
        </Text>
        <Image style={{alignSelf: 'center', marginTop: 5, marginBottom: 23, height: imgHeight, width: imgWidth}} source={require('../../Img/assets/onboard/custodial/custodial.png')} resizeMode={'contain'} />
        <Text style={{ ...styles.text.title, color: Colors.darkBlue }}>
          {'A custodial account lets a parent, relative or any adult, open an investing account for someone under 18.\n\nIf you’re under 18 you’ll need to find a parent, grandparent or other adult to sign you up and help manage your account until you’re an adult.\n'}
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
          onPress={() => toggleModal && toggleModal(false)}
        >
          <Text style={{...styles.bottomNavigator.textStyle}}>Okay</Text>
        </TouchableHighlight>
      </View>
    </Modal>
  )
}
