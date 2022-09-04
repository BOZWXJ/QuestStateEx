/**
 * 任務進捗詳細 Ver.2.5.7
 * Author:Nishisonic,Nekopanda
 * LastUpdate:2022/01/02
 */

data_prefix = "QSE.Ver2."
/** バージョン */
var VERSION = 2.57
/** バージョン確認URL */
var UPDATE_CHECK_URL = "https://api.github.com/repos/BOZWXJ/QuestStateEx/releases/latest"
/** ファイルの場所 */
var FILE_URL = [
    "https://raw.githubusercontent.com/BOZWXJ/QuestStateEx/master/quest__basic.js",
    "https://raw.githubusercontent.com/BOZWXJ/QuestStateEx/master/quest_stateEx.js",
    "https://raw.githubusercontent.com/BOZWXJ/QuestStateEx/master/questinfo.js",
    "https://raw.githubusercontent.com/BOZWXJ/QuestStateEx/master/queststyle.js",
    "https://raw.githubusercontent.com/BOZWXJ/QuestStateEx/master/update_questStateEx.js",
]

/** 艦種 */
var SHIP_TYPE = {
    /** 海防艦 */
    DE: 1,
    /** 駆逐艦 */
    DD: 2,
    /** 軽巡洋艦 */
    CL: 3,
    /** 重雷装巡洋艦 */
    CLT: 4,
    /** 重巡洋艦 */
    CA: 5,
    /** 航空巡洋艦 */
    CAV: 6,
    /** 軽空母 */
    CVL: 7,
    /** 巡洋戦艦(高速戦艦) */
    FBB: 8,
    /** 戦艦 */
    BB: 9,
    /** 航空戦艦 */
    BBV: 10,
    /** 正規空母 */
    CV: 11,
    /** 超弩級戦艦 */
    // BB:12,
    /** 潜水艦 */
    SS: 13,
    /** 潜水空母 */
    SSV: 14,
    /** 補給艦(敵) */
    E_AO: 15,
    /** 水上機母艦 */
    AV: 16,
    /**揚陸艦 */
    LHA: 17,
    /** 装甲空母 */
    CVB: 18,
    /** 工作艦 */
    AR: 19,
    /** 潜水母艦 */
    AS: 20,
    /** 練習巡洋艦 */
    CT: 21,
    /** 補給艦 */
    AO: 22,
}

/** 任務種別 */
var QUEST_TYPE = {
    /** デイリー */
    DAILY: 1,
    /** ウィークリー */
    WEEKLY: 2,
    /** マンスリー */
    MONTHLY: 3,
    /** 単発 */
    ONCE: 4,
    /** その他 */
    OTHERS: 5,
}

/** 任務状態 */
var QUEST_STATE = {
    /** 未受注 */
    NOT_ORDER: 1,
    /** 遂行中 */
    ACTIVE: 2,
    /**達成 */
    COMPLETE: 3,
}

/**任務進捗状況 */
var QUEST_PROGRESS_FLAG = {
    /** 空白(達成含) */
    NONE: 0,
    /** 50%以上 */
    HALF: 1,
    /** 80%以上 */
    EIGHTY: 2,
}

/** マス */
var EVENT_ID = {
    /** 初期位置 */
    INITIAL_POSITION: 0,
    /** 存在せず */
    NONE: 1,
    /** 資源 */
    MATERIAL: 2,
    /** 渦潮 */
    MAELSTROM: 3,
    /** 通常戦闘 */
    NORMAL_BATTLE: 4,
    /** ボス戦闘 */
    BOSS_BATTLE: 5,
    /** 気のせいだった */
    BATTLE_AVOIDED: 6,
    /** 航空戦or航空偵察 */
    AIR: 7,
    /** 船団護衛成功 */
    ESCORT_SUCCESS: 8,
    /** 揚陸地点 */
    LANDING_POINT: 9,
    /** 空襲戦 */
    AIR_RAID_BATTLE: 10,
}

/** 近代化改修 */
var POWERUP_FLAG = {
    /** 成功 */
    SUCCESS: 1,
    /** 失敗 */
    FAILURE: 0,
}

/** 遠征 */
var EXPEDITION = {
    /** 失敗 */
    FAILURE: 0,
    /** 成功 */
    SUCCESS: 1,
    /** 大成功 */
    GREAT_SUCCESS: 2,
}

/** リセット */
var RESET = {
    /** なし */
    NONE: 0,
    /** デイリー */
    DAILY: 1,
    /** ウィークリー */
    WEEKLY: 2,
    /** マンスリー */
    MONTHLY: 3,
    /** クォータリー */
    QUARTERLY: 4,
    /** イヤリー */
    YEARLY: 5,
    /** カウント=最大値でないならデイリー */
    NOT_SATISFY_DAILY: -1,
    /** カウント=最大値でないならウィークリー */
    NOT_SATISFY_WEEKLY: -2,
    /** カウント=最大値でないならマンスリー */
    NOT_SATISFY_MONTHLY: -3,
    /** カウント=最大値でないならクォータリー */
    NOT_SATISFY_QUARTERLY: -4,
    /** 1月 */
    JANUARY: 101,
    /** 2月 */
    FEBRUARY: 102,
    /** 3月 */
    MARCH: 103,
    /** 4月 */
    APRIL: 104,
    /** 5月 */
    MAY: 105,
    /** 6月 */
    JUNE: 106,
    /** 7月 */
    JULY: 107,
    /** 8月 */
    AUGUST: 108,
    /** 9月 */
    SEPTEMBER: 109,
    /** 10月 */
    OCTOBER: 110,
    /** 11月 */
    NOVEMBER: 111,
    /** 12月 */
    DECEMBER: 112,
}

/** 任務 */
var QUEST_DATA = {
    // #region 出撃
    /** [201]敵艦隊を撃破せよ！ */
    201: [
        /** 戦闘勝利 */
        new QuestData(1, true, true, RESET.DAILY),
    ],
    /** [210]敵艦隊を10回邀撃せよ！ */
    210: [
        /** 戦闘 */
        new QuestData(10, true, true, RESET.DAILY),
    ],
    /** [211]敵空母を3隻撃沈せよ！ */
    211: [
        /** (軽)空母撃沈 */
        new QuestData(3, true, true, RESET.DAILY),
    ],
    /** [212]敵輸送船団を叩け！ */
    212: [
        /** 補給艦撃沈 */
        new QuestData(5, true, true, RESET.DAILY),
    ],
    /** [213]海上通商破壊作戦 */
    213: [
        /** 補給艦撃沈 */
        new QuestData(20, true, true, RESET.WEEKLY),
    ],
    /** [214]あ号作戦 */
    214: [
        /** 出撃 */
        new QuestData(36, false, true, RESET.WEEKLY, "出撃"),
        /** S勝利 */
        new QuestData(6, false, true, RESET.WEEKLY, "S勝利"),
        /** ボス戦闘 */
        new QuestData(24, false, true, RESET.WEEKLY, "ボス戦闘"),
        /** ボス勝利 */
        new QuestData(12, false, true, RESET.WEEKLY, "ボス勝利"),
    ],
    /** [216]敵艦隊主力を撃滅せよ！ */
    216: [
        /** 道中戦闘またはボス勝利 */
        new QuestData(1, true, true, RESET.DAILY),
    ],
    /** [218]敵輸送船団を叩け！ */
    218: [
        /** 補給艦撃沈 */
        new QuestData(3, true, true, RESET.DAILY),
    ],
    /** [220]い号作戦 */
    220: [
        /** (軽)空母撃沈 */
        new QuestData(20, true, true, RESET.WEEKLY),
    ],
    /** [221]ろ号作戦 */
    221: [
        /** 補給艦撃沈 */
        new QuestData(50, true, true, RESET.WEEKLY),
    ],
    /** [226]南西諸島海域の制海権を握れ！ */
    226: [
        /** 南西海域(2-X)ボス勝利 */
        new QuestData(5, true, true, RESET.DAILY),
    ],
    /** [228]海上護衛戦 */
    228: [
        /** 潜水艦撃沈 */
        new QuestData(15, true, true, RESET.WEEKLY),
    ],
    /** [229]敵東方艦隊を撃滅せよ！ */
    229: [
        /** 東方海域(4-X)ボス勝利 */
        new QuestData(12, true, true, RESET.WEEKLY),
    ],
    /** [230]敵潜水艦を制圧せよ！ */
    230: [
        /** 潜水艦撃沈 */
        new QuestData(6, true, true, RESET.DAILY),
    ],
    /** [241]敵北方艦隊主力を撃滅せよ！ */
    241: [
        /** 北方海域(3-3~5)ボス勝利 */
        new QuestData(5, true, true, RESET.WEEKLY),
    ],
    /** [242]敵東方中枢艦隊を撃破せよ！ */
    242: [
        /** 敵東方中枢艦隊(4-4ボス)勝利 */
        new QuestData(1, true, true, RESET.WEEKLY),
    ],
    /** [243]南方海域珊瑚諸島沖の制空権を握れ！ */
    243: [
        /** 敵機動部隊本隊(5-2ボス)S勝利 */
        new QuestData(2, true, true, RESET.WEEKLY),
    ],
    /** [249]「第五戦隊」出撃せよ！ */
    249: [
        /** 敵主力艦隊(2-5ボス)S勝利 */
        new QuestData(1, true, true, RESET.MONTHLY, "2-5ボスS勝利"),
    ],
    /** [256]「潜水艦隊」出撃せよ！ */
    256: [
        /** 敵回航中空母(6-1ボス)S勝利 */
        new QuestData(3, true, true, RESET.MONTHLY, "6-1ボスS勝利"),
    ],
    /** [257]「水雷戦隊」南西へ！ */
    257: [
        /** 敵機動部隊(1-4ボス)S勝利 */
        new QuestData(1, true, true, RESET.MONTHLY, "1-4ボスS勝利"),
    ],
    /** [259]「水上打撃部隊」南方へ！ */
    259: [
        /** 敵前線司令艦隊(5-1ボス)S勝利 */
        new QuestData(1, true, true, RESET.MONTHLY, "5-1ボスS勝利"),
    ],
    /** [261]海上輸送路の安全確保に努めよ！ */
    261: [
        /** 敵通商破壊主力艦隊(1-5ボス)A勝利 */
        new QuestData(3, true, true, RESET.WEEKLY),
    ],
    /** [264]「空母機動部隊」西へ！ */
    264: [
        /** 東方主力艦隊(4-2ボス)S勝利 */
        new QuestData(1, true, true, RESET.MONTHLY, "4-2ボスS勝利"),
    ],
    /** [265]海上護衛強化月間 */
    265: [
        /** 敵通商破壊主力艦隊(1-5ボス)A勝利 */
        new QuestData(10, true, true, RESET.MONTHLY),
    ],
    /** [266]「水上反撃部隊」突入せよ！ */
    266: [
        /** 敵主力艦隊(2-5ボス)S勝利 */
        new QuestData(1, true, true, RESET.MONTHLY),
    ],
    /** [280]兵站線確保！海上警備を強化実施せよ！ */
    280: [
        /** 敵主力艦隊(1-2 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.MONTHLY, "1-2ボスS勝利"),
        /** 敵主力艦隊(1-3 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.MONTHLY, "1-3ボスS勝利"),
        /** 敵機動部隊(1-4 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.MONTHLY, "1-4ボスS勝利"),
        /** 敵主力艦隊(2-1 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.MONTHLY, "2-1ボスS勝利"),
    ],
    /** [284]南西諸島方面「海上警備行動」発令！ */
    284: [
        /** 敵機動部隊(1-4ボス戦)S勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "1-4ボスS勝利"),
        /** 敵主力部隊(2-1ボス戦)S勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "2-1ボスS勝利"),
        /** 敵通商破壊機動部隊 主力艦隊(2-2ボス)S勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "2-2ボスS勝利"),
        /** 敵主力打撃群(2-3ボス)S勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "2-3ボスS勝利"),
    ],
    /** [822]沖ノ島海域迎撃戦 */
    822: [
        /** 敵侵攻中核艦隊(2-4ボス)S勝利 */
        new QuestData(2, true, true, RESET.QUARTERLY),
    ],
    // /** [840]【節分任務】令和二年節分作戦 */
    // 840: [
    //     /** 敵機動部隊(1-4 ボス)A 勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "1-4ボスA勝利"),
    //     /** 敵主力部隊(2-1 ボス)A 勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "2-1ボスA勝利"),
    //     /** 敵通商破壊機動部隊 主力艦隊(2-2 ボス)A 勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "2-2ボスA勝利")
    // ],
    /** [840]【節分任務】令和三年節分作戦 */
    840: [
        /** 敵主力部隊(2-1 ボス)A 勝利 */
        new QuestData(1, false, true, RESET.WEEKLY, "2-1ボスA勝利"),
        /** 敵通商破壊機動部隊 主力艦隊(2-2 ボス)A 勝利 */
        new QuestData(1, false, true, RESET.WEEKLY, "2-2ボスA勝利"),
        /** 敵主力打撃群(2-3 ボス)A 勝利 */
        new QuestData(1, false, true, RESET.WEEKLY, "2-3ボスA勝利"),
    ],
    // /** [841]【節分任務】令和二年西方海域節分作戦 */
    /** 【節分任務】令和三年西方海域節分作戦 */
    841: [
        /** 敵深海連合部隊 司令部艦隊(4-1 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.WEEKLY, "4-1ボスS勝利"),
        /** 敵東方艦隊 強襲上陸主力艦隊(4-2 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.WEEKLY, "4-2ボスS勝利"),
        /** 敵東方港湾基地(4-3 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.WEEKLY, "4-3ボスS勝利")
    ],
    // /** [843]【節分拡張任務】令和二年節分作戦、全力出撃！ */
    // 843: [
    //     /** 敵南方増援部隊 本隊(5-4 ボス)S 勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "5-4ボスS勝利"),
    //     /** 深海南方任務部隊 本隊(5-5 ボス)S 勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "5-5ボスS勝利"),
    //     /** 離島守備隊(6-4 ボス)S 勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "6-4ボスS勝利")
    // ],
    /** [843]【節分拡張任務】令和三年節分作戦、全力出撃！ */
    843: [
        /** 敵南方増援部隊 本隊(5-2 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.WEEKLY, "5-2ボスS勝利"),
        /** 深海南方任務部隊 本隊(5-5 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.WEEKLY, "5-5ボスS勝利"),
        /** 離島守備隊(6-4 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.WEEKLY, "6-4ボスS勝利")
    ],
    /** [845]発令！「西方海域作戦」 */
    845: [
        /** 敵深海連合部隊 司令部艦隊(4-1 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "4-1ボスS勝利"),
        /** 敵東方艦隊 強襲上陸主力艦隊(4-2 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "4-2ボスS勝利"),
        /** 敵東方港湾基地(4-3 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "4-3ボスS勝利"),
        /** 敵東方中枢艦隊 旗艦(4-4 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "4-4ボスS勝利"),
        /** リランカ島港湾守備隊(4-5 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "4-5ボスS勝利"),
    ],
    /** [854]戦果拡張任務！「Z作戦」前段作戦 */
    854: [
        /** 敵侵攻中核艦隊(2-4ボス)A勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "2-4ボスA勝利"),
        /** 敵回航中空母(6-1ボス)A勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "6-1ボスA勝利"),
        /** 留守泊地旗艦艦隊(6-3ボス)A勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "6-3ボスA勝利"),
        /** 離島守備隊(6-4ボス)S勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "6-4ボスS勝利"),
    ],
    /** [861]強行輸送艦隊、抜錨！ */
    861: [
        /**  */
        new QuestData(2, true, true, RESET.QUARTERLY, "1-6"),
    ],
    /** [862]前線の航空偵察を実施せよ！ */
    862: [
        /** 留守泊地旗艦艦隊(6-3ボス)A勝利 */
        new QuestData(2, true, true, RESET.QUARTERLY),
    ],
    /** [872]戦果拡張任務！「Z作戦」後段作戦 */
    872: [
        /** 深海南方任務部隊 本隊(5-5ボス)S勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "5-5ボスS勝利"),
        /** 敵攻略部隊本体(6-2ボス)S勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "6-2ボスS勝利"),
        /** 任務部隊 主力群(6-5ボス)S勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "6-5ボスS勝利"),
        /** 深海任務部隊 主力機動部隊群(7-2-2ボス)S勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "7-2-2ボスS勝利"),
    ],
    /** [873]北方海域警備を実施せよ！ */
    873: [
        /** 敵北方侵攻艦隊(3-1ボス)A勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "3-1ボスA勝利"),
        /** 敵キス島包囲艦隊(3-2ボス)A勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "3-2ボスA勝利"),
        /** 深海棲艦泊地艦隊(3-3ボス)A勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "3-3ボスA勝利"),
    ],
    /** [875]精鋭「三一駆」、鉄底海域に突入せよ！ */
    875: [
        /** 敵補給部隊本体(5-4ボス)S勝利 */
        new QuestData(2, true, true, RESET.QUARTERLY),
    ],
    /** [888]新編成「三川艦隊」、鉄底海峡に突入せよ！ */
    888: [
        /** 敵前線司令艦隊(5-1ボス戦)S勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "5-1ボスS勝利"),
        /** 敵サーモン方面主力艦隊(5-3ボス戦)S勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "5-3ボスS勝利"),
        /** 敵補給部隊本体(5-4ボス)S勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "5-4ボスS勝利"),
    ],
    /** [893]泊地周辺海域の安全確保を徹底せよ！ */
    893: [
        /** 敵通商破壊主力潜水艦隊(1-5 ボス)S 勝利 */
        new QuestData(3, false, true, RESET.QUARTERLY, "1-5ボスS勝利"),
        /** 深海潜水艦隊集団 旗艦戦隊(7-1 ボス)S 勝利 */
        new QuestData(3, false, true, RESET.QUARTERLY, "7-1ボスS勝利"),
        /** セレベス海方面 旗艦哨戒潜水艦(7-2-G ボス)S 勝利 */
        new QuestData(3, false, true, RESET.QUARTERLY, "7-2-1ボスS勝利"),
        /** 深海任務部隊 主力機動部隊群(7-2-M ボス)S 勝利 */
        new QuestData(3, false, true, RESET.QUARTERLY, "7-2-2ボスS勝利"),
    ],
    /** [894]空母戦力の投入による兵站線戦闘哨戒 */
    894: [
        /** 敵主力艦隊(1-3 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "1-3ボスS勝利"),
        /** 敵機動部隊(1-4 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "1-4ボスS勝利"),
        /** 敵主力艦隊(2-1 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "2-1ボスS勝利"),
        /** 敵通商破壊機動部隊 主力艦隊(2-2 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "2-2ボスS勝利"),
        /** 敵主力打撃群(2-3 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "2-3ボスS勝利"),
    ],
    /** [903]拡張「六水戦」、最前線へ！ */
    903: [
        /** 敵南方前線司令艦隊(5-1 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "5-1ボスS勝利"),
        /** 敵南方増援部隊 本隊(5-4 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "5-4ボスS勝利"),
        /** 離島守備隊(6-4 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "6-4ボスS勝利"),
        /** 任務部隊 主力群(6-5 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "6-5ボスS勝利")
    ],
    /** [904]精鋭「十九駆」、躍り出る！ */
    904: [
        /** 敵侵攻中枢艦隊(2-5 ボス)S 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "2-5ボスS勝利"),
        /** 深海棲艦 北方艦隊中枢(3-4 ボス)S 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "3-4ボスS勝利"),
        /** リランカ島港湾守備隊(4-5 ボス)S 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "4-5ボスS勝利"),
        /** 敵南方艦隊 旗艦(5-3 ボス)S 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "5-3ボスS勝利")
    ],
    /** [905]「海防艦」、海を護る！ */
    905: [
        /** 敵主力艦隊(1-1 ボス)S 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "1-1ボスS勝利"),
        /** 敵主力艦隊(1-2 ボス)S 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "1-2ボスS勝利"),
        /** 敵主力艦隊(1-3 ボス)S 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "1-3ボスS勝利"),
        /** 敵通商破壊主力潜水艦隊(1-5 ボス)S 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "1-5ボスS勝利"),
        /** 鎮守府近海航路(1-6)ゴール地点到達 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "1-6ボスS勝利")
    ],
    // /** [906]【桃の節句作戦】鎮守府近海の安全を図れ！ */
    // 906: [
    //     /** 敵主力艦隊(1-2 ボス)A 勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "1-2ボスA勝利"),
    //     /** 敵主力艦隊(1-3 ボス)A 勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "1-3ボスA勝利"),
    //     /** 敵通商破壊主力潜水艦隊(1-5 ボス)A 勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "1-5ボスA勝利"),
    //     /** 鎮守府近海航路(1-6)ゴール地点到達 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "1-6ボス到達"),
    //     /** 敵主力艦隊(2-1 ボス)A 勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "2-1ボスA勝利")
    // ],
    /** [906]【桃の節句】鎮守府近海、春の安全確保作戦 */
    906: [
        /** 敵主力艦隊(1-2 ボス)A 勝利 */
        new QuestData(1, false, true, RESET.WEEKLY, "1-2ボスA勝利"),
        /** 敵主力艦隊(1-3 ボス)A 勝利 */
        new QuestData(1, false, true, RESET.WEEKLY, "1-3ボスA勝利"),
        /** 敵通商破壊主力潜水艦隊(1-5 ボス)A 勝利 */
        new QuestData(1, false, true, RESET.WEEKLY, "1-5ボスA勝利"),
        /** 鎮守府近海航路(1-6)ゴール地点到達 */
        new QuestData(1, false, true, RESET.WEEKLY, "1-6ボス到達"),
    ],
    /** [907]【桃の節句】南西諸島海域、春の戦闘哨戒！ */
    907: [
        /** 敵主力艦隊(2-1 ボス)S 勝利 */
        new QuestData(2, false, true, RESET.WEEKLY, "2-1ボスS勝利"),
        /** 敵通商破壊機動部隊 主力艦隊(2-2ボス)S勝利 */
        new QuestData(2, false, true, RESET.WEEKLY, "2-2ボスS勝利"),
        /** 敵主力打撃群(2-3ボス)S勝利 */
        new QuestData(2, false, true, RESET.WEEKLY, "2-3ボスS勝利"),
    ],
    // /** [909]【桃の節句作戦】主力オブ主力、駆ける！ */
    // 909: [
    //     /** 敵通商破壊機動部隊 主力艦隊(2-2ボス)A勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "2-2ボスA勝利"),
    //     /** 敵主力打撃群(2-3ボス)A勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "2-3ボスA勝利"),
    //     /** 北方増援部隊主力(3-5 ボス)A 勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "3-5ボスA勝利"),
    //     /** 深海任務部隊 主力機動部隊群(7-2-2 ボス)A 勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "7-2-2ボスA勝利"),
    //     /** 深海任務部隊 泊地急襲任務群(E-1-1 ボス)S 勝利 */
    //     new QuestData(1, false, true, RESET.WEEKLY, "E-1-1ボスS勝利")
    // ],
    /** [909]【桃の節句：拡張作戦】春の攻勢作戦！ */
    909: [
        /** 北方増援部隊主力(3-5 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.WEEKLY, "3-5ボスS勝利"),
        /** リランカ島港湾守備隊(4-5 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "4-5ボスS勝利"),
        /** 離島守備隊(6-4 ボス)S 勝利 */
        new QuestData(1, false, true, RESET.QUARTERLY, "6-4ボスS勝利"),
    ],
    /** [912]工作艦「明石」護衛任務 */
    912: [
        /** 敵主力艦隊(1-3 ボス)A 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "1-3ボスA勝利"),
        /** 鎮守府近海航路(1-6)ゴール地点到達 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "1-6ボス到達"),
        /** 敵主力艦隊(2-1 ボス)A 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "2-1ボスA勝利"),
        /** 敵通商破壊機動部隊 主力艦隊(2-2ボス)A勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "2-2ボスA勝利"),
        /** 敵主力打撃群(2-3ボス)A勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "2-3ボスA勝利"),
    ],
    /**[914]重巡戦隊、西へ！ */
    914: [
        /** 敵深海連合部隊 司令部艦隊(4-1 ボス)A 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "4-1ボスA勝利"),
        /** 敵東方艦隊 強襲上陸主力艦隊(4-2 ボス)A 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "4-2ボスA勝利"),
        /** 敵東方港湾基地(4-3 ボス)A 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "4-3ボスA勝利"),
        /** 敵東方中枢艦隊 旗艦(4-4 ボス)A 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "4-4ボスA勝利"),
    ],
    /**[928]歴戦「第十方面艦隊」、全力出撃！ */
    928: [
        /** 敵東方艦隊 強襲上陸主力艦隊(4-2 ボス)S 勝利 */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "4-2ボスS勝利"),
        /** 深海任務部隊 主力機動部隊群(7-2-2 ボス)S 勝利 */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "7-2-2ボスS勝利"),
        /** 深海東方部隊 海峡封鎖部隊旗艦(7-3-2 ボス)S 勝利 */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "7-3-2ボスS勝利"),
    ],
    /**[946]空母機動部隊、出撃！敵艦隊を迎撃せよ！ */
    946: [
        /** 敵通商破壊機動部隊 主力艦隊(2-2ボス)S勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.JUNE], "2-2ボスS勝利"),
        /** 敵主力打撃群(2-3ボス)S勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.JUNE], "2-3ボスS勝利"),
        /** 敵侵攻中核艦隊(2-4ボス)S勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.JUNE], "2-4ボスS勝利"),
    ],
    /**[947]AL 作戦 */
    947: [
        /** 敵北方侵攻艦隊(3-1 ボス)S 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.JUNE], "3-1ボスS勝利"),
        /** 敵深海北方泊地艦隊(3-3 ボス)S 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.JUNE], "3-3ボスS勝利"),
        /** 深海棲艦 北方艦隊中枢(3-4 ボス)S 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.JUNE], "3-4ボスS勝利"),
        /** 北方増援部隊主力(3-5 ボス)S 勝利 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.JUNE], "3-5ボスS勝利"),
    ],
    /**[948]機動部隊決戦 */
    948: [
        /** 敵任務部隊 機動部隊本隊(5-2 ボス)S 勝利 */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.JUNE], "5-2ボスS勝利"),
        /** 深海南方任務部隊 本隊(5-5 ボス)S 勝利 */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.JUNE], "5-5ボスS勝利"),
        /** 任務部隊 主力群(6-5 ボス)S 勝利 */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.JUNE], "6-5ボスS勝利"),
        /** 離島守備隊(6-4 ボス)A 勝利 */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.JUNE], "6-4ボスA勝利"),
    ],
    // #endregion
    // #region 演習
    /** [302]大規模演習 */
    302: [
        /**  */
        new QuestData(20, true, true, RESET.WEEKLY),
    ],
    /** [303]「演習」で練度向上！ */
    303: [
        /**  */
        new QuestData(3, true, true, RESET.DAILY),
    ],
    /** [304]「演習」で他提督を圧倒せよ！ */
    304: [
        /** 勝利 */
        new QuestData(5, true, true, RESET.DAILY),
    ],
    /** [311]精鋭艦隊演習 */
    311: [
        /** 勝利 */
        new QuestData(7, true, true, RESET.DAILY),
    ],
    /** [318]給糧艦「伊良湖」の支援 */
    318: [
        /** 勝利 */
        new QuestData(3, false, true, [RESET.NOT_SATISFY_DAILY, RESET.MONTHLY], "演習B勝利"),
        /** 戦闘糧食 */
        new QuestData(1, false, false, RESET.NONE, "「戦闘糧食」装備"),
    ],
    /** [329]【節分任務】節分演習！ */
    329: [
        /** S勝利 */
        new QuestData(3, true, true, RESET.DAILY),
    ],
    /** [330]空母機動部隊、演習始め！ */
    330: [
        /** 勝利 */
        new QuestData(4, true, true, [RESET.NOT_SATISFY_DAILY, RESET.QUARTERLY]),
    ],
    /** [337]「十八駆」演習！ */
    337: [
        /** S勝利 */
        new QuestData(3, true, true, [RESET.NOT_SATISFY_DAILY, RESET.QUARTERLY]),
    ],
    /** [339]「十九駆」演習！ */
    339: [
        /** S勝利 */
        new QuestData(3, true, true, [RESET.NOT_SATISFY_DAILY, RESET.YEARLY, RESET.FEBRUARY]),
    ],
    /** [340]【桃の節句任務】桃の節句演習！ */
    340: [
        /** S勝利 */
        new QuestData(3, true, true, [RESET.NOT_SATISFY_DAILY, RESET.WEEKLY]),
    ],
    /** [342]小艦艇群演習強化任務 */
    342: [
        /** A勝利 */
        new QuestData(4, true, true, [RESET.NOT_SATISFY_DAILY, RESET.QUARTERLY]),
    ],
    /** [345]演習ティータイム！ */
    345: [
        /** A勝利 */
        new QuestData(4, true, true, [RESET.NOT_SATISFY_DAILY, RESET.YEARLY, RESET.OCTOBER]),
    ],
    /** [346]最精鋭！主力オブ主力、演習開始！ */
    346: [
        /** S勝利 */
        new QuestData(4, true, true, [RESET.NOT_SATISFY_DAILY, RESET.YEARLY, RESET.OCTOBER]),
    ],
    /** [348]「精鋭軽巡」演習！ */
    348: [
        /** A勝利 */
        new QuestData(4, true, true, [RESET.NOT_SATISFY_DAILY, RESET.YEARLY, RESET.FEBRUARY]),
    ],
    /** [350]精鋭「第七駆逐隊」演習開始！ */
    350: [
        /** A勝利 */
        new QuestData(3, true, true, [RESET.NOT_SATISFY_DAILY, RESET.YEARLY, RESET.MARCH]),
    ],
    /** [353]「巡洋艦戦隊」演習！ */
    353: [
        /** 勝利 */
        new QuestData(5, true, true, [RESET.NOT_SATISFY_DAILY, RESET.YEARLY, RESET.JUNE]),
    ],
    /** [354]「改装特務空母」任務部隊演習！ */
    354: [
        /** S勝利 */
        new QuestData(4, true, true, [RESET.NOT_SATISFY_DAILY, RESET.YEARLY, RESET.JULY]),
    ],
    /** [355]精鋭「第十五駆逐隊」第一小隊演習！ */
    355: [
        /** S勝利 */
        new QuestData(4, true, true, [RESET.NOT_SATISFY_DAILY, RESET.YEARLY, RESET.OCTOBER]),
    ],
    // #endregion
    // #region 遠征
    /** [402]「遠征」を3回成功させよう！ */
    402: [
        /** 成功 */
        new QuestData(3, true, true, RESET.DAILY),
    ],
    /** [403]「遠征」を10回成功させよう！ */
    403: [
        /** 成功 */
        new QuestData(10, true, true, RESET.DAILY),
    ],
    /** [404]大規模遠征作戦、発令！ */
    404: [
        /** 成功 */
        new QuestData(30, true, true, RESET.WEEKLY),
    ],
    /** [410]南方への輸送作戦を成功させよ！ */
    410: [
        /** 「東京急行」or「東京急行(弐)」成功 */
        new QuestData(1, true, true, RESET.WEEKLY),
    ],
    /** [411]南方への鼠輸送を継続実施せよ！ */
    411: [
        /** 「東京急行」or「東京急行(弐)」成功 */
        new QuestData(6, true, true, RESET.WEEKLY),
    ],
    /** [424]輸送船団護衛を強化せよ！ */
    424: [
        /** 「海上護衛任務」成功 */
        new QuestData(4, true, true, RESET.MONTHLY),
    ],
    /** [426]海上通商航路の警戒を厳とせよ！ */
    426: [
        /** 「警備任務」成功 */
        new QuestData(1, false, true, RESET.QUARTERLY, "警備任務"),
        /** 「対潜警戒任務」成功 */
        new QuestData(1, false, true, RESET.QUARTERLY, "対潜警戒任務"),
        /** 「海上護衛任務」成功 */
        new QuestData(1, false, true, RESET.QUARTERLY, "海上護衛任務"),
        /** 「強行偵察任務」成功 */
        new QuestData(1, false, true, RESET.QUARTERLY, "強行偵察任務"),
    ],
    /** [428]近海に侵入する敵潜を制圧せよ！ */
    428: [
        /** 「対潜警戒任務」成功 */
        new QuestData(2, false, true, RESET.QUARTERLY, "対潜警戒任務"),
        /** 「海峡警備行動」成功 */
        new QuestData(2, false, true, RESET.QUARTERLY, "海峡警備行動"),
        /** 「長時間対潜警戒」成功 */
        new QuestData(2, false, true, RESET.QUARTERLY, "長時間対潜警戒"),
    ],
    /** [434]特設護衛船団司令部、活動開始！ */
    434: [
        /** 「警備任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "警備任務"),
        /** 「海上護衛任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "海上護衛任務"),
        /** 「兵站強化任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "兵站強化任務"),
        /** 「海峡警備行動」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "海峡警備行動"),
        /** 「タンカー護衛任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "タンカー護衛任務"),
    ],
    /** [435]特設護衛船団司令部、活動開始！ */
    435: [
        /** 「対潜警戒任務」成功 */
        new QuestData(1, false, true, RESET.WEEKLY, "対潜警戒任務"),
        /** 「長時間対潜警戒」成功 */
        new QuestData(1, false, true, RESET.WEEKLY, "長時間対潜警戒"),
        /** 「強行偵察任務」成功 */
        new QuestData(1, false, true, RESET.WEEKLY, "強行偵察任務"),
        /** 「包囲陸戦隊撤収作戦」成功 */
        new QuestData(1, false, true, RESET.WEEKLY, "包囲陸戦隊撤収作戦"),
        /** 「南西方面航空偵察作戦」成功 */
        new QuestData(1, false, true, RESET.WEEKLY, "南西方面航空偵察作戦"),
    ],
    /** [436]練習航海及び警備任務を実施せよ！ */
    436: [
        /** 「練習航海」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "練習航海"),
        /** 「長距離練習航海」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "長距離練習航海"),
        /** 「警備任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "警備任務"),
        /** 「対潜警戒任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "対潜警戒任務"),
        /** 「強行偵察任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "強行偵察任務"),
    ],
    /** [437]小笠原沖哨戒線の強化を実施せよ！ */
    437: [
        /** 「対潜警戒任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MAY], "対潜警戒任務"),
        /** 「小笠原沖哨戒線」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MAY], "小笠原沖哨戒線"),
        /** 「小笠原沖戦闘哨戒」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MAY], "小笠原沖戦闘哨戒"),
        /** 「南西方面航空偵察作戦」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MAY], "南西方面航空偵察作戦"),
    ],
    /** [438]南西諸島方面の海上護衛を強化せよ！ */
    438: [
        /** 「兵站強化任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.AUGUST], "兵站強化任務"),
        /** 「対潜警戒任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.AUGUST], "対潜警戒任務"),
        /** 「タンカー護衛任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.AUGUST], "タンカー護衛任務"),
        /** 「南西諸島捜索撃滅戦」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.AUGUST], "南西諸島捜索撃滅戦"),
    ],
    /** [439]兵站強化遠征任務【基本作戦】 */
    439: [
        /** 「海上護衛任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "海上護衛任務"),
        /** 「兵站強化任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "兵站強化任務"),
        /** 「ボーキサイト輸送任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "ボーキサイト輸送任務"),
        /** 「南西方面航空偵察作戦」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "南西方面航空偵察作戦"),
    ],
    /** [440]兵站強化遠征任務【拡張作戦】 */
    440: [
        /** 「ブルネイ泊地沖哨戒」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "ブルネイ泊地沖哨戒"),
        /** 「海上護衛任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "海上護衛任務"),
        /** 「水上機前線輸送」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "水上機前線輸送"),
        /** 「強行鼠輸送作戦」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "強行鼠輸送作戦"),
        /** 「南西海域戦闘哨戒」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "南西海域戦闘哨戒"),
    ],
    /** [442]西方連絡作戦準備を実施せよ！ */
    442: [
        /** 「西方海域偵察作戦」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "西方海域偵察作戦"),
        /** 「潜水艦派遣演習」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "潜水艦派遣演習"),
        /** 「潜水艦派遣作戦」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "潜水艦派遣作戦"),
        /** 「欧州方面友軍との接触」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.FEBRUARY], "欧州方面友軍との接触"),
    ],
    /** [444]新兵装開発資材輸送を船団護衛せよ！ */
    444: [
        /** 「海上護衛任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "海上護衛任務"),
        /** 「資源輸送任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "資源輸送任務"),
        /** 「タンカー護衛任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "タンカー護衛任務"),
        /** 「南西方面航空偵察作戦」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "南西方面航空偵察作戦"),
        /** 「ボーキサイト輸送任務」成功 */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.MARCH], "ボーキサイト輸送任務"),
    ],
    // #endregion
    // #region 補給/入渠
    /** [503]艦隊大整備！ */
    503: [
        /** 入渠 */
        new QuestData(5, true, true, RESET.DAILY),
    ],
    /** [504]艦隊酒保祭り！ */
    504: [
        /** 補給(一括は1回) */
        new QuestData(15, true, true, RESET.DAILY),
    ],
    // #endregion
    // #region 工廠
    /** [605]新装備「開発」指令 */
    605: [
        /** 開発 */
        new QuestData(1, true, true, RESET.DAILY),
    ],
    /** [606]新造艦「建造」指令 */
    606: [
        /** 建造 */
        new QuestData(1, true, true, RESET.DAILY),
    ],
    /** [607]装備「開発」集中強化！ */
    607: [
        /** 開発 */
        new QuestData(3, false, true, RESET.DAILY),
    ],
    /** [608]新造艦「建造」指令 */
    608: [
        /** 建造 */
        new QuestData(3, false, true, RESET.DAILY),
    ],
    /** [609]軍縮条約対応！ */
    609: [
        /** 解体(一括は別々) */
        new QuestData(2, true, true, RESET.DAILY),
    ],
    /** [613]資源の再利用 */
    613: [
        /** 廃棄(一括は1回) */
        new QuestData(24, true, true, RESET.WEEKLY),
    ],
    /** [619]装備の改修強化 */
    619: [
        /** 改修(失敗可) */
        new QuestData(1, true, true, RESET.DAILY),
    ],
    /** [626]精鋭「艦戦」隊の新編成 */
    626: [
        /** 「零式艦戦21型」廃棄 */
        new QuestData(2, false, true, RESET.MONTHLY, "「零式艦戦21型」廃棄"),
        /** 「九六式艦戦」廃棄 */
        new QuestData(1, false, true, RESET.MONTHLY, "「九六式艦戦」廃棄"),
    ],
    /** [628]機種転換 */
    628: [
        /** 「零式艦戦52型」廃棄 */
        new QuestData(2, true, true, RESET.MONTHLY),
    ],
    /** [637]「熟練搭乗員」養成 */
    637: [
        /** 練度maxかつ改修max「九六式艦戦」搭載「鳳翔」旗艦 */
        new QuestData(1, false, false, RESET.NONE),
    ],
    /** [638]対空機銃量産 */
    638: [
        /** 「機銃」廃棄(一括は別々) */
        new QuestData(6, true, true, RESET.WEEKLY),
    ],
    /** [640]新型兵装開発整備の強化 */
    640: [
        /** 「小口径主砲」廃棄(一括は別々) */
        new QuestData(6, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "「小口径主砲」廃棄"),
        /** 「中口径主砲」廃棄(一括は別々) */
        new QuestData(5, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "「中口径主砲」廃棄"),
        /** 「魚雷」廃棄(一括は別々) */
        new QuestData(4, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "「魚雷」廃棄"),
        /** 「鋼材」用意 */
        new QuestData(4000, false, false, RESET.NONE, "「鋼材」用意"),
    ],
    /** [643]主力「陸攻」の調達 */
    643: [
        /** 「零式艦戦21型」廃棄(一括は別々) */
        new QuestData(2, false, true, RESET.QUARTERLY, "「零式艦戦21型」廃棄"),
        /** 「九六式陸攻」用意 */
        new QuestData(1, false, false, RESET.NONE, "「九六式陸攻」用意"),
        /** 「九七式艦攻」用意 */
        new QuestData(2, false, false, RESET.NONE, "「九七式艦攻」用意"),
    ],
    /** [645]「洋上補給」物資の調達 */
    645: [
        /** 「三式弾」廃棄(一括は別々) */
        new QuestData(1, false, true, RESET.MONTHLY, "「三式弾」廃棄"),
        /** 「燃料」用意 */
        new QuestData(750, false, false, RESET.NONE, "「燃料」用意"),
        /** 「弾薬」用意 */
        new QuestData(750, false, false, RESET.NONE, "「弾薬」用意"),
        /** 「ドラム缶(輸送用)」用意 */
        new QuestData(2, false, false, RESET.NONE, "「ドラム缶(輸送用)」用意"),
        /** 「九一式徹甲弾」用意 */
        new QuestData(1, false, false, RESET.NONE, "「九一式徹甲弾」用意"),
    ],
    /** [653]工廠稼働！次期作戦準備！ */
    653: [
        /** 「14cm単装砲」廃棄(一括は別々) */
        new QuestData(6, false, true, RESET.QUARTERLY, "「14cm単装砲」廃棄"),
        /** 「35.6cm連装砲」用意 */
        new QuestData(3, false, false, RESET.NONE, "「35.6cm連装砲」用意"),
        /** 「九六式艦戦」用意 */
        new QuestData(3, false, false, RESET.NONE, "「九六式艦戦」用意"),
    ],
    /** [654]精鋭複葉機飛行隊の編成 */
    654: [
        /** 「Swordfish」廃棄(一括は別々) */
        new QuestData(1, false, true, [RESET.YEARLY, RESET.OCTOBER], "「Swordfish」廃棄"),
        /** 「Fulmar」廃棄(一括は別々) */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.OCTOBER], "「Fulmar」廃棄"),
        /** 「弾薬」用意 */
        new QuestData(1500, false, false, RESET.NONE, "「弾薬」用意"),
        /** 「ボーキサイト」用意 */
        new QuestData(1500, false, false, RESET.NONE, "「ボーキサイト」用意"),
    ],
    /** [655]工廠フル稼働！新兵装を開発せよ！ */
    655: [
        /** 「小口径主砲」廃棄(一括は別々) */
        new QuestData(6, false, true, [RESET.YEARLY, RESET.NOVEMBER], "「小口径主砲」廃棄"),
        /** 「中口径主砲」廃棄(一括は別々) */
        new QuestData(5, false, true, [RESET.YEARLY, RESET.NOVEMBER], "「中口径主砲」廃棄"),
        /** 「大口径主砲」廃棄(一括は別々) */
        new QuestData(5, false, true, [RESET.YEARLY, RESET.NOVEMBER], "「大口径主砲」廃棄"),
        /** 「水偵」廃棄(一括は別々) */
        new QuestData(5, false, true, [RESET.YEARLY, RESET.NOVEMBER], "「水偵」廃棄"),
        /** 「艦攻」廃棄(一括は別々) */
        new QuestData(5, false, true, [RESET.YEARLY, RESET.NOVEMBER], "「艦攻」廃棄"),
        /** 「燃料」用意 */
        new QuestData(1500, false, false, RESET.NONE, "「燃料」用意"),
        /** 「鋼材」用意 */
        new QuestData(1500, false, false, RESET.NONE, "「鋼材」用意"),
        /** 「ボーキサイト」用意 */
        new QuestData(1500, false, false, RESET.NONE, "「ボーキサイト」用意"),
    ],
    /** [657]新型兵装開発整備の強化 */
    657: [
        /** 「小口径主砲」廃棄(一括は別々) */
        new QuestData(6, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "「小口径主砲」廃棄"),
        /** 「中口径主砲」廃棄(一括は別々) */
        new QuestData(5, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "「中口径主砲」廃棄"),
        /** 「魚雷」廃棄(一括は別々) */
        new QuestData(4, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "「魚雷」廃棄"),
        /** 「鋼材」用意 */
        new QuestData(4000, false, false, RESET.NONE, "「鋼材」用意"),
    ],
    /** [663]新型艤装の継続研究 */
    663: [
        /** 「大口径主砲」廃棄(一括は別々) */
        new QuestData(10, false, true, RESET.QUARTERLY, "「大口径主砲」廃棄"),
        /** 「鋼材」用意 */
        new QuestData(18000, false, false, RESET.NONE, "「鋼材」用意"),
    ],
    /** [673]装備開発力の整備 */
    673: [
        /** 「小口径主砲」廃棄(一括は別々) */
        new QuestData(4, true, true, RESET.DAILY),
    ],
    /** [674]工廠環境の整備 */
    674: [
        /** 「機銃」廃棄(一括は別々) */
        new QuestData(3, false, true, RESET.DAILY, "「機銃」廃棄"),
        /** 「鋼材」用意 */
        new QuestData(300, false, false, RESET.NONE, "「鋼材」用意"),
    ],
    /** [675]運用装備の統合整備 */
    675: [
        /** 「艦戦」廃棄(一括は別々) */
        new QuestData(6, false, true, RESET.QUARTERLY, "「艦戦」廃棄"),
        /** 「機銃」廃棄(一括は別々) */
        new QuestData(4, false, true, RESET.QUARTERLY, "「機銃」廃棄"),
        /** 「ボーキサイト」用意 */
        new QuestData(800, false, false, RESET.NONE, "「ボーキサイト」用意"),
    ],
    /** [676]装備開発力の集中整備 */
    676: [
        /** 「中口径主砲」廃棄(一括は別々) */
        new QuestData(3, false, true, RESET.WEEKLY, "「中口径主砲」廃棄"),
        /** 「副砲」廃棄(一括は別々) */
        new QuestData(3, false, true, RESET.WEEKLY, "「副砲」廃棄"),
        /** 「ドラム缶(輸送用)」廃棄(一括は別々) */
        new QuestData(1, false, true, RESET.WEEKLY, "「ドラム缶(輸送用)」廃棄"),
        /** 「鋼材」用意 */
        new QuestData(2400, false, false, RESET.NONE, "「鋼材」用意"),
    ],
    /** [677]継戦支援能力の整備 */
    677: [
        /** 「大口径主砲」廃棄(一括は別々) */
        new QuestData(4, false, true, RESET.WEEKLY, "「大口径主砲」廃棄"),
        /** 「水上偵察機」廃棄(一括は別々) */
        new QuestData(2, false, true, RESET.WEEKLY, "「水上偵察機」廃棄"),
        /** 「魚雷」廃棄(一括は別々) */
        new QuestData(3, false, true, RESET.WEEKLY, "「魚雷」廃棄"),
        /** 「鋼材」用意 */
        new QuestData(3600, false, false, RESET.NONE, "「鋼材」用意"),
    ],
    /** [678]主力艦上戦闘機の更新 */
    678: [
        /** 「九六式艦戦」廃棄(一括は別々) */
        new QuestData(3, false, true, RESET.QUARTERLY, "「九六式艦戦」廃棄"),
        /** 「零式艦戦21型」廃棄(一括は別々) */
        new QuestData(5, false, true, RESET.QUARTERLY, "「零式艦戦21型」廃棄"),
        /** 「ボーキサイト」用意 */
        new QuestData(4000, false, false, RESET.NONE, "「ボーキサイト」用意"),
        /** 秘書艦一番及び二番スロットに「零式艦戦52型」装備 */
        new QuestData(1, false, false, RESET.NONE, "「零式艦戦52型」装備"),
    ],
    /** [680]対空兵装の整備拡充 */
    680: [
        /** 「機銃」廃棄(一括は別々) */
        new QuestData(4, false, true, RESET.QUARTERLY, "「機銃」廃棄"),
        /** 「電探」廃棄(一括は別々) */
        new QuestData(4, false, true, RESET.QUARTERLY, "「電探」廃棄"),
        /** 「ボーキサイト」用意 */
        new QuestData(1500, false, false, RESET.NONE, "「ボーキサイト」用意"),
    ],
    /** [681]航空戦力の再編増強準備 */
    681: [
        /** 「艦爆」廃棄(一括は別々) */
        new QuestData(4, false, true, [RESET.YEARLY, RESET.JANUARY], "「艦爆」廃棄"),
        /** 「艦攻」廃棄(一括は別々) */
        new QuestData(4, false, true, [RESET.YEARLY, RESET.JANUARY], "「艦攻」廃棄"),
        /** 「開発資材」用意 */
        new QuestData(20, false, false, RESET.NONE, "「開発資材」用意"),
        /** 「ボーキサイト」用意 */
        new QuestData(1600, false, false, RESET.NONE, "「ボーキサイト」用意"),
    ],
    /** [686]戦時改修A型高角砲の量産 */
    686: [
        /** 「10cm連装高角砲」廃棄(一括は別々) */
        new QuestData(4, false, true, RESET.QUARTERLY, "「10cm連装高角砲」廃棄"),
        /** 「94式高射装置」廃棄(一括は別々) */
        new QuestData(1, false, true, RESET.QUARTERLY, "「94式高射装置」廃棄"),
        /** 「鋼材」用意 */
        new QuestData(900, false, false, RESET.NONE, "「鋼材」用意"),
    ],
    /** [688]航空戦力の強化 */
    688: [
        /** 「艦戦」廃棄(一括は別々) */
        new QuestData(3, false, true, RESET.QUARTERLY, "「艦戦」廃棄"),
        /** 「艦爆」廃棄(一括は別々) */
        new QuestData(3, false, true, RESET.QUARTERLY, "「艦爆」廃棄"),
        /** 「艦攻」廃棄(一括は別々) */
        new QuestData(3, false, true, RESET.QUARTERLY, "「艦攻」廃棄"),
        /** 「水偵」廃棄(一括は別々) */
        new QuestData(3, false, true, RESET.QUARTERLY, "「水偵」廃棄"),
        /** 「ボーキサイト」用意 */
        new QuestData(1800, false, false, RESET.NONE, "「ボーキサイト」用意"),
    ],
    // #endregion
    // #region 近代化改修
    /** [702]艦の「近代化改修」を実施せよ！ */
    702: [
        /** 近代化改修成功 */
        new QuestData(2, true, true, RESET.DAILY),
    ],
    /** [703]「近代化改修」を進め、戦備を整えよ！ */
    703: [
        /** 近代化改修成功 */
        new QuestData(15, true, true, RESET.WEEKLY),
    ],
    /** [707]【桃の節句任務】駆逐艦桃の節句改修 */
    707: [
        /** 近代化改修成功 */
        new QuestData(2, true, true, RESET.WEEKLY),
    ],
    /** [708]【桃の節句任務】海防艦桃の節句改修 */
    708: [
        /** 近代化改修成功 */
        new QuestData(2, true, true, RESET.WEEKLY),
    ],
    // /** [712]【桃の節句任務】菱餅改修：週 */
    // 712: [
    //     /** 近代化改修成功 */
    //     new QuestData(2, true, true, RESET.WEEKLY),
    // ],
    /** [712]【桃の節句】菱餅改修：2021 週 */
    712: [
        /** 近代化改修成功 */
        new QuestData(2, true, true, RESET.WEEKLY, "「近代化改修」成功"),
        /** 「開発資材」用意 */
        new QuestData(20, false, false, RESET.NONE, "「開発資材」用意"),
        /** 「弾薬」用意 */
        new QuestData(2400, false, false, RESET.NONE, "「弾薬」用意"),
        /** 「鋼材」用意 */
        new QuestData(2400, false, false, RESET.NONE, "「鋼材」用意"),
    ],
    /** [714]「駆逐艦」の改修工事を実施せよ！ */
    714: [
        /** 近代化改修成功 */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.NOVEMBER], "「近代化改修」成功"),
        /** 「鋼材」用意 */
        new QuestData(600, false, false, RESET.NONE, "「鋼材」用意"),
        /** 「ボーキサイト」用意 */
        new QuestData(300, false, false, RESET.NONE, "「ボーキサイト」用意"),
    ],
    /** [715]続：「駆逐艦」の改修工事を実施せよ！ */
    715: [
        /** 近代化改修成功 */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.NOVEMBER], "「近代化改修」成功"),
        /** 「鋼材」用意 */
        new QuestData(900, false, false, RESET.NONE, "「鋼材」用意"),
        /** 「ボーキサイト」用意 */
        new QuestData(500, false, false, RESET.NONE, "「ボーキサイト」用意"),
    ],
    /** [716]「軽巡」級の改修工事を実施せよ！ */
    716: [
        /** 近代化改修成功 */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.FEBRUARY], "「近代化改修」成功"),
        /** 「鋼材」用意 */
        new QuestData(800, false, false, RESET.NONE, "「鋼材」用意"),
        /** 「ボーキサイト」用意 */
        new QuestData(400, false, false, RESET.NONE, "「ボーキサイト」用意"),
    ],
    /** [717]続：「軽巡」級の改修工事を実施せよ！ */
    717: [
        /** 近代化改修成功 */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.FEBRUARY], "「近代化改修」成功"),
        /** 「鋼材」用意 */
        new QuestData(900, false, false, RESET.NONE, "「鋼材」用意"),
        /** 「ボーキサイト」用意 */
        new QuestData(900, false, false, RESET.NONE, "「ボーキサイト」用意"),
    ],
    /** [1103]潜水艦強化兵装の量産 */
    1103: [
        /** 「61cm三連装(酸素)魚雷」廃棄(一括は別々) */
        new QuestData(3, false, true, [RESET.YEARLY, RESET.JUNE], "「61cm三連装(酸素)魚雷」廃棄"),
        /** 「開発資材」用意 */
        new QuestData(60, false, false, RESET.NONE, "「開発資材」用意"),
        /** 「九三式水中聴音機」用意 */
        new QuestData(2, false, false, RESET.NONE, "「九三式水中聴音機」用意"),
        /** 「13号対空電探改」用意 */
        new QuestData(2, false, false, RESET.NONE, "「13号対空電探改」用意"),
    ],
    /** [1104]潜水艦電子兵装の量産 */
    1104: [
        /** 「13号対空電探改」廃棄(一括は別々) */
        new QuestData(3, false, true, [RESET.YEARLY, RESET.JUNE], "「13号対空電探改」廃棄"),
        /** 「開発資材」用意 */
        new QuestData(100, false, false, RESET.NONE, "「開発資材」用意"),
        /** 「九三式水中聴音機」用意 */
        new QuestData(2, false, false, RESET.NONE, "「九三式水中聴音機」用意"),
        /** 「22号対水上電探」用意 */
        new QuestData(2, false, false, RESET.NONE, "「22号対水上電探」用意"),
    ],
    /** [1107]【鋼材輸出】基地航空兵力を増備せよ！ */
    1107: [
        /** 「艦上戦闘機」廃棄(一括は別々) */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "「艦上戦闘機」廃棄"),
        /** 「艦上攻撃機」廃棄(一括は別々) */
        new QuestData(2, false, true, [RESET.YEARLY, RESET.SEPTEMBER], "「艦上攻撃機」廃棄"),
        /** 「鋼材」用意 */
        new QuestData(24000, false, false, RESET.NONE, "「鋼材」用意"),
        /** 「開発資材」用意 */
        new QuestData(10, false, false, RESET.NONE, "「開発資材」用意"),
    ],
    // #endregion
}

/**
 * 任務
 * @param {Number} max 最大回数
 * @param {Boolean} isAdjust 調整対象か
 * @param {Boolean} canManual 手動変更出来るか
 * @param {Number} reset リセットタイミング(1:デイリー、2:ウィークリー、3:マンスリー、4:クォータリー)
 * @param {String} title 手動変更などに表示する題目、省略した場合は表示されない(=null)
 */
function QuestData(max, isAdjust, canManual, reset, title) {
    this.max = max
    this.isAdjust = isAdjust
    this.canManual = canManual
    this.reset = reset
    this.title = title === undefined ? null : title
}

/**
 * 任務フラグを未受注にする
 * @param {Number} id 任務ID
 */
function notOrder(id) {
    setData("IsActive" + id, false)
}

/**
 * 任務カウントを取得
 * @param {Number} id 任務ID
 * @param {Number} suffix 接尾辞
 */
function getQuestCount(id, suffix) {
    var key = "Count" + id + "_" + (suffix === undefined ? 1 : suffix)
    return Optional.ofNullable(getData(key)).orElse(0)
}

/**
 * 任務カウントを加算
 * @param {Number} id 任務ID
 * @param {Number} count 加算数
 * @param {Number} suffix 接尾辞
 */
function addQuestCount(id, count, suffix) {
    saveQuestCount(id, getQuestCount(id, suffix) + (count === undefined ? 1 : count), suffix)
}

/**
 * 任務カウントを保存
 * @param {Number} id 任務ID
 * @param {Number} count カウント
 * @param {Number} suffix 接尾辞
 * @param {Boolean} forceRewrite 強制的に書き換えるか(デフォルト:false)
 */
function saveQuestCount(id, count, suffix, forceRewrite) {
    var s = suffix === undefined ? 1 : suffix
    var key = "Count" + id + "_" + s
    if (isActive(id) || (forceRewrite === undefined ? false : forceRewrite)) {
        setData(key, Math.min(QUEST_DATA[id][s - 1].max, count))
    }
}

/**
 * IDの任務が遂行中か
 * @param {Number} id 任務ID
 * @return {Boolean} 遂行中か
 */
function isActive(id) {
    return getData("IsActive" + id)
}

/**
 * 進捗状況を返す
 * @param {Number} id 任務ID
 */
function getQuestRate(id) {
    return Optional.ofNullable(getData("Rate" + id)).orElse(0)
}

/**
 * 進捗状況を保存
 * @param {Number} id 任務ID
 * @param {Number} rate レート
 */
function saveQuestRate(id, rate) {
    setData("Rate" + id, rate)
}
