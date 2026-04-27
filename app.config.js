export default {
  expo: {
    name: "RentBeta",
    slug: "rent-beta",
    version: "1.0.27",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.rentbeta.africa",
      buildNumber: "9",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.rentbeta.africa",
      versionCode: 31,
      compileSdkVersion: 35,
      targetSdkVersion: 35,
      buildToolsVersion: "35.0.0",
      // Force the build to use API 35
      gradleProperties: {
        "android.compileSdkVersion": "35",
        "android.targetSdkVersion": "35",
        "android.useAndroidX": "true",
        "android.enableJetifier": "true"
      },
      // Additional configuration to force API 35
      minSdkVersion: 24,
      permissions: []
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "4399be51-0678-49b3-a095-fd9516fcc59b"
      }
    },
    plugins: [
      "expo-asset",
      "expo-font",
      "@react-native-community/datetimepicker",
      "expo-sharing"
    ]
  }
};
