export type SurveyAnswers = {
  visitedBefore: "yes" | "no" | "";
  desiredPrograms: string[];
  desiredProgramsOther: string;
  prioritySpaces: string[];
  prioritySpacesOther: string;
  likelyUsers: string[];
  bestTimes: string[];
  trustAnswer: string;
  cityNeedsCenter: "yes" | "no" | "";
};

export const emptySurveyAnswers: SurveyAnswers = {
  visitedBefore: "",
  desiredPrograms: [],
  desiredProgramsOther: "",
  prioritySpaces: [],
  prioritySpacesOther: "",
  likelyUsers: [],
  bestTimes: [],
  trustAnswer: "",
  cityNeedsCenter: "",
};
