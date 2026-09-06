import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PatientLogin from "./pages/PatientLogin";
import PatientSignup from "./pages/PatientSignup";
import DoctorLogin from "./pages/DoctorLogin";
import PatientDashboard from "./pages/PatientDashboard";
import PatientOnboarding from "./pages/PatientOnboarding";
import DoshaAssessment from "./pages/DoshaAssessment";
import DoshaResult from "./pages/DoshaResult";
import WeeklyMealPlan from "./pages/WeeklyMealPlan";
import NutritionAnalytics from "./pages/NutritionAnalytics";
import DoctorDashboard from "./pages/DoctorDashboard";
import MealPlans from "./pages/MealPlans";
import Progress from "./pages/Progress";
import FindDiet from "./pages/FindDiet";
import Profile from "./pages/Profile";
import Demo from "./pages/Demo";
import WellnessChatbot from "./components/patient/WellnessChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WellnessChatbot />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/signup" element={<PatientSignup />} />
          <Route path="/signup" element={<PatientSignup />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/patient/onboarding" element={<PatientOnboarding />} />
          <Route path="/patient/dosha-assessment" element={<DoshaAssessment />} />
          <Route path="/patient/dosha-result" element={<DoshaResult />} />
          <Route path="/patient/meal-plan" element={<WeeklyMealPlan />} />
          <Route path="/patient/nutrition" element={<NutritionAnalytics />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/meal-plans" element={<MealPlans />} />
          <Route path="/patient/progress" element={<Progress />} />
          <Route path="/patient/find-diet" element={<FindDiet />} />
          <Route path="/patient/profile" element={<Profile />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
