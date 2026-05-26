import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Shield, Swords, Coins } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-20 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl flex flex-col items-center text-center space-y-8"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full" />
          <img
            src={`${import.meta.env.BASE_URL}aqua.jpg`}
            alt="Aqua"
            className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-primary/50 shadow-[0_0_30px_rgba(0,168,232,0.5)] object-cover relative z-10"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
            Welcome to <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">KonoBot</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
            Manage your anime cards, battle pokemon, and dominate the economy all from your browser.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(0,168,232,0.4)]">
              Get Started
            </Button>
          </Link>
          <Link href="/cards">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full">
              View Cards
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-24"
      >
        <div className="bg-card/50 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-white">Card Collecting</h3>
          <p className="text-white/60 text-sm">
            Collect thousands of unique anime cards, build your perfect deck, and trade with others.
          </p>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
            <Swords className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-white">Pokemon Battles</h3>
          <p className="text-white/60 text-sm">
            Catch and train your favorite Pokemon. Form a party and battle your way to the top.
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
            <Coins className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-white">Economy System</h3>
          <p className="text-white/60 text-sm">
            Earn coins, buy powerful items in the shop, and climb the wealth leaderboard.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
