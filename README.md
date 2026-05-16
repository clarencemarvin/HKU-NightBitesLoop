# HKU NightBites Loop 🍛🌱

**A Campus-Focused Digital Platform for Late-Night Surplus Food Rescue**

NightBites Loop is a mobile application built with **React Native (Expo)** and **TypeScript** designed to bridge the gap between food waste at HKU campus outlets and student food affordability. The platform facilitates the real-time rescue of safe, edible surplus food during the final hour of canteen operations.

---

## 🚀 Technical Architecture

The codebase is structured as a modular React Native application utilizing a navigation-driven architecture.

### Key Components & Screens

* **`AppNavigator.tsx`**: The core navigation hub using `@react-navigation/bottom-tabs`. It manages the routing between the student discovery interface, the provider listing portal, and the personal impact dashboard.
* **`HomeScreen.tsx` (Discover)**: The primary student-facing interface.
    * **Logic**: Manages real-time listing cards with dynamic metadata.
    * **Features**: Reservation modal logic with unique pickup code generation and location-specific metadata (e.g., "3 min walk").
* **`ProviderScreen.tsx` (Merchant Portal)**: A streamlined interface for canteen staff to list surplus items in under 60 seconds.
    * **Zero-Waste Fallback**: Integrated logic that prompts providers to route unclaimed items to **HKU EPD Smart Bins** for processing at O·PARK1, ensuring a closed-loop system.
    * **State Management**: Tracks listing status through `active`, `rescued`, and `unclaimed` states.
* **`ImpactScreen.tsx` (Sustainability Dashboard)**: Data visualization of user contributions.
    * **Animated Impact Counters**: Uses `Animated.Value` to provide real-time counting effects for "Meals Rescued," "CO2 Prevented," and "Money Saved."
    * **Historical Log**: Maps through previous rescues to show specific savings and sustainability metrics.

---

## 🛠 Tech Stack

* **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/) for strictly typed props and state management.
* **Navigation**: React Navigation (Bottom Tabs).
* **Styling**: Custom StyleSheet implementation focusing on a high-contrast "Teal & Slate" professional palette (`#0D7B6A`).
* **Icons**: Ionicons (via `@expo/vector-icons`).

---

## 📦 Installation & Setup

To run the project locally, ensure you have [Node.js](https://nodejs.org/) installed:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/clarencemarvin/HKU-NightBitesLoop.git
    cd HKU-NightBitesLoop
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npx expo start
    ```

4.  **View the app:**
    Scan the QR code in your terminal using the **Expo Go** app on iOS or Android.

---

## 🎯 Project Scope

* **Environmental**: Diverting HKU canteen surplus from landfills to student consumption or organic recycling (O·PARK1).
* **Social**: Improving meal accessibility for budget-conscious students during late-night study sessions.
* **Economic**: Recovering partial inventory value for campus vendors like Starbucks, CYM, and Union Canteen.

---

**Developed by Tanujaya Clarence Marvin**
*The University of Hong Kong | BUSI2812 Impact Lab*
