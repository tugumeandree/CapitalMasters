export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Animated Spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-primary-100 rounded-full"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <p className="text-gray-600 font-semibold text-lg">Loading...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait while we prepare your content</p>
      </div>
    </div>
  );
}
