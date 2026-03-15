import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import { FavoritesProvider } from './src/context/FavoritesContext';
import { colors } from './src/theme';

import HomeScreen         from './src/screens/HomeScreen';
import GamesScreen        from './src/screens/GamesScreen';
import SearchScreen       from './src/screens/SearchScreen';
import FavoritesScreen    from './src/screens/FavoritesScreen';
import MovieDetailScreen  from './src/screens/MovieDetailScreen';
import SeriesDetailScreen from './src/screens/SeriesDetailScreen';
import PlayerScreen       from './src/screens/PlayerScreen';
import GamePlayerScreen   from './src/screens/GamePlayerScreen';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.neonGreen,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => {
          const icons = {
            HomeTab:      focused ? 'home'     : 'home-outline',
            SearchTab:    focused ? 'search'   : 'search-outline',
            FavoritesTab: focused ? 'bookmark' : 'bookmark-outline',
          };
          return (
            <View style={focused ? styles.tabIconActive : null}>
              <Ionicons name={icons[route.name]} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab"      component={HomeScreen}      options={{ title: 'Home' }} />
      <Tab.Screen name="SearchTab"    component={SearchScreen}    options={{ title: 'Buscar' }} />
      <Tab.Screen name="FavoritesTab" component={FavoritesScreen} options={{ title: 'Favoritos' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FavoritesProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Main"         component={TabNavigator} />
              <Stack.Screen name="MovieDetail"  component={MovieDetailScreen}
                options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="SeriesDetail" component={SeriesDetailScreen}
                options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="GamesScreen"  component={GamesScreen}
                options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="Player"       component={PlayerScreen}
                options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="GamePlayer"   component={GamePlayerScreen}
                options={{ animation: 'slide_from_bottom' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </FavoritesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bgHeader,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: 6,
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  tabIconActive: {
    backgroundColor: colors.neonGreenDim,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
});