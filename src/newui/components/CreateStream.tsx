import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar, DollarSign, Clock, User, Info } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

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
    <div className="min-h-screen bg-background pt-8 pb-24 lg:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Stream</h1>
          <p className="text-muted-foreground">
            Set up a new real-time value stream and mint a tradeable NFT
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Stream Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Stream Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Software Developer Salary Q4 2024"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                      />
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
                      <Label htmlFor="streamType">Stream Type</Label>
                      <Select onValueChange={(value) => handleInputChange("streamType", value)}>
                        <SelectTrigger>
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
                  </div>

                  {/* Recipient */}
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="recipient"
                        placeholder="0x..."
                        className="pl-10"
                        value={formData.recipientAddress}
                        onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Amount & Token */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Total Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          className="pl-10"
                          value={formData.totalAmount}
                          onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="token">Token</Label>
                      <Select onValueChange={(value) => handleInputChange("tokenSymbol", value)}>
                        <SelectTrigger>
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
                  </div>

                  {/* Dates */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="startDate"
                          type="date"
                          className="pl-10"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange("startDate", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="endDate"
                          type="date"
                          className="pl-10"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange("endDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Create Stream & Mint NFT
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

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