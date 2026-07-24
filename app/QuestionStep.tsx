"use client";

import { motion } from "framer-motion";
import type { SurveyQuestion } from "@/lib/surveyQuestions";
import type { SurveyAnswers } from "@/types/survey";
import styles from "./SurveyFlow.module.css";

export default function QuestionStep({
  question,
  answers,
  onSetYesNo,
  onSelectOption,
  onSetOtherText,
  onSetText,
  onAdvance,
}: {
  question: SurveyQuestion;
  answers: SurveyAnswers;
  onSetYesNo: (key: "visitedBefore" | "cityNeedsCenter", value: "yes" | "no") => void;
  onSelectOption: (
    key: "desiredPrograms" | "prioritySpaces" | "likelyUsers" | "bestTimes",
    option: string
  ) => void;
  onSetOtherText: (
    key: "desiredProgramsOther" | "prioritySpacesOther",
    value: string
  ) => void;
  onSetText: (key: "trustAnswer", value: string) => void;
  onAdvance: () => void;
}) {
  if (question.type === "yesno") {
    const value = answers[question.key];
    return (
      <div className={styles.yesNoRow}>
        {(["yes", "no"] as const).map((option) => (
          <motion.button
            key={option}
            type="button"
            className={`${styles.yesNoButton} ${value === option ? styles.yesNoButtonSelected : ""}`}
            onClick={() => {
              onSetYesNo(question.key, option);
              onAdvance();
            }}
            whileTap={{ scale: 0.95 }}
          >
            {option === "yes" ? "Yes" : "No"}
          </motion.button>
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
  const otherKey = question.otherKey;
  const showOther = otherKey && selected.includes("Other");

  function handleOtherKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (otherKey && answers[otherKey].trim().length > 0) {
      onAdvance();
    }
  }

  return (
    <div>
      <div className={styles.chipGrid}>
        {question.options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <motion.button
              key={option}
              type="button"
              className={`${styles.chip} ${isSelected ? styles.chipSelected : ""}`}
              onClick={() => {
                onSelectOption(question.key, option);
                if (option !== "Other") onAdvance();
              }}
              whileTap={{ scale: 0.94 }}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
      {showOther && question.otherKey && (
        <div className={styles.otherRow}>
          <input
            type="text"
            className={styles.input}
            placeholder="Tell us more…"
            maxLength={80}
            value={answers[question.otherKey]}
            onChange={(e) => onSetOtherText(question.otherKey!, e.target.value)}
            onKeyDown={handleOtherKeyDown}
            autoFocus
          />
          <motion.button
            type="button"
            className={styles.otherContinueButton}
            onClick={() => onAdvance()}
            disabled={!answers[question.otherKey].trim()}
            whileTap={{ scale: 0.96 }}
          >
            Continue
          </motion.button>
        </div>
      )}
    </div>
  );
}
