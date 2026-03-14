const { getRecommendations, parseRecommendationOutput } = require('../services/recommendationService')
const { getTaskDetail } = require('../services/wiroApi')

async function startRecommendation(req, res) {
  try {
    const { imageUrl } = req.body

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' })
    }

    const result = await getRecommendations(imageUrl)

    if (!result.result) {
      return res.status(500).json({ error: 'Failed to start recommendation task', details: result.errors })
    }

    res.json({
      taskToken: result.socketaccesstoken,
      taskId: result.taskid,
    })
  } catch (error) {
    console.error('Recommendation error:', error.message)
    res.status(500).json({ error: 'Recommendation failed', message: error.message })
  }
}

async function getRecommendationResult(req, res) {
  try {
    const { token } = req.params
    const result = await getTaskDetail(token)

    if (!result.result || !result.tasklist?.length) {
      return res.status(404).json({ error: 'Task not found' })
    }

    const task = result.tasklist[0]
    const status = task.status

    if (status === 'task_postprocess_end') {
      const rawOutput = task.debugoutput || ''
      const products = parseRecommendationOutput(rawOutput)

      return res.json({
        status: 'completed',
        rawResponse: rawOutput,
        products,
        outputs: task.outputs || [],
      })
    }

    if (status === 'task_cancel' || status === 'task_error') {
      return res.json({ status: 'failed', error: `Task failed: ${status}` })
    }

    res.json({ status: 'processing', taskStatus: status })
  } catch (error) {
    console.error('Task detail error:', error.message)
    res.status(500).json({ error: 'Failed to get task detail', message: error.message })
  }
}

module.exports = { startRecommendation, getRecommendationResult }
