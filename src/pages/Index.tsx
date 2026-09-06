import { Hero } from "@/components/landing/Hero";
import { DoshaSection } from "@/components/landing/DoshaSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import logoImage from "@/assets/arogyam-logo.png";
import {
  Sparkles,
  Utensils,
  Target,
  Flame,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  HeartHandshake,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. STATS BAR */}
      <section className="border-y border-border/50 bg-card/60 backdrop-blur-md py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-extrabold text-primary">10,000+</div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase font-medium tracking-wide">
                Active Wellness Seekers
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-extrabold text-teal-600">42</div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase font-medium tracking-wide">
                Ayurvedic Recipes
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-extrabold text-amber-600">3</div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase font-medium tracking-wide">
                Core Dosha Archetypes
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-extrabold text-emerald-600">98%</div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase font-medium tracking-wide">
                Report Better Digestion
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none mb-3 text-xs uppercase tracking-wider">
              Comprehensive Platform
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Ancient Wisdom Empowered by Modern Nutrition
            </h2>
            <p className="text-muted-foreground mt-3 text-base sm:text-lg">
              Every element of Arogyam is crafted to help you eat in sync with your metabolic clock (Agni) and biological profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="wellness-card p-6 border shadow-sm hover:border-primary/50 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Personalized Dosha Quiz</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Take our 10-question Prakriti & Vikriti questionnaire to pinpoint your primary and secondary dosha balance.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="wellness-card p-6 border shadow-sm hover:border-primary/50 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-5">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">7-Day Curated Meal Plans</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Receive breakfast, lunch, and dinner recommendations built from authentic Sattvic ingredients with single-click swapping.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="wellness-card p-6 border shadow-sm hover:border-primary/50 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Step-by-Step Cooking Recipes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every meal includes full instructions, digestive seasoning tips, interactive ingredient checklists, and prep times.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card className="wellness-card p-6 border shadow-sm hover:border-primary/50 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Macro & Radial Protein Ring</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track your protein intake, calories, healthy fats, and complex carbohydrates with an interactive circular progress gauge.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card className="wellness-card p-6 border shadow-sm hover:border-primary/50 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-5">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Habit Streaks & Adherence</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Maintain your wellness momentum with daily meal completion logs, streak fire badges, and weekly adherence trends.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card className="wellness-card p-6 border shadow-sm hover:border-primary/50 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-5">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Ayu – 24/7 AI Dietitian</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Have questions about herbs, recipe substitutions, or cravings? Ayu is ready anytime to offer personalized guidance.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/20 border-none mb-3 text-xs uppercase tracking-wider">
              Simple 4-Step Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Your Path to Equilibrium
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              From questionnaire to daily nourishing meals in less than 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: "Take Assessment",
                desc: "Answer 10 intuitive questions about your digestion, sleep, and physical constitution.",
              },
              {
                step: "02",
                title: "Discover Dosha",
                desc: "Get an instant breakdown of your Vata, Pitta, and Kapha percentages.",
              },
              {
                step: "03",
                title: "Get Custom Plan",
                desc: "Review your 7-day personalized meal plan with zero allergenic conflicts.",
              },
              {
                step: "04",
                title: "Cook & Flourish",
                desc: "Follow easy recipe instructions, log completed meals, and watch your vitality grow.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-card p-6 rounded-2xl border border-border/80 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl font-extrabold text-primary/30 mb-3">{item.step}</div>
                  <h4 className="font-bold text-base text-foreground mb-2">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="btn-wellness shadow-md">
              <Link to="/patient/signup" className="flex items-center gap-2">
                Begin Step 1 Now <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. DOSHA SECTION */}
      <div id="doshas">
        <DoshaSection />
      </div>

      {/* 6. TESTIMONIALS */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none mb-3 text-xs uppercase tracking-wider">
              Real Experiences
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Loved by Thousands of Wellness Seekers
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              See how tuning meals to personal Ayurvedic doshas transformed their energy and gut health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <Card className="wellness-card p-6 border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3 text-sm">
                  {"★".repeat(5)}
                </div>
                <p className="text-sm text-foreground/90 italic leading-relaxed mb-4">
                  "I struggled with chronic afternoon sluggishness and heartburn for years. Eating for my Pitta dosha with cooling, spiced recipes transformed my digestion in just two weeks."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  PS
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Priya Sharma</h4>
                  <p className="text-xs text-muted-foreground">Pitta Constitution • Pune</p>
                </div>
              </div>
            </Card>

            {/* Review 2 */}
            <Card className="wellness-card p-6 border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3 text-sm">
                  {"★".repeat(5)}
                </div>
                <p className="text-sm text-foreground/90 italic leading-relaxed mb-4">
                  "As a Vata type, irregular eating gave me anxiety and bloating. Having warm, grounded meal recommendations with built-in grocery lists made healthy living so simple."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                  RM
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Rohan Mehta</h4>
                  <p className="text-xs text-muted-foreground">Vata-Pitta • Bengaluru</p>
                </div>
              </div>
            </Card>

            {/* Review 3 */}
            <Card className="wellness-card p-6 border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3 text-sm">
                  {"★".repeat(5)}
                </div>
                <p className="text-sm text-foreground/90 italic leading-relaxed mb-4">
                  "The step-by-step recipes and the protein tracking ring are phenomenal. I've maintained a 14-day streak and lost 4 kg without feeling depleted or hungry."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-sm">
                  AK
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Ananya Kulkarni</h4>
                  <p className="text-xs text-muted-foreground">Kapha Balance • Mumbai</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION (CTA) */}
      <section className="py-20 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <Badge className="bg-white/20 text-white border-none mb-4 uppercase tracking-widest text-xs">
            Start Today
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 text-white">
            Awaken Your Optimal Wellbeing Today
          </h2>
          <p className="text-emerald-100 text-lg sm:text-xl max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Take the free 2-minute assessment, uncover your biological dosha balance, and start feeling your best with every meal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-emerald-800 hover:bg-white/90 text-base font-bold px-8 py-6 shadow-2xl"
            >
              <Link to="/patient/signup">Start Your Free Journey</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 text-base px-8 py-6"
            >
              <Link to="/patient/login">Sign In to Your Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-border bg-card/60 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Arogyam Logo" className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tight text-foreground">Arogyam</span>
              <span className="text-xs text-muted-foreground ml-2">
                Personalized Ayurvedic Nutrition & Progress Tracking
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <Link to="/patient/signup" className="hover:text-primary transition-colors">
                Sign Up
              </Link>
              <Link to="/patient/login" className="hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link to="/demo" className="hover:text-primary transition-colors">
                Interactive Demo
              </Link>
              <a href="#features" className="hover:text-primary transition-colors">
                Features
              </a>
              <a href="#doshas" className="hover:text-primary transition-colors">
                Doshas
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
            <p>© {new Date().getFullYear()} Arogyam Wellness Platform. All rights reserved.</p>
            <p className="text-center sm:text-right">
              Disclaimer: Content provided is for nutritional educational purposes and does not replace medical diagnosis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
