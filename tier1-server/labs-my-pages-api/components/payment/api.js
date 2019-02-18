const jwt = require('jsonwebtoken');
const router = require('express').Router();
const dal = require('./dal');
const authSchemas = require('./validationSchemas/index');

const schemaValidator = require('../middlewares/schemaValidator');
const validateRequest = schemaValidator(true, authSchemas);

router.post('/initialize', validateRequest, async (req, res) => {
    try {
        const orderId = await dal.createOrder(req.body);
        console.log('orderid', orderId);
        if (orderId) {
            const paymentInfo = await dal.initializePayment(req.body, orderId);
            console.log('paymentInfo', paymentInfo);

            return res.json(
                {
                    paymentInfo
                }
            );
        }

        return null;
    } catch (err) {
        res.json(err);
    }
});

router.get('/confirm/:id', validateRequest, async (req, res) => {
    try {
        const orderId = req.params.id;

        console.log('orderid', orderId);

        if (orderId) {
            const order = await dal.confirmPayment(orderId);
            console.log('order', order);

            if (order) {
                return res.json(
                    {
                        ...order
                    }
                );
            }
        }

        throw Error('No order found');
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;
