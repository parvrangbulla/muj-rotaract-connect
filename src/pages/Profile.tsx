import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Edit, Upload, X, Award, ArrowLeft, User } from 'lucide-react';

interface ProfileData {
  fullName: string;
  registrationNumber: string;
  dateOfBirth: string;
  phoneNumber: string;
  profilePicture: string | null;
  serviceHours: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    registrationNumber: '',
    dateOfBirth: '',
    phoneNumber: '',
    profilePicture: null as string | null,
    serviceHours: 0
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileData = () => {
      const username = localStorage.getItem('username') || '';
      const savedProfile = localStorage.getItem('userProfile');
      
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setProfileData({
          fullName: profile.fullName || username,
          registrationNumber: profile.registrationNumber || '',
          dateOfBirth: profile.dateOfBirth || '',
          phoneNumber: profile.phoneNumber || '',
          profilePicture: profile.profilePicture || null,
          serviceHours: profile.serviceHours || 0
        });
        setImagePreview(profile.profilePicture || null);
      } else {
        setProfileData(prev => ({
          ...prev,
          fullName: username,
          serviceHours: 0
        }));
      }
    };

    loadProfileData();

    // Listen for storage changes
    const handleStorageChange = () => loadProfileData();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setProfileData(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(profileData.profilePicture);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage (excluding serviceHours from being directly edited)
      const dataToSave = {
        fullName: profileData.fullName,
        registrationNumber: profileData.registrationNumber,
        dateOfBirth: profileData.dateOfBirth,
        phoneNumber: profileData.phoneNumber,
        profilePicture: profileData.profilePicture,
        serviceHours: profileData.serviceHours // Keep existing service hours
      };
      
      localStorage.setItem('userProfile', JSON.stringify(dataToSave));
      
      // Update username in localStorage if fullName changed
      if (profileData.fullName) {
        localStorage.setItem('username', profileData.fullName);
      }
      
      // Trigger storage event to update other components
      window.dispatchEvent(new Event('storage'));
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-3xl font-bold text-gray-800">View Profile</h1>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <Avatar className="w-32 h-32">
                  {imagePreview ? (
                    <AvatarImage src={imagePreview} alt="Profile" className="object-cover" />
                  ) : (
                    <AvatarFallback>
                      <User className="w-8 h-8" />
                    </AvatarFallback>
                  )}
                </Avatar>
                {isEditing ? (
                  <>
                    <Label htmlFor="profile-picture-upload" className="cursor-pointer">
                      <Button variant="secondary" asChild>
                        <label htmlFor="profile-picture-upload" className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload New
                        </label>
                      </Button>
                    </Label>
                    <Input
                      type="file"
                      id="profile-picture-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    {imagePreview && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setImagePreview(null);
                          setProfileData(prev => ({ ...prev, profilePicture: null }));
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Click Edit Profile to change your profile picture.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Profile Information
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Registration Number */}
                <div className="space-y-2">
                  <Label htmlFor="registration-number">Registration Number</Label>
                  <Input
                    id="registration-number"
                    value={profileData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your registration number"
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="date-of-birth">Date of Birth</Label>
                  <Input
                    id="date-of-birth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Service Hours - Display Only */}
                <div className="space-y-2">
                  <Label>Hours of Service</Label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 text-rotaract-orange" />
                    <span className="font-semibold text-lg">{profileData.serviceHours} hours</span>
                    <span className="text-sm text-gray-500">
                      (Earned through event attendance)
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing ? (
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-rotaract-orange hover:bg-rotaract-orange/90"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => navigate(-1)}
                    variant="secondary"
                  >
                    Go Back
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
