import type { SurveyAnswers } from "@/types/survey";

type YesNoQuestion = {
  type: "yesno";
  key: "visitedBefore" | "cityNeedsCenter";
  question: string;
};

type MultiQuestion = {
  type: "multi";
  key: "desiredPrograms" | "prioritySpaces" | "likelyUsers" | "bestTimes";
  question: string;
  helper?: string;
  options: string[];
  maxChoices?: number;
  otherKey?: "desiredProgramsOther" | "prioritySpacesOther";
};

type TextQuestion = {
  type: "text";
  key: "trustAnswer";
  question: string;
  placeholder: string;
};

export type SurveyQuestion = YesNoQuestion | MultiQuestion | TextQuestion;

export const surveyQuestions: SurveyQuestion[] = [
  {
    type: "yesno",
    key: "visitedBefore",
    question: "Have you ever been to a Community Center?",
  },
  {
    type: "multi",
    key: "desiredPrograms",
    question:
      "What programs or services would you most like to see offered at the new community center?",
    helper: "Pick up to 3",
    maxChoices: 3,
    otherKey: "desiredProgramsOther",
    options: [
      "Youth programs",
      "Senior programs",
      "Workforce development",
      "Technology/STEM",
      "Sports & fitness",
      "Arts & culture",
      "Mental health services",
      "Family support",
      "Culinary programs",
      "Community events",
      "Other",
    ],
  },
  {
    type: "multi",
    key: "prioritySpaces",
    question: "What spaces or features should be prioritized in the community center?",
    helper: "Pick as many as you like",
    otherKey: "prioritySpacesOther",
    options: [
      "Gymnasium",
      "Multipurpose event space",
      "Computer lab",
      "Classrooms",
      "Commercial kitchen",
      "Youth lounge",
      "Senior space",
      "Podcast/media studio",
      "Outdoor recreation",
      "Meeting rooms",
      "Other",
    ],
  },
  {
    type: "multi",
    key: "likelyUsers",
    question: "Who in your household or community would most likely use the center?",
    helper: "Pick as many as you like",
    options: [
      "Children",
      "Teenagers",
      "Young adults",
      "Parents & families",
      "Adults",
      "Seniors",
      "Everyone",
    ],
  },
  {
    type: "multi",
    key: "bestTimes",
    question: "What days and times would make it easiest for you or your family to participate?",
    helper: "Pick as many as you like",
    options: [
      "Weekday mornings",
      "Weekday afternoons",
      "Weekday evenings",
      "Saturdays",
      "Sundays",
      "School breaks",
    ],
  },
  {
    type: "text",
    key: "trustAnswer",
    question:
      "What would make this community center a place you would regularly visit, trust, and feel connected to?",
    placeholder: "Tell us what matters to you…",
  },
  {
    type: "yesno",
    key: "cityNeedsCenter",
    question: "Does the City of Poughkeepsie need a Community Center?",
  },
];

export function isQuestionAnswered(q: SurveyQuestion, answers: SurveyAnswers): boolean {
  if (q.type === "yesno") return answers[q.key] !== "";
  if (q.type === "text") return answers[q.key].trim().length > 0;
  const selected = answers[q.key];
  if (selected.length === 0) return false;
  if (selected.includes("Other") && q.otherKey) {
    return answers[q.otherKey].trim().length > 0;
  }
  return true;
}
