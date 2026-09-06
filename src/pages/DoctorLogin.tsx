import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import logoImage from "@/assets/arogyam-logo.png";

const DoctorLogin = () => {
  return (
    <div className="min-h-screen gradient-wellness flex items-center justify-center p-4">
      <Card className="w-full max-w-md wellness-card">
        <CardHeader className="text-center">
          <img src={logoImage} alt="Arogyam" className="w-16 h-16 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Doctor Portal</CardTitle>
          <CardDescription>Access your practice management dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="doctor@clinic.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Link to="/doctor/dashboard">
            <Button className="w-full btn-wellness">Sign In</Button>
          </Link>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need access?{" "}
              <Link to="/doctor/register" className="text-primary hover:underline">
                Register Practice
              </Link>
            </p>
          </div>
          <div className="text-center pt-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorLogin;