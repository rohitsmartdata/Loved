import { Dimensions } from 'react-native'

export const screen = Dimensions.get('window')
export const isX = (screen.height === 812)
export const statusBarHeight = isX ? 45 : 20
