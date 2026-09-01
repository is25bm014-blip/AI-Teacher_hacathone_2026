# AI Teacher Studio

AI Teacher Studio is an adaptive AI education prototype.

The system follows:

Understand
→ Plan
→ Explain
→ Demonstrate
→ Question
→ Evaluate
→ Adapt
→ Continue

## Features

- Learner profile
- Beginner / Intermediate / Advanced
- Learning objectives
- Teaching style
- Multiple languages
- PDF processing
- DOCX processing
- PPTX processing
- TXT/Markdown processing
- TF-IDF based RAG retrieval
- AI lesson planning
- Personalized explanation
- Interactive questions
- Student answer evaluation
- Misconception detection
- Adaptive re-explanation
- Final assessment
- Learning score
- Strong areas
- Weak areas
- Next-step recommendation
- SQLite learning history
- Browser-based AI teacher voice
- Animated AI teacher interface

## Run

Create virtual environment:

py -m venv .venv

Install:

.venv\Scripts\python.exe -m pip install -r requirements.txt

Create .env:

OPENAI_API_KEY=YOUR_KEY

Run:

.venv\Scripts\python.exe app.py

Open:

http://127.0.0.1:5000

## Project architecture

Browser
    |
    | JavaScript fetch()
    v
Flask app.py
    |
    +---- SQLite
    |
    +---- Document extraction
    |
    +---- RAG retrieval
    |
    +---- OpenAI
    |
    +---- Adaptive evaluator
    |
    +---- Progress tracking

## Demo flow

1. Create learner.
2. Upload textbook/PDF.
3. Enter topic.
4. Select available time.
5. Generate lesson.
6. AI teacher explains.
7. Student answers checkpoint.
8. AI evaluates answer.
9. AI detects misconception.
10. AI changes teaching approach.
11. Final assessment.
12. Learning report.
13. Recommended next learning step.

## Important

The application can run without an API key in fallback/demo mode.

For the full AI experience, configure OPENAI_API_KEY.

The browser speech system provides voice output. A production deployment can replace or extend this with a dedicated avatar/video provider.

## Third-party technologies

- Python
- Flask
- SQLite
- PyMuPDF
- python-docx
- python-pptx
- scikit-learn
- OpenAI API
- Browser Speech Synthesis API
