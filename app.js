const storageKey = "pharma-track-state-v2";
const sessionKey = "medholic-session-user";
const sessionTokenKey = "medholic-session-token";
const apiStateUrl = "/api/state";
const apiBackupsUrl = "/api/backups";
const apiHealthUrl = "/api/health";
const portalPath = location.pathname.replace(/\/+$/, "") || "/";

const users = [
  { username: "local-admin", password: "local-demo-only", name: "Lynda Chidi", role: "Manager" },
  { username: "cashier", password: "cashier123", name: "Cashier", role: "Cashier" },
  { username: "pharmacist", password: "pharmacist123", name: "Pharmacist", role: "Pharmacist" },
  { username: "inventory", password: "inventory123", name: "Inventory Clerk", role: "Inventory clerk" }
];

const roleViews = {
  Manager: ["dashboard", "capture", "inventory", "sales", "roster", "reports", "security", "help"],
  Pharmacist: ["capture", "inventory", "sales"],
  Cashier: ["sales"],
  "Inventory clerk": ["capture", "inventory"]
};

const safetyDose = "Confirm adult or child dose from the prescription, product label, or pharmacy-approved dosing protocol before supply.";
const prescriptionDose = "Prescription medicine: dose must match the prescriber's instruction and pharmacy-approved protocol.";
const deviceDose = "Use according to the device/product instructions and local protocol.";

const medicineCatalog = [
  { name: "Paracetamol Tablets - Adult", function: "Analgesic and antipyretic for pain and fever relief.", dose: safetyDose, sideEffects: "Usually well tolerated at correct dose. Overdose can cause serious liver injury." },
  { name: "Paracetamol Suspension - Children", function: "Children's analgesic and antipyretic for pain and fever relief.", dose: safetyDose, sideEffects: "Usually well tolerated at correct dose. Overdose can cause serious liver injury." },
  { name: "Ibuprofen Tablets - Adult NSAID", function: "NSAID used for pain, fever, and inflammation when suitable.", dose: safetyDose, sideEffects: "May cause indigestion, stomach irritation, bleeding risk, kidney problems, or asthma worsening in some people." },
  { name: "Ibuprofen Suspension - Children NSAID", function: "Children's NSAID used for pain, fever, and inflammation when suitable.", dose: safetyDose, sideEffects: "May cause stomach upset, allergic reactions, kidney problems, or asthma worsening in some children." },
  { name: "Diclofenac Tablets - NSAID", function: "NSAID used for pain and inflammation when prescribed or approved.", dose: prescriptionDose, sideEffects: "May cause stomach irritation, raised blood pressure, kidney problems, fluid retention, or cardiovascular risk." },
  { name: "Naproxen Tablets - NSAID", function: "NSAID used for pain and inflammation when prescribed or approved.", dose: prescriptionDose, sideEffects: "May cause indigestion, ulcers, bleeding risk, kidney issues, or fluid retention." },
  { name: "Diclofenac Gel - Topical Analgesic", function: "Topical NSAID for localized muscle or joint pain.", dose: safetyDose, sideEffects: "May cause skin irritation, rash, itching, or photosensitivity." },
  { name: "Lidocaine Gel/Cream - Topical Analgesic", function: "Local anaesthetic for temporary localized pain relief when appropriate.", dose: safetyDose, sideEffects: "May cause local irritation, numbness, redness, or allergic reaction." },
  { name: "Amoxicillin Capsules - Antibiotic", function: "Penicillin antibiotic used for susceptible bacterial infections when prescribed.", dose: prescriptionDose, sideEffects: "May cause nausea, diarrhea, rash, thrush, or serious allergic reaction." },
  { name: "Co-amoxiclav Tablets - Antibiotic", function: "Penicillin/beta-lactamase inhibitor antibiotic for susceptible infections when prescribed.", dose: prescriptionDose, sideEffects: "May cause diarrhea, nausea, rash, liver enzyme changes, or serious allergy." },
  { name: "Azithromycin Tablets - Antibiotic", function: "Macrolide antibiotic for susceptible infections when prescribed.", dose: prescriptionDose, sideEffects: "May cause stomach upset, diarrhea, headache, liver issues, or heart rhythm concerns in some people." },
  { name: "Ciprofloxacin Tablets - Antibiotic", function: "Fluoroquinolone antibiotic for specific susceptible infections when prescribed.", dose: prescriptionDose, sideEffects: "May cause nausea, diarrhea, tendon pain, mood effects, nerve symptoms, or heart rhythm concerns." },
  { name: "Doxycycline Capsules - Antibiotic", function: "Tetracycline antibiotic for susceptible infections when prescribed.", dose: prescriptionDose, sideEffects: "May cause nausea, photosensitivity, esophageal irritation, or tooth effects in children/pregnancy risk groups." },
  { name: "Cefuroxime Tablets - Antibiotic", function: "Cephalosporin antibiotic for susceptible bacterial infections when prescribed.", dose: prescriptionDose, sideEffects: "May cause diarrhea, nausea, rash, thrush, or allergic reaction." },
  { name: "Metronidazole / Flagyl Tablets", function: "Antibiotic/antiprotozoal used for anaerobic or protozoal infections when prescribed.", dose: prescriptionDose, sideEffects: "May cause nausea, metallic taste, dark urine, headache, or interaction with alcohol." },
  { name: "Ondansetron Tablets - Antiemetic", function: "Antiemetic used for nausea and vomiting when prescribed or approved.", dose: prescriptionDose, sideEffects: "May cause constipation, headache, dizziness, or heart rhythm concerns in some people." },
  { name: "Metoclopramide Tablets/Injection - Antiemetic", function: "Antiemetic/prokinetic used for nausea and vomiting when prescribed.", dose: prescriptionDose, sideEffects: "May cause drowsiness, restlessness, diarrhea, or movement side effects." },
  { name: "Domperidone Tablets/Suspension - Antiemetic", function: "Antiemetic/prokinetic used for nausea and vomiting when appropriate.", dose: prescriptionDose, sideEffects: "May cause dry mouth, headache, stomach cramps, or heart rhythm concerns in some people." },
  { name: "Insulin Rapid-Acting Pen/Vial", function: "Insulin for mealtime or correction glucose control in diabetes.", dose: prescriptionDose, sideEffects: "May cause hypoglycaemia, weight gain, injection-site reactions, or allergy." },
  { name: "Insulin Short-Acting Regular", function: "Insulin for glucose control in diabetes as prescribed.", dose: prescriptionDose, sideEffects: "May cause hypoglycaemia, weight gain, injection-site reactions, or allergy." },
  { name: "Insulin Intermediate-Acting NPH", function: "Basal/intermediate insulin for glucose control in diabetes.", dose: prescriptionDose, sideEffects: "May cause hypoglycaemia, weight gain, injection-site reactions, or allergy." },
  { name: "Insulin Long-Acting Glargine", function: "Long-acting basal insulin for diabetes management.", dose: prescriptionDose, sideEffects: "May cause hypoglycaemia, weight gain, injection-site reactions, or allergy." },
  { name: "Insulin Long-Acting Detemir", function: "Long-acting basal insulin for diabetes management.", dose: prescriptionDose, sideEffects: "May cause hypoglycaemia, weight gain, injection-site reactions, or allergy." },
  { name: "Insulin Long-Acting Degludec", function: "Ultra-long acting basal insulin for diabetes management.", dose: prescriptionDose, sideEffects: "May cause hypoglycaemia, weight gain, injection-site reactions, or allergy." },
  { name: "Premixed Insulin 30/70", function: "Premixed insulin for diabetes management as prescribed.", dose: prescriptionDose, sideEffects: "May cause hypoglycaemia, weight gain, injection-site reactions, or allergy." },
  { name: "Metformin Tablets - Diabetic Tablet", function: "Biguanide used to help control blood glucose in type 2 diabetes.", dose: prescriptionDose, sideEffects: "May cause nausea, diarrhea, stomach upset, taste change, or rare lactic acidosis risk." },
  { name: "Glibenclamide Tablets - Diabetic Tablet", function: "Sulfonylurea used to lower blood glucose in type 2 diabetes.", dose: prescriptionDose, sideEffects: "May cause hypoglycaemia, weight gain, nausea, or rash." },
  { name: "Gliclazide Tablets - Diabetic Tablet", function: "Sulfonylurea used to lower blood glucose in type 2 diabetes.", dose: prescriptionDose, sideEffects: "May cause hypoglycaemia, weight gain, stomach upset, or rash." },
  { name: "Glimepiride Tablets - Diabetic Tablet", function: "Sulfonylurea used to lower blood glucose in type 2 diabetes.", dose: prescriptionDose, sideEffects: "May cause hypoglycaemia, weight gain, nausea, or rash." },
  { name: "Sitagliptin Tablets - Diabetic Tablet", function: "DPP-4 inhibitor used for type 2 diabetes management.", dose: prescriptionDose, sideEffects: "May cause headache, upper respiratory symptoms, stomach upset, or rare pancreatitis warning symptoms." },
  { name: "Empagliflozin Tablets - Diabetic Tablet", function: "SGLT2 inhibitor used for type 2 diabetes and selected cardio-renal indications.", dose: prescriptionDose, sideEffects: "May cause genital/urinary infections, dehydration, dizziness, or ketoacidosis warning symptoms." },
  { name: "Pioglitazone Tablets - Diabetic Tablet", function: "Thiazolidinedione used for type 2 diabetes management.", dose: prescriptionDose, sideEffects: "May cause weight gain, fluid retention, swelling, or heart failure worsening in some people." },
  { name: "Amlodipine Tablets - Antihypertensive", function: "Calcium channel blocker used for high blood pressure or angina.", dose: prescriptionDose, sideEffects: "May cause ankle swelling, flushing, headache, dizziness, or palpitations." },
  { name: "Lisinopril Tablets - Antihypertensive", function: "ACE inhibitor used for hypertension, heart failure, or kidney protection when prescribed.", dose: prescriptionDose, sideEffects: "May cause cough, dizziness, high potassium, kidney changes, or angioedema." },
  { name: "Losartan Tablets - Antihypertensive", function: "ARB used for hypertension or kidney/cardiac indications when prescribed.", dose: prescriptionDose, sideEffects: "May cause dizziness, high potassium, kidney changes, or rare allergy." },
  { name: "Hydrochlorothiazide Tablets - Antihypertensive", function: "Thiazide diuretic used for blood pressure or fluid management.", dose: prescriptionDose, sideEffects: "May cause increased urination, low potassium/sodium, dizziness, gout flare, or photosensitivity." },
  { name: "Atenolol Tablets - Antihypertensive", function: "Beta blocker used for blood pressure, angina, or heart-rate control when prescribed.", dose: prescriptionDose, sideEffects: "May cause tiredness, slow heart rate, dizziness, cold hands/feet, or breathing issues in susceptible people." },
  { name: "Furosemide Tablets/Injection - Diuretic", function: "Loop diuretic used for fluid overload or blood pressure indications when prescribed.", dose: prescriptionDose, sideEffects: "May cause dehydration, low electrolytes, dizziness, kidney changes, or hearing issues at high exposure." },
  { name: "Haloperidol Tablets/Injection - Antipsychotic", function: "Antipsychotic used for psychosis, agitation, or other specialist indications.", dose: prescriptionDose, sideEffects: "May cause drowsiness, movement side effects, stiffness, restlessness, or heart rhythm concerns." },
  { name: "Risperidone Tablets - Antipsychotic", function: "Antipsychotic used for psychosis, bipolar disorder, or specialist indications.", dose: prescriptionDose, sideEffects: "May cause drowsiness, weight gain, movement symptoms, raised prolactin, or metabolic changes." },
  { name: "Olanzapine Tablets - Antipsychotic", function: "Antipsychotic used for schizophrenia, bipolar disorder, or specialist indications.", dose: prescriptionDose, sideEffects: "May cause sleepiness, weight gain, increased appetite, metabolic changes, or dry mouth." },
  { name: "Quetiapine Tablets - Antipsychotic", function: "Antipsychotic used for specialist mental health indications.", dose: prescriptionDose, sideEffects: "May cause sleepiness, dizziness, dry mouth, weight gain, or metabolic changes." },
  { name: "Diazepam Tablets - Anxiety Medicine", function: "Benzodiazepine used short-term for anxiety, spasm, seizures, or procedural indications when prescribed.", dose: prescriptionDose, sideEffects: "May cause drowsiness, dependence, confusion, falls, breathing depression, or impaired driving." },
  { name: "Lorazepam Tablets - Anxiety Medicine", function: "Benzodiazepine used short-term for anxiety or agitation when prescribed.", dose: prescriptionDose, sideEffects: "May cause drowsiness, dependence, confusion, falls, breathing depression, or impaired driving." },
  { name: "Sertraline Tablets - Anxiety/Depression", function: "SSRI used for depression, anxiety disorders, and related indications when prescribed.", dose: prescriptionDose, sideEffects: "May cause nausea, insomnia, headache, sexual dysfunction, mood changes, or withdrawal symptoms if stopped suddenly." },
  { name: "Fluoxetine Capsules - Anxiety/Depression", function: "SSRI used for depression, anxiety-related disorders, and specialist indications.", dose: prescriptionDose, sideEffects: "May cause nausea, insomnia, headache, anxiety at start, sexual dysfunction, or mood changes." },
  { name: "Chloramphenicol Eye Drops", function: "Antibiotic eye drops for bacterial eye infection when appropriate.", dose: safetyDose, sideEffects: "May cause stinging, irritation, blurred vision, or allergy." },
  { name: "Tetracycline Eye Ointment", function: "Antibiotic eye ointment for bacterial eye infection where appropriate.", dose: safetyDose, sideEffects: "May cause temporary blurred vision, irritation, or allergy." },
  { name: "Artificial Tears Eye Drops", function: "Lubricating eye drops for dry eyes.", dose: safetyDose, sideEffects: "May cause temporary blurred vision, mild stinging, or irritation." },
  { name: "Timolol Eye Drops", function: "Beta blocker eye drops used for glaucoma or raised eye pressure when prescribed.", dose: prescriptionDose, sideEffects: "May cause eye irritation, slow heart rate, breathing issues in susceptible people, or dizziness." },
  { name: "Chlorphenamine / Piriton Tablets", function: "Sedating antihistamine for allergy symptoms when appropriate.", dose: safetyDose, sideEffects: "May cause drowsiness, dry mouth, blurred vision, constipation, or impaired driving." },
  { name: "Chlorphenamine / Piriton Syrup - Children", function: "Children's sedating antihistamine for allergy symptoms when appropriate.", dose: safetyDose, sideEffects: "May cause drowsiness or excitability, dry mouth, blurred vision, or stomach upset." },
  { name: "Loratadine Tablets", function: "Non-sedating antihistamine for allergy symptoms.", dose: safetyDose, sideEffects: "May cause headache, sleepiness, dry mouth, or fatigue." },
  { name: "Loratadine Syrup - Children", function: "Children's non-sedating antihistamine for allergy symptoms.", dose: safetyDose, sideEffects: "May cause headache, sleepiness, dry mouth, or stomach upset." },
  { name: "Cetirizine Tablets", function: "Antihistamine for allergy symptoms.", dose: safetyDose, sideEffects: "May cause sleepiness, dry mouth, tiredness, or headache." },
  { name: "Cetirizine Syrup - Children", function: "Children's antihistamine for allergy symptoms.", dose: safetyDose, sideEffects: "May cause sleepiness, tiredness, dry mouth, or stomach upset." },
  { name: "Hydrocortisone Cream", function: "Mild topical corticosteroid for inflammatory rashes when appropriate.", dose: safetyDose, sideEffects: "May cause skin thinning, irritation, color change, or worsening infection if used incorrectly." },
  { name: "Clotrimazole Cream", function: "Topical antifungal for fungal skin infections.", dose: safetyDose, sideEffects: "May cause local irritation, burning, itching, or redness." },
  { name: "Miconazole Cream", function: "Topical antifungal for fungal skin infections.", dose: safetyDose, sideEffects: "May cause local irritation, burning, itching, or redness." },
  { name: "Calamine Lotion", function: "Soothing lotion for itchy or irritated skin.", dose: safetyDose, sideEffects: "May cause dryness, local irritation, or allergy." },
  { name: "Zinc Oxide Cream", function: "Barrier cream for nappy rash or minor skin irritation.", dose: safetyDose, sideEffects: "May cause local irritation or allergy." },
  { name: "Betamethasone Cream", function: "Potent topical corticosteroid for inflammatory skin conditions when prescribed.", dose: prescriptionDose, sideEffects: "May cause skin thinning, stretch marks, color change, or worsening infection if misused." },
  { name: "Tetanus Toxoid Vaccine", function: "Vaccine used for tetanus immunization according to local immunization schedule.", dose: "Use only according to local immunization schedule, cold-chain requirements, and authorized vaccination protocol.", sideEffects: "May cause injection-site pain, fever, fatigue, headache, or rare allergic reaction." },
  { name: "Sterile Syringes", function: "Medical device for drawing up or administering injectable medicines by trained staff.", dose: deviceDose, sideEffects: "Device risks include needle-stick injury, infection risk if reused, or incorrect administration." },
  { name: "Insulin Syringes", function: "Medical device for measuring and administering insulin.", dose: deviceDose, sideEffects: "Device risks include dosing error, needle-stick injury, or infection risk if reused." },
  { name: "Needles", function: "Medical device used with syringes or pens for injection by trained staff or instructed patients.", dose: deviceDose, sideEffects: "Device risks include needle-stick injury, pain, bleeding, or infection risk if reused." },
  { name: "Normal Saline 0.9%", function: "Sterile saline product used according to route, indication, and local protocol.", dose: "Use only according to product type, route, and authorized local protocol.", sideEffects: "Risks depend on route and use; may include contamination risk if mishandled or fluid/electrolyte concerns with inappropriate use." },
  { name: "Hand Gloves - Examination", function: "Disposable personal protective equipment for infection control.", dose: "Select correct size and use according to infection-control protocol.", sideEffects: "May cause latex or material allergy, sweating, or skin irritation." },
  { name: "ORS Sachets - Adult/Children", function: "Oral rehydration salts for fluid and electrolyte replacement.", dose: "Mix and use exactly as directed on the sachet or local protocol.", sideEffects: "Usually well tolerated when mixed correctly. Incorrect mixing may affect salt balance." },
  { name: "Glycerin Suppositories - Laxative", function: "Rectal laxative used for short-term relief of constipation when appropriate.", dose: safetyDose, sideEffects: "May cause rectal irritation, cramping, diarrhea, or discomfort." },
  { name: "Bisacodyl Suppositories - Laxative", function: "Stimulant laxative suppository used for constipation or bowel emptying when appropriate.", dose: safetyDose, sideEffects: "May cause abdominal cramps, rectal irritation, diarrhea, or dehydration if overused." },
  { name: "Paracetamol Suppositories - Pain/Fever", function: "Rectal analgesic and antipyretic for pain or fever when oral use is not suitable.", dose: safetyDose, sideEffects: "Usually well tolerated at correct dose. Overdose can cause serious liver injury; may cause rectal irritation." },
  { name: "Diclofenac Suppositories - NSAID", function: "Rectal NSAID for pain and inflammation when prescribed or approved.", dose: prescriptionDose, sideEffects: "May cause rectal irritation, stomach irritation, bleeding risk, kidney problems, or cardiovascular risk." },
  { name: "Antihemorrhoid Suppositories", function: "Rectal suppository used for hemorrhoid symptom relief depending on active ingredients.", dose: safetyDose, sideEffects: "May cause local irritation, burning, allergy, or worsening symptoms if used incorrectly." },
  { name: "Tramadol Capsules/Tablets - Controlled Analgesic", controlled: true, function: "Opioid analgesic for moderate to severe pain when prescribed.", dose: "Controlled medicine: sell only with valid doctor report/prescription and record the reference before sale.", sideEffects: "May cause drowsiness, dizziness, nausea, constipation, dependence, breathing depression, or impaired driving." },
  { name: "Codeine Tablets/Syrup - Controlled Analgesic", controlled: true, function: "Opioid medicine used for pain or cough only where legally permitted and prescribed/approved.", dose: "Controlled medicine: sell only with valid doctor report/prescription and record the reference before sale.", sideEffects: "May cause drowsiness, constipation, nausea, dependence, breathing depression, or impaired driving." },
  { name: "Morphine Tablets/Injection - Controlled Analgesic", controlled: true, function: "Strong opioid analgesic for severe pain under strict medical supervision.", dose: "Controlled medicine: sell only with valid doctor report/prescription and record the reference before sale.", sideEffects: "May cause sedation, constipation, nausea, dependence, low blood pressure, or life-threatening breathing depression." },
  { name: "Pethidine Injection - Controlled Analgesic", controlled: true, function: "Opioid analgesic used in controlled clinical settings when prescribed.", dose: "Controlled medicine: sell only with valid doctor report/prescription and record the reference before sale.", sideEffects: "May cause drowsiness, dizziness, nausea, dependence, seizures in some cases, or breathing depression." },
  { name: "IV Giving Set", function: "Medical device used to administer intravenous fluids by trained staff.", dose: deviceDose, sideEffects: "Device risks include contamination, incorrect setup, air entry, leakage, or infection if mishandled." },
  { name: "Normal Saline 0.9% IV Fluid", function: "Intravenous crystalloid fluid used according to clinical indication and local protocol.", dose: "Use only by authorized staff according to prescription/protocol, route, volume, and patient condition.", sideEffects: "May cause fluid overload, electrolyte issues, vein irritation, or contamination risk if mishandled." },
  { name: "Dextrose Saline IV Fluid", function: "Intravenous fluid containing glucose and saline used according to clinical indication.", dose: "Use only by authorized staff according to prescription/protocol, route, volume, and patient condition.", sideEffects: "May cause fluid overload, electrolyte/glucose changes, vein irritation, or contamination risk if mishandled." },
  { name: "Glucometer Test Strips", function: "Consumable strips used with a compatible glucometer to check blood glucose.", dose: "Use according to meter and strip instructions; match strip brand/model to the machine.", sideEffects: "Device risks include inaccurate readings if expired, contaminated, mismatched, or stored incorrectly." },
  { name: "Glucometer Machine", function: "Device used to monitor blood glucose.", dose: deviceDose, sideEffects: "Device risks include inaccurate readings from wrong strips, poor calibration, low battery, dirty hands, or expired strips." },
  { name: "Digital Thermometer", function: "Device used to measure body temperature.", dose: deviceDose, sideEffects: "Device risks include inaccurate readings if used incorrectly or not cleaned between users." },
  { name: "Sphygmomanometer / Blood Pressure Monitor", function: "Device used to measure blood pressure.", dose: deviceDose, sideEffects: "Device risks include inaccurate readings from wrong cuff size, poor positioning, low battery, or damaged tubing." },
  { name: "Pulse Oximeter", function: "Device used to estimate blood oxygen saturation and pulse rate.", dose: deviceDose, sideEffects: "Device risks include inaccurate readings with poor circulation, nail polish, movement, low battery, or improper placement." },
  { name: "Pregnancy Test Strips", function: "Diagnostic strips used to test urine for pregnancy hormone.", dose: "Use according to product instructions and read within the stated time window.", sideEffects: "Device risks include false results if used too early, read too late, expired, or stored incorrectly." },
  { name: "HIV Test Strips", function: "Diagnostic strips used for HIV screening according to approved testing protocol.", dose: "Use only according to approved testing, counselling, consent, storage, and reporting protocol.", sideEffects: "Risks include false results if used incorrectly; positive or unclear results require approved confirmatory testing pathway." },
  { name: "Cotton Wool", function: "Medical consumable used for cleaning, padding, or wound-care support.", dose: "Use according to infection-control and wound-care protocol.", sideEffects: "Risks include contamination if handled poorly or fibers left in wounds." },
  { name: "Alcohol Swabs", function: "Skin cleansing swabs used before injections or minor procedures.", dose: "Use externally according to procedure and infection-control protocol.", sideEffects: "May cause skin dryness, stinging, irritation, or allergy." },
  { name: "Methylated Spirit / Surgical Spirit", function: "External antiseptic/cleaning spirit depending on product type and local protocol.", dose: "External use only; follow product label and local protocol.", sideEffects: "Flammable; may cause skin dryness, irritation, burns on broken skin, or poisoning if ingested." },
  { name: "Hospital Bed", function: "Clinical equipment used for patient positioning and care.", dose: "Use according to facility safety protocol and patient handling guidance.", sideEffects: "Equipment risks include falls, entrapment, poor positioning, or pressure injury if used incorrectly." },
  { name: "Drip Stand", function: "Clinical equipment used to hold IV fluid bags and infusion devices.", dose: "Use according to facility safety protocol.", sideEffects: "Equipment risks include tipping, falls, line pulling, or injury if overloaded or unstable." },
  { name: "Other / custom medication", function: "", dose: "", sideEffects: "" }
];

const catalogEntry = (name) => medicineCatalog.find((item) => item.name === name) || medicineCatalog[0];

const emptyState = {
  medicines: [],
  sales: [],
  employees: [],
  auditLogs: [],
  cashChecks: [],
  stockAdjustments: []
};

const seedState = {
  medicines: [
    {
      id: crypto.randomUUID(),
      name: "Amoxicillin Capsules - Antibiotic",
      barcode: "5012345678901",
      batch: "AMX-26A",
      expiry: "2026-08-30",
      seller: "Medline Wholesale",
      supplierEmail: "orders@medline.example",
      supplierPhone: "+440000000001",
      quantity: 120,
      left: 84,
      cost: 1.2,
      price: 2.5,
      reorder: 20,
      function: catalogEntry("Amoxicillin Capsules - Antibiotic").function,
      dose: catalogEntry("Amoxicillin Capsules - Antibiotic").dose,
      sideEffects: catalogEntry("Amoxicillin Capsules - Antibiotic").sideEffects,
      otherNotes: "Keep dry and check prescription status before supply.",
      createdAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: "Paracetamol Tablets - Adult",
      barcode: "5019876543210",
      batch: "PCM-18D",
      expiry: "2026-07-31",
      seller: "City Pharma Supply",
      supplierEmail: "orders@citypharma.example",
      supplierPhone: "+440000000002",
      quantity: 300,
      left: 18,
      cost: 0.18,
      price: 0.55,
      reorder: 40,
      function: catalogEntry("Paracetamol Tablets - Adult").function,
      dose: catalogEntry("Paracetamol Tablets - Adult").dose,
      sideEffects: catalogEntry("Paracetamol Tablets - Adult").sideEffects,
      otherNotes: "Shelf A2.",
      createdAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: "Loratadine Tablets",
      barcode: "5022223333444",
      batch: "LRT-77B",
      expiry: "2027-09-15",
      seller: "Northbridge Health",
      supplierEmail: "orders@northbridge.example",
      supplierPhone: "+440000000003",
      quantity: 90,
      left: 51,
      cost: 0.42,
      price: 1.1,
      reorder: 15,
      function: catalogEntry("Loratadine Tablets").function,
      dose: catalogEntry("Loratadine Tablets").dose,
      sideEffects: catalogEntry("Loratadine Tablets").sideEffects,
      otherNotes: "",
      createdAt: new Date().toISOString()
    }
  ],
  sales: [
    {
      id: crypto.randomUUID(),
      medicineId: "",
      medicineName: "Amoxicillin Capsules - Antibiotic",
      barcode: "5012345678901",
      quantity: 3,
      employee: "Amina Yusuf",
      unitPrice: 2.5,
      unitCost: 1.2,
      total: 7.5,
      gain: 3.9,
      soldAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      medicineId: "",
      medicineName: "Paracetamol Tablets - Adult",
      barcode: "5019876543210",
      quantity: 8,
      employee: "David Chen",
      unitPrice: 0.55,
      unitCost: 0.18,
      total: 4.4,
      gain: 2.96,
      soldAt: new Date().toISOString()
    }
  ],
  employees: [
    { id: crypto.randomUUID(), name: "Amina Yusuf", role: "Pharmacist", shift: "Mon-Fri, 08:00-16:00" },
    { id: crypto.randomUUID(), name: "David Chen", role: "Cashier", shift: "Tue-Sat, 12:00-20:00" },
    { id: crypto.randomUUID(), name: "Grace Okafor", role: "Inventory clerk", shift: "Mon-Thu, 09:00-15:00" }
  ],
  auditLogs: [],
  cashChecks: [],
  stockAdjustments: []
};

let state = loadState();
let scannerStream = null;
let scanTimer = null;
let selectedMedicineId = null;
let currentUser = normalizeUser(JSON.parse(sessionStorage.getItem(sessionKey) || "null"));
let sessionToken = sessionStorage.getItem(sessionTokenKey) || "";
let serverSyncReady = false;
let saveTimer = null;
let backupHistory = [];
let liveStorageLabel = location.protocol === "file:" ? "Local browser only" : "Checking live sync...";
let liveStorageMode = location.protocol === "file:" ? "local" : "checking";
const expandedSections = {
  lowStock: false,
  activity: false,
  medicineDetail: false,
  reportExpired: false,
  reportSoon: false,
  reportLowStock: false,
  backupHistory: false,
  topbarControls: false
};

const $ = (selector) => document.querySelector(selector);

function normalizeUser(user) {
  if (!user) return user;
  const oldNames = ["Nwaekpe Lynda", "Local Demo Manager", "Manager"];
  const normalized = { ...user };
  if (oldNames.includes(normalized.name) && normalized.role === "Manager") {
    normalized.name = "Lynda Chidi";
    sessionStorage.setItem(sessionKey, JSON.stringify(normalized));
  }
  return normalized;
}
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);

function loadState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return structuredClone(seedState);
  try {
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return structuredClone(seedState);
  }
}

function normalizeMedicine(item) {
  const catalog = medicineCatalog.find((entry) => entry.name === item.name);
  return {
    ...item,
    quantity: Number(item.quantity || 0),
    left: Number(item.left || 0),
    cost: Number(item.cost || 0),
    price: Number(item.price || 0),
    reorder: Number(item.reorder || 0),
    function: item.function || catalog?.function || "Add medicine function.",
    dose: item.dose || catalog?.dose || "Add recommended dose note.",
    sideEffects: item.sideEffects || catalog?.sideEffects || "Add known side effects.",
    supplierEmail: item.supplierEmail || "",
    supplierPhone: item.supplierPhone || "",
    otherNotes: item.otherNotes || ""
  };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  scheduleServerSave();
}

async function hydrateFromServer() {
  if (location.protocol === "file:" || !sessionToken) {
    updateSyncStatus();
    return;
  }
  try {
    const response = await fetch(apiStateUrl, { cache: "no-store", headers: authHeaders() });
    if (response.status === 401) {
      sessionToken = "";
      sessionStorage.removeItem(sessionTokenKey);
      serverSyncReady = false;
      liveStorageLabel = "Login needed for live sync";
      liveStorageMode = "offline";
      updateSyncStatus();
      return;
    }
    if (!response.ok) {
      serverSyncReady = false;
      liveStorageLabel = "Live sync not connected";
      liveStorageMode = "offline";
      updateSyncStatus();
      return;
    }
    const serverState = await response.json();
    const hasServerRecords = ["medicines", "sales", "employees", "auditLogs", "cashChecks", "stockAdjustments"]
      .some((key) => Array.isArray(serverState[key]) && serverState[key].length > 0);
    serverSyncReady = true;
    await checkLiveStatus();
    if (hasServerRecords) {
      state = normalizeState(serverState);
      localStorage.setItem(storageKey, JSON.stringify(state));
      showToast("Loaded shared Railway data.");
      renderAll();
    } else if (!canManageSensitiveActions()) {
      state = normalizeState(serverState);
      localStorage.setItem(storageKey, JSON.stringify(state));
      renderAll();
    } else {
      pushStateToServer();
    }
  } catch {
    serverSyncReady = false;
    liveStorageLabel = "Live sync offline";
    liveStorageMode = "offline";
    updateSyncStatus();
  }
}

function normalizeState(raw) {
  return {
    medicines: (raw.medicines || []).map(normalizeMedicine),
    sales: raw.sales || [],
    employees: raw.employees || [],
    auditLogs: raw.auditLogs || [],
    cashChecks: raw.cashChecks || [],
    stockAdjustments: raw.stockAdjustments || []
  };
}

function scheduleServerSave() {
  if (!serverSyncReady || location.protocol === "file:") return;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(pushStateToServer, 450);
}

async function pushStateToServer() {
  if (location.protocol === "file:" || !sessionToken) return;
  try {
    const response = await fetch(apiStateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(state)
    });
    if (!response.ok) throw new Error("Save failed");
    serverSyncReady = true;
    updateSyncStatus();
  } catch {
    serverSyncReady = false;
    liveStorageLabel = "Live sync offline";
    liveStorageMode = "offline";
    updateSyncStatus();
  }
}

function authHeaders() {
  return sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};
}

async function checkLiveStatus() {
  if (location.protocol === "file:") {
    liveStorageLabel = "Local browser only";
    liveStorageMode = "local";
    updateSyncStatus();
    return;
  }
  try {
    const response = await fetch(apiHealthUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Health check failed");
    const health = await response.json();
    if (health.storage === "postgres") {
      liveStorageLabel = "Postgres live sync";
      liveStorageMode = "live";
    } else {
      liveStorageLabel = "Server file storage";
      liveStorageMode = "warning";
    }
  } catch {
    liveStorageLabel = "Live sync offline";
    liveStorageMode = "offline";
  }
  updateSyncStatus();
}

function updateSyncStatus() {
  const badge = $("#syncStatus");
  if (!badge) return;
  const signedInLabel = currentUser && location.protocol !== "file:" && serverSyncReady ? "Saved" : liveStorageLabel;
  badge.textContent = signedInLabel === "Saved" ? `${liveStorageLabel} - saved` : liveStorageLabel;
  badge.className = `sync-pill ${liveStorageMode}`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function setLoginHelp(message) {
  const helper = $("#loginHelp");
  helper.textContent = message || "";
  helper.classList.toggle("hidden", !message);
}

function setView(viewId) {
  if (!canView(viewId)) {
    showToast("Your staff role does not have access to that section.");
    viewId = firstAllowedView();
  }
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
  if (!["capture", "sales"].includes(viewId)) stopScanner();
}

function renderAll() {
  renderMedicineOptions();
  renderMetrics();
  renderAlerts();
  renderLowStock();
  renderActivity();
  renderInventory();
  renderSales();
  renderEmployees();
  renderReports();
  renderSecurity();
  renderAuth();
  saveState();
}

function renderMedicineOptions() {
  const options = medicineCatalog
    .map((item) => `<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)}</option>`)
    .join("");
  $("#medicineSelect").innerHTML = `<option value="">Choose from medication list</option>${options}`;

  const inventoryOptions = state.medicines
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)} - ${escapeHtml(item.barcode)} - ${item.left} left</option>`)
    .join("");
  $("#saleMedicineSelect").innerHTML = `<option value="">Select from stock</option>${inventoryOptions}`;
  $("#auditMedicineSelect").innerHTML = `<option value="">Select medicine to count</option>${inventoryOptions}`;
  $("#barcodeList").innerHTML = state.medicines.map((item) => `<option value="${escapeHtml(item.barcode)}">${escapeHtml(item.name)}</option>`).join("");
  $("#supplierList").innerHTML = getSuppliers()
    .map((supplier) => `<option value="${escapeHtml(supplier.name)}">${escapeHtml([supplier.email, supplier.phone].filter(Boolean).join(" - "))}</option>`)
    .join("");
}

function renderMetrics() {
  const inventoryValue = state.medicines.reduce((sum, item) => sum + item.left * item.cost, 0);
  const unitsReceived = state.medicines.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const unitsLeft = state.medicines.reduce((sum, item) => sum + Number(item.left || 0), 0);
  const gain = state.sales.reduce((sum, sale) => sum + Number(sale.gain || 0), 0);
  const lowStock = state.medicines.filter((item) => stockAlarmLevel(item) !== "ok").length;
  const expiring = state.medicines.filter((item) => expiryAlarmLevel(item) !== "ok").length;
  const security = getSecurityAlerts().length;

  $("#metricValue").textContent = money(inventoryValue);
  $("#metricReceived").textContent = unitsReceived.toLocaleString();
  $("#metricUnits").textContent = unitsLeft.toLocaleString();
  $("#metricGain").textContent = money(gain);
  $("#metricLowStock").textContent = lowStock.toLocaleString();
  $("#metricExpiring").textContent = expiring.toLocaleString();
  $("#metricSecurity").textContent = security.toLocaleString();
}

function renderAlerts() {
  const criticalStock = state.medicines.filter((item) => stockAlarmLevel(item) === "critical");
  const lowStock = state.medicines.filter((item) => stockAlarmLevel(item) === "low");
  const expired = state.medicines.filter((item) => expiryAlarmLevel(item) === "expired");
  const expiringSoon = state.medicines.filter((item) => expiryAlarmLevel(item) === "soon");
  const alerts = [];

  if (criticalStock.length) alerts.push(alertCard("danger", "Critical stock", `${criticalStock.length} medication(s) have no stock or almost no stock left.`));
  if (lowStock.length) alerts.push(alertCard("warning", "Low stock", `${lowStock.length} medication(s) are at or below reorder level.`));
  if (expired.length) alerts.push(alertCard("danger", "Expired medication", `${expired.length} medication(s) are past expiry date. Remove them from sellable stock.`));
  if (expiringSoon.length) alerts.push(alertCard("danger", "Expiry warning", `${expiringSoon.length} medication(s) expire within 90 days.`));
  getSecurityAlerts().slice(0, 3).forEach((alert) => alerts.push(alertCard("danger", alert.title, alert.body, "security")));

  $("#alertStack").innerHTML = alerts.join("") || alertCard("ok", "No active alarms", "Stock and expiry dates are within the current limits.");
}

function alertCard(type, title, body, view = "inventory") {
  return `<button class="alert-card ${type}" data-view-jump="${view}" type="button"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span></button>`;
}

function renderLowStock() {
  const items = state.medicines
    .filter((item) => stockAlarmLevel(item) !== "ok")
    .sort((a, b) => a.left - b.left)
  const visibleItems = expandedSections.lowStock ? items : items.slice(0, 6);
  const rows = visibleItems
    .map((item) => `<tr class="clickable-row" data-open-medicine="${item.id}"><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.barcode)}</td><td>${stockBadge(item)}</td><td>${escapeHtml(item.seller)}</td></tr>`)
    .join("");
  const toggle = items.length > 6
    ? `<tr><td colspan="4"><button class="text-button" data-toggle-section="lowStock" type="button">${expandedSections.lowStock ? "Hide" : `View more (${items.length - 6})`}</button></td></tr>`
    : "";
  $("#lowStockRows").innerHTML = rows ? `${rows}${toggle}` : `<tr><td colspan="4" class="empty">No low stock items.</td></tr>`;
}

function renderActivity() {
  const sales = state.sales
    .slice()
    .sort((a, b) => new Date(b.soldAt) - new Date(a.soldAt));
  const visibleSales = expandedSections.activity ? sales : sales.slice(0, 5);
  const activity = visibleSales
    .map((sale) => `
      <div class="activity-item">
        <div><strong>${escapeHtml(sale.medicineName)}</strong><br><span>${sale.quantity} sold by ${escapeHtml(sale.employee)}</span></div>
        <strong>${money(sale.total)}</strong>
      </div>
    `)
    .join("");
  const toggle = sales.length > 5
    ? `<button class="text-button more-button" data-toggle-section="activity" type="button">${expandedSections.activity ? "Hide" : `View more (${sales.length - 5})`}</button>`
    : "";
  $("#activityList").innerHTML = activity ? `${activity}${toggle}` : `<p class="empty">No sales recorded yet.</p>`;
}

function renderInventory() {
  const query = $("#inventorySearch").value.trim().toLowerCase();
  const rows = state.medicines
    .filter((item) => [item.name, item.barcode, item.seller, item.supplierEmail, item.supplierPhone, item.function, item.dose, item.sideEffects, item.otherNotes].join(" ").toLowerCase().includes(query))
    .sort((a, b) => alarmRank(b) - alarmRank(a) || a.name.localeCompare(b.name))
    .map((item) => {
      const sold = getSoldQuantity(item);
      const rowClass = [
        "clickable-row",
        selectedMedicineId === item.id ? "selected-row" : "",
        stockAlarmLevel(item) === "critical" || expiryAlarmLevel(item) === "expired" ? "danger-row" : "",
        stockAlarmLevel(item) === "low" || expiryAlarmLevel(item) === "soon" ? "warning-row" : ""
      ].join(" ");
      return `
        <tr class="${rowClass}" data-open-medicine="${item.id}">
          <td><strong>${escapeHtml(item.name)}</strong><br><span class="muted">${escapeHtml(item.batch || "No batch")}</span></td>
          <td>${escapeHtml(shortText(item.function, 62))}</td>
          <td>${escapeHtml(shortText(item.dose, 52))}</td>
          <td>${escapeHtml(item.barcode)}</td>
          <td>${escapeHtml(item.seller)}<br><span class="muted">${escapeHtml(item.supplierPhone || item.supplierEmail || "No contact")}</span></td>
          <td>${Number(item.quantity || 0).toLocaleString()}</td>
          <td>${sold.toLocaleString()}</td>
          <td>${stockBadge(item)}</td>
          <td>${expiryBadge(item)}</td>
          <td>${alarmText(item)}</td>
          <td>
            <div class="row-actions">
              ${supplierActions(item)}
              <button class="icon-button" title="Edit" data-edit="${item.id}" type="button">E</button>
              ${canManageSensitiveActions() ? `<button class="icon-button danger-icon" title="Delete" data-delete="${item.id}" type="button">X</button>` : ""}
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
  $("#inventoryRows").innerHTML = rows || `<tr><td colspan="11" class="empty">No inventory records found.</td></tr>`;
  renderMedicineDetail();
}

function renderMedicineDetail() {
  const item = state.medicines.find((medicine) => medicine.id === selectedMedicineId) || state.medicines[0];
  if (!item) {
    $("#medicineDetailBody").innerHTML = `<p class="empty">No medication selected.</p>`;
    return;
  }

  selectedMedicineId = item.id;
  const sold = getSoldQuantity(item);
  const managerDetail = canManageSensitiveActions() ? `<div><span>Unit gain</span><strong>${money(item.price - item.cost)}</strong></div>` : "";
  $("#medicineDetailBody").innerHTML = `
    <div class="detail-grid">
      <div><span>Name</span><strong>${escapeHtml(item.name)}</strong></div>
      <div><span>Barcode</span><strong>${escapeHtml(item.barcode)}</strong></div>
      <div><span>Quantity received</span><strong>${Number(item.quantity || 0).toLocaleString()}</strong></div>
      <div><span>Quantity sold</span><strong>${sold.toLocaleString()}</strong></div>
      <div><span>How many left</span><strong>${Number(item.left || 0).toLocaleString()}</strong></div>
      <div><span>Expiry date</span><strong>${item.expiry || "Not set"}</strong></div>
      ${managerDetail}
      <div><span>Stock alarm</span><strong>${plainAlarmText(item)}</strong></div>
      <div><span>Supplier</span><strong>${escapeHtml(item.seller || "Not set")}</strong></div>
    </div>
    <button class="text-button more-button" data-toggle-section="medicineDetail" type="button">${expandedSections.medicineDetail ? "Hide details" : "View more details"}</button>
    <div class="detail-copy ${expandedSections.medicineDetail ? "" : "hidden"}">
      <h3>Function</h3>
      <p>${escapeHtml(item.function)}</p>
      <h3>Recommended dose</h3>
      <p>${escapeHtml(item.dose)}</p>
      <h3>Side effects</h3>
      <p>${escapeHtml(item.sideEffects)}</p>
      <h3>Other</h3>
      <p>${escapeHtml(item.otherNotes || "No other notes added.")}</p>
      <h3>Preorder / order</h3>
      <div class="order-actions">${supplierActions(item, true)}</div>
    </div>
  `;
}

function renderSales() {
  const employeeOptions = state.employees.map((employee) => `<option>${escapeHtml(employee.name)}</option>`).join("");
  $("#saleEmployee").innerHTML = employeeOptions || `<option>Walk-in seller</option>`;
  $("#cashEmployee").innerHTML = employeeOptions || `<option>Manager</option>`;
  const managerOnly = canManageSensitiveActions();
  $("#salesLogPanel").classList.toggle("hidden", !managerOnly);
  $("#staffSaleNote").classList.toggle("hidden", managerOnly);
  $("#salesGainHeader").classList.toggle("hidden", !managerOnly);

  if (!managerOnly) {
    $("#salesRows").innerHTML = "";
    updateSalePreview();
    return;
  }

  const rows = state.sales
    .slice()
    .sort((a, b) => new Date(b.soldAt) - new Date(a.soldAt))
    .map((sale) => `
      <tr>
        <td>${formatDateTime(sale.soldAt)}</td>
        <td>${escapeHtml(sale.medicineName)}</td>
        <td>${sale.quantity}</td>
        <td>${escapeHtml(sale.employee)}</td>
        <td>${money(sale.total)}<br><span class="muted">${escapeHtml(sale.paymentMethod || "Cash")}</span></td>
        <td>${money(sale.gain)}</td>
      </tr>
    `)
    .join("");
  $("#salesRows").innerHTML = rows || `<tr><td colspan="6" class="empty">No sales recorded yet.</td></tr>`;
  updateSalePreview();
}

function renderEmployees() {
  const rows = state.employees.map((employee) => `
    <div class="employee-card">
      <div><strong>${escapeHtml(employee.name)}</strong><br><span>${escapeHtml(employee.role)} - ${escapeHtml(employee.shift)}</span></div>
      ${canManageSensitiveActions() ? `<button class="icon-button danger-icon" title="Remove" data-remove-employee="${employee.id}" type="button">X</button>` : ""}
    </div>
  `).join("");
  $("#employeeRows").innerHTML = rows || `<p class="empty">No employees added yet.</p>`;
}

function renderReports() {
  const bySeller = state.sales.reduce((acc, sale) => {
    acc[sale.employee] = (acc[sale.employee] || 0) + sale.gain;
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(bySeller));
  const bars = Object.entries(bySeller)
    .sort((a, b) => b[1] - a[1])
    .map(([name, gain]) => `
      <div class="bar-row">
        <strong>${escapeHtml(name)}</strong>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(4, (gain / max) * 100)}%"></div></div>
        <span>${money(gain)}</span>
      </div>
    `)
    .join("");
  $("#sellerChart").innerHTML = bars || `<p class="empty">No gain report available yet.</p>`;

  const expiredItems = state.medicines.filter((item) => expiryAlarmLevel(item) === "expired");
  const expiringSoonItems = state.medicines.filter((item) => expiryAlarmLevel(item) === "soon");
  const lowStockItems = state.medicines.filter((item) => stockAlarmLevel(item) !== "ok");
  const totalSales = state.sales.reduce((sum, sale) => sum + sale.total, 0);
  $("#reportList").innerHTML = `
    <button class="report-item" data-toggle-section="reportLowStock" type="button"><div><strong>${lowStockItems.length}</strong><br><span>Items at or below reorder level</span></div><span>${expandedSections.reportLowStock ? "Hide" : "View"}</span></button>
    ${expandedSections.reportLowStock ? renderReportMedicineList(lowStockItems, "No low stock medicines.") : ""}
    <button class="report-item danger-report" data-toggle-section="reportExpired" type="button"><div><strong>${expiredItems.length}</strong><br><span>Items already expired</span></div><span>${expandedSections.reportExpired ? "Hide" : "View"}</span></button>
    ${expandedSections.reportExpired ? renderReportMedicineList(expiredItems, "No expired medicines.") : ""}
    <button class="report-item danger-report" data-toggle-section="reportSoon" type="button"><div><strong>${expiringSoonItems.length}</strong><br><span>Items expiring within 90 days</span></div><span>${expandedSections.reportSoon ? "Hide" : "View"}</span></button>
    ${expandedSections.reportSoon ? renderReportMedicineList(expiringSoonItems, "No medicines expiring within 90 days.") : ""}
    <div class="report-item"><div><strong>${money(totalSales)}</strong><br><span>Total sales revenue</span></div></div>
  `;
  renderReorderList(lowStockItems);
}

function renderReorderList(items = state.medicines.filter((item) => stockAlarmLevel(item) !== "ok")) {
  const sortedItems = items
    .slice()
    .sort((a, b) => (Number(a.left || 0) - Number(a.reorder || 0)) - (Number(b.left || 0) - Number(b.reorder || 0)));
  $("#reorderList").innerHTML = sortedItems.length
    ? sortedItems.map((item) => {
      const needed = Math.max(0, Number(item.reorder || 0) - Number(item.left || 0));
      return `
        <article class="reorder-card">
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.barcode)} - ${Number(item.left || 0).toLocaleString()} left - reorder level ${Number(item.reorder || 0).toLocaleString()}</span>
          </div>
          <div>
            <strong>${needed.toLocaleString()} needed</strong>
            <span>${escapeHtml(item.seller || "No supplier saved")}</span>
          </div>
          <div class="supplier-contact">
            <span>${escapeHtml(item.supplierEmail || "No email")}</span>
            <span>${escapeHtml(item.supplierPhone || "No phone")}</span>
          </div>
          <div class="order-actions">${supplierActions(item, true)}</div>
        </article>
      `;
    }).join("")
    : `<p class="empty">No reorder items. Stock is above reorder level.</p>`;
}

function renderReportMedicineList(items, emptyText) {
  if (!items.length) return `<div class="report-medicine-list empty">${escapeHtml(emptyText)}</div>`;
  return `
    <div class="report-medicine-list">
      ${items
        .slice()
        .sort((a, b) => daysUntil(a.expiry || "2999-01-01") - daysUntil(b.expiry || "2999-01-01"))
        .map((item) => `
          <button class="report-medicine-row" data-open-medicine="${item.id}" type="button">
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.expiry || "No expiry")} - ${Number(item.left || 0).toLocaleString()} left - ${escapeHtml(item.seller || "No supplier")}</span>
          </button>
        `)
        .join("")}
    </div>
  `;
}

function renderSecurity() {
  const expectedCash = getExpectedCash();
  const lastCheck = state.cashChecks.slice().sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))[0];
  const lastText = lastCheck
    ? `Last counted ${money(lastCheck.countedCash)} by ${escapeHtml(lastCheck.employee)}. Difference: ${money(lastCheck.difference)}.`
    : "No cash drawer check saved yet.";
  $("#cashPreview").innerHTML = `
    <strong>Expected cash from cash sales: ${money(expectedCash)}</strong><br>
    <span class="muted">${lastText}</span>
  `;

  const rows = state.auditLogs
    .slice()
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 80)
    .map((log) => `
      <tr class="${log.risk === "High" ? "danger-row" : log.risk === "Medium" ? "warning-row" : ""}">
        <td>${formatDateTime(log.at)}</td>
        <td>${escapeHtml(log.user || "System")}</td>
        <td>${escapeHtml(log.action)}</td>
        <td>${escapeHtml(log.details)}</td>
        <td><span class="stock-pill ${log.risk === "High" ? "critical" : log.risk === "Medium" ? "low" : "ok"}">${escapeHtml(log.risk || "Low")}</span></td>
      </tr>
    `)
    .join("");
  $("#auditRows").innerHTML = rows || `<tr><td colspan="5" class="empty">No audit activity yet.</td></tr>`;
  renderBackupHistory();
}

function renderBackupHistory() {
  const panel = $("#backupHistoryPanel");
  const list = $("#backupHistoryList");
  if (!panel || !list) return;
  panel.classList.toggle("hidden", !expandedSections.backupHistory);
  $("#viewBackupHistory").textContent = expandedSections.backupHistory ? "Hide Backup History" : "View Backup History";
  if (!expandedSections.backupHistory) return;
  if (location.protocol === "file:") {
    list.innerHTML = `<p class="empty">Backup history restore is available when the app is running on Railway or the local server. Use Download Full Backup for this file version.</p>`;
    return;
  }
  if (!backupHistory.length) {
    list.innerHTML = `<p class="empty">No server backups found yet. Backups are created when saved data is replaced.</p>`;
    return;
  }
  list.innerHTML = backupHistory
    .map((backup) => {
      const id = String(backup.id);
      return `
        <div class="backup-row">
          <div>
            <strong>${escapeHtml(formatDateTime(backup.created_at))}</strong>
            <span>${escapeHtml(id)}</span>
          </div>
          <div class="backup-actions">
            <button class="ghost-button" data-download-backup="${escapeHtml(id)}" type="button">Download</button>
            <button class="danger-button" data-restore-backup="${escapeHtml(id)}" type="button">Restore</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function handleMedicineSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const selectedName = $("#medicineSelect").value;
  const isCustom = selectedName === "Other / custom medication";
  const barcode = $("#barcode").value.trim() || generateUniqueStockCode();
  $("#barcode").value = barcode;
  const existing = state.medicines.find((item) => item.barcode === barcode);
  const quantity = Number($("#quantity").value);
  const payload = {
    name: isCustom ? $("#medicineName").value.trim() : selectedName,
    barcode,
    batch: $("#batch").value.trim(),
    expiry: $("#expiry").value,
    seller: $("#seller").value.trim(),
    supplierEmail: $("#supplierEmail").value.trim(),
    supplierPhone: $("#supplierPhone").value.trim(),
    quantity,
    cost: Number($("#cost").value),
    price: Number($("#price").value),
    reorder: Number($("#reorder").value || 0),
    function: $("#medicineFunction").value.trim(),
    dose: $("#dose").value.trim(),
    sideEffects: $("#sideEffects").value.trim(),
    otherNotes: $("#otherNotes").value.trim()
  };

  if (!payload.name) {
    showToast("Add or select a medication name.");
    return;
  }

  if (existing) {
    const previousQuantity = Number(existing.quantity || 0);
    Object.assign(existing, payload);
    existing.quantity = previousQuantity + quantity;
    existing.left = Number(existing.left || 0) + quantity;
    selectedMedicineId = existing.id;
    logAction("Stock updated", `${payload.name}: added ${quantity} unit(s). New left: ${existing.left}.`, quantity > 100 ? "Medium" : "Low");
    showToast("Stock updated and recalculated.");
  } else {
    const item = {
      id: crypto.randomUUID(),
      ...payload,
      left: quantity,
      createdAt: new Date().toISOString()
    };
    state.medicines.push(item);
    selectedMedicineId = item.id;
    logAction("Medication created", `${payload.name}: ${quantity} unit(s) entered from ${payload.seller}.`, "Low");
    showToast("Medication saved.");
  }

  form.reset();
  $("#reorder").value = 10;
  $("#formMode").textContent = "New item";
  $("#customNameLabel").classList.remove("visible");
  setClinicalFieldsVisible(false);
  renderAll();
}

function handleSaleSubmit(event) {
  event.preventDefault();
  const barcode = $("#saleBarcode").value.trim();
  const medicine = state.medicines.find((item) => item.barcode === barcode);
  const quantity = Number($("#saleQuantity").value);

  if (!medicine) {
    showToast("Barcode was not found in inventory.");
    return;
  }

  if (expiryAlarmLevel(medicine) === "expired") {
    showToast("This medication is expired. Do not sell it.");
    return;
  }

  if (isControlledMedicine(medicine) && !$("#doctorReport").value.trim()) {
    showToast("Doctor report or prescription reference is required for this controlled medicine.");
    setDoctorReportRequired(medicine);
    return;
  }

  if (quantity > medicine.left) {
    showToast(`Only ${medicine.left} units are left.`);
    return;
  }

  medicine.left -= quantity;
  state.sales.push({
    id: crypto.randomUUID(),
    medicineId: medicine.id,
    medicineName: medicine.name,
    barcode: medicine.barcode,
    quantity,
    employee: $("#saleEmployee").value,
    paymentMethod: $("#paymentMethod").value,
    doctorReport: $("#doctorReport").value.trim(),
    unitPrice: medicine.price,
    unitCost: medicine.cost,
    total: quantity * medicine.price,
    gain: quantity * (medicine.price - medicine.cost),
    soldAt: new Date().toISOString()
  });

  selectedMedicineId = medicine.id;
  logAction("Sale recorded", `${quantity} x ${medicine.name} sold by ${$("#saleEmployee").value} using ${$("#paymentMethod").value}. ${isControlledMedicine(medicine) ? `Doctor report: ${$("#doctorReport").value.trim()}. ` : ""}Total ${money(quantity * medicine.price)}.`, isControlledMedicine(medicine) ? "High" : quantity >= 20 ? "Medium" : "Low");
  event.currentTarget.reset();
  $("#saleQuantity").value = 1;
  setDoctorReportRequired(null);
  showToast(stockAlarmLevel(medicine) === "ok" ? "Sale recorded and stock recalculated." : "Sale recorded. Stock alarm is active.");
  renderAll();
}

function handleEmployeeSubmit(event) {
  event.preventDefault();
  if (!canManageSensitiveActions()) {
    showToast("Only a manager can add employees.");
    return;
  }
  state.employees.push({
    id: crypto.randomUUID(),
    name: $("#employeeName").value.trim(),
    role: $("#employeeRole").value,
    shift: $("#employeeShift").value.trim()
  });
  logAction("Employee added", `${$("#employeeName").value.trim()} added to roster.`, "Low");
  event.currentTarget.reset();
  showToast("Employee added to roster.");
  renderAll();
}

function handleCashCheckSubmit(event) {
  event.preventDefault();
  if (!canManageSensitiveActions()) {
    showToast("Only a manager can save cash drawer checks.");
    return;
  }
  const countedCash = Number($("#countedCash").value || 0);
  const expectedCash = getExpectedCash();
  const difference = countedCash - expectedCash;
  const record = {
    id: crypto.randomUUID(),
    countedCash,
    expectedCash,
    difference,
    employee: $("#cashEmployee").value,
    note: $("#cashNote").value.trim(),
    checkedAt: new Date().toISOString()
  };
  state.cashChecks.push(record);
  logAction("Cash drawer checked", `Expected ${money(expectedCash)}, counted ${money(countedCash)}, difference ${money(difference)}. ${record.note}`, Math.abs(difference) > 5 ? "High" : Math.abs(difference) > 0 ? "Medium" : "Low");
  event.currentTarget.reset();
  showToast(Math.abs(difference) > 5 ? "Cash variance saved as high risk." : "Cash check saved.");
  renderAll();
}

function handleStockAuditSubmit(event) {
  event.preventDefault();
  if (!canManageSensitiveActions()) {
    showToast("Only a manager can save stock audit adjustments.");
    return;
  }
  const item = state.medicines.find((medicine) => medicine.id === $("#auditMedicineSelect").value);
  if (!item) {
    showToast("Select a medication to count.");
    return;
  }
  const counted = Number($("#countedStock").value || 0);
  const expected = Number(item.left || 0);
  const variance = counted - expected;
  item.left = counted;
  const record = {
    id: crypto.randomUUID(),
    medicineId: item.id,
    medicineName: item.name,
    expected,
    counted,
    variance,
    reason: $("#stockReason").value,
    note: $("#stockNote").value.trim(),
    checkedBy: currentUser?.name || "Unknown",
    checkedAt: new Date().toISOString()
  };
  state.stockAdjustments.push(record);
  logAction("Stock count adjusted", `${item.name}: expected ${expected}, counted ${counted}, variance ${variance}. Reason: ${record.reason}. ${record.note}`, variance < 0 ? "High" : variance !== 0 ? "Medium" : "Low");
  event.currentTarget.reset();
  selectedMedicineId = item.id;
  showToast(variance < 0 ? "Missing stock variance saved as high risk." : "Stock count saved.");
  renderAll();
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const username = $("#loginUsername").value.trim().toLowerCase();
  const password = $("#loginPassword").value;

  if (location.protocol !== "file:") {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setLoginHelp("Login failed. Check your username and password.");
        return;
      }
      currentUser = normalizeUser(result.user);
      sessionToken = result.token;
      sessionStorage.setItem(sessionKey, JSON.stringify(currentUser));
      sessionStorage.setItem(sessionTokenKey, sessionToken);
      if (!canManageSensitiveActions()) {
        state = structuredClone(emptyState);
        localStorage.removeItem(storageKey);
      }
      $("#loginForm").reset();
      showToast(`Welcome, ${currentUser.name}.`);
      if (enforcePortalBoundary()) return;
      await hydrateFromServer();
      renderAll();
      return;
    } catch {
      setLoginHelp("Server login is not reachable. Try refreshing the Railway page.");
      return;
    }
  }

  const user = users.find((entry) => entry.username === username && entry.password === password);
  if (!user) {
    setLoginHelp("Login failed. Check your username and password.");
    return;
  }
  currentUser = { username: user.username, name: user.name, role: user.role };
  sessionToken = "";
  sessionStorage.setItem(sessionKey, JSON.stringify(currentUser));
  if (!canManageSensitiveActions()) {
    state = structuredClone(emptyState);
    localStorage.removeItem(storageKey);
  }
  logAction("Login", `${currentUser.name} signed in.`, "Low");
  $("#loginForm").reset();
  showToast(`Welcome, ${currentUser.name}.`);
  renderAll();
}

async function handleSignOut() {
  logAction("Sign out", `${currentUser?.name || "User"} signed out.`, "Low");
  if (location.protocol !== "file:" && sessionToken) {
    try {
      await fetch("/api/logout", { method: "POST", headers: authHeaders() });
    } catch {
      // Local sign-out should still proceed even if the network request fails.
    }
  }
  currentUser = null;
  sessionToken = "";
  sessionStorage.removeItem(sessionKey);
  sessionStorage.removeItem(sessionTokenKey);
  renderAuth();
}

function handleMedicineSelect() {
  const selected = medicineCatalog.find((item) => item.name === $("#medicineSelect").value);
  const isCustom = selected?.name === "Other / custom medication";
  const hasClinicalInfo = Boolean(selected && !isCustom);
  $("#customNameLabel").classList.toggle("visible", isCustom);
  $("#medicineName").required = Boolean(isCustom);
  setClinicalFieldsVisible(hasClinicalInfo);
  $("#medicineFunction").value = selected?.function || "";
  $("#dose").value = selected?.dose || "";
  $("#sideEffects").value = selected?.sideEffects || "";
  if (!isCustom) $("#medicineName").value = "";
  renderBarcodeLabelPreview();
}

function handleSaleMedicineSelect() {
  const medicine = state.medicines.find((item) => item.id === $("#saleMedicineSelect").value);
  if (!medicine) return;
  $("#saleBarcode").value = medicine.barcode;
  updateSalePreview();
}

function handleGenerateStockCode() {
  $("#barcode").value = generateUniqueStockCode();
  renderBarcodeLabelPreview();
  showToast("Stock code generated.");
}

function handleSupplierSelect() {
  const supplierName = $("#seller").value.trim().toLowerCase();
  const supplier = getSuppliers().find((item) => item.name.toLowerCase() === supplierName);
  if (!supplier) return;
  $("#supplierEmail").value = supplier.email || "";
  $("#supplierPhone").value = supplier.phone || "";
  showToast("Supplier contact filled.");
}

function updateSalePreview() {
  const barcode = $("#saleBarcode").value.trim();
  const medicine = state.medicines.find((item) => item.barcode === barcode);
  if (!medicine) {
    $("#salePreview").innerHTML = `<span class="empty">Enter a barcode or select a medicine to preview the sale.</span>`;
    setDoctorReportRequired(null);
    return;
  }

  $("#saleMedicineSelect").value = medicine.id;
  setDoctorReportRequired(medicine);
  const qty = Math.max(1, Number($("#saleQuantity").value || 1));
  const gainText = canManageSensitiveActions() ? ` - expected gain ${money(qty * (medicine.price - medicine.cost))}` : "";
  $("#salePreview").innerHTML = `
    <strong>${escapeHtml(medicine.name)}</strong><br>
    <span class="muted">${medicine.left} left - ${money(medicine.price)} each${gainText}</span>
    <div class="preview-note">Recommended dose: ${escapeHtml(medicine.dose || "No recommended dose note added.")}</div>
    ${isControlledMedicine(medicine) ? `<div class="preview-alert critical">Controlled medicine: doctor report or prescription reference required before sale.</div>` : ""}
    <div class="preview-alert ${stockAlarmLevel(medicine)}">${plainAlarmText(medicine)}</div>
    <div class="preview-alert ${expiryAlarmLevel(medicine)}">${plainExpiryText(medicine)}</div>
  `;
}

async function startScanner(mode = "capture") {
  const isSalesMode = mode === "sales";
  const status = isSalesMode ? $("#saleScannerStatus") : $("#scannerStatus");
  const video = isSalesMode ? $("#saleScannerVideo") : $("#scannerVideo");
  const frame = video.closest(".scanner-frame");
  const toggle = isSalesMode ? $("#saleScanToggle") : $("#scanToggle");
  const showManualBarcodeFallback = (message) => {
    status.textContent = message;
    const input = isSalesMode ? $("#saleBarcode") : $("#barcode");
    input.focus();
    if (isSalesMode) {
      input.classList.add("attention");
      window.setTimeout(() => input.classList.remove("attention"), 2200);
    } else {
      $("#generateStockCode").classList.add("attention");
      window.setTimeout(() => $("#generateStockCode").classList.remove("attention"), 2200);
    }
  };
  if (!navigator.mediaDevices?.getUserMedia) {
    showManualBarcodeFallback(isSalesMode ? "Camera works only on the live https app or localhost. Type the barcode manually or use a USB barcode scanner." : "Camera works only on the live https app or localhost. Type the barcode manually or click Generate Stock Code.");
    showToast("Use the live Railway link for camera scanning.");
    return;
  }

  try {
    if (scannerStream) stopScanner();
    scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = scannerStream;
    await video.play();
    frame.classList.add("scanning");
    toggle.textContent = isSalesMode ? "Stop sales camera" : "Stop camera";
    if (!("BarcodeDetector" in window)) {
      status.textContent = isSalesMode ? "Camera preview is open, but this browser cannot auto-read barcodes. Type the barcode manually or use a USB barcode scanner." : "Camera preview is open, but this browser cannot auto-read barcodes. Type the barcode manually or click Generate Stock Code.";
      const input = isSalesMode ? $("#saleBarcode") : $("#barcode");
      input.focus();
      input.classList.add("attention");
      window.setTimeout(() => input.classList.remove("attention"), 2200);
      showToast("Camera opened. Manual barcode entry is ready.");
      return;
    }
    status.textContent = "";
    const detector = new BarcodeDetector({ formats: ["ean_13", "ean_8", "code_128", "upc_a", "upc_e"] });
    scanTimer = window.setInterval(async () => {
      const codes = await detector.detect(video);
      if (codes.length) {
        const code = codes[0].rawValue;
        const match = state.medicines.find((item) => item.barcode === code);
        if (isSalesMode) {
          $("#saleBarcode").value = code;
          if (match) $("#saleMedicineSelect").value = match.id;
          updateSalePreview();
          showToast(match ? `Loaded ${match.name} for sale.` : `Captured barcode ${code}. Item not found yet.`);
        } else {
          $("#barcode").value = code;
          $("#saleBarcode").value = code;
          if (match) fillMedicineForm(match);
          renderBarcodeLabelPreview();
          showToast(`Captured barcode ${code}`);
        }
        stopScanner();
      }
    }, 700);
  } catch {
    showManualBarcodeFallback(isSalesMode ? "Camera could not start. Allow camera permission, close other camera apps, or type the barcode manually." : "Camera could not start. Allow camera permission, close other camera apps, or type the barcode manually / click Generate Stock Code.");
    showToast("Camera could not start. Manual entry is ready.");
  }
}

function stopScanner() {
  if (scanTimer) window.clearInterval(scanTimer);
  scanTimer = null;
  if (scannerStream) scannerStream.getTracks().forEach((track) => track.stop());
  scannerStream = null;
  if ($("#scannerVideo")) $("#scannerVideo").srcObject = null;
  if ($("#saleScannerVideo")) $("#saleScannerVideo").srcObject = null;
  document.querySelectorAll(".scanner-frame").forEach((frame) => frame.classList.remove("scanning"));
  $("#scanToggle").textContent = "Start camera";
  if ($("#saleScanToggle")) $("#saleScanToggle").textContent = "Start sales camera";
}

function fillMedicineForm(item) {
  const catalogItem = medicineCatalog.find((entry) => entry.name === item.name);
  $("#medicineSelect").value = catalogItem ? item.name : "Other / custom medication";
  $("#customNameLabel").classList.toggle("visible", !catalogItem);
  $("#medicineName").required = !catalogItem;
  $("#medicineName").value = catalogItem ? "" : item.name;
  $("#barcode").value = item.barcode;
  $("#batch").value = item.batch || "";
  $("#expiry").value = item.expiry || "";
  $("#medicineFunction").value = item.function || "";
  $("#dose").value = item.dose || "";
  $("#sideEffects").value = item.sideEffects || "";
  $("#otherNotes").value = item.otherNotes || "";
  $("#seller").value = item.seller;
  $("#supplierEmail").value = item.supplierEmail || "";
  $("#supplierPhone").value = item.supplierPhone || "";
  $("#quantity").value = 0;
  $("#cost").value = item.cost;
  $("#price").value = item.price;
  $("#reorder").value = item.reorder;
  $("#formMode").textContent = "Updating stock";
  setClinicalFieldsVisible(Boolean(catalogItem));
  renderBarcodeLabelPreview();
  selectedMedicineId = item.id;
  setView("capture");
}

function exportCsv() {
  if (!canDownloadInventoryReport()) {
    showToast("Your staff role cannot download the inventory report.");
    return;
  }
  const medicineRows = state.medicines.map((item) => ({
    type: "inventory",
    name: item.name,
    function: item.function,
    recommendedDose: item.dose,
    sideEffects: item.sideEffects,
    otherNotes: item.otherNotes,
    barcode: item.barcode,
    seller: item.seller,
    supplierEmail: item.supplierEmail,
    supplierPhone: item.supplierPhone,
    quantityReceived: item.quantity,
    quantitySold: getSoldQuantity(item),
    left: item.left,
    cost: item.cost,
    price: item.price,
    gain: "",
    employee: "",
    doctorReport: "",
    expiry: item.expiry || "",
    alarm: `${plainAlarmText(item)}; ${plainExpiryText(item)}`
  }));
  const saleRows = state.sales.map((sale) => ({
    type: "sale",
    name: sale.medicineName,
    function: "",
    recommendedDose: "",
    sideEffects: "",
    otherNotes: "",
    barcode: sale.barcode,
    seller: "",
    supplierEmail: "",
    supplierPhone: "",
    quantityReceived: "",
    quantitySold: sale.quantity,
    left: "",
    cost: sale.unitCost,
    price: sale.unitPrice,
    gain: sale.gain,
    employee: sale.employee,
    doctorReport: sale.doctorReport || "",
    expiry: sale.soldAt,
    alarm: ""
  }));
  const rows = [...medicineRows, ...saleRows];
  const headers = Object.keys(rows[0] || {});
  const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(","))].join("\n");
  downloadFile(csv, `medholic-inventory-report-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
  showToast("Inventory report downloaded.");
}

function stockAlarmLevel(item) {
  if (Number(item.left || 0) <= 0) return "critical";
  if (Number(item.left || 0) <= Math.max(2, Math.floor(Number(item.reorder || 0) / 2))) return "critical";
  if (Number(item.left || 0) <= Number(item.reorder || 0)) return "low";
  return "ok";
}

function expiryAlarmLevel(item) {
  if (!item.expiry) return "ok";
  const days = daysUntil(item.expiry);
  if (days < 0) return "expired";
  if (days <= 90) return "soon";
  return "ok";
}

function stockBadge(item) {
  const level = stockAlarmLevel(item);
  return `<span class="stock-pill ${level}">${Number(item.left || 0).toLocaleString()}</span>`;
}

function expiryBadge(item) {
  if (!item.expiry) return `<span class="stock-pill">Not set</span>`;
  const level = expiryAlarmLevel(item);
  return `<span class="stock-pill ${level}">${escapeHtml(item.expiry)}</span>`;
}

function alarmText(item) {
  return `<span class="alarm-text ${stockAlarmLevel(item)}">${escapeHtml(plainAlarmText(item))}</span><br><span class="alarm-text ${expiryAlarmLevel(item)}">${escapeHtml(plainExpiryText(item))}</span>`;
}

function plainAlarmText(item) {
  const level = stockAlarmLevel(item);
  if (level === "critical") return "RED: critical stock";
  if (level === "low") return "Low stock";
  return "Stock OK";
}

function plainExpiryText(item) {
  const level = expiryAlarmLevel(item);
  if (level === "expired") return "RED: expired";
  if (level === "soon") return `RED: expires in ${daysUntil(item.expiry)} day(s)`;
  return item.expiry ? "Expiry OK" : "No expiry set";
}

function alarmRank(item) {
  const stock = stockAlarmLevel(item);
  const expiry = expiryAlarmLevel(item);
  if (stock === "critical" || expiry === "expired") return 3;
  if (stock === "low" || expiry === "soon") return 2;
  return 1;
}

function getSoldQuantity(item) {
  return state.sales
    .filter((sale) => sale.barcode === item.barcode)
    .reduce((sum, sale) => sum + Number(sale.quantity || 0), 0);
}

function getSuppliers() {
  const suppliers = new Map();
  state.medicines.forEach((item) => {
    const name = (item.seller || "").trim();
    if (!name) return;
    const key = name.toLowerCase();
    const existing = suppliers.get(key) || { name, email: "", phone: "" };
    suppliers.set(key, {
      name: existing.name,
      email: item.supplierEmail || existing.email,
      phone: item.supplierPhone || existing.phone
    });
  });
  return [...suppliers.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function isControlledMedicine(item) {
  const catalog = medicineCatalog.find((entry) => entry.name === item?.name);
  return Boolean(item?.controlled || catalog?.controlled || /controlled|opioid|tramadol|codeine|morphine|pethidine/i.test(item?.name || ""));
}

function setDoctorReportRequired(item) {
  const required = Boolean(item && isControlledMedicine(item));
  $("#doctorReportLabel").classList.toggle("hidden", !required);
  $("#doctorReport").required = required;
  if (!required) $("#doctorReport").value = "";
}

function generateUniqueStockCode() {
  let code = "";
  do {
    const datePart = new Date().toISOString().slice(2, 10).replaceAll("-", "");
    const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
    code = `MED-${datePart}-${randomPart}`;
  } while (state.medicines.some((item) => item.barcode === code));
  return code;
}

const code128Patterns = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
];

function sanitizeBarcodeValue(value) {
  return String(value || "")
    .trim()
    .replace(/[^\x20-\x7E]/g, "")
    .slice(0, 48);
}

function getBarcodeMedicationName() {
  const selected = $("#medicineSelect").value;
  if (selected === "Other / custom medication") return $("#medicineName").value.trim() || "Custom medication";
  return selected || $("#medicineName").value.trim() || "Medication";
}

function renderCode128Svg(value, height = 78) {
  const code = sanitizeBarcodeValue(value);
  if (!code) return "";
  const values = [...code].map((char) => char.charCodeAt(0) - 32);
  const checksum = (104 + values.reduce((total, item, index) => total + item * (index + 1), 0)) % 103;
  const sequence = [104, ...values, checksum, 106];
  const moduleWidth = 2;
  const quietZone = 18;
  let x = quietZone;
  const bars = [];

  sequence.forEach((item) => {
    const pattern = code128Patterns[item];
    [...pattern].forEach((widthText, index) => {
      const width = Number(widthText) * moduleWidth;
      if (index % 2 === 0) bars.push(`<rect x="${x}" y="0" width="${width}" height="${height}" fill="#0f172a"></rect>`);
      x += width;
    });
  });

  const svgWidth = x + quietZone;
  return `<svg role="img" aria-label="Barcode ${escapeHtml(code)}" viewBox="0 0 ${svgWidth} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">${bars.join("")}</svg>`;
}

function renderBarcodeLabelPreview() {
  const preview = $("#barcodeLabelPreview");
  if (!preview) return;
  const code = sanitizeBarcodeValue($("#barcode").value);
  if (!code) {
    preview.innerHTML = `<span class="empty">Generate or type a stock code to preview the printable barcode label.</span>`;
    return;
  }

  preview.innerHTML = `
    <div class="barcode-label-card">
      <strong>Medholic Pharmacy</strong>
      <span>${escapeHtml(shortText(getBarcodeMedicationName(), 38))}</span>
      <div class="barcode-svg-wrap">${renderCode128Svg(code)}</div>
      <code>${escapeHtml(code)}</code>
    </div>
  `;
}

function printBarcodeLabel() {
  const code = sanitizeBarcodeValue($("#barcode").value);
  if (!code) {
    showToast("Generate or type a stock code first.");
    $("#barcode").focus();
    return;
  }

  renderBarcodeLabelPreview();
  const medicineName = getBarcodeMedicationName();
  const barcodeSvg = renderCode128Svg(code, 90);
  const labelWindow = window.open("", "_blank", "width=460,height=560");
  if (!labelWindow) {
    showToast("Allow pop-ups so the barcode label can print.");
    return;
  }

  labelWindow.document.write(`<!doctype html>
    <html>
      <head>
        <title>Print ${escapeHtml(code)}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 24px; font-family: Arial, sans-serif; color: #0f172a; background: #ffffff; }
          .sheet { display: grid; gap: 14px; justify-items: start; }
          .label { width: 320px; min-height: 170px; border: 1px solid #0f172a; border-radius: 8px; padding: 12px; text-align: center; page-break-inside: avoid; }
          .brand { font-size: 18px; font-weight: 800; color: #087f8c; margin-bottom: 4px; }
          .name { min-height: 34px; font-size: 13px; font-weight: 700; line-height: 1.25; margin-bottom: 8px; }
          svg { width: 100%; height: 76px; display: block; margin: 0 auto 8px; }
          code { display: block; font-size: 13px; font-weight: 800; letter-spacing: 1px; }
          .note { max-width: 320px; font-size: 12px; color: #475569; }
          @media print {
            body { padding: 0; }
            .note { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="label">
            <div class="brand">Medholic Pharmacy</div>
            <div class="name">${escapeHtml(medicineName)}</div>
            ${barcodeSvg}
            <code>${escapeHtml(code)}</code>
          </div>
          <p class="note">Print this label, cut it out, and stick it on the medication pack, shelf, or storage bin.</p>
        </div>
      </body>
    </html>`);
  labelWindow.document.close();
  labelWindow.focus();
  window.setTimeout(() => labelWindow.print(), 250);
}

function setClinicalFieldsVisible(isVisible) {
  document.querySelectorAll(".clinical-field").forEach((field) => field.classList.toggle("hidden", !isVisible));
  $("#medicineFunction").required = isVisible;
  $("#dose").required = isVisible;
  $("#sideEffects").required = isVisible;
}

function supplierActions(item, fullText = false) {
  const subject = encodeURIComponent(`Order request for ${item.name}`);
  const body = encodeURIComponent(`Hello,\n\nPlease send preorder/order details for:\n\nMedication: ${item.name}\nBarcode: ${item.barcode}\nCurrent stock left: ${item.left}\nReorder level: ${item.reorder}\n\nThank you.`);
  const emailLink = item.supplierEmail
    ? `<a class="${fullText ? "order-button" : "mini-action"}" title="Email supplier" href="mailto:${encodeURIComponent(item.supplierEmail)}?subject=${subject}&body=${body}">${fullText ? "Email supplier" : "Email"}</a>`
    : "";
  const phoneLink = item.supplierPhone
    ? `<a class="${fullText ? "order-button" : "mini-action"}" title="Call supplier" href="tel:${encodeURIComponent(item.supplierPhone)}">${fullText ? "Call supplier" : "Call"}</a>`
    : "";

  return emailLink || phoneLink
    ? `${emailLink}${phoneLink}`
    : `<span class="${fullText ? "empty" : "muted"}">No order contact</span>`;
}

function downloadReorderReport() {
  if (!canDownloadInventoryReport()) {
    showToast("Your staff role cannot download the reorder report.");
    return;
  }
  const items = state.medicines
    .filter((item) => stockAlarmLevel(item) !== "ok")
    .sort((a, b) => (Number(a.left || 0) - Number(a.reorder || 0)) - (Number(b.left || 0) - Number(b.reorder || 0)));
  const headers = ["name", "stockCodeOrBarcode", "supplier", "supplierEmail", "supplierPhone", "quantityLeft", "reorderLevel", "quantityNeeded", "expiryDate", "status"];
  const rows = items.map((item) => ({
    name: item.name,
    stockCodeOrBarcode: item.barcode,
    supplier: item.seller,
    supplierEmail: item.supplierEmail,
    supplierPhone: item.supplierPhone,
    quantityLeft: item.left,
    reorderLevel: item.reorder,
    quantityNeeded: Math.max(0, Number(item.reorder || 0) - Number(item.left || 0)),
    expiryDate: item.expiry,
    status: alarmText(item)
  }));
  const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(","))].join("\n");
  downloadFile(csv, `medholic-reorder-report-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
  showToast("Reorder report downloaded.");
}

function groupReorderItemsBySupplier() {
  const groups = new Map();
  state.medicines
    .filter((item) => stockAlarmLevel(item) !== "ok")
    .sort((a, b) => (a.seller || "").localeCompare(b.seller || "") || a.name.localeCompare(b.name))
    .forEach((item) => {
      const key = (item.seller || "Supplier not set").trim() || "Supplier not set";
      const existing = groups.get(key) || {
        supplier: key,
        email: item.supplierEmail || "",
        phone: item.supplierPhone || "",
        items: []
      };
      existing.email = existing.email || item.supplierEmail || "";
      existing.phone = existing.phone || item.supplierPhone || "";
      existing.items.push(item);
      groups.set(key, existing);
    });
  return [...groups.values()];
}

function downloadPurchaseOrder() {
  if (!canDownloadInventoryReport()) {
    showToast("Your staff role cannot download purchase orders.");
    return;
  }
  const supplierGroups = groupReorderItemsBySupplier();
  if (!supplierGroups.length) {
    showToast("No low-stock items need ordering.");
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  const lines = [
    "MEDHOLIC PHARMACY",
    "Purchase Order / Preorder Request",
    `Date: ${today}`,
    "",
    "Please supply the following low-stock items.",
    ""
  ];

  supplierGroups.forEach((group, index) => {
    lines.push(`${index + 1}. Supplier: ${group.supplier}`);
    lines.push(`   Email: ${group.email || "Not saved"}`);
    lines.push(`   Phone: ${group.phone || "Not saved"}`);
    lines.push("   Items:");
    group.items.forEach((item) => {
      const needed = Math.max(0, Number(item.reorder || 0) - Number(item.left || 0));
      lines.push(`   - ${item.name}`);
      lines.push(`     Stock code/barcode: ${item.barcode}`);
      lines.push(`     Current stock left: ${Number(item.left || 0).toLocaleString()}`);
      lines.push(`     Reorder level: ${Number(item.reorder || 0).toLocaleString()}`);
      lines.push(`     Quantity needed: ${needed.toLocaleString()}`);
      lines.push(`     Expiry date: ${item.expiry || "Not set"}`);
    });
    lines.push("");
  });

  lines.push("Prepared from Medholic Pharmacy inventory system.");
  downloadFile(lines.join("\n"), `medholic-purchase-order-${today}.txt`, "text/plain");
  showToast("Purchase order downloaded.");
}

function getExpectedCash() {
  return state.sales
    .filter((sale) => (sale.paymentMethod || "Cash") === "Cash")
    .reduce((sum, sale) => sum + Number(sale.total || 0), 0);
}

function getSecurityAlerts() {
  const alerts = [];
  const latestCash = state.cashChecks.slice().sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt))[0];
  if (latestCash && Math.abs(latestCash.difference) > 5) {
    alerts.push({
      title: "Cash variance",
      body: `${money(Math.abs(latestCash.difference))} difference found in latest cash drawer check.`
    });
  }

  const missingStock = state.stockAdjustments.filter((item) => Number(item.variance || 0) < 0);
  if (missingStock.length) {
    alerts.push({
      title: "Missing product variance",
      body: `${missingStock.length} stock check(s) found fewer products than expected.`
    });
  }

  const riskyLogs = state.auditLogs.filter((log) => log.risk === "High");
  if (riskyLogs.length) {
    alerts.push({
      title: "High-risk audit events",
      body: `${riskyLogs.length} high-risk action(s) recorded in audit trail.`
    });
  }

  return alerts;
}

function logAction(action, details, risk = "Low") {
  state.auditLogs.unshift({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    user: currentUser?.name || "System",
    role: currentUser?.role || "System",
    action,
    details: String(details || "").trim(),
    risk
  });
  state.auditLogs = state.auditLogs.slice(0, 300);
  saveState();
}

function renderAuth() {
  if (enforcePortalBoundary()) return;
  const isLoggedIn = Boolean(currentUser);
  $("#loginScreen").classList.toggle("hidden", isLoggedIn);
  document.querySelector(".app-shell").classList.toggle("locked", !isLoggedIn);
  $("#currentUserLabel").textContent = isLoggedIn ? `${currentUser.name} - ${currentUser.role}` : "Signed out";
  updateSyncStatus();
  applyRolePermissions();
  renderTopbarControls();
}

function renderTopbarControls() {
  const controls = $("#topbarControls");
  const toggle = $("#topbarControlsToggle");
  if (!controls || !toggle) return;
  controls.classList.toggle("collapsed", !expandedSections.topbarControls);
  toggle.textContent = expandedSections.topbarControls ? "Hide Controls" : "Show Controls";
  toggle.setAttribute("aria-expanded", String(expandedSections.topbarControls));
}

function normalizedRole() {
  return currentUser?.role || "Cashier";
}

function allowedViews() {
  return roleViews[normalizedRole()] || roleViews.Cashier;
}

function canView(viewId) {
  if (!currentUser) return false;
  return allowedViews().includes(viewId);
}

function firstAllowedView() {
  return allowedViews()[0] || "dashboard";
}

function canManageSensitiveActions() {
  return normalizedRole() === "Manager";
}

function canDownloadInventoryReport() {
  return canManageSensitiveActions();
}

function preferredPortalPath() {
  if (location.protocol === "file:" || !currentUser) return "";
  return canManageSensitiveActions() ? "/app" : "/staff";
}

function enforcePortalBoundary() {
  const target = preferredPortalPath();
  if (!target || !["/app", "/staff"].includes(portalPath) || portalPath === target) return false;
  location.assign(target);
  return true;
}

function applyRolePermissions() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("hidden", Boolean(currentUser) && !canView(button.dataset.view));
  });

  $("#exportCsv").classList.toggle("hidden", Boolean(currentUser) && !canDownloadInventoryReport());
  $("#downloadSampleData").classList.toggle("hidden", Boolean(currentUser) && !canManageSensitiveActions());
  $("#resetDemo").classList.toggle("hidden", Boolean(currentUser) && !canManageSensitiveActions());
  $("#exportAudit").classList.toggle("hidden", Boolean(currentUser) && !canManageSensitiveActions());
  $("#downloadFullBackup").classList.toggle("hidden", Boolean(currentUser) && !canManageSensitiveActions());

  const activeView = document.querySelector(".view.active")?.id;
  if (currentUser && activeView && !canView(activeView)) setView(firstAllowedView());
}

function exportAuditCsv() {
  if (!canManageSensitiveActions()) {
    showToast("Only a manager can download the security report.");
    return;
  }
  const rows = state.auditLogs.map((log) => ({
    time: log.at,
    user: log.user,
    role: log.role,
    action: log.action,
    details: log.details,
    risk: log.risk
  }));
  const headers = Object.keys(rows[0] || { time: "", user: "", role: "", action: "", details: "", risk: "" });
  const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(","))].join("\n");
  downloadFile(csv, `medholic-security-report-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv");
  showToast("Security report downloaded.");
}

function addMissingSampleData() {
  const samples = structuredClone(seedState);
  const existingBarcodes = new Set(state.medicines.map((item) => item.barcode));
  const existingEmployees = new Set(state.employees.map((item) => item.name.toLowerCase()));
  const existingSales = new Set(state.sales.map((sale) => `${sale.barcode}-${sale.quantity}-${sale.employee}-${sale.total}`));

  samples.medicines.forEach((item) => {
    if (!existingBarcodes.has(item.barcode)) {
      state.medicines.push({ ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
      existingBarcodes.add(item.barcode);
    }
  });

  samples.employees.forEach((employee) => {
    if (!existingEmployees.has(employee.name.toLowerCase())) {
      state.employees.push({ ...employee, id: crypto.randomUUID() });
      existingEmployees.add(employee.name.toLowerCase());
    }
  });

  samples.sales.forEach((sale) => {
    const key = `${sale.barcode}-${sale.quantity}-${sale.employee}-${sale.total}`;
    if (!existingSales.has(key)) {
      state.sales.push({ ...sale, id: crypto.randomUUID(), soldAt: new Date().toISOString() });
      existingSales.add(key);
    }
  });
}

function downloadSampleData() {
  if (!canManageSensitiveActions()) {
    showToast("Only a manager can download sample data.");
    return;
  }
  const sample = JSON.stringify(seedState, null, 2);
  downloadFile(sample, `medholic-sample-data-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
  showToast("Sample data downloaded.");
}

async function downloadFullBackup() {
  if (!canManageSensitiveActions()) {
    showToast("Only a manager can download full backups.");
    return;
  }
  let backupState = state;
  if (location.protocol !== "file:" && sessionToken) {
    try {
      const response = await fetch(apiStateUrl, { cache: "no-store", headers: authHeaders() });
      if (response.ok) backupState = await response.json();
    } catch {
      backupState = state;
    }
  }
  downloadFile(JSON.stringify(backupState, null, 2), `medholic-full-backup-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
  showToast("Full backup downloaded.");
}

async function refreshBackupHistory() {
  if (!canManageSensitiveActions()) {
    showToast("Only a manager can view backup history.");
    return;
  }
  if (location.protocol === "file:" || !sessionToken) {
    backupHistory = [];
    renderBackupHistory();
    return;
  }
  try {
    const response = await fetch(apiBackupsUrl, { cache: "no-store", headers: authHeaders() });
    if (!response.ok) throw new Error("Unable to load backup history");
    const data = await response.json();
    backupHistory = data.backups || [];
    renderBackupHistory();
  } catch {
    showToast("Could not load backup history.");
  }
}

async function downloadServerBackup(backupId) {
  if (!canManageSensitiveActions()) {
    showToast("Only a manager can download old backups.");
    return;
  }
  try {
    const response = await fetch(`${apiBackupsUrl}/${encodeURIComponent(backupId)}`, { cache: "no-store", headers: authHeaders() });
    if (!response.ok) throw new Error("Backup download failed");
    const backupState = await response.json();
    downloadFile(JSON.stringify(backupState, null, 2), `medholic-restored-backup-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
    showToast("Backup downloaded.");
  } catch {
    showToast("Could not download that backup.");
  }
}

async function restoreServerBackup(backupId) {
  if (!canManageSensitiveActions()) {
    showToast("Only a manager can restore backups.");
    return;
  }
  const confirmation = window.prompt("Restoring replaces current shared records. Type RESTORE to continue.");
  if (confirmation !== "RESTORE") {
    showToast("Restore cancelled.");
    return;
  }
  try {
    const response = await fetch(`${apiBackupsUrl}/${encodeURIComponent(backupId)}/restore`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ confirm: "RESTORE" })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Restore failed");
    state = normalizeState(data.state || {});
    localStorage.setItem(storageKey, JSON.stringify(state));
    selectedMedicineId = null;
    backupHistory = [];
    await refreshBackupHistory();
    showToast("Backup restored. Current data was backed up first.");
    renderAll();
  } catch (error) {
    showToast(error.message || "Could not restore backup.");
  }
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.remove();
  }, 100);
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
}

function daysUntil(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateString);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - today) / 86400000);
}

function shortText(value, length) {
  const text = String(value || "");
  return text.length > length ? `${text.slice(0, length - 3)}...` : text;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("click", (event) => {
  const navButton = event.target.closest("[data-view]");
  if (navButton) setView(navButton.dataset.view);

  const jumpButton = event.target.closest("[data-view-jump]");
  if (jumpButton) setView(jumpButton.dataset.viewJump);

  const toggleButton = event.target.closest("[data-toggle-section]");
  if (toggleButton) {
    const key = toggleButton.dataset.toggleSection;
    expandedSections[key] = !expandedSections[key];
    renderAll();
    if (key === "backupHistory" && expandedSections.backupHistory) refreshBackupHistory();
    return;
  }

  const topbarToggle = event.target.closest("#topbarControlsToggle");
  if (topbarToggle) {
    expandedSections.topbarControls = !expandedSections.topbarControls;
    renderTopbarControls();
    return;
  }

  const downloadBackupButton = event.target.closest("[data-download-backup]");
  if (downloadBackupButton) {
    downloadServerBackup(downloadBackupButton.dataset.downloadBackup);
    return;
  }

  const restoreBackupButton = event.target.closest("[data-restore-backup]");
  if (restoreBackupButton) {
    restoreServerBackup(restoreBackupButton.dataset.restoreBackup);
    return;
  }

  const medicineOpener = event.target.closest("[data-open-medicine]");
  if (medicineOpener && !event.target.closest("[data-edit]") && !event.target.closest("[data-delete]")) {
    selectedMedicineId = medicineOpener.dataset.openMedicine;
    setView("inventory");
    renderInventory();
    document.querySelector("#medicineDetail")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const editButton = event.target.closest("[data-edit]");
  if (editButton) {
    const item = state.medicines.find((medicine) => medicine.id === editButton.dataset.edit);
    if (item) fillMedicineForm(item);
  }

  const deleteButton = event.target.closest("[data-delete]");
  if (deleteButton) {
    if (!canManageSensitiveActions()) {
      showToast("Only a manager can delete inventory records.");
      return;
    }
    const item = state.medicines.find((medicine) => medicine.id === deleteButton.dataset.delete);
    state.medicines = state.medicines.filter((medicine) => medicine.id !== deleteButton.dataset.delete);
    if (selectedMedicineId === deleteButton.dataset.delete) selectedMedicineId = null;
    logAction("Medication deleted", `${item?.name || "Unknown medication"} was removed from inventory.`, "High");
    showToast("Medication removed.");
    renderAll();
  }

  const removeEmployeeButton = event.target.closest("[data-remove-employee]");
  if (removeEmployeeButton) {
    if (!canManageSensitiveActions()) {
      showToast("Only a manager can remove employees.");
      return;
    }
    const employee = state.employees.find((item) => item.id === removeEmployeeButton.dataset.removeEmployee);
    state.employees = state.employees.filter((employee) => employee.id !== removeEmployeeButton.dataset.removeEmployee);
    logAction("Employee removed", `${employee?.name || "Unknown employee"} removed from roster.`, "Medium");
    showToast("Employee removed.");
    renderAll();
  }
});

function on(selector, eventName, handler) {
  const element = $(selector);
  if (element) element.addEventListener(eventName, handler);
}

on("#loginForm", "submit", handleLoginSubmit);
on("#showPassword", "click", () => {
  const password = $("#loginPassword");
  const isHidden = password.type === "password";
  password.type = isHidden ? "text" : "password";
  $("#showPassword").classList.toggle("visible", isHidden);
  $("#showPassword").setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  $("#showPassword").setAttribute("title", isHidden ? "Hide password" : "Show password");
});
$("#medicineForm").addEventListener("submit", handleMedicineSubmit);
$("#saleForm").addEventListener("submit", handleSaleSubmit);
$("#employeeForm").addEventListener("submit", handleEmployeeSubmit);
$("#cashCheckForm").addEventListener("submit", handleCashCheckSubmit);
$("#stockAuditForm").addEventListener("submit", handleStockAuditSubmit);
$("#medicineSelect").addEventListener("change", handleMedicineSelect);
$("#medicineName").addEventListener("input", renderBarcodeLabelPreview);
$("#saleMedicineSelect").addEventListener("change", handleSaleMedicineSelect);
$("#seller").addEventListener("change", handleSupplierSelect);
$("#seller").addEventListener("blur", handleSupplierSelect);
$("#inventorySearch").addEventListener("input", renderInventory);
$("#barcode").addEventListener("input", renderBarcodeLabelPreview);
$("#saleBarcode").addEventListener("input", updateSalePreview);
$("#saleQuantity").addEventListener("input", updateSalePreview);
$("#scanToggle").addEventListener("click", () => (scannerStream ? stopScanner() : startScanner()));
$("#saleScanToggle").addEventListener("click", () => (scannerStream ? stopScanner() : startScanner("sales")));
$("#generateStockCode").addEventListener("click", handleGenerateStockCode);
$("#refreshBarcodeLabel").addEventListener("click", renderBarcodeLabelPreview);
$("#printBarcodeLabel").addEventListener("click", printBarcodeLabel);
$("#exportCsv").addEventListener("click", exportCsv);
$("#downloadPurchaseOrder").addEventListener("click", downloadPurchaseOrder);
$("#downloadReorderReport").addEventListener("click", downloadReorderReport);
$("#exportAudit").addEventListener("click", exportAuditCsv);
$("#downloadSampleData").addEventListener("click", downloadSampleData);
$("#downloadFullBackup").addEventListener("click", downloadFullBackup);
$("#refreshBackups").addEventListener("click", refreshBackupHistory);
$("#signOut").addEventListener("click", handleSignOut);
$("#forgotPassword").addEventListener("click", () => {
  setLoginHelp("Contact the Medholic Pharmacy administrator to reset your password.");
});
$("#resetDemo").addEventListener("click", () => {
  if (!canManageSensitiveActions()) {
    showToast("Only a manager can add sample data.");
    return;
  }
  const before = {
    medicines: state.medicines.length,
    sales: state.sales.length,
    employees: state.employees.length
  };
  addMissingSampleData();
  const added = {
    medicines: state.medicines.length - before.medicines,
    sales: state.sales.length - before.sales,
    employees: state.employees.length - before.employees
  };
  logAction("Sample data added", `Added ${added.medicines} medicine(s), ${added.sales} sale(s), and ${added.employees} employee(s). Existing live data was kept.`, "Low");
  showToast("Sample data added without wiping your records.");
  renderAll();
});

setClinicalFieldsVisible(false);
renderAll();
hydrateFromServer();
checkLiveStatus();
window.setInterval(checkLiveStatus, 30000);
