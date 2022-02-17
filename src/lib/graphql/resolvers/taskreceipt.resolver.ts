import { Session } from '@auth0/nextjs-auth0';
import {
  Arg,
  Authorized,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from 'type-graphql';
import { HistoryType } from '../../../entities/history';
import TaskReceipt from '../../../entities/taskreceipt';
import User from '../../../entities/user';
import CurrentSession from '../../auth0/current-session';
import databaseConnection from '../../typeorm/connection';
import Helper from './helper';
import TaskType from '../../../entities/tasktype';

@Resolver(TaskReceipt)
export default class TaskReceiptResolver
  implements ResolverInterface<TaskReceipt>
{
  /**
   * Get all receipts that are correlated to the users home.
   */
  @Authorized()
  @Query(() => [TaskReceipt], {
    description: 'Get all receipts that are correlated to the users home.',
  })
  async receipts(@CurrentSession() session: Session) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);

    try {
      return await TaskReceipt.find({
        loadRelationIds: true,
        where: { relatedHome: home.id },
      });
    } catch (e) {
      throw Error('Failed to get all receipts!');
    }
  }

  /**
   * Only load related user if required.
   */
  @FieldResolver(() => User, {
    description: 'The user that completed the task.',
  })
  async completer(@Root() receipt: TaskReceipt) {
    return (await User.findOne(receipt.completer)) as User;
  }

  /**
   * Create a new receipt to complete a task.
   * The task must belong to the users home.
   * The authenticated user is saved as completer.
   * @param task The id of the task to complete.
   */
  @Authorized()
  @Mutation(() => TaskReceipt, {
    description: `Create a new receipt to complete a task.
The task must belong to the users home.
The authenticated user is saved as completer.`,
  })
  async createTaskReceipt(
    @CurrentSession() session: Session,
    @Arg('task', { description: 'The id of the task to complete.' })
    task: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const taskItem = await Helper.getTaskOrFail(task, home.id);
    if (taskItem.receipt)
      throw Error(
        `Failed to complete task! Task already has a receipt with id ${String(
          taskItem.receipt
        )}.`
      );
    const user = await Helper.getMeOrFail(session);

    // get type directly because it might not have reference to home anymore
    const type = await TaskType.findOneOrFail(String(taskItem?.type), {
      loadRelationIds: true,
    });
    if (type.relatedHome && String(type.relatedHome) !== String(home.id))
      throw Error('Failed to execute! Task does not belong to users home.');

    try {
      // create receipt and save it
      const receipt = new TaskReceipt(home, user, type.name, type.points);
      await receipt.save();

      // update points
      user.points += type.points;
      await user.save();

      // create reference from task to receipt
      taskItem.receipt = receipt;
      await taskItem.save();

      await Helper.createHistory(home, user, HistoryType.TASK_COMPLETED);

      receipt.completer = receipt.completer.id as any; // Only save id for field resolver

      return receipt;
    } catch (e) {
      throw Error('Failed to create task receipt!');
    }
  }
}
