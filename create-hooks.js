const asana = require("asana");
const client = asana.Client.create().useAccessToken(process.env.ASANA_KEY);
const workspace_id = process.env.WORKSPACE_ID;
const webhook_target = "https://asana-task-tracker.herokuapp.com/handle";

const delete_webhook = ({ id }) =>
  client.webhooks.deleteById(id).then(console.log);

const delete_all_webhooks = () =>
  client.webhooks.getAll(workspace_id, { workspace: workspace_id }).then(
    collection =>
      new Promise((resolve, reject) =>
        collection
          .stream()
          .on("data", delete_webhook)
          .on("end", resolve)
      )
  );

const create_webhook_for_project = ({ id }) =>
  client.webhooks
    .create(id, webhook_target)
    .then(console.log)
    .catch(err => console.log(err.value));

const create_all_webhooks = () =>
  client.projects.findAll(workspace_id).then(
    collection =>
      new Promise((resolve, reject) =>
        collection
          .stream()
          .on("data", create_webhook_for_project)
          .on("end", resolve)
      )
  );

delete_all_webhooks();
// create_all_webhooks();
