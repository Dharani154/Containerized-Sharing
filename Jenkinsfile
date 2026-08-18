pipeline {
    agent any

    environment {
        APP_NAME = "sharebox-app"
        CONTAINER_NAME = "sharebox"
        APP_PORT = "4040"
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
                    docker build -t ${APP_NAME}:${BUILD_NUMBER} .
                '''
            }
        }

        stage('Docker Test') {
            steps {
                echo 'Testing Docker image'

                sh '''
                    docker images ${APP_NAME}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying ShareBox'

                sh '''
                    echo "Removing old container if it exists..."

                    docker rm -f ${CONTAINER_NAME} 2>/dev/null || true

                    echo "Starting new ShareBox container..."

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${APP_PORT}:${APP_PORT} \
                        -v sharebox-data:/app/uploads \
                        ${APP_NAME}:${BUILD_NUMBER}

                    echo "Deployment completed."

                    docker ps --filter "name=${CONTAINER_NAME}"
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Checking deployed ShareBox application'

                sh '''
                    echo "===== CONTAINER STATUS ====="

                    docker ps -a --filter "name=${CONTAINER_NAME}"

                    echo "===== CONTAINER DETAILS ====="

                    docker inspect ${CONTAINER_NAME} \
                        --format='Status={{.State.Status}} ExitCode={{.State.ExitCode}}'

                    echo "===== APPLICATION LOGS ====="

                    docker logs ${CONTAINER_NAME}

                    echo "===== INTERNAL HEALTH CHECK ====="

                    HEALTH_OK=false

                    for i in $(seq 1 10); do

                        if docker exec ${CONTAINER_NAME} \
                            wget -qO- http://127.0.0.1:${APP_PORT}/health; then

                            echo ""
                            echo "Internal health check PASSED"

                            HEALTH_OK=true
                            break
                        fi

                        echo "Application not ready. Attempt $i/10"

                        sleep 2
                    done

                    if [ "$HEALTH_OK" != "true" ]; then

                        echo "ERROR: ShareBox internal health check failed"

                        echo "===== FINAL CONTAINER LOGS ====="

                        docker logs ${CONTAINER_NAME}

                        exit 1
                    fi

                    echo "===== HOST HEALTH CHECK ====="

                    if curl -fs http://localhost:${APP_PORT}/health; then

                        echo ""
                        echo "Host health check PASSED"

                    else

                        echo ""
                        echo "WARNING: Host health check failed"
                        echo "Internal container health check passed."

                    fi
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

        always {
            echo 'Pipeline execution completed'
        }
    }
}