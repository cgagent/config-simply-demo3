
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  hostname: z.string()
    .min(3, { message: "Hostname must be at least 3 characters." })
    .max(20, { message: "Hostname cannot exceed 20 characters." })
    .regex(/^[a-z0-9-]+$/, { message: "Hostname can only contain lowercase letters, numbers, and hyphens." })
});

type AccountSetupFormValues = z.infer<typeof formSchema>;

const AccountSetup: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AccountSetupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      hostname: ''
    }
  });

  const onSubmit = (data: AccountSetupFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call to save user profile
    setTimeout(() => {
      // Store user information in localStorage for demo purposes
      localStorage.setItem('userProfile', JSON.stringify(data));
      
      // Show success toast
      toast({
        title: "Account setup complete",
        description: `Welcome, ${data.firstName}! Your team subdomain has been created.`
      });
      
      // Redirect to home page
      navigate('/home');
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-border bg-card p-8 shadow-sm animate-fadeIn">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Complete your account</h1>
          <p className="mt-2 text-muted-foreground">
            Set up your profile to get started
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="hostname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Subdomain</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input placeholder="myteam" {...field} />
                      <span className="ml-2 text-muted-foreground">.example.com</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full group"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Setting up...' : 'Start Trial'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AccountSetup;
