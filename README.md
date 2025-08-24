# Rotaract Club MUJ - Official Website

## 🌟 About

Welcome to the official website of the Rotaract Club of Manipal University Jaipur (MUJ). This platform serves as the digital hub for our club's activities, events, and community engagement.

## 🚀 Live Website

**Production URL**: https://rotaractmuj.in  
**Firebase Hosting**: https://muj-rotaract-club.web.app

## 🎯 Features

### For Club Members
- **Event Management**: Create, edit, and manage club events
- **Attendance Tracking**: Mark attendance for events with automatic service hours calculation
- **Profile Management**: Update personal information and track service hours
- **Calendar View**: Weekly calendar interface for event scheduling

### For Guests & Public
- **Event Registration**: Register for public events without login
- **Event Gallery**: View photos and details of past events
- **Club Information**: Learn about our domains, team, and initiatives
- **NGO Partnerships**: Information about our community collaborations

### For Executives
- **Admin Dashboard**: Full administrative control over events and users
- **User Management**: Manage member accounts and permissions
- **Event Analytics**: Track event participation and impact

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **Image Storage**: Cloudinary for optimized image management
- **Build Tool**: Vite for fast development and building
- **Deployment**: Firebase Hosting with custom domain support

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Local Development

```bash
# Clone the repository
git clone https://github.com/parvrangbulla/muj-rotaract-connect.git

# Navigate to project directory
cd muj-rotaract-connect

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # shadcn/ui components
│   ├── EventManagement.tsx
│   ├── WeeklyCalendar.tsx
│   └── ...
├── pages/              # Main page components
│   ├── About.tsx
│   ├── Events.tsx
│   ├── Team.tsx
│   └── ...
├── services/           # Firebase and API services
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
└── contexts/           # React context providers
```

## 🔐 Authentication & Roles

- **Guest**: Can view events and register for public events
- **Student**: Full access to event registration and profile management
- **Executive**: Administrative access to create events and manage attendance

## 🌍 Environment Configuration

Create a `.env` file in the root directory with your Firebase and Cloudinary credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🚀 Deployment

The application is automatically deployed to Firebase Hosting when changes are pushed to the main branch.

### Manual Deployment

```bash
# Deploy to Firebase
firebase deploy --only hosting

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For technical support or questions about the website, please contact the club's technical team.

## 📄 License

This project is developed for the Rotaract Club of Manipal University Jaipur. All rights reserved.

---

**Built with ❤️ for the Rotaract Club MUJ Community**
