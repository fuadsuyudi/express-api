exports.SuccessResponse = function (data = null, status = true, message = null, code = 200) {
    return { 'status': status, 'code': code, 'message': message, 'data': data };
}

exports.FailResponse = function (message = null, code = 200) {
    return { 'status': false, 'code': code, 'message': message };
}