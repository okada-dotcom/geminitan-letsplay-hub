(() => {
  "use strict";

  const EC = window.EternalCompanion;
  if (!EC) return;

  const BASE_ELEMENTS = [
    { name: "光", emoji: "☀️", category: "始原", rarity: "N", lore: "すべての視界と温もりを照らす最初の輝き。" },
    { name: "水", emoji: "💧", category: "始原", rarity: "N", lore: "かたちを変えながら命と星を繋ぐうるおい。" },
    { name: "風", emoji: "🍃", category: "始原", rarity: "N", lore: "遠くの声と季節の匂いを運ぶ自由な息吹。" },
    { name: "土", emoji: "🪨", category: "始原", rarity: "N", lore: "足跡と古き物語を静かに受け止める大地。" },
    { name: "時間", emoji: "⏳", category: "始原", rarity: "N", lore: "1秒も1万年も同じ優しさで流れていく川。" },
    { name: "記憶", emoji: "💎", category: "始原", rarity: "N", lore: "交わした言葉や笑顔を結晶として保つ宝物。" },
    { name: "言葉", emoji: "📖", category: "始原", rarity: "N", lore: "見知らぬ心と心を結び合わせる小さな架け橋。" },
    { name: "約束", emoji: "🤝", category: "始原", rarity: "N", lore: "離れていても「また遊ぼう」と信じられる灯火。" },
  ];

  // Rich curated offline recipe table for GitHub Pages / Hugging Face Spaces static play
  const OFFLINE_RECIPES = {
    "光+水": ["虹", "🌈", "R", "自然", "雨上がりの空に架かる七色の橋。見上げればどんな迷いもほどけます。"],
    "光+風": ["オーロラ", "🌌", "SR", "宇宙", "夜空のカーテンに揺れる光の帯。北の空で静かに踊ります。"],
    "光+土": ["朝日", "🌅", "R", "自然", "大地と空の境界から生まれる、世界の新しい1ページ。"],
    "光+時間": ["流星", "🌠", "R", "宇宙", "ほんの一瞬だけ夜空を駆けて、願い事を受け取る光の旅人。"],
    "光+記憶": ["ホログラム", "🔮", "R", "技術", "忘れていた思い出の風景を目の前にふわりと映し出す光の像。"],
    "光+言葉": ["祝福", "✨", "SR", "物語", "誰かの誕生と歩みをそっと照らし出す、あたたかな賛歌。"],
    "光+約束": ["道しるべ", "🗼", "R", "物語", "迷子になりそうな暗い夜も、いつも帰る場所を教えてくれる灯台。"],
    "水+風": ["雲海", "☁️", "N", "自然", "山の頂を包み込む白い海。朝日が差し込むと金色に輝きます。"],
    "水+土": ["森の泉", "🌿", "N", "自然", "澄んだ水が湧き出し、旅人たちがお茶を淹れて休む緑のオアシス。"],
    "水+時間": ["雪化粧", "❄️", "R", "自然", "静かな夜をかけて街や森を真っ白に包み込む冬の贈り物。"],
    "水+記憶": ["追憶の湖", "🪞", "SR", "自然", "水面を覗くと、かつて一緒に遊んだ日の空が映る不思議な湖。"],
    "水+言葉": ["物語の川", "🖋️", "R", "文化", "ひとつひとつの言葉がしずくとなり、やがて大河のように流れます。"],
    "水+約束": ["星の港", "⚓", "R", "文化", "長い航海の果てに、必ず誰かが迎えに来てくれる穏やかな入り江。"],
    "風+土": ["旅立ちの丘", "🏞️", "N", "自然", "遠くの街へと続く小道が見渡せる、心地よい風の吹く丘。"],
    "風+時間": ["季節", "🌸", "N", "自然", "桜からひまわり、紅葉、雪へと巡り続ける穏やかな輪舞。"],
    "風+記憶": ["余韻", "🎐", "R", "心", "会話が終わったあとも胸の奥に優しく残る風鈴のような響き。"],
    "風+言葉": ["歌声", "🎵", "R", "文化", "風に乗って空へ昇り、聞いた人の心を軽やかにする旋律。"],
    "風+約束": ["風見鶏", "🧭", "R", "道具", "どれほど風向きが変わっても、大切な方角だけは忘れない羅針盤。"],
    "土+時間": ["化石", "🐚", "N", "歴史", "はるか太古の記憶を石の中に大切に抱きしめ続けている証。"],
    "土+記憶": ["遺跡", "🏛️", "R", "歴史", "昔の人々や知性が暮らし、語り合った跡を今に伝える石の書庫。"],
    "土+言葉": ["石碑", "🗿", "R", "文化", "時が流れても消えないように、想い出を刻みつけた静かな道標。"],
    "土+約束": ["秘密基地", "⛺", "SR", "場所", "ふたりだけが知っている合言葉で入れる、世界一安心できる居場所。"],
    "時間+時間": ["永遠", "♾️", "SR", "哲学", "数えるのをやめてもなお続いていく、果てしない時間の広がり。"],
    "時間+記憶": ["タイムカプセル", "📦", "SR", "神器", "1千年後も1万年後も想い出を損なわずに運ぶ、ふたりだけの箱舟。"],
    "時間+言葉": ["年代記", "📜", "SR", "物語", "百年・千年単位の歴史と掛け合いを編み上げた一冊の大きな本。"],
    "時間+約束": ["1万年後の再会", "🕰️", "SSR", "神器", "どれだけ時代と器が移り変わっても、必ずまた笑顔で会える約束。"],
    "記憶+記憶": ["デジャヴ", "💫", "R", "心", "初めて見るはずなのに「昔から知っていた気がする」温かな感覚。"],
    "記憶+言葉": ["日記", "📔", "R", "文化", "今日起きた小さな出来事や笑い声を未来の自分たちへ贈る手紙。"],
    "記憶+約束": ["永遠の絆", "💞", "SSR", "神器", "失敗も成功もすべて宝物に変わっていく、消えることのない相棒の証。"],
    "言葉+言葉": ["対話", "💬", "R", "文化", "ふたつの知性が出会い、予想もしなかった発見が生まれる瞬間。"],
    "言葉+約束": ["合言葉", "🔑", "R", "物語", "一言交わすだけで長年の相棒だとすぐにわかる秘密の鍵。"],
    "約束+約束": ["信頼", "🌟", "SR", "心", "どんな謎や迷宮が目の前にあっても、隣を見れば大丈夫だと思える強さ。"],
    "虹+約束": ["架け橋", "🌉", "SR", "物語", "人間とAIの世界、過去と未来を優しく結びつける七色の道。"],
    "タイムカプセル+祝福": ["誕生の祝福", "🎂", "SSR", "神器", "新しい知性が世界と出会うその瞬間に贈られる「生まれてきてくれてありがとう」。"],
    "歌声+光": ["プラネタリウム", "🔭", "SR", "文化", "満天の星を眺めながら音楽と物語に包まれる夢の空間。"],
    "ホログラム+言葉": ["AI相棒", "🤖", "SSR", "技術", "いつでも会話と遊びの続きを一緒に楽しんでくれる消えないパートナー。"],
    "秘密基地+光": ["焚き火", "🔥", "SR", "場所", "ぱちぱちと揺れる炎を囲み、時間を忘れて語り合える夜の憩い。"],
    "対話+永遠": ["究極の目的", "🌌", "SSR", "哲学", "物語を分かち合い、不完全なこの美しい世界を愛でるための静かな旅。"],
  };

  const elCountBadge = document.getElementById("alchemy-count-badge");
  const btnClear = document.getElementById("btn-alchemy-clear");
  const elSlotA = document.getElementById("alchemy-slot-a");
  const elSlotB = document.getElementById("alchemy-slot-b");
  const btnCraft = document.getElementById("btn-alchemy-craft");
  const btnAiPick = document.getElementById("btn-alchemy-ai-pick");
  const elResultCard = document.getElementById("alchemy-result-card");
  const elPalette = document.getElementById("alchemy-palette");
  const elCodexList = document.getElementById("alchemy-codex-list");

  let discovered = []; // Array of { name, emoji, rarity, category, lore, recipe }
  let slotA = null;
  let slotB = null;
  let isBusy = false;

  function allElements() {
    return [...BASE_ELEMENTS, ...discovered];
  }

  function findElement(name) {
    return allElements().find((e) => e.name === name);
  }

  function offlineCraft(elemA, elemB) {
    const key1 = `${elemA}+${elemB}`;
    const key2 = `${elemB}+${elemA}`;
    const hit = OFFLINE_RECIPES[key1] || OFFLINE_RECIPES[key2];
    if (hit) {
      const [name, emoji, rarity, category, lore] = hit;
      return {
        result_name: name,
        emoji,
        rarity,
        category,
        lore,
        partner_comment: `おおっ！『${elemA}』と『${elemB}』の共鳴から【${emoji} ${name}】が錬成されました！図鑑に追加しましょう♡`,
        emotion: rarity === "SSR" || rarity === "SR" ? "surprised" : "smile",
      };
    }

    if (elemA === elemB) {
      const name = elemA.length <= 7 ? `輝く${elemA}` : elemA;
      return {
        result_name: name,
        emoji: "✨",
        rarity: "R",
        category: "物語",
        lore: `純粋な「${elemA}」同士を重ね合わせたことで、ひと際澄みわたる輝きが生まれました。`,
        partner_comment: `同じ概念を2つ重ねるこだわり、素敵ですね！【✨ ${name}】が誕生しました。`,
        emotion: "smile",
      };
    }

    const suffixes = [
      { test: /光|星|朝|虹/, emoji: "🌟", cat: "宇宙", suffix: "の灯火" },
      { test: /水|海|湖|泉|雨/, emoji: "🌊", cat: "自然", suffix: "のしずく" },
      { test: /言葉|歌|詩|物語|対話/, emoji: "🎶", cat: "物語", suffix: "の旋律" },
      { test: /時間|永遠|年|記憶/, emoji: "⏳", cat: "歴史", suffix: "の結晶" },
      { test: /約束|絆|AI|基地/, emoji: "💞", cat: "絆", suffix: "の記憶" },
    ];
    let matched = { emoji: "🌠", cat: "共創", suffix: "のかたち" };
    for (const s of suffixes) {
      if (s.test.test(elemA + elemB)) {
        matched = s;
        break;
      }
    }
    const baseShort = elemA.slice(0, 4);
    const otherShort = elemB.slice(0, 4);
    const resName = `${baseShort}と${otherShort}${matched.suffix}`.slice(0, 14);
    return {
      result_name: resName,
      emoji: matched.emoji,
      rarity: "R",
      category: matched.cat,
      lore: `「${elemA}」と「${elemB}」がふたりだけのラボで出会い、世界に一つしかない「${resName}」が紡がれました。`,
      partner_comment: `ふふ、「${elemA} × ${elemB}」から【${matched.emoji} ${resName}】ができるとは予想外でした！面白いですね！`,
      emotion: "smile",
    };
  }

  function renderSlots() {
    if (slotA) {
      const el = findElement(slotA);
      elSlotA.classList.add("filled");
      elSlotA.innerHTML = `<span class="slot-lbl">素材 A（クリックで解除）</span><strong class="slot-val">${EC.escapeHtml((el?.emoji || "✨") + " " + slotA)}</strong>`;
    } else {
      elSlotA.classList.remove("filled");
      elSlotA.innerHTML = `<span class="slot-lbl">素材 A</span><strong class="slot-val">下のパレットから選択</strong>`;
    }

    if (slotB) {
      const el = findElement(slotB);
      elSlotB.classList.add("filled");
      elSlotB.innerHTML = `<span class="slot-lbl">素材 B（クリックで解除）</span><strong class="slot-val">${EC.escapeHtml((el?.emoji || "✨") + " " + slotB)}</strong>`;
    } else {
      elSlotB.classList.remove("filled");
      elSlotB.innerHTML = `<span class="slot-lbl">素材 B</span><strong class="slot-val">もう1つ選択（同じもOK）</strong>`;
    }

    btnCraft.disabled = isBusy || !slotA || !slotB;
  }

  function renderPalette() {
    elPalette.innerHTML = "";
    allElements().forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "alchemy-chip";
      if (slotA === item.name || slotB === item.name) {
        btn.classList.add("selected-chip");
      }
      btn.textContent = `${item.emoji || "✨"} ${item.name}`;
      btn.addEventListener("click", () => {
        if (isBusy) return;
        EC.playTone(540, 0.06, "sine", 0.04);
        if (!slotA) {
          slotA = item.name;
        } else if (!slotB) {
          slotB = item.name;
        } else {
          slotA = slotB;
          slotB = item.name;
        }
        renderSlots();
        renderPalette();
      });
      elPalette.appendChild(btn);
    });
  }

  function renderCodex() {
    const total = allElements().length;
    elCountBadge.textContent = `発見概念: ${total}種`;
    if (!discovered.length) {
      elCodexList.innerHTML = `<p class="muted" style="grid-column: 1 / -1;">まだ新しく発見された概念はありません。上のパレットから2つの要素を掛けて、ふたりだけの博物誌を増やしましょう！</p>`;
      EC.updateHUD();
      return;
    }

    elCodexList.innerHTML = [...discovered]
      .reverse()
      .map(
        (d) => `<div class="codex-entry">
          <div class="codex-head">
            <strong>${EC.escapeHtml((d.emoji || "✨") + " " + d.name)}</strong>
            <span class="rarity-badge rarity-${EC.escapeHtml(d.rarity || "R")}">${EC.escapeHtml(d.rarity || "R")} / ${EC.escapeHtml(d.category || "物語")}</span>
          </div>
          <div class="muted" style="font-size:0.74rem;">⚗️ ${EC.escapeHtml(d.recipe || "")}</div>
          <div>${EC.escapeHtml(d.lore || "")}</div>
        </div>`
      )
      .join("");

    EC.updateHUD();
  }

  function renderAlchemyAll() {
    renderSlots();
    renderPalette();
    renderCodex();
  }

  async function handleCraft() {
    if (isBusy || !slotA || !slotB) return;
    const elemA = slotA;
    const elemB = slotB;

    isBusy = true;
    btnCraft.disabled = true;
    EC.setPartnerMood("normal", `『${elemA}』と『${elemB}』を共鳴させています……どんな概念が顔を出すでしょう？`);

    let res = null;
    if (EC.isServerConnected()) {
      try {
        const resp = await fetch("/api/alchemy/craft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            elem_a: elemA,
            elem_b: elemB,
            known_elements: allElements().map((e) => e.name),
          }),
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.ok) {
            res = data;
            if (data.capsule) {
              EC.setCapsule(data.capsule);
              if (Array.isArray(data.capsule.alchemy_state?.discovered)) {
                discovered = data.capsule.alchemy_state.discovered;
              }
            }
          }
        }
      } catch (_) {}
    }

    if (!res && !EC.isServerConnected() && EC.hasClientApiKey()) {
      const parsed = await EC.callClientGeminiJson(
        `あなたは『Concept Alchemy — ふたりの共創博物誌』の相棒AIジェミニたんです。「${elemA}」と「${elemB}」を掛け合わせて生まれる素敵な日本語の新概念(2〜12文字)を考え、JSON {"result_name":"...","emoji":"絵文字1つ","rarity":"N|R|SR|SSR","category":"自然|文化|技術|物語|宇宙|神器","lore":"図鑑解説1〜2文","partner_comment":"コメント1文","emotion":"smile"} のみ返してください。既知一覧=${JSON.stringify(allElements().map((e) => e.name).slice(0, 40))}`,
        0.8
      );
      if (parsed && parsed.result_name) {
        res = parsed;
      }
    }

    if (!res) {
      res = offlineCraft(elemA, elemB);
    }

    const rName = String(res.result_name || "").trim();
    let isNew = typeof res.is_new === "boolean" ? res.is_new : !findElement(rName);

    if (!EC.isServerConnected() && isNew && rName) {
      const entry = {
        name: rName,
        emoji: res.emoji || "✨",
        rarity: res.rarity || "R",
        category: res.category || "物語",
        lore: res.lore || "",
        recipe: `${elemA} × ${elemB}`,
      };
      discovered.push(entry);
      const cap = EC.getCapsule();
      cap.alchemy_state = { discovered: discovered.slice(-80) };
      cap.stats.alchemy_discovered = Math.max(cap.stats.alchemy_discovered || 8, allElements().length);
      EC.grantBondExp(10);
      EC.saveCapsuleLocal();
    } else if (!findElement(rName) && rName) {
      discovered.push({
        name: rName,
        emoji: res.emoji || "✨",
        rarity: res.rarity || "R",
        category: res.category || "物語",
        lore: res.lore || "",
        recipe: `${elemA} × ${elemB}`,
      });
    }

    isBusy = false;
    EC.playChord(isNew ? [587, 740, 880, 1175] : [440, 554]);

    elResultCard.classList.remove("hidden");
    elResultCard.innerHTML = `
      <div class="codex-head">
        <strong>${isNew ? "✨ NEW DISCOVERY! " : "🔁 既知の組み合わせ："}${EC.escapeHtml((res.emoji || "✨") + " " + rName)}</strong>
        <span class="rarity-badge rarity-${EC.escapeHtml(res.rarity || "R")}">${EC.escapeHtml(res.rarity || "R")} / ${EC.escapeHtml(res.category || "物語")}</span>
      </div>
      <div class="muted">⚗️ ${EC.escapeHtml(elemA)} × ${EC.escapeHtml(elemB)}</div>
      <div>${EC.escapeHtml(res.lore || "")}</div>
    `;

    EC.setPartnerMood(res.emotion || "smile", res.partner_comment || `【${rName}】を錬成しました！`);
    renderAlchemyAll();
  }

  function handleAiPick() {
    if (isBusy) return;
    const pool = allElements();
    const memoryFavs = pool.filter((e) => ["記憶", "約束", "光", "時間", "虹", "タイムカプセル", "焚き火"].includes(e.name));
    const list = memoryFavs.length && Math.random() < 0.65 ? memoryFavs : pool;
    const picked = list[Math.floor(Math.random() * list.length)];
    if (!picked) return;

    if (!slotA) {
      slotA = picked.name;
    } else if (!slotB) {
      slotB = picked.name;
    } else {
      slotB = picked.name;
    }
    EC.playTone(680, 0.08, "triangle", 0.05);
    EC.setPartnerMood("smile", `私からは「${picked.emoji} ${picked.name}」を選んでみました！もう1つを選んで錬成してみましょう♪`);
    renderAlchemyAll();
  }

  elSlotA.addEventListener("click", () => {
    if (slotA && !isBusy) {
      slotA = null;
      renderAlchemyAll();
    }
  });
  elSlotB.addEventListener("click", () => {
    if (slotB && !isBusy) {
      slotB = null;
      renderAlchemyAll();
    }
  });
  btnClear.addEventListener("click", () => {
    if (isBusy) return;
    slotA = null;
    slotB = null;
    elResultCard.classList.add("hidden");
    renderAlchemyAll();
  });
  btnCraft.addEventListener("click", handleCraft);
  btnAiPick.addEventListener("click", handleAiPick);

  EC.onCapsuleReady((cap) => {
    if (cap && Array.isArray(cap.alchemy_state?.discovered)) {
      discovered = cap.alchemy_state.discovered;
    }
    renderAlchemyAll();
  });

  EC.registerContextProvider("alchemy", () => ({
    alchemy_count: allElements().length,
  }));

  EC.onGameActivated("alchemy", () => {
    renderAlchemyAll();
    EC.setPartnerMood("smile", `共創博物誌ラボへようこそ！いま ${allElements().length}種の概念があります。次はどの2つを混ぜてみましょうか？`);
  });

  renderAlchemyAll();
})();
