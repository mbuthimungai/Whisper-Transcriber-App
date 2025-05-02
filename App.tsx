import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import LiveTranscribeScreen from "./src/screens/LiveTranscribeScreen";
import FileUploadScreen from "./src/screens/FileUploadScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap = "mic";

                if (route.name === "Live") {
                  iconName = focused ? "mic" : "mic-outline";
                } else if (route.name === "Upload") {
                  iconName = focused ? "cloud-upload" : "cloud-upload-outline";
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "#007AFF",
              tabBarInactiveTintColor: "gray",
            })}
          >
            <Tab.Screen name="Live" component={LiveTranscribeScreen} />
            <Tab.Screen name="Upload" component={FileUploadScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
