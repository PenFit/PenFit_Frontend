import type { ProductRecommendation } from '../../apis/recommend';

export const PRODUCT_RECOMMENDATIONS_KEY = 'productRecommendations';
export const SELECTED_RECOMMENDATION_KEY = 'selectedProductRecommendationId';

export type RecommendationCardProduct = {
  id: string;
  name: string;
  summary: string;
  highlight: string;
  shortName: string;
  productType: string;
  fitLevel: string;
  reason: string;
};

export function saveProductRecommendations(recommendations: ProductRecommendation[]) {
  sessionStorage.setItem(PRODUCT_RECOMMENDATIONS_KEY, JSON.stringify(recommendations));
}

export function getStoredProductRecommendations() {
  const storedRecommendations = sessionStorage.getItem(PRODUCT_RECOMMENDATIONS_KEY);

  if (!storedRecommendations) {
    return [];
  }

  try {
    return JSON.parse(storedRecommendations) as ProductRecommendation[];
  } catch {
    return [];
  }
}

export function saveSelectedProductRecommendation(productId: string) {
  sessionStorage.setItem(SELECTED_RECOMMENDATION_KEY, productId);
}

export function getSelectedProductRecommendationId() {
  const selectedProductId = sessionStorage.getItem(SELECTED_RECOMMENDATION_KEY);

  return selectedProductId ? Number(selectedProductId) : null;
}

export function getSelectedProductRecommendation() {
  const recommendations = getStoredProductRecommendations();
  const selectedProductId = sessionStorage.getItem(SELECTED_RECOMMENDATION_KEY);

  return (
    recommendations.find((product) => String(product.productId) === selectedProductId) ??
    recommendations[0] ??
    null
  );
}

export function mapRecommendationToCardProduct(
  recommendation: ProductRecommendation,
): RecommendationCardProduct {
  return {
    id: String(recommendation.productId),
    name: `${recommendation.providerName} ${recommendation.productName}`,
    summary: recommendation.summary,
    highlight: recommendation.recommendationReason,
    shortName: recommendation.providerName,
    productType: recommendation.accountType.displayName,
    fitLevel: recommendation.fitLevel.displayName,
    reason: recommendation.recommendationReason,
  };
}
