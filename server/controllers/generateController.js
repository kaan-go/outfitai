const { runGeneration, getTaskDetail, pollTaskUntilDone, killTask } = require('../services/wiroApi')
const fs = require('fs')

async function generate(req, res) {
  try {
    const { prompt, inputImageUrl } = req.body
    const files = req.files || {}

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const inputImages = []
    const inputImageUrls = []

    if (files.inputImage) {
      for (const file of files.inputImage) {
        inputImages.push(file.path)
      }
    }

    if (inputImageUrl) {
      const urls = Array.isArray(inputImageUrl) ? inputImageUrl : [inputImageUrl]
      inputImageUrls.push(...urls)
    }

    if (inputImages.length === 0 && inputImageUrls.length === 0) {
      return res.status(400).json({ error: 'At least one image (file or URL) is required' })
    }

    const result = await runGeneration({ prompt, inputImages, inputImageUrls })

    for (const imgPath of inputImages) {
      fs.unlink(imgPath, () => {})
    }

    if (!result.result) {
      return res.status(500).json({ error: 'Generation failed', details: result.errors })
    }

    return res.json({
      taskId: result.taskid,
      socketToken: result.socketaccesstoken,
    })
  } catch (err) {
    console.error('Generate error:', err.message)
    return res.status(500).json({ error: 'Generation failed', message: err.message })
  }
}

async function generateSync(req, res) {
  try {
    const { prompt, inputImageUrl } = req.body
    const files = req.files || {}

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const inputImages = []
    const inputImageUrls = []

    if (files.inputImage) {
      for (const file of files.inputImage) {
        inputImages.push(file.path)
      }
    }

    if (inputImageUrl) {
      const urls = Array.isArray(inputImageUrl) ? inputImageUrl : [inputImageUrl]
      inputImageUrls.push(...urls)
    }

    if (inputImages.length === 0 && inputImageUrls.length === 0) {
      return res.status(400).json({ error: 'At least one image (file or URL) is required' })
    }

    const runResult = await runGeneration({ prompt, inputImages, inputImageUrls })

    for (const imgPath of inputImages) {
      fs.unlink(imgPath, () => {})
    }

    if (!runResult.result) {
      return res.status(500).json({ error: 'Generation failed', details: runResult.errors })
    }

    const taskResult = await pollTaskUntilDone(runResult.socketaccesstoken)

    return res.json({
      taskId: runResult.taskid,
      imageUrl: taskResult.imageUrl,
      outputs: taskResult.outputs,
      elapsedSeconds: taskResult.elapsedSeconds,
    })
  } catch (err) {
    console.error('GenerateSync error:', err.message)
    return res.status(500).json({ error: 'Generation failed', message: err.message })
  }
}

async function taskStatus(req, res) {
  try {
    const { token } = req.params

    if (!token) {
      return res.status(400).json({ error: 'Task token is required' })
    }

    const result = await getTaskDetail(token)

    if (!result.result || !result.tasklist?.length) {
      return res.status(404).json({ error: 'Task not found' })
    }

    const task = result.tasklist[0]

    return res.json({
      taskId: task.id,
      status: task.status,
      imageUrl: task.outputs?.[0]?.url || null,
      outputs: task.outputs || [],
      elapsedSeconds: task.elapsedseconds,
    })
  } catch (err) {
    console.error('TaskStatus error:', err.message)
    return res.status(500).json({ error: 'Failed to get task status', message: err.message })
  }
}

async function cancelTask(req, res) {
  try {
    const { taskId } = req.body

    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' })
    }

    const result = await killTask(taskId)
    return res.json(result)
  } catch (err) {
    console.error('CancelTask error:', err.message)
    return res.status(500).json({ error: 'Failed to cancel task', message: err.message })
  }
}

module.exports = { generate, generateSync, taskStatus, cancelTask }
