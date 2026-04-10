import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import { FavoritesProvider } from './src/context/FavoritesContext';
import { RocketProvider } from './src/components/RocketEasterEgg';
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

function TabIcon({ name, focused, color }) {
  return (
    <View style={[styles.tabIconWrap, focused && styles.tabIconActive]}>
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: Platform.OS === 'android' ? 70 : 88,
            paddingBottom: Platform.OS === 'android' ? 12 : 30,
          }
        ],
        tabBarActiveTintColor: colors.neonGreen,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => {
          const icons = {
            HomeTab:      focused ? 'home'     : 'home-outline',
            SearchTab:    focused ? 'search'   : 'search-outline',
            FavoritesTab: focused ? 'bookmark' : 'bookmark-outline',
          };
          return <TabIcon name={icons[route.name]} focused={focused} color={color} />;
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
            <RocketProvider>
              <StatusBar style="light" />
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="MovieDetail"  component={MovieDetailScreen}  options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="SeriesDetail" component={SeriesDetailScreen} options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="GamesScreen"  component={GamesScreen}        options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="Player"       component={PlayerScreen}       options={{ animation: 'slide_from_bottom' }} />
                <Stack.Screen name="GamePlayer"   component={GamePlayerScreen}   options={{ animation: 'slide_from_bottom' }} />
              </Stack.Navigator>
            </RocketProvider>
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
    borderTopColor: colors.borderCard,
    shadowColor: colors.neonGreen,
    shadowRadius: 12,
    shadowOpacity: 0.15,
    elevation: 20,
  },
  tabLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  tabIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  tabIconActive: { backgroundColor: colors.neonGreenDim, borderWidth: 1, borderColor: colors.borderBright },
});
