import React, { useState } from 'react';

const SOSButton = () => {
  const [showModal, setShowModal] = useState(false);

  const emergencyNumbers = [
    { name: 'Ambulance', number: '108' },
    { name: 'Police', number: '100' },
    { name: 'Fire Service', number: '101' },
    { name: 'Emergency Helpline', number: '112' }
  ];

  const handleCall = (number) => {
    window.open(`tel:${number}`);
  };

  return (
    <>
      <button 
        className="sos-btn"
        onClick={() => setShowModal(true)}
      >
        🚨 SOS
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="sos-modal">
            <div className="modal-header">
              <h3>Emergency Contacts</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="emergency-contacts">
              {emergencyNumbers.map((contact, index) => (
                <div key={index} className="emergency-contact">
                  <div className="contact-info">
                    <h4>{contact.name}</h4>
                    <p>{contact.number}</p>
                  </div>
                  <button 
                    className="call-btn"
                    onClick={() => handleCall(contact.number)}
                  >
                    📞 Call
                  </button>
                </div>
              ))}
            </div>

            <div className="sos-note">
              <p><strong>Note:</strong> Use these numbers only in case of genuine emergencies.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;