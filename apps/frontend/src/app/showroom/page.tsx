import { Metadata } from "next";
import CarShowcase from "@/components/CarShowcase";

export const metadata: Metadata = {
  title: "3D Showroom | Rentzy Garaj",
  description:
    "Hayalinizdeki lüks ve spor araçları 3 boyutlu etkileşimli vitrinde inceleyin, rengini özelleştirin ve hemen kiralayın.",
};

export default function ShowroomPage() {
  return (
    <main className="min-h-screen bg-neutral-950 p-4 md:p-8 pt-24 text-white font-sans selection:bg-emerald-500 selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-semibold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Interaktif 3D Deneyim
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              3D Showroom
            </h1>
            <p className="text-neutral-400 text-sm md:text-base mt-2 max-w-xl">
              Hayalinizdeki aracı 3 boyutlu inceleyin, rengini seçin ve hemen kiralayın.
            </p>
          </div>
        </div>
        <CarShowcase />
      </div>
    </main>
  );
}
