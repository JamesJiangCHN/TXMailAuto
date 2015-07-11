
function wait() {
	console.log('wait...');
	//setTimeout('wait()', 1000);
}

function show(curr, sum) {
	$("#autoNum").text("进度 " + curr + "/" + sum);
}
function auto() {
	var i;
	var j;
	var doc;
	var name;
	var id;
	var len = 0;
	var sid;
	var listname = new Array();
	var tmpname;
	var listid = new Array();
	var tmpid;
	var startTime;
	var changeNum = 0;
	var sumNum = 0;
	var run = 0;
	var comm = 0;
	if (document.all) { //IE
		doc = document.frames["mainFrame"].document;
	} else { //Firefox or Chrome
		doc = document.getElementById("mainFrame");
	}

	len = 0;
	list = $('#mainFrame').contents().find("tr");
	if (list == null || list.length <= 0) {
		alert("未获取到原始数据！");
		return
	} else {
		$('#mainFrame').contents().find("tr[id^='folder_']").each(function () {
			//name = parseInt($(this).find("a").first().text().split(".")[1])
			name = $(this).find("a").first().text().split(".")[1];
			id = parseInt($(this).attr("id").split("_")[1]);
			listname[len] = name;
			listid[len] = id;
			len++;
		});
	}
	if (len < 1) {
		alert("未获取到原始数据！")
		return
	}
	//计算需要次数
	for (j = 0; j < len - 1; j++) {
		for (i = 0; i < len - 1 - j; i++) {
			if (listname[i] < listname[i + 1]) {
				tmpname = listname[i];
				listname[i] = listname[i + 1];
				listname[i + 1] = tmpname;

				tmpid = listid[i];
				listid[i] = listid[i + 1];
				listid[i + 1] = tmpid;
				changeNum++;
			}
		}
	}
	if (changeNum == 0) {
		alert("你的文件夹很整齐，不用排序。");
		return;

	}
	alert(listname[0] + "~" + listname[len - 1] + ",共需要" + changeNum + "次，开始排序?");
	sumNum = changeNum;
	$("#autoNum").text("进度 0/" + sumNum);
	//重新获取数据
	len = 0;
	changeNum = 0;
	$('#mainFrame').contents().find("tr[id^='folder_']").each(function () {
		//name = parseInt($(this).find("a").first().text().split(".")[1])
		name = $(this).find("a").first().text().split(".")[1];
		id = parseInt($(this).attr("id").split("_")[1]);
		listname[len] = name;
		listid[len] = id;
		len++;
	});
	//获取sid
	sid = $("input[name='sid']").val();
	for (j = 0; j < len - 1; j++) {
		for (i = 0; i < len - 1 - j; ) {
			while (run) {
				if (new Date().getTime() - startTime > 10000) {
					i = 0;
					break;
				}
				wait();
			}
			if (listname[i] < listname[i + 1]) {

				//$.delay(200);
				run = 1;
				comm = 1;
				changeNum++;
				startTime = new Date().getTime();

				$.ajax({
					type : "post",
					url : "http://exmail.qq.com/cgi-bin/foldermgr?sid=" + sid,
					data : {
						sid : sid,
						fun : "updateindex",
						//p:,
						folder1 : listid[i],
						folder2 : listid[i + 1],
						act : "up",
						//tagid:,
						//tagid1:,
						//tagid2:,
						//name:,
						//tagname:
					},
					async : false,
					success : function (data) {
						tmpname = listname[i];
						listname[i] = listname[i + 1];
						listname[i + 1] = tmpname;

						tmpid = listid[i];
						listid[i] = listid[i + 1];
						listid[i + 1] = tmpid;
						console.log(changeNum +":"+listid[i] + "," + listname[i] + "~" + listid[i + 1] + ":" + listname[i + 1]);
						show(changeNum, sumNum);
						run = 0;
					}
				});

				/*
				$.post("http://exmail.qq.com/cgi-bin/foldermgr?sid=BZqKk2l6yQie9UYT,7", {
				sid:"BZqKk2l6yQie9UYT,7",
				fun:"updateindex",
				//p:,
				folder1:listid[i],
				folder2:listid[i+1],
				act:"up",
				//tagid:,
				//tagid1:,
				//tagid2:,
				//name:,
				//tagname:
				},
				function(data){
				run = 0;
				//alert("Data Loaded: " + data);
				});
				 */

			}
			if (comm) {
				show(changeNum, sumNum);
				//ShowSuccessMessage(changeNum, 200);
				//$('#autoNum').text(changeNum).delay(1000)
				//alert(changeNum)
				while (1) {
					if (new Date().getTime() - startTime > 500) {

						i++;
						break;
					}
				}

			} else {
				i++;
			}
			comm = 0;

		}
	}
	alert("完成，共进行了" + changeNum + "次排序。")
}

$(function () {
	$("#imePanel").after('<div id="tip_message">...</div><span id="autoNum">未开始	</span> <span class="addrtitle"> | </span> \
								<input id="autobtn" type="button" value="排序" onclick="autodir()" > <span class="addrtitle"> | </span> ');
	var list = null;
	//提示成功信息
	ShowSuccessMessage = function (message, life) {
		var time = 200;
		if (!life) {
			time = life;
		}

		if ($("#tip_message").text().length > 0) {
			var msg = "<span>" + message + "</span>";
			$("#tip_message").empty().append(msg);
		} else {
			var msg = "<div id='tip_message'><span>" + message + "</span></div>";
			$("body").append(msg);
		}

		$("#tip_message").fadeIn(time);

		setTimeout($("#tip_message").fadeOut(time), time);

	};

	//提示错误信息
	ShowErrorMessage = function (message, life) {
		ShowSuccessMessage(message, life);
		$("#tip_message span").addClass("error");
	};

	$('#mainFrame').load(function () {
		list = $('#mainFrame').contents().find("tr");
	});

	$("#autobtn").click(function () {
		auto();
		//alert("排序完成!");
	});
});
