import { UserEntity } from './User';

export interface ParticipantEntity extends UserEntity {
  joinedAt?: number;
}
