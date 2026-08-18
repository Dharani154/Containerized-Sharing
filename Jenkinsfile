pipeline {

    agent any

    environment {

        IMAGE_NAME = "sharebox-app"
        CONTAINER_NAME = "sharebox"

    }

    stages {

        stage('Checkout') {

            steps {

                echo 'Checking source code'

                checkout scm

            }
        }

        stage('Health Check') {

            steps {

                echo 'Running health check'

                sh '''
                    chmod +x scripts/health-check.sh
                    ./scripts/health-check.sh
                '''

            }
        }

        stage('System Information') {

            steps {

                sh '''
                    chmod +x scripts/system-info.sh
                    ./scripts/system-info.sh
                '''

            }
        }

        stage('Build Docker Image') {

            steps {

                echo 'Building Docker image'

                sh '''
                    docker build \
                    -t ${IMAGE_NAME}:${BUILD_NUMBER} .
                '''

            }
        }

        stage('Docker Test') {

            steps {

                echo 'Testing Docker image'

                sh '''
                    docker images ${IMAGE_NAME}:${BUILD_NUMBER}
                '''

            }
        }

        stage('Deploy') {

            steps {

                echo 'Deploying ShareBox'

                sh '''
                    docker rm -f ${CONTAINER_NAME} || true

                    docker run -d \
                      --name ${CONTAINER_NAME} \
                      -p 4040:4040 \
                      -v sharebox-data:/app/uploads \
                      ${IMAGE_NAME}:${BUILD_NUMBER}
                '''

            }
        }

        stage('Verify Deployment') {

            steps {

                echo 'Checking deployed application'

                sh '''
                    sleep 5

                    curl -f http://localhost:4040/health
                '''

            }
        }

    }

    post {

        success {

            echo 'ShareBox CI/CD Pipeline completed successfully'

        }

        failure {

            echo 'ShareBox CI/CD Pipeline failed'

        }

    }

}
