const ctx2 = document.getElementById('myChart2');
const labels = ['刷单返利类', '冒充电商物流类', '虚假网络投资理财类', '贷款、代办信用卡类', '其他类型诈骗', '虚假征信类', '冒充公检法及政府机关', '虚假购物、服务类',
    '冒充领导、熟人类', '网络游戏产品虚假交易', '网络婚恋、交友类', '冒充军警购物类诈骗', '网黑案件',];  // 设置 X 轴上对应的标签
const data2 = {
    labels: labels,
    datasets: [{
        label: '大类分布的柱状图',
        data: [34.760, 11.310, 10.430, 9.530, 6.860, 6.490, 6.140, 5.860, 2.840, 2.220, 1.660, 1.090, 0.810,],
        backgroundColor: [      // 设置每个柱形图的背景颜色
            'rgb(0, 102, 255)',
            'rgb(51, 153, 51)',
            'rgb(255, 153, 0)',
            'rgb(255, 102, 0)',
            'rgb(153, 51, 255)',
            'rgb(102, 204, 255)',
            'rgb(255, 51, 153)',
            'rgb(102, 255, 204)',
            'rgb(0, 51, 102)',
            'rgb(255, 153, 102)',
            'rgb(102, 51, 0)',
            'rgb(0, 102, 153)',
            'rgb(204, 102, 255)'
        ],
        borderColor: [     //设置每个柱形图边框线条颜色
            'rgb(0, 102, 255)',
            'rgb(51, 153, 51)',
            'rgb(255, 153, 0)',
            'rgb(255, 102, 0)',
            'rgb(153, 51, 255)',
            'rgb(102, 204, 255)',
            'rgb(255, 51, 153)',
            'rgb(102, 255, 204)',
            'rgb(0, 51, 102)',
            'rgb(255, 153, 102)',
            'rgb(102, 51, 0)',
            'rgb(0, 102, 153)',
            'rgb(204, 102, 255)'
        ],
        borderWidth: 1     // 设置线条宽度
    }]
};
const config2 = {
    type: 'bar', // 设置图表类型
    data: data2,  // 设置数据集
    options: {
        scales: {
            y: {
                beginAtZero: true // 设置 y 轴从 0 开始
            }
        }
    },
};
const myChart2 = new Chart(ctx2, config2);





const ctx = document.getElementById('myChart');
const data = {
labels: [
    '刷单返利类',
    '冒充电商物流类',
    '虚假网络投资理财类',
    '贷款、代办信用卡类',
    '其他类型诈骗',
    '虚假征信类',
    '冒充公检法及政府机关',
    '虚假购物、服务类',
    '冒充领导、熟人类',
    '网络游戏产品虚假交易',
    '网络婚恋、交友类',
    '冒充军警购物类诈骗',
    '网黑案件',
],
datasets: [{
    label: '大类分布扇形图',
    data: [34.760, 11.310, 10.430, 9.530, 6.860, 6.490, 6.140, 5.860, 2.840, 2.220, 1.660, 1.090, 0.810,],
    backgroundColor: [                                                  
        `rgb(0, 102, 255)`,
        `rgb(51, 153, 51)`,
        `rgb(255, 153, 0)`,
        `rgb(255, 102, 0)`,
        `rgb(153, 51, 255)`,
        `rgb(102, 204, 255)`,
        `rgb(255, 51, 153)`,
        `rgb(102, 255, 204)`,
        `rgb(0, 51, 102)`,
        `rgb(255, 153, 102)`,
        `rgb(102, 51, 0)`,
        `rgb(0, 102, 153)`,
        `rgb(204, 102, 255)`,
    ],
    hoverOffset: 4
}]
};
const config = {
type: 'pie',
data: data,
options: {
    responsive: true, // 设置图表为响应式，根据屏幕窗口变化而变化
    maintainAspectRatio: false,// 保持图表原有比例
    plugins: {
        legend: {
                     position: 'bottom',
                }},
    scales: {
    yAxes: [{
        ticks: {
        beginAtZero:true
                }
        }]
    },
    title: {
        display: false,
        text: '大类分布扇形图', // 在这里设置饼图的标题
        font: {
            size: 16,
            weight: 'bold'
        }
    }
}
};
const myChart = new Chart(ctx, config);
const chartTitle = document.getElementById('chartTitle');
chartTitle.innerText = '大类分布扇形图';
