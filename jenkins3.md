Step 2: Connect to EC2 Instance
# SSH into your instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip
# Step 3: Update System Packages
sudo apt update -y
sudo apt upgrade -y

# Step 4: Install Docker
# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
<!-- sudo apt install -y docker-ce docker-ce-cli containerd.io -->

sudo apt install -y docker.io

# Start and enable Docker 
sudo systemctl start docker
sudo systemctl enable docker

# Verify Docker installation
sudo docker --version
sudo docker run hello-world
# Step 5: Configure Docker Permissions
# Add current user to docker group (avoid using sudo)
sudo usermod -aG docker ubuntu

# Apply group changes (or logout/login)
newgrp docker

# Test without sudo
docker ps
# Step 6: Install Jenkins using Docker
Option A: Run Jenkins as Docker Container (Recommended for Quick Setup)


# Run Jenkins container
docker rm -f jenkins

docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --user root \
  --restart=unless-stopped \
  jenkins/jenkins:lts


# Open browser: http://your-ec2-public-ip:8080
Get initial admin password:

# If using Docker:
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# If installed directly:
sudo cat /var/lib/jenkins/secrets/initialAdminPassword


# STEP 1: Install Docker CLI inside Jenkins container

docker exec -u root -it jenkins bash

# Then inside container:

apt update
apt install -y docker.io

# Verify:
docker --version

# Exit:
exit
# STEP 2: Restart Jenkins container
docker restart jenkins




# run container 8000 and ec2 public app run 3000
docker run -d \
  --name jenkins_devops_container \
  -p 4000:3000 \
  --restart unless-stopped \
  ramram27/jenkins_devops:latest

# check log
docker ps
docker logs jenkins_devops_container

# docker rm -f jenkins_devops_container
# Step 3: Test again
curl http://localhost:3000

# Rerun ec2 server
# Step 1: Remove old container
docker rm -f jenkins_devops_container

# Step 2: Run fresh container
docker run -d \
  --name jenkins_devops_container \
  -p 4000:3000 \
  --restart unless-stopped \
  ramram27/jenkins_devops:latest


Copy the password and paste into Jenkins setup screen
Click "Install suggested plugins"
Create your first admin user
Complete setup

Step 8: Configure Jenkins for Docker

In Jenkins → Manage Jenkins → Manage Plugins
Install plugins:

Docker Pipeline
Docker plugin
Git plugin


Restart Jenkins

Step 9: Verify Docker Integration
Create a test Jenkins pipeline:

New Item → Pipeline
Use this test script:

Run the pipeline to verify Docker works

Step 10: Security Best Practices
# Enable UFW firewall
sudo ufw allow 22/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Configure automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
Useful Commands
# Docker commands
docker ps                    # List running containers
docker logs jenkins          # View Jenkins logs
docker restart jenkins       # Restart Jenkins
docker stop jenkins          # Stop Jenkins
docker start jenkins         # Start Jenkins

# Jenkins service commands (if installed directly)
sudo systemctl status jenkins
sudo systemctl restart jenkins
sudo systemctl stop jenkins

# Check logs
sudo journalctl -u jenkins -f
Troubleshooting

Jenkins not accessible: Check security group allows port 8080
Docker permission denied: Ensure user is in docker group and logout/login
Jenkins can't use Docker: Add jenkins user to docker group and restart
Out of memory: Use at least t2.medium instance type

# start docker service
sudo systemctl start docker
sudo systemctl enable docker
docker ps
# Start Jenkins Container (if exists)
Check all containers:
docker ps -a

# If you see jenkins container in Exited state:
docker start jenkins
docker ps -a

# If container exists:
docker start jenkins_devops_container

# If Container NOT Exists (Run Again)

docker run -d \
  --name jenkins_devops_container \
  -p 3000:3000 \
  --restart unless-stopped \
  ramram27/jenkins_devops:latest