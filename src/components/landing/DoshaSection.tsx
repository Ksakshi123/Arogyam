export const DoshaSection = () => {
  const doshas = [
    {
      symbol: "🌀",
      name: "Vata",
      elements: "Air + Space",
      description: "Movement, circulation, and nervous system",
      className: "dosha-vata"
    },
    {
      symbol: "▲", 
      name: "Pitta",
      elements: "Fire + Water",
      description: "Metabolism, digestion, and transformation",
      className: "dosha-pitta"
    },
    {
      symbol: "●",
      name: "Kapha", 
      elements: "Earth + Water",
      description: "Structure, immunity, and stability",
      className: "dosha-kapha"
    }
  ];

  return (
    <section className="py-20 bg-gradient-wellness">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Understanding Your Dosha
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your unique Ayurvedic constitution through the three fundamental energies
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {doshas.map((dosha, index) => (
            <div 
              key={dosha.name}
              className={`wellness-card text-center ${dosha.className} border-2`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-6xl mb-6">{dosha.symbol}</div>
              <h3 className="text-2xl font-bold mb-3">{dosha.name}</h3>
              <p className="text-lg font-semibold mb-4 opacity-80">{dosha.elements}</p>
              <p className="text-muted-foreground leading-relaxed">
                {dosha.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-6">
            Take our comprehensive assessment to discover your unique dosha balance
          </p>
          <div className="flex justify-center mb-6">
            <a
              href="/patient/signup"
              className="btn-wellness inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold shadow-lg text-white"
            >
              Take Free Dosha Quiz →
            </a>
          </div>
          <div className="flex justify-center gap-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};