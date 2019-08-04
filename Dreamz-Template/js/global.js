Vue.filter('formatDate', function (value) {
    if (!value)
        return '';
    else
        return moment(value).format('YYYY/MM/DD');
});

Vue.filter('formatDateTime', function (value) {
    if (!value)
        return '';
    else
        return moment(value).format('YYYY/MM/DD HH:mm');
});

Vue.filter('PaddingZero', function (value) {
    return value < 10 ? '0' + value : '' + value;
});

Vue.filter('Commas', function (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

Vue.filter('CommasNoZero', function (value) {
    if (value == 0) return '';
    else return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

Vue.filter('Percentage', function (value) {
    if (!value && isNaN(Number(value))) return '';
    else return (value.toString() + '%');
});

Vue.filter('PercentageNoPoint', function (value) {
    if (!value && isNaN(Number(value))) return '';
    else return (value.toString().split('.')[0] + '%');
});

Vue.config.errorHandler = function (err, vm, info) {
    // handle error
    // `info` is a Vue-specific error info, e.g. which lifecycle hook
    // the error was found in. Only available in 2.2.0+
    console.log(err);
};

