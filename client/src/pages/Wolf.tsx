import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plane, Trophy, Code, Wrench, Shield, Brain } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFamilyMemberColor, getFamilyMemberInitial } from "@/lib/utils";
import stevenAvatar from "@assets/ste_av_1750006550241.png";
import lieselAvatar from "@assets/lie_av_1750007586846.jpg";
import type { FamilyMember } from "@shared/schema";
import FamilyMemberSidebar from "@/components/FamilyMemberSidebar";

export default function Wolf() {
  const { data: familyMembers, isLoading } = useQuery<FamilyMember[]>({
    queryKey: ["/api/family-members"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  const steven = familyMembers?.find(member => member.name === "Steven");

  if (!steven) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <Link href="/family">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Family
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const accomplishments = [
    {
      icon: "airplane",
      title: "+ 23,000 Flying Hours",
      subtitle: "Exemplary Safety Record",
      description: "Over three decades of commercial aviation experience with an unblemished safety record, demonstrating exceptional skill in aircraft operation, weather management, and crisis response.",
      action: "Click to explore details →",
      link: "/accomplishments/flight-hours"
    },
    {
      icon: Trophy,
      title: "Advanced Aviation Certifications",
      subtitle: "Weather Systems & Navigation",
      description: "Comprehensive certifications in aviation weather systems, navigation technologies, and advanced flight operations, ensuring the highest standards of aerial safety and precision.",
      action: "Click to explore details →",
      link: "/accomplishments/aviation-certifications"
    },
    {
      icon: Code,
      title: "Python Programming Expertise",
      subtitle: "Agricultural Data Analysis",
      description: "Advanced Python programming skills applied to agricultural data analysis, automation systems, and farm management optimization through custom software solutions.",
      action: "Click to explore details →",
      link: "/accomplishments/python-programming"
    },
    {
      icon: Shield,
      title: "Network Security Specialist",
      subtitle: "Wireshark & pfSense Systems",
      description: "Expert-level network security implementation using Wireshark for traffic analysis and pfSense for firewall management, protecting critical farm infrastructure.",
      action: "Click to explore details →",
      link: "/accomplishments/network-security"
    },
    {
      icon: Brain,
      title: "Machine Learning Implementation",
      subtitle: "Crop Prediction Systems",
      description: "Implementation of machine learning algorithms for crop yield prediction, weather pattern analysis, and agricultural decision support systems.",
      action: "Click to explore details →",
      link: "/accomplishments/machine-learning"
    },
    {
      icon: Wrench,
      title: "TCAS Safety Protocols",
      subtitle: "Farm Equipment Collision Avoidance",
      description: "Adaptation of aviation TCAS (Traffic Collision Avoidance System) principles for farm equipment safety and automated machinery coordination.",
      action: "Click to explore details →",
      link: "/accomplishments/tcas-safety"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 py-8">
        <main className="lg:w-2/3">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/family">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Family
              </Button>
            </Link>
          </div>

          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={stevenAvatar} alt={steven.name} />
                  <AvatarFallback
                    className={`text-2xl font-bold ${getFamilyMemberColor(steven.id)}`}
                  >
                    {getFamilyMemberInitial(steven.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-emerald-600 mb-2">The Wolf</h1>
                  <p className="text-lg text-gray-600 mb-4">Professional Expertise & Achievements</p>
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p>
                      Explore Steven's diverse professional accomplishments spanning aviation, technology, and agriculture. Each achievement represents years of dedication and expertise applied to innovative farming solutions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accomplishments Grid */}
          <div className="grid gap-6">
            {accomplishments.map((accomplishment, index) => (
              <Link key={index} href={accomplishment.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                        {accomplishment.icon === "airplane" ? (
                          <svg width="24" height="24" viewBox="0 0 24 24">
                            <g>
                              {/* Main fuselage - light gray */}
                              <ellipse cx="12" cy="12" rx="7" ry="2.5" fill="#E5E7EB"/>
                              {/* Wings - blue */}
                              <ellipse cx="12" cy="12" rx="3" ry="9" fill="#3B82F6"/>
                              {/* Wing tips - darker blue */}
                              <ellipse cx="12" cy="5" rx="1.5" ry="2.5" fill="#1D4ED8"/>
                              <ellipse cx="12" cy="19" rx="1.5" ry="2.5" fill="#1D4ED8"/>
                              {/* Tail wing - blue */}
                              <path d="M5 12 L7 9 L9 11 L7 13 Z" fill="#3B82F6"/>
                              {/* Engines - gray */}
                              <ellipse cx="9" cy="7" rx="1" ry="1.5" fill="#9CA3AF"/>
                              <ellipse cx="15" cy="7" rx="1" ry="1.5" fill="#9CA3AF"/>
                              <ellipse cx="9" cy="17" rx="1" ry="1.5" fill="#9CA3AF"/>
                              <ellipse cx="15" cy="17" rx="1" ry="1.5" fill="#9CA3AF"/>
                              {/* Cockpit windows */}
                              <ellipse cx="17" cy="12" rx="1.5" ry="1" fill="#374151"/>
                            </g>
                          </svg>
                        ) : (
                          <accomplishment.icon className="h-6 w-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1 text-emerald-600">
                          {accomplishment.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mb-3">
                          {accomplishment.subtitle}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {accomplishment.description}
                    </p>
                    {accomplishment.action && (
                      <p className="text-emerald-600 font-medium text-sm hover:text-emerald-700">
                        {accomplishment.action}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>

        <FamilyMemberSidebar currentMemberId={1} />
      </div>
    </div>
  );
}