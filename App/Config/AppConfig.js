/* eslint-disable space-infix-ops,no-multiple-empty-lines,no-trailing-spaces */
// Simple React Native specific changes

// ------------------------------------------------------------------------
// Configure & import environment
// ------------------------------------------------------------------------
import {ENVIRONMENT, getEnvironmentFile, isProd}
  from './contants'
import {getSegmentKey}
  from './Keys'

export const CURRENT_VERSION = '1.0.64 (2018.7.28.7.0) - UAT2'
export const CURRENT_ENVIRONMENT = ENVIRONMENT.UAT2
export const environmentVariable = getEnvironmentFile(CURRENT_ENVIRONMENT)

// ------------------------------------------------------------------------
// Export API clients
// ------------------------------------------------------------------------

const segmentKey = getSegmentKey(isProd(CURRENT_ENVIRONMENT))
import Analytics from 'analytics-react-native'
export const analytics = new Analytics(segmentKey, {flushAfter: 1000})

export const MIXPANEL_API_TOKEN = 'db435c629bb75fb4622d273de7421565' // 81d07864d86574950665f69f1d64edb7

// ------------------------------------------------------------------------
// Export API clients
// ------------------------------------------------------------------------

import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import AWS, { CognitoIdentityServiceProvider } from 'aws-sdk/dist/aws-sdk-react-native'
import * as enhancements from 'react-native-aws-cognito-js'

export const client = (idToken) => {
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  }

  const httpLink = createHttpLink({
    uri: environmentVariable.LW_WRITE
  })

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = idToken
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions
  })

  return {
    client: client
  }
}

export const readClient = (idToken) => {
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  }

  const httpLink = createHttpLink({
    uri: environmentVariable.LW_READ
  })

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = idToken
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions
  })

  return {
    client: client
  }
}

export const tptClient = (idToken) => {
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  }

  const httpLink = createHttpLink({
    uri: environmentVariable.ACCOUNT_API
  })

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = idToken
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions
  })

  return {
    client: client
  }
}

export const fundingClient = (idToken) => {
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  }
  const httpLink = createHttpLink({
    uri: environmentVariable.FUNDING_API
  })

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = idToken
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions
  })

  return {
    client: client
  }
}

export const transferClient = (idToken) => {
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  }

  const httpLink = createHttpLink({
    uri: environmentVariable.TRANSFERS_API
  })

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = idToken
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions
  })

  return {
    client: client
  }
}

export const detailClient = (idToken) => {
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  }

  const httpLink = createHttpLink({
    uri: environmentVariable.DETAIL_API
  })

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = idToken
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions
  })

  return {
    client: client
  }
}

export const learnClient = () => {
  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }
  }

  const httpLink = createHttpLink({
    uri: 'https://api.graphcms.com/simple/v1/loved'
  })

  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers
      }
    }
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions
  })

  return {
    client: client
  }
}

export const AuthCredentials = {
  UserPoolId: environmentVariable.USER_POOL_ID,
  ClientId: environmentVariable.CLIENT_ID
}

Object.keys(enhancements).forEach(key => (CognitoIdentityServiceProvider[key] = enhancements[key]))
export const userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(AuthCredentials)
console.log('AuthCredentials', userPool)
export default AWS
