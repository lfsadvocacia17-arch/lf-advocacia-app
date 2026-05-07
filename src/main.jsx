import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const G = {
  bg: "#f7f5f0", card: "#ffffff", green: "#1B4D3E", greenL: "#e8f0ec",
  gold: "#C9A84C", goldD: "#9a7a2e", text: "#1a2e25", sub: "#6b8577",
  border: "#e0ddd6", red: "#c0392b", yellow: "#c8960a", blue: "#2471a3",
  purple: "#7d3c98", teal: "#1a7a6e", gray: "#9aaa9e",
};

const KANBAN_COLS = [
  { id: "todo", label: "A Fazer", color: "#2471a3", icon: "📋" },
  { id: "doing", label: "Em Andamento", color: "#c8960a", icon: "⚡" },
  { id: "done", label: "Concluído", color: "#1e8449", icon: "✅" },
];

const CATS = {
  "Inventário": { color: "#7d3c98", icon: "⚖️" },
  "Audiência": { color: "#c0392b", icon: "🏛️" },
  "Contrato": { color: "#2471a3", icon: "📝" },
  "Procuração": { color: "#1a7a6e", icon: "📄" },
  "Inicial": { color: "#c8960a", icon: "🗂️" },
  "Pessoal": { color: "#7d3c98", icon: "👤" },
  "Aula/Evento": { color: "#1a7a6e", icon: "🎓" },
  "Outros": { color: "#6b8577", icon: "📌" },
};

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WD = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

const INIT_TASKS = [
  { id: genId(), title: "Comenda", cat: "Outros", status: "todo", date: "", priority: "media" },
  { id: genId(), title: "Rosiane", cat: "Outros", status: "todo", date: "", priority: "media" },
  { id: genId(), title: "Inventário Patrícia (imposto)", cat: "Inventário", status: "todo", date: "", priority: "alta" },
  { id: genId(), title: "Consulta Camila resumo pai", cat: "Outros", status: "todo", date: "", priority: "media" },
  { id: genId(), title: "Inicial golpe caixa", cat: "Inicial", status: "todo", date: "", priority: "alta" },
  { id: genId(), title: "Contrato Marileia", cat: "Contrato", status: "todo", date: "", priority: "media" },
  { id: genId(), title: "Procuração Mônica", cat: "Procuração", status: "todo", date: "", priority: "media" },
  { id: genId(), title: "Iniciar processo Jessica prima", cat: "Inicial", status: "todo", date: "", priority: "media" },
  { id: genId(), title: "Inventário Leopoldo", cat: "Inventário", status: "todo", date: "", priority: "alta" },
  { id: genId(), title: "Wanderlei docs INSS", cat: "Outros", status: "todo", date: "", priority: "media" },
  { id: genId(), title: "Marcos usucapião", cat: "Outros", status: "todo", date: "", priority: "media" },
];

const INIT_EVENTS = [
  { id: genId(), title: "Dentista 11:00", date: "2026-05-07", time: "11:00", cat: "Pessoal" },
  { id: genId(), title: "OAB Igarapava 19h", date: "2026-05-08", time: "19:00", cat: "Aula/Evento" },
  { id: genId(), title: "Aula criminologia on-line 18h", date: "2026-05-11", time: "18:00", cat: "Aula/Evento" },
  { id: genId(), title: "Audiência Monica 16:30", date: "2026-05-12", time: "16:30", cat: "Audiência" },
  { id: genId(), title: "Rádio JM evento", date: "2026-05-12", time: "17:00", cat: "Aula/Evento" },
  { id: genId(), title: "JM 08:00h", date: "2026-05-13", time: "08:00", cat: "Outros" },
  { id: genId(), title: "Palestra escola América 10:00", date: "2026-05-16", time: "10:00", cat: "Aula/Evento" },
  { id: genId(), title: "Audiência Michele virtual 13:30h", date: "2026-05-20", time: "13:30", cat: "Audiência" },
  { id: genId(), title: "Revisão carro 08:00", date: "2026-05-21", time: "08:00", cat: "Pessoal" },
  { id: genId(), title: "Audiência platina (lembrete)", date: "2026-05-29", time: "09:00", cat: "Audiência" },
  { id: genId(), title: "Audiência platina 16:00", date: "2026-06-01", time: "16:00", cat: "Audiência" },
  { id: genId(), title: "Audiência Pablo 15:50", date: "2026-06-09", time: "15:50", cat: "Audiência" },
];

const saved = (() => { try { const s = localStorage.getItem("lf3"); return s ? JSON.parse(s) : null; } catch { return null; } })();

function App() {
  const [tasks, setTasks] = useState(saved?.tasks || INIT_TASKS);
  const [events, setEvents] = useState(saved?.events || INIT_EVENTS);
  const [tab, setTab] = useState("kanban");
  const [calDate, setCalDate] = useState(new Date());
  const [selDay, setSelDay] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", cat: "Outros", status: "todo", date: "", priority: "media" });
  const [eventForm, setEventForm] = useState({ title: "", date: "", time: "", cat: "Outros" });
  const [drag, setDrag] = useState(null);

  const save = (t, e) => { try { localStorage.setItem("lf3", JSON.stringify({ tasks: t, events: e })); } catch {} };
  const setT = fn => setTasks(p => { const n = fn(p); save(n, events); return n; });
  const setE = fn => setEvents(p => { const n = fn(p); save(tasks, n); return n; });

  const addTask = () => {
    if (!taskForm.title.trim()) return;
    const t = [...tasks, { ...taskForm, id: genId(), title: taskForm.title.trim() }];
    setTasks(t); save(t, events);
    setTaskForm({ title: "", cat: "Outros", status: "todo", date: "", priority: "media" });
    setShowTaskForm(false);
  };

  const addEvent = () => {
    if (!eventForm.title.trim() || !eventForm.date) return;
    const e = [...events, { ...eventForm, id: genId(), title: eventForm.title.trim() }];
    setEvents(e); save(tasks, e);
    setEventForm({ title: "", date: "", time: "", cat: "Outros" });
    setShowEventForm(false);
  };

  const moveTask = (id, status) => setT(t => t.map(x => x.id === id ? { ...x, status } : x));
  const delTask = id => setT(t => t.filter(x => x.id !== id));
  const delEvent = id => setE(e => e.filter(x => x.id !== id));

  const inp = {
    width: "100%", background: G.bg, border: `1.5px solid ${G.border}`,
    borderRadius: 8, padding: "10px 13px", color: G.text, fontSize: 13,
    outline: "none", boxSizing: "border-box", fontFamily: "Georgia,serif", marginBottom: 8,
  };
  const btnP = { background: G.green, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "Georgia,serif" };
  const btnS = { background: G.bg, color: G.sub, border: `1.5px solid ${G.border}`, borderRadius: 8, padding: "9px 20px", fontWeight: 600, cursor: "pointer", fontSize: 13, fontFamily: "Georgia,serif" };

  const yr = calDate.getFullYear(), mo = calDate.getMonth();
  const firstDay = new Date(yr, mo, 1).getDay();
  const dim = new Date(yr, mo + 1, 0).getDate();
  const evByDay = {};
  events.forEach(ev => {
    const d = new Date(ev.date + "T00:00:00");
    if (d.getFullYear() === yr && d.getMonth() === mo) {
      const day = d.getDate();
      evByDay[day] = evByDay[day] || [];
      evByDay[day].push(ev);
    }
  });
  const today = new Date();

  return (
    <div style={{ minHeight: "100vh", background: G.bg, fontFamily: "Georgia,serif", color: G.text }}>
      <div style={{ background: G.green, padding: "16px 22px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 12px #0002" }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${G.gold},${G.goldD})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, color: G.green, flexShrink: 0 }}>LF</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: G.gold, letterSpacing: 1 }}>LF Advocacia</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase" }}>Dra. Lorraynne Francisca · OAB/MG 193.597</div>
        </div>
      </div>

      <div style={{ display: "flex", background: G.card, borderBottom: `1.5px solid ${G.border}`, boxShadow: "0 1px 4px #0001" }}>
        {[["kanban","🗂️ Kanban"],["agenda","📅 Agenda"],["prazos","⏳ Prazos"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "14px 0", border: "none", background: "transparent", cursor: "pointer", color: tab === k ? G.green : G.sub, fontWeight: tab === k ? 700 : 500, borderBottom: tab === k ? `2.5px solid ${G.green}` : "2.5px solid transparent", fontSize: 12, fontFamily: "Georgia,serif", letterSpacing: 0.5 }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: 18, maxWidth: 900, margin: "0 auto" }}>

        {tab === "kanban" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 15, color: G.text, fontWeight: 700 }}>Tarefas</h2>
              <button onClick={() => setShowTaskForm(!showTaskForm)} style={btnP}>+ Nova Tarefa</button>
            </div>
            {showTaskForm && (
              <div style={{ background: G.card, border: `1.5px solid ${G.border}`, borderRadius: 14, padding: 18, marginBottom: 18, boxShadow: "0 2px 12px #0001" }}>
                <div style={{ color: G.green, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>NOVA TAREFA</div>
                <input placeholder="Título..." value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} style={inp} />
                <div style={{ display: "flex", gap: 8 }}>
                  <select value={taskForm.cat} onChange={e => setTaskForm(f => ({ ...f, cat: e.target.value }))} style={{ ...inp, flex: 1 }}>{Object.keys(CATS).map(c => <option key={c}>{c}</option>)}</select>
                  <select value={taskForm.status} onChange={e => setTaskForm(f => ({ ...f, status: e.target.value }))} style={{ ...inp, flex: 1 }}>{KANBAN_COLS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <select value={taskForm.priority} onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))} style={{ ...inp, flex: 1 }}>
                    <option value="alta">🔴 Alta</option><option value="media">🟡 Média</option><option value="baixa">🟢 Baixa</option>
                  </select>
                  <input type="date" value={taskForm.date} onChange={e => setTaskForm(f => ({ ...f, date: e.target.value }))} style={{ ...inp, flex: 1 }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={addTask} style={btnP}>Adicionar</button>
                  <button onClick={() => setShowTaskForm(false)} style={btnS}>Cancelar</button>
                </div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {KANBAN_COLS.map(col => {
                const colTasks = tasks.filter(t => t.status === col.id);
                return (
                  <div key={col.id} onDragOver={e => e.preventDefault()} onDrop={() => { if (drag) { moveTask(drag, col.id); setDrag(null); } }}
                    style={{ background: G.card, borderRadius: 14, border: `1.5px solid ${G.border}`, overflow: "hidden", minHeight: 180, boxShadow: "0 2px 10px #0001" }}>
                    <div style={{ background: col.color + "15", borderBottom: `2px solid ${col.color}`, padding: "11px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: 12, color: col.color }}>{col.icon} {col.label}</span>
                      <span style={{ background: col.color, color: "#fff", borderRadius: 20, padding: "1px 9px", fontSize: 11, fontWeight: 700 }}>{colTasks.length}</span>
                    </div>
                    <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                      {colTasks.map(task => {
                        const c = CATS[task.cat] || CATS["Outros"];
                        const pColor = task.priority === "alta" ? G.red : task.priority === "media" ? G.yellow : "#1e8449";
                        return (
                          <div key={task.id} draggable onDragStart={() => setDrag(task.id)}
                            style={{ background: G.bg, borderRadius: 10, padding: "10px 12px", borderLeft: `3px solid ${c.color}`, cursor: "grab", position: "relative", boxShadow: "0 1px 4px #0001" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: G.text, marginBottom: 6, paddingRight: 18 }}>{task.title}</div>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 10, background: c.color + "18", color: c.color, borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>{c.icon} {task.cat}</span>
                              <span style={{ fontSize: 10, background: pColor + "18", color: pColor, borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>{task.priority === "alta" ? "🔴 Alta" : task.priority === "media" ? "🟡 Média" : "🟢 Baixa"}</span>
                              {task.date && <span style={{ fontSize: 10, color: G.sub }}>📅 {new Date(task.date + "T00:00:00").toLocaleDateString("pt-BR")}</span>}
                            </div>
                            {col.id !== "done" && (
                              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                                {KANBAN_COLS.filter(nc => nc.id !== col.id).map(nc => (
                                  <button key={nc.id} onClick={() => moveTask(task.id, nc.id)} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 20, border: `1px solid ${nc.color}40`, background: nc.color + "12", color: nc.color, cursor: "pointer", fontFamily: "Georgia,serif" }}>→ {nc.label}</button>
                                ))}
                              </div>
                            )}
                            <button onClick={() => delTask(task.id)} style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", color: G.gray, cursor: "pointer", fontSize: 13 }}>✕</button>
                          </div>
                        );
                      })}
                      {colTasks.length === 0 && <div style={{ textAlign: "center", color: G.gray, fontSize: 12, padding: "20px 0" }}>Vazio</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "agenda" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 15, color: G.text, fontWeight: 700 }}>Agenda</h2>
              <button onClick={() => setShowEventForm(!showEventForm)} style={btnP}>+ Novo Compromisso</button>
            </div>
            {showEventForm && (
              <div style={{ background: G.card, border: `1.5px solid ${G.border}`, borderRadius: 14, padding: 18, marginBottom: 18, boxShadow: "0 2px 12px #0001" }}>
                <div style={{ color: G.green, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>NOVO COMPROMISSO</div>
                <input placeholder="Título..." value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} style={inp} />
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="date" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} style={{ ...inp, flex: 1 }} />
                  <input type="time" value={eventForm.time} onChange={e => setEventForm(f => ({ ...f, time: e.target.value }))} style={{ ...inp, flex: 1 }} />
                </div>
                <select value={eventForm.cat} onChange={e => setEventForm(f => ({ ...f, cat: e.target.value }))} style={inp}>{Object.keys(CATS).map(c => <option key={c}>{c}</option>)}</select>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={addEvent} style={btnP}>Adicionar</button>
                  <button onClick={() => setShowEventForm(false)} style={btnS}>Cancelar</button>
                </div>
              </div>
            )}
            <div style={{ background: G.card, borderRadius: 14, border: `1.5px solid ${G.border}`, overflow: "hidden", boxShadow: "0 2px 10px #0001", marginBottom: 18 }}>
              <div style={{ background: G.green, padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button onClick={() => setCalDate(new Date(yr, mo - 1, 1))} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>‹</button>
                <span style={{ color: G.gold, fontWeight: 700, fontSize: 15 }}>{MONTHS[mo]} {yr}</span>
                <button onClick={() => setCalDate(new Date(yr, mo + 1, 1))} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>›</button>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 4 }}>
                  {WD.map(w => <div key={w} style={{ textAlign: "center", fontSize: 10, color: G.sub, fontWeight: 700, padding: "4px 0" }}>{w}</div>)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
                  {Array(firstDay).fill(null).map((_, i) => <div key={"e" + i} />)}
                  {Array(dim).fill(null).map((_, i) => {
                    const day = i + 1;
                    const dayEvs = evByDay[day] || [];
                    const isToday = today.getDate() === day && today.getMonth() === mo && today.getFullYear() === yr;
                    const isSel = selDay === day;
                    return (
                      <div key={day} onClick={() => setSelDay(isSel ? null : day)} style={{ minHeight: 52, borderRadius: 8, background: isSel ? G.green : isToday ? G.greenL : "#fafaf8", border: `1.5px solid ${isSel ? G.green : isToday ? G.green + "55" : G.border}`, cursor: "pointer", padding: "4px 3px", overflow: "hidden" }}>
                        <div style={{ fontSize: 12, fontWeight: isToday || isSel ? 700 : 400, color: isSel ? "#fff" : isToday ? G.green : G.text, textAlign: "center", marginBottom: 2 }}>{day}</div>
                        {dayEvs.slice(0, 2).map((ev, i) => { const c = CATS[ev.cat] || CATS["Outros"]; return <div key={i} style={{ fontSize: 9, background: c.color, color: "#fff", borderRadius: 3, padding: "1px 4px", marginBottom: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{ev.title}</div>; })}
                        {dayEvs.length > 2 && <div style={{ fontSize: 9, color: G.gold, textAlign: "center" }}>+{dayEvs.length - 2}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {selDay && (
              <div style={{ background: G.card, border: `1.5px solid ${G.border}`, borderRadius: 14, padding: 16, marginBottom: 18 }}>
                <div style={{ color: G.green, fontWeight: 700, marginBottom: 12, fontSize: 13 }}>📅 {selDay} de {MONTHS[mo]}</div>
                {(evByDay[selDay] || []).length === 0 && <div style={{ color: G.gray, fontSize: 13 }}>Nenhum compromisso.</div>}
                {(evByDay[selDay] || []).map(ev => { const c = CATS[ev.cat] || CATS["Outros"]; return (
                  <div key={ev.id} style={{ background: G.bg, borderLeft: `4px solid ${c.color}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><div style={{ fontWeight: 700, color: G.text }}>{c.icon} {ev.title}</div><div style={{ fontSize: 12, color: G.sub, marginTop: 2 }}>{ev.time && `🕐 ${ev.time}`} · <span style={{ color: c.color }}>{ev.cat}</span></div></div>
                    <button onClick={() => delEvent(ev.id)} style={{ background: "none", border: "none", color: G.gray, cursor: "pointer", fontSize: 15 }}>✕</button>
                  </div>
                ); })}
              </div>
            )}
            <div style={{ background: G.card, border: `1.5px solid ${G.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ color: G.green, fontWeight: 700, marginBottom: 12, fontSize: 13 }}>🔜 PRÓXIMOS COMPROMISSOS</div>
              {[...events].sort((a, b) => new Date(a.date + "T" + (a.time || "00:00")) - new Date(b.date + "T" + (b.time || "00:00"))).filter(ev => new Date(ev.date + "T23:59") >= today).slice(0, 7).map(ev => {
                const c = CATS[ev.cat] || CATS["Outros"];
                const d = new Date(ev.date + "T00:00:00");
                const diff = Math.round((d - new Date(today.toDateString())) / 86400000);
                const badge = diff === 0 ? { txt: "Hoje", bg: G.red } : diff === 1 ? { txt: "Amanhã", bg: G.yellow } : { txt: `${diff}d`, bg: G.sub };
                return (
                  <div key={ev.id} style={{ background: G.bg, borderLeft: `4px solid ${c.color}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><div style={{ fontWeight: 700, color: G.text, fontSize: 13 }}>{c.icon} {ev.title}</div><div style={{ fontSize: 11, color: G.sub, marginTop: 2 }}>{d.toLocaleDateString("pt-BR")}{ev.time ? ` · ${ev.time}` : ""}</div></div>
                    <span style={{ background: badge.bg, color: "#fff", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{badge.txt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "prazos" && (
          <div>
            <h2 style={{ margin: "0 0 14px", fontSize: 15, color: G.text, fontWeight: 700 }}>Prazos & Vencimentos</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
              {[
                ["🔴","Atrasadas", tasks.filter(t => t.date && Math.round((new Date(t.date)-new Date(today.toDateString()))/86400000)<0 && t.status!=="done").length, G.red],
                ["🟡","Esta semana", tasks.filter(t=>{const d=t.date&&Math.round((new Date(t.date)-new Date(today.toDateString()))/86400000);return d>=0&&d<=7&&t.status!=="done";}).length, G.yellow],
                ["🟢","Em dia", tasks.filter(t=>t.date&&Math.round((new Date(t.date)-new Date(today.toDateString()))/86400000)>7&&t.status!=="done").length,"#1e8449"],
                ["⬜","Sem prazo", tasks.filter(t=>!t.date&&t.status!=="done").length, G.sub],
              ].map(([ico,lbl,cnt,col])=>(
                <div key={lbl} style={{ background: G.card, border:`1.5px solid ${col}33`, borderTop:`3px solid ${col}`, borderRadius:12, padding:"14px 10px", textAlign:"center", boxShadow:"0 2px 8px #0001" }}>
                  <div style={{fontSize:18}}>{ico}</div>
                  <div style={{fontSize:26,fontWeight:900,color:col}}>{cnt}</div>
                  <div style={{fontSize:10,color:G.sub,marginTop:2}}>{lbl}</div>
                </div>
              ))}
            </div>
            <div style={{ background: G.card, border:`1.5px solid ${G.border}`, borderRadius:14, padding:16, boxShadow:"0 2px 10px #0001" }}>
              <div style={{color:G.green,fontWeight:700,fontSize:12,marginBottom:12}}>TAREFAS COM PRAZO PENDENTE</div>
              {tasks.filter(t=>t.date&&t.status!=="done").sort((a,b)=>new Date(a.date)-new Date(b.date)).map(task=>{
                const diff=Math.round((new Date(task.date+"T00:00:00")-new Date(today.toDateString()))/86400000);
                const bc=diff<0?G.red:diff<=3?G.yellow:"#1e8449";
                const badge=diff<0?`Atrasada ${Math.abs(diff)}d`:diff===0?"Hoje!":`${diff}d restantes`;
                const c=CATS[task.cat]||CATS["Outros"];
                return (
                  <div key={task.id} style={{background:G.bg,borderLeft:`4px solid ${bc}`,borderRadius:8,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                    <div><div style={{fontWeight:700,color:G.text}}>{c.icon} {task.title}</div><div style={{fontSize:11,color:G.sub,marginTop:2}}>{task.cat} · {new Date(task.date+"T00:00:00").toLocaleDateString("pt-BR")}</div></div>
                    <span style={{background:bc,color:"#fff",borderRadius:20,padding:"3px 12px",fontSize:11,fontWeight:700}}>{badge}</span>
                  </div>
                );
              })}
              {tasks.filter(t=>t.date&&t.status!=="done").length===0 && <div style={{color:G.gray,textAlign:"center",padding:24,fontSize:13}}>Nenhuma tarefa com prazo pendente.</div>}
            </div>
          </div>
        )}
      </div>
      <div style={{textAlign:"center",padding:"14px 0 22px",color:G.sub,fontSize:10,letterSpacing:2,borderTop:`1px solid ${G.border}`,marginTop:10}}>
        LF ADVOCACIA · DRA. LORRAYNNE FRANCISCA · OAB/MG 193.597
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
