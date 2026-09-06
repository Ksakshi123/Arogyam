import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Activity, Plus, Eye, Edit, Trash2 } from "lucide-react";
import logoImage from "@/assets/arogyam-logo.png";

const DoctorDashboard = () => {
  const analytics = [
    { label: "Total Patients", value: "127", icon: Users, color: "text-blue-600" },
    { label: "Active This Week", value: "84", icon: Activity, color: "text-green-600" },
    { label: "Avg Progress", value: "82%", icon: TrendingUp, color: "text-purple-600" },
    { label: "New This Month", value: "12", icon: Plus, color: "text-orange-600" }
  ];

  const doshaDistribution = [
    { dosha: "Vata", count: 42, percentage: 33, className: "dosha-vata" },
    { dosha: "Pitta", count: 51, percentage: 40, className: "dosha-pitta" },
    { dosha: "Kapha", count: 34, percentage: 27, className: "dosha-kapha" }
  ];

  const recentPatients = [
    {
      name: "Priya Sharma",
      dosha: "Vata",
      progress: 85,
      lastVisit: "2 days ago",
      status: "active"
    },
    {
      name: "Rajesh Kumar",
      dosha: "Pitta", 
      progress: 72,
      lastVisit: "1 week ago",
      status: "active"
    },
    {
      name: "Meera Patel",
      dosha: "Kapha",
      progress: 91,
      lastVisit: "3 days ago", 
      status: "completed"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Arogyam" className="w-8 h-8" />
            <h1 className="text-xl font-bold">Arogyam – Doctor Portal</h1>
          </div>
          <nav className="flex gap-6">
            <a href="#" className="text-primary font-medium">Dashboard</a>
            <a href="#" className="text-muted-foreground hover:text-primary">Patients</a>
            <a href="#" className="text-muted-foreground hover:text-primary">Analytics</a>
            <a href="#" className="text-muted-foreground hover:text-primary">Settings</a>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Practice Analytics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {analytics.map((stat, index) => (
            <Card key={index} className="wellness-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 bg-muted rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Dosha Distribution */}
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle>Patient Dosha Distribution</CardTitle>
              <CardDescription>Constitutional types across your practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doshaDistribution.map((item) => (
                  <div key={item.dosha} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${item.className}`}></div>
                      <span className="font-medium">{item.dosha}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.count} patients</span>
                      <Badge variant="secondary">{item.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Patient Management */}
          <Card className="wellness-card">
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>Add, update, or manage patient records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="btn-wellness h-20 flex-col gap-2">
                  <Plus className="w-6 h-6" />
                  Add Patient
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Eye className="w-6 h-6" />
                  View All
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Edit className="w-6 h-6" />
                  Update Records
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2 border-destructive text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-6 h-6" />
                  Archive
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Patients */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Latest patient activities and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{patient.name}</h4>
                      <p className="text-sm text-muted-foreground">Primary Dosha: {patient.dosha}</p>
                      <p className="text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Progress: {patient.progress}%</p>
                      <Badge 
                        variant={patient.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {patient.status}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;