import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');

export default function StarBackground({ count = 100 }) {
  const stars = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.7 + 0.1,
        isNeon: Math.random() > 0.85,
        isPurple: Math.random() > 0.92,
      });
    }
    return items;
  }, [count]);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Gradiente de fundo espacial */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {/* Nebulosa sutil */}
      <View style={styles.nebula1} />
      <View style={styles.nebula2} />

      {/* Estrelas */}
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
            backgroundColor: star.isNeon ? '#00ff88' : star.isPurple ? '#a855f7' : '#ffffff',
            opacity: star.opacity,
            shadowColor: star.isNeon ? '#00ff88' : star.isPurple ? '#a855f7' : '#ffffff',
            shadowRadius: star.isNeon ? 4 : 2,
            shadowOpacity: star.isNeon ? 0.8 : 0.3,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bgTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '50%',
    backgroundColor: 'rgba(10, 5, 30, 0.4)',
  },
  bgBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '50%',
    backgroundColor: 'rgba(5, 13, 26, 0.3)',
  },
  nebula1: {
    position: 'absolute',
    top: '10%', right: '-20%',
    width: SW * 0.7, height: SW * 0.7,
    borderRadius: SW * 0.35,
    backgroundColor: 'rgba(124, 58, 237, 0.06)',
  },
  nebula2: {
    position: 'absolute',
    bottom: '20%', left: '-15%',
    width: SW * 0.6, height: SW * 0.6,
    borderRadius: SW * 0.3,
    backgroundColor: 'rgba(0, 255, 136, 0.04)',
  },
});