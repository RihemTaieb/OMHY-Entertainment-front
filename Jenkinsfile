pipeline {
    agent any

    environment {
        REACT_PORT = '3000'
    }

    stages {
        stage('Clone Repo') {
            steps {
                script {
                    sh '''
                    git clone https://github.com/RihemTaieb/OMHY-Entertainment-front.git frontend
                    '''
                }
            }
        }

        stage('Build and Deploy React') {
            steps {
                script {
                    sh '''
                    cd frontend
                    docker build -t react-app .
                    docker stop react-app || true
                    docker rm react-app || true
                    docker run -d -p 3000:3000 --name react-app react-app
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    sh "rm -rf frontend"
                }
            }
        }
    }

    post {
        success {
            echo "React deployment successful!"
        }
        failure {
            echo "React deployment failed!"
        }
    }
}
