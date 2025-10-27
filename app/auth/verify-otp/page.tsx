'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useVerifyOtpMutation } from '@/lib/store';
import { ArrowLeft } from 'lucide-react';

interface VerifyOtpFormProps {
  onEmailLoaded: (email: string) => void;
}

function VerifyOtpForm({ onEmailLoaded }: VerifyOtpFormProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email') || '';
    onEmailLoaded(emailParam);
  }, [searchParams, onEmailLoaded]);

  return null;
}

function VerifyOtpContent() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const router = useRouter();

  const handleEmailLoaded = (emailParam: string) => {
    setEmail(emailParam);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    try {
      await verifyOtp({ email, otp }).unwrap();
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
    } catch (err: any) {
      setError(err.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyOtpForm onEmailLoaded={handleEmailLoaded} />
      </Suspense>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-center">
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
                className="gap-3"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#CD671C] hover:bg-[#B85A18] text-white"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button type="button" className="text-[#CD671C] hover:underline">
                  Resend
                </button>
              </p>
              <Link 
                href="/auth/forgot-password" 
                className="inline-flex items-center text-sm text-[#CD671C] hover:underline"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Email
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4"><div>Loading...</div></div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}