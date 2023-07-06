# GCP Compute Engine Instance Monitor

This is a Node.js script that monitors Google Cloud Platform (GCP) Compute Engine instances and sends a Slack notification with the running instances.

## Prerequisites

- Node.js (version 18.X)
- `@google-cloud/compute` package
- `@google-cloud/functions-framework` package
- `@slack/webhook` package

## Setup

1. Clone the repository:

git clone https://github.com/fatihmuratkarakaya/GCP-Instance-Monitoring.git


2. Install the required packages:

npm install @google-cloud/compute @google-cloud/functions-framework @slack/webhook


3. Update the configuration variables in the code:

- Replace `YOUR_SLACK_URL` with your Slack webhook URL.
- Replace `YOUR_PROJECT-ID` with your GCP project ID.

## Usage

To run the script locally:

1. Start the Functions Framework:

npx functions-framework --target=monitorInstances


2. The script will list all running instances in your GCP project and send a Slack notification.

To deploy the script to Google Cloud Functions:

1. Deploy the function:

gcloud functions deploy monitorInstances --runtime nodejs14 --trigger-http


2. The function will be deployed and accessible via an HTTP endpoint.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

