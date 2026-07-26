export default function LoadingSpinner({
  size = "md",
  label,
}: {
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const dims = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };
  const borders = { sm: "border-2", md: "border-2", lg: "border-[3px]" };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${dims[size]} ${borders[size]} rounded-full border-slate-700 border-t-blue-500 animate-spin`}
      />
      {label && <p className="text-xs text-slate-400 animate-pulse">{label}</p>}
    </div>
  );
}
