import branch from 'react-native-branch'
import { SPROUT } from '../Utility/Mapper/Screens'
import { Navigation } from 'react-native-navigation'

export function handleDeeplinking () {
  // TODO : HANDLE DEEP LINKING OVER HERE AFTER CLICKING URL
  console.log({ branch })
  console.log({ 'branch.subscribe': branch.subscribe })
  branch.skipCachedEvents()
  branch.subscribe(deepLinkData => {
    console.log('branch.subscribe.listener')
    const { error: branchSubscribeError, params } = deepLinkData
    if (branchSubscribeError) {
      console.log({ branchSubscribeError })
      return
    }
    console.log({ branchParams: params })
    // params will never be null if error is null

    if (params['+non_branch_link']) {
      const nonBranchUrl = params['+non_branch_link']
      console.log(nonBranchUrl)
      if (nonBranchUrl.includes('openDocument')) {
        console.log('openDocument')
        Navigation.handleDeepLink({
          link: SPROUT.STATEMENTS,
          payload: 'FETCH DOCUMENTS' // (optional) Extra payload with deep link
        })
      } else if (nonBranchUrl.includes('openApp')) {
        console.log('openApp')
      } else {
        console.log('normal url')
      }
      // Route non-Branch URL if appropriate. https://5l8q.test-app.link/YRYyb9FFMO
      return
    }

    if (!params['+clicked_branch_link']) {
      // Indicates initialization success and some other conditions.
      // No link was opened.
      return
    }
  })
}
