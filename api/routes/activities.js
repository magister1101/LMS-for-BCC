const express = require('express');
const router = express.Router();


router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: 'activity GET'
    })
})

router.post('/', (req, res, next)=>{
    const activity = {
        activityId: req.body.activityId,
        description: req.body.description

    }
    res.status(201).json({
        message: 'activity Creted',
        activity: activity
    })
})

router.get('/:activityId', (req, res, next)=>{
    res.status(200).json({
        message: 'activity Details',
        activityId: req.params.activityId
    })
})

router.delete('/:activityId', (req, res, next)=>{
    res.status(200).json({
        message: 'activity Deleted',
        activityId: req.params.activityId
    })
})



module.exports = router;