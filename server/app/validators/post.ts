import vine from '@vinejs/vine'


export const createPostValidator = vine.compile(
    vine.object({
      title: vine.string().trim().minLength(6),
      body: vine.string().trim().escape()
    })
  )