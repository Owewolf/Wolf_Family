import { Award, Cloud, Navigation, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AccomplishmentsSidebar from "@/components/AccomplishmentsSidebar";

export default function AviationCertifications() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 py-8">
        <main className="lg:w-2/3">

          {/* Main Content */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start space-x-6">
                <div className="p-4 rounded-lg bg-emerald-100 text-emerald-600">
                  <Award className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2 text-emerald-600">
                    Advanced Aviation Certifications
                  </CardTitle>
                  <Badge variant="secondary" className="mb-4">
                    Weather Systems & Navigation
                  </Badge>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Comprehensive certifications in aviation weather systems, navigation technologies, 
                    and advanced flight operations, ensuring the highest standards of aerial safety and precision.
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
                  <Cloud className="mr-2 h-5 w-5" />
                  Weather Systems Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Meteorological Certifications</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Advanced weather radar interpretation</li>
                      <li>• Severe weather recognition and avoidance</li>
                      <li>• Atmospheric conditions analysis</li>
                      <li>• Real-time weather decision making</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Agricultural Applications</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Crop timing based on weather patterns</li>
                      <li>• Irrigation scheduling optimization</li>
                      <li>• Frost protection protocols</li>
                      <li>• Harvest window identification</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-emerald-600">
                  <Navigation className="mr-2 h-5 w-5" />
                  Navigation Technology Mastery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Steven's expertise in aviation navigation systems translates directly to precision 
                  agriculture applications, enabling GPS-guided farming operations and systematic 
                  field management.
                </p>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2">Navigation Skills Applied to Farming:</h4>
                  <ul className="space-y-1 text-emerald-700">
                    <li>• GPS-guided tractor operations for precise planting</li>
                    <li>• Field mapping and boundary management</li>
                    <li>• Automated irrigation system positioning</li>
                    <li>• Livestock tracking and pasture rotation planning</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-emerald-600">
                  <FileCheck className="mr-2 h-5 w-5" />
                  Professional Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Aviation Certifications</h4>
                    <p className="text-gray-700 mb-3">
                      Steven maintains current certifications in multiple aviation specialties, 
                      demonstrating ongoing commitment to professional excellence.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <Badge variant="outline">Commercial Pilot License</Badge>
                      <Badge variant="outline">Instrument Rating</Badge>
                      <Badge variant="outline">Multi-Engine Rating</Badge>
                      <Badge variant="outline">Weather Systems</Badge>
                      <Badge variant="outline">Navigation Tech</Badge>
                      <Badge variant="outline">Safety Management</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-emerald-600">
                  Precision and Standards in Agriculture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  The precision required in aviation weather analysis and navigation directly enhances 
                  agricultural operations at Wolf's Lair Farm. Steven applies the same exacting standards 
                  used in flight operations to optimize crop management, equipment operation, and farm safety protocols.
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