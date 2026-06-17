import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  get,
  set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAx0piPXYV_nWEbzqM2cyTiOnUVQX-u2_U",
  authDomain: "thomaz-oke-5409d.firebaseapp.com",
  databaseURL: "https://thomaz-oke-5409d-default-rtdb.firebaseio.com",
  projectId: "thomaz-oke-5409d",
  storageBucket: "thomaz-oke-5409d.firebasestorage.app",
  messagingSenderId: "293557151942",
  appId: "1:293557151942:web:436ad6123b343f51e04fc7"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export {
  ref,
  get,
  set
};
