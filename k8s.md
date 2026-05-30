7. Install Node.js

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

sudo apt install nodejs -y

8. Install Kubernetes

Disable Swap
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab
Install Dependencies
sudo apt-get update

sudo apt-get install -y apt-transport-https ca-certificates curl
Add Kubernetes Repository
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | \
sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] \
https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | \
sudo tee /etc/apt/sources.list.d/kubernetes.list
Install Kubernetes Tools
sudo apt update

sudo apt install -y kubelet kubeadm kubectl

sudo apt-mark hold kubelet kubeadm kubectl
9. Initialize Kubernetes Cluster
sudo kubeadm init

Run after success:

mkdir -p $HOME/.kube

sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

sudo chown $(id -u):$(id -g) $HOME/.kube/config
10. Install Calico Network
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/calico.yaml
11. Allow Master Node Scheduling
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
12. Install Docker in Jenkins Permission
sudo chmod 777 /var/run/docker.sock

Restart Jenkins:

sudo systemctl restart jenkins