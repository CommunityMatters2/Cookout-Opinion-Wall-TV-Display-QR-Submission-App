"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { containsBlockedWord } from "@/lib/wordFilter";
import { siteConfig } from "@/config/site";
import { surveyQuestions, isQuestionAnswered } from "@/lib/surveyQuestions";
import type { SurveyAnswers } from "@/types/survey";

export type SubmitResult = {
  ok: boolean;
  error?: string;
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

export async function submitMessage(
  _prevState: SubmitResult,
  formData: FormData
): Promise<SubmitResult> {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!message) {
    return { ok: false, error: "Please enter a message." };
  }
  if (name.length > siteConfig.maxNameLength) {
    return { ok: false, error: `Name must be ${siteConfig.maxNameLength} characters or less.` };
  }
  if (message.length > siteConfig.maxMessageLength) {
    return { ok: false, error: `Message must be ${siteConfig.maxMessageLength} characters or less.` };
  }
  if (containsBlockedWord(name) || containsBlockedWord(message)) {
    return { ok: false, error: "Please keep it cookout-friendly! 🌭" };
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("messages").insert({ name, message });

  if (error) {
    return { ok: false, error: "Something went wrong, please try again." };
  }

  return { ok: true };
}
