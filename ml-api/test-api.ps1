# Test script for Carbon Footprint ML API
# Run this in PowerShell after the Docker container is running

Write-Host "`n=== Testing Carbon Footprint ML API ===" -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n1. Health Check:" -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri http://localhost:5000/health -Method GET
    Write-Host "Status: $($health.status)" -ForegroundColor Green
    Write-Host "Model Loaded: $($health.model_loaded)" -ForegroundColor Green
} catch {
    Write-Host "Health check failed: $_" -ForegroundColor Red
}

# Test 2: API Info
Write-Host "`n2. API Information:" -ForegroundColor Cyan
try {
    $info = Invoke-RestMethod -Uri http://localhost:5000/ -Method GET
    Write-Host "API: $($info.message)" -ForegroundColor Green
    Write-Host "Version: $($info.version)" -ForegroundColor Green
} catch {
    Write-Host "API info request failed: $_" -ForegroundColor Red
}

# Test 3: Prediction - Car + Mixed Diet
Write-Host "`n3. Prediction Test - Car + Mixed Diet:" -ForegroundColor Cyan
try {
    $body1 = @{
        transport_mode = 'car'
        km_per_day = 25
        diet_type = 'mixed'
        electricity_kWh_per_day = 12.5
        waste_kg_per_day = 1.8
    } | ConvertTo-Json
    
    $result1 = Invoke-RestMethod -Uri http://localhost:5000/predict -Method POST -Body $body1 -ContentType 'application/json'
    Write-Host "Carbon Footprint: $($result1.carbon_footprint) kg CO2" -ForegroundColor Green
} catch {
    Write-Host "Prediction 1 failed: $_" -ForegroundColor Red
}

# Test 4: Prediction - Bike + Vegan
Write-Host "`n4. Prediction Test - Bike + Vegan:" -ForegroundColor Cyan
try {
    $body2 = @{
        transport_mode = 'bike'
        km_per_day = 5
        diet_type = 'vegan'
        electricity_kWh_per_day = 8.0
        waste_kg_per_day = 0.5
    } | ConvertTo-Json
    
    $result2 = Invoke-RestMethod -Uri http://localhost:5000/predict -Method POST -Body $body2 -ContentType 'application/json'
    Write-Host "Carbon Footprint: $($result2.carbon_footprint) kg CO2" -ForegroundColor Green
} catch {
    Write-Host "Prediction 2 failed: $_" -ForegroundColor Red
}

# Test 5: Prediction - Train + Vegetarian
Write-Host "`n5. Prediction Test - Train + Vegetarian:" -ForegroundColor Cyan
try {
    $body3 = @{
        transport_mode = 'train'
        km_per_day = 40
        diet_type = 'vegetarian'
        electricity_kWh_per_day = 15.0
        waste_kg_per_day = 1.2
    } | ConvertTo-Json
    
    $result3 = Invoke-RestMethod -Uri http://localhost:5000/predict -Method POST -Body $body3 -ContentType 'application/json'
    Write-Host "Carbon Footprint: $($result3.carbon_footprint) kg CO2" -ForegroundColor Green
} catch {
    Write-Host "Prediction 3 failed: $_" -ForegroundColor Red
}

# Test 6: Invalid Input
Write-Host "`n6. Error Handling Test - Invalid Transport Mode:" -ForegroundColor Cyan
try {
    $body4 = @{
        transport_mode = 'airplane'
        km_per_day = 100
        diet_type = 'mixed'
        electricity_kWh_per_day = 10.0
        waste_kg_per_day = 2.0
    } | ConvertTo-Json
    
    $result4 = Invoke-RestMethod -Uri http://localhost:5000/predict -Method POST -Body $body4 -ContentType 'application/json'
    Write-Host "Unexpected success" -ForegroundColor Yellow
} catch {
    Write-Host "Expected error caught: Invalid transport mode" -ForegroundColor Green
}

Write-Host "`n=== All Tests Completed ===" -ForegroundColor Green
