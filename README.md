# 📱 QuoteSpace — Daily Motivation & Inspiration

QuoteSpace is a modern React Native app that delivers daily motivational and inspirational quotes with a premium, animated, and interactive UI. Users can swipe through quotes, browse categories, save favorites, and enjoy a cinematic visual experience.

---

## ✨ Features

- 🎬 **Animated Splash Screen** with Lottie & Fireflies
- 🔥 **Cinematic Background Themes** (changes per category)
- 👆 **Swipe Through Quotes** (Tinder-style card interactions)
- ⭐ **Save Favorites** (with Redux Persist)
- 🏷️ **Filter Quotes by Category**
- 🔐 **Secure API Key Handling via `.env`**
- 📤 **Share Quotes** to social apps
- 📌 Clean folder structure for scalability

---

## 🎁 Bonus Features

These are additional enhancements that elevate the user experience:

- ❤️ **Add Quotes to Favorites** and view them anytime
- 🔗 **Share quotes** directly with friends & social platforms
- 🌀 **Smooth Transitions & Animations** across screens
- 🌟 **Dynamic UI Color Themes** based on quote categories
- 🚀 **Auto Fetch New Quotes** on swipe or refresh
- 🧠 **Smart Category Memory** – app remembers last selected category
- 💾 **Persists User Data** even after closing the app
- 🎨 **Cinematic Fireflies & Glow Effects** for a premium look and feel

---

## 📦 Tech Stack

| Technology | Purpose |
|------------|----------|
| React Native | Mobile App Framework |
| Expo | Development & Build toolkit |
| Redux Toolkit + Persist | State Management & Local Storage |
| Lottie | Animated Splash Screen |
| Reanimated | Fireflies & UI Animations |
| FavQs API | Quotes Provider |

---

## 📂 Project Structure

QuoteSpace/
│
├── .env # API keys (ignored in Git)
├── App.js # Navigation + Providers
├── app.json
├── babel.config.js
│
├── assets/
│ ├── QuoteSpace.json # Lottie animation
│ ├── icon.png # App icon
│ └── splash.png # Optional image splash
│
├── Pages/
│ ├── SplashScreen.js # Animated intro with fireflies
│ ├── Home.js # Main screen with categories + swipe quotes
│ └── Favorites.js # Saved quotes list
│
├── api/
│ └── quotesApi.js # API logic (uses env key)
│
├── components/
│ ├── SwipeQuotesStack.js # Swipe UI (Tinder-style cards)
│ ├── CategoryChipsCard.js # Category filter UI
│ └── QuoteCard.js # Card UI for saved quotes
│
└── store/
├── favoritesSlice.js # Redux slice
└── index.js # Store + Persist config

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

git clone https://github.com/LAU29004/QuoteSpace.git
cd QuoteSpace

2️⃣ Install Dependencies
npm install
yarn install

3️⃣ Add Environment Variables
Create a .env file in the root:
API_KEY_FAVQ=your_favQs_api_key_here
⚠️ Do NOT commit this file — it is ignored by .gitignore.

4️⃣ Start the App
npx expo start
Open on:

📱 Android Emulator

📱 iOS Simulator

📲 Physical device using Expo Go

🔑 Environment Variables
Variable	Required	Description
API_KEY_FAVQ	✅ Yes	API key for FavQs quotes API

🚧 Future Enhancements (Planned)
🌗 Light & Dark Mode Themes

📶 Offline Quotes Mode

✍️ User-Added Custom Quotes

🌍 Multi-Language Quote Packs (Hindi, Marathi, etc.)

🧵 Custom Quote Wallpapers for Sharing

🤝 Contributing
Contributions are welcome!

If you want to improve something:

fork → modify → pull request
For major changes, please open an issue first to discuss your ideas.

📜 License
This project is currently for learning and personal use.
Commercial usage requires permission.
