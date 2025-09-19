import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, DollarSign, Clock, User, Info, Plus, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { motion } from "framer-motion";

export function CreateStream() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    recipientAddress: "",
    tokenSymbol: "",
    totalAmount: "",
    startDate: "",
    endDate: "",
    streamType: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    console.log("Creating stream:", formData);
  };

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculatePerSecond = () => {
    if (formData.totalAmount && formData.startDate && formData.endDate) {
      const amount = parseFloat(formData.totalAmount);
      const days = calculateDuration();
      if (days > 0) {
        return (amount / (days * 24 * 60 * 60)).toFixed(8);
      }
    }
    return "0";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-8 pb-24 lg:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Create New Stream
          </h1>
          <p className="text-muted-foreground">
            Set up a new real-time value stream and mint a tradeable NFT
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>Stream Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">Stream Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Software Developer Salary Q4 2024"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary/50 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the purpose and terms of this stream..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={3}
                        className="bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary/50 transition-all duration-300 focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="streamType" className="text-sm font-medium">Stream Type</Label>
                      <Select onValueChange={(value) => handleInputChange("streamType", value)}>
                        <SelectTrigger className="bg-background/50 border-border/50 hover:border-primary/30 transition-all duration-300">
                          <SelectValue placeholder="Select stream type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salary">Salary</SelectItem>
                          <SelectItem value="vesting">Token Vesting</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
                          <SelectItem value="investment">Investment Payout</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>

                  {/* Recipient */}
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Label htmlFor="recipient" className="text-sm font-medium">Recipient Address</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="recipient"
                        placeholder="0x..."
                        className="pl-10 bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary/50 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                        value={formData.recipientAddress}
                        onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
                      />
                    </div>
                  </motion.div>

                  {/* Amount & Token */}
                  <motion.div 
                    className="grid md:grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-sm font-medium">Total Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-10 bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary/50 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          value={formData.totalAmount}
                          onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="token" className="text-sm font-medium">Token</Label>
                      <Select onValueChange={(value) => handleInputChange("tokenSymbol", value)}>
                        <SelectTrigger className="bg-background/50 border-border/50 hover:border-primary/30 transition-all duration-300">
                          <SelectValue placeholder="Select token" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USDC">USDC</SelectItem>
                          <SelectItem value="DAI">DAI</SelectItem>
                          <SelectItem value="USDT">USDT</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="WBTC">WBTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>

                  {/* Dates */}
                  <motion.div 
                    className="grid md:grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="startDate"
                          type="date"
                          className="pl-10 bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary/50 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange("startDate", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="endDate"
                          type="date"
                          className="pl-10 bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary/50 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange("endDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/80" 
                      size="lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Stream & Mint NFT
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Stream Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="text-sm font-medium">
                      {calculateDuration()} days
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Per Second</span>
                    <span className="text-sm font-medium">
                      {calculatePerSecond()} {formData.tokenSymbol || "TOKEN"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Per Hour</span>
                    <span className="text-sm font-medium">
                      {(parseFloat(calculatePerSecond()) * 3600).toFixed(4)} {formData.tokenSymbol || "TOKEN"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Per Day</span>
                    <span className="text-sm font-medium">
                      {formData.totalAmount && calculateDuration() > 0 
                        ? (parseFloat(formData.totalAmount) / calculateDuration()).toFixed(2)
                        : "0.00"} {formData.tokenSymbol || "TOKEN"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Creating a stream will mint an NFT that represents ownership of this cash flow. 
                The NFT can be traded, used as collateral, or fractionalized.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>NFT Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-40 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold">CF</span>
                    </div>
                    <p className="text-sm font-medium">ChronoFlow Stream</p>
                    <p className="text-xs text-muted-foreground">
                      {formData.title || "Untitled Stream"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  This NFT will be automatically minted when you create the stream
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}