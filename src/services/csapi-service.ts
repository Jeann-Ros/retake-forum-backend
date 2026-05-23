const CSAPI_BASE_URL = "https://api.csapi.de";

type CsApiParams = Record<string, string | number>;

async function requestCsApi<T>(path: string, params: CsApiParams = {}) {
  const url = new URL(path, CSAPI_BASE_URL);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`CSAPI respondeu ${response.status}: ${body}`);
  }

  return (await response.json()) as T;
}

export type CsApiPlayerStats = {
  id: number;
  name: string;
  rank: number;
  rating: number;
};

export type CsApiTeamRank = {
  id: number;
  name: string;
  rank: number;
  rank_diff: number;
  points: number;
  points_diff: number;
};

type CsApiRankingResponse = {
  rankings: CsApiTeamRank[];
};

export const CsApiService = {
  getTopPlayers(limit: number) {
    return requestCsApi<CsApiPlayerStats[]>("/players/stats", {
      limit,
    });
  },

  async getWorldRankings(limit: number) {
    const response = await requestCsApi<CsApiRankingResponse>("/rankings/");
    return response.rankings.slice(0, limit);
  },
};
