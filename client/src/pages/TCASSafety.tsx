import { Shield, AlertTriangle, Radio, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AccomplishmentsSidebar from "@/components/AccomplishmentsSidebar";

export default function TCASSafety() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 py-8">
        <main className="lg:w-2/3">

          {/* Main Content */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start space-x-6">
                <div className="p-4 rounded-lg bg-emerald-100 text-emerald-600">
                  <Shield className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2 text-emerald-600">
                    TCAS Safety Protocol Advanced
                  </CardTitle>
                  <Badge variant="secondary" className="mb-4">
                    Aviation Safety Leadership
                  </Badge>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Advanced certifications in Traffic Collision Avoidance Systems (TCAS), leading safety 
                    protocol implementations for farm equipment operations.
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
                  <Radio className="mr-2 h-5 w-5" />
                  TCAS Technology Understanding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Aviation TCAS Systems</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Traffic monitoring and collision avoidance</li>
                      <li>• Real-time threat assessment protocols</li>
                      <li>• Automated resolution advisory systems</li>
                      <li>• Multi-aircraft coordination principles</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Farm Equipment Applications</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Equipment collision prevention systems</li>
                      <li>• Automated distance monitoring</li>
                      <li>• Coordinated multi-vehicle operations</li>
                      <li>• Safety zone establishment protocols</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-emerald-600">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Farm Safety Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Adapting TCAS principles to agricultural operations creates unprecedented safety standards 
                  for farm equipment coordination and collision avoidance.
                </p>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2">TCAS-Inspired Farm Safety Protocols:</h4>
                  <ul className="space-y-1 text-emerald-700">
                    <li>• GPS-based equipment tracking and positioning</li>
                    <li>• Automated safe distance maintenance</li>
                    <li>• Real-time operator communication systems</li>
                    <li>• Emergency stop and avoidance procedures</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-emerald-600">
                  <Users className="mr-2 h-5 w-5" />
                  Safety Leadership and Training
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Team Safety Education</h4>
                    <p className="text-gray-700 mb-3">
                      Steven leads comprehensive safety training programs that incorporate aviation-grade 
                      protocols into farm operations, ensuring all team members understand and implement 
                      advanced safety procedures.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Protocol Development</h5>
                      <p className="text-sm text-gray-600">
                        Creating standardized safety procedures based on aviation industry best practices
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Continuous Improvement</h5>
                      <p className="text-sm text-gray-600">
                        Regular safety assessments and protocol updates to maintain highest standards
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-emerald-600">
                  Aviation Safety Standards in Agriculture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  By implementing TCAS-inspired safety protocols, Wolf's Lair Farm operates with the same 
                  rigorous safety standards found in commercial aviation. This approach ensures maximum 
                  protection for personnel and equipment while maintaining operational efficiency and 
                  setting new benchmarks for agricultural safety practices.
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