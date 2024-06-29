load("script/ScriptData.js")
load("script/questinfo.js")

GlobalContext = Java.type("logbook.data.context.GlobalContext")
DataType = Java.type("logbook.data.DataType")
ItemDto = Java.type("logbook.dto.ItemDto")
MaterialDto = Java.type("logbook.dto.MaterialDto")
ResultRank = Java.type("logbook.dto.ResultRank")
ShipDto = Java.type("logbook.dto.ShipDto")
ApplicationMain = Java.type("logbook.gui.ApplicationMain")
Item = Java.type("logbook.internal.Item")
Ship = Java.type("logbook.internal.Ship")

ZonedDateTime = Java.type("java.time.ZonedDateTime")
ZoneId = Java.type("java.time.ZoneId")
Arrays = Java.type("java.util.Arrays")
List = Java.type("java.util.List")
Map = Java.type("java.util.Map")
Optional = Java.type("java.util.Optional")
TreeMap = Java.type("java.util.TreeMap")
Collectors = Java.type("java.util.stream.Collectors")

/**
 * @Override
 * 通信データを処理します
 *
 * @param type データの種類
 * @param data データ
 */
function update(type, data) {
    switch (type) {
        case DataType.QUEST_LIST: // 任務
            updateQuestCount()
            saveQuestState(data)
            adjustQuestCount(data)
            break
        case DataType.PORT: // 母港
            savePortItem(data)
            break
        case DataType.START: // 出撃
            addCountForSortiePart(data)
            break
        case DataType.NEXT: // 次のマス
            addCountForNextPart(data)
            break
        case DataType.BATTLE_RESULT: // 通常戦闘結果
        case DataType.COMBINED_BATTLE_RESULT: // 連合戦闘結果
            addCountForBattleResultPart(data)
            break
        case DataType.CREATE_ITEM: // 開発
            addCountForCreateItemPart(data)
            break
        case DataType.CREATE_SHIP: // 建造
            addCountForCreateShipPart(data)
            break
        case DataType.DESTROY_SHIP: // 解体
            addCountForDestroyShipPart(data)
            break
        case DataType.DESTROY_ITEM2: // 廃棄
            addCountForDestroyItem2Part(data)
            break
        case DataType.POWERUP: // 近代化改修
            addCountForPowerupPart(data)
            break
        case DataType.MISSION_RESULT: // 遠征（帰還）
            addCountForMissionResultPart(data)
            break
        case DataType.CHARGE: // 補給
            addCountForChargePart(data)
            break
        case DataType.NYUKYO_START: // 入渠開始
            addCountForEnteringDockPart(data)
            break
        case DataType.REMODEL_SLOT: // 装備改修
            addCountForRemodelSlotPart(data)
            break
        case DataType.PRACTICE_BATTLE_RESULT: // 演習
            addCountForPracticeBattleResultPart(data)
            break
        default:
            break
    }
    // 艦娘保存
    storeShipMap()
    // 装備保存
    storeItemMap()
    // 資材更新
    updateMaterial()
    // 秘書艦更新
    updateSecretary()
    // 任務一覧更新
    ApplicationMain.main.questTable.update()
}

/**
 * 最新のshipMapをScriptData内に保存します
 */
function storeShipMap() {
    setTmpData("shipMap", new TreeMap(GlobalContext.shipMap))
}

/**
 * 最新のitemMapをScriptData内に保存します
 */
function storeItemMap() {
    setTmpData("itemMap", new TreeMap(GlobalContext.itemMap))
}

/**
 * 保存されたshipMapを取り出します
 *
 * @return {java.util.TreeMap} 艦娘一覧
 */
function getStoredShipMap() {
    return getData("shipMap")
}

/**
 * 保存されたitemMapを取り出します
 *
 * @return {java.util.TreeMap} 装備一覧
 */
function getStoredItemMap() {
    return getData("itemMap")
}

/**
 * 現在の時刻を取得[5時間ずらし]
 * @return {java.time.ZonedDateTime} 現在の時刻
 */
function getNowDateTime() {
    return ZonedDateTime.now(ZoneId.of("Etc/GMT-4")).withHour(0).withMinute(0).withSecond(0).withNano(0)
}

/**
 * 最後に任務を読み込んだ時刻を返す
 * @return {java.time.ZonedDateTime} 最後に読み込んだ時刻
 */
function getLastUpdateQuestTime() {
    return Optional.ofNullable(getData("LastUpdateTime")).orElse(ZonedDateTime.parse("2013-04-23T00:00:00+05:00[Etc/GMT-4]"))
}

/**
 * 最後に任務を読み込んだ時刻を保存
 * @param {java.time.ZonedDateTime} time 最後に読み込んだ時刻
 */
function saveLastUpdateQuestTime(time) {
    setData("LastUpdateTime", time)
}

/**
 * 任務状態を保存
 * @param {logbook.data.ActionData} data data
 */
function saveQuestState(data) {
    var json = data.jsonObject.api_data
    if (json.api_list instanceof List) {
        Java.from(json.api_list).filter(function (quest) {
            return (quest.api_type | 0) !== QUEST_TYPE.ONCE
        }).forEach(function (quest) {
            setData("IsActive" + quest.api_no, (quest.api_state | 0) === QUEST_STATE.ACTIVE || (quest.api_state | 0) === QUEST_STATE.COMPLETE)
        })
    }
}

/**
 * 艦娘を保存
 * @param {logbook.data.ActionData} data data
 */
function saveQuestState(data) {
    var json = data.jsonObject.api_data
    if (json.api_list instanceof List) {
        Java.from(json.api_list).filter(function (quest) {
            return (quest.api_type | 0) !== QUEST_TYPE.ONCE
        }).forEach(function (quest) {
            setData("IsActive" + quest.api_no, (quest.api_state | 0) === QUEST_STATE.ACTIVE || (quest.api_state | 0) === QUEST_STATE.COMPLETE)
        })
    }
}

/**
 * 母港
 * @param {logbook.data.ActionData} data data
 */
function savePortItem(data) {
    // 精鋭「艦戦」隊の新編成
    if (isActive(626) && getQuestCount(626, 1) >= 2 && getQuestCount(626, 2) >= 1) {
        if (!isMatchSecretary(626)) {
            notOrder(626)
            saveQuestCount(626, 0, 1, true)
            saveQuestCount(626, 0, 2, true)
        }
    }
    // 機種転換
    if (isActive(628) && getQuestCount(628) >= 2) {
        if (!isMatchSecretary(628)) {
            notOrder(628)
            saveQuestCount(628, 0, true)
        }
    }
    saveQuestCount(637, isActive(637) && isMatchSecretary(637) ? 1 : 0) //「熟練搭乗員」養成
    var itemMap = GlobalContext.itemMap
    if (itemMap instanceof Map) {
        var itemList = itemMap.entrySet().stream().map(function (item) {
            return item.getValue()
        }).collect(Collectors.groupingBy(function (item) {
            return item.slotitemId
        }))
        saveQuestCount(643, getLength(itemList[168]), 2, true) // 主力「陸攻」の調達[九六式陸攻]
        saveQuestCount(643, getLength(itemList[16]), 3, true) // 主力「陸攻」の調達[九七式艦攻]
        saveQuestCount(645, getLength(itemList[75]), 4, true) // 「洋上補給」物資の調達[ドラム缶(輸送用)]
        saveQuestCount(645, getLength(itemList[36]), 5, true) // 「洋上補給」物資の調達[九一式徹甲弾]
        saveQuestCount(653, getLength(itemList[7]), 2, true) // 工廠稼働！次期作戦準備！[35.6cm連装砲]
        saveQuestCount(653, getLength(itemList[19]), 3, true) // 工廠稼働！次期作戦準備！[九六式艦戦]
        saveQuestCount(1103, getLength(itemList[46]), 3, true) // 潜水艦強化兵装の量産[九三式水中聴音機]
        saveQuestCount(1103, getLength(itemList[106]), 4, true) // 潜水艦強化兵装の量産[13号対空電探改]
        saveQuestCount(1104, getLength(itemList[46]), 3, true) // 潜水艦電子兵装の量産[九三式水中聴音機]
        saveQuestCount(1104, getLength(itemList[28]), 4, true) // 潜水艦強化兵装の量産[22号対水上電探]
        saveQuestCount(1120, getLength(itemList[20]), 4, true) // 【機種整理統合】新型戦闘機の量産計画[零式艦戦21型]
        saveQuestCount(1120, getLength(itemList[21]), 5, true) // 【機種整理統合】新型戦闘機の量産計画[零式艦戦52型]
        saveQuestCount(1105, getLength(itemList[16]), 2, true) // 夏の格納庫整備＆航空基地整備[九七式艦攻]
        saveQuestCount(1105, getLength(itemList[17]), 3, true) // 夏の格納庫整備＆航空基地整備[天山]
    }
}

/**
 * 海域が一致しているか
 * @param {Number} id 「X」-Y
 * @return {Boolean} 海域が一致しているか
 */
function isEqualArea(id) {
    var map = Optional.ofNullable(GlobalContext.sortieMap).map(function (map) {
        return map.map
    }).orElse([0, 0, 0])
    return map[0] === id
}

/**
 * マップが一致しているか
 * @param {Number} id 「X」-Y
 * @param {Number} no X-「Y」
 * @return {Boolean} マップが一致しているか
 */
function isEqualMap(id, no) {
    var map = Optional.ofNullable(GlobalContext.sortieMap).map(function (map) {
        return map.map
    }).orElse([0, 0, 0])
    return map[0] === id && map[1] === no
}

/**
 * セルが一致しているか
 * @param {Number} id 「X」-Y
 * @param {Number} no X-「Y」
 * @param {Number|Number[]} cell X-Y-「Z」
 * @return {Boolean} マップが一致しているか
 */
function isEqualCell(id, no, cell) {
    var map = Optional.ofNullable(GlobalContext.sortieMap).map(function (map) {
        return map.map
    }).orElse([0, 0, 0])
    var cells = Array.isArray(cell) ? cell : [cell]
    return map[0] === id && map[1] === no && cells.indexOf(map[2]) >= 0
}

/**
 * イベントが一致しているか
 * @param {Number} event イベント
 * @return {Boolean} イベントが一致しているか
 */
function isEqualEvent(event) {
    return event === Optional.ofNullable(GlobalContext.sortieMap).map(function (map) {
        return map.eventId
    }).orElse(-1)
}

/**
 * マップとイベントが一致しているか
 * @param {Number} id 「X」-Y
 * @param {Number} no X-「Y」
 * @param {Number} event イベント
 * @return {Boolean} マップとイベントが一致しているか
 */
function isEqualPosition(id, no, event) {
    return isEqualMap(id, no) && isEqualEvent(event)
}

/**
 * 出撃
 * @param {logbook.data.ActionData} data data
 */
function addCountForSortiePart(data) {
    addQuestCount(214, 1, 1) // あ号作戦[出撃]
}

/**
 * 勝利か
 * @param {logbook.dto.ResultRank} rank 勝利ランク
 * @return {Boolean} 勝利か
 */
function isWin(rank) {
    return isWinS(rank) || rank === ResultRank.A || rank === ResultRank.B
}

/**
 * S勝利か
 * @param {logbook.dto.ResultRank} rank 勝利ランク
 * @return {Boolean} S勝利か
 */
function isWinS(rank) {
    return rank === ResultRank.PERFECT || rank === ResultRank.S
}

/**
 * A勝利以上か
 * @param {logbook.dto.ResultRank} rank 勝利ランク
 * @return {Boolean} A勝利以上か
 */
function isWinA(rank) {
    return isWinS(rank) || rank === ResultRank.A
}

/**
 * 次のマス
 * @param {logbook.data.ActionData} data data
 */
function addCountForNextPart(data) {
    if (isEqualPosition(1, 6, EVENT_ID.ESCORT_SUCCESS)) {
        var sortieFleetIdx = Java.from(GlobalContext.isSortie).map(function (sortie, index) {
            return sortie ? index : -1
        }).filter(function (index) {
            return index !== -1
        })[0]
        var ships = Java.from(GlobalContext.getDock(sortieFleetIdx + 1).ships)
        var stypes = GlobalContext.getDock(sortieFleetIdx + 1).ships.stream().collect(Collectors.groupingBy(function (ship) {
            return ship.stype
        }))
        var has945Org = ([SHIP_TYPE.CL, SHIP_TYPE.CT].indexOf(ships[0].stype) >= 0 && (getLength(stypes[SHIP_TYPE.DD]) + getLength(stypes[SHIP_TYPE.DE])) >= 3) || ([SHIP_TYPE.DD].indexOf(ships[0].stype) >= 0 && (getLength(stypes[SHIP_TYPE.DD]) + getLength(stypes[SHIP_TYPE.DE])) >= 4)
        if (getLength(stypes[SHIP_TYPE.BBV]) === 2 || getLength(stypes[SHIP_TYPE.AO]) === 2) {
            addQuestCount(861) // 強行輸送艦隊、抜錨！
        }
        if (getLength(stypes[SHIP_TYPE.DE]) >= 3 && ships.length <= 5) {
            addQuestCount(905, 1, 5) // 「海防艦」、海を護る！[1-6]
        }
        if ((getLength(stypes[SHIP_TYPE.DE]) + getLength(stypes[SHIP_TYPE.DD])) >= 3) {
            // addQuestCount(906, 1, 4) // 【桃の節句作戦】鎮守府近海の安全を図れ！[1-6]
            addQuestCount(906, 1, 4) // 【桃の節句】鎮守府近海、春の安全確保作戦[1-6]
        }
        if (ships[0].shipInfo.flagship === "あかし" && getLength(stypes[SHIP_TYPE.DD]) >= 3) {
            addQuestCount(912, 1, 2) // 工作艦「明石」護衛任務[1-6]
        }
        if (has945Org) {
            addQuestCount(945, 1, 2) // 南西方面の兵站航路の安全を図れ！[1-6]
        }
    }
}

/**
 * 戦闘
 * @param {logbook.data.ActionData} data data
 */
function addCountForBattleResultPart(data) {
    var lastBattleDto = GlobalContext.lastBattleDto
    // #region 撃沈処理
    var enemies = lastBattleDto.enemy
    var nowEnemyHp = lastBattleDto.nowEnemyHp
    var sunkList = Arrays.stream(Java.to(Java.from(enemies).map(function (enemy) {
        return enemy.stype
    }).filter(function (stype, i) {
        return nowEnemyHp[i] === 0
    }))).collect(Collectors.groupingBy(function (stype) {
        return stype
    }))
    var ao = getLength(sunkList[SHIP_TYPE.E_AO])
    var cv = getLength(sunkList[SHIP_TYPE.CV]) + getLength(sunkList[SHIP_TYPE.CVL])
    var ss = getLength(sunkList[SHIP_TYPE.SS])
    addQuestCount(212, ao) // 敵輸送船団を叩け！
    addQuestCount(213, ao) // 海上通商破壊作戦
    addQuestCount(218, ao) // 敵補給艦を３隻撃沈せよ！
    addQuestCount(221, ao) // ろ号作戦
    addQuestCount(211, cv) // 敵空母を３隻撃沈せよ！
    addQuestCount(220, cv) // い号作戦
    addQuestCount(228, ss) // 海上護衛戦
    addQuestCount(230, ss) // 敵潜水艦を制圧せよ！
    // #endregion
    var rank = lastBattleDto.rank
    // #region 全般
    if (isWin(lastBattleDto.rank)) {
        addQuestCount(201) // 敵艦隊を撃破せよ！
    }
    addQuestCount(210) // 敵艦隊を10回邀撃せよ！
    if (isEqualEvent(EVENT_ID.NORMAL_BATTLE) || isEqualEvent(EVENT_ID.BOSS_BATTLE) && isWin(lastBattleDto.rank)) {
        addQuestCount(216) // 敵艦隊主力を撃滅せよ！
    }
    if (isWinS(lastBattleDto.rank)) {
        addQuestCount(214, 1, 2) // あ号作戦[S勝利]
    }
    if (isEqualEvent(EVENT_ID.BOSS_BATTLE)) {
        addQuestCount(214, 1, 3) // あ号作戦[ボス]
    }
    if (isEqualEvent(EVENT_ID.BOSS_BATTLE) && isWin(rank)) {
        addQuestCount(214, 1, 4) // あ号作戦[ボス勝利]
    }
    // #endregion
    var ships = Java.from(lastBattleDto.dock.ships)
    var stypes = lastBattleDto.dock.ships.stream().collect(Collectors.groupingBy(function (ship) {
        return ship.stype
    }))
    var hasCV = (getLength(stypes[SHIP_TYPE.CVL]) + getLength(stypes[SHIP_TYPE.CV]) + getLength(stypes[SHIP_TYPE.CVB])) > 0
    var has280Org = (getLength(stypes[SHIP_TYPE.CVL]) + getLength(stypes[SHIP_TYPE.CL]) + getLength(stypes[SHIP_TYPE.CLT]) + getLength(stypes[SHIP_TYPE.CT])) > 0 &&
        (getLength(stypes[SHIP_TYPE.DD]) + getLength(stypes[SHIP_TYPE.DE])) >= 3
    // 上と内容同一
    var has284Org = has280Org
    var setsubun1 = [SHIP_TYPE.CL, SHIP_TYPE.CLT, SHIP_TYPE.CT, SHIP_TYPE.CVL].indexOf(ships[0].stype) >= 0 &&
        (getLength(stypes[SHIP_TYPE.DD]) + getLength(stypes[SHIP_TYPE.DE])) >= 3
    // var setsubun2 = [SHIP_TYPE.AV, SHIP_TYPE.CA, SHIP_TYPE.CAV].indexOf(ships[0].stype) >= 0 && getLength(stypes[SHIP_TYPE.DD]) >= 2
    var setsubun2 = [SHIP_TYPE.AV, SHIP_TYPE.CA, SHIP_TYPE.CAV].indexOf(ships[0].stype) >= 0 && getLength(stypes[ships[0].stype]) >= 2
    var setsubun3 = [SHIP_TYPE.BB, SHIP_TYPE.FBB, SHIP_TYPE.BBV, SHIP_TYPE.CV, SHIP_TYPE.CVB, SHIP_TYPE.CVL].indexOf(ships[0].stype) >= 0 && getLength(stypes[SHIP_TYPE.DD]) >= 2
    var has904Org = ships.filter(function (ship) {
        return [195, 627].indexOf(ship.shipId) >= 0
    }).length === 2
    var has905Org = getLength(stypes[SHIP_TYPE.DE]) >= 3 && ships.length <= 5
    var has906Org = (getLength(stypes[SHIP_TYPE.DD]) + getLength(stypes[SHIP_TYPE.DE])) >= 3
    var has907Org = (getLength(stypes[SHIP_TYPE.DD]) + getLength(stypes[SHIP_TYPE.DE])) >= 4
    // var has909Org = ships.map(function (ship) {
    //     return (ship.shipInfo.json.api_ctype | 0)
    // }).filter(function (ctype) {
    //     return ctype === 38 // 夕雲型
    // }).length >= 3
    var has928Org = ships.map(function (ship) {
        return ship.shipInfo.flagship
    }).filter(function (name) {
        return ["はぐろ", "あしがら", "みょうこう", "たかお", "かみかぜ"].indexOf(name) >= 0
    }).length >= 2
    var has912Org = ships[0].shipInfo.flagship === "あかし" && getLength(stypes[SHIP_TYPE.DD]) >= 3
    var has914Org = getLength(stypes[SHIP_TYPE.CA]) >= 3 && getLength(stypes[SHIP_TYPE.DD]) >= 1
    var has944Org = (ships[0].stype === SHIP_TYPE.CA && getLength(stypes[SHIP_TYPE.DD]) >= 3) || (ships[0].stype === SHIP_TYPE.DD && getLength(stypes[SHIP_TYPE.DD]) >= 4)
    var has945Org = ([SHIP_TYPE.CL, SHIP_TYPE.CT].indexOf(ships[0].stype) >= 0 && (getLength(stypes[SHIP_TYPE.DD]) + getLength(stypes[SHIP_TYPE.DE])) >= 3) || ([SHIP_TYPE.DD].indexOf(ships[0].stype) >= 0 && (getLength(stypes[SHIP_TYPE.DD]) + getLength(stypes[SHIP_TYPE.DE])) >= 4)
    var has946Org = [SHIP_TYPE.CV, SHIP_TYPE.CVB, SHIP_TYPE.CVL].indexOf(ships[0].stype) >= 0 && (getLength(stypes[SHIP_TYPE.CA]) + getLength(stypes[SHIP_TYPE.CAV])) >= 2
    var has948Org = [SHIP_TYPE.CVL, SHIP_TYPE.CV, SHIP_TYPE.CVB].indexOf(ships[0].stype) >= 0 && Number(lastBattleDto.dock.id) === 1
    var has973Org = (getLength(stypes[SHIP_TYPE.CVL]) + getLength(stypes[SHIP_TYPE.CV]) + getLength(stypes[SHIP_TYPE.CVB])) == 0 && ships.map(function (ship) {
        return ship.shipInfo.flagship
    }).filter(function (name) {
        // 米英艦(空母以外)
        /// Nevada / Nevada改 / Nevada改 Mod.2
        // Colorado /Colorado改
        // Maryland / Maryland改
        // Washington / Washington改
        // South Dakota / South Dakota改
        // Massachusetts / Massachusetts改
        // Iowa / Iowa改
        // Northampton / Northampton改
        // Houston / Houston改
        // Tuscaloosa / Tuscaloosa改
        // Brooklyn / Brooklyn改
        // Honolulu / Honolulu改
        // Helena / Helena改
        // Atlanta / Atlanta改
        // Fletcher / Fletcher改 / Fletcher改 Mod.2 / Fletcher Mk.II
        // Johnston / Johnston改
        // Heywood L.E. / Heywood L.E.改
        // Samuel B.Roberts / Samuel B.Roberts改 / Samuel B.Roberts Mk.II
        // Salmon / Salmon改
        // Drum / Drum改
        // Scamp / Scamp改
        // Warspite / Warspite改
        // Nelson / Nelson改
        // Rodney / Rodney改
        // Sheffield / Sheffield改
        // Jervis / Jervis改
        // Janus / Janus改
        // Javelin / Javelin改
        return ["ネヴァダ", "コロラド", "メリーランド", "ワシントン", "サウスダコタ", "マサチューセッツ", "アイオワ", "ノーザンプトン", "ヒューストン", "タスカルーサ", "ブルックリン", "ホノルル", "ヘレナ", "アトランタ", "フレッチャー", "ジョンストン", "ヘイウッド", "サミュエル・B・ロバーツ", "サーモン", "ドラム", "スキャンプ", "ウォースパイト", "ネルソン", "ロドニー", "シェフィールド", "ジャーヴィス", "ジェーナス", "ジャヴェリン"].indexOf(name) >= 0
    }).length >= 3
    var has975Org = ships.map(function (ship) {
        return ship.shipId
    }).filter(function (id) {
        // 磯波改二
        // 浦波改二
        // 綾波改二
        // 敷波改二
        return id === 666 || id === 647 || id === 195 || id === 627
    }).length >= 4
    var has1005Org = ships.map(function (ship) {
        return ship.shipId
    }).filter(function (id) {
        // 朧改
        // 曙改 / 曙改二
        // 漣改
        // 潮改 / 潮改二
        return id === 230 || id === 231 || id === 665 || id === 232 || id === 233 || id === 407
    }).length >= 4
    // 旗艦 鵜来型 + 海防艦 1～3
    var has1012Org = (ships[0].shipInfo.json.api_ctype | 0) === 117 && getLength(stypes[SHIP_TYPE.DE]) == ships.length && ships.length >= 2 && ships.length <= 4
    // #region ○-○ボス勝利など
    // ボス戦じゃないなら処理終了
    if (!isEqualEvent(EVENT_ID.BOSS_BATTLE)) return
    // #region 鎮守府海域
    if (isEqualMap(1, 1) && isWinS(rank)) {
        if (has905Org) {
            addQuestCount(905, 1, 1) // 「海防艦」、海を護る！[1-1]
        }
        if (has1012Org) {
            addQuestCount(1012, 1, 1) // 鵜来型海防艦、静かな海を防衛せよ！[1-1]
        }
    }
    if (isEqualMap(1, 2)) {
        if (isWinS(rank)) {
            if (has280Org) {
                addQuestCount(280, 1, 1) // 兵站線確保！海上警備を強化実施せよ！[1-2]
            }
            if (has905Org) {
                addQuestCount(905, 1, 2) // 「海防艦」、海を護る！[1-2]
            }
        }
        if (isWinA(rank)) {
            if (has906Org) {
                // addQuestCount(906, 1, 1) // 【桃の節句作戦】鎮守府近海の安全を図れ！[1-2]
                addQuestCount(906, 1, 1) // 【桃の節句】鎮守府近海、春の安全確保作戦[1-2]
            }
            if (has944Org) {
                addQuestCount(944, 1, 1) // 鎮守府近海海域の哨戒を実施せよ！[1-2]
            }
            if (has1005Org) {
                addQuestCount(1005, 1, 1) // 精強「第七駆逐隊」緊急出動！[1-2]
            }
            if (has1012Org) {
                addQuestCount(1012, 1, 2) // 鵜来型海防艦、静かな海を防衛せよ！[1-2]
            }
            }
    }
    if (isEqualMap(1, 3)) {
        if (isWinS(rank)) {
            if (has280Org) {
                addQuestCount(280, 1, 2) // 兵站線確保！海上警備を強化実施せよ！[1-3]
            }
            if (hasCV) {
                addQuestCount(894, 1, 1) // 空母戦力の投入による兵站線戦闘哨戒[1-3]
            }
            if (has905Org) {
                addQuestCount(905, 1, 3) // 「海防艦」、海を護る！[1-3]
            }
        }
        if (isWinA(rank)) {
            if (has906Org) {
                // addQuestCount(906, 1, 2) // 【桃の節句作戦】鎮守府近海の安全を図れ！[1-3]
                addQuestCount(906, 1, 2) // 【桃の節句】鎮守府近海、春の安全確保作戦[1-3]
            }
            if (has912Org) {
                addQuestCount(912, 1, 1) // 工作艦「明石」護衛任務[1-3]
            }
            if (has944Org) {
                addQuestCount(944, 1, 2) // 鎮守府近海海域の哨戒を実施せよ！[1-3]
            }
            if (has1005Org) {
                addQuestCount(1005, 1, 2) // 精強「第七駆逐隊」緊急出動！[1-3]
            }
        }
    }
    if (isEqualMap(1, 4)) {
        if (isWinS(rank)) {
            // 軽巡旗艦、軽巡1~3隻、駆逐1隻以上、軽巡と駆逐のみ
            if (ships[0].stype === SHIP_TYPE.CL) {
                var cl = getLength(stypes[SHIP_TYPE.CL])
                var dd = getLength(stypes[SHIP_TYPE.DD])
                if (cl < 4 && dd > 0) {
                    var shipNum = cl + dd
                    if (ships.length === shipNum) {
                        addQuestCount(257) // 「水雷戦隊」南西へ！
                    }
                }
            }
            if (has280Org) {
                addQuestCount(280, 1, 3) // 兵站線確保！海上警備を強化実施せよ！[1-4]
            }
            if (hasCV) {
                addQuestCount(894, 1, 2) // 空母戦力の投入による兵站線戦闘哨戒[1-4]
            }
            if (has284Org) {
                addQuestCount(284, 1, 1) // 南西諸島方面「海上警備行動」発令！[1-4]
            }
        }
        if (isWinA(rank)) {
        //     if (setsubun1) {
        //         addQuestCount(840, 1, 1) //【節分任務】令和二年節分作戦[1-4]
        //     }
            if (has944Org) {
                addQuestCount(944, 1, 3) // 鎮守府近海海域の哨戒を実施せよ！[1-4]
            }
        }
    }
    if (isEqualMap(1, 5)) {
        if (isWinS(rank)) {
            addQuestCount(893, 1, 1) // 泊地周辺海域の安全確保を徹底せよ！[1-5]
            if (has905Org) {
                addQuestCount(905, 1, 4) // 「海防艦」、海を護る！[1-5]
            }
            if (has975Org) {
                addQuestCount(975, 1, 1) // 精鋭「第十九駆逐隊」、全力出撃！[1-5]
            }
        }
        if (isWinA(rank)) {
            addQuestCount(261) // 海上輸送路の安全確保に努めよ！
            addQuestCount(265) // 海上護衛強化月間
            if (has906Org) {
                // addQuestCount(906, 1, 3) // 【桃の節句作戦】鎮守府近海の安全を図れ！[1-5]
                addQuestCount(906, 1, 3) // 【桃の節句】鎮守府近海、春の安全確保作戦[1-5]
            }
            if (has945Org) {
                addQuestCount(945, 1, 1) // 南西方面の兵站航路の安全を図れ！[1-5]
            }
            if (has1005Org) {
                addQuestCount(1005, 1, 3) // 精強「第七駆逐隊」緊急出動！[1-5]
            }
            if (has1012Org) {
                addQuestCount(1012, 1, 3) // 鵜来型海防艦、静かな海を防衛せよ！[1-5]
            }
        }
    }
    // #endregion
    // #region 南西諸島海域
    if (isEqualArea(2) && isWin(rank)) {
        addQuestCount(226) // 南西諸島海域の制海権を握れ！
    }
    if (isEqualMap(2, 1)) {
        if (isWinS(rank)) {
            if (has280Org) {
                addQuestCount(280, 1, 4) // 兵站線確保！海上警備を強化実施せよ！[2-1]
            }
            if (hasCV) {
                addQuestCount(894, 1, 3) // 空母戦力の投入による兵站線戦闘哨戒[2-1]
            }
            if (has284Org) {
                addQuestCount(284, 1, 2) // 南西諸島方面「海上警備行動」発令！[2-1]
            }
            if (has907Org) {
                addQuestCount(907, 1, 1) // 【桃の節句】南西諸島海域、春の戦闘哨戒！[2-1]
            }
        }
        if (isWinA(rank)) {
            // if (setsubun1) {
            //     addQuestCount(840, 1, 2) // 【節分任務】令和二年節分作戦[2-1]
            // }
            if (setsubun1) {
                addQuestCount(840, 1, 1) // 【節分任務】令和三年節分作戦[2-1]
            }
            // if (has906Org) {
            //     addQuestCount(906, 1, 5) // 【桃の節句作戦】鎮守府近海の安全を図れ！[2-1]
            // }
            if (has912Org) {
                addQuestCount(912, 1, 3) // 工作艦「明石」護衛任務[2-1]
            }
            if (has945Org) {
                addQuestCount(945, 1, 3) // 南西方面の兵站航路の安全を図れ！[2-1]
            }
        }
    }
    if (isEqualMap(2, 2)) {
        if (isWinS(rank)) {
            if (hasCV) {
                addQuestCount(894, 1, 4) // 空母戦力の投入による兵站線戦闘哨戒[2-2]
            }
            if (has284Org) {
                addQuestCount(284, 1, 3) // 南西諸島方面「海上警備行動」発令！[2-2]
            }
            if (has907Org) {
                addQuestCount(907, 1, 2) // 【桃の節句】南西諸島海域、春の戦闘哨戒！[2-2]
            }
            if (has946Org) {
                addQuestCount(946, 1, 1) // 空母機動部隊、出撃！敵艦隊を迎撃せよ！[2-2]
            }
        }
        if (isWinA(rank)) {
            // if (setsubun1) {
            //     addQuestCount(840, 1, 3) // 【節分任務】令和二年節分作戦[2-2]
            // }
            if (setsubun1) {
                addQuestCount(840, 1, 2) // 【節分任務】令和三年節分作戦[2-2]
            }
            // if (has909Org) {
            //     addQuestCount(909, 1, 1) // 【桃の節句作戦】主力オブ主力、駆ける！[2-2]
            // }
            if (has912Org) {
                addQuestCount(912, 1, 4) // 工作艦「明石」護衛任務[2-2]
            }
        }
    }
    if (isEqualMap(2, 3)) {
        if (isWinS(rank)) {
            if (hasCV) {
                addQuestCount(894, 1, 5) // 空母戦力の投入による兵站線戦闘哨戒[2-3]
            }
            if (has284Org) {
                addQuestCount(284, 1, 4) // 南西諸島方面「海上警備行動」発令！[2-3]
            }
            if (has907Org) {
                addQuestCount(907, 1, 3) // 【桃の節句】南西諸島海域、春の戦闘哨戒！[2-3]
            }
            if (has946Org) {
                addQuestCount(946, 1, 2) // 空母機動部隊、出撃！敵艦隊を迎撃せよ！[2-3]
            }
            if (has975Org) {
                addQuestCount(975, 1, 2) // 精鋭「第十九駆逐隊」、全力出撃！[2-3]
            }
        }
        if (isWinA(rank)) {
            // if (has909Org) {
            //     addQuestCount(909, 1, 2) // 【桃の節句作戦】主力オブ主力、駆ける！[2-3]
            // }
            if (has912Org) {
                addQuestCount(912, 1, 5) // 工作艦「明石」護衛任務[2-3]
            }
            if (setsubun1) {
                addQuestCount(840, 1, 3) // 【節分任務】令和三年節分作戦[2-3]
            }
        }
    }
    if (isEqualMap(2, 4)) {
        if (isWinS(rank)) {
            addQuestCount(822) // 沖ノ島海域迎撃戦
            if (has946Org) {
                addQuestCount(946, 1, 3) // 空母機動部隊、出撃！敵艦隊を迎撃せよ！[2-4]
            }
        }
        if (isWinA(rank)) {
            if (Number(lastBattleDto.dock.id) === 1) {
                addQuestCount(854, 1, 1) // 戦果拡張任務！「Z作戦」前段作戦[2-4]
            }
        }
    }
    if (isEqualMap(2, 5) && isWinS(rank)) {
        var num = ships.map(function (ship) {
            return ship.shipInfo.flagship
        }).filter(function (name) {
            return ["みょうこう", "なち", "はぐろ"].indexOf(name) >= 0
        }).length
        if (num === 3) {
            addQuestCount(249) // 「第五戦隊」出撃せよ！
        }
        // 駆逐旗艦、重巡1隻、軽巡1隻、駆逐4隻
        if (ships[0].stype === SHIP_TYPE.DD) {
            if (getLength(stypes[SHIP_TYPE.CA]) === 1 && getLength(stypes[SHIP_TYPE.CL]) === 1 && getLength(stypes[SHIP_TYPE.DD]) === 4) {
                addQuestCount(266) // 「水上反撃部隊」突入せよ！
            }
        }
        if (has904Org) {
            addQuestCount(904, 1, 1) // 精鋭「十九駆」、躍り出る！[2-5]
        }
    }
    // #endregion
    // #region 北方海域
    if (isEqualMap(3, 1)) {
        if (isWinS(rank)) {
            if (getLength(stypes[SHIP_TYPE.CVL]) >= 2) {
                addQuestCount(947, 1, 1) // AL 作戦[3-1]
            }
        }
        if (isWinA(rank)) {
            // 軽巡1隻以上
            if (getLength(stypes[SHIP_TYPE.CL]) > 0) {
                addQuestCount(873, 1, 1) // 北方海域警備を実施せよ！[3-1]
            }
            if (has973Org) {
                addQuestCount(973, 1, 1) // 日英米合同水上艦隊、抜錨せよ！[3-1]
            }
        }
    }
    if (isEqualMap(3, 2)) {
        if (isWinS(rank)) {
            if (has975Org) {
                addQuestCount(975, 1, 3) // 精鋭「第十九駆逐隊」、全力出撃！[3-2]
            }
        }
        if (isWinA(rank)) {
            // 軽巡1隻以上
            if (getLength(stypes[SHIP_TYPE.CL]) > 0) {
                addQuestCount(873, 1, 2) // 北方海域警備を実施せよ！[3-2]
            }
            if (has1005Org) {
                addQuestCount(1005, 1, 4) // 精強「第七駆逐隊」緊急出動！[3-2]
            }
        }
    }
    if (isEqualMap(3, 3)) {
        if (isWinS(rank)) {
            if (getLength(stypes[SHIP_TYPE.CVL]) >= 2) {
                addQuestCount(947, 1, 2) // AL 作戦[3-3]
            }
        }
        if (isWinA(rank)) {
            // 軽巡1隻以上
            if (getLength(stypes[SHIP_TYPE.CL]) > 0) {
                addQuestCount(873, 1, 3) // 北方海域警備を実施せよ！[3-3]
            }
            if (has973Org) {
                addQuestCount(973, 1, 2) // 日英米合同水上艦隊、抜錨せよ！[3-3]
            }
        }
    }
    if (isEqualMap(3, 4) && isWinS(rank)) {
        if (getLength(stypes[SHIP_TYPE.CVL]) >= 2) {
            addQuestCount(947, 1, 3) // AL 作戦[3-4]
        }
        if (has904Org) {
            addQuestCount(904, 1, 2) // 精鋭「十九駆」、躍り出る！[3-4]
        }
    }
    if (isEqualMap(3, 5)) {
        if (isWinS(rank)) {
            if (getLength(stypes[SHIP_TYPE.CVL]) >= 2) {
                addQuestCount(947, 1, 4) // AL 作戦[3-5]
            }
            addQuestCount(909, 1, 1) // 【桃の節句：拡張作戦】春の攻勢作戦！[3-5]
        }
        if (isWinA(rank)) {
            // if (has909Org) {
            //     addQuestCount(909, 1, 3) // 【桃の節句作戦】主力オブ主力、駆ける！[3-5]
            // }
        }
    }
    if ((isEqualMap(3, 3) || isEqualMap(3, 4) || isEqualMap(3, 5)) && isWin(rank)) {
        addQuestCount(241) // 敵北方艦隊主力を撃滅せよ！
    }
    // #endregion
    // #region 東方海域
    if (isEqualArea(4) && isWin(rank)) {
        addQuestCount(229) // 敵東方艦隊を撃滅せよ！
    }
    if (isEqualMap(4, 1)) {
        if (isWinS(rank)) {
            addQuestCount(845, 1, 1) // 発令！「西方海域作戦」[4-1]
            if (setsubun2) {
                // addQuestCount(841, 1, 1) // 【節分任務】令和二年西方海域節分作戦[4-1]
                addQuestCount(841, 1, 1) // 【節分任務】令和三年西方海域節分作戦[4-1]
            }
        }
        if (isWinA(rank)) {
            if (has914Org) {
                addQuestCount(914, 1, 1) // 重巡戦隊、西へ！[4-1]
            }
        }
    }
    if (isEqualMap(4, 2)) {
        if (isWinS(rank)) {
            // 空母2隻、駆逐2隻
            var cv = getLength(stypes[SHIP_TYPE.CVL]) + getLength(stypes[SHIP_TYPE.CV]) + getLength(stypes[SHIP_TYPE.CVB])
            if (cv >= 2 && getLength(stypes[SHIP_TYPE.DD]) >= 2) {
                addQuestCount(264) // 「空母機動部隊」西へ！
            }
            addQuestCount(845, 1, 2) // 発令！「西方海域作戦」[4-2]
            if (setsubun2) {
                // addQuestCount(841, 1, 2) // 【節分任務】令和二年西方海域節分作戦[4-2]
                addQuestCount(841, 1, 2) // 【節分任務】令和三年西方海域節分作戦[4-2]
            }
            if (has928Org) {
                addQuestCount(928, 1, 1) // 歴戦「第十方面艦隊」、全力出撃！[4-2]
            }
        }
        if (isWinA(rank)) {
            if (has914Org) {
                addQuestCount(914, 1, 2) // 重巡戦隊、西へ！[4-2]
            }
        }
    }
    if (isEqualMap(4, 3)) {
        if (isWinS(rank)) {
            addQuestCount(845, 1, 3) // 発令！「西方海域作戦」[4-3]
            if (setsubun2) {
                // addQuestCount(841, 1, 3) // 【節分任務】令和二年西方海域節分作戦[4-3]
                addQuestCount(841, 1, 3) // 【節分任務】令和三年西方海域節分作戦[4-3]
            }
        }
        if (isWinA(rank)) {
            if (has914Org) {
                addQuestCount(914, 1, 3) // 重巡戦隊、西へ！[4-3]
            }
            if (has973Org) {
                addQuestCount(973, 1, 4) // 日英米合同水上艦隊、抜錨せよ！[4-3]
            }
        }
    }
    if (isEqualMap(4, 4)) {
        if (isWinS(rank)) {
            addQuestCount(845, 1, 4) // 発令！「西方海域作戦」[4-4]
        }
        if (isWinA(rank)) {
            if (has914Org) {
                addQuestCount(914, 1, 4) // 重巡戦隊、西へ！[4-4]
            }
        }
        if (isWin(rank)) {
            addQuestCount(242) // 敵東方中枢艦隊を撃破せよ！
        }
    }
    if (isEqualMap(4, 5) && isWinS(rank)) {
        addQuestCount(845, 1, 5) // 発令！「西方海域作戦」[4-5]
        addQuestCount(909, 1, 2) // 【桃の節句：拡張作戦】春の攻勢作戦！[4-5]
        if (has904Org) {
            addQuestCount(904, 1, 3) // 精鋭「十九駆」、躍り出る！[4-5]
        }
    }
    // #endregion
    // #region 南方海域
    var newMikawaNum = ships.map(function (ship) {
        return ship.shipInfo.flagship
    }).filter(function (name) {
        return ["ちょうかい", "あおば", "きぬがさ", "かこ", "ふるたか", "てんりゅう", "ゆうばり"].indexOf(name) >= 0
    }).length
    // 夕張改二型旗艦
    var isSixTpSquadron = [622, 623, 624].indexOf(ships[0].shipId) >= 0 && (ships.map(function (ship) {
        return ship.shipInfo.flagship
    }).filter(function (name) {
        return ["むつき", "きさらぎ", "やよい", "うづき", "きくづき", "もちづき"].indexOf(name) >= 0
    }).length >= 2 || ships.some(function (ship) {
        return ship.shipId === 488 // 由良改二
    }))
    if (isEqualMap(5, 1) && isWinS(rank)) {
        if (newMikawaNum >= 4) {
            addQuestCount(888, 1, 1) // 新編成「三川艦隊」、鉄底海峡に突入せよ！[5-1]
        }
        var num = ships.map(function (ship) {
            return (ship.shipInfo.json.api_ctype | 0)
        }).filter(function (ctype) {
            // 扶桑型or伊勢型or長門型or大和型
            return ctype === 26 || ctype === 2 || ctype === 19 || ctype === 37
        }).length
        if (num === 3 && getLength(stypes[SHIP_TYPE.CL]) === 1) {
            addQuestCount(259) // 「水上打撃部隊」南方へ！
        }
        if (isSixTpSquadron) {
            addQuestCount(903, 1, 1) // 拡張「六水戦」、最前線へ！[5-1]
        }
    }
    if (isEqualMap(5, 2) && isWinS(rank)) {
        addQuestCount(243) // 南方海域珊瑚諸島沖の制空権を握れ！
        if (setsubun3) {
            addQuestCount(843, 1, 1) // 【節分拡張任務】令和三年節分作戦、全力出撃！[5-2]
        }
        if (has948Org) {
            addQuestCount(948, 1, 1) // 機動部隊決戦[5-2]
        }
    }
    if (isEqualMap(5, 3) && isWinS(rank)) {
        if (newMikawaNum >= 4) {
            addQuestCount(888, 1, 2) // 新編成「三川艦隊」、鉄底海峡に突入せよ！[5-3]
        }
        if (has904Org) {
            addQuestCount(904, 1, 4) // 精鋭「十九駆」、躍り出る！[5-3]
        }
        if (has975Org) {
            addQuestCount(975, 1, 4) // 精鋭「第十九駆逐隊」、全力出撃！[5-3]
        }
    }
    if (isEqualMap(5, 4) && isWinS(rank)) {
        if (newMikawaNum >= 4) {
            addQuestCount(888, 1, 3) // 新編成「三川艦隊」、鉄底海峡に突入せよ！[5-4]
        }
        var naganami = ships.some(function (ship) {
            return ship.shipId === 543
        })
        var no31s = ships.some(function (ship) {
            return ["たかなみ", "おきなみ", "あさしも"].some(function (name) {
                return ship.shipInfo.flagship.equals(name) && ship.name.indexOf("改") >= 0
            })
        })
        if (naganami && no31s) {
            addQuestCount(875) // 精鋭「三一駆」、鉄底海域に突入せよ！
        }
        if (isSixTpSquadron) {
            addQuestCount(903, 1, 2) // 拡張「六水戦」、最前線へ！[5-4]
        }
        // if (setsubun3) {
        //     addQuestCount(843, 1, 1) // 【節分拡張任務】令和二年節分作戦、全力出撃！[5-4]
        // }
    }
    if (isEqualMap(5, 5) && isWinS(rank)) {
        if (Number(lastBattleDto.dock.id) === 1) {
            addQuestCount(872, 1, 1) // 戦果拡張任務！「Z作戦」後段作戦[5-5]
        }
        if (setsubun3) {
            // addQuestCount(843, 1, 2) // 【節分拡張任務】令和二年節分作戦、全力出撃！[5-5]
            addQuestCount(843, 1, 2) // 【節分拡張任務】令和三年節分作戦、全力出撃！[5-5]
        }
        if (has948Org) {
            addQuestCount(948, 1, 2) // 機動部隊決戦[5-5]
        }
    }
    // #endregion
    // #region 中部海域
    if (isEqualMap(6, 1) && isWinA(rank) && Number(lastBattleDto.dock.id) === 1) {
        addQuestCount(854, 1, 2) // 戦果拡張任務！「Z作戦」前段作戦[6-1]
    }
    if (isEqualMap(6, 1) && isWinS(rank)) {
        addQuestCount(256) // 「潜水艦隊」出撃せよ！
    }
    if (isEqualMap(6, 2) && isWinS(rank) && Number(lastBattleDto.dock.id) === 1) {
        addQuestCount(872, 1, 2) // 戦果拡張任務！「Z作戦」後段作戦[6-2]
    }
    if (isEqualMap(6, 3) && isWinA(rank) && Number(lastBattleDto.dock.id) === 1) {
        addQuestCount(854, 1, 3) // 戦果拡張任務！「Z作戦」前段作戦[6-3]
    }
    if (isEqualMap(6, 3) && isWinA(rank)) {
        // 水母1隻、軽巡2隻
        if (getLength(stypes[SHIP_TYPE.AV]) >= 1 && getLength(stypes[SHIP_TYPE.CL]) >= 2) {
            addQuestCount(862) // 前線の航空偵察を実施せよ！
        }
    }
    if (isEqualMap(6, 4)) {
        if (isWinS(rank)) {
            addQuestCount(909, 1, 3) // 【桃の節句：拡張作戦】春の攻勢作戦！[6-4]
            if (Number(lastBattleDto.dock.id) === 1) {
                addQuestCount(854, 1, 4) // 戦果拡張任務！「Z作戦」前段作戦[6-4]
            }
            if (isSixTpSquadron) {
                addQuestCount(903, 1, 3) // 拡張「六水戦」、最前線へ！[6-4]
            }
            if (setsubun3) {
                // addQuestCount(843, 1, 3) // 【節分拡張任務】令和二年節分作戦、全力出撃！[6-4]
                addQuestCount(843, 1, 3) // 【節分拡張任務】令和三年節分作戦、全力出撃！[6-4]
            }
        }
        if (isWinA(rank)) {
            if (has948Org) {
                addQuestCount(948, 1, 4) // 機動部隊決戦[6-4]
            }
        }
    }
    if (isEqualMap(6, 5) && isWinS(rank)) {
        if (Number(lastBattleDto.dock.id) === 1) {
            addQuestCount(872, 1, 3) // 戦果拡張任務！「Z作戦」後段作戦[6-5]
        }
        if (isSixTpSquadron) {
            addQuestCount(903, 1, 4) // 拡張「六水戦」、最前線へ！[6-5]
        }
        if (has948Org) {
            addQuestCount(948, 1, 3) // 機動部隊決戦[6-5]
        }
    }
    // #endregion
    // #region 南西海域
    if (isEqualMap(7, 1) && isWinS(rank)) {
        addQuestCount(893, 1, 2) // 泊地周辺海域の安全確保を徹底せよ！[7-1]
    }
    if (isEqualCell(7, 2, 7) && isWinS(rank)) {
        addQuestCount(893, 1, 3) // 泊地周辺海域の安全確保を徹底せよ！[7-2-1]
    }
    if (isEqualCell(7, 2, 15)) {
        if (isWinS(rank)) {
            addQuestCount(893, 1, 4) // 泊地周辺海域の安全確保を徹底せよ！[7-2-2]
            if (Number(lastBattleDto.dock.id) === 1) {
                addQuestCount(872, 1, 4) // 戦果拡張任務！「Z作戦」後段作戦[7-2-2]
            }
            if (has928Org) {
                addQuestCount(928, 1, 2) // 歴戦「第十方面艦隊」、全力出撃！[7-2-2]
            }
        }
        if (isWinA(rank)) {
            // if (has909Org) {
            //     addQuestCount(909, 1, 4) // 【桃の節句作戦】主力オブ主力、駆ける！[7-2-2]
            // }
        }
    }
    if (isEqualCell(7, 3, [18, 23, 24, 25])) {
        if (isWinS(rank)) {
            if (has928Org) {
                addQuestCount(928, 1, 3) // 歴戦「第十方面艦隊」、全力出撃！[7-3-2]
            }
        }
        if (isWinA(rank)) {
            if (has973Org) {
                addQuestCount(973, 1, 3) // 日英米合同水上艦隊、抜錨せよ！[7-3-2]
            }
        }
    }
    // #endregion
    // #region 桃の節句！沖に立つ波
    if (isEqualCell(47, 1, 9) && isWinS(rank)) {
        // if (has909Org) {
        //     addQuestCount(909, 1, 5) // 【桃の節句作戦】主力オブ主力、駆ける！[E-1-1]
        // }
    }
    // #endregion
    // #endregion
}

/**
 * 開発
 * @param {logbook.data.ActionData} data data
 */
function addCountForCreateItemPart(data) {
    var count = Number(data.getField("api_multiple_flag")) === 1 ? 3 : 1
    addQuestCount(605, count, 1) // 新装備「開発」指令
    addQuestCount(607, count, 1) // 装備「開発」集中強化！
}

/**
 * 建造
 * @param {logbook.data.ActionData} data data
 */
function addCountForCreateShipPart(data) {
    addQuestCount(606) // 新造艦「建造」指令
    addQuestCount(608) // 艦娘「建造」艦隊強化！
}

/**
 * 解体
 * @param {logbook.data.ActionData} data data
 */
function addCountForDestroyShipPart(data) {
    var num = String(data.getField("api_ship_id")).split(",").length
    addQuestCount(609, num) // 軍縮条約対応！
}

/**
 * 廃棄
 * @param {logbook.data.ActionData} data data
 */
function addCountForDestroyItem2Part(data) {
    var itemList = getStoredItemMap()
    if (itemList instanceof Map) {
        var destroyItems = String(data.getField("api_slotitem_ids")).split(",").map(function (id) {
            return itemList.get(id | 0)
        })
        var type2 = Arrays.stream(Java.to(destroyItems)).collect(Collectors.groupingBy(function (item) {
            return item ? item.type2 : 0
        }))
        var slotitemId = Arrays.stream(Java.to(destroyItems)).collect(Collectors.groupingBy(function (item) {
            return item ? item.slotitemId : 0
        }))
        // 精鋭「艦戦」隊の新編成
        if (isMatchSecretary(626)) {
            addQuestCount(626, getLength(slotitemId[19]), 2)
            addQuestCount(626, getLength(slotitemId[20]), 3)
        }
        // 機種転換
        if (isMatchSecretary(628)) {
            addQuestCount(628, getLength(slotitemId[21]))
        }
        // 対空機銃量産
        addQuestCount(638, getLength(type2[21]))
        // 主力「陸攻」の調達
        addQuestCount(643, getLength(slotitemId[20]), 1) // 零式艦戦21型
        // 「洋上補給」物資の調達
        addQuestCount(645, getLength(slotitemId[35]), 1) // 三式弾
        // 工廠稼働！次期作戦準備！
        addQuestCount(653, getLength(slotitemId[4]), 1) // 14cm単装砲
        // 新型艤装の継続研究
        addQuestCount(663, getLength(type2[3]), 1) // 大口径主砲
        // 装備開発力の整備
        addQuestCount(673, getLength(type2[1])) // 小口径主砲
        // 工廠環境の整備
        addQuestCount(674, getLength(type2[21]), 1) // 機銃
        // 運用装備の統合整備
        addQuestCount(675, getLength(type2[6]), 1) // 艦上戦闘機
        addQuestCount(675, getLength(type2[21]), 2) // 機銃
        // 装備開発力の集中整備
        addQuestCount(676, getLength(type2[2]), 1) // 中口径主砲
        addQuestCount(676, getLength(type2[4]), 2) // 副砲
        addQuestCount(676, getLength(slotitemId[75]), 3) // ドラム缶(輸送用)
        // 継戦支援能力の整備
        addQuestCount(677, getLength(type2[3]), 1) // 大口径主砲
        addQuestCount(677, getLength(type2[10]), 2) // 水上偵察機
        addQuestCount(677, getLength(type2[5]) + getLength(type2[32]), 3) // 魚雷
        // 主力艦上戦闘機の更新
        addQuestCount(678, getLength(slotitemId[19]), 1) // 九六式艦戦
        addQuestCount(678, getLength(slotitemId[20]), 2) // 零式艦戦21型
        // 対空兵装の整備拡充
        addQuestCount(680, getLength(type2[21]), 1) // 機銃
        addQuestCount(680, getLength(type2[12]) + getLength(type2[13]) + getLength(type2[93]), 2) // 電探
        // 戦時改修A型高角砲の量産
        if (isMatchSecretary(686)) {
            addQuestCount(686, getLength(slotitemId[3]), 1) // 10cm連装高角砲
            addQuestCount(686, getLength(slotitemId[121]), 2) // 94式高射装置
        }
        // 航空戦力の強化
        addQuestCount(688, getLength(type2[6]), 1) // 艦上戦闘機
        addQuestCount(688, getLength(type2[7]), 2) // 艦上爆撃機
        addQuestCount(688, getLength(type2[8]), 3) // 艦上攻撃機
        addQuestCount(688, getLength(type2[10]), 4) // 水上偵察機
        // 新型兵装開発整備の強化
        addQuestCount(640, getLength(type2[1]), 1) // 小口径主砲
        addQuestCount(640, getLength(type2[2]), 2) // 中口径主砲
        addQuestCount(640, getLength(type2[5]) + getLength(type2[32]), 3) // 魚雷
        // 精鋭複葉機飛行隊の編成
        if (isMatchSecretary(654)) {
            addQuestCount(654, getLength(slotitemId[242]), 1) // Swordfish
            addQuestCount(654, getLength(slotitemId[249]), 2) // Fulmar
        }
        // 工廠フル稼働！新兵装を開発せよ！
        addQuestCount(655, getLength(type2[1]), 1) // 小口径主砲
        addQuestCount(655, getLength(type2[2]), 2) // 中口径主砲
        addQuestCount(655, getLength(type2[3]), 3) // 大口径主砲
        addQuestCount(655, getLength(type2[10]), 4) // 水上偵察機
        addQuestCount(655, getLength(type2[8]), 5) // 艦上攻撃機
        // 新型兵装開発整備の強化
        addQuestCount(657, getLength(type2[1]), 1) // 小口径主砲
        addQuestCount(657, getLength(type2[2]), 2) // 中口径主砲
        addQuestCount(657, getLength(type2[5]) + getLength(type2[32]), 3) // 魚雷
        // 航空戦力の再編増強準備
        addQuestCount(681, getLength(type2[7]), 1) // 艦上爆撃機
        addQuestCount(681, getLength(type2[8]), 2) // 艦上攻撃機
        // 潜水艦強化兵装の量産
        addQuestCount(1103, getLength(slotitemId[125]), 1) // 61cm三連装(酸素)魚雷
        // 潜水艦電子兵装の量産
        addQuestCount(1104, getLength(slotitemId[106]), 1) // 13号対空電探改
        // 夏の格納庫整備＆航空基地整備
        addQuestCount(1105, getLength(type2[47]), 1) // 陸攻
        // 【鋼材輸出】基地航空兵力を増備せよ！
        addQuestCount(1107, getLength(type2[6]), 1) // 艦上戦闘機
        addQuestCount(1107, getLength(type2[8]), 2) // 艦上攻撃機
        // 【機種整理統合】新型戦闘機の量産計画
        addQuestCount(1120, getLength(type2[6]), 1) // 艦上戦闘機
        addQuestCount(1120, getLength(type2[7]), 2) // 艦上爆撃機
        addQuestCount(1120, getLength(type2[8]), 3) // 艦上攻撃機
        // 改良三座水上偵察機の増備
        addQuestCount(1123, getLength(slotitemId[82]), 1) // 九七式艦攻(九三一空)
    }
    addQuestCount(613)
}

/**
 * 秘書艦条件に一致しているか
 * @param {Number} id 任務ID
 * @return {Boolean} 一致しているか
 */
function isMatchSecretary(id) {
    var secretary = GlobalContext.secretary
    if (secretary instanceof ShipDto) {
        switch (id) {
            case 318:
                var items = Java.from(secretary.item2)
                items.push(secretary.slotExItem)
                return items.filter(function (item) {
                    return item instanceof ItemDto && item.slotitemId === 145
                }).length >= 2
            case 626:
                if (secretary.shipInfo.flagship.equals("ほうしょう")) {
                    return secretary.item2.stream().filter(function (item) {
                        return item instanceof ItemDto
                    }).anyMatch(function (item) {
                        return item.slotitemId === 20 && item.alv === 7
                    })
                }
                return false
            case 628:
                var stype = secretary.stype
                if (stype === SHIP_TYPE.CV || stype === SHIP_TYPE.CVB || stype === SHIP_TYPE.CVL) {
                    return secretary.item2.stream().filter(function (item) {
                        return item instanceof ItemDto
                    }).anyMatch(function (item) {
                        return item.slotitemId === 96 && item.alv === 7
                    })
                }
                return false
            case 637:
                if (secretary.shipInfo.flagship.equals("ほうしょう")) {
                    return secretary.item2.stream().filter(function (item) {
                        return item instanceof ItemDto
                    }).anyMatch(function (item) {
                        return item.slotitemId === 19 && item.alv === 7 && item.level === 10
                    })
                }
                return false
            case 678:
                var item2 = secretary.item2
                var count = 0
                if (item2.size() > 1) {
                    for (var i = 0; i < 2; i++) {
                        if (item2.get(i) instanceof ItemDto && item2.get(i).slotitemId === 21) {
                            count++
                        }
                    }
                }
                return count === 2
            case 686:
                var ctype = secretary.shipInfo.json.api_ctype
                if ([1, 5, 12].indexOf(ctype) >= 0) { // 綾波型、暁型、吹雪型
                    if (item2.size() > 0) {
                        var item = item2.get(0)
                        return item instanceof ItemDto && item.slotitemId === 294 && item.level === 10
                    }
                }
                return false
            case 654:
                if (secretary.shipInfo.flagship.equals("アークロイヤル")) {
                    var item = secretary.item2.get(0)
                    if (item instanceof ItemDto) {
                        return item.slotitemId === 242 && item.level === 10
                    }
                }
                return false
        }
    }
    return false
}

/**
 * 近代化改修
 * @param {logbook.data.ActionData} data data
 */
function addCountForPowerupPart(data) {
    var powerup_flag = data.jsonObject.api_data.api_powerup_flag.intValue()
    if (powerup_flag === POWERUP_FLAG.SUCCESS) {
        addQuestCount(702) // 艦の「近代化改修」を実施せよ！
        addQuestCount(703) // 「近代化改修」を進め、戦備を整えよ！

        var ids = String(data.getField("api_id_items")).split(",")
        var shipList = getStoredShipMap()
        if (shipList instanceof Map) {
            var origin = shipList.get(data.jsonObject.api_data.api_ship.api_id.intValue())
            var stypes = ids.map(function(id) {
                return shipList.get(id | 0)
            }).map(function(ship) {
                return ship.stype
            }).reduce(function(previous, stypes) {
                previous[stypes] = (previous[stypes] | 0) + 1
                return previous
            }, {})

            if (origin.stype === SHIP_TYPE.DD) {
                if (stypes[SHIP_TYPE.DD] >= 3) {
                    addQuestCount(714) // 「駆逐艦」の改修工事を実施せよ！
                }
                if (stypes[SHIP_TYPE.CL] >= 3) {
                    addQuestCount(707) // 【桃の節句任務】駆逐艦桃の節句改修
                    addQuestCount(715) // 続：「駆逐艦」の改修工事を実施せよ！
                }
            }
            if (origin.stype === SHIP_TYPE.DE) {
                if (stypes[SHIP_TYPE.DD] >= 5) {
                    addQuestCount(708) // 【桃の節句任務】海防艦桃の節句改修
                }
            }
            // if (origin.stype === SHIP_TYPE.CVL) {
            //     if (stypes[SHIP_TYPE.CVL] >= 3) {
            //         addQuestCount(712) // 【桃の節句任務】菱餅改修：週
            //     }
            // }
            if ([SHIP_TYPE.CL, SHIP_TYPE.CLT, SHIP_TYPE.CT].indexOf(origin.stype) >= 0) {
                if (stypes[SHIP_TYPE.CL] + stypes[SHIP_TYPE.CLT] + stypes[SHIP_TYPE.CT] >= 3) {
                    addQuestCount(716) // 「軽巡」級の改修工事を実施せよ！
                }
                if (stypes[SHIP_TYPE.CA] + stypes[SHIP_TYPE.CAV] >= 3) {
                    addQuestCount(717) // 続：「軽巡」級の改修工事を実施せよ！
                }
            }
            if ([SHIP_TYPE.CA, SHIP_TYPE.CAV].indexOf(origin.stype) >= 0) {
                if (stypes[SHIP_TYPE.CL] >= 4) {
                    addQuestCount(712, 1, 1) // 【桃の節句】菱餅改修：2021 週
                }
            }
        }
    }
}

/**
 * 遠征
 * @param {logbook.data.ActionData} data data
 */
function addCountForMissionResultPart(data) {
    //0=失敗、1=成功、2=大成功
    var clear_result = data.jsonObject.api_data.api_clear_result.intValue()
    if (clear_result === EXPEDITION.SUCCESS || clear_result === EXPEDITION.GREAT_SUCCESS) {
        var quest_name = data.jsonObject.api_data.api_quest_name.toString()
        addQuestCount(402) //「遠征」を3回成功させよう！
        addQuestCount(403) //「遠征」を10回成功させよう！
        addQuestCount(404) //大規模遠征作戦、発令！
        switch (quest_name) {
            case "練習航海": // ID:01
                addQuestCount(436, 1, 1) // 練習航海及び警備任務を実施せよ！
                break
            case "長距離練習航海": // ID:02
                addQuestCount(436, 1, 2) // 練習航海及び警備任務を実施せよ！
                break
            case "警備任務": // ID:03
                addQuestCount(426, 1, 1) // 海上通商航路の警戒を厳とせよ！
                addQuestCount(434, 1, 1) // 特設護衛船団司令部、活動開始！
                addQuestCount(436, 1, 3) // 練習航海及び警備任務を実施せよ！
                break
            case "対潜警戒任務": // ID:04
                addQuestCount(426, 1, 2) // 海上通商航路の警戒を厳とせよ！
                addQuestCount(428, 1, 1) // 近海に侵入する敵潜を制圧せよ！
                addQuestCount(435, 1, 1) // 特設護衛船団司令部、活動開始！
                addQuestCount(436, 1, 4) // 練習航海及び警備任務を実施せよ！
                addQuestCount(437, 1, 1) // 小笠原沖哨戒線の強化を実施せよ！
                addQuestCount(438, 1, 2) // 南西諸島方面の海上護衛を強化せよ！
                break
            case "海上護衛任務": // ID:05
                addQuestCount(424) // 輸送船団護衛を強化せよ！
                addQuestCount(426, 1, 3) // 海上通商航路の警戒を厳とせよ！
                addQuestCount(434, 1, 2) // 特設護衛船団司令部、活動開始！
                addQuestCount(439, 1, 1) // 兵站強化遠征任務【基本作戦】
                addQuestCount(440, 1, 2) // 兵站強化遠征任務【拡張作戦】
                addQuestCount(444, 1, 1) // 新兵装開発資材輸送を船団護衛せよ！
                break
            case "兵站強化任務": // ID:A1
                addQuestCount(434, 1, 3) // 特設護衛船団司令部、活動開始！
                addQuestCount(438, 1, 1) // 南西諸島方面の海上護衛を強化せよ！
                addQuestCount(439, 1, 2) // 兵站強化遠征任務【基本作戦】
                break
            case "海峡警備行動": // ID:A2
                addQuestCount(428, 1, 2) // 近海に侵入する敵潜を制圧せよ！
                addQuestCount(434, 1, 4) // 特設護衛船団司令部、活動開始！
                break
            case "長時間対潜警戒": // ID:A3
                addQuestCount(428, 1, 3) // 近海に侵入する敵潜を制圧せよ！
                addQuestCount(435, 1, 2) // 特設護衛船団司令部、活動開始！
                break
            case "小笠原沖哨戒線": // ID:A5
                addQuestCount(437, 1, 2) // 小笠原沖哨戒線の強化を実施せよ！
                break
            case "小笠原沖戦闘哨戒": // ID:A6
                addQuestCount(437, 1, 3) // 小笠原沖哨戒線の強化を実施せよ！
                break
            case "タンカー護衛任務": // ID:09
                addQuestCount(434, 1, 5) // 特設護衛船団司令部、活動開始！
                addQuestCount(438, 1, 3) // 南西諸島方面の海上護衛を強化せよ！
                addQuestCount(444, 1, 3) // 新兵装開発資材輸送を船団護衛せよ！
                break
            case "強行偵察任務": // ID:10
                addQuestCount(426, 1, 4) // 海上通商航路の警戒を厳とせよ！
                addQuestCount(435, 1, 3) // 特設護衛船団司令部、活動開始！
                addQuestCount(436, 1, 5) // 練習航海及び警備任務を実施せよ！
                break
            case "ボーキサイト輸送任務": // ID:11
                addQuestCount(439, 1, 3) // 兵站強化遠征任務【基本作戦】
                addQuestCount(444, 1, 5) // 新兵装開発資材輸送を船団護衛せよ！
                break
            case "資源輸送任務": // ID:12
                addQuestCount(444, 1, 2) // 新兵装開発資材輸送を船団護衛せよ！
                break
            case "包囲陸戦隊撤収作戦": // ID:14
                addQuestCount(435, 1, 4) // 特設護衛船団司令部、活動開始！
                break
            case "南西方面航空偵察作戦": // ID:B1
                addQuestCount(435, 1, 5) // 特設護衛船団司令部、活動開始！
                addQuestCount(437, 1, 4) // 小笠原沖哨戒線の強化を実施せよ！
                addQuestCount(439, 1, 4) // 兵站強化遠征任務【基本作戦】
                addQuestCount(444, 1, 4) // 新兵装開発資材輸送を船団護衛せよ！
                break
            case "南西諸島捜索撃滅戦": // ID:B5
                addQuestCount(438, 1, 4) // 南西諸島方面の海上護衛を強化せよ！
                break
            case "ブルネイ泊地沖哨戒": // ID:41
                addQuestCount(440, 1, 1) // 兵站強化遠征任務【拡張作戦】
                break
            case "南西海域戦闘哨戒": // ID:46
                addQuestCount(440, 1, 5) // 兵站強化遠征任務【拡張作戦】
                break
            case "潜水艦派遣演習": // ID:29
                addQuestCount(442, 1, 2) // 西方連絡作戦準備を実施せよ！
                break
            case "潜水艦派遣作戦": // ID:30
                addQuestCount(442, 1, 3) // 西方連絡作戦準備を実施せよ！
                break
            case "西方海域偵察作戦": // ID:D1
                addQuestCount(442, 1, 1) // 西方連絡作戦準備を実施せよ！
                break
            case "欧州方面友軍との接触": // ID:D3
                addQuestCount(442, 1, 4) // 西方連絡作戦準備を実施せよ！
                break
            case "東京急行": // ID:37
                addQuestCount(410) // 南方への輸送作戦を成功させよ！
                addQuestCount(411) // 南方への鼠輸送を継続実施せよ!
                break
            case "東京急行(弐)": // ID:38
                addQuestCount(410) // 南方への輸送作戦を成功させよ！
                addQuestCount(411) // 南方への鼠輸送を継続実施せよ!
                break
            case "水上機前線輸送": // ID:40
                addQuestCount(440, 1, 3) // 兵站強化遠征任務【拡張作戦】
                break
            case "強行鼠輸送作戦": // ID:E2
                addQuestCount(440, 1, 4) // 兵站強化遠征任務【拡張作戦】
                break
        }
    }
}

/**
 * 補給
 * @param {logbook.data.ActionData} data data
 */
function addCountForChargePart(data) {
    addQuestCount(504) // 艦隊酒保祭り！
}

/**
 * 入渠
 * @param {logbook.data.ActionData} data data
 */
function addCountForEnteringDockPart(data) {
    addQuestCount(503) // 艦隊大整備！
}

/**
 * 装備改修
 * @param {logbook.data.ActionData} data data
 */
function addCountForRemodelSlotPart(data) {
    addQuestCount(619) // 装備の改修強化
}

/**
 * 演習
 * @param {logbook.data.ActionData} data data
 */
function addCountForPracticeBattleResultPart(data) {
    var lastBattleDto = GlobalContext.lastBattleDto
    addQuestCount(303) // 「演習」で練度向上！
    var rank = lastBattleDto.rank
    var ships = Java.from(lastBattleDto.dock.ships)
    var stypes = lastBattleDto.dock.ships.stream().collect(Collectors.groupingBy(function (ship) {
        return ship.stype
    }))
    if (isWin(rank)) {
        var has353Org = [SHIP_TYPE.CA, SHIP_TYPE.CAV].indexOf(ships[0].stype) >= 0 &&
            (getLength(stypes[SHIP_TYPE.CA]) + getLength(stypes[SHIP_TYPE.CAV])) >= 4 && getLength(stypes[SHIP_TYPE.DD]) >= 2
        addQuestCount(304) // 「演習」で他提督を圧倒せよ！
        addQuestCount(302) // 大規模演習
        addQuestCount(311) // 精鋭艦隊演習
        var cl = getLength(stypes[SHIP_TYPE.CL])
        if (cl >= 2) {
            addQuestCount(318, 1, 1) // 給糧艦「伊良湖」の支援[勝利]
        }
        // 旗艦に空母が居るか
        if ([SHIP_TYPE.CVL, SHIP_TYPE.CV, SHIP_TYPE.CVB].some(function (stype) { return ships[0].stype === stype })) {
            var dd = getLength(stypes[SHIP_TYPE.DD])
            var cv = getLength(stypes[SHIP_TYPE.CVL]) + getLength(stypes[SHIP_TYPE.CV]) + getLength(stypes[SHIP_TYPE.CVB])
            if (dd > 1 && cv > 1) {
                addQuestCount(330) // 空母機動部隊、演習始め！
            }
        }
        if (has353Org) {
            addQuestCount(353) // 「巡洋艦戦隊」演習！
        }
    }
    var dedd = getLength(stypes[SHIP_TYPE.DE]) + getLength(stypes[SHIP_TYPE.DD])
    var deddcl = getLength(stypes[SHIP_TYPE.DE]) + getLength(stypes[SHIP_TYPE.DD]) + getLength(stypes[SHIP_TYPE.CL])
    if (isWinS(rank)) {
        var flotilla16 = ships.map(function (ship) {
            return ship.shipInfo.flagship
        }).filter(function (name) {
            return ["あまつかぜ", "ゆきかぜ", "ときつかぜ", "はつかぜ"].indexOf(name) >= 0
        }).length
        var flotilla18 = ships.map(function (ship) {
            return ship.shipInfo.flagship
        }).filter(function (name) {
            return ["かすみ", "あられ", "かげろう", "しらぬい"].indexOf(name) >= 0
        }).length
        var flotilla19 = ships.map(function (ship) {
            return ship.shipInfo.flagship
        }).filter(function (name) {
            return ["いそなみ", "うらなみ", "あやなみ", "しきなみ"].indexOf(name) >= 0
        }).length
        var teatime = ships.map(function (ship) {
            return ship.shipInfo.flagship
        }).filter(function (name) {
            return ["ウォースパイト", "こんごう", "アークロイヤル", "ネルソン", "ジャーヴィス", "ジェーナス"].indexOf(name) >= 0
        }).length
        var has354Org = ships[0].shipId === 707 && ships.map(function (ship) {
            return (ship.shipInfo.json.api_ctype | 0)
        }).filter(function (ctype) {
            // Fletcher級orJohn C.Butler級
            return ctype === 91 || ctype === 87
        }).length >= 2
        var hasExFlotilla15 = ships.length >= 2 && [568, 670].indexOf(ships[0].shipId) >= 0 && [568, 670].indexOf(ships[1].shipId) >= 0
        var hasExFlotilla19 = ships.map(function (ship) {
            return ship.shipId
        }).filter(function (id) {
            return id === 666 || id === 647 || id === 195 || id === 627
        }).length >= 4
        var has357Org = ships.map(function (ship) {
            return ship.shipInfo.flagship
        }).filter(function (name) {
            return ["やまと", "むさし"].indexOf(name) >= 0
        }).length >= 2 && getLength(stypes[SHIP_TYPE.CL]) === 1 && getLength(stypes[SHIP_TYPE.DD]) === 2
        if (flotilla18 >= 4) {
            addQuestCount(337) // 「十八駆」演習！
        }
        if (flotilla19 >= 4) {
            addQuestCount(339) // 「十九駆」演習！
        }
        if (dedd >= 3) {
            addQuestCount(340) // 【桃の節句任務】桃の節句演習！
        }
        if (dedd >= 2) {
            addQuestCount(329) // 【節分任務】節分演習！
        }
        if (teatime >= 4) {
            addQuestCount(345) // 演習ティータイム！
        }
        if (has354Org) {
            addQuestCount(354) // 「改装特務空母」任務部隊演習！
        }
        if (hasExFlotilla15) {
            addQuestCount(355) // 精鋭「第十五駆逐隊」第一小隊演習！
        }
        if (hasExFlotilla19) {
            addQuestCount(356) // 精鋭「第十九駆逐隊」演習！
        }
        if (has357Org) {
            addQuestCount(357) // 「大和型戦艦」第一戦隊演習、始め！
        }
        if (flotilla16 >= 2) {
            addQuestCount(368) // 「十六駆」演習！
        }
    }
    if (isWinA(rank)) {
        var flotilla7 = ships.map(function (ship) {
            return ship.shipInfo.flagship
        }).filter(function (name) {
            return ["おぼろ", "あけぼの", "さざなみ", "うしお"].indexOf(name) >= 0
        }).length
        // 旗艦 秋月型 + 駆逐艦 2 + 航空戦艦 2
        var has372Org = (ships[0].shipInfo.json.api_ctype | 0) === 54 && getLength(stypes[SHIP_TYPE.DD]) >= 3 && getLength(stypes[SHIP_TYPE.BBV]) >= 2
        if (dedd >= 3 && deddcl >= 4) {
            addQuestCount(342) // 小艦艇群演習強化任務
        }
        var mfofmf = ships.map(function (ship) {
            return ship.shipId
        }).filter(function (id) {
            return [542, 563, 564, 648].indexOf(id) >= 0
        }).length
        if (mfofmf >= 4) {
            addQuestCount(346) // 最精鋭！主力オブ主力、演習開始！
        }
        // 旗艦に軽巡級(雷巡を除く)が居るか
        if ([SHIP_TYPE.CL, SHIP_TYPE.CT].some(function (stype) { return ships[0].stype === stype })) {
            var cl = getLength(stypes[SHIP_TYPE.CL]) + getLength(stypes[SHIP_TYPE.CT])
            if (cl >= 3) {
                addQuestCount(348) // 「精鋭軽巡」演習！
            }
        }
        if (flotilla7 >= 4) {
            addQuestCount(350) // 精鋭「第七駆逐隊」演習開始！
        }
        if (has372Org) {
            addQuestCount(372) // 水上艦「艦隊防空演習」を実施せよ！
        }
    }
}

/**
 * 資材更新
 */
function updateMaterial() {
    var material = GlobalContext.material
    if (material instanceof MaterialDto) {
        var fuel = material.fuel
        var ammo = material.ammo
        var steel = material.metal
        var bauxite = material.bauxite
        var research = material.research
        // 燃料
        saveQuestCount(645, fuel, 2, true) // 「洋上補給」物資の調達[燃料]
        saveQuestCount(655, fuel, 6, true) // 工廠フル稼働！新兵装を開発せよ！[燃料]
        // 弾薬
        saveQuestCount(645, ammo, 3, true) // 「洋上補給」物資の調達[弾薬]
        saveQuestCount(654, ammo, 3, true) // 精鋭複葉機飛行隊の編成[弾薬]
        saveQuestCount(712, ammo, 3, true) // 【桃の節句】菱餅改修：2021 週[弾薬]
        saveQuestCount(1105, ammo, 4, true) // 夏の格納庫整備＆航空基地整備
        // 鋼材
        saveQuestCount(663, steel, 2, true) // 新型艤装の継続研究[鋼材]
        saveQuestCount(674, steel, 2, true) // 工廠環境の整備[鋼材]
        saveQuestCount(676, steel, 4, true) // 装備開発力の集中整備[鋼材]
        saveQuestCount(677, steel, 4, true) // 継戦支援能力の整備[鋼材]
        saveQuestCount(686, steel, 3, true) // 戦時改修A型高角砲の量産[鋼材]
        saveQuestCount(640, steel, 4, true) // 新型兵装開発整備の強化[鋼材]
        saveQuestCount(655, steel, 7, true) // 工廠フル稼働！新兵装を開発せよ！[鋼材]
        saveQuestCount(714, steel, 2, true) // 「駆逐艦」の改修工事を実施せよ！[鋼材]
        saveQuestCount(715, steel, 2, true) // 続：「駆逐艦」の改修工事を実施せよ！[鋼材]
        saveQuestCount(716, steel, 2, true) // 「軽巡」級の改修工事を実施せよ！[鋼材]
        saveQuestCount(717, steel, 2, true) // 続：「軽巡」級の改修工事を実施せよ！[鋼材]
        saveQuestCount(712, steel, 4, true) // 【桃の節句】菱餅改修：2021 週[鋼材]
        saveQuestCount(1107, steel, 3, true) // 【鋼材輸出】基地航空兵力を増備せよ！[鋼材]
        // ボーキサイト
        saveQuestCount(675, bauxite, 3, true) // 運用装備の統合整備[ボーキサイト]
        saveQuestCount(678, bauxite, 3, true) // 主力艦上戦闘機の更新[ボーキサイト]
        saveQuestCount(680, bauxite, 3, true) // 対空兵装の整備拡充[ボーキサイト]
        saveQuestCount(688, bauxite, 5, true) // 航空戦力の強化[ボーキサイト]
        saveQuestCount(654, bauxite, 4, true) // 精鋭複葉機飛行隊の編成[ボーキサイト]
        saveQuestCount(655, bauxite, 8, true) // 工廠フル稼働！新兵装を開発せよ！[ボーキサイト]
        saveQuestCount(681, bauxite, 4, true) // 航空戦力の再編増強準備[ボーキサイト]
        saveQuestCount(714, bauxite, 3, true) // 「駆逐艦」の改修工事を実施せよ！[ボーキサイト]
        saveQuestCount(715, bauxite, 3, true) // 続：「駆逐艦」の改修工事を実施せよ！[ボーキサイト]
        saveQuestCount(716, bauxite, 3, true) // 「軽巡」級の改修工事を実施せよ！[ボーキサイト]
        saveQuestCount(717, bauxite, 3, true) // 続：「軽巡」級の改修工事を実施せよ！[ボーキサイト]
        saveQuestCount(1120, bauxite, 6, true) // 【機種整理統合】新型戦闘機の量産計画[ボーキサイト]
        // 開発資材
        saveQuestCount(681, research, 3, true) // 航空戦力の再編増強準備[開発資材]
        saveQuestCount(712, research, 2, true) // 【桃の節句】菱餅改修：2021 週[開発資材]
        saveQuestCount(1103, research, 2, true) // 潜水艦強化兵装の量産[開発資材]
        saveQuestCount(1104, research, 2, true) // 潜水艦電子兵装の量産[開発資材]
        saveQuestCount(1107, research, 4, true) // 【鋼材輸出】基地航空兵力を増備せよ！[開発資材]
    }
}

/**
 * 秘書艦更新
 */
function updateSecretary() {
    // 給糧艦「伊良湖」の支援[戦闘糧食]
    saveQuestCount(318, isActive(318) && getQuestCount(318, 1) >= 3 && isMatchSecretary(318) ? 1 : 0, 2, true)
    saveQuestCount(678, isMatchSecretary(678) ? 1 : 0, 4, true) // 主力艦上戦闘機の更新
}

/**
 * 任務回数更新など
 */
function updateQuestCount() {
    var lastUpdateQuestTime = getLastUpdateQuestTime()
    var nowTime = getNowDateTime()
    // デイリー
    if (!lastUpdateQuestTime.equals(nowTime)) {
        resetQuestCountOfDaily()
    }
    // ウィークリー
    if (!lastUpdateQuestTime.minusDays((lastUpdateQuestTime.dayOfWeek.value - 1) % 7).equals(nowTime.minusDays((nowTime.dayOfWeek.value - 1) % 7))) {
        resetQuestCountOfWeekly()
    }
    // マンスリー
    if (!lastUpdateQuestTime.withDayOfMonth(1).equals(nowTime.withDayOfMonth(1))) {
        resetQuestCountOfMonthly()
    }
    // クォータリー
    if (!((Math.floor(lastUpdateQuestTime.month.value / 3) % 4 === Math.floor(nowTime.month.value / 3) % 4) &&
            (lastUpdateQuestTime.year.value === nowTime.year.value || !(lastUpdateQuestTime.year.value === nowTime.year.value - 1 && lastUpdateQuestTime.month.value === 12)))) {
        resetQuestCountOfQuarterly()
    }
    // イヤリー
    for (var i = 0;i < 12; i++) {
        if (!lastUpdateQuestTime.minusMonths(i).withDayOfYear(1).equals(nowTime.minusMonths(i).withDayOfYear(1))) {
            resetQuestCountOfYearly(nowTime.monthValue)
        }
    }
    saveLastUpdateQuestTime(nowTime)
}

/**
 * 任務回数の調整
 * @param {logbook.data.ActionData} data data
 */
function adjustQuestCount(data) {
    var json = data.jsonObject.api_data
    if (json.api_list instanceof List) {
        Java.from(json.api_list).filter(function (quest) {
            return quest.api_type !== QUEST_TYPE.ONCE
        }).filter(function (quest) {
            return quest.api_no in QUEST_DATA
        }).forEach(function (quest) {
            var conditions = QUEST_DATA[quest.api_no]
            conditions.forEach(function (condition, i) {
                switch (quest.api_progress_flag.intValue()) {
                    case QUEST_PROGRESS_FLAG.NONE:
                        switch (quest.api_state.intValue()) {
                            case QUEST_STATE.NOT_ORDER:
                            case QUEST_STATE.ACTIVE:
                                if (condition.isAdjust) {
                                    // 50%↑
                                    if (getQuestCount(quest.api_no, i + 1) >= Math.ceil(condition.max * 0.5)) {
                                        saveQuestCount(quest.api_no, Math.ceil(condition.max * 0.5) - 1, i + 1, true)
                                    }
                                }
                                break
                            case QUEST_STATE.COMPLETE:
                                saveQuestCount(quest.api_no, condition.max, i + 1, true)
                                break
                        }
                        break
                    case QUEST_PROGRESS_FLAG.HALF:
                        if (condition.isAdjust) {
                            // 50%↓
                            if (getQuestCount(quest.api_no, i + 1) < Math.ceil(condition.max * 0.5)) {
                                saveQuestCount(quest.api_no, Math.ceil(condition.max * 0.5), i + 1, true)
                            }
                            // 80%↑
                            if (getQuestCount(quest.api_no, i + 1) > Math.ceil(condition.max * 0.8)) {
                                saveQuestCount(quest.api_no, Math.ceil(condition.max * 0.8) - 1, i + 1, true)
                            }
                        }
                        break
                    case QUEST_PROGRESS_FLAG.EIGHTY:
                        if (condition.isAdjust) {
                            // 80%↓
                            if (getQuestCount(quest.api_no, i + 1) < Math.ceil(condition.max * 0.8)) {
                                saveQuestCount(quest.api_no, Math.ceil(condition.max * 0.8), i + 1, true)
                            }
                            // 100%↑
                            if (getQuestCount(quest.api_no, i + 1) >= condition.max) {
                                saveQuestCount(quest.api_no, condition.max - 1, i + 1, true)
                            }
                        }
                        break
                }
            })
        })
    }
}

/**
 * デイリーのカウントをリセットする
 */
function resetQuestCountOfDaily() {
    Object.keys(QUEST_DATA).map(function (id) {
        return QUEST_DATA[id].map(function (quest, i) {
            return [id, i + 1, quest]
        }).filter(function (data) {
            if (Array.isArray(data[2].reset)) {
                return data[2].reset.some(function (reset) {
                    return reset === RESET.DAILY || reset === RESET.NOT_SATISFY_DAILY && getQuestCount(data[0], data[1]) >= data[2].max
                })
            }
            return data[2].reset === RESET.DAILY || data[2].reset === RESET.NOT_SATISFY_DAILY && getQuestCount(data[0], data[1]) >= data[2].max
        })
    }).reduce(function (acc, val) {
        return acc.concat(val)
    }, []).forEach(function (data) {
        saveQuestCount(data[0], 0, data[1], true)
        var isNotOrder = function (reset) {
            if (Array.isArray(reset)) {
                return reset.some(function (reset) {
                    return reset === RESET.DAILY
                })
            }
            return reset === RESET.DAILY
        }(QUEST_DATA[data[0]][data[1] - 1].reset)
        if (isNotOrder) {
            notOrder(data[0])
        }
    })
}

/**
 * ウィークリーのカウントをリセットする
 */
function resetQuestCountOfWeekly() {
    Object.keys(QUEST_DATA).map(function (id) {
        return QUEST_DATA[id].map(function (quest, i) {
            return [id, i + 1, quest]
        }).filter(function (data) {
            if (Array.isArray(data[2].reset)) {
                return data[2].reset.some(function (reset) {
                    return reset === RESET.WEEKLY || reset === RESET.NOT_SATISFY_WEEKLY && getQuestCount(data[0], data[1]) >= data[2].max
                })
            }
            return data[2].reset === RESET.WEEKLY || data[2].reset === RESET.NOT_SATISFY_WEEKLY && getQuestCount(data[0], data[1]) >= data[2].max
        })
    }).reduce(function (acc, val) {
        return acc.concat(val)
    }, []).forEach(function (data) {
        saveQuestCount(data[0], 0, data[1], true)
        var isNotOrder = function (reset) {
            if (Array.isArray(reset)) {
                return reset.some(function (reset) {
                    return reset === RESET.WEEKLY
                })
            }
            return reset === RESET.WEEKLY
        }(QUEST_DATA[data[0]][data[1] - 1].reset)
        if (isNotOrder) {
            notOrder(data[0])
        }
    })
}

/**
 * マンスリーのカウントをリセットする
 */
function resetQuestCountOfMonthly() {
    Object.keys(QUEST_DATA).map(function (id) {
        return QUEST_DATA[id].map(function (quest, i) {
            return [id, i + 1, quest]
        }).filter(function (data) {
            if (Array.isArray(data[2].reset)) {
                return data[2].reset.some(function (reset) {
                    return reset === RESET.MONTHLY || reset === RESET.NOT_SATISFY_MONTHLY && getQuestCount(data[0], data[1]) >= data[2].max
                })
            }
            return data[2].reset === RESET.MONTHLY || data[2].reset === RESET.NOT_SATISFY_MONTHLY && getQuestCount(data[0], data[1]) >= data[2].max
        })
    }).reduce(function (acc, val) {
        return acc.concat(val)
    }, []).forEach(function (data) {
        saveQuestCount(data[0], 0, data[1], true)
        var isNotOrder = function (reset) {
            if (Array.isArray(reset)) {
                return reset.some(function (reset) {
                    return reset === RESET.MONTHLY
                })
            }
            return reset === RESET.MONTHLY
        }(QUEST_DATA[data[0]][data[1] - 1].reset)
        if (isNotOrder) {
            notOrder(data[0])
        }
    })
}

/**
 * クォータリーのカウントをリセットする
 */
function resetQuestCountOfQuarterly() {
    Object.keys(QUEST_DATA).map(function (id) {
        return QUEST_DATA[id].map(function (quest, i) {
            return [id, i + 1, quest]
        }).filter(function (data) {
            if (Array.isArray(data[2].reset)) {
                return data[2].reset.some(function (reset) {
                    return reset === RESET.QUARTERLY || reset === RESET.NOT_SATISFY_QUARTERLY && getQuestCount(data[0], data[1]) >= data[2].max
                })
            }
            return data[2].reset === RESET.QUARTERLY || data[2].reset === RESET.NOT_SATISFY_QUARTERLY && getQuestCount(data[0], data[1]) >= data[2].max
        })
    }).reduce(function (acc, val) {
        return acc.concat(val)
    }, []).forEach(function (data) {
        saveQuestCount(data[0], 0, data[1], true)
        var isNotOrder = function (reset) {
            if (Array.isArray(reset)) {
                return reset.some(function (reset) {
                    return reset === RESET.QUARTERLY
                })
            }
            return reset === RESET.QUARTERLY
        }(QUEST_DATA[data[0]][data[1] - 1].reset)
        if (isNotOrder) {
            notOrder(data[0])
        }
    })
}

/**
 * イヤリーのカウントをリセットする
 */
function resetQuestCountOfYearly(monthValue) {
    Object.keys(QUEST_DATA).map(function (id) {
        return QUEST_DATA[id].map(function (quest, i) {
            return [id, i + 1, quest]
        }).filter(function (data) {
            if (Array.isArray(data[2].reset)) {
                // あまり良くない書き方
                return data[2].reset.indexOf(RESET.YEARLY) >= 0 && data[2].reset.indexOf(100 + monthValue) >= 0
            }
            return false
        })
    }).reduce(function (acc, val) {
        return acc.concat(val)
    }, []).forEach(function (data) {
        saveQuestCount(data[0], 0, data[1], true)
        notOrder(data[0])
    })
}

/**
 * 配列長を返す(Null対策)
 *
 * @param {[]} arrays 配列
 * @return {Number} 配列長
 */
function getLength(arrays) {
    return (arrays || []).length
}
