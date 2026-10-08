export const calculateProgress = (milestones) => {
  if (milestones.length === 0) return 0;

  const completedWeight = milestones
    .filter((m) => m.status === "completed")
    .reduce((sum, m) => sum + m.weight, 0);

  return Math.round(completedWeight);
};

export const calculateRiskLevel = (milestones, deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const progress = calculateProgress(milestones);

  const totalDuration = deadlineDate - now;
  const daysRemaining = Math.ceil(totalDuration / (1000 * 60 * 60 * 24));

  const hasOverdueMilestone = milestones.some(
    (m) => m.status !== "completed" && new Date(m.dueDate) < now
  );

  if (daysRemaining < 0) return "critical";
  if (hasOverdueMilestone) return "critical";
  if (daysRemaining <= 3 && progress < 80) return "critical";
  if (daysRemaining <= 7 && progress < 50) return "attention";
  if (progress < 30 && daysRemaining <= 14) return "attention";

  return "healthy";
};

export const estimateCompletionDate = (milestones) => {
  const completed = milestones
    .filter((m) => m.status === "completed" && m.completedAt)
    .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

  if (completed.length < 2) return null;

  const first = new Date(completed[0].completedAt);
  const last = new Date(completed[completed.length - 1].completedAt);
  const elapsedDays = (last - first) / (1000 * 60 * 60 * 24);

  const completedWeight = completed.reduce((sum, m) => sum + m.weight, 0);
  const remainingWeight = 100 - completedWeight;

  if (completedWeight === 0 || elapsedDays === 0) return null;

  const weightPerDay = completedWeight / elapsedDays;
  const daysRemaining = Math.ceil(remainingWeight / weightPerDay);

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + daysRemaining);

  return estimatedDate;
};

export const getProjectHealth = (milestones, deadline) => {
  const progress = calculateProgress(milestones);
  const riskLevel = calculateRiskLevel(milestones, deadline);
  const estimatedCompletion = estimateCompletionDate(milestones);

  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const pendingCount = milestones.filter((m) => m.status !== "completed").length;

  return {
    progress,
    riskLevel,
    estimatedCompletion,
    completedCount,
    pendingCount,
    totalMilestones: milestones.length,
  };
};