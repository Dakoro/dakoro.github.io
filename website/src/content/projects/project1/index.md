---
title: Projet Simplon
summary: RAG application with an arxiv 
repoURL: https://github.com/Dakoro/Projet_Simplon
date: 06/09/2024
tags:
- Qdrant
- FastAPI
- RAG
- LLM
---



# Projet Simplon - Développeur en Intelligence Artificielle 2023-2024

## Project Overview

This repository contains the main validation project for the **AI Developer Certification** (Développeur en Intelligence Artificielle) from Simplon's School IA Microsoft program for the 2023-2024 academic year. This project serves as the capstone assessment for candidates pursuing the RNCP Level 6 professional certification (equivalent to Bachelor's degree level).

## Certification Context

### Program Background
- **Institution**: École IA Microsoft by Simplon
- **Certification Level**: RNCP 37827 - Level 6 (Bac+3/4 equivalent)
- **Duration**: 19 months total (4 months intensive training + 15 months apprenticeship)
- **Recognition**: Recognized by France Compétences
- **Success Rate**: 95.9% overall success rate (48.5% full validation, 47.4% partial validation)
- **Employment Rate**: 71.10% job placement rate

### Target Profile
The AI Developer is primarily an application developer specializing in creating applications that integrate artificial intelligence functionalities such as:
- Chatbots
- Recommendation engines
- Document classification systems
- Prediction models
- Generative AI integrations (ChatGPT, etc.)

## Core Competency Blocks

The certification is structured around **three main competency blocks**:

### Block 1: Data Management and Infrastructure
**Competencies C1-C6:**
- C1. Automate data extraction
- C2. Develop SQL queries for data extraction from databases and big data systems
- C3. Develop data aggregation rules from multiple sources
- C4. [Data processing and preparation]
- C5. Develop APIs for dataset provision
- C6. Organize and conduct technical and regulatory monitoring

### Block 2: AI Model Integration and Deployment
**Competencies C7-C14:**
- C7. Identify pre-existing AI services based on functional requirements
- C8. Configure AI services
- C9. Develop APIs exposing AI models
- C10. Integrate AI model/service APIs into applications
- C11. Monitor AI models using standard and project-specific metrics
- C12. Program automated testing for AI models
- C13. Create continuous delivery pipelines for AI models
- C14. Analyze client application needs integrating AI services

### Block 3: Application Development and Maintenance
**Competencies C15-C21:**
- C15. [Application architecture and design]
- C16. [User interface development]
- C17. Develop technical components and application interfaces
- C18. Automate code testing phases during source versioning
- C19. Create continuous delivery processes for applications
- C20. Monitor AI applications
- C21. Resolve technical incidents

## Technical Requirements

### Environment Setup
```bash
# Virtual environment creation and activation
python -m venv env && source env/bin/activate

# Global environment installation
pip install -r requirements.txt
```

### Important Dependencies
- **Gensim compatibility**: All scripts using Gensim must run with `scipy <= 1.12.0`
- **Execution context**: All make commands executed from project root directory
- **Documentation**: Check `docs/` folder for API and application documentation

### Technology Stack
The program emphasizes languages and tools adapted for:
- Application development
- Data manipulation
- Artificial intelligence implementation
- Integration with pre-existing AI models and services

## Project Structure and Features

### Main Development Areas
1. **Data Pipeline Management**
   - Automated data extraction and processing
   - Multi-source data aggregation
   - Database and big data system integration

2. **AI Model Integration**
   - API development for AI model exposure
   - Integration with existing AI services
   - Model monitoring and testing automation

3. **Application Development**
   - Full-stack application development
   - User interface design and implementation
   - Continuous integration/continuous deployment (CI/CD)

4. **Monitoring and Maintenance**
   - Application performance monitoring
   - Incident resolution procedures
   - Technical documentation and maintenance

### Assessment Methodology
Students are evaluated through:
- **Practical Projects**: Real-world application development
- **Professional Presentation**: 90-minute presentation with live demonstration
- **Technical Documentation**: Comprehensive project portfolio
- **Jury Assessment**: Professional jury evaluation of competencies

## Career Opportunities

### Target Positions
- AI Application Developer
- Machine Learning Engineer
- Data Integration Specialist
- AI Solutions Architect
- Chatbot Developer
- Recommendation System Developer

### Industry Applications
- Financial services (banks, insurance)
- Retail and e-commerce
- Transportation and logistics
- Healthcare technology
- Corporate AI strategy implementation

## Partnership and Innovation

This certification is delivered through a strategic partnership between:
- **Microsoft**: Providing Azure AI certification and cloud infrastructure expertise
- **Simplon**: Delivering inclusive, project-based pedagogy and professional training
- **Industry Partners**: Ensuring curriculum alignment with market needs

### Additional Certifications
Students also receive:
- Microsoft Azure Fundamentals (AZ-900)
- Microsoft Azure AI Fundamentals (AI-900)
- Microsoft Azure Data Scientist Associate (DP-100)

## Conclusion

This project represents the culmination of a comprehensive AI developer training program that bridges the gap between traditional software development and cutting-edge artificial intelligence implementation. It prepares students for the rapidly evolving AI job market while maintaining strong industry connections and practical, hands-on learning approaches.