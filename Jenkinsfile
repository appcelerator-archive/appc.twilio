#!groovy
@Library('pipeline-library') _

timestamps {
	node('git && (osx || linux)') {
		stage('Checkout') {
			checkout scm
		}

		stage('Configuration') {
			// TODO: Update the conf/local.js needed for running npm test here!
			sh "echo \"module.exports = { logLevel: 'error', connectors: { 'appc.twilio': { sid: '<yourTwilioAccountSID>', auth_token: '<yourTwilioAuthToken>', twilio_number: '<yourTwilioPhoneNumber>', modelAutogen: true }}};\" > conf/local.js"
		}

		buildConnector {
			// don't override anything yet, like:

			// nodeVersion = '4.7.3' // Updating this requires we set up the desired
			// version of Node.JS on our Jenkins master as a "tool" first

			// updateJIRA = true // Defaults to true if this build isn't a PR

			// publish = true // Defaults to true if this build isn't a PR,
			// but you could do something like:
			// publish = env.BRANCH_NAME.equals('master')
			// to only publish on master branch builds.
		}
	}
}
