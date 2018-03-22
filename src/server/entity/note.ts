import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
 */
export interface INote {
  readonly id: number
  readonly text: string
}

@Entity()
export class Note extends BaseEntity implements INote {
  @PrimaryGeneratedColumn() readonly id: number
  @Column() readonly text: string
}
