import { AUTH_ENTITIES } from '../Utility/Mapper/Auth'
import { AsyncStorage } from 'react-native'
import { decodeCredentials, getCredentialLocalKey } from '../Utility/Transforms/Converter'
import AWS, { environmentVariable } from '../Config/AppConfig'

export async function getAWSSession (username) {
  const credentials = await AsyncStorage.getItem(getCredentialLocalKey(username))
  if (!credentials) { return }
  let finalCredentials = decodeCredentials(credentials)
  let poolDataUAT2 = {
    UserPoolId: environmentVariable.USER_POOL_ID,
    ClientId: environmentVariable.CLIENT_ID,
    IdentityPoolId: environmentVariable.AWS_IDENTITY_POOL_ID
  }

  let authenticationData = {
    Username: finalCredentials[AUTH_ENTITIES.EMAIL],
    Password: finalCredentials[AUTH_ENTITIES.PASSWORD]
  }

  const poolData = poolDataUAT2
  let userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData)
  let authenticationDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData)
  let userData = {
    Username: authenticationData.Username,
    Pool: userPool
  }
  let cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData)

  return new Promise((resolve, reject) => {
    return cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        AWS.config.region = environmentVariable.AWS_REGION

        let credentialParams = {
          IdentityPoolId: environmentVariable.AWS_IDENTITY_POOL_ID,
          Logins: {
            [environmentVariable.AWS_LOGIN]: session.idToken.jwtToken
          }
        }

        var credentials = new AWS.CognitoIdentityCredentials(credentialParams)
        credentials.clearCachedId()
        credentials = new AWS.CognitoIdentityCredentials(credentialParams)
        AWS.config.credentials = credentials

        resolve(true)
      },
      onFailure: (error) => {
        console.log(error)
        reject(false)
      }
    })
  })
}
