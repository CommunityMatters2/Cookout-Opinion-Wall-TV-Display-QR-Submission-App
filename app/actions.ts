"use server";

import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { submitMessage as submitMessageCore } from "@/lib/submitMessage";
import { DEVICE_ID_COOKIE } from "@/lib/deviceId";
import { surveyQuestions, isQuestionAnswered } from "@/lib/surveyQuestions";
import type { SurveyAnswers } from "@/types/survey";
import type { MessageStatus } from "@/types/message";

export type SubmitResult = {
  ok: boolean;
  error?: string;
  id?: string;
  status?: MessageStatus;
};

export type SurveyResult = {
  ok: boolean;
  error?: string;
};

export async function submitSurvey(answers: SurveyAnswers): Promise<SurveyResult> {
  for (const q of surveyQuestions) {
    if (!isQuestionAnswered(q, answers)) {
      return { ok: false, error: "Please answer every question before finishing." };
    }
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("survey_responses").insert({
    visited_before: answers.visitedBefore === "yes",
    desired_programs: answers.desiredPrograms,
    desired_programs_other: answers.desiredProgramsOther.trim() || null,
    priority_spaces: answers.prioritySpaces,
    priority_spaces_other: answers.prioritySpacesOther.trim() || null,
    likely_users: answers.likelyUsers,
    best_times: answers.bestTimes,
    trust_answer: answers.trustAnswer.trim(),
    city_needs_center: answers.cityNeedsCenter === "yes",
  });

  if (error) {
    return { ok: false, error: "Something went wrong, please try again." };
  }

  return { ok: true };
}

export async function submitMessage(_prevState: SubmitResult, formData: FormData): Promise<SubmitResult> {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const cookieStore = await cookies();
  const deviceId = cookieStore.get(DEVICE_ID_COOKIE)?.value;

  return submitMessageCore(name, message, deviceId);
}
