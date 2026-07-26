import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.services.health_score import calculate_financial_score
from app.services.gemini_service import fallback_extract_profile

class TestFinPilotBackend(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "success")

    def test_health_score_calculation(self):
        profile = {
            "monthly_income": 100000,
            "monthly_expenses": 30000,
            "savings": 500000,
            "loans": 0,
            "monthly_emi": 0,
            "insurance": 10000
        }
        score = calculate_financial_score(profile)
        self.assertGreaterEqual(score, 70)

    def test_fallback_extract_profile(self):
        sample_text = """
        Gross Salary: ₹85,000
        Deductions: ₹15,000
        PF Savings: ₹1,20,000
        Home Loan: ₹5,000
        """
        res = fallback_extract_profile(sample_text)
        self.assertEqual(res["monthly_income"], 85000.0)
        self.assertEqual(res["monthly_expenses"], 15000.0)
        self.assertEqual(res["savings"], 120000.0)

    def test_chat_endpoint_budget(self):
        payload = {
            "question": "Can I check my budget and expenses?",
            "profile": {
                "monthly_income": 80000,
                "monthly_expenses": 35000,
                "savings": 200000,
                "loans": 0
            }
        }
        response = self.client.post("/api/chat", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("message", data)

if __name__ == "__main__":
    unittest.main()
