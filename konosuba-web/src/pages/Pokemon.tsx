import { useGetMyPokemon } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { getToken } from "@/lib/auth";

export default function Pokemon() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!getToken()) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data, isLoading } = useGetMyPokemon();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Pokemon</h1>
        <p className="text-white/60">View and manage your caught Pokemon.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-32 rounded-xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.map((pokemon, i) => {
            const hpPercent = pokemon.max_hp ? (pokemon.hp! / pokemon.max_hp) * 100 : 100;
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                key={pokemon.id || i}
                className={`relative bg-card/40 backdrop-blur-sm rounded-xl p-4 border flex items-center gap-4 ${pokemon.in_party ? 'border-primary/50 bg-primary/5' : 'border-white/10'}`}
              >
                {pokemon.in_party && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground border-none">
                    Party
                  </Badge>
                )}
                
                <div className="w-16 h-16 flex-shrink-0 bg-black/30 rounded-lg flex items-center justify-center overflow-hidden">
                  {pokemon.sprite ? (
                    <img src={pokemon.sprite} alt={pokemon.name} className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-white/30">?</div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-white capitalize truncate">{pokemon.name}</h3>
                    <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">Lv.{pokemon.level}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-white/50">
                      <span>HP</span>
                      <span>{pokemon.hp}/{pokemon.max_hp}</span>
                    </div>
                    <Progress value={hpPercent} className="h-1.5 bg-white/10" indicatorColor={hpPercent > 50 ? "bg-green-500" : hpPercent > 20 ? "bg-yellow-500" : "bg-red-500"} />
                  </div>
                </div>
              </motion.div>
            );
          })}
          {(!data || data.length === 0) && (
            <div className="col-span-full py-12 text-center text-white/50">
              You haven't caught any Pokemon yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
