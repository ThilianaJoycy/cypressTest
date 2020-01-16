pipeline {
    agent any
    
    environment {
        CI = 'true'
    }
    tools {
        maven 'Maven 3.6.2'
    }
    triggers {
        when { branch "jhipster-registry" }
        cron('H/15 * * * *')
        when { branch "master" }
        cron('H/17 * * * *')
        when { branch "providers" }
        cron('H/19 * * * *')
        when { branch "products" }
        cron('H/21 * * * *')
        when { branch "gateway" }
        cron('H/25 * * * *')
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

