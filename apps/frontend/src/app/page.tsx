export default async function HomePage() {
  let cars: any[] = [];
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  try {
    const res = await fetch(`${API_URL}/cars`, {
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type");
    if (res.ok && contentType && contentType.includes("application/json")) {
      cars = await res.json();
    } else {
      console.warn(
        `[HomePage API Warning] Unexpected response status (${res.status}) or content-type (${contentType}).`
      );
    }
  } catch (error) {
    console.error("[HomePage API Error] Failed to fetch cars:", error);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
          Rentzy Premium Garaj
        </h1>

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car: any) => (
              <div
                key={car.id}
                className="border border-white/10 bg-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col justify-between transition-transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium tracking-wider text-neutral-400 uppercase">
                      {car.brand?.name || car.brand}
                    </span>
                    <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
                      {car.year}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">{car.name}</h2>
                  <p className="text-neutral-400 text-sm mb-6">{car.description}</p>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Günlük</p>
                    <p className="text-xl font-bold">${car.basePrice}</p>
                  </div>
                  <button className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-neutral-300 transition-colors">
                    İncele
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-white/10 bg-white/5 rounded-2xl text-center text-neutral-400">
            <p className="text-lg font-semibold text-white mb-2">
              Araç verileri yüklenemedi
            </p>
            <p className="text-sm">
              Backend servisi (`{API_URL}/cars`) yanıt vermiyor veya JSON dönmüyor.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
