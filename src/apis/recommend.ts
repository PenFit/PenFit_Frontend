import apiClient from "./client";

export interface RecommendCodeDisplay {
  code: string;
  displayName: string;
}

export interface ProductRecommendation {
  rank: number;
  productId: number;
  accountType: RecommendCodeDisplay;
  providerName: string;
  productName: string;
  summary: string;
  fitLevel: RecommendCodeDisplay;
  recommendationReason: string;
}

interface ProductRecommendationsResponse {
  code: string;
  message: string;
  data: ProductRecommendation[];
}

export interface ProductRecommendationComparisonItem {
  rank: number;
  productId: number;
  providerName: string;
  productName: string;
  feeMinRate: number;
  feeMaxRate: number;
  investmentScope: string;
  fitLevel: RecommendCodeDisplay;
}

export interface ProductRecommendationComparison {
  products: ProductRecommendationComparisonItem[];
}

interface ProductRecommendationComparisonResponse {
  code: string;
  message: string;
  data: ProductRecommendationComparison;
}

export interface PensionProductDetail {
  productId: number;
  providerType: RecommendCodeDisplay;
  providerName: string;
  productName: string;
  accountType: RecommendCodeDisplay;
  productType: RecommendCodeDisplay;
  summary: string;
  recommendationReason: string | null;
  feeMinRate: number;
  feeMaxRate: number;
  investmentScope: string;
  officialUrl: string;
  features: string[];
  cautions: string[];
  saved: boolean;
}

interface PensionProductDetailResponse {
  code: string;
  message: string;
  data: PensionProductDetail;
}

interface SaveProductResponse {
  code: string;
  message: string;
  data: string;
}

export interface SavedProduct {
  productId: number;
  accountType: RecommendCodeDisplay;
  providerName: string;
  productName: string;
  summary: string;
  feeMinRate: number;
  feeMaxRate: number;
  investmentScope: string;
  savedAt: string;
}

interface SavedProductsResponse {
  code: string;
  message: string;
  data: SavedProduct[];
}

// 현재 로그인한 사용자에게 맞는 연금 상품 추천 3개를 생성
export async function createProductRecommendations() {
  const response = await apiClient.post<ProductRecommendationsResponse>(
    "/api/v1/users/me/product-recommendations",
  );

  return response.data.data;
}

// 현재 로그인한 사용자의 추천 상품 목록을 순위 순서로 조회
export async function getMyProductRecommendations() {
  const response = await apiClient.get<ProductRecommendationsResponse>(
    "/api/v1/users/me/product-recommendations",
  );

  return response.data.data;
}

// 현재 로그인한 사용자의 추천 상품 비교 정보를 조회
export async function getProductRecommendationComparison() {
  const response = await apiClient.get<ProductRecommendationComparisonResponse>(
    "/api/v1/users/me/product-recommendations/comparison",
  );

  return response.data.data;
}

// 연금 상품의 상세 정보와 현재 사용자의 담기 여부를 조회
export async function getPensionProductDetail(productId: number) {
  const response = await apiClient.get<PensionProductDetailResponse>(
    `/api/v1/pension-products/${productId}`,
  );

  return response.data.data;
}

// 현재 로그인한 사용자의 관심 상품 목록에 상품을 담음
export async function saveProduct(productId: number) {
  const response = await apiClient.post<SaveProductResponse>(
    `/api/v1/users/me/saved-products/${productId}`,
  );

  return response.data.data;
}

// 현재 로그인한 사용자의 관심 상품 목록에서 상품을 제거
export async function deleteSavedProduct(productId: number) {
  const response = await apiClient.delete<SaveProductResponse>(
    `/api/v1/users/me/saved-products/${productId}`,
  );

  return response.data.data;
}

// 현재 로그인한 사용자가 담아둔 상품 목록을 최근 순서로 조회
export async function getMySavedProducts() {
  const response = await apiClient.get<SavedProductsResponse>(
    "/api/v1/users/me/saved-products",
  );

  return response.data.data;
}
