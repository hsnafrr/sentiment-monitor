import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play, Eye, Shield, Brain, Satellite, ChartLine, Globe, Lock } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Landing Section - Mission Briefing */}
      <section className="min-h-screen flex items-center justify-center relative pt-16 grid-pattern">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-background via-secondary to-background"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Mission Status Indicator */}
            <div className="inline-flex items-center space-x-2 bg-card border border-border rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-primary rounded-full pulse-red"></div>
              <span className="font-jetbrains text-sm text-muted-foreground">MISSION STATUS: ACTIVE</span>
            </div>

            {/* Main Hero Content */}
            <h1 className="font-orbitron font-black text-4xl sm:text-6xl lg:text-7xl mb-6 scanner-line">
              <span className="text-primary">MISSION</span><br />
              <span className="text-foreground">IMPOSSIBLE</span>
            </h1>
            
            <div className="max-w-3xl mx-auto mb-8">
              <h2 className="font-orbitron text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-4">
                SOCIAL SENTIMENT & TREND SURVEILLANCE
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Your mission, should you choose to accept it, is to infiltrate the digital landscape and extract critical intelligence from social media chatter. Monitor sentiment trends, identify emerging threats, and neutralize misinformation before it spreads.
              </p>
            </div>

            {/* Mission Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/dashboard">
                <Button 
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-orbitron font-bold text-lg hover:bg-accent transition-all duration-300 glow-red-intense hud-border"
                  data-testid="button-accept-mission"
                >
                  <Play className="mr-2 h-5 w-5" />
                  ACCEPT MISSION
                </Button>
              </Link>
              <Button 
                variant="outline"
                className="border border-border text-foreground px-8 py-4 rounded-lg font-medium hover:bg-secondary transition-colors"
                data-testid="button-view-demo"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>

            {/* Mission Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-6 hud-border" data-testid="stat-analyzed">
                <div className="text-2xl font-orbitron font-bold text-primary mb-2">1.2M+</div>
                <div className="text-muted-foreground">Posts Analyzed</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 hud-border" data-testid="stat-accuracy">
                <div className="text-2xl font-orbitron font-bold text-primary mb-2">99.7%</div>
                <div className="text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 hud-border" data-testid="stat-monitoring">
                <div className="text-2xl font-orbitron font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Real-time Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-orbitron font-bold text-3xl mb-4">MISSION CAPABILITIES</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Advanced surveillance technology powered by artificial intelligence and real-time data processing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:glow-red transition-all duration-300" data-testid="feature-ai-sentiment">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Brain className="text-primary text-xl" />
                </div>
                <h3 className="font-orbitron font-bold text-lg">AI Sentiment Analysis</h3>
              </div>
              <p className="text-muted-foreground">
                Advanced NLP models analyze emotional context with 99.7% accuracy across multiple languages and platforms.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:glow-red transition-all duration-300" data-testid="feature-realtime">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Satellite className="text-primary text-xl" />
                </div>
                <h3 className="font-orbitron font-bold text-lg">Real-time Monitoring</h3>
              </div>
              <p className="text-muted-foreground">
                24/7 surveillance of social media platforms with instant alert system for emerging threats and trends.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:glow-red transition-all duration-300" data-testid="feature-threat">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="text-primary text-xl" />
                </div>
                <h3 className="font-orbitron font-bold text-lg">Threat Detection</h3>
              </div>
              <p className="text-muted-foreground">
                Automated identification of misinformation campaigns and coordinated attacks across digital platforms.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:glow-red transition-all duration-300" data-testid="feature-predictive">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <ChartLine className="text-primary text-xl" />
                </div>
                <h3 className="font-orbitron font-bold text-lg">Predictive Analytics</h3>
              </div>
              <p className="text-muted-foreground">
                Machine learning algorithms predict sentiment trends and viral content patterns before they emerge.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:glow-red transition-all duration-300" data-testid="feature-global">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Globe className="text-primary text-xl" />
                </div>
                <h3 className="font-orbitron font-bold text-lg">Global Coverage</h3>
              </div>
              <p className="text-muted-foreground">
                Comprehensive monitoring across all major social platforms and geographic regions worldwide.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:glow-red transition-all duration-300" data-testid="feature-secure">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Lock className="text-primary text-xl" />
                </div>
                <h3 className="font-orbitron font-bold text-lg">Secure Operations</h3>
              </div>
              <p className="text-muted-foreground">
                Military-grade encryption and security protocols ensure all intelligence gathering remains classified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <Shield className="text-primary text-2xl" />
                <span className="font-orbitron font-bold text-xl">MI SENTINEL</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Advanced social sentiment surveillance system. This message will self-destruct in 30 seconds.
              </p>
            </div>

            <div>
              <h4 className="font-orbitron font-bold mb-4">OPERATIONS</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Live Dashboard</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Mission Reports</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Alert System</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Intelligence Archive</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-orbitron font-bold mb-4">SUPPORT</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Field Manual</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact HQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Emergency Protocol</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Mission Impossible - Sentinel System. All intelligence classified.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Protocol</a>
              <a href="#" className="hover:text-primary transition-colors">Security Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Mission Guidelines</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
