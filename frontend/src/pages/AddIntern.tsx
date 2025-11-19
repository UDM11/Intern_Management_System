import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, User, Mail, Phone, Building2, Calendar, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { internService } from '@/services/internService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const AddIntern = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    university: '',
    skills: [] as string[]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newSkill, setNewSkill] = useState('');

  const steps = [
    { id: 'personal', title: 'Personal Info', icon: User },
    { id: 'professional', title: 'Professional', icon: Building2 },
    { id: 'review', title: 'Review', icon: CheckCircle }
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!formData.full_name.trim()) newErrors.full_name = 'Name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        break;
        
      case 1:
        if (!formData.department) newErrors.department = 'Department is required';

        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(0) || !validateStep(1)) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const internData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        university: formData.university,
        skills: formData.skills
      };
      
      await internService.createIntern(internData);
      
      toast({
        title: 'Success!',
        description: 'Intern has been added successfully',
      });
      
      setTimeout(() => {
        navigate('/interns');
      }, 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add intern. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const updateFormData = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20 hover-scale transition-smooth">
          <AvatarFallback className="text-lg font-semibold">
            {formData.full_name.split(' ').map(n => n[0]).join('').toUpperCase() || 'IN'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">Profile Picture</h3>
          <p className="text-sm text-muted-foreground">Add a photo to personalize the profile</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name *
          </Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => updateFormData('full_name', e.target.value)}
            className={`transition-smooth ${errors.full_name ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
            placeholder="Enter full name"
          />
          {errors.full_name && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.full_name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className={`transition-smooth ${errors.email ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number *
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className={`transition-smooth ${errors.phone ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.phone}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="university">University</Label>
          <Input
            id="university"
            value={formData.university}
            onChange={(e) => updateFormData('university', e.target.value)}
            className="transition-smooth focus:ring-2 focus:ring-primary/20"
            placeholder="Enter university name"
          />
        </div>
      </div>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-6 animate-slide-up">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="department" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Department *
          </Label>
          <Select
            value={formData.department}
            onValueChange={(value) => updateFormData('department', value)}
          >
            <SelectTrigger className={`transition-smooth ${errors.department ? 'border-destructive' : 'focus:ring-2 focus:ring-primary/20'}`}>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="HR">Human Resources</SelectItem>
            </SelectContent>
          </Select>
          {errors.department && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.department}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position/Role</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => updateFormData('position', e.target.value)}
            className="transition-smooth focus:ring-2 focus:ring-primary/20"
            placeholder="e.g., Software Engineering Intern"
          />
        </div>


      </div>

      <div className="space-y-4">
        <Label>Skills & Technologies</Label>
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill"
            className="transition-smooth focus:ring-2 focus:ring-primary/20"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <Button type="button" onClick={addSkill} size="sm" className="hover-lift">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="hover-scale transition-smooth cursor-pointer"
              onClick={() => removeSkill(skill)}
            >
              {skill} ×
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center space-y-2">
        <CheckCircle className="h-16 w-16 text-success mx-auto" />
        <h2 className="text-2xl font-bold">Review Information</h2>
        <p className="text-muted-foreground">Please review all the information before submitting</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover-lift transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>Name:</strong> {formData.full_name || 'Not provided'}</div>
            <div><strong>Email:</strong> {formData.email || 'Not provided'}</div>
            <div><strong>Phone:</strong> {formData.phone || 'Not provided'}</div>
            <div><strong>University:</strong> {formData.university || 'Not provided'}</div>
          </CardContent>
        </Card>

        <Card className="hover-lift transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>Department:</strong> {formData.department || 'Not provided'}</div>
            <div><strong>Position:</strong> {formData.position || 'Not provided'}</div>
            <div><strong>Skills:</strong> {formData.skills.length > 0 ? formData.skills.join(', ') : 'None added'}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderPersonalInfo();
      case 1: return renderProfessionalInfo();
      case 2: return renderReview();
      default: return renderPersonalInfo();
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-4 animate-slide-in-left">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/interns')}
            className="hover-lift"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Add New Intern</h1>
            <p className="text-muted-foreground">Create a comprehensive intern profile</p>
          </div>
        </div>

        <Card className="animate-slide-up">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div 
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-smooth ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : isCompleted 
                          ? 'bg-success text-success-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="ml-2 hidden sm:block">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-4 ${
                        isCompleted ? 'bg-success' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const Icon = steps[currentStep].icon;
                return <Icon className="h-5 w-5" />;
              })()}
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>
              Step {currentStep + 1} of {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        <Card className="animate-slide-up">
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="hover-lift"
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {currentStep === steps.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="hover-lift hover-glow"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Intern
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="hover-lift"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddIntern;