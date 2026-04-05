# Container Deployment Guide - Yoga Marie Mills

This guide walks through containerizing and deploying the Yoga Marie Mills application to Azure.

## Overview

The deployment pipeline consists of:
- **Dockerfile** - Multi-stage build optimizing for size and security
- **GitHub Actions** - CI/CD pipeline that builds, tests, and deploys automatically
- **Azure Container Registry** - Stores container images
- **Azure App Service** - Hosts the running container
- **Azure Key Vault** - Securely stores database credentials

## Prerequisites

Before starting, ensure you have:
- Azure subscription
- GitHub repository for this project
- Azure CLI installed locally (`az` command)
- Docker installed locally (for testing)

## Step 1: Set Up Azure Resources

### 1.1 Create a Resource Group

```bash
az group create --name yogamariemills-rg --location eastus
```

### 1.2 Create Azure Container Registry

```bash
az acr create --resource-group yogamariemills-rg \
  --name yogamariemillsacr \
  --sku Basic
```

Save your registry login server: `yogamariemillsacr.azurecr.io`

### 1.3 Create Azure Key Vault

```bash
az keyvault create --resource-group yogamariemills-rg \
  --name yogamariemills-vault \
  --location eastus
```

### 1.4 Store Database Connection String

Get your MSSQL connection string from Azure SQL Database or your managed database:

```bash
az keyvault secret set --vault-name yogamariemills-vault \
  --name "db-connection-string" \
  --value "Server=tcp:your-server.database.windows.net,1433;Initial Catalog=yogamariemills;Persist Security Info=False;User ID=yourusername;Password=yourpassword;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
```

### 1.5 Add Seed Admin Credentials

```bash
az keyvault secret set --vault-name yogamariemills-vault \
  --name "seed-admin-email" \
  --value "admin@yogamariemills.com"

az keyvault secret set --vault-name yogamariemills-vault \
  --name "seed-admin-password" \
  --value "YourSecurePassword123!"

az keyvault secret set --vault-name yogamariemills-vault \
  --name "seed-admin-first-name" \
  --value "Marie"

az keyvault secret set --vault-name yogamariemills-vault \
  --name "seed-admin-last-name" \
  --value "Mills"
```

### 1.6 Create Azure App Service Plan & App

```bash
az appservice plan create --name yogamariemills-plan \
  --resource-group yogamariemills-rg \
  --sku B1 \
  --is-linux

az webapp create --resource-group yogamariemills-rg \
  --plan yogamariemills-plan \
  --name yogamariemills-app \
  --deployment-container-image-name yogamariemillsacr.azurecr.io/yoga-marie-mills:latest
```

## Step 2: Configure GitHub Actions Secrets

In your GitHub repository, go to **Settings → Secrets and variables → Actions** and add these secrets:

```
AZURE_REGISTRY_LOGIN_SERVER = yogamariemillsacr.azurecr.io
AZURE_REGISTRY_USERNAME = <username from az acr credential show>
AZURE_REGISTRY_PASSWORD = <password from az acr credential show>
AZURE_APP_SERVICE_NAME = yogamariemills-app
AZURE_CREDENTIALS = <Service Principal JSON from Step 3>
```

### Get ACR Credentials

```bash
az acr credential show --resource-group yogamariemills-rg \
  --name yogamariemillsacr
```

## Step 3: Create Service Principal for GitHub Actions

This allows GitHub Actions to authenticate with Azure:

```bash
az ad sp create-for-rbac --name github-actions-sp \
  --role Contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/yogamariemills-rg \
  --json-auth > azure-credentials.json
```

Copy the entire JSON output and add it as the `AZURE_CREDENTIALS` secret in GitHub.

## Step 4: Configure App Service Environment Variables

Set up connection strings and secrets in Azure App Service:

```bash
az webapp config appsettings set \
  --resource-group yogamariemills-rg \
  --name yogamariemills-app \
  --settings \
    NODE_ENV=production \
    DB_SERVER=tcp:your-server.database.windows.net \
    DB_DATABASE=yogamariemills \
    DB_USER=youradminuser \
    DB_PASSWORD=@Microsoft.KeyVault(SecretUri=https://yogamariemills-vault.vault.azure.net/secrets/db-password/) \
    SEED_ADMIN_EMAIL=@Microsoft.KeyVault(SecretUri=https://yogamariemills-vault.vault.azure.net/secrets/seed-admin-email/) \
    SEED_ADMIN_PASSWORD=@Microsoft.KeyVault(SecretUri=https://yogamariemills-vault.vault.azure.net/secrets/seed-admin-password/) \
    SEED_ADMIN_FIRST_NAME=@Microsoft.KeyVault(SecretUri=https://yogamariemills-vault.vault.azure.net/secrets/seed-admin-first-name/) \
    SEED_ADMIN_LAST_NAME=@Microsoft.KeyVault(SecretUri=https://yogamariemills-vault.vault.azure.net/secrets/seed-admin-last-name/)
```

### Grant App Service Access to Key Vault

```bash
# Get App Service managed identity
APP_IDENTITY=$(az webapp identity show --resource-group yogamariemills-rg \
  --name yogamariemills-app --query principalId --output tsv)

# Grant access to Key Vault
az keyvault set-policy --name yogamariemills-vault \
  --object-id $APP_IDENTITY \
  --secret-permissions get
```

## Step 5: Enable Container Registry Access

Configure App Service to pull from your private registry:

```bash
az webapp config container set \
  --name yogamariemills-app \
  --resource-group yogamariemills-rg \
  --docker-custom-image-name yogamariemillsacr.azurecr.io/yoga-marie-mills:latest \
  --docker-registry-server-url https://yogamariemillsacr.azurecr.io \
  --docker-registry-server-user <username> \
  --docker-registry-server-password <password>
```

Or use managed identity (preferred):

```bash
az webapp identity assign \
  --resource-group yogamariemills-rg \
  --name yogamariemills-app

az acr update --name yogamariemillsacr --admin-enabled false

RESOURCE_ID=$(az webapp show --resource-group yogamariemills-rg \
  --name yogamariemills-app --query id --output tsv)

az role assignment create --assignee-object-id $(az webapp show \
  --resource-group yogamariemills-rg \
  --name yogamariemills-app --query identity.principalId --output tsv) \
  --role AcrPull \
  --scope /subscriptions/{subscription-id}/resourceGroups/yogamariemills-rg/providers/Microsoft.ContainerRegistry/registries/yogamariemillsacr
```

## Step 6: Test Locally (Optional)

Before pushing to Azure, test the Docker build locally:

```bash
# Build the image
docker build -t yoga-marie-mills:latest .

# Run with docker-compose (requires .env file with DB settings)
docker-compose -f docker-compose.yml up

# Or manually with docker
docker run -p 3000:3000 \
  -e DB_SERVER=your-server \
  -e DB_DATABASE=yogamariemills \
  -e DB_USER=admin \
  -e DB_PASSWORD=yourpassword \
  yoga-marie-mills:latest
```

## Step 7: Deploy

Simply push to the `main` branch. GitHub Actions will:
1. Run tests and lint checks
2. Build the Docker image
3. Push to Azure Container Registry
4. Deploy to Azure App Service

Monitor the workflow in GitHub → Actions tab.

## Troubleshooting

### App won't start
```bash
az webapp log tail --resource-group yogamariemills-rg --name yogamariemills-app
```

### Check deployment status
```bash
az webapp deployment show --resource-group yogamariemills-rg --name yogamariemills-app
```

### View environment variables
```bash
az webapp config appsettings list --resource-group yogamariemills-rg --name yogamariemills-app
```

### Restart the app
```bash
az webapp restart --resource-group yogamariemills-rg --name yogamariemills-app
```

## Cost Optimization

Current setup uses:
- **B1 App Service Plan** - ~$50/month
- **Basic ACR** - ~$5/month for storage
- **Key Vault** - Pay-as-you-go, typically <$1/month

For production, consider:
- **S1 App Service Plan** if you need better performance
- **Standard ACR** for higher reliability
- **Reserved Instances** for long-term cost savings

## Next Steps

1. Configure CORS if frontend is on different domain
2. Set up SSL/TLS certificate (free with App Service)
3. Configure auto-scaling based on CPU/memory
4. Set up monitoring and alerts
5. Configure backup strategy for database

For questions or issues, refer to [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/).
