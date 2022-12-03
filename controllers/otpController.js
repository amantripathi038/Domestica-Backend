const unirest = require("unirest");

exports.sendOTP = async function(message, number) {

    var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

    req.headers({
        "authorization": "bXeO4l0hBJpm7VNiFTLyxrCcsn6gqQ9tjUfDdR3E5KYuPZMHAaVugCO6KdBheP7lZNx9ncXQIyFTUjpS"
    });

    req.form({
        "variables_values": message,
        "route": "otp",
        "numbers": number,
    });

    req.end(function (res) {
        console.log(res)
        if (res.error) throw new Error(res.error);

        console.log(res.body);
    });

}