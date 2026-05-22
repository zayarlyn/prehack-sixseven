import { forwardRef } from 'react';
import { Button as ShadcnButton, type ButtonProps as ShadcnButtonProps } from '@swap-web/common/components/ui/button';
import { cn } from '@swap-web/common/lib/utils';

type OdVariant = 'primary' | 'secondary' | 'tertiary' | 'icon';
type OdSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ShadcnButtonProps, 'variant' | 'size'> {
  variant?: OdVariant;
  size?: OdSize;
}

const VARIANT_MAP = {
  primary: 'default',
  secondary: 'outline',
  tertiary: 'ghost',
  icon: 'ghost',
} as const;

const HEIGHT: Record<OdSize, string> = {
  sm: 'h-9',
  md: 'h-11',
  lg: 'h-[50px] px-8',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    const isIcon = variant === 'icon';

    return (
      <ShadcnButton
        ref={ref}
        variant={VARIANT_MAP[variant]}
        size={isIcon ? 'icon' : 'default'}
        className={cn(
          !isIcon && HEIGHT[size],
          variant === 'secondary' && 'border-primary text-primary hover:bg-accent hover:text-primary',
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export default Button;
