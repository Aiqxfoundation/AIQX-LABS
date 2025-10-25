import MainLayout from "@/components/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CHAIN_DEFINITIONS } from "@/config/chains";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { AnimatedPage, StaggerContainer, StaggerItem, FadeIn, AnimatedCard } from "@/components/animated-wrapper";
import { motion } from "framer-motion";

export default function Home() {
  const chains = Object.values(CHAIN_DEFINITIONS);

  return (
    <MainLayout>
      <AnimatedPage className="max-w-6xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <FadeIn className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-block px-4 py-1.5 bg-cyan-900/20 text-[#00d4ff] rounded-full text-sm font-medium mb-6"
          >
            Multi-Chain Token Platform
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Tokens & Tools with Ease
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Launch tokens, manage liquidity, and use advanced tools across multiple blockchains. Effortless and without coding.
          </motion.p>
        </FadeIn>

        {/* Blockchain Selection */}
        <FadeIn delay={0.3} className="mb-16">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Select Your Blockchain
          </h2>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chains.map((chain, index) => {
              const Icon = chain.icon;
              return (
                <StaggerItem key={chain.id}>
                  <Link href={`/chain/${chain.id}`}>
                    <AnimatedCard 
                      delay={index * 0.05}
                      className="h-full"
                    >
                      <Card className="bg-gray-900 border-gray-800 hover:border-[#00d4ff] transition-all cursor-pointer group h-full hover-elevate">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3 mb-2">
                            <motion.div 
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="h-10 w-10 rounded-lg bg-cyan-900/20 flex items-center justify-center group-hover:bg-cyan-900/30 transition-colors"
                            >
                              <Icon className="h-5 w-5 text-[#00d4ff]" />
                            </motion.div>
                            <div>
                              <CardTitle className="text-base text-white">
                                {chain.displayName}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {chain.network}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-[#00d4ff] hover:bg-cyan-900/20 group"
                            data-testid={`button-select-${chain.id}`}
                          >
                            Get Started 
                            <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </AnimatedCard>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </FadeIn>

        {/* Features */}
        <FadeIn delay={0.5} className="mb-16">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            What You Can Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-gray-900 border-gray-800 h-full hover-elevate">
                <CardHeader>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="h-12 w-12 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center mb-4"
                  >
                    <Sparkles className="h-6 w-6 text-[#00d4ff]" />
                  </motion.div>
                  <CardTitle className="text-base">Create Tokens</CardTitle>
                  <CardDescription className="text-sm">
                    Deploy custom tokens across multiple blockchains without coding
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-gray-900 border-gray-800 h-full hover-elevate">
                <CardHeader>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4"
                  >
                    <Shield className="h-6 w-6 text-purple-500" />
                  </motion.div>
                  <CardTitle className="text-base">Manage Authority</CardTitle>
                  <CardDescription className="text-sm">
                    Revoke or transfer mint and freeze authorities with ease
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-gray-900 border-gray-800 h-full hover-elevate">
                <CardHeader>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4"
                  >
                    <Zap className="h-6 w-6 text-green-500" />
                  </motion.div>
                  <CardTitle className="text-base">Advanced Tools</CardTitle>
                  <CardDescription className="text-sm">
                    Access multisender, token burning, and metadata updates
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </FadeIn>

      </AnimatedPage>
    </MainLayout>
  );
}