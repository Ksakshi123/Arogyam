# 🧠 Arogyam AI/ML Microservice

Dedicated Machine Learning and NLP microservice for personalized Ayurvedic Prakriti classification, content-based diet recommendation, and conversational wellness intent parsing.

---

## 📁 Directory Structure

```
aiml/
├── dosha_predictor/
│   ├── sample_data.csv       # Clinical training observations (frame, skin, sleep, stress -> dosha)
│   ├── train.py              # Scikit-learn Pipeline training script (OneHot + RandomForest)
│   ├── dosha_model.py        # Model inference wrapper with fallback heuristics
│   └── __init__.py
├── diet_recommender/
│   ├── recommender.py        # Multi-attribute ranking engine (Allergens, Dosha affinity, Rasa/Guna)
│   └── __init__.py
├── chatbot/
│   ├── llm_service.py        # Intent parser & LLM adapter (Gemini / OpenAI / Transformers)
│   └── __init__.py
├── main.py                   # FastAPI microservice running on port 8001
├── requirements.txt          # Python ML libraries (scikit-learn, pandas, numpy, etc.)
└── README.md
```

---

## 🚀 How to Run the AI/ML Microservice

### Step 1: Open terminal and navigate to `aiml/`
```bash
cd aiml
```

### Step 2: Create and activate a virtual environment
**On Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install ML dependencies
```bash
pip install -r requirements.txt
```

### Step 4 (Optional): Train the Dosha Classifier
Train the Random Forest model on the provided clinical dataset:
```bash
python dosha_predictor/train.py
```
*(This will generate `dosha_predictor/dosha_model.joblib`)*

### Step 5: Start the AI/ML API Server
```bash
uvicorn main:app --reload --port 8001
```

### Step 6: Interactive Documentation
- **Swagger Docs:** [http://localhost:8001/docs](http://localhost:8001/docs)
- **Health Check:** [http://localhost:8001/health](http://localhost:8001/health)
