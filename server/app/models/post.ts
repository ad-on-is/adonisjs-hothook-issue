import { DateTime } from 'luxon'
import { BaseModel,  belongsTo,  column, hasMany } from '@adonisjs/lucid/orm'
import type {  BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Comment from '#models/comment'
import User from '#models/user'


export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare body: string

  @column({
    columnName: 'user_id',
  })
  declare user_id: number

  @belongsTo(() => User)
  declare userId: BelongsTo<typeof User>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @column()
  declare image: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}