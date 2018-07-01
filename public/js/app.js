var config = {
    apiKey: "AIzaSyD_BUKEpF5nKmVSh_Dxw1Wpa_UOdBZh-oQ",
    authDomain: "logitcalendar.firebaseapp.com",
    databaseURL: "https://logitcalendar.firebaseio.com",
    projectId: "logitcalendar",
    storageBucket: "logitcalendar.appspot.com",
    messagingSenderId: "843432594890"
};
firebase.initializeApp(config);

firebase.firestore().settings({
    timestampsInSnapshots: true
});

firebase.firestore().enablePersistence()
    .catch(function(err) {
        console.log(err);
    }); 