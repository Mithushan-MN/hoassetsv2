import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


const API = process.env.REACT_APP_API_URL || "";

/* ══════════════════════════════════════════════════════ ICONS */
const IPlus  = ({ s=16 }) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IEdit  = ({ s=13 }) => <svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>;
const ITrash = ({ s=13 }) => <svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2h4v2M3 4l1 8h6l1-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ICheck = ({ s=13 }) => <svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IX     = ({ s=13 }) => <svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IImg   = ({ s=32 }) => <svg width={s} height={s} viewBox="0 0 32 32" fill="none"><rect x="3" y="3" width="26" height="26" rx="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="11" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 22l9-8 6 6 4-4 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
const ILink  = ({ s=14 }) => <svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M6 8l-2 2a2.1 2.1 0 002.9 2.9L9 11M8 6l2-2a2.1 2.1 0 00-2.9-2.9L5 3M5 9l4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
const IBack  = ({ s=15 }) => <svg width={s} height={s} viewBox="0 0 15 15" fill="none"><path d="M9.5 3L5 7.5 9.5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ICamera= ({ s=16 }) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M1 5.5A1.5 1.5 0 012.5 4h.8L4.5 2h7l1.2 2h.8A1.5 1.5 0 0115 5.5v7A1.5 1.5 0 0113.5 14h-11A1.5 1.5 0 011 12.5v-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="8" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.2"/></svg>;

/* ══════════════════════════════════════════════════════ CSS */
const CSS = `
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px;}
  .w-card:hover .card-act    { opacity:1!important; }
  .tile-wrap:hover .tile-act { opacity:1!important; }
  .sec-card:hover .sec-act   { opacity:1!important; }
  .asset-row:hover .asset-act{ opacity:1!important; }
  .ie-wrap:hover .ie-pen     { opacity:1!important; }
  .img-picker:hover .img-ov  { opacity:1!important; }
  .ghost:hover    { border-color:rgba(220,38,38,0.55)!important; color:#dc2626!important; background:rgba(220,38,38,0.04)!important; }
  .ghost-lt:hover { border-color:rgba(220,38,38,0.4)!important;  color:#dc2626!important; }
`;

/* ══════════════════════════════════════════════════════ API */
const tok  = () => localStorage.getItem("adminToken");
const aH   = () => ({ Authorization:`Bearer ${tok()}` });

const apiGet  = async (path) => { const r = await fetch(`${API}${path}`); return r.json(); };
const apiDel  = async (path) => { const r = await fetch(`${API}${path}`,{method:"DELETE",headers:aH()}); return r.json(); };
const apiFetch = async (method, path, body) => {
  const r = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${tok()}`
    },
    body
  });

  let j;
  try {
    j = await r.json();
  } catch {
    throw new Error("Invalid JSON response from server");
  }

  if (!r.ok) {
    throw new Error(j.message || "Request failed");
  }

  return j;
};
const mkFD = (obj) => {
  const f = new FormData();
  Object.entries(obj).forEach(([k,v])=>{ if(v!=null) f.append(k,v); });
  return f;
};
/* JSON fetch — used for collection create/edit (no file uploads) */
const apiJSON = async (method, path, obj) => {
  const r = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization:`Bearer ${tok()}`, 'Content-Type':'application/json' },
    body: JSON.stringify(obj)
  });
  let j;
  try { j = await r.json(); } catch { throw new Error("Invalid JSON response from server"); }
  if (!r.ok) { throw new Error(j.message || "Request failed"); }
  return j;
};

/* ══════════════════════════════════════════════════════ TINY UI */
const IBtn = ({ children, onClick, title, danger }) => {
  return (
    <button title={title} onClick={e=>{e.stopPropagation();onClick&&onClick(e);}}
      className={`inline-flex items-center justify-center w-[26px] h-[26px] rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-transparent p-0 shrink-0 transition-all duration-[120ms] cursor-pointer ${
        danger
          ? 'text-[#6b7280] hover:bg-[rgba(239,68,68,0.12)] hover:text-[#ef4444]'
          : 'text-[#6b7280] hover:bg-[rgba(255,255,255,0.07)] hover:text-[#e5e7eb]'
      }`}>
      {children}
    </button>
  );
};

const DeletePopup = ({ open, onCancel, onConfirm }) => {
  const [text, setText] = useState("");

  if (!open) return null;

  const valid = text === "DELETE";
  

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-[9999]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[340px] bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-[12px] p-[18px]"
      >
        <div className="text-[14px] font-bold mb-[10px]">
          Confirm Delete
        </div>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Type "DELETE"'
          autoFocus
          className="w-full p-[8px] rounded-[6px] border border-[#333] bg-black text-white mb-[12px] outline-none"
        />

        <div className="flex justify-end gap-[10px]">
          <button
            onClick={onCancel}
            className="px-[12px] py-[6px] rounded-[6px] border border-[#333] bg-transparent text-white cursor-pointer"
          >
            Cancel
          </button>

          <button
            disabled={!valid}
            onClick={() => {
              if (!valid) return;
              onConfirm();
              setText("");
            }}
            className={`px-[12px] py-[6px] rounded-[6px] border-none text-white font-semibold ${
              valid
                ? 'bg-[#dc2626] cursor-pointer opacity-100'
                : 'bg-[#3a1a1a] cursor-not-allowed opacity-60'
            }`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Del = ({ onConfirm }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IBtn
        danger
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <ITrash s={12} />
      </IBtn>

      <DeletePopup
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => {
          onConfirm();
          setOpen(false);
        }}
      />
    </>
  );
};

const InlineEdit = ({ value, onSave, style={} }) => {
  const [editing,setEditing] = useState(false);
  const [draft,setDraft]     = useState(value);
  const ref = useRef();
  useEffect(()=>{if(editing)ref.current?.focus();},[editing]);
  const commit = ()=>{ const v=draft.trim(); if(v&&v!==value)onSave(v); else setDraft(value); setEditing(false); };
  const cancel = ()=>{ setDraft(value); setEditing(false); };
  if (editing) return (
    <span className="flex items-center gap-[4px] flex-1" onClick={e=>e.stopPropagation()}>
      <input ref={ref} value={draft} onChange={e=>setDraft(e.target.value)}
        onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")cancel();}}
        className="flex-1 bg-[rgba(255,255,255,0.06)] border border-[rgba(220,38,38,0.55)] rounded-[4px] px-[8px] py-[3px] text-[#f3f4f6] outline-none"
        style={{fontSize:"inherit",fontWeight:"inherit"}}/>
      <IBtn onClick={commit}><ICheck/></IBtn>
      <IBtn onClick={cancel}><IX/></IBtn>
    </span>
  );
  return (
    <span className="ie-wrap flex items-center gap-[5px] flex-1 min-w-0">
      <span className="overflow-hidden text-ellipsis whitespace-nowrap" style={style}>{value}</span>
      <button className="ie-pen inline-flex items-center justify-center w-[22px] h-[22px] rounded-[4px] border border-[rgba(255,255,255,0.08)] bg-transparent text-[#6b7280] p-0 opacity-0 transition-opacity duration-[120ms] cursor-pointer" onClick={e=>{e.stopPropagation();setDraft(value);setEditing(true);}}>
        <IEdit s={12}/>
      </button>
    </span>
  );
};

/* ══════════════════════════════════════════════════════
   ImgPicker — live preview + hover overlay
══════════════════════════════════════════════════════ */
const ImgPicker = ({ label, current, onPick, size=110, aspect="square" }) => {
  const ref = useRef();
  const [preview,setPreview] = useState(null);
  const h   = aspect==="rect" ? Math.round(size*0.75) : size;
  const src = preview || current || null;
  return (
    <div className="mb-[16px]">
      {label && (
        <div className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.07em] mb-[6px]">{label}</div>
      )}
      <div className="img-picker rounded-[8px] overflow-hidden cursor-pointer border-2 border-dashed border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.02)] relative flex items-center justify-center" onClick={()=>ref.current.click()}
        style={{width:size,height:h}}>
        {src
          ? <img src={src} alt="" className="w-full h-full object-contain p-[4px]"/>
          : <div className="flex flex-col items-center gap-[4px] text-[#4b5563]">
              <IImg s={26}/><span className="text-[10px]">click to upload</span>
            </div>
        }
        <div className="img-ov absolute inset-0 opacity-0 bg-[rgba(0,0,0,0.55)] flex flex-col items-center justify-center gap-[4px] text-white transition-opacity duration-150">
          <ICamera s={18}/><span className="text-[10px] font-semibold">{src?"Change":"Upload"}</span>
        </div>
      </div>
      {preview && (
        <div className="mt-[5px] text-[10px] text-[#22c55e] font-mono bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] rounded-[4px] px-[7px] py-[2px] inline-block">✓ new image selected</div>
      )}
      <input ref={ref} type="file" accept="image/*"
        onChange={e=>{const f=e.target.files[0];if(!f)return;setPreview(URL.createObjectURL(f));onPick(f);}}
        className="hidden"/>
    </div>
  );
};

/* ══════════════════════════════════════════════════════ MODAL SHELL */
const Modal = ({ title, onClose, children }) => (
  <div onClick={onClose} className="fixed inset-0 bg-[rgba(0,0,0,0.75)] flex items-center justify-center z-[1000] backdrop-blur-[5px]">
    <div onClick={e=>e.stopPropagation()}
      className="bg-[#18181b] border border-[rgba(255,255,255,0.1)] rounded-[14px] p-[28px] w-[460px] max-w-[95vw] max-h-[90vh] overflow-y-auto shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
      <div className="flex justify-between items-center mb-[22px]">
        <span className="text-[15px] font-bold text-[#f9fafb]">{title}</span>
        <IBtn onClick={onClose}><IX/></IBtn>
      </div>
      {children}
    </div>
  </div>
);

const MF = ({ label, value, onChange, placeholder, type="text" }) => (
  <div className="mb-[14px]">
    <label className="block text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.07em] mb-[5px]">{label}</label>
    {type==="textarea"
      ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3}
          className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[7px] px-[11px] py-[8px] text-[#f3f4f6] text-[13px] outline-none resize-y"/>
      : <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[7px] px-[11px] py-[8px] text-[#f3f4f6] text-[13px] outline-none"/>
    }
  </div>
);

const SaveBtn = ({ label, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    className={`w-full p-[10px] border-none rounded-[7px] text-white text-[13px] font-semibold mt-[6px] ${
      disabled ? 'bg-[#374151] cursor-not-allowed' : 'bg-[#dc2626] cursor-pointer'
    }`}>
    {label}
  </button>
);

/* 1. WRAPPER — name + logo */
const WrapperModal = ({ initial={}, onClose, onSaved }) => {
  const [name,setName] = useState(initial.name||"");
  const [desc,setDesc] = useState(initial.description||"");
  const [logo,setLogo] = useState(null);
  const isEdit = !!initial._id;
  const save = async () => {
    if (!name.trim()) return;
    try {
      const r = isEdit
        ? await apiFetch("PUT",  `/wrappers/${initial._id}`, mkFD({name:name.trim(),description:desc,logo}))
        : await apiFetch("POST", `/wrappers`,                mkFD({name:name.trim(),description:desc,logo}));
      onSaved(r); onClose();
    } catch(e){ alert(e.message); }
  };
  return (
    <Modal title={isEdit?"Edit brand":"New brand"} onClose={onClose}>
      {/* IMAGE UPLOAD */}
      <ImgPicker label="Brand logo" current={initial.logo} onPick={setLogo} size={120} aspect="rect"/>
      {/* NAME */}
      <MF label="Brand name" value={name} onChange={setName} placeholder="e.g. HIKMICRO"/>
      {/* DESCRIPTION */}
      <MF label="Description (optional)" value={desc} onChange={setDesc} placeholder="Short description" type="textarea"/>
      <SaveBtn label={isEdit?"Save changes":"Create brand"} onClick={save} disabled={!name.trim()}/>
    </Modal>
  );
};

/* 2. COLLECTION — name ONLY */
const CollectionModal = ({ initial={}, wId, onClose, onSaved }) => {
  const [name,setName] = useState(initial.name||"");
  const isEdit = !!initial._id;
  const save = async () => {
    if (!name.trim()) return;
    try {
      const r = isEdit
        ? await apiJSON("PUT",  `/collections/${initial._id}`, {name:name.trim()})
        : await apiJSON("POST", `/collections`, {wrapper: wId, name: name.trim()});
      onSaved(r); onClose();
    } catch(e){ alert(e.message); }
  };
  return (
    <Modal title={isEdit?"Edit collection":"New collection"} onClose={onClose}>
      {/* NAME ONLY — no image */}
      <MF label="Collection name" value={name} onChange={setName} placeholder="e.g. TRIFOLD & BIFOLD"/>
      <SaveBtn label={isEdit?"Save changes":"Add collection"} onClick={save} disabled={!name.trim()}/>
    </Modal>
  );
};

/* 3. TILE — name + image| name + image+ url  */ 

const TileModal = ({ initial = {}, wId, cId, onClose, onSaved }) => {
  const [name,  setName]  = useState("");
  const [image, setImage] = useState(null);
  const [mode,  setMode]  = useState("asset"); // "asset" | "url"
  const [url,   setUrl]   = useState("");

  const isEdit = !!initial._id;

  // Sync state whenever `initial` changes (open modal for different tile)
  useEffect(() => {
    setName(initial.name  || "");
    setUrl(initial.link   || "");
    setMode(initial.type === "link" ? "url" : "asset");
    setImage(null);
 }, [initial._id, initial.name, initial.link, initial.type]); // ← key fix: depend on _id, not the whole object

  const canSave = name.trim() && (mode !== "url" || url.trim());

  const save = async () => {
    if (!canSave) return;
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("type", mode === "url" ? "link" : "folder");
      fd.append("link", mode === "url" ? url.trim() : ""); // always send, even ""
      if (image) fd.append("image", image);

      const base = `/wrappers/${wId}/collections/${cId}/tiles`;
      const r = isEdit
        ? await apiFetch("PUT",  `${base}/${initial._id}`, fd)
        : await apiFetch("POST", base,                     fd);

      onSaved(r);
      onClose();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Modal title={isEdit ? "Edit Tile" : "Create Tile"} onClose={onClose}>

      <ImgPicker
        label="Tile Image"
        current={initial.image}
        onPick={setImage}
        size={140}
      />

      <MF
        label="Tile Name"
        value={name}
        onChange={setName}
        placeholder="e.g. LYNX 3.0"
      />

      {/* TYPE SELECTOR */}
      <div className="mb-[16px]">
        <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-[0.08em] mb-[8px]">
          Tile Type
        </div>
        <div className="flex gap-[10px]">
          <button
            type="button"
            onClick={() => setMode("asset")}
            className={`px-[14px] py-[8px] rounded-[8px] text-[12px] font-semibold text-white border transition-all duration-150 ${
              mode === "asset"
                ? "border-[#dc2626] bg-[rgba(220,38,38,0.15)]"
                : "border-[rgba(255,255,255,0.1)] bg-transparent"
            }`}
          >
            📁 Asset Section
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-[14px] py-[8px] rounded-[8px] text-[12px] font-semibold text-white border transition-all duration-150 ${
              mode === "url"
                ? "border-[#dc2626] bg-[rgba(220,38,38,0.15)]"
                : "border-[rgba(255,255,255,0.1)] bg-transparent"
            }`}
          >
            🔗 External Link
          </button>
        </div>
      </div>

      {mode === "url" && (
        <MF
          label="External URL"
          value={url}
          onChange={setUrl}
          placeholder="https://huntsmanoptics.com"
        />
      )}

      {mode === "asset" && (
        <div className="text-[12px] text-[#9ca3af] bg-[rgba(255,255,255,0.04)] p-[10px] rounded-[8px] mb-[16px] border border-[rgba(255,255,255,0.06)]">
          This tile will open the Asset Section instead of a link.
        </div>
      )}

      <SaveBtn
        label={isEdit ? "Save Changes" : "Create Tile"}
        onClick={save}
        disabled={!canSave}
      />
    </Modal>
  );
};


/* 4. ASSET — title + URL + image upload */
const AssetModal = ({ initial={}, wId, cId, tId, onClose, onSaved }) => {
  const [title,setTitle] = useState(initial.title||"");
  const [url,setUrl]     = useState(initial.url||"");
  const [icon,setIcon]   = useState(null);
  const isEdit = !!initial._id;
  const save = async () => {
    if (!title.trim()||!url.trim()) return;
    try {
      const base = `/wrappers/${wId}/collections/${cId}/tiles/${tId}/assets`;
      const r = isEdit
        ? await apiFetch("PUT",  `${base}/${initial._id}`, mkFD({title:title.trim(),url:url.trim(),icon}))
        : await apiFetch("POST", base,                     mkFD({title:title.trim(),url:url.trim(),icon}));
      onSaved(r); onClose();
    } catch(e){ alert(e.message); }
  };
  return (
    <Modal title={isEdit?"Edit asset":"Add asset"} onClose={onClose}>
      {/* IMAGE UPLOAD */}
      <ImgPicker label="Asset image / icon" current={initial.icon} onPick={setIcon} size={140}/>
      {/* TITLE */}
      <MF label="Title" value={title} onChange={setTitle} placeholder="e.g. PRODUCT PICS"/>
      {/* URL */}
      <MF label="Link / URL" value={url} onChange={setUrl} placeholder="https://drive.google.com/…"/>
      <SaveBtn label={isEdit?"Save changes":"Add asset"} onClick={save}
        disabled={!title.trim()||!url.trim()}/>
    </Modal>
  );
};

/* ══════════════════════════════════════════════════════ SHARED BUTTONS */
const BackBtn = ({ onClick }) => (
  <button onClick={onClick}
    className="inline-flex items-center gap-[5px] px-[12px] py-[6px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[7px] text-[#9ca3af] text-[12px] font-semibold cursor-pointer">
    <IBack s={13}/> Back
  </button>
);

const RedBtn = ({ label, onClick }) => (
  <button onClick={onClick}
    className="inline-flex items-center gap-[6px] px-[14px] py-[7px] bg-[#dc2626] text-white border-none rounded-[7px] text-[12px] font-semibold cursor-pointer">
    <IPlus s={12}/> {label}
  </button>
);

/* ══════════════════════════════════════════════════════ CARDS */
const WrapperCard = ({ wrapper, onClick, onEdit, onDelete }) => (
  <div className="w-card relative cursor-pointer rounded-[16px] overflow-hidden border-2 border-[rgba(255,255,255,0.07)] bg-[#111114] transition-[border-color] duration-[180ms]" onClick={onClick}>
    <div className="bg-white aspect-[4/3] flex items-center justify-center p-[14px]">
      {wrapper.logo
        ? <img src={wrapper.logo} alt={wrapper.name} className="w-full h-full object-contain"
            onError={e=>e.currentTarget.style.display="none"}/>
        : <div className="text-[#d1d5db] flex flex-col items-center gap-[4px]">
            <IImg s={36}/><span className="text-[10px] text-[#9ca3af]">no logo</span>
          </div>}
    </div>
    <div className="px-[12px] py-[10px]">
      <span className="text-[12px] font-bold text-[#f3f4f6] tracking-[0.06em] uppercase">
        {wrapper.name}
      </span>
    </div>
    <div className="card-act absolute top-[8px] right-[8px] flex gap-[4px] opacity-0 transition-opacity duration-150" onClick={e=>e.stopPropagation()}>
      <IBtn onClick={onEdit} title="Edit"><IEdit s={12}/></IBtn>
      <Del onConfirm={onDelete}/>
    </div>
  </div>
);

const GhostCard = ({ label, onClick }) => (
  <div className="ghost aspect-[4/3] border-2 border-dashed border-[rgba(255,255,255,0.12)] rounded-[16px] cursor-pointer flex flex-col items-center justify-center gap-[8px] text-[#4b5563] bg-[rgba(255,255,255,0.01)] transition-all duration-150" onClick={onClick}>
    <IPlus s={22}/><span className="text-[11px] font-semibold uppercase tracking-[0.05em]">{label}</span>
  </div>
);

const TileCard = ({ tile, onClick, onEdit, onDelete, active }) => (
  <div className="tile-wrap relative shrink-0">
    <div onClick={onClick}
      className={`w-[155px] cursor-pointer rounded-[12px] bg-white overflow-hidden transition-[border-color] duration-150 ${
        active
          ? 'border-2 border-[rgba(220,38,38,0.6)] shadow-[0_0_0_3px_rgba(220,38,38,0.12)]'
          : 'border-2 border-[rgba(255,255,255,0.1)] shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
      }`}>
      <div className="h-[110px] bg-[#f3f4f6] flex items-center justify-center p-[10px]">
        {tile.image
          ? <img src={tile.image} alt={tile.name} className="w-full h-full object-contain"/>
          : <div className="text-[#9ca3af]"><IImg s={36}/></div>}
      </div>
      <div className="px-[10px] py-[8px] border-t border-[rgba(0,0,0,0.07)] text-center">
        <span className="text-[11px] font-bold text-[#1f2937] uppercase tracking-[0.05em] block leading-[1.3]">{tile.name}</span>
      </div>
    </div>
    <div className="tile-act absolute top-[6px] right-[6px] flex gap-[3px] opacity-0 transition-opacity duration-150" onClick={e=>e.stopPropagation()}>
      <IBtn onClick={onEdit}><IEdit s={11}/></IBtn>
      <Del onConfirm={onDelete}/>
    </div>
  </div>
);

const AddTileGhost = ({ onClick }) => (
  <div className="ghost w-[155px] h-[148px] shrink-0 cursor-pointer border-2 border-dashed border-[rgba(255,255,255,0.15)] rounded-[12px] flex flex-col items-center justify-center gap-[6px] text-[#4b5563] bg-[rgba(255,255,255,0.01)] transition-all duration-150" onClick={onClick}>
    <IPlus s={20}/><span className="text-[10px] font-semibold uppercase tracking-[0.05em]">Add tile</span>
  </div>
);

/* Asset card — image, name, url on white card */
const AssetCard = ({ asset, onEdit, onDelete }) => (
  <div className="sec-card relative cursor-pointer">
    <a href={asset.url} target="_blank" rel="noreferrer" className="no-underline">
      <div className="w-[190px] rounded-[14px] bg-white overflow-hidden border-2 border-[rgba(0,0,0,0.1)] shadow-[0_2px_12px_rgba(0,0,0,0.12)]">
        <div className="h-[120px] bg-[#fafafa] flex items-center justify-center p-[14px]">
          {asset.icon
            ? <img src={asset.icon} alt={asset.title} className="w-full h-full object-contain"/>
            : <div className="text-[#9ca3af]"><ILink s={32}/></div>}
        </div>
        <div className="p-[12px] border-t border-[rgba(0,0,0,0.07)] text-center">
          <span className="text-[12px] font-bold text-[#1f2937] uppercase tracking-[0.06em] leading-[1.3]">{asset.title}</span>
        </div>
      </div>
    </a>
    <div className="sec-act absolute top-[6px] right-[6px] flex gap-[3px] opacity-0 transition-opacity duration-150" onClick={e=>e.stopPropagation()}>
      <IBtn onClick={onEdit}><IEdit s={11}/></IBtn>
      <Del onConfirm={onDelete}/>
    </div>
  </div>
);

const AddSAssetGhost = ({ onClick }) => (
  <div className="ghost-lt w-[190px] h-[170px] cursor-pointer border-2 border-dashed border-[rgba(0,0,0,0.14)] rounded-[14px] bg-[#fafafa] flex flex-col items-center justify-center gap-[8px] text-[#9ca3af] transition-all duration-150" onClick={onClick}>
    <IPlus s={22}/><span className="text-[11px] font-semibold uppercase tracking-[0.05em]">Add Asset</span>
  </div>
);

/* ══════════════════════════════════════════════════════ MAIN */
export default function AdminDashboard() {
  const [wrappers,setWrappers] = useState([]);
  const [loading,setLoading]   = useState(true);

  /* ALL navigation uses _id strings */
  const [wId,  setWId]  = useState(null);
  const [cId,  setCId]  = useState(null);
  const [tId,  setTId]  = useState(null);

  /* modal carries its own ID snapshot — avoids React state lag */
  const [modal, setModal] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!tok()) navigate("/admin");
    load();
  }, [navigate]);

  const load = async () => {
    setLoading(true);
    const data = await apiGet("/wrappers");
    setWrappers(Array.isArray(data)?data:[]);
    setLoading(false);
  };

const onSaved = (updated) => {
  console.log("API RESPONSE:", updated);

  if (!updated || !updated._id) {
    console.error("Invalid backend response:", updated);
    load();
    return;
  }

  setWrappers(ws =>
    ws.some(w => w._id === updated._id)
      ? ws.map(w => w._id === updated._id ? updated : w)
      : [...ws, updated]
  );
};

  /* derived — all by _id */
  const curW = wrappers.find(w=>w._id===wId);
  const curC = curW?.tiles?.find(c=>c._id===cId);
  const curT = curC?.tiles?.find(t=>t._id===tId);
  
  /* nav */
  const goHome = ()=>{ setWId(null); setCId(null); setTId(null); };
  const goW    = id=>{ setWId(id); setCId(null); setTId(null); };
  const goC    = id=>{ setCId(id); setTId(null); };
  const goT    = id=>{ setTId(id); };

  /* deletes */
  const delW = async id=>{ await apiDel(`/wrappers/${id}`); if(wId===id)goHome(); load(); };
  const delC = async id=>{ const r=await apiDel(`/wrappers/${wId}/collections/${id}`); if(cId===id)goW(wId); onSaved(r); };
  const delT = async id=>{ const r=await apiDel(`/wrappers/${wId}/collections/${cId}/tiles/${id}`); if(tId===id)goC(cId); onSaved(r); };
  const delA = async id=>{ const r=await apiDel(`/wrappers/${wId}/collections/${cId}/tiles/${tId}/assets/${id}`); onSaved(r); };

  const crumbs = [
    {label:"Brands",   onClick:goHome},
    curW&&{label:curW?.name, onClick:()=>goW(wId)},
    curC&&{label:curC.name, onClick:()=>goC(cId)},
    curT&&{label:curT.name, onClick:()=>goT(tId)},
  ].filter(Boolean);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-[#6b7280] font-[system-ui]">
      Loading…
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e5e7eb] font-['DM_Sans',system-ui,sans-serif] flex flex-col">
      <style>{CSS}</style>

      {/* TOPBAR */}
      <div className="flex items-center justify-between px-[28px] mt-[70px] h-[54px] border-b border-[rgba(255,255,255,0.06)] bg-[#0d0d0f] shrink-0">
        <div className="flex items-center gap-[8px]">
          <div className="w-[28px] h-[28px] bg-[#dc2626] rounded-[7px] flex items-center justify-center text-[13px] font-extrabold text-white">A</div>
          {crumbs.map((c,i)=>(
            <React.Fragment key={i}>
              {i>0&&<span className="text-[rgba(255,255,255,0.18)]">›</span>}
              <button onClick={c.onClick}
                className={`bg-none border-none p-0 font-[inherit] text-[13px] cursor-pointer ${
                  i===crumbs.length-1 ? 'font-semibold text-[#f3f4f6] !cursor-default' : 'font-normal text-[#6b7280]'
                }`}>
                {c.label}
              </button>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-[7px]">
          <div className="w-[6px] h-[6px] rounded-full bg-[#22c55e] shadow-[0_0_6px_#22c55e]"/>
          <span className="text-[11px] text-[#6b7280] font-mono">live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* L0 — BRANDS */}
        {!wId&&(
          <div className="px-[36px] py-[32px]">
            <div className="flex items-center justify-between mb-[28px]">
              <div>
                <h1 className="text-[20px] font-bold text-[#f9fafb]">Brands</h1>
                <p className="text-[11px] text-[#4b5563] font-mono mt-[3px]">
                  {wrappers.length} brands · click to manage
                </p>
              </div>
              <RedBtn label="New brand" onClick={()=>setModal({type:"wrapper"})}/>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[20px]">
              {wrappers.map(w=>(
                <WrapperCard key={w._id} wrapper={w}
                  onClick={()=>goW(w._id)}
                  onEdit={()=>setModal({type:"wrapper",initial:w})}
                  onDelete={()=>delW(w._id)}/>
              ))}
              <GhostCard label="New brand" onClick={()=>setModal({type:"wrapper"})}/>
            </div>
          </div>
        )}

        {/* L1 — COLLECTIONS */}
        {wId&&!cId&&(
          <div className="px-[36px] py-[28px]">
            <div className="flex items-center justify-between mb-[28px]">
              <div className="flex items-center gap-[12px]">
                <BackBtn onClick={goHome}/>
                <h2 className="text-[17px] font-bold text-[#f9fafb]">{curW?.name} </h2>
              </div>
              <RedBtn label="Add collection" onClick={()=>setModal({type:"collection",wId})}/>
            </div>
            <div className="flex flex-col gap-[16px]">
              {(curW?.tiles||[]).map(col=>(
                <div key={col._id}
                  className="bg-[#1a1510] border border-[rgba(255,255,255,0.08)] rounded-[16px] pb-[22px]">
                  <div className="px-[26px] pt-[18px] pb-[14px] border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
                    <InlineEdit value={col.name}
                      onSave={async name=>{const r=await apiJSON("PUT",`/wrappers/${wId}/collections/${col._id}`,{name});onSaved(r);}}
                      style={{fontSize:17,fontWeight:800,color:"#f9fafb",letterSpacing:"0.04em",textTransform:"uppercase"}}/>
                    <div className="flex gap-[6px] items-center">
                      <button onClick={()=>goC(col._id)}
                        className="bg-none border border-[rgba(255,255,255,0.1)] rounded-[6px] text-[#9ca3af] text-[11px] font-semibold px-[10px] py-[4px] cursor-pointer">
                        Manage tiles →
                      </button>
                      <Del onConfirm={()=>delC(col._id)}/>
                    </div>
                  </div>
                  <div className="px-[22px] pt-[18px] flex gap-[12px] flex-wrap">
                    {(col.tiles||[]).map(tile=>(
                      <TileCard key={tile._id} tile={tile} active={false}
                        onClick={()=>{
                          if (tile.type === "link" && tile.link) {
                            window.open(tile.link, "_blank", "noopener,noreferrer");
                          } else {
                            goC(col._id);
                            goT(tile._id);
                          }
                        }}
                        onEdit={()=>{setCId(col._id);setModal({type:"tile",initial:tile,wId,cId:col._id});}}
                        onDelete={()=>{setCId(col._id);delT(tile._id);}}/>
                    ))}
                    <AddTileGhost onClick={()=>{setCId(col._id);setModal({type:"tile",wId,cId:col._id});}}/>
                  </div>
                </div>
              ))}
              {(curW?.tiles||[]).length===0&&(
                <div className="text-center py-[60px] text-[#374151] text-[13px]">
                  No collections yet. Add one above.
                </div>
              )}
            </div>
          </div>
        )}

        {/* L2 — TILES */}
        {wId&&cId&&!tId&&(
          <div className="px-[36px] py-[28px]">
            <div className="flex items-center justify-between mb-[24px]">
              <div className="flex items-center gap-[12px]">
                <BackBtn onClick={()=>goW(wId)}/>
                <h2 className="text-[17px] font-bold text-[#f9fafb]">{curC?.name}</h2>
              </div>
              <RedBtn label="Add tile" onClick={()=>setModal({type:"tile",wId,cId})}/>
            </div>
            <div className="bg-[#1a1510] border border-[rgba(255,255,255,0.08)] rounded-[16px] px-[26px] py-[24px]">
              <div className="text-[16px] font-extrabold text-[#f9fafb] uppercase tracking-[0.04em] mb-[4px]">{curC?.name}</div>
              <div className="h-[1px] bg-[rgba(255,255,255,0.08)] mb-[20px]"/>
              <div className="flex gap-[14px] flex-wrap">
                {(curC?.tiles||[]).map(tile=>(
                  <TileCard key={tile._id} tile={tile} active={tId===tile._id}
                    onClick={()=>{
                      if (tile.type === "link" && tile.link) {
                        window.open(tile.link, "_blank", "noopener,noreferrer");
                      } else {
                        goT(tile._id);
                      }
                    }}
                    onEdit={()=>setModal({type:"tile",initial:tile,wId,cId})}
                    onDelete={()=>delT(tile._id)}/>
                ))}
                <AddTileGhost onClick={()=>setModal({type:"tile",wId,cId})}/>
              </div>
            </div>
          </div>
        )}

        {/* L3 — Assets */}
        {wId&&cId&&tId&&(
          <div className="px-[36px] py-[28px]">
            <div className="flex items-center justify-between mb-[24px]">
              <div className="flex items-center gap-[12px]">
                <BackBtn onClick={()=>goC(cId)}/>
                <h2 className="text-[17px] font-bold text-[#f9fafb]">{curT?.name}</h2>
              </div>
            </div>
            <div className="bg-[#f5f3f0] rounded-[16px] px-[32px] py-[28px] border border-[rgba(0,0,0,0.08)]">
              <div className="text-[19px] font-extrabold text-[#1f2937] uppercase tracking-[0.04em] text-center mb-[8px]">{curT?.name}</div>
              <div className="h-[1px] bg-[rgba(0,0,0,0.1)] mb-[24px]"/>
              <div className="flex flex-wrap gap-[16px]">
                {(curT?.assets||[]).map(asset=>(
                  <AssetCard key={asset._id} asset={asset}
                    onEdit={()=>setModal({type:"asset",initial:asset,wId,cId,tId})}
                    onDelete={()=>delA(asset._id)}/>
                ))}
                <AddSAssetGhost onClick={()=>setModal({type:"asset",wId,cId,tId})}/>
              </div>
            </div>
          </div>
        )} 
        
      </div>

      {/* ══ MODALS — each reads IDs from modal state, not React nav state ══ */}
      {modal?.type==="wrapper"    && <WrapperModal    initial={modal.initial||{}} onClose={()=>setModal(null)} onSaved={r=>{onSaved(r);if(!modal.initial?._id&&r._id)setWId(r._id);}}/>}
      {modal?.type==="collection" && <CollectionModal initial={modal.initial||{}} wId={modal.wId||wId}           onClose={()=>setModal(null)} onSaved={onSaved}/>}
      {modal?.type==="tile"       && <TileModal       initial={modal.initial||{}} wId={modal.wId||wId} cId={modal.cId||cId} onClose={()=>setModal(null)} onSaved={onSaved}/>}
      {modal?.type==="asset"      && <AssetModal      initial={modal.initial||{}} wId={modal.wId}      cId={modal.cId}      tId={modal.tId} onClose={()=>setModal(null)} onSaved={onSaved}/>}
    </div>
  );
}