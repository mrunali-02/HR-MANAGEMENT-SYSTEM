const admin = require('firebase-admin');
const logger = require('../utils/logger');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
    logger.info('✅ Firebase Admin SDK initialised');
  } catch (error) {
    logger.error('❌ Failed to initialise Firebase Admin SDK', error);
    throw error;
  }
}

module.exports = admin;

