# 🚀 Terraform Complete Guide — Step-by-Step for Students

> **Learning Path:** Theory → Installation → Configuration → Hands-On Practice

---

## Table of Contents

1. [What is Terraform?](#1-what-is-terraform)
2. [Core Concepts & Terminology](#2-core-concepts--terminology)
3. [How Terraform Works Internally](#3-how-terraform-works-internally)
4. [The Standard Workflow (Lifecycle)](#4-the-standard-workflow-lifecycle)
5. [Installation Guide](#5-installation-guide)
6. [AWS Setup & Credentials](#6-aws-setup--credentials)
7. [Your First Terraform Project](#7-your-first-terraform-project)
8. [File & Folder Structure](#8-file--folder-structure)
9. [HCL Language Deep Dive](#9-hcl-language-deep-dive)
10. [Providers in Detail](#10-providers-in-detail)
11. [Resources in Detail](#11-resources-in-detail)
12. [Variables & Outputs](#12-variables--outputs)
13. [State File — Terraform's Memory](#13-state-file--terraforms-memory)
14. [Terraform Commands Reference](#14-terraform-commands-reference)
15. [Benefits of Terraform](#15-benefits-of-terraform)
16. [Common Mistakes & How to Avoid Them](#16-common-mistakes--how-to-avoid-them)
17. [Glossary](#17-glossary)

---

## 1. What is Terraform?

Terraform is a free, open-source **Infrastructure as Code (IaC)** tool created by **HashiCorp**.

It lets you describe your cloud infrastructure — servers, databases, networks, DNS records — using simple text files instead of clicking around in a cloud console.

### 🧠 The Big Idea: Declarative vs Imperative

| Approach | Meaning | Example |
|---|---|---|
| **Imperative** (scripting) | Tell the computer *how* to do something, step by step | "First create VPC, then create subnet, then attach gateway..." |
| **Declarative** (Terraform) | Tell the computer *what* you want | "I want a VPC, a subnet, and a gateway." |

> **Analogy:** Imperative is like giving someone turn-by-turn directions. Declarative is like giving them the destination address and letting the GPS figure out the route.

Terraform is **declarative**. You describe the final state of your infrastructure, and Terraform figures out how to get there.

---

## 2. Core Concepts & Terminology

These are the four pillars of Terraform. Learn these and everything else makes sense.

### 2.1 HCL — HashiCorp Configuration Language

HCL is the language you write Terraform code in. Files end in `.tf`.

It is designed to be:
- Easy for humans to read and write
- Easy for machines to parse
- Less error-prone than JSON or YAML

```hcl
# This is HCL — it looks like this
resource "aws_instance" "my_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}
```

### 2.2 Providers

A **Provider** is a plugin that lets Terraform communicate with a specific platform's API.

Think of it as a **translator** between your `.tf` files and the cloud platform.

```
Your .tf file  →  Provider Plugin  →  AWS / Azure / GCP API
```

Popular providers:
- `hashicorp/aws` — Amazon Web Services
- `hashicorp/azurerm` — Microsoft Azure
- `hashicorp/google` — Google Cloud Platform
- `hashicorp/github` — GitHub
- `hashicorp/kubernetes` — Kubernetes clusters

### 2.3 Resources

A **Resource** is a specific infrastructure object you want to create or manage.

```hcl
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-unique-bucket-name"
}
```

Here:
- `aws_s3_bucket` → the type of resource (S3 bucket on AWS)
- `my_bucket` → your local name for it (used to reference it elsewhere)

### 2.4 State File (`terraform.tfstate`)

The state file is Terraform's **memory**. It is a JSON file that records what Terraform has already created in the real world.

```
Your Code   →  tells Terraform what you WANT
State File  →  tells Terraform what CURRENTLY EXISTS
Difference  →  tells Terraform what to CREATE, UPDATE, or DELETE
```

> ⚠️ **Critical Rule:** Never manually delete or edit `terraform.tfstate`. If it gets corrupted, Terraform loses track of what it built.

---

## 3. How Terraform Works Internally

When you run `terraform apply`, here is what happens behind the scenes:

```
Step 1: Read your .tf configuration files
Step 2: Read the current terraform.tfstate file
Step 3: Call the provider API to check real-world state
Step 4: Compare: desired state vs actual state
Step 5: Build a dependency graph (what needs to be created first?)
Step 6: Execute changes in the correct order
Step 7: Update terraform.tfstate with the new reality
```

### Dependency Graph Example

If you need a web server inside a subnet, inside a VPC:

```
VPC
 └── Subnet
      └── EC2 Instance (web server)
```

Terraform automatically figures out this order. You don't have to specify it.

---

## 4. The Standard Workflow (Lifecycle)

Every Terraform project follows this cycle:

```
Write → Init → Format → Validate → Plan → Apply → (Destroy)
```

### Step 1: `Write`

Create `.tf` files describing your infrastructure. This is where you spend most of your time as a developer.

### Step 2: `terraform init`

```bash
terraform init
```

**What it does:**
- Downloads the required provider plugins (e.g., the AWS plugin)
- Sets up the backend (where the state file lives)
- Creates a `.terraform/` folder with the downloaded plugins

> Run this once when you start a new project, or after adding a new provider.

### Step 3: `terraform fmt`

```bash
terraform fmt
```

**What it does:**
- Auto-formats your `.tf` files to follow standard style
- Fixes indentation, spacing, and alignment
- Non-destructive — only changes formatting, not logic

> Best practice: Always run this before committing to Git.

### Step 4: `terraform validate`

```bash
terraform validate
```

**What it does:**
- Checks your `.tf` files for syntax errors
- Verifies that resource arguments are correct
- Does NOT connect to AWS or any cloud — purely local check

```
Success!  ✅  The configuration is valid.
Error:    ❌  An argument named "instnce_type" is not expected here.
```

### Step 5: `terraform plan`

```bash
terraform plan
```

**What it does:**
- Connects to AWS (or your provider) to check real-world state
- Compares with your configuration
- Shows you **exactly** what will be created, changed, or destroyed

Output symbols:
- `+` (green) → will be **created**
- `~` (yellow) → will be **updated/changed**
- `-` (red) → will be **destroyed**

> 🛑 **Always review the plan before applying.** This is your safety net.

### Step 6: `terraform apply`

```bash
terraform apply
```

**What it does:**
- Shows you the plan one more time
- Asks for your confirmation: `Do you want to perform these actions? yes/no`
- Executes all the changes
- Updates `terraform.tfstate`

To skip the confirmation prompt (useful in automation):
```bash
terraform apply -auto-approve
```

### Step 7: `terraform destroy`

```bash
terraform destroy
```

**What it does:**
- Destroys **all** resources that Terraform manages in this project
- Asks for confirmation before deleting anything
- Updates `terraform.tfstate` to reflect the empty state

> ⚠️ Use this carefully! It deletes real infrastructure.

---

## 5. Installation Guide

### On Linux (Ubuntu/Debian)

```bash
# Step 1: Install required packages
sudo apt-get update && sudo apt-get install -y gnupg software-properties-common

# Step 2: Add HashiCorp GPG key
wget -O- https://apt.releases.hashicorp.com/gpg | \
  gpg --dearmor | \
  sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null

# Step 3: Add HashiCorp repository
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
  https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
  sudo tee /etc/apt/sources.list.d/hashicorp.list

# Step 4: Install Terraform
sudo apt update && sudo apt-get install terraform

# Step 5: Verify installation
terraform version
```

### On macOS

```bash
# Using Homebrew
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Verify
terraform version
```

### On Windows

```powershell
# Using Chocolatey
choco install terraform

# Or using Winget
winget install HashiCorp.Terraform

# Verify
terraform version
```

### Expected Output

```
Terraform v1.9.0
on linux_amd64
```

---

## 6. AWS Setup & Credentials

Terraform needs permission to create resources in your AWS account. Here is how to set it up safely.

### Step 1: Create an IAM User in AWS Console

1. Log into AWS Console → go to **IAM** → **Users**
2. Click **Create user**
3. Give it a name like `terraform-user`
4. Attach policy: `AdministratorAccess` (for learning) or specific policies for production
5. Go to **Security credentials** tab → **Create access key**
6. Choose **Command Line Interface (CLI)** use case
7. Download the CSV file — **store it somewhere safe**

### Step 2: Install AWS CLI

```bash
# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# macOS
brew install awscli

# Verify
aws --version
```

### Step 3: Set Environment Variables

Set your AWS credentials as environment variables. This is the most common method for local development.

```bash
# Add to ~/.bashrc (Linux/macOS)
echo "export AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_HERE" >> ~/.bashrc
echo "export AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY_HERE" >> ~/.bashrc
echo "export AWS_DEFAULT_REGION=us-east-1" >> ~/.bashrc

# Apply the changes
source ~/.bashrc

# Verify
echo $AWS_ACCESS_KEY_ID
```

> 🔐 **Security Warning:** Never hardcode credentials inside your `.tf` files. Never commit them to Git. Environment variables are the safe approach.

### Step 4: Verify AWS Connection

```bash
aws sts get-caller-identity
```

Expected output:
```json
{
    "UserId": "AIDA...",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/terraform-user"
}
```

---

## 7. Your First Terraform Project

Let's create a simple S3 bucket on AWS. This is the "Hello, World!" of Terraform.

### Project Structure

```
my-first-terraform/
├── main.tf          ← main configuration
├── variables.tf     ← input variables
├── outputs.tf       ← output values
└── terraform.tfstate  ← auto-generated, do not edit
```

### `main.tf`

```hcl
# Step 1: Tell Terraform which provider to use
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Step 2: Configure the provider (region)
provider "aws" {
  region = "us-east-1"
}

# Step 3: Define the resource you want to create
resource "aws_s3_bucket" "my_first_bucket" {
  bucket = "my-terraform-learning-bucket-12345"

  tags = {
    Name        = "My First Terraform Bucket"
    Environment = "Learning"
  }
}
```

### Run It

```bash
# Navigate to project folder
cd my-first-terraform

# Initialize (download AWS provider plugin)
terraform init

# Check formatting
terraform fmt

# Validate syntax
terraform validate

# Preview what will be created
terraform plan

# Create the bucket!
terraform apply

# When done learning, destroy it (avoid AWS charges)
terraform destroy
```

---

## 8. File & Folder Structure

A well-organized Terraform project looks like this:

```
project/
├── main.tf           ← core resources
├── variables.tf      ← all input variables defined here
├── outputs.tf        ← all outputs defined here
├── providers.tf      ← provider configuration
├── versions.tf       ← required Terraform/provider versions
├── terraform.tfstate ← auto-generated state file (do not edit)
├── .terraform/       ← auto-generated plugins folder (do not commit)
├── .terraform.lock.hcl ← dependency lock file (commit this to Git)
└── .gitignore        ← exclude state files and secrets from Git
```

### Recommended `.gitignore` for Terraform

```gitignore
# Terraform state files — contain sensitive info
*.tfstate
*.tfstate.backup

# Local .terraform directory — downloaded providers
.terraform/

# Override files (local overrides)
override.tf
override.tf.json
*_override.tf
*_override.tf.json

# Credentials (never commit these)
*.tfvars
*.auto.tfvars
```

---

## 9. HCL Language Deep Dive

### Basic Syntax

```hcl
# This is a comment

# Block structure:
block_type "label_one" "label_two" {
  argument_name = value
}

# Examples of values:
string_value  = "hello"
number_value  = 42
boolean_value = true
list_value    = ["a", "b", "c"]
map_value     = { key = "value", key2 = "value2" }
```

### Referencing Other Resources

```hcl
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id   # ← reference the VPC's ID
  cidr_block = "10.0.1.0/24"
}
```

Format: `resource_type.local_name.attribute`

---

## 10. Providers in Detail

### Configuring a Provider

```hcl
provider "aws" {
  region  = "us-east-1"
  profile = "default"  # uses ~/.aws/credentials profile
}
```

### Using Multiple Regions (Provider Aliases)

```hcl
provider "aws" {
  region = "us-east-1"
  alias  = "east"
}

provider "aws" {
  region = "us-west-2"
  alias  = "west"
}

resource "aws_s3_bucket" "east_bucket" {
  provider = aws.east
  bucket   = "bucket-in-east"
}

resource "aws_s3_bucket" "west_bucket" {
  provider = aws.west
  bucket   = "bucket-in-west"
}
```

---

## 11. Resources in Detail

### Resource Block Anatomy

```hcl
resource "RESOURCE_TYPE" "LOCAL_NAME" {
  # Arguments go here
}
```

- `RESOURCE_TYPE` — determined by the provider (e.g., `aws_instance`, `aws_s3_bucket`)
- `LOCAL_NAME` — your own name, used to reference this resource elsewhere

### Data Sources (Read-Only Resources)

Data sources let you **read** existing information without creating anything.

```hcl
# Look up the latest Amazon Linux 2 AMI automatically
data "aws_ami" "latest_amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Use it in a resource
resource "aws_instance" "web" {
  ami           = data.aws_ami.latest_amazon_linux.id  # ← reference data source
  instance_type = "t2.micro"
}
```

---

## 12. Variables & Outputs

### Input Variables (`variables.tf`)

Variables make your code reusable.

```hcl
# Declare a variable
variable "instance_type" {
  description = "The EC2 instance type to use"
  type        = string
  default     = "t2.micro"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  # No default = required; user must provide a value
}
```

### Using Variables

```hcl
resource "aws_instance" "web" {
  instance_type = var.instance_type  # ← reference with var.
  ami           = "ami-0c55b159cbfafe1f0"

  tags = {
    Environment = var.environment
  }
}
```

### Passing Variable Values

**Method 1:** Command line

```bash
terraform apply -var="environment=production"
```

**Method 2:** `.tfvars` file (recommended)

```hcl
# terraform.tfvars
environment   = "production"
instance_type = "t3.medium"
```

```bash
terraform apply -var-file="terraform.tfvars"
```

**Method 3:** Environment variables

```bash
export TF_VAR_environment="production"
terraform apply
```

### Output Values (`outputs.tf`)

Outputs display useful information after `apply` runs.

```hcl
output "bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.my_first_bucket.id
}

output "bucket_arn" {
  description = "The ARN of the S3 bucket"
  value       = aws_s3_bucket.my_first_bucket.arn
}
```

After `terraform apply`, you will see:

```
Outputs:

bucket_arn  = "arn:aws:s3:::my-terraform-learning-bucket-12345"
bucket_name = "my-terraform-learning-bucket-12345"
```

---

## 13. State File — Terraform's Memory

### What is in the State File?

```json
{
  "version": 4,
  "terraform_version": "1.9.0",
  "resources": [
    {
      "type": "aws_s3_bucket",
      "name": "my_first_bucket",
      "instances": [
        {
          "attributes": {
            "id": "my-terraform-learning-bucket-12345",
            "arn": "arn:aws:s3:::my-terraform-learning-bucket-12345",
            "region": "us-east-1"
          }
        }
      ]
    }
  ]
}
```

### What is Infrastructure Drift?

**Drift** happens when someone changes the real infrastructure (e.g., via the AWS Console) without updating the Terraform code.

```
Terraform State:  instance_type = t2.micro
AWS Console:      instance_type = t3.large  ← someone changed this manually!
Result:           DRIFT detected by terraform plan
```

Running `terraform plan` will show the drift and offer to revert it.

### Useful State Commands

```bash
# List all resources in state
terraform state list

# Show details of one resource
terraform state show aws_s3_bucket.my_first_bucket

# Remove a resource from state without destroying it
terraform state rm aws_s3_bucket.my_first_bucket

# Import an existing resource into state
terraform import aws_s3_bucket.my_first_bucket existing-bucket-name
```

---

## 14. Terraform Commands Reference

| Command | Purpose |
|---|---|
| `terraform init` | Initialize project, download providers |
| `terraform fmt` | Auto-format `.tf` files |
| `terraform validate` | Check syntax and configuration |
| `terraform plan` | Preview changes (dry run) |
| `terraform apply` | Apply changes to real infrastructure |
| `terraform destroy` | Destroy all managed resources |
| `terraform output` | Show output values |
| `terraform show` | Show current state or a saved plan |
| `terraform state list` | List resources in state |
| `terraform state show <resource>` | Show details of a resource in state |
| `terraform import` | Import existing resource into state |
| `terraform refresh` | Sync state with real-world infrastructure |
| `terraform graph` | Generate a visual dependency graph |
| `terraform version` | Show Terraform version |

---

## 15. Benefits of Terraform

### Version Control (GitOps)

Your infrastructure is just text files. Put them in Git:

```bash
git init
git add main.tf variables.tf outputs.tf
git commit -m "Initial infrastructure setup"
```

Now you can see who changed what, when, and why. You can roll back. You can review changes in pull requests.

### Multi-Cloud Support

Same workflow, different providers:

```hcl
# AWS resource
resource "aws_instance" "server" { ... }

# Azure resource
resource "azurerm_virtual_machine" "server" { ... }

# GCP resource
resource "google_compute_instance" "server" { ... }
```

### Idempotency

Run `terraform apply` 10 times with no code changes → Terraform does nothing (because the desired state already exists).

```
Apply complete! Resources: 0 added, 0 changed, 0 destroyed.
```

This makes automation safe.

### Speed & Consistency

Spinning up 20 identical dev environments used to take days of manual work. With Terraform:

```bash
terraform apply  # All 20 environments created in minutes, identically
```

---

## 16. Common Mistakes & How to Avoid Them

| Mistake | Why it Happens | How to Avoid |
|---|---|---|
| Deleting `terraform.tfstate` | Thinking it's just a cache | Never delete it; back it up |
| Hardcoding credentials in `.tf` | Convenience | Use environment variables or AWS profiles |
| Skipping `terraform plan` | Overconfidence | Always review before apply |
| Manual changes in AWS Console | Quick fixes | Make all changes through Terraform |
| Not pinning provider versions | Provider auto-updates can break code | Use `version = "~> 5.0"` constraints |
| Committing `.tfstate` to Git | Not setting up `.gitignore` | Add `*.tfstate` to `.gitignore` immediately |
| Using a single workspace for everything | Seems simpler | Use separate state per environment (dev/prod) |

---

## 17. Glossary

| Term | Definition |
|---|---|
| **IaC** | Infrastructure as Code — managing infrastructure through code files |
| **HCL** | HashiCorp Configuration Language — the language used in `.tf` files |
| **Provider** | Plugin that connects Terraform to a cloud platform (AWS, Azure, GCP) |
| **Resource** | A specific cloud object to be created/managed (VM, bucket, database) |
| **Data Source** | Read-only resource that fetches information about existing infrastructure |
| **State File** | `terraform.tfstate` — Terraform's record of what currently exists |
| **Drift** | When real infrastructure differs from what Terraform's state expects |
| **Idempotency** | Running the same operation multiple times gives the same result |
| **Plan** | A preview of what changes Terraform will make |
| **Backend** | Where the state file is stored (local, S3, Terraform Cloud, etc.) |
| **Module** | A reusable group of Terraform resources packaged together |
| **Workspace** | A way to have multiple state files for the same configuration (dev, prod) |
| **Terraform Registry** | Official marketplace for providers and modules (registry.terraform.io) |

---

## 🎯 Quick Summary

```
Terraform = Write code → Plan → Apply → Infrastructure exists
           (reverse)  → Destroy → Infrastructure gone
```

The key insight: **Your `.tf` files describe the desired state of the world. Terraform makes the world match your description.**

---

*Document prepared for Terraform students — covers theory, installation, and hands-on practice.*
