fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew cask install fastlane`

# Available Actions
## iOS
### ios version_bump_project
```
fastlane ios version_bump_project
```
Increment the version and build number
### ios generateApp
```
fastlane ios generateApp
```

### ios testFlightLane
```
fastlane ios testFlightLane
```

### ios release
```
fastlane ios release
```
Deploy a new version to the App Store
### ios lovedDeploy
```
fastlane ios lovedDeploy
```
lovedDeploy
### ios ipaForBrowserstack
```
fastlane ios ipaForBrowserstack
```

### ios getProductionCert
```
fastlane ios getProductionCert
```

### ios getDevCert
```
fastlane ios getDevCert
```


----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
