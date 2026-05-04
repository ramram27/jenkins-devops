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
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Verify Docker installation
sudo docker --version
sudo docker run hello-world
# Step 5: Configure Docker Permissions
# Add current user to docker group (avoid using sudo)
sudo usermod -aG docker $USER

# Apply group changes (or logout/login)
newgrp docker

# Test without sudo
docker ps
# Step 6: Install Jenkins using Docker
Option A: Run Jenkins as Docker Container (Recommended for Quick Setup)
# Create a volume for Jenkins data persistence
docker volume create jenkins_home

# Run Jenkins container
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --restart=unless-stopped \
  jenkins/jenkins:lts


# Open browser: http://your-ec2-public-ip:8080
Get initial admin password:

# If using Docker:
# docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# If installed directly:
sudo cat /var/lib/jenkins/secrets/initialAdminPassword



# Step 1: Install Docker CLI in Your Running Jenkins Container

docker exec -u root jenkins bash -c "
apt-get update && \
apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release && \
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian bullseye stable' > /etc/apt/sources.list.d/docker.list && \
apt-get update && \
apt-get install -y docker-ce-cli && \
chmod 666 /var/run/docker.sock
"

# Step 2: Fix Permissions on Host
sudo chmod 666 /var/run/docker.sock
# Step 3: Verify Installation
# Check Docker CLI is installed
docker exec jenkins docker --version
# Test Docker works
docker exec jenkins docker ps
# Check socket permissions
docker exec jenkins ls -la /var/run/docker.sock

# run container 8000 and ec2 public app run 3000
docker run -d \
  --name jenkins_devops_container \
  -p 3000:8000 \
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

# Step 1: Install Docker CLI in Jenkins Container
docker exec -u root jenkins bash -c "
apt-get update && \
apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release && \
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian bullseye stable' > /etc/apt/sources.list.d/docker.list && \
apt-get update && \
apt-get install -y docker-ce-cli
"

Step 2: Fix Docker Socket Permissions
# Fix permissions inside container
docker exec -u root jenkins chmod 666 /var/run/docker.sock

# Fix permissions on EC2 host
sudo chmod 666 /var/run/docker.sock

Step 3: Verify Docker is Working
# Check Docker version
docker exec jenkins docker --version

# Check Docker ps
docker exec jenkins docker ps