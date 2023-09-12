import LoadingBlock from "./loadingBlock";

export default function LoadingGrid() {
  return (
    <div className={`grid grid-cols-3 md:grid-cols-5 gap-1`}>
      {[...Array(15)].map((_, i) => (
        <LoadingBlock key={i} className="w-full h-0 pb-[125%]" />
      ))}
    </div>
  );
}
