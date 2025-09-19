import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Wallet, 
  Activity,
  Eye,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

interface SecurityMetric {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: "excellent" | "good" | "warning" | "critical";
  description: string;
  actionRequired?: string;
}

interface PortfolioSecurityData {
  overallScore: number;
  maxScore: number;
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
  metrics: SecurityMetric[];
  lastUpdated: Date;
  riskLevel: "low" | "medium" | "high" | "critical";
}

const mockSecurityData: PortfolioSecurityData = {
  overallScore: 87,
  maxScore: 100,
  grade: "A",
  riskLevel: "low",
  lastUpdated: new Date(),
  metrics: [
    {
      id: "wallet_security",
      name: "Wallet Security",
      score: 95,
      maxScore: 100,
      status: "excellent",
      description: "Multi-sig enabled, hardware wallet connected"
    },
    {
      id: "contract_interactions",
      name: "Contract Safety",
      score: 88,
      maxScore: 100,
      status: "good",
      description: "Interacting with audited contracts only"
    },
    {
      id: "transaction_patterns",
      name: "Transaction Patterns",
      score: 92,
      maxScore: 100,
      status: "excellent",
      description: "Normal activity, no suspicious patterns"
    },
    {
      id: "exposure_risk",
      name: "Exposure Risk",
      score: 75,
      maxScore: 100,
      status: "warning",
      description: "High concentration in single token",
      actionRequired: "Consider diversifying token holdings"
    },
    {
      id: "stream_health",
      name: "Stream Health",
      score: 94,
      maxScore: 100,
      status: "excellent",
      description: "All streams operating normally"
    }
  ]
};

const getStatusColor = (status: SecurityMetric["status"]) => {
  switch (status) {
    case "excellent":
      return "text-green-600 bg-green-500/20 border-green-500/20";
    case "good":
      return "text-blue-600 bg-blue-500/20 border-blue-500/20";
    case "warning":
      return "text-yellow-600 bg-yellow-500/20 border-yellow-500/20";
    case "critical":
      return "text-red-600 bg-red-500/20 border-red-500/20";
  }
};

const getStatusIcon = (status: SecurityMetric["status"]) => {
  switch (status) {
    case "excellent":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "good":
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "critical":
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
  }
};

const getGradeColor = (grade: PortfolioSecurityData["grade"]) => {
  if (grade.startsWith("A")) return "text-green-600";
  if (grade.startsWith("B")) return "text-blue-600";
  if (grade.startsWith("C")) return "text-yellow-600";
  return "text-red-600";
};

const getRiskLevelColor = (riskLevel: PortfolioSecurityData["riskLevel"]) => {
  switch (riskLevel) {
    case "low":
      return "bg-green-500/20 text-green-600 border-green-500/20";
    case "medium":
      return "bg-yellow-500/20 text-yellow-600 border-yellow-500/20";
    case "high":
      return "bg-orange-500/20 text-orange-600 border-orange-500/20";
    case "critical":
      return "bg-red-500/20 text-red-600 border-red-500/20";
  }
};

export function PortfolioSecurityScore() {
  const [securityData, setSecurityData] = useState<PortfolioSecurityData>(mockSecurityData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const refreshSecurityScore = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate slight score variations
    const updatedData = {
      ...securityData,
      overallScore: Math.max(70, Math.min(100, securityData.overallScore + (Math.random() * 6 - 3))),
      lastUpdated: new Date(),
      metrics: securityData.metrics.map(metric => ({
        ...metric,
        score: Math.max(60, Math.min(100, metric.score + (Math.random() * 4 - 2)))
      }))
    };
    
    setSecurityData(updatedData);
    setIsRefreshing(false);
  };

  const overallPercentage = (securityData.overallScore / securityData.maxScore) * 100;

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <span>Portfolio Security</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getRiskLevelColor(securityData.riskLevel)}>
              {securityData.riskLevel.toUpperCase()} RISK
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={refreshSecurityScore}
              disabled={isRefreshing}
              className="w-8 h-8 p-0"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted stroke-current"
                  strokeWidth="2"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  className="text-blue-500 stroke-current"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  initial={{ strokeDasharray: "0 100" }}
                  animate={{ strokeDasharray: `${overallPercentage} 100` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-lg font-bold ${getGradeColor(securityData.grade)}`}>
                    {securityData.grade}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="space-y-1">
            <div className="text-2xl font-bold">{securityData.overallScore}/100</div>
            <div className="text-sm text-muted-foreground">Security Score</div>
            <div className="text-xs text-muted-foreground">
              Last updated: {securityData.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Quick Metrics Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <Wallet className="w-4 h-4 mx-auto mb-1 text-blue-500" />
            <div className="text-xs text-muted-foreground">Wallet</div>
            <div className="text-sm font-semibold">Protected</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <Activity className="w-4 h-4 mx-auto mb-1 text-green-500" />
            <div className="text-xs text-muted-foreground">Streams</div>
            <div className="text-sm font-semibold">Healthy</div>
          </div>
        </div>

        {/* Toggle Details */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full"
        >
          <Eye className="w-4 h-4 mr-2" />
          {showDetails ? "Hide Details" : "View Details"}
        </Button>

        {/* Detailed Metrics */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {securityData.metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(metric.status)}
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <Badge variant="secondary" className={`text-xs ${getStatusColor(metric.status)}`}>
                    {metric.score}/{metric.maxScore}
                  </Badge>
                </div>
                
                <Progress value={(metric.score / metric.maxScore) * 100} className="h-2" />
                
                <div className="text-xs text-muted-foreground">
                  {metric.description}
                </div>
                
                {metric.actionRequired && (
                  <div className="text-xs text-yellow-600 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    {metric.actionRequired}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Security Tips */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Security Tips</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Enable multi-signature for large transactions</div>
            <div>• Diversify your token holdings</div>
            <div>• Monitor stream health regularly</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}