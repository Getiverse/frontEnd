function LoadingSpinner({ open }: { open: boolean }) {
  return open ? (
    <div className="w-screen h-screen z-[2] left-0 fixed bg-gray-900 opacity-70 flex items-center justify-center">
      <div
        className="inline-block h-16 z-[3] w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-blue-600 motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default LoadingSpinner;
