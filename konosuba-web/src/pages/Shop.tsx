import { useGetShopItems, useBuyItem } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins } from "lucide-react";
import type { ShopItem } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetProfileQueryKey } from "@workspace/api-client-react";

export default function Shop() {
  const { data: items, isLoading } = useGetShopItems();
  const buyMutation = useBuyItem();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleBuy = (item: ShopItem) => {
    if (!item.key) return;
    buyMutation.mutate(
      { data: { item_key: item.key } },
      {
        onSuccess: (res) => {
          toast({
            title: "Purchase Successful",
            description: res.message || `You bought ${item.name}`,
          });
          queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
        },
        onError: (err: any) => {
          toast({
            variant: "destructive",
            title: "Purchase Failed",
            description: err?.message || "Not enough coins or an error occurred.",
          });
        },
      }
    );
  };

  const categories = items ? Array.from(new Set(items.map((item) => item.category).filter(Boolean))) as string[] : [];
  
  const groupedItems = items?.reduce((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, ShopItem[]>) || {};

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-48 h-10 mb-8 bg-white/5" />
        <Skeleton className="w-full h-12 mb-8 bg-white/5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-48 bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Item Shop</h1>
        <p className="text-white/60">Purchase items to help you on your journey.</p>
      </div>

      {categories.length > 0 && (
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto bg-black/40 border border-white/10 p-1 mb-6 flex-nowrap rounded-xl no-scrollbar">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat} 
                value={cat}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(groupedItems).map(([category, catItems]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {catItems.map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    key={item.key || i}
                  >
                    <Card className="bg-card/40 backdrop-blur-sm border-white/10 h-full flex flex-col hover:border-primary/50 transition-colors group">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                            {item.category}
                          </Badge>
                          <div className="text-4xl group-hover:scale-110 transition-transform">
                            {item.emoji || "📦"}
                          </div>
                        </div>
                        <CardTitle className="text-lg text-white mt-2 leading-tight">
                          {item.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-white/60 line-clamp-2">
                          {item.description}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 flex flex-col gap-3">
                        <div className="flex items-center gap-1.5 self-start bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-md font-mono font-bold">
                          <Coins className="w-4 h-4" />
                          <span>{item.price?.toLocaleString()}</span>
                        </div>
                        <Button 
                          className="w-full hover:shadow-[0_0_15px_rgba(0,168,232,0.4)]"
                          onClick={() => handleBuy(item)}
                          disabled={buyMutation.isPending}
                        >
                          Buy Item
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
