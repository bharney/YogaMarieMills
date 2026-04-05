# Docker Deployment Instructions

## Local Testing

### 1. Build the Docker Image

```bash
docker build -t yoga-marie-mills:latest .
```

### 2. Run with Docker Compose (Recommended)

Create a `.env.docker` file with your database settings:

```env
DB_SERVER=your-database-server.database.windows.net
DB_DATABASE=yogamariemills
DB_USER=dbadmin
DB_PASSWORD=YourSecurePassword123!
DB_PORT=1433
SEED_ADMIN_EMAIL=admin@yogamariemills.com
SEED_ADMIN_PASSWORD=Admin123!
SEED_ADMIN_FIRST_NAME=Marie
SEED_ADMIN_LAST_NAME=Mills
```

Then run:

```bash
docker-compose --env-file .env.docker up
```

The app will be available at `http://localhost:3000`

### 3. Run Standalone Container

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_SERVER=your-server.database.windows.net \
  -e DB_DATABASE=yogamariemills \
  -e DB_USER=dbadmin \
  -e DB_PASSWORD=YourPassword \
  -e SEED_ADMIN_EMAIL=admin@yogamariemills.com \
  -e SEED_ADMIN_PASSWORD=Admin123! \
  -e SEED_ADMIN_FIRST_NAME=Marie \
  -e SEED_ADMIN_LAST_NAME=Mills \
  yoga-marie-mills:latest
```

## Push to Azure Container Registry

### 1. Log in to ACR

```bash
az acr login --name yogamariemillsacr
```

### 2. Tag the Image

```bash
docker tag yoga-marie-mills:latest yogamariemillsacr.azurecr.io/yoga-marie-mills:latest
docker tag yoga-marie-mills:latest yogamariemillsacr.azurecr.io/yoga-marie-mills:v1.0.0
```

### 3. Push to Registry

```bash
docker push yogamariemillsacr.azurecr.io/yoga-marie-mills:latest
docker push yogamariemillsacr.azurecr.io/yoga-marie-mills:v1.0.0
```

### 4. Verify Push

```bash
az acr repository list --name yogamariemillsacr
az acr repository show-tags --name yogamariemillsacr --repository yoga-marie-mills
```

## Dockerfile Details

The Dockerfile uses a **multi-stage build** pattern:

1. **Builder Stage** (`node:18-alpine`)
   - Installs dependencies
   - Runs webpack build
   - Creates optimized bundle

2. **Production Stage** (`node:18-alpine`)
   - Copies only built artifacts and production dependencies
   - Adds health check
   - Uses dumb-init for proper signal handling
   - Exposes port 3000

**Benefits:**
- Smaller final image (~200MB vs 400MB+)
- Faster builds (previously built layers cached)
- Secure (no build tools in production)
- Better signal handling in containers

## Environment Variables

The following environment variables should be set in production:

| Variable | Required | Description |
|----------|----------|-------------|
| NODE_ENV | Yes | Set to `production` |
| DB_SERVER | Yes | MSSQL server address |
| DB_DATABASE | Yes | Database name |
| DB_USER | Yes | Database user |
| DB_PASSWORD | Yes | Database password |
| DB_PORT | No | Database port (default: 1433) |
| SEED_ADMIN_EMAIL | No | Admin seed email |
| SEED_ADMIN_PASSWORD | No | Admin seed password |
| SEED_ADMIN_FIRST_NAME | No | Admin first name |
| SEED_ADMIN_LAST_NAME | No | Admin last name |

## Troubleshooting

### Build fails with "out of memory"
Increase Docker's memory allocation in Docker Desktop settings (Preferences → Resources).

### Port already in use
```bash
docker-compose down  # Stop running containers
docker ps            # Check what's running
```

### Can't connect to database
```bash
# Test connection from container
docker exec <container-id> ping your-server.database.windows.net
```

### View container logs
```bash
docker logs <container-id>
docker logs -f <container-id>  # Follow logs
```

### Clean up Docker resources
```bash
docker system prune -a --volumes  # Remove all unused images/containers
```

## Health Check

The container includes a health check that validates the service is running:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3
```

- Checks every 30 seconds
- Waits up to 10 seconds for response
- Waits 40 seconds after start before first check
- Marks unhealthy after 3 failed checks

View health status:
```bash
docker inspect <container-id> | grep -A 5 '"Health"'
```

## Multi-environment Compose

For production testing with complex setups:

```bash
# Development
docker-compose up

# Production simulation
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

This allows composing multiple compose files for different configurations.
