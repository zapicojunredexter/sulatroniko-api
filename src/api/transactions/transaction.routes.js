const express = require('express');
const controller = require('./transaction.controller');

const router = express.Router();

router
  .route('/proposals')
  .get(controller.fetchAll)
  // when author assigns his manuscript to publisher
  .post(controller.set);


router
  .route('/proposals/:id')
  // when publisher assigns proposal to copywriter
  .post(controller.assignToCopywriter);

router
  .route('/transactions/progress/:id')
  // when copywriter adds card
  .post(controller.addProgress)
  // when copywriter edits card
  .patch(controller.editProgress);

router
  .route('/transactions/reorder/:id')
  // when copywriter edits card
  .patch(controller.reorderProgress);


router
  .route('/transactions/approve/proposal/:id')
  // when publisher approves transaction
  .post(controller.approveProposal);
router
  .route('/transactions/:id')
  .get(controller.fetch)
  .patch(controller.edit);

module.exports = router;
