gcloud builds submit --tag gcr.io/inlaid-span-491507-b6/google-hackathon-calendar-mcp

gcloud run deploy google-hackathon-calendar-mcp \
  --image gcr.io/inlaid-span-491507-b6/google-hackathon-calendar-mcp \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8787