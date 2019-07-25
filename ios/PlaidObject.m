//
//  PlaidObject.m
//  ProjectPlaid
//
//  Created by Angelo Espiritu on 1/4/18.
//

#import "PlaidObject.h"

@interface PlaidObject()
@property (readwrite)BOOL isConfigReady;
@end

@interface PlaidObject (PLKPlaidLinkViewDelegate) <PLKPlaidLinkViewDelegate>
@end

@implementation PlaidObject

+ (id)sharedInstance {
  static PlaidObject *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[self alloc] init];
  });
  return sharedInstance;
}

- (void)setupPlaidLinkWithCustomConfiguration {

  PLKConfiguration* linkConfiguration;
  @try {
    linkConfiguration = [[PLKConfiguration alloc] initWithKey:self.plaidPublicKey
                                                          env:self.plaidEnviroment
                                                      product:PLKProductAuth];
    linkConfiguration.clientName = @"Loved";
    __weak PlaidObject *weakSelf = self;
    [PLKPlaidLink setupWithConfiguration:linkConfiguration completion:^(BOOL success, NSError * _Nullable error) {
      if (success) {
        NSLog(@"Plaid Link setup was successful");

        weakSelf.isConfigReady = YES;
      }
      else {
        NSLog(@"Unable to setup Plaid Link due to: %@", [error localizedDescription]);
        weakSelf.isConfigReady = NO;
      }

      [weakSelf.plaidBridgeInstance didGetResultFromPlaid:@[[NSNumber numberWithBool:weakSelf.isConfigReady]]];
    }];
  } @catch (NSException *exception) {
    NSLog(@"Invalid configuration: %@", exception);
    self.isConfigReady = NO;
  }
}
- (void)presentPlaidViewController {
  PLKConfiguration* linkConfiguration;
  @try {
    linkConfiguration = [[PLKConfiguration alloc] initWithKey:self.plaidPublicKey env:self.plaidEnviroment product:PLKProductAuth];
    linkConfiguration.clientName = @"Loved";
    id<PLKPlaidLinkViewDelegate> linkViewDelegate  = self;
    PLKPlaidLinkViewController* linkViewController = [[PLKPlaidLinkViewController alloc] initWithConfiguration:linkConfiguration delegate:linkViewDelegate];
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
      linkViewController.modalPresentationStyle = UIModalPresentationFormSheet;
    }

    [self.viewControllerReference presentViewController:linkViewController animated:YES completion:nil];
  } @catch (NSException *exception) {
    NSLog(@"Invalid configuration: %@", exception);
  }
}

- (void)presentPlaidViewController:(BOOL)selectAccount {

  PLKConfiguration* linkConfiguration;
  @try {
    linkConfiguration = [[PLKConfiguration alloc] initWithKey:self.plaidPublicKey env:self.plaidEnviroment product:PLKProductAuth selectAccount:selectAccount longtailAuth:NO apiVersion:PLKAPILatest];
    linkConfiguration.clientName = @"Loved";
    id<PLKPlaidLinkViewDelegate> linkViewDelegate  = self;
    PLKPlaidLinkViewController* linkViewController = [[PLKPlaidLinkViewController alloc] initWithConfiguration:linkConfiguration delegate:linkViewDelegate];
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
      linkViewController.modalPresentationStyle = UIModalPresentationFormSheet;
    }

    [self.viewControllerReference presentViewController:linkViewController animated:YES completion:nil];
  } @catch (NSException *exception) {
    NSLog(@"Invalid configuration: %@", exception);
  }
}

#pragma mark Start Plaid Link in update mode
- (void)presentPlaidLinkInUpdateMode:(NSString*)publicToken {
  PLKConfiguration* linkConfiguration;

  @try {
 // <!-- SMARTDOWN_UPDATE_MODE -->

    linkConfiguration = [[PLKConfiguration alloc] initWithKey:self.plaidPublicKey env:self.plaidEnviroment product:PLKProductAuth];
    linkConfiguration.clientName = @"Loved";
    id<PLKPlaidLinkViewDelegate> linkViewDelegate  = self;
    PLKPlaidLinkViewController* linkViewController = [[PLKPlaidLinkViewController alloc] initWithPublicToken:publicToken configuration:linkConfiguration delegate:linkViewDelegate];
//    PLKPlaidLinkViewController* linkViewController = [[PLKPlaidLinkViewController alloc] initWithConfiguration:linkConfiguration delegate:linkViewDelegate];
      [self.viewControllerReference presentViewController:linkViewController animated:YES completion:nil];
  } @catch (NSException *exception) {
    NSLog(@"Invalid configuration: %@", exception);
  }
//[self presentViewController:linkViewController animated:YES completion:nil];
  // <!-- SMARTDOWN_UPDATE_MODE -->

}

#pragma mark Utility
- (NSString*) dictionaryToJSONString:(NSDictionary*)data {
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:data
                                                     options:NSJSONWritingPrettyPrinted error:nil];
  return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

@end

@implementation PlaidObject (PLKPlaidLinkViewDelegate)
- (void)linkViewController:(PLKPlaidLinkViewController*)linkViewController
 didSucceedWithPublicToken:(NSString*)publicToken
                  metadata:(NSDictionary<NSString*,id>* _Nullable)metadata {

  [self.viewControllerReference dismissViewControllerAnimated:YES completion:^{
    NSString* jsonString = [self dictionaryToJSONString:metadata];
    [self.plaidBridgeInstance didGetResultFromPlaid:@[[NSNull null], publicToken, jsonString]];
  }];
}

- (void)linkViewController:(PLKPlaidLinkViewController*)linkViewController
          didExitWithError:(NSError* _Nullable)error
                  metadata:(NSDictionary<NSString*,id>* _Nullable)metadata {
  [self.viewControllerReference dismissViewControllerAnimated:YES completion:^{
    NSString* jsonString = [self dictionaryToJSONString:metadata];
    if (error) {
      [self.plaidBridgeInstance didGetResultFromPlaid:@[[error localizedDescription], [NSNull null], jsonString]];
    } else {
      [self.plaidBridgeInstance didGetResultFromPlaid:@[[NSNull null], [NSNull null], metadata]];
    }
  }];
}

- (void)linkViewController:(PLKPlaidLinkViewController*)linkViewController
            didHandleEvent:(NSString*)event
                  metadata:(NSDictionary<NSString*,id>* _Nullable)metadata {
  NSLog(@"Link event: %@\nmetadata: %@", event, metadata);
}
@end
