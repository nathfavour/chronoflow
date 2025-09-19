import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Star, Quote, TrendingUp, Users, DollarSign } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "DeFi Fund Manager",
    company: "Vertex Capital",
    image: "https://images.unsplash.com/photo-1494790108755-2616c82c1c13?w=150&h=150&fit=crop&crop=face",
    quote: "ChronoFlow has revolutionized how we handle recurring payments. The NFT liquidity layer is genius - we can now trade future cash flows like any other asset.",
    rating: 5,
    streamValue: "$2.4M"
  },
  {
    name: "Marcus Rodriguez",
    role: "Startup Founder",
    company: "FlowTech",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote: "The real-time streaming on Somnia is incredibly fast. We've saved over 80% on gas fees compared to Ethereum while getting instant settlement.",
    rating: 5,
    streamValue: "$180K"
  },
  {
    name: "Dr. Lisa Park",
    role: "Blockchain Researcher",
    company: "MIT Digital Currency Lab",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote: "The technical implementation is solid. Having audited the contracts, I'm impressed by the security-first approach and innovative use of NFTs for liquidity.",
    rating: 5,
    streamValue: "$450K"
  }
];

const stats = [
  {
    icon: Users,
    value: "12,500+",
    label: "Active Users",
    growth: "+45%"
  },
  {
    icon: DollarSign,
    value: "$50.2M",
    label: "Total Streamed",
    growth: "+120%"
  },
  {
    icon: TrendingUp,
    value: "98.7%",
    label: "User Satisfaction",
    growth: "+2.1%"
  }
];

const companies = [
  { name: "Vertex Capital", logo: "VC" },
  { name: "FlowTech", logo: "FT" },
  { name: "MIT Labs", logo: "MIT" },
  { name: "DeFi Alliance", logo: "DA" },
  { name: "Somnia Foundation", logo: "SF" },
  { name: "Web3 Ventures", logo: "W3" }
];

export function SocialProofSection() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-600 border-green-500/20">
                      {stat.growth} this month
                    </Badge>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Testimonials Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">4.9/5 from 500+ reviews</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Trusted by Industry Leaders</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what DeFi professionals, developers, and researchers are saying about ChronoFlow
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <div className="mb-6">
                  <Quote className="w-8 h-8 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">{testimonial.streamValue}</div>
                    <div className="text-xs text-muted-foreground">Streamed</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Company Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-8">Trusted by leading DeFi organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="flex items-center space-x-2 hover:opacity-100 transition-opacity"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{company.logo}</span>
                </div>
                <span className="text-sm font-medium">{company.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}