import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity,
  StyleSheet, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, glow } from '../theme';

const { width: SW } = Dimensions.get('window');

function HeroItem({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(item)} activeOpacity={0.9}>
      <Image source={{ uri: item.banner }} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(3,11,24,0.5)', 'rgba(3,11,24,0.98)']}
        style={styles.gradient}
      />

      {/* Borda neon em cima */}
      <View style={styles.topBorder} />

      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item.type === 'movie' ? '🎬 FILME' : '📺 SÉRIE'}
          </Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <TouchableOpacity style={styles.playBtn} onPress={() => onPress(item)}>
          <Text style={styles.playBtnText}>▶  Assistir agora</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function HeroBanner({ items = [], onPress }) {
  const listRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % items.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  const onScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SW);
    setActiveIndex(idx);
  };

  if (!items.length) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={i => i.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => <HeroItem item={item} onPress={onPress} />}
        getItemLayout={(_, index) => ({ length: SW, offset: SW * index, index })}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {items.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>

      {/* Borda neon embaixo */}
      <View style={styles.bottomBorder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  item: { width: SW, height: 240, position: 'relative' },
  image: { width: '100%', height: '100%' },
  gradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '80%',
  },
  topBorder: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 2, backgroundColor: colors.neonGreen, opacity: 0.4,
  },
  content: {
    position: 'absolute', bottom: 40, left: 16, right: 16,
  },
  badge: {
    backgroundColor: colors.purple,
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 20, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.5)',
    ...glow.purple,
  },
  badgeText: {
    color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 0.8,
  },
  title: {
    color: colors.gold, fontSize: 24, fontWeight: '900',
    letterSpacing: 0.3, marginBottom: 12,
    textShadowColor: 'rgba(255,215,0,0.4)',
    textShadowRadius: 10, textShadowOffset: { width: 0, height: 0 },
  },
  playBtn: {
    backgroundColor: colors.neonGreen,
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 24, alignSelf: 'flex-start',
    ...glow.green,
  },
  playBtnText: {
    color: '#030b18', fontWeight: '900', fontSize: 13, letterSpacing: 0.5,
  },
  dots: {
    position: 'absolute', bottom: 16,
    alignSelf: 'center', flexDirection: 'row', gap: 6,
  },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: colors.neonGreen,
    width: 20, borderRadius: 3,
    shadowColor: colors.neonGreen,
    shadowRadius: 6, shadowOpacity: 1,
  },
  bottomBorder: {
    height: 1, backgroundColor: colors.neonGreen, opacity: 0.2,
    shadowColor: colors.neonGreen, shadowRadius: 4, shadowOpacity: 1,
  },
});