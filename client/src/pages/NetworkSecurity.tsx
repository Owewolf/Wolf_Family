import { Lock, Monitor, Network, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AccomplishmentsSidebar from "@/components/AccomplishmentsSidebar";

export default function NetworkSecurity() {
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
                  <Lock className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2 text-emerald-600">
                    Network Security Specialist
                  </CardTitle>
                  <Badge variant="secondary" className="mb-4">
                    Multi-disciplinary Expertise
                  </Badge>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Technical background spanning network security monitoring with Wireshark to machine 
                    learning applications, demonstrating versatile problem-solving capabilities.
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
                  <Monitor className="mr-2 h-5 w-5" />
                  Wireshark and Network Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Network Monitoring Expertise</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Deep packet inspection and analysis</li>
                      <li>• Network traffic pattern recognition</li>
                      <li>• Security threat identification</li>
                      <li>• Performance optimization analysis</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Farm Network Applications</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• IoT device monitoring and security</li>
                      <li>• Equipment communication protocols</li>
                      <li>• Data transmission optimization</li>
                      <li>• Network infrastructure management</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-emerald-600">
                  <Network className="mr-2 h-5 w-5" />
                  pfSense Systems Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Advanced pfSense firewall configuration and management provides enterprise-level 
                  security for farm networks and connected agricultural systems.
                </p>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-emerald-800 mb-2">pfSense Security Implementations:</h4>
                  <ul className="space-y-1 text-emerald-700">
                    <li>• Multi-zone network segmentation for farm operations</li>
                    <li>• VPN access for remote monitoring and management</li>
                    <li>• Intrusion detection and prevention systems</li>
                    <li>• Bandwidth management for IoT device networks</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-emerald-600">
                  <Settings className="mr-2 h-5 w-5" />
                  System Integration and Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Comprehensive Security Architecture</h4>
                    <p className="text-gray-700 mb-3">
                      Steven designs and implements multi-layered security systems that protect farm 
                      operations from cyber threats while ensuring reliable connectivity for critical systems.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Threat Assessment</h5>
                      <p className="text-sm text-gray-600">
                        Continuous monitoring and assessment of security vulnerabilities
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Incident Response</h5>
                      <p className="text-sm text-gray-600">
                        Rapid response protocols for security incidents and system failures
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-emerald-600">
                  Versatile Technical Problem-Solving
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Steven's network security expertise demonstrates his ability to adapt technical skills 
                  across multiple domains. From aviation systems to agricultural technology, his versatile 
                  problem-solving approach ensures robust, secure, and efficient operations at Wolf's Lair Farm 
                  while maintaining the highest standards of cybersecurity and network performance.
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