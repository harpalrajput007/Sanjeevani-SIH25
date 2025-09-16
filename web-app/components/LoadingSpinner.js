export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-green-200 border-t-green-600 rounded-full animate-spin`}></div>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
}