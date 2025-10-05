import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-green-600 hover:bg-green-700 text-sm normal-case",
          },
        }}
      />
    </div>
  );
}