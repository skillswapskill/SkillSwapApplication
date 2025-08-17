// components/Scenes.js
import React from "react";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

export const MorningScene = () => (
  <Svg width={150} height={150} viewBox="0 0 350 350">
    <Defs>
      <RadialGradient id="sunrise" cx="0.5" cy="0.5" r="0.8">
        <Stop offset="0" stopColor="#FFE066" stopOpacity="1" />
        <Stop offset="0.5" stopColor="#FF9A56" stopOpacity="0.8" />
        <Stop offset="1" stopColor="#FF6B6B" stopOpacity="0.3" />
      </RadialGradient>
    </Defs>
    <Circle cx="175" cy="175" r="140" fill="url(#sunrise)" />
    <Circle cx="175" cy="175" r="120" fill="url(#sunrise)" opacity={0.6} />
  </Svg>
);

export const AfternoonScene = () => (
  <Svg width={150} height={150} viewBox="0 0 350 350">
    <Defs>
      <RadialGradient id="sun" cx="0.5" cy="0.5" r="0.8">
        <Stop offset="0" stopColor="#FFF59D" stopOpacity="1" />
        <Stop offset="0.5" stopColor="#FFD54F" stopOpacity="0.9" />
        <Stop offset="1" stopColor="#FFCA28" stopOpacity="0.4" />
      </RadialGradient>
    </Defs>
    <Circle cx="175" cy="175" r="140" fill="url(#sun)" />
    <Circle cx="175" cy="175" r="120" fill="url(#sun)" opacity={0.7} />
  </Svg>
);

export const EveningScene = () => (
  <Svg width={150} height={150} viewBox="0 0 350 350">
    <Defs>
      <RadialGradient id="sunset" cx="0.5" cy="0.5" r="0.8">
        <Stop offset="0" stopColor="#FFAB91" stopOpacity="1" />
        <Stop offset="0.5" stopColor="#FF8A65" stopOpacity="0.8" />
        <Stop offset="1" stopColor="#FF7043" stopOpacity="0.3" />
      </RadialGradient>
    </Defs>
    <Circle cx="175" cy="175" r="140" fill="url(#sunset)" />
    <Circle cx="175" cy="175" r="120" fill="url(#sunset)" opacity={0.6} />
  </Svg>
);

export const NightScene = () => (
  <Svg width={150} height={150} viewBox="0 0 350 350">
    <Defs>
      <RadialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.8">
        <Stop offset="0" stopColor="#E3F2FD" stopOpacity="1" />
        <Stop offset="0.5" stopColor="#BBDEFB" stopOpacity="0.8" />
        <Stop offset="1" stopColor="#90CAF9" stopOpacity="0.3" />
      </RadialGradient>
    </Defs>
    <Circle cx="175" cy="175" r="140" fill="url(#moonGlow)" />
    <Circle cx="175" cy="175" r="120" fill="url(#moonGlow)" opacity={0.7} />
    <Circle cx="100" cy="80" r="2" fill="#FFF" opacity={0.8} />
    <Circle cx="280" cy="120" r="1.5" fill="#FFF" opacity={0.6} />
    <Circle cx="250" cy="60" r="1" fill="#FFF" opacity={0.7} />
  </Svg>
);
