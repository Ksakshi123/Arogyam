import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Camera, Brain, Target, TrendingUp, MessageCircle, Users } from "lucide-react";
import logoImage from "@/assets/arogyam-logo.png";

const Demo = () => {
  const features = [
    {
      icon: Camera,
      title: "AI Dosha Assessment",
      description: "Upload a photo for instant constitutional analysis or take our comprehensive quiz",
      color: "text-blue-600"
    },
    {
      icon: Target,
      title: "Personalized Meal Plans",
      description: "Get Ayurvedic nutrition plans tailored to your dosha and health goals",
      color: "text-green-600"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your wellness journey with detailed progress analytics",
      color: "text-purple-600"
    },
    {
      icon: MessageCircle,
      title: "24/7 AI Chatbot",
      description: "Get instant answers about Ayurveda, nutrition, and your wellness plan",
      color: "text-orange-600"
    }
  ];

  const demoFlow = [
    {
      step: "1",
      title: "Dosha Assessment",
      description: "Start with our AI-powered constitutional analysis"
    },
    {
      step: "2", 
      title: "Personalized Plan",
      description: "Receive customized meal and lifestyle recommendations"
    },
    {
      step: "3",
      title: "Track Progress",
      description: "Monitor your wellness journey with detailed analytics"
    },
    {
      step: "4",
      title: "Doctor Guidance",
      description: "Optional consultation with certified Ayurvedic practitioners"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Arogyam" className="w-8 h-8" />
            <h1 className="text-xl font-bold">Arogyam Demo</h1>
          </div>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Demo Introduction */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Experience Personalized Ayurvedic Wellness
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            See how Arogyam combines ancient Ayurvedic wisdom with modern technology to create your perfect wellness journey
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="px-4 py-2 text-sm">AI-Powered Assessment</Badge>
            <Badge className="px-4 py-2 text-sm">Personalized Plans</Badge>
            <Badge className="px-4 py-2 text-sm">Progress Tracking</Badge>
            <Badge className="px-4 py-2 text-sm">Doctor Support</Badge>
          </div>
        </div>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="wellness-card">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-3 bg-muted rounded-xl ${feature.color}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {demoFlow.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
                {index < demoFlow.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Portal Previews */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Dual Portal System</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Patient Portal Preview */}
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Patient Portal
                </CardTitle>
                <CardDescription>
                  Your personal wellness dashboard with meal plans, progress tracking, and AI guidance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-wellness p-4 rounded-xl">
                  <h4 className="font-semibold mb-2">Features Include:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Personalized meal recommendations</li>
                    <li>• Daily progress tracking</li>
                    <li>• 24/7 AI wellness chatbot</li>
                    <li>• Dosha-based nutrition plans</li>
                  </ul>
                </div>
                <Link to="/patient/login">
                  <Button className="w-full btn-wellness">
                    Try Patient Portal
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Doctor Portal Preview */}
            <Card className="wellness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Doctor Portal
                </CardTitle>
                <CardDescription>
                  Comprehensive practice management with patient analytics and treatment tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-wellness p-4 rounded-xl">
                  <h4 className="font-semibold mb-2">Features Include:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Patient management system</li>
                    <li>• Dosha distribution analytics</li>
                    <li>• Progress monitoring tools</li>
                    <li>• Treatment outcome tracking</li>
                  </ul>
                </div>
                <Link to="/doctor/login">
                  <Button className="w-full btn-wellness">
                    Try Doctor Portal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-hero rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Wellness Journey?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who have transformed their health with personalized Ayurvedic guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/patient/login">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 px-8 py-3">
                Start as Patient
              </Button>
            </Link>
            <Link to="/doctor/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                Doctor Access
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Demo;