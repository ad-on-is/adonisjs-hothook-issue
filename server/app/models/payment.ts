import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({
    columnName: 'user_id',
  })
  declare user_id: number

  @column()
  declare amount: number

  @column()
  declare time: string

  @column()
  declare date: string

  @column()
  declare currency: string

  @column()
  declare reciept_url: string

  @column()
  declare reciept_pdf: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}