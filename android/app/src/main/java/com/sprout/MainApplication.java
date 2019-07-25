package com.sprout;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.beefe.picker.PickerViewPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import io.github.traviskn.rnuuidgenerator.RNUUIDGeneratorPackage;
import cl.json.RNSharePackage;
import com.horcrux.svg.SvgPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.tkporter.sendsms.SendSMSPackage;
import com.lynxit.contactswrapper.ContactsWrapperPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.oblador.vectoricons.VectorIconsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import io.sentry.RNSentryPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.smixx.fabric.FabricPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.RNTextInputMask.RNTextInputMaskPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.kevinejohn.RNMixpanel.RNMixpanel;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import org.wonday.pdf.RCTPdfView;
import com.microsoft.codepush.react.CodePush;
import com.reactnativenavigation.NavigationReactPackage;
import com.airlabsinc.RNAWSCognitoPackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.auth0.lock.react.LockReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new FastImageViewPackage(),
            new PickerViewPackage(),
            new RNGestureHandlerPackage(),
            new ReanimatedPackage(),
            new RNUUIDGeneratorPackage(),
            new RNSharePackage(),
            new SvgPackage(),
            new FingerprintAuthPackage(),
            SendSMSPackage.getInstance(),
            new ContactsWrapperPackage(),
            new ReactNativeContacts(),
            new VectorIconsPackage(),
            new MapsPackage(),
            new RNGeocoderPackage(),
            new GoogleAnalyticsBridgePackage(),
            new FBSDKPackage(),
            new RNSentryPackage(),
            new RNSpinkitPackage(),
            new FabricPackage(),
            new ReactVideoPackage(),
            new LottiePackage(),
            new RNTextInputMaskPackage(),
            new VectorIconsPackage(),
            new RNFetchBlobPackage(),
            new RNMixpanel(),
            new ReactNativePushNotificationPackage(),
            new RCTPdfView(),
            new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
            new NavigationReactPackage(),
            new RNAWSCognitoPackage(),
            new SvgPackage(),
            new ImagePickerPackage(),
            new LinearGradientPackage(),
            new LockReactPackage(),
            new RNDeviceInfo(),
            new ReactNativeConfigPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
