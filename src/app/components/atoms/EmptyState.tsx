export const EmptyState = ({ label }: { label: string }) => (
  <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 text-gray-400 mx-auto mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M19 11H5m14-7H5m14 14H5"
      />
    </svg>
    <p className="text-gray-500">{label}</p>
  </div>
);
