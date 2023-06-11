const url = "YOUR_SLACK_URL";
const compute = require('@google-cloud/compute');
const functions = require('@google-cloud/functions-framework');
const {IncomingWebhook} = require("@slack/webhook");

// Register an HTTP function with the Functions Framework
functions.http('monitorInstances', (req, res) => {


// List all instances in the specified project.

    const projectId = 'YOUR_PROJECT-ID';
    const webhook = new IncomingWebhook(url);

// List all instances in the specified project.
    async function listAllInstances() {
        const instancesClient = new compute.InstancesClient();

        //Use the `maxResults` parameter to limit the number of results that the API returns per response page.
        const aggListRequest = instancesClient.aggregatedListAsync({
            project: projectId,
            maxResults: 5,
        });

        let instanceList = [];
        for await (const [_, instancesObject] of aggListRequest) {
            instancesObject.instances
                .filter(instance => {
                    return instance.status === 'RUNNING'
                })
                .forEach(instance => {
                    const instanceType = instance.machineType.match("machineTypes\\/(.*)$")[1]
                    const instanceZone = instance.zone.match("zones\\/(.*)$")[1]
                    instanceList.push({name: instance.name, zone: instanceZone, machineType: instanceType});
                });
        }
        return instanceList;
    }

    async function getSlackAllInstances() {
        const instances = await listAllInstances()
        const blockResult = instances.flatMap(instance => {
            return instanceToBlock(instance)
        })
        return {blocks: blockResult}
    }

    function instanceToBlock(instance) {
        return [{
            "type": "section", "fields": [{
                "type": "mrkdwn", "text": ":computer:Zone: ".concat(instance.zone)
            },
                {
                    "type": "mrkdwn", "text": " Type: ".concat(instance.machineType)
                },
                {
                    "type": "mrkdwn", "text": " Name: ".concat(instance.name)
                },]
        }];
    }


    (async () => {

        await getSlackAllInstances()
            .then(res => {webhook.send(res)})
            .then(() => {res.status(200)
                .send('it worked yeay');})
            .catch((error) => {
                console.error(error);
                res.status(500).send("An unexpected error occurred");
            })
    })();
});
