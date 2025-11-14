# Relief Connect - Emergency Response Platform

A comprehensive disaster response platform with AI-powered assistance for emergency situations.

## Features

### 🤖 AI Emergency Assistant
- **Gemini API Integration**: Powered by Google's Gemini AI for intelligent emergency response
- **Voice Assistance**: 
  - Speech-to-text input for hands-free interaction
  - Text-to-speech responses for accessibility
  - Continuous voice recognition support
- **Smart UI**: Fixed overlapping issues between voice controls and send button
- **Emergency Focus**: Specialized for disaster response and emergency guidance

### 🚨 Core Emergency Features
- Emergency button for immediate alerts
- Live updates and notifications
- Lost and found reporting
- Donation tracking
- Research center for emergency protocols
- Feedback system for continuous improvement

## Setup

### Prerequisites
- Node.js (v16 or higher)
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Gemini API key:
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a `.env` file in the root directory:
     ```
     REACT_APP_GEMINI_API_KEY=your_api_key_here
     ```
   - Or enter it directly in the app when prompted

4. Start the development server:
   ```bash
   npm run dev
   ```

## AI Assistant Usage

1. **Setup**: Enter your Gemini API key when prompted
2. **Voice Input**: Click "Start Voice Input" to speak your questions
3. **Text Input**: Type questions in the text field
4. **Audio Output**: Responses are automatically spoken aloud
5. **Quick Questions**: Use pre-defined emergency questions to get started

## Voice Features

- **Speech Recognition**: Browser-based voice input (Chrome/Edge recommended)
- **Speech Synthesis**: Automatic audio responses for accessibility
- **Visual Indicators**: Real-time status indicators for listening and speaking states
- **Non-overlapping UI**: Separate voice controls prevent interface conflicts

## Browser Compatibility

- **Voice Input**: Chrome, Edge, Safari (limited)
- **Voice Output**: All modern browsers
- **General**: Chrome, Firefox, Safari, Edge

## Contributing

This project is built with React, Vite, and Tailwind CSS. The AI assistant uses Google's Gemini API for natural language processing and emergency response guidance.
