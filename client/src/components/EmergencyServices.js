import React, { useState } from 'react';

const EmergencyServices = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [nearbyServices, setNearbyServices] = useState({ hospitals: [], bloodBanks: [] });
  const [showHospitals, setShowHospitals] = useState(false);
  const [showBloodBanks, setShowBloodBanks] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cityServices, setCityServices] = useState({ hospitals: [], bloodBanks: [] });
  const [showCityHospitals, setShowCityHospitals] = useState(false);
  const [showCityBloodBanks, setShowCityBloodBanks] = useState(false);

  const emergencyContacts = [
    { name: 'Ambulance', number: '108', icon: '🚑', color: '#dc3545' },
    { name: 'Police', number: '100', icon: '👮', color: '#007bff' },
    { name: 'Fire Service', number: '101', icon: '🚒', color: '#fd7e14' },
    { name: 'Emergency Helpline', number: '112', icon: '📞', color: '#28a745' },
    { name: 'Women Helpline', number: '1091', icon: '👩', color: '#e83e8c' },
    { name: 'Child Helpline', number: '1098', icon: '👶', color: '#17a2b8' }
  ];

  const statesAndCities = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kadapa', 'Anantapur', 'Eluru'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tezpur', 'Bomdila', 'Ziro', 'Along', 'Tezu', 'Changlang', 'Khonsa'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Karimganj', 'Sivasagar'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur', 'Mahasamund'],
    'Goa': ['Panaji', 'Vasco da Gama', 'Margao', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Sanquelim', 'Cuncolim', 'Quepem'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Navsari'],
    'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Palampur', 'Baddi', 'Nahan', 'Paonta Sahib', 'Sundarnagar', 'Chamba'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli-Dharwad', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Malappuram', 'Kannur', 'Kasaragod'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Sangli'],
    'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching', 'Ukhrul', 'Senapati', 'Tamenglong', 'Jiribam', 'Chandel'],
    'Meghalaya': ['Shillong', 'Tura', 'Cherrapunji', 'Jowai', 'Baghmara', 'Nongpoh', 'Mawkyrwat', 'Resubelpara', 'Ampati', 'Williamnagar'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip', 'Mamit', 'Lawngtlai', 'Saitual', 'Khawzawl'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Kiphire', 'Longleng', 'Peren'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur', 'Batala', 'Pathankot', 'Moga'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Bharatpur', 'Sikar', 'Pali'],
    'Sikkim': ['Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Jorethang', 'Nayabazar', 'Rangpo', 'Singtam', 'Pakyong', 'Ravangla'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukkudi'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet'],
    'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailashahar', 'Belonia', 'Khowai', 'Pratapgarh', 'Ranir Bazar', 'Sonamura', 'Amarpur'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Moradabad'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani-cum-Kathgodam', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Pithoragarh', 'Jaspur', 'Manglaur'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda', 'Bardhaman', 'Baharampur', 'Habra', 'Kharagpur'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'North East Delhi', 'North West Delhi', 'South East Delhi', 'South West Delhi'],
    'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Baramulla', 'Anantnag', 'Sopore', 'KathuaUdhampur', 'Punch', 'Rajauri', 'Kupwara'],
    'Ladakh': ['Leh', 'Kargil', 'Nubra', 'Zanskar', 'Drass', 'Khaltse', 'Nyoma', 'Durbuk', 'Khalatse', 'Sankoo']
  };

  const handleCall = (number) => {
    window.open(`tel:${number}`);
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLocationLoading(false);
        },
        (error) => {
          alert('Unable to get your location. Please enable location services.');
          setLocationLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setLocationLoading(false);
    }
  };

  const findNearbyHospitals = async () => {
    if (!userLocation) return;
    
    try {
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:15000,${userLocation.lat},${userLocation.lng});
          way["amenity"="hospital"](around:15000,${userLocation.lat},${userLocation.lng});
        );
        out center;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });
      
      const data = await response.json();
      
      const hospitals = data.elements.map(element => {
        const lat = element.lat || element.center?.lat;
        const lon = element.lon || element.center?.lon;
        const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lon);
        
        return {
          name: element.tags?.name || 'Hospital',
          address: `${distance.toFixed(1)} km from your location`,
          distance: distance,
          phone: element.tags?.phone || '108',
          lat: lat,
          lon: lon
        };
      }).sort((a, b) => a.distance - b.distance).slice(0, 10);
      
      setNearbyServices(prev => ({ ...prev, hospitals }));
      setShowHospitals(true);
      setShowBloodBanks(false);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      alert('Error loading hospitals. Please try again.');
    }
  };
  
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDirections = (facility) => {
    if (userLocation && facility.lat && facility.lon) {
      window.open(`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${facility.lat},${facility.lon}`, '_blank');
    }
  };

  const findNearbyBloodBanks = async () => {
    if (!userLocation) return;
    
    try {
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="blood_bank"](around:15000,${userLocation.lat},${userLocation.lng});
          way["amenity"="blood_bank"](around:15000,${userLocation.lat},${userLocation.lng});
          node["healthcare"="blood_bank"](around:15000,${userLocation.lat},${userLocation.lng});
          way["healthcare"="blood_bank"](around:15000,${userLocation.lat},${userLocation.lng});
        );
        out center;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });
      
      const data = await response.json();
      
      const bloodBanks = data.elements.map(element => {
        const lat = element.lat || element.center?.lat;
        const lon = element.lon || element.center?.lon;
        const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lon);
        
        return {
          name: element.tags?.name || 'Blood Bank',
          address: `${distance.toFixed(1)} km from your location`,
          distance: distance,
          phone: element.tags?.phone || '108',
          lat: lat,
          lon: lon
        };
      }).sort((a, b) => a.distance - b.distance).slice(0, 10);
      
      setNearbyServices(prev => ({ ...prev, bloodBanks }));
      setShowBloodBanks(true);
      setShowHospitals(false);
    } catch (error) {
      console.error('Error fetching blood banks:', error);
      alert('Error loading blood banks. Please try again.');
    }
  };

  const searchCityServices = (type) => {
    if (!selectedState || !selectedCity) {
      alert('Please select both state and city');
      return;
    }

    // Mock data for demonstration - in real app, this would be API calls
    const mockHospitals = [
      { name: `${selectedCity} General Hospital`, address: `Main Road, ${selectedCity}, ${selectedState}`, phone: '108', emergency: true },
      { name: `${selectedCity} Medical College`, address: `Medical College Road, ${selectedCity}`, phone: '108', emergency: true },
      { name: `City Hospital ${selectedCity}`, address: `Civil Lines, ${selectedCity}`, phone: '108', emergency: false },
      { name: `${selectedCity} Specialty Hospital`, address: `Hospital Road, ${selectedCity}`, phone: '108', emergency: false },
      { name: `Government Hospital ${selectedCity}`, address: `Government Area, ${selectedCity}`, phone: '108', emergency: true }
    ];

    const mockBloodBanks = [
      { name: `${selectedCity} Blood Bank`, address: `Red Cross Building, ${selectedCity}`, phone: '108', hours: '24/7' },
      { name: `${selectedState} State Blood Bank`, address: `State Hospital, ${selectedCity}`, phone: '108', hours: '24/7' },
      { name: `${selectedCity} Voluntary Blood Bank`, address: `Community Center, ${selectedCity}`, phone: '108', hours: '9 AM - 6 PM' },
      { name: `Medical College Blood Bank`, address: `Medical College, ${selectedCity}`, phone: '108', hours: '24/7' },
      { name: `Private Blood Bank ${selectedCity}`, address: `Private Hospital, ${selectedCity}`, phone: '108', hours: '24/7' }
    ];

    if (type === 'hospitals') {
      setCityServices(prev => ({ ...prev, hospitals: mockHospitals }));
      setShowCityHospitals(true);
      setShowCityBloodBanks(false);
    } else {
      setCityServices(prev => ({ ...prev, bloodBanks: mockBloodBanks }));
      setShowCityBloodBanks(true);
      setShowCityHospitals(false);
    }
  };



  return (
    <div className="emergency-services-container">
      <div className="section-header">
        <h3>🚨 Emergency Services</h3>
        <p>Quick access to emergency contacts and emergency tips</p>
      </div>

      {/* Emergency Contacts */}
      <div className="emergency-contacts-section">
        <h4>Emergency Contact Numbers</h4>
        <div className="contacts-grid">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="emergency-contact-card">
              <div className="contact-icon" style={{ backgroundColor: contact.color }}>
                {contact.icon}
              </div>
              <div className="contact-details">
                <h5>{contact.name}</h5>
                <p className="contact-number">{contact.number}</p>
              </div>
              <button 
                className="call-btn"
                onClick={() => handleCall(contact.number)}
                style={{ backgroundColor: contact.color }}
              >
                📞 Call
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Location-Based Services */}
      <div className="location-services-section">
        <h4>🌍 Find Nearby Services</h4>
        <p>Get hospitals and blood banks near your current location</p>
        
        <div className="location-actions">
          <button 
            className="location-btn"
            onClick={getCurrentLocation}
            disabled={locationLoading}
          >
            {locationLoading ? '📍 Getting Location...' : '📍 Use My Current Location'}
          </button>
          
          {userLocation && (
            <div className="location-status">
              ✅ Location detected! Find nearby services below.
            </div>
          )}
        </div>

        {userLocation && (
          <div className="nearby-services-buttons">
            <button 
              className="service-btn hospitals-btn"
              onClick={findNearbyHospitals}
            >
              🏥 Find Nearby Hospitals
            </button>
            <button 
              className="service-btn blood-banks-btn"
              onClick={findNearbyBloodBanks}
            >
              🩸 Find Nearby Blood Banks
            </button>
          </div>
        )}
      </div>

      {/* City/State Search */}
      <div className="city-search-section">
        <h4>🏙️ Search by City & State</h4>
        <p>Find hospitals and blood banks in any city across India</p>
        
        <div className="city-selection">
          <div className="form-row">
            <div className="form-group">
              <label>Select State:</label>
              <select 
                className="city-select"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('');
                }}
              >
                <option value="">Choose State</option>
                {Object.keys(statesAndCities).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Select City:</label>
              <select 
                className="city-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
              >
                <option value="">Choose City</option>
                {selectedState && statesAndCities[selectedState].map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
          
          {selectedState && selectedCity && (
            <div className="services-buttons">
              <button 
                className="service-btn hospitals-btn"
                onClick={() => searchCityServices('hospitals')}
              >
                🏥 Find Hospitals in {selectedCity}
              </button>
              <button 
                className="service-btn blood-banks-btn"
                onClick={() => searchCityServices('bloodBanks')}
              >
                🩸 Find Blood Banks in {selectedCity}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* City Hospitals List */}
      {showCityHospitals && (
        <div className="services-list">
          <h4>🏥 Hospitals in {selectedCity}, {selectedState}</h4>
          <div className="services-grid">
            {cityServices.hospitals.map((hospital, index) => (
              <div key={index} className="service-card">
                <div className="service-header">
                  <h5>{hospital.name}</h5>
                  {hospital.emergency && <span className="emergency-badge">24/7 Emergency</span>}
                </div>
                <div className="service-details">
                  <p><strong>📍 Address:</strong> {hospital.address}</p>
                </div>
                <div className="service-actions">
                  <button 
                    className="call-btn"
                    onClick={() => handleCall(hospital.phone)}
                  >
                    📞 Call Hospital
                  </button>
                  <button 
                    className="maps-btn"
                    onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(hospital.name + ' ' + hospital.address)}`, '_blank')}
                  >
                    🗺️ View on Maps
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* City Blood Banks List */}
      {showCityBloodBanks && (
        <div className="services-list">
          <h4>🩸 Blood Banks in {selectedCity}, {selectedState}</h4>
          <div className="services-grid">
            {cityServices.bloodBanks.map((bank, index) => (
              <div key={index} className="service-card">
                <div className="service-header">
                  <h5>{bank.name}</h5>
                  <span className="hours-badge">{bank.hours}</span>
                </div>
                <div className="service-details">
                  <p><strong>📍 Address:</strong> {bank.address}</p>
                </div>
                <div className="service-actions">
                  <button 
                    className="call-btn"
                    onClick={() => handleCall(bank.phone)}
                  >
                    📞 Call Blood Bank
                  </button>
                  <button 
                    className="maps-btn"
                    onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(bank.name + ' ' + bank.address)}`, '_blank')}
                  >
                    🗺️ View on Maps
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Hospitals List */}
      {showHospitals && (
        <div className="services-list">
          <h4>🏥 Nearby Hospitals</h4>
          <div className="services-grid">
            {nearbyServices.hospitals.map((hospital, index) => (
              <div key={index} className="service-card">
                <div className="service-header">
                  <h5>{hospital.name}</h5>
                  <span className="distance-badge">{hospital.distance} km</span>
                </div>
                <div className="service-details">
                  <p><strong>📍 Distance:</strong> {hospital.address}</p>
                </div>
                <div className="service-actions">
                  <button 
                    className="call-btn"
                    onClick={() => handleCall(hospital.phone)}
                  >
                    📞 Call Hospital
                  </button>
                  <button 
                    className="directions-btn"
                    onClick={() => getDirections(hospital)}
                  >
                    🗺️ Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Blood Banks List */}
      {showBloodBanks && (
        <div className="services-list">
          <h4>🩸 Nearby Blood Banks</h4>
          <div className="services-grid">
            {nearbyServices.bloodBanks.map((bank, index) => (
              <div key={index} className="service-card">
                <div className="service-header">
                  <h5>{bank.name}</h5>
                  <span className="distance-badge">{bank.distance} km</span>
                </div>
                <div className="service-details">
                  <p><strong>📍 Distance:</strong> {bank.address}</p>
                </div>
                <div className="service-actions">
                  <button 
                    className="call-btn"
                    onClick={() => handleCall(bank.phone)}
                  >
                    📞 Call Blood Bank
                  </button>
                  <button 
                    className="directions-btn"
                    onClick={() => getDirections(bank)}
                  >
                    🗺️ Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="emergency-tips">
        <h4>⚡ Emergency Tips</h4>
        <div className="tips-grid">
          <div className="tip-card">
            <h5>🚑 Medical Emergency</h5>
            <ul>
              <li>Call 108 immediately</li>
              <li>Stay calm and provide clear location</li>
              <li>Don't move injured person unless necessary</li>
              <li>Apply pressure to bleeding wounds</li>
            </ul>
          </div>
          <div className="tip-card">
            <h5>🩸 Blood Emergency</h5>
            <ul>
              <li>Contact multiple blood banks</li>
              <li>Inform about blood group needed</li>
              <li>Arrange transportation</li>
              <li>Keep donor's documents ready</li>
            </ul>
          </div>
          <div className="tip-card">
            <h5>📱 Important Info to Share</h5>
            <ul>
              <li>Exact location/address</li>
              <li>Nature of emergency</li>
              <li>Number of people affected</li>
              <li>Your contact number</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyServices;