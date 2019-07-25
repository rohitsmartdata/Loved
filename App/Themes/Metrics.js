/* eslint-disable no-unused-vars */
import {Dimensions, Platform} from 'react-native'
const { width, height } = Dimensions.get('window')

export default {
  h1: {
    topMargin: 61,
    bottomMargin: 35
  },
  horizontalLine: {
    height: 1,
    width: 75
  },
  button: {
    height: {
      slim: 40,
      thick: 40
    },
    width: {
      small: 150,
      large: 200
    },
    border: {
      width: 1.5,
      radius: 30,
      style: {
        verticalGroup: 'dashed',
        decisionButton: 'solid'
      }
    }
  }
}
