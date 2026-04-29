#!/bin/bash

echo "============================================"
echo "Recreating Jenkins with Docker Support"
echo "============================================"
echo ""

# Step 1: Stop and remove old Jenkins
echo "📦 Stopping current Jenkins container..."
sudo docker stop jenkins
echo "✅ Jenkins stopped"
echo ""

echo "🗑️  Removing old Jenkins container..."
sudo docker rm jenkins
echo "✅ Old container removed (your data is safe in jenkins_home volume)"
echo ""

# Step 2: Create new Jenkins with Docker socket
echo "🚀 Creating new Jenkins container with Docker support..."
sudo docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(which docker):/usr/bin/docker \
  --group-add $(getent group docker | cut -d: -f3) \
  jenkins/jenkins:lts

if [ $? -ne 0 ]; then
    echo "❌ Failed to create Jenkins container"
    exit 1
fi

echo "✅ Jenkins container created"
echo ""

# Step 3: Wait for Jenkins to start
echo "⏳ Waiting for Jenkins to initialize (15 seconds)..."
sleep 15

# Step 4: Install Docker CLI inside Jenkins
echo "🔧 Installing Docker CLI inside Jenkins..."
sudo docker exec -u root jenkins bash -c "
  apt-get update -qq && \
  apt-get install -y docker.io && \
  usermod -aG docker jenkins && \
  chmod 666 /var/run/docker.sock
"

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Docker"
    exit 1
fi

echo "✅ Docker installed successfully"
echo ""

# Step 5: Restart Jenkins
echo "🔄 Restarting Jenkins to apply changes..."
sudo docker restart jenkins

echo "✅ Jenkins restarted"
echo ""

# Step 6: Wait for restart
echo "⏳ Waiting for Jenkins to come back online (20 seconds)..."
sleep 20

# Step 7: Verify Docker access
echo "🔍 Verifying Docker access..."
sudo docker exec jenkins docker --version

if [ $? -eq 0 ]; then
    echo ""
    echo "============================================"
    echo "✅ SUCCESS! Jenkins is ready with Docker"
    echo "============================================"
    echo ""
    echo "🌐 Jenkins URL: http://65.1.64.154:8080"
    echo ""
    echo "Next steps:"
    echo "1. Go to Jenkins UI"
    echo "2. Navigate to your 'node_app' pipeline"
    echo "3. Click 'Build Now'"
    echo "4. Watch it succeed! 🎉"
    echo ""
else
    echo ""
    echo "⚠️  Docker verification failed"
    echo "Please check the logs above"
    exit 1
fi