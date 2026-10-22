import { site } from "@/lib/site";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="text-center text-2xl font-extrabold tracking-tight text-[#174abc] mb-6">{site.name}</div>
        <h1 className="text-xl font-bold text-center mb-6">ადმინ პანელი</h1>
        <LoginForm />
      </div>
    </div>
  );
}
