import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { IconType } from 'react-icons';
import { ImSpinner2 } from 'react-icons/im';

import { cn } from '@/lib/utils';

const ButtonVariant = ['primary', 'outline', 'ghost', 'light', 'dark'] as const;
const ButtonSize = ['sm', 'base'] as const;

type ButtonProps = {
  isLoading?: boolean;
  isDarkBg?: boolean;
  variant?: (typeof ButtonVariant)[number];
  size?: (typeof ButtonSize)[number];
  leftIcon?: IconType | LucideIcon;
  rightIcon?: IconType | LucideIcon;
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
  };
} & React.ComponentPropsWithRef<'button'>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = 'primary',
      size = 'base',
      isDarkBg = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      classNames,
      ...rest
    },
    ref,
  ) => {
    const disabled = isLoading || buttonDisabled;

    const getBaseClassNames = (
      size: (typeof ButtonSize)[number],
      variant: (typeof ButtonVariant)[number],
      isDarkBg: boolean,
      isLoading: boolean | undefined,
      className: string | undefined,
    ): string => {
      return cn(
        'inline-flex items-center rounded font-medium',
        'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
        'shadow-sm',
        'transition-colors duration-75',
        sizeClasses(size),
        variantClasses(variant, isDarkBg),
        'disabled:cursor-not-allowed',
        isLoading &&
          'relative text-transparent transition-none hover:text-transparent disabled:cursor-wait',
        className,
      );
    };

    const baseClassNames = getBaseClassNames(
      size,
      variant,
      isDarkBg,
      isLoading,
      className,
    );

    function sizeClasses(size: (typeof ButtonSize)[number]) {
      const sizes = {
        base: ['px-3 py-1.5', 'text-sm md:text-base'],
        sm: ['px-2 py-1', 'text-xs md:text-sm'],
      };
      return sizes[size] || [];
    }

    function variantClasses(
      variant: (typeof ButtonVariant)[number],
      isDarkBg: boolean,
    ) {
      const variantClass = {
        primary: [
          'bg-primary-500 text-white',
          'border-primary-600 border',
          'hover:bg-primary-600 hover:text-white',
          'active:bg-primary-700',
          'disabled:bg-primary-700',
        ],
        outline: [
          'text-primary-500',
          'border-primary-500 border',
          'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
          isDarkBg &&
            'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
        ],
        ghost: [
          'text-primary-500',
          'shadow-none',
          'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
          isDarkBg &&
            'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
        ],
        light: [
          'bg-white text-gray-700',
          'border border-gray-300',
          'hover:text-dark hover:bg-gray-100',
          'active:bg-white/80 disabled:bg-gray-200',
        ],
        dark: [
          'bg-gray-900 text-white',
          'border border-gray-600',
          'hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-700',
        ],
      };

      return variantClass[variant] || [];
    }

    return (
      <button
        ref={ref}
        type='button'
        disabled={disabled}
        className={baseClassNames}
        {...rest}
      >
        {isLoading && <LoadingSpinner variant={variant} />}
        {LeftIcon && (
          <IconComponent
            Icon={LeftIcon}
            side='left'
            size={size}
            className={classNames?.leftIcon}
          />
        )}
        {children}
        {RightIcon && (
          <IconComponent
            Icon={RightIcon}
            side='right'
            size={size}
            className={classNames?.rightIcon}
          />
        )}
      </button>
    );
  },
);

const LoadingSpinner = ({
  variant,
}: {
  variant: (typeof ButtonVariant)[number];
}) => (
  <div
    className={cn(
      'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
      {
        'text-white': ['primary', 'dark'].includes(variant),
        'text-black': ['light'].includes(variant),
        'text-primary-500': ['outline', 'ghost'].includes(variant),
      },
    )}
  >
    <ImSpinner2 className='animate-spin' />
  </div>
);

const IconComponent = ({
  Icon,
  side,
  size,
  className,
}: {
  Icon: React.ElementType;
  side: 'left' | 'right';
  size: (typeof ButtonSize)[number];
  className?: string;
}) => (
  <div
    className={cn([
      size === 'base' && (side === 'left' ? 'mr-1' : 'ml-1'),
      size === 'sm' && (side === 'left' ? 'mr-1.5' : 'ml-1.5'),
    ])}
  >
    <Icon
      size='1em'
      className={cn(
        [
          size === 'base' && 'md:text-md text-md',
          size === 'sm' && 'md:text-md text-sm',
        ],
        className,
      )}
    />
  </div>
);

export default Button;
