"use client";

import type { SurveyQuestion } from "@/lib/surveyQuestions";
import type { SurveyAnswers } from "@/types/survey";
import styles from "./SurveyFlow.module.css";

export default function QuestionStep({
  question,
  answers,
  onSetYesNo,
  onToggleMulti,
  onSetOtherText,
  onSetText,
}: {
  question: SurveyQuestion;
  answers: SurveyAnswers;
  onSetYesNo: (key: "visitedBefore" | "cityNeedsCenter", value: "yes" | "no") => void;
  onToggleMulti: (
    key: "desiredPrograms" | "prioritySpaces" | "likelyUsers" | "bestTimes",
    option: string
  ) => void;
  onSetOtherText: (
    key: "desiredProgramsOther" | "prioritySpacesOther",
    value: string
  ) => void;
  onSetText: (key: "trustAnswer", value: string) => void;
}) {
  if (question.type === "yesno") {
    const value = answers[question.key];
    return (
      <div className={styles.yesNoRow}>
        {(["yes", "no"] as const).map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.yesNoButton} ${value === option ? styles.yesNoButtonSelected : ""}`}
            onClick={() => onSetYesNo(question.key, option)}
          >
            {option === "yes" ? "Yes" : "No"}
          </button>
        ))}
      </div>
    );
  }

  if (question.type === "text") {
    return (
      <textarea
        className={styles.textarea}
        placeholder={question.placeholder}
        maxLength={400}
        value={answers[question.key]}
        onChange={(e) => onSetText(question.key, e.target.value)}
        autoFocus
      />
    );
  }

  const selected = answers[question.key];
  const showOther = question.otherKey && selected.includes("Other");
  const atMax = Boolean(question.maxChoices) && selected.length >= (question.maxChoices ?? Infinity);

  return (
    <div>
      <div className={styles.chipGrid}>
        {question.options.map((option) => {
          const isSelected = selected.includes(option);
          const disabled = atMax && !isSelected;
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              className={`${styles.chip} ${isSelected ? styles.chipSelected : ""}`}
              onClick={() => onToggleMulti(question.key, option)}
            >
              {option}
            </button>
          );
        })}
      </div>
      {showOther && question.otherKey && (
        <input
          type="text"
          className={styles.input}
          style={{ marginTop: 14 }}
          placeholder="Tell us more…"
          maxLength={80}
          value={answers[question.otherKey]}
          onChange={(e) => onSetOtherText(question.otherKey!, e.target.value)}
          autoFocus
        />
      )}
      {question.maxChoices && (
        <p className={styles.chipCounter}>
          {selected.length}/{question.maxChoices} selected
        </p>
      )}
    </div>
  );
}
