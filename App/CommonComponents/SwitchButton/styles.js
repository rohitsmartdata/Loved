import { Dimensions, StyleSheet } from 'react-native'
import Color from '../../Themes/Colors'

const {width} = Dimensions.get('window')

const Colors = {
  mBackColor: '#efefef',
  mBorderColor: '#efefef',
  white: '#FFFFFF',
  shadowColor: '#A69E9E'
}

const Metrics = {
  containerWidth: width - 41,
  switchWidth: width / 3.2
}

const styles = StyleSheet.create({

  container: {
    width: Metrics.containerWidth,
    height: 48,
    flexDirection: 'row',
    backgroundColor: Color.lightGrayBG,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.mBorderColor,
    borderRadius: 24
  },

  switcher: {
    flexDirection: 'row',
    position: 'absolute',
    top: 3,
    left: 5,
    backgroundColor: Colors.white,
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: Metrics.switchWidth,
    elevation: 4,
    shadowOpacity: 0.31,
    shadowRadius: 10,
    shadowColor: Colors.shadowColor
  },
  buttonStyle: {
    flex: 1,
    width: Metrics.containerWidth / 3,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default styles
