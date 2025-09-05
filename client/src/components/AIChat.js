import React, { useState, useRef, useEffect } from 'react';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Hello! I\'m your AI assistant for blood donation and emergency guidance. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const emergencyResponses = {
    'emergency': 'In case of emergency:\n1. Call 108 for ambulance\n2. Call 100 for police\n3. Call 101 for fire service\n4. Go to nearest hospital immediately\n5. Contact your emergency contacts',
    'blood loss': 'For severe blood loss:\n1. Call 108 immediately\n2. Apply direct pressure to wound\n3. Elevate the injured area\n4. Keep the person calm and lying down\n5. Do not remove embedded objects',
    'accident': 'In case of accident:\n1. Ensure scene safety first\n2. Call 108 for ambulance\n3. Check for consciousness\n4. Control bleeding if present\n5. Do not move the person unless necessary',
    'hospital': 'To find nearby hospitals:\n1. Use Google Maps and search "hospital near me"\n2. Call 108 for ambulance service\n3. Major hospitals usually have 24/7 emergency services\n4. Keep important medical documents ready',
    'blood bank': 'To find blood banks:\n1. Search "blood bank near me" on Google Maps\n2. Contact Red Cross blood centers\n3. Most major hospitals have blood banks\n4. Call ahead to check blood availability',
    'donation': 'Blood donation guidelines:\n1. Must be 18-65 years old\n2. Weight should be above 50kg\n3. Hemoglobin level should be 12.5g/dl or above\n4. Should be healthy and well-rested\n5. Avoid alcohol 24 hours before donation',
    'eligibility': 'Blood donation eligibility:\n✅ Age: 18-65 years\n✅ Weight: Above 50kg\n✅ Good health condition\n✅ No recent illness or medication\n❌ Recent tattoo/piercing (wait 6 months)\n❌ Recent travel to malaria-endemic areas'
  };

  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Check for emergency keywords
    if (message.includes('emergency') || message.includes('urgent') || message.includes('help')) {
      return emergencyResponses.emergency;
    }
    
    if (message.includes('blood loss') || message.includes('bleeding') || message.includes('wound')) {
      return emergencyResponses['blood loss'];
    }
    
    if (message.includes('accident') || message.includes('injury') || message.includes('hurt')) {
      return emergencyResponses.accident;
    }
    
    if (message.includes('hospital') || message.includes('medical center')) {
      return emergencyResponses.hospital;
    }
    
    if (message.includes('blood bank') || message.includes('blood center')) {
      return emergencyResponses['blood bank'];
    }
    
    if (message.includes('donate') || message.includes('donation') || message.includes('donor')) {
      return emergencyResponses.donation;
    }
    
    if (message.includes('eligible') || message.includes('eligibility') || message.includes('qualify')) {
      return emergencyResponses.eligibility;
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! I\'m here to help you with blood donation queries and emergency guidance. You can ask me about:\n• Emergency procedures\n• Blood donation eligibility\n• Finding hospitals and blood banks\n• First aid guidance\n• Blood request process';
    }
    
    // Default response
    return 'I can help you with:\n\n🚨 Emergency situations and first aid\n🏥 Finding nearby hospitals and blood banks\n🩸 Blood donation guidelines and eligibility\n📋 Blood request process\n📞 Emergency contact numbers\n\nPlease ask me about any of these topics, or type "emergency" for immediate help.';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'bot',
        message: getAIResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'Emergency help',
    'Blood donation eligibility',
    'Find nearby hospitals',
    'Find blood banks',
    'First aid for bleeding'
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <h3>🤖 AI Emergency Assistant</h3>
        <p>Get instant help for emergencies and blood donation queries</p>
      </div>

      <div className="quick-questions">
        <h4>Quick Questions:</h4>
        <div className="quick-buttons">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              className="quick-btn"
              onClick={() => handleQuickQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              <div className="message-text">
                {message.message.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about emergencies, blood donation, or first aid..."
          rows="2"
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="send-btn"
        >
          Send
        </button>
      </div>

      <div className="emergency-notice">
        <p><strong>⚠️ For immediate emergencies, call 108 (Ambulance) or 100 (Police)</strong></p>
      </div>
    </div>
  );
};

export default AIChat;