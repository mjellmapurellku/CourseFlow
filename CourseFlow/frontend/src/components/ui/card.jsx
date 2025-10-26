
export const Card = ({ children, className = "" }) => (
  <div className={`bg-white border rounded-xl shadow-sm p-4 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }) => (
  <div className={`mb-2 font-semibold ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-bold ${className}`}>{children}</h3>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);
