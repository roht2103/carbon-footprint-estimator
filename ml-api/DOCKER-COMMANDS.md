# Docker Quick Reference

## Common Commands

### Start the API
```bash
cd ml-api
docker-compose up -d
```

### Stop the API
```bash
cd ml-api
docker-compose down
```

### View Logs
```bash
docker logs carbon-footprint-ml-api -f
```

### Restart the API
```bash
cd ml-api
docker-compose restart
```

### Rebuild and Restart
```bash
cd ml-api
docker-compose down
docker-compose up --build -d
```

### Test the API
```bash
cd ml-api
.\test-api.ps1
```

## API Endpoints

- **Health Check**: http://localhost:5000/health
- **API Info**: http://localhost:5000/
- **Predict**: http://localhost:5000/predict (POST)

## Status Check
```bash
docker ps
docker logs carbon-footprint-ml-api
```
