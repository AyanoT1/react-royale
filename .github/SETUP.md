# GitHub Actions Setup Guide

This document explains how to configure the GitHub Actions CI/CD pipeline for this project.

## Overview

The project has two GitHub Actions workflows:

1. **CI (Continuous Integration)** - `.github/workflows/ci.yml`
   - Triggers on pull requests to `main`
   - Runs backend, frontend, and e2e tests with MongoDB

2. **Deploy** - `.github/workflows/deploy.yml`
   - Triggers on push to `main`
   - Deploys application to Google Cloud Run

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### For CI Workflow (Optional)

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `JWT_SECRET` | JWT secret for tests (optional, defaults to test value) | `test_jwt_secret_for_ci` |

### For Deployment Workflow (Required)

| Secret Name | Description | Required | Example Value |
|-------------|-------------|----------|---------------|
| `GCP_PROJECT_ID` | Google Cloud Project ID | ✅ | `my-project-123456` |
| `GCP_REGION` | GCP region for deployment | Optional | `us-central1` (default) |
| `GCP_SA_KEY` | Google Cloud Service Account JSON key | ✅ | `{"type": "service_account"...}` |
| `JWT_SECRET` | JWT secret for authentication | ✅ | `your-production-jwt-secret` |
| `MONGODB_URI` | MongoDB connection URI | ✅ | `mongodb://username:password@host:27017` |
| `MONGODB_DBNAME` | MongoDB database name | Optional | `db` (default) |
| `VITE_BASE_PATH` | Base path for Vite frontend | Optional | `/` (default) |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB root username (if using Cloud Run MongoDB) | Optional | `admin` |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB root password (if using Cloud Run MongoDB) | Optional | `password` |

**Note**: The `FRONTEND_URL` and `CORS_ORIGINS` environment variables are automatically set to the Cloud Run service URL after deployment. You don't need to configure these as secrets - they will be dynamically assigned based on the deployed service's URL (e.g., `https://react-royale-xxxxx-uc.a.run.app`).

## Google Cloud Setup

### 1. Create a Google Cloud Project

```bash
gcloud projects create YOUR_PROJECT_ID
gcloud config set project YOUR_PROJECT_ID
```

### 2. Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 3. Create a Service Account

```bash
# Create service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions Deployer"

# Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

# Generate and download key
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 4. Add Service Account Key to GitHub Secrets

1. Copy the contents of `key.json`
2. Go to your GitHub repository
3. Navigate to `Settings > Secrets and variables > Actions`
4. Click "New repository secret"
5. Name: `GCP_SA_KEY`
6. Value: Paste the entire JSON content
7. Click "Add secret"

**⚠️ Important**: Delete `key.json` from your local machine after adding it to GitHub:
```bash
rm key.json
```

## MongoDB Setup Options

### Option 1: MongoDB Atlas (Recommended for Production)

1. Create a free MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string
3. Add it as `MONGODB_URI` secret (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/`)
4. Set `MONGODB_DBNAME` secret to your database name

### Option 2: Deploy MongoDB on Cloud Run (Not Recommended)

The workflow attempts to deploy MongoDB on Cloud Run, but **this is not recommended for production** because:
- Cloud Run is stateless - data will be lost on restarts
- No persistent storage by default
- Not cost-effective for databases

If you still want to use this option, ensure you have:
- `MONGO_INITDB_ROOT_USERNAME` secret set
- `MONGO_INITDB_ROOT_PASSWORD` secret set
- Consider using Cloud SQL or MongoDB Atlas instead

### Option 3: Google Cloud SQL (Alternative)

For a managed database on GCP:
1. Create a Cloud SQL for PostgreSQL instance (or use MongoDB on GCE)
2. Update your `MONGODB_URI` accordingly
3. Ensure proper VPC/networking configuration

## Testing the Workflows

### Test CI Workflow

1. Create a new branch: `git checkout -b test-ci`
2. Make a small change and commit: `git commit -am "test: CI workflow"`
3. Push and create PR: `git push -u origin test-ci`
4. Open a PR to `main` branch
5. Check the "Actions" tab in GitHub to see the CI workflow running

### Test Deployment Workflow

1. Merge your PR to `main` or push directly to `main`
2. Check the "Actions" tab in GitHub to see the deploy workflow running
3. Once complete, check the deployment summary for the service URL

## Troubleshooting

### CI Workflow Issues

- **MongoDB connection fails**: Check that the MongoDB service is healthy
- **Tests timeout**: Increase timeout values in `playwright.config.ts`
- **Dependencies fail**: Ensure `package-lock.json` files are committed

### Deployment Issues

- **Authentication failed**: Verify `GCP_SA_KEY` is correct JSON format
- **Permission denied**: Check service account has required roles
- **Image push failed**: Ensure Artifact Registry API is enabled
- **Cloud Run deployment failed**: Check logs with `gcloud run logs tail SERVICE_NAME`

### Get Cloud Run Logs

```bash
# View application logs
gcloud run logs tail react-royale --region=YOUR_REGION

# View MongoDB logs (if deployed)
gcloud run logs tail react-royale-mongodb --region=YOUR_REGION
```

## Environment Variables Reference

### Development (.env.example)
```env
PORT=4000
HOST=localhost
JWT_SECRET=my_secret
MONGODB_URI=mongodb://127.0.0.1:27017/dev
MONGODB_DBNAME=dev
TEST_MONGODB_URI=mongodb://127.0.0.1:27017/test
TEST_MONGODB_DBNAME=test
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

### Production (Set by Cloud Run Deployment)
```env
PORT=7137
HOST=0.0.0.0
JWT_SECRET=<your-production-secret>
MONGODB_URI=mongodb://mongodb:27017 (or MongoDB Atlas URI)
MONGODB_DBNAME=db
FRONTEND_URL=<automatically-set-to-cloud-run-url>
CORS_ORIGINS=<automatically-set-to-cloud-run-url>
VITE_BASE_PATH=/
```

**Note**: `FRONTEND_URL` and `CORS_ORIGINS` are automatically configured to use the Cloud Run service URL (e.g., `https://react-royale-xxxxx-uc.a.run.app`) after deployment.

## Additional Resources

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Playwright Documentation](https://playwright.dev/)

## Security Notes

- Never commit `.env` files or secrets to the repository
- Rotate secrets regularly
- Use least-privilege IAM roles
- Enable Cloud Run authentication for production services
- Use MongoDB Atlas with proper network restrictions
- Keep dependencies updated
