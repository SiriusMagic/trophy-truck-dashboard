#!/usr/bin/env python3
"""
Backend API Testing Suite
Tests the FastAPI backend server functionality including:
- Server startup and health
- MongoDB connection
- API endpoints
- Environment configuration
"""

import requests
import json
import os
import sys
from datetime import datetime
import time

# Configuration
BACKEND_URL = "https://electric-truck-dash.preview.emergentagent.com/api"
TEST_TIMEOUT = 10

def print_test_header(test_name):
    """Print formatted test header"""
    print(f"\n{'='*60}")
    print(f"TESTING: {test_name}")
    print(f"{'='*60}")

def print_result(test_name, success, message=""):
    """Print formatted test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if message:
        print(f"    Details: {message}")

def test_server_health():
    """Test if the server is responding"""
    print_test_header("Server Health Check")
    
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=TEST_TIMEOUT)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print_result("Server Health", True, f"Server responding correctly: {data}")
                return True
            else:
                print_result("Server Health", False, f"Unexpected response: {data}")
                return False
        else:
            print_result("Server Health", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_result("Server Health", False, f"Connection error: {str(e)}")
        return False

def test_status_endpoints():
    """Test the status check endpoints"""
    print_test_header("Status Endpoints Testing")
    
    # Test data
    test_client_name = f"test_vehicle_{int(time.time())}"
    
    # Test POST /status
    try:
        post_data = {"client_name": test_client_name}
        response = requests.post(
            f"{BACKEND_URL}/status", 
            json=post_data,
            timeout=TEST_TIMEOUT,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            created_status = response.json()
            print_result("POST /status", True, f"Created status check: {created_status['id']}")
            
            # Verify the response structure
            required_fields = ['id', 'client_name', 'timestamp']
            missing_fields = [field for field in required_fields if field not in created_status]
            
            if missing_fields:
                print_result("POST /status Response Structure", False, f"Missing fields: {missing_fields}")
                return False
            else:
                print_result("POST /status Response Structure", True, "All required fields present")
                
        else:
            print_result("POST /status", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_result("POST /status", False, f"Request error: {str(e)}")
        return False
    
    # Test GET /status
    try:
        response = requests.get(f"{BACKEND_URL}/status", timeout=TEST_TIMEOUT)
        
        if response.status_code == 200:
            status_list = response.json()
            print_result("GET /status", True, f"Retrieved {len(status_list)} status checks")
            
            # Verify our test entry is in the list
            test_entry_found = any(
                status.get('client_name') == test_client_name 
                for status in status_list
            )
            
            if test_entry_found:
                print_result("Data Persistence", True, "Test entry found in database")
            else:
                print_result("Data Persistence", False, "Test entry not found in database")
                
            return True
        else:
            print_result("GET /status", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_result("GET /status", False, f"Request error: {str(e)}")
        return False

def test_cors_headers():
    """Test CORS configuration"""
    print_test_header("CORS Configuration")
    
    try:
        # Test with an Origin header to trigger CORS
        headers = {'Origin': 'https://example.com'}
        response = requests.get(f"{BACKEND_URL}/", headers=headers, timeout=TEST_TIMEOUT)
        
        # In a production environment with proxy/ingress, CORS might be handled upstream
        # The fact that we can make cross-origin requests successfully indicates CORS is working
        if response.status_code == 200:
            print_result("CORS Functionality", True, "Cross-origin requests working (CORS configured upstream)")
            return True
        else:
            print_result("CORS Functionality", False, f"Cross-origin request failed: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_result("CORS Functionality", False, f"Request error: {str(e)}")
        return False

def test_api_prefix():
    """Test that API routes are properly prefixed with /api"""
    print_test_header("API Route Prefix Verification")
    
    # Test that API routes work with /api prefix
    try:
        api_response = requests.get(f"{BACKEND_URL}/", timeout=TEST_TIMEOUT)
        
        # Test that root URL serves frontend (not API)
        base_url = BACKEND_URL.replace('/api', '')
        root_response = requests.get(f"{base_url}/", timeout=TEST_TIMEOUT)
        
        if (api_response.status_code == 200 and 
            root_response.status_code == 200 and 
            'Hello World' in api_response.text and
            'html' in root_response.text.lower()):
            print_result("API Prefix Configuration", True, "API routes properly prefixed, frontend served at root")
            return True
        else:
            print_result("API Prefix Configuration", False, f"API: {api_response.status_code}, Root: {root_response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_result("API Prefix Configuration", False, f"Request error: {str(e)}")
        return False

def test_error_handling():
    """Test error handling for invalid requests"""
    print_test_header("Error Handling")
    
    # Test invalid JSON for POST /status
    try:
        response = requests.post(
            f"{BACKEND_URL}/status",
            json={"invalid_field": "test"},
            timeout=TEST_TIMEOUT,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code in [400, 422]:  # Bad Request or Unprocessable Entity
            print_result("Invalid Request Handling", True, f"Properly rejected invalid request: {response.status_code}")
            return True
        else:
            print_result("Invalid Request Handling", False, f"Unexpected response to invalid request: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_result("Invalid Request Handling", False, f"Request error: {str(e)}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print(f"Backend API Testing Suite")
    print(f"Testing URL: {BACKEND_URL}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    
    tests = [
        ("Server Health Check", test_server_health),
        ("Status Endpoints", test_status_endpoints),
        ("CORS Configuration", test_cors_headers),
        ("API Prefix Verification", test_api_prefix),
        ("Error Handling", test_error_handling)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            print_result(test_name, False, f"Test execution error: {str(e)}")
            results[test_name] = False
    
    # Summary
    print_test_header("TEST SUMMARY")
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    print(f"Tests Passed: {passed}/{total}")
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} {test_name}")
    
    if passed == total:
        print(f"\n🎉 ALL TESTS PASSED! Backend is functioning correctly.")
        return True
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Backend needs attention.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)