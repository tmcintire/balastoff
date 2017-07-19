import firebase from 'firebase';

try {
  const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
  };
  firebase.initializeApp(config);
} catch (e) {
  console.log(e);
}

export const firebaseRef = firebase.database().ref();
export default firebase;
