Step 1 — Check container exist or not
docker ps -a | grep jenkins_devops
Step 2 — Container logs check
docker logs jenkins_devops_container

step 3 delete old container
sudo docker rm -f jenkins_devops_container

sudo docker run -d \
  --name jenkins_devops_container \
  -p 3000:8000 \
  ramram27/jenkins_devops:latest

verify
sudo docker ps | grep jenkins_devops
sudo docker logs jenkins_devops_container

Install Jenkins using Docker
Works perfectly on any Ubuntu version

Step 1: Install Docker
sudo apt update
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker


Run Jenkins container
sudo docker run -d \
  -p 3000:8080 -p 5000:5000 \
  --name jenkins \
  jenkins/jenkins:lts

 # -p 8080:8080
    ↑         ↑
EC2 ka port   Container ke andar ka port

Jenkins Agent → EC2:50000 → Jenkins Container:50000
                             (Agent communication)

sudo systemctl status docker
sudo systemctl start docker
sudo systemctl enable docker

Stop / Start Container
docker stop container_name
docker rm -f container_name

docker start container_name
docker restart container_name

Remove broken config 
sudo rm -f /etc/apt/sources.list.d/jenkins.list
sudo rm -f /usr/share/keyrings/jenkins-keyring.

sudo docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
36ceccfc5d4c4cc4b5bdfc9e5e555985



 1 project 
http://localhost:8080
https://www.oracle.com/java/technologies/downloads/#jdk21-windows



Jenkins Installation (Step-by-Step)
On Ubuntu / EC2
Step 1: Install Java (Required)
sudo apt update
sudo apt install openjdk-21-jdk -y
Step 2: Install Jenkins
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian binary/ > \
/etc/apt/sources.list.d/jenkins.list'

sudo apt update
sudo apt install jenkins -y
Step 3: Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

Open in browser:
http://<your-server-ip>:8080


Step 4: Get Admin Password
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
6. Install Required Jenkins Plugins

docker run -d \
-p 3000:8080 \
-p 5000:5000 \
-v /var/run/docker.sock:/var/run/docker.sock \
-v jenkins_home:/var/jenkins_home \
--name jenkins \
jenkins/jenkins:lts

Inside Jenkins dashboard:

Git Plugin
Docker Pipeline
NodeJS Plugin
Pipeline Plugin
7. Install Docker
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

Give Jenkins permission:

sudo usermod -aG docker jenkins
sudo systemctl restart jenkins


Jenkins automates the CI/CD pipeline by integrating with GitHub. Whenever code is pushed, Jenkins pulls the code, installs dependencies, builds a Docker image, and deploys the application in a container. This ensures faster, consistent, and automated deployments without manual intervention.


Why Jenkins is Used?

Without Jenkins 
Developer writes code
Manually build
Manually test
Manually deploy


Time-consuming + errors
With Jenkins 
Push code → Everything automatic 

CI (Continuous Integration)

Developers push code frequently → Jenkins builds & tests automatically

CD (Continuous Delivery/Deployment)

After build → App is automatically deployed


What is Jenkins?

Jenkins is an open-source automation tool used to implement CI/CD pipelines. It automates the process of building, testing, and deploying applications, helping teams deliver software faster and more reliably.


Real Project Flow (Node.js Example)
Developer pushes code
Jenkins pulls code
Install dependencies
Run tests
Build Docker image
Deploy container


Advantages of Jenkins

✔ Automation saves time
✔ Reduces human errors
✔ Fast deployment
✔ Continuous feedback

Disadvantages

❌ Setup can be complex
❌ Needs maintenance
❌ UI is old