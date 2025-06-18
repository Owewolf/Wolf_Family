import { Brain, BarChart, Zap, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AccomplishmentsSidebar from "@/components/AccomplishmentsSidebar";

export default function MachineLearning() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 py-8">
        <main className="lg:w-2/3">

          {/* Main Content */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start space-x-6">
                <div className="p-4 rounded-lg bg-emerald-100 text-emerald-600">
                  <Brain className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2 text-emerald-600">
                    Machine Learning Implementation
                  </CardTitle>
                  <Badge variant="secondary" className="mb-4">
                    Farm Technology Solutions
                  </Badge>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Applied machine learning techniques to crop prediction systems, weather analysis, 
                    and resource optimization, bridging traditional farming with cutting-edge technology.
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
                  <BarChart className="mr-2 h-5 w-5" />
                  Crop Prediction Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">TensorFlow Lite Applications</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Yield prediction models based on historical data</li>
                      <li>• Growth pattern recognition algorithms</li>
                      <li>• Disease detection through image analysis</li>
                      <li>• Optimal harvest timing predictions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Data Sources Integration</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Weather station historical records</li>
                      <li>• Soil composition and moisture data</li>
                      <li>• Satellite imagery analysis</li>
                      <li>• Market price trend analysis</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-emerald-600">
                  <Zap className="mr-2 h-5 w-5" />
                  Resource Optimization Algorithms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Machine learning models analyze complex relationships between weather patterns, 
                  soil conditions, and crop performance to optimize resource allocation and maximize efficiency.
                </p>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2">Optimization Applications:</h4>
                  <ul className="space-y-1 text-emerald-700">
                    <li>• Water usage optimization based on predictive models</li>
                    <li>• Fertilizer application timing and quantity</li>
                    <li>• Equipment scheduling for maximum efficiency</li>
                    <li>• Energy consumption reduction strategies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-emerald-600">
                  <Target className="mr-2 h-5 w-5" />
                  Weather Analysis and Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Advanced Weather Modeling</h4>
                    <p className="text-gray-700 mb-3">
                      Combining aviation weather expertise with machine learning creates sophisticated 
                      agricultural weather prediction systems for precise farm management.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Pattern Recognition</h5>
                      <p className="text-sm text-gray-600">
                        ML algorithms identify weather patterns that affect crop growth and farm operations
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Risk Assessment</h5>
                      <p className="text-sm text-gray-600">
                        Predictive models assess weather-related risks for proactive farm management
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-emerald-600">
                  Technology Innovation in Agriculture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Steven's machine learning implementations represent the cutting edge of agricultural technology. 
                  By applying advanced algorithms to traditional farming challenges, Wolf's Lair Farm operates 
                  with precision and efficiency that sets new standards for sustainable agriculture practices.
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