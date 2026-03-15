import React, { useRef, useState, useCallback, createContext, useContext } from 'react';
import {
  Animated, Dimensions, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');

const MESSAGES = [
  '🚀 Wheeeee!',
  '🌟 Rumo às estrelas!',
  '👨‍🚀 Houston, aqui vamos nós!',
  '🛸 3... 2... 1... Decolar!',
  '💫 Velocidade warp!',
  '🪐 Próxima parada: Saturno!',
];

const RocketContext = createContext(null);
export const useRocket = () => useContext(RocketContext);

function Rocket({ onDone }) {
  const posX = useRef(new Animated.Value(0)).current;
  const posY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [msg] = useState(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

  React.useEffect(() => {
    // Começa em qualquer borda da tela
    const side = Math.floor(Math.random() * 4);
    let startX, startY;
    if (side === 0)      { startX = Math.random() * SW; startY = SH + 60; }
    else if (side === 1) { startX = Math.random() * SW; startY = -60; }
    else if (side === 2) { startX = -60;      startY = Math.random() * SH; }
    else                 { startX = SW + 60;  startY = Math.random() * SH; }

    posX.setValue(startX);
    posY.setValue(startY);

    // Destino final em qualquer lugar da tela
    const endX = Math.random() * SW;
    const endY = Math.random() * SH;

    // Zigue zague no meio do caminho
    const steps = Math.floor(Math.random() * 4) + 4;
    const durStep = Math.floor(Math.random() * 600) + 800; // 800ms a 1400ms — devagar!

    const midXs = Array.from({ length: steps - 1 }, () => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const amplitude = Math.random() * 130 + 50;
      return Math.max(20, Math.min(SW - 20, startX + direction * amplitude));
    });

    const midYs = Array.from({ length: steps - 1 }, () => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const amplitude = Math.random() * 100 + 40;
      return Math.max(20, Math.min(SH - 20, startY + direction * amplitude));
    });

    const allX = [...midXs, endX];
    const allY = [...midYs, endY];

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1.0 + Math.random() * 0.5,
        useNativeDriver: true, friction: 5,
      }),
      Animated.sequence(
        allX.map(x =>
          Animated.timing(posX, { toValue: x, duration: durStep, useNativeDriver: true })
        )
      ),
      Animated.sequence(
        allY.map(y =>
          Animated.timing(posY, { toValue: y, duration: durStep, useNativeDriver: true })
        )
      ),
      Animated.sequence([
        Animated.delay(durStep * (steps - 1)),
        Animated.timing(opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
    ]).start(onDone);
  }, []);

  return (
    <Animated.View
      style={[
        styles.rocket,
        { transform: [{ translateX: posX }, { translateY: posY }, { scale }], opacity },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.rocketEmoji}>🚀</Text>
      <Text style={styles.msg}>{msg}</Text>
    </Animated.View>
  );
}

export function RocketProvider({ children }) {
  const [rockets, setRockets] = useState([]);
  const counter = useRef(0);

  const launch = useCallback(() => {
    const id = ++counter.current;
    setRockets(prev => [...prev, id]);
  }, []);

  const removeRocket = useCallback((id) => {
    setRockets(prev => prev.filter(r => r !== id));
  }, []);

  return (
    <RocketContext.Provider value={{ launch }}>
      <View style={{ flex: 1 }}>
        {children}
        {rockets.map(id => (
          <Rocket key={id} onDone={() => removeRocket(id)} />
        ))}
      </View>
    </RocketContext.Provider>
  );
}

export default function RocketEasterEgg({ children }) {
  const { launch } = useRocket();
  return (
    <TouchableOpacity onPress={launch} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rocket: {
    position: 'absolute',
    zIndex: 9999,
    elevation: 9999,
    alignItems: 'center',
  },
  rocketEmoji: { fontSize: 36 },
  msg: {
    position: 'absolute',
    top: -24,
    color: '#ffd700',
    fontSize: 12,
    fontWeight: '800',
    width: 140,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
});