# Tip Jar Farcaster Miniapp - Design Guidelines

## Design Approach
**Reference-Based**: Inspired by Venmo's clean payment interface and Farcaster's native UI patterns - simple, trustworthy transaction flows with card-based layouts optimized for mobile-first Farcaster client integration.

## Color System
- **Primary**: #8A63D2 (Farcaster purple) - CTAs, active states, branding
- **Secondary**: #1DA1F2 (trust blue) - secondary actions, informational elements
- **Background**: #FFFFFF (clean white) - main background
- **Success**: #00D395 (mint green) - success states, confirmations
- **Error**: #FF6B6B (soft red) - error states, warnings
- **Text**: #1C1E21 (dark) - primary text content

## Typography
- **Primary Font**: SF Pro Display (iOS/Mac) with Inter as fallback
- **Hierarchy**:
  - Large headings: 24px-32px, semibold (600)
  - Section headings: 18px-20px, semibold (600)
  - Body text: 16px, regular (400)
  - Small text/labels: 14px, medium (500)
  - Input text: 16px, regular (400)

## Layout System
**Spacing Units**: Use Tailwind spacing - 2, 4, 8, 12, 16 units
- Base spacing: 16px (p-4, m-4)
- Section gaps: 32px (gap-8)
- Card padding: 24px (p-6)
- Component spacing: 12px (space-y-3)

**Container**: max-w-md (448px) centered with px-4 padding for mobile-first design

## Core Components

### User Profile Card
- Display creator's Farcaster avatar (48px rounded-full) and name from SDK context
- Show connected user's FID and username below avatar
- Card background with subtle border, 16px padding
- Avatar positioned prominently at top center

### Tip Input Form
- Large, prominent amount input field (text-lg, py-3, px-4)
- Currency selector (ETH/USDC) as radio buttons or segmented control
- Clear focus states with purple accent border
- Validation messages in error red color

### Send Tip Button
- Full-width primary button in Farcaster purple (#8A63D2)
- Height: 48px (py-3), rounded-lg, font-semibold
- Loading state: spinner with disabled appearance
- Success state: mint green background (#00D395) with checkmark
- Error state: soft red background (#FF6B6B) with error icon

### Status Messages
- Success: mint green background with white text, rounded corners
- Error: soft red background with white text, rounded corners
- Info: trust blue background with white text
- Position below main action button

## Interaction States
- **Default**: Clean, minimal shadows (shadow-sm)
- **Hover**: Slight brightness increase on buttons, no color change
- **Active**: Scale down slightly (scale-95), deeper shadow
- **Loading**: Disabled appearance with spinner, prevent multiple clicks
- **Success**: Animated checkmark, green confirmation
- **Error**: Shake animation, red message display

## Mobile Optimization
- Touch targets minimum 44px height
- Form inputs optimized for mobile keyboards
- Single column layout throughout
- Bottom sheet style for modals/overlays if needed
- Safe area padding for notched devices

## Farcaster SDK Integration Display
- Show user.fid and user.username prominently
- Display user.displayName as primary name
- Use user.pfpUrl for avatar with fallback gradient
- Context-aware messaging (location type indicators)

## Production Requirements
- Manifest file setup at /.well-known/farcaster.json
- Meta tags for cast embeds with proper miniapp schema
- Splash screen with Farcaster purple background
- Icon design: simple, recognizable at small sizes