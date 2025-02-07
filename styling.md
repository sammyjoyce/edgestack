# Styling Rules

## Colors

### Backgrounds
backgrounds:
  primary: bg-brick        // Brick inspired sections
  secondary: bg-timber     // Timber inspired areas
  tertiary: bg-sisal       // Sisal inspired elements
  quaternary: bg-travertine // Travertine inspired elements
  highlight: bg-gold       // Gold highlights
backgrounds:
  primary: bg-black        // Marketing sections
  secondary: bg-gray-900   // Content areas
  tertiary: bg-gray-800   // Cards, containers
  quaternary: bg-gray-700  // Interactive elements

### Borders
borders:
  primary: border-brick
  secondary: border-timber
  tertiary: border-sisal
borders:
  primary: border-gray-800
  secondary: border-gray-700
  tertiary: border-gray-600

### Text Colors
text:
  primary: text-timber
  secondary: text-sisal
  highlight: text-gold
text:
  primary: text-gray-100
  secondary: text-gray-300
  tertiary: text-gray-400
  gradient: bg-linear-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent
  responsive_gradient:
    mobile: sm:bg-linear-to-b
    tablet_up: md:bg-linear-to-r

## Typography

### Font Sizes
text_sizes:
  display:
    desktop: text-[64px] leading-[68px] tracking-[-1.43px]
    tablet: md:text-[52px] md:leading-[56px]
    mobile: sm:text-[40px] sm:leading-[44px]
  
  title1:
    desktop: text-4xl leading-tight tracking-[-1.43px]
    mobile: sm:text-2xl
  
  title2:
    desktop: text-2xl leading-tight tracking-[-0.37px]
    mobile: sm:text-xl
  
  title3:
    desktop: text-xl leading-snug
    mobile: sm:text-[17px]
  
  body:
    large: text-lg sm:text-base leading-relaxed
    regular: text-[15px] sm:text-[14px] leading-normal
    small: text-[13px] leading-tight
    mini: text-xs leading-none
    micro: text-[11px] leading-none

### Common Text Patterns
common_patterns:
  hero: text-[64px] leading-[68px] tracking-[-1.43px] sm:text-[40px] sm:leading-[44px] sm:tracking-[-0.015em]
  section_header: text-[32px] leading-tight tracking-[-0.5px] sm:text-[24px] sm:leading-snug
  navigation: text-[13px] leading-none font-medium sm:text-[15px] sm:leading-loose
  caption: text-xs text-gray-400 leading-normal tracking-wide

## Animations & Transitions

### Transitions
transitions:
  natural: transition-natural
transitions:
  default: transition-all duration-300 ease-in-out
  fast: transition-all duration-150 ease-in-out
  slow: transition-all duration-500 ease-in-out

### Transform Values
hover_states:
  scale: hover:scale-102 active:scale-98
  opacity: hover:opacity-80
  background: hover:bg-gray-800
