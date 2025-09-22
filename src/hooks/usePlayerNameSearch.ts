import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/types/player";

interface PlayerNewRecord {
  id: number;
  name: string;
  currentteam: string | null;
  parentteam: string | null;
  age: number | null;
  birthdate: string | null;
  firstposition: string | null;
  secondposition: string | null;
  firstnationality: string | null;
  contractexpiration: string | null;
  imageurl: string | null;
  xtv: number | null;
  rating: number | null;
  potential: number | null;
}

export const usePlayerNameSearch = (query: string, limit = 50) => {
  return useQuery({
    queryKey: ["player-name-search", query, limit],
    enabled: query.trim().length >= 2,
    queryFn: async (): Promise<Player[]> => {
      const search = query.trim();
      const { data, error } = await supabase
        .from("players_new")
        .select(
          "id,name,currentteam,parentteam,age,birthdate,firstposition,secondposition,firstnationality,contractexpiration,imageurl,xtv,rating,potential"
        )
        .ilike("name", `%${search}%`)
        .limit(limit);

      if (error) {
        console.error("usePlayerNameSearch - Error:", error);
        throw error;
      }

      return (data as PlayerNewRecord[]).map((p) => ({
        id: p.id.toString(),
        name: p.name,
        club: p.currentteam || p.parentteam || "Unknown",
        age: p.age || 0,
        dateOfBirth: p.birthdate || "",
        positions: [p.firstposition, p.secondposition].filter(Boolean) as string[],
        dominantFoot: "Right",
        nationality: p.firstnationality || "Unknown",
        contractStatus: "Under Contract",
        contractExpiry: p.contractexpiration || undefined,
        region: "Europe",
        image: p.imageurl || undefined,
        xtvScore: p.xtv || undefined,
        transferroomRating: p.rating || undefined,
        futureRating: p.potential || undefined,
        euGbeStatus: "Pass",
        recentForm: undefined,
      }));
    },
  });
};
