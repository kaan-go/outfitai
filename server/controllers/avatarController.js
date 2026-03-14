const { generateAvatar } = require('../services/avatarService')
const { getTaskDetail } = require('../services/wiroApi')

async function createAvatar(req, res) {
  try {
    const { height, weight, gender, bodyType, skinTone } = req.body

    if (!gender || !bodyType) {
      return res.status(400).json({ error: 'Gender and body type are required' })
    }

    const result = await generateAvatar({ height, weight, gender, bodyType, skinTone })

    if (!result.result) {
      return res.status(500).json({ error: 'Avatar generation failed', details: result.errors })
    }

    return res.json({
      taskId: result.taskid,
      socketToken: result.socketaccesstoken,
    })
  } catch (err) {
    console.error('CreateAvatar error:', err.message)
    return res.status(500).json({ error: 'Avatar generation failed', message: err.message })
  }
}

async function avatarTaskStatus(req, res) {
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
    console.error('AvatarTaskStatus error:', err.message)
    return res.status(500).json({ error: 'Failed to get task status', message: err.message })
  }
}

module.exports = { createAvatar, avatarTaskStatus }
