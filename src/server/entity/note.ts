import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Length, validate } from 'class-validator'

/**
 * @swagger
 * definitions:
 *  Note:
 *    type: object
 *    properties:
 *      id:
 *        type: number
 *      text:
 *        type: string
 *        minimum: 10
 *        maximum: 500
 */
export interface INote {
  readonly id: number
  readonly text: string
}

@Entity()
export class Note extends BaseEntity implements INote {
  @PrimaryGeneratedColumn() readonly id: number

  @Column({ nullable: false })
  @Length(10, 500)
  readonly text: string

  @BeforeInsert()
  update() {
    validate(this)
  }
}
