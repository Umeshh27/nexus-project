export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeMap[size]} border-3 border-gray-200 border-t-navy-500 rounded-full animate-spin`}></div>
      {text && <p className="text-sm text-gray-400 mt-3">{text}</p>}
    </div>
  );
}
