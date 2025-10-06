import React from 'react';

const PageHeader = ({ 
  title = "Dashboard", 
  buttons = [], 
  className = "flex justify-between items-center" 
}) => {
  return (
    <div className={className}>
      <h2 className="font-semibold text-2xl">{title}</h2>
      
      {buttons.length > 0 && (
        <div className="flex gap-5">
          {buttons.map((button, index) => (
            <PageHeaderButton key={index} {...button} />
          ))}
        </div>
      )}
    </div>
  );
};

const PageHeaderButton = ({ 
  text, 
  icon, 
  onClick, 
  variant = "outline", 
  size = "default",
  className = "",
  disabled = false 
}) => {
  const baseClasses = "px-4 py-2 flex items-center justify-center gap-2 border rounded transition-colors";
  
  const variants = {
    outline: "text-[var(--blue700)] border-[var(--blue700)] hover:bg-[var(--blue700)] hover:text-white",
    filled: "bg-[var(--blue700)] text-white border-[var(--blue700)] hover:bg-[var(--blue800)]",
    ghost: "text-[var(--blue700)] border-transparent hover:bg-[var(--blue100)]"
  };

  const sizes = {
    small: "w-32 text-sm",
    default: "w-40",
    large: "w-48 text-lg"
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  }`;

  return (
    <button 
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
      {icon && <span>{icon}</span>}
    </button>
  );
};

export default PageHeader;
