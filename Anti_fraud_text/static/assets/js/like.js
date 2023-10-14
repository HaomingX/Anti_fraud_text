// 获取所有radio元素和其对应的label
const radioInputs = document.querySelectorAll('input[type="radio"]');
const labels = document.querySelectorAll('label');
var userInput = document.getElementById('result');
var message = $("#i_test").val();
var resultValue = userInput.textContent;
// 为每个radio元素添加点击事件监听器
radioInputs.forEach((radioInput, index) => {
    radioInput.addEventListener('click', () => {
        // 根据点击的radio元素来获取用户的选择
        const choice = radioInput.id === 'thumbsUp' ? 'yes' : 'no';
        if (choice === 'no') {
             // 用户确认了不喜欢选项，弹出一个输入框供用户输入类别
            modal();
            //console.log(userInput);
            // const userInput = prompt('请输入正确的类别：', '');

        
    }

        // 模拟提交数据，你可以在这里发送数据到后端服务器
        if (choice === 'yes') {
            var result = $("#result").html();
            submitData(choice, result);
        }
        // 更新UI以反映用户选择
            updateUI(index);
    });
});

// 模拟提交数据的函数
function submitData(choice,result) {
    // 在这里可以编写代码来提交数据到后端服务器
    // 例如，使用AJAX发送POST请求
    // 你也可以将此函数替换为实际的数据提交逻辑
   
    prompt = 8;
    var dic = new Array(); //定义一个字典    
        dic[0] = '冒充客服类';
        dic[1] = '贷款、代办信用卡类';
        dic[2] = '虚假网络投资理财类';
        dic[3] = '冒充领导、熟人类';
        dic[4] = '冒充公检法及政府机关类';
        dic[5] = '刷单返利类';
        dic[6] = '虚假购物服务类';
        dic[7] = '网络婚恋、交友类（非虚假网络投资理财类）';
        dic[8] = '其他类型';
    if(result == "冒充客服类")
        prompt = 0;
    if(result == "贷款、代办信用卡类")
        prompt = 1;
    if(result == "虚假网络投资理财类")
        prompt = 2;
    if(result == "冒充领导、熟人类")
        prompt = 3;
    if(result == "冒充公检法及政府机关类")
        prompt = 4;
    if(result == "刷单返利类")
        prompt = 5;
    if(result == "虚假购物服务类")
        prompt = 6;
    if(result == "网络婚恋、交友类（非虚假网络投资理财类）")
        prompt = 7;
    if(result == "其他类型")
        prompt = 8;
    console.log(model);
    var flag = false;
    $.ajax({
        url: "/like",
        type: "POST",
        data: { "message": message, "result": result ,"prompt":prompt,"like":choice},
        dataType: "json",
    })
    console.log(`提交了选择：${choice}`);
}


// 更新UI的函数
function updateUI(selectedIndex) {
    // 根据用户选择，更新样式以反映用户的选择
    labels.forEach((label, index) => {
        if (index === selectedIndex) {
            label.classList.add('selected');
        } else {
            label.classList.remove('selected');
        }
    });
   
}

function modal() {
    
    // 创建弹窗内容，包含一个下拉菜单供用户选择类别
    var html = '<div class="c-dropdown js-dropdown">';
    html += '<input type="hidden" name="categorySelect" id="categorySelect" class="js-dropdown__input">';
    html += '<span class="c-button c-button--dropdown js-dropdown__current">请选择类别</span>';
    html += '<ul class="c-dropdown__list">';
    html += '<li class="c-dropdown__item" data-dropdown-value="冒充客服类">冒充客服类</li>';
    html += '<li class="c-dropdown__item" data-dropdown-value="贷款、代办信用卡类">贷款、代办信用卡类</li>';
    html += '<li class="c-dropdown__item" data-dropdown-value="虚假网络投资理财类">虚假网络投资理财类</li>';
    html += '<li class="c-dropdown__item" data-dropdown-value="冒充领导、熟人类">冒充领导、熟人类</li>';
    html += '<li class="c-dropdown__item" data-dropdown-value="冒充公检法及政府机关类">冒充公检法及政府机关类</li>';
    html += '<li class="c-dropdown__item" data-dropdown-value="刷单返利类">刷单返利类</li>';
    html += '<li class="c-dropdown__item" data-dropdown-value="虚假购物服务类">虚假购物服务类</li>';
    html += '<li class="c-dropdown__item" data-dropdown-value="网络婚恋、交友类（非虚假网络投资理财类）">网络婚恋、交友类（非虚假网络投资理财类）</li>';
    html += '<li class="c-dropdown__item" data-dropdown-value="其他类型">其他类型</li>';
    // 添加其他类别选项...
    html += '</ul>';
    html += '</div>';
    $.confirm({
        title: '请选择类别',
        content: html,
        confirmText: '确定',
        cancelText: '取消'
    }, function () {
        // 获取用户选择的类别
        var selectedCategory = $('#categorySelect').val();

        // 检查用户是否选择了类别
        if (!selectedCategory) {
            $.toast('请选择一个类别');
            return false;
        }  
        userInput = selectedCategory;
        console.log(userInput);
        if (userInput !== null) {
            // 用户输入了类别，将其写入数据库
            const choice = 'no'; // 不喜欢选项
            submitData(choice, userInput);
            console.log(userInput);
            // 更新UI以反映用户选择（如果需要的话）
            // updateUI(index);
        } else {
            // 用户取消了输入或未输入有效的类别
            $.toast('请输入有效的类别!');
        }
        $.toast('感谢您的反馈!');

    });
}
;(function ($) {
	'use strict';
	var css = document.createElement("link");
	var js = document.scripts;
	var path = css/alert.css;
	css.setAttribute("rel","stylesheet");
	css.setAttribute("type","text/css");
	css.setAttribute("href",path);
	// document.head.appendChild(css);
	jQuery.extend({
		open: function(type, option) {
			var content = option?option:'', title = '', confirmText = '确定',cancelText = '取消';
            

			if (typeof(option) == 'object') {
				title = option.title? option.title: title;
				content = option.content? option.content: content;
				confirmText = option.confirmText? option.confirmText: confirmText;
				cancelText = option.cancelText? option.cancelText: cancelText;
			}
			var html = "";
			html += '<div class="dialog-modal-mask" id="dialog-mask-'+type+'"></div>';
			html += '<div class="dialog-modal dialog-modal-'+type+'" id="dialog-'+type+'">';
			switch (type) {
				case 'alert':
					html += '<div class="dialog-modal-title">'+title+'</div>';
					html += '<div class="dialog-modal-text">'+content+'</div>';
					html += '<div class="dialog-modal-btn">';
					html += '<button type="button">'+confirmText+'</button>';
					break;
				case 'confirm':
					html += '<div class="dialog-modal-title">'+title+'</div>';
					html += '<div class="dialog-modal-text">'+content+'</div>';
					html += '<div class="dialog-modal-btn">';
					html += '<button type="button class="cancel">'+cancelText+'</button>';
					html += '<button type="button" class="confirm">'+confirmText+'</button>';
					break;
				case 'toast':
					html += '<div class="dialog-modal-text">'+content+'</div>';
					break;
				case 'loading':
					html += '<div class="dialog-modal-load"><span></span><span></span><span></span></div>';
					html += '<div class="dialog-modal-text">'+content+'</div>';
					break;
			}
			$("body").addClass('overflow').append(html);
			 window.addEventListener("mousewheel", this.forbidScroll);
			 window.addEventListener("touchmove", this.forbidScroll,{passive:false});
			var obj = $("#dialog-"+type);
			$("#dialog-mask-"+type).fadeIn(300);
			obj.addClass("dialog-ani-open");
			var screenHeight = window.screen.height;
			var innerHeight = window.innerHeight;
			var height = obj.height();
			obj.css("margin-top", "-" + Math.ceil((screenHeight-innerHeight+height)/2) + 'px');
			obj.show();
		},
		alert: function(option, callback) {
			this.open('alert', option);
			let that = this;
			$('.dialog-modal-btn button').click(function(){
				that.close("alert");
				if(typeof(callback) != 'undefined') {
					callback();
				}
			})
		},
		confirm: function(option, confirm, cancel) {
			this.open('confirm', option);
			let that = this;
			$('.dialog-modal-btn button').click(function(){
				that.close("confirm");
				if($(this).attr('class') === 'confirm') {
					if(typeof(confirm) != 'undefined') confirm();
				} else {
					if(typeof(cancel) != 'undefined') cancel();
				}
			})
		},
        // toast: function(option, callback) {
        //     // 创建 Toast 的 HTML 结构
        //     var toastContainer = document.createElement('div');
        //     toastContainer.className = 'toast-container'; // 自定义样式类名
        
        //     var toastElement = document.createElement('div');
        //     toastElement.className = 'custom-toast';
        //     toastElement.innerHTML = option.message;
        
        //     // 将 Toast 添加到容器
        //     toastContainer.appendChild(toastElement);
        
        //     // 将容器添加到页面
        //     document.body.appendChild(toastContainer);
        
        //     // 设置独立的样式，避免全局影响
        //     toastContainer.style.height = 'auto';
        //     toastContainer.style.backgroundColor = '#333'; // 示例颜色
        
        //     // 设置定时器，一定时间后移除 Toast 及其容器
        //     var time = option.time ? option.time : 1500;
        //     setTimeout(() => {
        //         // 移除 Toast 及其容器
        //         document.body.removeChild(toastContainer);
        
        //         if (typeof(callback) != 'undefined') {
        //             callback();
        //         }
        //     }, time);
        // },
		toast: function(option, callback) {
			this.open('toast', option);
			var time = option.time? option.time: 1500;
			setTimeout(()=>{
				this.close('toast');
				if(typeof(callback) != 'undefined') {
					callback();
				}
			},time)
		},
		loading: function(option) {
			this.open('loading', option);
		},
		hideLoading: function(callback) {
			this.close("loading");
			if(typeof(callback) != 'undefined') {
				callback();
			}
		},
		close: function(type) {
			//window.removeEventListener("mousewheel",this.forbidScroll);
			//window.removeEventListener("touchmove",this.forbidScroll,{passive:false});
			$("body").removeClass('overflow');
			var obj = $("#dialog-" + type);
			$("#dialog-mask-" + type).fadeOut(200);
			obj.addClass("dialog-ani-close");
			setTimeout(() => {
				obj.hide();
				obj.removeClass("dialog-ani-close");
				$("#dialog-mask-" + type).remove();
				obj.remove();
			}, 300)
		},

	})
})(jQuery);