import {TeamleadController} from './teamleads.controllers';
import {AdminController} from './admin.controller';
import {AuthController} from './auth.controller';
import {BOMController} from './bom.controller';
import {BudgetsController} from './budgets.controller';
import {CommandsController} from './commands.controller';
import {CriticalPathsController} from './criticalPath.controller';
import {CriticalPathBotController} from './criticalPathBot.controller';
import {CRUDController} from './CRUD.controller';
import {CrudLogsController} from './crudLogs.controller';
import {EventsController} from './events.controller';
import {NewsController} from './news.controller';

const teamleadController = new TeamleadController();
const adminController = new AdminController();
const authController = new AuthController();
const bomController = new BOMController();
const budgetsController = new BudgetsController();
const commandsController = new CommandsController();
const criticalPathsController = new CriticalPathsController();
const criticalPathBotController = new CriticalPathBotController();
const crudController = new CRUDController();
const crudLogsController = new CrudLogsController();
const eventsController = new EventsController();
const newsController = new NewsController();


export {
    teamleadController,
    adminController,
    authController,
    bomController,
    budgetsController,
    commandsController,
    criticalPathsController,
    criticalPathBotController,
    crudController,
    crudLogsController,
    eventsController,
    newsController
};