"use client";
import { useEffect, useState } from "react";
import { error, success } from "@/components/ui/alerts";
import emailjs from "@emailjs/browser";
import {
  MONTHS,
  WEEKDAYS_SHORT,
  WEEKDAYS_FULL,
  APPOINTMENT_OPTIONS,
  STEPS,
} from "@/utils/constants";

// ─── Calendar ───
function Calendar({
  selectedDate,
  onSelect,
}: {
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  return (
    <div className="cal-container">
      <div className="cal-header">
        <button className="cal-nav-btn" onClick={prevMonth}>
          ‹
        </button>
        <div className="cal-month-title">
          {MONTHS[viewMonth]} {viewYear}
        </div>
        <button className="cal-nav-btn" onClick={nextMonth}>
          ›
        </button>
      </div>
      <div className="cal-days-header">
        {WEEKDAYS_SHORT.map((d) => (
          <div key={d} className="cal-day-label">
            {d}
          </div>
        ))}
      </div>
      <div className="cal-days-grid">
        {cells.map((day, i) => {
          if (!day)
            return <div key={`e-${i}`} className="cal-day-cell empty" />;
          const cellDate = new Date(viewYear, viewMonth, day);
          cellDate.setHours(0, 0, 0, 0);
          const isPast = cellDate < today;
          const isToday = cellDate.getTime() === today.getTime();
          const isSelected =
            selectedDate && cellDate.getTime() === selectedDate.getTime();
          let cls = "cal-day-cell";
          if (isPast) cls += " past";
          else if (isSelected) cls += " selected";
          else if (isToday) cls += " today";
          return (
            <div
              key={day}
              className={cls}
              onClick={() =>
                !isPast && onSelect(new Date(viewYear, viewMonth, day))
              }
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="progress-bar">
      <div className="progress-steps">
        {STEPS.map((step, idx) => {
          const status =
            step.id < current
              ? "done"
              : step.id === current
                ? "active"
                : "pending";
          return (
            <div key={step.id} className="progress-step">
              <div className={`step-dot ${status}`}>
                {status === "done" ? "✓" : step.id}
              </div>
              {/* <div className={`step-label ${status}`}>{step.label}</div> */}
              {idx < STEPS.length - 1 && (
                <div
                  className={`step-line ${status === "done" ? "done" : ""}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Steps ───
function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div className="step-enter">
      <div className="step-number">ՀԱՐՑ 1 / 6</div>
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">
        Իմ հետ կապված բարևից բացի ուրիշ բան չէիր ուզում ?😏
      </h1>

      <div className="btn-row">
        <button
          className="btn danger-btn"
          onClick={() =>
            error("Ասել ես,դրա համար էլ էս տարբերակն եմ ընտրել😏։")
          }
        >
          Ոչ
        </button>
        <button
          className="btn primary"
          onClick={() => {
            success("Էտ անցյալում մնաց,հիմա անցանք պատճառին։");
            onNext();
          }}
        >
          Այո
        </button>
      </div>
    </div>
  );
}

function Step2({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState("");

  const handleNext = () => {
    if (!selected) {
      error("Ուր առանց ընտրելու?🙂");
      return;
    }

    const label =
      APPOINTMENT_OPTIONS.find((o) => o.value === selected)?.label || selected;

    sessionStorage.setItem("quiz_reason", label.split(" ").slice(1).join(" "));

    success(
      label?.includes("Անճաշակ")
        ? "Ես էլ,թխի թող գա։🖐️​"
        : label?.includes("Պատրաստ")
          ? "Անցանք առաջ։"
          : "Դժվար չէր կռահելը։😊",
    );
    setTimeout(() => {
      onNext();
    }, 1700);
  };

  return (
    <div className="step-enter">
      <div className="step-number">ՀԱՐՑ 2 / 6</div>
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">Ու պատճառը․․․?😏</h1>

      <div className="select-wrapper">
        <select
          className="quiz-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {APPOINTMENT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="select-arrow">▼</span>
      </div>
      <div className="btn-row">
        <button className="btn primary" onClick={handleNext}>
          Հետո
        </button>
      </div>
    </div>
  );
}

function Step3({ onNext }: { onNext: () => void }) {
  return (
    <div className="step-enter">
      <div className="step-number">ՀԱՐՑ 03 / 06</div>
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">
        Հաստատ վերլուծել ես ու կուզեիր ուրիշ ձև արտահայտած լինեիր վերջին
        մտքերդ​💁‍♀️​​
      </h1>

      <div className="btn-row">
        <button
          className="btn danger-btn"
          onClick={() =>
            error(
              "Անհնարա, Не верю! , կարողա պահերա եղել,որ ասել ես ավելի կոպիտ պտի խոսացած լինեի 🙃, բայց ես էլ եմ նենցա վերլուծել, ու ասեմ, որ դրանից ավել չէր կարա լիներ😏։",
            )
          }
        >
          Ոչ
        </button>
        <button
          className="btn primary"
          onClick={() => {
            success("ԸՀԸԸԸԸ՛");
            onNext();
          }}
        >
          Այո
        </button>
      </div>
    </div>
  );
}

function Step4({ onNext }: { onNext: () => void }) {
  const [text, setText] = useState("");
  const [_, setTypedHistory] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!text.trim()) return;
    const timer = setTimeout(() => {
      setTypedHistory((prev) => {
        const updated = [...prev, text];
        sessionStorage.setItem("quiz_cover_history", JSON.stringify(updated));
        return updated;
      });
    }, 700);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className="step-enter">
      <div className="step-number">ՀԱՐՑ 4 / 6</div>
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">
        Ժամանակը հետ տարանք ու տեղ կա մտքերը նորից արտահայտելու․․․
      </h1>
      {showHint && (
        <p className="quiz-desc">
          Ստեղ,որ պատասխան չնշես էլ առաջ անցնել կլինի,բայցցցցց էտքան տանջվել
          սարքել եմ😊։
        </p>
      )}
      <textarea
        className="quiz-textarea"
        // placeholder="Որն է արդյոք պատճառը, որ մենք չենք խմել☕"
        placeholder="..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />
      <div className="btn-row">
        <button className="btn primary" onClick={onNext}>
          Հետո
        </button>
      </div>
    </div>
  );
}

function Step5({ onNext }: { onNext: () => void }) {
  const reason = sessionStorage.getItem("quiz_reason") || "";

  return (
    <div className="step-enter">
      <div className="step-number">ՀԱՐՑ 5 / 6</div>
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">Պատճառը - {reason}</h1>

      <div className="reading-block">Դրա համար նայի ինչ եմ մտածել․․․</div>
      <div className="btn-row">
        <button className="btn primary" onClick={onNext}>
          Հետո
        </button>
      </div>
    </div>
  );
}

function Step6({
  onDone,
}: {
  onDone: (date: Date, hour: number, min: number) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [sending, setSending] = useState(false);

  const history = JSON.parse(
    sessionStorage.getItem("quiz_cover_history") || "[]",
  );
  const coverHistory = history
    .map((item: string, index: number) => `${index + 1}. ${item}`)
    .join("\n");

  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  const formatDate = (d: Date) => {
    const dayIndex = (d.getDay() + 6) % 7;
    return `${WEEKDAYS_FULL[dayIndex]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleAccept = async () => {
    if (!selectedDate) {
      error("Ամսաթիվը պարտադիր Է։ 📅");
      return;
    }

    if (!time) {
      error("Ժամը պարտադիր է։ ⏰");
      return;
    }

    // if (selectedDate.getMonth() === 4 && selectedDate.getDate() === 29) {
    //   error("Չես հավատա, բայց ծնունդսա էտ օրը։");
    //   return;
    // }

    const [rawH, rawM] = time.split(":");
    const h = parseInt(rawH ?? "");
    const m = parseInt(rawM ?? "");

    setSending(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          title: "Նամակ",
          name: "Էլեն",
          date: formatDate(selectedDate),
          time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
          reason: sessionStorage.getItem("quiz_reason") || "",
          cover: coverHistory,
        },
        EMAILJS_PUBLIC_KEY,
      );
      success("Պայմանավորվեցինք ❤️");
      onDone(selectedDate, h, m);
    } catch {
      error("Շուղարկվեց!");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="step-enter">
      <div className="step-number">ՀԱՐՑ 6 / 6</div>
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">Քեզ մնումա մենակ օր ու ժամ ընտրես 😊</h1>

      {selectedDate && (
        <div className="selected-date-display">
          <span className="selected-date-icon">📅</span>
          <span className="selected-date-text">{formatDate(selectedDate)}</span>
        </div>
      )}

      <div className="calendar-wrapper">
        <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />
      </div>

      <div className="time-section">
        <div className="time-label">Երևանի ժամանակով</div>
        <div className="time-inputs">
          <input
            className="time-input"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className="btn-row" style={{ marginTop: 28 }}>
        <button
          className="btn primary"
          onClick={handleAccept}
          disabled={sending}
        >
          {sending ? "⏳ Ուղարկվում է..." : "✓ Ուղարկել"}
        </button>
      </div>
    </div>
  );
}

function FinalScreen({
  date,
  hour,
  min,
}: {
  date: Date;
  hour: number;
  min: number;
}) {
  const formatDate = (d: Date) => {
    const dayIndex = (d.getDay() + 6) % 7;
    return `${WEEKDAYS_FULL[dayIndex]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };
  return (
    <div className="final-screen">
      {/* <div className="checkmark">☕</div> */}
      <h1 className="final-title">Ընտիր ❤️</h1>
      <div className="final-date-confirmed">
        <div className="confirmed-row">
          <span>Օրը</span>
          <span>{formatDate(date)}</span>
        </div>
        <div className="confirmed-row">
          <span>Ժամը</span>
          <span>
            ~ {String(hour).padStart(2, "0")}:{String(min).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main ───
const PASSWORD_PART_1 = process.env.NEXT_PUBLIC_PASS_1!;
const PASSWORD_PART_2 = process.env.NEXT_PUBLIC_PASS_2!;
const PASSWORD_PART_3 = process.env.NEXT_PUBLIC_PASS_3!;

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [step, setStep] = useState(1);
  const [finalData, setFinalData] = useState<{
    date: Date;
    h: number;
    m: number;
  } | null>(null);

  useEffect(() => {
    const isAuthenticated =
      sessionStorage.getItem("quiz_authenticated") === "true";

    setAuthenticated(isAuthenticated);
    setAuthChecked(true);
  }, []);

  const isPart1Correct =
    password.slice(0, PASSWORD_PART_1.length) === PASSWORD_PART_1;

  const isPart2Correct =
    password.slice(
      PASSWORD_PART_1.length,
      PASSWORD_PART_1.length + PASSWORD_PART_2.length,
    ) === PASSWORD_PART_2;

  const isPart3Correct =
    password.slice(
      PASSWORD_PART_1.length + PASSWORD_PART_2.length,
      PASSWORD_PART_1.length + PASSWORD_PART_2.length + PASSWORD_PART_3.length,
    ) === PASSWORD_PART_3;

  const isPasswordCorrect =
    password === `${PASSWORD_PART_1}${PASSWORD_PART_2}${PASSWORD_PART_3}`;

  const handleLogin = () => {
    if (!password.trim()) {
      error("Հետ արի, առանց ծածկագրի չես անցնի։ 😏");
      return;
    }

    if (!isPasswordCorrect) {
      error("Չէէէ, մի բան էն շես անում։ 😏");
      return;
    }

    sessionStorage.setItem("quiz_authenticated", "true");

    success("Բարև 🖐️​");

    setAuthenticated(true);
  };

  if (!authChecked) {
    return null;
  }

  if (!authenticated) {
    return (
      <main className="quiz-wrapper">
        <div className="quiz-card">
          <div className="step-enter">
            <div className="card-ornament">✦ ✦ ✦</div>

            <h1 className="quiz-title">
              Հուշումներով կիմանաս ծածկագիրը ու էն ինչ կտեսնես դա կլինի մեր
              գաղտնիքը։ 🤫
            </h1>

            <p className="quiz-desc">
              1. մեր առաջին հանդիպման օրը{" "}
              {isPart1Correct && <span className="password-check">✓</span>}
            </p>

            <p className="quiz-desc">
              2. ծննդյանդ օր ամիս տարի{" "}
              {isPart2Correct && <span className="password-check">✓</span>}
            </p>

            <p className="quiz-desc">
              3. քանի անգամ ենք խոսել իրար հետ{" "}
              {isPart3Correct && <span className="password-check">✓</span>}
            </p>

            <p className="quiz-desc">
              Մտածի մի քիչ ... եթե ինչ 1-ի մասով հուշում ունես։ 🙄
            </p>

            {showHint && (
              <div className="alert info">
                <span className="alert-icon">💡</span>

                <span>Հուշում՝ ես 2 անգամ խառնել եմ էտ օրվա անունը։🤦‍♂️</span>
              </div>
            )}

            <input
              className="quiz-textarea"
              type="password"
              inputMode="numeric"
              placeholder="Գաղտնաբառը..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              style={{
                minHeight: 0,
                height: 52,
                resize: "none",
              }}
            />

            <div className="btn-row">
              <button className="btn" onClick={() => setShowHint((h) => !h)}>
                {showHint ? "✖️ Լավ, հերիք ա հուշեմ 😊" : "💡 Մի հատ հուշում"}
              </button>

              <button className="btn primary" onClick={handleLogin}>
                Մտնել
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="quiz-wrapper">
      {!finalData && <ProgressBar current={step} />}
      <div className="quiz-card">
        {finalData ? (
          <FinalScreen
            date={finalData.date}
            hour={finalData.h}
            min={finalData.m}
          />
        ) : step === 1 ? (
          <Step1 onNext={() => setStep(2)} />
        ) : step === 2 ? (
          <Step2 onNext={() => setStep(3)} />
        ) : step === 3 ? (
          <Step3 onNext={() => setStep(4)} />
        ) : step === 4 ? (
          <Step4 onNext={() => setStep(5)} />
        ) : step === 5 ? (
          <Step5 onNext={() => setStep(6)} />
        ) : (
          <Step6 onDone={(d, h, m) => setFinalData({ date: d, h, m })} />
        )}
      </div>
    </main>
  );
}
