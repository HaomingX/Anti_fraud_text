
$(function () {
    // body...
    $("#i_aha").click(function () {  
        event.preventDefault();
        message = $("#i_test").val();
        model = $("#selectmodel").val();
        console.log(model);
        var flag = false;
        var html = '<div style="display: flex; margin: 0; padding: 0;">';                            
        $.ajax({
            url: "/predict",
            type: "POST",
            data: { "message": message, "model": model },
            dataType: "json",
            success: function (data) {
                // alert(data.name + ":" + data.age);
                if (model == 'TextCNN' || model == 'FastText' || model == 'TextRNN' || model == 'bert' || model == 'ERNIE' || model == 'BERT_Att' || model == 'BERT_LSTM' || model == 'Ensemble') {
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
                    $("#result").html(dic[data.prediction]);
                    $('#resulttitle').html("" + model + "识别结果");
                    flag = true;
                    $(".wrapper").css("display", "flex");
                    if(data.prediction == 0)
                    {
                        html +='<div class="content" style="flex: 5; padding: 0px; margin-right: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">冒充客服类诈骗</h2>';
                        html +=' <h3 style="font-size: 18px; margin-left: 0; margin-bottom: 10px;text-align: left; font-weight: bold;">诈骗分析</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;" >冒充客服的诈骗策略屡见不鲜，通常涉及伪装成熟悉的品牌或服务平台，目的是获取用户的个人敏感信息。这类诈骗往往以虚构的紧急问题为借口，制造紧迫感。</p>';
                        html +='<h3 style="font-size: 18px; margin-left: 0; margin-top: 20px;text-align: left; font-weight: bold;">反诈警醒</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;">对于未经证实的客服请求要保持警惕，避免在不安全的环境下透露个人信息。确保通过官方验证渠道进行联系，防范隐私泄露风险。</p>';
                        html +='</div>';
                        html +='<div class="image" style="flex: 5; padding: 0px; margin-left: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">冒充客服类关键词</h2>';
                        html += '<img class="img-fluid" src="static/assets/images/demo/冒充客服类_wordcloud.png" alt="screenshot" />';
                        html += ' </div>';
                       
                        
                    }
                    else if(data.prediction == 1)
                    {
                        html +='<div class="content" style="flex: 5; padding: 0px; margin-right: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">贷款、代办信用卡类诈骗</h2>';
                        html +=' <h3 style="font-size: 18px; margin-left: 0; margin-bottom: 10px;text-align: left; font-weight: bold;">诈骗分析</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;" >贷款和代办信用卡的诈骗常伴随虚构的低息和快速审批承诺，以吸引受害者陷入金融陷阱。诈骗者可能使用高压销售手段，对费用和条款故意含糊其辞。</p>';
                        html +='<h3 style="font-size: 18px; margin-left: 0; margin-top: 20px;text-align: left; font-weight: bold;">反诈警醒</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;">在涉及金融交易前，详细审查合同，避免轻信夸大的承诺。选择信誉良好的金融机构，咨询专业建议，提高对金融风险的警觉性。</p>';
                        html +='</div>';
                        html +='<div class="image" style="flex: 5; padding: 0px; margin-left: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">贷款、代办信用卡类关键词</h2>';
                        html += '<img class="img-fluid" src="static/assets/images/demo/贷款、代办信用卡类_wordcloud.png" alt="screenshot" />';
                        html += ' </div>';                      
                    }
                    else if(data.prediction == 2)
                    {
                        html +='<div class="content" style="flex: 5; padding: 0px; margin-right: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">虚假网络投资理财类诈骗</h2>';
                        html +=' <h3 style="font-size: 18px; margin-left: 0; margin-bottom: 10px;text-align: left; font-weight: bold;">诈骗分析</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;" >虚假投资理财诈骗以高回报为噱头，常涉及对投资者的心理欺骗。通过虚构的投资项目和虚伪的盈利表现，诱导受害者投入大量资金。</p>';
                        html +='<h3 style="font-size: 18px; margin-left: 0; margin-top: 20px;text-align: left; font-weight: bold;">反诈警醒</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;">在投资前仔细调查，不轻信高回报的保证。选择受监管的投资平台，理性对待投资风险，防范财务损失。</p>';
                        html +='</div>';
                        html +='<div class="image" style="flex: 5; padding: 0px; margin-left: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">虚假网络投资理财类关键词</h2>';
                        html += '<img class="img-fluid" src="static/assets/images/demo/虚假网络投资理财类_wordcloud.png" alt="screenshot" />';
                        html += ' </div>';
                        
                    }
                    else if(data.prediction == 3)
                    {
                        html +='<div class="content" style="flex: 5; padding: 0px; margin-right: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">冒充领导、熟人类诈骗</h2>';
                        html +=' <h3 style="font-size: 18px; margin-left: 0; margin-bottom: 10px;text-align: left; font-weight: bold;">诈骗分析</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;" > 冒充领导或熟人的诈骗往往利用社交网络和通讯工具，以熟悉的身份迫使受害者付款。诈骗者可能通过网络收集个人信息，制造真实性。</p>';
                        html +='<h3 style="font-size: 18px; margin-left: 0; margin-top: 20px;text-align: left; font-weight: bold;">反诈警醒</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;">在资金交易前核实身份，通过其他途径确认真伪。不轻信突发的资金请求，确保使用安全的通讯渠道与熟人交流。</p>';
                        html +='</div>';
                        html +='<div class="image" style="flex: 5; padding: 0px; margin-left: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">冒充领导、熟人类关键词</h2>';
                        html += '<img class="img-fluid" src="static/assets/images/demo/冒充领导、熟人类_wordcloud.png" alt="screenshot" />';
                        html += ' </div>';
                        
                    }
                    else if(data.prediction == 4)
                    {
                        html +='<div class="content" style="flex: 5; padding: 0px; margin-right: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">冒充公检法及政府机关类诈骗</h2>';
                        html +=' <h3 style="font-size: 18px; margin-left: 0; margin-bottom: 10px;text-align: left; font-weight: bold;">诈骗分析</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;" >冒充官方机关的诈骗多采用恐吓和威胁手段，试图让受害者支付款项。诈骗者可能伪造文件和信息，制造紧急性和真实感。</p>';
                        html +='<h3 style="font-size: 18px; margin-left: 0; margin-top: 20px;text-align: left; font-weight: bold;">反诈警醒</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;">公检法机关办案会当面向涉案人出示证件或相关法律文书，不会通过QQ、电话、传真等形式办案，更不会在电话中通报当事人涉案的罪名。公安机关不存在所谓的安全账户或核查账户，更不会让公民提现转账汇款。</p>';
                        html +='</div>';
                        html +='<div class="image" style="flex: 5; padding: 0px; margin-left: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">冒充公检法及政府机关类关键词</h2>';
                        html += '<img class="img-fluid" src="static/assets/images/demo/冒充公检法及政府机关类_wordcloud.png" alt="screenshot" />';
                        html += ' </div>';
                        
                    }
                    else if(data.prediction == 5)
                    {
                        html +='<div class="content" style="flex: 5; padding: 0px; margin-right: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">刷单返利类诈骗</h2>';
                        html +=' <h3 style="font-size: 18px; margin-left: 0; margin-bottom: 10px;text-align: left; font-weight: bold;">诈骗分析</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;" >网络刷单返利类诈骗已逐步演化成变种最多、变化最快的一种主要诈骗类型，成为其他违法犯罪的主要引流方式。受骗人群多为在校学生、低收入群体及无业人员。</p>';
                        html +='<h3 style="font-size: 18px; margin-left: 0; margin-top: 20px;text-align: left; font-weight: bold;">反诈警醒</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;">“刷单、 刷信誉” 本身就是违法行为， 并非正当兼职。切莫陷入“低投入、高回报”的陷阱。若遇到无法分辨真伪时，可以拨打96110防骗咨询热线咨询或求助。</p>';
                        html +='</div>';
                        html +='<div class="image" style="flex: 5; padding: 0px; margin-left: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">刷单返利类关键词</h2>';
                        html += '<img class="img-fluid" src="static/assets/images/demo/刷单返利类_wordcloud.png" alt="screenshot" />';
                        html += ' </div>';
                       
                    }   
                    else if(data.prediction == 6)
                    {
                        html +='<div class="content" style="flex: 5; padding: 0px; margin-right: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">虚假购物服务类诈骗</h2>';
                        html +=' <h3 style="font-size: 18px; margin-left: 0; margin-bottom: 10px;text-align: left; font-weight: bold;">诈骗分析</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;" >诈骗分子在微信群、朋友圈、网购平台或其他网站发布“低价打折”“海外代购”“0元购物”等广告，或提供“论文代写”“私家侦探”“跟踪定位”等特殊服务的广告，以吸引受害人关注。 </p>';
                        html +='<h3 style="font-size: 18px; margin-left: 0; margin-top: 20px;text-align: left; font-weight: bold;">反诈警醒</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;">要选择正规的购物、 服务平台， 对异常低价的商品提高警惕。通过网购平台尤其是二手交易平台购买商品时，严格遵守平台交易流程，不脱离平台私下交易，切记不要将钱款直接转给对方。</p>';
                        html +='</div>';
                        html +='<div class="image" style="flex: 5; padding: 0px; margin-left: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">虚假购物服务类关键词</h2>';
                        html += '<img class="img-fluid" src="static/assets/images/demo/虚假购物服务类_wordcloud.png" alt="screenshot" />';
                        html += ' </div>';
                    }
                    else if(data.prediction == 7)
                    {
                        html +='<div class="content" style="flex: 5; padding: 0px; margin-right: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">网络婚恋、交友类诈骗</h2>';
                        html +=' <h3 style="font-size: 18px; margin-left: 0; margin-bottom: 10px;text-align: left; font-weight: bold;">诈骗分析</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;" >网络婚恋和交友诈骗通过虚构的身份制造感情纠葛，以达到金钱目的。诈骗者可能编造戏剧性的故事，引导受害者产生同情。</p>';
                        html +='<h3 style="font-size: 18px; margin-left: 0; margin-top: 20px;text-align: left; font-weight: bold;">反诈警醒</h3>';
                        html +=' <p style="font-size: 16px; text-align: left;">网络交友时擦亮眼睛，如果遇到了特别殷勤主动的陌生人，在短时间内就着急确定恋爱关系时，需提高警惕。不要轻易被对方的照片和声音所迷惑，有可能都是假的。在聊天中凡是涉及充值、转账、扫码支付等，都需要谨慎操作。</p>';
                        html +='</div>';
                        html +='<div class="image" style="flex: 5; padding: 0px; margin-left: 10px;">';
                        html +='<h2 style="font-size: 28px; font-weight: bold;">网络婚恋、交友类关键词</h2>';
                        html += '<img class="img-fluid" src="static/assets/images/demo/网络婚恋、交友类（非虚假网络投资理财类）_wordcloud.png" alt="screenshot" />';
                        html += ' </div>';
                       
                    }
                    if(model == 'TextCNN')
                    {
                        html +='<div class="image" style="flex: 1; padding: 0px; margin-left: 10px;;">';
                        html += '   <h2 style="font-size: 28px; font-weight: bold;">模型准确率</h3>';
                        html += '<div class="gauge-container" style="flex: 1; padding: 0px;">';
                        html += '<div class="gauge-container">'
                        html += '   <canvas id="gauge" width="310" height="310"></canvas>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        $("#addimg").html(html);
                        renderNewElement(model);
                    }
                    if(model == 'FastText')
                    {
                        html +='<div class="image" style="flex: 1; padding: 0px; margin-left: 10px;;">';
                        html += '   <h2 style="font-size: 28px; font-weight: bold;">模型准确率</h3>';
                        html += '<div class="gauge-container" style="flex: 1; padding: 0px;">';
                        html += '<div class="gauge-container">'
                        html += '   <canvas id="gauge1" width="310" height="310"></canvas>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        $("#addimg").html(html);
                        renderNewElement(model);
                    }
                    if(model == 'TextRNN')
                    {
                        html +='<div class="image" style="flex: 1; padding: 0px; margin-left: 10px;;">';
                        html += '   <h2 style="font-size: 28px; font-weight: bold;">模型准确率</h3>';
                        html += '<div class="gauge-container" style="flex: 1; padding: 0px;">';
                        html += '<div class="gauge-container">'
                        html += '   <canvas id="gauge3" width="310" height="310"></canvas>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        $("#addimg").html(html);
                        renderNewElement(model);
                    }
                    if(model == 'Bert')
                    {
                        html +='<div class="image" style="flex: 1; padding: 0px; margin-left: 10px;;">';
                        html += '   <h2 style="font-size: 28px; font-weight: bold;">模型准确率</h3>';
                        html += '<div class="gauge-container" style="flex: 1; padding: 0px;">';
                        html += '<div class="gauge-container">'
                        html += '   <canvas id="gauge4" width="310" height="310"></canvas>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        $("#addimg").html(html);
                        renderNewElement(model);
                    }
                    if(model == 'ERNIE')
                    {
                        html +='<div class="image" style="flex: 1; padding: 0px; margin-left: 10px;;">';
                        html += '   <h2 style="font-size: 28px; font-weight: bold;">模型准确率</h3>';
                        html += '<div class="gauge-container" style="flex: 1; padding: 0px;">';
                        html += '<div class="gauge-container">'
                        html += '   <canvas id="gauge5" width="310" height="310"></canvas>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        $("#addimg").html(html);
                        renderNewElement(model);
                    }
                    if(model == 'Ensemble')
                    {
                        html +='<div class="image" style="flex: 1; padding: 0px; margin-left: 10px;;">';
                        html += '   <h2 style="font-size: 28px; font-weight: bold;">模型准确率</h3>';
                        html += '<div class="gauge-container"  padding: 0px;">';
                        html += '   <canvas id="gauge6" width="310" height="310"></canvas>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        $("#addimg").html(html);
                        renderNewElement(model);
                    }
                } else if (model == 'ChatGPT') {
                    $("#result").html(data.result);
                    $('#resulttitle').html("ChatGPT识别结果");
                    // $('#timetitle').html("");
                    // $("#time").html("");
                    flag = true;
                    console.log(data)
                } else if ( model == 'GPT_FT') {
                    $("#result").html(data.result);
                    $('#resulttitle').html("GPT_FT识别结果");
                    // $('#timetitle').html("");
                    // $("#time").html("");
                    flag = true;
                    console.log(data)
                }
            },
        })

});
    }
)
var script = document.createElement('script');
script.src = 'static/assets/js/panel1.js?version=1.0.7';
document.head.appendChild(script);

function renderNewElement(model){
        if(model == 'FastText'){
            console.log('panel.js loaded');
        var my_canvas_obj1 = document.getElementById("gauge1");
        console.log(my_canvas_obj1);
        var gauge1 = new Gauge({
            "tick_length": 12,
            "large_tick_length": 22,
            "tick_thickness": 1,
            "tick_group_length": 9,
            "ticks_groups_begin": 0,
            "total_degrees": 250,
            "total_tick": 101,
            "tick_color": "#666",
            "num_font_size": 18,
            "percent": 0,
            "center_font_size": 45,
            on_color_gradient: [
              { color: "#9ED110", percent: 0 },
              { color: "#50B517", percent: 10 },
              { color: "#8adec2", percent: 20 },
              { color: "#08d9fb", percent: 40 },
              { color: "#883efd", percent: 50 },
              { color: "#FF5800", percent: 60 },
              { color: "#FF8100", percent: 70 },
              { color: "#FEAC00", percent: 80 },
              { color: "#FFCC00", percent: 90 },
              { color: "#ff0000", percent: 100 }
            ],
            animation_duration: 2000,
            tick_on_color: '#f1594e',
            cur_score_circle_color: '#ff5e52',
            center_font_color: '#a0a0a0',
            center_text_unit: '%',
            "canvas": my_canvas_obj1
        })
        console.log('panel.js loaded');
        gauge1.render()
        setTimeout(function () {
            gauge1.updatePercent(89.71)   //默认设置多少百分比
        }, 3000)
        console.log('panel.js loaded');
    }
       
        
    if(model=='TextCNN'){   
        var my_canvas_obj2 = document.getElementById("gauge");
        var gauge2 = new Gauge({
            "tick_length": 12,
            "large_tick_length": 22,
            "tick_thickness": 1,
            "tick_group_length": 9,
            "ticks_groups_begin": 0,
            "total_degrees": 250,
            "total_tick": 101,
            "tick_color": "#666",
            "num_font_size": 18,
            "percent": 0,
            "center_font_size": 45,
            on_color_gradient: [
                { color: "#9ED110", percent: 0 },
                { color: "#50B517", percent: 10 },
                { color: "#8adec2", percent: 20 },
                { color: "#08d9fb", percent: 40 },
                { color: "#883efd", percent: 50 },
                { color: "#FF5800", percent: 60 },
                { color: "#FF8100", percent: 70 },
                { color: "#FEAC00", percent: 80 },
                { color: "#FFCC00", percent: 90 },
                { color: "#ff0000", percent: 100 }
              ],
              animation_duration: 2000,
              tick_on_color: '#f1594e',
              cur_score_circle_color: '#ff5e52',
              center_font_color: '#a0a0a0',
              center_text_unit: '%',
            "canvas": my_canvas_obj2
        })
        gauge2.render()
        setTimeout(function () {
            gauge2.updatePercent(90.66)    //默认设置多少百分比
        }, 1000);
    } 
    if(model=='TextRNN'){   
        var my_canvas_obj3 = document.getElementById("gauge3");
        var gauge3 = new Gauge({
            "tick_length": 12,
            "large_tick_length": 22,
            "tick_thickness": 1,
            "tick_group_length": 9,
            "ticks_groups_begin": 0,
            "total_degrees": 250,
            "total_tick": 101,
            "tick_color": "#666",
            "num_font_size": 18,
            "percent": 0,
            "center_font_size": 45,
            on_color_gradient: [
              { color: "#9ED110", percent: 0 },
              { color: "#50B517", percent: 10 },
              { color: "#8adec2", percent: 20 },
              { color: "#08d9fb", percent: 40 },
              { color: "#883efd", percent: 50 },
              { color: "#FF5800", percent: 60 },
              { color: "#FF8100", percent: 70 },
              { color: "#FEAC00", percent: 80 },
              { color: "#FFCC00", percent: 90 },
              { color: "#ff0000", percent: 100 }
            ],
            animation_duration: 2000,
            tick_on_color: '#f1594e',
            cur_score_circle_color: '#ff5e52',
            center_font_color: '#a0a0a0',
            center_text_unit: '%',
            "canvas": my_canvas_obj3
        })
        
        gauge3.render()
        setTimeout(function () {
            gauge3.updatePercent(89.5)   //默认设置多少百分比
        }, 3000)
    } 
    if(model =='Bert')
    {   
        var my_canvas_obj4 = document.getElementById("gauge4");
        var gauge4 = new Gauge({
            "tick_length": 12,
            "large_tick_length": 22,
            "tick_thickness": 1,
            "tick_group_length": 9,
            "ticks_groups_begin": 0,
            "total_degrees": 250,
            "total_tick": 101,
            "tick_color": "#666",
            "num_font_size": 18,
            "percent": 0,
            "center_font_size": 45,
            on_color_gradient: [
              { color: "#9ED110", percent: 0 },
              { color: "#50B517", percent: 10 },
              { color: "#8adec2", percent: 20 },
              { color: "#08d9fb", percent: 40 },
              { color: "#883efd", percent: 50 },
              { color: "#FF5800", percent: 60 },
              { color: "#FF8100", percent: 70 },
              { color: "#FEAC00", percent: 80 },
              { color: "#FFCC00", percent: 90 },
              { color: "#ff0000", percent: 100 }
            ],
            animation_duration: 2000,
            tick_on_color: '#f1594e',
            cur_score_circle_color: '#ff5e52',
            center_font_color: '#a0a0a0',
            center_text_unit: '%',
            "canvas": my_canvas_obj4
        })
        
        gauge4.render()
        setTimeout(function () {
            gauge4.updatePercent(89.72)   //默认设置多少百分比
        }, 3000)
    } 
    if(model=='ERNIE'){    
        var my_canvas_obj5 = document.getElementById("gauge5");
        var gauge5 = new Gauge({
            "tick_length": 12,
            "large_tick_length": 22,
            "tick_thickness": 1,
            "tick_group_length": 9,
            "ticks_groups_begin": 0,
            "total_degrees": 250,
            "total_tick": 101,
            "tick_color": "#666",
            "num_font_size": 18,
            "percent": 0,
            "center_font_size": 45,
            on_color_gradient: [
              { color: "#9ED110", percent: 0 },
              { color: "#50B517", percent: 10 },
              { color: "#8adec2", percent: 20 },
              { color: "#08d9fb", percent: 40 },
              { color: "#883efd", percent: 50 },
              { color: "#FF5800", percent: 60 },
              { color: "#FF8100", percent: 70 },
              { color: "#FEAC00", percent: 80 },
              { color: "#FFCC00", percent: 90 },
              { color: "#ff0000", percent: 100 }
            ],
            animation_duration: 2000,
            tick_on_color: '#f1594e',
            cur_score_circle_color: '#ff5e52',
            center_font_color: '#a0a0a0',
            center_text_unit: '%',
            "canvas": my_canvas_obj5
        })
        
        gauge5.render()
        setTimeout(function () {
            gauge5.updatePercent(90.93)   //默认设置多少百分比
        }, 3000)}
        if(model=='Ensemble'){    
            var my_canvas_obj6 = document.getElementById("gauge6");
            var gauge6 = new Gauge({
                "tick_length": 12,
                "large_tick_length": 22,
                "tick_thickness": 1,
                "tick_group_length": 9,
                "ticks_groups_begin": 0,
                "total_degrees": 250,
                "total_tick": 101,
                "tick_color": "#666",
                "num_font_size": 18,
                "percent": 0,
                "center_font_size": 45,
                on_color_gradient: [
                  { color: "#9ED110", percent: 0 },
                  { color: "#50B517", percent: 10 },
                  { color: "#8adec2", percent: 20 },
                  { color: "#08d9fb", percent: 40 },
                  { color: "#883efd", percent: 50 },
                  { color: "#FF5800", percent: 60 },
                  { color: "#FF8100", percent: 70 },
                  { color: "#FEAC00", percent: 80 },
                  { color: "#FFCC00", percent: 90 },
                  { color: "#ff0000", percent: 100 }
                ],
                animation_duration: 2000,
                tick_on_color: '#f1594e',
                cur_score_circle_color: '#ff5e52',
                center_font_color: '#a0a0a0',
                center_text_unit: '%',
                "canvas": my_canvas_obj6
            })
            
            gauge6.render()
            setTimeout(function () {
                gauge6.updatePercent(92)   //默认设置多少百分比
            }, 3000)}
    };

