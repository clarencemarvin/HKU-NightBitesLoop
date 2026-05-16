import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TEAL = "#0D7B6A";
const TEAL_LIGHT = "#E6F4F1";

type ListingStatus = "active" | "rescued" | "unclaimed";
type Listing = {
  id: string;
  item: string;
  qty: number;
  price: number;
  isFree: boolean;
  window: string;
  status: ListingStatus;
};

const INITIAL: Listing[] = [
  {
    id: "1",
    item: "Thai Curry Chicken Rice",
    qty: 3,
    price: 22,
    isFree: false,
    window: "21:30",
    status: "active",
  },
  {
    id: "2",
    item: "Rock Salt Grilled Salmon Rice",
    qty: 2,
    price: 22,
    isFree: false,
    window: "21:00",
    status: "active",
  },
  {
    id: "3",
    item: "Pork Chop in Onion Sauce with Rice",
    qty: 2,
    price: 18,
    isFree: false,
    window: "21:30",
    status: "rescued",
  },
];

export default function ProviderScreen() {
  const [listings, setListings] = useState<Listing[]>(INITIAL);
  const [addVisible, setAddVisible] = useState(false);
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const [fallbackItem, setFallbackItem] = useState<Listing | null>(null);
  const [newItem, setNewItem] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newFree, setNewFree] = useState(false);

  const active = listings.filter((l) => l.status === "active");
  const rescued = listings.filter((l) => l.status === "rescued");
  const unclaimed = listings.filter((l) => l.status === "unclaimed");

  const totalRescued = rescued.length;
  const totalPortions = listings.reduce((a, l) => a + l.qty, 0);

  const markRescued = (id: string) =>
    setListings((p) =>
      p.map((l) => (l.id === id ? { ...l, status: "rescued" } : l))
    );

  const triggerFallback = (item: Listing) => {
    setFallbackItem(item);
    setFallbackVisible(true);
  };

  const confirmFallback = () => {
    if (fallbackItem) {
      setListings((p) =>
        p.map((l) =>
          l.id === fallbackItem.id ? { ...l, status: "unclaimed" } : l
        )
      );
    }
    setFallbackVisible(false);
  };

  const publishListing = () => {
    if (!newItem.trim()) return Alert.alert("Please enter an item name");
    if (!newQty.trim()) return Alert.alert("Please enter quantity");
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    const window = `${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    setListings((p) => [
      ...p,
      {
        id: Date.now().toString(),
        item: newItem.trim(),
        qty: parseInt(newQty) || 1,
        price: parseInt(newPrice) || 0,
        isFree: newFree || !newPrice,
        window,
        status: "active",
      },
    ]);
    setNewItem("");
    setNewQty("");
    setNewPrice("");
    setNewFree(false);
    setAddVisible(false);
  };

  const StatusCard = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: number | string;
    color: string;
  }) => (
    <View style={styles.statCard}>
      <Text style={[styles.statNum, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.outletRow}>
            <View style={styles.outletAvatar}>
              <Text style={{ fontSize: 22 }}>🍚</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Provider Dashboard</Text>
              <Text style={styles.headerSub}>
                CYM Canteen · Chong Yuet Ming Amenities Centre
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatusCard
            label="Active now"
            value={active.length}
            color="#111827"
          />
          <StatusCard label="Rescued today" value={totalRescued} color={TEAL} />
          <StatusCard
            label="Total portions"
            value={totalPortions}
            color="#F59E0B"
          />
        </View>

        {/* Active listings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active listings</Text>
          {active.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                No active listings — tap below to add one
              </Text>
            </View>
          ) : (
            active.map((item) => (
              <View key={item.id} style={styles.listingCard}>
                <View style={styles.listingTop}>
                  <Text style={styles.listingName} numberOfLines={1}>
                    {item.item}
                  </Text>
                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>Live</Text>
                  </View>
                </View>
                <Text style={styles.listingMeta}>
                  Qty: {item.qty} · {item.isFree ? "FREE" : `HK$${item.price}`}{" "}
                  · Pickup by {item.window}
                </Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => markRescued(item.id)}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={15}
                      color={TEAL}
                    />
                    <Text style={styles.actionBtnText}>Mark rescued</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnSecondary]}
                    onPress={() => triggerFallback(item)}
                  >
                    <Ionicons
                      name="arrow-forward-circle-outline"
                      size={15}
                      color="#6B7280"
                    />
                    <Text style={[styles.actionBtnText, { color: "#6B7280" }]}>
                      Unclaimed fallback
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Unclaimed / fallback */}
        {unclaimed.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Unclaimed — routed to partner
            </Text>
            {unclaimed.map((item) => (
              <View
                key={item.id}
                style={[styles.listingCard, styles.unclaimedCard]}
              >
                <View style={styles.listingTop}>
                  <Text style={styles.listingName}>{item.item}</Text>
                  <View style={[styles.liveBadge, styles.unclaimedBadge]}>
                    <Text style={styles.unclaimedBadgeText}>Rerouted</Text>
                  </View>
                </View>
                <Text style={styles.listingMeta}>
                  Qty: {item.qty} · Routed to redistribution partner ✓
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Rescued */}
        {rescued.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rescued today ✓</Text>
            {rescued.map((item) => (
              <View
                key={item.id}
                style={[styles.listingCard, { opacity: 0.55 }]}
              >
                <Text style={styles.listingName}>{item.item}</Text>
                <Text style={styles.listingMeta}>
                  {item.isFree ? "FREE" : `HK$${item.price}`} · Picked up ✓
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={18} color={TEAL} />
          <Text style={styles.tipText}>
            Tip: List items at least 30 minutes before closing to maximise
            pickup chances. Discounts of 50%+ get significantly more
            reservations.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add button */}
      <View style={styles.addBtnContainer}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setAddVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Add new listing</Text>
        </TouchableOpacity>
      </View>

      {/* Add listing modal */}
      <Modal
        visible={addVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={styles.modalNav}>
            <TouchableOpacity onPress={() => setAddVisible(false)}>
              <Ionicons name="close" size={26} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add new listing</Text>
            <View style={{ width: 26 }} />
          </View>

          <ScrollView style={{ padding: 20 }}>
            <Text style={styles.fieldLabel}>Item name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mixed Rice Box"
              value={newItem}
              onChangeText={setNewItem}
            />

            <Text style={styles.fieldLabel}>Quantity available *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 4"
              keyboardType="number-pad"
              value={newQty}
              onChangeText={setNewQty}
            />

            <Text style={styles.fieldLabel}>Discounted price (HK$)</Text>
            <View style={styles.priceRow}>
              <TextInput
                style={[
                  styles.input,
                  { flex: 1, marginBottom: 0 },
                  newFree && { opacity: 0.4 },
                ]}
                placeholder="e.g. 25"
                keyboardType="number-pad"
                value={newPrice}
                onChangeText={setNewPrice}
                editable={!newFree}
              />
              <TouchableOpacity
                style={[styles.freeToggle, newFree && styles.freeToggleActive]}
                onPress={() => {
                  setNewFree(!newFree);
                  setNewPrice("");
                }}
              >
                <Text
                  style={[
                    styles.freeToggleText,
                    newFree && styles.freeToggleTextActive,
                  ]}
                >
                  Free / event
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="time-outline" size={15} color={TEAL} />
              <Text style={styles.infoBoxText}>
                Pickup window will be set to 30 minutes from now. Students see a
                live countdown.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.publishBtn}
              onPress={publishListing}
            >
              <Text style={styles.publishBtnText}>Publish listing →</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Fallback modal */}
      <Modal visible={fallbackVisible} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.fallbackCard}>
            <Ionicons
              name="arrow-forward-circle"
              size={44}
              color={TEAL}
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.fallbackTitle}>Route to fallback partner?</Text>
            {fallbackItem && (
              <Text style={styles.fallbackItem}>
                {fallbackItem.item} ({fallbackItem.qty} portions)
              </Text>
            )}
            <Text style={styles.fallbackDesc}>
              Unclaimed items will be logged and routed to your designated
              redistribution partner. This counts toward your impact data.
            </Text>
            <View style={styles.fallbackPartner}>
              <Ionicons name="people-outline" size={15} color={TEAL} />
              <Text style={styles.fallbackPartnerText}>
                EPD-backed Smart Food Waste Recycling Bins
              </Text>
            </View>
            <View style={styles.fallbackBtns}>
              <TouchableOpacity
                style={styles.fallbackCancel}
                onPress={() => setFallbackVisible(false)}
              >
                <Text style={styles.fallbackCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fallbackConfirm}
                onPress={confirmFallback}
              >
                <Text style={styles.fallbackConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  outletRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  outletAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: TEAL_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111827" },
  headerSub: { fontSize: 13, color: "#6B7280", marginTop: 1 },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  statNum: { fontSize: 26, fontWeight: "800" },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 2,
  },
  section: { paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  emptyText: { color: "#9CA3AF", fontSize: 14 },
  listingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  unclaimedCard: { borderColor: "#FDE68A", backgroundColor: "#FFFBEB" },
  listingTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  listingName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#059669" },
  liveText: { fontSize: 11, color: "#065F46", fontWeight: "600" },
  unclaimedBadge: { backgroundColor: "#FEF3C7" },
  unclaimedBadgeText: { fontSize: 11, color: "#92400E", fontWeight: "600" },
  listingMeta: { fontSize: 13, color: "#6B7280", marginBottom: 10 },
  actionRow: { flexDirection: "row", gap: 8 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  actionBtnSecondary: { backgroundColor: "#F3F4F6" },
  actionBtnText: { fontSize: 12, color: TEAL, fontWeight: "600" },
  tipCard: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 20,
    backgroundColor: TEAL_LIGHT,
    padding: 16,
    borderRadius: 14,
  },
  tipText: { flex: 1, fontSize: 13, color: "#374151", lineHeight: 18 },
  addBtnContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
  },
  addBtn: {
    backgroundColor: TEAL,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  modalNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    color: "#111827",
    marginBottom: 0,
  },
  priceRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  freeToggle: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  freeToggleActive: { backgroundColor: "#D1FAE5", borderColor: "#059669" },
  freeToggleText: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  freeToggleTextActive: { color: "#065F46", fontWeight: "700" },
  infoBox: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: TEAL_LIGHT,
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 20,
  },
  infoBoxText: { flex: 1, fontSize: 13, color: "#374151", lineHeight: 18 },
  publishBtn: {
    backgroundColor: TEAL,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  publishBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  fallbackCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    width: "100%",
    alignItems: "center",
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  fallbackItem: { fontSize: 15, color: "#6B7280", marginBottom: 14 },
  fallbackDesc: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 14,
  },
  fallbackPartner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: TEAL_LIGHT,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 20,
  },
  fallbackPartnerText: { fontSize: 13, color: TEAL, fontWeight: "600" },
  fallbackBtns: { flexDirection: "row", gap: 12, width: "100%" },
  fallbackCancel: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  fallbackCancelText: { fontSize: 15, color: "#374151", fontWeight: "600" },
  fallbackConfirm: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: TEAL,
  },
  fallbackConfirmText: { fontSize: 15, color: "#fff", fontWeight: "700" },
});
