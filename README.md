# Cheese App

##Install

This doc assumes you have : Git installed, NodeJS v8 (at least) / NPM installed and React Native CLI installed. But also the Android Studio dev environment to run emulator or run the app on your phone through `adb` commands (See https://facebook.github.io/react-native/docs/getting-started.html for more info, tab 'Build with native code').


```
# Run in a terminal
git clone <git repo>
npm install

# In a terminal, run the packager to build Javascript sources - and keep it running while developing
npm run start

# In another terminal
react-native run-android (--variant=release) 
react-native run-ios --device "devideId"
```

Command to run to see React Native debug tools :
```
adb reverse tcp:8081 tcp:8081 && adb shell input keyevent 82
```

## Build the App Package

Ensure that git directory is clean before running next commands with this : `git status`

When ready to build, first ensure you tagged the version of the app with the proper SemVer version, using the npm command `npm version [major|minor|patch]` (pick one of the 3)

`git push origin master` to send all modification to Github
`git push --tags` to send the newly created tag to github

Then for Android, from the `android` folder, run the following command (npm run start command must be still running in the background):
`./gradlew assembleRelease -x lintVitalRelease -PCHEESEAPP_RELEASE_STORE_PASSWORD='<store_password>' -PCHEESEAPP_RELEASE_KEY_PASSWORD='<key_password>'`

The App must be signed by the appropriate keystore (See https://facebook.github.io/react-native/docs/signed-apk-android for more info), be sure to have it in the correct path to be found by gradle (currently : /android/app/cheese-app-release.keystore). The build will then be in `./android/app/build/outputs/apk/release/`


## Maintenance

If the need arises to change the app icon, use RN Toolbox to regenerate the icon set for android & ios : `npm install -g yo generator-rn-toolbox` and check the docs on github