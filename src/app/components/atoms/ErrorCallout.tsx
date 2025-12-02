export const ErrorCallout = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center w-full h-full text-warning-600 bg-danger-50 rounded-lg border-2 border-danger-200 p-6 text-center">
    <p className="text-gray-500">{label}</p>
  </div>
);
