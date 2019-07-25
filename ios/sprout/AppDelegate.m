/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/*
 #import "AppDelegate.h"
 #import <CodePush/CodePush.h>
 
 #import <React/RCTBundleURLProvider.h>
 #import <React/RCTRootView.h>
 #if __has_include(<React/RNSentry.h>)
 #import <React/RNSentry.h> // This is used for versions of react >= 0.40
 #else
 #import "RNSentry.h" // This is used for versions of react < 0.40
 #endif
 
 @implementation AppDelegate
 
 - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
 {
 NSURL *jsCodeLocation;
 
 
 #ifdef DEBUG
 jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
 #else
 jsCodeLocation = [CodePush bundleURL];
 #endif
 RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
 moduleName:@"sprout"
 initialProperties:nil
 launchOptions:launchOptions];
 
 [RNSentry installWithRootView:rootView];
 
 rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
 
 self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
 UIViewController *rootViewController = [UIViewController new];
 rootViewController.view = rootView;
 self.window.rootViewController = rootViewController;
 [self.window makeKeyAndVisible];
 return YES;
 }
 
 @end
 */

#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <CodePush/CodePush.h>
#import <React/RCTPushNotificationManager.h>
#import <react-native-branch/RNBranch.h>
// **********************************************
// *** DON'T MISS: THE NEXT LINE IS IMPORTANT ***
// **********************************************
#import "RCCManager.h"
// IMPORTANT: if you're getting an Xcode error that RCCManager.h isn't found, you've probably ran "npm install"
// with npm ver 2. You'll need to "npm install" with npm 3 (see https://github.com/wix/react-native-navigation/issues/1)

#import <React/RCTRootView.h>
#import "PlaidObject.h" // import plaid object class
//#import <FBSDKCoreKit/FBSDKCoreKit.h>

#import "RNSentry.h"

@implementation AppDelegate

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  //  UIApplicationState state = [application applicationState];
  //  // user tapped notification while app was in background
  //  if (state == UIApplicationStateInactive || state == UIApplicationStateBackground) {
  //    NSLog(@"background");
  //    // go to screen relevant to Notification content
  //  } else {
  //    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Push Notification" message:@"Push notification received" delegate:nil cancelButtonTitle:@"Ok" otherButtonTitles:nil, nil];
  //    [alert show];
  //    // App is in UIApplicationStateActive (running in foreground)
  //    // perhaps show an UIAlertView
  //  }
  //  [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
  
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
#ifdef DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
#else
  jsCodeLocation = [CodePush bundleURL];
#endif
  
  // **********************************************
  // *** DON'T MISS: THIS IS HOW WE BOOTSTRAP *****
  // **********************************************
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [[UIColor alloc] initWithRed:44.0f/255.0f green:120.0f/255.0f blue:249.0f/255.0f alpha:1];
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];
  
  // Set the needed configurration for PlaidObject
  [[PlaidObject sharedInstance] setPlaidPublicKey:@"8718862d2816f18ab24087db6dc45a"];
  
#ifdef RELEASE
  [[PlaidObject sharedInstance] setPlaidEnviroment:PLKEnvironmentProduction];
#else
  [[PlaidObject sharedInstance] setPlaidEnviroment:PLKEnvironmentSandbox];
#endif
  
  // Add a reference of the root view controller to the plaid object
  [[PlaidObject sharedInstance] setViewControllerReference: self.window.rootViewController];
  
  [RNSentry installWithRootView: self.window.rootViewController];
  
  #ifdef DEBUG
    [RNBranch useTestInstance];
    [RNBranch setDebug];
  #endif
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES]; // <-- add this
  //  [RNBranch initSessionWithLaunchOptions:launchOptions andRegisterDeepLinkHandler:^(NSDictionary *params, NSError *error) {
  //    if (!error && params) {
  //      // params are the deep linked params associated with the link that the user clicked -> was re-directed to this app
  //      // params will be empty if no data found
  //      // ... insert custom logic here ...
  //      NSLog(@"params: %@", params.description);
  //    }
  //  }];
  
//
//  [[FBSDKApplicationDelegate sharedInstance] application:application
//                           didFinishLaunchingWithOptions:launchOptions];
  
  return TRUE;
}

- (void)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  
//  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:app
//                                                                openURL:url
//                                                      sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
//                                                             annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
//                  ];
//
  
  [RNBranch.branch application:app openURL:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey] annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
   ];
  
  if (![RNBranch.branch application:app openURL:url options:options]) {
    // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
    
  }
//  return handled;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {
  return [RNBranch continueUserActivity:userActivity];
}
- (void)applicationDidBecomeActive:(UIApplication *)application {
//  [FBSDKAppEvents activateApp];
}

@end

