import React, { useRef, useState, useCallback, createContext, useContext } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, Modal, Easing, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme'; // Importação direta como está no seu arquivo
import { useContent } from '../hooks/useContent';
import { useNavigation } from '@react-navigation/native';

const { width: SW, height: SH } = Dimensions.get('window');
const RocketContext = createContext(null);
export const useRocket = () => useContext(RocketContext);

export function RocketProvider({ children }) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [randomContent, setRandomContent] = useState(null);
  const { data } = useContent();
  const navigation = useNavigation();

  const rocketY = useRef(new Animated.Value(SH)).current;
  const rocketX = useRef(new Animated.Value(0)).current;
  const rocketRotate = useRef(new Animated.Value(0)).current;
  const rocketScale = useRef(new Animated.Value(1)).current;
  const thumbScale = useRef(new Animated.Value(0)).current;
  const thumbOpacity = useRef(new Animated.Value(0)).current;

  const launch = useCallback(() => {
    if (isLaunching || !!randomContent) return;
    const allItems = [
      ...(data?.movies || []), 
      ...(data?.series || []), 
      ...(data?.games?.educational || []), 
      ...(data?.games?.puzzle || []), 
      ...(data?.games?.arcade || [])
    ];
    if (allItems.length === 0) return;

    const chosen = allItems[Math.floor(Math.random() * allItems.length)];
    setIsLaunching(true);
    setRandomContent(chosen);
    
    rocketY.setValue(SH * 0.8); 
    rocketX.setValue(0);
    rocketRotate.setValue(0);
    rocketScale.setValue(1);

    Animated.parallel([
      Animated.timing(rocketY, {
        toValue: -SH * 0.2,
        duration: 2000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(rocketX, { toValue: SW / 2 + 50, duration: 500, useNativeDriver: true }),
        Animated.timing(rocketX, { toValue: SW / 2 - 110, duration: 600, useNativeDriver: true }),
        Animated.timing(rocketX, { toValue: SW / 2 - 30, duration: 900, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(rocketRotate, { toValue: 15, duration: 500, useNativeDriver: true }),
        Animated.timing(rocketRotate, { toValue: -15, duration: 600, useNativeDriver: true }),
        Animated.timing(rocketRotate, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ]).start(() => {
      Animated.timing(rocketScale, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setIsLaunching(false);
        triggerExplosion();
      });
    });
  }, [isLaunching, randomContent, data]);

  const triggerExplosion = () => {
    thumbScale.setValue(0);
    thumbOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(thumbScale, { toValue: 1, duration: 500, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      Animated.timing(thumbOpacity, { toValue: 1, duration: 300, useNativeDriver: true })
    ]).start();
  };

  const isGame = randomContent?.category || randomContent?.type === 'game';
  const buttonText = isGame ? 'JOGAR AGORA! 🎮' : 'ASSISTIR AGORA! 🎬';

  const spin = rocketRotate.interpolate({
    inputRange: [-15, 15],
    outputRange: ['-15deg', '15deg']
  });

  return (
    <RocketContext.Provider value={{ launch }}>
      <View style={{ flex: 1 }}>
        {children}
        <Modal transparent visible={isLaunching || !!randomContent} animationType="none">
          <View style={styles.modalContainer}>
            {isLaunching && (
              <Animated.View 
                style={[
                  styles.rocket, 
                  { 
                    transform: [
                      { translateY: rocketY }, 
                      { translateX: rocketX },
                      { rotate: spin },
                      { scale: rocketScale }
                    ] 
                  }
                ]}
              >
                <MaterialCommunityIcons 
                  name="rocket-launch" 
                  size={80} 
                  color={colors.white} 
                  style={styles.rocketGlow}
                />
              </Animated.View>
            )}
            {randomContent && !isLaunching && (
              <Animated.View style={[styles.explosionBox, { opacity: thumbOpacity, transform: [{ scale: thumbScale }] }]}>
                <Image source={{ uri: randomContent.thumbnail }} style={styles.thumb} resizeMode="cover" />
                <Text style={styles.titleText}>{randomContent.title}</Text>
                <TouchableOpacity 
                  style={styles.playBtn} 
                  onPress={() => { 
                    const routeName = isGame ? 'GamePlayer' : (randomContent.type === 'movie' ? 'MovieDetail' : 'SeriesDetail');
                    const params = isGame ? { game: randomContent } : (randomContent.type === 'movie' ? { movie: randomContent } : { series: randomContent });
                    navigation.navigate(routeName, params); 
                    setRandomContent(null); 
                  }}
                >
                  <Text style={styles.playText}>{buttonText}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setRandomContent(null)}>
                  <MaterialCommunityIcons name="close-circle" size={40} color={colors.white} />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </Modal>
      </View>
    </RocketContext.Provider>
  );
}

export default function RocketEasterEgg({ children }) {
  const { launch } = useRocket();
  return <TouchableOpacity onPress={launch} activeOpacity={0.7}>{children}</TouchableOpacity>;
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: 'rgba(3, 11, 24, 0.9)', justifyContent: 'center', alignItems: 'center' },
  rocket: { position: 'absolute', alignItems: 'center' },
  rocketGlow: {
    shadowColor: colors.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    // Para Android:
    textShadowColor: colors.neonGreen,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  explosionBox: { 
    width: '85%', 
    backgroundColor: colors.bgCard, 
    borderRadius: 20, 
    padding: 20, 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: colors.neonGreen, 
    shadowColor: colors.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  thumb: { width: '100%', height: 180, borderRadius: 10, marginBottom: 15 },
  titleText: { color: colors.white, fontSize: 20, fontWeight: '900', textAlign: 'center', marginBottom: 20 },
  playBtn: { backgroundColor: colors.neonGreen, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  playText: { color: colors.bg, fontWeight: 'bold' },
  closeBtn: { position: 'absolute', top: -15, right: -15, backgroundColor: colors.bg, borderRadius: 20 }
});