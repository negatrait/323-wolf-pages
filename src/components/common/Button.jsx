export function Button({ variant = 'primary', size = 'md', href, onClick, disabled, children, class: cls = '' }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary: 'bg-primary text-dark-900 hover:bg-primary-dark',
    secondary: 'bg-dark-600 text-white hover:bg-dark-500',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'text-dark-300 hover:text-white hover:bg-dark-700',
  };

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${cls}`;

  if (href) {
    return <a href={href} class={classes} onClick={onClick}>{children}</a>;
  }
  return <button class={classes} onClick={onClick} disabled={disabled}>{children}</button>;
}
