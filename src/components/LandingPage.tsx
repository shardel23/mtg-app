import previewAlbum from "@/assets/landing/preview-album.png";
import previewCard from "@/assets/landing/preview-card.png";
import {
  CreditCard,
  LayoutGrid,
  LineChart,
  Search,
  Share2,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center gap-y-16 px-4 py-12 md:px-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-y-6 text-center">
        <h1 className="text-4xl font-bold md:text-6xl">SuperMTG</h1>
        <p className="text-xl text-slate-400 md:text-2xl">
          Your Ultimate MTG Collection Manager
        </p>
        <div className="flex gap-x-4">
          <Button asChild size="lg">
            <Link href="/signin">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="w-full max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold">Features</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<CreditCard className="h-8 w-8" />}
            title="Collection Management"
            description="Organize your cards into albums, track your collection progress, and manage your inventory with ease."
          />
          <FeatureCard
            icon={<Search className="h-8 w-8" />}
            title="Advanced Search"
            description="Find any card instantly with our powerful search functionality, including filters for rarity, color, and more."
          />
          <FeatureCard
            icon={<LineChart className="h-8 w-8" />}
            title="Collection Value"
            description="Track the total value of your collection and individual albums with real-time price updates."
          />
          <FeatureCard
            icon={<LayoutGrid className="h-8 w-8" />}
            title="Visual Organization"
            description="View your collection in a beautiful grid layout with customizable card display options."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="17Lands Integration"
            description="Get detailed card statistics and performance data from 17Lands for better deck building decisions."
          />
          <FeatureCard
            icon={<Share2 className="h-8 w-8" />}
            title="Share & Trade"
            description="Share your collection with friends and easily identify cards available for trade."
          />
        </div>
      </div>

      {/* Preview Section */}
      <div className="w-full max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold">
          See It In Action
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          <PreviewCard
            title="Album View"
            description="Browse your collection in a clean, organized interface with powerful filtering and sorting options."
            image={previewAlbum}
          />
          <PreviewCard
            title="Card Details"
            description="View detailed card information, including prices, stats, and collection status."
            image={previewCard}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="flex flex-col items-center gap-y-6 text-center">
        <h2 className="text-3xl font-bold">Ready to Start?</h2>
        <p className="text-xl text-slate-400">
          Join thousands of MTG players managing their collections with SuperMTG
        </p>
        <Button asChild size="lg">
          <Link href="/signin">Get Started Now</Link>
        </Button>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-y-4 rounded-lg border-2 bg-slate-800 p-6 text-center">
      <div className="rounded-full bg-slate-700 p-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function PreviewCard({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: any;
}) {
  return (
    <div className="flex flex-col gap-y-4 rounded-lg border-2 bg-slate-800 p-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-slate-400">{description}</p>
      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          width={1200}
          height={800}
          className="h-full w-full object-contain"
          priority
        />
      </div>
    </div>
  );
}
