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
import { createHistory } from '../util/history';

@Resolver(TaskReceipt)
export default class TaskReceiptResolver
  implements ResolverInterface<TaskReceipt>
{
  /**
   * Get all receipts that are correlated to the users home.
   */
  @Authorized()
  @Query(() => [TaskReceipt])
  async receipts() {
    await databaseConnection();
    const home = await Helper.getHomeOrFail();

    try {
      return await TaskReceipt.find({
        relations: ['completer'],
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
  @FieldResolver(() => User)
  async completer(@Root() receipt: TaskReceipt) {
    return receipt.completer ? await User.findOne(receipt.completer?.id) : null;
  }

  /**
   * Create a new receipt.
   */
  @Authorized()
  @Mutation(() => TaskReceipt)
  async createTaskReceipt(@Arg('task') task: string) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail();
    const taskItem = await Helper.getTaskOrFail(task, home.id);
    if (taskItem.receipt)
      throw Error(
        `Failed to complete task! Task already has a receipt with id ${String(
          taskItem.receipt
        )}.`
      );
    const type = await Helper.getTypeOrFail(String(taskItem?.type), home.id);
    const user = await Helper.getMeOrFail();

    try {
      // create receipt and save it
      const receipt = new TaskReceipt(home, user, type.name, type.points);
      await receipt.save();

      // create reference from task to receipt
      taskItem.receipt = receipt;
      await taskItem.save();

      await createHistory(home, user, HistoryType.TASK_COMPLETED);

      return receipt;
    } catch (e) {
      throw Error('Failed to create task receipt!');
    }
  }
}
