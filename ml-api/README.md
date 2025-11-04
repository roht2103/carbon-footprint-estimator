# Carbon Footprint ML API

Machine Learning API for predicting carbon footprint based on lifestyle factors.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Navigate to ml-api directory
cd ml-api

# Build and start the container
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Option 2: Using Docker directly

```bash
# Navigate to ml-api directory
cd ml-api

# Build the Docker image
docker build -t carbon-ml-api .

# Run the container
docker run -d -p 5000:5000 --name carbon-api carbon-ml-api

# View logs
docker logs -f carbon-api

# Stop and remove container
docker stop carbon-api
docker rm carbon-api
```

## API Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

### Get API Info
```bash
curl http://localhost:5000/
```

### Make Prediction
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "transport_mode": "car",
    "km_per_day": 25,
    "diet_type": "mixed",
    "electricity_kWh_per_day": 12.5,
    "waste_kg_per_day": 1.8
  }'
```

## Valid Input Values

- **transport_mode**: `car`, `bus`, `train`, `bike`
- **diet_type**: `vegan`, `vegetarian`, `mixed`
- **km_per_day**: Non-negative number (distance traveled per day)
- **electricity_kWh_per_day**: Non-negative number (daily electricity usage)
- **waste_kg_per_day**: Non-negative number (daily waste production)

## Environment Variables

- `FLASK_ENV`: Set to `production` (default)
- `PORT`: Port to run the API (default: 5000)
- `PYTHONUNBUFFERED`: Set to 1 for immediate log output

## Docker Commands Cheat Sheet

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View container logs
docker logs carbon-footprint-ml-api

# Execute commands in running container
docker exec -it carbon-footprint-ml-api bash

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# Rebuild without cache
docker-compose build --no-cache

# Scale services (if needed)
docker-compose up --scale carbon-ml-api=3
```

## Troubleshooting

### Container won't start
```bash
# Check logs for errors
docker-compose logs

# Verify port 5000 is not in use
netstat -ano | findstr :5000  # Windows
```

### Model file missing
Ensure `carbon_model.pkl` exists in the ml-api directory before building.

### Permission errors
The container runs as non-root user `appuser` for security. Ensure files have appropriate permissions.

## Production Deployment

For production deployment:
1. Set appropriate environment variables
2. Configure reverse proxy (nginx/traefik)
3. Set up monitoring and logging
4. Enable HTTPS
5. Configure resource limits in docker-compose.yml

## Health Check

The API includes a health check that runs every 30 seconds:
- Returns 200 if healthy
- Returns error if model is not loaded or service is down
