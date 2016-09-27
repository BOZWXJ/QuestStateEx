//ver1.6.2β-prototype
//Author: Nishisonic
//        Nekopanda

load("script/utils.js");
load("script/ScriptData.js");
data_prefix = "questStateEx_";

TableItem = Java.type("org.eclipse.swt.widgets.TableItem");
SWT = Java.type("org.eclipse.swt.SWT");
SWTResourceManager = Java.type("org.eclipse.wb.swt.SWTResourceManager");
Listener = Java.type("org.eclipse.swt.widgets.Listener");
RGB = Java.type("org.eclipse.swt.graphics.RGB");
Button = Java.type("org.eclipse.swt.widgets.Button");
Composite = Java.type("org.eclipse.swt.widgets.Composite");
Point = Java.type("org.eclipse.swt.graphics.Point");
Shell = Java.type("org.eclipse.swt.widgets.Shell");
FillLayout = Java.type("org.eclipse.swt.layout.FillLayout");
Label = Java.type("org.eclipse.swt.widgets.Label");
SelectionAdapter = Java.type("org.eclipse.swt.events.SelectionAdapter");

AppConstants = Java.type("logbook.constants.AppConstants");
ReportUtils = Java.type("logbook.util.ReportUtils");
QuestTable = Java.type("logbook.gui.QuestTable");
ApplicationMain = Java.type("logbook.gui.ApplicationMain");


var stateIndex = -1;
var categoryIndex = -1;
var progressIndex = -1;
var tip = null;
var composite = null;
function begin(header) {
    for (var i = 1; i < header.length; ++i) {
        if (header[i].equals("表示位置")) {
            stateIndex = i;
        }
        if (header[i].equals("分類")) {
            categoryIndex = i;
        }
        if (header[i].equals("進捗詳細")) {
            progressIndex = i;
        }
    }
}

function categoryColor(category) {
	switch (category) {
		case 1:		//編成
			return new RGB( 0xAA, 0xFF, 0xAA );
		case 2:		//出撃
			return new RGB( 0xFF, 0xCC, 0xCC );
		case 3:		//演習
			return new RGB( 0xDD, 0xFF, 0xAA );
		case 4:		//遠征
			return new RGB( 0xCC, 0xFF, 0xFF );
		case 5:		//補給/入渠
			return new RGB( 0xFF, 0xFF, 0xCC );
		case 6:		//工廠
			return new RGB( 0xDD, 0xCC, 0xBB );
		case 7:		//改装
			return new RGB( 0xDD, 0xCC, 0xFF );
		case 8:		//その他
		default:
			return new RGB( 0xFF, 0xFF, 0xFF );
	}
}

function progressColor(rate) {
	if ( rate < 0.5 ) {
		return new RGB( 0xFF, 0x88, 0x00 );
	}
	else if ( rate < 0.8 ) {
		return new RGB( 0x00, 0xCC, 0x00 );
	}
	else if ( rate < 1.0 ) {
		return new RGB( 0x00, 0x88, 0x00 );
	}
	else {
		return new RGB( 0x00, 0x88, 0xFF );
	}
}

var paintHandler = new Listener({
	handleEvent: function(event) {
		var gc = event.gc;
		var old = gc.background;
		var d = event.item.data;
		var backcolor = null;
		// 背景を描く
		if(event.index == categoryIndex) {
			backcolor = d.cat;
		}
		else if(event.index == stateIndex) {
			backcolor = d.state;
		}
		if(backcolor == null) {
			backcolor = d.back;
		}
		if(backcolor != null) {
			gc.background = backcolor;
			gc.fillRectangle(event.x, event.y, event.width, event.height);
		}
		// 進捗を描く
		if(event.index == progressIndex) {
			if(d.prog != null) {
				gc.background = d.prog;
				// バーを下 1/5 に表示する
				var y = event.y + event.height * 4 / 5;
				// はみ出した部分はクリッピングされるので高さはそのままでいい
				gc.fillRectangle(event.x, y, event.width * d.rate, event.height);
			}
		}
		gc.background = old;
		event.detail &= ~SWT.BACKGROUND;
	}
});

function setTableListener(table){
	listener = getData("phandler");
	if(listener != null) {
		table.removeListener(SWT.EraseItem, listener);
	}
	table.addListener(SWT.EraseItem, paintHandler);
	setTmpData("phandler", paintHandler);
}

function create(table, data, index) {
	if(index == 0) setTableListener(table);

    var item = new TableItem(table, SWT.NONE);
    item.setText(ReportUtils.toStringArray(data));

    var quest = data[0].get();
	var d = { state: null, back: null, cat: null, prog: null, quest: quest };

    // 偶数行に背景色を付ける
    if ((index % 2) != 0) {
	//	d.back = SWTResourceManager.getColor(AppConstants.ROW_BACKGROUND);
    }

	// 遂行中はハイライト DC
	var state = parseInt(quest.json.api_state);
	if(state == 2 || state == 3) {
		d.state = SWTResourceManager.getColor(new RGB(255, 215, 0));
	}

    // 分類
	var catcolor = categoryColor(parseInt(quest.json.api_category));
    d.cat = SWTResourceManager.getColor(catcolor);

	// 進捗
	d.rate = getData("rate" + quest.no);
	if(d.rate != null && d.rate >= 0) {
		d.prog = SWTResourceManager.getColor(progressColor(d.rate));
	}

	item.setData(d);

	var TableListener = new Listener({
    	handleEvent : function(event) {
    	    var _item = table.getItem(new Point(event.x, event.y));
   		    switch (event.type) {
				case SWT.MouseExit:
					if(_item != null) break;
				case SWT.Deactivate:
        		case SWT.Dispose:
        		case SWT.KeyDown:
					_item = null;
	        	case SWT.MouseHover: {
					//dispose
					//->データがnull
					//->例外任務または定期系任務でない
					if(_item == null || getData("cnt" + _item.data.quest.no) == null){
						setTmpData("no",-1);
        				if (tip == null) break;
         				tip.dispose();
          				tip = null;
          				composite = null;
					} else if(_item.data.quest.no != getData("no")){
       	     			if (tip != null && !tip.isDisposed()) tip.dispose();
        	   			tip = new Shell(table.getShell(), SWT.ON_TOP | SWT.TOOL);
						tip.setLayout(new FillLayout());
						composite = new Composite (tip, SWT.NONE);
						var infoLabel = new Label(composite,SWT.NONE);
						infoLabel.setText(_item.data.quest.title);
						infoLabel.setLocation(0, 0);
						infoLabel.pack();
						var plusButton = new Button(composite,SWT.NULL);
						plusButton.setText("+");
						plusButton.setLocation(0, infoLabel.getSize().y);
						plusButton.setData(_item.data.quest.no);
						plusButton.pack();
						var countLabel = new Label(composite,SWT.NONE);
						countLabel.setText(getData("cnt" + _item.data.quest.no) + "/" + getData("max" + _item.data.quest.no));
						countLabel.setLocation(plusButton.getSize().x + 5, infoLabel.getSize().y);
						countLabel.pack();
						var minusButton = new Button(composite,SWT.NULL);
						minusButton.setText("-");
						minusButton.setLocation(plusButton.getSize().x + countLabel.getSize().x + 10, infoLabel.getSize().y);
						minusButton.setData(_item.data.quest.no);
						minusButton.pack();
						var PlusButtonSelectionEvent = Java.extend(SelectionAdapter,{
    						widgetSelected : function(e){
   							 	if(getData("cnt" + e.widget.data) < getData("max" + e.widget.data)){
									setData("cnt" + e.widget.data,getData("cnt" + e.widget.data) + 1);
									updateCount(countLabel,e.widget.data);
								}
							}
						});
						var MinusButtonSelectionEvent = Java.extend(SelectionAdapter,{
   							 widgetSelected : function(e){
   							 	if(getData("cnt" + e.widget.data) > 0){
									setData("cnt" + e.widget.data,getData("cnt" + e.widget.data) - 1);
									updateCount(countLabel,e.widget.data);
								}
  							}
						});
						plusButton.addSelectionListener(new PlusButtonSelectionEvent());
						minusButton.addSelectionListener(new MinusButtonSelectionEvent());
						composite.pack();
						var size = tip.computeSize (SWT.DEFAULT, SWT.DEFAULT);
						var pt = table.toDisplay (event.x, event.y);
						tip.setBounds (pt.x, pt.y - 70, size.x, size.y);
						tip.setVisible (true);
						setTmpData("no",_item.data.quest.no);
       				}
        		}
        	}
		}
	});

	if(!getData("set")){
		table.setToolTipText("");
		table.addListener(SWT.MouseExit, TableListener);
		table.addListener(SWT.Deactivate, TableListener);
		table.addListener(SWT.Dispose, TableListener);
    	table.addListener(SWT.KeyDown, TableListener);
    	table.addListener(SWT.MouseHover, TableListener);
	}

    return item;
}

function end() { }

function updateCount(label,no){
	if(!label.isDisposed()) label.setText(getData("cnt" + no) + "/" + getData("max" + no));
	ApplicationMain.main.getQuestTable().update();
}