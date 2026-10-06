import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-ayurveda.jpg";
import logoImage from "@/assets/arogyam-logo.png";
import { Sparkles, ArrowRight, CheckCircle2, Flame } from "lucide-react";
import { usePatientStore } from "@/store/patientStore";
import { dbGetSession } from "@/lib/db";

export const Hero = () => {
  const userId = usePatientStore((s) => s.userId);
  const isAuthenticated = !!userId || !!dbGetSession();

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden">
      {/* Background Image with Ambient Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-background/95" />
      </div>

      {/* Floating Animated Orbs */}
      <div className="absolute top-24 left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div
        className="absolute bottom-24 right-10 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl animate-float pointer-events-none"
        style={{ animationDelay: "3s" }}
      />

      {/* Top Navbar */}
      <header className="relative z-20 container mx-auto px-4 sm:px-6 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logoImage}
            alt="Arogyam Logo"
            className="w-10 h-10 drop-shadow-md group-hover:scale-105 transition-transform"
          />
          <span className="text-2xl font-bold text-white tracking-tight">Arogyam</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#doshas" className="hover:text-white transition-colors">The 3 Doshas</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Stories</a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button asChild size="sm" className="btn-wellness text-xs font-semibold shadow-lg">
              <Link to="/patient/dashboard">
                Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          ) : (
            <>
              <Link
                to="/patient/login"
                className="text-sm font-medium text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
              <Button asChild size="sm" className="btn-wellness text-xs font-semibold shadow-lg">
                <Link to="/patient/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main Hero Center */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 flex-1 flex flex-col justify-center items-center text-center max-w-4xl">
        {/* Top Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-medium mb-6 animate-fade-in shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Ancient Ayurvedic Wisdom • Modern Intelligent Nutrition</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-md">
          Harmonize Your Body with{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
            Personalized Nutrition
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/85 mb-8 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow">
          Discover your unique Vata, Pitta, or Kapha constitution. Enjoy custom 7-day culinary meal plans, step-by-step recipes, and live macro tracking.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mb-8">
        <Button
          asChild
          size="lg"
          className="btn-wellness text-base px-8 py-6 w-full sm:w-auto shadow-2xl flex items-center justify-center gap-2"
        >
          <Link to={isAuthenticated ? "/patient/dashboard" : "/patient/login"}>
            {isAuthenticated ? "Go to Your Dashboard" : "Start Your Wellness Journey"} <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/80">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Tailored Dosha Matching
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 42 Ayurvedic Recipes Included
          </span>
          <span className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" /> Daily Habits & Streak System
          </span>
        </div>
      </div>

      {/* Decorative Bottom Transition */}
      <div className="h-10 w-full" />
    </section>
  );
};
export default Hero;