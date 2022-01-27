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
import databaseConnection from '../../typeorm/connection';
import { TaskReceipt, User, HistoryType } from '../../../entities';
import Helper from './helper';
import CurrentSession from '../../auth0/current-session';
import { Session } from '@auth0/nextjs-auth0';

@Resolver(TaskReceipt)
export default class TaskReceiptResolver
  implements ResolverInterface<TaskReceipt>
{
  /**
   * Get all receipts that are correlated to the users home.
   */
  @Authorized()
  @Query(() => [TaskReceipt])
  async receipts(@CurrentSession() session: Session) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);

    try {
      return await TaskReceipt.find({
        relations: ['completer'],
        where: { relatedHome: home.id },
      });
    } catch (e) {
      throw Error('Failed to get all receipts!');
    }
  }

  /**
   * Only load related user if required.
   */
  @FieldResolver(() => User)
  async completer(@Root() receipt: TaskReceipt) {
    return await User.findOne(receipt.completer?.id || '');
  }

  /**
   * Create a new receipt.
   */
  @Authorized()
  @Mutation(() => TaskReceipt)
  async createTaskReceipt(
    @CurrentSession() session: Session,
    @Arg('task') task: string
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
    const type = await Helper.getTypeOrFail(String(taskItem?.type), home.id);
    const user = await Helper.getMeOrFail(session);

    try {
      // create receipt and save it
      const receipt = new TaskReceipt(home, user, type.name, type.points);
      await receipt.save();

      // create reference from task to receipt
      taskItem.receipt = receipt;
      await taskItem.save();

      await Helper.createHistory(home, user, HistoryType.TASK_COMPLETED);

      return receipt;
    } catch (e) {
      throw Error('Failed to create task receipt!');
    }
  }
}
