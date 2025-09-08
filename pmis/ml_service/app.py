# ml_service/app.py
import io
import os
import spacy
import pdfplumber
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app and spaCy model
app = Flask(__name__)
CORS(app) # Allow requests from your Node.js backend
nlp = spacy.load("en_core_web_sm")

# A predefined list of skills to look for. This is a simple but effective approach.
# In a more advanced system, this could be a large database of skills.
SKILL_KEYWORDS = [
    'python', 'java', 'c++', 'javascript', 'react', 'node.js', 'mongodb',
    'sql', 'mysql', 'postgresql', 'aws', 'docker', 'git', 'linux',
    'data analysis', 'machine learning', 'tensorflow', 'pytorch', 'scikit-learn',
    'autocad', 'electrical engineering', 'circuits', 'ms excel', 'typing',
    'bookkeeping', 'tally', 'finance', 'accounting', 'patient care', 'communication','winner'
]

@app.route('/extract-skills', methods=['POST'])
def extract_skills_from_resume():
    # 1. Check if a file was uploaded
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    file = request.files['resume']
    
    # 2. Read the text from the PDF file
    try:
        with pdfplumber.open(io.BytesIO(file.read())) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""
    except Exception as e:
        return jsonify({"error": f"Failed to parse PDF: {str(e)}"}), 500

    # 3. Use spaCy to find skill matches
    doc = nlp(text.lower())
    found_skills = set()

    # Simple but effective: iterate through our known skills and check for their presence.
    for skill in SKILL_KEYWORDS:
        if skill in text.lower():
            found_skills.add(skill)

    # More advanced: check for noun chunks and entities (can be noisy)
    for chunk in doc.noun_chunks:
        if chunk.text in SKILL_KEYWORDS:
            found_skills.add(chunk.text)

    return jsonify({"skills": list(found_skills)})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    # Run the ML service on a different port (e.g., 5001)
    app.run(port=port, debug=True)
