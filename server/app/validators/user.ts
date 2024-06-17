import vine from '@vinejs/vine'


export const createUserValidator = vine.compile(
    vine.object({
      fullName: vine.string().trim().minLength(4),
      email: vine.string().email().trim(),
      password: vine.string().trim().minLength(6)
    })
  )