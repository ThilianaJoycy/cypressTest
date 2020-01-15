pipeline {
    agent any
    
    environment {
        CI = 'true'
    }
    stages {
        stage('Build') {
            steps {
                sh 'mvn'
            }
        }
        stage('Test') {
            when {
                branch 'gateway' 
            }
            steps {
                sh 'npm run cypress:open'
            }
            post {
                always {
              /* Use slackNotifier.groovy from shared library and provide current build result as parameter */
                  slackNotifier(currentBuild.currentResult)
                  cleanWs()
                }
            }
        }
        stage('Notify me') {
            when {
                branch 'gateway' 
            }
            steps {
                mail bcc: '', body: 'send notification after end of stage intégration ',
                cc: 'joyce.yimga@sprint-pay.com', from: 'joyce.yimga@sprint-pay.com', replyTo: '',
                subject: 'Jenkins pipeline', to: 'joyce.yimga@sprint-pay.com'
            }
        }
        
    }
    
}

