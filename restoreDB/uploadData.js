const firestoreService = require('firestore-export-import');
const serviceAccount = require('./serviceAccountKey.json');

const databaseUrl = 'https://midi-wizard-dev.firebaseio.com';

firestoreService.initializeApp(serviceAccount, databaseUrl);

firestoreService.restore('./UserDeviceData.json');