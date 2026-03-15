import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity,
  StyleSheet, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

const { width: SW } = Dimensions.get('window');

function HeroItem({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(item)} activeOpacity={0.9}>
      <Image source={{ uri: item.banner }} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(5,13,26,0.6)', 'rgba(5,13,26,0.95)']}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item.type === 'movie' ? '🎬 FILME' : '📺 SÉRIE'}
          </Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <TouchableOpacity style={styles.playBtn} onPress={() => onPress(item)}>
          <Text style={styles.playText}>▶  Assistir agora</Text>
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
      <View style={styles.dots}>
        {items.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  item: { width: SW, height: 220, position: 'relative' },
  image: { width: '100%', height: '100%' },
  gradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '75%',
  },
  content: { position: 'absolute', bottom: 36, left: 16, right: 16 },
  badge: {
    backgroundColor: colors.purple, alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginBottom: 6,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  title: {
    color: colors.gold, fontSize: 22, fontWeight: '900', letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 2 }, marginBottom: 10,
  },
  playBtn: {
    backgroundColor: colors.neonGreen, paddingHorizontal: 18,
    paddingVertical: 8, borderRadius: 24, alignSelf: 'flex-start',
  },
  playText: { color: '#050d1a', fontWeight: '900', fontSize: 13 },
  dots: {
    position: 'absolute', bottom: 14, alignSelf: 'center',
    flexDirection: 'row', gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { backgroundColor: colors.neonGreen, width: 18 },
});