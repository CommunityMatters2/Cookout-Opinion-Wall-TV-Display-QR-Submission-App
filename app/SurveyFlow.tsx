"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { submitSurvey } from "@/app/actions";
import { useSubmitWithRetry } from "@/lib/hooks/useSubmitWithRetry";
import { siteConfig } from "@/config/site";
import { surveyQuestions, isQuestionAnswered } from "@/lib/surveyQuestions";
import { emptySurveyAnswers, type SurveyAnswers } from "@/types/survey";
import QuestionStep from "@/app/QuestionStep";
import styles from "./SurveyFlow.module.css";

type Stage = "intro" | "question" | "done" | "pending-review";

// One extra step beyond the survey questions: name + opinion is asked as the
// final "question" in the same flow rather than a separate screen, so the
// whole thing reads as one continuous, fast sequence.
const TOTAL_STEPS = surveyQuestions.length + 1;

const DRAFT_KEY = "cm2_message_draft";

// Brief pause after a tap so the selected state is visible before the next
// question slides in — auto-advance shouldn't feel like the screen jumped.
const AUTO_ADVANCE_DELAY_MS = 300;

const fadeSlide = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35 },
};

export default function SurveyFlow() {
  const { cm2 } = siteConfig;
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>(emptySurveyAnswers);
  const [surveyError, setSurveyError] = useState<string | undefined>();
  const [isSubmittingSurvey, startSurveyTransition] = useTransition();

  const [messageName, setMessageName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messageError, setMessageError] = useState<string | undefined>();
  const [postedMessageId, setPostedMessageId] = useState<string | undefined>();
  const { submitWithRetry, pending: isMessagePending } = useSubmitWithRetry();

  const formRef = useRef<HTMLFormElement>(null);

  // Restore an unsent draft (e.g. the tab was closed mid-submit) so a guest
  // never has to retype their opinion.
  useEffect(() => {
    function restoreDraft() {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      try {
        const draft = JSON.parse(raw) as { name: string; message: string };
        setMessageName(draft.name);
        setMessageText(draft.message);
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    }
    restoreDraft();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!messageName && !messageText) {
      localStorage.removeItem(DRAFT_KEY);
      return;
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ name: messageName, message: messageText }));
  }, [messageName, messageText]);

  async function handleMessageSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessageError(undefined);
    const result = await submitWithRetry(messageName, messageText);

    if (!result.ok) {
      setMessageError(result.error);
      return;
    }

    localStorage.removeItem(DRAFT_KEY);
    formRef.current?.reset();
    setPostedMessageId(result.id);

    if (result.status === "pending") {
      // Flagged content is invisible on the public feed until a moderator
      // approves it, so it can't honestly get the "you're live!" treatment.
      setStage("pending-review");
      return;
    }

    if (result.id && typeof window !== "undefined") {
      sessionStorage.setItem(
        "cm2_optimistic_message",
        JSON.stringify({
          id: result.id,
          name: messageName.trim(),
          message: messageText.trim(),
          status: "approved",
          created_at: new Date().toISOString(),
        })
      );
    }
    setStage("done");
  }

  // Automatic "you're on the wall" redirect — no extra tap. A brief flash of
  // the confirmation heading plays first, then we hand off to /wall, which
  // picks up the optimistic draft above and shows the confetti welcome.
  useEffect(() => {
    if (stage !== "done") return;
    const id = setTimeout(() => {
      router.push(postedMessageId ? `/wall?highlight=${postedMessageId}` : "/wall");
    }, 650);
    return () => clearTimeout(id);
  }, [stage, postedMessageId, router]);

  const isContactStep = questionIndex === surveyQuestions.length;
  const currentQuestion = isContactStep ? undefined : surveyQuestions[questionIndex];
  const currentAnswered = currentQuestion ? isQuestionAnswered(currentQuestion, answers) : false;
  const progressPercent = Math.round(((questionIndex + 1) / TOTAL_STEPS) * 100);

  // Auto-advance schedules goNext() a beat after the tap so the selected
  // state is visible first. That delay means the component re-renders
  // before it fires, so goNext() can't rely on the `answers` closure below
  // (it would still hold the pre-tap value) — the freshly computed answers
  // are passed through explicitly instead.
  function setYesNo(key: "visitedBefore" | "cityNeedsCenter", value: "yes" | "no") {
    setAnswers((prev) => {
      const next = { ...prev, [key]: value };
      setTimeout(() => goNext(next), AUTO_ADVANCE_DELAY_MS);
      return next;
    });
  }

  function selectOption(
    key: "desiredPrograms" | "prioritySpaces" | "likelyUsers" | "bestTimes",
    option: string
  ) {
    setAnswers((prev) => {
      const current = prev[key];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [key]: next };
    });
  }

  function setOtherText(key: "desiredProgramsOther" | "prioritySpacesOther", value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function setText(key: "trustAnswer", value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function goNext(latestAnswers: SurveyAnswers = answers) {
    if (questionIndex < surveyQuestions.length - 1) {
      setQuestionIndex((i) => i + 1);
      return;
    }
    // Leaving the last real question — save the survey answers now so
    // they're recorded even if the guest abandons before posting a message,
    // then move into the name/opinion step.
    setSurveyError(undefined);
    startSurveyTransition(async () => {
      const result = await submitSurvey(latestAnswers);
      if (result.ok) {
        setQuestionIndex((i) => i + 1);
      } else {
        setSurveyError(result.error);
      }
    });
  }

  function goBack() {
    if (questionIndex > 0) setQuestionIndex((i) => i - 1);
  }

  return (
    <div className={styles.page}>
      <div className={styles.ambientGlow} aria-hidden="true" />

      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.div key="intro" className={styles.introCard} {...fadeSlide}>
            <div
              className={styles.hero}
              style={{ backgroundImage: `url(${cm2.heroPhoto})` }}
            >
              <div className={styles.heroOverlay}>
                <Image
                  src={cm2.logo}
                  alt={cm2.orgName}
                  width={72}
                  height={72}
                  className={styles.heroLogo}
                />
                <h2 className={styles.heroTitle}>{cm2.surveyIntroTitle}</h2>
              </div>
            </div>
            <div className={styles.introBody}>
              <p className={styles.introText}>{cm2.surveyIntroBody}</p>
              <motion.button
                type="button"
                className={styles.submitButton}
                onClick={() => setStage("question")}
                whileTap={{ scale: 0.97 }}
              >
                Let&rsquo;s go 🎙️
              </motion.button>
              <p className={styles.introFootnote}>Takes about a minute · {TOTAL_STEPS} quick questions</p>
            </div>
          </motion.div>
        )}

        {stage === "question" && (
          <motion.div key="question" className={styles.card} {...fadeSlide}>
            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <p className={styles.progressLabel}>
              Question {questionIndex + 1} of {TOTAL_STEPS}
            </p>

            <AnimatePresence mode="wait">
              {!isContactStep && currentQuestion ? (
                <motion.div
                  key={questionIndex}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                >
                  <h1 className={styles.question}>{currentQuestion.question}</h1>
                  {currentQuestion.type === "multi" && currentQuestion.helper && (
                    <p className={styles.helper}>{currentQuestion.helper}</p>
                  )}

                  <QuestionStep
                    question={currentQuestion}
                    answers={answers}
                    onSetYesNo={setYesNo}
                    onSelectOption={selectOption}
                    onSetOtherText={setOtherText}
                    onSetText={setText}
                  />

                  {surveyError && <p className={styles.error}>{surveyError}</p>}
                  {isSubmittingSurvey && <p className={styles.helper}>Saving…</p>}

                  <div className={styles.navRow}>
                    <button
                      type="button"
                      className={styles.backButton}
                      onClick={goBack}
                      disabled={questionIndex === 0 || isSubmittingSurvey}
                    >
                      Back
                    </button>
                    {(currentQuestion.type === "text" || currentQuestion.type === "multi") && (
                      <motion.button
                        type="button"
                        className={styles.submitButton}
                        onClick={() => goNext()}
                        disabled={!currentAnswered || isSubmittingSurvey}
                        whileTap={currentAnswered ? { scale: 0.97 } : undefined}
                      >
                        {isSubmittingSurvey
                          ? "Saving…"
                          : questionIndex < surveyQuestions.length - 1
                            ? "Next"
                            : "Finish survey"}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                >
                  <h1 className={styles.question}>{siteConfig.eventTitle}</h1>
                  <p className={styles.helper}>{siteConfig.tagline}</p>

                  <form ref={formRef} onSubmit={handleMessageSubmit} className={styles.form}>
                    <div>
                      <label className={styles.label} htmlFor="name">
                        Your name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className={styles.input}
                        maxLength={siteConfig.maxNameLength}
                        placeholder="Jordan"
                        autoComplete="name"
                        value={messageName}
                        onChange={(e) => setMessageName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className={styles.label} htmlFor="message">
                        Your opinion
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className={styles.textarea}
                        maxLength={siteConfig.maxMessageLength}
                        placeholder="What's on your mind?"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        required
                      />
                    </div>

                    {messageError && <p className={styles.error}>{messageError}</p>}

                    <div className={styles.navRow}>
                      <button type="button" className={styles.backButton} onClick={goBack}>
                        Back
                      </button>
                      <motion.button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isMessagePending}
                        whileTap={{ scale: 0.97 }}
                      >
                        {isMessagePending ? "Sending…" : "Post it"}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {stage === "done" && (
          <motion.div key="done" className={styles.card} {...fadeSlide}>
            <motion.h1
              className={styles.title}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
            >
              Your voice is on the wall! 🎉
            </motion.h1>
            <p className={styles.introText}>Taking you to the Live Wall&hellip;</p>
          </motion.div>
        )}

        {stage === "pending-review" && (
          <motion.div key="pending-review" className={styles.card} {...fadeSlide}>
            <h1 className={styles.title}>Thanks — under review</h1>
            <p className={styles.introText}>
              Your message needs a quick look before it hits the big screen. It&rsquo;ll show up on the Live Wall
              once it&rsquo;s approved.
            </p>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => {
                setMessageName("");
                setMessageText("");
                setQuestionIndex(0);
                setAnswers(emptySurveyAnswers);
                setStage("intro");
              }}
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
