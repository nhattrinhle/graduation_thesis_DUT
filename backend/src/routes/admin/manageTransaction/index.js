const express = require('express')
const asyncHandler = require('../../../middlewares/asyncHandler')
const validate = require('../../../middlewares/validate')
const { adminController } = require('../../../controllers')
const { adminValidation } = require('../../../validations')

const router = express.Router()

router.get(
    '/deposit',
    validate(adminValidation.manageTransaction.getAllDepositTransactions),
    asyncHandler(adminController.getAllDepositTransactions)
)
router.post(
    '/deposit/:userId',
    validate(adminValidation.manageTransaction.depositUserBalance),
    asyncHandler(adminController.depositUserBalance)
)

router.get(
    '/rent-service',
    validate(adminValidation.manageTransaction.getAllRentServiceTransactions),
    asyncHandler(adminController.getAllRentServiceTransactions)
)

module.exports = router
