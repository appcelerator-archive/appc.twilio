#!groovy
@Library('pipeline-library') _

timestamps {
	node('git && (osx || linux)') {
		stage('Checkout') {
			checkout scm
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