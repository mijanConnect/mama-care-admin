'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetUsersQuery, useUpdateProfileMutation } from '@/lib/store';
import { Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserData {
  createdAt: string;
  email: string;
  location: {
    type: string;
    coordinates: number[];
  };
  name: string;
  profileImage: string;
  role: string;
  status: string;
  stripeAccountId: string;
  updatedAt: string;
  verified: boolean;
}

interface ProfileData {
  name: string;
  email: string;
  location?: {
    type: string;
    coordinates: number[];
  };
}

interface ProfileSettingsProps {}

export function ProfileSettings({}: ProfileSettingsProps) {
  const { data: userData, isLoading: isLoadingUser } = useGetUsersQuery({});
  const user: UserData | undefined = userData?.data;
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location
  });
  
  const [profileError, setProfileError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);


  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  // Update profileData when user data is loaded
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        location: user.location
      });
      setImagePreview(user.profileImage);
    }
  }, [user]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError('');
    
    try {
      const formData = new FormData();
      
      // Add profile image if selected
      if (selectedImage) {
        formData.append('profileImage', selectedImage);
      }
      
      // Add other data as JSON
      const jsonData = {
        name: profileData.name,
        email: profileData.email,
        location: profileData.location
      };
      
      formData.append('data', JSON.stringify(jsonData));
      
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully!');
      setSelectedImage(null);
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Failed to update profile';
      setProfileError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (isLoadingUser) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CD671C] mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading profile...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>Failed to load user profile data.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and profile details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {profileError && (
            <Alert variant="destructive">
              <AlertDescription>{profileError}</AlertDescription>
            </Alert>
          )}
          
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={imagePreview || user.profileImage} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button variant="outline" size="sm" type="button" onClick={handleImageUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Change Photo
              </Button>
              <p className="text-sm text-gray-500 mt-1">
                JPG, GIF or PNG. 1MB max.
              </p>
              {selectedImage && (
                <p className="text-sm text-green-600 mt-1">
                  New image selected: {selectedImage.name}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={user.role} disabled />
            </div>
            
            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input value={new Date(user.createdAt).toLocaleDateString()} disabled />
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Input value={user.status} disabled />
            </div>
            
            <div className="space-y-2">
              <Label>Verified</Label>
              <Input value={user.verified ? 'Yes' : 'No'} disabled />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#CD671C] hover:bg-[#B85A18] text-white"
              disabled={isUpdatingProfile}
            >
              <Save className="mr-2 h-4 w-4" />
              {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}