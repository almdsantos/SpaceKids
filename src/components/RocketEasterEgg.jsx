import React, { useRef, useState, useCallback } from 'react';
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

function Rocket({ onDone }) {
  const posX = useRef(new Animated.Value(0)).current;
  const posY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [msg] = useState(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

  React.useEffect(() => {
    const startX = Math.random() * SW;
    posX.setValue(startX);
    posY.setValue(SH + 60);

    // Gera entre 3 e 6 zigue zagues aleatórios
    const steps = Math.floor(Math.random() * 4) + 3;
    const durStep = Math.floor(Math.random() * 400) + 500;

    const zigzags = Array.from({ length: steps }, () => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const amplitude = Math.random() * 150 + 40;
      return Math.max(20, Math.min(SW - 20, startX + direction * amplitude));
    });

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1.2 + Math.random() * 0.6,
        useNativeDriver: true,
        friction: 4,
      }),
      Animated.sequence(
        zigzags.map(x =>
          Animated.timing(posX, { toValue: x, duration: durStep, useNativeDriver: true })
        )
      ),
      Animated.timing(posY, {
        toValue: -80,
        duration: durStep * steps,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(durStep * (steps - 1)),
        Animated.timing(opacity, { toValue: 0, duration: durStep, useNativeDriver: true }),
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

export default function RocketEasterEgg({ children }) {
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
    <>
      <TouchableOpacity onPress={launch} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
      {rockets.map(id => (
        <Rocket key={id} onDone={() => removeRocket(id)} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  rocket: {
    position: 'absolute',
    zIndex: 9999,
    alignItems: 'center',
  },
  rocketEmoji: {
    fontSize: 36,
  },
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