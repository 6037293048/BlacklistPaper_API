# Deploy API to Render (Free Hosting)

Render will keep your API running 24/7 for free!

## Step 1: Push to GitHub

1. Install Git from https://git-scm.com/
2. Open PowerShell in the Blacklist folder
3. Run:
```powershell
git init
git add .
git commit -m "Initial commit"
```

4. Create a new repo on https://github.com/new (name it `minecraft-blacklist`)
5. Push your code:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/minecraft-blacklist.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Render

1. Go to https://render.com
2. Click **"Sign up"** (use your GitHub account)
3. After signing in, click **"New +"** → **"Web Service"**
4. Click **"Connect a repository"** and select your `minecraft-blacklist` repo
5. Fill in the form:
   - **Name**: `minecraft-blacklist-api`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Under **Environment**, add:
   - **Key**: `API_KEY`
   - **Value**: `204r8382394`
7. Click **"Create Web Service"**

Wait 2-3 minutes for deployment. You'll get a URL like: `https://minecraft-blacklist-api.onrender.com`

## Step 3: Update Plugin Config

Change your plugin's `config.yml`:

```yaml
api-url: "https://minecraft-blacklist-api.onrender.com"
api-key: "204r8382394"
```

Then rebuild your plugin with:
```bash
gradle build
```

## Done!

Your API will now:
- ✅ Run 24/7 without your computer on
- ✅ Be accessible from any server
- ✅ Store blacklist data in the cloud
- ✅ Auto-restart if it crashes

## Notes

- **Free tier** includes 750 free hours/month (enough for always-on)
- **If you want a custom domain** (like `blacklist.yourdomain.com`), upgrade to Render's paid plan
- **Data is stored on Render's servers**, not your computer
- You can check logs anytime in the Render dashboard

## Troubleshooting

**"Deployment failed"**
- Check that `render.yaml` is in the `api` folder
- Make sure `package.json` exists

**"Can't connect to API"**
- Wait 5 minutes for Render to fully deploy
- Check the URL in `config.yml` matches your Render URL

**Want to update the blacklist?**
- Just push new code to GitHub
- Render will auto-deploy within seconds
