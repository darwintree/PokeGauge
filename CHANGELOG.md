# PokeGauge

## 1.0.0

### Major Changes

- 7b29f9c: <!-- changelog:start -->
  <!-- changelog:en -->
  Calculate multi-hit moves and Parental Bond with independent hit outcomes, and carry resistance Berry consumption into the second move use. View total equivalent-power ranges and every hit's power. Damage and power ranges assume all accuracy checks succeed; Battle Odds KO probabilities still include misses and early stopping. Native multi-hit powers are now read-only; old bookmarks and shared links with edited powers for these moves can no longer load. Recreate those setups using the move's fixed powers. Calculation warnings appear only for relevant move limitations. Multi-hit power details open on hover or keyboard focus like ordinary moves; tap to view on mobile.
  <!-- changelog:zh-hans -->
  支持连续攻击与亲子爱的逐段命中、会心和伤害计算，抗性果消费状态延续至第二次招式执行。可查看整招等效威力范围和每段威力。伤害与威力范围假定全部命中，实战击倒概率仍计入未命中和中途停止。原生连续攻击威力改为只读；保存了这些招式自定义威力的旧书签和分享链接失效，请按招式固定威力重新创建设定。仅在相关招式上提示具体计算限制。连续攻击威力明细与普通招式一样支持悬停和键盘聚焦查看，手机端点按查看。
  <!-- changelog:zh-hant -->
  支援連續攻擊與親子愛的逐段命中、會心和傷害計算，抗性果消耗狀態延續至第二次招式執行。可查看整招等效威力範圍和每段威力。傷害與威力範圍假定全部命中，實戰擊倒機率仍計入未命中和中途停止。原生連續攻擊威力改為唯讀；儲存了這些招式自訂威力的舊書籤和分享連結失效，請依招式固定威力重新建立設定。僅在相關招式上提示具體計算限制。連續攻擊威力明細與普通招式一樣支援懸停和鍵盤聚焦查看，手機端點按查看。
  <!-- changelog:ja -->
  連続攻撃とおやこあいの命中・急所・ダメージを攻撃ごとに計算し、半減きのみの消費状態を2回目の技使用に引き継ぎます。技全体の換算威力の範囲と各攻撃の威力を確認できます。ダメージと威力の範囲はすべての命中判定が成功する前提とし、実戦モードのひんし確率には技の外れや途中終了も含めます。連続攻撃技の威力は閲覧専用になりました。これらの技の威力を変更した古いブックマークや共有リンクは読み込めないため、技の固定威力で設定を作り直してください。計算上の制限は、該当する技にのみ表示します。連続攻撃の威力詳細も通常の技と同じくホバーやキーボードフォーカスで表示し、モバイルではタップで確認できます。
  <!-- changelog:end -->

### Minor Changes

- eafc87d: <!-- changelog:start -->
  <!-- changelog:en -->
  Moves, stat stages, abilities, items, weather, terrain, and screens now show every option in the choice pool on the track itself. Highlighted chips are selected; unhighlighted chips stay in the pool. Stat stages start from 0, and you add other stages with +.
  <!-- changelog:zh-hans -->
  招式、能力阶级、特性、道具、天气、场地和墙现在会直接在 Track 上列出选项池中的全部选项。高亮表示已选中，未高亮表示仍在池中但未选中。能力阶级默认只有 0，可用 + 加入其他阶级。
  <!-- changelog:zh-hant -->
  招式、能力階級、特性、道具、天氣、場地和牆現在會直接在 Track 上列出選項池中的全部選項。高亮表示已選中，未高亮表示仍在池中但未選中。能力階級預設只有 0，可用 + 加入其他階級。
  <!-- changelog:ja -->
  わざ、能力ランク、特性、どうぐ、天気、フィールド、壁は、選択肢プールの内容を Track 上に直接表示するようになりました。ハイライトは選択中、非ハイライトはプール内の未選択です。能力ランクの初期値は 0 のみで、+ から他のランクを追加できます。
  <!-- changelog:end -->
- 04879ab: <!-- changelog:start -->
  <!-- changelog:en -->
  Results start ungrouped. Browse damage results by any Track with multiple selected choices using the summary. Click the selected grouping again to show all results. Tracks with only one branch are hidden from the grouping controls.
  <!-- changelog:zh-hans -->
  结果默认不分组。点击结果摘要，可按任意包含多个已选项的 Track 分组查阅；再次点击当前分组即可查看全部结果。只有一条分支的 Track 不显示分组入口。
  <!-- changelog:zh-hant -->
  結果預設不分組。點擊結果摘要，可依任意包含多個已選項的 Track 分組查閱；再次點擊目前分組即可查看全部結果。只有一條分支的 Track 不顯示分組入口。
  <!-- changelog:ja -->
  初期表示ではグループ分けしません。結果の概要から、複数の選択肢が選ばれている各 Track ごとに結果を表示できます。選択中のグループ分けをもう一度押すと、すべての結果を表示します。分岐が1つだけの Track はグループ分けの操作欄に表示しません。
  <!-- changelog:end -->
- 712257b: <!-- changelog:start -->
  <!-- changelog:en -->
  Two-use KO odds now carry supported defense drops and offensive boosts into the next use, alongside resistance Berry consumption. Classic mode includes guaranteed stat changes only; Battle Odds also includes chance-based changes. Parental Bond applies supported stat changes between its hits and carries their cumulative effect into the next use.
  <!-- changelog:zh-hans -->
  两次使用内的击倒概率现在会延续已支持招式的降防和加攻，并同时考虑抗性果消费。经典模式只计必定触发的能力变化，实战模式也计概率触发。亲子爱会在两击之间应用已支持的能力变化，并将累计变化延续到下一次使用。
  <!-- changelog:zh-hant -->
  兩次使用內的擊倒機率現在會延續已支援招式的降防和加攻，並同時考慮抗性果消耗。經典模式只計必定觸發的能力變化，實戰模式也計機率觸發。親子愛會在兩擊之間套用已支援的能力變化，並將累計變化延續到下一次使用。
  <!-- changelog:ja -->
  2回以内の技使用によるひんし確率に、対応済みの防御・特防低下や攻撃・特攻上昇を、半減きのみの消費とともに引き継ぎます。クラシックモードは確定の能力変化のみ、実戦モードは確率による変化も含めます。おやこあいは攻撃の間に対応済みの能力変化を反映し、累積した変化を次の技使用に引き継ぎます。
  <!-- changelog:end -->
- 8c8e7d7: <!-- changelog:start -->
  <!-- changelog:en -->
  Add Smogon as an optional usage ranking source and let users choose the preferred source in Settings.
  <!-- changelog:zh-hans -->
  新增 Smogon 使用率排序来源，并允许用户在设置中选择优先使用的来源。
  <!-- changelog:zh-hant -->
  新增 Smogon 使用率排序來源，並允許使用者在設定中選擇優先使用的來源。
  <!-- changelog:ja -->
  Smogon の使用率ランキングを追加し、設定から優先するソースを選べるようにしました。
  <!-- changelog:end -->
- 7207854: <!-- changelog:start -->
  <!-- changelog:en -->
  Start with fewer result rows: held items and fallback abilities use one default choice, while weather, terrain, and stat stages follow ability combinations. Other choices remain available, and manual selections and saved setups are preserved.
  <!-- changelog:zh-hans -->
  减少默认结果行数：道具和特性回退默认单选，天气、场地与能力阶级按特性组合选择。其他选项仍可使用，手动选择和已保存的情景设定保持不变。
  <!-- changelog:zh-hant -->
  減少預設結果行數：道具和特性回退預設單選，天氣、場地與能力階級按特性組合選擇。其他選項仍可使用，手動選擇和已儲存的情景設定保持不變。
  <!-- changelog:ja -->
  初期状態の結果行数を削減しました。持ち物と使用率データがない場合の特性は1つを選び、天候・フィールド・能力ランクは特性の組み合わせに応じて選択します。他の候補も引き続き選択でき、手動の選択と保存済みの設定は維持されます。
  <!-- changelog:end -->

### Patch Changes

- 2f6e686: <!-- changelog:start -->
  <!-- changelog:en -->
  Opening Pokémon pickers no longer blocks the dialog from appearing, and Mega Garchomp Z now shows its learnable moves.
  <!-- changelog:zh-hans -->
  打开宝可梦选择器时不再阻塞对话框显示，Mega 烈咬陆鲨 Z 现在可以显示可习得技能。
  <!-- changelog:zh-hant -->
  開啟寶可夢選擇器時不再阻塞對話框顯示，Mega 烈咬陸鯊 Z 現在可以顯示可習得技能。
  <!-- changelog:ja -->
  ポケモン選択ダイアログの表示がブロックされなくなり、メガガブリアスZの習得可能な技が表示されるようになりました。
  <!-- changelog:end -->
- 04879ab: <!-- changelog:start -->
  <!-- changelog:en -->
  Grouping results now separates equivalent results across groups, showing the correct conditions and counts. Ungrouping restores merged results.
  <!-- changelog:zh-hans -->
  结果分组现在会拆开跨组的等价结果，显示对应条件和准确条数；取消分组后恢复合并。
  <!-- changelog:zh-hant -->
  結果分組現在會拆開跨組的等價結果，顯示對應條件和準確筆數；取消分組後恢復合併。
  <!-- changelog:ja -->
  結果をグループ化すると、グループをまたぐ同等の結果が分かれ、対応する条件と正しい件数が表示されます。グループ化を解除すると再び統合されます。
  <!-- changelog:end -->
- 04879ab: <!-- changelog:start -->
  <!-- changelog:en -->
  Remove the unnecessary vertical scrollbar from group tabs. Improve result summary spacing and group tab readability. Move groups show types, item groups show icons, and stat groups show investment labels and actual values.
  <!-- changelog:zh-hans -->
  移除分组页签中多余的纵向滚动条。优化结果摘要的间距与分组页签的可读性。招式组显示属性，道具组显示图标，能力值组显示投入标签与实数值。
  <!-- changelog:zh-hant -->
  移除分組頁籤中多餘的縱向捲動條。優化結果摘要的間距與分組頁籤的可讀性。招式組顯示屬性，道具組顯示圖示，能力值組顯示投入標籤與實數值。
  <!-- changelog:ja -->
  グループタブの不要な縦スクロールバーを削除しました。結果の概要の間隔とグループタブの読みやすさを改善しました。わざグループにはタイプ、どうぐグループにはアイコン、能力値グループには配分ラベルと実数値を表示します。
  <!-- changelog:end -->
- 04879ab: <!-- changelog:start -->
  <!-- changelog:en -->
  Keep the side being edited at the top when expanding stat Tracks, so opening defender stats does not replace its header with the attacker. Header arrows expand and collapse with a single click.
  <!-- changelog:zh-hans -->
  展开能力值 Track 时，正在编辑的一方保持在顶部，避免展开防守方后原位置变成攻击方。标题箭头单击即可展开或收起。
  <!-- changelog:zh-hant -->
  展開能力值 Track 時，正在編輯的一方保持在頂部，避免展開防守方後原位置變成攻擊方。標題箭頭按一下即可展開或收起。
  <!-- changelog:ja -->
  能力値 Track を開くと編集中の側が上部に表示され、防御側の見出しが攻撃側に置き換わらなくなります。見出しの矢印は1回のクリックで開閉できます。
  <!-- changelog:end -->
- 1d8a5ac: <!-- changelog:start -->
  <!-- changelog:en -->
  Enter results faster with gentler dialogs and consistent button feedback. Ordinary hints wait briefly on hover, while damage readouts remain immediate. Reduced-motion preferences are respected throughout the interface.
  <!-- changelog:zh-hans -->
  加快结果页切换，减轻弹窗动效并统一按钮反馈。普通说明稍作悬停等待，伤害读数仍即时显示；全界面适配减少动态效果偏好。
  <!-- changelog:zh-hant -->
  加快結果頁切換，減輕彈窗動效並統一按鈕回饋。一般說明稍作懸停等待，傷害讀數仍即時顯示；全介面支援減少動態效果偏好。
  <!-- changelog:ja -->
  結果画面への切り替えを速め、ダイアログの動きを控えめにし、ボタンの反応を統一しました。通常の説明はホバー後に少し待って表示し、ダメージ情報はすぐに表示します。画面全体で動きを減らす設定に対応しました。
  <!-- changelog:end -->
- eafc87d: <!-- changelog:start -->
  <!-- changelog:en -->
  The setup panel now groups attacker, defender, and shared field settings, with screens under the defender. Compact Pokémon selectors, choice buttons, and desktop spacing improve readability across languages and screen sizes, with clearer hover and keyboard feedback and no horizontal sidebar overflow. Terrain and weather have dedicated icons and sit side by side; add choices with + and keep them in the pool when deselected or after reloading. Harsh sunlight, heavy rain, and strong winds are shown as unavailable in the weather picker.
  <!-- changelog:zh-hans -->
  参数面板分为进攻方、防守方和公共场地，墙归入防守方。宝可梦卡片、选项按钮和桌面间距更紧凑，改善多语言和不同屏幕尺寸下的阅读体验，并完善悬停与键盘反馈、消除侧栏横向溢出。场地与天气采用专属图标并排展示，可用 + 添加选项；取消选中或刷新后仍保留在选项池中。大日照、大雨和乱流在天气选择器中显示为暂不可选。
  <!-- changelog:zh-hant -->
  參數面板分為進攻方、防守方和共用場地，牆歸入防守方。寶可夢卡片、選項按鈕和桌面間距更精簡，改善多語言和不同螢幕尺寸下的閱讀體驗，並完善懸停與鍵盤回饋、消除側欄橫向溢出。場地與天氣採用專屬圖示並排顯示，可用 + 新增選項；取消選取或重新整理後仍保留在選項池中。大日照、大雨和亂流在天氣選擇器中顯示為暫不可選。
  <!-- changelog:ja -->
  設定パネルを攻撃側・防御側・共通の場に分け、壁を防御側にまとめました。ポケモン選択欄や選択肢、デスクトップの余白をコンパクトにし、各言語・画面サイズでの読みやすさとホバー・キーボード操作の反応を改善し、サイドバーの横方向のはみ出しを解消しました。フィールドと天候は専用アイコンで横並びに表示し、+ で追加した選択肢は選択解除後や再読み込み後もプールに残ります。「おおひでり」「おおあめ」「らんきりゅう」は天候選択画面に選択不可として表示します。
  <!-- changelog:end -->
- 1d8a5ac: <!-- changelog:start -->
  <!-- changelog:en -->
  Unified fine borders across panels, controls, pickers, and dialogs, with clearer button feedback, stat labels, and damage bars.
  <!-- changelog:zh-hans -->
  统一面板、控件、选择器和弹窗的细边框，并细化按钮反馈、能力值标签和伤害条，让界面更协调清晰。
  <!-- changelog:zh-hant -->
  統一面板、控制項、選擇器和彈窗的細邊框，並細化按鈕回饋、能力值標籤和傷害條，讓介面更協調清晰。
  <!-- changelog:ja -->
  パネル、操作ボタン、選択画面、ダイアログの枠線を細く統一し、ボタンの反応、能力値ラベル、ダメージバーも見やすく整えました。
  <!-- changelog:end -->
- d060718: <!-- changelog:start -->
  <!-- changelog:en -->
  Full-HP defenses now carry damage taken into the next move use instead of assuming full HP again. Multi-hit power details apply Multiscale and Shadow Shield only to the first damaging hit.
  <!-- changelog:zh-hans -->
  满 HP 防护现在会将受伤状态延续到下一次招式使用，不再重新假定满 HP。连续攻击的威力明细也只对首次造成伤害的攻击段应用多重鳞片和幻影防守减伤。
  <!-- changelog:zh-hant -->
  滿 HP 防護現在會將受傷狀態延續到下一次招式使用，不再重新假定滿 HP。連續攻擊的威力明細也只對首次造成傷害的攻擊段套用多重鱗片和幻影防守減傷。
  <!-- changelog:ja -->
  HP満タン時の防御効果は、受けたダメージを次の技の使用に引き継ぐようになりました。連続攻撃の威力詳細でも、マルチスケイルとファントムガードの軽減は最初にダメージを与える一撃だけに適用されます。
  <!-- changelog:end -->
- e4b2175: <!-- changelog:start -->
  <!-- changelog:en -->
  Pokémon and held-item images now load from PokeGauge’s dedicated asset domain.
  <!-- changelog:zh-hans -->
  宝可梦和携带道具图片现在通过 PokeGauge 自有素材域名加载。
  <!-- changelog:zh-hant -->
  寶可夢和攜帶道具圖片現在透過 PokeGauge 自有素材網域載入。
  <!-- changelog:ja -->
  ポケモンと持ち物の画像を PokeGauge 専用の素材ドメインから読み込むようになりました。
  <!-- changelog:end -->
- a558678: <!-- changelog:start -->
  <!-- changelog:en -->
  The home screen now uses the same Pokémon cards as Setup, with a clearer FORM button for choosing another form.
  <!-- changelog:zh-hans -->
  首页现在使用与参数设置一致的宝可梦卡片，并通过更清晰的 FORM 按钮选择其他形态。
  <!-- changelog:zh-hant -->
  首頁現在使用與參數設定一致的寶可夢卡片，並透過更清楚的 FORM 按鈕選擇其他形態。
  <!-- changelog:ja -->
  ホーム画面のポケモンカードを設定画面と統一し、別のフォルムを選ぶ FORM ボタンを分かりやすくしました。
  <!-- changelog:end -->
- 1053b29: <!-- changelog:start -->
  <!-- changelog:en -->
  Ability status dots now sit in the top-right corner, matching held items and saving horizontal space.
  <!-- changelog:zh-hans -->
  特性的红绿提示点统一移至右上角，与道具保持一致，减少横向空间占用。
  <!-- changelog:zh-hant -->
  特性的紅綠提示點統一移至右上角，與道具保持一致，減少橫向空間佔用。
  <!-- changelog:ja -->
  特性の赤・緑の表示を持ち物と同じ右上の位置に揃え、横幅を抑えました。
  <!-- changelog:end -->
- 8a0a820: <!-- changelog:start -->
  <!-- changelog:en -->
  Update Pokémon data from PokeAPI's Champions release.
  <!-- changelog:zh-hans -->
  更新来自 PokeAPI Champions 版本的宝可梦数据。
  <!-- changelog:zh-hant -->
  更新來自 PokeAPI Champions 版本的寶可夢資料。
  <!-- changelog:ja -->
  PokeAPI Champions リリースのポケモンデータを更新しました。
  <!-- changelog:end -->

## 0.3.0

### Minor Changes

- 44aea8d: <!-- changelog:start -->
  <!-- changelog:en -->
  The changelog now shows improvements before they are included in a release.
  <!-- changelog:zh-hans -->
  更新日志现在会显示尚未包含在正式版本中的改进。
  <!-- changelog:zh-hant -->
  更新記錄現在會顯示尚未包含在正式版本中的改進。
  <!-- changelog:ja -->
  更新履歴に、正式リリース前の改善も表示されるようになりました。
  <!-- changelog:end -->
- d272028: <!-- changelog:start -->
  <!-- changelog:en -->
  Open Settings from the header to manage language, stat labels, and the global probability mode alongside updates and credits.
  <!-- changelog:zh-hans -->
  从页头打开“设置”，集中管理语言、能力值标签和全局概率模式，并查看更新与致谢。
  <!-- changelog:zh-hant -->
  從頁首開啟「設定」，集中管理語言、能力值標籤和全域機率模式，並查看更新與致謝。
  <!-- changelog:ja -->
  ヘッダーの「設定」から、言語、能力値ラベル、全体の確率モードを管理し、更新とクレジットを確認できるようになりました。
  <!-- changelog:end -->
- e9c632e: <!-- changelog:start -->
  <!-- changelog:en -->
  Show item, ability, weather, terrain, and screen descriptions directly inside each Track.
  <!-- changelog:zh-hans -->
  可在每条 Track 内直接显示道具、特性、天气、场地和墙的说明。
  <!-- changelog:zh-hant -->
  可在每條 Track 內直接顯示道具、特性、天氣、場地和牆的說明。
  <!-- changelog:ja -->
  各 Track 内で、どうぐ、特性、天気、フィールド、壁の説明を直接表示できるようになりました。
  <!-- changelog:end -->

### Patch Changes

- b6e1197: <!-- changelog:start -->
  <!-- changelog:en -->
  Settings → Credits now shows the AGPL-3.0-only license and a link to the source code.
  <!-- changelog:zh-hans -->
  设置 → 致谢现在会显示 AGPL-3.0-only 许可证，并提供源代码链接。
  <!-- changelog:zh-hant -->
  設定 → 致謝現在會顯示 AGPL-3.0-only 授權條款，並提供原始碼連結。
  <!-- changelog:ja -->
  設定 → クレジットに AGPL-3.0-only ライセンスとソースコードへのリンクを表示するようになりました。
  <!-- changelog:end -->
- 1f12cba: <!-- changelog:start -->
  <!-- changelog:en -->
  Keep stat range axes visible and switch stat modes only from their headings.
  <!-- changelog:zh-hans -->
  修复区间模式选中后能力值数轴不可见的问题，并仅允许通过标题切换能力值模式。
  <!-- changelog:zh-hant -->
  修正區間模式選取後能力值數軸不可見的問題，並僅允許透過標題切換能力值模式。
  <!-- changelog:ja -->
  区間モード選択時の能力値軸を表示し、モード切り替えを見出しからのみ行えるようにしました。
  <!-- changelog:end -->
- 5920454: <!-- changelog:start -->
  <!-- changelog:en -->
  The changelog now labels recent improvements as "Latest changes".
  <!-- changelog:zh-hans -->
  更新记录现在使用“最新变更”来展示近期改进。
  <!-- changelog:zh-hant -->
  更新記錄現在使用「最新變更」來展示近期改進。
  <!-- changelog:ja -->
  更新履歴では、最近の改善が「最新の変更」と表示されるようになりました。
  <!-- changelog:end -->
- 35d14c1: <!-- changelog:start -->
  <!-- changelog:en -->
  Make stat range handles easier to drag on touch screens.
  <!-- changelog:zh-hans -->
  扩大能力值区间手柄的触控区域，让移动端拖动更加稳定。
  <!-- changelog:zh-hant -->
  擴大能力值區間手柄的觸控區域，讓行動裝置拖動更加穩定。
  <!-- changelog:ja -->
  能力値範囲ハンドルのタッチ領域を広げ、モバイルでドラッグしやすくしました。
  <!-- changelog:end -->
- db0cd9c: <!-- changelog:start -->
  <!-- changelog:en -->
  Correct ability support labels, disable irrelevant abilities, and apply selected assumed battle conditions to damage results.
  <!-- changelog:zh-hans -->
  修正特性支持标记，将无关特性显示为禁用状态，并在伤害结果中正确应用选中特性的默认战斗条件。
  <!-- changelog:zh-hant -->
  修正特性支援標記，將無關特性顯示為停用狀態，並在傷害結果中正確套用所選特性的預設戰鬥條件。
  <!-- changelog:ja -->
  特性の対応表示を修正し、無関係な特性を無効状態で表示して、選択した特性の想定条件をダメージ結果へ正しく反映します。
  <!-- changelog:end -->
- 566886c: <!-- changelog:start -->
  <!-- changelog:en -->
  Updates from the same version now appear together under one heading.
  <!-- changelog:zh-hans -->
  同一版本的更新现在会合并显示在一个标题下。
  <!-- changelog:zh-hant -->
  同一版本的更新現在會合併顯示在一個標題下。
  <!-- changelog:ja -->
  同じバージョンの更新が一つの見出しにまとめて表示されるようになりました。
  <!-- changelog:end -->
- a8af8f1: <!-- changelog:start -->
  <!-- changelog:en -->
  Mobile results now group rows by move with a clear move header and quieter row spacing.
  <!-- changelog:zh-hans -->
  移动端结果现在按招式分组，每一组都有清晰的招式标题，行间距更安静。
  <!-- changelog:zh-hant -->
  行動版結果現在按招式分組，每一組都有清晰的招式標題，行間距更安靜。
  <!-- changelog:ja -->
  モバイル版の結果は技ごとにグループ化され、各グループに明確な技見出しと静かな行間隔が表示されます。
  <!-- changelog:end -->
- e960d91: <!-- changelog:start -->
  <!-- changelog:en -->
  Mobile damage rows once again show their move type, move name, and active stat stages.
  <!-- changelog:zh-hans -->
  移动端伤害结果行现在会完整显示招式属性、招式名称和生效中的能力阶级。
  <!-- changelog:zh-hant -->
  行動版傷害結果列現在會完整顯示招式屬性、招式名稱和生效中的能力階級。
  <!-- changelog:ja -->
  モバイル版のダメージ結果行に、技のタイプ、技名、有効な能力ランクが再びすべて表示されます。
  <!-- changelog:end -->
- e5f0deb: <!-- changelog:start -->
  <!-- changelog:en -->
  Moves with an intrinsic high critical-hit rate now start with the correct odds, and feedback guidance appears more often.
  <!-- changelog:zh-hans -->
  自带高会心率的招式现在会使用正确的初始概率，同时反馈提示将更频繁地出现。
  <!-- changelog:zh-hant -->
  自帶高會心率的招式現在會使用正確的初始機率，同時意見回饋提示將更頻繁地出現。
  <!-- changelog:ja -->
  急所に当たりやすい技の初期確率を正しく反映し、フィードバック案内の表示頻度を上げました。
  <!-- changelog:end -->
