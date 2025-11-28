# Tip Jar - Farcaster Miniapp

## Overview

Tip Jar is a Farcaster miniapp that enables users to send cryptocurrency tips (ETH or USDC) to creators directly within the Farcaster ecosystem. The application provides a simple, mobile-first interface for generating payment links and facilitating crypto tipping transactions.

**Key Features:**
- Send crypto tips in ETH or USDC
- Farcaster miniapp integration with SDK
- Mobile-first, card-based UI inspired by Venmo
- Ethereum address validation
- Payment URL generation for tip transactions

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Stack:**
- React with TypeScript
- Vite for build tooling and development server
- Wouter for client-side routing
- TanStack Query for server state management

**UI System:**
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Mobile-first responsive design (max-w-md container)
- Custom color system aligned with Farcaster branding (#8A63D2 primary purple)

**Design Philosophy:**
The application follows a reference-based design approach inspired by Venmo's payment interface. The UI emphasizes trust and simplicity with:
- Card-based layouts for content organization
- Large, touch-friendly interactive elements
- Clear visual hierarchy with semibold headings (SF Pro Display/Inter fallback)
- Consistent spacing using Tailwind's spacing scale (base 16px)

**State Management:**
- Form state managed by React Hook Form with Zod validation
- Server state cached via TanStack Query with infinite stale time
- Local component state for UI interactions (status banners, settings)

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- HTTP server created via Node's `http` module
- Custom logging middleware for request/response tracking

**API Design:**
RESTful endpoints with JSON request/response format:
- `POST /api/tip` - Generate payment URL for tip transaction
- `POST /api/validate-address` - Validate Ethereum addresses

**Validation Layer:**
Shared Zod schemas between client and server ensure type safety and consistent validation:
- `tipRequestSchema` - Validates tip amount, currency, and target address
- `validateAddressSchema` - Validates Ethereum address format
- Currency restricted to enum of "ETH" | "USDC"

**Error Handling:**
Zod validation errors return 400 status with descriptive error messages. Server errors return 500 status with generic failure messages to avoid leaking implementation details.

### Data Storage Solutions

**Current Implementation:**
In-memory storage via `MemStorage` class (no persistence). The application is currently stateless with no database integration.

**Database Configuration:**
Drizzle ORM configured for PostgreSQL with:
- Schema definitions in `shared/schema.ts`
- Neon serverless PostgreSQL driver
- Migration management via `drizzle-kit push`

The database infrastructure is prepared but not actively used. Future implementations could persist tip history, user preferences, or transaction records.

### Authentication and Authorization

**Farcaster Integration:**
Authentication handled via Farcaster Miniapp SDK:
- SDK context provides authenticated user information (FID, username, display name, avatar)
- `useFarcaster` hook manages SDK initialization and context retrieval
- Demo mode fallback for testing outside Farcaster client
- Haptic feedback integration for native-like interactions

**Security Approach:**
No traditional session-based authentication. User identity derived from Farcaster SDK context. The miniapp operates within Farcaster's security model where the parent client handles authentication.

### External Dependencies

**Farcaster Miniapp SDK (`@farcaster/miniapp-sdk`):**
- Provides miniapp lifecycle management (`sdk.actions.ready()`)
- Exposes user context with FID, username, and profile data
- Enables wallet provider access for crypto transactions
- Defines miniapp metadata in `.well-known/farcaster.json`

**Ethereum/Crypto Infrastructure:**
Payment URLs generated for tip transactions (implementation details abstracted in `generatePaymentUrl` function). The application prepares for blockchain interactions but delegates actual transaction execution to external wallet providers.

**Required Capabilities:**
- `actions.ready` - Miniapp initialization signal
- `wallet.getEthereumProvider` - Access to user's Ethereum wallet
- Required chains: Ethereum mainnet (eip155:1) and Base (eip155:8453)

**UI Component Libraries:**
- Radix UI primitives for accessible, unstyled components
- Lucide React for icon system
- Class Variance Authority for component variant management
- Tailwind Merge and CLSX for dynamic className composition

**Development Tools:**
- Replit-specific plugins for error overlay, cartographer, and dev banner
- ESBuild for server bundling with selective dependency bundling
- TypeScript path aliases (@/, @shared/, @assets/) for clean imports

**Build Strategy:**
Two-phase build process:
1. Vite builds client to `dist/public`
2. ESBuild bundles server to `dist/index.cjs` with allowlisted dependencies bundled to reduce cold start syscalls