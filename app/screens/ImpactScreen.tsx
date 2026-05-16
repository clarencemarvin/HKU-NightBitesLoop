import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TEAL = "#0D7B6A";
const TEAL_LIGHT = "#E6F4F1";

function AnimatedNumber({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = React.useState(0);
  useEffect(() => {
    Animated.timing(anim, {
      toValue: target,
      duration: 1200,
      useNativeDriver: false,
    }).start();
    anim.addListener(({ value }) => setDisplay(Math.floor(value)));
    return () => anim.removeAllListeners();
  }, []);
  return (
    <Text style={styles.bigNum}>
      {display}
      {suffix}
    </Text>
  );
}

export default function ImpactScreen() {
  const RESCUES = [
    {
      emoji: "🍛",
      item: "Thai Curry Chicken Rice",
      outlet: "CYM Canteen",
      saving: "HK$21.90 saved",
      time: "20:47",
    },
    {
      emoji: "🍚",
      item: "2-Dish Rice (Siu Mei)",
      outlet: "Union Restaurant (HK Diners)",
      saving: "HK$20 saved",
      time: "21:12",
    },
    {
      emoji: "🥐",
      item: "Brie & Ham Croissant Sandwich",
      outlet: "Starbucks",
      saving: "HK$13.60 saved",
      time: "21:45",
    },
    {
      emoji: "🎉",
      item: "Event Surplus — Packaged Snacks",
      outlet: "HKU Data Science Assoc.",
      saving: "FREE",
      time: "20:58",
    },
    {
      emoji: "🌯",
      item: "Chicken Caesar Wrap",
      outlet: "Starbucks",
      saving: "HK$16.50 saved",
      time: "22:01",
    },
    {
      emoji: "🥩",
      item: "Premium Siu Mei Combo",
      outlet: "Union Restaurant (HK Diners)",
      saving: "HK$26 saved",
      time: "21:30",
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Impact</Text>
          <Text style={styles.subtitle}>
            HKU NightBites Loop · Week 1 pilot
          </Text>
        </View>

        {/* Hero stats */}
        <View style={styles.heroGrid}>
          <View style={[styles.heroCard, { backgroundColor: TEAL }]}>
            <Ionicons
              name="restaurant-outline"
              size={26}
              color="rgba(255,255,255,0.85)"
            />
            <AnimatedNumber target={23} />
            <Text style={styles.heroLabel}>Meals rescued</Text>
          </View>
          <View style={[styles.heroCard, { backgroundColor: "#065F46" }]}>
            <Ionicons
              name="cloud-outline"
              size={26}
              color="rgba(255,255,255,0.85)"
            />
            <AnimatedNumber target={12} suffix=" kg" />
            <Text style={styles.heroLabel}>Food diverted</Text>
          </View>
        </View>
        <View style={styles.heroGrid}>
          <View style={[styles.heroCard, { backgroundColor: "#B45309" }]}>
            <Ionicons
              name="cash-outline"
              size={26}
              color="rgba(255,255,255,0.85)"
            />
            <Text style={styles.bigNum}>HK$486</Text>
            <Text style={styles.heroLabel}>Student savings</Text>
          </View>
          <View style={[styles.heroCard, { backgroundColor: "#6D28D9" }]}>
            <Ionicons
              name="storefront-outline"
              size={26}
              color="rgba(255,255,255,0.85)"
            />
            <AnimatedNumber target={5} />
            <Text style={styles.heroLabel}>Outlets active</Text>
          </View>
        </View>

        {/* Sell-through rate */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sell-through rate</Text>
          <View style={styles.rateCard}>
            <View style={styles.rateHeader}>
              <Text style={styles.ratePercent}>78%</Text>
              <Text style={styles.rateLabel}>
                of listed items rescued before cutoff
              </Text>
            </View>
            <View style={styles.rateBarBg}>
              <View style={[styles.rateBarFill, { width: "78%" }]} />
            </View>
            <Text style={styles.rateNote}>
              22% routed to fallback redistribution partner
            </Text>
          </View>
        </View>

        {/* Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This week's breakdown</Text>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownNum}>14</Text>
              <Text style={styles.breakdownLabel}>Outlet listings</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownItem}>
              <Text style={[styles.breakdownNum, { color: "#7C3AED" }]}>9</Text>
              <Text style={styles.breakdownLabel}>Event listings</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownItem}>
              <Text style={[styles.breakdownNum, { color: "#F59E0B" }]}>5</Text>
              <Text style={styles.breakdownLabel}>Redirected</Text>
            </View>
          </View>
        </View>

        {/* Recent rescues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent rescues</Text>
          {RESCUES.map((r, i) => (
            <View key={i} style={styles.rescueRow}>
              <Text style={{ fontSize: 30, marginRight: 12 }}>{r.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.rescueItem}>{r.item}</Text>
                <Text style={styles.rescueOutlet}>
                  {r.outlet} · {r.time}
                </Text>
              </View>
              <View
                style={[
                  styles.savingBadge,
                  r.saving === "FREE" && styles.savingBadgeFree,
                ]}
              >
                <Text
                  style={[
                    styles.savingText,
                    r.saving === "FREE" && styles.savingTextFree,
                  ]}
                >
                  {r.saving}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Mission */}
        <View style={styles.missionCard}>
          <View style={styles.missionHeader}>
            <Ionicons name="leaf" size={18} color={TEAL} />
            <Text style={styles.missionTitle}>About NightBites Loop</Text>
          </View>
          <Text style={styles.missionText}>
            A student-led campus pilot at HKU that connects safe surplus food
            from campus outlets and student events with students who need
            affordable late-night meals — reducing food waste and improving meal
            access at the same time.
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  title: { fontSize: 26, fontWeight: "800", color: "#111827" },
  subtitle: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  heroGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 10,
  },
  heroCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    gap: 6,
  },
  bigNum: { fontSize: 28, fontWeight: "800", color: "#fff" },
  heroLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  section: { paddingHorizontal: 20, marginTop: 8, marginBottom: 8 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  rateCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  rateHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 12,
  },
  ratePercent: { fontSize: 32, fontWeight: "800", color: TEAL },
  rateLabel: { fontSize: 14, color: "#374151", flex: 1 },
  rateBarBg: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 8,
  },
  rateBarFill: { height: "100%", backgroundColor: TEAL, borderRadius: 5 },
  rateNote: { fontSize: 13, color: "#6B7280" },
  breakdownRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  breakdownItem: { flex: 1, alignItems: "center" },
  breakdownDivider: { width: 0.5, backgroundColor: "#E5E7EB" },
  breakdownNum: { fontSize: 24, fontWeight: "800", color: TEAL },
  breakdownLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    textAlign: "center",
  },
  rescueRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  rescueItem: { fontSize: 14, fontWeight: "600", color: "#111827" },
  rescueOutlet: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  savingBadge: {
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  savingBadgeFree: { backgroundColor: "#D1FAE5" },
  savingText: { fontSize: 12, color: TEAL, fontWeight: "600" },
  savingTextFree: { color: "#065F46" },
  missionCard: {
    marginHorizontal: 20,
    backgroundColor: TEAL_LIGHT,
    borderRadius: 16,
    padding: 18,
  },
  missionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  missionTitle: { fontSize: 15, fontWeight: "700", color: TEAL },
  missionText: { fontSize: 13, color: "#374151", lineHeight: 20 },
});
