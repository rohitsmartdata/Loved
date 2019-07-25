//
//  PlaidObject.h
//  ProjectPlaid
//
//  Created by Angelo Espiritu on 1/4/18.
//

#import <LinkKit/LinkKit.h>
#import "PlaidBridgeModule.h"

@interface PlaidObject : NSObject
@property UIViewController* viewControllerReference; // Current view controller reference to the plaidinstance
@property PlaidBridgeModule* plaidBridgeInstance; // Current plaid bridge module reference to the plaidinstance
@property NSString* plaidPublicKey; // Public key that is coming from the Plaid dashboard
@property PLKEnvironment plaidEnviroment; // Environment settings of Plaid API
@property (readonly)BOOL isConfigReady; // Check if config is ready

+ (id)sharedInstance; // Singleton method of plaid object

- (void)presentPlaidViewController; // Show plaid view controller
- (void)presentPlaidViewController:(BOOL)selectAccount;  // Show plaid view controller with the old method in linkkit framework
- (void)presentPlaidLinkInUpdateMode:(NSString*)publicToken;  // Show plaid view controller In Update mode
- (void)setupPlaidLinkWithCustomConfiguration; // Set up plaid configuration
@end
