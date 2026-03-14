const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const { getAuthHeaders } = require('./wiroAuth')

const BASE_URL = process.env.WIRO_API_BASE || 'https://api.wiro.ai/v1'
const MODEL_ENDPOINT = '/Run/google/nano-banana-2'

async function runGeneration({ prompt, inputImages = [], inputImageUrls = [] }) {
  const form = new FormData()

  for (const imgPath of inputImages) {
    form.append('inputImage', fs.createReadStream(imgPath))
  }

  for (const url of inputImageUrls) {
    form.append('inputImage', url)
  }

  form.append('prompt', prompt)
  form.append('resolution', '1K')
  form.append('safetySetting', 'OFF')

  const headers = {
    ...getAuthHeaders(),
    ...form.getHeaders(),
  }

  const { data } = await axios.post(`${BASE_URL}${MODEL_ENDPOINT}`, form, { headers })
  return data
}

async function getTaskDetail(taskToken) {
  const headers = {
    ...getAuthHeaders(),
    'Content-Type': 'application/json',
  }

  const { data } = await axios.post(`${BASE_URL}/Task/Detail`, { tasktoken: taskToken }, { headers })
  return data
}

async function killTask(taskId) {
  const headers = {
    ...getAuthHeaders(),
    'Content-Type': 'application/json',
  }

  const { data } = await axios.post(`${BASE_URL}/Task/Kill`, { taskid: taskId }, { headers })
  return data
}

async function pollTaskUntilDone(taskToken, maxAttempts = 60, intervalMs = 3000) {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await getTaskDetail(taskToken)

    if (!result.result || !result.tasklist?.length) {
      throw new Error('Task not found')
    }

    const task = result.tasklist[0]
    const status = task.status

    if (status === 'task_postprocess_end') {
      return {
        status: 'completed',
        outputs: task.outputs || [],
        imageUrl: task.outputs?.[0]?.url || null,
        elapsedSeconds: task.elapsedseconds,
      }
    }

    if (status === 'task_cancel' || status === 'task_error') {
      throw new Error(`Task failed with status: ${status}`)
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  throw new Error('Task timed out')
}

module.exports = { runGeneration, getTaskDetail, killTask, pollTaskUntilDone }
