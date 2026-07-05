// Counter — ReactBits animated digit counter (adapted from reactbits.dev/components/counter)
// Uses framer-motion spring + useTransform for smooth digit rolling animation.
"use client";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

function Number({ mv, number, height }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) memo -= 10 * height;
    return memo;
  });

  return (
    <motion.span
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        y,
      }}
    >
      {number}
    </motion.span>
  );
}

function normalizeNearInteger(num) {
  const nearest = Math.round(num);
  const tolerance = 1e-9 * Math.max(1, Math.abs(num));
  return Math.abs(num - nearest) < tolerance ? nearest : num;
}

function getValueRoundedToPlace(value, place) {
  const scaled = value / place;
  return Math.floor(normalizeNearInteger(scaled));
}

function Digit({ place, value, height, digitStyle }) {
  const isDecimal = place === ".";
  const valueRoundedToPlace = isDecimal ? 0 : getValueRoundedToPlace(value, place);
  const animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    if (!isDecimal) animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace, isDecimal]);

  if (isDecimal) {
    return (
      <span style={{ height, width: "fit-content", ...digitStyle }}>.</span>
    );
  }

  return (
    <span
      style={{
        height,
        position: "relative",
        width: "1ch",
        fontVariantNumeric: "tabular-nums",
        display: "inline-flex",
        overflow: "hidden",
        ...digitStyle,
      }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </span>
  );
}

/**
 * Animated rolling counter from ReactBits.
 *
 * @param {object} props
 * @param {number} props.value        - The numeric value to display
 * @param {number} [props.fontSize]   - Font size in px
 * @param {number} [props.padding]    - Extra height padding per digit
 * @param {number[]} [props.places]   - Place values for each digit (auto-computed)
 * @param {string} [props.textColor]
 * @param {string} [props.fontWeight]
 * @param {string} [props.gradientFrom] - top/bottom mask gradient colour
 */
export default function Counter({
  value,
  fontSize = 48,
  padding = 0,
  gap = 4,
  borderRadius = 4,
  horizontalPadding = 4,
  textColor = "white",
  fontWeight = "bold",
  containerStyle,
  counterStyle,
  digitStyle,
  gradientHeight = 10,
  gradientFrom = "transparent",
  gradientTo = "transparent",
  topGradientStyle,
  bottomGradientStyle,
}) {
  const height = fontSize + padding;

  const chars = [...value.toString()];
  const dotIdx = chars.indexOf(".");
  const places = chars.map((ch, i) => {
    if (ch === ".") return ".";
    return 10 ** (dotIdx === -1 ? chars.length - i - 1 : i < dotIdx ? dotIdx - i - 1 : -(i - dotIdx));
  });

  return (
    <span style={{ position: "relative", display: "inline-block", ...containerStyle }}>
      <span
        style={{
          fontSize,
          display: "flex",
          gap,
          overflow: "hidden",
          borderRadius,
          paddingLeft: horizontalPadding,
          paddingRight: horizontalPadding,
          lineHeight: 1,
          color: textColor,
          fontWeight,
          direction: "ltr",
          ...counterStyle,
        }}
      >
        {places.map((place, idx) => (
          <Digit key={idx} place={place} value={value} height={height} digitStyle={digitStyle} />
        ))}
      </span>
      <span
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <span
          style={
            topGradientStyle ?? {
              height: gradientHeight,
              background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
            }
          }
        />
        <span
          style={
            bottomGradientStyle ?? {
              height: gradientHeight,
              background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
            }
          }
        />
      </span>
    </span>
  );
}
