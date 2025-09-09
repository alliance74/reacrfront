import { Button } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="RizzChat Hero" 
          className="w-full h-full object-cover opacity-100"
        />
        { <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20"></div> }
      </div>
      
      <div className="container mx-auto text-center max-w-4xl relative z-50">
        <Badge className="mb-6 animate-fade-in" variant="secondary">
           The #1 Rizz Assistant
        </Badge>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
          Never Run Out of{" "}
          <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Rizz Lines
          </span>{" "}
          Again
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up delay-100">
          Upload screenshots or paste messages to get AI-generated responses 
          that'll make you the smoothest person in the chat
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-200">
          <Button variant="hero" size="xl" className="min-w-[200px]" onClick={onGetStarted}>
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="glass" size="xl" className="min-w-[200px]">
            Watch Demo
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4 animate-fade-in delay-300">
          10 free messages • No credit card required
        </p>
      </div>
    </section>
  );
};