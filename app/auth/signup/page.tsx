import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary">AniTrack</h1>
          <p className="text-subtle mt-2">Join thousands of anime fans.</p>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Create Account</h2>
          <SignupForm />
          <p className="text-subtle text-sm text-center mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-accent hover:underline font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
