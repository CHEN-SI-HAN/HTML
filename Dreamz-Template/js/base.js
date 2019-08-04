 new Vue({
    el: '#menuContainer',
    data: {
        menuDatas: [
            {
                idx: 0,
                url: '#',
                text: '關於樂活',
                img: '/Content/img/menu-01.png'
            },
            {
                idx: 1,
                url: '/PowerPlant/Index',
                text: '太陽能電廠',
                img: '/Content/img/menu-02.png'
            },
            {
                idx: 2,
                url: '/UserCenter/UserDashboard',
                text: '樂活市集 會員中心',
                img: '/Content/img/menu-03.png'
            },
            {
                idx: 3,
                url: '/UserCenter/UserTransaction',
                text: '股權交易',
                img: '/Content/img/menu-04.png'
            },
            {
                idx: 4,
                url: '/General/Site',
                text: '設置場地出租',
                img: '/Content/img/menu-05.png'
            },
            {
                idx: 5,
                url: '/General/Device',
                text: '太陽能股權交易',
                img: '/Content/img/menu-06.png'
            }
        ]
    },
    computed: {
    },
    methods: {
    },
    beforeCreate: function () {
    },
    created: function () {
    }
});
var datetimepickerSettings = {
    language: 'zh-TW',
    format: 'yyyy-mm-dd',
    startView: 2,
    minView: 2,
    autoclose: true
};
function InitDate(selector, changeMethod) {
    $(selector).datetimepicker(datetimepickerSettings).off('changeDate').on('changeDate', function (e) {
        $(selector)[0].dispatchEvent(new Event('input'));
        changeMethod();
    });
}
function ChangeMode(selector, type, changeMethod) {
    var dateMode = '';
    $(selector).datetimepicker('remove');
    $(selector).val(null);
    var mode = 2;
    var format = 'yyyy-mm-dd';
    switch (type) {
        case 'day':
            mode = 2;
            format = 'yyyy-mm-dd';
            dateMode = '日';
            break;
        case 'month':
            mode = 3;
            format = 'yyyy-mm';
            dateMode = '月';
            break;
        case 'year':
            mode = 4;
            format = 'yyyy';
            dateMode = '年';
            break;
    }
    SetInputGroupBtnText(selector, dateMode);
    datetimepickerSettings.minView = mode;
    datetimepickerSettings.startView = mode;
    datetimepickerSettings.format = format;
    datetimepickerSettings.startDate = null;
    datetimepickerSettings.endDate = null;
    InitDate(selector, changeMethod);
    return dateMode;
}

function SetInputGroupBtnText(selector, text) {
    $($(selector)[0]).parent().find('.input-group-btn>button[data-toggle="dropdown"]').html(text);
}
Array.prototype.groupBy = function (prop) {
    return this.reduce(function (groups, item) {
        var val = item[prop];
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups;
    }, {});
};

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
};
/*
 * 取的時間字串 
 * @param {Date} dateObj 時間物件
 * @param {String} str 連接字串
 */
function GetDateString(dateObj, str) {
    let joinStr = NotNullOrEmpty(str) ? str : '-';
    let today = NotNullOrEmpty(dateObj) ? dateObj : new Date();
    var todayString = [today.getFullYear(),
    PadLeft(today.getMonth() + 1, 2),
    PadLeft(today.getDate(), 2)
    ].join(joinStr);
    return todayString;
}

/*
 * 填充字串至指定長度 
 * @param {String} str 來源字串
 * @param {Number} len 最大長度
 * @param {String} padChar 填充字元
 */
function PadLeft(str, len, padChar) {
    padChar = NotNullOrEmpty(padChar) ? padChar : '0';
    str = '' + str;
    return str.lenght >= len ? str : new Array(len - str.length + 1).join(padChar) + str;
}
/*
 * 判斷非空值或NULL 
 * @param {any} _value 
 */
function NotNullOrEmpty(_value) {
    return _value != null && _value != '';
}
/*
 * 轉陣列
 * @param {Array} datas 來源資料
 * @param {Array} mappings 對應設定
 * mappings:
 * [
 *  {
 *   key:string,
 *   value:string,
 *   format:string,
 *  },
 *  {
 *   key:string,
 *   value:[string,string],
 *   format:string,
 *  }
 * ]
 */
function ToArray(datas, mappings) {
    var result = [];
    $.each(datas, function (idx, data) {
        var temp = {};
        $.each(mappings, function (i, mapping) {
            var type = mapping.type;
            var _val = null;
            switch (type) {
                case 'datetime':
                    _val = new Date(data[mapping.value]);
                    break;
                case 'number':
                    _val = Number(data[mapping.value]);
                    break;
                case 'string':
                    _val = data[mapping.value] + '';
                    break;
                default:
                    if (mapping.format) {
                        if (typeof mapping.value != 'object')
                            _val = mapping.format.replace(/{}/g, data[mapping.value]);
                        else {
                            var tempValue = mapping.format;
                            $.each(mapping.value, function (idx, thisVal) {
                                var dataVal = data[thisVal];
                                if (typeof data[thisVal] == 'number') {
                                    dataVal = RemoveZeroDecimalPlaces(GetFloat(dataVal, 2));
                                }
                                tempValue = tempValue.replace('{}', dataVal);
                            });
                            _val = tempValue;
                        }
                    } else
                        _val = data[mapping.value];
                    break;
            }
            temp[mapping.key] = _val;
        });
        result.push(temp);
    });
    return result;
}

/*
 * 取得帶小數數值 
 * @param {Number} _originalValue 原始數值
 * @param {Number} decimalPlacesLength 保留小數位長度
 */
function GetFloat(_originalValue, decimalPlacesLength) {
    return Number(_originalValue).toFixed(decimalPlacesLength);
}

/*
 * 移除0的小數位 
 * @param {Number} _originalValue 原始數值
 */
function RemoveZeroDecimalPlaces(_originalValue) {
    var valArray = _originalValue.toString().split('.');
    var newVal = valArray[0];
    if (valArray.length > 1) {
        newVal = newVal + (Number(valArray[1]) == 0 ? '' : '.' + valArray[1]);
    }
    return Number(newVal);
}
function SetCanvasJs(elementId, setting) {
    SetCanvasParentHeight(elementId);
    var chart = new CanvasJS.Chart(elementId, setting);
    chart.render();
    SetChartHeightAndWidth("#" + elementId);
    return chart;
}
function SetChartHeightAndWidth(selector) {
    var obj = $(selector).find(".canvasjs-chart-canvas")[0];
    var cssHeight = $(obj).css("height").replace('px', '');
    var attrHeight = $(obj).attr("height");
    var _height = cssHeight >= attrHeight ? attrHeight : cssHeight;
    $(selector).css("height", _height + 'px');
}
function SetCanvasParentHeight(elementId) {
    var parentElement = $('#' + elementId).closest('.canvasjs');
    if (parentElement && parentElement.hasClass('panel')) {
        var parentHeight = parentElement.height();
        var head = parentElement.find('.panel-heading');
        var headHeight = GetTotalHeight(head);
        var body = parentElement.find('.panel-body');
        var otherHeight = RelpacePX(body.css('padding-top')) + RelpacePX(body.css('padding-bottom'));
        $.each(body.children(':not(.canvasContainer,script)'), function (idx, item) {
            otherHeight = Number(otherHeight) + $(item).height()
                + RelpacePX($(item).css('margin-top'))
                + RelpacePX($(item).css('margin-bottom'));
        });
        var canvasHeight = (parentHeight - headHeight - otherHeight) / $('#' + elementId).parent().find('.canvasContainer').length;
        $('#' + elementId).css('height', Number(canvasHeight) + 'px');
    }
}