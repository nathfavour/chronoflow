"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  User, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  Shield,
  TrendingUp,
  Copy,
  ExternalLink,
  ArrowRight,
  Play
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { useWeb3 } from "@/web3/context";
import { ConnectButton } from "./ConnectButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { toast } from "sonner";

interface FormData {
  title: string;
  description: string;
  recipientAddress: string;
  tokenSymbol: string;
  totalAmount: string;
  startDate: string;
  endDate: string;
  streamType: string;
  tags: string[];
  autoRenewal: boolean;
  cliffPeriod: string;
  cancelable: boolean;
}

const STREAM_TEMPLATES = [
  {
    id: "salary",
    name: "Monthly Salary",
    description: "Regular monthly salary payments",
    icon: "💼",
    preset: {
      streamType: "salary",
      totalAmount: "8000",
      tags: ["salary", "employment"]
    }
  },
  {
    id: "vesting",
    name: "Token Vesting",
    description: "Gradual token release schedule",
    icon: "🔒",
    preset: {
      streamType: "vesting",
      totalAmount: "100000",
      tags: ["vesting", "tokens"]
    }
  },
  {
    id: "freelance",
    name: "Freelance Project",
    description: "Project-based payments",
    icon: "🚀",
    preset: {
      streamType: "custom",
      totalAmount: "5000",
      tags: ["freelance", "project"]
    }
  }
];

const VALIDATION_RULES = {
  title: { required: true, minLength: 3, maxLength: 100 },
  recipientAddress: { required: true, pattern: /^0x[a-fA-F0-9]{40}$/ },
  totalAmount: { required: true, min: 0.01 },
  startDate: { required: true },
  endDate: { required: true },
  streamType: { required: true }
};

export function EnhancedCreateStream() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    recipientAddress: "",
    tokenSymbol: "",
    totalAmount: "",
    startDate: "",
    endDate: "",
    streamType: "",
    tags: [],
    autoRenewal: false,
    cliffPeriod: "",
    cancelable: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedGasCost, setEstimatedGasCost] = useState("0.0024");
  const { address, createStream, getNextStreamId, tx } = useWeb3();
  const [nextStreamId, setNextStreamId] = useState<bigint | null>(null);

  // Fetch next stream id once wallet connected (preview)
  useEffect(() => {
    if (address && nextStreamId === null) {
      (async () => {
        try {
          const id = await getNextStreamId();
            if (id) setNextStreamId(id);
        } catch (e) {
          console.warn("Failed to fetch next stream id", e);
        }
      })();
    }
  }, [address, nextStreamId, getNextStreamId]);

  const steps = [
    { id: "template", title: "Choose Template", icon: "📋" },
    { id: "details", title: "Stream Details", icon: "📝" },
    { id: "recipient", title: "Recipient & Amount", icon: "💰" },
    { id: "schedule", title: "Schedule", icon: "📅" },
    { id: "review", title: "Review & Create", icon: "✅" }
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Details
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.streamType) newErrors.streamType = "Stream type is required";
        break;
      case 2: // Recipient & Amount
        if (!formData.recipientAddress) {
          newErrors.recipientAddress = "Recipient address is required";
        } else if (!VALIDATION_RULES.recipientAddress.pattern.test(formData.recipientAddress)) {
          newErrors.recipientAddress = "Invalid Ethereum address";
        }
        if (!formData.totalAmount) {
          newErrors.totalAmount = "Amount is required";
        } else if (parseFloat(formData.totalAmount) <= 0) {
          newErrors.totalAmount = "Amount must be greater than 0";
        }
        if (!formData.tokenSymbol) newErrors.tokenSymbol = "Token is required";
        break;
      case 3: // Schedule
        if (!formData.startDate) newErrors.startDate = "Start date is required";
        if (!formData.endDate) newErrors.endDate = "End date is required";
        if (formData.startDate && formData.endDate) {
          if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            newErrors.endDate = "End date must be after start date";
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const applyTemplate = (template: typeof STREAM_TEMPLATES[0]) => {
    setFormData(prev => ({
      ...prev,
      ...template.preset,
      tags: template.preset.tags
    }));
    nextStep();
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

  const calculateRates = () => {
    if (formData.totalAmount && formData.startDate && formData.endDate) {
      const amount = parseFloat(formData.totalAmount);
      const days = calculateDuration();
      const seconds = days * 24 * 60 * 60;
      
      return {
        perSecond: seconds > 0 ? (amount / seconds).toFixed(8) : "0",
        perMinute: seconds > 0 ? (amount / (seconds / 60)).toFixed(6) : "0",
        perHour: seconds > 0 ? (amount / (seconds / 3600)).toFixed(4) : "0",
        perDay: days > 0 ? (amount / days).toFixed(2) : "0"
      };
    }
    return { perSecond: "0", perMinute: "0", perHour: "0", perDay: "0" };
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    if (!address) {
      toast.error("Connect wallet to create stream");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      toast.error("Start and end date required");
      return;
    }
    const start = Math.floor(new Date(formData.startDate).getTime() / 1000);
    const stop = Math.floor(new Date(formData.endDate).getTime() / 1000);
    if (isNaN(start) || isNaN(stop)) {
      toast.error("Invalid date(s)");
      return;
    }
    if (stop <= start) {
      toast.error("End time must be after start time");
      return;
    }
    try {
      setIsSubmitting(true);
      const resultPromise = createStream({
        recipient: formData.recipientAddress,
        amount: formData.totalAmount,
        tokenSymbol: formData.tokenSymbol,
        start,
        stop
      });
      await toast.promise(
        resultPromise,
        {
          loading: "Submitting transaction...",
          success: (res) => {
            return res?.streamId ? `Stream #${res.streamId.toString()} created` : "Stream created";
          },
            error: (e) => e?.message || "Transaction failed"
        }
      );
      // Refresh preview id for next potential stream
      try {
        const id = await getNextStreamId();
        if (id) setNextStreamId(id);
      } catch {}
    } catch (error) {
      console.error("Error creating stream:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const rates = calculateRates();

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 lg:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Progress */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Create New Stream</h1>
              <p className="text-muted-foreground">
                {steps[currentStep].title} • Step {currentStep + 1} of {steps.length}
              </p>
            </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-600 border-blue-500/20">
                  Somnia Network
                </Badge>
                {/* Unified Connect Button */}
                <ConnectButton size="sm" />
              </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-1">
                  <span className={index <= currentStep ? "text-primary" : ""}>
                    {step.icon} {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 0: Template Selection */}
              {currentStep === 0 && (
                <motion.div
                  key="template"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Choose a Template</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Start with a pre-configured template or create from scratch
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        {STREAM_TEMPLATES.map((template) => (
                          <motion.div
                            key={template.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card 
                              className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary/20"
                              onClick={() => applyTemplate(template)}
                            >
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl mb-2">{template.icon}</div>
                                <h3 className="font-semibold mb-1">{template.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {template.description}
                                </p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={nextStep}
                        disabled={isSubmitting || tx.pending}
                      >
                        Start from Scratch
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 1: Stream Details */}
              {currentStep === 1 && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Stream Details</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Provide basic information about your stream
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Stream Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Software Developer Salary Q4 2024"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          className={errors.title ? "border-red-500" : ""}
                        />
                        {errors.title && (
                          <p className="text-sm text-red-500">{errors.title}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the purpose and terms of this stream..."
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="streamType">Stream Type *</Label>
                        <Select 
                          onValueChange={(value) => handleInputChange("streamType", value)}
                          value={formData.streamType}
                        >
                          <SelectTrigger className={errors.streamType ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select stream type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="salary">💼 Salary</SelectItem>
                            <SelectItem value="vesting">🔒 Token Vesting</SelectItem>
                            <SelectItem value="subscription">📱 Subscription</SelectItem>
                            <SelectItem value="investment">📈 Investment Payout</SelectItem>
                            <SelectItem value="custom">⚙️ Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.streamType && (
                          <p className="text-sm text-red-500">{errors.streamType}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Recipient & Amount */}
              {currentStep === 2 && (
                <motion.div
                  key="recipient"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Recipient & Amount</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Configure payment details and token selection
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="recipient">Recipient Address *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="recipient"
                            placeholder="0x..."
                            className={`pl-10 ${errors.recipientAddress ? "border-red-500" : ""}`}
                            value={formData.recipientAddress}
                            onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
                          />
                        </div>
                        {errors.recipientAddress && (
                          <p className="text-sm text-red-500">{errors.recipientAddress}</p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Total Amount *</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className={`pl-10 ${errors.totalAmount ? "border-red-500" : ""}`}
                              value={formData.totalAmount}
                              onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                            />
                          </div>
                          {errors.totalAmount && (
                            <p className="text-sm text-red-500">{errors.totalAmount}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="token">Token *</Label>
                          <Select 
                            onValueChange={(value) => handleInputChange("tokenSymbol", value)}
                            value={formData.tokenSymbol}
                          >
                            <SelectTrigger className={errors.tokenSymbol ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USDC">💰 USDC</SelectItem>
                              <SelectItem value="DAI">🏛️ DAI</SelectItem>
                              <SelectItem value="USDT">💵 USDT</SelectItem>
                              <SelectItem value="ETH">🔷 ETH</SelectItem>
                              <SelectItem value="WBTC">₿ WBTC</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.tokenSymbol && (
                            <p className="text-sm text-red-500">{errors.tokenSymbol}</p>
                          )}
                        </div>
                      </div>

                      {/* Gas Estimate */}
                      <Alert>
                        <Zap className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-center justify-between">
                            <span>Estimated gas cost: ${estimatedGasCost}</span>
                            <Badge variant="secondary" className="bg-green-500/20 text-green-600">
                              95% cheaper than Ethereum
                            </Badge>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Schedule */}
              {currentStep === 3 && (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Schedule Configuration</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Set up when your stream starts and ends
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date *</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="startDate"
                              type="datetime-local"
                              className={`pl-10 ${errors.startDate ? "border-red-500" : ""}`}
                              value={formData.startDate}
                              onChange={(e) => handleInputChange("startDate", e.target.value)}
                            />
                          </div>
                          {errors.startDate && (
                            <p className="text-sm text-red-500">{errors.startDate}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="endDate">End Date *</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="endDate"
                              type="datetime-local"
                              className={`pl-10 ${errors.endDate ? "border-red-500" : ""}`}
                              value={formData.endDate}
                              onChange={(e) => handleInputChange("endDate", e.target.value)}
                            />
                          </div>
                          {errors.endDate && (
                            <p className="text-sm text-red-500">{errors.endDate}</p>
                          )}
                        </div>
                      </div>

                      {/* Advanced Options */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-4">Advanced Options</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Cancelable Stream</Label>
                              <p className="text-sm text-muted-foreground">
                                Allow sender to cancel the stream
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={formData.cancelable}
                              onChange={(e) => handleInputChange("cancelable", e.target.checked)}
                              className="w-4 h-4"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Review & Create</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Verify all details before creating your stream
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Summary */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium">Stream Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Title:</span>
                              <span>{formData.title}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span>{formData.streamType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Recipient:</span>
                              <span className="font-mono text-xs">
                                {formData.recipientAddress.slice(0, 6)}...{formData.recipientAddress.slice(-4)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium">Payment Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Amount:</span>
                              <span>{formData.totalAmount} {formData.tokenSymbol}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Duration:</span>
                              <span>{calculateDuration()} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Per Day:</span>
                              <span>{rates.perDay} {formData.tokenSymbol}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isSubmitting || tx.pending}
                      >
                        {isSubmitting || tx.pending ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{tx.pending ? 'Waiting for confirmation...' : 'Creating Stream...'}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Play className="w-4 h-4" />
                            <span>Create Stream & Mint NFT</span>
                          </div>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0 || isSubmitting || tx.pending}
              >
                Previous
              </Button>
              {currentStep < steps.length - 1 && (
                <Button onClick={nextStep} disabled={isSubmitting || tx.pending}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Live Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{calculateDuration()} days</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Per Second</span>
                    <span className="font-medium font-mono">
                      {rates.perSecond} {formData.tokenSymbol || "TOKEN"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Per Hour</span>
                    <span className="font-medium">
                      {rates.perHour} {formData.tokenSymbol || "TOKEN"}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Per Day</span>
                    <span className="font-medium">
                      {rates.perDay} {formData.tokenSymbol || "TOKEN"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NFT Preview */}
            <Card>
              <CardHeader>
                <CardTitle>NFT Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-48 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-border">
                  <div className="text-center">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto mb-3 flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-white font-bold text-lg">CF</span>
                    </motion.div>
                    <p className="font-medium">ChronoFlow Stream</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.title || "Untitled Stream"}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {nextStreamId ? `#${nextStreamId.toString()}` : "#??????"}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  This NFT will be automatically minted when you create the stream
                </p>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Security Features</p>
                  <ul className="text-xs space-y-1">
                    <li>✓ Audited smart contracts</li>
                    <li>✓ Multi-signature protection</li>
                    <li>✓ Somnia network security</li>
                    <li>✓ Instant finality</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
