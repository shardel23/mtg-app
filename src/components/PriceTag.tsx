type PriceTagProps = {
  price: number;
};

export default function PriceTag({ price }: PriceTagProps) {
  return (
    <div className="absolute bottom-0 left-0 rounded-full bg-black bg-opacity-50 px-1 py-0.5 text-xxs md:px-2 md:py-1 md:text-xs">
      {`$${price !== 0 ? price.toFixed(2) : "--"}`}
    </div>
  );
}
