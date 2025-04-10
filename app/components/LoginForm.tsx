'use client'
import { Button } from 'app/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from 'app/components/ui/card'
import { Input } from 'app/components/ui/input'
import { Label } from 'app/components/ui/label'
import { Lock, User } from 'lucide-react'
import React, { useState } from 'react'
import { authenticate, AuthenticationRequest, register } from '../api/auth'

interface LoginFormProps {
  onAuthSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onAuthSuccess }) => {
  const [credentials, setCredentials] = useState<AuthenticationRequest>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev: AuthenticationRequest) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (isSignUp) {
        response = await register(credentials);
      } else {
        response = await authenticate(credentials);
      }

      if (response) {
        onAuthSuccess();
      } else {
        setError(JSON.parse(response).message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Card className="w-full" style={{ minWidth: "330px" }}>
        <CardHeader>
          <CardTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  className="pl-8"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="pl-8"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center">
            {isSignUp ? (
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                Create account
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                Sign In
              </Button>
            )}
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground mt-2"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Create One'}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm
