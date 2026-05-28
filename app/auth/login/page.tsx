import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary">AniTrack</h1>
          <p className="text-subtle mt-2">Your anime journey, tracked.</p>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Sign In</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
