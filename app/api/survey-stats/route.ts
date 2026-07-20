import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SurveyRow = {
  visited_before: boolean;
  desired_programs: string[] | null;
  priority_spaces: string[] | null;
  likely_users: string[] | null;
  best_times: string[] | null;
  city_needs_center: boolean;
};

type OptionCount = { option: string; count: number; percent: number };

function countOptions(rows: SurveyRow[], key: keyof SurveyRow, total: number): OptionCount[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const values = row[key] as string[] | null;
    if (!values) continue;
    for (const value of values) {
      if (value === "Other") continue;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([option, count]) => ({
      option,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function yesNoSplit(rows: SurveyRow[], key: "visited_before" | "city_needs_center", total: number) {
  const yes = rows.filter((r) => r[key] === true).length;
  const no = total - yes;
  return {
    yes,
    no,
    yesPercent: total > 0 ? Math.round((yes / total) * 100) : 0,
    noPercent: total > 0 ? Math.round((no / total) * 100) : 0,
  };
}

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("survey_responses")
    .select("visited_before, desired_programs, priority_spaces, likely_users, best_times, city_needs_center");

  if (error || !data) {
    return Response.json(
      { totalResponses: 0, visitedBefore: null, cityNeedsCenter: null, desiredPrograms: [], prioritySpaces: [], likelyUsers: [], bestTimes: [] },
      { status: error ? 500 : 200 }
    );
  }

  const rows = data as SurveyRow[];
  const total = rows.length;

  return Response.json({
    totalResponses: total,
    visitedBefore: yesNoSplit(rows, "visited_before", total),
    cityNeedsCenter: yesNoSplit(rows, "city_needs_center", total),
    desiredPrograms: countOptions(rows, "desired_programs", total),
    prioritySpaces: countOptions(rows, "priority_spaces", total),
    likelyUsers: countOptions(rows, "likely_users", total),
    bestTimes: countOptions(rows, "best_times", total),
  });
}
