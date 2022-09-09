import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCeUDl6_Z19P8o0SiN4OwxdYLtIRaMUl70",
  authDomain: "todo-b069c.firebaseapp.com",
  projectId: "todo-b069c",
  storageBucket: "todo-b069c.appspot.com",
  messagingSenderId: "1034940456016",
  appId: "1:1034940456016:web:abf35e47e3b04f52d48555"
};

const app = firebase.initializeApp(firebaseConfig);
const db =  firebase.firestore(app);

export { db };