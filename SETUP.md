# Setup Instructions for Twitch Bot

## Local Installation
1. **Clone the Repository**  
   Open your terminal and run:
   ```bash
   git clone https://github.com/robdv081/twitch-bot.git
   cd twitch-bot
   ```  

2. **Install Dependencies**  
   Make sure you have [Node.js](https://nodejs.org/) installed. Then, run:
   ```bash
   npm install
   ```

3. **Create a `.env` file**  
   Copy the example file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to include your Twitch credentials and any other necessary configurations.

4. **Run the Bot**  
   After installing dependencies and setting up the environment variables, you can run:
   ```bash
   npm start
   ```

## Deployment on Render
1. **Create a Render Account**  
   If you don’t have one, sign up at [Render](https://render.com).

2. **Create a New Web Service**  
   - Go to the Render dashboard.
   - Click on the "New" button and select "Web Service".
   - Connect your GitHub account if prompted, and select the `twitch-bot` repository.

3. **Configure the Service**  
   - Set the environment variables under the "Environment" section, copying the required values from your `.env` file.
   - Choose the branch to deploy, typically `main`.
   - For build command, enter:
   ```bash
   npm install
   ```  
   - For start command, enter:
   ```bash
   npm start
   ```  

4. **Deploy**  
   Click on the "Create Web Service" button. Render will build and deploy your application. Monitor the logs to ensure it starts correctly.


## Conclusion
You should now have a working Twitch Bot both locally and deployed on Render! If you encounter issues, refer to the documentation or community forums for help.