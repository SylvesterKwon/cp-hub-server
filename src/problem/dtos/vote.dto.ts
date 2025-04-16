import { IsEnum } from 'class-validator';
import { EditorialVoteAction } from '../services/vote.service';

export class EditorialVoteDto {
  @IsEnum(EditorialVoteAction)
  action: EditorialVoteAction;
}
