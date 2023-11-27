const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { CONSTANTS } = require('./consts');

initializeApp();
const db = getFirestore();

exports.getUserIdFromApiKey = async (api) => {
  const q = db.collection(CONSTANTS.users);
  const users = await q.where(CONSTANTS.apiKey, '==', api).limit(1).get();
  return users.empty ? null : users.docs[0].id;
};

exports.updateLastBuild = async (userId, apikey, runId) => {
  await db.collection(CONSTANTS.users).doc(userId).set({
    lastBuild: new Date(),
    runId,
  }, { merge: true });
  await db.collection(CONSTANTS.runs).doc(runId).set({
    apikey,
    runId,
  }, { merge: true });
};

exports.getRun = async (runId) => {
  const doc = await db.collection(CONSTANTS.runs).doc(runId).get();
  return doc.data();
};

exports.getAlertEmailConfig = async () => {
  const doc = await db
    .collection(CONSTANTS.config)
    .doc('alertEmailConfig')
    .get();
  return doc.data();
};
