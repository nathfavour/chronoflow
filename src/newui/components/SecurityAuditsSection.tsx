import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Shield, ExternalLink, CheckCircle, FileText, Users, Globe, Clock } from "lucide-react";

const auditData = [
  {
    firm: "OpenZeppelin",
    status: "Completed",
    date: "Nov 2024",
    score: "9.8/10",
    issues: "0 Critical",
    link: "#",
    icon: Shield
  },
  {
    firm: "Consensys Diligence",
    status: "Completed", 
    date: "Oct 2024",
    score: "9.5/10",
    issues: "0 High",
    link: "#",
    icon: CheckCircle
  },
  {
    firm: "Trail of Bits",
    status: "In Progress",
    date: "Dec 2024",
    score: "Pending",
    issues: "TBD",
    link: "#",
    icon: FileText
  }
];

const securityFeatures = [
  {
    title: "Multi-Signature Wallets",
    description: "All protocol funds secured with multi-sig",
    icon: Users,
    status: "Active"
  },
  {
    title: "Time-locked Upgrades",
    description: "48-hour delay on all protocol changes",
    icon: Clock,
    status: "Active"
  },
  {
    title: "Bug Bounty Program",
    description: "Up to $100K rewards for security discoveries",
    icon: Globe,
    status: "Active"
  }
];

export function SecurityAuditsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Security & Audits</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ChronoFlow is built with security-first principles, audited by leading firms, and protected by industry best practices.
          </p>
        </motion.div>

        {/* Live Security Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="p-6 bg-gradient-to-r from-green-500/5 to-blue-500/5 border-green-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <h3 className="text-xl font-semibold">Live Security Status</h3>
              </div>
              <Badge className="bg-green-500/20 text-green-600 border-green-500/20">
                All Systems Secure
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">$50.2M</div>
                <div className="text-sm text-muted-foreground">Total Value Locked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">15,420</div>
                <div className="text-sm text-muted-foreground">Active Contracts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
                <div className="text-sm text-muted-foreground">Security Incidents</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Audit Results */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6">Smart Contract Audits</h3>
            <div className="space-y-4">
              {auditData.map((audit, index) => {
                const Icon = audit.icon;
                return (
                  <motion.div
                    key={audit.firm}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{audit.firm}</h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{audit.date}</span>
                              <span>•</span>
                              <span>{audit.score}</span>
                              <span>•</span>
                              <span className="text-green-600">{audit.issues}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={audit.status === "Completed" ? "default" : "secondary"}
                            className={audit.status === "Completed" ? "bg-green-500/20 text-green-600 border-green-500/20" : ""}
                          >
                            {audit.status}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6">Security Features</h3>
            <div className="space-y-4">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{feature.title}</h4>
                            <Badge className="bg-green-500/20 text-green-600 border-green-500/20 text-xs">
                              {feature.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Contract Verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-500/20">
            <h3 className="text-lg font-semibold mb-4">Verified Smart Contracts</h3>
            <p className="text-muted-foreground mb-6">
              All ChronoFlow smart contracts are open source and verified on Somnia Explorer
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="outline" size="sm" className="font-mono text-xs">
                <FileText className="w-4 h-4 mr-2" />
                ChronoFlow.sol
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
              <Button variant="outline" size="sm" className="font-mono text-xs">
                <FileText className="w-4 h-4 mr-2" />
                StreamNFT.sol
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
              <Button variant="outline" size="sm" className="font-mono text-xs">
                <FileText className="w-4 h-4 mr-2" />
                Marketplace.sol
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}