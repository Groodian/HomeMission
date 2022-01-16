import { Home, History, User, HistoryType } from '../../../entities/index';
import databaseConnection from '../../typeorm/connection';

export async function createHistory(
  home: Home,
  user: User,
  type: HistoryType
): Promise<History> {
  try {
    await databaseConnection();

    const history = new History();
    history.home = home;
    history.user = user;
    history.type = type;

    home.history.push(history);
    user.history.push(history);

    await history.save();

    return history;
  } catch (e) {
    throw Error('Failed to create history!');
  }
}
