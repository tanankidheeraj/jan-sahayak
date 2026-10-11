from datetime import datetime, timedelta
import random
from sqlalchemy.orm import Session
from app.models import Grievance, IssueReport

SAMPLE_CITIES = [
    {"city": "New Delhi", "lat": 28.6139, "lng": 77.2090},
    {"city": "Bengaluru", "lat": 12.9716, "lng": 77.5946},
    {"city": "Mumbai", "lat": 19.0760, "lng": 72.8777},
    {"city": "Hyderabad", "lat": 17.3850, "lng": 78.4867},
    {"city": "Chennai", "lat": 13.0827, "lng": 80.2707},
    {"city": "Lucknow", "lat": 26.8467, "lng": 80.9462},
    {"city": "Jaipur", "lat": 26.9124, "lng": 75.7873},
    {"city": "Kolkata", "lat": 22.5726, "lng": 88.3639}
]

SAMPLE_COMPLAINTS_DATA = [
    {
        "title": "Severe Potholes on Main Ring Road near flyover",
        "desc": "Multiple deep potholes causing traffic congestion and severe two-wheeler accidents during evening rush hour.",
        "category": "roads",
        "urgency": "High",
        "dept": "Public Works Department (PWD)",
        "status": "In Progress",
        "citizen": "Ramesh Kumar",
        "phone": "+91 98765 43210"
    },
    {
        "title": "Contaminated drinking water with brown residue",
        "desc": "Tap water supply in our colony has foul odor and yellow-brown coloration for the past 4 days.",
        "category": "water",
        "urgency": "Critical",
        "dept": "Municipal Water Supply & Sewerage Board",
        "status": "Open",
        "citizen": "Sunita Sharma",
        "phone": "+91 98234 56789"
    },
    {
        "title": "Frequent power fluctuations and blown transformer",
        "desc": "Local distribution transformer sparking at night; voltage drops destroying home refrigerators and fans.",
        "category": "electricity",
        "urgency": "High",
        "dept": "State Electricity Distribution Company (DISCOM)",
        "status": "Resolved",
        "citizen": "Venkatesh Rao",
        "phone": "+91 97112 34567"
    },
    {
        "title": "Uncollected garbage dumping creating mosquito breeding ground",
        "desc": "Municipal garbage truck hasn't arrived for 10 days; trash pile overflowing into main market entrance.",
        "category": "sanitation",
        "urgency": "Medium",
        "dept": "Solid Waste Management Cell",
        "status": "Open",
        "citizen": "Ananya Mukherjee",
        "phone": "+91 99001 22334"
    },
    {
        "title": "Primary Health Centre lacks basic anti-venom and medicines",
        "desc": "Local government clinic doctor absent on weekdays; emergency basic medicines out of stock.",
        "category": "health",
        "urgency": "Critical",
        "dept": "District Health & Family Welfare Office",
        "status": "In Progress",
        "citizen": "Mohammad Irfan",
        "phone": "+91 94567 89012"
    },
    {
        "title": "Street light dark-spot leading to safety hazards",
        "desc": "Six consecutive streetlights non-operational along the girls' senior secondary school lane.",
        "category": "electricity",
        "urgency": "High",
        "dept": "Municipal Electrical Wing",
        "status": "Resolved",
        "citizen": "Pooja Patel",
        "phone": "+91 98123 45678"
    },
    {
        "title": "Open manhole without safety lid near bus stop",
        "desc": "Dangerously exposed sewer drain lid broken. Risk of pedestrians falling in during rains.",
        "category": "sanitation",
        "urgency": "Critical",
        "dept": "Municipal Drain & Sewage Department",
        "status": "In Progress",
        "citizen": "Karthik Subramanian",
        "phone": "+91 94441 55667"
    },
    {
        "title": "Low water pressure in municipal pipeline",
        "desc": "Water only arrives for 15 minutes at 4:30 AM with extremely weak pressure.",
        "category": "water",
        "urgency": "Low",
        "dept": "Water Supply Board",
        "status": "Open",
        "citizen": "Geeta Devi",
        "phone": "+91 93123 99887"
    },
    {
        "title": "Illegal construction debris blocking pedestrian sidewalk",
        "desc": "Commercial builder dumped tons of concrete rubble directly on public footway.",
        "category": "roads",
        "urgency": "Medium",
        "dept": "Town Planning & Encroachment Cell",
        "status": "Open",
        "citizen": "Arjun Singhania",
        "phone": "+91 98711 00223"
    },
    {
        "title": "Dengue fogging needed due to stagnant canal water",
        "desc": "Multiple malaria and dengue cases reported in block C; urgent anti-larval chemical spray required.",
        "category": "health",
        "urgency": "High",
        "dept": "Vector Borne Disease Control Cell",
        "status": "Resolved",
        "citizen": "Deepak Verma",
        "phone": "+91 97654 32190"
    },
    {
        "title": "Burst water main flooding highway underpass",
        "desc": "High pressure pipeline burst submerged the road by 2 feet, halting vehicular traffic.",
        "category": "water",
        "urgency": "Critical",
        "dept": "Water Supply & Sewerage Board",
        "status": "Resolved",
        "citizen": "Harish Reddy",
        "phone": "+91 99887 76655"
    },
    {
        "title": "Broken speed breaker damaged without yellow paint markings",
        "desc": "Unscientific asphalt hump without signage causing vehicles to jump dangerously.",
        "category": "roads",
        "urgency": "Medium",
        "dept": "Traffic Engineering & PWD",
        "status": "In Progress",
        "citizen": "Siddharth Joshi",
        "phone": "+91 98334 11223"
    },
    {
        "title": "Overhead high tension electric wire dangling near trees",
        "desc": "Live wire touching neem tree branches during windy afternoons creating sparks.",
        "category": "electricity",
        "urgency": "Critical",
        "dept": "State Electricity Board",
        "status": "In Progress",
        "citizen": "Manish Tiwari",
        "phone": "+91 96543 21098"
    },
    {
        "title": "Clogged storm water drain overflowing into residential houses",
        "desc": "Plastic and silt clogging stormwater channel before monsoon season.",
        "category": "sanitation",
        "urgency": "High",
        "dept": "Municipal Stormwater Drainage Division",
        "status": "Open",
        "citizen": "Fatima Begum",
        "phone": "+91 98990 12345"
    },
    {
        "title": "Stray dog menace and absence of animal birth control unit",
        "desc": "Pack of aggressive stray dogs chasing morning school cyclists and pedestrians.",
        "category": "health",
        "urgency": "Medium",
        "dept": "Municipal Veterinary Department",
        "status": "Open",
        "citizen": "Naveen Chandra",
        "phone": "+91 94112 33445"
    },
    {
        "title": "Public park illumination failure and broken benches",
        "desc": "Community park completely dark after 6 PM; senior citizens unable to take evening walks.",
        "category": "other",
        "urgency": "Low",
        "dept": "Horticulture & Urban Parks Department",
        "status": "Resolved",
        "citizen": "Subhash Chandra Bose",
        "phone": "+91 95556 77889"
    },
    {
        "title": "Non-functional traffic signal at major 4-way intersection",
        "desc": "Signal lights blinking red continuously causing traffic gridlocks and near-accidents.",
        "category": "roads",
        "urgency": "High",
        "dept": "Traffic Police Infrastructure Cell",
        "status": "Resolved",
        "citizen": "Vikram Seth",
        "phone": "+91 98220 33445"
    },
    {
        "title": "Drinking water pipeline contaminated with sewage seepage",
        "desc": "Colony drinking water smelling like sewage; residents developing stomach infections.",
        "category": "water",
        "urgency": "Critical",
        "dept": "Public Health Engineering Department",
        "status": "In Progress",
        "citizen": "Radha Krishnan",
        "phone": "+91 99401 22334"
    },
    {
        "title": "Illegal chemical waste dumping into river canal",
        "desc": "Small industrial unit dumping untreated foamy effluent into open municipal nullah.",
        "category": "sanitation",
        "urgency": "Critical",
        "dept": "State Pollution Control Board",
        "status": "Open",
        "citizen": "Gaurav Agarwal",
        "phone": "+91 98760 11223"
    },
    {
        "title": "Community toilet complex locked and waterless",
        "desc": "Public toilet built under Swachh Bharat remains locked with no running water connection.",
        "category": "sanitation",
        "urgency": "High",
        "dept": "Swachh Bharat Urban Mission Cell",
        "status": "In Progress",
        "citizen": "Maya Devi",
        "phone": "+91 97170 88990"
    },
    {
        "title": "Fallen tree branch resting on electrical transmission pole",
        "desc": "Large banyan branch snapped during rainstorm and resting heavily on overhead cables.",
        "category": "electricity",
        "urgency": "High",
        "dept": "DISCOM Emergency Tree Trimming Cell",
        "status": "Resolved",
        "citizen": "Sanjay Deshmukh",
        "phone": "+91 98670 44556"
    },
    {
        "title": "Erosion and cave-in along riverfront bridge approach road",
        "desc": "Soil subsidence under bridge embankment causing visible cracking in pavement.",
        "category": "roads",
        "urgency": "Critical",
        "dept": "State Highway & Bridge Corporation",
        "status": "Open",
        "citizen": "Kavita Nair",
        "phone": "+91 94470 55667"
    },
    {
        "title": "Delay in issuing Disability Welfare Scheme Smart Card",
        "desc": "Application submitted 6 months ago at Collectorate with medical board certificate; no status update.",
        "category": "other",
        "urgency": "Medium",
        "dept": "District Social Welfare Department",
        "status": "In Progress",
        "citizen": "Santosh Yadav",
        "phone": "+91 99190 22334"
    },
    {
        "title": "Unregulated sound pollution from construction site at 2 AM",
        "desc": "Commercial pile-driving and heavy machinery operating throughout the night in quiet residential zone.",
        "category": "other",
        "urgency": "Medium",
        "dept": "Environment & Noise Pollution Control Board",
        "status": "Resolved",
        "citizen": "Priyanka Roy",
        "phone": "+91 98300 44556"
    },
    {
        "title": "Govt School building ceiling plaster peeling off",
        "desc": "Class 3 and 4 classroom ceilings have water seepage with chunks of plaster falling on desks.",
        "category": "health",
        "urgency": "Critical",
        "dept": "Samagra Shiksha Infrastructure Wing",
        "status": "In Progress",
        "citizen": "Rajeshwari M.",
        "phone": "+91 94490 33445"
    },
    {
        "title": "Defunct Borewell pump in slum cluster",
        "desc": "Submersible pump burnt out 2 weeks ago; over 200 families forced to buy private water tankers.",
        "category": "water",
        "urgency": "High",
        "dept": "Rural & Urban Water Supply Wing",
        "status": "Open",
        "citizen": "Babu Lal",
        "phone": "+91 96110 55443"
    },
    {
        "title": "Damaged pedestrian skywalk elevator out of order",
        "desc": "Lift on busy railway station road skywalk has been dead for 3 months, preventing elderly and disabled access.",
        "category": "roads",
        "urgency": "Medium",
        "dept": "Urban Mass Transit Authority",
        "status": "Open",
        "citizen": "Anil Kulkarni",
        "phone": "+91 98200 99887"
    },
    {
        "title": "Burnt electrical junction box sparking on pavement",
        "desc": "Distribution feeder pillar cover is broken open; exposed fuses sparking near pedestrian walkway.",
        "category": "electricity",
        "urgency": "Critical",
        "dept": "DISCOM Urban Division",
        "status": "Resolved",
        "citizen": "Meenakshi Sundaram",
        "phone": "+91 98400 11223"
    },
    {
        "title": "Dead animal carcass not removed from road verge",
        "desc": "Dead stray cow lying on road verge causing terrible smell and traffic hazards.",
        "category": "sanitation",
        "urgency": "High",
        "dept": "Municipal Health Sanitation Squad",
        "status": "Resolved",
        "citizen": "Dinesh Gupta",
        "phone": "+91 94150 77889"
    },
    {
        "title": "Ration shop fair price dealer charging above MRP",
        "desc": "PDS dealer demanding ₹5 extra per kg of subsidized rice and refusing electronic weighing receipts.",
        "category": "other",
        "urgency": "High",
        "dept": "Department of Food, Civil Supplies & Consumer Affairs",
        "status": "In Progress",
        "citizen": "Laxman Rao",
        "phone": "+91 98480 33221"
    }
]

SAMPLE_ISSUES_DATA = [
    {
        "issue": "Deep Pothole & Craters on Arterial Road",
        "category": "roads",
        "severity": "High",
        "safety_notes": "Extreme hazard for two-wheelers, likely to cause fatal loss of balance.",
        "desc": "Multiple deep potholes spanning 15 meters on the main carriageway.",
        "city_idx": 0,
        "delta_lat": 0.012,
        "delta_lng": -0.015,
        "status": "Open"
    },
    {
        "issue": "Overflowing Garbage Dump on Footpath",
        "category": "sanitation",
        "severity": "Medium",
        "safety_notes": "Health hazard, stench, blocking sidewalk forcing pedestrians onto busy road.",
        "desc": "Community dumper bin broken and overflowing for over a week.",
        "city_idx": 1,
        "delta_lat": -0.008,
        "delta_lng": 0.011,
        "status": "In Progress"
    },
    {
        "issue": "Broken Streetlight Pole Dangling Live Wires",
        "category": "electricity",
        "severity": "Critical",
        "safety_notes": "High voltage electrocution hazard directly above pedestrian footpath.",
        "desc": "Impacted by commercial vehicle; steel pole tilted at 45 degrees.",
        "city_idx": 2,
        "delta_lat": 0.021,
        "delta_lng": 0.014,
        "status": "Resolved"
    },
    {
        "issue": "Major Drinking Water Pipe Leakage Flooding Road",
        "category": "water",
        "severity": "High",
        "safety_notes": "Substantial clean water wastage and sub-base softening leading to road collapse.",
        "desc": "Underground 10-inch pipeline burst generating a water fountain.",
        "city_idx": 3,
        "delta_lat": -0.015,
        "delta_lng": -0.009,
        "status": "Open"
    },
    {
        "issue": "Missing Storm Drain Concrete Cover",
        "category": "sanitation",
        "severity": "Critical",
        "safety_notes": "Direct fall hazard for children and elderly, completely invisible at night.",
        "desc": "Rectangular concrete slab broken through; 8-foot drop into stormwater drain.",
        "city_idx": 4,
        "delta_lat": 0.009,
        "delta_lng": 0.018,
        "status": "In Progress"
    },
    {
        "issue": "Fallen Tree Across Two Road Lanes",
        "category": "roads",
        "severity": "High",
        "safety_notes": "Blocks entire vehicular transit route; emergency ambulances diverted.",
        "desc": "Gulmohar tree uprooted during thunderstorm blocking traffic.",
        "city_idx": 5,
        "delta_lat": -0.011,
        "delta_lng": 0.013,
        "status": "Resolved"
    },
    {
        "issue": "Exposed Electrical Transformer on Ground Level",
        "category": "electricity",
        "severity": "Critical",
        "safety_notes": "Direct contact risk for pedestrians, school children, and stray animals.",
        "desc": "Barbed wire enclosure broken; 11kV busbar accessible to public touch.",
        "city_idx": 6,
        "delta_lat": 0.014,
        "delta_lng": -0.012,
        "status": "Open"
    },
    {
        "issue": "Open Sewage Overflow in Market Alley",
        "category": "sanitation",
        "severity": "High",
        "safety_notes": "Public hygiene violation, disease vector for cholera and typhoid.",
        "desc": "Blackwater backflow flooding vegetable vendor stalls.",
        "city_idx": 7,
        "delta_lat": -0.017,
        "delta_lng": 0.008,
        "status": "In Progress"
    }
]

def seed_database(db: Session):
    """Populates 30 sample grievances and 8 infrastructure reports if database is empty."""
    existing_count = db.query(Grievance).count()
    if existing_count > 0:
        return

    print("Seeding database with 30 sample complaints across Indian cities...")
    now = datetime.utcnow()

    # Seed 30 Grievances
    for i, item in enumerate(SAMPLE_COMPLAINTS_DATA, start=1):
        city_info = SAMPLE_CITIES[(i - 1) % len(SAMPLE_CITIES)]
        jitter_lat = (random.random() - 0.5) * 0.08
        jitter_lng = (random.random() - 0.5) * 0.08
        created_time = now - timedelta(days=random.randint(1, 28), hours=random.randint(1, 20))
        
        gid = f"GRV-2026-{1000 + i}"
        grievance = Grievance(
            id=gid,
            title=item["title"],
            description=item["desc"],
            user_language="en",
            translated_title_en=item["title"],
            translated_description_en=item["desc"],
            formal_letter=f"""To:
The Executive Authority,
{item['dept']}, {city_info['city']}.

Subject: Formal Grievance - {item['title']}

Respected Sir/Madam,
This is to bring to your attention that citizen {item['citizen']} has lodged an official complaint regarding {item['category']}:
"{item['desc']}"

Immediate on-ground inspection and resolution are requested.

Complainant: {item['citizen']} ({item['phone']})
Location: {city_info['city']}
Urgency: {item['urgency']}
Registered via Jan Sahayak Portal.""",
            category=item["category"],
            urgency=item["urgency"],
            department=item["dept"],
            status=item["status"],
            citizen_name=item["citizen"],
            citizen_phone=item["phone"],
            address=f"Ward #{random.randint(12, 185)}, {city_info['city']}",
            city=city_info["city"],
            latitude=city_info["lat"] + jitter_lat,
            longitude=city_info["lng"] + jitter_lng,
            resolution_notes="Action initiated by field inspection team." if item["status"] != "Open" else None,
            created_at=created_time,
            updated_at=created_time + timedelta(hours=random.randint(4, 48))
        )
        db.add(grievance)

    # Seed 8 Infrastructure Issue Reports
    for j, issue in enumerate(SAMPLE_ISSUES_DATA, start=1):
        city_info = SAMPLE_CITIES[issue["city_idx"]]
        iid = f"ISSUE-2026-{3000 + j}"
        created_time = now - timedelta(days=random.randint(1, 14), hours=random.randint(1, 12))
        
        report = IssueReport(
            id=iid,
            image_url=f"/sample_issues/issue_{j}.jpg",
            detected_issue=issue["issue"],
            severity=issue["severity"],
            category=issue["category"],
            safety_notes=issue["safety_notes"],
            description=issue["desc"],
            latitude=city_info["lat"] + issue["delta_lat"],
            longitude=city_info["lng"] + issue["delta_lng"],
            address=f"Main Sector Road, {city_info['city']}",
            city=city_info["city"],
            status=issue["status"],
            created_at=created_time,
            updated_at=created_time + timedelta(hours=12)
        )
        db.add(report)

    db.commit()
    print("Database seeding completed successfully!")
