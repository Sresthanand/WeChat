
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZe0BgYFXl7KuyYnHIMFZI1O0g-YcJPdU",
  authDomain: "wechats-f0f2d.firebaseapp.com",
  projectId: "wechats-f0f2d",
  storageBucket: "wechats-f0f2d.appspot.com",
  messagingSenderId: "295165465747",
  appId: "1:295165465747:web:0b37ff19c1e7d8d2abe966"
  };

  const app = initializeApp(firebaseConfig);
  
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  export{db,auth};
