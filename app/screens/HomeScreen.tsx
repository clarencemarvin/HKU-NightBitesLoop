import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TEAL = "#0D7B6A";
const TEAL_LIGHT = "#E6F4F1";

type Listing = {
  id: string;
  outlet: string;
  item: string;
  originalPrice: number;
  discountedPrice: number;
  distance: string;
  minutesLeft: number;
  quantity: number;
  tag: string;
  emoji: string;
  location: string;
  allergyNote: string;
  isEvent: boolean;
};

const INITIAL_LISTINGS: Listing[] = [
  {
    id: "1",
    outlet: "CYM Canteen",
    item: "Thai Curry Chicken Rice",
    originalPrice: 43.9,
    discountedPrice: 22,
    distance: "3 min walk",
    minutesLeft: 18,
    quantity: 3,
    tag: "Hot meal",
    emoji: "🍛",
    location: "Chong Yuet Ming Amenities Centre, Main Campus",
    allergyNote: "Contains gluten, dairy, coconut. May contain nuts.",
    isEvent: false,
  },
  {
    id: "2",
    outlet: "CYM Canteen",
    item: "Rock Salt Grilled Salmon Rice",
    originalPrice: 43.9,
    discountedPrice: 22,
    distance: "3 min walk",
    minutesLeft: 22,
    quantity: 2,
    tag: "Hot meal",
    emoji: "🐟",
    location: "Chong Yuet Ming Amenities Centre, Main Campus",
    allergyNote: "Contains fish. May contain soy.",
    isEvent: false,
  },
  {
    id: "3",
    outlet: "Union Restaurant (HK Diners)",
    item: "2-Dish Rice (Siu Mei combo)",
    originalPrice: 38,
    discountedPrice: 18,
    distance: "5 min walk",
    minutesLeft: 12,
    quantity: 5,
    tag: "HK comfort food",
    emoji: "🍚",
    location: "Haking Wong Building, Main Campus",
    allergyNote: "Contains soy, sesame. Ask staff for allergen details.",
    isEvent: false,
  },
  {
    id: "4",
    outlet: "Union Restaurant (HK Diners)",
    item: "Premium Siu Mei Combo",
    originalPrice: 52,
    discountedPrice: 26,
    distance: "5 min walk",
    minutesLeft: 20,
    quantity: 4,
    tag: "HK comfort food",
    emoji: "🥩",
    location: "Haking Wong Building, Main Campus",
    allergyNote: "Contains soy, sesame, gluten.",
    isEvent: false,
  },
  {
    id: "5",
    outlet: "Starbucks",
    item: "Brie & Ham Croissant Sandwich",
    originalPrice: 26.6,
    discountedPrice: 13,
    distance: "6 min walk",
    minutesLeft: 35,
    quantity: 4,
    tag: "Bakery / café",
    emoji: "🥐",
    location: "Composite Building, Main Campus",
    allergyNote: "Contains gluten, dairy, egg.",
    isEvent: false,
  },
  {
    id: "6",
    outlet: "Starbucks",
    item: "Blueberry Yogurt Cup",
    originalPrice: 22.4,
    discountedPrice: 10,
    distance: "6 min walk",
    minutesLeft: 28,
    quantity: 6,
    tag: "Snack",
    emoji: "🫐",
    location: "Composite Building, Main Campus",
    allergyNote: "Contains dairy.",
    isEvent: false,
  },
  {
    id: "7",
    outlet: "Starbucks",
    item: "Chicken Caesar Wrap",
    originalPrice: 31.5,
    discountedPrice: 15,
    distance: "6 min walk",
    minutesLeft: 30,
    quantity: 3,
    tag: "Grab & go",
    emoji: "🌯",
    location: "Composite Building, Main Campus",
    allergyNote: "Contains gluten, dairy, egg. May contain mustard.",
    isEvent: false,
  },
  {
    id: "8",
    outlet: "HKU Data Science Association",
    item: "Event Surplus — Packaged Snacks",
    originalPrice: 35,
    discountedPrice: 0,
    distance: "2 min walk",
    minutesLeft: 14,
    quantity: 10,
    tag: "Event surplus",
    emoji: "🎉",
    location: "Rm 101, KK Leung Building",
    allergyNote:
      "Mixed packaged snacks — check individual packaging for allergens.",
    isEvent: true,
  },
  {
    id: "9",
    outlet: "CYM Canteen",
    item: "Pork Chop in Onion Sauce with Rice",
    originalPrice: 36.6,
    discountedPrice: 18,
    distance: "3 min walk",
    minutesLeft: 40,
    quantity: 3,
    tag: "Hot meal",
    emoji: "🥣",
    location: "Chong Yuet Ming Amenities Centre, Main Campus",
    allergyNote: "Contains soy, gluten. May contain garlic, onion.",
    isEvent: false,
  },
];

function CountdownTimer({ minutes }: { minutes: number }) {
  const [secs, setSecs] = useState(minutes * 60);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const urgent = m < 10;
  return (
    <Text style={[styles.countdownText, urgent && styles.countdownUrgent]}>
      {m}:{s.toString().padStart(2, "0")} left
    </Text>
  );
}

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "food" | "event">("all");
  const [selectedItem, setSelectedItem] = useState<Listing | null>(null);
  const [reservedItem, setReservedItem] = useState<Listing | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pickupCode] = useState(
    `NBL-${Math.floor(1000 + Math.random() * 9000)}`
  );

  const filtered = INITIAL_LISTINGS.filter((l) => {
    const matchSearch =
      l.outlet.toLowerCase().includes(search.toLowerCase()) ||
      l.item.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "event" && l.isEvent) ||
      (filter === "food" && !l.isEvent);
    return matchSearch && matchFilter;
  });

  const urgent = filtered.filter((l) => l.minutesLeft <= 20);
  const rest = filtered.filter((l) => l.minutesLeft > 20);

  const discountLabel = (item: Listing) =>
    item.discountedPrice === 0
      ? "FREE"
      : `${Math.round(
          (1 - item.discountedPrice / item.originalPrice) * 100
        )}% off`;

  const openDetail = (item: Listing) => {
    setSelectedItem(item);
    setDetailVisible(true);
  };

  const reserve = (item: Listing) => {
    setDetailVisible(false);
    setReservedItem(item);
    setTimeout(() => setConfirmVisible(true), 300);
  };

  const ListingCard = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openDetail(item)}
      activeOpacity={0.85}
    >
      <View style={[styles.cardLeft, item.isEvent && styles.cardLeftEvent]}>
        <Text style={{ fontSize: 38 }}>{item.emoji}</Text>
        {item.isEvent && (
          <View style={styles.eventBadge}>
            <Text style={styles.eventBadgeText}>Event</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardRow}>
          <Text style={styles.cardOutlet} numberOfLines={1}>
            {item.outlet}
          </Text>
          <View
            style={[
              styles.discountBadge,
              item.discountedPrice === 0 && styles.freeBadge,
            ]}
          >
            <Text
              style={[
                styles.discountText,
                item.discountedPrice === 0 && styles.freeText,
              ]}
            >
              {discountLabel(item)}
            </Text>
          </View>
        </View>
        <Text style={styles.cardItem} numberOfLines={1}>
          {item.item}
        </Text>
        <View style={styles.cardMeta}>
          <CountdownTimer minutes={item.minutesLeft} />
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>{item.distance}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>{item.quantity} left</Text>
        </View>
        <View style={styles.priceRow}>
          {item.discountedPrice > 0 && (
            <Text style={styles.originalPrice}>HK${item.originalPrice}</Text>
          )}
          <Text style={styles.discountedPrice}>
            {item.discountedPrice === 0 ? "FREE" : `HK$${item.discountedPrice}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.locationLabel}>📍 HKU Campus</Text>
          <Text style={styles.appTitle}>NightBites Loop</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>{filtered.length} live now</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={17} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search outlets or food..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={17} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter pills */}
      <View style={styles.filterRow}>
        {(["all", "food", "event"] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, filter === f && styles.filterPillActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f === "all"
                ? "All"
                : f === "food"
                ? "🍴 Food outlets"
                : "🎉 Events"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Urgent section */}
        {urgent.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                ⚡ Save before it's too late
              </Text>
            </View>
            {urgent.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </View>
        )}

        {/* All listings */}
        {rest.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available now</Text>
            {rest.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </View>
        )}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48 }}>🌙</Text>
            <Text style={styles.emptyTitle}>Nothing listed yet</Text>
            <Text style={styles.emptySubtitle}>
              Check back closer to outlet closing time, usually after 9pm.
            </Text>
          </View>
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Item Detail Modal */}
      <Modal
        visible={detailVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedItem && (
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.modalNav}>
              <TouchableOpacity onPress={() => setDetailVisible(false)}>
                <Ionicons name="chevron-down" size={28} color="#374151" />
              </TouchableOpacity>
              <Text style={styles.modalNavTitle}>Item details</Text>
              <View style={{ width: 28 }} />
            </View>
            <ScrollView style={{ padding: 20 }}>
              {/* Hero */}
              <View
                style={[
                  styles.detailHero,
                  selectedItem.isEvent && styles.detailHeroEvent,
                ]}
              >
                <Text style={{ fontSize: 80 }}>{selectedItem.emoji}</Text>
                {selectedItem.isEvent && (
                  <View style={styles.eventHeroBadge}>
                    <Text style={styles.eventHeroBadgeText}>
                      🎉 Event surplus — free food!
                    </Text>
                  </View>
                )}
              </View>

              {/* Tags */}
              <View style={styles.tagRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{selectedItem.tag}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: "#FEF3C7" }]}>
                  <Text style={[styles.tagText, { color: "#92400E" }]}>
                    {selectedItem.minutesLeft} min window
                  </Text>
                </View>
                <View style={[styles.tag, { backgroundColor: "#EDE9FE" }]}>
                  <Text style={[styles.tagText, { color: "#5B21B6" }]}>
                    {selectedItem.quantity} portions left
                  </Text>
                </View>
              </View>

              <Text style={styles.detailOutlet}>{selectedItem.outlet}</Text>
              <Text style={styles.detailItem}>{selectedItem.item}</Text>

              {/* Info card */}
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={16} color={TEAL} />
                  <Text style={styles.infoText}>{selectedItem.location}</Text>
                </View>
                <View style={[styles.infoRow, { marginTop: 10 }]}>
                  <Ionicons name="warning-outline" size={16} color={TEAL} />
                  <Text style={styles.infoText}>
                    {selectedItem.allergyNote}
                  </Text>
                </View>
                <View style={[styles.infoRow, { marginTop: 10 }]}>
                  <Ionicons name="walk-outline" size={16} color={TEAL} />
                  <Text style={styles.infoText}>
                    {selectedItem.distance} · Collect within{" "}
                    {selectedItem.minutesLeft} minutes of reserving
                  </Text>
                </View>
              </View>

              {/* Price */}
              <View style={styles.priceCard}>
                <View>
                  {selectedItem.discountedPrice > 0 && (
                    <Text style={styles.originalPriceLg}>
                      HK${selectedItem.originalPrice}
                    </Text>
                  )}
                  <Text style={styles.discountedPriceLg}>
                    {selectedItem.discountedPrice === 0
                      ? "FREE"
                      : `HK$${selectedItem.discountedPrice}`}
                  </Text>
                  {selectedItem.discountedPrice > 0 && (
                    <Text style={styles.savingNote}>
                      You save HK$
                      {selectedItem.originalPrice -
                        selectedItem.discountedPrice}
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    styles.discountBadge,
                    styles.discountBadgeLg,
                    selectedItem.discountedPrice === 0 && styles.freeBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.discountText,
                      { fontSize: 18, fontWeight: "700" },
                      selectedItem.discountedPrice === 0 && styles.freeText,
                    ]}
                  >
                    {discountLabel(selectedItem)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.reserveBtn}
                onPress={() => reserve(selectedItem)}
              >
                <Text style={styles.reserveBtnText}>Reserve now →</Text>
              </TouchableOpacity>
              <Text style={styles.reserveNote}>
                No payment needed. Just show your pickup code at the counter.
              </Text>
              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>

      {/* Reservation Confirmed Modal */}
      <Modal visible={confirmVisible} animationType="fade" transparent>
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIconCircle}>
              <Ionicons name="checkmark" size={36} color="#fff" />
            </View>
            <Text style={styles.confirmTitle}>Reserved!</Text>
            {reservedItem && (
              <>
                <Text style={styles.confirmOutlet}>{reservedItem.outlet}</Text>
                <Text style={styles.confirmItem}>{reservedItem.item}</Text>

                <View style={styles.codeBox}>
                  <Text style={styles.codeLabel}>Your pickup code</Text>
                  <Text style={styles.codeText}>{pickupCode}</Text>
                  <Text style={styles.codeNote}>Show this to outlet staff</Text>
                </View>

                <View style={styles.confirmInfoRow}>
                  <Ionicons name="location-outline" size={15} color="#6B7280" />
                  <Text style={styles.confirmInfoText}>
                    {reservedItem.location}
                  </Text>
                </View>
                <View style={styles.confirmInfoRow}>
                  <Ionicons name="time-outline" size={15} color="#EF4444" />
                  <Text style={[styles.confirmInfoText, { color: "#EF4444" }]}>
                    Collect within {reservedItem.minutesLeft} minutes
                  </Text>
                </View>
                <View style={[styles.confirmInfoRow, { marginTop: 4 }]}>
                  <Ionicons name="leaf-outline" size={15} color={TEAL} />
                  <Text style={[styles.confirmInfoText, { color: TEAL }]}>
                    You saved HK$
                    {reservedItem.originalPrice - reservedItem.discountedPrice}{" "}
                    and rescued food from waste!
                  </Text>
                </View>
              </>
            )}
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => setConfirmVisible(false)}
            >
              <Text style={styles.confirmBtnText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  locationLabel: { fontSize: 13, color: "#6B7280" },
  appTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#059669" },
  liveText: { color: TEAL, fontSize: 13, fontWeight: "600" },
  searchRow: { paddingHorizontal: 20, paddingVertical: 10 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  searchInput: { flex: 1, fontSize: 15, color: "#111827" },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  filterPillActive: { backgroundColor: TEAL, borderColor: TEAL },
  filterText: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  filterTextActive: { color: "#fff" },
  section: { paddingHorizontal: 20, marginBottom: 8 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  cardLeft: {
    width: 88,
    backgroundColor: TEAL_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLeftEvent: { backgroundColor: "#EDE9FE" },
  eventBadge: {
    position: "absolute",
    bottom: 6,
    backgroundColor: "#7C3AED",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  eventBadgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  cardBody: { flex: 1, padding: 12 },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  cardOutlet: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
    marginRight: 6,
  },
  cardItem: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 5,
  },
  cardMeta: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  dot: { color: "#D1D5DB", marginHorizontal: 4, fontSize: 12 },
  metaText: { fontSize: 12, color: "#6B7280" },
  countdownText: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  countdownUrgent: { color: "#EF4444", fontWeight: "700" },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  originalPrice: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  discountedPrice: { fontSize: 16, fontWeight: "700", color: TEAL },
  discountBadge: {
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  discountBadgeLg: { paddingHorizontal: 16, paddingVertical: 10 },
  discountText: { fontSize: 11, color: TEAL, fontWeight: "700" },
  freeBadge: { backgroundColor: "#D1FAE5" },
  freeText: { color: "#065F46" },
  emptyState: { alignItems: "center", paddingTop: 60, paddingHorizontal: 40 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  // Detail modal
  modalNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  modalNavTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  detailHero: {
    alignItems: "center",
    backgroundColor: TEAL_LIGHT,
    borderRadius: 20,
    paddingVertical: 36,
    marginBottom: 16,
  },
  detailHeroEvent: { backgroundColor: "#EDE9FE" },
  eventHeroBadge: {
    marginTop: 8,
    backgroundColor: "#7C3AED",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  eventHeroBadgeText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  tag: {
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: { fontSize: 12, color: TEAL, fontWeight: "600" },
  detailOutlet: { fontSize: 14, color: "#6B7280", marginBottom: 4 },
  detailItem: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  infoText: { fontSize: 14, color: "#374151", flex: 1, lineHeight: 20 },
  priceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  originalPriceLg: {
    fontSize: 14,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  discountedPriceLg: { fontSize: 32, fontWeight: "800", color: TEAL },
  savingNote: { fontSize: 13, color: "#059669", marginTop: 2 },
  reserveBtn: {
    backgroundColor: TEAL,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  reserveBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  reserveNote: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 10,
  },
  // Confirm modal
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  confirmCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 28,
    width: "100%",
    alignItems: "center",
  },
  confirmIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: TEAL,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  confirmTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  confirmOutlet: { fontSize: 14, color: "#6B7280" },
  confirmItem: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 20,
  },
  codeBox: {
    backgroundColor: TEAL_LIGHT,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginBottom: 18,
    alignItems: "center",
    width: "100%",
  },
  codeLabel: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
  codeText: { fontSize: 32, fontWeight: "900", color: TEAL, letterSpacing: 4 },
  codeNote: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  confirmInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  confirmInfoText: { fontSize: 13, color: "#6B7280" },
  confirmBtn: {
    backgroundColor: TEAL,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 50,
    marginTop: 20,
  },
  confirmBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
