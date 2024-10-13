load("script/utils.js");

function header() {
	return ["表示位置", "種", "分類", "状態", "進捗", "タイトル", "内容", "燃料", "弾薬", "鋼材", "ボーキ", "戦果"];
}

function begin() {}

function questCategory(category) {
	switch (category) {
		case 1:
			return "編成";
		case 2:
		case 8:
		case 9:
		case 10:
			return "出撃";
		case 3:
			return "演習";
		case 4:
			return "遠征";
		case 5:
			return "補給"; // 入渠も含むが文字数の関係
		case 6:
		case 11:
			return "工廠";
		case 7:
			return "改装";
		default:
			return "その他";
	}
}

function questType(type) {
	switch (type) {
		case 1:
			return "単";
		case 2:
			return "日";
		case 3:
			return "週";
		case 6:
			return "月";
		case 7:
			return "他";
	}
	if (type > 100) {
		return "年";
	}
	return "？";
}

function getRankingPoint(questNo) {
	switch(questNo) {
		// case 237: // 【節分拡張任務】南方海域 艦隊決戦
		// 	return 180;
		// case 843: // 【節分拡張任務】令和二年節分作戦、全力出撃！
		case 843: // 【節分拡張任務】令和三年節分作戦、全力出撃！
			return 203;
		case 854: // 戦果拡張任務！「Z作戦」前段作戦
			return 350;
		case 888: // 新編成「三川艦隊」、鉄底海峡に突入せよ！
			return 200;
		case 893: // 泊地周辺海域の安全確保を徹底せよ！
			return 300;
		case 872: // 戦果拡張任務！「Z作戦」後段作戦
			return 400;
		case 284: // 南西諸島方面「海上警備行動」発令！
			return 80;
		case 845: // 発令！「西方海域作戦」
			return 330;
		case 903: // 拡張「六水戦」、最前線へ！
			return 390;
		case 947: // AL作戦
			return 480;
		case 948: // 機動部隊決戦
			return 600;
		case 949: // 改装特務空母「Gambier Bay Mk.II」抜錨！
			return 800;
	}
	return 0;
}

function body(quest) {
    var point = getRankingPoint(quest.no);
	return toComparable([
		String("" + quest.getPage() + "-" + quest.getPos()),
		questType(parseInt(quest.json.api_label_type)),
		questCategory(parseInt(quest.json.api_category)),
		quest.getStateString(),
		quest.getProgressString(),
		quest.getTitle(),
		quest.getDetail(),
		quest.getFuel(),
		quest.getAmmo(),
		quest.getMetal(),
		quest.getBauxite(),
		String(point > 0 ? point : ""),
	]);
}

function end() {}
