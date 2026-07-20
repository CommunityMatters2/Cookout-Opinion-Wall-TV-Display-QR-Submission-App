"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Tv, ArrowRight } from "lucide-react";
import { submitMessage, submitSurvey, type SubmitResult } from "@/app/actions";
import { siteConfig } from "@/config/site";
import { surveyQuestions, isQuestionAnswered } from "@/lib/surveyQuestions";
import { emptySurveyAnswers, type SurveyAnswers } from "@/types/survey";
import QuestionStep from "@/app/QuestionStep";
import styles from "./SurveyFlow.module.css";

type Stage = "intro" | "question" | "thanks" | "message" | "done";

const initialMessageState: SubmitResult = { ok: false };

const fadeSlide = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35 },
};

export default function SurveyFlow() {
  const { cm2 } = siteConfig;
  const [stage, setStage] = useState<Stage>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>(emptySurveyAnswers);
  const [surveyError, setSurveyError] = useState<string | undefined>();
  const [isSubmittingSurvey, startSurveyTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);
  const [messageState, messageAction, isMessagePending] = useActionState(
    async (prevState: SubmitResult, formData: FormData) => {
      const result = await submitMessage(prevState, formData);
      if (result.ok) {
        formRef.current?.reset();
        setStage("done");
      }
      return result;
    },
    initialMessageState
  );

  const currentQuestion = surveyQuestions[questionIndex];
  const currentAnswered = currentQuestion ? isQuestionAnswered(currentQuestion, answers) : false;
  const progressPercent = Math.round(((questionIndex + 1) / surveyQuestions.length) * 100);

  function setYesNo(key: "visitedBefore" | "cityNeedsCenter", value: "yes" | "no") {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMulti(
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

  function goNext() {
    if (questionIndex < surveyQuestions.length - 1) {
      setQuestionIndex((i) => i + 1);
      return;
    }
    setSurveyError(undefined);
    startSurveyTransition(async () => {
      const result = await submitSurvey(answers);
      if (result.ok) {
        setStage("thanks");
      } else {
        setSurveyError(result.error);
      }
    });
  }

  function goBack() {
    if (questionIndex > 0) setQuestionIndex((i) => i - 1);
  }

  function startOver() {
    setAnswers(emptySurveyAnswers);
    setQuestionIndex(0);
    setSurveyError(undefined);
    setStage("intro");
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
              <p className={styles.introFootnote}>Takes about a minute · {surveyQuestions.length} quick questions</p>
            </div>
          </motion.div>
        )}

        {stage === "question" && currentQuestion && (
          <motion.div key="question" className={styles.card} {...fadeSlide}>
            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <p className={styles.progressLabel}>
              Question {questionIndex + 1} of {surveyQuestions.length}
            </p>

            <AnimatePresence mode="wait">
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
                  onToggleMulti={toggleMulti}
                  onSetOtherText={setOtherText}
                  onSetText={setText}
                />
              </motion.div>
            </AnimatePresence>

            {surveyError && <p className={styles.error}>{surveyError}</p>}

            <div className={styles.navRow}>
              <button
                type="button"
                className={styles.backButton}
                onClick={goBack}
                disabled={questionIndex === 0 || isSubmittingSurvey}
              >
                Back
              </button>
              <motion.button
                type="button"
                className={styles.submitButton}
                onClick={goNext}
                disabled={!currentAnswered || isSubmittingSurvey}
                whileTap={currentAnswered ? { scale: 0.97 } : undefined}
              >
                {isSubmittingSurvey
                  ? "Saving…"
                  : questionIndex < surveyQuestions.length - 1
                    ? "Next"
                    : "Finish survey"}
              </motion.button>
            </div>
          </motion.div>
        )}

        {stage === "thanks" && (
          <motion.div key="thanks" className={styles.card} {...fadeSlide}>
            <Image src={cm2.logo} alt={cm2.orgName} width={88} height={88} className={styles.thanksLogo} />
            <h1 className={styles.title}>Thank you! 🙌</h1>
            <p className={styles.introText}>
              Your voice just helped shape Poughkeepsie&rsquo;s next community center.
            </p>
            <p className={styles.mission}>&ldquo;{cm2.mission}&rdquo;</p>
            <p className={styles.helper}>Follow {cm2.orgName} to stay in the loop:</p>
            <div className={styles.socialRow}>
              <a href={cm2.social.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                Facebook
              </a>
              <a href={cm2.social.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                Instagram
              </a>
              <a href={cm2.social.tiktok} target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                TikTok
              </a>
            </div>
            <motion.button
              type="button"
              className={styles.submitButton}
              onClick={() => setStage("message")}
              whileTap={{ scale: 0.97 }}
            >
              Now, share your cookout opinion →
            </motion.button>
          </motion.div>
        )}

        {stage === "message" && (
          <motion.div key="message" className={styles.card} {...fadeSlide}>
            <h1 className={styles.title}>{siteConfig.eventTitle}</h1>
            <p className={styles.tagline}>{siteConfig.tagline}</p>

            <form ref={formRef} action={messageAction} className={styles.form}>
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
                  required
                />
              </div>

              <div>
                <label className={styles.label} htmlFor="message">
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className={styles.textarea}
                  maxLength={siteConfig.maxMessageLength}
                  placeholder="What's on your mind?"
                  required
                />
              </div>

              {messageState.error && <p className={styles.error}>{messageState.error}</p>}

              <motion.button
                type="submit"
                className={styles.submitButton}
                disabled={isMessagePending}
                whileTap={{ scale: 0.97 }}
              >
                {isMessagePending ? "Sending…" : "Post it"}
              </motion.button>
            </form>
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
            <p className={styles.introText}>Look up at the big screen — you&rsquo;re on it!</p>
            <Link href="/display" className={styles.watchWallButton}>
              <Tv size={18} /> Watch the Live Wall <ArrowRight size={16} />
            </Link>
            <button type="button" className={styles.backButton} onClick={startOver}>
              Submit another response
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
