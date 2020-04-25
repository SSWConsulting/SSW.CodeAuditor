const admin = require('firebase-admin');
const { CONSTANTS } = require('./consts');

exports.getUserIdFromApiKey = (api) => {
	return admin
		.firestore()
		.collection(CONSTANTS.users)
		.where(CONSTANTS.apiKey, '==', api)
		.get()
		.then((x) => (x.docs.length === 1 ? x.docs[0].id : null));
};

exports.updateLastBuild = (userId, apikey, runId) => {
	return admin
		.firestore()
		.collection(CONSTANTS.users)
		.doc(userId)
		.update({
			lastBuild: new Date(),
			runId,
		})
		.then(() =>
			admin.firestore().collection(CONSTANTS.runs).doc(runId).set({
				apikey,
				runId,
			})
		);
};

exports.getRun = (runId) =>
	db
		.collection(CONSTANTS.runs)
		.doc(runId)
		.get()
		.then((doc) => doc.data());
