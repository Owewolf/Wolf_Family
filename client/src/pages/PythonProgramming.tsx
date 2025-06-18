import { Code, Cpu, Database, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AccomplishmentsSidebar from "@/components/AccomplishmentsSidebar";

export default function PythonProgramming() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 py-8">
        <main className="lg:w-2/3">
          {/* Header */}

          {/* Main Content */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start space-x-6">
                <div className="p-4 rounded-lg bg-emerald-100 text-emerald-600">
                  <Code className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2 text-emerald-600">
                    Python Programming Expertise
                  </CardTitle>
                  <Badge variant="secondary" className="mb-4">
                    Specialized Agricultural Solutions
                  </Badge>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Developed custom Python applications for precision agriculture, combining technical 
                    programming skills with deep agricultural knowledge to optimize farm operations.
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Detailed Content */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-emerald-600">
                  <Database className="mr-2 h-5 w-5" />
                  Agricultural Data Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Data Collection Systems</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Automated sensor data logging</li>
                      <li>• Weather station integration</li>
                      <li>• Soil moisture monitoring scripts</li>
                      <li>• Crop growth tracking systems</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Analysis Applications</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Yield prediction algorithms</li>
                      <li>• Resource optimization calculations</li>
                      <li>• Cost-benefit analysis tools</li>
                      <li>• Production efficiency metrics</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-emerald-600">
                  <Cpu className="mr-2 h-5 w-5" />
                  Automation and Control Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Steven has developed Python-based automation systems that integrate with farm equipment 
                  and monitoring devices, enabling precise control over agricultural operations.
                </p>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2">Automation Projects:</h4>
                  <ul className="space-y-1 text-emerald-700">
                    <li>• Irrigation scheduling based on weather forecasts</li>
                    <li>• Automated greenhouse climate control</li>
                    <li>• Equipment maintenance reminder systems</li>
                    <li>• Inventory management and ordering automation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-emerald-600">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Production Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Performance Analytics</h4>
                    <p className="text-gray-700 mb-3">
                      Custom Python scripts analyze farm performance metrics, identifying optimization 
                      opportunities and tracking improvements over time.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Resource Management</h5>
                      <p className="text-sm text-gray-600">
                        Algorithms for optimal water usage, fertilizer application, and equipment scheduling
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Quality Control</h5>
                      <p className="text-sm text-gray-600">
                        Automated quality assessment tools for crop monitoring and harvest timing
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-emerald-600">
                  Technology Integration in Modern Agriculture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Steven's Python programming expertise bridges the gap between traditional farming practices 
                  and modern technology solutions. His applications demonstrate how technical skills can be 
                  directly applied to solve real-world agricultural challenges, improving efficiency and 
                  sustainability at Wolf's Lair Farm.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <AccomplishmentsSidebar />
      </div>
    </div>
  );
}