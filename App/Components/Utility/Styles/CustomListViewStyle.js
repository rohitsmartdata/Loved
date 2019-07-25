/* eslint-disable no-trailing-spaces,no-multiple-empty-lines,no-unused-vars */
/**
 * Created by viktor on 10/7/17.
 */

export default {
  // Root Container
  container: {
    flex: 1
  },

  // top level containers
  headerContainer: {
    marginBottom: 35,
    marginTop: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  capsuleContainer: {
    flexDirection: 'row'
  },
  capsuleHeader: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 40
  },
  capsule: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderColor: '#9B9B9B',
    paddingTop: 12,
    paddingBottom: 14
  },
  compactCapsuleContainer: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: 'rgba(256, 256, 256, 0.4)'
  },
  compactCapsule: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  compactCapsuleDescriptorContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },


  // utility styles
  headerStyle: {
    fontSize: 14,
    backgroundColor: 'transparent',
    color: '#FFF',
    fontFamily: 'helvetica'
  },
  capsuleTextStyle: {
    fontSize: 16,
    backgroundColor: 'transparent',
    color: '#FFF',
    fontFamily: 'helvetica'
  },
  capsuleHeaderStyle: {
    width: 25,
    height: 25,
    backgroundColor: 'rgba(256, 256, 256, 0.4)',
    borderRadius: 40
  }


}
