/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/jest.config.js',
  configurations: {
    "ios.sim.debug": {
      device: {
        type: "iPhone 14"
      },
      app: {
        binaryPath: "ios/build/Build/Products/Debug-iphonesimulator/tuApp.app",
        build: "xcodebuild -workspace ios/tuApp.xcworkspace -scheme tuApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build"
      }
    },
    "android.emu.debug": {
      device: {
        avdName: "Pixel_4_API_30"
      },
      app: {
        binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
        build: "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug"
      }
    }
  }
};