# Family Tree Web Application - Design Guidelines

## Design Approach

**Hybrid Approach: Material Design Foundation + Heritage Customization**

This family data management application requires a utility-focused foundation with cultural warmth. We'll use Material Design principles for the functional components (forms, admin panel, data tables) while infusing traditional Middle Eastern design sensibility through color, typography, and decorative elements.

### Core Design Principles
- **Clarity First**: Family relationships must be immediately understandable
- **Cultural Respect**: Heritage aesthetic that honors family traditions
- **Functional Beauty**: Every visual element serves a purpose
- **Accessible Hierarchy**: Clear distinction between public and private information

## Color Palette

### Light Mode
- **Primary**: 215 45% 25% (Deep Navy Blue - authority, trust)
- **Secondary**: 28 35% 55% (Warm Terracotta - heritage, warmth)
- **Surface**: 0 0% 98% (Off-white backgrounds)
- **Surface Variant**: 35 20% 92% (Light Sand - subtle containers)
- **On Primary**: 0 0% 100% (White text on dark)
- **On Surface**: 215 25% 15% (Near black for body text)
- **Border**: 215 15% 85% (Subtle dividers)
- **Success**: 142 70% 35% (Family connections confirmed)
- **Warning**: 28 85% 50% (Sensitive information indicators)

### Dark Mode
- **Primary**: 215 50% 65% (Lighter navy for contrast)
- **Secondary**: 28 40% 60% (Lighter terracotta)
- **Surface**: 215 20% 12% (Dark navy background)
- **Surface Variant**: 215 15% 18% (Elevated containers)
- **On Primary**: 215 25% 10% (Dark text on light primary)
- **On Surface**: 0 0% 92% (Light text on dark)
- **Border**: 215 10% 25% (Dark mode dividers)

## Typography

**Font Stack**: 
- **Arabic Primary**: 'Noto Kufi Arabic', 'Cairo', sans-serif (Google Fonts)
- **Latin Fallback**: 'Inter', 'Segoe UI', system-ui, sans-serif
- **Monospace**: 'Roboto Mono' (for IDs, technical data)

### Type Scale
- **H1 (Hero)**: text-4xl md:text-5xl, font-bold, tracking-tight
- **H2 (Section)**: text-3xl md:text-4xl, font-semibold
- **H3 (Card Titles)**: text-xl md:text-2xl, font-semibold
- **Body Large**: text-base md:text-lg, font-normal, leading-relaxed
- **Body**: text-sm md:text-base, font-normal, leading-relaxed
- **Caption**: text-xs md:text-sm, font-medium, tracking-wide
- **Button**: text-sm md:text-base, font-semibold

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-16
- Card gaps: gap-4 to gap-6
- Icon-text spacing: gap-2

**Responsive Containers**:
- Tree view: w-full h-screen (full viewport for canvas)
- Admin panel: max-w-7xl mx-auto px-4
- Modals: max-w-2xl for person details, max-w-md for login
- Cards: w-64 md:w-72 (tree nodes)

## Component Library

### Family Tree Canvas
- **Background**: Subtle geometric Islamic pattern overlay (5% opacity)
- **Zoom Controls**: Fixed bottom-right, rounded-full buttons with backdrop-blur
- **Connection Lines**: 
  - Parent-child: Solid 2px primary color with slight curve
  - Spousal: Horizontal connector with decorative center dot
  - Side relations: Dashed 1.5px secondary color

### Person Cards (Tree Nodes)
- **Structure**: Rounded-xl (12px), shadow-md, border border-border
- **Header**: Gradient from primary to primary/90, text-on-primary
- **Avatar**: Circular initial badge (text-2xl) or placeholder icon
- **Content**: p-4, clean grid layout
- **Hover State**: shadow-lg, scale-105 transform, ring-2 ring-primary/20
- **Privacy Indicator**: Small lock icon (text-xs) for protected info

### Modal/Dialog (Person Details)
- **Overlay**: backdrop-blur-sm bg-black/50
- **Container**: rounded-2xl, max-h-[90vh], overflow-y-auto
- **Header**: Sticky top with close button, border-b
- **Sections**: Divided by subtle borders, icon-label pairs
- **WhatsApp Display**: Distinctive highlight with click-to-copy functionality

### Admin Panel
- **Sidebar Navigation**: w-64, fixed left, bg-surface-variant
- **Navigation Items**: px-4 py-3, rounded-lg, hover:bg-primary/10
- **Active State**: bg-primary text-on-primary
- **Data Tables**: Striped rows, sticky header, sortable columns
- **Action Buttons**: Icon + label, color-coded (edit: primary, delete: error)

### Forms (Login, Edit Person)
- **Container**: bg-surface rounded-xl p-6 md:p-8, shadow-lg
- **Input Fields**: 
  - Border: border-2 border-border
  - Focus: ring-2 ring-primary, border-primary
  - Dark mode: bg-surface-variant with light border
  - Height: h-12, text-base
- **Labels**: text-sm font-medium mb-2, text-on-surface/70
- **Submit Button**: w-full h-12, rounded-lg, bg-primary hover:bg-primary/90

### Navigation Header
- **Structure**: Sticky top-0 z-50, backdrop-blur-lg bg-surface/80
- **Height**: h-16 md:h-20
- **Content**: Flex justify-between, max-w-7xl mx-auto px-4
- **Logo Area**: Arabic calligraphy-style family name, text-xl font-bold
- **Auth State**: User avatar/menu or login button

### Status Indicators
- **Role Badges**: 
  - Admin: bg-primary/10 text-primary border border-primary/20
  - User: bg-secondary/10 text-secondary border border-secondary/20
- **Relationship Tags**: Pill-shaped, text-xs, with relationship icon
- **Generation Markers**: Vertical timeline-style indicators in tree view

## Visual Enhancements

### Decorative Elements
- **Dividers**: Traditional geometric pattern (single line, 1px height)
- **Card Corners**: Subtle ornamental SVG elements (optional accent)
- **Empty States**: Illustrated family tree icon with warm messaging

### Iconography
Use **Heroicons** (outline for general UI, solid for active states):
- User management: UserIcon, UserGroupIcon
- Relationships: HeartIcon, LinkIcon
- Privacy: LockClosedIcon, EyeIcon, EyeSlashIcon
- Actions: PencilIcon, TrashIcon, PlusIcon
- Tree: HomeIcon, AcademicCapIcon (for generations)

### Interactions
**Minimal, Purposeful Animations**:
- Card hover: `transition-all duration-200 ease-in-out`
- Modal entry: `transition-opacity duration-300`
- Loading states: Subtle pulse on skeleton cards
- Tree pan/zoom: Smooth transform with CSS `transition: transform 0.3s ease`

**No decorative animations** - keep interactions functional

## Responsive Strategy

### Desktop (lg: 1024px+)
- Side-by-side admin panel with tree view
- Multi-column forms (2-col grid)
- Horizontal relationship displays

### Tablet (md: 768px)
- Collapsible admin sidebar (hamburger menu)
- Single column forms with wider inputs
- Stacked relationship cards

### Mobile (base: 320px+)
- Full-screen tree view with overlay controls
- Bottom sheet modals instead of center dialogs
- Vertical scrolling for all lists
- Touch-optimized buttons (min h-12, larger tap targets)

## Accessibility & Privacy

- **Privacy Layers**: Visual distinction (lock icons, blur filter) for logged-out users viewing protected data
- **ARIA Labels**: Comprehensive labels for tree navigation, relationship context
- **Keyboard Navigation**: Tab through cards, arrow keys for tree navigation
- **Focus Indicators**: Thick 3px ring with primary color at 60% opacity
- **RTL Support**: Full mirror layout for Arabic text flow, flip icons appropriately
- **Color Contrast**: Minimum 4.5:1 for body text, 7:1 for headings

## Data Visualization Specifics

### Tree Layout Algorithm
- **Vertical Hierarchy**: Generations stack top-to-bottom
- **Spousal Pairing**: Horizontal alignment with connecting line
- **Branch Spacing**: Minimum 320px horizontal gap between family units
- **Zoom Levels**: 50% (overview), 100% (default), 150% (detail focus)

### Relationship Connectors
- **Parent → Child**: Curved Bézier from parent card bottom to child card top
- **Spouse ↔ Spouse**: Straight horizontal line with decorative center junction
- **Side Relations**: Diagonal dashed line with label midpoint badge

This design system creates a dignified, culturally respectful interface that balances modern web functionality with traditional aesthetic values, ensuring family data is presented with clarity and warmth.