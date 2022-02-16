import { FieldResolver, Resolver, Root } from 'type-graphql';
import History from '../../../entities/history';
import Task from '../../../entities/task';
import TaskSeries from '../../../entities/taskseries';
import TaskType from '../../../entities/tasktype';
import User from '../../../entities/user';

@Resolver(History)
export default class HistoryResolver {
  /**
   * Only load task if required.
   */
  @FieldResolver(() => Task, { nullable: true })
  async task(@Root() history: History) {
    return history.task
      ? await Task.findOne(history.task, { loadRelationIds: true })
      : null;
  }

  /**
   * Only load user if required.
   */
  @FieldResolver(() => User)
  async user(@Root() history: History) {
    return history.user
      ? await User.findOne(history.user, { loadRelationIds: true })
      : null;
  }

  /**
   * Only load affected user if required.
   */
  @FieldResolver(() => User, { nullable: true })
  async affectedUser(@Root() history: History) {
    return history.affectedUser
      ? await User.findOne(history.affectedUser, { loadRelationIds: true })
      : null;
  }

  /**
   * Only load task type if required.
   */
  @FieldResolver(() => TaskType, { nullable: true })
  async taskType(@Root() history: History) {
    return history.taskType
      ? await TaskType.findOne(history.taskType, { loadRelationIds: true })
      : null;
  }

  /**
   * Only load task series if required.
   */
  @FieldResolver(() => TaskSeries, { nullable: true })
  async taskSeries(@Root() history: History) {
    return history.taskSeries
      ? await TaskSeries.findOne(history.taskSeries, { loadRelationIds: true })
      : null;
  }
}
