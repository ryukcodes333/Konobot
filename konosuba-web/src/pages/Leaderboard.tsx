import { useGetWealthLeaderboard, useGetLevelLeaderboard } from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Trophy, Coins, Star, Medal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { LeaderboardEntry } from "@workspace/api-client-react";

export default function Leaderboard() {
  const { data: wealthData, isLoading: wealthLoading } = useGetWealthLeaderboard();
  const { data: levelData, isLoading: levelLoading } = useGetLevelLeaderboard();

  const renderRankBadge = (rank: number) => {
    if (rank === 1) return <div className="w-8 h-8 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold text-sm border border-yellow-400/50"><Trophy className="w-4 h-4" /></div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-full bg-gray-300/20 text-gray-300 flex items-center justify-center font-bold text-sm border border-gray-300/50"><Medal className="w-4 h-4" /></div>;
    if (rank === 3) return <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-600/50"><Medal className="w-4 h-4" /></div>;
    return <div className="w-8 h-8 rounded-full bg-white/5 text-white/60 flex items-center justify-center font-medium text-sm">{rank}</div>;
  };

  const renderList = (data: LeaderboardEntry[] | undefined, isLoading: boolean, valueIcon: React.ReactNode, valueLabel: string) => {
    if (isLoading) {
      return (
        <div className="space-y-2 mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-16 rounded-xl bg-white/5" />
          ))}
        </div>
      );
    }

    if (!data || data.length === 0) {
      return <div className="text-center py-12 text-white/50">No data available.</div>;
    }

    return (
      <div className="space-y-2 mt-6">
        {data.map((entry, i) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            key={entry.phone || i}
            className="flex items-center justify-between p-4 bg-card/40 backdrop-blur-sm border border-white/5 rounded-xl hover:bg-card/60 transition-colors"
          >
            <div className="flex items-center gap-4">
              {renderRankBadge(entry.rank || i + 1)}
              <Avatar className="w-10 h-10 border border-white/10">
                <AvatarFallback className="bg-primary/20 text-primary">
                  {entry.name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-white">{entry.name || entry.phone}</div>
                {entry.role && entry.role !== "user" && (
                  <div className="text-xs text-primary">{entry.role}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-lg font-bold">
              {valueIcon}
              <span className="text-white/90">{entry.value?.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">Hall of Fame</h1>
        <p className="text-white/60">The strongest and wealthiest players in KonoBot.</p>
      </div>

      <Tabs defaultValue="wealth" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-white/10 p-1">
          <TabsTrigger value="wealth" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Wealth
          </TabsTrigger>
            <TabsTrigger value="level" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Levels
          </TabsTrigger>
        </TabsList>
        <TabsContent value="wealth">
          {renderList(wealthData, wealthLoading, <Coins className="w-5 h-5 text-yellow-400" />, "Coins")}
        </TabsContent>
        <TabsContent value="level">
          {renderList(levelData, levelLoading, <Star className="w-5 h-5 text-primary" />, "XP")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
