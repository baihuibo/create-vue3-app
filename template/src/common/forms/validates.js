const validates = {
    // 必填校验
    required(value, required) {
        if (required && isEmpty(value)) {
            return '请填写此项'
        }
    },

    // 最大长度校验
    maxLength(value, max) {
        max = parseInt(max);
        if (value && max && String(value).length > max) {
            return `输入内容不能超过${max}个字符。`;
        }
    },
    // 最小长度校验
    minLength(value, minlength) {
        minlength = parseInt(minlength);
        if (value && minlength > -1 && String(value).length < minlength) {
            return `输入内容不能小于${minlength}个字符。`;
        }
    },
    min(value, min) {
        min = parseFloat(min);
        if (isNumber(+value) && !isNaN(min) && value < min) {
            return `输入内容不能小于${min}。`;
        }
    },
    max(value, max) {
        max = parseFloat(max);
        if (isNumber(+value) && !isNaN(max) && value > max) {
            return `输入内容不能大于${max}。`;
        }
    }
};

function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

function isEmpty(value) {
    if (value == null || value === '' || value !== value || (Array.isArray(value) && !value.length)) {
        return true;
    }
}

export default validates;
