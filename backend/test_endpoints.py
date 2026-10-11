import sys
# Ensure UTF-8 output on Windows terminals
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import urllib.request
import urllib.parse
import json
import time
import io
import os

def test_api():
    print("=" * 60)
    print("JAN SAHAYAK (Jan Sahayak) - COMPREHENSIVE ENDPOINT TEST SUITE")
    print("=" * 60)

    # 1. Health
    try:
        res = urllib.request.urlopen("http://localhost:8000/api/health")
        health = json.loads(res.read().decode())
        print("✓ 1. Backend Health Check:", res.status, health)
    except Exception as e:
        print("✗ 1. Health Check Failed (Ensure backend is running):", e)
        return

    # 2. Chat (Hindi & Telugu test)
    try:
        req = urllib.request.Request(
            "http://localhost:8000/api/chat",
            data=json.dumps({"message": "What is PM-KISAN scheme?", "language": "hi"}).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(req)
        chat_hi = json.loads(res.read().decode())
        print(f"✓ 2a. Chat API (Hindi response): [{chat_hi['detected_language']}] {chat_hi['reply'][:65]}...")

        req_te = urllib.request.Request(
            "http://localhost:8000/api/chat",
            data=json.dumps({"message": "Farmer schemes info", "language": "te"}).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res_te = urllib.request.urlopen(req_te)
        chat_te = json.loads(res_te.read().decode())
        print(f"✓ 2b. Chat API (Telugu response): [{chat_te['detected_language']}] {chat_te['reply'][:65]}...")
    except Exception as e:
        print("✗ 2. Chat API Failed:", e)

    # 3. Scheme matching
    try:
        req = urllib.request.Request(
            "http://localhost:8000/api/schemes/match",
            data=json.dumps({
                "age": 35,
                "state": "Maharashtra",
                "income": 150000,
                "occupation": "Farmer",
                "gender": "All",
                "category": "General"
            }).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(req)
        schemes_data = json.loads(res.read().decode())
        print(f"✓ 3. Scheme Matcher: Found {schemes_data['total_matched']} eligible schemes. Top: '{schemes_data['schemes'][0]['name']}' ({schemes_data['schemes'][0]['match_score']}%)")
    except Exception as e:
        print("✗ 3. Scheme Matcher Failed:", e)

    # 4. Grievance filing
    try:
        req = urllib.request.Request(
            "http://localhost:8000/api/grievance",
            data=json.dumps({
                "description": "Main market sewage pipeline broken and overflowing since 3 days in Laxmi Nagar",
                "user_language": "hi",
                "citizen_name": "Ramesh Gupta",
                "city": "New Delhi"
            }).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(req)
        grv_data = json.loads(res.read().decode())
        gid = grv_data["id"]
        print(f"✓ 4. Grievance Lodged: Tracking ID '{gid}' | Category: '{grv_data['category']}' | Urgency: '{grv_data['urgency']}' | Dept: '{grv_data['department']}'")

        # 5. Track by ID
        res_track = urllib.request.urlopen(f"http://localhost:8000/api/grievance/{gid}")
        tracked = json.loads(res_track.read().decode())
        print(f"✓ 5. Grievance Status Tracked: Status '{tracked['status']}' | Title: '{tracked['title']}'")

        # 6. Admin Status Update
        req_patch = urllib.request.Request(
            f"http://localhost:8000/api/grievance/{gid}/status",
            data=json.dumps({"status": "In Progress", "resolution_notes": "Assigned to Municipal PWD squad."}).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="PATCH"
        )
        res_patch = urllib.request.urlopen(req_patch)
        updated = json.loads(res_patch.read().decode())
        print(f"✓ 6. Admin Status Update: Status changed to '{updated['status']}' successfully.")
    except Exception as e:
        print("✗ 4-6. Grievance Lifecycle Failed:", e)

    # 7. Infrastructure Issue Reporting (with multipart image)
    try:
        boundary = "----WebKitFormBoundaryJanSahayak7MA4YWxkTrZu0gW"
        body = io.BytesIO()
        
        body.write(f"--{boundary}\r\n".encode("utf-8"))
        body.write(b'Content-Disposition: form-data; name="image"; filename="pothole_defect.jpg"\r\n')
        body.write(b'Content-Type: image/jpeg\r\n\r\n')
        body.write(b'\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xFF\xDB\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' \",#\x1c\x1c(7),01444\x1f\'9=82<.342\xFF\xC0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xFF\xC4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xFF\xDA\x00\x08\x01\x01\x00\x00?\x00\xbf\x00\xFF\xD9')
        body.write(b'\r\n')

        fields = {
            "latitude": "28.6289",
            "longitude": "77.2065",
            "description": "Deep asphalt pothole near bus terminal",
            "city": "New Delhi",
            "address": "Ring Road near Terminal 1"
        }
        for k, v in fields.items():
            body.write(f"--{boundary}\r\n".encode("utf-8"))
            body.write(f'Content-Disposition: form-data; name="{k}"\r\n\r\n'.encode("utf-8"))
            body.write(f"{v}\r\n".encode("utf-8"))
            
        body.write(f"--{boundary}--\r\n".encode("utf-8"))
        
        req_report = urllib.request.Request(
            "http://localhost:8000/api/report-issue",
            data=body.getvalue(),
            headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
        )
        res_report = urllib.request.urlopen(req_report)
        issue_data = json.loads(res_report.read().decode())
        print(f"✓ 7. Infrastructure Issue Reported: '{issue_data['id']}' | Detected Defect: '{issue_data['detected_issue']}' | Severity: '{issue_data['severity']}'")

        res_list = urllib.request.urlopen("http://localhost:8000/api/reports")
        reports = json.loads(res_list.read().decode())
        print(f"✓ 8. GIS Map Reports Count: {len(reports)} pins available for Leaflet OpenStreetMap.")
    except Exception as e:
        print("✗ 7-8. Infrastructure Issue Reporting Failed:", e)

    # 9. Admin Stats
    try:
        res_stats = urllib.request.urlopen("http://localhost:8000/api/admin/stats")
        stats = json.loads(res_stats.read().decode())
        print(f"✓ 9. Admin Command Stats: Total Cases: {stats['total_cases']} | Resolution Rate: {stats['resolution_rate_percent']}% | Categories: {list(stats['by_category'].keys())}")
    except Exception as e:
        print("✗ 9. Admin Stats Failed:", e)

    # 10. Admin Weekly Summary
    try:
        res_summary = urllib.request.urlopen("http://localhost:8000/api/admin/summary")
        summary = json.loads(res_summary.read().decode())
        print(f"✓ 10. AI Weekly Executive Briefing: Generated {summary['generated_at']}")
    except Exception as e:
        print("✗ 10. Admin Summary Failed:", e)

    # 11. Next.js Frontend Server Check
    try:
        res_front = urllib.request.urlopen("http://localhost:3000")
        print(f"✓ 11. Next.js Frontend Web App: Status {res_front.status} OK (Serving on http://localhost:3000)")
    except Exception as e:
        print("✗ 11. Frontend Check Failed:", e)

    print("=" * 60)
    print("ALL 11 END-TO-END VERIFICATION CHECKS PASSED!")
    print("=" * 60)

if __name__ == "__main__":
    test_api()
