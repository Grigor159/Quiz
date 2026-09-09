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
import { useOnTrue } from "@/hooks/useOnTrue";
import { storage } from "@/lib/browser/storage";
import Music from "@/components/music";

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
      {/* <div className="step-number">1 / 6</div> */}
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">
        Իմ հետ կապված բարևից բացի ուրիշ բան չէիր ուզում ?😏
      </h1>

      <div className="btn-row">
        <button
          className="btn danger-btn"
          onClick={() => {
            storage.set("quiz_wish", "Շէ");
            storage.set("quiz_step", 2);
            onNext();
          }}
        >
          Շէ
        </button>
        <button
          className="btn primary"
          onClick={() => {
            storage.set("quiz_step", 2);
            storage.set("quiz_wish", "Ըհը");
            success("Էտ անցյալում մնաց,հիմա անցանք պատճառին։");
            onNext();
          }}
        >
          Ըհը
        </button>
      </div>
      <div className="btn-row">
        <button
          className="btn primary"
          onClick={() => {
            storage.set("quiz_step", 2);
            storage.set(
              "quiz_wish",
              "Չգիտեմ,ես տենց բան չեմ հիշում,հաստատ էն նմանակսա եղել😏",
            );
            success("Վայ ես դրա...");
            onNext();
          }}
        >
          Չգիտեմ,ես տենց բան չեմ հիշում,հաստատ էն նմանակսա եղել😏
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

    const choosed =
      APPOINTMENT_OPTIONS.find((o) => o.value === selected) || selected;

    const label = typeof choosed === "string" ? choosed : choosed.label;
    const value = typeof choosed === "string" ? choosed : choosed.value;

    sessionStorage.setItem("quiz_reason", label.split(" ").slice(1).join(" "));

    success(
      value?.includes("tasteless")
        ? "Ես էլ,թխի թող գա։🖐️​"
        : value?.includes("ready")
          ? "Անցանք առաջ։"
          : value?.includes("assistant")
            ? "Առհամարհելով անցնողն էլ ուրեմն դու չես եղել։"
            : "Դժվար չէր կռահելը։😊",
    );
    setTimeout(() => {
      onNext();
      storage.set("quiz_step", 3);
    }, 1700);
  };

  return (
    <div className="step-enter">
      {/* <div className="step-number">2 / 6</div> */}
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">Բա խի տենց ասեցիր😏։</h1>

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
      {/* <div className="step-number">03 / 06</div> */}
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
              "Անհնարա! կարողա պահերա եղել, որ ասել ես ավելի կոպիտ պտի արտահայտվեի նույնիսկ🙃։ Ես էլ եմ վերլուծել ու ասեմ, որ դրանից ավել չի լինում😏։ Տակ շտո համաձայնվի անցնենք առաջ։",
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
            storage.set("quiz_step", 4);
          }}
        >
          Այո
        </button>
      </div>
    </div>
  );
}

function Step4({ onNext }: { onNext: () => void }) {
  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_TWO!;
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  const [text, setText] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hasFocused, setHasFocused] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const covered =
    JSON.parse(storage.get("quiz_cover_history") || "[]") || history;

  const wish = storage.get("quiz_wish") || "";
  const coverHistory = covered
    .map((item: string, index: number) => `${index + 1}. ${item}`)
    .join("\n");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasFocused) return;

    const timer = setTimeout(() => {
      setShowHint(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, [hasFocused]);

  useEffect(() => {
    if (!text.trim()) return;
    const timer = setTimeout(() => {
      setHistory((prev) => {
        const updated = [...prev, text];
        storage.set("quiz_cover_history", JSON.stringify(updated));
        return updated;
      });
    }, 700);
    return () => clearTimeout(timer);
  }, [text]);

  const handleAccept = async () => {
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: "Էլեն",
          wish: wish,
          reason: storage.get("quiz_reason") || "",
          cover: coverHistory,
        },
        EMAILJS_PUBLIC_KEY,
      );
      onNext();
      storage.set("quiz_step", 5);
    } catch {
      console.log("Շուղարկվեց!");
    }
  };

  return (
    <div className="step-enter">
      {!showContent ? (
        <div className="clock-wrapper">
          <img src="/assets/clock.gif" alt="Clock" className="clock-gif" />
        </div>
      ) : (
        <>
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
            placeholder="..."
            value={text}
            onFocus={() => setHasFocused(true)}
            onChange={(e) => setText(e.target.value)}
            rows={3}
          />

          <div className="btn-row">
            <button
              className="btn primary"
              onClick={handleAccept}
              disabled={!showHint}
            >
              Հետո
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Step5({ onNext }: { onNext: () => void }) {
  const reason = storage.get("quiz_reason") || "";

  const handleNext = () => {
    onNext();
    storage.set("quiz_step", 6);
  };

  return (
    <div className="step-enter">
      {/* <div className="step-number">5 / 6</div> */}
      <div className="card-ornament">✦ ✦ ✦</div>
      <h1 className="quiz-title">Պատճառը - {reason}</h1>

      <div className="reading-block">Դրա համար նայի ինչ եմ մտածել․․․</div>
      <div className="btn-row">
        <button className="btn primary" onClick={handleNext}>
          Հետո
        </button>
      </div>
    </div>
  );
}

function Step6({ onNext }: { onNext: () => void }) {
  const handleNext = () => {
    onNext();
    storage.set("quiz_step", 7);
  };

  return (
    <>
      <Music />
      <div className="step-enter">
        {/* <div className="step-number">6 / 6</div> */}
        <div className="card-ornament">✦ ✦ ✦</div>
        <h1 className="quiz-title">Ինչնա էս ամենի իմաստը</h1>

        <p className="quiz-desc">
          Էն, որ կարդում ես վկայումա, որ կարևորություն տրվեց երկուսիս կողմից էլ
          էն ամեն ինչին, որ անուն ու բացատրություն չունի, բայց փոխարենը տեղա
          ունեցել ու կամ ունի մեր առօրյայում ամենաքիչը մտքերի տեսքով:
          <br />
          Ես չեմ ասի, որ կսպասեմ ինչքան պետքա մինչև դու պատրաստ լինես, որովհետև
          էտ իմ մասին չի, բայց վստահ ասում եմ, որ պատրաստ չլինելուդ տակ ընկած
          բոլոր վախերին ու դժվարություններին ես պատրաստ եմ առերեսվեմ ու
          կհամոզվես, որ դրանք մեր պարագայում ուղղակի հնարովի էին ու դրա համար
          նենց չի, որ շատ բանա պետք (սկզբում մենակս էլ գլուխ կհանեմ):
          <br />
          Իրականում մի հայացքը ու մի քանի խոսքը բավականա, հատկապես, որ մենք հենց
          տենց էինք սկսել, ուղղակի շեղվեցինք մի պահից ու գնացինք ուրիշ
          ճանապարհով ՝ անտեսելու, տենց կարծում էինք հեշտա:
          <br />
          Ես էլի համոզվեցի, որ մի բան կա հեշտ ու դա լավատես լինելնա ու բեր տենց
          լինենք էս հարցում, քանի որ ժամանակի ճնշման տակ առնվազն չենք կոտրվե ու
          կորցրե ու ես հստակ գիտեմ ինչ ենք ուզում մենք արդեն:
          <br />
          <br />
          Արի ուղղակի մեր հայացքներին թողենք նկատեն միմյանց ներկայությունը ու
          հավատա իրանք գիտեն ինչ պետքա անեն:
          <br />
          <br />
          Համ էլ հիմա սաղ սրտի վրա ենք գցել, որը էտքան էլ ցանկալի չի ՝ հատկապես
          իմ տարիքում😄:
        </p>
        <div className="btn-row" style={{ marginTop: 28 }}>
          <button className="btn primary" onClick={handleNext}>
            Հետո
          </button>
        </div>
      </div>
    </>
  );
}

function Step7({
  onDone,
}: {
  onDone: (date: Date, hour: number, min: number, place: string) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [sending, setSending] = useState(false);

  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_ONE!;
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

    if (!place) {
      error("Տեղը պարտադիր է։ 📍");
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
          name: "Էլեն",
          date: formatDate(selectedDate),
          time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
          place: place,
        },
        EMAILJS_PUBLIC_KEY,
      );
      success("Պայմանավորվեցինք ❤️");
      onDone(selectedDate, h, m, place);
    } catch {
      error("Շուղարկվեց!");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="step-enter">
      {/* <div className="step-number">6 / 6</div> */}
      <div className="card-ornament">✦ ✦ ✦</div>
      <p className="quiz-desc" style={{ textAlign: "center" }}>
        Արի ընդունենք, որ իրականում մի անկեղծ զրույցը կարա մոռացնել տա ցանկացած
        նեղվածություն կամ տարակարծություն ու մեզ հենց դայա պակասում։ Հետևաբար,
        ակնկալում եմ պատասխան։
      </p>

      <h1 className="quiz-title">Դե բեր օր ու ժամ ընտրի😊։</h1>

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
        <div className="time-label">ժամ</div>
        <div className="time-inputs">
          <input
            className="time-input"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>
      <div className="time-section">
        <div className="time-label">Որտեղ</div>
        <div className="time-inputs">
          <textarea
            className="quiz-textarea"
            placeholder="..."
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            rows={3}
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
  place,
}: {
  date: Date;
  hour: number;
  min: number;
  place: string;
}) {
  const formatDate = (d: Date) => {
    const dayIndex = (d.getDay() + 6) % 7;
    return `${WEEKDAYS_FULL[dayIndex]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  return (
    <div className="final-screen">
      <h1 className="final-title">Ընտիր ❤️</h1>
      <div className="final-date-confirmed">
        <div className="confirmed-row">
          <span>Օրը</span>
          <span>{formatDate(date)}</span>
        </div>
        <div className="confirmed-row">
          <span>Ժամը</span>
          <span>
            {String(hour).padStart(2, "0")}:{String(min).padStart(2, "0")}
          </span>
        </div>
        <div className="confirmed-row">
          <span>Որտեղ</span>
          <span>{place}</span>
        </div>
      </div>

      <p className="quiz-desc" style={{ textAlign: "center" }}>
        Պատասխանը եկավ ինձ, դու էլ էջը սքրին արա, որ չմոռանաս😊։
      </p>
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
  const [step, setStep] = useState(Number(storage.get("quiz_step")) || 1);
  const [finalData, setFinalData] = useState<{
    date: Date;
    h: number;
    m: number;
    p: string;
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

    storage.set("quiz_authenticated", "true");

    success("Բարև 🖐️​");

    setAuthenticated(true);
  };

  useOnTrue(isPart1Correct, () => success("1-ինը ունենք"));
  useOnTrue(isPart2Correct, () => success("2-րդն էլ ունենք"));
  useOnTrue(isPart3Correct, () => success("3-րդն էլ ունենք"));

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
              Որ քեզնից բացի ուրիշ մարդ չմտնի ներքևի հուշումներով հավաքի
              ծածկագիրը ու էն ինչ կտեսնես դա կլինի մեր գաղտնիքը։ 🤫
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
            place={finalData.p}
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
        ) : step === 6 ? (
          <Step6 onNext={() => setStep(7)} />
        ) : (
          <Step7 onDone={(d, h, m, p) => setFinalData({ date: d, h, m, p })} />
        )}
      </div>
    </main>
  );
}
