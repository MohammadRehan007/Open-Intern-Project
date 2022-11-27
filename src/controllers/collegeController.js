const validUrl = require('valid-url');
const CollegeModel = require('../models/collegeModel')
const InternModel = require('../models/internModel')


const isValid = function (value, type) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value != type) return false
    return true;
}
const isValidName = function (value, type) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && (value.trim().length === 0 || value.trim().split(" ").length > 1)) return false
    if (typeof value != type) return false
    return true;
}

//function for request body validation
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0    // true or false
}

// College data entry in DB
const createCollege = async function (req, res) {
    try {
        const reqBody = req.body

        if (!isValidRequestBody(reqBody)) {
            res.status(400).send({ status: false, message: "Invalid Parameters, Please send correct college details" })
            return
        }

        //Extract params
        const { name, fullName, logoLink } = reqBody

        //Validation starts
        if (!isValidName(name, 'string')) {
            res.status(400).send({ status: false, message: "Name is required and should be valid Name" })
            return
        }
        if (!isValid(fullName, 'string')) {
            res.status(400).send({ status: false, message: "fullName is required and should be valid fullName" })
            return
        }
        if (!isValid(logoLink, 'string')) {
            res.status(400).send({ status: false, message: "logoLink is required and should be valid" })
            return
        }

        if (!validUrl.isUri(logoLink.trim())) {
            res.status(400).send({ status: false, message: "Invalid logoLink " })
            return
        }


        //Unique name validation
        const isNameAlreadyUsed = await CollegeModel.findOne({ name }) // {name: name} object shorthand property

        if (isNameAlreadyUsed) {
            res.status(400).send({ status: false, message: "Name is already in use, Try another name" })
            return
        }
        //Validation ends

        const collegeData = { name, fullName, logoLink }
        const newCollege = await CollegeModel.create(collegeData)

        return res.status(201).send({ status: true, message: "College registered successfully", newCollege })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getCollegeDetails = async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin','*')
    try {
        const name = req.query.collegeName
        // validation starts
        if (!isValidName(name, 'string')) {
            res.status(400).send({ status: true, message: "college name is required for college details and should be abbreviated with no spaces" })
            return
        }
        name.toLowerCase()
        const collegeDetails = await CollegeModel.findOne({ name, isDeleted: false }) //using shorthand property

        if (!collegeDetails) {
            res.status(404).send({ status: false, message: "No data found for this college name" })
            return
        }
        const collegeId = collegeDetails["_id"]

        const internsDetails = await InternModel.find({ collegeId, isDeleted: false }).select({ "_id": 1, "name": 1, "email": 1, "mobile": 1 })

        if (internsDetails.length == 0) {

            const interns = "No one applied for internship"
            const { fullName, logoLink } = collegeDetails
            const data = { name, fullName, logoLink, interns }
            return res.status(200).send({ status: true, data: data })

        }

        const interns = internsDetails
        const { fullName, logoLink } = collegeDetails
        const data = { name, fullName, logoLink, interns }
        return res.status(200).send({ status: true, data: data })

    } catch (err) {

        return res.status(500).send({ status: false, message: err.message })

    }

}

module.exports = { createCollege, getCollegeDetails }