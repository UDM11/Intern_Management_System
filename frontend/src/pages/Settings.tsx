import { useState, useEffect } from 'react';
import {
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Lock,
  Save,
  RefreshCw,
  Download,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Volume2,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { settingsService, UserProfile, UserProfileUpdate } from '@/services/settingsService';

interface SettingsData {
  profile: UserProfile & {
    role: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    sound: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'team';
    activityTracking: boolean;
  };
  system: {
    autoBackup: boolean;
    storageUsed: number;
    storageLimit: number;
  };
}

export const Settings = () => {
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      id: 0,
      username: '',
      email: '',
      full_name: '',
      avatar_url: '',
      role: 'Admin',
      department: '',
      phone: '',
      is_active: true
    },
    preferences: {
      theme: 'system',
      language: 'en'
    },
    notifications: {
      email: false,
      push: false,
      desktop: false,
      sound: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30
    },
    privacy: {
      profileVisibility: 'team',
      activityTracking: false
    },
    system: {
      autoBackup: false,
      storageUsed: 0,
      storageLimit: 0
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const userProfile = await settingsService.getUserProfile();
      setSettings(prev => ({
        ...prev,
        profile: {
          ...userProfile,
          avatar_url: settingsService.getFullAvatarUrl(userProfile.avatar_url) || userProfile.avatar_url,
          role: 'Admin' // Default role, can be fetched from API if needed
        }
      }));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load settings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const profileUpdate: UserProfileUpdate = {
        username: settings.profile.username,
        email: settings.profile.email,
        full_name: settings.profile.full_name,
        phone: settings.profile.phone,
        department: settings.profile.department
      };
      
      const updatedProfile = await settingsService.updateUserProfile(profileUpdate);
      setSettings(prev => ({
        ...prev,
        profile: {
          ...updatedProfile,
          role: prev.profile.role
        }
      }));
      
      toast({
        title: 'Settings saved',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      // TODO: Replace with actual API call to reset settings
      // await settingsService.resetSettings();
      toast({
        title: 'Settings reset',
        description: 'All settings have been reset to default values.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset settings.',
        variant: 'destructive',
      });
    } finally {
      setResetDialog(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateSetting = (section: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size must be less than 2MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await settingsService.uploadAvatar(file);
      updateSetting('profile', 'avatar_url', result.avatar_url);
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload avatar.',
        variant: 'destructive',
      });
    }
  };

  const storagePercentage = (settings.system.storageUsed / settings.system.storageLimit) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-slide-in-left">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your application preferences and configuration</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 animate-slide-in-right">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              className="hover-lift flex-1 sm:flex-none"
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setResetDialog(true)}
              className="hover-lift flex-1 sm:flex-none"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="hover-lift hover-glow w-full sm:w-auto"
          >
            {isSaving ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="animate-slide-up">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto p-1">
            <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 py-2 px-2 sm:px-3">
              <User className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-1 sm:gap-2 py-2 px-2 sm:px-3">
              <Palette className="h-4 w-4" />
              <span className="text-xs sm:text-sm hidden sm:inline">Preferences</span>
              <span className="text-xs sm:hidden">Prefs</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1 sm:gap-2 py-2 px-2 sm:px-3">
              <Bell className="h-4 w-4" />
              <span className="text-xs sm:text-sm hidden sm:inline">Notifications</span>
              <span className="text-xs sm:hidden">Notifs</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1 sm:gap-2 py-2 px-2 sm:px-3">
              <Shield className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Security</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-1 sm:gap-2 py-2 px-2 sm:px-3">
              <Lock className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-1 sm:gap-2 py-2 px-2 sm:px-3">
              <Database className="h-4 w-4" />
              <span className="text-xs sm:text-sm">System</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="hover-lift transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 hover-scale transition-smooth">
                    <AvatarImage src={settingsService.getFullAvatarUrl(settings.profile.avatar_url)} />
                    <AvatarFallback className="text-sm sm:text-lg font-semibold">
                      {(settings.profile.full_name || settings.profile.username || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 text-center sm:text-left">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover-lift w-full sm:w-auto"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Change Photo
                    </Button>
                    <p className="text-xs sm:text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>
                
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={settings.profile.full_name || ''}
                      onChange={(e) => updateSetting('profile', 'full_name', e.target.value)}
                      className="transition-smooth focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                      className="transition-smooth focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={settings.profile.phone || ''}
                      onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                      className="transition-smooth focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      value={settings.profile.department || ''} 
                      onValueChange={(value) => updateSetting('profile', 'department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="HR">Human Resources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="hover-scale transition-smooth">
                    {settings.profile.role}
                  </Badge>
                  {settings.profile.department && (
                    <Badge variant="secondary" className="hover-scale transition-smooth">
                      {settings.profile.department}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Settings */}
          <TabsContent value="preferences" className="space-y-6">
            <Card className="hover-lift transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance & Preferences
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { value: 'light', icon: Sun, label: 'Light' },
                      { value: 'dark', icon: Moon, label: 'Dark' },
                      { value: 'system', icon: Monitor, label: 'System' }
                    ].map(({ value, icon: Icon, label }) => (
                      <Button
                        key={value}
                        variant={settings.preferences.theme === value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateSetting('preferences', 'theme', value)}
                        className="flex items-center gap-2 hover-lift justify-center"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={settings.preferences.language} 
                    onValueChange={(value) => updateSetting('preferences', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="hover-lift transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {[
                  { key: 'email', icon: Mail, label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'push', icon: Smartphone, label: 'Push Notifications', desc: 'Browser and mobile push notifications' },
                  { key: 'desktop', icon: Monitor, label: 'Desktop Notifications', desc: 'System desktop notifications' },
                  { key: 'sound', icon: Volume2, label: 'Sound Alerts', desc: 'Play sound for notifications' }
                ].map(({ key, icon: Icon, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{label}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                      onCheckedChange={(checked) => updateSetting('notifications', key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="hover-lift transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base">Two-Factor Authentication</p>
                    <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select 
                    value={settings.security.sessionTimeout.toString()} 
                    onValueChange={(value) => updateSetting('security', 'sessionTimeout', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="hover-lift transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control your privacy and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select 
                    value={settings.privacy.profileVisibility} 
                    onValueChange={(value) => updateSetting('privacy', 'profileVisibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base">Activity Tracking</p>
                    <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Track your activity for analytics</p>
                  </div>
                  <Switch
                    checked={settings.privacy.activityTracking}
                    onCheckedChange={(checked) => updateSetting('privacy', 'activityTracking', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card className="hover-lift transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Manage system preferences and storage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base">Auto Backup</p>
                    <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Automatically backup your data</p>
                  </div>
                  <Switch
                    checked={settings.system.autoBackup}
                    onCheckedChange={(checked) => updateSetting('system', 'autoBackup', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Storage Used</span>
                    <span>{settings.system.storageUsed}GB / {settings.system.storageLimit}GB</span>
                  </div>
                  <Progress value={storagePercentage} className="h-1.5 sm:h-2" />
                  <p className="text-xs text-muted-foreground">
                    {(100 - storagePercentage).toFixed(1)}% available
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={resetDialog} onOpenChange={setResetDialog}>
        <AlertDialogContent className="animate-scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Reset All Settings
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all your settings to their default values. This action cannot be undone.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover-lift">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReset}
              className="bg-destructive hover:bg-destructive/90 hover-lift"
            >
              Reset Settings
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};