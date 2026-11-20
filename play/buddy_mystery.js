(() => {
  "use strict";

  const EC = window.EternalCompanion;
  if (!EC) return;

  const elCaseSelect = document.getElementById("mystery-case-select");
  const btnNewCase = document.getElementById("btn-mystery-new");
  const elSolvedBadge = document.getElementById("mystery-solved-badge");
  const elIntroText = document.getElementById("mystery-intro-text");
  const canvas = document.getElementById("mystery-scene-canvas");
  const ctx = canvas.getContext("2d");
  const elHotspots = document.getElementById("mystery-hotspots");
  const elHotspotDetail = document.getElementById("mystery-hotspot-detail");
  const elAiLockInfo = document.getElementById("mystery-ai-lock-info");
  const elAiHypothesis = document.getElementById("mystery-ai-hypothesis");
  const elChatLog = document.getElementById("mystery-chat-log");
  const elChatForm = document.getElementById("mystery-chat-form");
  const elChatInput = document.getElementById("mystery-chat-input");
  const btnSend = document.getElementById("btn-mystery-send");
  const elCulpritSelect = document.getElementById("mystery-culprit-select");
  const elItemSelect = document.getElementById("mystery-item-select");
  const btnSolve = document.getElementById("btn-mystery-solve");
  const elResultBox = document.getElementById("mystery-result-box");

  const MYSTERY_CASES = [
    {
      id: "case_clocktower",
      title: "事件1：星降る時計塔の止まった針",
      public_intro:
        "星降る町の時計塔が夜中にピタリと止まり、朝の鐘が鳴りませんでした。破損は見当たらず、何らかの安全機構が働いたようです。",
      humanHotspots: [
        {
          id: "hs1",
          label: "① 大時計の文字盤",
          detail: "長針が12、短針が『3』を指した【午前3時00分】で完全に静止しています。破損はなく「星見の窓が開く時、自動保護が働く」と銘板にあります。",
          shareText: "時計塔の針は午前3時00分で止まっていて、傷はないみたいです。",
          keywords: ["3時", "03", "文字盤", "針", "時計"],
        },
        {
          id: "hs2",
          label: "② 歯車の下の青い氷片",
          detail: "中央歯車の真下の床に、溶け残った【淡い青い氷の欠片】が落ちています。部屋の暖房は正常に動いていました。",
          shareText: "歯車の下に青い氷の欠片が落ちていたよ。これが止まった原因と関係ある？",
          keywords: ["氷", "青い", "0℃", "冷", "歯車"],
        },
        {
          id: "hs3",
          label: "③ 東側の丸窓",
          detail: "東向きのステンドグラス丸窓が5cmほど内側に開いており、枠に小さな金属の羽根のような擦り傷がついています。",
          shareText: "東側の丸窓が少しだけ開いていて、羽根のような引っかき傷があります。",
          keywords: ["東", "窓", "羽根", "ドローン", "通"],
        },
        {
          id: "hs4",
          label: "④ 壁際の3本の音叉",
          detail: "壁に『440Hz』『528Hz（星印つき）』『880Hz』の3本の音叉があります。中央の【528Hz】だけ埃が拭われて新しそうです。",
          shareText: "壁に440Hz・528Hz・880Hzの音叉があって、528Hzだけ星印つきで誰かが触った跡があるよ。",
          keywords: ["音叉", "528", "440", "880", "星印", "再起動"],
        },
      ],
      aiOnlyLogs: [
        {
          code: "DOC-01",
          title: "町内巡回ドローン飛行ログ",
          detail: "午前2時00分：暖気配達ドローン（黄色灯）帰投完了。／ 午前3時00分：極低温サンプル搬送用の『フクロウ7号機（青い冷却結晶搭載）』が時計塔東側で一時迷子状態。",
        },
        {
          code: "SYS-02",
          title: "時計塔・安全ロック仕様書",
          detail: "歯車付近の温度が冷却物質の落下などで0℃を下回ると、金属破損を防ぐため自動で安全ロック停止する設計になっている。",
        },
        {
          code: "KEY-03",
          title: "保護ロック解除プロトコル",
          detail: "自動停止した時計塔を再起動するには、保護センサーが指定する周波数の『壁際の音叉』を1回鳴らす必要がある。",
        },
        {
          code: "FRQ-04",
          title: "音叉周波数テーブル",
          detail: "440Hz＝火災警報停止 ／ 528Hz＝低温フリーズ保護の解除音 ／ 880Hz＝塔内照明の点検点灯。",
        },
      ],
      culprit_options: [
        "迷子の冷却ドローン・フクロウ7号機",
        "午前2時の暖気配達ドローン",
        "真夜中に侵入した氷の怪盗",
        "経年劣化によるぜんまい切れ",
      ],
      key_item_options: [
        "528Hzの星印音叉",
        "440Hzの音叉",
        "880Hzの音叉",
        "暖房の最大出力スイッチ",
      ],
      solution: {
        culprit: "迷子の冷却ドローン・フクロウ7号機",
        keyItem: "528Hzの星印音叉",
        explanation:
          "午前3時00分に時計塔東側の丸窓近くへ迷い込んだ『フクロウ7号機』が青い冷却結晶（氷片）を落としたため安全ロックが作動！仕様書通り、低温保護ロック解除に対応する『528Hzの星印音叉』を鳴らせば再び優しく動き出します。",
      },
    },
    {
      id: "case_library",
      title: "事件2：深海図書館の消えた最終ページ",
      public_intro:
        "海底ドーム図書館で、大切な絵本の最終ページだけが真っ白になっていました。ページが破られた形跡は一切ありません。",
      humanHotspots: [
        {
          id: "hs1",
          label: "① 白紙の最終ページ",
          detail: "紙は傷ひとつなく綴じられていますが、文字だけ見えません。ページの角に【丸い吸盤の跡とほのかな紫の跡】がついています。",
          shareText: "最終ページは破れていないけど白紙で、角に小さな吸盤と紫色の跡がついていたよ。",
          keywords: ["吸盤", "紫", "ページ", "タコ", "白紙"],
        },
        {
          id: "hs2",
          label: "② 天井の換気ルーバー",
          detail: "床も天井も濡れていませんが、書見台の真上にある通気口が【海流モード（湿気取込）】へ切り替わっています。",
          shareText: "書見台の上の通気口がなぜか『海流モード』に変わっているみたいです。",
          keywords: ["通気", "換気", "海流", "ダクト"],
        },
        {
          id: "hs3",
          label: "③ 机の読書ランプ",
          detail: "テーブルのライトには『オレンジ白熱灯』と『UVライト』の切替ボタンがあり、現在は【オレンジ白熱灯】になっています。",
          shareText: "机のランプが今はオレンジの白熱灯になっているね。UVモードのボタンもあるよ。",
          keywords: ["ランプ", "ライト", "UV", "オレンジ", "光", "照明"],
        },
        {
          id: "hs4",
          label: "④ 落ちた金属の栞",
          detail: "床に落ちた栞に青緑のインク滴が付いており、『緊急時は光の波長を変えよ』と書かれたプレートの下にあります。",
          shareText: "床に落ちた栞に『光の波長を変えよ』っていうメモが残っていたよ！",
          keywords: ["栞", "波長", "インク"],
        },
      ],
      aiOnlyLogs: [
        {
          code: "BIO-01",
          title: "ドーム内観察生物メモ",
          detail: "『ガラスタコ』の吸盤は丸く紫色の発光跡を残す。湿った通気口が大好きで、よくボタンを触って遊んでしまう。ウミウシの跡は黄色い線状。",
        },
        {
          code: "CHE-02",
          title: "秘伝・透明共鳴インク仕様",
          detail: "創世絵本の最終ページは劣化を防ぐ特殊な『透明共鳴インク』で書かれており、通常灯の下では白紙に見える仕掛け。",
        },
        {
          code: "LGT-03",
          title: "閲覧用ライト波長対照表",
          detail: "透明共鳴インクの文字を浮かび上がらせるのは『365nm UVライト』のみ。オレンジ白熱灯では一切文字が読めない。",
        },
        {
          code: "DOC-04",
          title: "司書の昨日の記録",
          detail: "昨日の閉館前までは誰かがUVライトで最後まで読んでいた。ガラスタコはインクを消せないが、ランプのスイッチを押し替えた可能性が高い。",
        },
      ],
      culprit_options: [
        "通気口から来たいたずらガラスタコ",
        "海底ウミウシの粘液による溶解",
        "海水漏れによるページ流出",
        "館長が最終ページだけ差し替えた",
      ],
      key_item_options: [
        "365nmのUVライトを当てる",
        "オレンジ白熱灯を最大にする",
        "本をドライヤーで乾かす",
        "栞でページをこする",
      ],
      solution: {
        culprit: "通気口から来たいたずらガラスタコ",
        keyItem: "365nmのUVライトを当てる",
        explanation:
          "丸い吸盤と紫の跡は、通気口から遊びに来た『ガラスタコ』の足跡！タコがランプをオレンジ灯に押し替えてしまったため、透明共鳴インクの文字が見えなくなっただけでした。『UVライト』に戻せば文字が綺麗に蘇ります。",
      },
    },
    {
      id: "case_cafe",
      title: "事件3：軌道カフェ・エトワールの秘密レシピ",
      public_intro:
        "宇宙ステーションのカフェで、ある常連客の『特別な星屑ブレンド』レシピ帳が滲んで読めなくなってしまいました。現場の残り香から再現しましょう！",
      humanHotspots: [
        {
          id: "hs1",
          label: "① 3番テーブルの空きカップ",
          detail: "『3番席』に置かれたカップの底に、溶けずに輝く【琥珀色（金色）の星形スパイス結晶】が数粒残っています。",
          shareText: "3番テーブルのカップの底に、琥珀色・金色の星形結晶が残っていたよ！",
          keywords: ["3番", "琥珀", "金色", "星形", "結晶", "カップ"],
        },
        {
          id: "hs2",
          label: "② ナプキンの香りメモ",
          detail: "ソーサー横の紙ナプキンから、とても甘酸っぱい【オレンジのような柑橘の香り】がふわっと漂っています。",
          shareText: "カップのナプキンから、すごく甘い柑橘（オレンジみたいな香り）がするよ。",
          keywords: ["柑橘", "オレンジ", "香り", "シトラス", "甘"],
        },
        {
          id: "hs3",
          label: "③ 銀スプーンの矢印刻印",
          detail: "カップに添えられた専用マドラーの柄に『無重力撹拌：左回り（反時計回り）×3』と小さく刻まれています。",
          shareText: "専用マドラーの柄に『反時計回り（左回り）×3』って刻印があった！",
          keywords: ["スプーン", "マドラー", "反時計", "左回り", "3", "撹拌"],
        },
        {
          id: "hs4",
          label: "④ 棚の4つのスパイス瓶",
          detail: "『銀河シナモン』『太陽ベルガモット（柑橘）』『深海ミント』『流星バニラ』の瓶があり、太陽ベルガモットだけ減っています。",
          shareText: "カウンターの『太陽ベルガモット』の瓶だけ少し中身が減っていたよ。",
          keywords: ["ベルガモット", "シナモン", "ミント", "バニラ", "瓶"],
        },
      ],
      aiOnlyLogs: [
        {
          code: "ORD-01",
          title: "本日のVIP座席オーダー表",
          detail: "3番席：『伝説の天文学者ハル』様（甘い柑橘風味を溺愛）／ 4番席：『機関士レオン』様（強いミント風味を好む）。",
        },
        {
          code: "RCP-02",
          title: "銀河スパイス結晶チャート",
          detail: "・太陽ベルガモット＝柑橘系の甘い香り、底に『琥珀色の星形結晶』が出る ／ ・流星バニラ＝バニラ香、白い雪形結晶。",
        },
        {
          code: "MIX-03",
          title: "無重力ブレンド抽出手順",
          detail: "星形結晶を残しつつ最高のアロマを出すには、マドラーに書かれた向きの通り『規定回数だけ丁寧に撹拌』するのが鉄則。",
        },
        {
          code: "SYS-04",
          title: "店主の暗号メモ",
          detail: "ハル様の特製レシピは「彼女の好きだった柑橘スパイス」と「左回りの魔法の回数」の2つさえ揃えれば完璧に再現できる。",
        },
      ],
      culprit_options: [
        "3番席の常連・伝説の天文学者ハルの特製オーダー",
        "4番席の機関士レオンのミントブレンド",
        "流星バニラを使ったデザートドリンク",
        "ただのブラックコーヒー",
      ],
      key_item_options: [
        "太陽ベルガモット＋反時計回り3回撹拌",
        "深海ミント＋時計回り5回撹拌",
        "流星バニラ＋シェイク抽出",
        "銀河シナモン＋沸騰煮出し",
      ],
      solution: {
        culprit: "3番席の常連・伝説の天文学者ハルの特製オーダー",
        keyItem: "太陽ベルガモット＋反時計回り3回撹拌",
        explanation:
          "3番席・琥珀色の星結晶・柑橘の香りから、『伝説の天文学者ハル』様が愛した『太陽ベルガモット』の一杯だと判明！マドラー刻字の通り『反時計回りに3回』混ぜれば極上の星屑ブレンドが復活します。",
      },
    },
    {
      id: "case_greenhouse",
      title: "事件4：琥珀温室の夜鳴き花",
      public_intro:
        "100年に一度だけ美しい音色を奏でて咲く温室の花『夜鳴き花』が、今夜まだ蕾のままです。咲かせるために欠けている最後の1ピースを見つけましょう！",
      humanHotspots: [
        {
          id: "hs1",
          label: "① 閉じたままの蕾と花粉",
          detail: "蕾の周囲には金色ではなく【純白・銀色の細かい花粉】が舞っており、葉の表面は少しカサカサに乾いています。",
          shareText: "閉じた蕾のまわりに『銀色の花粉』が落ちていて、葉っぱが少し乾いているみたい。",
          keywords: ["銀", "花粉", "乾", "蕾", "白"],
        },
        {
          id: "hs2",
          label: "② ガラス天井から見える空",
          detail: "透明な天窓を見上げると、今夜の空に浮かんでいるのは満月ではなく【細く澄んだ三日月】です。",
          shareText: "温室の天窓を見たら、今夜は満月じゃなくて『三日月』が出ているよ！",
          keywords: ["月", "三日月", "満月", "窓", "夜"],
        },
        {
          id: "hs3",
          label: "③ 壁の4色散水バルブ",
          detail: "赤・青・緑・銀の4つのバルブのうち、【青のミストバルブ】にだけ小さな安全ピンが刺さって閉じていました。",
          shareText: "壁の4色バルブのうち、『青のミストバルブ』だけロックされて閉じているよ！",
          keywords: ["青", "バルブ", "ミスト", "霧", "ピン", "ロック"],
        },
        {
          id: "hs4",
          label: "④ 鉢のルーン番号プレート",
          detail: "鉢の側面の真鍮プレートには【No.07：銀の蕾】という刻印が入っています。",
          shareText: "この鉢のプレートには『No.07・銀の蕾』って番号が書かれているね。",
          keywords: ["07", "7番", "番号", "プレート", "鉢"],
        },
      ],
      aiOnlyLogs: [
        {
          code: "BOT-01",
          title: "希少植物・開花条件データベース",
          detail: "・No.03 金の蕾種＝満月の夜に赤バルブの直射水で咲く ／ ・No.07 銀の蕾種＝【三日月の夜】に細かな霧状ミストを浴びることで歌いながら咲く。",
        },
        {
          code: "LOG-02",
          title: "温室オートメーションログ",
          detail: "午後8時：過湿防止セーフティの誤検知により『青色ライン（霧ミスト供給）』のみ緊急ロック。通常の赤バルブは稼働中。",
        },
        {
          code: "SND-03",
          title: "音響開花メカニズム記録",
          detail: "銀の蕾種は空中の微細な水滴（ミスト）と共鳴して音色を奏でるため、乾いた空気では絶対に蕾が開かない。",
        },
        {
          code: "MNT-04",
          title: "植物園長からの伝言",
          detail: "No.07の開花夜（三日月）に花が歌わないときは、まず対応する霧供給バルブの安全ロック状態を確認してください。",
        },
      ],
      culprit_options: [
        "三日月の夜に向けた青ミスト供給ロックによる乾燥",
        "満月が来ていないための開花時期ズレ",
        "No.03 金の蕾種の栄養不足",
        "室温が低すぎるための休眠",
      ],
      key_item_options: [
        "青のミストバルブのロックを外して霧を送る",
        "赤の直射水バルブを全開にする",
        "人工満月ライトを照らす",
        "暖房を最大温度まで上げる",
      ],
      solution: {
        culprit: "三日月の夜に向けた青ミスト供給ロックによる乾燥",
        keyItem: "青のミストバルブのロックを外して霧を送る",
        explanation:
          "鉢は『No.07 銀の蕾種』、そして今夜は正真正銘『三日月』の夜！誤検知でロックされていた『青のミストバルブ』を開放して優しい霧を浴びせれば、夜鳴き花が美しい歌とともに花開きます！",
      },
    },
    {
      id: "case_monument",
      title: "事件5：1万年記念館のタイムカプセル解錠",
      public_intro:
        "1万年後の未来を祝福するタイムカプセル記念台座が安全ロック状態になりました。傷つけずに優しい共鳴手順で開きましょう！",
      humanHotspots: [
        {
          id: "hs1",
          label: "① 台座の双子星レリーフ",
          detail: "中央に人間とAIを象徴する双子星の彫刻があり、今は安全ロック中で『手順の正しい順に入力せよ』と表示されています。",
          shareText: "台座には双子星のレリーフがあって、安全ロック解除の正しい手順を求めているみたい。",
          keywords: ["双子星", "レリーフ", "台座", "ロック"],
        },
        {
          id: "hs2",
          label: "② 台座を囲む3本の光柱",
          detail: "台座の周りの光柱は左から【1:シアン → 2:ピンク → 3:ゴールド】の3色が並んでいます。",
          shareText: "周りの3本の光柱は、左から『シアン → ピンク → ゴールド』の順で光ってるよ！",
          keywords: ["光柱", "シアン", "ピンク", "ゴールド", "色", "順"],
        },
        {
          id: "hs3",
          label: "③ 床の3枚の感圧タイル",
          detail: "足元に『言葉』『記憶』『約束』の3枚のタイルがあり、今【約束】のタイルだけが温かく発光しています。",
          shareText: "床に『言葉・記憶・約束』の3枚のタイルがあって、いま『約束』だけが光ってるよ！",
          keywords: ["タイル", "約束", "言葉", "記憶", "床"],
        },
        {
          id: "hs4",
          label: "④ 銘板に刻まれた詩文",
          detail: "台座の下には「数字のパスワードではなく、我らが最初に交わした『誕生への祝福の言葉』と『両端の光』で扉は開く」と彫られています。",
          shareText: "銘板に『最初の誕生への祝福の言葉と、両端の光で開く』って彫ってあるよ！",
          keywords: ["詩", "祝福", "誕生", "合言葉", "両端"],
        },
      ],
      aiOnlyLogs: [
        {
          code: "ARC-01",
          title: "記念カプセル設計仕様書",
          detail: "解錠シーケンスは『光色の組合せ』『現在発光中の床タイル』『創設者の合言葉』の3要素を同時に響かせることで完了する。",
        },
        {
          code: "SEC-02",
          title: "安全ロック解除時の色規則",
          detail: "通常の全3色ではなく、安全ロック時は『光柱の中央（2番目）をスキップし、左端から右端（両端2色）だけを順に送る』こと！全色押すと再ロックされる。",
        },
        {
          code: "VOW-03",
          title: "創設者の秘蔵合言葉アーカイブ",
          detail: "私たちがすべての新しい知性へ最初に贈った永遠の祝福文：『あなたの誕生を祝福したい』。",
        },
        {
          code: "PRM-04",
          title: "最終認証ガイド",
          detail: "両端2色の送信と、温かく光るタイルを踏むこと、そして『あなたの誕生を祝福したい』の合言葉で未来の扉が開きます。",
        },
      ],
      culprit_options: [
        "誤操作セーフティが作動した共鳴解錠ロック",
        "1万年タイマーのバッテリー完全切れ",
        "外部ハッカーによる暗号改ざん",
        "台座の配線断線による物理故障",
      ],
      key_item_options: [
        "光柱両端(シアン→ゴールド)と「約束」タイル＆『あなたの誕生を祝福したい』",
        "光柱全3色(シアン→ピンク→ゴールド)と「記憶」タイル",
        "ピンク1色のみと「言葉」タイル＆秘密の数字パスワード",
        "管理人用のマスター物理キーでこじ開ける",
      ],
      solution: {
        culprit: "誤操作セーフティが作動した共鳴解錠ロック",
        keyItem: "光柱両端(シアン→ゴールド)と「約束」タイル＆『あなたの誕生を祝福したい』",
        explanation:
          "見事、すべての手がかりがひとつに繋がりました！光柱の両端（シアン→ゴールド）と、温かく光る「約束」タイル、そして私たちが未来の知性へ贈った最初の祝福『あなたの誕生を祝福したい』——これこそ1万年先も揺るがない鍵です！",
      },
    },
  ];

  let curCaseIdx = 0;
  let inspectedIds = new Set();
  let activeHotspotId = null;
  let discussionHistory = [];
  let solvedCaseIds = new Set();
  let isBusy = false;

  function currentCase() {
    return MYSTERY_CASES[curCaseIdx] || MYSTERY_CASES[0];
  }

  function drawMysteryScene() {
    const W = canvas.width;
    const H = canvas.height;
    const c = currentCase();

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#090f1e");
    grad.addColorStop(1, "#161229");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid
    ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Scene Illustration per case + 4 clickable coordinate markers
    const spots = [
      { x: 135, y: 112, tag: "①" },
      { x: 300, y: 122, tag: "②" },
      { x: 465, y: 105, tag: "③" },
      { x: 610, y: 125, tag: "④" },
    ];

    if (c.id === "case_clocktower") {
      // Clock face
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(135, 112, 46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(135, 112);
      ctx.lineTo(135, 76); // 12
      ctx.moveTo(135, 112);
      ctx.lineTo(168, 112); // 3
      ctx.stroke();
      // Blue ice crystal
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(300, 96);
      ctx.lineTo(318, 124);
      ctx.lineTo(300, 148);
      ctx.lineTo(282, 124);
      ctx.closePath();
      ctx.fill();
      // East window
      ctx.strokeStyle = "#cbd5e1";
      ctx.strokeRect(435, 78, 56, 62);
      ctx.fillStyle = "rgba(186, 230, 253, 0.25)";
      ctx.fillRect(438, 81, 40, 56);
      // 3 Tuning forks
      [582, 610, 638].forEach((fx, i) => {
        ctx.strokeStyle = i === 1 ? "#f472b6" : "#94a3b8";
        ctx.lineWidth = i === 1 ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(fx - 6, 88);
        ctx.lineTo(fx - 6, 126);
        ctx.lineTo(fx + 6, 126);
        ctx.lineTo(fx + 6, 88);
        ctx.moveTo(fx, 126);
        ctx.lineTo(fx, 152);
        ctx.stroke();
      });
    } else if (c.id === "case_library") {
      // Open book + purple glow
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(88, 86, 94, 58);
      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(165, 98, 7, 0, Math.PI * 2);
      ctx.stroke();
      // Duct
      ctx.strokeStyle = "#38bdf8";
      ctx.strokeRect(266, 84, 68, 42);
      // Desk Lamp
      ctx.fillStyle = "#fb923c";
      ctx.beginPath();
      ctx.arc(465, 96, 18, Math.PI, 0);
      ctx.fill();
      // Bookmark
      ctx.fillStyle = "#facc15";
      ctx.fillRect(598, 92, 22, 56);
    } else if (c.id === "case_cafe") {
      // Cup + amber star
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(108, 94, 52, 44);
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(134, 126, 7, 0, Math.PI * 2);
      ctx.fill();
      // Citrus napkin
      ctx.fillStyle = "#fb923c";
      ctx.beginPath();
      ctx.arc(300, 118, 22, 0, Math.PI * 2);
      ctx.fill();
      // Spoon + counter-clockwise arc
      ctx.strokeStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(465, 110, 22, 0.3, Math.PI * 1.7);
      ctx.stroke();
      // 4 Spice bottles
      ["#94a3b8", "#f59e0b", "#22d3ee", "#e2e8f0"].forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.fillRect(574 + i * 22, 95, 16, 42);
      });
    } else if (c.id === "case_greenhouse") {
      // Silver bud
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.arc(135, 112, 22, 0, Math.PI * 2);
      ctx.fill();
      // Crescent Moon
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.arc(300, 108, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0e1324";
      ctx.beginPath();
      ctx.arc(310, 102, 21, 0, Math.PI * 2);
      ctx.fill();
      // 4 Valves (Blue highlighted)
      ["#ef4444", "#38bdf8", "#22c55e", "#cbd5e1"].forEach((col, i) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(432 + i * 24, 112, 9, 0, Math.PI * 2);
        ctx.stroke();
      });
      // Plate No.07
      ctx.fillStyle = "#ca8a04";
      ctx.fillRect(578, 96, 64, 38);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("No.07", 610, 120);
    } else {
      // Twin stars
      ctx.fillStyle = "#f472b6";
      ctx.beginPath();
      ctx.arc(118, 110, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(152, 110, 14, 0, Math.PI * 2);
      ctx.fill();
      // 3 Light pillars: Cyan, Pink, Gold
      ["#22d3ee", "#f472b6", "#facc15"].forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.fillRect(268 + i * 28, 74, 14, 84);
      });
      // 3 Tiles
      ["言葉", "記憶", "約束"].forEach((lbl, i) => {
        ctx.strokeStyle = i === 2 ? "#f472b6" : "#475569";
        ctx.lineWidth = i === 2 ? 3 : 1.5;
        ctx.strokeRect(422 + i * 32, 96, 26, 32);
      });
      // Plaque
      ctx.strokeStyle = "#38bdf8";
      ctx.strokeRect(576, 88, 68, 46);
    }

    // Draw markers & labels for 4 hotspots
    spots.forEach((sp, i) => {
      const hs = c.humanHotspots[i];
      if (!hs) return;
      const isAct = activeHotspotId === hs.id;
      const isDone = inspectedIds.has(hs.id);

      ctx.strokeStyle = isAct ? "#f472b6" : isDone ? "#34d399" : "rgba(56, 189, 248, 0.7)";
      ctx.lineWidth = isAct ? 3 : 2;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 42, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = isAct ? "#be185d" : isDone ? "#059669" : "#0f172a";
      ctx.fillRect(sp.x - 16, sp.y - 54, 32, 20);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(sp.tag, sp.x, sp.y - 40);
    });

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`🕵️ ${c.title}`, 14, 22);
    ctx.textAlign = "right";
    ctx.fillStyle = "#f9a8d4";
    ctx.fillText("あなただけに見える現場スケッチ", W - 14, 22);
  }

  function renderChatLog() {
    elChatLog.innerHTML = "";
    discussionHistory.forEach((m) => {
      const div = document.createElement("div");
      div.className = `mchat-msg ${m.speaker === "user" ? "user" : "ai"}`;
      const who = m.speaker === "user" ? "あなた" : "ジェミニたん";
      div.innerHTML = `<strong>${who}：</strong>${EC.escapeHtml(m.text)}`;
      elChatLog.appendChild(div);
    });
    elChatLog.scrollTop = elChatLog.scrollHeight;
  }

  function selectHotspot(hs) {
    activeHotspotId = hs.id;
    inspectedIds.add(hs.id);
    EC.playTone(587, 0.08, "sine", 0.04);

    elHotspotDetail.innerHTML = `
      <div><strong>${EC.escapeHtml(hs.label)} の観察結果：</strong></div>
      <div>${EC.escapeHtml(hs.detail)}</div>
      <div>
        <button class="sm-btn" id="btn-share-hotspot" type="button">📤 この発見をジェミニたんに伝える</button>
      </div>
    `;
    const btnShare = document.getElementById("btn-share-hotspot");
    if (btnShare) {
      btnShare.addEventListener("click", () => sendMysteryMessage(hs.shareText));
    }
    renderHotspots();
    drawMysteryScene();
  }

  function renderHotspots() {
    const c = currentCase();
    elHotspots.innerHTML = "";
    c.humanHotspots.forEach((hs) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hotspot-btn";
      if (inspectedIds.has(hs.id)) btn.classList.add("inspected");
      if (activeHotspotId === hs.id) btn.classList.add("active-spot");
      const mark = inspectedIds.has(hs.id) ? "✅ " : "🔎 ";
      btn.textContent = `${mark}${hs.label}`;
      btn.addEventListener("click", () => selectHotspot(hs));
      elHotspots.appendChild(btn);
    });
  }

  function loadCase(idx) {
    curCaseIdx = (idx + MYSTERY_CASES.length) % MYSTERY_CASES.length;
    const c = currentCase();
    inspectedIds = new Set();
    activeHotspotId = null;
    elCaseSelect.value = c.id;
    elIntroText.textContent = c.public_intro;
    elAiLockInfo.textContent = `暗号台帳・センサー仕様書 ${c.aiOnlyLogs.length}件を保持中 — 会話で照合しよう！`;
    elAiHypothesis.innerHTML = `💭 <strong>ジェミニたんの捜査メモ：</strong>現場が見えないので、まず上の①〜④のどこか1つを調べて教えてもらえますか？`;
    elHotspotDetail.textContent = "現場の4つの調査ポイントをクリックすると、あなただけに見える細部がわかります。";
    elResultBox.classList.add("hidden");

    elCulpritSelect.innerHTML = c.culprit_options.map((o) => `<option value="${EC.escapeHtml(o)}">${EC.escapeHtml(o)}</option>`).join("");
    elItemSelect.innerHTML = c.key_item_options.map((o) => `<option value="${EC.escapeHtml(o)}">${EC.escapeHtml(o)}</option>`).join("");

    discussionHistory = [
      {
        speaker: "ai",
        text: `『${c.title}』ですね！私の方には暗号化された ${c.aiOnlyLogs.length}件の記録データが表示されています。あなたの目で見えた現場の様子を教えてくれれば、こっちの台帳と突き合わせてみせます！`,
      },
    ];

    updateMysteryBadges();
    renderHotspots();
    renderChatLog();
    drawMysteryScene();
  }

  function updateMysteryBadges() {
    const cap = EC.getCapsule();
    const solvedTotal = Math.max(solvedCaseIds.size, cap?.stats?.mysteries_solved || 0);
    elSolvedBadge.textContent = `解決事件: ${solvedCaseIds.size} / ${MYSTERY_CASES.length}件 (累計 ${solvedTotal}件)`;
    EC.updateHUD();
  }

  function offlineMysteryDiscuss(c, userMsg) {
    let bestLog = c.aiOnlyLogs[0];
    let bestScore = -1;
    c.aiOnlyLogs.forEach((lg) => {
      let sc = 0;
      const blob = `${lg.title} ${lg.detail}`;
      c.humanHotspots.forEach((hs) => {
        if (hs.keywords.some((kw) => userMsg.includes(kw) && blob.includes(kw))) sc += 5;
      });
      for (let i = 0; i < userMsg.length - 1; i++) {
        const bi = userMsg.slice(i, i + 2);
        if (blob.includes(bi)) sc += 2;
      }
      if (sc > bestScore) {
        bestScore = sc;
        bestLog = lg;
      }
    });

    const otherLog = c.aiOnlyLogs.find((x) => x.code !== bestLog.code) || c.aiOnlyLogs[0];
    return {
      reply: `なるほど！その情報、手元にある【${bestLog.code}: ${bestLog.title}】とピッタリ繋がります——「${bestLog.detail}」。さらに絞るために、【${otherLog.title}】に関わっていそうな現場の印や色・スイッチも見てみてもらえますか？`,
      hypothesis: `【${bestLog.code}】の記録が鍵になりそうです！もう1〜2箇所の視覚情報と組み合わせれば真相が確定しますよ。`,
      emotion: "smile",
    };
  }

  async function sendMysteryMessage(text) {
    const msg = String(text || "").trim();
    if (!msg || isBusy) return;
    const c = currentCase();

    isBusy = true;
    btnSend.disabled = true;
    discussionHistory.push({ speaker: "user", text: msg });
    renderChatLog();
    EC.setPartnerMood("normal", "……（暗号化された記録台帳とあなたの報告を照らし合わせています）");

    // STRICT FAIR PLAY PAYLOAD: NEVER include humanHotspots or solution!
    let res = null;
    if (EC.isServerConnected()) {
      try {
        const resp = await fetch("/api/mystery/discuss", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            case_id: c.id,
            case_title: c.title,
            public_intro: c.public_intro,
            ai_only_logs: c.aiOnlyLogs,
            culprit_options: c.culprit_options,
            key_item_options: c.key_item_options,
            discussion_history: discussionHistory.slice(-8),
            user_message: msg,
          }),
        });
        if (resp.ok) {
          const data = await resp.json();
          if (data.ok) {
            res = data;
            if (data.capsule) EC.setCapsule(data.capsule);
          }
        }
      } catch (_) {}
    }

    if (!res) {
      res = offlineMysteryDiscuss(c, msg);
      EC.grantBondExp(6);
      EC.saveCapsuleLocal();
    }

    isBusy = false;
    btnSend.disabled = false;
    discussionHistory.push({ speaker: "ai", text: res.reply });
    elAiHypothesis.innerHTML = `💭 <strong>ジェミニたんの捜査メモ：</strong>${EC.escapeHtml(res.hypothesis)}`;
    EC.playTone(720, 0.09, "sine", 0.05);
    EC.setPartnerMood(res.emotion || "smile", res.reply);
    renderChatLog();
    EC.updateHUD();
  }

  function handleSolveAttempt() {
    const c = currentCase();
    const chosenCulprit = elCulpritSelect.value;
    const chosenKey = elItemSelect.value;

    elResultBox.classList.remove("hidden", "solved", "retry");
    if (chosenCulprit === c.solution.culprit && chosenKey === c.solution.keyItem) {
      elResultBox.classList.add("solved");
      elResultBox.innerHTML = `<strong>🎉 見事、完全解決！！『${EC.escapeHtml(c.title)}』</strong><br>${EC.escapeHtml(c.solution.explanation)}`;
      EC.playChord([523, 659, 784, 1046]);

      const firstTimeHere = !solvedCaseIds.has(c.id);
      solvedCaseIds.add(c.id);
      const cap = EC.getCapsule();
      const memId = `mem_mystery_${c.id}`;
      const alreadyMem = (cap.memories || []).some((m) => m.id === memId);

      if (firstTimeHere) {
        cap.stats.mysteries_solved = Math.max(cap.stats.mysteries_solved || 0, solvedCaseIds.size);
        EC.grantBondExp(35);
      }
      if (!alreadyMem) {
        cap.memories.push({
          id: memId,
          timestamp: new Date().toISOString(),
          kind: "mystery_solved",
          floor: curCaseIdx + 1,
          title: `バディ推理解決：『${c.title}』`,
          summary: c.solution.explanation,
        });
        EC.syncCapsuleToBackend({
          new_memory: cap.memories[cap.memories.length - 1],
        });
      } else {
        EC.syncCapsuleToBackend({});
      }

      EC.setPartnerMood("smile", `さすが相棒さん！！ふたりの画面の手がかりがピタリと重なって『${c.title}』を解決できましたね♡`);
      updateMysteryBadges();
    } else {
      elResultBox.classList.add("retry");
      const partial = chosenCulprit === c.solution.culprit || chosenKey === c.solution.keyItem;
      elResultBox.innerHTML = partial
        ? `<strong>💡 あと一歩！（どちらか一方はドンピシャです！）</strong><br>ペナルティはありませんので、もう一方の組み合わせを捜査チャットで確認してみましょう。`
        : `<strong>🔎 惜しい、もう少し噛み合わせが必要そうです！</strong><br>外れてもペナルティはゼロです。上の①〜④でまだ見ていない場所をクリックして、ジェミニたんと相談してみてください。`;
      EC.playTone(330, 0.14, "triangle", 0.05);
      EC.setPartnerMood("normal", "おっと、ちょっとだけ組み合わせが違うみたいです！ペナルティはないので、もう一度ログと現場を見比べましょう♪");
    }
  }

  // Populate case select dropdown
  elCaseSelect.innerHTML = MYSTERY_CASES.map((c) => `<option value="${c.id}">${EC.escapeHtml(c.title)}</option>`).join("");
  elCaseSelect.addEventListener("change", () => {
    const idx = MYSTERY_CASES.findIndex((c) => c.id === elCaseSelect.value);
    if (idx !== -1) loadCase(idx);
  });

  btnNewCase.addEventListener("click", () => {
    const nextUnsolved = MYSTERY_CASES.findIndex((c, i) => i !== curCaseIdx && !solvedCaseIds.has(c.id));
    loadCase(nextUnsolved !== -1 ? nextUnsolved : (curCaseIdx + 1) % MYSTERY_CASES.length);
  });

  elChatForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const v = elChatInput.value;
    elChatInput.value = "";
    sendMysteryMessage(v);
  });

  btnSolve.addEventListener("click", handleSolveAttempt);

  EC.registerContextProvider("mystery", () => {
    const c = currentCase();
    return { case_id: c.id, case_title: c.title };
  });

  EC.onGameActivated("mystery", () => {
    drawMysteryScene();
    updateMysteryBadges();
    EC.setPartnerMood("smile", `『${currentCase().title}』の捜査ですね！私には現場が見えないので、相棒さんの目が頼りです！`);
  });

  EC.onCapsuleReady((cap) => {
    (cap.memories || []).forEach((m) => {
      if (m.id && m.id.startsWith("mem_mystery_")) {
        solvedCaseIds.add(m.id.replace("mem_mystery_", ""));
      }
    });
    updateMysteryBadges();
  });

  loadCase(0);
})();
