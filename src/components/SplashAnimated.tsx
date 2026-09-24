import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  RadialGradient,
  Stop,
} from "react-native-svg";

interface Props {
  onFinish: () => void;
}

const GREEN = "#00e5a0";
const WHITE = "#ffffff";
const BG = "#060810";

const TOP = { x: 100, y: 18 };
const LEFT = { x: 22, y: 158 };
const RIGHT = { x: 178, y: 158 };
const DOT_R = 9;

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function SplashAnimated({ onFinish }: Props) {
  const lineLeftOpacity = useRef(new Animated.Value(0)).current;
  const lineRightOpacity = useRef(new Animated.Value(0)).current;
  const lineBaseOpacity = useRef(new Animated.Value(0)).current;
  const dotTopOpacity = useRef(new Animated.Value(0)).current;
  const dotLeftOpacity = useRef(new Animated.Value(0)).current;
  const dotRightOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(0.7)).current;

  const fadeIn = (anim: Animated.Value, duration = 300) =>
    Animated.timing(anim, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

  useEffect(() => {
    Animated.sequence([
      fadeIn(dotTopOpacity, 250),
      Animated.parallel([
        fadeIn(lineLeftOpacity, 400),
        fadeIn(lineRightOpacity, 400),
      ]),
      Animated.parallel([
        fadeIn(dotLeftOpacity, 250),
        fadeIn(dotRightOpacity, 250),
        fadeIn(lineBaseOpacity, 350),
      ]),
      fadeIn(glowOpacity, 500),
      fadeIn(textOpacity, 350),
      fadeIn(subtitleOpacity, 300),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0.6,
            duration: 600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 },
      ),
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, []);

  const glowHalo = pulse.interpolate({
    inputRange: [0.6, 1],
    outputRange: [0.05, 0.18],
  });
  // Estrada removida da marca

  return (
    <Animated.View style={[s.container, { opacity: exitOpacity }]}>
      <Svg width={220} height={200} viewBox="0 0 200 185">
        <Defs>
          <RadialGradient id="centerGlow" cx="50%" cy="20%" r="40%">
            <Stop offset="0%" stopColor={WHITE} stopOpacity="1" />
            <Stop offset="30%" stopColor={GREEN} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="bgGlow" cx="50%" cy="60%" r="50%">
            <Stop offset="0%" stopColor={GREEN} stopOpacity="0.12" />
            <Stop offset="100%" stopColor={GREEN} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Glow de fundo */}
        <AnimatedCircle
          cx="100"
          cy="110"
          r="90"
          fill="url(#bgGlow)"
          opacity={pulse}
        />

        {/* === Linhas do triângulo === */}
        <AnimatedLine
          x1={TOP.x}
          y1={TOP.y}
          x2={LEFT.x}
          y2={LEFT.y}
          stroke={GREEN}
          strokeWidth="14"
          strokeLinecap="round"
          opacity={Animated.multiply(lineLeftOpacity, glowHalo)}
        />
        <AnimatedLine
          x1={TOP.x}
          y1={TOP.y}
          x2={LEFT.x}
          y2={LEFT.y}
          stroke={GREEN}
          strokeWidth="7"
          strokeLinecap="round"
          opacity={Animated.multiply(lineLeftOpacity, pulse)}
        />

        <AnimatedLine
          x1={TOP.x}
          y1={TOP.y}
          x2={RIGHT.x}
          y2={RIGHT.y}
          stroke={GREEN}
          strokeWidth="14"
          strokeLinecap="round"
          opacity={Animated.multiply(lineRightOpacity, glowHalo)}
        />
        <AnimatedLine
          x1={TOP.x}
          y1={TOP.y}
          x2={RIGHT.x}
          y2={RIGHT.y}
          stroke={GREEN}
          strokeWidth="7"
          strokeLinecap="round"
          opacity={Animated.multiply(lineRightOpacity, pulse)}
        />

        <AnimatedLine
          x1={LEFT.x}
          y1={LEFT.y}
          x2={RIGHT.x}
          y2={RIGHT.y}
          stroke={GREEN}
          strokeWidth="14"
          strokeLinecap="round"
          opacity={Animated.multiply(lineBaseOpacity, glowHalo)}
        />
        <AnimatedLine
          x1={LEFT.x}
          y1={LEFT.y}
          x2={RIGHT.x}
          y2={RIGHT.y}
          stroke={GREEN}
          strokeWidth="7"
          strokeLinecap="round"
          opacity={Animated.multiply(lineBaseOpacity, pulse)}
        />

        {/* Glow do ponto de fuga */}
        <AnimatedCircle
          cx={TOP.x}
          cy={TOP.y}
          r="16"
          fill="url(#centerGlow)"
          opacity={Animated.multiply(glowOpacity, pulse)}
        />

        {/* === Bolinhas === */}
        <AnimatedCircle
          cx={TOP.x}
          cy={TOP.y}
          r={DOT_R + 5}
          fill={GREEN}
          opacity={Animated.multiply(dotTopOpacity, glowHalo)}
        />
        <AnimatedCircle
          cx={TOP.x}
          cy={TOP.y}
          r={DOT_R}
          fill={GREEN}
          opacity={Animated.multiply(dotTopOpacity, pulse)}
        />

        <AnimatedCircle
          cx={LEFT.x}
          cy={LEFT.y}
          r={DOT_R + 5}
          fill={GREEN}
          opacity={Animated.multiply(dotLeftOpacity, glowHalo)}
        />
        <AnimatedCircle
          cx={LEFT.x}
          cy={LEFT.y}
          r={DOT_R}
          fill={GREEN}
          opacity={Animated.multiply(dotLeftOpacity, pulse)}
        />

        <AnimatedCircle
          cx={RIGHT.x}
          cy={RIGHT.y}
          r={DOT_R + 5}
          fill={GREEN}
          opacity={Animated.multiply(dotRightOpacity, glowHalo)}
        />
        <AnimatedCircle
          cx={RIGHT.x}
          cy={RIGHT.y}
          r={DOT_R}
          fill={GREEN}
          opacity={Animated.multiply(dotRightOpacity, pulse)}
        />
      </Svg>

      <Animated.Text style={[s.jam, { opacity: textOpacity }]}>
        JAM
      </Animated.Text>
      <Animated.Text style={[s.tech, { opacity: subtitleOpacity }]}>
        TECHNOLOGIES
      </Animated.Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  jam: {
    fontSize: 52,
    fontWeight: "900",
    color: WHITE,
    letterSpacing: 8,
    marginBottom: 4,
    marginTop: 8,
  },
  tech: {
    fontSize: 13,
    fontWeight: "700",
    color: GREEN,
    letterSpacing: 5,
  },
});
