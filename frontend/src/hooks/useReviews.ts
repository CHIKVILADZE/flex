import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../api/reviews.api';

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data } = await reviewsApi.getHostawayReviews();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, 
  });
};

export const useReviewStats = () => {
  return useQuery({
    queryKey: ['reviewStats'],
    queryFn: async () => {
      const { data } = await reviewsApi.getReviewStats();
      return data.data;
    },
  });
};

export const useToggleApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, isApproved }: { reviewId: string; isApproved: boolean }) =>
      reviewsApi.toggleApproval(reviewId, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};