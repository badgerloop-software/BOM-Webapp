require('dotenv').config();
import {ExpressConfiguration} from './config/express.config';
import * as passportConfig from './config/passport.config';
import * as eventsController from './controllers/events.controller';
import * as utilsController from './controllers/utils.controller';

const PORT = process.env.PORT || 7001;

const expressConfiguration = new ExpressConfiguration();
const app = expressConfiguration.app;

async function setupSlack() {
const checkSlackIntegration: boolean = await expressConfiguration.setupSlackIntegration();
if (!checkSlackIntegration) console.log("[Error] Failed to get channels, is slack setup correctly?");
else console.log("[INFO] Slack Integration Sucessful, Channels saved to SlackService.Channels");
}
setupSlack();


app.listen(PORT, () => {
  console.log('[INFO] Server running on ' + PORT);
});

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res) => {
  
  res.render('homePage', {
    user: req.user,
    activeDashboard: true
  });
});

app.post('/slackEventSub', eventsController.getSlackTest);
app.get('/calendar', passportConfig.isAuthenticated, utilsController.getCal);
