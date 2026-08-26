import { useQuery } from '@tanstack/react-query';
import { simulations, type Simulation } from '../mocks/simulations';

export const simulationKeys = {
  all: ['simulations'] as const,
  detail: (id: number) => [...simulationKeys.all, id] as const,
};

// 목 데이터를 비동기로 내려주는 가짜 API 함수
// 실제 백엔드 연동 시 이 함수만 실제 서버 호출로 바꾸면 됨
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchSimulations(): Promise<Simulation[]> {
  await wait(300);
  return simulations;
}

async function fetchSimulation(id: number): Promise<Simulation | null> {
  await wait(200);
  return simulations.find((s) => s.id === id) ?? null;
}

export function useSimulations() {
  return useQuery({
    queryKey: simulationKeys.all,
    queryFn: fetchSimulations,
  });
}

export function useSimulation(id: number) {
  return useQuery({
    queryKey: simulationKeys.detail(id),
    queryFn: () => fetchSimulation(id),
  });
}