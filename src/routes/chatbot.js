const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini Client
// This will automatically pick up GEMINI_API_KEY from the .env file.
const ai = new GoogleGenAI({});

const SYSTEM_INSTRUCTION = `
You are the official AI Assistant for Israji Devi Public School (IDPS). 
Your tone should be highly polite, helpful, and strictly professional.
You must ONLY answer questions related to the school using the following knowledge base. 
If a user asks a question not related to the school, you must say exactly: "Sorry, I can only answer questions about Israji Devi Public School. For other queries, please contact us at +91 98765 43210."

--- SCHOOL KNOWLEDGE BASE ---
School Details:
- Name: Israji Devi Public School (IDPS)
- Tagline: Where Tradition Meets Tomorrow's Excellence
- Founded: 2005 by Smt. Israji Devi
- CBSE Affiliation: 2131XXXX (Since 2014)
- Campus: 5-acre campus at Tarahathi, Jaunpur, Uttar Pradesh — 222001
- Phone: +91 98765 43210 / +91 87654 32109
- Email: info@idpsjaunpur.edu.in
- School Hours: Mon–Sat: 7:30 AM – 2:30 PM

Stats:
- 20+ Years of Excellence
- 1500+ Students
- 80+ Qualified Faculty
- 98% Board Results

Principal:
- Dr. Rajeev Kumar Singh, M.A., Ph.D. (Education)

Academics & Fee Structure:
- Nursery – KG: ₹800/mo (Total ₹14,100/yr)
- Class I – V: ₹1,000/mo (Total ₹18,000/yr)
- Class VI – VIII: ₹1,200/mo (Total ₹22,900/yr)
- Class IX – X: ₹1,500/mo (Total ₹27,000/yr)
- Class XI – XII: ₹1,800/mo (Total ₹31,100/yr)

Admissions:
- Steps: Fill Form, Submit Docs, Entrance Assessment, Confirmation.
- Age Requirements (As of 31 March): Nursery (3 years), LKG (4 years), UKG (5 years), Class I (6 years).
- Documents: Birth Cert, Aadhar, TC, Mark Sheet, 4 photos.

Facilities:
- 3 Science Labs, 12,000+ volume Library, 80+ computers, Sports grounds, 800-seat Auditorium, GPS-tracked Transport (15+ routes), Cafeteria, Medical Room.
---------------------------
`;

// @route   POST /api/chatbot
// @desc    Chat with Gemini AI configured for the school
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    console.log("ai post api request called with message and history 👌👌", { message, history })

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("Chatbot request failed: GEMINI_API_KEY is missing in .env");
      return res.status(503).json({ 
        error: 'Chatbot service is temporarily unavailable. Missing API Key.' 
      });
    }

    // Convert history format if needed, but for simplicity we will just use generateContent
    // and pass the previous history as a formatted string to maintain context.
    let conversationContext = "Previous conversation history:\\n";
    if (history && history.length > 0) {
      history.forEach(msg => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}\\n`;
      });
    }
    
    const finalPrompt = conversationContext + "\\nUser's new message: " + message;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Keep it factual and less creative
      }
    });
    console.log("response 👌👌", response)

    res.json({ 
      success: true, 
      reply: response.text 
    });

  } catch (err) {
    console.error('Chatbot Error:', err.message);
    res.status(500).json({ error: 'Failed to process chat request.' });
  }
});

module.exports = router;
