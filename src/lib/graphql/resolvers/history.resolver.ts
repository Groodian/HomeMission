import { Authorized, Query, Resolver } from 'type-graphql';
import { Home, History } from '../../../entities/index';
import databaseConnection from '../../typeorm/connection';

@Resolver(History)
export default class HistoryResolver {
  /**
   * Get the history of a specific home.
   */
  @Authorized()
  @Query(() => [History])
  async history(home: Home) {
    try {
      await databaseConnection();
      return await History.find({ where: { home: home.id } });
    } catch (e) {
      throw Error('Failed to load history!');
    }
  }
}
