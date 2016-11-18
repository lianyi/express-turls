var express = require('express'),
    router = express.Router(),
    validUrl = require('valid-url'),
    urlSchema = require('../model/schema');

/* GET URL */
router.get('/*?', function (req, res, next) {
    var inputUrl = req.params[0];
    // Validate the URL
    if (inputUrl && validUrl.isUri(inputUrl)) {
        // Lookup the URL in mongodb database
        urlSchema.findOne({url: inputUrl}, function (err, doc) {
            if (!err && doc) {
                // if the URL exists!
                handleOutput(res, inputUrl, doc.id);
            } else {
                // If it's not found, make a new one
                urlSchema.create({url: inputUrl}, function (err, myDoc) {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    return handleOutput(res, inputUrl, myDoc.id);
                });
            }
        });
    } else {
        res.status(400).json({
            error: "URL Invalid"
        });
    }

});
/**
 * handleOutput in json format
 * @param response
 * @param url
 * @param id
 */
function handleOutput(response, url, id) {
    response.status(201).json({
        "original_url": url,
        "short_url": "https://turls.herokuapp.com/" + id
    });
}
module.exports = router;
