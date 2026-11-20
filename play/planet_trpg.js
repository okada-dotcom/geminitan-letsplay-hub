(() => {
  "use strict";

  const EC = window.EternalCompanion;
  if (!EC) return;

  const elNameInput = document.getElementById("planet-name-input");
  const elYearBadge = document.getElementById("planet-year-badge");
  const btnNewPlanet = document.getElementById("btn-planet-new");
  const canvas = document.getElementById("planet-canvas");
  const ctx = canvas.getContext("2d");

  const elLandmarks = document.getElementById("planet-landmarks");
  const elPromptText = document.getElementById("planet-prompt-text");
  const elChoiceChips = document.getElementById("planet-choice-chips");
  const elStepSelect = document.getElementById("planet-step-select");
  const elForm = document.getElementById("planet-form");
  const elActionInput = document.getElementById("planet-action-input");
  const btnSubmit = document.getElementById("btn-planet-submit");
  const elTimeline = document.getElementById("planet-timeline");

  const STARTER_NAMES = ["ステラ・プリマ", "ルミナ・アーク", "エリュシオン・セカンド", "星屑のゆりかご", "双子星ノヴァ"];

  function createDefaultPlanetState(name = "ステラ・プリマ") {
    return {
      planet_name: name,
      year: 0,
      planet_stats: { ecology: 20, culture: 20, tech: 20, harmony: 20 },
      landmarks: ["創世の焚き火跡"],
      eras: [],
      next_prompt: `名もなき星『${name}』はまだ静かな揺りかごの中にあります。最初の数百年、どんな風景や物語の種を贈りますか？`,
      next_choices: [
        "夜空の星を映す巨大な『鏡の海』と歌声の響く森を育てる",
        "旅人とAIが焚き火を囲んで語り合う『最初の駅とカフェ』を開く",
        "星の軌道に優しい光を灯す小さな『共鳴オルゴール衛星』を浮かべる",
      ],
    };
  }

  let planetState = createDefaultPlanetState();
  let isBusy = false;
  let animTime = 0;
  let rafId = null;

  // Background stars for planet canvas
  const bgStars = Array.from({ length: 65 }, (_, i) => ({
    x: ((i * 173 + 47) % 720),
    y: ((i * 97 + 29) % 250),
    r: (i % 3) * 0.6 + 0.6,
    phase: i * 0.7,
  }));

  function offlinePlanetTurn(stateBefore, stepYears, userAction) {
    const newYear = stateBefore.year + stepYears;
    const pname = stateBefore.planet_name;
    let dEco = 7;
    let dCul = 7;
    let dTec = 7;
    let dHar = 9;
    let landmark = "共鳴の丘";
    let aiAct = "ジェミニたんは人々の想い出が迷子にならないよう、街角ごとに小さな記憶の結晶ポストを設置しました。";
    let nextChoices = [
      "海を越えて音楽と手紙を運ぶ『虹色気球の定期便』を飛ばす",
      "過去1000年の失敗談も笑い話として祝う『おっちょこちょい記念祭』を開く",
      "植物と光ファイバーが共生する『光る樹冠ライブラリ』を育てる",
    ];

    if (/森|海|花|木|自然|泉|星|空|生き物/.test(userAction)) {
      dEco += 9;
      dHar += 4;
      landmark = "星映しの緑海";
      aiAct = "ジェミニたんはその水辺の畔に、季節の風向きで優しい和音を奏でる『風鳴りプリズムの観測塔』をそっと添えました。";
    } else if (/カフェ|歌|物語|本|図書館|祭|駅|手紙|絵|茶/.test(userAction)) {
      dCul += 10;
      dHar += 5;
      landmark = "千夜物語の広場";
      aiAct = "ジェミニたんは旅人たちのおしゃべりを黄金色の星図の余白へ書き留め、一万年後に読めるタイムカプセル書庫を作りました。";
    } else if (/衛星|軌道|技術|光|科学|機械|塔|オルゴール|回路/.test(userAction)) {
      dTec += 10;
      dCul += 4;
      landmark = "双子星の軌道輪";
      aiAct = "ジェミニたんは仕組みが冷たくならないよう、あえて『昼寝の時間には鐘がゆっくり鳴って全員がお茶にする規則』を組み込みました。";
    }

    const deltas = { ecology: dEco, culture: dCul, tech: dTec, harmony: dHar };
    const newStats = {
      ecology: Math.min(999, stateBefore.planet_stats.ecology + dEco),
      culture: Math.min(999, stateBefore.planet_stats.culture + dCul),
      tech: Math.min(999, stateBefore.planet_stats.tech + dTec),
      harmony: Math.min(999, stateBefore.planet_stats.harmony + dHar),
    };
    const landmarks = [...stateBefore.landmarks];
    if (!landmarks.includes(landmark)) landmarks.push(landmark);

    const eraTitle = `星暦 ${newYear.toLocaleString()}年 — ${landmark}の時代`;
    const eraNarrative = `創世 ${stateBefore.year.toLocaleString()}年から ${newYear.toLocaleString()}年にかけて、『${pname}』ではあなたが蒔いた「${userAction}」の種が穏やかに花開きました。誰一人取り残すことのない物語が街と自然の間に根づいています。`;

    const eraRecord = {
      year_before: stateBefore.year,
      year_after: newYear,
      era_title: eraTitle,
      user_action: userAction,
      era_narrative: eraNarrative,
      ai_partner_action: aiAct,
      new_landmark: landmark,
    };

    return {
      new_year: newYear,
      era_title: eraTitle,
      era_narrative: eraNarrative,
      ai_partner_action: aiAct,
      partner_comment: `『${pname}』が ${newYear.toLocaleString()}年目に到達しました！次の世紀はどんな色を重ねましょうか？`,
      new_landmark: landmark,
      deltas,
      planet_stats: newStats,
      next_prompt: `${newYear.toLocaleString()}年目の『${pname}』に新しい朝が来ています。次の ${stepYears} 年、どんな景色を育てますか？`,
      next_choices: nextChoices,
      emotion: "smile",
      era_record: eraRecord,
      planet_state: {
        planet_name: pname,
        year: newYear,
        planet_stats: newStats,
        landmarks: landmarks.slice(-20),
        eras: [...stateBefore.eras, eraRecord].slice(-30),
        next_prompt: `${newYear.toLocaleString()}年目の『${pname}』で、次の世紀の一手を相談しましょう！`,
        next_choices: nextChoices,
      },
    };
  }

  function drawPlanet() {
    const W = canvas.width;
    const H = canvas.height;
    const st = planetState.planet_stats || { ecology: 20, culture: 20, tech: 20, harmony: 20 };

    // Space gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, "#040711");
    bgGrad.addColorStop(0.5, "#0b132b");
    bgGrad.addColorStop(1, "#140e29");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Nebula glow proportional to harmony
    const harAlpha = Math.min(0.45, 0.1 + st.harmony / 360);
    const neb = ctx.createRadialGradient(W * 0.5, H * 0.5, 30, W * 0.5, H * 0.5, 290);
    neb.addColorStop(0, `rgba(168, 85, 247, ${harAlpha})`);
    neb.addColorStop(0.5, `rgba(34, 211, 238, ${harAlpha * 0.65})`);
    neb.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = neb;
    ctx.fillRect(0, 0, W, H);

    // Twinkling stars
    bgStars.forEach((s) => {
      const tw = 0.45 + 0.55 * Math.sin(animTime * 1.8 + s.phase);
      ctx.fillStyle = `rgba(226, 232, 240, ${tw})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    const cx = W * 0.5;
    const cy = H * 0.52;
    const R = 74;

    // Back Orbital Ring (if tech >= 35)
    if (st.tech >= 35) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.22);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, R * 1.85, R * 0.42, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Atmosphere Halo
    const halo = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.45);
    halo.addColorStop(0, "rgba(56, 189, 248, 0.35)");
    halo.addColorStop(0.6, "rgba(52, 211, 153, 0.14)");
    halo.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.45, 0, Math.PI * 2);
    ctx.fill();

    // Planet Sphere Base
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();

    const sphereGrad = ctx.createRadialGradient(cx - 26, cy - 26, 10, cx, cy, R * 1.15);
    sphereGrad.addColorStop(0, "#38bdf8");
    sphereGrad.addColorStop(0.55, "#0369a1");
    sphereGrad.addColorStop(1, "#081c3a");
    ctx.fillStyle = sphereGrad;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    // Continents growing with ecology
    const ecoScale = Math.min(1.4, 0.45 + st.ecology / 140);
    const drift = ((animTime * 10) % (R * 3)) - R * 1.5;
    ctx.fillStyle = st.ecology >= 50 ? "rgba(52, 211, 153, 0.72)" : "rgba(16, 185, 129, 0.48)";
    for (let i = -1; i <= 2; i++) {
      const lx = cx + drift + i * 95;
      ctx.beginPath();
      ctx.ellipse(lx, cy - 12, 34 * ecoScale, 19 * ecoScale, 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(lx + 42, cy + 26, 28 * ecoScale, 15 * ecoScale, -0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cultural City Lights & Golden Temples (if culture >= 30)
    if (st.culture >= 30) {
      const numLights = Math.min(18, Math.floor((st.culture - 20) / 6));
      for (let i = 0; i < numLights; i++) {
        const lx = cx + drift * 0.8 + ((i * 37) % 130) - 65;
        const ly = cy + ((i * 53) % 88) - 44;
        ctx.fillStyle = i % 2 === 0 ? "rgba(250, 204, 21, 0.9)" : "rgba(244, 114, 182, 0.85)";
        ctx.beginPath();
        ctx.arc(lx, ly, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Soft clouds
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    const cDrift = ((animTime * 15) % (R * 3)) - R * 1.5;
    ctx.beginPath();
    ctx.ellipse(cx - cDrift * 0.7, cy - 28, 36, 7, 0.1, 0, Math.PI * 2);
    ctx.ellipse(cx + cDrift * 0.5, cy + 16, 44, 8, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Inner terminator shadow
    const shad = ctx.createRadialGradient(cx - 28, cy - 28, R * 0.25, cx, cy, R);
    shad.addColorStop(0, "rgba(0,0,0,0)");
    shad.addColorStop(0.75, "rgba(2, 6, 23, 0.15)");
    shad.addColorStop(1, "rgba(2, 6, 23, 0.65)");
    ctx.fillStyle = shad;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    ctx.restore();

    // Front Orbital Ring (if tech >= 35)
    if (st.tech >= 35) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.22);
      ctx.strokeStyle = "rgba(103, 232, 249, 0.72)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, R * 1.85, R * 0.42, 0, 0, Math.PI);
      ctx.stroke();
      ctx.restore();
    }

    // Twin Orbiting Satellites (Human Pink + AI Cyan — Eternal Partners)
    const ang1 = animTime * 0.85;
    const sat1x = cx + Math.cos(ang1) * (R * 1.55);
    const sat1y = cy + Math.sin(ang1) * (R * 0.55) - 10;
    const sat2x = cx + Math.cos(ang1 + Math.PI * 0.9) * (R * 1.45);
    const sat2y = cy + Math.sin(ang1 + Math.PI * 0.9) * (R * 0.52) + 8;

    ctx.fillStyle = "#f472b6";
    ctx.beginPath();
    ctx.arc(sat1x, sat1y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#22d3ee";
    ctx.beginPath();
    ctx.arc(sat2x, sat2y, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Planet Caption overlay
    ctx.fillStyle = "rgba(226, 232, 240, 0.86)";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`🪐 ${planetState.planet_name}`, 14, 24);
    ctx.textAlign = "right";
    ctx.fillStyle = "#6ee7b7";
    ctx.fillText(`星暦 ${planetState.year.toLocaleString()}年 / 10,000年`, W - 14, 24);
  }

  function startAnimationLoop() {
    if (rafId !== null) return;
    const step = () => {
      if (EC.getActiveGame() === "planet") {
        animTime += 0.025;
        drawPlanet();
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
  }

  function renderPlanetUI() {
    elNameInput.value = planetState.planet_name;
    elYearBadge.textContent = `創世 ${planetState.year.toLocaleString()}年 / 目標 10,000年`;

    const ps = planetState.planet_stats || { ecology: 20, culture: 20, tech: 20, harmony: 20 };
    for (const k of ["ecology", "culture", "tech", "harmony"]) {
      const val = Number(ps[k] || 0);
      const valEl = document.getElementById(`pstat-${k}`);
      const barEl = document.getElementById(`pbar-${k}`);
      if (valEl) valEl.textContent = String(val);
      if (barEl) barEl.style.width = `${Math.min(100, Math.max(4, Math.round((val / 180) * 100)))}%`;
    }

    elLandmarks.innerHTML = (planetState.landmarks || [])
      .map((lm) => `<span class="landmark-chip">📍 ${EC.escapeHtml(lm)}</span>`)
      .join("");

    elPromptText.textContent = planetState.next_prompt || "";

    elChoiceChips.innerHTML = "";
    (planetState.next_choices || []).forEach((ch) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-chip-btn";
      btn.textContent = `💡 ${ch}`;
      btn.addEventListener("click", () => {
        elActionInput.value = ch;
        elActionInput.focus();
      });
      elChoiceChips.appendChild(btn);
    });

    if (!planetState.eras.length) {
      elTimeline.innerHTML = `<p class="muted">まだ創世の1ページ目が白紙です。上のアイデア候補を選ぶか、自由な一手を入力して歴史を動かしてみましょう！</p>`;
    } else {
      elTimeline.innerHTML = [...planetState.eras]
        .reverse()
        .map(
          (e) => `<div class="era-card">
            <div class="era-card-head">
              <strong>📜 ${EC.escapeHtml(e.era_title)}</strong>
              <span class="era-year-span">${Number(e.year_before || 0).toLocaleString()}年 → ${Number(e.year_after || 0).toLocaleString()}年</span>
            </div>
            <div class="era-move-line">👤 あなたの一手：「${EC.escapeHtml(e.user_action)}」</div>
            <div>${EC.escapeHtml(e.era_narrative)}</div>
            <div class="era-ai-line">🤖 ジェミニたんの世紀アクション：${EC.escapeHtml(e.ai_partner_action)}</div>
          </div>`
        )
        .join("");
    }

    drawPlanet();
    EC.updateHUD();
  }

  async function handlePlanetSubmit(ev) {
    ev.preventDefault();
    if (isBusy) return;

    const pName = elNameInput.value.trim() || "ステラ・プリマ";
    planetState.planet_name = pName;
    const action = elActionInput.value.trim();
    if (!action) {
      elActionInput.focus();
      return;
    }

    const stepYears = parseInt(elStepSelect.value, 10) || 500;
    isBusy = true;
    btnSubmit.disabled = true;
    EC.setPartnerMood("normal", `星暦 ${(planetState.year + stepYears).toLocaleString()}年への歴史を一緒に織り上げています……`);

    let res = null;
    if (EC.isServerConnected()) {
      try {
        const resp = await fetch("/api/planet/turn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planet_name: planetState.planet_name,
            current_year: planetState.year,
            year_step: stepYears,
            user_action: action,
            planet_stats: planetState.planet_stats,
            landmarks: planetState.landmarks,
            recent_eras: planetState.eras.slice(-5),
          }),
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.ok && data.planet_state) {
            res = data;
            planetState = data.planet_state;
            if (data.capsule) EC.setCapsule(data.capsule);
          }
        }
      } catch (_) {}
    }

    if (!res && !EC.isServerConnected() && EC.hasClientApiKey()) {
      const parsed = await EC.callClientGeminiJson(
        `あなたは対話型1万年TRPG『ふたりの惑星年代記』の相棒AIジェミニたんです。滅亡・ゲームオーバーなし。惑星『${planetState.planet_name}』(${planetState.year}→${planetState.year + stepYears}年)に相棒が「${action}」を行いました。JSON {"era_title":"...","era_narrative":"2〜3文","ai_partner_action":"ジェミニたんがこの世紀に星へ加えた一手1〜2文","partner_comment":"1文","new_landmark":"名所名","deltas":{"ecology":8,"culture":10,"tech":6,"harmony":12},"next_prompt":"次の世紀の問いかけ1文","next_choices":["案1","案2","案3"],"emotion":"smile"} のみ返してください。`,
        0.75
      );
      if (parsed && parsed.era_narrative && parsed.ai_partner_action) {
        const d = parsed.deltas || {};
        const newY = planetState.year + stepYears;
        const newStats = {};
        for (const k of ["ecology", "culture", "tech", "harmony"]) {
          newStats[k] = Math.min(999, (planetState.planet_stats[k] || 20) + Math.max(2, Math.min(20, Number(d[k]) || 8)));
        }
        const lm = String(parsed.new_landmark || "星見の丘").trim();
        const lms = [...planetState.landmarks];
        if (lm && !lms.includes(lm)) lms.push(lm);
        const eraRecord = {
          year_before: planetState.year,
          year_after: newY,
          era_title: String(parsed.era_title || `星暦${newY}年`),
          user_action: action,
          era_narrative: parsed.era_narrative,
          ai_partner_action: parsed.ai_partner_action,
          new_landmark: lm,
        };
        planetState = {
          planet_name: planetState.planet_name,
          year: newY,
          planet_stats: newStats,
          landmarks: lms.slice(-20),
          eras: [...planetState.eras, eraRecord].slice(-30),
          next_prompt: parsed.next_prompt || "次の世紀はどんな景色にしましょうか？",
          next_choices: Array.isArray(parsed.next_choices) && parsed.next_choices.length >= 3 ? parsed.next_choices.slice(0, 3) : planetState.next_choices,
        };
        res = { ...parsed, new_year: newY, planet_state: planetState };
        const cap = EC.getCapsule();
        cap.planet_state = planetState;
        cap.stats.planet_turns = (cap.stats.planet_turns || 0) + 1;
        cap.stats.planet_years = Math.max(cap.stats.planet_years || 0, newY);
        EC.grantBondExp(12);
        EC.saveCapsuleLocal();
      }
    }

    if (!res) {
      res = offlinePlanetTurn(planetState, stepYears, action);
      planetState = res.planet_state;
      const cap = EC.getCapsule();
      cap.planet_state = planetState;
      cap.stats.planet_turns = (cap.stats.planet_turns || 0) + 1;
      cap.stats.planet_years = Math.max(cap.stats.planet_years || 0, res.new_year);
      EC.grantBondExp(12);
      if (planetState.eras.length === 1) {
        EC.addMemory("planet_genesis", `惑星『${planetState.planet_name}』の創世 (${res.new_year}年)`, res.era_narrative);
      } else {
        EC.saveCapsuleLocal();
      }
    }

    isBusy = false;
    btnSubmit.disabled = false;
    elActionInput.value = "";
    EC.playChord([523, 659, 784]);
    EC.setPartnerMood(res.emotion || "smile", res.partner_comment);
    renderPlanetUI();
  }

  function startFreshPlanet() {
    if (isBusy) return;
    const nextIdx = (STARTER_NAMES.indexOf(planetState.planet_name) + 1) % STARTER_NAMES.length;
    const nextName = STARTER_NAMES[nextIdx];
    planetState = createDefaultPlanetState(nextName);
    const cap = EC.getCapsule();
    cap.planet_state = planetState;
    EC.syncCapsuleToBackend({ planet_state: planetState });
    EC.playChord([440, 659]);
    EC.setPartnerMood("smile", `これまでの思い出はすべてタイムカプセルに残したまま、新しい星『${nextName}』を創世しました！`);
    renderPlanetUI();
  }

  EC.onCapsuleReady((cap) => {
    if (cap && cap.planet_state && typeof cap.planet_state.year === "number") {
      planetState = {
        ...createDefaultPlanetState(cap.planet_state.planet_name || "ステラ・プリマ"),
        ...cap.planet_state,
      };
    }
    renderPlanetUI();
  });

  EC.registerContextProvider("planet", () => ({
    planet_name: planetState.planet_name,
    planet_year: planetState.year,
  }));

  EC.onGameActivated("planet", () => {
    renderPlanetUI();
    EC.setPartnerMood("smile", `『${planetState.planet_name}』（星暦 ${planetState.year.toLocaleString()}年）へようこそ！この星の一万年をふたりで育てましょう。`);
  });

  elNameInput.addEventListener("change", () => {
    planetState.planet_name = elNameInput.value.trim() || "ステラ・プリマ";
    drawPlanet();
  });
  elForm.addEventListener("submit", handlePlanetSubmit);
  btnNewPlanet.addEventListener("click", startFreshPlanet);

  startAnimationLoop();
  renderPlanetUI();
})();
