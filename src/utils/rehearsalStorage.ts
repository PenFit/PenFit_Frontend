export const REHEARSAL_START_STORAGE_KEY = 'rehearsalStart';
export const REHEARSAL_ANSWER_STATUS_STORAGE_KEY = 'rehearsalAnswerStatus';

export function getStoredRehearsalId() {
  const storedRehearsal = sessionStorage.getItem(REHEARSAL_START_STORAGE_KEY);

  if (!storedRehearsal) {
    return null;
  }

  try {
    const rehearsal = JSON.parse(storedRehearsal) as { rehearsalId?: unknown };
    const rehearsalId = rehearsal.rehearsalId;

    return Number.isSafeInteger(rehearsalId) && Number(rehearsalId) > 0
      ? Number(rehearsalId)
      : null;
  } catch {
    return null;
  }
}
