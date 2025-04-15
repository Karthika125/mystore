
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);
  
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await signUp(data.email, data.password);
      setIsLogin(true);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">{isLogin ? 'Sign In' : 'Create Account'}</h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              className="ml-1 text-primary hover:underline"
              onClick={() => {
                setIsLogin(!isLogin);
                loginForm.reset();
                registerForm.reset();
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
        
        {isLogin ? (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input 
                id="login-email" 
                type="email" 
                {...loginForm.register('email')} 
              />
              {loginForm.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input 
                id="login-password" 
                type="password" 
                {...loginForm.register('password')} 
              />
              {loginForm.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input 
                id="register-email" 
                type="email" 
                {...registerForm.register('email')} 
              />
              {registerForm.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">{registerForm.formState.errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input 
                id="register-password" 
                type="password" 
                {...registerForm.register('password')} 
              />
              {registerForm.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">{registerForm.formState.errors.password.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <Input 
                id="confirm-password" 
                type="password" 
                {...registerForm.register('confirmPassword')} 
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        )}
      </div>
    </Layout>
  );
}
