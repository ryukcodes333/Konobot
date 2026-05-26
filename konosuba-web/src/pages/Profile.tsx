import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getToken } from "@/lib/auth";
import { 
  useGetProfile, 
  useGetMyDeck, 
  useGetMyCollection, 
  useGetMyPokemon, 
  useGetFrames,
  useUpdateProfile
} from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Landmark, Star, Medal, Shield, Swords, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQueryClient } from "@tanstack/react-query";
import { getGetProfileQueryKey } from "@workspace/api-client-react";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!getToken()) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: deck, isLoading: deckLoading } = useGetMyDeck();
  const { data: collection, isLoading: collectionLoading } = useGetMyCollection();
  const { data: pokemon, isLoading: pokemonLoading } = useGetMyPokemon();
  const { data: frames } = useGetFrames();

  const updateProfileMutation = useUpdateProfile();

  const [avatarUrl, setAvatarUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isFrameOpen, setIsFrameOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setAvatarUrl(profile.profile_pp || "");
      setCoverUrl(profile.profile_bg || "");
    }
  }, [profile]);

  const handleUpdateAvatar = () => {
    updateProfileMutation.mutate({ data: { profile_pp: avatarUrl } }, {
      onSuccess: () => {
        toast({ title: "Avatar updated" });
        setIsAvatarOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
      }
    });
  };

  const handleUpdateCover = () => {
    updateProfileMutation.mutate({ data: { profile_bg: coverUrl } }, {
      onSuccess: () => {
        toast({ title: "Cover updated" });
        setIsCoverOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
      }
    });
  };

  const handleSelectFrame = (frameId: number) => {
    updateProfileMutation.mutate({ data: { profile_frame: frameId } }, {
      onSuccess: () => {
        toast({ title: "Frame updated" });
        setIsFrameOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
      }
    });
  };

  if (profileLoading) {
    return <div className="min-h-screen pt-16 flex justify-center"><Skeleton className="w-full max-w-4xl h-96 bg-white/5" /></div>;
  }

  if (!profile) return null;

  return (
    <div className="w-full bg-background min-h-screen pb-16">
      {/* Cover Background */}
      <div 
        className="w-full h-64 md:h-80 bg-black relative"
      >
        {profile.profile_bg ? (
          <img src={profile.profile_bg} alt="Cover" className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/40 to-blue-900/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-24 md:-mt-32 relative z-10">
        <div className="flex flex-col items-center">
          {/* Avatar and Frame */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center bg-background p-2 shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-secondary relative z-10">
              {profile.profile_pp ? (
                <img src={profile.profile_pp} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-white/30 font-bold">
                  {profile.name?.charAt(0) || "?"}
                </div>
              )}
            </div>
            
            {/* Frame Overlay */}
            {profile.profile_frame && frames && (
              <div className="absolute inset-0 z-20 pointer-events-none scale-[1.15]">
                {frames.find(f => f.id === profile.profile_frame)?.preview && (
                  <img src={frames.find(f => f.id === profile.profile_frame)?.preview!} alt="Frame" className="w-full h-full object-contain" />
                )}
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mt-4">{profile.name}</h1>
          <p className="text-primary mt-1 font-medium">{profile.title || "Beginner Adventurer"}</p>
          <div className="flex gap-2 mt-2">
            {profile.role !== "user" && (
              <Badge variant="outline" className="border-primary/50 text-primary uppercase text-[10px] tracking-widest">{profile.role}</Badge>
            )}
          </div>

          {/* Edit Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Dialog open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 px-6">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Edit Avatar
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Update Avatar URL</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input 
                    value={avatarUrl} 
                    onChange={e => setAvatarUrl(e.target.value)} 
                    placeholder="https://example.com/image.jpg"
                    className="bg-black/20 border-white/10 text-white"
                  />
                  {avatarUrl && (
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border border-white/20">
                      <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <Button onClick={handleUpdateAvatar} className="w-full" disabled={updateProfileMutation.isPending}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isCoverOpen} onOpenChange={setIsCoverOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 px-6">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Edit Cover
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Update Cover URL</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input 
                    value={coverUrl} 
                    onChange={e => setCoverUrl(e.target.value)} 
                    placeholder="https://example.com/cover.jpg"
                    className="bg-black/20 border-white/10 text-white"
                  />
                  {coverUrl && (
                    <div className="w-full h-32 mx-auto rounded-xl overflow-hidden border border-white/20">
                      <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <Button onClick={handleUpdateCover} className="w-full" disabled={updateProfileMutation.isPending}>
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isFrameOpen} onOpenChange={setIsFrameOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 px-6">
                  <Star className="w-4 h-4 mr-2" />
                  Edit Frame
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-white max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Select Frame</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                  <div 
                    className={`cursor-pointer rounded-xl border-2 p-2 aspect-square flex items-center justify-center flex-col gap-2 ${!profile.profile_frame ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/30 bg-black/20'}`}
                    onClick={() => handleSelectFrame(0)}
                  >
                    <div className="w-12 h-12 rounded-full border border-white/20 bg-background/50 flex items-center justify-center text-white/50 text-xs">None</div>
                    <span className="text-xs text-center text-white/80">Remove</span>
                  </div>
                  {frames?.map(frame => (
                    <div 
                      key={frame.id}
                      className={`cursor-pointer rounded-xl border-2 p-2 aspect-square flex flex-col items-center justify-center gap-2 ${profile.profile_frame === frame.id ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/30 bg-black/20'}`}
                      onClick={() => handleSelectFrame(frame.id!)}
                    >
                      <div className="w-12 h-12 relative flex items-center justify-center bg-background/50 rounded-full">
                        {frame.preview && <img src={frame.preview} alt={frame.name} className="absolute inset-0 w-full h-full object-contain scale-[1.3]" />}
                      </div>
                      <span className="text-xs text-center text-white/80 line-clamp-1">{frame.name}</span>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Grid 2x2 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-10">
            <Card className="bg-card/40 backdrop-blur-md border-white/5 overflow-hidden group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-400/10 text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/50">Wallet</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{profile.wallet?.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/40 backdrop-blur-md border-white/5 overflow-hidden group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-400/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/50">Bank</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{profile.bank?.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/40 backdrop-blur-md border-white/5 overflow-hidden group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/50">Level</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{profile.level}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/40 backdrop-blur-md border-white/5 overflow-hidden group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-400/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Medal className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/50">XP</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{profile.xp?.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="mt-10">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full grid grid-cols-4 bg-black/40 border border-white/10 p-1 rounded-xl mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
              <TabsTrigger value="deck" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Deck</TabsTrigger>
              <TabsTrigger value="inventory" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Inventory</TabsTrigger>
              <TabsTrigger value="pokemon" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Pokemon</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/40 backdrop-blur-md border-white/5">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Battle Statistics
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1 text-white/80">
                          <span>Win Rate</span>
                          <span>{profile.battle_wins! + profile.battle_losses! > 0 ? Math.round((profile.battle_wins! / (profile.battle_wins! + profile.battle_losses!)) * 100) : 0}%</span>
                        </div>
                        <Progress value={profile.battle_wins! + profile.battle_losses! > 0 ? (profile.battle_wins! / (profile.battle_wins! + profile.battle_losses!)) * 100 : 0} className="h-2 bg-white/10" indicatorColor="bg-primary" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 rounded-lg p-3 border border-white/5 text-center">
                          <p className="text-xs text-white/50 mb-1">Wins</p>
                          <p className="text-xl font-bold text-emerald-400">{profile.battle_wins}</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3 border border-white/5 text-center">
                          <p className="text-xs text-white/50 mb-1">Losses</p>
                          <p className="text-xl font-bold text-red-400">{profile.battle_losses}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/40 backdrop-blur-md border-white/5">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Swords className="w-5 h-5 text-primary" />
                      Collection Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 rounded-lg p-3 border border-white/5 text-center">
                          <p className="text-xs text-white/50 mb-1">Total Cards</p>
                          <p className="text-xl font-bold text-white">{profile.card_count}</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3 border border-white/5 text-center">
                          <p className="text-xs text-white/50 mb-1">Pokemon Caught</p>
                          <p className="text-xl font-bold text-white">{profile.pokemon_count}</p>
                        </div>
                         <div className="bg-black/20 rounded-lg p-3 border border-white/5 text-center">
                          <p className="text-xs text-white/50 mb-1">Daily Streak</p>
                          <p className="text-xl font-bold text-orange-400">{profile.streak}🔥</p>
                        </div>
                        <div className="bg-black/20 rounded-lg p-3 border border-white/5 text-center">
                          <p className="text-xs text-white/50 mb-1">Gems</p>
                          <p className="text-xl font-bold text-fuchsia-400">{profile.gems}💎</p>
                        </div>
                      </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="deck" className="mt-0">
              {deckLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="w-full aspect-[2.5/3.5] rounded-xl bg-white/5" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {deck?.map((card, i) => (
                     <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      key={card.id || i}
                      className="group relative bg-card rounded-xl overflow-hidden border-2 border-primary/50 flex flex-col"
                    >
                      <div className="aspect-[2.5/3.5] bg-black/40 relative overflow-hidden">
                        {card.image ? (
                          <img 
                            src={card.image} 
                            alt={card.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-black/60 backdrop-blur-md border-white/20 text-white font-bold tracking-wider">
                            {card.tier}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-2 bg-card text-center border-t border-white/10">
                        <h3 className="font-bold text-white text-xs line-clamp-1">{card.name}</h3>
                      </div>
                    </motion.div>
                  ))}
                  {(!deck || deck.length === 0) && (
                    <div className="col-span-full py-12 text-center text-white/50">Your deck is empty.</div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="inventory" className="mt-0">
               {collectionLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="w-full aspect-[2.5/3.5] rounded-xl bg-white/5" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {collection?.filter(c => !c.in_deck).map((card, i) => (
                     <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.02 }}
                      key={card.id || i}
                      className="group relative bg-card rounded-xl overflow-hidden border border-white/10 flex flex-col"
                    >
                      <div className="aspect-[2.5/3.5] bg-black/40 relative overflow-hidden">
                        {card.image ? (
                          <img 
                            src={card.image} 
                            alt={card.name} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
                        )}
                         <div className="absolute top-2 right-2">
                          <Badge className="bg-black/60 backdrop-blur-md border-white/20 text-white font-bold tracking-wider">
                            {card.tier}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-2 bg-card text-center border-t border-white/10">
                         <h3 className="font-semibold text-white text-xs line-clamp-1">{card.name}</h3>
                      </div>
                    </motion.div>
                  ))}
                  {(!collection || collection.filter(c => !c.in_deck).length === 0) && (
                    <div className="col-span-full py-12 text-center text-white/50">You don't have any cards in your inventory.</div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pokemon" className="mt-0">
               {pokemonLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-32 rounded-xl bg-white/5" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {pokemon?.map((poke, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      key={poke.id || i}
                      className={`relative bg-card/40 backdrop-blur-sm rounded-xl p-4 border flex items-center gap-4 ${poke.in_party ? 'border-primary/50 bg-primary/5' : 'border-white/10'}`}
                    >
                      {poke.in_party && (
                        <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground border-none">
                          Party
                        </Badge>
                      )}
                      
                      <div className="w-16 h-16 flex-shrink-0 bg-black/30 rounded-lg flex items-center justify-center overflow-hidden">
                        {poke.sprite ? (
                          <img src={poke.sprite} alt={poke.name} className="w-full h-full object-contain" style={{ imageRendering: 'pixelated' }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-white/30">?</div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-white capitalize truncate">{poke.name}</h3>
                          <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">Lv.{poke.level}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-white/50">
                            <span>HP</span>
                            <span>{poke.hp}/{poke.max_hp}</span>
                          </div>
                          <Progress value={poke.max_hp ? (poke.hp! / poke.max_hp) * 100 : 100} className="h-1.5 bg-white/10" indicatorColor={(poke.max_hp ? (poke.hp! / poke.max_hp) * 100 : 100) > 50 ? "bg-green-500" : "bg-red-500"} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {(!pokemon || pokemon.length === 0) && (
                    <div className="col-span-full py-12 text-center text-white/50">You haven't caught any Pokemon.</div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
