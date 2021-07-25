import Memory from '../models/memory.js'
import { NotAuthorized, NotFound } from '../lib/errors.js'


async function create(req, res, next) {
  
  try {
    
    req.body.user = req.currentUser

    const memory = await Memory.findById(req.params.memoryId)

    // * given that comments are only available on memory pages,
    // * this shouldn't be needed, but keeping in case of unexpected errors/for testing
    if (!memory) {
      throw new NotFound()
    }

    memory.comments.push(req.body)
    memory.save()

    res.status(200).json(memory)

  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  const { memoryId, commentId } = req.params

  try {

    const memory = await Memory.findById(memoryId)

    if (!memory) {
      throw new NotFound
    }

    const comment = memory.comments.id(commentId)

    const currentUserId = req.currentUser.userId
    const commentUserId = comment.user.userId

    if (!commentUserId.equals(currentUserId)) {
      throw new NotAuthorized
    }

    comment.remove()
    await memory.save()
    
    res.sendStatus(200)

  } catch (e) {
    next(e)
  }
}


export default {
  create,
  remove,
}