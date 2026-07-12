# Propiedades AI - Agente Inmobiliario con Voz

Aplicación completa para agentes inmobiliarios con agentes de voz impulsados por inteligencia artificial. Incluye gestión de propiedades, leads, citas, suscripciones con Stripe y autenticación.

## Características

- **Panel de control del agente**: estadísticas de propiedades, leads, citas y llamadas.
- **Gestión de propiedades**: alta, edición, eliminación y listado de propiedades.
- **CRM y calificación de leads**: captura de datos, scoring con IA y seguimiento.
- **Reserva de citas con IA**: agendamiento automático desde conversaciones de voz.
- **Agentes de voz con IA**: integración con Vapi y Bland AI para llamadas entrantes/salientes.
- **Suscripciones y pagos**: Stripe Checkout y webhooks para suscripciones.
- **Autenticación**: NextAuth.js con credenciales y Google OAuth.
- **Interfaz moderna**: Next.js, React, TypeScript y Tailwind CSS.

## Requisitos

- Node.js 20+
- PostgreSQL 15+
- Cuentas de Stripe y proveedor de voz (Vapi/Bland) para producción

## Instalación local

1. Clona el repositorio e instala dependencias:

```bash
npm install
```

2. Configura las variables de entorno:

```bash
cp .env.example .env
# Edita .env con tus credenciales
```

3. Levanta PostgreSQL y aplica migraciones:

```bash
# Opción A: con Docker
docker-compose up -d postgres

# Opción B: con PostgreSQL local
npx prisma migrate dev
```

4. Genera el cliente de Prisma:

```bash
npx prisma generate
```

5. Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Despliegue con Docker

```bash
docker-compose up -d
```

La aplicación estará disponible en `http://localhost:3000`.

## Variables de entorno importantes

- `DATABASE_URL`: conexión a PostgreSQL.
- `NEXTAUTH_SECRET`: secreto para JWT.
- `NEXTAUTH_URL`: URL pública de la app.
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`.
- `VOICE_PROVIDER_API_KEY`, `VOICE_PROVIDER`, `VOICE_AGENT_ID`.
- `OPENAI_API_KEY`.

## Estructura del proyecto

- `src/app`: rutas y páginas de Next.js.
- `src/app/api`: API REST.
- `src/components`: componentes de React.
- `src/lib`: utilidades, autenticación y proveedores de voz/Stripe.
- `prisma`: esquema y migraciones de la base de datos.

## Scripts

- `npm run dev`: servidor de desarrollo.
- `npm run build`: compilación para producción.
- `npm run start`: servidor de producción.
- `npm run lint`: análisis estático.
- `npx prisma migrate dev`: migraciones de base de datos.
- `npx prisma generate`: generación del cliente Prisma.
