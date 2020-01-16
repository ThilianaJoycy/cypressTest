pipeline {
    agent any
    
    environment {
        CI = 'true'
    }
    tools {
        maven 'Maven 3.6.2'
    }
    triggers {
        cron('H/21 * * * *')
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

