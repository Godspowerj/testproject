import ImageGrid from "@/component/imageGrid";

export default function Home() {
  return (
    <div>
      <div className="text-center px-6">

        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-3">
          Thank You Card Creator
        </h1>
        <p className="text-slate-600 text-lg">
          Search, customize, and download beautiful thank you cards
        </p>

        <main>
          <ImageGrid />
        </main>
      </div>
    </div>
  );
}
