/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* shadcn semantic tokens */
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        /* OD design tokens */
        'od-primary':         'var(--od-primary)',
        'od-primary-hover':   'var(--od-primary-hover)',
        'od-bg':              'var(--od-bg)',
        'od-bg-deep':         'var(--od-bg-deep)',
        'od-surface':         'var(--od-surface)',
        'od-surface-alt':     'var(--od-surface-alt)',
        'od-bubble-received': 'var(--od-bubble-received)',
        'od-border-strong':   'var(--od-border-strong)',
        'od-text':            'var(--od-text)',
        'od-text-secondary':  'var(--od-text-secondary)',
        'od-text-tertiary':   'var(--od-text-tertiary)',
        'od-success':         'var(--od-success)',
        'od-success-dark':    'var(--od-success-dark)',
        'od-error':           'var(--od-error)',
        'od-error-tint':      'var(--od-error-tint)',
      },
      borderRadius: {
        /* shadcn tokens */
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        /* OD tokens */
        'od-xs':   'var(--od-radius-xs)',
        'od-sm':   'var(--od-radius-sm)',
        'od-md':   'var(--od-radius-md)',
        'od-lg':   'var(--od-radius-lg)',
        'od-xl':   'var(--od-radius-xl)',
        'od-2xl':  'var(--od-radius-2xl)',
        'od-pill': 'var(--od-radius-pill)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'od-spin': 'spin 700ms linear infinite',
      },
      boxShadow: {
        'od-nav':        'var(--od-shadow-nav)',
        'od-card':       'var(--od-shadow-card)',
        'od-card-hover': 'var(--od-shadow-card-hover)',
        'od-popover':    'var(--od-shadow-popover)',
        'od-modal':      'var(--od-shadow-modal)',
        'od-sticky':     'var(--od-shadow-sticky)',
      },
      fontFamily: {
        'od-sans': 'var(--od-font-sans)',
        'od-mono': 'var(--od-font-mono)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
