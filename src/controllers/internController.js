const InternModel = require('../models/internModel')
const CollegeModel = require('../models/collegeModel')

const isValid = function (value, type) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value != type) return false
    return true;
}
    const isValidMobile = (phone) => {
        // let regex = /^[6-9]{1}[0-9]{9}$/.test(phone)
        let regex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(phone)
        return regex
    }
    

//function for request body validation
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const registerIntern = async function (req, res) {
   res.setHeader('Access-Control-Allow-Origin','*')
    try {

        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Invalid Parameters, Please send correct intern details" })
            return
        }

        const { name, email, mobile, collegeName } = requestBody  //destructuring of object

        //validation starts
        if (!isValid(name, 'string')) {
            res.status(400).send({ status: false, message: "Name is required and should be valid" })
            return
        }
        if (!isValid(email, 'string')) {
            res.status(400).send({ status: false, message: "email is required and should be valid" })
            return
        }
        //email validation using regular expression
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        if (!isValidMobile(mobile, 'number')) {
            res.status(400).send({ status: false, message: "mobile number is required and should be number" })
            return
        }
        //mobile number validation
        if (!isValid(collegeName, 'string')) {
            res.status(400).send({ status: false, message: "collegeName is required and should be valid" })
            return
        }
        //validation ends

        const isEmailAlreadyUsed = await InternModel.findOne({ email })
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `"${email}" is already used, try different one` })
            return
        }
        const isMobileAlreadyUsed = await InternModel.findOne({mobile})
        if (isMobileAlreadyUsed) {
            res.status(400).send({status:false, message :`"${mobile}" is already used, try another one`})
            return
        }
        const collegeDetails = await CollegeModel.findOne({ name: collegeName, isDeleted : false })
        if (!collegeDetails) {
            res.status(404).send({ status: false, message: `No college exist by name "${collegeName}"` })
            return
        }
        const collegeId = collegeDetails["_id"]
        const internDetails = { name, mobile, email, collegeId }

        const newIntern = await InternModel.create(internDetails)
        return res.status(201).send({ status: true, message: "Intern registered successfully", newIntern })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { registerIntern }