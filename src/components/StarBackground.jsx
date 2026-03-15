import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

export default function StarBackground({ count = 70 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 0.8,
      opacity: Math.random() * 0.6 + 0.2,
    })),
  [count]);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {stars.map(star => (
        <View
          key={star.id}
          style={{
            position: 'absolute',
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            borderRadius: star.size,
            backgroundColor: '#ffffff',
            opacity: star.opacity,
          }}
        />
      ))}
      {[...Array(5)].map((_, i) => (
        <View
          key={`neon-${i}`}
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: 3,
            height: 3,
            borderRadius: 3,
            backgroundColor: '#00ff88',
            opacity: 0.5,
          }}
        />
      ))}
    </View>
  );
}