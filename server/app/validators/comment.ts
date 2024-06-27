import vine from '@vinejs/vine'

export const createCommentValidator = vine.compile(
  vine.object({
    comment: vine.string().trim().minLength(6),
  })
)
