import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/apiService';

// Fetches unified team list and partitions into agents vs non-agents
// Contract
// - Output: { agents, teamMembers, loading, error, refetch }
// - agents: users with isAgent === true OR role === 'agent'
// - teamMembers: everyone else
export function useTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeam = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const resp = await api.get('/auth/teams');
      const users = Array.isArray(resp?.data?.users)
        ? resp.data.users
        : Array.isArray(resp?.data?.data)
          ? resp.data.data
          : Array.isArray(resp?.data)
            ? resp.data
            : [];
      setTeam(users);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTeam(); }, [fetchTeam]);

  const { agents, teamMembers } = useMemo(() => {
    const agents = [];
    const teamMembers = [];
    for (const u of team || []) {
      const isAgent = u?.isAgent === true || (u?.role || '').toLowerCase() === 'agent';
      (isAgent ? agents : teamMembers).push(u);
    }
    return { agents, teamMembers };
  }, [team]);

  return {
    agents,
    teamMembers,
    loading,
    error,
    refetch: fetchTeam,
  };
}

export default useTeam;
