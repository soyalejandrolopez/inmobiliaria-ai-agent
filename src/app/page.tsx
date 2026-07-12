import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center">
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
        Agente inmobiliario con voz e IA
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-zinc-600">
        Automatiza la captación de leads, la calificación de clientes y la reserva de citas con un
        agente de voz impulsado por inteligencia artificial.
      </p>
      <div className="mt-10 flex gap-4">
        <Link href="/register">
          <Button size="lg">Crear cuenta</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg">
            Iniciar sesión
          </Button>
        </Link>
      </div>
    </div>
  );
}
