"use client";
import { useEffect, useState } from "react";
import { error, success } from "@/components/ui/alerts";
import emailjs from "@emailjs/browser";

// const MONTH_NAMES = ["Հունվar", "Փetrvari", "Маrt", "Апrel", "Маис", "Hunис", "Hulис", "Огosт", "Seпtemper", "Окtemper", "Noyemper", "Dektemper"];

const MONTHS = [
  "Հունվար", // January
  "Փետրվար", // February
  "Մարտ", // March
  "Ապրիլ", // April
  "Մայիս", // May
  "Հունիս", // June
  "Հուլիս", // July
  "Օգոստոս", // August
  "Սեպտեմբեր", // September
  "Հոկտեմբեր", // October
  "Նոյեմբեր", // November
  "Դեկտեմբեր",
];

export const WEEKDAYS_SHORT = [
  "Երկ", // Երկուշաբթի
  "Երք", // Երեքշաբթի
  "Չրք", // Չորեքշաբթի
  "Հնգ", // Հինգշաբթի
  "Ուրբ", // Ուրբաթ
  "Շբթ", // Շաբաթ
  "Կիր", // Կիրակի
];

export const WEEKDAYS_FULL = [
  "Երկուշաբթի",
  "Երեքշաբթի",
  "Չորեքշաբթի",
  "Հինգշաբթի",
  "Ուրբաթ",
  "Շաբաթ",
  "Կիրակի",
];

const APPOINTMENT_OPTIONS = [
  { value: "", label: "Ընտրի..." },
  { value: "cinema", label: "💔 Նեղանալ իրարից" },
  { value: "stay_home", label: "🏠 Տանը մնալ" },
  { value: "coffee", label: "☕ Կոֆե խմել" },
];

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

// ─── Progress ───
const STEPS = [
  { id: 1, label: "Ստugum" },
  { id: 2, label: "Инч?" },
  { id: 3, label: "Ката-ре՞л" },
  { id: 4, label: "Ба xи?" },
  { id: 5, label: "Патचарр" },
  { id: 6, label: "Амропum" },
];

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
      <div className="step-number">ՔԱՅԼ 1 / 6</div>
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">Մենք բան էինք որոշել, բայց չենք արել?</h1>
      😏
      <div className="btn-row">
        <button
          className="btn danger-btn"
          onClick={() => error("Հլը լավ մտածի 😏")}
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

function Step2({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState("");
  const [hint, setHint] = useState(false);

  const handleNext = () => {
    if (!selected) {
      error("Ուր առանց ընտրելու?🙂");
      return;
    }
    if (selected !== "coffee") {
      const label =
        APPOINTMENT_OPTIONS.find((o) => o.value === selected)?.label ||
        selected;
      error(
        label?.includes("Նեղանալ իրարից")
          ? "Էլ մի, տենց բան չի եղել😊"
          : `${label}😏, լավնաաա, բայց չէ😊`,
      );
      return;
    }
    success("ԸՀԸԸԸԸ՛");
    onNext();
  };

  return (
    <div className="step-enter">
      <div className="step-number">Քայլ 2 / 6</div>
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">Որն էր որ?</h1>
      😏
      {hint && (
        <div className="alert info">
          <span className="alert-icon">💡</span>
          <span>Պպզել gim ի դեմը․․․․․․․․․․</span>
        </div>
      )}
      <div className="select-wrapper">
        <select
          className="quiz-select"
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
            // error("");
          }}
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
        <button className="btn" onClick={() => setHint((h) => !h)}>
          {hint ? "✖️ Հաաաաաաաաաաա😊" : "💡 Բա որ միքիչ հուշեիք"}
        </button>
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
      <div className="step-number">Քայլ 03 / 06</div>
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">Խմել ենք?</h1>
      😏
      <div className="btn-row">
        <button
          className="btn danger-btn"
          onClick={() =>
            error("Լսի... ինձ էլ էր տենց թվում,բայց ոնց որ թե չէ😊😊😊")
          }
        >
          Այո
        </button>
        <button
          className="btn primary"
          onClick={() => {
            success("ԸՀԸԸԸԸ՛");
            onNext();
          }}
        >
          Ոչ
        </button>
      </div>
    </div>
  );
}

function Step4({ onNext }: { onNext: () => void }) {
  const [text, setText] = useState("");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="step-enter">
      <div className="step-number">Քայլ 4 / 6</div>
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">Բա խի?</h1>
      {showHint && (
        <p className="quiz-desc">
          Ստեղ պատասխան կարաս չնշես, զուտ անցի մյուսին😊
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
  return (
    <div className="step-enter">
      <div className="step-number">Քայլ 5 / 6</div>
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">
        Պատճառը տեղնա ու ժամը որ չենք հարմարացնում{" "}
      </h1>
      😏
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

  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  const formatDate = (d: Date) =>
    `${WEEKDAYS_FULL[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

  const handleAccept = async () => {
    if (!selectedDate) {
      error("Ամսաթիվը պարտադիր Է։ 📅");
      return;
    }

    if (!time) {
      error("Ժամը պարտադիր է։ ⏰");
      return;
    }

    if (selectedDate.getMonth() === 4 && selectedDate.getDate() === 29) {
      error("Շես հավատա, բայց ծնունդսա էտ օրը։");
      return;
    }

    const [rawH, rawM] = time.split(":");
    const h = parseInt(rawH ?? "");
    const m = parseInt(rawM ?? "");

    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          title: "Կոֆե հանդիպում",
          name: "Հասմիկ",
          date: formatDate(selectedDate),
          time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
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
      <div className="step-number">Քայլ 6 / 6</div>
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
  const formatDate = (d: Date) =>
    `${WEEKDAYS_FULL[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  return (
    <div className="final-screen">
      <div className="checkmark">☕</div>
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
export default function Home() {
  const [step, setStep] = useState(1);
  const [finalData, setFinalData] = useState<{
    date: Date;
    h: number;
    m: number;
  } | null>(null);

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
