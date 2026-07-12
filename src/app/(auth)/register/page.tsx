import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Crear cuenta
        </h1>
        <p className="mt-2 text-zinc-600">
          Comienza a gestionar propiedades con IA
        </p>
        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
