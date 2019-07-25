
import immutablePersistenceTransform from '../Services/ImmutablePersistenceTransform'
import { AsyncStorage } from 'react-native'

// More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
const REDUX_PERSIST = {
  active: true,
  reducerVersion: '1.0',
  storeConfig: {
    key: 'primary',
    storage: AsyncStorage,
    // Reducer keys that you do NOT want stored to persistence here.
    // blacklist: ['login', 'search', 'nav'],
    // Optionally, just specify the keys you DO want stored to persistence.
    // An empty array means 'don't store any reducers' -> infinitered/ignite#409
    whitelist: ['onboard', 'root', 'util', 'auth'],
    transforms: [immutablePersistenceTransform]
  }
}

export const FORM_CONFIG = {
  active: true,
  reducerVersion: '1.0',
  storeConfig: {
    key: 'form',
    storage: AsyncStorage,
    // Reducer keys that you do NOT want stored to persistence here.
    // blacklist: ['login', 'search', 'nav'],
    // Optionally, just specify the keys you DO want stored to persistence.
    // An empty array means 'don't store any reducers' -> infinitered/ignite#409
    whitelist: ['ADD_USER', 'ADD_CHILD'],
    transforms: [immutablePersistenceTransform]
  }
}

export default REDUX_PERSIST
