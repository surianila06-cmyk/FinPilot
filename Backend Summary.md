# FinPilot — Backend Summary (MVP)

## Project Overview

**FinPilot** is an **Agentic AI Financial Copilot** that analyzes user financial documents (currently payslips) and generates personalized financial insights, scores, and recommendations using AI agents and financial tools.

The backend handles:

1. Financial document upload
2. AI-based information extraction
3. Financial health evaluation
4. Agent-based recommendation generation
5. Financial planning tools

\---

# Backend Architecture

```
User
 |
 | Upload Payslip PDF
 ↓
FastAPI Backend
 |
 ↓
PDF Processing
 |
 ↓
Groq LLM Extraction
 |
 ↓
Financial Profile Generation
 |
 ↓
Financial Health Score
 |
 ↓
Planner Agent
 |
 ├── Budget Tool
 ├── Loan Tool
 ├── Gold Investment Tool
 └── Goal Planning Tool
 |
 ↓
Personalized Recommendations
```

\---

# Tech Stack Used

## Backend Framework

### FastAPI

Used for:

* Creating REST APIs
* Handling file uploads
* Connecting frontend with AI services
* Serving financial recommendations

\---

## Programming Language

### Python

Used for:

* Backend logic
* AI integration
* Data processing
* Financial calculations

\---

# AI Services

## Groq API

Main AI engine.

Used for:

### 1\. Financial Document Extraction

Input:

```
Payslip PDF
```

Processing:

```
PDF text
      |
      ↓
Groq LLM
      |
      ↓
Structured financial profile
```

Extracts:

* Monthly income
* Expenses
* Savings
* Loans
* EMI
* Insurance

\---

### 2\. AI Financial Advisor

Generates:

* Financial suggestions
* Spending advice
* Investment recommendations
* Personalized guidance

Model:

* Llama model through Groq API

\---

# PDF Processing

## PyPDF

Used for:

* Reading uploaded PDF files
* Extracting text from payslips

Flow:

```
PDF Upload
    |
    ↓
PyPDF extraction
    |
    ↓
Groq analysis
```

\---

# Backend Modules

## 1\. Routes (API Layer)

Location:

```
app/routes/
```

### upload.py

Handles:

* Payslip upload
* PDF processing request

Frontend usage:

```
POST /upload
```

Input:

```
PDF file
```

Output:

```
Financial profile
Financial score
```

\---

### profile.py

Handles:

* User financial profile retrieval

Returns:

```json
{
"income":70000,
"expenses":8000,
"savings":0,
"loans":0
}
```

\---

### chat.py

Handles:

AI conversation.

Frontend can connect chatbot UI here.

Purpose:

```
User question
       |
       ↓
AI Advisor
       |
       ↓
Response
```

\---

## 2\. Models

Location:

```
app/models/
```

### financial\_profile.py

Defines financial data structure:

Example:

```json
{
"monthly\_income":70000,
"monthly\_expenses":8000,
"monthly\_emi":0,
"insurance":1500
}
```

\---

### chat.py

Defines chatbot request/response models.

\---

# Agent System

Location:

```
app/planner/
```

## Planner Agent

File:

```
planner.py
```

Role:

Acts as the main decision-making agent.

It analyzes the user's financial profile and decides which tools should be used.

Example:

```
Income = high
Savings = low

↓

Planner Agent

↓

Suggest:
Budget optimization
Goal planning
Investment advice
```

\---

# Financial Tools

Location:

```
app/tools/
```

## 1\. Budget Tool

File:

```
budget\_tool.py
```

Purpose:

Analyzes:

* Income
* Expenses
* Saving ratio

Provides:

* Budget suggestions
* Expense optimization

\---

## 2\. Loan Tool

File:

```
loan\_tool.py
```

Purpose:

Analyzes:

* Existing loans
* EMI burden
* Loan affordability

Provides:

* Loan recommendations
* Repayment insights

\---

## 3\. Gold Investment Tool

File:

```
gold\_tool.py
```

Purpose:

Provides gold investment guidance.

Analyzes:

* Available savings
* Investment suitability

\---

## 4\. Goal Planning Tool

File:

```
goal\_tool.py
```

Purpose:

Helps users plan financial goals.

Examples:

* Emergency fund
* Education
* Buying assets

\---

# Financial Health Score

File:

```
services/health\_score.py
```

Generates:

```
Financial Score: 0-100
```

Based on:

* Savings
* Expenses
* Debt
* Insurance coverage

Example:

```json
{
"financial\_score":85
}
```

\---

# AI Services Layer

Location:

```
app/services/
```

## ai\_advisor.py

Handles:

* AI-generated advice
* Connecting planner output with LLM

\---

## groq service

(Current filename still says Gemini)

```
gemini\_service.py
```

Functionally:

* Groq API communication
* LLM requests

\---

# Configuration

Location:

```
app/config/
```

## settings.py

Loads environment variables:

```
.env
 |
 ↓
GROQ\_API\_KEY
```

\---

# Database / Storage

Currently:

No permanent database.

Current MVP uses:

* In-memory processing
* API responses

Future additions:

* Firebase
* PostgreSQL
* MongoDB

\---

# API Flow For Frontend

## 1\. Upload Payslip

Frontend:

```
User selects PDF
```

API:

```
POST /upload
```

Backend:

```
PDF
 ↓
Extract text
 ↓
Groq
 ↓
Financial Profile
 ↓
Score
```

Response:

```json
{
"profile":{
"income":70000,
"expenses":8000
},
"score":100
}
```

\---

## 2\. Dashboard Data

Frontend should display:

### Financial Profile Card

```
Monthly Income
Expenses
Savings
Loans
Insurance
```

### Financial Score

Example:

```
Financial Health
█████████░ 85/100
```

### Recommendations

Cards:

```
Budget Advice
Investment Advice
Loan Advice
Goal Suggestions
```

\---

## 3\. Chatbot

Frontend:

Chat interface

Backend:

```
POST /chat
```

Input:

```json
{
"message":"How can I save more?"
}
```

Output:

```json
{
"response":"Reduce unnecessary expenses..."
}
```

\---

# Services Required for Frontend

Your frontend teammate needs:

## Backend URL

Currently local:

```
http://localhost:8000
```

After deployment:

```
https://finpilot-api.com
```

## Required APIs

|Feature|Endpoint|
|-|-|
|Upload PDF|`/upload`|
|Profile|`/profile`|
|Chat|`/chat`|

\---

# Frontend Features To Build

Priority order:

## Phase 1 (Required Demo)

✅ Login/Register UI (optional)

✅ Upload payslip page

✅ Financial dashboard

✅ Financial score visualization

✅ Recommendation cards

## Phase 2

⭐ AI chatbot

⭐ Goal planner UI

⭐ Investment section

⭐ Loan calculator

\---

# External Services Used

|Service|Purpose|
|-|-|
|FastAPI|Backend API|
|Groq API|LLM intelligence|
|Llama model|AI reasoning|
|PyPDF|PDF extraction|
|Python dotenv|Environment variables|
|Firebase (prepared but not integrated)|Future authentication/storage|

\---

Your frontend teammate mainly needs to build a **dashboard + upload flow + chatbot interface** and connect these three APIs:

```
POST /upload
GET /profile
POST /chat
```

The backend is now at a good hackathon MVP stage.

