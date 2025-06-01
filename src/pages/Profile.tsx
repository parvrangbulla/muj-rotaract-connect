
import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  profilePicture: string | null;
  fullName: string;
  dateOfBirth: string;
  registrationNumber: string;
  phoneNumber: string;
  hoursOfService: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfile>({
    profilePicture: null,
    fullName: '',
    dateOfBirth: '',
    registrationNumber: '',
    phoneNumber: '',
    hoursOfService: 24
  });
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load existing profile data from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData(parsed);
      setProfilePreview(parsed.profilePicture);
    }

    // Set default name from username if available
    const username = localStorage.getItem('username');
    if (username && !profileData.fullName) {
      setProfileData(prev => ({ ...prev, fullName: username }));
    }
  }, []);

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setProfilePreview(result);
        setProfileData(prev => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      // Update username in localStorage if fullName is provided
      if (profileData.fullName) {
        localStorage.setItem('username', profileData.fullName);
      }

      // Trigger storage event to update sidebar
      window.dispatchEvent(new Event('storage'));

      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profilePreview || ''} alt="Profile" />
                  <AvatarFallback className="text-2xl">
                    <User className="w-12 h-12" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="profilePicture">Profile Picture</Label>
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('profilePicture')?.click()}
                    className="mt-2 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Picture
                  </Button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required
                />
              </div>

              {/* Registration Number */}
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={profileData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  placeholder="Enter your registration number"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Hours of Service (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="hoursOfService">Hours of Service</Label>
                <div className="p-3 bg-gray-100 rounded-md">
                  <span className="text-lg font-semibold text-rotaract-orange">
                    {profileData.hoursOfService} hours
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    Total volunteer hours completed
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <Button
                type="submit"
                className="w-full bg-rotaract-orange hover:bg-rotaract-orange/90"
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving Profile...' : 'Save Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
