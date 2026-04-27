pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'ramram27/jenkins_devops'
        DOCKER_TAG = 'latest'
        CONTAINER_NAME = 'jenkins_devops_container'
        PORT = '8080'
    }

    stages {
        stage('clone code') {
           steps {
            git branch: 'main',
            url: 'https://github.com/ramram27/jenkins-devops.git'
           } 
        }

        stage('install dependencies'){
            steps{
                sh 'npm install'
            }
        }

        stage('Run tests case') {
            steps{
                sh 'npm test'
            }
        }

       stage('Build Docker Image') {
        steps {
            sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
        }
       }

       stage('Push Docker Image') {
        steps{
            withCredntials([usernamePassword(credentialsid: 'dockerhub',
            usernameVariable: 'DOCKER_USERNAME',
            passwordVariable: 'DOCKER_PASSWORD'
            )])
            {
                sh "
                echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                docker push ${DOCKER_IMAGE}: ${DOCKER_TAG}
                "

            }
        }
       }
     stage('Stop Old Container') {
            steps {
                sh """
                    docker rm -f ${CONTAINER_NAME} || true
                """
            }
        }

        stage('Run New Container') {
            steps {
                sh """
                    docker run -d \
                    --name ${CONTAINER_NAME} \
                    -p ${PORT}:8080 \
                    ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                sh """
                    docker ps
                """
            }
        }
    }

    post {

        success {
            echo 'CI/CD Pipeline executed successfully 🚀'
        }

        failure {
            echo 'Pipeline failed ❌ Please check logs.'
        }

        always {
            echo 'Pipeline execution completed.'
        }
    }

    }

