import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CalendarDays,
  Target,
  Trophy,
  Flame,
  ArrowUpRight,
  Save,
  Activity,
  Calendar
} from "lucide-react";
import PatientNavBar from "../components/patient/PatientNavBar";
import { useToast } from "@/hooks/use-toast";

const Progress = () => {
  const { toast } = useToast();
  const [energy, setEnergy] = useState([5]);
  const [mood, setMood] = useState([3]);
  const [sleep, setSleep] = useState([7]);
  const [digestion, setDigestion] = useState([4]);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    toast({
      title: "Progress Tracked",
      description: "Your daily wellness markers have been saved.",
    });
    setNotes("");
  };

  const getMoodEmoji = (val: number) => {
    if (val <= 1) return "😔";
    if (val === 2) return "😐";
    if (val === 3) return "🙂";
    return "😊";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <PatientNavBar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Track Your Progress</h2>
          <p className="text-muted-foreground mt-1">Log your daily wellness markers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="wellness-card border-none bg-card/80">
            <CardHeader>
              <CardTitle>Daily Log</CardTitle>
              <CardDescription>How are you feeling today?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Energy Level</Label>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">{energy[0]}/10</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-8">Low</span>
                  <Slider value={energy} onValueChange={setEnergy} max={10} step={1} className="flex-1" />
                  <span className="text-xs text-muted-foreground w-8 text-right">High</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Mood</Label>
                  <span className="text-lg">{getMoodEmoji(mood[0])}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-8 text-xl">😔</span>
                  <Slider value={mood} onValueChange={setMood} max={4} min={1} step={1} className="flex-1" />
                  <span className="text-xs text-muted-foreground w-8 text-right text-xl">😊</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Sleep Quality</Label>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">{sleep[0]}/10</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-8">Poor</span>
                  <Slider value={sleep} onValueChange={setSleep} max={10} step={1} className="flex-1" />
                  <span className="text-xs text-muted-foreground w-8 text-right">Great</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Digestion Feeling</Label>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">{digestion[0]}/10</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground w-8">Heavy</span>
                  <Slider value={digestion} onValueChange={setDigestion} max={10} step={1} className="flex-1" />
                  <span className="text-xs text-muted-foreground w-8 text-right">Light</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label>Daily Notes (Optional)</Label>
                <Textarea 
                  placeholder="How did you feel after meals? Any unusual symptoms?" 
                  className="resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button onClick={handleSave} className="w-full btn-wellness mt-4">
                <Save className="w-4 h-4 mr-2" /> Save Log
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="wellness-card border-none bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Weekly Trends
                </CardTitle>
                <CardDescription>Your averages over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="text-sm font-medium mb-1 text-muted-foreground">Average Energy</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    7.2/10 <span className="text-xs font-normal text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">+12%</span>
                  </div>
                </div>
                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="text-sm font-medium mb-1 text-muted-foreground">Sleep Quality</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    8.1/10 <span className="text-xs font-normal text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">+5%</span>
                  </div>
                </div>
                <div className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="text-sm font-medium mb-1 text-muted-foreground">Digestion Rating</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    6.5/10 <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Stable</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-none shadow-none">
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Insight
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Your energy levels are consistently higher on days when you complete your Ayurvedic breakfast. 
                  Keep maintaining this habit for optimal Vata grounding!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;