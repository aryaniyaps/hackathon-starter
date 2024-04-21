# Hackathon Starter

## Setup instructions

### Prerequisites:

- Docker Engine
- Nodejs v20+ (LTS)

### Setup Google Oauth2 application

To implement the sign in/ up with google authentication flow, we need to set up a
Google Oauth2 application.

Execute the following steps:

1. Go to Google Cloud Console:
   - Visit the Google Cloud Console.
   - Sign in with your Google account.
2. Create a new project:
   - If you don't have a project yet, click on "Select a project" at the top left of the console.
   - Click on "New Project" and follow the prompts to create a new project.
3. Set up OAuth2 Credentials:
   - In the Google Cloud Console, go to "APIs & Services" > "Credentials".
   - Click on "Create Credentials" and select "OAuth client ID".
   - Choose the application type based on your needs (Web application).
   - Be sure to add the URI **http://localhost:4433/self-service/methods/oidc/callback/google** to the authorized redirect URIs _(assuming Ory Kratos is hosted at localhost:4433)_.
4. Configure OAuth Consent Screen:
   - If prompted, configure the OAuth consent screen. Provide details like the application name, user support email, and other required information.
5. Obtain Client ID and Client Secret:
   - After creating the OAuth client ID, you will be provided with a Client ID and Client Secret.
6. Paste the Client ID and Client Secret in the `.env` file

   - in the `.env` file present in the root directory, paste the Client ID and Client Secret as follows:

     ```
     GOOGLE_CLIENT_ID="<Client ID goes here>"
     GOOGLE_CLIENT_SECRET="<Client Secret goes here>"
     ```

### Installing dependencies

You can install the dependencies for the frontend by running the following command:

```
cd client
npm install
```

### Starting the application

Get the Docker Compose services up and running with the following command (from the root directory):

```
docker compose up
```

In another terminal, start the frontend app with the following command:

```
cd client
npm run dev
```
