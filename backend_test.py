#!/usr/bin/env python3

import requests
import sys
import json
import uuid
from datetime import datetime

class BadMonkeyAPITester:
    def __init__(self, base_url="https://imported-footwear.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            
            print(f"   Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - {name}")
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                print(f"❌ FAILED - {name}")
                print(f"   Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Error: {response.text}")
                self.failed_tests.append({
                    "name": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "endpoint": endpoint
                })
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ FAILED - {name} (TIMEOUT)")
            self.failed_tests.append({
                "name": name,
                "error": "Request timeout",
                "endpoint": endpoint
            })
            return False, {}
        except Exception as e:
            print(f"❌ FAILED - {name} (ERROR: {str(e)})")
            self.failed_tests.append({
                "name": name,
                "error": str(e),
                "endpoint": endpoint
            })
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_get_all_products(self):
        """Test getting all products"""
        success, response = self.run_test("Get All Products", "GET", "products", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} products")
            if len(response) > 0:
                print(f"   Sample product: {response[0].get('name', 'Unknown')}")
                return True, response
        return success, response

    def test_get_products_with_filters(self):
        """Test product filtering"""
        print("\n--- Testing Product Filters ---")
        
        # Test category filter
        success1, _ = self.run_test("Filter by Category - Sneakers", "GET", "products", 200, params={"category": "Sneakers"})
        
        # Test gender filter
        success2, _ = self.run_test("Filter by Gender - Men", "GET", "products", 200, params={"gender": "Men"})
        
        # Test both filters
        success3, _ = self.run_test("Filter by Category & Gender", "GET", "products", 200, 
                                  params={"category": "Sneakers", "gender": "Men"})
        
        return success1 and success2 and success3

    def test_get_single_product(self, products):
        """Test getting a single product"""
        if not products or len(products) == 0:
            print("❌ No products available to test single product endpoint")
            return False
            
        product_id = products[0].get('id')
        if not product_id:
            print("❌ No product ID found in products")
            return False
            
        success, response = self.run_test(f"Get Single Product", "GET", f"products/{product_id}", 200)
        if success:
            print(f"   Product: {response.get('name', 'Unknown')}")
        return success

    def test_get_nonexistent_product(self):
        """Test getting a non-existent product"""
        fake_id = str(uuid.uuid4())
        success, _ = self.run_test("Get Non-existent Product", "GET", f"products/{fake_id}", 404)
        return success

    def test_contact_form_submission(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+91-9999999999",
            "message": "This is a test message from automated testing"
        }
        
        success, response = self.run_test("Submit Contact Form", "POST", "contact", 200, data=contact_data)
        if success:
            print(f"   Contact submission ID: {response.get('id', 'Unknown')}")
        return success

    def test_checkout_session_creation(self):
        """Test checkout session creation"""
        cart_items = [
            {
                "id": "test-product-1",
                "name": "Test Sneaker",
                "price": 5999,
                "quantity": 1,
                "image": "https://example.com/test.jpg"
            }
        ]
        
        checkout_data = {
            "cart_items": cart_items,
            "origin_url": "https://imported-footwear.preview.emergentagent.com"
        }
        
        success, response = self.run_test("Create Checkout Session", "POST", "checkout/session", 200, data=checkout_data)
        if success:
            print(f"   Session URL: {response.get('url', 'Not found')}")
            print(f"   Session ID: {response.get('session_id', 'Not found')}")
            return success, response.get('session_id')
        return success, None

    def test_checkout_session_empty_cart(self):
        """Test checkout with empty cart"""
        checkout_data = {
            "cart_items": [],
            "origin_url": "https://imported-footwear.preview.emergentagent.com"
        }
        
        success, _ = self.run_test("Checkout Empty Cart", "POST", "checkout/session", 400, data=checkout_data)
        return success

    def test_checkout_status(self, session_id):
        """Test checkout status endpoint"""
        if not session_id:
            print("❌ No session ID available for status check")
            return False
            
        success, response = self.run_test("Get Checkout Status", "GET", f"checkout/status/{session_id}", 200)
        if success:
            print(f"   Payment Status: {response.get('payment_status', 'Unknown')}")
            print(f"   Session Status: {response.get('status', 'Unknown')}")
        return success

def main():
    print("🚀 Starting Bad Monkey E-commerce API Tests")
    print("=" * 50)
    
    tester = BadMonkeyAPITester()
    
    # Test API root
    tester.test_api_root()
    
    # Test product endpoints
    success, products = tester.test_get_all_products()
    tester.test_get_products_with_filters()
    
    if products:
        tester.test_get_single_product(products)
    
    tester.test_get_nonexistent_product()
    
    # Test contact form
    tester.test_contact_form_submission()
    
    # Test checkout endpoints
    checkout_success, session_id = tester.test_checkout_session_creation()
    tester.test_checkout_session_empty_cart()
    
    if session_id:
        tester.test_checkout_status(session_id)
    
    # Print final results
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    print(f"Total Tests: {tester.tests_run}")
    print(f"Passed: {tester.tests_passed}")
    print(f"Failed: {len(tester.failed_tests)}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ FAILED TESTS:")
        for test in tester.failed_tests:
            error_msg = test.get('error', f"Expected {test.get('expected')}, got {test.get('actual')}")
            print(f"   - {test['name']}: {error_msg}")
    
    return 0 if len(tester.failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())