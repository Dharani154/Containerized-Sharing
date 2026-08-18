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
            docker rm -f sharebox 2>/dev/null || true

            docker run -d \
                --name sharebox \
                -p 4040:4040 \
                -v sharebox-data:/app/uploads \
                sharebox-app:${BUILD_NUMBER}

            echo "Container started:"
            docker ps --filter "name=sharebox"
        '''
    }
}

        stage('Verify Deployment') {
    steps {
        echo 'Checking deployed application'

        sh '''
            echo "Container status:"
            docker ps -a --filter "name=sharebox"

            echo "Container logs:"
            docker logs sharebox || true

            echo "Waiting for application..."

            for i in $(seq 1 12); do
                if curl -fs http://localhost:4040/health; then
                    echo ""
                    echo "ShareBox deployment verified successfully!"
                    exit 0
                fi

                echo "Application not ready yet. Attempt $i/12"
                sleep 2
            done

            echo "Application failed to start."
            docker ps -a --filter "name=sharebox"
            docker logs sharebox

            exit 1
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
