# AI Agent Instructions for PH Health Care Server

This document provides essential knowledge for AI agents working with the PH Health Care Server codebase.

## Project Architecture

### Core Components
- **Backend Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with bcryptjs
- **Payment Processing**: Stripe integration
- **File Storage**: Cloudinary integration

### Module Structure
```
src/app/modules/
├── admin/         # Admin management
├── appointment/   # Appointment booking and management
├── auth/         # Authentication and authorization
├── doctor/       # Doctor profile and management
├── patient/      # Patient profile and management
├── schedule/     # Time slot management
└── specialties/  # Medical specialties
```

### Key Design Patterns

1. **Service Layer Pattern**
   - Each module follows controller-service-route structure
   - Example: `appointment.service.ts`, `appointment.controller.ts`, `appointment.route.ts`

2. **Transaction Handling**
   - Uses Prisma transactions for multi-step operations
   - Example in `appointment.service.ts`:
   ```typescript
   const result = await prisma.$transaction(async (tnx) => {
     // Multiple database operations
   });
   ```

3. **Error Handling**
   - Custom `ApiError` class in `errorHelpers/`
   - Global error handler middleware

### Integration Points

1. **Stripe Payment Integration**
   - Payment processing in `appointment.service.ts`
   - Uses webhook handlers for payment status updates

2. **Video Calling**
   - UUID-based video calling IDs generated for appointments
   - Integration point prepared in appointment creation flow

## Development Workflow

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables (required):
   ```
   DATABASE_URL=
   JWT_SECRET=
   STRIPE_SECRET_KEY=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```
3. Initialize database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

### Running the Project
```bash
npm run dev  # Starts development server with hot-reload
```

## Project-Specific Conventions

1. **Schema Organization**
   - Prisma schemas are modular, split into domain-specific files under `prisma/schema/`
   - Main schema imports all domain schemas

2. **Authentication Flow**
   - Role-based access control (admin/doctor/patient)
   - JWT stored in HTTP-only cookies
   - Refresh token rotation pattern

3. **API Response Format**
   - Consistent response structure using `sendResponse` helper
   - All responses include `success`, `statusCode`, `message`, and `data`

## Common Workflows

1. **Adding New Features**
   - Create module folder under `src/app/modules/`
   - Implement controller, service, and route files
   - Add route to `src/app/routes/index.ts`
   - Update Prisma schema if needed

2. **Database Changes**
   - Add/modify schema in `prisma/schema/`
   - Run `npx prisma migrate dev --name descriptive_name`
   - Update related service layer implementations