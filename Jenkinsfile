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
            docker build -t sharebox-app:${BUILD_NUMBER} .
        '''
    }
}

stage('Docker Test') {
    steps {
        echo 'Testing Docker image'

        sh '''
            docker images sharebox-app:${BUILD_NUMBER}
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

            echo "Deployment completed"
            docker ps --filter "name=sharebox"
        '''
    }
}
}
            stage('Verify Deployment') {
    steps {
        echo 'Checking deployed ShareBox application'

        sh '''
            echo "===== CONTAINER STATUS ====="
            docker ps -a --filter "name=sharebox"

            echo "===== CONTAINER DETAILS ====="
            docker inspect sharebox --format='Status={{.State.Status}} ExitCode={{.State.ExitCode}}'

            echo "===== APPLICATION LOGS ====="
            docker logs sharebox

            echo "===== INTERNAL HEALTH CHECK ====="

            for i in $(seq 1 10); do
                if docker exec sharebox wget -qO- http://127.0.0.1:4040/health; then
                    echo ""
                    echo "Internal health check PASSED"
                    break
                fi

                echo "Waiting for ShareBox... attempt $i/10"
                sleep 2

                if [ "$i" -eq 10 ]; then
                    echo "ERROR: ShareBox health check failed"
                    docker logs sharebox
                    exit 1
                fi
            done

            echo "===== HOST HEALTH CHECK ====="

            if curl -fs http://localhost:4040/health; then
                echo ""
                echo "Host health check PASSED"
            else
                echo ""
                echo "WARNING: Host-level health check failed"
                echo "Container-level health check passed."
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

    }

}
