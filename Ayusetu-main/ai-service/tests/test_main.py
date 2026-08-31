"""
Test suite for AI service main endpoints
"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root_endpoint():
    """Test root endpoint returns correct response structure"""
    response = client.get("/")
    assert response.status_code == 200
    
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "AI Service is running"
    assert "data" in data
    assert data["data"]["version"] == "1.0.0"


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "AI service is healthy"
    assert "data" in data
    assert data["data"]["status"] == "operational"


def test_response_envelope_structure():
    """Test that all responses follow the standard envelope"""
    response = client.get("/")
    data = response.json()
    
    # Check required fields
    assert "success" in data
    assert "message" in data
    assert isinstance(data["success"], bool)
    assert isinstance(data["message"], str)
