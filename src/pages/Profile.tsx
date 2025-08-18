
import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Edit, Upload, X, Award, ArrowLeft, User } from 'lucide-react';
import { authService, UserProfile } from '@/services/auth.service';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

interface ProfileData {
  fullName: string;
  registrationNumber: string;
  rotaryId: string;
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
    rotaryId: '',
    phoneNumber: '',
    profilePicture: null as string | null,
    serviceHours: 0
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Get current authenticated user
        const user = auth.currentUser;
        if (!user) {
          toast.error('Please log in to view your profile');
          navigate('/login');
          return;
        }

        // Get user profile from Firebase
        const userProfile = await authService.getUserProfile(user.uid);
        if (userProfile) {
          setCurrentUser(userProfile);
          setProfileData({
            fullName: userProfile.fullName || '',
            registrationNumber: userProfile.registrationNumber || '',
            rotaryId: userProfile.rotaryId || '', // Add rotaryId to UserProfile interface
            phoneNumber: userProfile.phone || '',
            profilePicture: userProfile.profilePicture || null,
            serviceHours: userProfile.serviceHours || 0
          });
          setImagePreview(userProfile.profilePicture || null);
        } else {
          toast.error('User profile not found');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Error loading profile');
      }
    };

    loadProfileData();
  }, [navigate]);

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
    if (!currentUser) {
      toast.error('User not authenticated');
      return;
    }

    setIsSaving(true);
    try {
      // Update profile in Firebase
      await authService.updateUserProfile(currentUser.uid, {
        fullName: profileData.fullName,
        registrationNumber: profileData.registrationNumber,
        rotaryId: profileData.rotaryId, // Add rotaryId to UserProfile interface
        phone: profileData.phoneNumber,
        profilePicture: profileData.profilePicture
      });

      // Update local state
      setCurrentUser(prev => prev ? {
        ...prev,
        fullName: profileData.fullName,
        registrationNumber: profileData.registrationNumber,
        rotaryId: profileData.rotaryId, // Add rotaryId to UserProfile interface
        phone: profileData.phoneNumber,
        profilePicture: profileData.profilePicture
      } : null);

      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rotaract-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

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

                {/* Rotary ID */}
                <div className="space-y-2">
                  <Label htmlFor="rotary-id">Rotary ID</Label>
                  <Input
                    id="rotary-id"
                    value={profileData.rotaryId}
                    onChange={(e) => handleInputChange('rotaryId', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your Rotary ID"
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
