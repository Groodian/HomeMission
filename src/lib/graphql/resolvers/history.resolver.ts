import { FieldResolver, Resolver, ResolverInterface, Root } from 'type-graphql';
import History from '../../../entities/history';
import Task from '../../../entities/task';
import TaskSeries from '../../../entities/taskseries';
import TaskType from '../../../entities/tasktype';
import User from '../../../entities/user';

@Resolver(History)
export default class HistoryResolver implements ResolverInterface<History> {
  /**
   * Only load user if required.
   */
  @FieldResolver(() => User, {
    description: 'The user that triggered the event.',
  })
  async user(@Root() history: History) {
    return (await User.findOne(history.user, {
      loadRelationIds: true,
    })) as User;
  }

  /**
   * Only load task type if required.
   */
  @FieldResolver(() => TaskType, {
    nullable: true,
    description: 'The history may contain a reference to a task type.',
  })
  async taskType(@Root() history: History) {
    return history.taskType
      ? await TaskType.findOne(history.taskType, { loadRelationIds: true })
      : null;
  }

  /**
   * Only load task if required.
   */
  @FieldResolver(() => Task, {
    nullable: true,
    description: 'The history may contain a reference to a task.',
  })
  async task(@Root() history: History) {
    return history.task
      ? await Task.findOne(history.task, { loadRelationIds: true })
      : null;
  }

  /**
   * Only load task series if required.
   */
  @FieldResolver(() => TaskSeries, {
    nullable: true,
    description: 'The history may contain a reference to a task series.',
  })
  async taskSeries(@Root() history: History) {
    return history.taskSeries
      ? await TaskSeries.findOne(history.taskSeries, { loadRelationIds: true })
      : null;
  }

  /**
   * Only load affected user if required.
   */
  @FieldResolver(() => User, {
    nullable: true,
    description: 'The history may contain a reference to an affected user.',
  })
  async affectedUser(@Root() history: History) {
    return history.affectedUser
      ? await User.findOne(history.affectedUser, { loadRelationIds: true })
      : null;
  }
}
