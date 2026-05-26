import { useState } from "react";
import { useGetCardGallery } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Cards() {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<string>("all");

  const queryParams = {
    ...(search ? { search } : {}),
    ...(tier !== "all" ? { tier } : {}),
    limit: 50
  };

  const { data, isLoading } = useGetCardGallery(queryParams);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Card Gallery</h1>
          <p className="text-white/60">Discover all available anime cards in the game.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input 
              placeholder="Search cards..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card/50 border-white/10 text-white"
            />
          </div>
          <Select value={tier} onValueChange={setTier}>
            <SelectTrigger className="w-32 bg-card/50 border-white/10 text-white">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="T1">Tier 1</SelectItem>
              <SelectItem value="T2">Tier 2</SelectItem>
              <SelectItem value="T3">Tier 3</SelectItem>
              <SelectItem value="T4">Tier 4</SelectItem>
              <SelectItem value="T5">Tier 5</SelectItem>
              <SelectItem value="T6">Tier 6</SelectItem>
              <SelectItem value="T7">Tier 7</SelectItem>
              <SelectItem value="T8">Tier 8</SelectItem>
              <SelectItem value="TS">Tier S</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="w-full aspect-[2.5/3.5] rounded-xl bg-white/5" />
              <Skeleton className="h-4 w-3/4 bg-white/5" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data?.cards?.map((card, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              key={card.id || i}
              className="group relative bg-card rounded-xl overflow-hidden border border-white/10 flex flex-col"
            >
              <div className="aspect-[2.5/3.5] bg-black/40 relative overflow-hidden">
                {card.image ? (
                  <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/60 backdrop-blur-md border-white/20 text-white font-bold tracking-wider">
                    {card.tier}
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-card flex-1 flex flex-col justify-between">
                <h3 className="font-semibold text-white text-sm line-clamp-1">{card.name}</h3>
                <p className="text-xs text-white/50 mt-1">{card.owners} Owners</p>
              </div>
            </motion.div>
          ))}
          {(!data?.cards || data.cards.length === 0) && (
            <div className="col-span-full py-12 text-center text-white/50">
              No cards found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
