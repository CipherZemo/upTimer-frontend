import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checksAPI } from "@/api/checks";
import { toast } from "sonner";

// Get all checks
export function useChecks(params = {}) {
  return useQuery({
    queryKey: ["checks", params],
    queryFn: () => checksAPI.getChecks(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Get single check
export function useCheck(id) {
  return useQuery({
    queryKey: ["checks", id],
    queryFn: () => checksAPI.getCheck(id),
    enabled: !!id,
  });
}

// Get check stats
export function useCheckStats() {
  return useQuery({
    queryKey: ["check-stats"],
    queryFn: () => checksAPI.getCheckStats(),
    staleTime: 30 * 1000,
  });
}

// Create check mutation
export function useCreateCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (checkData) => checksAPI.createCheck(checkData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checks"] });
      queryClient.invalidateQueries({ queryKey: ["check-stats"] });
      toast.success("Check created successfully!");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to create check";
      toast.error(message);
    },
  });
}

// Update check mutation
export function useUpdateCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => checksAPI.updateCheck(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checks"] });
      toast.success("Check updated successfully!");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to update check";
      toast.error(message);
    },
  });
}

// Delete check mutation
export function useDeleteCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => checksAPI.deleteCheck(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checks"] });
      queryClient.invalidateQueries({ queryKey: ["check-stats"] });
      toast.success("Check deleted successfully!");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to delete check";
      toast.error(message);
    },
  });
}

// Get check results (history)
export function useCheckResults(checkId, params = {}) {
  return useQuery({
    queryKey: ['check-results', checkId, params],
    queryFn: () => checksAPI.getCheckResults(checkId, params),
    enabled: !!checkId,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Get check incidents
export function useCheckIncidents(checkId, params = {}) {
  return useQuery({
    queryKey: ['check-incidents', checkId, params],
    queryFn: () => checksAPI.getCheckIncidents(checkId, params),
    enabled: !!checkId,
    staleTime: 60 * 1000,
  });
}
