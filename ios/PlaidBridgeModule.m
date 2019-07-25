//
//  PlaidBridgeModule.m
//  PlaidProject
//
//  Created by Angelo Espiritu on 1/4/18.
//

#import "PlaidBridgeModule.h"
#import <React/RCTLog.h>

#import "PlaidObject.h"

@interface PlaidBridgeModule()
@property RCTResponseSenderBlock savedCallBack;
@end

@implementation PlaidBridgeModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(checkIfPlaidConfigReady:(RCTResponseSenderBlock)callback) {
  BOOL isConfigReady = [[PlaidObject sharedInstance] isConfigReady];
  callback(@[[NSNumber numberWithBool: isConfigReady]]);
}

RCT_EXPORT_METHOD(initializePlaidAPI:(RCTResponseSenderBlock)callback) {
  self.savedCallBack = callback;
  [[PlaidObject sharedInstance] setupPlaidLinkWithCustomConfiguration];
  [[PlaidObject sharedInstance] setPlaidBridgeInstance:self];
}

RCT_EXPORT_METHOD(showPlaidViewControllerWithSelectAccount:(BOOL)selectAccount callback:(RCTResponseSenderBlock)callback) {
  self.savedCallBack = callback;
  [[PlaidObject sharedInstance] presentPlaidViewController:selectAccount];
  [[PlaidObject sharedInstance] setPlaidBridgeInstance:self];
}

RCT_EXPORT_METHOD(showPlaidViewController:(RCTResponseSenderBlock)callback) {
  UIViewController *vc = [UIApplication sharedApplication].delegate.window.rootViewController;
  [[PlaidObject sharedInstance] setViewControllerReference:vc];
  self.savedCallBack = callback;
  [[PlaidObject sharedInstance] presentPlaidViewController];
  [[PlaidObject sharedInstance] setPlaidBridgeInstance:self];
}

RCT_EXPORT_METHOD(showPlaidViewControllerForUpdateMode:(NSString*)publicToken callback:(RCTResponseSenderBlock)callback) {
  UIViewController *vc = [UIApplication sharedApplication].delegate.window.rootViewController;
  [[PlaidObject sharedInstance] setViewControllerReference:vc];
  self.savedCallBack = callback;
  [[PlaidObject sharedInstance] presentPlaidLinkInUpdateMode:publicToken];
  [[PlaidObject sharedInstance] setPlaidBridgeInstance:self];
}

- (void)didGetResultFromPlaid:(NSArray *) response {
  self.savedCallBack(response);
  self.savedCallBack = nil;
}

@end
