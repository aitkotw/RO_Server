const express = require("express");
const passport = require('passport')
const bcrypt = require("bcryptjs");

// Initialize Router
const router = express.Router();

// Load Admin Model
const Renewal = require("../model/Renewal");
const RenewalsCompleted = require("../model/RenewalsCompleted");

// Load Input validation
const autoDataValidator = require("./../validation/autoValidateInput");


// @route   GET /services
// @desc    Get All the Services
// @access  Private
router.get( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    await Renewal.find({vendor:req.user._id}, (err, result) => {
        if(!err){
            res.status(200).json(result)
        } else{
            console.log(err)
        }
    });
});

// @route   POST /services
// @desc    Create a new Service
// @access  Private
router.post( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    expectedBodyData = ['name', 'rDate', 'customer']
    requiredFields = ['name', 'rDate', 'customer']
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //const { errors, isValid } = validateVendorDetails(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const addService = new Renewal({
        name: req.body.name,
        rDate: req.body.rDate,
        customer: req.body.customer,
        vendor: req.user._id,
    })

    addService.save({}, (err, doc) =>{
        if(!err){
            return res.status(200).json(doc);
        } else {
            return res.status(400).json(err);
        }
    })
});


// @route   PUT /services
// @desc    Update A service Data
// @access  Private
router.put( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{

    expectedBodyData = ['name', 'rDate', 'customer', '_id']
    requiredFields = ['name', 'rDate', 'customer', '_id'] 
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    } 

    const updateService = new Renewal({
        name: req.body.name,
        rDate: req.body.rDate,
        customer: req.body.customer,
        vendor: req.user._id,
    })

    await Services.findByIdAndUpdate(req.body._id, updateService, (err, result) => {
        if(!err){
            return res.status(200).json(result);
        } else {
            return res.status(400).json(err);
        }
    })
});


// @route   DELETE /services
// @desc    Delete Single service
// @access  Private
router.delete( "/", passport.authenticate("jwt", { session: false }), async (req, res) =>{

    expectedBodyData = ['_id']
    requiredFields = ['_id'] 
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);
    
    if (!isValid) {
        return res.status(400).json(errors);
    } 

    await Renewal.findOneAndRemove({_id:req.body._id, vendor: {$eq:req.user._id}}, (err, result) => {
        if(!err){
            return res.status(200).json({Message: 'Data Deleted Successfully'});
        } else {
            return res.status(400).json({Error: 'Something Went Wrong'});
        }
    })
});


// @route   GET /services/completed
// @desc    Get All the completed Services
// @access  Private
router.get( "/completed", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    await RenewalsCompleted.find({vendor:req.user._id}, (err, result) => {
        if(!err){
            res.status(200).json(result)
        } else{
            console.log(err)
        }
    });
});

// @route   GET /services/completed
// @desc    Get All the completed Services
// @access  Private
router.get( "/completed/customer", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    expectedBodyData = ['customer']
    requiredFields = ['customer']
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    await RenewalsCompleted.find({vendor:req.user._id, customer:req.body.customer}, (err, result) => {
        if(!err){
            res.status(200).json(result)
        } else{
            console.log(err)
        }
    });
});


// @route   POST /services/completed
// @desc    Create a new completed Services
// @access  Private
router.post( "/completed", passport.authenticate("jwt", { session: false }), async (req, res) =>{
    expectedBodyData = ['name', 'rDate', 'customer']
    requiredFields = ['name', 'rDate', 'customer']
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

    //const { errors, isValid } = validateVendorDetails(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const addCompletedService = new RenewalsCompleted({
        name: req.body.name,
        rDate: req.body.rDate,
        customer: req.body.customer,
        vendor: req.user._id,
    })

    addCompletedService.save({}, (err, doc) =>{
        if(!err){
            return res.status(200).json(doc);
        } else {
            return res.status(400).json(err);
        }
    })
});

//********************************************* Don't Need Put or Delete Request for this ****************************/
// @route   PUT /services/completed
// @desc    Update completed Services
// @access  Private
// router.put( "/completed", passport.authenticate("jwt", { session: false }), async (req, res) =>{

//     expectedBodyData = ['name', 'sDate', 'orderId', '_id']
//     requiredFields = ['name', 'sDate', '_id'] 
//     const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);

//     //Check Validation
//     if (!isValid) {
//       return res.status(400).json(errors);
//     } 

//     const updateService = ({
//         name: req.body.name,
//         sDate: req.body.sDate,
//         orderId: req.body.orderId,
//         vendor: req.user._id,
//     })

//     await ServiceCompleted.findByIdAndUpdate(req.body._id, updateService, (err, result) => {
//         if(!err){
//             return res.status(200).json(result);
//         } else {
//             return res.status(400).json(err);
//         }
//     })
// });

//TODO: Comment This
// @route   DELETE /services/completed
// @desc    Delete completed Services
// @access  Private
router.delete( "/completed", passport.authenticate("jwt", { session: false }), async (req, res) =>{

    expectedBodyData = ['_id']
    requiredFields = ['_id'] 
    const { errors, isValid } = autoDataValidator(req.body, expectedBodyData, requiredFields);
    
    if (!isValid) {
        return res.status(400).json(errors);
    } 

    await RenewalsCompleted.findOneAndRemove({_id:req.body._id, vendor: {$eq:req.user._id}}, (err, result) => {
        if(!err){
            return res.status(200).json({Message: 'Data Deleted Successfully'});
        } else {
            return res.status(400).json({Error: 'Something Went Wrong'});
        }
    })
});

module.exports = router;
