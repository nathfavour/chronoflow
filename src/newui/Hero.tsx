"use client";

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-transparent to-muted/10 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Real-Time Yield Streams as NFTs
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Stream value continuously and trade your yield as NFT-backed flows. Build, monitor,
          and trade streaming assets with ChronoFlow.
        </p>
        <div className="mt-8 flex items-center justify-center space-x-3">
          <a href="#" className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-white">Create a Flow</a>
          <a href="#" className="inline-flex items-center rounded-md border border-border px-5 py-3">Learn More</a>
        </div>
      </div>
    </section>
  );
}
