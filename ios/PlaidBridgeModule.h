//
//  PlaidBridgeModule.h
//  PlaidProject
//
//  Created by Angelo Espiritu on 1/4/18.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface PlaidBridgeModule : NSObject<RCTBridgeModule>
- (void)didGetResultFromPlaid:(NSArray *) response; // Pass the response coming form back to the react native
@end
