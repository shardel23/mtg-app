import LoadingBlock from "./LoadingBlock";

export default function LoadingGrid() {
  return (
    <div className={`grid grid-cols-3 gap-1 md:grid-cols-5`}>
      {[...Array(15)].map((_, i) => (
        <LoadingBlock key={i} className="h-0 w-full pb-[125%]" />
      ))}
    </div>
  );
}
