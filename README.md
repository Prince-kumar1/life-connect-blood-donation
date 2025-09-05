# 🩸 Life Connect - Blood Donor Request Matching System

A comprehensive MERN stack web application that connects blood donors with seekers through a secure, real-time platform prioritizing urgent medical needs.

![Life Connect Banner](https://img.shields.io/badge/Life%20Connect-Blood%20Donation%20Platform-red?style=for-the-badge&logo=heart)

## ✨ Key Features

### 👥 Dual Account System
- **Donors can create seeker accounts** - Access both functionalities seamlessly
- **Seekers can create donor accounts** - Help others when able to donate
- **Token-based switching** - Secure authentication for each account type
- **Unified profile management** - Consistent data across account types

### 🩸 For Donors
- ✅ Secure registration with comprehensive profile management
- ✅ Add/edit blood donations with **privacy controls**
- ✅ Contact visibility settings (show/hide phone & email)
- ✅ View and respond to blood requests
- ✅ Location-based donation management
- ✅ Emergency SOS features

### 🔍 For Seekers
- ✅ Search available blood donations by type and location
- ✅ Create urgent blood requests with priority levels
- ✅ Real-time donor availability tracking
- ✅ Request status monitoring
- ✅ Emergency hospital/blood bank locator

### 🚨 Emergency Services
- ✅ **GPS-based hospital finder** - Locate nearby hospitals within 15km
- ✅ **Blood bank locator** - Find blood banks with real-time data
- ✅ **City/State search** - Comprehensive dropdown for 300+ Indian cities
- ✅ **Emergency contacts** - Quick access to ambulance, police, fire services
- ✅ **Google Maps integration** - Direct navigation to facilities

### 🔒 Advanced Security & Validation
- ✅ **Email validation** - Pattern-based email verification
- ✅ **Phone validation with country codes** - Support for multiple countries
- ✅ **Address standardization** - State/city dropdowns for consistent data
- ✅ **JWT authentication** - Secure token-based access control
- ✅ **Password hashing** - bcryptjs encryption

## 🚀 Technology Stack

### Frontend
- **React.js** - Component-based UI development
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **CSS3** - Modern responsive design with flexbox/grid
- **HTML5** - Semantic markup structure

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - RESTful API framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Object modeling and validation
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing and security

### External APIs
- **Overpass API** - OpenStreetMap data for hospital/blood bank locations
- **Google Maps API** - Navigation and location services
- **Browser Geolocation** - GPS-based location detection

### Development Tools
- **npm** - Package management
- **Nodemon** - Development server with auto-restart
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager
- **Git** for version control

### 📥 Clone Repository
```bash
git clone https://github.com/yourusername/life-connect-blood-donation.git
cd life-connect-blood-donation
```

### 🔧 Backend Setup

1. **Install server dependencies:**
```bash
npm install
```

2. **Environment Configuration:**
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configurations
MONGODB_URI=mongodb://localhost:27017/blooddonor
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

3. **Start MongoDB service:**
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas cloud connection
```

4. **Start the backend server:**
```bash
npm run dev
```

### 🎨 Frontend Setup

1. **Navigate to client directory:**
```bash
cd client
```

2. **Install frontend dependencies:**
```bash
npm install
```

3. **Start React development server:**
```bash
npm start
```

### 🌐 Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** mongodb://localhost:27017

## 📱 Usage Guide

### 🚀 Getting Started
1. **Register** as donor or seeker with email verification
2. **Complete profile** with validated phone number and address
3. **Choose account type** or create dual accounts for full access

### 🩸 For Donors
1. **Add Blood Donations:**
   - Select blood group and location (state/city dropdowns)
   - Set privacy preferences for contact visibility
   - Add availability status and location details

2. **Manage Requests:**
   - View incoming blood requests with urgency levels
   - Accept/decline requests based on availability
   - Track request status and seeker contact

3. **Create Seeker Account:**
   - Access seeker features when you need blood
   - Seamless switching between donor/seeker roles

### 🔍 For Seekers
1. **Find Blood Donors:**
   - Search by blood group and location
   - View donor availability (respecting privacy settings)
   - Send requests with urgency levels

2. **Emergency Services:**
   - Use GPS to find nearby hospitals (15km radius)
   - Locate blood banks with operating hours
   - Search by city/state across 300+ Indian cities
   - Quick access to emergency contact numbers

3. **Create Donor Account:**
   - Help others by becoming a donor
   - Maintain separate donor profile and donations

### 🚨 Emergency Features
- **One-click emergency contacts** (108, 100, 101, 112)
- **GPS-based hospital finder** with Google Maps integration
- **Blood bank locator** with real-time availability
- **City search** across all major Indian cities and states

## 🔌 API Documentation

### 🔐 Authentication Endpoints
```http
POST /api/auth/register          # Register new user (donor/seeker)
POST /api/auth/login             # User authentication
GET  /api/auth/me                # Get current user profile
GET  /api/auth/seeker-account    # Check if donor has seeker account
POST /api/auth/create-seeker-account  # Create seeker account for donor
POST /api/auth/seeker-login      # Login to seeker account from donor
GET  /api/auth/donor-account     # Check if seeker has donor account
POST /api/auth/create-donor-account   # Create donor account for seeker
POST /api/auth/donor-login       # Login to donor account from seeker
```

### 👤 Profile Management
```http
GET  /api/donor/profile          # Get donor profile
PUT  /api/donor/profile          # Update donor profile
PUT  /api/seeker/profile         # Update seeker profile
```

### 🩸 Blood Donation Management
```http
POST /api/blood/donate           # Add new blood donation
GET  /api/blood/my-donations     # Get donor's donations
PUT  /api/blood/donation/:id     # Update donation (privacy, availability)
DELETE /api/blood/donation/:id   # Remove donation
```

### 🔍 Seeker Operations
```http
GET  /api/seeker/available-blood # Get available donations (privacy-filtered)
POST /api/seeker/request-blood   # Create blood request
GET  /api/seeker/my-requests     # Get seeker's requests
```

## 🗃️ Database Schema

### 👤 User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  userType: String (enum: ['donor', 'seeker']),
  phone: String (with country code: '+919876543210'),
  address: String ('Street, City, State' format),
  bloodGroup: String (enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  isProfileComplete: Boolean,
  originalEmail: String (for dual accounts),
  state: String,
  city: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 🩸 BloodDonation Model
```javascript
{
  donorId: ObjectId (ref: 'User'),
  bloodGroup: String (required),
  donorEmail: String (required),
  donorPhone: String (with country code),
  location: String ('Street, City, State' format),
  isAvailable: Boolean (default: true),
  showContactDetails: Boolean (default: false), // Privacy control
  lastDonationDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 📋 BloodRequest Model
```javascript
{
  seekerId: ObjectId (ref: 'User'),
  bloodGroup: String (required),
  urgency: String (enum: ['low', 'medium', 'high', 'emergency']),
  location: String ('Street, City, State' format),
  contactPhone: String (with country code),
  message: String,
  status: String (enum: ['pending', 'accepted', 'completed', 'cancelled']),
  acceptedBy: ObjectId (ref: 'User'),
  donorId: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

### 🛡️ Authentication & Authorization
- **bcryptjs password hashing** - Secure password storage with salt rounds
- **JWT token authentication** - Stateless authentication with expiration
- **Protected routes** - Middleware-based access control
- **Dual account security** - Separate tokens for donor/seeker accounts

### ✅ Input Validation
- **Email validation** - Regex pattern matching
- **Phone validation** - Country-specific digit validation
- **Address standardization** - State/city dropdown validation
- **Blood group validation** - Enum-based validation
- **Server-side validation** - Mongoose schema validation

### 🌐 Network Security
- **CORS configuration** - Controlled cross-origin requests
- **Environment variables** - Sensitive data protection
- **API rate limiting** - Prevent abuse and attacks

## 🤝 Contributing

### 🔧 Development Setup
1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/life-connect.git`
3. **Create branch**: `git checkout -b feature/amazing-feature`
4. **Install dependencies**: `npm install && cd client && npm install`
5. **Start development**: `npm run dev` (backend) & `npm start` (frontend)

### 📝 Contribution Guidelines
- Follow existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Ensure responsive design for UI changes
- Test across different browsers and devices

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenStreetMap** - Hospital and blood bank location data
- **Google Maps** - Navigation and mapping services
- **React Community** - Component libraries and best practices
- **MongoDB** - Flexible database solution

## 📞 Support

For support and questions:
- 📧 Email: support@lifeconnect.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/life-connect/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/life-connect/wiki)

---

**Made with ❤️ for saving lives through technology**