import { User } from 'src/types';
import { MockModel } from '../../../unit/database/mock.model';
import { userStub } from './user.stub';

export class UserModelMock extends MockModel<User> {
  protected entityStub: User = userStub();
}
