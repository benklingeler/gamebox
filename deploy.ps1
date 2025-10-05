$PROJECT_ID = "gamebox-474119"
$REGION = "europe-west3"
$SERVICE_NAME = "gamebox"

docker build -t $SERVICE_NAME .
docker tag $SERVICE_NAME "${REGION}-docker.pkg.dev/${PROJECT_ID}/${SERVICE_NAME}/app:latest"
docker push "${REGION}-docker.pkg.dev/${PROJECT_ID}/${SERVICE_NAME}/app:latest"

gcloud run deploy $SERVICE_NAME `
    --image "${REGION}-docker.pkg.dev/${PROJECT_ID}/${SERVICE_NAME}/app:latest" `
    --platform managed `
    --region $REGION `
    --allow-unauthenticated `
    --port 80