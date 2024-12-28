// Import the functions you need from the SDKs you need
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { getAnalytics, isSupported } = require("firebase/analytics");
const { initializeApp } = require("firebase/app");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASRUREMENT_ID,
};


const initializeFirebase = async () => {
    try {
      // Initialize Firebase App
      const app = initializeApp(firebaseConfig);
  
      // Initialize Firebase Storage
      const firebaseStorage = getStorage(app);
  
      // Check if Analytics is supported
      let analytics = null;
      const supported = await isSupported();
  
      if (supported) {
        analytics = getAnalytics(app);
      }
  
      // Return initialized objects
      return {
        app,
        analytics,
        firebaseStorage
      };
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      throw error; // Pass error to the caller function if needed
    }
  };
  
  module.exports = initializeFirebase;