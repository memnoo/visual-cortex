export const Loader = ({ text }: { text: string }) => (
  <div className="text-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-[80px] border-purple-600 mx-auto mb-4"></div>
    <p className="text-purple-600 font-semibold">{text}</p>
  </div>
);
