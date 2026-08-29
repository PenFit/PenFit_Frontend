import { useQuery } from '@tanstack/react-query';
import {
  getRehearsalProgress,
  getRehearsalScenarios,
  type RehearsalScenario,
} from '../apis/simulation';
import type { Simulation } from '../mocks/simulations';

export const simulationKeys = {
  all: ['simulations'] as const,
  list: (rehearsalId: number | null) => [...simulationKeys.all, rehearsalId] as const,
  detail: (rehearsalId: number | null, id: number) => [...simulationKeys.list(rehearsalId), id] as const,
  progress: (rehearsalId: number | null) => [...simulationKeys.all, rehearsalId, 'progress'] as const,
};

function getStoredRehearsalId() {
  const storedRehearsal = sessionStorage.getItem('rehearsalStart');

  if (!storedRehearsal) {
    return null;
  }

  try {
    const rehearsal = JSON.parse(storedRehearsal) as { rehearsalId?: number };

    return rehearsal.rehearsalId ?? null;
  } catch {
    return null;
  }
}

function mapScenarioToSimulation(scenario: RehearsalScenario): Simulation {
  return {
    id: scenario.displayOrder,
    scenarioCode: scenario.scenarioCode,
    badge: scenario.badge,
    title: scenario.title,
    description: scenario.situation,
    stats: scenario.contextCards,
    question: scenario.question,
    options: scenario.options.map((option) => ({
      value: option.optionCode,
      letter: option.label,
      label: option.title,
      subtitle: option.description,
    })),
  };
}

async function fetchSimulations(rehearsalId: number): Promise<Simulation[]> {
  const scenarios = await getRehearsalScenarios(rehearsalId);

  return scenarios
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(mapScenarioToSimulation);
}

export function useSimulations() {
  const rehearsalId = getStoredRehearsalId();

  return useQuery({
    queryKey: simulationKeys.list(rehearsalId),
    queryFn: () => fetchSimulations(rehearsalId as number),
    enabled: rehearsalId !== null,
  });
}

export function useSimulation(id: number) {
  const rehearsalId = getStoredRehearsalId();

  return useQuery({
    queryKey: simulationKeys.detail(rehearsalId, id),
    queryFn: async () => {
      const simulationList = await fetchSimulations(rehearsalId as number);

      return simulationList.find((simulation) => simulation.id === id) ?? null;
    },
    enabled: rehearsalId !== null,
  });
}

export function useStoredRehearsalId() {
  return getStoredRehearsalId();
}

export function useRehearsalProgress() {
  const rehearsalId = getStoredRehearsalId();

  return useQuery({
    queryKey: simulationKeys.progress(rehearsalId),
    queryFn: () => getRehearsalProgress(rehearsalId as number),
    enabled: rehearsalId !== null,
  });
}
