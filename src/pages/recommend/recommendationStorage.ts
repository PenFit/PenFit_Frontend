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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCodeDisplay(value: unknown) {
  return (
    isRecord(value) &&
    typeof value.code === 'string' &&
    typeof value.displayName === 'string'
  );
}

function isValidProductId(productId: unknown) {
  return typeof productId === 'number' && Number.isSafeInteger(productId) && productId > 0;
}

function isProductRecommendation(value: unknown): value is ProductRecommendation {
  return (
    isRecord(value) &&
    typeof value.rank === 'number' &&
    isValidProductId(value.productId) &&
    isCodeDisplay(value.accountType) &&
    typeof value.providerName === 'string' &&
    typeof value.productName === 'string' &&
    typeof value.summary === 'string' &&
    isCodeDisplay(value.fitLevel) &&
    typeof value.recommendationReason === 'string'
  );
}

export function saveProductRecommendations(recommendations: ProductRecommendation[]) {
  sessionStorage.setItem(PRODUCT_RECOMMENDATIONS_KEY, JSON.stringify(recommendations));
}

export function getStoredProductRecommendations() {
  const storedRecommendations = sessionStorage.getItem(PRODUCT_RECOMMENDATIONS_KEY);

  if (!storedRecommendations) {
    return [];
  }

  try {
    const parsedRecommendations = JSON.parse(storedRecommendations);

    return Array.isArray(parsedRecommendations)
      ? parsedRecommendations.filter(isProductRecommendation)
      : [];
  } catch {
    return [];
  }
}

export function saveSelectedProductRecommendation(productId: string | number) {
  const normalizedProductId = Number(productId);

  if (!isValidProductId(normalizedProductId)) {
    sessionStorage.removeItem(SELECTED_RECOMMENDATION_KEY);
    return;
  }

  sessionStorage.setItem(SELECTED_RECOMMENDATION_KEY, String(normalizedProductId));
}

export function getSelectedProductRecommendationId() {
  const selectedProductId = sessionStorage.getItem(SELECTED_RECOMMENDATION_KEY);
  const normalizedProductId = Number(selectedProductId);

  return isValidProductId(normalizedProductId) ? normalizedProductId : null;
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
